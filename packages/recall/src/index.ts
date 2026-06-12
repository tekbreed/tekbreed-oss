/**
 * @file Main entry point for the @tekbreed/tekmemo-recall package.
 *
 * @remarks
 * This package provides semantic recall memory capabilities including:
 * - Vector similarity search using cosine similarity
 * - Metadata filtering with operator support ($eq, $in, $gt, etc.)
 * - Document storage abstractions with in-memory implementation
 * - Validation utilities for embeddings, documents, and queries
 *
 * @public
 */

export {
	RecallDimensionError,
	RecallError,
	RecallNotImplementedError,
	RecallProviderError,
	RecallValidationError,
} from "./errors/errors.js";
export {
	matchesRecallFilter,
	normalizeRecallFilter,
} from "./filters/filter-match.js";
export { cosineSimilarity, sortRecallScores } from "./scoring/cosine";
export {
	createInMemoryRecallStore,
	InMemoryRecallStore,
} from "./stores/in-memory-recall-store.js";
export {
	createRecallDocument,
	createRecallDocuments,
} from "./testing/fixtures.js";
export type {
	DeleteBySourceInput,
	InMemoryRecallStoreOptions,
	JsonPrimitive,
	JsonValue,
	RecallDocument,
	RecallFilter,
	RecallFilterOperator,
	RecallFilterValue,
	RecallMemoryType,
	RecallMetadata,
	RecallQuery,
	RecallResult,
	RecallStore,
	RecallStoreCapabilities,
	RecallStoreContractOptions,
} from "./types.js";
export { cloneJsonValue, cloneRecord } from "./utils/json";
export {
	createProjectNamespace,
	normalizeNamespace,
} from "./utils/namespace.js";
export {
	assertFiniteNumber,
	assertNamespace,
	assertNonEmptyString,
	assertPositiveInteger,
	assertSafeId,
	validateEmbedding,
	validateMetadata,
	validateOptionalNamespace,
	validateRecallDocument,
	validateRecallDocuments,
	validateRecallFilter,
	validateRecallQuery,
} from "./validation/assertions.js";
