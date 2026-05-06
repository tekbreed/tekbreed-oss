---
title: Memory Model
description: TekMemo's layered memory model for files, events, indexes, snapshots, and future graph memory.
---

# Memory Model

TekMemo memory is layered so different kinds of knowledge can be stored and retrieved differently.

## Layers

| Layer | Storage | Role |
| :--- | :--- | :--- |
| Core | `memory/core.md` | Compact always-relevant truth. |
| Notes | `memory/notes.md` | Human-readable archival notes. |
| Conversations | `conversations/conversations.jsonl` | Interaction history. |
| Events | `events/memory-events.jsonl` | Audit trail of memory mutations. |
| Indexes | `indexes/*` | Search and recall metadata. |
| Graph | `graph/*` | Future entity and relationship memory. |
| Snapshots | `snapshots/*` | Restore and export history. |

## Future memory intelligence

TekMemo should add conflict detection, memory decay, temporal recall, graph traversal, and a memory compiler that converts raw memory into prompt-ready context.

<AdSlot placement="memory-model-bottom" />
