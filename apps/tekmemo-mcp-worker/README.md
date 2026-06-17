# TekMemo MCP Worker

Cloudflare Worker entrypoint for hosting TekMemo MCP over stateless Streamable HTTP.

## Routes

- `POST /mcp` handles MCP JSON-RPC requests.
- `OPTIONS /mcp` handles CORS preflight.
- `GET /` returns a small health payload.

## Required Secrets

Set these with Wrangler before deploying:

```bash
wrangler secret put TEKMEMO_API_KEY
wrangler secret put TEKMEMO_MCP_BEARER_TOKEN
```

Configure `TEKMEMO_CLOUD_URL`, `TEKMEMO_PROJECT_ID`, and `TEKMEMO_WORKSPACE_ID` as Worker variables or environment-specific Wrangler settings.
