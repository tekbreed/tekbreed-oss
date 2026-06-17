/**
 * Cloudflare Worker entrypoint for TekMemo MCP over Streamable HTTP.
 *
 * The reusable protocol and transport behavior lives in
 * @tekbreed/tekmemo-mcp-server/http; this app only wires routing and Worker env.
 */

import { handleTekMemoMcpRequest } from "@tekbreed/tekmemo-mcp-server/http";

/**
 * Environment bindings expected by the TekMemo MCP Worker.
 */
export interface Env {
	[key: string]: string | undefined;
	TEKMEMO_API_KEY?: string;
	TEKMEMO_API_URL?: string;
	TEKMEMO_CLOUD_URL?: string;
	TEKMEMO_CLOUD_TIMEOUT_MS?: string;
	TEKMEMO_MCP_BEARER_TOKEN?: string;
	TEKMEMO_MCP_READ_ONLY?: string;
	TEKMEMO_MCP_TOKEN?: string;
	TEKMEMO_PROJECT_ID?: string;
	TEKMEMO_WORKSPACE_ID?: string;
}

/**
 * Worker fetch handler.
 *
 * @param request - Incoming HTTP request.
 * @param env - Worker environment bindings.
 * @returns HTTP response.
 */
async function fetch(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	if (url.pathname === "/mcp") {
		return handleTekMemoMcpRequest(request, {
			env,
			allowedOrigins: allowedOrigins(env),
		});
	}

	if (url.pathname === "/" || url.pathname === "/health") {
		return Response.json({
			ok: true,
			name: "tekmemo-mcp-worker",
			mcp: "/mcp",
		});
	}

	return Response.json({ error: "Not found." }, { status: 404 });
}

/**
 * Reads comma-separated browser origins from the Worker environment.
 *
 * @param env - Worker environment bindings.
 * @returns Allowlist for Origin validation, or undefined for non-browser clients.
 */
function allowedOrigins(env: Env): string[] | undefined {
	const raw = env.TEKMEMO_MCP_ALLOWED_ORIGINS;
	if (!raw) return undefined;
	return raw
		.split(",")
		.map((origin) => origin.trim())
		.filter((origin) => origin.length > 0);
}

export default { fetch };
