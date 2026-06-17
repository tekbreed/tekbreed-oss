/**
 * CLI command handler for performing text or regex searches across local memory files.
 *
 * @module search
 */

import type { TekMemoFileSystem } from "../fs/tekmemo-fs";
import type { CliOutput } from "../output/output";
import { TEKMEMO_PATHS } from "../protocol/constants";

/**
 * Options configuration for the search command.
 */
export interface SearchCommandOptions {
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
	 * The text query or regex pattern to search for.
	 */
	query: string;
	/**
	 * If true, treats the query string as a regular expression.
	 */
	regex?: boolean | undefined;
}

/**
 * Represents a matched line with details on line number and parent file path.
 */
interface SearchMatch {
	/**
	 * The workspace-relative path of the matching file.
	 */
	file: string;
	/**
	 * The 1-based line number of the match.
	 */
	line: number;
	/**
	 * The trimmed text content of the matching line.
	 */
	content: string;
}

/**
 * Runs the search command, searching local memory database files for a pattern.
 *
 * @param options - Command configuration options.
 * @returns CLI exit code.
 */
export async function runSearchCommand(
	options: SearchCommandOptions,
): Promise<number> {
	const matches: SearchMatch[] = [];

	const filesToSearch = [
		TEKMEMO_PATHS.coreMemory,
		TEKMEMO_PATHS.notesMemory,
		TEKMEMO_PATHS.conversations,
	];

	let matcher: (line: string) => boolean;

	if (options.regex) {
		let pattern: RegExp;
		try {
			pattern = new RegExp(options.query, "i");
		} catch {
			options.output.error(`Invalid regular expression: ${options.query}`);
			return 1;
		}
		matcher = (line) => pattern.test(line);
	} else {
		const query = options.query.toLowerCase();
		matcher = (line) => line.toLowerCase().includes(query);
	}

	for (const file of filesToSearch) {
		const content = await options.fs.readTextIfExists(file);
		if (!content) continue;

		const lines = content.split(/\r?\n/);
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line !== undefined && matcher(line)) {
				matches.push({
					file,
					line: i + 1,
					content: line.trim(),
				});
			}
		}
	}

	if (options.json) {
		options.output.write(
			JSON.stringify({ query: options.query, matches }, null, 2),
		);
		return 0;
	}

	if (matches.length === 0) {
		options.output.write(`No matches found for "${options.query}".`);
		return 0;
	}

	for (const match of matches) {
		options.output.write(`${match.file}:${match.line}: ${match.content}`);
	}
	options.output.success(`Found ${matches.length} match(es).`);

	return 0;
}
