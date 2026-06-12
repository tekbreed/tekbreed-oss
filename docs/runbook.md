# TekMemo Workspace Runbook

## Workspace Overview

TekMemo is a **pnpm monorepo** with **21 packages** organized around two product surfaces:

- **Public OSS packages** (`@tekbreed/tekmemo`, `@tekbreed/tekmemo-*`) — file-first memory runtime and adapters
- **Private tooling** (`@repo/*`) — internal build, test, and config packages

### Workspace Layout

```
tekmemo/
  apps/docs/           VitePress documentation site
  packages/tekmemo/    Core memory contracts
  packages/fs/         Local filesystem adapter
  packages/agentfs/    AgentFS workspace + remote adapter
  packages/graph/      Graph memory contracts
  packages/recall/     Vector recall contracts
  packages/rerank/     Reranking contracts
  packages/cloud-client/  TekMemo Cloud HTTP client
  packages/ai-sdk/     Vercel AI SDK integration
  packages/cli/        Command-line interface
  packages/mcp-server/ MCP server for agent tools
  packages/server/     Hono self-host memory server
  packages/openai/     OpenAI embedding adapter
  packages/voyageai/   VoyageAI embedding adapter
  packages/upstash-vector/ Upstash Vector recall adapter
  packages/rerank-voyage/  VoyageAI reranking adapter
  packages/adapters/   Convenience reexport aggregation
  packages/benchmark-kit/  Benchmarking toolkit
  tooling/utils/      Shared internal utilities
  tooling/test-utils/ Contract tests, fakes, fixtures
  tooling/tsdown-config/    Shared tsdown build config
  tooling/typescript-config/ Shared TypeScript config
```

### Package Map by Layer

| Layer | Package | Scope | Role |
|---|---|---|---|
| **Core** | `@tekbreed/tekmemo` | oss | Memory contracts, paths, types, in-memory store |
| **Storage** | `@tekbreed/tekmemo-fs` | `@tekmemo` | Local filesystem memory adapter |
| **Storage** | `@tekbreed/tekmemo-agentfs` | `@tekmemo` | AgentFS workspace + remote adapter |
| **Storage** | `@tekbreed/tekmemo-server` | `@tekmemo` | Hono-based self-host memory server |
| **Transport** | `@tekbreed/tekmemo-cloud-client` | `@tekmemo` | TekMemo Cloud HTTP client |
| **Agent** | `@tekbreed/tekmemo-cli` | `@tekmemo` | CLI tooling (init, search, cloud, agent) |
| **Agent** | `@tekbreed/tekmemo-mcp-server` | `@tekmemo` | MCP boundary for agent tools |
| **SDK** | `@tekbreed/tekmemo-ai-sdk` | `@tekmemo` | Vercel AI SDK tools and prompts |
| **Graph** | `@tekbreed/tekmemo-graph` | `@tekmemo` | Standalone graph memory contracts |
| **Recall** | `@tekbreed/tekmemo-recall` | `@tekmemo` | Vector recall contracts and in-memory store |
| **Recall** | `@tekbreed/tekmemo-upstash-vector` | `@tekmemo` | Upstash Vector recall adapter |
| **Embedding** | `@tekbreed/tekmemo-openai` | `@tekmemo` | OpenAI embedding adapter |
| **Embedding** | `@tekbreed/tekmemo-voyageai` | `@tekmemo` | VoyageAI embedding adapter |
| **Rerank** | `@tekbreed/tekmemo-rerank` | `@tekmemo` | Reranking contracts and fallback |
| **Rerank** | `@tekbreed/tekmemo-rerank-voyage` | `@tekmemo` | VoyageAI reranking adapter |
| **Meta** | `@tekbreed/tekmemo-adapters` | `@tekmemo` | Convenience reexport aggregation |
| **Testing** | `@tekbreed/tekmemo-benchmark-kit` | `@tekmemo` | Benchmark runners and reporters |
| **Tooling** | `@repo/tsdown-config` | internal | Shared tsdown build config |
| **Tooling** | `@repo/typescript-config` | internal | Shared TypeScript base config |
| **Tooling** | `@repo/utils` | internal | Shared utilities (retry, validation, locking) |
| **Tooling** | `@repo/test-utils` | internal | Contract tests, fakes, fixtures |

---

## Dependency Graph

```
                    tekmemo (core — zero deps)
                    ├── @tekbreed/tekmemo-fs .................. MemoryStore implementation for Node fs
                    ├── @tekbreed/tekmemo-agentfs ............. MemoryStore impl for AgentFS remote
                    ├── @tekbreed/tekmemo-cli ................. Local memory commands
                    ├── @tekbreed/tekmemo-mcp-server .......... Local runtime mode
                    └── @tekbreed/tekmemo-ai-sdk .............. Memory tools for AI SDK

                    @tekbreed/tekmemo-graph (standalone — zero deps)

                    @tekbreed/tekmemo-recall (standalone — zero deps)
                    └── @tekbreed/tekmemo-upstash-vector ...... RecallStore backed by Upstash

                    @tekbreed/tekmemo-rerank (standalone — zero deps)
                    └── @tekbreed/tekmemo-rerank-voyage ....... Reranker backed by VoyageAI

                    @tekbreed/tekmemo-cloud-client (standalone — zero deps)
                    ├── @tekbreed/tekmemo-cli ................. Cloud commands
                    └── @tekbreed/tekmemo-mcp-server .......... Cloud runtime mode

                    @tekbreed/tekmemo-openai (standalone — optional `openai` peer)

                    @tekbreed/tekmemo-voyageai (standalone — zero npm deps)

                    @tekbreed/tekmemo-server (standalone — hono, pg, S3 SDK)

                    @tekbreed/tekmemo-ai-sdk (tekmemo + optional `ai` peer)

                    @tekbreed/tekmemo-adapters (aggregates all @tekbreed/tekmemo-* adapters)

                    @tekbreed/tekmemo-benchmark-kit (standalone — zero deps)

                    @repo/utils (standalone — always bundled into consumers)
                    └── Used by: EVERY package (tsdown deps.alwaysBundle)

                    @repo/test-utils (used by: all packages as devDependency)
                    @repo/tsdown-config (used by: all packages as devDependency)
                    @repo/typescript-config (used by: all packages as devDependency)
```

---

## Namespace Conventions

| Package directory | Published name | Scope |
|---|---|---|
| `packages/tekmemo` | `@tekbreed/tekmemo` | none — the OSS core package |
| `packages/fs` | `@tekbreed/tekmemo-fs` | `@tekmemo` |
| `packages/agentfs` | `@tekbreed/tekmemo-agentfs` | `@tekmemo` |
| `packages/graph` | `@tekbreed/tekmemo-graph` | `@tekmemo` |
| `packages/recall` | `@tekbreed/tekmemo-recall` | `@tekmemo` |
| `packages/rerank` | `@tekbreed/tekmemo-rerank` | `@tekmemo` |
| `packages/rerank-voyage` | `@tekbreed/tekmemo-rerank-voyage` | `@tekmemo` |
| `packages/cloud-client` | `@tekbreed/tekmemo-cloud-client` | `@tekmemo` |
| `packages/ai-sdk` | `@tekbreed/tekmemo-ai-sdk` | `@tekmemo` |
| `packages/cli` | `@tekbreed/tekmemo-cli` | `@tekmemo` |
| `packages/mcp-server` | `@tekbreed/tekmemo-mcp-server` | `@tekmemo` |
| `packages/server` | `@tekbreed/tekmemo-server` | `@tekmemo` |
| `packages/openai` | `@tekbreed/tekmemo-openai` | `@tekmemo` |
| `packages/voyageai` | `@tekbreed/tekmemo-voyageai` | `@tekmemo` |
| `packages/upstash-vector` | `@tekbreed/tekmemo-upstash-vector` | `@tekmemo` |
| `packages/adapters` | `@tekbreed/tekmemo-adapters` | `@tekmemo` |
| `packages/benchmark-kit` | `@tekbreed/tekmemo-benchmark-kit` | `@tekmemo` |
| `tooling/tsdown-config` | `@repo/tsdown-config` | `@repo` — internal tooling only |
| `tooling/typescript-config` | `@repo/typescript-config` | `@repo` — internal tooling only |
| `tooling/utils` | `@repo/utils` | `@repo` — internal tooling only |
| `tooling/test-utils` | `@repo/test-utils` | `@repo` — internal tooling only |

---

## Package-by-Package Deep Dive

### 1. `@tekbreed/tekmemo` — Core Memory Runtime

**Version**: 0.1.0 | **Zero runtime deps** | **MIT**

The canonical memory protocol. This is the foundation every other package builds on.

**`MemoryStore` interface** — the contract ALL storage adapters implement:

```ts
interface MemoryStore {
  read(path: MemoryPath): Promise<string>;
  write(path: MemoryPath, content: string): Promise<void>;
  append(path: MemoryPath, content: string): Promise<void>;
  exists(path: MemoryPath): Promise<boolean>;
}
```

**Canonical `.tekmemo/` paths:**

```
.tekmemo/
  manifest.json              Project identity and file catalog
  memory/core.md             Compact, always-relevant canonical truth
  memory/notes.md            Durable notes, summaries, archival
  events/memory-events.jsonl Audit trail of memory changes
  events/conversations.jsonl Agent conversation fragments
  indexes/chunks.jsonl        Text chunks for embedding
  graph/nodes.jsonl          Graph memory nodes
  graph/edges.jsonl          Graph memory edges
  snapshots/snapshots.jsonl  Versioned checkpoints
```

**Key types:**
- `TimestampedNote` — structured note with timestamp, kind (7 kinds), tags, confidence, metadata
- `ConversationEntry` — JSONL entry with role (user/assistant/system/tool)
- `MemoryChunk` — text fragment for embedding with id, hash, offsets, source reference
- `MemoryEvent` — audit trail entry with 13 event types and 4 actor types
- `SnapshotRecord` — versioned checkpoint record
- `TekMemoManifest` — file-structure descriptor
- `MemoryCommand` — discriminated union: `view | create | update | search`

**Error hierarchy:**
```
TekMemoError
  ├── MemoryNotFoundError
  ├── MemoryPathError
  ├── MemoryStoreError
  ├── MemoryValidationError
  ├── MemoryCommandError
  └── MemoryParseError
```

**Key exports:**
- `InMemoryMemoryStore` — reference implementation for tests
- `bootstrapMemoryStore(store)` — creates all canonical `.tekmemo/` files with defaults
- `chunkText(text, options)` — splits text into overlapping chunks
- `searchMemoryText(options)` — keyword search across memory files
- `runMemoryCommand(command)` — unified command executor
- Document helpers for core, notes, conversations, events, chunks, snapshots, manifest

**Internal structure (`src/`):**

```
bootstrap/       bootstrap-memory-store.ts
chunking/        chunk-text.ts
commands/        run-memory-command.ts
constants/       memory-paths.ts
defaults/        templates.ts
documents/       core-memory.ts, notes-memory.ts, conversations-memory.ts
errors/          errors.ts
events/          memory-events.ts
indexes/         chunk-records.ts
manifest/        manifest.ts
search/          search-memory.ts
snapshots/       snapshot-records.ts
stores/          in-memory-store.ts
types/           memory-store.ts, memory-documents.ts, memory-commands.ts
validation/      assertions.ts, jsonl.ts
```

**Used by**: `@tekbreed/tekmemo-fs`, `@tekbreed/tekmemo-agentfs`, `@tekbreed/tekmemo-ai-sdk`, `@tekbreed/tekmemo-cli`, `@tekbreed/tekmemo-mcp-server`

---

### 2. `@tekbreed/tekmemo-fs` — Local Filesystem Adapter

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo` | **MIT**

Implements `MemoryStore` on top of Node.js `fs`, persisting `.tekmemo/` files to disk.

**Key design features:**
- **Atomic writes** — writes to a temp file with `wx` (exclusive create), then `fs.rename()` with up to 5 retries on `EEXIST` collisions
- **Symlink protection** — walks every path segment from rootDir, rejecting symlinks via `fs.lstat()`
- **Path escape prevention** — uses `path.resolve` + `path.relative` to ensure resolved paths stay within rootDir
- **Path locking** — `PathLock` serializes concurrent reads/writes on the same file path to prevent race conditions
- **Missing file behavior** — configurable `"throw"` (default, throws `MemoryNotFoundError`) or `"empty"` (returns `""`)
- **Auto-create** — creates rootDir and parent directories automatically (configurable)
- **File modes** — defaults to directory `0o700` and file `0o600` for security

**Internal structure (`src/`):**

```
create-node-fs-memory-store.ts  Factory function
node-fs-memory-store.ts         Main class implementing MemoryStore
errors/                         FsMemoryStoreError + ENOENT/EEXIST helpers
types/                          Options, MissingFileBehavior types
utils/                          assert-no-symlink, ensure-parent/root-dir,
                                normalize-options, path-lock,
                                resolve-absolute-memory-path, write-file-atomic
```

**Key exports:**
- `createNodeFsMemoryStore(options)` — factory
- `NodeFsMemoryStore` — class implementing `MemoryStore`
- `FsMemoryStoreError` — error class

**Used by**: `@tekbreed/tekmemo-cli`, `@tekbreed/tekmemo-mcp-server` (for local runtime mode)

---

### 3. `@tekbreed/tekmemo-agentfs` — AgentFS Session Workspace

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo` | **MIT**

Dual-purpose package providing an agent session workspace and a MemoryStore adapter for remote AgentFS.

**A) `AgentfsMemoryStore`** — Implements `MemoryStore` backed by an AgentFS-like remote client. Accepts any structural type matching `AgentfsLikeClient` (duck typing):

```ts
interface AgentfsLikeClient {
  readText(path: string): Promise<string>;
  writeText(path: string, content: string): Promise<void>;
  appendText?(path: string, content: string): Promise<void>;  // optional
  exists?(path: string): Promise<boolean>;                     // optional
  sync?: { pull?(); push?(); checkpoint?(label: string) };     // optional
}
```

Three scopes supported — `project`, `user`, `session` — each with a dedicated ID. Paths resolve like `/stores/project/proj_123/.tekmemo/...`. Safe segment validation rejects IDs containing `/`, `\`, `..`, null bytes, or spaces.

**B) Agent Session Workspace** — `createTekMemoAgentSession()` creates a structured session document layout:

```
session_.../
  context/     core.md, notes.md, manifest.json
  working/     plan.md, commands.md, errors.md, changes.md, notes.md
  output/      summary.md, durable-memory.md, follow-ups.md
  meta.json
```

Lifecycle:
1. `prepare()` — pulls context from durable TekMemo memory, scaffolds working/output files without overwriting existing agent work
2. Agent works in the workspace files
3. `complete()` — extracts output, optionally appends durable memory to TekMemo notes, checkpoints, and pushes

**C) Lease Management** — `MemoryLeaseManager` interface with `InMemoryLeaseManager`. `withMemoryLease()` wraps an operation: acquire → execute → release. Suitable for single-process coordination.

**D) Sync Hooks** — `syncBeforeSession()` pulls changes, `syncAfterSession()` checkpoints then pushes.

**Internal structure (`src/`):**

```
client/         AgentfsLikeClient & AgentfsLikeSync interfaces
errors/         AgentfsError hierarchy (5 subclasses)
leases/         MemoryLeaseManager, InMemoryLeaseManager, withMemoryLease
session/        TekMemoAgentSession controller + workspace helpers
store/          AgentfsMemoryStore, path resolution, root normalization
sync/           checkpoint, pull, push hooks
types/          Config, scope, missingFileBehavior types
utils/          String assertions, not-found detection, safe segments
```

**Key exports**: ~60 public exports spanning store, session, lease, sync, and config APIs.

**Used by**: `@tekbreed/tekmemo-cli`, `@tekbreed/tekmemo-mcp-server`, reexported via `@tekbreed/tekmemo-adapters/agentfs`

---

### 4. `@tekbreed/tekmemo-graph` — Graph Memory Contracts

**Version**: 0.1.0 | **Zero deps** — fully standalone | **MIT**

Defines the graph memory layer independently of core `@tekbreed/tekmemo`. This is its own contract ecosystem.

**`GraphStore` interface** — 15 methods:

```ts
interface GraphStore {
  upsertNodes(nodes): Promise<StoredGraphNode[]>;
  upsertEdges(edges): Promise<StoredGraphEdge[]>;
  getNode(id): Promise<StoredGraphNode | undefined>;
  getEdge(id): Promise<StoredGraphEdge | undefined>;
  queryNodes(query?): Promise<StoredGraphNode[]>;
  queryEdges(query?): Promise<StoredGraphEdge[]>;
  neighbors(query): Promise<GraphNeighbor[]>;
  shortestPath(query): Promise<GraphPath | undefined>;
  mergeNodes(input): Promise<StoredGraphNode>;
  decayEdges(input): Promise<{ updated: number; deleted: number }>;
  deleteNode(id, options?): Promise<boolean>;
  deleteEdge(id): Promise<boolean>;
  clear(): Promise<void>;
  exportSnapshot(): Promise<GraphSnapshot>;
  importSnapshot(snapshot, options?): Promise<void>;
}
```

**Data model:**
- **Nodes**: id, type (14 built-in + custom), label, aliases, summary, sourceRefs, confidence (0-1), importance (0-1), status (active/deprecated/conflicted/deleted), temporal fields
- **Edges**: id, from → to, type (11 built-in + custom), directed, dedupeKey, weight/confidence, status, temporal fields, sourceRefs, metadata
- **Edge identity modes**: canonical, source-aware, event-aware

**Built-in node types**: `person`, `project`, `workspace`, `repo`, `document`, `code_symbol`, `task`, `decision`, `tool`, `concept`, `preference`, `policy`, `procedure`, `custom`

**Built-in edge types**: `uses`, `mentions`, `depends_on`, `authored_by`, `decided`, `supersedes`, `blocks`, `owns`, `prefers`, `related_to`, `custom`

**`InMemoryGraphStore`** — full implementation with:
- Bidirectional edge indexing (outgoing/incoming by node)
- Edge type indexing for query optimization
- BFS fewest-hops path finding
- Dijkstra-like weighted shortest path
- Node merging with alias/source-refs/metadata merging and edge re-wiring
- Edge decay (multiplicative weight reduction)
- Snapshot import/export with validation

**Rule-based extractor** — parses (subject, relation, object) triples from text using regex patterns plus an arrow shortcut (`A -> REL -> B`).

**Internal structure (`src/`):**

```
types.ts          36 type/interface definitions
errors/           TekMemoGraphError hierarchy (5 subclasses)
store/            InMemoryGraphStore
extraction/       Rule-based fact extractor
expansion/        BFS graph expansion from seed nodes
invalidation/     Superseded/conflicting edge detection
filters/          Metadata deep-match filtering
temporal/         Active/expired node and edge resolution
jsonl/            Graph JSONL serialization
utils/            Clone, IDs, metadata, source-refs, time, validation
```

**Key exports**: 36+ type exports, `InMemoryGraphStore`, `createInMemoryGraphStore`, extraction/expansion/filtering/temporal utilities.

---

### 5. `@tekbreed/tekmemo-recall` — Semantic Recall Contracts

**Version**: 0.1.0 | **Zero deps** | **MIT**

Foundation for vector-based semantic recall. Defines contracts that embedding and vector store packages plug into.

**`RecallStore` interface:**

```ts
interface RecallStore {
  upsert(documents: RecallDocument[]): Promise<string[]>;
  query(query: RecallQuery): Promise<RecallResult[]>;
  delete(ids: string[], options?): Promise<number>;
  deleteBySource(input: DeleteBySourceInput): Promise<number>;
}
```

**Recall document model:**

```ts
interface RecallDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: RecallMetadata;
  namespace?: string;
}
```

**Filter system** — 10 operators: `$eq`, `$ne`, `$in`, `$nin`, `$gt`, `$gte`, `$lt`, `$lte`, `$exists`, `$contains`. Matches metadata with deep equality and dot-notation path access.

**`InMemoryRecallStore`** — full implementation with:
- Cosine similarity scoring
- Namespace isolation (convention-based `project/{id}`)
- Duplicate ID handling (upsert overwrites)
- Project-scoped metadata filtering
- `snapshot()`, `clear()`, `count()` inspection methods

**Key exports:**
- `InMemoryRecallStore`, `createInMemoryRecallStore`
- `cosineSimilarity(a, b)`, `sortRecallScores(results)`, `matchesRecallFilter(metadata, filter)`
- `createRecallDocument`, `createRecallDocuments` (test fixtures)
- `createProjectNamespace`, `normalizeNamespace`
- Validation functions for embeddings, documents, queries, filters, metadata

**Internal structure (`src/`):**

```
types.ts          Core types (RecallStore, RecallDocument, RecallQuery, etc.)
errors/           RecallError hierarchy (5 subclasses)
filters/          Filter matching with deep equality
scoring/          Cosine similarity + result sorting
stores/           InMemoryRecallStore
testing/          Test fixture factories
utils/            JSON deep-clone utilities, namespace helpers
validation/       Comprehensive input validation and assertions
```

**Used by**: `@tekbreed/tekmemo-upstash-vector` (implements RecallStore), `@tekbreed/tekmemo-cloud-client` (recall API types), `@tekbreed/tekmemo-ai-sdk` (recall tools)

---

### 6. `@tekbreed/tekmemo-openai` — OpenAI Embedding Adapter

**Version**: 0.1.0 | **Peer**: `openai` (^6.10.0, optional) | **MIT**

Implements `MemoryEmbedder` for OpenAI embeddings. Provides both an SDK-backed client and a fetch-based fallback.

**`MemoryEmbedder` interface:**

```ts
interface MemoryEmbedder {
  embedTexts(input: EmbedTextsInput): Promise<EmbedTextsResult>;
  embedText?(input: EmbedTextsInput): Promise<EmbedTextsResult>;
}
```

**Supported models:**
| Model | Default Dimensions | Supports Custom Dimensions |
|---|---|---|
| `text-embedding-3-small` | 1536 | 512–1536 |
| `text-embedding-3-large` | 3072 | 256–3072 |
| `text-embedding-ada-002` | 1536 | No |

**Key features:**
- Max batch size: 2048 texts per request
- `OpenAISdkEmbeddingsClient` — wraps the official `openai` SDK
- Automatic dimension validation and model detection
- Retry with exponential backoff and jitter
- Exports `./testing` subpath with `FakeOpenAIEmbeddingsClient`

**Internal structure (`src/`):**

```
types.ts          Core type definitions
client/           OpenAISdkEmbeddingsClient (SDK wrapper)
embedder/         OpenAIEmbedder class (batching, validation)
errors/           7 error classes
models/           Model constants, dimension validation
utils/            Batching, retry, validation helpers
testing/          Fake client for tests
```

**Key exports**: `OpenAIEmbedder`, `createOpenAIEmbedder`, `createOpenAIClient`, model constants, 7 error classes.

---

### 7. `@tekbreed/tekmemo-voyageai` — VoyageAI Embedding Adapter

**Version**: 0.1.0 | **Zero npm deps** (uses `fetch`) | **MIT**

Implements `MemoryEmbedder` for VoyageAI embeddings via a pure fetch-based HTTP client.

**Key features:**
- 9 models with flexible dimensions (256/512/1024/2048)
- 7 models with fixed dimensions
- Input types: `query` or `document`
- Output dtypes: `float`, `int8`, `uint8`, `binary`, `ubinary`
- Max batch size: 1000 texts per request
- Pure `fetch`-based transport — zero npm dependencies
- Retry with exponential backoff
- Exports `./testing` subpath with `FakeVoyageClient`

**Internal structure (`src/`):**

```
types.ts          Core type definitions
client/           VoyageRestClient (fetch-based HTTP)
embedder/         VoyageEmbedder class
errors/           8 error classes
models/           Model constants, flexible/fixed dimensions
utils/            Batching, retry, validation
testing/          Fake client for tests
```

**Key exports**: `VoyageEmbedder`, `createVoyageEmbedder`, `createVoyageClient`, model constants, 8 error classes.

---

### 8. `@tekbreed/tekmemo-upstash-vector` — Upstash Vector Recall Adapter

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo-recall` | **Peer**: `@upstash/vector` (^1.2.0, optional) | **MIT**

Implements `RecallStore` backed by an Upstash Vector index.

**`UpstashLikeIndex`** — structural interface for any Upstash-compatible vector store:

```ts
interface UpstashLikeIndex {
  upsert(points, options?): Promise<string>;
  query(options): Promise<{ matches: QueryResultItem[] }>;
  delete(ids, options?): Promise<number>;
}
```

**Key features:**
- **Filter builder** — translates `RecallFilter` with 10 operators to Upstash filter strings
- **Namespace isolation** — convention-based `project/{id}` namespacing
- **Metadata normalization** — maps recall documents to/from Upstash flat metadata format
- **Delete by source** — resolves chunk IDs from source metadata before deleting
- Accepts any `UpstashLikeIndex` (not just the official SDK), enabling custom or testing implementations

**Internal structure (`src/`):**

```
client/           UpstashLikeIndex interface + assertion
errors/           UpstashRecallError, UpstashRecallValidationError
filters/          Filter-to-Upstash translation
metadata/         Metadata normalization
namespace/        Namespace resolution
store/            UpstashRecallStore (full RecallStore impl)
testing/          FakeUpstashIndex for tests
utils/            Object helpers
```

**Key exports**: `UpstashRecallStore`, `createUpstashRecallStore`, `buildUpstashFilter`, metadata/namespace helpers.

---

### 9. `@tekbreed/tekmemo-rerank` — Reranking Contracts

**Version**: 0.1.0 | **Zero deps** | **MIT**

Defines the reranking protocol and provides a deterministic fallback.

**`Reranker` interface:**

```ts
interface Reranker {
  rerank(input: RerankInput): Promise<RerankResult[]>;
}
```

**`DeterministicFallbackReranker`** — lexical similarity reranker that works without external providers. Tokenizes queries and documents, scores via exact and partial token matches. Use it as a fallback when external reranking providers are unavailable.

**Key features:**
- `stableSortRerankResults` — stable sort by score desc, then ID, then original position
- `applyTopK(results, topK)` — sorts then truncates
- Input validation: safe IDs, non-empty strings, topK normalization, document count checks
- Exports `./testing` subpath with `FakeReranker` (programmable scores)

**Internal structure (`src/`):**

```
types.ts          Reranker, RerankInput, RerankResult, RerankDocument
errors/           4 error classes
fallback/         DeterministicFallbackReranker (lexical scoring)
sort/             stableSortRerankResults, applyTopK
validation/       Input/output validation, metadata validation
testing/          FakeReranker for tests
```

**Key exports**: `DeterministicFallbackReranker`, `createDeterministicFallbackReranker`, sorting/validation helpers.

---

### 10. `@tekbreed/tekmemo-rerank-voyage` — VoyageAI Reranking Adapter

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo-rerank` | **Zero npm deps** | **MIT**

Implements `Reranker` using VoyageAI's `/v1/rerank` endpoint.

**Supported models** (6): `rerank-2.5`, `rerank-2.5-lite`, `rerank-2`, `rerank-2-lite`, `rerank-1`, `rerank-lite-1`

**Key features:**
- Max 1000 documents per request
- Maps Voyage response items (index, relevance_score, document) to `RerankResult[]`
- Validates the response: document ordering, score ranges, index consistency
- Pure fetch-based transport with retry and timeout
- Exports `./testing` subpath

**Internal structure (`src/`):**

```
types.ts          Config, request/response, retry types
client/           VoyageRerankRestClient (fetch-based HTTP)
errors/           7 error classes
models/           API constants and supported model set
reranker/         VoyageReranker class
utils/            Retry logic, validation
```

**Key exports**: `VoyageReranker`, `createVoyageReranker`, `createVoyageRerankClient`, model constants.

---

### 11. `@tekbreed/tekmemo-cloud-client` — Cloud API Client

**Version**: 0.1.0 | **Zero deps** — fully self-contained | **MIT**

TekMemo Cloud API transport client. Has NO dependency on `@tekbreed/tekmemo` or any other `@tekbreed/tekmemo-*` package. Self-contained HTTP client using standard `fetch`.

**Client surfaces** (all accessed through a single `TekMemoCloudClient`):

| Client | Purpose |
|---|---|
| `client.memory` | Core memory, notes CRUD |
| `client.recall` | Vector recall indexing and querying |
| `client.context` | Context composition from memory |
| `client.graph` | Graph nodes, edges, paths, neighbors |
| `client.extraction` | Entity/fact extraction |
| `client.evals` | Evaluation framework |
| `client.benchmarks` | Benchmark submission |
| `client.sync` | Push/pull/status/resolve conflicts |
| `client.exports` | Memory exports |
| `client.snapshots` | Snapshot management |
| `client.providers` | Provider credential management |
| `client.agentSessions` | Agent session lifecycle |

**Key features:**
- `createTekMemoCloudClient(options)` — main factory
- `createTekMemoCloudClientFromEnv()` — reads from `TEKMEMO_*` environment variables
- `createProjectScopedClient(client, projectId)` — pre-binds a project ID
- HTTP transport with retry, timeout, secret redaction, envelope parsing
- 300+ type definitions for all API surfaces
- Runtime wrappers: `createCloudTekMemoRuntime`, `createHybridTekMemoRuntime`

**Error hierarchy** (11 classes):
```
TekMemoCloudError
  ├── TekMemoCloudAuthError
  ├── TekMemoCloudConfigurationError
  ├── TekMemoCloudConflictError
  ├── TekMemoCloudNetworkError
  ├── TekMemoCloudNotFoundError
  ├── TekMemoCloudPermissionError
  ├── TekMemoCloudRateLimitError
  ├── TekMemoCloudResponseParseError
  ├── TekMemoCloudServerError
  ├── TekMemoCloudTimeoutError
  └── TekMemoCloudValidationError
```

**Internal structure (`src/`):**

```
client.ts         Factory functions (3 variants)
errors.ts         11 error classes + redactSecrets + isTekMemoCloudError
runtime.ts        Cloud and hybrid runtime wrappers
transport.ts      HTTP transport with retry/timeout/envelope parsing
types.ts          300+ type definitions (80+ exported)
validation.ts     Comprehensive input validation (504 lines)
```

**Used by**: `@tekbreed/tekmemo-cli`, `@tekbreed/tekmemo-mcp-server`

---

### 12. `@tekbreed/tekmemo-cli` — Command-Line Interface

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo`, `@tekbreed/tekmemo-fs`, `@tekbreed/tekmemo-agentfs`, `@tekbreed/tekmemo-cloud-client` | **MIT**

Binary: `@tekbreed/tekmemo`. Commander-based CLI with local, cloud, and agent commands (~1568-line runner).

**Local commands:**
- `tekmemo init` — bootstrap `.tekmemo/` in current directory
- `tekmemo remember "<note>"` — append a durable note
- `tekmemo context` — compose memory context
- `tekmemo read [core|notes|manifest]` — read canonical files
- `tekmemo events` — read memory event log
- `tekmemo chunks` — read chunk index
- `tekmemo snapshot` — create a versioned checkpoint
- `tekmemo doctor` — detect missing or corrupt files
- `tekmemo validate` — strict protocol validation
- `tekmemo search "<query>"` — text search across memory
- `tekmemo edit` — append to core or notes
- `tekmemo diff` — compare snapshots
- `tekmemo agent [start|paths|extract|complete]` — AgentFS session workspace commands

**Cloud commands:**
- `tekmemo cloud health` — API health check
- `tekmemo cloud context [compose]` — compose context from cloud
- `tekmemo cloud recall` — recall query
- `tekmemo cloud remember` — write durable note
- `tekmemo cloud read` — read memory
- `tekmemo cloud update-core` — update core memory
- `tekmemo cloud recent` — recent events
- `tekmemo cloud validate` — validate cloud protocol
- `tekmemo cloud snapshot` — snapshot management
- `tekmemo cloud sync [push|pull|resolve]` — sync operations
- `tekmemo cloud readiness` — deployment readiness check
- `tekmemo cloud graph` — graph operations
- `tekmemo cloud extraction` — entity extraction
- `tekmemo cloud evals|benchmarks|exports|snapshots|providers` — advanced operations

**Config commands:**
- `tekmemo config get` — read `.tekmemo/config.json`
- `tekmemo config init` — write a new config file

**Export entry points:**
1. `"."` — Main programmatic API (`runTekMemoCli`, error classes, filesystem, config, protocol)
2. `"./testing"` — Test utilities (`createTempTekMemoDir`)

**Internal structure (`src/`):**

```
runner.ts          Main Commander program (1568 lines)
bin/               CLI binary entry point
cloud/             Cloud connection helpers
commands/          All subcommand implementations (agent, chunks, cloud, context, diff,
                   doctor, edit, events, init, inspect, read, remember, runtime,
                   search, snapshot, validate)
config/            .tekmemo/config.json reading/writing
errors/            CLI error hierarchy (6 classes)
fs/                TekMemoFileSystem wrapper
output/            Buffered output, JSON envelope printing
protocol/          Constants, JSONL, manifest, schemas, summary
testing/           Temp directory helpers for tests
utils/             Content, labels, metadata, numbers, secret scanning
```

---

### 13. `@tekbreed/tekmemo-mcp-server` — MCP Server

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo`, `@tekbreed/tekmemo-fs`, `@tekbreed/tekmemo-agentfs`, `@tekbreed/tekmemo-cloud-client` | **Peer**: `@modelcontextprotocol/sdk` (>=1.29.0, optional) | **MIT**

Binary: `tekmemo-mcp-server`. Exposes TekMemo memory as MCP tools, resources, and prompts.

**35 MCP tool definitions** (972 lines), including:
- `memory_read`, `memory_write`, `memory_append` — raw path-based CRUD
- `read_core_memory`, `update_core_memory` — core memory operations
- `remember`, `list_notes` — note management
- `memory_recall`, `memory_search` — semantic and text search
- `context_compose` — build AI context from memory
- `index_chunks` — embed and index text chunks
- Graph operations: query nodes, edges, neighbors, paths, merge nodes, decay edges
- Conversations, events, chunks, snapshots
- Agent session lifecycle: start, paths, extract, complete

**10+ MCP resources** — core memory, notes, conversations, events, chunks, snapshots, manifest, graph nodes, graph edges

**2 MCP prompts** — `tekmemo-recall-context`, `tekmemo-memory-review`

**Runtime modes:**
- `--runtime local` — local filesystem via `@tekbreed/tekmemo-fs`
- `--runtime cloud` — TekMemo Cloud API via `@tekbreed/tekmemo-cloud-client`
- `--runtime hybrid` — combined local + cloud with read/write policies
- `--runtime in-memory` — in-memory store (testing)

**Safety flags:**
- `--read-only` — blocks all write tools
- `--allow-writes` — explicitly enables writes (overrides read-only)
- `--read-policy [local-first|cloud-first|local-only|cloud-only]` — controls read source

**7 export subpaths:**

| Subpath | What it provides |
|---|---|
| `.` | Main server types, runtime factory, errors, tools, resources, prompts |
| `./stdio` | `runStdioServer` for stdin/stdout transport |
| `./sdk` | `registerTekMemoMcpCapabilities` for MCP SDK server instances |
| `./runtime/local` | Local runtime creation |
| `./runtime/cloud` | Cloud runtime creation |
| `./runtime/hybrid` | Hybrid runtime creation |
| `./runtime/factory` | Runtime factory with env + config resolution |

**Internal structure (`src/`):**

```
errors.ts           TekMemoMcpError hierarchy (6 classes)
schema.ts           Protocol schemas, JSON Schema builders
types.ts            500 lines of types (JSON values, MCP types, memory types, runtime interface)
bin/                CLI binary entry point
prompts/            2 prompt handlers
protocol/           JSON-RPC, MCP protocol server, lifecycle
resources/          10+ resource definitions and handlers
runtime/            Cloud, hybrid, in-memory, local, factory
sdk/                SDK server registration adapter
stdio/              Readline-based stdio transport
tools/              35 tool definitions + 1223-line execution handler
utils/              JSON, limits, pagination, timeout, validation
```

---

### 14. `@tekbreed/tekmemo-server` — Hono Self-Host Server

**Version**: 0.1.0 | **External deps**: `hono`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `pg` | **MIT**

Self-hostable TekMemo memory server. Exposes a TekMemo-compatible `/api/v1` HTTP API that works with `@tekbreed/tekmemo-cloud-client`. Intentionally separate from cloud billing, marketing, CMS, and SaaS features.

**Architecture:**
- **`app.ts`** — Hono app factory: `createTekMemoServer(app)`, `createInMemoryTekMemoServer()`
- **Auth** — API key middleware (`Authorization: Bearer tk_...`)
- **Routes**: `/health`, `/api/v1/projects/:projectId/memory/core`, `/api/v1/projects/:projectId/memory/notes`, `/api/v1/projects/:projectId/recall`, agent sessions
- **Storage backends**: PostgreSQL store, S3 object store, local filesystem object store
- **Job queue**: Postgres-backed for async operations
- **`createNodeServer(env)`** — Node.js entry point with environment variable binding

**Key exports:**
- `TekMemoServerStore` — interface with 15 methods for server-side storage
- `createTekMemoServer`, `createInMemoryTekMemoServer`
- `createNodeServer` — Node.js server entry
- Error classes: `TekMemoServerError`, `TekMemoServerValidationError`, `TekMemoServerAuthError`, `TekMemoServerNotFoundError`

**Internal structure (`src/`):**

```
app.ts             Hono app factory
errors.ts          Server error classes
http.ts            Response helpers (success/failure with envelopes)
types.ts           236 lines of server types
validation.ts      Input validation helpers
middleware/        Auth, request ID middleware
node/              Node.js server, env helpers, object store, postgres, S3
routes/            Health, memory, projects, recall, agent-sessions
storage/           Job queue interface
```

---

### 15. `@tekbreed/tekmemo-ai-sdk` — Vercel AI SDK Integration

**Version**: 0.1.0 | **Depends on**: `@tekbreed/tekmemo` | **Peer**: `ai` (>=5.0.0 <7.0.0, optional), `@tekbreed/tekmemo-cloud-client` (optional) | **MIT**

Plug-and-play Vercel AI SDK tools for TekMemo memory.

**Key functions:**
- `createLocalAiSdkRuntime(store)` — wraps `MemoryStore` into `TekMemoAiRuntime`
- `defineTekMemoTools(options)` — builds AI SDK tool definitions
- `buildTekMemoSystemPrompt(options)` — generates a system prompt with memory context
- `buildAgentSessionInstructions(options)` — markdown instructions for AgentFS sessions
- `buildRuntimeMemoryContext(runtime, input)` — builds runtime memory context (core, notes, recall) with truncation

**Memory tool commands**: `view`, `create`, `update`, `search` on core/notes/conversations

**Runtime tools**: `memory_read`, `memory_update`, `remember`, `list_notes`, `recall`, `build_context`, `index`

**Scope policy** — access context filtering:
- `assertMemoryScope`, `assertScopeAllowed` — enforce project/user/conversation/participant boundaries
- `inferWriteScope` — determines scope from tool input
- `createRecallFilters` — generates recall filters from scope metadata
- `normalizeAccessContext` — applies defaults to access context

**Safety defaults:**
- Writes disabled by default (`allowWrites: false`)
- Core memory updates disabled by default (`allowCoreMemoryWrites: false`)
- Indexing disabled by default (`allowIndexing: false`)
- Secret content detection disabled by default (`allowSecretContent: false`)

**Internal structure (`src/`):**

```
agent-session/     AgentFS session instruction builder
prepare-call/      Context building for AI calls
runtime/           Runtime memory context builder
schemas/           Zod schemas for tool inputs
scope/             Access control and scope policy
tools/             Tool definition builders and executors
types/             AI SDK memory types, retrieval, runtime types
```

---

### 16. `@tekbreed/tekmemo-adapters` — Adapter Aggregation

**Version**: 0.1.0 | **Depends on**: all @tekmemo adapter packages | **MIT**

Convenience reexport package. Root import is metadata-only — optional peers are not loaded at root import time:

```ts
// Root import — types only, no runtime loading
import { tekMemoAdapters } from "@tekbreed/tekmemo-adapters";

// Subpath imports — load specific adapters
import { createAgentfsMemoryStore } from "@tekbreed/tekmemo-adapters/agentfs";
import { defineTekMemoTools } from "@tekbreed/tekmemo-adapters/ai-sdk";
import { createOpenAIEmbedder } from "@tekbreed/tekmemo-adapters/openai";
import { FakeOpenAIEmbeddingsClient } from "@tekbreed/tekmemo-adapters/openai/testing";
```

**Subpath exports** (each is a single-line `export *`):
| Subpath | Reexports from |
|---|---|
| `./agentfs` | `@tekbreed/tekmemo-agentfs` |
| `./ai-sdk` | `@tekbreed/tekmemo-ai-sdk` |
| `./cloud-client` | `@tekbreed/tekmemo-cloud-client` |
| `./openai` | `@tekbreed/tekmemo-openai` |
| `./openai/testing` | `@tekbreed/tekmemo-openai/testing` |
| `./upstash-vector` | `@tekbreed/tekmemo-upstash-vector` |
| `./voyageai` | `@tekbreed/tekmemo-voyageai` |
| `./voyageai/testing` | `@tekbreed/tekmemo-voyageai/testing` |
| `./rerank-voyage` | `@tekbreed/tekmemo-rerank-voyage` |
| `./rerank-voyage/testing` | `@tekbreed/tekmemo-rerank-voyage/testing` |

**Adapter catalog** (7 descriptors):
1. AgentFS — agent workspace, category: `agent-workspace`
2. AI SDK — Vercel AI SDK, category: `ai-sdk`, optional peer: `ai`
3. Cloud client — API transport, category: `cloud`
4. OpenAI — embeddings, category: `embedding-provider`, optional peer: `openai`
5. VoyageAI — embeddings, category: `embedding-provider`
6. Upstash Vector — recall store, category: `vector-store`, optional peer: `@upstash/vector`
7. VoyageAI rerank — reranking, category: `rerank-provider`

**Internal structure (`src/`):**

```
index.ts               Metadata catalog (types, adapterPackages, import paths, descriptors)
agentfs/index.ts       export * from "@tekbreed/tekmemo-agentfs"
ai-sdk/index.ts        export * from "@tekbreed/tekmemo-ai-sdk"
cloud-client/index.ts  export * from "@tekbreed/tekmemo-cloud-client"
openai/index.ts        export * from "@tekbreed/tekmemo-openai"
openai/testing/        export * from "@tekbreed/tekmemo-openai/testing"
rerank-voyage/index.ts export * from "@tekbreed/tekmemo-rerank-voyage"
rerank-voyage/testing/ export * from "@tekbreed/tekmemo-rerank-voyage/testing"
upstash-vector/index.ts export * from "@tekbreed/tekmemo-upstash-vector"
voyageai/index.ts      export * from "@tekbreed/tekmemo-voyageai"
voyageai/testing/      export * from "@tekbreed/tekmemo-voyageai/testing"
```

---

### 17. `@tekbreed/tekmemo-benchmark-kit` — Benchmarking Toolkit

**Version**: 0.1.0 | **Zero deps** | **MIT**

Provider-neutral benchmarking toolkit for measuring performance of TekMemo memory operations.

**Runners:**
- `BenchmarkRunner` — executes suites with configurable warmup iterations, concurrency, fail-fast, and timeouts
- `createBenchmarkSuite` — validates and creates suites

**Reporters:**
- `jsonBenchmarkReport(result)` — machine-readable JSON output
- `markdownBenchmarkReport(result)` — human-readable Markdown table

**Statistics** (per benchmark case):
- `summarizeIterations(iterations)` — count, successes, failures, error rate, min/max/mean/median, p50/p90/p95/p99, throughput (iterations/sec)
- `mean(values)`, `percentile(values, p)` — arithmetic mean, linear interpolation percentile

**Thresholds** (7 configurable metrics):
- `evaluateBenchmarkThresholds(suite, thresholds)` — checks mean, p50, p90, p95, p99, success rate, throughput thresholds per case

**Workload generators:**
- `createEmbedderBenchmarkCase`, `createMemoryWriteBenchmarkCase`, `createMemoryReadBenchmarkCase`, `createRecallQueryBenchmarkCase`, `createRecallUpsertBenchmarkCase`, `createRerankBenchmarkCase`

**Utilities:**
- `SeededRandom` — LCG-based deterministic random for reproducible workloads
- `SystemBenchmarkClock`, `DeterministicBenchmarkClock` — time sources

**Testing subpath** — reexports fakes (`FakeEmbedder`, `FakeMemoryStore`, `FakeRecallStore`, `FakeReranker`)

**Internal structure (`src/`):**

```
types.ts          All benchmark type definitions
runner/           BenchmarkRunner, suite factory
reporters/        JSON and Markdown reporters
stats/            mean, percentile, summarizeIterations
thresholds/       7-metric threshold evaluation
time/             System and deterministic clocks
errors/           5 error classes
utils/            Concurrency, timeout, seeded-random, validation
workloads/        Embedder, memory-store, recall, rerank cases
testing/          Fake reexports from @repo/test-utils
```

---

## Internal Tooling (`@repo/*`)

### `@repo/tsdown-config` — Shared Build Config

**Private** — not published. Provides the `pkgConfig()` factory that every package imports:

```ts
// Every package's tsdown.config.ts:
import { pkgConfig } from "@repo/tsdown-config";
export default pkgConfig({ entry: "src/index.ts" });
```

**Default options:**

| Option | Value |
|---|---|
| `entry` | `"src/index.ts"` |
| `format` | `["esm", "cjs"]` |
| `sourcemap` | `true` |
| `dts` | `true` |
| `clean` | `true` |
| `minify` | `false` |
| `target` | `"node20"` |
| `platform` | `"node"` |
| `fixedExtension` | `true` |
| `deps.alwaysBundle` | Bundles `@repo/utils` into consumers |

### `@repo/typescript-config` — Shared TS Config

**Private** — not published. Every package's `tsconfig.json` extends `@repo/typescript-config/base.json`:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "incremental": false,
    "isolatedModules": true,
    "lib": ["es2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleDetection": "force",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

### `@repo/utils` — Shared Internal Utilities

**Private** — always bundled into consumers (via `deps.alwaysBundle`). All packages use these internally:

- **Retry**: `withRetry(operation, options?)` — full retry loop with exponential backoff, jitter, retryable status codes
- **Backoff**: `computeBackoffDelay(attempt, options)` — exponential backoff formula
- **Path locking**: `PathLock` — async mutex per path string, serializes concurrent access
- **Errors**: `BaseError` — structured error with `code`, `status`, `details`, `cause`
- **Batching**: `chunkArray(items, size)` — splits array into fixed-size chunks
- **Validation**: `assertNonEmptyString`, `assertString`, `assertPositiveInteger`, `assertFiniteNumber`, `assertValidApiKey`, `normalizeBaseUrl`, `normalizeBatchSize`, `validateModel`, `validateTexts`, `validateVector`, `isNotFoundError`
- **Objects**: `isPlainObject`, `cloneJsonValue`, `cloneRecord`, `assertSafeObjectKey`

### `@repo/test-utils` — Test Infrastructure

**Private** — devDependency for all packages. Provides contract test suites, fakes, fixtures, and assertions.

**Contract test suites** (5 per interface, define once, run everywhere):
- `defineMemoryStoreContractTests(options)` — 5 tests: write/read, append ordering, missing reads, concurrent appends, exists
- `defineRecallStoreContractTests(options)` — 8 tests: upsert/query, empty results, project isolation, delete by IDs, delete by source, no mutation, duplicate ID rejection, project filter
- `defineEmbedderContractTests(options)` — 4–5 tests: per-text embeddings, empty input, query input type, empty text handling, optional embedText
- `defineRerankerContractTests(options)` — 5 tests: ranked results, empty documents, metadata preservation, duplicate ID rejection, empty query rejection

**Fakes:**
- `FakeMemoryStore` / `createFakeMemoryStore()` — Map-based in-memory store
- `FakeRecallStore` / `createFakeRecallStore()` — in-memory with real cosine similarity
- `FakeEmbedder` / `createFakeEmbedder()` — deterministic vectors, call recording
- `FakeReranker` / `createFakeReranker()` — lexical scoring, configurable failures

**Fixtures:**
- Embedding texts, deterministic vectors
- Memory paths and content (core, notes, events, chunks)
- Recall documents with orthogonal embeddings
- Rerank documents

**Vitest config:** `createVitestConfig(overrides?)` — shared vitest node config factory.

---

## Build Pipeline

```
pnpm build → turbo build
  └── @repo/utils:build (no deps)
  └── @repo/test-utils:build (depends on: @repo/utils)
  └── tekmemo:build (depends on: @repo/utils)
  └── @tekbreed/tekmemo-graph:build (standalone)
  └── @tekbreed/tekmemo-recall:build (standalone)
  └── @tekbreed/tekmemo-rerank:build (standalone)
  └── @tekbreed/tekmemo-openai:build (standalone)
  └── @tekbreed/tekmemo-voyageai:build (standalone)
  └── @tekbreed/tekmemo-cloud-client:build (standalone)
  └── @tekbreed/tekmemo-server:build (standalone)
  └── @tekbreed/tekmemo-benchmark-kit:build (depends on: @repo/test-utils)
  └── @tekbreed/tekmemo-fs:build (depends on: tekmemo)
  └── @tekbreed/tekmemo-agentfs:build (depends on: tekmemo)
  └── @tekbreed/tekmemo-upstash-vector:build (depends on: @tekbreed/tekmemo-recall)
  └── @tekbreed/tekmemo-rerank-voyage:build (depends on: @tekbreed/tekmemo-rerank)
  └── @tekbreed/tekmemo-ai-sdk:build (depends on: tekmemo)
  └── @tekbreed/tekmemo-cli:build (depends on: tekmemo, fs, agentfs, cloud-client)
  └── @tekbreed/tekmemo-mcp-server:build (depends on: tekmemo, fs, agentfs, cloud-client)
  └── @tekbreed/tekmemo-adapters:build (depends on: all 7 adapters)
```

All packages output **dual ESM + CJS** via tsdown with `dts: true`, `sourcemap: true`, `fixedExtension: true`.

**Turborepo tasks** (from `turbo.json`):

| Task | DependsOn | Cache | Outputs |
|---|---|---|---|
| `build` | `^build` (upstream) | Yes | `dist/**`, `build/**` |
| `typecheck` | `^build` | Yes | (empty) |
| `test:run` | `^build` | Yes | (empty) |
| `lint:package` | `build` | Yes | (empty) |
| `//#format-and-lint` | — | Yes | (empty) |
| `build:watch` | — | No (persistent) | — |
| `dev`, `test:watch` | `^build` | No (persistent) | — |
| `benchmark:*` | `^build` | Yes/No | `../benchmark-results/**` |

---

## Verification Commands

```bash
# Full pipeline
pnpm build                 # Build all packages
pnpm typecheck             # TypeScript across all packages
pnpm test                  # All unit tests
pnpm lint:package          # Publint export validation
pnpm format-and-lint:fix   # Biome format + lint (auto-fix safe)

# Single package
pnpm --filter @tekbreed/tekmemo-agentfs build
pnpm --filter @tekbreed/tekmemo-agentfs test:run
pnpm --filter @tekbreed/tekmemo-agentfs typecheck

# Release readiness
pnpm --filter @tekbreed/tekmemo-agentfs release:check
```

---

## Adding a New Package

1. Create `packages/<name>/` directory
2. Add `package.json` — use `@tekbreed/tekmemo-<name>` for public OSS, `@repo/<name>` for internal. Set `"type": "module"`, `"node": ">=22"`
3. Add `tsconfig.json` extending `@repo/typescript-config/base.json`
4. Add `tsdown.config.ts` using the shared factory:
   ```ts
   import { pkgConfig } from "@repo/tsdown-config";
   export default pkgConfig({ entry: "src/index.ts" });
   ```
5. Add scripts: `build`, `build:watch`, `typecheck`, `test`, `test:run`, `lint:package`
6. Add `@repo/typescript-config` and `@repo/tsdown-config` to `devDependencies` with `"workspace:*"`
7. Run `pnpm install` from root
