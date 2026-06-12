/**
 * Metadata-only entry point for `@tekbreed/tekmemo-adapters`.
 *
 * Runtime adapter implementations are intentionally exposed through subpath
 * exports such as `@tekbreed/tekmemo-adapters/ai-sdk` and
 * `@tekbreed/tekmemo-adapters/voyageai`.
 *
 * This root module does not import provider adapters, so installing the
 * convenience package does not force optional peers such as `ai`, `openai`, or
 * `@upstash/vector` to load unless the matching subpath is imported.
 *
 * @packageDocumentation
 */

export type TekMemoAdapterCategory =
	| "agent-workspace"
	| "ai-sdk"
	| "cloud"
	| "embedding-provider"
	| "rerank-provider"
	| "vector-store";

export interface TekMemoAdapterDescriptor {
	readonly name: string;
	readonly packageName: string;
	readonly importPath: string;
	readonly category: TekMemoAdapterCategory;
	readonly description: string;
	readonly optionalPeerDependencies?: readonly string[];
}

export const adapterPackages = {
	agentfs: "@tekbreed/tekmemo-agentfs",
	aiSdk: "@tekbreed/tekmemo-ai-sdk",
	cloudClient: "@tekbreed/tekmemo-cloud-client",
	openai: "@tekbreed/tekmemo-openai",
	rerankVoyage: "@tekbreed/tekmemo-rerank-voyage",
	upstashVector: "@tekbreed/tekmemo-upstash-vector",
	voyageai: "@tekbreed/tekmemo-voyageai",
} as const;

export const adapterImportPaths = {
	agentfs: "@tekbreed/tekmemo-adapters/agentfs",
	aiSdk: "@tekbreed/tekmemo-adapters/ai-sdk",
	cloudClient: "@tekbreed/tekmemo-adapters/cloud-client",
	openai: "@tekbreed/tekmemo-adapters/openai",
	openaiTesting: "@tekbreed/tekmemo-adapters/openai/testing",
	rerankVoyage: "@tekbreed/tekmemo-adapters/rerank-voyage",
	rerankVoyageTesting: "@tekbreed/tekmemo-adapters/rerank-voyage/testing",
	upstashVector: "@tekbreed/tekmemo-adapters/upstash-vector",
	voyageai: "@tekbreed/tekmemo-adapters/voyageai",
	voyageaiTesting: "@tekbreed/tekmemo-adapters/voyageai/testing",
} as const;

export type TekMemoAdapterName = keyof typeof adapterPackages;
export type TekMemoAdapterImportPath =
	(typeof adapterImportPaths)[keyof typeof adapterImportPaths];

export const tekMemoAdapters = [
	{
		name: "AgentFS",
		packageName: adapterPackages.agentfs,
		importPath: adapterImportPaths.agentfs,
		category: "agent-workspace",
		description:
			"AgentFS session workspaces, checkpoints, and memory extraction for TekMemo agents.",
	},
	{
		name: "AI SDK",
		packageName: adapterPackages.aiSdk,
		importPath: adapterImportPaths.aiSdk,
		category: "ai-sdk",
		description:
			"Vercel AI SDK tools and prompt helpers for scoped TekMemo memory.",
		optionalPeerDependencies: ["ai"],
	},
	{
		name: "Cloud client",
		packageName: adapterPackages.cloudClient,
		importPath: adapterImportPaths.cloudClient,
		category: "cloud",
		description:
			"TekMemo Cloud API client and cloud or hybrid runtime helpers.",
	},
	{
		name: "OpenAI",
		packageName: adapterPackages.openai,
		importPath: adapterImportPaths.openai,
		category: "embedding-provider",
		description: "OpenAI embedding adapter for TekMemo recall pipelines.",
		optionalPeerDependencies: ["openai"],
	},
	{
		name: "VoyageAI",
		packageName: adapterPackages.voyageai,
		importPath: adapterImportPaths.voyageai,
		category: "embedding-provider",
		description: "VoyageAI embedding adapter for TekMemo recall pipelines.",
	},
	{
		name: "Upstash Vector",
		packageName: adapterPackages.upstashVector,
		importPath: adapterImportPaths.upstashVector,
		category: "vector-store",
		description: "Upstash Vector recall adapter for indexed TekMemo memory.",
		optionalPeerDependencies: ["@upstash/vector"],
	},
	{
		name: "VoyageAI rerank",
		packageName: adapterPackages.rerankVoyage,
		importPath: adapterImportPaths.rerankVoyage,
		category: "rerank-provider",
		description: "VoyageAI reranking adapter for recall result ranking.",
	},
] as const satisfies readonly TekMemoAdapterDescriptor[];
