---
title: TypeScript Recall
description: Add semantic recall to a TekMemo TypeScript app.
---

# Recall

Recall is optional. Add it when your app needs semantic retrieval across many memory records.

## Provider-neutral pieces

Use `@tekmemo/recall` for retrieval orchestration and pair it with provider packages for embeddings, vector storage, and reranking.

```sh
pnpm add @tekmemo/recall @tekmemo/upstash-vector @tekmemo/openai
```

Swap `@tekmemo/openai` for `@tekmemo/voyageai` when Voyage embeddings fit your stack better.

Add `@tekmemo/rerank` and `@tekmemo/rerank-voyage` when you need a reranking pass after initial recall.
