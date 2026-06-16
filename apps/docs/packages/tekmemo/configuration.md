# Configuration

TekMemo packages prefer explicit runtime configuration.

## Local

```bash
tekmemo config init --runtime local
```

## Cloud

```bash
export TEKMEMO_CLOUD_URL="https://api.tekbreed.com/memo/v1"
export TEKMEMO_API_KEY="tk_live_..."
export TEKMEMO_PROJECT_ID="proj_123"
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

## Environment variables

| Variable | Purpose |
| --- | --- |
| `TEKMEMO_CLOUD_URL` | Cloud API base URL ending in `/api/v1`. |
| `TEKMEMO_API_KEY` | TekMemo Cloud API key. |
| `TEKMEMO_PROJECT_ID` | Default Cloud project. |
| `TEKMEMO_WORKSPACE_ID` | Optional caller-side workspace context. |
| `TEKMEMO_RUNTIME` | `local`, `cloud`, `hybrid`, or `memory`. |

## Properties

| Field | Description |
| --- | --- |
| `runtime` | `"local"`, `"cloud"`, or `"hybrid"` |
| `root` | Relative path to the folder where memory operations should run |
| `cloud.baseUrl` | TekMemo Cloud URL |
| `cloud.projectId` | Default project ID |
| `cloud.workspaceId` | Default workspace ID |
| `cloud.timeoutMs` | Timeout in milliseconds (must be a positive integer) |
| `hybrid.readPolicy` | `"local-first"`, `"cloud-first"`, `"local-only"`, or `"cloud-only"` |
| `hybrid.writePolicy` | `"local-first"`, `"cloud-first"`, `"local-only"`, or `"cloud-only"` |


## Configuration file

The `.tekmemo/config.json` file stores project-specific defaults so you don't need to specify flags on every command. 

Generate one using the CLI:
```bash
npx tekmemo config init --runtime hybrid
```

### Schema

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

