# TekMemo — Docs Structure for Expanded Packages

## 1. Docs app structure

```txt
docs/
├─ index.md
├─ getting-started.md
├─ concepts/
│  ├─ file-first-memory.md
│  ├─ recall.md
│  ├─ reranking.md
│  ├─ byok.md
│  └─ oss-vs-cloud.md
├─ packages/
│  ├─ tekmemo.md
│  ├─ fs.md
│  ├─ ai-sdk.md
│  ├─ agentfs.md
│  ├─ voyage.md
│  ├─ openai.md
│  ├─ recall.md
│  ├─ upstash.md
│  ├─ turso-vector.md
│  ├─ qdrant.md
│  ├─ pinecone.md
│  ├─ rerank.md
│  ├─ rerank-voyage.md
│  ├─ rerank-cohere.md
│  ├─ rerank-jina.md
│  ├─ graph.md
│  ├─ connectors.md
│  ├─ mcp.md
│  ├─ cli.md
│  ├─ benchmark-kit.md
│  └─ observability.md
├─ guides/
│  ├─ local-memory.md
│  ├─ ai-sdk-memory-tool.md
│  ├─ upstash-recall.md
│  ├─ turso-vector-recall.md
│  ├─ recall-with-reranking.md
│  ├─ byok-setup.md
│  └─ cloud-beta.md
├─ api/
│  ├─ cloud-api.md
│  ├─ api-keys.md
│  └─ webhooks.md
├─ changelog.md
└─ blog/
```

---

# 2. Standard package docs template

Each package page should include:

```md
# Package Name

## Purpose

## Installation

## Quickstart

## Core API

## Configuration

## BYOK support

## Edge cases handled

## Testing

## When to use this package

## When not to use this package
```

---

# 3. First docs to publish

Publish these first:

```txt
getting-started.md
concepts/file-first-memory.md
concepts/recall.md
concepts/reranking.md
concepts/byok.md
packages/tekmemo.md
packages/fs.md
packages/ai-sdk.md
packages/recall.md
packages/upstash.md
packages/rerank.md
packages/rerank-voyage.md
guides/recall-with-reranking.md
guides/byok-setup.md
```
