---
title: Filesystem Layout
description: Canonical filesystem layout for TekMemo memory stores.
---

# Filesystem Layout

TekMemo stores local memory in a `.tekmemo` directory.

```txt
.tekmemo/
├── manifest.json
├── memory/
│   ├── core.md
│   └── notes.md
├── events/
│   ├── memory-events.jsonl
│   └── conversations.jsonl
├── indexes/
│   └── chunks.jsonl
├── graph/
│   ├── nodes.jsonl
│   └── edges.jsonl
└── snapshots/
    └── snapshots.jsonl
```

## `.tekmemo/manifest.json`

Stores basic metadata about the memory workspace.

## `.tekmemo/memory/core.md`

Stores stable, high-signal memory.

Examples:

* durable project facts
* user preferences
* long-lived app decisions
* current project constraints

## `.tekmemo/memory/notes.md`

Stores lower-pressure notes that may later be summarized, promoted, chunked, or indexed.

## `.tekmemo/events/memory-events.jsonl`

Append-only event log for memory changes.

## `.tekmemo/events/conversations.jsonl`

Conversation-turn history when the app chooses to persist turns.

## `.tekmemo/indexes/chunks.jsonl`

Local chunk index generated from memory files.

## `.tekmemo/graph/nodes.jsonl`

Optional graph nodes for relationship-aware memory.

## `.tekmemo/graph/edges.jsonl`

Optional graph edges for relationship-aware memory.

## `.tekmemo/snapshots/snapshots.jsonl`

Snapshot records for checkpointing memory state.
