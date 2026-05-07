# @tekmemo/ai-sdk

[![npm version](https://img.shields.io/npm/v/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)
[![license](https://img.shields.io/npm/l/@tekmemo/ai-sdk.svg)](https://www.npmjs.com/package/@tekmemo/ai-sdk)

Vercel AI SDK integration for TekMemo memory.

## Integration styles

This package supports two integration styles:

1. **Runtime-based tools** (recommended) — plug-and-play layer for local, cloud, or hybrid runtimes.
2. **Store-based local tools** — the original `MemoryStore` API for local `.tekmemo/` files.

The runtime layer aligns with the current TekMemo architecture:

```txt
AI app / chatbot
  → @tekmemo/ai-sdk
  → local runtime OR @tekmemo/cloud-client runtime OR hybrid runtime
  → .tekmemo/ or TekMemo Cloud/self-hosted API
```

The package does **not** build raw TekMemo Cloud URLs and does **not** store BYOK provider credentials. Cloud and BYOK behavior are handled by the runtime/cloud app.

## Installation

### Core

```bash
pnpm add @tekmemo/ai-sdk tekmemo
```

### For local file-backed memory

```bash
pnpm add @tekmemo/fs
```

### For cloud or hybrid runtime

```bash
pnpm add @tekmemo/cloud-client
```

---

## Runtime-based integration (recommended)

### Local runtime example

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
  allowCoreUpdates: false,
  allowIndexing: false,
  allowSecrets: false,
  maxContentChars: 50_000,
});
```

### Cloud runtime example

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

### Hybrid runtime example

```ts
import { createHybridTekMemoRuntime } from "@tekmemo/cloud-client";
import { createLocalAiSdkRuntime } from "@tekmemo/ai-sdk";

const runtime = createHybridTekMemoRuntime({
  local: createLocalAiSdkRuntime({ workspace }),
  cloud: cloudRuntime,
  readPolicy: "local-first",    // "local-first" | "cloud-first" | "local-only" | "cloud-only"
  writePolicy: "local-first",   // "local-first" | "cloud-first" | "local-only" | "cloud-only"
});
```

---

## API reference

### `buildRuntimeMemoryToolDefinition(options)`

Creates an AI SDK compatible tool definition for memory operations.

```ts
import { buildRuntimeMemoryToolDefinition } from "@tekmemo/ai-sdk";

const tool = buildRuntimeMemoryToolDefinition({
  // Required
  runtime: TekMemoAiRuntime,           // The runtime to use
  access: {
    projectId: string,                  // Project/organization ID
    userId?: string,                     // User ID (enables user scope)
    conversationId?: string,             // Conversation ID (enables conversation scope)
    participantIds?: string[],           // Participant IDs (enables participant-shared scope)
    tenantId?: string,                  // Tenant ID (enables tenant scope)
    workspaceId?: string,               // Workspace ID (enables workspace scope)
  },

  // Optional flags
  allowWrites: false,                   // Allow remember command
  allowCoreUpdates: false,              // Allow update_core_memory command
  allowIndexing: false,                 // Allow index command
  allowSecrets: false,                  // Allow writing potential secrets

  // Optional limits
  maxContentChars: 50_000,             // Max chars for content (default: 50k)
});
```

Returns: `{ description, inputSchema, execute }` — ready to use with `generateText`, `streamText`, etc.

### `runRuntimeMemoryTool(options, input)` → `Promise<string>`

Run a memory tool command programmatically (without AI SDK):

```ts
import { runRuntimeMemoryTool } from "@tekmemo/ai-sdk";

const result = await runRuntimeMemoryTool(options, {
  command: "remember",
  content: "User prefers TypeScript",
  scope: "user",
});
// result is JSON string: '{"ok":true,"data":{...}}'
```

### `buildRuntimeMemoryContext(input)` → `Promise<string>`

Build prompt-ready memory context from all memory layers:

```ts
import { buildRuntimeMemoryContext } from "@tekmemo/ai-sdk";

const context = await buildRuntimeMemoryContext({
  runtime,
  access: { projectId: "proj_123", userId: "user_123" },
  query: "recent decisions",       // optional: focus context
  includeCoreMemory: true,
  includeNotes: true,
  includeRecall: true,
  maxChars: 50_000,
});
// Use `context` in your system prompt
```

---

## Runtime tool commands

The memory tool supports these commands:

### `read_core_memory`

Read the project's core memory (canonical truth).

```ts
await memoryTool.execute({ command: "read_core_memory" });
```

### `update_core_memory`

Update core memory content (requires `allowCoreUpdates: true`).

```ts
await memoryTool.execute({
  command: "update_core_memory",
  content: "Updated core memory content...",
});
```

### `remember`

Create a new memory note (requires `allowWrites: true`).

```ts
await memoryTool.execute({
  command: "remember",
  content: "User prefers concise TypeScript examples.",
  kind: "preference",              // "decision" | "constraint" | "goal" | "preference" | "reference" | "summary" | "note"
  title: "TypeScript Preference",    // optional
  tags: ["typescript", "preferences"], // optional, max 25
  confidence: 0.95,                 // optional, 0-1
  source: "conversation",           // optional, source identifier
  scope: "user",                   // "project" | "workspace" | "tenant" | "user" | "conversation" | "participant-shared"
  visibility: "private",           // "private" | "shared" | "system"
  metadata: { key: "value" },      // optional, flat object
});
```

#### Note kinds

| Kind | Description |
|------|-------------|
| `decision` | Decisions, ADRs |
| `constraint` | Constraints, limitations |
| `goal` | Goals, objectives |
| `preference` | User/agent preferences |
| `reference` | Reference material |
| `summary` | Summaries |
| `note` (default) | Generic note |

#### Visibility

| Value | Who can read |
|-------|---------------|
| `private` | Only the creator (based on `userId`) |
| `shared` | Anyone with access to the project/workspace |
| `system` | System-generated, typically hidden from users |

### `list_notes`

List memory notes with filtering.

```ts
await memoryTool.execute({
  command: "list_notes",
  limit: 20,                       // optional, max 50
  kind: "preference",              // optional filter by kind
  tag: "typescript",               // optional filter by tag
});
```

### `recall`

Semantic recall (vector search) over memory notes.

```ts
await memoryTool.execute({
  command: "recall",
  query: "TypeScript examples",    // search query
  topK: 10,                       // optional, max 50
  strategy: "hybrid",              // "local" | "vector" | "hybrid"
  rerank: true,                    // optional, rerank results
});
```

### `build_context`

Build prompt-ready memory context.

```ts
await memoryTool.execute({
  command: "build_context",
  query: "recent activity",        // optional, focus context
  includeCoreMemory: true,
  includeNotes: true,
  includeRecall: true,
  maxChars: 50_000,
});
```

### `index`

Index memory for semantic recall (requires `allowIndexing: true`).

```ts
await memoryTool.execute({
  command: "index",
  mode: "changed",                 // "all" | "changed" | "core" | "notes"
  force: false,                    // force re-index everything
});
```

---

## Scope-aware memory

The runtime tool supports scoped memory for chatbot and multi-user applications:

| Scope | Description | Requires |
|-------|-------------|----------|
| `project` | Shared project/app memory | `projectId` |
| `workspace` | Shared workspace memory | `workspaceId` |
| `tenant` | Organization-wide memory | `tenantId` |
| `user` | Private per-user memory | `userId` |
| `conversation` | Active thread/session memory | `conversationId` |
| `participant-shared` | Group conversation memory | `participantIds` |

### Safe defaults

- Project/workspace memory can be read by default.
- User memory is used only when `userId` exists.
- Conversation memory is used only when `conversationId` exists.
- Participant-shared memory is used only when `participantIds` exists.
- Another user's private memory is filtered out.

### Example: Writing to user scope

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

---

## Store-based integration (legacy)

The original store-based tool still works:

```ts
import { buildMemoryToolDefinition } from "@tekmemo/ai-sdk";

const tool = buildMemoryToolDefinition({
  store,             // MemoryStore instance
  recallStores,      // optional: { workspace, project, user, conversation }
  retrievalPlan,     // optional: { readCoreMemory, readArchivalMemory, recall }
});
```

This is useful for simple local `.tekmemo/` workflows without the runtime layer.

### `buildMemoryToolDefinition(options)`

```ts
import { buildMemoryToolDefinition } from "@tekmemo/ai-sdk";

const tool = buildMemoryToolDefinition({
  store: MemoryStore,                    // Required: local memory store
  recallStores: {                        // Optional: for recall command
    workspace: MemoryStore,
    project: MemoryStore,
    user: MemoryStore,
    conversation: MemoryStore,
  },
  retrievalPlan: {                        // Optional: configure what to read
    readCoreMemory: true,
    readArchivalMemory: true,
    recall: true,
    recallTopK: 5,
  },
  allowWrites: false,
  allowCoreUpdates: false,
  allowSecrets: false,
});
```

### `runStructuredMemoryTool(options, input)` → `Promise<string>`

Run the store-based tool programmatically:

```ts
import { runStructuredMemoryTool } from "@tekmemo/ai-sdk";

const result = await runStructuredMemoryTool(options, {
  command: "remember",
  content: "Remember this fact",
});
```

---

## Context building

### `buildPrepareCallMemoryText(input)` → `Promise<string>`

Build prompt-ready memory text for injection into system prompts:

```ts
import { buildPrepareCallMemoryText } from "@tekmemo/ai-sdk";

const context = await buildPrepareCallMemoryText({
  stores: {
    workspace: workspaceStore,
    project: projectStore,
    user: userStore,
  },
  retrievalPlan: {
    readCoreMemory: true,
    readArchivalMemory: true,
    recall: true,
    recallTopK: 5,
  },
  baseInstructions: "You are a helpful assistant with access to the following memory:",
});
// Use `context` in your system prompt
```

### `safeReadMemoryPath(store, path, defaultValue?)` → `Promise<unknown>`

Safely read a memory path, returning a default value if not found:

```ts
import { safeReadMemoryPath } from "@tekmemo/ai-sdk";

const content = await safeReadMemoryPath(
  store,
  ".tekmemo/memory/core.md",
  "Default content if not found"
);
```

---

## Scope policy utilities

```ts
import {
  assertMemoryScope,       // Assert scope is valid and allowed
  assertScopeAllowed,       // Check if scope is allowed
  canReadMemoryMetadata,    // Check if metadata allows reading
  createRecallFilters,      // Create recall filters from access context
  createScopeMetadata,      // Create metadata for a scope write
  inferWriteScope,          // Infer scope from access context
  normalizeAccessContext,   // Normalize access context
} from "@tekmemo/ai-sdk";
```

---

## BYOK (Bring Your Own Key)

`@tekmemo/ai-sdk` does not store or resolve provider keys.

- **Local BYOK**: provider keys are supplied to local provider adapters by the app.
- **Hosted cloud BYOK**: provider keys are stored/resolved by TekMemo Cloud.
- **Self-hosted BYOK**: provider keys are stored/resolved inside the user's self-hosted cloud.

---

## Error handling

The tool returns JSON strings with error information:

```ts
const result = await memoryTool.execute({ command: "remember", ... });
const parsed = JSON.parse(result);

if (!parsed.ok) {
  console.error("Error:", parsed.error);
}
```

Common errors:
- `"Core memory updates are disabled"` — `allowCoreUpdates: false`
- `"Memory writes are disabled"` — `allowWrites: false`
- `"Indexing is disabled"` — `allowIndexing: false`
- `"Potential secret detected"` — `allowSecrets: false` and secret pattern detected
- `"Content exceeds maximum length"` — content too long

---

## Types

Key types exported:

```ts
import type {
  // Runtime types
  TekMemoAiRuntime,
  RuntimeMemoryToolOptions,
  BuildRuntimeMemoryContextInput,
  BuildRuntimeMemoryContextResult,

  // Memory types
  MemoryToolInput,
  RuntimeMemoryToolInput,
  MemoryToolExecutionContext,
  MemoryStores,

  // Access context
  AiMemoryAccessContext,
  NormalizedAiMemoryAccessContext,
  AiMemoryScope,
  AiMemoryKind,
  AiMemoryVisibility,
  AiMemoryScopeMetadata,

  // Retrieval
  MemoryHit,
  MemoryScope,
  RetrievalPlan,

  // Other
  JsonValue,
  JsonObject,
  JsonPrimitive,
} from "@tekmemo/ai-sdk";
```

