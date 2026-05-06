---
title: Graph Memory Architecture
description: How TekMemo graph memory will work with files, vectors, and events.
---

# Graph Memory Architecture

Graph memory stores relationships between entities.

Vector search answers:

> What text is similar to this question?

Graph memory answers:

> Which decisions, users, projects, tools, and constraints are connected?

## Graph files

```txt
.tekmemo/graph/
├─ entities.jsonl
├─ relations.jsonl
├─ observations.jsonl
└─ graph-manifest.json
```

## Retrieval flow

```txt
query
→ keyword candidates
→ vector candidates
→ graph neighborhood
→ temporal filtering
→ reranking
→ memory compiler
```

## Why it matters

Graph memory helps with:

- project decisions
- dependency relationships
- user preferences
- team ownership
- policy constraints
- temporal fact changes
- agent learning trails
