import {
	createNodeTekMemoQueue,
	createNodeTekMemoStore,
	readTekMemoNodeRuntimeConfig,
} from "@tekbreed/tekmemo-server/node";

const config = readTekMemoNodeRuntimeConfig();
const store = createNodeTekMemoStore(config);
const queue = createNodeTekMemoQueue(config);

await store.migrate();
if (queue && "migrate" in queue) await queue.migrate();

await store.close();
if (queue && "close" in queue) await queue.close();
console.log("TekMemo self-host migrations completed.");
