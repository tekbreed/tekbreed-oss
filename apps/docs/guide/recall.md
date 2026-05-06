---
title: Recall
description: How semantic recall fits into TekMemo's file-first runtime.
---

# Recall

Recall turns memory records into retrievable context for agents and AI applications.

TekMemo keeps recall modular: the core runtime owns records and memory files, while provider packages handle embeddings, vector storage, and optional reranking.

## Local-first path

Start with `tekmemo` and `@tekmemo/fs` to validate memory behavior. Add recall only when your app needs semantic retrieval over larger memory sets.

## Provider path

Use `@tekmemo/recall` with provider adapters such as:

| Package | Role |
| :--- | :--- |
| `@tekmemo/openai` | OpenAI embeddings. |
| `@tekmemo/voyageai` | Voyage AI embeddings. |
| `@tekmemo/upstash-vector` | Upstash Vector storage. |
| `@tekmemo/rerank` | Provider-neutral reranking contracts. |
| `@tekmemo/rerank-voyage` | Voyage AI reranking. |
