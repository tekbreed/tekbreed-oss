# `@tekbreed/tekmemo-adapters`

`@tekbreed/tekmemo-adapters` is a convenience package that reexports all TekMemo adapter packages through a single install.

It lets you use one package for AI SDK, cloud, embedding, vector, and rerank integrations instead of installing each adapter individually.

## Install

```bash
npm install @tekbreed/tekmemo-adapters
```

Install the external peer packages only for the adapter families you use:

```bash
# Vercel AI SDK tools
npm install @tekbreed/tekmemo-adapters ai tekmemo @tekbreed/tekmemo-fs

# OpenAI embedding adapter
npm install @tekbreed/tekmemo-adapters openai

# Upstash Vector recall adapter
npm install @tekbreed/tekmemo-adapters @upstash/vector
```

VoyageAI embedding and rerank adapters use HTTP/fetch and do not require a provider SDK package.

## Import paths

Use subpath imports for the adapters you need:

```ts
import { buildRuntimeMemoryToolDefinition } from "@tekbreed/tekmemo-adapters/ai-sdk";
import { createTekMemoCloudClient } from "@tekbreed/tekmemo-adapters/cloud-client";
import { createOpenAIEmbedder } from "@tekbreed/tekmemo-adapters/openai";
import { createVoyageEmbedder } from "@tekbreed/tekmemo-adapters/voyageai";
import { createUpstashRecallStore } from "@tekbreed/tekmemo-adapters/upstash-vector";
import { createVoyageReranker } from "@tekbreed/tekmemo-adapters/rerank-voyage";
```

The root import provides metadata only:

```ts
import { adapterImportPaths, tekMemoAdapters } from "@tekbreed/tekmemo-adapters";
```

The root module does not load provider implementations, so optional peer dependencies like `ai`, `openai`, or `@upstash/vector` are only loaded when you import the matching subpath.

## Available adapters

| Import path | Reexports |
| --- | --- |
| `@tekbreed/tekmemo-adapters/ai-sdk` | `@tekbreed/tekmemo-ai-sdk` |
| `@tekbreed/tekmemo-adapters/cloud-client` | `@tekbreed/tekmemo-cloud-client` |
| `@tekbreed/tekmemo-adapters/openai` | `@tekbreed/tekmemo-openai` |
| `@tekbreed/tekmemo-adapters/openai/testing` | `@tekbreed/tekmemo-openai/testing` |
| `@tekbreed/tekmemo-adapters/upstash-vector` | `@tekbreed/tekmemo-upstash-vector` |
| `@tekbreed/tekmemo-adapters/voyageai` | `@tekbreed/tekmemo-voyageai` |
| `@tekbreed/tekmemo-adapters/voyageai/testing` | `@tekbreed/tekmemo-voyageai/testing` |
| `@tekbreed/tekmemo-adapters/rerank-voyage` | `@tekbreed/tekmemo-rerank-voyage` |
| `@tekbreed/tekmemo-adapters/rerank-voyage/testing` | `@tekbreed/tekmemo-rerank-voyage/testing` |

## When to use adapters vs direct packages

Use `@tekbreed/tekmemo-adapters` when you want a single first-party package for multiple integrations. Use the direct packages (e.g., `@tekbreed/tekmemo-openai`) when you want the smallest possible dependency footprint.
