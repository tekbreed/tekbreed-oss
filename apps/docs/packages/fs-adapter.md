---
title: Local FS Adapter
description: Use @tekmemo/fs for zero-cost local file memory.
---

# `@tekmemo/fs`

Use this package when you want TekMemo memory stored locally in `.tekmemo/`.

## Install

```sh
npm install tekmemo @tekmemo/fs
```

## Example

```ts
import { bootstrapStore, readCoreMemory } from "tekmemo";
import { createNodeFsMemoryStore } from "@tekmemo/fs";

const store = createNodeFsMemoryStore({ rootDir: process.cwd() });
await bootstrapStore(store);
console.log(await readCoreMemory(store));
```

## Why this matters

This path lets developers test TekMemo without hosted services, vector databases, or embedding providers.
