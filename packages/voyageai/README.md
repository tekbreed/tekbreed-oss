# `@tekmemo/voyageai`

Production-ready Voyage AI embedding adapter for TekMemo.

This package is intentionally **provider-specific** and **BYOK-ready**. It accepts a Voyage API key from the host application and does not store secrets.

## Install

```bash
pnpm add @tekmemo/voyageai
```

## Quickstart

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
```

## Query vs document embeddings

Use `inputType: "document"` when embedding memory chunks.

Use `inputType: "query"` when embedding a user query for recall.

```ts
await embedder.embedTexts({
  texts: ["What did we decide about memory?"],
  inputType: "query"
});
```

## BYOK

```ts
createVoyageEmbedder({
  apiKey: userProvidedVoyageKey,
  model: "voyage-4-lite"
});
```

The package does not persist or log keys.

## Production features

- REST client for `POST /v1/embeddings`
- BYOK-ready config
- model and output dimension validation
- batch splitting
- retry with exponential backoff and optional jitter
- timeout handling
- response shape validation
- embedding count validation
- finite-number vector validation
- fake Voyage client for tests

## What this package does not own

- vector storage
- recall store contracts
- Upstash/Turso/Qdrant/Pinecone integrations
- reranking
- billing
- cloud BYOK encryption
