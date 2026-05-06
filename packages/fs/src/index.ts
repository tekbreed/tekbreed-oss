/**
 * Filesystem-backed memory store for TekMemo.
 *
 * @remarks
 * Provides {@link NodeFsMemoryStore}, a {@link MemoryStore} implementation
 * that reads/writes files on disk using Node.js `fs` module.
 * Includes utilities for path resolution, atomic writes, and symlink protection.
 *
 * @public
 */

export { createNodeFsMemoryStore } from "./create-node-fs-memory-store";
export { FsMemoryStoreError } from "./errors/fs-memory-store-error";
export { NodeFsMemoryStore } from "./node-fs-memory-store";

export type {
	MissingFileBehavior,
	NodeFsMemoryStoreOptions,
	NormalizedNodeFsMemoryStoreOptions,
} from "./types/options.js";
export { normalizeOptions } from "./utils/normalize-options";
export { normalizeRootDir } from "./utils/normalize-root-dir";
export { resolveAbsoluteMemoryPath } from "./utils/resolve-absolute-memory-path";
