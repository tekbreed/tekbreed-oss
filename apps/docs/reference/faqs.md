# Frequently asked questions

## What is TekMemo?

TekMemo is a **layered memory runtime for AI agents and applications**. It gives LLMs durable, project-scoped context so they stay accurate and consistent across sessions — instead of relying solely on ephemeral context windows.

## How is memory organized?

TekMemo uses four memory layers:

| Layer | File | Purpose |
| --- | --- | --- |
| **Core** | `core.md` | Stable project briefing — facts the agent must know every time |
| **Notes** | `notes.md` | Durable records: decisions, constraints, summaries |
| **Recall** | `conversations.jsonl` | Indexed fragments for semantic retrieval |
| **Graph** | Runtime | Entities and relationships for architectural queries |

See [Core concepts](/guide/concepts) for details.

## Why file-first?

Memory is stored as plain text and JSON files in your project's `.tekmemo/` directory. This means:

- It works without any cloud setup.
- It can be version-controlled alongside your code.
- It is easy to inspect during code review.
- Agents get durable context without a hosted dashboard.
- Nothing is hidden inside opaque model prompts.

See [File-first memory](/guide/file-first-memory) for the rationale.

## When should I use cloud instead of local-only?

Use TekMemo Cloud when you need:

- Hosted sync across machines or team members
- API keys and authentication
- Hosted recall with vector search and reranking
- Graph API endpoints
- Team access and dashboard observability
- Connector data integrations

Local-only memory is fine for single-developer projects, CI, or when you want everything on-disk.

## What is the hybrid runtime?

Hybrid mode writes memory to local files **and** syncs changes to TekMemo Cloud in the background. You get local inspectability plus cloud recall and team access. Configure it with:

```bash
npx tekmemo config init --runtime hybrid
```

See [CLI runtime modes](/cli/) for the full breakdown.

## How do I add TekMemo to my coding agent?

Use the **MCP server** (`@tekbreed/tekmemo-mcp-server`). It exposes tools like `read_core`, `add_note`, and `search_memory` to any MCP-compatible client (Claude Code, Cursor, etc.). Add it to your client configuration:

```json
{
	"mcpServers": {
		"@tekbreed/tekmemo": {
			"command": "npx",
			"args": ["-y", "@tekbreed/tekmemo-mcp-server", "--runtime", "local", "--root", "/path/to/project"]
		}
	}
}
```

See [MCP Server](/mcp/) for setup and [Client setup](/mcp/client-setup) for client-specific instructions.

## How do I use TekMemo with the Vercel AI SDK?

Install `@tekbreed/tekmemo-ai-sdk` and use the provided tools inside your `generateText` or `streamText` calls. The package wraps core memory, notes, recall, and graph operations as AI SDK-compatible tools. See [AI SDK](/ai-sdk/) for the overview and [Agent patterns](/ai-sdk/agent-patterns) for integration examples.

## What is graph memory for?

Graph memory stores **entities** (files, concepts, decisions) and **relationships** (depends-on, related-to, constrains). It answers questions like:

- "What depends on this module?"
- "How are these two decisions connected?"
- "Which files are affected by this change?"

See [Graph memory](/architecture/graph-memory) for the architecture details.

## Where can I host TekMemo?

TekMemo runs in any JavaScript environment. Supported platforms:

| Runtime | Best for |
| --- | --- |
| **Node.js** | Express, Fastify, CLI tools, MCP servers, background jobs |
| **Cloudflare Workers** | Edge functions, Workers AI, D1-backed apps |
| **Vercel** | Next.js route handlers, server actions, edge middleware |

The only constraint is keeping Cloud API keys server-side. See [Hosting](/hosting/) for platform-specific guides.

## What is a context package?

A context package is the structured payload TekMemo sends to an AI model or tool. It combines core memory, notes, recall results, graph context, and source metadata into a single, coherent prompt injection. You don't usually build one manually — the CLI, MCP server, and AI SDK all compose context packages automatically.

## How does sync work?

Sync resolves memory state between your local `.tekmemo/` filesystem and the TekMemo Cloud database. In hybrid mode, the CLI writes locally first, then syncs to cloud in the background. Events track changes over time, making conflict resolution and audit trails possible.

See [Sync and events](/architecture/sync-events) for the full architecture.

## How do I inspect or validate my memory?

Use the CLI:

```bash
# Inspect current memory state
npx tekmemo inspect

# Validate memory structure
npx tekmemo validate

# Get composed context for a task
npx tekmemo context --query "current task"
```

Since memory is file-first, you can also directly read `.tekmemo/core.md` and `.tekmemo/notes.md` in your editor.

## Do I need to install every TekMemo package?

No. TekMemo is split into focused packages so you only install what you need:

- `@tekbreed/tekmemo` — core types and runtime helpers
- `@tekbreed/tekmemo-fs` — local filesystem adapter
- `@tekbreed/tekmemo-cloud-client` — cloud API transport
- `@tekbreed/tekmemo-cli` — command-line interface
- `@tekbreed/tekmemo-mcp-server` — MCP server for IDE/agent integration
- `@tekbreed/tekmemo-ai-sdk` — Vercel AI SDK tools
- `@tekbreed/tekmemo-graph` — graph memory

See [Packages](/packages/) for the full list and when to use each one.
