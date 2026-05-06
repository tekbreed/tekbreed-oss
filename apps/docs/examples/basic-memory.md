---
title: Basic Memory
description: Minimal TekMemo memory example.
---

# Basic Memory

Use this example when you want the smallest TypeScript setup: core runtime plus local filesystem persistence.

```sh
pnpm add tekmemo @tekmemo/fs
```

Create a local `.tekmemo/` store, write scoped memory records, and read them back when composing agent context.
