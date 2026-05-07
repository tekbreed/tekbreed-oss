# @tekmemo/benchmark-kit`

[![npm version](https://img.shields.io/npm/v/@tekmemo/benchmark-kit.svg)](https://www.npmjs.com/package/@tekmemo/benchmark-kit)
[![npm downloads](https://img.shields.io/npm/dm/@tekmemo/benchmark-kit.svg)](https://www.npmjs.com/package/@tekmemo/benchmark-kit)
[![license](https://img.shields.io/npm/l/@tekmemo/benchmark-kit.svg)](https://www.npmjs.com/package/@tekmemo/benchmark-kit)

Provider-neutral benchmarking toolkit for TekMemo packages and adapters.

This package helps benchmark:
- Memory stores
- Embedder adapters
- Recall stores
- Rerankers
- Package-level workflows
- Future provider adapters

It does **not** own production product behavior. It only measures it.

## Installation;

```bash
pnpm add -D @tekmemo/benchmark-kit
```

---

## Quickstart;

```ts
import {
  BenchmarkRunner,
  createBenchmarkSuite,
  markdownBenchmarkReport
} from "@tekmemo/benchmark-kit";

// Create a benchmark suite
const suite = createBenchmarkSuite({
  name: "local-memory",
  cases: [
    {
      name: "write-core-memory",
      iterations: 100,
      warmupIterations: 10,
      async run() {
        await store.write("memory/core.md", "# Core Memory");
      }
    }
  ]
});

// Run the suite
const runner = new BenchmarkRunner();
const result = await runner.runSuite(suite);

// Output report
console.log(markdownBenchmarkReport(result));
```

---

## API reference;

### `createBenchmarkSuite(options)` → `BenchmarkSuite`

Creates a benchmark suite:

```ts
import { createBenchmarkSuite } from "@tekmemo/benchmark-kit";

const suite = createBenchmarkSuite({
  name: "suite-name",              // Required: suite name
  cases: [                          // Required: benchmark cases
    {
      name: "case-name",
      iterations: 100,              // Number of timed iterations
      warmupIterations: 10,         // Warmup runs (excluded from results)
      setup?: async () => {},         // Optional: run before each case
      run: async () => {},          // Required: code to benchmark
      teardown?: async () => {}    // Optional: run after each case
    }
  ]
});
```

### `BenchmarkRunner` class;

Runs benchmark suites:

```ts
import { BenchmarkRunner } from "@tekmemo/benchmark-kit";

const runner = new BenchmarkRunner();

// Run a single suite
const result = await runner.runSuite(suite);

// Run multiple suites
const results = await runner.runSuites([suite1, suite2]);
```

### `BenchmarkResult`;

```ts
interface BenchmarkResult {
  suiteName: string;
  caseName: string;
  iterations: number;
  warmupIterations: number;
  latencyMs: {
    min: number;
    max: number;
    mean: number;
    median: number;
    p95: number;       // 95th percentile
    p99: number;       // 99th percentile
  };
  throughputPerSecond: number;
  errorCount: number;
  errorRate: number;          // 0-1
}
```

---

## Recall benchmark;

```ts
import { createRecallQueryBenchmarkCase } from "@tekmemo/benchmark-kit";

const benchmarkCase = createRecallQueryBenchmarkCase({
  name: "upstash-query-top-10",
  store,                              // RecallStore instance
  query: {
    embedding: [0.1, 0.2, 0.3],
    topK: 10
  },
  iterations: 100,
  warmupIterations: 10
});

const suite = createBenchmarkSuite({
  name: "recall-benchmarks",
  cases: [benchmarkCase]
});
```

---

## Thresholds;

Evaluate benchmark results against thresholds:

```ts
import { evaluateBenchmarkThresholds } from "@tekmemo/benchmark-kit";

const verdict = evaluateBenchmarkThresholds(result, {
  maxP95Ms: 200,              // 95th percentile must be under 200ms
  maxErrorRate: 0.01,         // Error rate must be under 1%
  minThroughputPerSecond: 100,  // Must handle 100+ ops/second
  maxMeanLatencyMs: 50         // Mean latency under 50ms
});

if (!verdict.passed) {
  console.error("Benchmark failed:", verdict.failures);
  process.exit(1);
}
```

### Threshold options;

| Option | Type | Description |
|--------|------|-------------|
| `maxP95Ms` | `number` | Maximum 95th percentile latency (ms) |
| `maxMeanLatencyMs` | `number` | Maximum mean latency (ms) |
| `maxErrorRate` | `number` | Maximum error rate (0-1) |
| `minThroughputPerSecond` | `number` | Minimum throughput (ops/sec) |

---

## Reports;

### Markdown report;

```ts
import { markdownBenchmarkReport } from "@tekmemo/benchmark-kit";

const markdown = markdownBenchmarkReport(result);
// Returns formatted Markdown string with tables
```

### JSON report;

```ts
import { jsonBenchmarkReport } from "@tekmemo/benchmark-kit";

const json = jsonBenchmarkReport(result);
// Returns JSON string with full results
```

---

## Testing;

The package includes fake targets for testing benchmarks:

```ts
import { createFakeBenchmarkTarget } from "@tekmemo/benchmark-kit/testing";

const fakeTarget = createFakeBenchmarkTarget({
  latencyMs: 10,              // Simulate 10ms latency
  failureRate: 0.01,         // Simulate 1% failure rate
  throughput: 100             // Simulate 100 ops/sec
});

const suite = createBenchmarkSuite({
  name: "fake-benchmark",
  cases: [
    {
      name: "test-case",
      iterations: 100,
      run: async () => {
        await fakeTarget.execute();
      }
    }
  ]
});
```

---

## Package boundary;

**This package owns:**
- Benchmark runner
- Latency measurement
- Throughput calculation
- Error-rate calculation
- Threshold evaluation
- JSON/Markdown reporters
- Fake targets for tests
- Provider-neutral benchmark helpers

**This package does NOT own:**
- `.tekmemo/` protocol (see `tekmemo`)
- Vector recall implementation (see `@tekmemo/recall`)
- Embeddings implementation (see `@tekmemo/openai`, `@tekmemo/voyageai`)
- Reranking implementation (see `@tekmemo/rerank`, `@tekmemo/rerank-voyage`)
- Cloud quotas
- Billing

---

## Related packages;

- `tekmemo` — Core memory contracts
- `@tekmemo/recall` — Vector recall contracts
- `@tekmemo/openai` — OpenAI embeddings
- `@tekmemo/voyageai` — Voyage AI embeddings
- `@tekmemo/rerank` — Reranking contracts
