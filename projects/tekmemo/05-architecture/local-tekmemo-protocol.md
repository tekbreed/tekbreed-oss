# Local `.tekmemo/` Protocol

## Purpose

The `.tekmemo/` directory is the local, inspectable memory protocol for TekMemo.

It exists so developers can own their agent memory before they use TekMemo Cloud.

This protocol supports:

- local-first testing
- readable memory files
- event history
- chunk/source traceability
- graph memory expansion
- snapshots
- cloud sync
- hosted recall
- restore history
- production controls

---

# Canonical folder structure

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

## Why this structure

The structure separates concerns:

| Path | Purpose |
|---|---|
| `manifest.json` | Declares protocol version, project metadata, and canonical paths |
| `memory/core.md` | Stable project/workspace memory |
| `memory/notes.md` | Human-readable accumulated notes |
| `events/memory-events.jsonl` | Append-only operational history |
| `events/conversations.jsonl` | Structured summarized conversation history |
| `indexes/chunks.jsonl` | Local chunk/source registry, not necessarily raw vectors |
| `graph/nodes.jsonl` | Future graph memory nodes |
| `graph/edges.jsonl` | Future graph memory edges |
| `snapshots/snapshots.jsonl` | Snapshot records and metadata |

---

# `manifest.json`

The manifest is the entry point.

It should be created during bootstrap and kept small.

Example:

```json
{
  "version": "1",
  "projectId": "local",
  "createdAt": "2026-05-04T00:00:00.000Z",
  "updatedAt": "2026-05-04T00:00:00.000Z",
  "paths": {
    "coreMemory": ".tekmemo/memory/core.md",
    "notesMemory": ".tekmemo/memory/notes.md",
    "memoryEvents": ".tekmemo/events/memory-events.jsonl",
    "conversations": ".tekmemo/events/conversations.jsonl",
    "chunks": ".tekmemo/indexes/chunks.jsonl",
    "graphNodes": ".tekmemo/graph/nodes.jsonl",
    "graphEdges": ".tekmemo/graph/edges.jsonl",
    "snapshots": ".tekmemo/snapshots/snapshots.jsonl"
  }
}
```

## Manifest rules

- `version` is required.
- `createdAt` and `updatedAt` must be ISO timestamps.
- paths must stay inside `.tekmemo/`.
- providers must not invent alternative root folders.
- future protocol versions must be additive where possible.

---

# `memory/core.md`

Core memory is the stable, human-readable memory document.

It should contain:

- project identity
- durable constraints
- user/project preferences
- important architectural decisions
- stable facts an agent should remember

Example:

```md
# Core Memory

## Project
- Name: TekMemo
- Positioning: Developer-owned, file-first agent memory.

## Constraints
- The local source of truth is `.tekmemo/`.
- Vector stores are indexes, not memory.
```

---

# `memory/notes.md`

Notes are human-readable memory entries.

Use this for:

- decisions
- constraints
- references
- summaries
- temporary notes promoted to memory

A note may also be represented internally as a structured record, but the local standard keeps a readable Markdown file.

---

# `events/memory-events.jsonl`

The event log is append-only.

It tracks what changed, when, and why.

Recommended event types:

```txt
memory.created
memory.updated
memory.merged
memory.conflicted
memory.decayed
memory.forgotten
memory.restored
memory.indexed
memory.reindexed
snapshot.created
sync.started
sync.completed
sync.failed
```

Example line:

```json
{"id":"evt_123","type":"memory.updated","sourcePath":".tekmemo/memory/core.md","timestamp":"2026-05-04T00:00:00.000Z","actor":{"type":"user"},"summary":"Updated core memory positioning."}
```

## Event log rules

- one JSON object per line
- malformed lines must be handled explicitly
- consumers may either skip malformed lines or throw
- event IDs should be stable and unique
- event timestamps must be ISO strings

---

# `events/conversations.jsonl`

Conversation events are structured summarized memory, not raw chat transcripts by default.

Example line:

```json
{"id":"conv_123","role":"assistant","summary":"Explained why `.tekmemo/` should be the local protocol.","timestamp":"2026-05-04T00:00:00.000Z"}
```

## Why summaries instead of raw transcripts

- smaller files
- lower privacy risk
- better signal-to-noise ratio
- easier recall indexing

Raw references can be stored as IDs or external links if needed.

---

# `indexes/chunks.jsonl`

The chunk index maps memory source content to chunk records.

It should not be treated as the vector database.

The default local file should store chunk/source metadata, not necessarily raw embedding vectors.

Example line:

```json
{"chunkId":"chk_123","sourcePath":".tekmemo/memory/core.md","sourceHash":"src_hash","chunkHash":"chunk_hash","memoryType":"core","sectionName":"Project","createdAt":"2026-05-04T00:00:00.000Z","status":"indexed"}
```

## Chunk registry rules

Every indexed chunk must be traceable to:

- project
- source path
- source type
- source ID where available
- memory type
- chunk ID
- chunk hash
- index status

This enables:

- safe reindexing
- delete by source
- stale chunk cleanup
- restore-aware reindexing
- memory inspector views

---

# `graph/`

Graph memory is later-stage.

For now, reserve:

```txt
.tekmemo/graph/nodes.jsonl
.tekmemo/graph/edges.jsonl
```

This keeps the protocol stable without forcing graph memory into the first release.

---

# `snapshots/`

Snapshots provide local restore points.

The canonical index is:

```txt
.tekmemo/snapshots/snapshots.jsonl
```

Snapshot payloads can be stored as separate files later if needed.

For TekMemo Cloud, large snapshot bundles should live in object storage such as R2, while metadata remains in Turso.

---

# Package ownership

## `@tekbreed/tekmemo`

Owns:

- protocol constants
- manifest schema
- event schema
- chunk record schema
- snapshot record schema
- validation helpers
- parser helpers
- in-memory test store

Does not own:

- Node filesystem access
- provider calls
- vector database persistence
- cloud tenancy

## `@tekbreed/tekmemo-fs`

Owns:

- physically reading/writing `.tekmemo/`
- safe path resolution
- atomic writes
- append locks
- symlink policy
- missing file behavior

Does not own:

- protocol design
- embeddings
- vector recall
- reranking
- cloud sync

---

# Cloud sync meaning

Cloud sync should read from `.tekmemo/`, validate it, then sync memory into hosted TekMemo Cloud project storage.

Flow:

```txt
local .tekmemo/
  -> validate manifest
  -> read memory documents
  -> read events
  -> read chunk records
  -> upload/sync to cloud project
  -> cloud indexes memory
  -> cloud provides hosted recall, restore, teams, usage controls
```

This keeps the cloud product aligned with the local-first OSS promise.
