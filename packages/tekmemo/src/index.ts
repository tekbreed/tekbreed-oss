/**
 * TekMemo core — file-first memory runtime for agents and AI applications.
 *
 * This package provides the core memory model, document types, validation,
 * patching, and canonical file path conventions used by all TekMemo adapters.
 *
 * @public
 */

export type {
	BootstrapMemoryStoreOptions,
	BootstrapMemoryStoreResult,
} from "./bootstrap/bootstrap-memory-store.js";
export { bootstrapMemoryStore } from "./bootstrap/bootstrap-memory-store.js";
export type { ChunkTextOptions } from "./chunking/chunk-text.js";
export { chunkText, createChunkId, hashString } from "./chunking/chunk-text.js";
export {
	runMemoryCommand,
	validateMemoryCommand,
} from "./commands/run-memory-command.js";
export type {
	CanonicalTekMemoFile,
	MemoryPath,
	PathKind,
	SnapshotFilePath,
} from "./constants/memory-paths.js";
export {
	assertMemoryPath,
	CANONICAL_TEKMEMO_FILES,
	CHUNKS_INDEX_PATH,
	CONVERSATIONS_MEMORY_PATH,
	CORE_MEMORY_PATH,
	createSnapshotPath,
	GRAPH_EDGES_PATH,
	GRAPH_NODES_PATH,
	isMemoryPath,
	MANIFEST_PATH,
	MEMORY_EVENTS_PATH,
	MEMORY_PATHS,
	MEMORY_ROOT,
	memoryTypeFromPath,
	NOTES_MEMORY_PATH,
	SNAPSHOTS_INDEX_PATH,
	TEKMEMO_DIR,
	TEKMEMO_PATHS,
} from "./constants/memory-paths.js";
export type { MemoryTemplates } from "./defaults/templates.js";
export {
	createDefaultMemoryTemplates,
	DEFAULT_CONVERSATIONS_MEMORY,
	DEFAULT_CORE_MEMORY,
	DEFAULT_JSONL,
	DEFAULT_MEMORY_TEMPLATES,
	DEFAULT_NOTES_MEMORY,
} from "./defaults/templates.js";
export type {
	ConversationHistoryResult,
	ReadConversationHistoryOptions,
} from "./documents/conversations-memory.js";
export {
	appendConversationEntry,
	normalizeConversationEntry,
	readConversationHistory,
	readConversationHistoryWithIssues,
	validateConversationEntry,
} from "./documents/conversations-memory.js";
export {
	buildCoreMemoryText,
	normalizeMarkdownDocument,
	readCoreMemory,
	writeCoreMemory,
} from "./documents/core-memory.js";
export type { NormalizedTimestampedNote } from "./documents/notes-memory.js";
export {
	appendTimestampedNote,
	formatTimestampedNote,
	normalizeTimestampedNote,
	readNotesMemory,
} from "./documents/notes-memory.js";
export {
	assertMemorySourceReference,
	createSourceKey,
	encodeSourceKeyPart,
} from "./documents/source-manifest.js";
export {
	isTekMemoError,
	MemoryCommandError,
	MemoryNotFoundError,
	MemoryParseError,
	MemoryPathError,
	MemoryStoreError,
	MemoryValidationError,
	TekMemoError,
} from "./errors/errors.js";
export type {
	CreateMemoryEventInput,
	MemoryEventsResult,
	ReadMemoryEventsOptions,
} from "./events/memory-events.js";
export {
	appendMemoryEvent,
	createMemoryEvent,
	normalizeMemoryEvent,
	readMemoryEvents,
	readMemoryEventsWithIssues,
	validateMemoryEvent,
} from "./events/memory-events.js";
export type {
	ChunkRecordsResult,
	CreateChunkRecordOptions,
	ReadChunkRecordsOptions,
} from "./indexes/chunk-records.js";
export {
	appendChunkRecord,
	createChunkRecord,
	markChunkRecordStale,
	normalizeChunkRecord,
	readChunkRecords,
	readChunkRecordsWithIssues,
	validateChunkRecord,
} from "./indexes/chunk-records.js";
export type { CreateDefaultTekMemoManifestOptions } from "./manifest/manifest.js";
export {
	createDefaultTekMemoManifest,
	parseManifest,
	readManifest,
	stringifyManifest,
	validateTekMemoManifest,
	writeManifest,
} from "./manifest/manifest.js";
export type {
	MemorySearchResult,
	SearchMemoryTextOptions,
} from "./search/search-memory.js";
export { searchMemoryText, splitSearchBlocks } from "./search/search-memory.js";
export type {
	CreateSnapshotRecordInput,
	ReadSnapshotRecordsOptions,
	SnapshotRecordsResult,
} from "./snapshots/snapshot-records.js";
export {
	appendSnapshotRecord,
	createSnapshotRecord,
	normalizeSnapshotRecord,
	readSnapshotRecords,
	readSnapshotRecordsWithIssues,
	validateSnapshotRecord,
} from "./snapshots/snapshot-records.js";
export type { InMemoryStoreInitialFiles } from "./stores/in-memory-store.js";
export { InMemoryMemoryStore } from "./stores/in-memory-store.js";

export type {
	MemoryCommand,
	SearchableMemoryPath,
} from "./types/memory-commands.js";
export type {
	ChunkRecord,
	ConversationEntry,
	ConversationRole,
	MemoryActorType,
	MemoryChunk,
	MemoryDocumentType,
	MemoryEvent,
	MemoryEventType,
	MemorySourceReference,
	MemorySourceType,
	MemoryType,
	NoteKind,
	SnapshotRecord,
	TekMemoManifest,
	TimestampedNote,
} from "./types/memory-documents.js";
export type { MemoryStore, MemoryStoreSnapshot } from "./types/memory-store.js";
