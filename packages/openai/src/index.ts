/**
 * @file Public API entry point for @tekbreed/tekmemo-openai.
 *
 * @remarks
 * This package provides OpenAI embedding integration for TekMemo's memory system.
 * It exports the {@link OpenAIEmbedder} class for generating embeddings,
 * error classes for error handling, and model configuration utilities.
 *
 * @packageDocumentation
 */

export type { OpenAISdkClientConfig } from "./client/openai-client";
export {
	createOpenAIClient,
	OpenAIRestClient,
	OpenAISdkEmbeddingsClient,
} from "./client/openai-client";
export {
	createOpenAIEmbedder,
	OpenAIEmbedder,
} from "./embedder/openai-embedder";
export {
	OpenAIAPIError,
	OpenAIConfigError,
	OpenAIEmbedderError,
	OpenAINetworkError,
	OpenAIResponseError,
	OpenAIRetryExhaustedError,
	OpenAITimeoutError,
	OpenAIValidationError,
} from "./errors/openai-errors";
export type {
	OpenAIEmbeddingModel,
	OpenAIEncodingFormat,
} from "./models/models";
export {
	assertValidDimensions,
	defaultDimensionsForModel,
	expectedVectorLength,
	OPENAI_DEFAULT_BASE_URL,
	OPENAI_EMBEDDINGS_PATH,
	OPENAI_KNOWN_EMBEDDING_MODELS,
	OPENAI_MAX_BATCH_SIZE,
	OPENAI_MODEL_DEFAULT_DIMENSIONS,
	OPENAI_MODELS_SUPPORTING_DIMENSIONS,
	supportsDimensions,
} from "./models/models";

export type {
	EmbeddingRecord,
	EmbedTextsInput,
	EmbedTextsResult,
	MemoryEmbedder,
	OpenAIClientConfig,
	OpenAIEmbedderConfig,
	OpenAIEmbeddingObject,
	OpenAIEmbeddingsClient,
	OpenAIEmbeddingsRequest,
	OpenAIEmbeddingsResponse,
	OpenAIFetchLike,
	OpenAIRetryOptions,
} from "./types";
