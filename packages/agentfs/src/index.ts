/**
 * @file Public API entry point for @tekbreed/tekmemo-agentfs.
 *
 * @remarks
 * This module exports the AgentFS memory store implementation, lease management utilities,
 * sync helpers, and related types for integrating with AgentFS-compatible storage backends.
 *
 * @packageDocumentation
 */

export { assertAgentfsLikeClient } from "./client/agentfs-like";
export type {
	AgentfsLikeClient,
	AgentfsLikeSync,
} from "./client/agentfs-like.js";
export type {
	AgentfsErrorCode,
	AgentfsErrorOptions,
} from "./errors/agentfs-error.js";
export {
	AgentfsClientError,
	AgentfsConfigError,
	AgentfsError,
	AgentfsLeaseError,
	AgentfsSyncError,
	AgentfsValidationError,
	isAgentfsError,
} from "./errors/agentfs-error.js";
export type { InMemoryLeaseManagerOptions } from "./leases/in-memory-lease-manager";
export { InMemoryLeaseManager } from "./leases/in-memory-lease-manager";
export type {
	MemoryLeaseManager,
	MemoryLeaseRecord,
} from "./leases/memory-lease-manager.js";
export type { WithMemoryLeaseOptions } from "./leases/with-memory-lease";
export { withMemoryLease } from "./leases/with-memory-lease";
export type {
	CompleteTekMemoAgentSessionOptions,
	CompleteTekMemoAgentSessionResult,
	CreateTekMemoAgentSessionOptions,
	ExtractedSessionMemory,
	PrepareTekMemoAgentSessionResult,
	TekMemoAgentSession,
	TekMemoAgentSessionPaths,
} from "./session/agent-session.js";
export {
	createAgentWorkspaceFiles,
	createAgentWorkspacePaths,
	createTekMemoAgentSession,
	extractSessionMemory,
} from "./session/agent-session.js";
export {
	AgentfsMemoryStore,
	createAgentfsMemoryStore,
} from "./store/agentfs-memory-store.js";
export { resolveAgentfsMemoryPath } from "./store/resolve-agentfs-memory-path";
export {
	normalizeAgentfsMemoryStoreConfig,
	resolveStoreRoot,
} from "./store/resolve-store-root.js";

export { checkpointStore } from "./sync/checkpoint-store";
export type { SyncAfterSessionResult } from "./sync/sync-after-session";
export { syncAfterSession } from "./sync/sync-after-session";
export { syncBeforeSession } from "./sync/sync-before-session";
export type {
	SyncAfterSessionOptions,
	SyncBeforeSessionOptions,
	SyncOperationResult,
} from "./sync/types.js";
export { validateCheckpointLabel } from "./sync/validate-checkpoint-label";

export type {
	AgentfsMemoryScope,
	AgentfsMemoryStoreConfig,
	MissingFileBehavior,
	NormalizedAgentfsMemoryStoreConfig,
} from "./types/config.js";

export { isNotFoundError } from "./utils/is-not-found-error";
export { normalizeRootPrefix } from "./utils/normalize-root-prefix";
export { validateSafeSegment } from "./utils/validate-safe-segment";
