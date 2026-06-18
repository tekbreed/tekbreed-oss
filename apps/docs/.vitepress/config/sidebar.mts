import type { DefaultTheme } from "vitepress";

const tekmemo = [
	{ text: "Overview", link: "/packages/tekmemo/" },
	{ text: "Getting started", link: "/packages/tekmemo/getting-started" },
	{ text: "Installation", link: "/packages/tekmemo/installation" },
	{ text: "The `Tekmemo` client", link: "/packages/tekmemo/client" },
	{ text: "Core concepts", link: "/packages/tekmemo/concepts" },
	{ text: "Configuration", link: "/packages/tekmemo/configuration" },
	{ text: "File-first memory", link: "/packages/tekmemo/file-first-memory" },
	{ text: "Memory filesystem", link: "/packages/tekmemo/filesystem-layout" },
	{ text: "Memory records", link: "/packages/tekmemo/memory-records" },
	{
		text: "AI SDK",
		items: [
			{ text: "Tools", link: "/packages/tekmemo/ai-sdk/tools" },
			{ text: "Agent patterns", link: "/packages/tekmemo/ai-sdk/agent-patterns" },
		],
	},
	{
		text: "Cloud client",
		link: "/packages/tekmemo/cloud-client",
	},
	{
		text: "Errors",
		link: "/packages/tekmemo/errors",
	},
	{ text: "Production checklist", link: "/packages/tekmemo/production-checklist" },
	{
		text: "Architecture",
		items: [
			{ text: "Overview", link: "/packages/tekmemo/architecture/" },
			{
				text: "Package boundaries",
				link: "/packages/tekmemo/architecture/package-boundaries",
			},
			{
				text: "Memory model",
				link: "/packages/tekmemo/architecture/memory-model",
			},
			{
				text: "Graph memory",
				link: "/packages/tekmemo/architecture/graph-memory",
			},
			{
				text: "Indexing and recall",
				link: "/packages/tekmemo/architecture/indexing-recall",
			},
			{
				text: "Sync and events",
				link: "/packages/tekmemo/architecture/sync-events",
			},
			{ text: "Security", link: "/packages/tekmemo/architecture/security" },
		],
	},
	{ text: "FAQ", link: "/packages/tekmemo/faq" },
];

const tekmemoCli = [
	{ text: "Getting started", link: "/packages/cli/" },
	{ text: "Local commands", link: "/packages/cli/local-commands" },
	{ text: "Cloud commands", link: "/packages/cli/cloud-commands" },
	{ text: "Agent workflow", link: "/packages/cli/agent-workflow" },
];
const tekmemoMcp = [
	{ text: "Getting started", link: "/packages/mcp/" },
	{ text: "Hosted MCP", link: "/packages/mcp/hosted" },
	{ text: "Client Setup", link: "/packages/mcp/client-setup" },
	{ text: "Runtime modes", link: "/packages/mcp/runtime-modes" },
	{ text: "Tools", link: "/packages/mcp/tools" },
	{ text: "Resources", link: "/packages/mcp/resources" },
	{ text: "Prompts", link: "/packages/mcp/prompts" },
	{ text: "Security", link: "/packages/mcp/security" },
];

const tekMemoApi = [
	{ text: "Overview", link: "/api/tekmemo/" },
	{ text: "`Tekmemo` class", link: "/api/tekmemo/tekmemo" },
	{
		text: "Integrations",
		items: [
			{ text: "AI SDK", link: "/api/tekmemo/ai-sdk" },
			{ text: "Cloud client", link: "/api/tekmemo/cloud-client" },
		],
	},
	{
		text: "Modules",
		items: [
			{ text: "Core Primitives", link: "/api/tekmemo/core" },
			{ text: "Filesystem Store", link: "/api/tekmemo/fs" },
			{ text: "Agent Filesystem", link: "/api/tekmemo/agentfs" },
			{ text: "Graph Memory", link: "/api/tekmemo/graph" },
			{ text: "Recall", link: "/api/tekmemo/recall" },
			{ text: "Reranking", link: "/api/tekmemo/rerank" },
			{ text: "Benchmark Kit", link: "/api/tekmemo/benchmark-kit" },
		],
	},
];

const faqs = [{ text: "TekMemo", link: "/faqs/" }];

export const sidebar: DefaultTheme.Sidebar = {
	"/packages/tekmemo/": [{ text: "Core Runtime", items: tekmemo }],
	"/packages/cli/": [{ text: "CLI", items: tekmemoCli }],
	"/packages/mcp/": [{ text: "MCP", items: tekmemoMcp }],
	"/api/tekmemo/": [{ text: "API", items: tekMemoApi }],
	"/faqs/": [{ text: "Frequently Asked Questions", items: faqs }],
};
