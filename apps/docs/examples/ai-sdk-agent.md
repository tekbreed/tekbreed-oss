---
title: AI SDK Agent Example
description: Add TekMemo memory tools to an AI SDK-style model call.
---

# AI SDK Agent Example

```sh
npm install tekmemo @tekmemo/fs @tekmemo/ai-sdk
```

```ts
import { bootstrapMemoryStore } from 'tekmemo'
import { createNodeFsMemoryStore } from '@tekmemo/fs'
import {
  buildMemoryToolDefinition,
  buildPrepareCallMemoryText
} from '@tekmemo/ai-sdk'

const store = createNodeFsMemoryStore({ rootDir: process.cwd() })
await bootstrapMemoryStore(store)

const memoryText = await buildPrepareCallMemoryText({
  baseInstructions: 'You are a helpful coding assistant.',
  stores: { workspace: store },
  retrievalPlan: {
    includeCore: true,
    includeRecall: false,
    maxRecallHits: 0
  }
})

const tools = {
  memory: buildMemoryToolDefinition({ store })
}

console.log(memoryText, tools)
```

The memory tool should only accept structured commands. It should never expose arbitrary filesystem access.
