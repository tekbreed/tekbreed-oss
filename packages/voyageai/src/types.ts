/**
 * Core types for the @tekbreed/tekmemo-voyageai package.
 *
 * @remarks
 * Defines configuration, request/response, and embedder types
 * used throughout the VoyageAI integration.
 *
 * @public
 */

import type {
	VoyageEncodingFormat,
	VoyageInputType,
	VoyageOutputDtype,
} from "./models/models";

export type VoyageFetchLike = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

export interface VoyageRetryOptions {
	maxRetries?: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
	jitter?: boolean;
	retryableStatuses?: readonly number[];
}

export interface VoyageClientConfig {
	apiKey: string;
	baseUrl?: string;
	fetch?: VoyageFetchLike;
	timeoutMs?: number;
	retry?: VoyageRetryOptions;
	userAgent?: string;
}

export interface VoyageEmbeddingsRequest {
	input: string[];
	model: string;
	input_type?: VoyageInputType;
	truncation?: boolean;
	output_dimension?: number;
	output_dtype?: VoyageOutputDtype;
	encoding_format?: VoyageEncodingFormat;
}

export interface VoyageEmbeddingObject {
	object?: string;
	embedding: number[];
	index?: number;
}

export interface VoyageEmbeddingsResponse {
	object?: string;
	data: VoyageEmbeddingObject[];
	model?: string;
	usage?: {
		total_tokens?: number;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export interface VoyageClient {
	createEmbeddings(
		request: VoyageEmbeddingsRequest,
	): Promise<VoyageEmbeddingsResponse>;
}

export interface VoyageEmbedderConfig {
	apiKey?: string;
	client?: VoyageClient;
	model?: string;
	baseUrl?: string;
	fetch?: VoyageFetchLike;
	timeoutMs?: number;
	retry?: VoyageRetryOptions;
	userAgent?: string;
	defaultInputType?: VoyageInputType;
	truncation?: boolean;
	outputDimension?: number;
	outputDtype?: VoyageOutputDtype;
	encodingFormat?: VoyageEncodingFormat;
	batchSize?: number;
	expectedDimensions?: number;
	allowEmptyText?: boolean;
	allowUnknownModelDimensions?: boolean;
}

export interface EmbedTextsInput {
	texts: string[];
	model?: string;
	inputType?: VoyageInputType;
	truncation?: boolean;
	outputDimension?: number;
	outputDtype?: VoyageOutputDtype;
	encodingFormat?: VoyageEncodingFormat;
	batchSize?: number;
	expectedDimensions?: number;
	allowEmptyText?: boolean;
}

export interface EmbeddingRecord {
	text: string;
	embedding: number[];
	index: number;
	model: string;
	inputType: VoyageInputType;
	dimensions: number;
}

export interface EmbedTextsResult {
	embeddings: EmbeddingRecord[];
	model: string;
	usage?: {
		totalTokens?: number;
	};
}

export interface MemoryEmbedder {
	embedTexts(input: EmbedTextsInput): Promise<EmbedTextsResult>;
	embedText(
		text: string,
		options?: Omit<EmbedTextsInput, "texts">,
	): Promise<EmbeddingRecord>;
}
