# TekMemo Core

[![npm version](https://img.shields.io/npm/v/tekmemo.svg)](https://www.npmjs.com/package/tekmemo)
[![npm downloads](https://img.shields.io/npm/dm/tekmemo.svg)](https://www.npmjs.com/package/tekmemo)
[![license](https://img.shields.io/npm/l/tekmemo.svg)](https://www.npmjs.com/package/tekmemo)

Provider-neutral, file-first memory runtime for AI apps and agents.

TekMemo core owns the local memory protocol. It does **not** talk to the filesystem, cloud, vector databases, embedding providers, rerankers, billing, or hosted tenancy.

## Why it exists

TekMemo is built around a simple idea:

> AI apps should not depend only on short chat history. They need durable, inspectable, portable memory.

This package provides the canonical `.tekmemo/` protocol and memory abstractions that all other packages build upon.

## Canonical local protocol

TekMemo memory starts as inspectable files that developers own:

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
  tmp/
```

## Installation

```bash
pnpm add tekmemo
```

## Quickstart

```ts
import {
  InMemoryMemoryStore,
  bootstrapMemoryStore,
  writeCoreMemory,
  readCoreMemory,
  appendMemoryEvent,
  createMemoryEvent
} from "tekmemo";

const store = new InMemoryMemoryStore();
await bootstrapMemoryStore(store, { projectId: "local-app" });

await writeCoreMemory(store, "# Core Memory\n\n- The user prefers file-first memory.\n");

await appendMemoryEvent(
  store,
  createMemoryEvent({
    type: "memory.updated",
    sourcePath: ".tekmemo/memory/core.md",
    summary: "Updated core memory"
  })
);

const coreMemory = await readCoreMemory(store);
```

---

## Core concepts

### Memory paths

TekMemo uses canonical memory paths for all file operations:

| Constant | Path | Description |
|----------|------|-------------|
| `MEMORY_ROOT` | `.tekmemo/` | Root memory directory |
| `MANIFEST_PATH` | `.tekmemo/manifest.json` | Project manifest |
| `CORE_MEMORY_PATH` | `.tekmemo/memory/core.md` | Core memory (canonical truth) |
| `NOTES_MEMORY_PATH` | `.tekmemo/memory/notes.md` | Notes (archival memory) |
| `MEMORY_EVENTS_PATH` | `.tekmemo/events/memory-events.jsonl` | Memory event log |
| `CONVERSATIONS_MEMORY_PATH` | `.tekmemo/events/conversations.jsonl` | Conversation history |
| `CHUNKS_INDEX_PATH` | `.tekmemo/indexes/chunks.jsonl` | Chunk index for recall |
| `GRAPH_NODES_PATH` | `.tekmemo/graph/nodes.jsonl` | Graph nodes |
| `GRAPH_EDGES_PATH` | `.tekmemo/graph/edges.jsonl` | Graph edges |
| `SNAPSHOTS_INDEX_PATH` | `.tekmemo/snapshots/snapshots.jsonl` | Snapshot index |

### Memory document types

| Type | Description |
|------|-------------|
| `MemoryManifest` | Project configuration and metadata |
| `MemoryEvent` | Event log entry for audit trail |
| `ConversationEntry` | Single conversation message |
| `MemoryChunk` | Text chunk with embedding reference |
| `TimestampedNote` | Note with timestamp |
| `SnapshotRecord` | Snapshot metadata record |
| `ChunkRecord` | Chunk index record |

### Event types

| Type | Description |
|------|-------------|
| `memory.created` | Memory file created |
| `memory.updated` | Memory file updated |
| `memory.deleted` | Memory file deleted |
| `core.updated` | Core memory updated |
| `notes.appended` | Notes appended |
| `recall.upsert` | Recall chunks upserted |
| `recall.delete` | Recall chunks deleted |

---

## API reference

### MemoryStore interface

The core abstraction for reading/writing memory files:

```ts
export interface MemoryStore {
  read(path: MemoryPath): Promise<string>;
  write(path: MemoryPath, content: string): Promise<void>;
  append(path: MemoryPath, content: string): Promise<void>;
  exists(path: MemoryPath): Promise<boolean>;
}
```

### InMemoryMemoryStore

In-memory implementation for testing and scenarios without filesystem:

```ts
import { InMemoryMemoryStore } from "tekmemo";

// Empty store
const store = new InMemoryMemoryStore();

// With initial files
const store = new InMemoryMemoryStore({
  ".tekmemo/memory/core.md": "# Core Memory\n",
  ".tekmemo/memory/notes.md": "# Notes\n"
});

// Methods
await store.read(".tekmemo/memory/core.md");    // Read file
await store.write(".tekmemo/memory/core.md", content);  // Write file
await store.append(".tekmemo/memory/notes.md", text);  // Append to file
await store.exists(".tekmemo/memory/core.md");       // Check if exists
const snapshot = store.snapshot();                      // Get all files as Record
```

### Bootstrap

Initialize a new TekMemo project with default files:

```ts
import { bootstrapMemoryStore } from "tekmemo";

const result = await bootstrapMemoryStore(store, {
  projectId: "local-app",           // Optional: embed in manifest
  overwriteExisting: false,           // Optional: overwrite existing files (default: false)
  templates: {                       // Optional: override default templates
    core: "# Custom Core\n",
    notes: "# Custom Notes\n"
  },
  now: () => "2026-01-01T00:00:00.000Z"  // Optional: custom clock for tests
});

// result.created - files that were created
// result.overwritten - files that were overwritten
// result.skipped - files that already existed
```

### Core memory

```ts
import { readCoreMemory, writeCoreMemory, buildCoreMemoryText } from "tekmemo";

// Read core memory
const content = await readCoreMemory(store);

// Write core memory (normalizes line endings)
await writeCoreMemory(store, "# Core Memory\n\nContent here\n");

// Read and trim
const trimmed = await buildCoreMemoryText(store);
```

### Notes memory

```ts
import { readNotesMemory, appendTimestampedNote, formatTimestampedNote } from "tekmemo";

// Read notes
const notes = await readNotesMemory(store);
// Returns: TimestampedNote[]

// Append a note
await appendTimestampedNote(store, {
  content: "User prefers TypeScript examples.",
  timestamp: new Date().toISOString(),
  tags: ["preference", "typescript"]
});

// Format a note for display
const formatted = formatTimestampedNote(note);
```

### Events

```ts
import { createMemoryEvent, appendMemoryEvent, readMemoryEvents } from "tekmemo";

// Create an event
const event = createMemoryEvent({
  type: "memory.updated",
  sourcePath: ".tekmemo/memory/core.md",
  summary: "Updated core memory",
  metadata: { projectId: "proj_1" }
});

// Append event
await appendMemoryEvent(store, event);

// Read events
const result = await readMemoryEvents(store, {
  limit: 100,
  offset: 0,
  type: "memory.updated"  // optional filter
});
// result.items - MemoryEvent[]
// result.issues - parse issues if any

// Validate event
try {
  validateMemoryEvent(event);
} catch (error) {
  // MemoryValidationError
}
```

### Chunks

```ts
import { createChunkRecord, appendChunkRecord, readChunkRecords } from "tekmemo";

// Create chunk record
const chunk = createChunkRecord({
  id: "chunk_123",
  text: "TekMemo uses file-first memory.",
  embedding: [0.1, 0.2, 0.3],
  metadata: {
    sourceType: "document",
    sourceId: "core",
    memoryType: "core"
  }
});

// Append chunk
await appendChunkRecord(store, chunk);

// Read chunks
const result = await readChunkRecords(store, {
  limit: 100,
  sourceType: "document"  // optional filter
});
```

### Snapshots

```ts
import { createSnapshotRecord, appendSnapshotRecord, readSnapshotRecords } from "tekmemo";

// Create snapshot record
const snapshot = createSnapshotRecord({
  id: "snap_123",
  type: "manual",
  description: "Before migration"
});

// Append snapshot
await appendSnapshotRecord(store, snapshot);

// Read snapshots
const result = await readSnapshotRecords(store, {
  limit: 10
});
```

### Manifest

```ts
import { createDefaultTekMemoManifest, readManifest, writeManifest } from "tekmemo";

// Create default manifest
const manifest = createDefaultTekMemoManifest({
  projectId: "proj_123",
  name: "My Project"
});

// Read manifest
const manifest = await readManifest(store);

// Write manifest
await writeManifest(store, manifest);

// Validate manifest
try {
  validateTekMemoManifest(manifest);
} catch (error) {
  // MemoryValidationError
}
```

### Search

```ts
import { searchMemoryText } from "tekmemo";

const result = await searchMemoryText(store, {
  query: "memory",
  paths: [CORE_MEMORY_PATH, NOTES_MEMORY_PATH],
  maxResults: 10
});
// result.matches - search matches with context
```

### Chunking

```ts
import { chunkText, createChunkId, hashString } from "tekmemo";

// Split text into chunks
const chunks = chunkText("Long text here...", {
  maxChunkSize: 1000,
  overlap: 100
});
// Returns: ChunkTextResult[]

// Create deterministic chunk ID
const id = createChunkId(sourceId, index);

// Hash string for dedup
const hash = hashString("some text");
```

### Commands

```ts
import { runMemoryCommand, validateMemoryCommand } from "tekmemo";

// Run a memory command
const result = await runMemoryCommand(store, {
  command: "read_core",
  // ... command-specific options
});

// Validate command
try {
  validateMemoryCommand(command);
} catch (error) {
  // MemoryCommandError
}
```

---

## Error handling

The package exports typed errors:

```ts
import {
  TekMemoError,            // Base error class
  MemoryValidationError,   // Invalid data
  MemoryNotFoundError,     // File/entity not found
  MemoryPathError,         // Invalid path
  MemoryStoreError,        // Store operation failed
  MemoryParseError,        // Parse error
  MemoryCommandError,      // Invalid command
} from "tekmemo";

try {
  await readCoreMemory(store);
} catch (error) {
  if (error instanceof MemoryNotFoundError) {
    // File doesn't exist
  }
  if (error instanceof MemoryValidationError) {
    // Invalid data
  }
}
```

---

## Production safety

The core package rejects:

- non-string memory paths
- null-byte paths
- absolute paths
- backslash paths
- parent directory traversal (`../`)
- paths outside `.tekmemo/`
- unsupported protocol files
- malformed JSONL when strict mode is used
- invalid manifest/event/chunk/snapshot records
- non-canonical manifest paths
- snapshot records whose safe path does not match their ID
- invalid note kinds
- non-object source references
- metadata values that are not true JSON values (rejects circular references, `undefined`, functions, symbols, BigInt, non-finite numbers)

---

## Package boundary

This package is intentionally provider-neutral.

**This package owns:**
- canonical `.tekmemo/` paths
- manifest helpers
- memory store contract
- in-memory test store
- bootstrap helpers
- core memory helpers
- notes helpers
- conversation JSONL helpers
- memory event log helpers
- chunk index helpers
- snapshot index helpers
- search helpers
- chunking helpers
- typed error classes

**Use these packages for integrations:**
- `@tekmemo/fs` for Node filesystem storage
- `@tekmemo/agentfs` for AgentFS/Turso AgentFS-backed storage
- `@tekmemo/recall` for vector recall contracts
- `@tekmemo/upstash-vector` for Upstash Vector recall
- `@tekmemo/voyageai` and `@tekmemo/openai` for embeddings
- `@tekmemo/rerank` and provider packages for reranking

---

## Types

Key types exported:

```ts
import type {
  // Memory documents
  MemoryManifest,
  MemoryEvent,
  ConversationEntry,
  MemoryChunk,
  TimestampedNote,
  SnapshotRecord,
  ChunkRecord,

  // Memory store
  MemoryStore,
  MemoryStoreSnapshot,
  InMemoryStoreInitialFiles,

  // Paths
  MemoryPath,
  PathKind,
  CanonicalTekMemoFile,
  SnapshotFilePath,

  // Commands
  MemoryCommand,
  SearchableMemoryPath,

  // Events
  CreateMemoryEventInput,
  MemoryEventsResult,
  ReadMemoryEventsOptions,

  // Chunks
  ChunkTextOptions,
  CreateChunkRecordOptions,
  ChunkRecordsResult,
  ReadChunkRecordsOptions,

  // Snapshots
  CreateSnapshotRecordInput,
  SnapshotRecordsResult,
  ReadSnapshotRecordsOptions,

  // Search
  MemorySearchResult,
  SearchMemoryTextOptions,

  // Bootstrap
  BootstrapMemoryStoreOptions,
  BootstrapMemoryStoreResult,

  // Templates
  MemoryTemplates,

  // Other
  ConversationRole,
  MemoryActorType,
  MemoryDocumentType,
  MemoryEventType,
  MemorySourceReference,
  MemorySourceType,
  MemoryType,
  NoteKind,
} from "tekmemo";
```
