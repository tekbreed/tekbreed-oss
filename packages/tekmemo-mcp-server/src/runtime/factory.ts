/**
 * MCP Server Runtime instantiation factory.
 * Resolves local configs, environment variables, and constructs local, cloud, or hybrid runtimes.
 *
 * @module factory
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	createTekMemoCloudClient,
	type TekMemoCloudClientOptions,
} from "@tekbreed/tekmemo";
import type { TekMemoMcpRuntime, TekMemoRuntimeMode } from "../types";
import type { TekMemoCloudClientLike } from "./cloud";
import { createCloudTekMemoMcpRuntime } from "./cloud";
import { createHybridTekMemoMcpRuntime } from "./hybrid";
import { createInMemoryTekMemoRuntime } from "./in-memory";
import { createLocalTekMemoMcpRuntime } from "./local";

/**
 * Options for creating an MCP runtime using the factory.
 */
export interface RuntimeFactoryOptions {
	/**
	 * Runtime execution mode. Supports 'local', 'cloud', 'hybrid', or 'memory'.
	 */
	mode?: TekMemoRuntimeMode;
	/**
	 * Root directory of the TekMemo local store (defaults to process.cwd()).
	 */
	rootDir?: string;
	/**
	 * Unique Project identifier.
	 */
	projectId?: string;
	/**
	 * Unique Workspace identifier.
	 */
	workspaceId?: string;
	/**
	 * Pre-instantiated Cloud Client instance.
	 */
	cloudClient?: TekMemoCloudClientLike;
	/**
	 * Nested options for cloud connection properties.
	 */
	cloud?: CloudRuntimeFactoryOptions;
	/**
	 * Policy deciding how read queries are split between local and cloud runtimes.
	 */
	readPolicy?: RuntimeReadPolicy;
	/**
	 * Policy deciding how write actions are split between local and cloud runtimes.
	 */
	writePolicy?: RuntimeWritePolicy;
}

/**
 * Connection and configuration parameters for cloud-scoped runtimes.
 */
export interface CloudRuntimeFactoryOptions {
	/**
	 * Base URL of the TekMemo Cloud service.
	 */
	baseUrl?: string | undefined;
	/**
	 * API Key credential for authorization.
	 */
	apiKey?: string | undefined;
	/**
	 * Target Workspace ID.
	 */
	workspaceId?: string | undefined;
	/**
	 * Target Project ID.
	 */
	projectId?: string | undefined;
	/**
	 * Connection timeout in milliseconds.
	 */
	timeoutMs?: number | undefined;
	/**
	 * HTTP Client User Agent header value.
	 */
	userAgent?: string | undefined;
	/**
	 * Whether an API key must be supplied.
	 */
	requireApiKey?: boolean | undefined;
	/**
	 * Request retry behavior options.
	 */
	retry?: TekMemoCloudClientOptions["retry"] | undefined;
}

/**
 * Allowed read query resolution patterns.
 */
export type RuntimeReadPolicy =
	| "local-first"
	| "cloud-first"
	| "local-only"
	| "cloud-only";

/**
 * Allowed write action resolution patterns.
 */
export type RuntimeWritePolicy =
	| "local-first"
	| "cloud-first"
	| "local-only"
	| "cloud-only";

/**
 * Instantiates a TekMemoMcpRuntime by merging command parameters, file configs, and environment variables.
 *
 * @param options - Factory configuration options.
 * @returns The resolved TekMemoMcpRuntime instance.
 */
export function createTekMemoMcpRuntimeFromConfig(
	options: RuntimeFactoryOptions = {},
): TekMemoMcpRuntime {
	const rootDir = options.rootDir ?? process.env.TEKMEMO_ROOT ?? process.cwd();
	const fileConfig = readLocalConfig(rootDir);
	const mode = options.mode ?? envRuntimeMode() ?? fileConfig.mode ?? "local";
	const projectId =
		options.projectId ?? process.env.TEKMEMO_PROJECT_ID ?? fileConfig.projectId;
	const workspaceId =
		options.workspaceId ??
		process.env.TEKMEMO_WORKSPACE_ID ??
		fileConfig.workspaceId;

	if (mode === "memory") return createInMemoryTekMemoRuntime();

	if (mode === "local") {
		return createLocalTekMemoMcpRuntime({
			rootDir,
			...(projectId === undefined ? {} : { projectId }),
		});
	}

	if (mode === "cloud") {
		return createCloudTekMemoMcpRuntime({
			client:
				options.cloudClient ??
				createCloudClientFromRuntimeOptions(
					mergeCloudOptions(options.cloud, fileConfig.cloud, {
						workspaceId,
						projectId,
					}),
				),
			...(projectId === undefined ? {} : { projectId }),
		});
	}

	if (mode === "hybrid") {
		const local = createLocalTekMemoMcpRuntime({
			rootDir,
			...(projectId === undefined ? {} : { projectId }),
		});
		const cloud = createCloudTekMemoMcpRuntime({
			client:
				options.cloudClient ??
				createCloudClientFromRuntimeOptions(
					mergeCloudOptions(options.cloud, fileConfig.cloud, {
						workspaceId,
						projectId,
					}),
				),
			...(projectId === undefined ? {} : { projectId }),
		});
		return createHybridTekMemoMcpRuntime({
			local,
			cloud,
			readPolicy:
				options.readPolicy ??
				envReadPolicy() ??
				fileConfig.readPolicy ??
				"local-first",
			writePolicy:
				options.writePolicy ??
				envWritePolicy() ??
				fileConfig.writePolicy ??
				"local-first",
		});
	}

	return createLocalTekMemoMcpRuntime({
		rootDir,
		...(projectId === undefined ? {} : { projectId }),
	});
}

/**
 * Instantiates a new TekMemo Cloud client using resolved parameters and environment keys.
 *
 * @param options - Cloud connection configurations.
 * @returns An implementation client compatible with TekMemoCloudClientLike.
 */
export function createCloudClientFromRuntimeOptions(
	options: CloudRuntimeFactoryOptions = {},
): TekMemoCloudClientLike {
	const baseUrl =
		options.baseUrl ??
		process.env.TEKMEMO_CLOUD_URL ??
		process.env.TEKMEMO_API_URL;

	if (!baseUrl) {
		throw new Error(
			"Cloud runtime requires --cloud-url, TEKMEMO_CLOUD_URL, or TEKMEMO_API_URL.",
		);
	}

	const apiKey = options.apiKey ?? process.env.TEKMEMO_API_KEY;
	const timeoutMs =
		options.timeoutMs ?? envPositiveNumber("TEKMEMO_CLOUD_TIMEOUT_MS");
	const workspaceId = options.workspaceId ?? process.env.TEKMEMO_WORKSPACE_ID;
	const projectId = options.projectId ?? process.env.TEKMEMO_PROJECT_ID;

	return createTekMemoCloudClient({
		baseUrl,
		...(apiKey === undefined ? {} : { apiKey }),
		...(timeoutMs === undefined ? {} : { timeoutMs }),
		userAgent: options.userAgent ?? "@tekbreed/tekmemo/mcp/0.1.0",
		...(workspaceId === undefined ? {} : { defaultWorkspaceId: workspaceId }),
		...(projectId === undefined ? {} : { defaultProjectId: projectId }),
		...(options.requireApiKey === undefined
			? {}
			: { requireApiKey: options.requireApiKey }),
		...(options.retry === undefined ? {} : { retry: options.retry }),
	});
}

function mergeCloudOptions(
	first: CloudRuntimeFactoryOptions | undefined,
	second: CloudRuntimeFactoryOptions | undefined,
	scope: { workspaceId?: string | undefined; projectId?: string | undefined },
): CloudRuntimeFactoryOptions {
	return {
		...(second ?? {}),
		...(first ?? {}),
		...(scope.workspaceId === undefined
			? {}
			: { workspaceId: scope.workspaceId }),
		...(scope.projectId === undefined ? {} : { projectId: scope.projectId }),
	};
}

function envRuntimeMode(): TekMemoRuntimeMode | undefined {
	const value = process.env.TEKMEMO_RUNTIME;
	return isRuntimeMode(value) ? value : undefined;
}

function isRuntimeMode(value: unknown): value is TekMemoRuntimeMode {
	return (
		value === "local" ||
		value === "cloud" ||
		value === "hybrid" ||
		value === "memory"
	);
}

function envPositiveNumber(name: string): number | undefined {
	const value = process.env[name];
	if (value === undefined) return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function envReadPolicy(): RuntimeReadPolicy | undefined {
	return isReadPolicy(process.env.TEKMEMO_READ_POLICY)
		? process.env.TEKMEMO_READ_POLICY
		: undefined;
}

function envWritePolicy(): RuntimeWritePolicy | undefined {
	return isWritePolicy(process.env.TEKMEMO_WRITE_POLICY)
		? process.env.TEKMEMO_WRITE_POLICY
		: undefined;
}

function isReadPolicy(value: unknown): value is RuntimeReadPolicy {
	return (
		value === "local-first" ||
		value === "cloud-first" ||
		value === "local-only" ||
		value === "cloud-only"
	);
}

function isWritePolicy(value: unknown): value is RuntimeWritePolicy {
	return isReadPolicy(value);
}

function readLocalConfig(rootDir: string): {
	mode?: TekMemoRuntimeMode;
	projectId?: string;
	workspaceId?: string;
	readPolicy?: RuntimeReadPolicy;
	writePolicy?: RuntimeWritePolicy;
	cloud?: CloudRuntimeFactoryOptions;
} {
	try {
		const path = resolve(rootDir, ".tekmemo", "config.json");
		const parsed = JSON.parse(readFileSync(path, "utf8")) as Record<
			string,
			unknown
		>;
		const mcp = objectValue(parsed.mcp);
		const cloud = objectValue(parsed.cloud);
		const hybrid = objectValue(parsed.hybrid);
		const mode = isRuntimeMode(parsed.runtime)
			? parsed.runtime
			: isRuntimeMode(mcp.runtime)
				? mcp.runtime
				: undefined;
		const projectId =
			stringValue(parsed.projectId) ?? stringValue(cloud.projectId);
		const workspaceId = stringValue(cloud.workspaceId);
		const readPolicy = isReadPolicy(hybrid.readPolicy)
			? hybrid.readPolicy
			: isReadPolicy(mcp.readPolicy)
				? mcp.readPolicy
				: undefined;
		const writePolicy = isWritePolicy(hybrid.writePolicy)
			? hybrid.writePolicy
			: isWritePolicy(mcp.writePolicy)
				? mcp.writePolicy
				: undefined;
		return {
			...(mode === undefined ? {} : { mode }),
			...(projectId === undefined ? {} : { projectId }),
			...(workspaceId === undefined ? {} : { workspaceId }),
			...(readPolicy === undefined ? {} : { readPolicy }),
			...(writePolicy === undefined ? {} : { writePolicy }),
			cloud: {
				...(stringValue(cloud.baseUrl) === undefined
					? {}
					: { baseUrl: stringValue(cloud.baseUrl) }),
				...(workspaceId === undefined ? {} : { workspaceId }),
				...(projectId === undefined ? {} : { projectId }),
			},
		};
	} catch {
		return {};
	}
}

function objectValue(value: unknown): Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function stringValue(value: unknown): string | undefined {
	return typeof value === "string" && value.trim().length > 0
		? value.trim()
		: undefined;
}
