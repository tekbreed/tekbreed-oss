# @tekmemo/rerank`

[![npm version](https://img.shields.io/npm/v/@tekmemo/rerank.svg)](https://www.npmjs.com/package/@tekmemo/rerank)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/rerank.svg)](https://www.npmjs.com/package/@tekmemo/rerank)
[![license](https://img.shields.io/npm/l/@tekmemo/rerank.svg)](https://www.npmjs.com/package/@tekmemo/rerank)

Provider-neutral reranking contracts and utilities for TekMemo.

This package defines the interface that provider adapters implement, such as:
- `@tekmemo/rerank-voyage`
- `@tekmemo/rerank-cohere` (future)
- `@tekmemo/rerank-jina` (future)

It does **not** call any provider API.

## Installation;

```bash
pnpm add @tekmemo/rerank
```

---

## API reference;

### `Ranker` interface;

```ts
import type { Ranker, RankerDocument, RankerQuery, RankerResult } from "@tekmemo/rerank";

interface Ranker {
  rerank(query: RankerQuery): Promise<RankerResult[]>;
}
```

### `RankerQuery`;

```ts
interface RankerQuery {
  query: string;                           // Query text
  documents: RankerDocument[];              // Documents to rerank
  topK?: number;                          // Max results (default: 10)
  namespace?: string;                       // Optional namespace
}
```

### `RankerDocument`;

```ts
interface RankerDocument {
  id: string;        // Document ID
  text: string;      // Document text
  metadata?: Record<string, unknown>;  // Optional metadata
}
```

### `RankerResult`;

```ts
interface RankerResult {
  id: string;        // Document ID
  index: number;     // Original index in input array
  score: number;     // Relevance score (0-1)
  metadata?: Record<string, unknown>;
}
```

---

## Deterministic fallback ranker;

Use the deterministic ranker for local tests, examples, and adapter contract tests.

```ts
import { createDeterministicFallbackRanker } from "@tekmemo/rerank";

const ranker = createDeterministicFallbackRanker();

const results = await ranker.rerank({
  query: "memory architecture",
  documents: [
    { id: "doc_1", text: "TekMemo uses file-first memory." },
    { id: "doc_2", text: "Billing lives in the cloud app." }
  ],
  topK: 1
});

// results[0].id = "doc_1" (better match for query)
// results[0].score = 0.85 (simulated score)
```

The deterministic ranker uses simple word-overlap scoring as a fallback when no provider is available.

---

## Testing;

The package includes a fake ranker for unit tests:

```ts
import { createFakeRanker } from "@tekmemo/rerank/testing";

const fakeRanker = createFakeRanker({
  // Optional: predefined results
  results: [
    { id: "doc_1", index: 0, score: 0.9 },
    { id: "doc_2", index: 1, score: 0.5 }
  ]
});

const results = await fakeRanker.rerank({
  query: "...",
  documents: [...]
});
```

---

## Package boundary;

**This package owns:**
- `Ranker` interface
- Input validation
- Deterministic result sorting
- Metadata safety checks
- Fallback ranker for tests/local dev
- Fake ranker for adapter tests

**This package does NOT own:**
- Voyage/Cohere/Jina API calls (see provider packages)
- Vector recall (see `@tekmemo/recall`)
- Embeddings (see `@tekmemo/openai`, `@tekmemo/voyageai`)
- Billing
- Cloud BYOK encryption

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Vector recall contracts
- `@tekmemo/rerank-voyage` — Voyage reranking adapter
- `@tekmemo/openai` — OpenAI embeddings
- `@tekmemo/voyageai` — Voyage embeddings
