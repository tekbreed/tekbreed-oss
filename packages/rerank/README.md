# `@tekmemo/rerank`

Provider-neutral reranking contracts and utilities for TekMemo.

This package defines the interface that provider adapters implement, such as:

- `@tekmemo/rerank-voyage`
- `@tekmemo/rerank-cohere`
- `@tekmemo/rerank-jina`

It does **not** call any provider API.

## Install

```bash
pnpm add @tekmemo/rerank
```

## Usage

```ts
import { createDeterministicFallbackReranker } from "@tekmemo/rerank";

const reranker = createDeterministicFallbackReranker();

const results = await reranker.rerank({
  query: "memory architecture",
  documents: [
    { id: "doc_1", text: "TekMemo uses file-first memory." },
    { id: "doc_2", text: "Billing lives in the cloud app." }
  ],
  topK: 1
});
```

## Package boundary

This package owns:

- reranking interfaces
- input validation
- deterministic result sorting
- metadata safety checks
- fallback reranker for tests/local dev
- fake reranker for adapter tests

It does not own:

- Voyage/Cohere/Jina API calls
- vector recall
- embeddings
- billing
- cloud BYOK encryption
