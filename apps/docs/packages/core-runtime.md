---
title: Core Runtime
description: Public usage guide for the tekmemo core runtime.
---

# `tekmemo`

`tekmemo` is the core runtime. It owns the `.tekmemo/` memory standard and the contracts used by all adapters.

## Install

```sh
npm install tekmemo
```

## What it gives you

- memory file paths
- store contracts
- bootstrap helpers
- core memory helpers
- notes and conversation helpers
- memory event contracts
- chunk and recall contracts
- local keyword search contracts

## Example

```ts
import { bootstrapStore, readCoreMemory } from "tekmemo";

await bootstrapStore(store);
const core = await readCoreMemory(store);
```

Use `@tekmemo/fs` when you want a real local filesystem store.
