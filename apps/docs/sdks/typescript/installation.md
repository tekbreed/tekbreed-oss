---
title: TypeScript Installation
description: Install TekMemo packages in a TypeScript project.
---

# Installation

Install the core runtime and local filesystem adapter first:

```sh
pnpm add tekmemo @tekmemo/fs
```

Add AI SDK helpers when your app uses the Vercel AI SDK:

```sh
pnpm add @tekmemo/ai-sdk
```

Add recall providers only when semantic retrieval is needed:

```sh
pnpm add @tekmemo/recall @tekmemo/upstash-vector @tekmemo/openai
```

TekMemo packages are TypeScript-first, ESM, and designed for Node 22 or modern TypeScript runtimes.
