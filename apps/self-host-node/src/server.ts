import { serve } from "@hono/node-server";
import { createNodeRuntime } from "./runtime.js";

const runtime = await createNodeRuntime();
const server = serve({
	fetch: runtime.app.fetch,
	port: runtime.config.port,
});

console.log(
	`TekMemo self-host Node server listening on http://localhost:${runtime.config.port}`,
);
console.log(
	`TekMemo resources: database=postgres queue=${runtime.queue?.kind ?? "none"} objectStore=${runtime.objectStore?.kind ?? "none"}`,
);

const shutdown = async () => {
	console.log("Shutting down TekMemo self-host Node server...");
	server.close();
	await runtime.store.close();
	if (runtime.queue && "close" in runtime.queue) await runtime.queue.close();
	process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
