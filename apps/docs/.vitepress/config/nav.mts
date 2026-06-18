import type { DefaultTheme } from "vitepress";

export const nav: DefaultTheme.NavItem[] = [
	{
		text: "Get Started",
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
		text: "Changelog",
		items: [
			{
				text: "Core",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo/CHANGELOG.md",
			},
			{
				text: "CLI",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo-cli/CHANGELOG.md",
			},
			{
				text: "MCP Server",
				link: "https://github.com/tekbreed/tekbreed-oss/blob/main/packages/tekmemo-mcp-server/CHANGELOG.md",
			},
		],
		activeMatch: "/changelog/",
	},
];
