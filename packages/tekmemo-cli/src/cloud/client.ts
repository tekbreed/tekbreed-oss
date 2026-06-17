/**
 * Cloud client wrappers and option normalization helpers for the TekMemo CLI.
 *
 * @module cloud/client
 */

import {
	createTekMemoCloudClient,
	redactSecrets,
	type TekMemoCloudClient,
	type TekMemoCloudClientOptions,
	TekMemoCloudError,
} from "@tekbreed/tekmemo";
import { CliUsageError } from "../errors/cli-errors";

/**
 * Options for configuring a connection to the TekMemo Cloud service.
 */
export interface CloudConnectionOptions {
	/**
	 * Explicit TekMemo Cloud URL to use. If not specified, environment variables are used.
	 */
	cloudUrl?: string | undefined;
	/**
	 * API key for authentication with the TekMemo Cloud.
	 */
	apiKey?: string | undefined;
	/**
	 * Target Workspace ID for cloud operations.
	 */
	workspaceId?: string | undefined;
	/**
	 * Target Project ID for cloud operations.
	 */
	projectId?: string | undefined;
	/**
	 * Request timeout in milliseconds or as a string representation of an integer.
	 */
	timeoutMs?: number | string | undefined;
	/**
	 * If true, allows the API key to be missing without throwing an error.
	 */
	allowMissingApiKey?: boolean | undefined;
	/**
	 * If true, allows the Project ID to be missing without throwing an error.
	 */
	allowMissingProjectId?: boolean | undefined;
}

/**
 * Normalized cloud connection options with defaults and environment variables resolved.
 */
export interface NormalizedCloudConnectionOptions {
	/**
	 * Resolved base URL for the TekMemo Cloud API.
	 */
	baseUrl: string;
	/**
	 * Resolved API key.
	 */
	apiKey?: string | undefined;
	/**
	 * Resolved Workspace ID.
	 */
	workspaceId?: string | undefined;
	/**
	 * Resolved Project ID.
	 */
	projectId?: string | undefined;
	/**
	 * Resolved request timeout in milliseconds.
	 */
	timeoutMs?: number | undefined;
}

/**
 * Creates an instance of the TekMemo Cloud client using the provided connection options.
 *
 * @param options - Input connection options.
 * @returns A configured TekMemoCloudClient instance.
 * @throws {CliUsageError} If required options (like URL or API key) are missing or invalid.
 */
export function createCliCloudClient(
	options: CloudConnectionOptions = {},
): TekMemoCloudClient {
	return createTekMemoCloudClient(toCloudClientOptions(options));
}

/**
 * Converts CLI cloud connection options into options required by the core TekMemo Cloud client.
 *
 * @param options - Input connection options.
 * @returns The converted options for the TekMemoCloudClient.
 * @throws {CliUsageError} If required options are missing or invalid.
 */
export function toCloudClientOptions(
	options: CloudConnectionOptions = {},
): TekMemoCloudClientOptions {
	const normalized = normalizeCloudConnectionOptions(options);
	return {
		baseUrl: normalized.baseUrl,
		...(normalized.apiKey !== undefined ? { apiKey: normalized.apiKey } : {}),
		...(normalized.projectId !== undefined
			? { defaultProjectId: normalized.projectId }
			: {}),
		...(normalized.workspaceId !== undefined
			? { defaultWorkspaceId: normalized.workspaceId }
			: {}),
		...(normalized.timeoutMs !== undefined
			? { timeoutMs: normalized.timeoutMs }
			: {}),
		userAgent: "@tekbreed/tekmemo/cli",
		requireApiKey: !options.allowMissingApiKey,
	};
}

/**
 * Normalizes connection options by checking input arguments and environment fallback values.
 *
 * @param options - Connection options to normalize.
 * @returns The normalized connection configuration.
 * @throws {CliUsageError} If required configuration parameters are missing or if the timeout value is invalid.
 */
export function normalizeCloudConnectionOptions(
	options: CloudConnectionOptions = {},
): NormalizedCloudConnectionOptions {
	const baseUrl = firstNonEmpty(
		options.cloudUrl,
		process.env.TEKMEMO_CLOUD_URL,
		process.env.TEKMEMO_API_URL,
	);
	if (!baseUrl) {
		throw new CliUsageError(
			"TekMemo Cloud URL is required. Pass --cloud-url or set TEKMEMO_CLOUD_URL.",
		);
	}

	const apiKey = firstNonEmpty(options.apiKey, process.env.TEKMEMO_API_KEY);
	if (!apiKey && !options.allowMissingApiKey) {
		throw new CliUsageError(
			"TekMemo Cloud API key is required. Pass --api-key or set TEKMEMO_API_KEY.",
		);
	}

	const workspaceId = firstNonEmpty(
		options.workspaceId,
		process.env.TEKMEMO_WORKSPACE_ID,
	);
	const projectId = firstNonEmpty(
		options.projectId,
		process.env.TEKMEMO_PROJECT_ID,
	);
	if (!projectId && !options.allowMissingProjectId) {
		throw new CliUsageError(
			"TekMemo Cloud project ID is required. Pass --project-id or set TEKMEMO_PROJECT_ID.",
		);
	}
	const timeoutMs = normalizeTimeoutMs(options.timeoutMs);

	return {
		baseUrl,
		...(apiKey !== undefined ? { apiKey } : {}),
		...(workspaceId !== undefined ? { workspaceId } : {}),
		...(projectId !== undefined ? { projectId } : {}),
		...(timeoutMs !== undefined ? { timeoutMs } : {}),
	};
}

/**
 * Formats a cloud-related error into a readable diagnostic string.
 * Special properties like HTTP status code, request ID, error code, and retry delays are appended if present.
 *
 * @param error - The error object to format.
 * @returns A formatted description string of the error.
 */
export function formatCloudError(error: unknown): string {
	if (error instanceof TekMemoCloudError) {
		const parts = [error.message];
		if (error.status !== undefined) parts.push(`status=${error.status}`);
		if (error.code) parts.push(`code=${error.code}`);
		if (error.requestId) parts.push(`requestId=${error.requestId}`);
		if (error.retryAfterMs !== undefined)
			parts.push(`retryAfterMs=${error.retryAfterMs}`);
		return parts.join(" ");
	}
	return error instanceof Error ? error.message : String(error);
}

/**
 * Summarizes the normalized cloud options for output, redacting secrets like the API key.
 *
 * @param options - Normalized cloud connection options.
 * @returns An object summarizing the configuration settings safe for logging or printing.
 */
export function cloudConnectionSummary(
	options: NormalizedCloudConnectionOptions,
): Record<string, unknown> {
	return {
		baseUrl: options.baseUrl,
		apiKey: options.apiKey
			? redactSecrets(options.apiKey, [options.apiKey])
			: null,
		workspaceId: options.workspaceId ?? null,
		projectId: options.projectId ?? null,
		timeoutMs: options.timeoutMs ?? null,
	};
}

/**
 * Resolves the first non-empty (non-whitespace-only) string from a list of candidates.
 *
 * @param values - Variadic list of candidate strings.
 * @returns The first non-empty string, or undefined if none are found.
 */
function firstNonEmpty(
	...values: Array<string | undefined>
): string | undefined {
	for (const value of values) {
		const trimmed = value?.trim();
		if (trimmed) return trimmed;
	}
	return undefined;
}

/**
 * Parses and validates a timeout value, returning it as a number of milliseconds.
 *
 * @param value - The input timeout value (number, string, or undefined).
 * @returns The parsed timeout value in milliseconds, or undefined if no value was provided.
 * @throws {CliUsageError} If the timeout value is specified but is not a positive integer.
 */
function normalizeTimeoutMs(
	value: number | string | undefined,
): number | undefined {
	if (value === undefined) return undefined;
	if (typeof value === "number") {
		if (!Number.isInteger(value) || value < 1) {
			throw new CliUsageError(
				"timeout must be a positive integer in milliseconds.",
			);
		}
		return value;
	}
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < 1) {
		throw new CliUsageError(
			"timeout must be a positive integer in milliseconds.",
		);
	}
	return parsed;
}
