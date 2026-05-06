---
title: Indexing and Recall
description: How TekMemo turns memory files into searchable local and semantic recall.
---

# Indexing and Recall

Recall should combine multiple strategies instead of relying only on vector search.

## Retrieval layers

| Strategy | Purpose |
| :--- | :--- |
| Keyword search | Free local testing and exact matches. |
| Vector search | Semantic recall for notes, conversations, and documents. |
| Metadata filters | Scope by project, user, session, memory type, and tags. |
| Graph traversal | Future entity and relationship recall. |
| Reranking | Future final context selection. |

## Chunk registry

`indexes/chunks.jsonl` maps memory sources to indexed chunks. This makes updates, stale chunk cleanup, and source deletion reliable.

<AdSlot placement="indexing-recall-bottom" />
