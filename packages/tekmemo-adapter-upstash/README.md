<p align="center">
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-adapter-upstash"><img src="https://img.shields.io/npm/v/%40tekbreed%2Ftekmemo-adapter-upstash?label=%40tekbreed%2Ftekmemo-adapter-upstash&style=for-the-badge" alt="npm version" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/tekmemo"><img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" /></a> &nbsp; 
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-adapter-upstash"><img src="https://img.shields.io/npm/dm/%40tekbreed%2Ftekmemo-adapter-upstash?style=for-the-badge" alt="npm downloads" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/tekmemo/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/tekbreed/tekmemo/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI" /></a> &nbsp; 
  <a href="https://docs.memo.tekbreed.com/packages/tekmemo/"><img src="https://img.shields.io/badge/docs-online-blue?style=for-the-badge" alt="Docs" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/tekmemo/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
</p>

# `@tekbreed/tekmemo-adapter-upstash`

## What is this?

**Upstash Vector Recall Store adapter for TekMemo.** Provides a serverless, HTTP-based vector database integration through TekMemo's provider-neutral recall store contract. Built on Upstash Vector for low-latency, scalable vector search without infrastructure management.

## Installation

```bash
npm install @tekbreed/tekmemo-adapter-upstash
```

You also need an Upstash Vector index from [console.upstash.com](https://console.upstash.com/).

## Quick Start

```ts
import { createUpstashRecallStore } from "@tekbreed/tekmemo-adapter-upstash";
import { createOpenAIEmbedder } from "@tekbreed/tekmemo-adapter-openai";

const embedder = createOpenAIEmbedder({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "text-embedding-3-large",
});

const recallStore = createUpstashRecallStore(
  {
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!,
  },
  embedder
);

// Store memories with embeddings
await recallStore.upsert([
  {
    id: "mem-1",
    content: "TekMemo provides unified memory runtime",
    metadata: { source: "docs", tags: ["memory", "ai"] },
  },
  {
    id: "mem-2",
    content: "Upstash Vector is serverless vector search",
    metadata: { source: "blog", tags: ["vector", "serverless"] },
  },
]);

// Query similar memories
const results = await recallStore.query({
  query: "memory runtime for agents",
  topK: 5,
  filter: { tags: { $contains: "memory" } },
});

console.log(results); // RecallResult[] with scores and metadata
```

## Configuration

### Recall Store Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | **required** | Upstash Vector index URL |
| `token` | `string` | **required** | Upstash Vector REST token |
| `namespace` | `string` | `"default"` | Logical namespace for multi-tenancy |
| `dimensions` | `number` | embedder output | Vector dimensions (must match embedder) |

### Filter Builder

```ts
import { createFilterBuilder } from "@tekbreed/tekmemo-adapter-upstash";

const filter = createFilterBuilder()
  .eq("source", "docs")
  .contains("tags", "memory")
  .gte("timestamp", Date.now() - 86400000)
  .build();

// { source: "docs", tags: { $contains: "memory" }, timestamp: { $gte: ... } }
```

Supported operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$contains`, `$in`, `$nin`

### Metadata Helpers

```ts
import { createMetadata, extractMetadata } from "@tekbreed/tekmemo-adapter-upstash";

const metadata = createMetadata({
  source: "github",
  tags: ["typescript", "memory"],
  author: "user-123",
  timestamp: Date.now(),
});

// Automatically converts to Upstash-compatible format
```

## Integration with TekMemo Core

```ts
import { bootstrapMemoryStore } from "@tekbreed/tekmemo";
import { createUpstashRecallStore } from "@tekbreed/tekmemo-adapter-upstash";
import { createVoyageEmbedder } from "@tekbreed/tekmemo-adapter-voyage";

const store = await bootstrapMemoryStore({ rootDir: "./.tekmemo" });

const embedder = createVoyageEmbedder({
  apiKey: process.env.VOYAGE_API_KEY!,
  model: "voyage-3-large",
});

const recallStore = createUpstashRecallStore(
  {
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!,
    namespace: "production",
  },
  embedder
);

// Full TekMemo integration
```

## Namespaces for Multi-Tenancy

```ts
const userStore = createUpstashRecallStore(
  {
    url: process.env.UPSTASH_VECTOR_URL!,
    token: process.env.UPSTASH_VECTOR_TOKEN!,
    namespace: `user-${userId}`,
  },
  embedder
);

// Isolated vector space per user/tenant
```

## Testing

The package exports a fake Upstash index for testing:

```ts
import { createFakeUpstashIndex } from "@tekbreed/tekmemo-adapter-upstash/testing";

const fakeIndex = createFakeUpstashIndex({
  vectors: [
    { id: "1", vector: [0.1, 0.2], metadata: { text: "test" } },
  ],
  queryResults: [
    { id: "1", score: 0.95, metadata: { text: "test" } },
  ],
});
```

## Boundary

This package owns the Upstash Vector recall store adapter implementation. It does not own the TekMemo core contracts, embedder adapters, or the Upstash Vector service itself.

## Contributing

See our central [Contributing Guide](../../CONTRIBUTING.md) and development scripts for details on formatting, linting, and testing within the monorepo.

## License

MIT