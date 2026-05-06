---
title: Hono API Example
description: Use TekMemo from a Hono API route.
---

# Hono API Example

```sh
npm install hono tekmemo @tekmemo/fs
```

```ts
import { Hono } from 'hono'
import { bootstrapMemoryStore, readCoreMemory } from 'tekmemo'
import { createNodeFsMemoryStore } from '@tekmemo/fs'

const app = new Hono()

app.get('/memory/core', async (c) => {
  const store = createNodeFsMemoryStore({ rootDir: process.cwd() })
  await bootstrapMemoryStore(store)

  const core = await readCoreMemory(store)
  return c.json({ core })
})

export default app
```

For production, use tenant/project scoped stores and avoid sharing one local memory folder across unrelated users.
