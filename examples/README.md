# TekMemo examples

These examples show the supported integration paths for TekMemo OSS packages.
They are intentionally small, beginner-readable, and aligned with the public package boundaries.

## Choose an example

| Folder | Use when you want to... | Main package |
| --- | --- | --- |
| `local-only` | create and read `.tekmemo/` files locally | `@tekbreed/tekmemo`, `@tekbreed/tekmemo-fs` |
| `graph-memory` | store/query local graph memory | `@tekbreed/tekmemo-graph` |
| `cloud-client` | call TekMemo Cloud from backend code | `@tekbreed/tekmemo-cloud-client` |
| `cli` | call the CLI programmatically or from shell scripts | `@tekbreed/tekmemo-cli` |
| `mcp` | expose TekMemo to MCP-compatible coding agents | `@tekbreed/tekmemo-mcp-server` |
| `ai-sdk` | add TekMemo memory as an AI SDK tool | `@tekbreed/tekmemo-ai-sdk` |
| `nextjs` | call TekMemo from a Next.js route handler | `@tekbreed/tekmemo-cloud-client` |
| `react-router` | call TekMemo from a React Router loader/action | `@tekbreed/tekmemo-cloud-client` |
| `express` | add memory context to an Express API | `@tekbreed/tekmemo-cloud-client` |
| `hono` | use TekMemo in Hono/edge-style apps | `@tekbreed/tekmemo-cloud-client` |
| `cloudflare-workers` | use TekMemo in a Worker fetch handler | `@tekbreed/tekmemo-cloud-client` |
| `node-http` | call TekMemo from plain Node HTTP | `@tekbreed/tekmemo-cloud-client` |
| `fastify` | add a Fastify context endpoint | `@tekbreed/tekmemo-cloud-client` |
| `nestjs` | wrap TekMemo as an injectable service | `@tekbreed/tekmemo-cloud-client` |
| `astro` | call TekMemo from an Astro endpoint | `@tekbreed/tekmemo-cloud-client` |
| `sveltekit` | call TekMemo from a SvelteKit server load | `@tekbreed/tekmemo-cloud-client` |
| `nuxt` | call TekMemo from a Nuxt server route | `@tekbreed/tekmemo-cloud-client` |
| `tanstack` | keep TekMemo calls in server functions/loaders | `@tekbreed/tekmemo-cloud-client` |
| `vite-react` | protect browser apps from leaking API keys | `@tekbreed/tekmemo-cloud-client` |

## Validate examples

```bash
node examples/scripts/check-examples.mjs
pnpm examples:check
```

`check-examples.mjs` performs static workspace checks. `pnpm examples:check` runs TypeScript checks once dependencies are installed.

## Cloud environment

Copy `.env.example` into the example you want to run, or export the variables in your shell.

```bash
export TEKMEMO_CLOUD_URL="https://memo.tekbreed.com/api/v1"
export TEKMEMO_API_KEY="tk_live_replace_me"
export TEKMEMO_PROJECT_ID="proj_123"
export TEKMEMO_WORKSPACE_ID="ws_123"
```

`TEKMEMO_API_KEY` must stay server-side. Do not expose it through client bundles, public runtime config, or browser JavaScript.
