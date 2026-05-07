# @tekmemo/openai

[![npm version](https://img.shields.io/npm/v/@tekmemo/openai.svg)](https://www.npmjs.com/package/@tekmemo/openai)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/openai.svg)](https://www.npmjs.com/package/@tekmemo/openai)
[![license](https://img.shields.io/npm/l/@tekmemo/openai.svg)](https://www.npmjs.com/package/@tekmemo/openai)

Production-ready OpenAI embedding adapter for TekMemo.

This package is intentionally **provider-specific** and **BYOK-ready**. It accepts an OpenAI API key from the host application and does not store secrets.

## Installation;

```bash
pnpm add @tekmemo/openai
```

`@tekmemo/openai` uses the official `openai` SDK for production API calls and keeps a small injectable embeddings-client interface for tests and custom hosts.

## Quickstart;

```ts
import { createOpenAIEmbedder } from "@tekmemo/openai";

const embedder = createOpenAIEmbedder({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "text-embedding-3-small",
  dimensions: 1024
});

const result = await embedder.embedTexts({
  texts: ["TekMemo is file-first memory infrastructure."]
});

console.log(result.embeddings[0]?.embedding);
// [-0.01, 0.02, ...] - embedding vector
```

---

## API reference

### `createOpenAIEmbedder(options)` → `OpenAIEmbedder`

Creates an OpenAI embedding client:

```ts
import { createOpenAIEmbedder } from "@tekmemo/openai";

const embedder = createOpenAIEmbedder({
  // Required
  apiKey: process.env.OPENAI_API_KEY!,

  // Optional
  model: "text-embedding-3-small",  // default: "text-embedding-3-small"
  dimensions: 1024,                  // default: undefined (use model default)
  baseURL: "https://...",             // default: OpenAI default
  timeoutMs: 60_000,                  // default: 60_000 (60 seconds)
  maxRetries: 3,                      // default: SDK default
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
  inputType: "document"  // optional: "document" | "query" (for some models)
});

// result.embeddings - Array of { id, embedding, text? }
// result.usage - Token usage info (if available)
```

### Options;

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | required | OpenAI API key |
| `model` | `string` | `"text-embedding-3-small"` | OpenAI embedding model |
| `dimensions` | `number` | `undefined` | Reduce dimensions (v3 models only) |
| `baseURL` | `string` | OpenAI default | Custom base URL |
| `timeoutMs` | `number` | `60_000` | Request timeout in milliseconds |
| `maxRetries` | `number` | SDK default | Max retry attempts |

---

## Recommended TekMemo defaults;

For most TekMemo recall flows:

```ts
createOpenAIEmbedder({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "text-embedding-3-small",
  dimensions: 1024
});
```

OpenAI's embedding guide says:
- `text-embedding-3-small` defaults to 1536 dimensions
- `text-embedding-3-large` defaults to 3072 dimensions
- The `dimensions` parameter can reduce those vector sizes for compatible v3 embedding models

## Supported models;

| Model | Default dimensions | Max dimensions |
|-------|-------------------|----------------|
| `text-embedding-3-small` | 1536 | 1536 (can reduce) |
| `text-embedding-3-large` | 3072 | 3072 (can reduce) |
| `text-embedding-ada-002` | 1536 | 1536 (fixed) |

---

## BYOK (Bring Your Own Key);

```ts
createOpenAIEmbedder({
  apiKey: userProvidedOpenAIKey,  // From user or config
  model: "text-embedding-3-small"
});
```

The package does not persist, encrypt, or log keys. TekMemo Cloud BYOK storage belongs in closed-source cloud code.

---

## Testing;

The package includes a fake OpenAI client for unit tests:

```ts
import { createFakeOpenAIClient } from "@tekmemo/openai/testing";

const fakeClient = createFakeOpenAIClient({
  embeddings: [
    [0.1, 0.2, 0.3],  // for first text
    [0.4, 0.5, 0.6],  // for second text
  ]
});

const embedder = createOpenAIEmbedder({
  apiKey: "fake-key",
  model: "text-embedding-3-small"
});

// Inject fake client (implementation detail - may vary)
```

---

## Production features;

- Official OpenAI SDK client for embeddings
- BYOK-ready config
- Model and dimension validation
- Batch splitting (OpenAI has request limits)
- SDK retry/timeout support
- Response shape validation
- Embedding count validation
- Finite-number vector validation
- Fake OpenAI client for unit tests

---

## Error handling;

```ts
import { OpenAIEmbedderError } from "@tekmemo/openai";

try {
  const result = await embedder.embedTexts({ texts: ["..."] });
} catch (error) {
  if (error instanceof OpenAIEmbedderError) {
    console.error("Embedding failed:", error.message);
    console.error("Status:", error.status);      // HTTP status if available
    console.error("Code:", error.code);            // Error code if available
  }
}
```

---

## What this package does NOT own;

- `.tekmemo/` file protocol
- Vector storage (see `@tekmemo/recall` + `@tekmemo/upstash-vector`)
- Recall store contracts (see `@tekmemo/recall`)
- Reranking (see `@tekmemo/rerank`)
- Billing
- Cloud BYOK encryption
- Tenant/provider routing

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Vector recall contracts
- `@tekmemo/upstash-vector` — Upstash Vector adapter
- `@tekmemo/voyageai` — Alternative embedding adapter
