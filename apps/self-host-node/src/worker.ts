import { createNodeRuntime } from "./runtime.js";

const runtime = await createNodeRuntime();
if (!runtime.queue) {
	console.log("TEKMEMO_QUEUE=none; worker has nothing to process.");
	process.exit(0);
}

const controller = new AbortController();
process.once("SIGINT", () => controller.abort());
process.once("SIGTERM", () => controller.abort());

console.log(`TekMemo worker started with queue=${runtime.queue.kind}`);
await runtime.queue.process<{ projectId: string }>(
	"recall.index",
	async (job) => {
		const result = await runtime.store.index({
			projectId: job.payload.projectId,
		});
		console.log(
			`Processed recall.index job=${job.id} project=${job.payload.projectId} indexed=${result.indexed}`,
		);
	},
	{ signal: controller.signal },
);

await runtime.store.close();
if (runtime.queue && "close" in runtime.queue) await runtime.queue.close();
