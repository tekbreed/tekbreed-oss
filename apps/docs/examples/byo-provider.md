---
title: BYO Provider Example
description: Use TekMemo semantic recall with your own embedding provider and vector store.
---

# BYO Provider Example

BYO-provider mode lets you test semantic recall without TekMemo paying for your embeddings or vector index.

```sh
npm install tekmemo @tekmemo/upstash-vector @tekmemo/openai
```

```ts
import { OpenAIEmbedder } from '@tekmemo/openai'
import { UpstashVectorStore } from '@tekmemo/upstash-vector'

const embedder = new OpenAIEmbedder(openaiClient, {
  model: 'text-embedding-3-small',
  dimensions: 1024
})

const vectorStore = new UpstashVectorStore(upstashIndex, {
  environment: 'development',
  namespacePrefix: 'tekmemo'
})

const embedding = await embedder.embed([
  'TekMemo stores inspectable memory in a .tekmemo folder.'
])

await vectorStore.upsert([
  {
    id: 'chunk_1',
    text: 'TekMemo stores inspectable memory in a .tekmemo folder.',
    scope: 'project',
    projectId: 'proj_local',
    memoryType: 'note',
    sourcePath: 'memory/notes.md',
    version: 1,
    updatedAt: new Date().toISOString(),
    embedding: embedding.vectors[0]
  }
])
```

## Behind the scenes

```txt
source memory file
→ chunks
→ embeddings
→ vector upsert
→ scoped query
→ prompt-ready recall hits
```

The same pattern can later be moved behind your hosted application API if you do not want agents calling providers directly.
