# @repo/test-utils

Shared contract tests, fixtures, and fakes for TekMemo packages.

## Usage;

This internal package provides testing utilities for all TekMemo packages.

### Exports;

The package exports testing utilities through subpath exports:

| Export path | Description |
|-------------|-------------|
| `.` | Main testing utilities |
| `./contracts` | Shared contract tests for MemoryStore, RecallStore, etc. |
| `./fakes` | Fake implementations for testing |
| `./fixtures` | Test fixtures (nodes, edges, documents) |
| `./vitest` | Vitest setup and utilities |

---

## Contract tests;

Shared contract tests ensure all implementations behave correctly:

```ts
import { runMemoryStoreContractTests } from "@repo/test-utils/contracts";

// Run contract tests for your MemoryStore implementation
runMemoryStoreContractTests({
  createStore: () => new YourMemoryStore(),
  supportsAppend: true,
  supportsMissingFileBehavior: true
});
```

Available contract test suites:
- `runMemoryStoreContractTests` — for MemoryStore implementations
- `runRecallStoreContractTests` — for RecallStore implementations
- `runEmbedderContractTests` — for embedder implementations
- `runRankerContractTests` — for ranker implementations

---

## Fake implementations;

Pre-built fakes for testing without real providers:

```ts
import {
  FakeMemoryStore,
  FakeRecallStore,
  FakeEmbedder,
  FakeRanker,
} from "@repo/test-utils/fakes";

// Use in tests
const store = new FakeMemoryStore();
await store.write(".tekmemo/memory/core.md", "content");

const embedder = new FakeEmbedder({
  embeddings: [[0.1, 0.2, 0.3]]  // predefined embeddings
});
```

---

## Fixtures;

Reusable test data:

```ts
import {
  createTestNode,
  createTestEdge,
  createTestMemoryEvent,
  createTestChunk,
} from "@repo/test-utils/fixtures";

const node = createTestNode({ id: "test-1", type: "concept" });
const edge = createTestEdge({ from: "a", to: "b", type: "uses" });
```

---

## Vitest utilities;

```ts
import { setupTestEnvironment } from "@repo/test-utils/vitest";

// Setup in vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ["@repo/test-utils/vitest"]
  }
});
```

---

## Package boundary;

**This package owns:**
- Shared contract test suites
- Fake implementations for testing
- Test fixtures
- Vitest setup utilities

**This package does NOT own:**
- Production implementations
- Public API documentation
- Provider-specific logic

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Recall store contracts
- `@tekmemo/rerank` — Ranker contracts
