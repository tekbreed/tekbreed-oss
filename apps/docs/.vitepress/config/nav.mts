import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
	{
		text: "Packages",
		items: [
			{
				text: "TekMemo",
				link: "/packages/tekmemo",
				activeMatch: "/packages/tekmemo/",
			},
			{
				text: "TekMemo CLI",
				link: "/packages/cli",
				activeMatch: "/packages/cli/",
			},
			{
				text: "TekMemo MCP Server",
				link: "/packages/mcp",
				activeMatch: "/packages/mcp/",
			},
		],
		activeMatch: "/packages/",
	},
	{
		text: "API",
		items: [
			{
				text: "TekMemo",
				link: "/api/tekmemo",
				activeMatch: "/api/tekmemo/",
			},
		],
		activeMatch: "/api/",
	},

	{
		text: "Changelog",
		items: [
			{
				text: "TekMemo",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo/CHANGELOG.md",
			},
			{
				text: "TekMemo CLI",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo-cli/CHANGELOG.md",
			},
			{
				text: "TekMemo MCP Server",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo-mcp-server/CHANGELOG.md",
			},
		],
		activeMatch: "/changelog/",
	},
	{
		text: "FAQs",
		link: "/faqs/",
		activeMatch: "/faqs/",
	},
];
