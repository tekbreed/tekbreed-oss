import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
	{
		text: "Get Started",
		link: "/packages/tekmemo",
		activeMatch: "/packages/tekmemo/",
	},
	{
		text: "TekMemo",
		link: "/packages/tekmemo",
		activeMatch: "/packages/tekmemo/",
	},
	{
		text: "CLI",
		link: "/packages/cli",
		activeMatch: "/packages/cli/",
	},
	{
		text: "MCP Server",
		link: "/packages/mcp",
		activeMatch: "/packages/mcp/",
	},
	{
		text: "API",
		link: "/api/tekmemo",
		activeMatch: "/api/tekmemo/",
	},
	{
		text: "Cloud",
		link: "https://memo.tekbreed.com",
	},
	{
		text: "Blog",
		link: "/blog/",
		activeMatch: "/blog/",
	},
];
