---
title: Installation
description: Install TekMemo packages for local, hosted, semantic, and agent memory workflows.
---

# Installation

TekMemo is split into small packages. Install only the packages your app needs.

## Local-only runtime

```sh
npm install tekmemo @tekmemo/fs
```

Use this when you want zero-cost local memory files.

## AI SDK integration

```sh
npm install tekmemo @tekmemo/fs @tekmemo/ai-sdk
```

Use this when you want an AI SDK-compatible memory tool and prompt memory injection helpers.

## Semantic recall with Upstash and embeddings

```sh
npm install tekmemo @tekmemo/upstash-vector @tekmemo/openai
```

or:

```sh
npm install tekmemo @tekmemo/upstash-vector @tekmemo/voyageai
```

Use this when you want vector recall with your own provider keys and vector index.

## Syncable filesystem adapter

```sh
npm install tekmemo @tekmemo/agentfs
```

Use this when you want a portable filesystem-like backend with pull, push, checkpoint, and lease hooks.

## Future packages

These packages are part of the long-term implementation plan:

```sh
npm install @tekmemo/mcp
npm install @tekmemo/graph
npm install @tekmemo/connectors
npm install @tekmemo/cli
```

They are documented now so the public architecture stays stable before every package is shipped.

## Recommended package order

| Stage | Packages | Why |
| :--- | :--- | :--- |
| 1 | `tekmemo`, `@tekmemo/fs` | Local memory with no hosted cost. |
| 2 | `@tekmemo/ai-sdk` | Safe memory tools for model calls. |
| 3 | `@tekmemo/openai` or `@tekmemo/voyageai` | Embeddings for semantic recall. |
| 4 | `@tekmemo/upstash-vector` | Vector storage and scoped query. |
| 5 | `@tekmemo/agentfs` | Syncable memory backend. |
| 6 | `@tekmemo/mcp`, `@tekmemo/graph`, `@tekmemo/connectors` | Advanced ecosystem integrations. |
