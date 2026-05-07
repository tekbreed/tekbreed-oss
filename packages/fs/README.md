# @tekmemo/fs

[![npm version](https://img.shields.io/npm/v/@tekmemo/fs.svg)](https://www.npmjs.com/package/@tekmemo/fs)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/fs.svg)](https://www.npmjs.com/package/@tekmemo/fs)
[![license](https://img.shields.io/npm/l/@tekmemo/fs.svg)](https://www.npmjs.com/package/@tekmemo/fs)

Node.js filesystem adapter for TekMemo's canonical `.tekmemo/` local memory protocol.

This package implements the core `MemoryStore` interface from `tekmemo` using the local filesystem.

## Installation

```bash
pnpm add tekmemo @tekmemo/fs
```

## Quickstart

```ts
import { bootstrapMemoryStore, writeCoreMemory, readCoreMemory } from "tekmemo";
import { createNodeFsMemoryStore } from "@tekmemo/fs";

const store = createNodeFsMemoryStore({
  rootDir: process.cwd()
});

await bootstrapMemoryStore(store);
await writeCoreMemory(store, "# Core Memory\n\n- Local-first memory is enabled.\n");

const content = await readCoreMemory(store);
console.log(content);
```

---

## Canonical layout

When used with `bootstrapMemoryStore`, this adapter writes:

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

---

## API reference

### `createNodeFsMemoryStore(options)` → `NodeFsMemoryStore`

Factory function to create a filesystem-backed memory store:

```ts
import { createNodeFsMemoryStore } from "@tekmemo/fs";

const store = createNodeFsMemoryStore({
  rootDir: process.cwd(),        // required: project directory
  createRoot: true,                 // default: true - create root if missing
  missingFileBehavior: "throw",     // "throw" (default) or "empty"
  disallowSymlinks: true,           // default: true - reject symlinks
  directoryMode: 0o700,              // default: 0o700
  fileMode: 0o600,                    // default: 0o600
});
```

### `NodeFsMemoryStore` class

Implements the `MemoryStore` interface from `tekmemo`:

```ts
import { NodeFsMemoryStore } from "@tekmemo/fs";

// The class is also available if you need to extend it
const store = new NodeFsMemoryStore(options);

// Properties
store.rootDir;  // Returns the normalized root directory path

// Methods (inherited from MemoryStore interface)
await store.read(path);           // Read file content
await store.write(path, content);  // Write file content (atomic write)
await store.append(path, content); // Append to file (serialized)
await store.exists(path);         // Check if file exists

// Additional method
const absolutePath = store.resolve(".tekmemo/memory/core.md");
// Returns: "/absolute/path/to/.tekmemo/memory/core.md"
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rootDir` | `string \| URL` | required | Project directory where `.tekmemo/` will live |
| `createRoot` | `boolean` | `true` | Create the root directory if missing |
| `missingFileBehavior` | `"throw" \| "empty"` | `"throw"` | Behavior when reading missing files |
| `disallowSymlinks` | `boolean` | `true` | Reject symlinked paths under `.tekmemo/` |
| `directoryMode` | `number` | `0o700` | Directory mode for created directories |
| `fileMode` | `number` | `0o600` | File mode for created files |

### Utility functions

```ts
import {
  normalizeOptions,       // Normalize options with defaults
  normalizeRootDir,      // Normalize rootDir to string
  resolveAbsoluteMemoryPath, // Resolve memory path to absolute path
} from "@tekmemo/fs";
```

---

## Missing file behavior

### Strict mode (default)

```ts
const store = createNodeFsMemoryStore({ rootDir });

try {
  await store.read(".tekmemo/memory/core.md"); // throws MemoryNotFoundError if missing
} catch (error) {
  // MemoryNotFoundError
}
```

### Relaxed mode

```ts
const store = createNodeFsMemoryStore({
  rootDir,
  missingFileBehavior: "empty"
});

const content = await store.read(".tekmemo/memory/core.md"); // "" if missing
```

---

## Safety behavior

This adapter provides:

- **Safe path resolution** under `rootDir` — prevents escaping the memory directory
- **Canonical `.tekmemo/` path validation** through `tekmemo`
- **Parent directory creation** — auto-creates directories as needed
- **Atomic writes** — uses rename-based atomic file writes
- **Same-instance append serialization** — prevents concurrent append corruption
- **Symlink rejection** by default — rejects symlinked paths under `.tekmemo/`
- **Missing-file behavior control** — configurable read behavior for missing files
- **Path locking** — prevents concurrent writes to same file

---

## Error handling

```ts
import { FsMemoryStoreError, MemoryNotFoundError } from "@tekmemo/fs";

try {
  await store.read(".tekmemo/memory/core.md");
} catch (error) {
  if (error instanceof MemoryNotFoundError) {
    // File doesn't exist
  }
  if (error instanceof FsMemoryStoreError) {
    // Filesystem error (permission, etc.)
    console.error(error.message);
    console.error(error.path);        // The memory path
    console.error(error.absolutePath); // The absolute path
  }
}
```

---

## Package boundary

**This package owns:**
- Node.js filesystem implementation of `MemoryStore`
- Path resolution to `.tekmemo/` directory
- Atomic file writes
- Symlink protection
- Path locking
- Directory/file mode configuration

**This package does NOT own:**
- `.tekmemo/` protocol (owned by `tekmemo` core)
- Embeddings
- Vector recall
- Reranking
- Cloud sync
- Billing or tenancy

---

## Related packages

- `tekmemo` — Core memory contracts and types
- `@tekmemo/agentfs` — AgentFS-backed store alternative
- `@tekmemo/recall` — Vector recall contracts
