---
title: OpenAI Embedder
description: Use @tekmemo/openai to generate embeddings with OpenAI.
---

# `@tekmemo/openai`

Use this package to turn memory text into vectors with OpenAI embeddings.

## Install

```sh
npm install @tekmemo/openai
```

## Example

```ts
import { OpenAIEmbedder } from "@tekmemo/openai";

const embedder = new OpenAIEmbedder(client, {
  model: "text-embedding-3-small",
  dimensions: 1024,
});
```

Pair this with `@tekmemo/upstash-vector` or another vector store adapter.
