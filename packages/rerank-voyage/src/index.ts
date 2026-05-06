/**
 * @file Voyage AI rerank adapter for TekMemo.
 *
 * @remarks
 * This package provides a reranking implementation using Voyage AI's rerank API.
 * It integrates with TekMemo's rerank abstraction and supports retry logic,
 * error handling, and configurable validation.
 *
 * @packageDocumentation
 */

export {
	createVoyageRerankClient,
	VoyageRerankRestClient,
} from "./client/voyage-rerank-client";

export type { VoyageRerankErrorCode } from "./errors/voyage-rerank-errors";
export {
	VoyageRerankApiError,
	VoyageRerankConfigError,
	VoyageRerankError,
	VoyageRerankNetworkError,
	VoyageRerankResponseError,
	VoyageRerankTimeoutError,
	VoyageRerankValidationError,
} from "./errors/voyage-rerank-errors";
export {
	VOYAGE_RERANK_DEFAULT_BASE_URL,
	VOYAGE_RERANK_MAX_DOCUMENTS,
	VOYAGE_RERANK_MODELS,
	VOYAGE_RERANK_PATH,
} from "./models/models";
export {
	createVoyageReranker,
	VoyageReranker,
} from "./reranker/voyage-reranker";

export type {
	VoyageRerankClient,
	VoyageRerankClientConfig,
	VoyageRerankerConfig,
	VoyageRerankFetchLike,
	VoyageRerankRequest,
	VoyageRerankResponse,
	VoyageRerankResponseItem,
	VoyageRerankRetryOptions,
} from "./types";
