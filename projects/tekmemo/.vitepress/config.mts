import { defineConfig } from "vitepress";

export default defineConfig({
	title: "TekMemo",
	description:
		"Developer-owned, file-first memory infrastructure for AI apps and agents",
	cleanUrls: true,
	themeConfig: {
		nav: [
			{ text: "Start", link: "/00-start-here/current-architecture-update" },
			{ text: "Protocol", link: "/05-architecture/local-tekmemo-protocol" },
			{ text: "AI Runtimes", link: "/05-architecture/ai-runtime-integrations" },
			{ text: "Packages", link: "/02-oss-and-packages/package-map" },
			{ text: "Cloud", link: "/04-cloud-product/cloud-product-spec" },
			{ text: "Launch", link: "/10-launch-survival/index" },
		],
		sidebar: [
			{
				text: "Start Here",
				items: [
					{ text: "Overview", link: "/" },
					{
						text: "Current Architecture Update",
						link: "/00-start-here/current-architecture-update",
					},
					{
						text: "Documentation Map",
						link: "/00-start-here/documentation-map",
					},
					{ text: "How to Use These Docs", link: "/00-start-here/how-to-use" },
					{
						text: "Build Now vs Later",
						link: "/00-start-here/build-now-vs-later",
					},
				],
			},
			{
				text: "Strategy",
				items: [
					{
						text: "Product Strategy",
						link: "/01-product-strategy/product-strategy",
					},
					{ text: "Runbook", link: "/01-product-strategy/runbook" },
					{
						text: "Competitive Positioning",
						link: "/01-product-strategy/competitive-positioning",
					},
				],
			},
			{
				text: "OSS and Packages",
				items: [
					{ text: "Package Map", link: "/02-oss-and-packages/package-map" },
					{
						text: "TanStack AI Support",
						link: "/02-oss-and-packages/tanstack-ai-support",
					},
					{
						text: "Package Boundaries",
						link: "/02-oss-and-packages/package-boundaries",
					},
					{
						text: "BYOK and OSS Policy",
						link: "/02-oss-and-packages/byok-and-oss-policy",
					},
					{ text: "Release Plan", link: "/02-oss-and-packages/release-plan" },
				],
			},
			{
				text: "Package Reference",
				items: [
					{ text: "Core Runtime", link: "/03-package-reference/core-runtime" },
					{ text: "@tekbreed/tekmemo", link: "/03-package-reference/tekmemo" },
					{
						text: "Memory Stores",
						link: "/03-package-reference/memory-stores",
					},
					{ text: "@tekbreed/tekmemo-fs", link: "/03-package-reference/fs" },
					{ text: "Embeddings", link: "/03-package-reference/embeddings" },
					{
						text: "Vector Recall",
						link: "/03-package-reference/vector-recall",
					},
					{ text: "Reranking", link: "/03-package-reference/reranking" },
					{
						text: "Advanced Packages",
						link: "/03-package-reference/advanced-packages",
					},
				],
			},
			{
				text: "Cloud Product",
				items: [
					{
						text: "Cloud Product Spec",
						link: "/04-cloud-product/cloud-product-spec",
					},
					{ text: "Dashboard IA", link: "/04-cloud-product/dashboard-ia" },
					{ text: "Figma Brief", link: "/04-cloud-product/figma-brief" },
				],
			},
			{
				text: "Architecture",
				items: [
					{
						text: "Local .tekmemo Protocol",
						link: "/05-architecture/local-tekmemo-protocol",
					},
					{
						text: "Memory Architecture",
						link: "/05-architecture/memory-architecture",
					},
					{
						text: "AI Runtime Integrations",
						link: "/05-architecture/ai-runtime-integrations",
					},
					{
						text: "Infra Architecture",
						link: "/05-architecture/infra-architecture",
					},
					{
						text: "Backend Folder Architecture",
						link: "/05-architecture/backend-folder-architecture",
					},
				],
			},
			{
				text: "API and Database",
				items: [
					{ text: "API Contract", link: "/06-api/api-contract" },
					{ text: "Prisma Schema", link: "/07-database/prisma-schema" },
					{ text: "Multi-Tenancy", link: "/07-database/multi-tenancy" },
				],
			},
			{
				text: "Billing",
				items: [
					{
						text: "Pricing and Billing",
						link: "/08-pricing-billing/pricing-billing",
					},
					{
						text: "Pricing Page Copy",
						link: "/08-pricing-billing/pricing-page-copy",
					},
				],
			},
			{
				text: "Testing",
				items: [
					{
						text: "Benchmarking Strategy",
						link: "/09-testing-benchmarks/benchmarking-strategy",
					},
					{
						text: "Package Test Plan",
						link: "/09-testing-benchmarks/package-test-plan",
					},
					{
						text: "Benchmark Kit Integration",
						link: "/09-testing-benchmarks/benchmark-kit-integration",
					},
				],
			},
			{
				text: "1-Month Launch",
				items: [
					{ text: "Launch Index", link: "/10-launch-survival/index" },
					{
						text: "4-Week Survival Plan",
						link: "/10-launch-survival/4-week-survival-plan",
					},
					{ text: "Week 1", link: "/10-launch-survival/week-1" },
					{ text: "Week 2", link: "/10-launch-survival/week-2" },
					{ text: "Week 3", link: "/10-launch-survival/week-3" },
					{ text: "Week 4", link: "/10-launch-survival/week-4" },
					{
						text: "Revenue Actions",
						link: "/10-launch-survival/revenue-actions",
					},
				],
			},
			{
				text: "Operations",
				items: [
					{
						text: "Operational Runbook",
						link: "/11-operations/operational-runbook",
					},
					{
						text: "Cloudflare Cost-Saving Guide",
						link: "/11-operations/cloudflare-cost-saving-guide",
					},
					{ text: "Release Gates", link: "/11-operations/release-gates" },
				],
			},
			{
				text: "Governance and Roadmap",
				items: [
					{
						text: "OSS Governance",
						link: "/12-governance-community/oss-governance",
					},
					{ text: "Roadmap", link: "/13-roadmap/roadmap" },
					{ text: "Source Merge Map", link: "/appendix/source-merge-map" },
				],
			},
		],
	},
});
