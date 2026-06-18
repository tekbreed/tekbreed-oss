# Configuration

TekMemo resolves configuration with a strict priority chain so the same package works for local apps, cloud apps, hybrid setups, and tests.

## Resolution priority

For every setting, `Tekmemo` and the CLI/MCP packages follow this order:

1. **Constructor / CLI args** (highest priority)
2. **Environment variables**
3. **`.tekmemo/config.json`** (lowest project priority)
4. **Built-in defaults**

A value set higher in the list always wins.

## Local

```bash
tekmemo config init --runtime local
```

Or in code:

```ts
import { Tekmemo } from "@tekbreed/tekmemo";

const memo = new Tekmemo({ mode: "local", rootDir: "./.tekmemo" });
```

## Cloud

```bash
export TEKMEMO_CLOUD_URL="https://api.tekbreed.com/memo/v1"
export TEKMEMO_API_KEY="tk_live_..."
export TEKMEMO_PROJECT_ID="proj_123"
```

```ts
const memo = new Tekmemo({
  mode: "cloud",
  cloud: {
    baseUrl: "https://api.tekbreed.com/memo/v1",
    apiKey: process.env.TEKMEMO_API_KEY!,
  },
});
```

## Hybrid

```bash
tekmemo config init \
  --runtime hybrid \
  --cloud-url https://api.tekbreed.com/memo/v1 \
  --project-id proj_123 \
  --read-policy local-first \
  --write-policy local-first
```

In hybrid mode, every read and write is routed through the [read/write policies](./client#read-and-write-policies). Cloud configuration (`baseUrl` + `apiKey`, or a `cloudClient` instance) is required.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TEKMEMO_ROOT` | Root directory for local memory (defaults to `.`). |
| `TEKMEMO_RUNTIME` | Runtime mode: `local`, `cloud`, `hybrid`, or `memory`. |
| `TEKMEMO_PROJECT_ID` | Default Cloud project (defaults to `default`). |
| `TEKMEMO_WORKSPACE_ID` | Optional caller-side workspace context. |
| `TEKMEMO_CLOUD_URL` | Cloud API base URL ending in `/api/v1`. Also accepted as `TEKMEMO_API_URL`. |
| `TEKMEMO_API_KEY` | TekMemo Cloud API key. |
| `TEKMEMO_CLOUD_TIMEOUT_MS` | Cloud request timeout in milliseconds (positive integer). |
| `TEKMEMO_READ_POLICY` | Hybrid read policy. |
| `TEKMEMO_WRITE_POLICY` | Hybrid write policy. |

## `.tekmemo/config.json` properties

| Field | Description |
| --- | --- |
| `runtime` | `"local"`, `"cloud"`, `"hybrid"`, or `"memory"`. |
| `root` | Relative path to the folder where memory operations should run. |
| `projectId` | Default Cloud project. |
| `workspaceId` | Optional caller-side workspace context. |
| `cloud.baseUrl` | TekMemo Cloud URL. |
| `cloud.apiKey` | TekMemo Cloud API key. Avoid committing keys; prefer env vars. |
| `cloud.workspaceId` | Default workspace ID. |
| `cloud.projectId` | Default project ID. |
| `cloud.timeoutMs` | Timeout in milliseconds (positive integer). |
| `hybrid.readPolicy` | `"local-first"`, `"cloud-first"`, `"local-only"`, or `"cloud-only"`. |
| `hybrid.writePolicy` | `"local-first"`, `"cloud-first"`, `"local-only"`, or `"cloud-only"`. |

## Configuration file

`.tekmemo/config.json` stores project-specific defaults so you don't need to specify flags on every command. Generate one using the CLI:

```bash
npx tekmemo config init --runtime hybrid
```

### Schema

Reference the schema from your config file for editor validation:

```json
{
  "$schema": "https://oss.tekbreed.com/1.0.0-alpha.0/config.schema.json",
  "runtime": "hybrid",
  "root": ".",
  "cloud": {
    "baseUrl": "https://api.tekbreed.com/memo/v1",
    "projectId": "proj_123",
    "workspaceId": "ws_456",
    "timeoutMs": 10000
  },
  "hybrid": {
    "readPolicy": "local-first",
    "writePolicy": "local-first"
  }
}
```

The CLI also reads `mcp.runtime`, `mcp.readPolicy`, and `mcp.writePolicy` for backwards compatibility, but the top-level `runtime` and `hybrid.*` keys are preferred.
