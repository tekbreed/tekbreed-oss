/**
 * Utility functions for resolving command content input from arguments, files, or stdin.
 *
 * @module content
 */

import fs from "node:fs/promises";
import { CliUsageError } from "../errors/cli-errors";
import { resolveInsideRoot } from "../fs/paths";

/**
 * Interface representing content sources for memory inputs.
 */
export interface ResolveContentInput {
	/**
	 * Local root directory path of the store.
	 */
	rootDir: string;
	/**
	 * Optional inline argument content.
	 */
	inline?: string | undefined;
	/**
	 * Optional flag to read from standard input stream.
	 */
	stdin?: boolean | undefined;
	/**
	 * Optional file path relative to rootDir.
	 */
	file?: string | undefined;
	/**
	 * Optional stdin buffer content for non-interactive testing context.
	 */
	stdinContent?: string | undefined;
}

/**
 * Resolves text content from the specified source input.
 * Ensures exactly one source of content is supplied.
 *
 * @param input - Content sources configuration parameters.
 * @returns The resolved trimmed content string.
 * @throws {CliUsageError} If no content sources or multiple content sources are provided, or if validation fails.
 */
export async function resolveCommandContent(
	input: ResolveContentInput,
): Promise<string> {
	const sources = [
		input.inline !== undefined,
		input.stdin === true,
		input.file !== undefined,
	].filter(Boolean).length;

	if (sources === 0) {
		throw new CliUsageError(
			"Provide content as an argument, --stdin, or --file <path>.",
		);
	}
	if (sources > 1) {
		throw new CliUsageError(
			"Use only one content source: argument, --stdin, or --file.",
		);
	}

	let content: string;
	if (input.inline !== undefined) {
		content = input.inline;
	} else if (input.file !== undefined) {
		const path = resolveInsideRoot(input.rootDir, input.file);
		content = await fs.readFile(path, "utf8");
	} else {
		content = input.stdinContent ?? (await readStdin());
	}

	if (content.includes("\0"))
		throw new CliUsageError("Content must not contain null bytes.");
	if (content.trim().length === 0)
		throw new CliUsageError("Content must not be empty.");
	return content.trimEnd();
}

/**
 * Reads all buffer chunks from the standard input stream.
 *
 * @returns Standard input text buffer.
 */
async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
	}
	return Buffer.concat(chunks).toString("utf8");
}
