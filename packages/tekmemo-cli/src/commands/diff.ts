/**
 * CLI command handler for diffing two snapshots.
 *
 * @module diff
 */

import { createHash } from "node:crypto";
import type { TekMemoFileSystem } from "../fs/tekmemo-fs";
import type { CliOutput } from "../output/output";
import { printJsonEnvelope } from "../output/output";
import { TEKMEMO_PATHS } from "../protocol/constants";
import { parseJsonl } from "../protocol/jsonl";

/**
 * Options configuration for the diff command.
 */
export interface DiffCommandOptions {
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
	 * The unique ID or label of the first snapshot (A).
	 */
	labelA: string;
	/**
	 * The unique ID or label of the second snapshot (B).
	 */
	labelB: string;
}

/**
 * Represents the structured content of a snapshot bundle file.
 */
interface SnapshotBundle {
	/**
	 * Unique identifier of the snapshot.
	 */
	id: string;
	/**
	 * Optional descriptive label.
	 */
	label?: string;
	/**
	 * Optional legacy timestamp representation.
	 */
	timestamp?: string;
	/**
	 * ISO timestamp of snapshot creation.
	 */
	createdAt?: string;
	/**
	 * Map of relative file paths to their raw string content.
	 */
	files: Record<string, string>;
	/**
	 * MD5 or SHA256 checksum of the bundle content.
	 */
	checksum: string;
}

/**
 * Represents a calculated difference for a single file.
 */
interface FileDiff {
	/**
	 * Workspace-relative path to the file.
	 */
	path: string;
	/**
	 * Difference status: added, removed, changed, or unchanged.
	 */
	status: "added" | "removed" | "changed" | "unchanged";
	/**
	 * File size in snapshot A, if applicable.
	 */
	bytesA?: number;
	/**
	 * File size in snapshot B, if applicable.
	 */
	bytesB?: number;
	/**
	 * Non-empty line count or JSONL record count in snapshot A.
	 */
	recordsA?: number;
	/**
	 * Non-empty line count or JSONL record count in snapshot B.
	 */
	recordsB?: number;
}

/**
 * Counts the number of non-empty lines in a block of text.
 *
 * @param content - Target string content.
 * @returns Non-empty line count.
 */
function lineCount(content: string): number {
	return content.split(/\r?\n/).filter(Boolean).length;
}

/**
 * Generates a SHA256 hash of a string.
 *
 * @param content - Target string content.
 * @returns Hex-encoded SHA256 hash.
 */
function contentHash(content: string): string {
	return createHash("sha256").update(content).digest("hex");
}

/**
 * Loads and parses a snapshot bundle file from the filesystem.
 *
 * @param fs - The TekMemo filesystem wrapper.
 * @param path - Absolute or relative path to the snapshot bundle.
 * @returns Parsed SnapshotBundle.
 * @throws {Error} If the bundle is malformed.
 */
async function loadBundle(
	fs: TekMemoFileSystem,
	path: string,
): Promise<SnapshotBundle> {
	const raw = await fs.readText(path);
	const parsed = JSON.parse(raw) as SnapshotBundle;
	if (
		typeof parsed !== "object" ||
		parsed === null ||
		typeof parsed.files !== "object"
	) {
		throw new Error("Snapshot bundle is malformed.");
	}
	return parsed;
}

/**
 * Checks if a snapshot index record matches a lookup key (ID or label).
 *
 * @param record - Snapshot entry record from index.
 * @param key - Lookup identifier or label.
 * @returns True if matched, false otherwise.
 */
function snapshotMatches(
	record: Record<string, unknown>,
	key: string,
): boolean {
	if (record.id === key) return true;
	if (record.label === key) return true;
	const metadata = record.metadata;
	if (
		typeof metadata === "object" &&
		metadata !== null &&
		!Array.isArray(metadata)
	) {
		return (metadata as Record<string, unknown>).label === key;
	}
	return false;
}

/**
 * Runs the diff command, comparing two snapshot states.
 *
 * @param options - Command configuration options.
 * @returns CLI exit code.
 */
export async function runDiffCommand(
	options: DiffCommandOptions,
): Promise<number> {
	const snapshotContent = await options.fs.readTextIfExists(
		TEKMEMO_PATHS.snapshots,
	);
	if (!snapshotContent) {
		options.output.error("No snapshots found.");
		return 1;
	}

	const snapshots = parseJsonl(snapshotContent);
	const snapA = snapshots.find((s) => snapshotMatches(s.value, options.labelA));
	const snapB = snapshots.find((s) => snapshotMatches(s.value, options.labelB));

	if (!snapA) {
		options.output.error(`Snapshot "${options.labelA}" not found.`);
		return 1;
	}
	if (!snapB) {
		options.output.error(`Snapshot "${options.labelB}" not found.`);
		return 1;
	}

	const pathA = snapA.value.path;
	const pathB = snapB.value.path;
	if (typeof pathA !== "string" || typeof pathB !== "string") {
		options.output.error("Snapshot index contains a malformed path.");
		return 1;
	}

	let bundleA: SnapshotBundle;
	let bundleB: SnapshotBundle;
	try {
		bundleA = await loadBundle(options.fs, pathA);
	} catch {
		options.output.error(`Failed to load snapshot bundle: ${pathA}`);
		return 1;
	}
	try {
		bundleB = await loadBundle(options.fs, pathB);
	} catch {
		options.output.error(`Failed to load snapshot bundle: ${pathB}`);
		return 1;
	}

	const allPaths = new Set([
		...Object.keys(bundleA.files),
		...Object.keys(bundleB.files),
	]);
	const diffs: FileDiff[] = [];

	for (const filePath of allPaths) {
		const contentA = bundleA.files[filePath];
		const contentB = bundleB.files[filePath];
		if (contentA === undefined && contentB !== undefined) {
			diffs.push({
				path: filePath,
				status: "added",
				bytesB: Buffer.byteLength(contentB),
			});
		} else if (contentA !== undefined && contentB === undefined) {
			diffs.push({
				path: filePath,
				status: "removed",
				bytesA: Buffer.byteLength(contentA),
			});
		} else if (contentA !== undefined && contentB !== undefined) {
			if (contentHash(contentA) === contentHash(contentB)) {
				diffs.push({
					path: filePath,
					status: "unchanged",
					bytesA: Buffer.byteLength(contentA),
					bytesB: Buffer.byteLength(contentB),
				});
			} else {
				const isJsonl = filePath.endsWith(".jsonl");
				diffs.push({
					path: filePath,
					status: "changed",
					bytesA: Buffer.byteLength(contentA),
					bytesB: Buffer.byteLength(contentB),
					...(isJsonl
						? { recordsA: lineCount(contentA), recordsB: lineCount(contentB) }
						: {}),
				});
			}
		}
	}

	const changed = diffs.filter((d) => d.status !== "unchanged");
	const data = {
		labelA: options.labelA,
		labelB: options.labelB,
		snapshotA: {
			id: bundleA.id,
			createdAt: bundleA.createdAt ?? bundleA.timestamp,
			path: pathA,
		},
		snapshotB: {
			id: bundleB.id,
			createdAt: bundleB.createdAt ?? bundleB.timestamp,
			path: pathB,
		},
		totalFiles: allPaths.size,
		changedFiles: changed.length,
		diffs: changed,
	};

	if (options.json) {
		printJsonEnvelope(options.output, "diff", data);
		return 0;
	}

	options.output.write(`Comparing "${options.labelA}" vs "${options.labelB}"`);
	options.output.write(
		`  [A] ${data.snapshotA.createdAt ?? "unknown"}  [B] ${data.snapshotB.createdAt ?? "unknown"}`,
	);
	options.output.write("");
	if (changed.length === 0) {
		options.output.success("No differences found. Snapshots are identical.");
		return 0;
	}

	const statusLabel: Record<string, string> = {
		added: "+",
		removed: "-",
		changed: "~",
	};
	for (const diff of changed) {
		const icon = statusLabel[diff.status] ?? "?";
		let line = `  ${icon} ${diff.path}`;
		if (diff.status === "changed") {
			const sizeInfo = `${diff.bytesA}B → ${diff.bytesB}B`;
			const recordInfo =
				diff.recordsA !== undefined && diff.recordsB !== undefined
					? ` (${diff.recordsA} → ${diff.recordsB} records)`
					: "";
			line += `  ${sizeInfo}${recordInfo}`;
		} else if (diff.status === "added" && diff.bytesB !== undefined)
			line += `  (${diff.bytesB}B)`;
		else if (diff.status === "removed" && diff.bytesA !== undefined)
			line += `  (${diff.bytesA}B)`;
		options.output.write(line);
	}
	options.output.write(
		`\n${changed.length} file(s) changed out of ${allPaths.size} total.`,
	);
	return 0;
}
