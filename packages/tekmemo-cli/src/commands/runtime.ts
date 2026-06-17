/**
 * CLI command handlers for routing actions based on the active runtime configuration (local, cloud, or hybrid).
 *
 * @module runtime
 */

import type {
	ResolvedCliRuntimeConfig,
	TekMemoReadPolicy,
	TekMemoWritePolicy,
} from "../config";
import type { TekMemoFileSystem } from "../fs/tekmemo-fs";
import {
	type CliOutput,
	createBufferedOutput,
	printJsonEnvelope,
} from "../output/output";
import {
	runCloudContextCommand,
	runCloudReadCommand,
	runCloudRememberCommand,
	runCloudSnapshotCommand,
	runCloudValidateCommand,
} from "./cloud";
import { runContextCommand } from "./context";
import { runReadCommand } from "./read";
import { runRememberCommand } from "./remember";
import { runSnapshotCommand } from "./snapshot";
import { runValidateCommand } from "./validate";

/**
 * Base options for all runtime-routed commands.
 */
export interface RuntimeCommandBaseOptions {
	/**
	 * The TekMemo filesystem wrapper.
	 */
	fs: TekMemoFileSystem;
	/**
	 * The CLI output console wrapper.
	 */
	output: CliOutput;
	/**
	 * If true, outputs results in structured JSON format.
	 */
	json?: boolean | undefined;
	/**
	 * Prefetched stdin content, if available.
	 */
	stdinContent?: string | undefined;
	/**
	 * The resolved CLI runtime configuration.
	 */
	config: ResolvedCliRuntimeConfig;
}

/**
 * Options for the runtime-routed context command.
 */
export interface RuntimeContextCommandOptions
	extends RuntimeCommandBaseOptions {
	/**
	 * Optional text query to filter matching memory files.
	 */
	query?: string | undefined;
	/**
	 * Maximum characters allowed in the formatted context output.
	 */
	maxChars?: number | string | undefined;
	/**
	 * If true, lists recent memory events.
	 */
	includeEvents?: boolean | undefined;
	/**
	 * If true, lists recent memory chunk index records.
	 */
	includeChunks?: boolean | undefined;
}

/**
 * Options for the runtime-routed remember command.
 */
export interface RuntimeRememberCommandOptions
	extends RuntimeCommandBaseOptions {
	/**
	 * Inline text content to remember.
	 */
	content?: string | undefined;
	/**
	 * If true, reads content to remember from stdin.
	 */
	stdin?: boolean | undefined;
	/**
	 * Workspace-relative path to a file containing content to remember.
	 */
	file?: string | undefined;
	/**
	 * The type of note: decision, constraint, goal, preference, reference, summary, or note.
	 */
	kind?: string | undefined;
	/**
	 * Optional header title for the note.
	 */
	title?: string | undefined;
	/**
	 * Optional list of tags to associate with the note.
	 */
	tags?: string[] | undefined;
	/**
	 * Confidence score (0 to 1) representing the validity of the fact.
	 */
	confidence?: string | number | undefined;
	/**
	 * Optional source identifier or URI.
	 */
	source?: string | undefined;
	/**
	 * Optional actor descriptor (e.g. user, agent:id).
	 */
	actor?: string | undefined;
	/**
	 * Optional JSON string of metadata key-value pairs.
	 */
	metadata?: string | undefined;
	/**
	 * If true, ignores warnings about potential secrets or API keys.
	 */
	allowSecrets?: boolean | undefined;
}

/**
 * Options for the runtime-routed read command.
 */
export interface RuntimeReadCommandOptions extends RuntimeCommandBaseOptions {
	/**
	 * The memory file to target: 'core', 'notes', or 'manifest'.
	 */
	target: "core" | "notes" | "manifest";
}

/**
 * Options for the runtime-routed validate command.
 */
export interface RuntimeValidateCommandOptions
	extends RuntimeCommandBaseOptions {}

/**
 * Options for the runtime-routed snapshot command.
 */
export interface RuntimeSnapshotCommandOptions
	extends RuntimeCommandBaseOptions {
	/**
	 * Optional descriptive label to tag the snapshot with.
	 */
	label?: string | undefined;
}

/**
 * Routes context command execution to local, cloud, or hybrid handler based on configuration.
 *
 * @param options - Context command options.
 * @returns CLI exit code.
 */
export async function runRuntimeContextCommand(
	options: RuntimeContextCommandOptions,
): Promise<number> {
	if (options.config.runtime === "cloud") {
		return runCloudContextCommand({
			output: options.output,
			json: options.json,
			...options.config.cloud,
			query: options.query ?? "project context",
			maxBytes: options.maxChars,
		});
	}

	if (options.config.runtime === "local") {
		return runContextCommand({
			fs: options.fs,
			output: options.output,
			json: options.json,
			query: options.query,
			maxChars: options.maxChars,
			includeEvents: options.includeEvents,
			includeChunks: options.includeChunks,
		});
	}

	return runHybridContextCommand(options);
}

/**
 * Routes remember command execution to local, cloud, or hybrid handler based on configuration.
 *
 * @param options - Remember command options.
 * @returns CLI exit code.
 */
export async function runRuntimeRememberCommand(
	options: RuntimeRememberCommandOptions,
): Promise<number> {
	if (options.config.runtime === "cloud")
		return runCloudRememberFromRuntime(options);
	if (options.config.runtime === "local")
		return runLocalRememberFromRuntime(options);
	return runWritePolicy(
		options.config.hybrid.writePolicy,
		() => runLocalRememberFromRuntime(options),
		() => runCloudRememberFromRuntime(options),
	);
}

/**
 * Routes read command execution to local, cloud, or hybrid handler based on configuration.
 *
 * @param options - Read command options.
 * @returns CLI exit code.
 */
export async function runRuntimeReadCommand(
	options: RuntimeReadCommandOptions,
): Promise<number> {
	if (options.target === "manifest") return runLocalReadFromRuntime(options);
	if (options.config.runtime === "cloud")
		return runCloudReadFromRuntime(options);
	if (options.config.runtime === "local")
		return runLocalReadFromRuntime(options);
	return runReadPolicy(
		options.config.hybrid.readPolicy,
		() => runLocalReadFromRuntime(options),
		() => runCloudReadFromRuntime(options),
	);
}

/**
 * Routes validation command execution to local, cloud, or hybrid handler based on configuration.
 *
 * @param options - Validate command options.
 * @returns CLI exit code.
 */
export async function runRuntimeValidateCommand(
	options: RuntimeValidateCommandOptions,
): Promise<number> {
	if (options.config.runtime === "cloud")
		return runCloudValidateCommand({
			output: options.output,
			json: options.json,
			...options.config.cloud,
		});
	if (options.config.runtime === "local")
		return runValidateCommand({
			fs: options.fs,
			output: options.output,
			json: options.json,
		});

	const local = createBufferedOutput({ noColor: true });
	const cloud = createBufferedOutput({ noColor: true });
	const localExit = await runValidateCommand({
		fs: options.fs,
		output: local,
		json: options.json,
	});
	const cloudExit = await runCloudValidateCommand({
		output: cloud,
		json: options.json,
		...options.config.cloud,
	}).catch((error: unknown) => {
		cloud.error(error instanceof Error ? error.message : String(error));
		return 1;
	});
	if (options.json) {
		printJsonEnvelope(options.output, "validate", {
			runtime: "hybrid",
			local: {
				exitCode: localExit,
				stdout: local.stdout,
				stderr: local.stderr,
			},
			cloud: {
				exitCode: cloudExit,
				stdout: cloud.stdout,
				stderr: cloud.stderr,
			},
		});
		return localExit === 0 && cloudExit === 0 ? 0 : 1;
	}
	options.output.write(
		[
			"# Local validation",
			...local.stdout,
			"",
			"# Cloud validation",
			...cloud.stdout,
		].join("\n"),
	);
	for (const line of [...local.stderr, ...cloud.stderr])
		options.output.error(line);
	return localExit === 0 && cloudExit === 0 ? 0 : 1;
}

/**
 * Routes snapshot command execution to local, cloud, or hybrid handler based on configuration.
 *
 * @param options - Snapshot command options.
 * @returns CLI exit code.
 */
export async function runRuntimeSnapshotCommand(
	options: RuntimeSnapshotCommandOptions,
): Promise<number> {
	if (options.config.runtime === "cloud")
		return runCloudSnapshotCommand({
			output: options.output,
			json: options.json,
			...options.config.cloud,
			label: options.label,
		});
	if (options.config.runtime === "local")
		return runSnapshotCommand({
			fs: options.fs,
			output: options.output,
			json: options.json,
			label: options.label ?? "manual",
		});
	return runWritePolicy(
		options.config.hybrid.writePolicy,
		() =>
			runSnapshotCommand({
				fs: options.fs,
				output: options.output,
				json: options.json,
				label: options.label ?? "manual",
			}),
		() =>
			runCloudSnapshotCommand({
				output: options.output,
				json: options.json,
				...options.config.cloud,
				label: options.label,
			}),
	);
}

/**
 * Internal helper to aggregate hybrid local and cloud context queries.
 *
 * @param options - Context command options.
 * @returns CLI exit code.
 */
async function runHybridContextCommand(
	options: RuntimeContextCommandOptions,
): Promise<number> {
	const readPolicy = options.config.hybrid.readPolicy;
	if (readPolicy === "local-only") {
		return runContextCommand({
			fs: options.fs,
			output: options.output,
			json: options.json,
			query: options.query,
			maxChars: options.maxChars,
			includeEvents: options.includeEvents,
			includeChunks: options.includeChunks,
		});
	}
	if (readPolicy === "cloud-only") {
		return runCloudContextCommand({
			output: options.output,
			json: options.json,
			...options.config.cloud,
			query: options.query ?? "project context",
			maxBytes: options.maxChars,
		});
	}

	const local = createBufferedOutput({ noColor: true });
	const cloud = createBufferedOutput({ noColor: true });
	const localExit = await runContextCommand({
		fs: options.fs,
		output: local,
		json: false,
		query: options.query,
		maxChars: options.maxChars,
		includeEvents: options.includeEvents,
		includeChunks: options.includeChunks,
	});
	const cloudExit = await runCloudContextCommand({
		output: cloud,
		json: false,
		...options.config.cloud,
		query: options.query ?? "project context",
		maxBytes: options.maxChars,
	}).catch((error: unknown) => {
		cloud.error(error instanceof Error ? error.message : String(error));
		return 1;
	});
	const first =
		readPolicy === "cloud-first"
			? { label: "Cloud", out: cloud, code: cloudExit }
			: { label: "Local", out: local, code: localExit };
	const second =
		readPolicy === "cloud-first"
			? { label: "Local", out: local, code: localExit }
			: { label: "Cloud", out: cloud, code: cloudExit };
	if (options.json) {
		printJsonEnvelope(options.output, "context", {
			runtime: "hybrid",
			readPolicy,
			[first.label.toLowerCase()]: {
				exitCode: first.code,
				stdout: first.out.stdout,
				stderr: first.out.stderr,
			},
			[second.label.toLowerCase()]: {
				exitCode: second.code,
				stdout: second.out.stdout,
				stderr: second.out.stderr,
			},
		});
		return first.code === 0 || second.code === 0 ? 0 : 1;
	}
	options.output.write(
		[
			`# TekMemo Hybrid Context`,
			`Read policy: ${readPolicy}`,
			"",
			`## ${first.label} Context`,
			...first.out.stdout,
			"",
			`## ${second.label} Context`,
			...second.out.stdout,
		].join("\n"),
	);
	for (const line of [...first.out.stderr, ...second.out.stderr])
		options.output.error(line);
	return first.code === 0 || second.code === 0 ? 0 : 1;
}

/**
 * Internal helper to run remember locally from runtime routing.
 *
 * @param options - Remember command options.
 * @returns CLI exit code.
 */
async function runLocalRememberFromRuntime(
	options: RuntimeRememberCommandOptions,
): Promise<number> {
	return runRememberCommand({
		fs: options.fs,
		output: options.output,
		json: options.json,
		content: options.content,
		stdin: options.stdin,
		file: options.file,
		stdinContent: options.stdinContent,
		kind: options.kind,
		title: options.title,
		tags: options.tags,
		confidence: options.confidence,
		source: options.source,
		actor: options.actor,
		metadata: options.metadata,
		allowSecrets: options.allowSecrets,
	});
}

/**
 * Internal helper to run remember in cloud from runtime routing.
 *
 * @param options - Remember command options.
 * @returns CLI exit code.
 */
async function runCloudRememberFromRuntime(
	options: RuntimeRememberCommandOptions,
): Promise<number> {
	return runCloudRememberCommand({
		output: options.output,
		json: options.json,
		rootDir: options.config.root,
		stdinContent: options.stdinContent,
		...options.config.cloud,
		content: options.content,
		stdin: options.stdin,
		file: options.file,
		kind: options.kind,
		title: options.title,
		tags: options.tags,
		confidence: options.confidence,
		source: options.source,
		metadata: options.metadata,
		allowSecrets: options.allowSecrets,
	});
}

/**
 * Internal helper to read locally from runtime routing.
 *
 * @param options - Read command options.
 * @returns CLI exit code.
 */
async function runLocalReadFromRuntime(
	options: RuntimeReadCommandOptions,
): Promise<number> {
	return runReadCommand({
		fs: options.fs,
		output: options.output,
		json: options.json,
		target: options.target,
	});
}

/**
 * Internal helper to read from cloud from runtime routing.
 *
 * @param options - Read command options.
 * @returns CLI exit code.
 * @throws {Error} If attempting to read manifest from cloud.
 */
async function runCloudReadFromRuntime(
	options: RuntimeReadCommandOptions,
): Promise<number> {
	if (options.target === "manifest") {
		throw new Error(
			"Cloud runtime cannot read local manifest. Use --runtime local or read core/notes.",
		);
	}
	return runCloudReadCommand({
		output: options.output,
		json: options.json,
		...options.config.cloud,
		target: options.target,
	});
}

/**
 * Internal helper evaluating read policies for hybrid routing.
 *
 * @param policy - Read policy name.
 * @param local - Local read action callback.
 * @param cloud - Cloud read action callback.
 * @returns CLI exit code.
 */
async function runReadPolicy(
	policy: TekMemoReadPolicy,
	local: () => Promise<number>,
	cloud: () => Promise<number>,
): Promise<number> {
	if (policy === "local-only") return local();
	if (policy === "cloud-only") return cloud();
	if (policy === "cloud-first") {
		const cloudCode = await cloud();
		return cloudCode === 0 ? cloudCode : local();
	}
	const localCode = await local();
	return localCode === 0 ? localCode : cloud();
}

/**
 * Internal helper evaluating write policies for hybrid routing.
 *
 * @param policy - Write policy name.
 * @param local - Local write action callback.
 * @param cloud - Cloud write action callback.
 * @returns CLI exit code.
 */
async function runWritePolicy(
	policy: TekMemoWritePolicy,
	local: () => Promise<number>,
	cloud: () => Promise<number>,
): Promise<number> {
	if (policy === "local-only") return local();
	if (policy === "cloud-only") return cloud();
	if (policy === "cloud-first") {
		const cloudCode = await cloud();
		const localCode = await local();
		return cloudCode === 0 && localCode === 0 ? 0 : 1;
	}
	const localCode = await local();
	const cloudCode = await cloud();
	return localCode === 0 && cloudCode === 0 ? 0 : 1;
}
