---
title: Runtime API
description: TekMemo core runtime API for memory stores, documents, commands, events, chunks, and recall contracts.
---

# Runtime API

The runtime API is framework-agnostic and provider-agnostic.

It owns the memory contracts. It does not own cloud billing, UI, vector provider logic, or AI SDK wiring.

## Memory store

```ts
export interface MemoryStore {
  read(path: MemoryFilePath): Promise<string>
  write(path: MemoryFilePath, content: string): Promise<void>
  append(path: MemoryFilePath, content: string): Promise<void>
  exists(path: MemoryFilePath): Promise<boolean>
}
```

## Bootstrap

```ts
import { bootstrapMemoryStore } from 'tekmemo'

await bootstrapMemoryStore(store)
```

## Core memory

```ts
import { readCoreMemory, writeCoreMemory } from 'tekmemo'

const core = await readCoreMemory(store)
await writeCoreMemory(store, '# Core Memory\n')
```

## Memory command

```ts
import { runMemoryCommand } from 'tekmemo'

await runMemoryCommand(store, {
  command: 'view',
  path: 'memory/core.md'
})
```

<AdSlot placement="runtime-api-after-command" />

## Adapter contracts

The runtime also exports shared contracts for embedders and vector stores so provider packages stay thin.
