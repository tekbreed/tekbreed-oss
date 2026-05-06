# `@tekmemo/rerank-voyage`

Voyage AI reranking adapter for TekMemo.

This package implements the provider-neutral `Reranker` interface from `@tekmemo/rerank`.

## Install

```bash
pnpm add @tekmemo/rerank @tekmemo/rerank-voyage
```

## Usage

```ts
import { createVoyageReranker } from "@tekmemo/rerank-voyage";

const reranker = createVoyageReranker({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: "rerank-2.5-lite"
});

const results = await reranker.rerank({
  query: "memory architecture",
  documents: [
    { id: "doc_1", text: "TekMemo starts from .tekmemo files." },
    { id: "doc_2", text: "Billing is cloud-only." }
  ],
  topK: 1
});
```

## Boundary

This package only calls Voyage reranking.

It does not own:

- vector recall
- embeddings
- `.tekmemo/` protocol
- billing
- cloud BYOK encryption
- tenant/provider routing
