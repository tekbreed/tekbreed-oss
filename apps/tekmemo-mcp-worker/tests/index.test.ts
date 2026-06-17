import { describe, expect, it } from "vitest";
import worker, { type Env } from "../src/index";

const env: Env = {
	TEKMEMO_API_KEY: "cloud-key",
	TEKMEMO_CLOUD_URL: "https://memo.example.com/api/v1",
	TEKMEMO_MCP_BEARER_TOKEN: "mcp-token",
};

/**
 * Creates a Worker MCP request.
 *
 * @param body - JSON-RPC payload.
 * @returns Fetch Request object.
 */
function mcpRequest(body: unknown): Request {
	return new Request("https://worker.example.com/mcp", {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			Accept: "application/json, text/event-stream",
			Authorization: "Bearer mcp-token",
			"Content-Type": "application/json",
		},
	});
}

describe("TekMemo MCP Worker", () => {
	it("serves health metadata", async () => {
		const response = await worker.fetch(
			new Request("https://worker.example.com/"),
			env,
		);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toMatchObject({
			ok: true,
			mcp: "/mcp",
		});
	});

	it("routes MCP notifications to the HTTP adapter", async () => {
		const response = await worker.fetch(
			mcpRequest({
				jsonrpc: "2.0",
				method: "notifications/initialized",
				params: {},
			}),
			env,
		);

		expect(response.status).toBe(202);
	});

	it("returns 404 outside supported routes", async () => {
		const response = await worker.fetch(
			new Request("https://worker.example.com/nope"),
			env,
		);

		expect(response.status).toBe(404);
	});
});
