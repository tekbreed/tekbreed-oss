# `@tekmemo/graph`

[![npm version](https://img.shields.io/npm/v/@tekmemo/graph.svg)](https://www.npmjs.com/package/@tekmemo/graph)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/graph.svg)](https://www.npmjs.com/package/@tekmemo/graph)
[![license](https://img.shields.io/npm/l/@tekmemo/graph.svg)](https://www.npmjs.com/package/@tekmemo/graph)

Provider-neutral graph memory primitives for TekMemo.

This package adds relationship memory without requiring Neo4j, Turso, Qdrant, Upstash, OpenAI, Voyage, TekMemo Cloud, or any external runtime dependency.

## Why it exists

Vector recall answers:

```txt
What text is semantically close to this query?
```

Graph memory answers:

```txt
Which entities are connected?
Why are they connected?
Which facts came from which source?
Which relationship changed, expired, or superseded another fact?
```

TekMemo needs both because graph memory handles relationship questions that pure vector similarity often misses.

## Package boundary

This package owns:

- graph node and edge contracts
- in-memory graph store
- graph validation
- metadata and source provenance validation
- neighbor traversal
- shortest path search
- node merge
- edge decay
- temporal filtering
- supersession invalidation helpers
- deterministic rule-based extraction
- JSONL parse/serialize helpers
- graph import/export snapshots

It does **not** own:

- filesystem writes to `.tekmemo/`
- vector databases
- embeddings
- reranking
- cloud sync
- auth, billing, tenant logic, or plan checks
- connector fetching
- graph database adapters

## `.tekmemo` fit

The package is designed to back this canonical protocol area:

```txt
.tekmemo/graph/
├─ nodes.jsonl
└─ edges.jsonl
```

A filesystem adapter such as `@tekmemo/fs` should read/write those files. This package only validates, serializes, parses, stores in memory, and queries graph records.

## Install

```bash
pnpm add @tekmemo/graph
```

## Core concepts

### Node types

Nodes represent entities in your graph:

| Type | Description |
|------|-------------|
| `person` | People, users, contributors |
| `project` | Projects, repositories, apps |
| `workspace` | Workspaces, organizations |
| `repo` | Code repositories |
| `document` | Documents, files, pages |
| `code_symbol` | Functions, classes, variables |
| `task` | Tasks, tickets, issues |
| `decision` | Decisions, ADRs |
| `tool` | Tools, libraries, packages |
| `concept` | Concepts, ideas, topics |
| `preference` | User preferences |
| `policy` | Policies, rules, guidelines |
| `procedure` | Procedures, workflows |
| `custom` | Your own type (use any string) |

### Edge types

Edges represent relationships between nodes:

| Type | Description |
|------|-------------|
| `uses` | Node A uses Node B |
| `mentions` | Node A mentions Node B |
| `depends_on` | Node A depends on Node B |
| `authored_by` | Node A was authored by Node B |
| `decided` | Node A represents a decision |
| `supersedes` | Node A supersedes Node B |
| `blocks` | Node A blocks Node B |
| `owns` | Node A owns Node B |
| `prefers` | Node A prefers Node B |
| `related_to` | Generic relationship |
| `custom` | Your own type (use any string) |

### Edge identity modes

Control how edges are identified when no explicit `id` is provided:

| Mode | Behavior |
|------|-----------|
| `canonical` (default) | ID = `from + type + to + directed`. Duplicate semantic edges update in place. |
| `source-aware` | ID includes source ref. Allows parallel claims from different sources. |
| `event-aware` | ID includes dedupe key. Preserves parallel edges with different provenance. |

### Status and temporality

Nodes and edges support lifecycle status:

- `active` (default) — current, valid fact
- `deprecated` — no longer current, but kept for history
- `conflicted` — conflicting information exists
- `deleted` — soft-deleted, excluded from default queries

Temporal fields control validity:

- `validFrom` / `validUntil` — ISO 8601 date range for validity
- `expiresAt` — ISO 8601 timestamp after which the fact expires

By default, queries skip inactive and expired facts. Use `includeInactive: true` or `includeExpired: true` to include them.

### Source provenance

Track where facts came from:

```ts
sourceRefs: [
  {
    sourceType: "document",     // "memory" | "document" | "conversation" | "connector" | "event" | "manual" | "custom"
    path: ".tekmemo/memory/core.md",
    span: { start: 120, end: 180 },  // character range in source
    sourceId: "optional-unique-id",
    title: "Core Memory",
    url: "https://...",
    metadata: { ... }
  }
]
```

## API reference

### `createInMemoryGraphStore(options?)`

Creates an in-memory graph store.

```ts
import { createInMemoryGraphStore } from "@tekmemo/graph";

const graph = createInMemoryGraphStore({
  allowSelfEdges: false,        // default: false — prevent A→A edges
  requireExistingNodes: true,    // default: true — edges need existing nodes
  edgeIdentityMode: "canonical" // "canonical" | "source-aware" | "event-aware"
});
```

### Node operations

#### `upsertNodes(nodes)` → `Promise<StoredGraphNode[]>`

Insert or update nodes. Returns stored nodes with defaults applied.

```ts
const nodes = await graph.upsertNodes([
  {
    id: "project:tekmemo",
    type: "project",
    label: "TekMemo",
    summary: "File-first memory runtime for AI apps and agents.",
    aliases: ["tekmemo", "memory runtime"],
    confidence: 0.95,
    importance: 1.0,
    status: "active",
    metadata: { projectId: "proj_1" }
  }
]);
```

#### `getNode(id)` → `Promise<StoredGraphNode | undefined>`

Retrieve a single node by ID.

#### `queryNodes(query?)` → `Promise<StoredGraphNode[]>`

Query nodes with filters:

```ts
const active = await graph.queryNodes({
  types: ["project", "concept"],
  statuses: ["active"],
  search: "tekmemo",           // case-insensitive label/alias search
  metadata: { projectId: "proj_1" },
  includeInactive: false,
  includeExpired: false,
  limit: 100
});
```

### Edge operations

#### `upsertEdges(edges)` → `Promise<StoredGraphEdge[]>`

Insert or update edges. Returns stored edges with defaults applied.

```ts
const edges = await graph.upsertEdges([
  {
    id: "optional-edge-id",           // auto-generated if omitted
    from: "project:tekmemo",
    to: "concept:local-first",
    type: "uses",
    directed: true,                   // default: true
    weight: 0.9,                     // default: 1.0
    confidence: 0.95,
    status: "active",
    dedupeKey: "claim:1",            // for event-aware/source-aware modes
    sourceRefs: [{ sourceType: "document", path: ".tekmemo/memory/core.md" }],
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.999Z",
    metadata: { projectId: "proj_1" }
  }
]);
```

#### `getEdge(id)` → `Promise<StoredGraphEdge | undefined>`

Retrieve a single edge by ID.

#### `queryEdges(query?)` → `Promise<StoredGraphEdge[]>`

Query edges with filters:

```ts
const strongEdges = await graph.queryEdges({
  from: "project:tekmemo",
  to: "concept:local-first",
  types: ["uses", "depends_on"],
  directed: true,
  minWeight: 0.5,
  metadata: { projectId: "proj_1" },
  limit: 100
});
```

### Traversal

#### `neighbors(query)` → `Promise<GraphNeighbor[]>`

Find neighboring nodes:

```ts
const neighbors = await graph.neighbors({
  nodeId: "project:tekmemo",
  direction: "out",              // "in" | "out" | "both"
  edgeTypes: ["uses"],
  minWeight: 0.5,
  limit: 100
});
// neighbors[0] = { node: StoredGraphNode, edge: StoredGraphEdge, direction: "out" }
```

#### `fewestHopsPath(query)` → `Promise<GraphPath | undefined>`

Find the path with fewest edges between two nodes:

```ts
const path = await graph.fewestHopsPath({
  from: "project:tekmemo",
  to: "concept:local-first",
  direction: "out",
  maxDepth: 5                   // default: 3, hard max: 10
});
// path.steps = [{ node, via }]
// path.totalWeight = sum of edge weights
```

#### `weightedShortestPath(query)` → `Promise<GraphPath | undefined>`

Find the path with highest cumulative weight (preference score):

```ts
const bestPath = await graph.weightedShortestPath({
  from: "a",
  to: "d",
  maxDepth: 5
});
```

#### `shortestPath(query)` → `Promise<GraphPath | undefined>`

Alias for `fewestHopsPath` (backward compatibility).

#### `expandFromEntities(input)` → `Promise<GraphExpansionResult>`

Expand graph from seed nodes:

```ts
import { expandFromEntities } from "@tekmemo/graph";

const result = await expandFromEntities({
  store: graph,
  seedNodeIds: ["project:tekmemo"],
  depth: 2,                      // default: 1, hard max: 5
  direction: "out",              // "in" | "out" | "both"
  edgeTypes: ["uses"],
  minWeight: 0.5,
  limit: 100                     // default: 100, hard max: 1000
});
// result.nodes, result.edges, result.depthReached
```

### Mutations

#### `mergeNodes(input)` → `Promise<StoredGraphNode>`

Merge one node into another (merge edges and metadata):

```ts
const merged = await graph.mergeNodes({
  sourceId: "old-node-id",
  targetId: "new-node-id",
  deleteSource: true,            // delete source node after merge
  metadata: { mergedAt: "..." } // additional metadata to add to target
});
```

#### `decayEdges(input)` → `Promise<{ updated: number; deleted: number }>`

Apply decay to edges (reduce weight over time):

```ts
const result = await graph.decayEdges({
  factor: 0.5,                  // multiply weights by this
  minWeight: 0.2,               // delete edges below this
  edgeTypes: ["uses"],
  metadata: { projectId: "proj_1" }
});
```

#### `deleteNode(id, options?)` → `Promise<boolean>`

Delete a node. Options:

```ts
await graph.deleteNode("node-id", { cascadeEdges: true }); // also delete connected edges
```

#### `deleteEdge(id)` → `Promise<boolean>`

Delete an edge by ID.

#### `clear()` → `Promise<void>`

Clear all nodes and edges.

### Snapshots

#### `exportSnapshot()` → `Promise<GraphSnapshot>`

Export the full graph as a serializable snapshot:

```ts
const snapshot = await graph.exportSnapshot();
// { version: 1, exportedAt: "...", nodes: [...], edges: [...] }
```

#### `importSnapshot(snapshot, options?)` → `Promise<void>`

Import a snapshot. Validates atomically — fails without modifying the graph if invalid:

```ts
await graph.importSnapshot(snapshot, { clear: true }); // clear existing data first
```

### Stats

#### `stats()` → `Promise<GraphStats>`

Get graph statistics:

```ts
const stats = await graph.stats();
// { nodeCount, edgeCount, nodeTypes: { project: 5 }, edgeTypes: { uses: 10 }, statusCounts: { active: 15 } }
```

## Basic usage

```ts
import { createInMemoryGraphStore } from "@tekmemo/graph";

const graph = createInMemoryGraphStore();

await graph.upsertNodes([
  {
    id: "project:tekmemo",
    type: "project",
    label: "TekMemo",
    summary: "File-first memory runtime for AI apps and agents.",
    metadata: { projectId: "proj_1" }
  },
  {
    id: "concept:local-first",
    type: "concept",
    label: "Local-first memory",
    aliases: ["local memory", ".tekmemo files"],
    metadata: { projectId: "proj_1" }
  }
]);

await graph.upsertEdges([
  {
    from: "project:tekmemo",
    to: "concept:local-first",
    type: "uses",
    weight: 0.9,
    directed: true,
    metadata: { projectId: "proj_1" }
  }
]);

const neighbors = await graph.neighbors({
  nodeId: "project:tekmemo",
  direction: "out"
});
```

## Behind the scenes

The in-memory store keeps two maps:

```txt
Map<nodeId, StoredGraphNode>
Map<edgeId, StoredGraphEdge>
```

When an edge does not include an ID, the store creates a deterministic ID from:

```txt
from + type + to + directed
```

That prevents duplicate semantic relationships during repeated ingestion.


## Production safety

The `@tekmemo/graph` package protects your graph memory by rejecting:

- invalid graph IDs
- missing nodes for new edges (when `requireExistingNodes` is enabled)
- self-edges (unless explicitly enabled)
- duplicate IDs within a single batch
- metadata values that are not true JSON values (rejects circular references, `NaN`, `undefined`, functions, etc.)
- unsafe or absolute source reference paths
- malformed JSONL when parsing in strict mode
- traversals that exceed depth or result limits

### Temporal facts

Nodes and edges can use:

```ts
status?: "active" | "deprecated" | "conflicted" | "deleted";
validFrom?: string;
validUntil?: string;
expiresAt?: string;
```

By default, queries skip inactive and expired facts. Pass `includeInactive` or `includeExpired` when inspection tooling needs the full history.

### Provenance

Nodes and edges can include source references:

```ts
sourceRefs: [
  {
    sourceType: "document",
    path: ".tekmemo/memory/core.md",
    span: { start: 120, end: 180 }
  }
]
```

This preserves explainability. TekMemo should never return graph memory without being able to explain where it came from.

### Depth caps

Graph expansion has a default depth and a hard max. This avoids accidental infinite or explosive traversal on dense graphs.

```ts
import { expandFromEntities } from "@tekmemo/graph";

const result = await expandFromEntities({
  store: graph,
  seedNodeIds: ["project:tekmemo"],
  depth: 2,
  limit: 100
});
```

## JSONL helpers

Serialize and parse graph data in JSONL (JSON Lines) format for file storage.

### Serialization

```ts
import {
  serializeGraphNodesJsonl,
  serializeGraphEdgesJsonl,
} from "@tekmemo/graph";

const nodesJsonl = serializeGraphNodesJsonl(nodes);
const edgesJsonl = serializeGraphEdgesJsonl(edges);
// Each line is a JSON object representing one node/edge
```

### Parsing

```ts
import {
  parseGraphNodesJsonl,
  parseGraphEdgesJsonl,
} from "@tekmemo/graph";

// Throws on malformed lines (strict mode)
try {
  const nodes = parseGraphNodesJsonl(content);
} catch (error) {
  // GraphParseError
}

// Skip invalid lines with detailed error reporting
import { parseGraphNodesJsonlDetailed } from "@tekmemo/graph";

const result = parseGraphNodesJsonlDetailed(content, {
  onInvalidLine: "skip"  // "skip" | "throw" (default)
});

console.log(result.rows);   // Successfully parsed nodes
console.log(result.issues); // Array of { line, content, error }
```

### Snapshot parse/serialize

```ts
import {
  parseGraphSnapshot,
  serializeGraphSnapshot,
} from "@tekmemo/graph";

// Parse a full snapshot (validates structure)
try {
  const snapshot = parseGraphSnapshot(jsonString);
} catch (error) {
  // GraphParseError or GraphValidationError
}

// Serialize with normalized defaults
const jsonString = serializeGraphSnapshot(snapshot);
```

## Rule-based extraction

Deterministic extractor for simple structured text. Intentionally not an LLM — use this for predictable patterns.

```ts
import { extractGraphFactsRuleBased } from "@tekmemo/graph";

const facts = extractGraphFactsRuleBased({
  text: `
    TekMemo -> uses -> Local-first memory
    TekMemo depends on TypeScript
    User prefers Rust examples
    Decision supersedes old pricing model
  `,
  sourceRef: {
    sourceType: "document",
    path: ".tekmemo/memory/core.md"
  },
  defaultNodeType: "concept",
  maxFacts: 100             // limit extracted facts
});

// facts.nodes — extracted GraphNode[]
// facts.edges — extracted GraphEdge[]
```

Supported patterns:

```txt
Entity -> relation -> Entity    # explicit directed edge
Entity depends on Entity        # depends_on edge
Entity uses Entity             # uses edge
Entity prefers Entity          # prefers edge
Entity supersedes Entity       # supersedes edge (status: "deprecated" on old)
```

For production LLM extraction, build a separate adapter. Keep this package provider-neutral.

## Error handling

The package throws typed errors:

| Error class | When thrown |
|-------------|-------------|
| `GraphValidationError` | Invalid node/edge data, missing nodes for edges, self-edges (when disallowed), bad metadata |
| `GraphParseError` | Malformed JSONL, invalid snapshot structure |
| `GraphNotFoundError` | Entity not found (used internally by some helpers) |
| `GraphConflictError` | Duplicate IDs in batch upsert |

```ts
import { GraphValidationError, GraphParseError } from "@tekmemo/graph";

try {
  await graph.importSnapshot(invalidSnapshot);
} catch (error) {
  if (error instanceof GraphValidationError) {
    console.error("Validation failed:", error.message);
  }
}
```

## Metadata utilities

```ts
import { cloneAndValidateMetadata, mergeMetadata } from "@tekmemo/graph";

// Deep clone and validate metadata (rejects NaN, undefined, circular refs, functions)
const validated = cloneAndValidateMetadata({ key: "value" });

// Merge metadata objects (later values win)
const merged = mergeMetadata({ a: 1 }, { b: 2, a: 3 });
```

## Production safety

The `@tekmemo/graph` package protects your graph memory by rejecting:

- invalid graph IDs (must be non-empty strings)
- missing nodes for new edges (when `requireExistingNodes` is enabled)
- self-edges (unless `allowSelfEdges: true`)
- duplicate IDs within a single batch
- metadata values that are not true JSON values (rejects circular references, `NaN`, `undefined`, functions, etc.)
- unsafe or absolute source reference paths (blocks `../`, `file://`, etc.)
- malformed JSONL when parsing in strict mode
- traversals that exceed depth or result limits (default max depth: 10 for paths, 5 for expansion)

### Depth caps

Graph expansion and path-finding have default depths and hard maximums to prevent accidental infinite or explosive traversal on dense graphs:

| Operation | Default depth | Hard max |
|-----------|---------------|---------|
| `fewestHopsPath`, `weightedShortestPath` | 3 | 10 |
| `expandFromEntities` | 1 | 5 |
| `neighbors` | unlimited | query `limit` applies |

## Cloud and Provider Neutrality

`@tekmemo/graph` is intentionally provider-neutral and contains no network code. It does not perform cloud calls and does not store provider credentials. It is designed to be wrapped by persistence adapters (like `@tekmemo/fs`) or hosted cloud services that handle long-term storage and LLM-assisted extraction.
