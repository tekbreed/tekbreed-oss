---
title: Voyage AI Embedder
description: Use @tekmemo/voyageai to generate embeddings with Voyage AI.
---

# `@tekmemo/voyageai`

Use this package to turn memory text into vectors with Voyage AI.

## Install

```sh
npm install @tekmemo/voyageai
```

## Example

```ts
import { createVoyageEmbedder } from "@tekmemo/voyageai";

const embedder = createVoyageEmbedder({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: "voyage-4-lite",
  outputDimension: 1024,
});
```

Pair this with a vector store such as `@tekmemo/upstash-vector`.
