# @tekmemo/rerank-voyage`

[![npm version](https://img.shields.io/npm/v/@tekmemo/rerank-voyage.svg)](https://www.npmjs.com/package/@tekmemo/rerank-voyage)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/rerank-voyage.svg)](https://www.npmjs.com/package/@tekmemo/rerank-voyage)
[![license](https://img.shields.io/npm/l/@tekmemo/rerank-voyage.svg)](https://www.npmjs.com/package/@tekmemo/rerank-voyage)

Voyage AI reranking adapter for TekMemo.

This package implements the provider-neutral `Ranker` interface from `@tekmemo/rerank`.

## Installation;

```bash
pnpm add @tekmemo/rerank @tekmemo/rerank-voyage
```

## Quickstart;

```ts
import { createVoyageRanker } from "@tekmemo/rerank-voyage";

const ranker = createVoyageRanker({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: "rerank-2.5-lite"
});

const results = await ranker.rerank({
  query: "memory architecture",
  documents: [
    { id: "doc_1", text: "TekMemo starts from .tekmemo files." },
    { id: "doc_2", text: "Billing is cloud-only." }
  ],
  topK: 1
});

console.log(results[0]?.id);     // "doc_1"
console.log(results[0]?.score);   // 0.92 (example score)
```

---

## API reference;

### `createVoyageRanker(options)` → `VoyageRanker`

Creates a Voyage AI reranker:

```ts
import { createVoyageRanker } from "@tekmemo/rerank-voyage";

const ranker = createVoyageRanker({
  // Required
  apiKey: process.env.VOYAGE_API_KEY!,

  // Optional
  model: "rerank-2.5-lite",  // default: "rerank-2.5-lite"
  baseURL: "https://...",        // default: Voyage API
  timeoutMs: 30_000,              // default: 30_000
  maxRetries: 3,                  // default: 3
});
```

### `rerank(query)` → `Promise<RankerResult[]>`

Rerank documents by relevance to query:

```ts
const results = await ranker.rerank({
  query: "memory architecture",
  documents: [
    { id: "doc_1", text: "..." },
    { id: "doc_2", text: "..." }
  ],
  topK: 10,                      // optional, default: 10
  namespace: "optional-namespace"  // optional
});

// results[0].id - Document ID
// results[0].index - Original index
// results[0].score - Relevance score (0-1)
```

---

## Supported models;

| Model | Description |
|-------|-------------|
| `rerank-2.5-lite` | Fast, cost-effective (default) |
| `rerank-2.5` | Higher quality |
| `rerank-2` | Legacy model |

Check [Voyage AI docs](https://docs.voyageai.com) for latest models.

---

## BYOK (Bring Your Own Key);

```ts
createVoyageRanker({
  apiKey: userProvidedVoyageKey,  // From user or config
  model: "rerank-2.5-lite"
});
```

The package does not persist or log keys.

---

## Production features;

- REST client for Voyage reranking API
- BYOK-ready config
- Model validation
- Batch splitting (for large document sets)
- Retry with exponential backoff
- Timeout handling
- Response shape validation
- Score validation
- Fake Voyage ranker for tests

---

## Error handling;

```ts
import { VoyageRankerError } from "@tekmemo/rerank-voyage";

try {
  const results = await ranker.rerank({...});
} catch (error) {
  if (error instanceof VoyageRankerError) {
    console.error("Reranking failed:", error.message);
    console.error("Status:", error.status);
  }
}
```

---

## Boundary;

**This package only calls Voyage reranking.**

**It does NOT own:**
- Vector recall (see `@tekmemo/recall`)
- Embeddings (see `@tekmemo/voyageai`, `@tekmemo/openai`)
- `.tekmemo/` protocol
- Billing
- Cloud BYOK encryption
- Tenant/provider routing

---

## Related packages;

- `@tekmemo/rerank` — Reranking contracts
- `@tekmemo/recall` — Vector recall
- `@tekmemo/voyageai` — Voyage embeddings
- `@tekmemo/openai` — OpenAI embeddings
