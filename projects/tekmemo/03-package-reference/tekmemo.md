# `@tekbreed/tekmemo` Package

## Purpose

`@tekbreed/tekmemo` is the provider-neutral core package.

It is responsible for the local memory protocol and core memory primitives.

It should be usable without:

- Node filesystem APIs
- Cloudflare
- Turso
- Upstash
- Voyage
- OpenAI
- TekMemo Cloud

---

# Installation

```bash
pnpm add @tekbreed/tekmemo
```

---

# What it gives developers

- a standard `.tekmemo/` protocol
- memory store interfaces
- manifest helpers
- memory document helpers
- event log helpers
- chunk registry helpers
- snapshot metadata helpers
- validation utilities
- in-memory store for tests

---

# Protocol constants

`@tekbreed/tekmemo` should export the canonical protocol constants:

```ts
import { TEKMEMO_DIR, TEKMEMO_PATHS } from "@tekbreed/tekmemo";
```

Expected values:

```txt
.tekmemo/manifest.json
.tekmemo/memory/core.md
.tekmemo/memory/notes.md
.tekmemo/events/memory-events.jsonl
.tekmemo/events/conversations.jsonl
.tekmemo/indexes/chunks.jsonl
.tekmemo/graph/nodes.jsonl
.tekmemo/graph/edges.jsonl
.tekmemo/snapshots/snapshots.jsonl
```

---

# Basic flow

```ts
import {
  bootstrapMemoryStore,
  createInMemoryStore,
  readCoreMemory,
  updateCoreMemory,
  appendMemoryEvent,
  createMemoryEvent
} from "@tekbreed/tekmemo";

const store = createInMemoryStore();

await bootstrapMemoryStore(store);
await updateCoreMemory(store, "# Core Memory\n\n- Project: TekMemo");

const event = createMemoryEvent({
  type: "memory.updated",
  sourcePath: ".tekmemo/memory/core.md",
  summary: "Updated project identity."
});

await appendMemoryEvent(store, event);

const core = await readCoreMemory(store);
```

---

# Production rules

- Never hard-code alternative memory roots.
- Do not store vectors in core memory files by default.
- Do not mix provider-specific code into this package.
- Treat vector stores as indexes, not memory.
- Treat event logs as append-only.
- Keep local files inspectable.

---

# Test requirements

The `@tekbreed/tekmemo` package should maintain comprehensive tests for:

- protocol bootstrap
- manifest validation
- memory document helpers
- event helpers
- JSONL parsing
- chunk registry helpers
- snapshot helpers
- error classes
- store contract behavior
