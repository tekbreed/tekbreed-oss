---
title: Configuration
description: Configure TekMemo stores, scopes, indexing, providers, and hosted TypeScript apps.
---

# Configuration

TekMemo configuration should be explicit and portable. Local apps can keep config in code, `.tekmemo/config.json`, or environment variables.

## Local filesystem store

```ts
import { createNodeFsMemoryStore } from '@tekmemo/fs'

const store = createNodeFsMemoryStore({
  rootDir: process.cwd(),
  memoryDirName: '.tekmemo'
})
```

## Store scopes

Scopes help isolate memory.

```ts
type MemoryScope = 'user' | 'workspace' | 'project' | 'agent' | 'session' | 'policy'
```

Use project memory for app/repo-specific context. Use user memory for individual preferences. Use session memory for temporary run state.

## Embedding provider config

```ts
import { OpenAIEmbedder } from '@tekmemo/openai'

const embedder = new OpenAIEmbedder(openaiClient, {
  model: 'text-embedding-3-small',
  dimensions: 1024,
  batchSize: 32
})
```

## Vector adapter config

```ts
import { UpstashVectorStore } from '@tekmemo/upstash-vector'

const vectorStore = new UpstashVectorStore(upstashIndex, {
  environment: 'development',
  namespacePrefix: 'tekmemo'
})
```

## Recommended environment variables

```txt
TEKMEMO_ROOT=.tekmemo
TEKMEMO_ENV=development
TEKMEMO_VECTOR_NAMESPACE=tekmemo-development
OPENAI_API_KEY=...
VOYAGE_API_KEY=...
UPSTASH_VECTOR_REST_URL=...
UPSTASH_VECTOR_REST_TOKEN=...
```

## Provider config

Provider keys should come from your hosting platform's secret manager or local environment.

```txt
OPENAI_API_KEY=...
VOYAGE_API_KEY=...
UPSTASH_VECTOR_REST_URL=...
UPSTASH_VECTOR_REST_TOKEN=...
```

Do not commit provider API keys to source control.
