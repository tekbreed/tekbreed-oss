/**
 * Benchmarking toolkit for TekMemo memory operations.
 *
 * @remarks
 * Provides benchmark runners, reporters, thresholds, and workload generators
 * for measuring performance of embedders, memory stores, recall, and rerankers.
 *
 * @public
 */

export type { BenchmarkErrorCode } from "./errors/benchmark-errors";
export {
	BenchmarkError,
	BenchmarkRunError,
	BenchmarkThresholdError,
	BenchmarkTimeoutError,
	BenchmarkValidationError,
} from "./errors/benchmark-errors";
export { jsonBenchmarkReport } from "./reporters/json";
export { markdownBenchmarkReport } from "./reporters/markdown";
export { BenchmarkRunner } from "./runner/benchmark-runner";
export { createBenchmarkSuite } from "./runner/benchmark-suite";
export { mean, percentile, summarizeIterations } from "./stats/stats";
export { evaluateBenchmarkThresholds } from "./thresholds/thresholds";
export {
	DeterministicBenchmarkClock,
	SystemBenchmarkClock,
} from "./time/clock";
export type {
	BenchmarkCase,
	BenchmarkCaseResult,
	BenchmarkCaseStats,
	BenchmarkClock,
	BenchmarkIterationContext,
	BenchmarkIterationResult,
	BenchmarkRunnerOptions,
	BenchmarkSuite,
	BenchmarkSuiteResult,
	BenchmarkThresholdFailure,
	BenchmarkThresholdResult,
	BenchmarkThresholds,
} from "./types";
export { SeededRandom } from "./utils/seeded-random";
export { createEmbedderBenchmarkCase } from "./workloads/embedder";

export {
	createMemoryReadBenchmarkCase,
	createMemoryWriteBenchmarkCase,
} from "./workloads/memory-store";
export {
	createRecallQueryBenchmarkCase,
	createRecallUpsertBenchmarkCase,
} from "./workloads/recall";
export { createRerankBenchmarkCase } from "./workloads/rerank";
export type {
	MinimalEmbedder,
	MinimalMemoryStore,
	MinimalRecallStore,
	MinimalReranker,
} from "./workloads/types";
