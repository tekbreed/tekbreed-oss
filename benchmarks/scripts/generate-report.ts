import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Prints the latest benchmark summary for a mode.
 */
async function main(): Promise<void> {
	const mode = process.argv[2] ?? "smoke";
	const repoRoot = path.resolve(
		path.dirname(fileURLToPath(import.meta.url)),
		"..",
		"..",
	);
	const report = await readFile(
		path.join(repoRoot, "benchmark-results", mode, "summary.md"),
		"utf8",
	);
	console.log(report);
}

await main();
