---
title: Core Concepts
description: Understand the terms used across TekMemo docs and APIs.
---

# Core Concepts

TekMemo is built around a few durable ideas.

## Memory store

A memory store is a filesystem-like interface that can read, write, append, and check whether memory files exist.

```ts
export interface MemoryStore {
  read(path: MemoryPath): Promise<string>
  write(path: MemoryPath, content: string): Promise<void>
  append(path: MemoryPath, content: string): Promise<void>
  exists(path: MemoryPath): Promise<boolean>
}
```

Behind the scenes, the store might be local disk, AgentFS, or a database-backed file shim.

## Memory path

A memory path is a path inside `.tekmemo/`.

```txt
memory/core.md
memory/notes.md
conversations/conversations.jsonl
events/memory-events.jsonl
indexes/chunks.jsonl
```

TekMemo uses internal relative paths so the same code can work across local files, syncable stores, and cloud-backed stores.

## Memory layer

A layer describes the scope and purpose of memory.

| Layer | Purpose |
| :--- | :--- |
| User | Preferences and durable user-level facts. |
| Workspace | Shared organization or team context. |
| Project | Product, repo, assistant, or app-specific context. |
| Agent | Memory learned by a specific agent. |
| Session | Temporary working state for a run or conversation. |
| Policy | Rules the agent must follow. |

## Memory type

A type describes what kind of memory is being stored.

| Type | Storage | Example |
| :--- | :--- | :--- |
| Core | `memory/core.md` | Compact canonical truth. |
| Notes | `memory/notes.md` | Durable long-form notes. |
| Facts | `memory/facts.jsonl` | Structured factual memory. |
| Preferences | `memory/preferences.jsonl` | User or team preferences. |
| Procedures | `memory/procedures.jsonl` | How tasks should be done. |
| Policies | `memory/policies.jsonl` | Hard rules and constraints. |
| Conversations | `conversations/conversations.jsonl` | Conversation history and summaries. |

## Recall

Recall means selecting useful memory for a new task.

TekMemo supports three recall levels:

1. keyword recall for free local testing
2. vector recall with BYO embedding/vector infrastructure
3. provider-backed recall through your hosted application

## Memory compiler

The memory compiler turns raw memory into prompt-ready context.

```txt
raw files → chunk registry → retrieval → ranking → conflict filtering → prompt-ready memory block
```

This is different from dumping every saved fact into the prompt.
