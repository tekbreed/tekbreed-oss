---
title: Memory Filesystem
description: Learn the .tekmemo folder format and what each file is for.
---

# Memory Filesystem

TekMemo stores memory in a predictable `.tekmemo/` folder. This is the foundation of TekMemo’s local-first and inspectable memory model.

## Directory layout

```txt
.tekmemo/
├─ manifest.json
├─ config.json
├─ memory/
│  ├─ core.md
│  ├─ notes.md
│  ├─ facts.jsonl
│  ├─ preferences.jsonl
│  ├─ procedures.jsonl
│  └─ policies.jsonl
├─ conversations/
│  └─ conversations.jsonl
├─ events/
│  └─ memory-events.jsonl
├─ indexes/
│  ├─ chunks.jsonl
│  ├─ keyword.json
│  └─ vector-manifest.json
├─ graph/
│  ├─ entities.jsonl
│  ├─ relations.jsonl
│  └─ observations.jsonl
├─ snapshots/
└─ sync/
```

## `manifest.json`

Describes the memory store.

```json
{
  "version": "0.1",
  "storeId": "store_local_123",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "updatedAt": "2026-05-04T00:00:00.000Z"
}
```

## `config.json`

Stores local configuration.

```json
{
  "defaultScope": "project",
  "indexing": {
    "keyword": true,
    "vector": false
  },
  "sync": {
    "enabled": false
  }
}
```

## `memory/core.md`

Small canonical memory that should be injected often.

```md
# Core Memory

## Identity
- This project is a customer support assistant.

## Preferences
- Prefer concise answers.

## Constraints
- Do not expose private customer data.
```

## `memory/notes.md`

Longer durable notes, decisions, summaries, and references.

## JSONL memory files

JSONL files are append-friendly and easy to stream.

```jsonl
{"id":"fact_1","content":"The project uses React Router v7.","confidence":0.95}
{"id":"fact_2","content":"Deployments run on Cloudflare Workers.","confidence":0.9}
```

## `events/memory-events.jsonl`

Every memory change can produce an event.

```jsonl
{"type":"MEMORY_CREATED","path":"memory/facts.jsonl","timestamp":"2026-05-04T00:00:00.000Z"}
{"type":"MEMORY_UPDATED","path":"memory/core.md","timestamp":"2026-05-04T00:05:00.000Z"}
```

Events make memory debuggable, auditable, and syncable.

## `indexes/chunks.jsonl`

The chunk registry maps memory sources to recall chunks.

```jsonl
{"id":"chunk_1","sourcePath":"memory/notes.md","start":0,"end":420,"hash":"sha256:..."}
```

This registry is required for safe re-indexing and source deletion.

## `graph/`

The graph folder is for future graph memory.

```txt
User → prefers → TypeScript examples
Project → uses → Cloudflare Workers
Agent → learned → billing limit rule
```

Graph memory is documented early because the file standard should not need a breaking rewrite when graph features ship.
