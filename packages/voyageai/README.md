# @tekmemo/voyageai

[![npm version](https://img.shields.io/npm/v/@tekmemo/voyageai.svg)](https://www.npmjs.com/package/@tekmemo/voyageai)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/voyageai.svg)](https://www.npmjs.com/package/@tekmemo/voyageai)
[![license](https://img.shields.io/npm/l/@tekmemo/voyageai.svg)](https://www.npmjs.com/package/@tekmemo/voyageai)

Production-ready Voyage AI embedding adapter for TekMemo.

This package is intentionally **provider-specific** and **BYOK-ready**. It accepts a Voyage API key from the host application and does not store secrets.

## Installation;

```bash
pnpm add @tekmemo/voyageai
```

## Quickstart;

```ts
import { createVoyageEmbedder } from "@tekmemo/voyageai";

const embedder = createVoyageEmbedder({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: "voyage-4-lite",
  outputDimension: 1024
});

const result = await embedder.embedTexts({
  texts: ["TekMemo is file-first memory infrastructure."],
  inputType: "document"
});

console.log(result.embeddings[0]?.embedding);
// [-0.01, 0.02, ...] - embedding vector
```

---

## API reference

### `createVoyageEmbedder(options)` → `VoyageEmbedder`

Creates a Voyage AI embedding client:

```ts
import { createVoyageEmbedder } from "@tekmemo/voyageai";

const embedder = createVoyageEmbedder({
  // Required
  apiKey: process.env.VOYAGE_API_KEY!,

  // Optional
  model: "voyage-4-lite",        // default: "voyage-4-lite"
  outputDimension: 1024,          // default: undefined (model default)
  baseURL: "https://...",           // default: Voyage API
  timeoutMs: 60_000,                // default: 60_000
  maxRetries: 3,                    // default: 3
});
```

### `embedTexts(input)` → `Promise<EmbedResult>`

Generate embeddings for texts:

```ts
const result = await embedder.embedTexts({
  texts: [
    "TekMemo uses file-first memory.",
    "Local-first architecture is key."
  ],
  inputType: "document"  // "document" | "query" - affects embedding quality
});

// result.embeddings - Array of { id, embedding, text? }
// result.usage - Token usage info
```

### Options;

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | required | Voyage AI API key |
| `model` | `string` | `"voyage-4-lite"` | Voyage embedding model |
| `outputDimension` | `number` | `undefined` | Reduce output dimensions |
| `baseURL` | `string` | Voyage default | Custom base URL |
| `timeoutMs` | `number` | `60_000` | Request timeout |
| `maxRetries` | `number` | `3` | Max retry attempts |

---

## Query vs document embeddings

Use `inputType: "document"` when embedding memory chunks (for storage/recall).

Use `inputType: "query"` when embedding a user query for recall.

```ts
// Embed documents (for storage)
await embedder.embedTexts({
  texts: ["Memory chunk 1", "Memory chunk 2"],
  inputType: "document"
});

// Embed query (for search)
await embedder.embedTexts({
  texts: ["What did we decide about memory?"],
  inputType: "query"
});
```

---

## Supported models;

| Model | Dimensions | Description |
|-------|-------------|-------------|
| `voyage-4-lite` | 1024 | Fast, cost-effective |
| `voyage-4` | 1024 | Higher quality |
| `voyage-3-lite` | 512 | Legacy lite model |
| `voyage-3` | 512 | Legacy model |
| `voyage-2` | 1024 | Legacy model |

Check [Voyage AI docs](https://docs.voyageai.com) for latest models and dimensions.

---

## BYOK (Bring Your Own Key);

```ts
createVoyageEmbedder({
  apiKey: userProvidedVoyageKey,  // From user or config
  model: "voyage-4-lite"
});
```

The package does not persist or log keys.

---

## Testing;

The package includes a fake Voyage client for unit tests:

```ts
import { createFakeVoyageClient } from "@tekmemo/voyageai/testing";

const fakeClient = createFakeVoyageClient({
  embeddings: [
    [0.1, 0.2, 0.3],
    [0.4, 0.5, 0.6],
  ]
});
```

---

## Production features;

- REST client for `POST /v1/embeddings`
- BYOK-ready config
- Model and output dimension validation
- Batch splitting (Voyage has request limits)
- Retry with exponential backoff and optional jitter
- Timeout handling
- Response shape validation
- Embedding count validation
- Finite-number vector validation
- Fake Voyage client for tests

---

## Error handling;

```ts
import { VoyageEmbedderError } from "@tekmemo/voyageai";

try {
  const result = await embedder.embedTexts({ texts: ["..."] });
} catch (error) {
  if (error instanceof VoyageEmbedderError) {
    console.error("Embedding failed:", error.message);
    console.error("Status:", error.status);
  }
}
```

---

## What this package does NOT own;

- Vector storage (see `@tekmemo/recall` + `@tekmemo/upstash-vector`)
- Recall store contracts (see `@tekmemo/recall`)
- Upstash/Turso/Qdrant/Pinecone integrations
- Reranking (see `@tekmemo/rerank`)
- Billing
- Cloud BYOK encryption

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Vector recall contracts
- `@tekmemo/upstash-vector` — Upstash Vector adapter
- `@tekmemo/openai` — Alternative embedding adapter
