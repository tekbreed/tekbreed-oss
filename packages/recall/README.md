# @tekmemo/recall`

[![npm version](https://img.shields.io/npm/v/@tekmemo/recall.svg)](https://www.npmjs.com/package/@tekmemo/recall)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/recall.svg)](https://www.npmjs.com/package/@tekmemo/recall)
[![license](https://img.shields.io/npm/l/@tekmemo/recall.svg)](https://www.npmjs.com/package/@tekmemo/recall)

Provider-neutral vector recall contracts, validation helpers, scoring utilities, filter matching, and an in-memory test implementation for TekMemo.

This package does **not** talk to Upstash, Turso, Qdrant, Pinecone, Chroma, LanceDB, Weaviate, or Milvus directly. Those provider-specific packages should implement the `RecallStore` interface exported here.

## Why this package exists;

TekMemo is file-first. Local memory lives in `.tekmemo/`, but recall providers can vary.

The recall flow is:

```txt
.tekmemo memory files
  -> chunk records
  -> embeddings
  -> RecallStore implementation
  -> recall query results
  -> optional reranking
```

`@tekmemo/recall` defines the provider-neutral contract for that recall layer.

## Installation;

```bash
pnpm add @tekmemo/recall
```

---

## API reference;

### `RecallStore` interface;

```ts
import type { RecallStore, RecallDocument, RecallQuery, RecallResult } from "@tekmemo/recall";

interface RecallStore {
  // Upsert documents with embeddings
  upsert(documents: RecallDocument[]): Promise<void>;

  // Query by embedding vector
  query(query: RecallQuery): Promise<RecallResult[]>;

  // Delete by IDs
  delete(ids: string[], options?: { namespace?: string }): Promise<void>;

  // Delete by source metadata
  deleteBySource(input: DeleteBySourceInput): Promise<void>;
}
```

### `RecallDocument`;

```ts
interface RecallDocument {
  id: string;                    // Unique document ID
  text: string;                  // Document text
  embedding: number[];           // Embedding vector
  metadata?: Record<string, unknown>;  // Optional metadata
}
```

### `RecallQuery`;

```ts
interface RecallQuery {
  embedding: number[];                    // Query embedding vector
  topK?: number;                         // Max results (default: 10)
  filter?: RecallFilter;                   // Optional metadata filter
  namespace?: string;                      // Optional namespace
}
```

### `RecallResult`;

```ts
interface RecallResult {
  id: string;                    // Document ID
  score: number;                 // Similarity score (0-1)
  metadata?: Record<string, unknown>;  // Metadata
}
```

### `RecallFilter`;

Provider-neutral filter with operators:

```ts
type RecallFilter = {
  [key: string]:
    | string | number | boolean              // $eq (implicit)
    | { $eq: value }                        // Equal
    | { $ne: value }                        // Not equal
    | { $in: value[] }                      // In array
    | { $nin: value[] }                     // Not in array
    | { $gt: number }                       // Greater than
    | { $gte: number }                      // Greater than or equal
    | { $lt: number }                       // Less than
    | { $lte: number }                      // Less than or equal
    | { $exists: boolean }                  // Field exists
    | { $contains: string }                 // String contains
    | RecallFilter;                         // Nested (AND)
}
```

---

## In-memory store;

Use the in-memory store for local tests, examples, and adapter contract tests.

```ts
import { createInMemoryRecallStore } from "@tekmemo/recall";

const store = createInMemoryRecallStore({
  duplicateDocumentIdBehavior: "last-write-wins",  // or "skip"
});

await store.upsert([
  {
    id: "chunk_1",
    text: "TekMemo uses local .tekmemo memory files.",
    embedding: [1, 0, 0],
    metadata: {
      projectId: "proj_1",
      sourceType: "document",
      sourceId: "core",
      memoryType: "core"
    }
  }
]);

const results = await store.query({
  embedding: [1, 0, 0],
  topK: 5,
  filter: {
    projectId: "proj_1",
    memoryType: { $eq: "core" }
  }
});
// results[0].id, results[0].score, results[0].metadata
```

---

## Namespaces;

Use namespaces to isolate tenants/projects in providers that support namespaces.

```ts
import { createProjectNamespace, createTenantNamespace } from "@tekmemo/recall";

// Project namespace
const namespace = createProjectNamespace({
  tenantId: "ten_1",
  projectId: "proj_1"
});
// Returns: "tekmemo-prod-ten_1-proj_1" (format may vary)

// Custom namespace
const store = createInMemoryRecallStore({
  namespace: "custom-namespace"
});
```

---

## Filters;

The neutral filter format supports:

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `{ status: "active" }` or `{ status: { $eq: "active" } }` |
| `$ne` | Not equal | `{ status: { $ne: "deleted" } }` |
| `$in` | In array | `{ type: { $in: ["a", "b"] } }` |
| `$nin` | Not in array | `{ type: { $nin: ["x"] } }` |
| `$gt` | Greater than | `{ score: { $gt: 0.5 } }` |
| `$gte` | Greater or equal | `{ score: { $gte: 0.5 } }` |
| `$lt` | Less than | `{ score: { $lt: 0.5 } }` |
| `$lte` | Less or equal | `{ score: { $lte: 0.5 } }` |
| `$exists` | Field exists | `{ sourceId: { $exists: true } }` |
| `$contains` | String contains | `{ text: { $contains: "memory" } }` |

Provider adapters should map this neutral shape to the provider's native filter syntax.

---

## Production behavior;

This package handles:

- Invalid embeddings (non-array, wrong dimensions)
- Dimension mismatches (between documents)
- Invalid `topK` (non-positive, too large)
- Unsafe IDs (path traversal, null bytes)
- Unsafe namespaces
- Non-JSON metadata
- Circular metadata
- Unsupported filter operators
- Deterministic sorting (by score descending)
- Namespace isolation
- Metadata filtering
- Duplicate document IDs
- Deletion by ID
- Deletion by source

---

## Error handling;

```ts
import { RecallStoreError, RecallValidationError } from "@tekmemo/recall";

try {
  await store.upsert([{ id: "1", text: "..." }]);  // missing embedding
} catch (error) {
  if (error instanceof RecallValidationError) {
    // Invalid input
  }
  if (error instanceof RecallStoreError) {
    // Store operation failed
  }
}
```

---

## Package boundary;

**This package must NOT own:**
- Embedding providers (see `@tekmemo/openai`, `@tekmemo/voyageai`)
- Vector provider SDKs (see `@tekmemo/upstash-vector`)
- Reranking providers (see `@tekmemo/rerank`, `@tekmemo/rerank-voyage`)
- Cloud billing
- Cloud tenancy
- BYOK secret storage

**This package owns:**
- `RecallStore` interface
- Input validation
- Filter matching logic
- In-memory test implementation
- Namespace helpers
- Scoring utilities

Provider packages should depend on this package and implement `RecallStore`.

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/openai` — OpenAI embedding adapter
- `@tekmemo/voyageai` — Voyage AI embedding adapter
- `@tekmemo/upstash-vector` — Upstash Vector adapter
- `@tekmemo/rerank` — Reranking contracts
