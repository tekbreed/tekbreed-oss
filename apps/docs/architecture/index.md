---
title: Architecture
description: Public architecture overview for TekMemo users and developers.
---

# Architecture

TekMemo is built around one principle:

> Memory should be inspectable, portable, and usable locally before it becomes hosted infrastructure.

## System layers

```txt
Application or agent
  → integration package
  → TekMemo core runtime
  → memory store
  → optional recall/indexing
  → optional hosted app API
```

## Public architecture topics

- [Memory Model](/architecture/memory-model)
- [Package Boundaries](/architecture/package-boundaries)
- [Indexing and Recall](/architecture/indexing-recall)
- [Sync and Events](/architecture/sync-events)
- [Conflict Detection](/architecture/conflict-detection)
- [Graph Memory](/architecture/graph-memory)

<AdSlot placement="architecture-index" />
