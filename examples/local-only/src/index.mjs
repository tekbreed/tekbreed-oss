import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createNodeFsMemoryStore } from "@tekmemo/fs";
import {
	bootstrapMemoryStore,
	CORE_MEMORY_PATH,
	NOTES_MEMORY_PATH,
	writeCoreMemory,
} from "tekmemo";

const rootDir = await mkdtemp(join(tmpdir(), "tekmemo-local-only-"));

try {
	const store = createNodeFsMemoryStore({ rootDir });

	await bootstrapMemoryStore(store);
	await writeCoreMemory(
		store,
		[
			"# Core Memory",
			"",
			"TekMemo keeps local AI memory inspectable and portable.",
			"",
			"- The local-only example writes memory to a temporary `.tekmemo/` workspace.",
		].join("\n"),
	);
	await store.append(
		NOTES_MEMORY_PATH,
		"\n## Launch note\n\nLocal memory can be read back as plain files.\n",
	);

	const coreMemory = await store.read(CORE_MEMORY_PATH);
	const notesMemory = await readFile(join(rootDir, NOTES_MEMORY_PATH), "utf8");

	console.log("TekMemo local-only example");
	console.log(`Workspace: ${rootDir}`);
	console.log(
		`Core memory includes local-first note: ${String(coreMemory.includes("local AI memory"))}`,
	);
	console.log(
		`Notes include launch note: ${String(notesMemory.includes("Launch note"))}`,
	);
} finally {
	await rm(rootDir, { recursive: true, force: true });
}
