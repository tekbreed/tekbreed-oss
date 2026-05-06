---
title: Packages
description: Public package reference for TekMemo OSS packages.
---

# Packages

TekMemo packages let developers start with local file memory and add integrations only when needed.

This section is for **using** the packages. It does not include internal package implementation plans.

## Current packages

| Package | Use when you need |
| :--- | :--- |
| `tekmemo` | Core `.tekmemo/` runtime, memory commands, events, chunks, and local search contracts. |
| `@tekmemo/fs` | Local Node filesystem-backed memory for free testing. |
| `@tekmemo/ai-sdk` | Safe memory tools and prompt context helpers for AI SDK apps. |
| `@tekmemo/agentfs` | Syncable filesystem-like storage adapter. |
| `@tekmemo/recall` | Semantic recall orchestration over your chosen embedding and vector providers. |
| `@tekmemo/rerank` | Reranking contracts for retrieval pipelines. |
| `@tekmemo/rerank-voyage` | Voyage AI-backed reranking adapter. |
| `@tekmemo/upstash-vector` | Upstash Vector-backed semantic recall. |
| `@tekmemo/voyageai` | Voyage AI embedding adapter. |
| `@tekmemo/openai` | OpenAI embedding adapter. |

## Planned packages

These are part of the public roadmap and will get user docs when they are ready:

- `@tekmemo/cli`
- `@tekmemo/mcp`
- `@tekmemo/graph`
- `@tekmemo/connectors`

## Recommended install path

Start with the free local stack:

```sh
npm install tekmemo @tekmemo/fs
```

Then add AI SDK support:

```sh
npm install @tekmemo/ai-sdk
```

Add semantic recall only when you are ready to bring your own providers:

```sh
npm install @tekmemo/upstash-vector @tekmemo/openai
# or
npm install @tekmemo/upstash-vector @tekmemo/voyageai
```

<AdSlot placement="packages-overview" />
