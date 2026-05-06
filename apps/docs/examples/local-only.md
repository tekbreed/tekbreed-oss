---
title: Local Only Example
description: Run TekMemo locally with files and no cloud cost.
---

# Local Only Example

```sh
npm install tekmemo @tekmemo/fs
```

```ts
import {
  appendTimestampedNote,
  bootstrapMemoryStore,
  readCoreMemory,
  writeCoreMemory
} from 'tekmemo'
import { createNodeFsMemoryStore } from '@tekmemo/fs'

const store = createNodeFsMemoryStore({
  rootDir: process.cwd(),
  memoryDirName: '.tekmemo'
})

await bootstrapMemoryStore(store)

await writeCoreMemory(store, `# Core Memory

## Project
- The app is a support assistant.

## Constraints
- Never expose private customer data.
`)

await appendTimestampedNote(store, {
  timestamp: new Date().toISOString(),
  kind: 'decision',
  content: 'Use local TekMemo memory before enabling hosted sync.',
  tags: ['memory', 'local'],
  confidence: 1
})

console.log(await readCoreMemory(store))
```

This creates local files under `.tekmemo/`. You can inspect them with your editor, commit them to a test repo, or delete them without calling any hosted service.
