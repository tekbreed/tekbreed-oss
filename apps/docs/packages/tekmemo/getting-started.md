# Getting started

TekMemo starts with a normal project folder.

## 1. Install the CLI

Install `@tekbreed/tekmemo-cli` as a devDependency in your project:

```bash
npm install -D @tekbreed/tekmemo-cli
```

## 2. Initialize memory

```bash
npx tekmemo init
```

This creates a `.tekmemo/` directory with core memory, notes, events, indexes, graph files, snapshots, and temp space.

## 3. Store a durable decision

```bash
npx tekmemo remember "Use Cloudflare D1 for tenant metadata." --kind decision --tag database
```

## 4. Ask for context before coding

```bash
npx tekmemo context --query "database schema work" --json
```

## 5. Connect coding agents via MCP

There are two ways to expose TekMemo to MCP-compatible agents (Claude Code, Cursor, Codex, etc.):

- **Hosted server (cloud-only, zero setup)** — point the client at the hosted endpoint with a bearer token:

  ```json
  {
    "mcpServers": {
      "tekmemo": {
        "url": "https://mcp.memo.tekbreed.com/",
        "headers": {
          "Authorization": "Bearer <your TEKMEMO_MCP_BEARER_TOKEN>"
        }
      }
    }
  }
  ```

- **Self-hosted stdio server (local/cloud/hybrid)** — install and run `@tekbreed/tekmemo-mcp-server` for file-first memory in `.tekmemo/`:

  ```bash
  npm install -D @tekbreed/tekmemo-mcp-server
  npx tekmemo-mcp --runtime local --root .
  ```

  Then register the command with your MCP client.

The hosted server can't read your local files, so use the stdio server when you want file-first `local` or `hybrid` memory with an agent. See the [MCP guide](../mcp/) and [Client setup](../mcp/client-setup) for per-client instructions.

## 6. Move to cloud when needed

Configure the CLI or MCP server with your TekMemo Cloud credentials:

```bash
export TEKMEMO_CLOUD_URL="https://api.tekbreed.com/memo/v1"
export TEKMEMO_API_KEY="tk_live_..."
export TEKMEMO_PROJECT_ID="proj_123"

npx tekmemo cloud context --query "current task" --json
```
