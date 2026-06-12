import { describe, expect, it } from "vitest";
import {
	adapterImportPaths,
	adapterPackages,
	tekMemoAdapters,
} from "../src/index";

describe("adapter catalog", () => {
	it("lists every first-party adapter reexport", () => {
		expect(adapterPackages).toEqual({
			agentfs: "@tekbreed/tekmemo-agentfs",
			aiSdk: "@tekbreed/tekmemo-ai-sdk",
			cloudClient: "@tekbreed/tekmemo-cloud-client",
			openai: "@tekbreed/tekmemo-openai",
			rerankVoyage: "@tekbreed/tekmemo-rerank-voyage",
			upstashVector: "@tekbreed/tekmemo-upstash-vector",
			voyageai: "@tekbreed/tekmemo-voyageai",
		});
		expect(adapterImportPaths.aiSdk).toBe("@tekbreed/tekmemo-adapters/ai-sdk");
		expect(adapterImportPaths.agentfs).toBe("@tekbreed/tekmemo-adapters/agentfs");
		expect(adapterImportPaths.voyageaiTesting).toBe(
			"@tekbreed/tekmemo-adapters/voyageai/testing",
		);
		expect(tekMemoAdapters).toHaveLength(7);
	});
});
