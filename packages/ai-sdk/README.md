# @tekmemo/ai-sdk

[![npm version](https://img.shields.io/npm/v/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)
[![license](https://img.shields.io/npm/l/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)

Vercel AI SDK integration for TekMemo memory.

This package supports two integration styles:

1. **Store-based local tools** — the original `MemoryStore` API for local `.tekmemo/` files.
2. **Runtime-based tools** — a newer plug-and-play layer for local, cloud, or hybrid runtimes.

The runtime layer aligns with the current TekMemo runbook:

```txt
AI app / chatbot
  → @tekmemo/ai-sdk
  → local runtime OR @tekmemo/cloud-client runtime OR hybrid runtime
  → .tekmemo/ or TekMemo Cloud/self-hosted API
```

The package does **not** build raw TekMemo Cloud URLs and does **not** store BYOK provider credentials. Cloud and BYOK behavior are handled by the runtime/cloud app.

## Installation

```bash
pnpm add @tekmemo/ai-sdk tekmemo
```

For local file-backed memory:

```bash
pnpm add @tekmemo/fs
```

For cloud or hybrid runtime:

```bash
pnpm add @tekmemo/cloud-client
```

## Local runtime example

```ts
import { createNodeFsMemoryStore } from "@tekmemo/fs";
import {
  createLocalAiSdkRuntime,
  buildRuntimeMemoryToolDefinition,
} from "@tekmemo/ai-sdk";

const workspace = createNodeFsMemoryStore({ rootDir: process.cwd() });
const runtime = createLocalAiSdkRuntime({ workspace });

export const memoryTool = buildRuntimeMemoryToolDefinition({
  runtime,
  access: {
    projectId: "local-project",
    userId: "user_123",
    conversationId: "conv_123",
  },
  allowWrites: true,
});
```

## Cloud runtime example

```ts
import {
  createTekMemoCloudClient,
  createCloudTekMemoRuntime,
} from "@tekmemo/cloud-client";
import { buildRuntimeMemoryToolDefinition } from "@tekmemo/ai-sdk";

const client = createTekMemoCloudClient({
  baseUrl: "https://memo.tekbreed.com/api/v1",
  apiKey: process.env.TEKMEMO_API_KEY, // tk_live_...
});

const runtime = createCloudTekMemoRuntime({
  client,
  projectId: "proj_123",
});

export const memoryTool = buildRuntimeMemoryToolDefinition({
  runtime,
  access: {
    projectId: "proj_123",
    userId: "user_123",
    conversationId: "conv_123",
  },
  allowWrites: true,
});
```

## Hybrid runtime example

```ts
import { createHybridTekMemoRuntime } from "@tekmemo/cloud-client";
import { createLocalAiSdkRuntime } from "@tekmemo/ai-sdk";

const runtime = createHybridTekMemoRuntime({
  local: createLocalAiSdkRuntime({ workspace }),
  cloud: cloudRuntime,
  readPolicy: "local-first",
  writePolicy: "local-first",
});
```

## Scope-aware memory

The runtime tool supports scoped memory for chatbot and multi-user applications:

```txt
project              shared project/app memory
workspace            shared workspace memory
tenant               organization-wide memory
user                 private per-user memory
conversation         active thread/session memory
participant-shared   group conversation memory
```

Safe defaults:

- Project/workspace memory can be read by default.
- User memory is used only when `userId` exists.
- Conversation memory is used only when `conversationId` exists.
- Participant-shared memory is used only when `participantIds` exists.
- Another user's private memory is filtered out.

Example write:

```ts
await memoryTool.execute({
  command: "remember",
  scope: "user",
  kind: "preference",
  content: "User prefers concise TypeScript examples.",
});
```

The note metadata will include scope information:

```json
{
  "scope": "user",
  "visibility": "private",
  "projectId": "proj_123",
  "userId": "user_123",
  "createdByPackage": "@tekmemo/ai-sdk"
}
```

## Runtime tool commands

```txt
read_core_memory
update_core_memory
remember
list_notes
recall
build_context
index
```

Writes require `allowWrites: true`.

Core updates require `allowCoreUpdates: true`.

Indexing requires `allowIndexing: true`.

Potential secrets are rejected unless `allowSecrets: true` is explicitly set.

## Backward-compatible MemoryStore tool

The original store-based tool still works:

```ts
import { buildMemoryToolDefinition } from "@tekmemo/ai-sdk";

const tool = buildMemoryToolDefinition({ store });
```

This is useful for simple local `.tekmemo/` workflows.

## BYOK

`@tekmemo/ai-sdk` does not store or resolve provider keys.

- Local BYOK: provider keys are supplied to local provider adapters by the app.
- Hosted cloud BYOK: provider keys are stored/resolved by TekMemo Cloud.
- Self-hosted BYOK: provider keys are stored/resolved inside the user's self-hosted cloud.

