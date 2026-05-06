import type { DefaultTheme } from "vitepress";
import { latestApiVersion, previousApiVersions } from "../versions.mts";

const guide = [
	{ text: "Introduction", link: "/guide/" },
	{ text: "Getting Started", link: "/guide/getting-started" },
	{ text: "Installation", link: "/guide/installation" },
	{ text: "Core Concepts", link: "/guide/concepts" },
	{ text: "File-First Memory", link: "/guide/file-first-memory" },
	{ text: "Memory Records", link: "/guide/memory-records" },
	{ text: "Memory Filesystem", link: "/guide/memory-filesystem" },
	{ text: "Recall", link: "/guide/recall" },
	{ text: "Free Local Testing", link: "/guide/local-testing" },
	{ text: "Configuration", link: "/guide/configuration" },
	{ text: "Production Checklist", link: "/guide/production-checklist" },
];

const sdks = [
	{ text: "Overview", link: "/sdks/" },
	{ text: "TypeScript SDK", link: "/sdks/typescript/" },
	{ text: "Installation", link: "/sdks/typescript/installation" },
	{ text: "Quickstart", link: "/sdks/typescript/quickstart" },
	{ text: "Memory Records", link: "/sdks/typescript/memory-records" },
	{ text: "Recall", link: "/sdks/typescript/recall" },
	{ text: "API", link: "/sdks/typescript/api" },
];

const packages = [
	{ text: "Overview", link: "/packages/" },
	{ text: "Core Runtime", link: "/packages/core-runtime" },
	{ text: "Local FS Adapter", link: "/packages/fs-adapter" },
	{ text: "AI SDK Integration", link: "/packages/ai-sdk" },
	{ text: "AgentFS Adapter", link: "/packages/agentfs" },
	{ text: "Recall", link: "/packages/recall" },
	{ text: "Rerank", link: "/packages/rerank" },
	{ text: "Rerank Voyage", link: "/packages/rerank-voyage" },
	{ text: "Upstash Vector Adapter", link: "/packages/upstash-vector" },
	{ text: "Voyage Embedder", link: "/packages/voyageai" },
	{ text: "OpenAI Embedder", link: "/packages/openai" },
];

const api = [
	{ text: "Overview", link: "/api/" },
	{ text: "Runtime API", link: "/api/runtime" },
	{ text: "Package API", link: "/api/packages" },
	{ text: "CLI API", link: "/api/cli" },
	{ text: "Config API", link: "/api/config" },
];

export const sidebar: DefaultTheme.Sidebar = {
	"/api/v0.1/": [
		{
			text: "API Reference v0.1",
			items: [{ text: "Overview", link: "/api/v0.1/" }],
		},
		{
			text: "Latest Version",
			items: [{ text: `${latestApiVersion} latest`, link: "/api/" }],
		},
	],
	"/api/": [
		{ text: `API Reference ${latestApiVersion}`, items: api },
		{
			text: "Previous Versions",
			items: previousApiVersions.map((v) => ({ text: v.label, link: v.link })),
		},
	],
	"/guide/": [{ text: "Guide", items: guide }],
	"/sdks/": [{ text: "SDKs", items: sdks }],
	"/packages/": [{ text: "Packages", items: packages }],
	"/examples/": [
		{
			text: "Examples",
			items: [
				{ text: "Overview", link: "/examples/" },
				{ text: "Basic Memory", link: "/examples/basic-memory" },
				{ text: "Local Only", link: "/examples/local-only" },
				{ text: "AI SDK Memory", link: "/examples/ai-sdk-memory" },
				{ text: "AI SDK Agent", link: "/examples/ai-sdk-agent" },
				{ text: "Recall with Upstash", link: "/examples/recall-upstash" },
				{ text: "BYO Provider", link: "/examples/byo-provider" },
				{ text: "React Router", link: "/examples/react-router" },
				{ text: "Next.js", link: "/examples/nextjs" },
				{ text: "Express", link: "/examples/expressjs" },
				{ text: "Hono", link: "/examples/honojs" },
				{ text: "Cloudflare Workers", link: "/examples/cloudflare-workers" },
			],
		},
	],
	"/hosting/": [
		{
			text: "Hosting",
			items: [
				{ text: "Overview", link: "/hosting/" },
				{ text: "Vercel", link: "/hosting/vercel" },
				{ text: "Cloudflare Workers", link: "/hosting/cloudflare-workers" },
				{ text: "Node Servers", link: "/hosting/node" },
				{ text: "Security", link: "/hosting/security" },
			],
		},
	],
	"/architecture/": [
		{
			text: "Architecture",
			items: [
				{ text: "Overview", link: "/architecture/" },
				{ text: "Memory Model", link: "/architecture/memory-model" },
				{
					text: "Package Boundaries",
					link: "/architecture/package-boundaries",
				},
				{ text: "Indexing and Recall", link: "/architecture/indexing-recall" },
				{ text: "Sync and Events", link: "/architecture/sync-events" },
				{
					text: "Conflict Detection",
					link: "/architecture/conflict-detection",
				},
				{ text: "Graph Memory", link: "/architecture/graph-memory" },
			],
		},
	],
	"/reference/": [
		{
			text: "Reference",
			items: [
				{ text: "Overview", link: "/reference/" },
				{ text: "Configuration", link: "/reference/configuration" },
				{ text: "Errors", link: "/reference/errors" },
				{ text: "Limits", link: "/reference/limits" },
				{ text: "Glossary", link: "/reference/glossary" },
				{ text: "Competitors", link: "/reference/competitors" },
				{ text: "Benchmarks", link: "/reference/benchmarks" },
				{ text: "Roadmap", link: "/reference/roadmap" },
			],
		},
	],
	"/blog/": [{ text: "Blog", items: [{ text: "All Posts", link: "/blog/" }] }],
	"/changelog/": [
		{
			text: "Changelog",
			items: [{ text: "Release Notes", link: "/changelog/" }],
		},
	],
};
