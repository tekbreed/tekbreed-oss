import { describe, expect, it, vi } from "vitest";
import {
	type MemoryEmbedder,
	Tekmemo,
	createInMemoryRecallStore,
	createNodeFsMemoryStore,
} from "../../src/index";
import { createTempTekMemoDir } from "../../src/testing/temp-dir";

/**
 * End-to-end intelligence story: a zero-config local TekMemo (no embedder, no
 * API key) still feels intelligent — memories are recalled by meaning, the
 * graph accumulates automatically, and recall returns ranked, recent results.
 */
describe("local-first intelligence (zero config)", () => {
	it("recalls a written memory via lexical hybrid recall with no embedder", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			const memo = new Tekmemo({
				rootDir,
				projectId: "intel",
				mode: "local",
			});

			await memo.notes.record({
				content: "Authentication uses JWT tokens issued by the login flow.",
				kind: "decision",
				title: "Auth strategy",
			});

			const result = await memo.recall("login auth", { limit: 5 });
			expect(result.items.length).toBeGreaterThan(0);
			expect(result.items[0]?.text).toMatch(/authentication/i);
			expect(result.items[0]?.score).toBeGreaterThan(0);
		} finally {
			await cleanup();
		}
	});

	it("auto-extracts graph facts from written memory", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			const memo = new Tekmemo({
				rootDir,
				projectId: "intel",
				mode: "local",
			});

			// The rule-based extractor recognizes "X uses Y" patterns.
			await memo.notes.record({
				content: "TekMemo uses BM25 for lexical recall.",
				kind: "decision",
			});

			// Give the in-memory graph a tick to settle, then inspect via listNodes.
			const nodes = await memo.graph.listNodes({ limit: 50 });
			const labels = nodes.items.map((n) => n.label);
			expect(labels.some((l) => /tekmemo/i.test(l))).toBe(true);
			expect(labels.some((l) => /bm25/i.test(l))).toBe(true);
		} finally {
			await cleanup();
		}
	});

	it("persists graph across a restart via FsGraphStore rehydration", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			// First instance: write a memory that extracts a graph fact.
			const first = new Tekmemo({
				rootDir,
				projectId: "intel",
				mode: "local",
			});
			await first.notes.record({
				content: "Postgres depends on disk I/O.",
				kind: "constraint",
			});
			const firstNodes = await first.graph.listNodes({ limit: 50 });
			expect(firstNodes.items.length).toBeGreaterThan(0);

			// Second instance over the same root: graph must survive.
			const second = new Tekmemo({
				rootDir,
				projectId: "intel",
				mode: "local",
			});
			// Force bootstrap + hydration by reading core memory.
			await second.core.read();
			const secondNodes = await second.graph.listNodes({ limit: 50 });
			const labels = secondNodes.items.map((n) => n.label);
			expect(labels.some((l) => /postgres/i.test(l))).toBe(true);
		} finally {
			await cleanup();
		}
	});

	it("returns ranked results ordered by score", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			const memo = new Tekmemo({
				rootDir,
				projectId: "intel",
				mode: "local",
			});

			await memo.notes.record({
				content: "The deployment pipeline runs on GitHub Actions.",
				kind: "reference",
			});
			await memo.notes.record({
				content: "We prefer pnpm for package management.",
				kind: "preference",
			});

			const result = await memo.recall("deployment pipeline", { limit: 5 });
			expect(result.items.length).toBeGreaterThan(0);
			// The deployment note should outrank the pnpm note for this query.
			const top = result.items[0];
			expect(top?.text).toMatch(/deployment pipeline/i);
		} finally {
			await cleanup();
		}
	});
});

/**
 * Best-effort write path: a configured embedder that throws (e.g. a missing
 * local ONNX runtime, a rejected lazy init, or a broken API adapter) must never
 * break the caller's write. Lexical recall keeps the memory discoverable.
 */
describe("best-effort write path (failing embedder)", () => {
	it("records a note even when the embedder rejects on every call", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			// An embedder that always fails — mimics a lazy local embedder whose
			// optional runtime is missing, or an adapter whose init rejected.
			const brokenEmbedder: MemoryEmbedder = {
				embedTexts: vi.fn().mockRejectedValue(new Error("onnx runtime missing")),
				embedText: vi.fn().mockRejectedValue(new Error("onnx runtime missing")),
			};

			const memo = new Tekmemo({
				rootDir,
				projectId: "fail-embedder",
				mode: "local",
				embedder: brokenEmbedder,
				// In-memory recall store so we don't touch the disk vector index.
				recallStore: createInMemoryRecallStore(),
			});

			// The write must succeed despite the failing embedder.
			const result = await memo.notes.record({
				content: "We deploy via blue-green releases on Kubernetes.",
				kind: "decision",
				title: "Deploy strategy",
			});
			expect(result.created).toBe(true);

			// The embedder was exercised by the write path...
			expect(brokenEmbedder.embedTexts).toHaveBeenCalled();
			// ...and recall still surfaces the memory via the lexical path.
			const recall = await memo.recall("deploy kubernetes", { limit: 5 });
			expect(recall.items.length).toBeGreaterThan(0);
			expect(recall.items[0]?.text).toMatch(/blue-green/i);
		} finally {
			await cleanup();
		}
	});

	it("records a note even when the recall store rejects", async () => {
		const { rootDir, cleanup } = await createTempTekMemoDir();
		try {
			const goodEmbedder: MemoryEmbedder = {
				embedTexts: vi.fn().mockResolvedValue({
					embeddings: [
						{ text: "x", embedding: [0.1, 0.2, 0.3], index: 0, model: "test", dimensions: 3 },
					],
					model: "test",
				}),
				embedText: vi.fn().mockResolvedValue({
					text: "x",
					embedding: [0.1, 0.2, 0.3],
					index: 0,
					model: "test",
					dimensions: 3,
				}),
			};
			// A recall store whose upsert always throws.
			const brokenStore = createInMemoryRecallStore();
			brokenStore.upsert = vi.fn().mockRejectedValue(new Error("disk full"));

			const memo = new Tekmemo({
				rootDir,
				projectId: "fail-store",
				mode: "local",
				embedder: goodEmbedder,
				recallStore: brokenStore,
			});

			const result = await memo.notes.record({
				content: "Feature flags are toggled via LaunchDarkly.",
				kind: "reference",
			});
			expect(result.created).toBe(true);

			// Lexical recall still works without the vector index.
			const recall = await memo.recall("feature flags", { limit: 5 });
			expect(recall.items.length).toBeGreaterThan(0);
		} finally {
			await cleanup();
		}
	});
});
