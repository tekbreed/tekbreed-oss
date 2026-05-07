# @tekmemo/agentfs

[![npm version](https://img.shields.io/npm/v/@tekmemo/agentfs.svg)](https://www.npmjs.com/package/@tekmemo/agentfs)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/agentfs.svg)](https://www.npmjs.com/package/@tekmemo/agentfs)
[![license](https://img.shields.io/npm/l/@tekmemo/agentfs.svg)](https://www.npmjs.com/package/@tekmemo/agentfs)

AgentFS-backed `MemoryStore` adapter for TekMemo.

This package lets TekMemo use an AgentFS-like remote file runtime while preserving the canonical local memory protocol:

```txt
.tekmemo/
  manifest.json
  memory/core.md
  memory/notes.md
  events/memory-events.jsonl
  events/conversations.jsonl
  indexes/chunks.jsonl
  graph/nodes.jsonl
  graph/edges.jsonl
  snapshots/snapshots.jsonl
```

## Installation

```bash
pnpm add tekmemo @tekmemo/agentfs
```

## Quickstart

```ts
import { bootstrapMemoryStore, CORE_MEMORY_PATH } from "tekmemo";
import { createAgentfsMemoryStore } from "@tekmemo/agentfs";

const store = createAgentfsMemoryStore(agentfsClient, {
  scope: "project",
  projectId: "proj_123"
});

await bootstrapMemoryStore(store);
await store.write(CORE_MEMORY_PATH, "# Core Memory\n");

const content = await store.read(CORE_MEMORY_PATH);
```

---

## API reference

### `createAgentfsMemoryStore(client, options)` → `AgentfsMemoryStore`

Creates an AgentFS-backed memory store:

```ts
import { createAgentfsMemoryStore } from "@tekmemo/agentfs";

const store = createAgentfsMemoryStore(client, {
  scope: "project",           // "project" | "user" | "session"
  projectId: "proj_123",      // required for project scope
  userId: "usr_123",           // required for user scope
  sessionId: "sess_123",       // required for session scope
  missingFileBehavior: "throw", // "throw" (default) | "empty"
});
```

### AgentFS-like client contract

AgentFS is still a beta surface, so this package accepts a structural client:

```ts
interface AgentfsLikeClient {
  readText(path: string): Promise<string>;
  writeText(path: string, content: string): Promise<void>;
  appendText?(path: string, content: string): Promise<void>;
  exists?(path: string): Promise<boolean>;
  sync?: {
    pull?(): Promise<void>;
    push?(): Promise<void>;
    checkpoint?(label: string): Promise<void>;
  };
}
```

`appendText` and `exists` are optional. If `appendText` is missing, falls back to read/write.

### Supported scopes

```ts
// Project scope
createAgentfsMemoryStore(client, {
  scope: "project",
  projectId: "proj_123"
});
// Paths resolve to: /stores/project/proj_123/.tekmemo/...

// User scope
createAgentfsMemoryStore(client, {
  scope: "user",
  userId: "usr_123"
});
// Paths resolve to: /stores/user/usr_123/.tekmemo/...

// Session scope
createAgentfsMemoryStore(client, {
  scope: "session",
  sessionId: "sess_123"
});
// Paths resolve to: /stores/session/sess_123/.tekmemo/...
```

Behind the scenes, `CORE_MEMORY_PATH` resolves to:
```txt
/stores/project/proj_123/.tekmemo/memory/core.md
```

---

## Sync hooks

```ts
import { syncBeforeSession, syncAfterSession } from "@tekmemo/agentfs";

// Before agent session
await syncBeforeSession(agentfsClient);

// Run agent session
// ...

// After agent session (checkpoints before pushing by default)
await syncAfterSession(agentfsClient, "after-agent-session");
```

---

## Lease management

```ts
import { InMemoryLeaseManager, withMemoryLease } from "@tekmemo/agentfs";

// Create lease manager (in-memory, for tests/single-process)
const leaseManager = new InMemoryLeaseManager();

// Run operation with lease
await withMemoryLease({
  leaseManager,
  storeId: "project:proj_123",
  ownerId: "worker-1",
  ttlMs: 30_000,             // 30 second TTL
  operation: async () => {
    // Critical memory operation
    await store.write(".tekmemo/memory/core.md", content);
  }
});
```

The in-memory lease manager is useful for tests and single-process coordination. Distributed production leases should use a durable/shared implementation.

---

## Missing file behavior

### Strict mode (default)

```ts
const store = createAgentfsMemoryStore(client, {
  scope: "project",
  projectId: "proj_123",
  missingFileBehavior: "throw"
});

try {
  await store.read(".tekmemo/memory/core.md"); // throws MemoryNotFoundError
} catch (error) {
  // MemoryNotFoundError
}
```

### Relaxed mode

```ts
const store = createAgentfsMemoryStore(client, {
  scope: "project",
  projectId: "proj_123",
  missingFileBehavior: "empty"
});

const content = await store.read(".tekmemo/memory/core.md"); // "" if missing
```

---

## Error handling

```ts
import { AgentfsMemoryStoreError, MemoryNotFoundError } from "@tekmemo/agentfs";

try {
  await store.read(".tekmemo/memory/core.md");
} catch (error) {
  if (error instanceof MemoryNotFoundError) {
    // File doesn't exist
  }
  if (error instanceof AgentfsMemoryStoreError) {
    console.error(error.message);
    console.error(error.path);        // Memory path
    console.error(error.absolutePath); // AgentFS path
  }
}
```

---

## Edge cases handled

- Invalid AgentFS client shape
- Invalid scope
- Missing scope IDs
- Unsafe IDs (with `/`, `\`, `..`, null bytes, spaces)
- Unsafe root prefixes
- Unsupported TekMemo memory paths
- Path traversal attempts
- Missing files
- Non-string provider responses
- Non-string write/append content
- Client read/write/append/exists failures
- Optional native append support
- Read/write fallback append
- Same-instance append serialization
- Sync no-op behavior
- Sync failure wrapping
- Checkpoint label validation
- Lease contention
- Expired leases
- Release-on-error lease behavior

---

## Package boundary

**This package owns:**
- AgentFS adapter for `MemoryStore` interface
- Sync hooks for AgentFS sessions
- Lease management utilities
- Path resolution for AgentFS scopes

**This package does NOT own:**
- The `.tekmemo/` protocol itself (owned by `tekmemo` core)
- Local filesystem storage (see `@tekmemo/fs`)
- Vector recall
- Embeddings
- Reranking
- Cloud billing
- Cloud tenancy
- BYOK storage

---

## Related packages

- `tekmemo` — Core memory contracts and types
- `@tekmemo/fs` — Local filesystem adapter
- `@tekmemo/recall` — Vector recall contracts
