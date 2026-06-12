# TekMemo Memory Architecture

## Architecture thesis

TekMemo is **developer-owned, file-first memory infrastructure for AI apps and agents**.

Memory must have an inspectable source of truth outside the vector database.

That source of truth is:

```txt
.tekmemo/
```

Vector stores are indexes.
Rerankers are ordering systems.
Cloud sync is an upgrade path.
The local memory protocol is the portable foundation.

---

# Canonical local protocol

TekMemo memory is represented locally as:

```txt
.tekmemo/
  manifest.json

  memory/
    core.md
    notes.md

  events/
    memory-events.jsonl
    conversations.jsonl

  indexes/
    chunks.jsonl

  graph/
    nodes.jsonl
    edges.jsonl

  snapshots/
    snapshots.jsonl
```

This replaces older draft layouts where `core.md`, `notes.jsonl`, `conversations.jsonl`, and `chunks.jsonl` were placed directly under `.tekmemo/`.

---

# Memory lifecycle

```txt
capture
  -> normalize
  -> store in .tekmemo files
  -> append event log entry
  -> chunk source content
  -> write chunk registry record
  -> embed
  -> index in vector provider
  -> recall candidates
  -> optionally rerank candidates
  -> use in model context
  -> audit/update/forget/restore
```

---

# Memory layers

## Core memory

File:

```txt
.tekmemo/memory/core.md
```

Stable project-level facts, constraints, preferences, and decisions.

Core memory should be readable by humans and safe to inspect in Git or local development workflows.

## Notes

File:

```txt
.tekmemo/memory/notes.md
```

Accumulated memory notes.

Notes can represent:

- decisions
- constraints
- preferences
- references
- summaries
- user-provided durable facts

## Conversation memory

File:

```txt
.tekmemo/events/conversations.jsonl
```

Structured summarized interaction memory.

Do not store full raw chat transcripts by default. Prefer compact, useful summaries.

## Event log

File:

```txt
.tekmemo/events/memory-events.jsonl
```

Tracks create, update, merge, conflict, decay, forget, restore, sync, and indexing actions.

The event log powers:

- memory inspector
- local audit trail
- cloud activity feed
- restore history
- support/debugging

## Chunk registry

File:

```txt
.tekmemo/indexes/chunks.jsonl
```

Maps source content to indexed chunks.

The chunk registry should not be treated as the vector database.
It stores source/chunk metadata so vectors can be safely created, replaced, deleted, and restored.

## Graph memory

Files:

```txt
.tekmemo/graph/nodes.jsonl
.tekmemo/graph/edges.jsonl
```

Reserved for graph memory expansion.

This should not block the first release.

## Snapshots

File:

```txt
.tekmemo/snapshots/snapshots.jsonl
```

Snapshot metadata for local restore.

Large cloud snapshot bundles should live outside the relational database, for example in R2.

---

# Package ownership

| Layer | Owner |
|---|---|
| Protocol constants | `@tekbreed/tekmemo` |
| Manifest schema | `@tekbreed/tekmemo` |
| Event schema | `@tekbreed/tekmemo` |
| Chunk record schema | `@tekbreed/tekmemo` |
| Local file I/O | `@tekbreed/tekmemo-fs` |
| AgentFS-backed file storage | `@tekbreed/tekmemo-agentfs` |
| Vector recall contracts | `@tekbreed/tekmemo-recall` |
| Vector provider implementation | `@tekbreed/tekmemo-upstash`, `@tekbreed/tekmemo-turso-vector`, `@tekbreed/tekmemo-qdrant`, etc. |
| Rerank contracts | `@tekbreed/tekmemo-rerank` |
| Rerank provider implementation | `@tekbreed/tekmemo-rerank-voyage`, `@tekbreed/tekmemo-rerank-cohere`, etc. |
| Hosted teams/billing/usage | TekMemo Cloud |

---

# Chunk registry rule

Every indexed vector must be traceable to:

- project
- source path
- source type
- source ID where available
- memory type
- chunk ID
- chunk hash
- index status

Without this, delete/reindex/update-by-source becomes unreliable.

---

# Hybrid retrieval

The target recall flow is:

```txt
query
  -> embed query
  -> vector recall top 20-50
  -> optional metadata filters
  -> rerank candidates
  -> return top 5-10 with source metadata
```

The vector database should return candidates.
The reranker should improve ordering.
The returned memory should always remain explainable through `.tekmemo` source metadata.

---

# Local-first to cloud flow

```txt
local .tekmemo/
  -> validate manifest
  -> inspect memory/events/chunks
  -> run local tests
  -> optionally sync to TekMemo Cloud
  -> hosted recall + restore + teams + usage controls
```

This is the core product story.

---

# Build order

## Build now

- `.tekmemo/` protocol in `@tekbreed/tekmemo`
- production-safe `@tekbreed/tekmemo-fs`
- core memory
- notes
- conversation summaries
- event log
- chunk registry
- Upstash recall
- Voyage/OpenAI embeddings
- Voyage reranking

## Build next

- Turso vector
- Qdrant
- CLI inspector
- benchmark kit
- evals

## Build later

- graph memory
- connectors
- MCP
- advanced sync/conflict workflows
