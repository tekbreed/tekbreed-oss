/**
 * CLI command handler for creating local repository snapshots.
 *
 * @module snapshot
 */

import { createHash } from "node:crypto";
import type { TekMemoFileSystem } from "../fs/tekmemo-fs";
import type { CliOutput } from "../output/output";
import { printJsonEnvelope } from "../output/output";
import { REQUIRED_FILES, TEKMEMO_PATHS } from "../protocol/constants";
import { stringifyJsonl } from "../protocol/jsonl";
import { createSafeIdFromLabel, validateSnapshotLabel } from "../utils/labels";

/**
 * Options configuration for the snapshot command.
 */
export interface SnapshotCommandOptions {
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
	 * Descriptive label to tag the snapshot with.
	 */
	label: string;
}

/**
 * Structured bundle format storing all tracked database files in a snapshot.
 */
interface SnapshotBundle {
	/**
	 * Unique identifier generated for the snapshot.
	 */
	id: string;
	/**
	 * User-provided label for the snapshot.
	 */
	label: string;
	/**
	 * ISO timestamp of when the snapshot was created.
	 */
	createdAt: string;
	/**
	 * Protocol format version version number.
	 */
	protocolVersion: string;
	/**
	 * Map of file names to their text content.
	 */
	files: Record<string, string>;
	/**
	 * SHA256 integrity checksum.
	 */
	checksum: string;
}

/**
 * Calculates a SHA256 checksum of an object by serializing it to JSON.
 *
 * @param value - Target candidate to checksum.
 * @returns Hex-encoded SHA256 checksum.
 */
function checksum(value: unknown): string {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/**
 * Runs the snapshot command, packing current database files and saving the bundle.
 *
 * @param options - Command configuration options.
 * @returns CLI exit code.
 */
export async function runSnapshotCommand(
	options: SnapshotCommandOptions,
): Promise<number> {
	const label = validateSnapshotLabel(options.label);
	const createdAt = new Date().toISOString();
	const id = createSafeIdFromLabel(label, createdAt);
	const path = `${TEKMEMO_PATHS.snapshotsDir}/${id}.json`;
	const files: Record<string, string> = {};

	for (const filePath of REQUIRED_FILES) {
		const content = await options.fs.readTextIfExists(filePath);
		if (content !== undefined) files[filePath] = content;
	}

	const bundleWithoutChecksum = {
		id,
		label,
		createdAt,
		protocolVersion: "1",
		files,
	};
	const bundle: SnapshotBundle = {
		...bundleWithoutChecksum,
		checksum: checksum(bundleWithoutChecksum),
	};

	await options.fs.writeText(path, `${JSON.stringify(bundle, null, 2)}\n`);

	const record = {
		id,
		path,
		type: "manual",
		status: "available",
		createdAt,
		checksum: bundle.checksum,
		metadata: {
			label,
			fileCount: Object.keys(files).length,
			createdBy: "@tekbreed/tekmemo/cli",
		},
	};

	await options.fs.appendText(
		TEKMEMO_PATHS.snapshots,
		stringifyJsonl([record]),
	);
	await options.fs.appendText(
		TEKMEMO_PATHS.memoryEvents,
		stringifyJsonl([
			{
				id: `evt_${id}`,
				type: "snapshot.created",
				timestamp: createdAt,
				sourcePath: path,
				actor: { type: "system", id: "@tekbreed/tekmemo/cli" },
				summary: `Created snapshot ${label}`,
				metadata: { snapshotId: id, label, checksum: bundle.checksum },
			},
		]),
	);

	const data = {
		id,
		label,
		path,
		createdAt,
		checksum: bundle.checksum,
		fileCount: Object.keys(files).length,
	};
	if (options.json) printJsonEnvelope(options.output, "snapshot", data);
	else options.output.success(`Created snapshot "${label}" at ${path}`);
	return 0;
}
