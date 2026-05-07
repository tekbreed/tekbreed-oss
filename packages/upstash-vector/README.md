# @tekmemo/upstash-vector`

[![npm version](https://img.shields.io/npm/v/@tekmemo/upstash-vector.svg)](https://www.npmjs.com/package/@tekmemo/upstash-vector)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/upstash-vector.svg)](https://www.npmjs.com/package/@tekmemo/upstash-vector)
[![license](https://img.shields.io/npm/l/@tekmemo/upstash-vector.svg)](https://www.npmjs.com/package/@tekmemo/upstash-vector)

Production-ready Upstash Vector adapter for TekMemo recall.

This package implements the provider-neutral `RecallStore` contract from `@tekmemo/recall`.

It is intentionally **not** the owner of TekMemo recall contracts. The contract lives in:
```txt
@tekmemo/recall
```

This package only translates that contract into Upstash Vector operations.

The production target is the official `@upstash/vector` SDK. The adapter also accepts a minimal compatible index shape so tests and dependency-injected hosts can use fakes.

## Installation;

```bash
pnpm add @tekmemo/upstash-vector @tekmemo/recall @upstash/vector
```

---

## Quickstart;

```ts
import { Index } from "@upstash/vector";
import { createUpstashRecallStore } from "@tekmemo/upstash-vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!
});

const recall = createUpstashRecallStore(index, {
  environment: "prod",
  tenantId: "ten_123",
  projectId: "proj_123",
  dimension: 1024
});

await recall.upsert([
  {
    id: "chunk_123",
    text: "TekMemo uses file-first memory.",
    embedding: [0.1, 0.2, 0.3],
    metadata: {
      tenantId: "ten_123",
      projectId: "proj_123",
      sourceType: "document",
      sourceId: "core",
      memoryType: "core",
      sourcePath: ".tekmemo/memory/core.md"
    }
  }
]);

const results = await recall.query({
  embedding: [0.1, 0.2, 0.3],
  topK: 5,
  filter: {
    memoryType: "core"
  }
});

console.log(results[0]?.id);
console.log(results[0]?.score);
```

---

## API reference;

### `createUpstashRecallStore(index, options)` → `UpstashRecallStore`

Creates an Upstash Vector-backed recall store:

```ts
import { createUpstashRecallStore } from "@tekmemo/upstash-vector";

const recall = createUpstashRecallStore(index, {
  // Required
  environment: "prod",           // "prod" | "staging" | "dev" | "local"
  tenantId: "ten_123",          // Required for namespace isolation
  projectId: "proj_123",       // Required for namespace isolation
  dimension: 1024,             // Must match your embedding model

  // Optional
  namespace: "custom-namespace",  // Override auto-generated namespace
  resolveChunkIdsBySource: async (input) => {
    // Required for deleteBySource
    return ["chunk_1", "chunk_2"];
  }
});
```

### `RecallStore` methods;

Implements the `RecallStore` interface from `@tekmemo/recall`:

```ts
// Upsert documents with embeddings
await recall.upsert([
  {
    id: "chunk_123",
    text: "TekMemo uses file-first memory.",
    embedding: [0.1, 0.2, 0.3],
    metadata: { sourceType: "document", memoryType: "core" }
  }
]);

// Query by embedding vector
const results = await recall.query({
  embedding: [0.1, 0.2, 0.3],
  topK: 5,                          // optional, default: 10
  filter: { memoryType: "core" },  // optional
  namespace: "custom"                // optional, default: auto-generated
});

// Delete by IDs
await recall.delete(["chunk_123", "chunk_456"], {
  namespace: "custom"  // optional
});

// Delete by source metadata
await recall.deleteBySource({
  sourceType: "document",
  sourceId: "core"
});
```

---

## Namespace strategy;

By default, namespaces are generated as:

```txt
tekmemo-<environment>-<tenantId>-<projectId>
```

Examples:

```ts
createUpstashRecallStore(index, {
  environment: "prod",
  tenantId: "ten_123",
  projectId: "proj_123"
});
// Namespace: "tekmemo-prod-ten_123-proj_123"
```

You can also pass an explicit namespace:

```ts
createUpstashRecallStore(index, {
  namespace: "tenant/proj"
});
// Namespace: "tenant/proj"
```

---

## BYOK support;

This package is BYOK-ready.

The host app supplies the Upstash client or credentials. This package never stores secrets.

In TekMemo Cloud:
- The closed-source cloud layer should decrypt and inject user-owned credentials
- This package should only receive a configured Upstash-compatible index instance

```ts
// Example: inject credentials from user config
const index = new Index({
  url: userConfig.upstashUrl,
  token: userConfig.upstashToken
});

const recall = createUpstashRecallStore(index, {
  environment: "prod",
  tenantId: userConfig.tenantId,
  projectId: userConfig.projectId,
  dimension: 1024
});
```

---

## Delete by source;

Upstash Vector does not expose a universal provider-neutral "delete all vectors by metadata" contract in this package.

So `deleteBySource` requires a source-to-chunk resolver:

```ts
const recall = createUpstashRecallStore(index, {
  environment: "prod",
  resolveChunkIdsBySource: async ({ projectId, sourceType, sourceId }) => {
    return chunkRegistry.findIdsBySource({ projectId, sourceType, sourceId });
  }
});
```

This matches TekMemo's architecture: the chunk registry should know which chunks came from each `.tekmemo/` source.

---

## Edge cases handled;

- Invalid Upstash client shape
- Unsafe namespaces
- Unsafe tenant/project IDs
- Invalid batch sizes
- Invalid dimensions
- Missing embeddings
- NaN / Infinity embeddings via `@tekmemo/recall`
- Duplicate document IDs in a batch
- Document-level namespace grouping
- Provider upsert failures
- Provider query failures
- Provider delete failures
- Non-array query responses
- Unsafe delete IDs
- Delete deduplication
- Delete batching
- `deleteBySource` without resolver
- Source resolver failures
- Metadata normalization
- Reserved metadata keys
- Filter escaping
- Required tenant/project isolation filters

---

## Troubleshooting;

### Common Upstash errors;

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid token | Check `UPSTASH_VECTOR_REST_TOKEN` |
| `404 Not Found` | Invalid URL | Check `UPSTASH_VECTOR_REST_URL` |
| `413 Payload Too Large` | Batch too large | Reduce batch size (max 1000) |
| `422 Unprocessable Entity` | Dimension mismatch | Ensure `dimension` matches embedding model |
| `429 Too Many Requests` | Rate limited | Implement retry logic (built-in) |

### Dimension mismatch;

```ts
// If using OpenAI text-embedding-3-small (1536 dims by default)
createUpstashRecallStore(index, {
  dimension: 1536  // or 1024 with outputDimension
});

// If using Voyage voyage-4-lite (1024 dims)
createUpstashRecallStore(index, {
  dimension: 1024
});
```

---

## Testing;

```bash
# Typecheck
pnpm --filter @tekmemo/upstash-vector typecheck

# Run tests
pnpm --filter @tekmemo/upstash-vector test:run

# Build
pnpm --filter @tekmemo/upstash-vector build
```

---

## Package boundary;

**This package owns:**
- Upstash Vector implementation of `RecallStore`
- Namespace generation and isolation
- Batch splitting for Upstash limits
- Retry logic for Upstash API
- `deleteBySource` resolver pattern

**This package does NOT own:**
- Recall contracts (see `@tekmemo/recall`)
- Embedding generation (see `@tekmemo/openai`, `@tekmemo/voyageai`)
- Reranking (see `@tekmemo/rerank`, `@tekmemo/rerank-voyage`)
- Cloud billing
- Cloud tenancy
- BYOK encryption

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Vector recall contracts
- `@tekmemo/openai` — OpenAI embeddings
- `@tekmemo/voyageai` — Voyage AI embeddings
- `@tekmemo/rerank` — Reranking contracts
