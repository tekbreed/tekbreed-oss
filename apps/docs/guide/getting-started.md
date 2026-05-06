---
title: Getting Started
description: Install TekMemo and create your first local memory store.
---

# Getting Started

This guide creates a local TekMemo memory store backed by files. It does not require hosted infrastructure, a vector database, or an embedding provider.

## Install

```sh
npm install tekmemo @tekmemo/fs
```

## Create a memory store

```ts
import { bootstrapMemoryStore, readCoreMemory } from 'tekmemo'
import { createNodeFsMemoryStore } from '@tekmemo/fs'

const store = createNodeFsMemoryStore({
  rootDir: process.cwd(),
  memoryDirName: '.tekmemo'
})

await bootstrapMemoryStore(store)

const coreMemory = await readCoreMemory(store)
console.log(coreMemory)
```

Behind the scenes, TekMemo creates a `.tekmemo/` folder with canonical memory files.

```txt
.tekmemo/
├─ manifest.json
├─ config.json
├─ memory/
│  ├─ core.md
│  ├─ notes.md
│  ├─ facts.jsonl
│  ├─ preferences.jsonl
│  ├─ procedures.jsonl
│  └─ policies.jsonl
├─ conversations/
│  └─ conversations.jsonl
├─ events/
│  └─ memory-events.jsonl
├─ indexes/
│  ├─ chunks.jsonl
│  ├─ keyword.json
│  └─ vector-manifest.json
├─ graph/
├─ snapshots/
└─ sync/
```

## Write a note

```ts
import { appendTimestampedNote } from 'tekmemo'

await appendTimestampedNote(store, {
  timestamp: new Date().toISOString(),
  kind: 'decision',
  content: 'Use TekMemo local file memory for the first prototype.',
  tags: ['architecture', 'prototype'],
  confidence: 1
})
```

## Record a conversation entry

```ts
import { appendConversationEntry } from 'tekmemo'

await appendConversationEntry(store, {
  timestamp: new Date().toISOString(),
  role: 'user',
  content: 'Remember that this project uses React Router v7.'
})
```

## Add AI SDK integration

```sh
npm install @tekmemo/ai-sdk
```

```ts
import { buildMemoryToolDefinition } from '@tekmemo/ai-sdk'

const memoryTool = buildMemoryToolDefinition({ store })
```

The tool lets a model safely view, create, update, and search memory through structured commands. It does not expose arbitrary file or shell access.

## Next steps

- Use [Free Local Testing](/guide/local-testing) to test without hosted cost.
- Read [Package Docs](/packages/) to understand package responsibilities.
- Add [BYO Provider Recall](/examples/byo-provider) when you need semantic search.
- Read [Hosting](/hosting/) before deploying TekMemo-backed apps.
