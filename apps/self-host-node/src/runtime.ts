import { createTekMemoServer } from "@tekbreed/tekmemo-server";
import {
	createNodeTekMemoObjectStore,
	createNodeTekMemoQueue,
	createNodeTekMemoStore,
	readTekMemoNodeRuntimeConfig,
} from "@tekbreed/tekmemo-server/node";

export async function createNodeRuntime() {
	const config = readTekMemoNodeRuntimeConfig();
	const store = createNodeTekMemoStore(config);
	const queue = createNodeTekMemoQueue(config);
	const objectStore = createNodeTekMemoObjectStore(config);

	await store.migrate();
	if (queue && "migrate" in queue) await queue.migrate();
	if (objectStore) await objectStore.isReady();

	const app = createTekMemoServer({
		store,
		queue,
		objectStore,
		apiKeys: config.apiKeys,
		defaultProjectId: config.defaultProjectId,
		version: process.env.npm_package_version,
		requireApiKey: config.apiKeys.length > 0,
	});

	return { app, config, store, queue, objectStore };
}
