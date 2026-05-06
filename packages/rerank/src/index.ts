/**
 * @packageDocumentation
 * @module @tekmemo/rerank
 *
 * A lightweight reranking package for scoring and sorting documents by relevance.
 *
 * @remarks
 * This package provides:
 * - Core types for reranking documents ({@link RerankInput}, {@link RerankResult}, {@link Reranker})
 * - A deterministic fallback reranker for when external providers are unavailable
 * - Sorting and top-k utilities for result processing
 * - Validation utilities for inputs and results
 * - Testing utilities including a fake reranker for unit tests
 *
 * @public
 */

export type { RerankErrorCode } from "./errors/rerank-errors";

export {
	RerankError,
	RerankProviderError,
	RerankResponseError,
	RerankValidationError,
} from "./errors/rerank-errors";
export {
	createDeterministicFallbackReranker,
	DeterministicFallbackReranker,
} from "./fallback/deterministic-fallback-reranker";
export { applyTopK, stableSortRerankResults } from "./sort/sort";
export type {
	NormalizedRerankInput,
	RerankDocument,
	Reranker,
	RerankInput,
	RerankResult,
} from "./types";
export { cloneAndValidateMetadata } from "./validation/metadata";
export {
	assertNonEmptyString,
	assertSafeRerankId,
	normalizeRerankInput,
	normalizeTopK,
	validateRerankResult,
} from "./validation/validation";
