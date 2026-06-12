/**
 * @file Public API for @tekbreed/tekmemo-upstash-vector.
 *
 * @remarks
 * This package provides a TekMemo RecallStore backed by Upstash Vector.
 * It includes the store implementation, filter builders, metadata normalization,
 * namespace resolution, and a fake index for testing.
 *
 * @packageDocumentation
 */

export { assertUpstashLikeIndex } from "./client/upstash-like";
export type {
	UpstashLikeIndex,
	UpstashVectorPoint,
	UpstashVectorQueryOptions,
	UpstashVectorQueryResultItem,
	UpstashVectorRequestOptions,
} from "./client/upstash-like.js";

export {
	UpstashRecallError,
	UpstashRecallValidationError,
} from "./errors/upstash-errors.js";
export type { BuildUpstashFilterOptions } from "./filters/filter-builder";
export { buildUpstashFilter } from "./filters/filter-builder";
export type { UpstashMetadata } from "./metadata/metadata";
export {
	normalizeResultMetadata,
	normalizeUpstashMetadata,
} from "./metadata/metadata.js";
export type { UpstashNamespaceConfig } from "./namespace/namespace";
export {
	resolveRequestNamespace,
	resolveUpstashNamespace,
} from "./namespace/namespace.js";
export type {
	ResolveChunkIdsBySourceInput,
	UpstashRecallStoreConfig,
	UpstashRecallStoreSnapshot,
} from "./store/upstash-recall-store.js";
export {
	createUpstashRecallStore,
	UpstashRecallStore,
} from "./store/upstash-recall-store.js";
export type { FakeUpstashCall } from "./testing/fake-upstash-index";
export { FakeUpstashIndex } from "./testing/fake-upstash-index";
