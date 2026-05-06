/**
 * VoyageAI embedding integration for TekMemo.
 *
 * @remarks
 * Provides VoyageAI embedders for generating text embeddings.
 * Exports {@link VoyageEmbedder}, error classes, and model utilities.
 *
 * @public
 */

export { createVoyageClient, VoyageRestClient } from "./client/voyage-client";
export {
	createVoyageEmbedder,
	VoyageEmbedder,
} from "./embedder/voyage-embedder";
export {
	VoyageApiError,
	VoyageConfigError,
	VoyageError,
	VoyageNetworkError,
	VoyageResponseError,
	VoyageRetryExhaustedError,
	VoyageTimeoutError,
	VoyageValidationError,
} from "./errors/voyage-errors";
export type {
	VoyageEncodingFormat,
	VoyageFlexibleDimension,
	VoyageInputType,
	VoyageOutputDtype,
} from "./models/models";
export {
	assertValidOutputDimension,
	expectedVectorLength,
	VOYAGE_DEFAULT_BASE_URL,
	VOYAGE_EMBEDDINGS_PATH,
	VOYAGE_FLEXIBLE_DIMENSIONS,
	VOYAGE_KNOWN_FIXED_DIMENSION_MODELS,
	VOYAGE_MAX_BATCH_SIZE,
	VOYAGE_MODELS_WITH_FLEXIBLE_DIMENSIONS,
} from "./models/models";

export type {
	EmbeddingRecord,
	EmbedTextsInput,
	EmbedTextsResult,
	MemoryEmbedder,
	VoyageClient,
	VoyageClientConfig,
	VoyageEmbedderConfig,
	VoyageEmbeddingObject,
	VoyageEmbeddingsRequest,
	VoyageEmbeddingsResponse,
	VoyageFetchLike,
	VoyageRetryOptions,
} from "./types";
