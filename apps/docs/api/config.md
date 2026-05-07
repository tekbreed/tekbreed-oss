---
title: Config API
description: Configure local memory, recall, provider adapters, and hosted TypeScript apps.
---

# Configuration

TekMemo does not support config files in the current release.

There is currently no `tekmemo.config.ts`, `tekmemo.config.js`, or `tekmemo/config` export.

Configure TekMemo directly in code when creating stores, embedders, rerankers, and recall adapters.

## Example

```ts
import { bootstrapMemoryStore } from "tekmemo";
import { createNodeFsMemoryStore } from "@tekmemo/fs";

const store = createNodeFsMemoryStore({
  rootDir: process.cwd(),
});

await bootstrapMemoryStore(store);
```

## Planned

A config file API may be added later if it becomes necessary for CLI, framework, or cloud-sync workflows.

