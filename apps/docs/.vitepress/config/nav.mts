import type { DefaultTheme } from "vitepress";
import { apiVersionNavItems, latestApiVersion } from "../versions.mts";

export const nav: DefaultTheme.NavItem[] = [
	{ text: "Guide", link: "/guide/", activeMatch: "/guide/" },
	{ text: "SDKs", link: "/sdks/", activeMatch: "/sdks/" },
	{ text: "Packages", link: "/packages/", activeMatch: "/packages/" },
	{ text: "API", link: "/api/", activeMatch: "/api/" },
	{ text: latestApiVersion, items: apiVersionNavItems, activeMatch: "/api/" },
	{ text: "Examples", link: "/examples/", activeMatch: "/examples/" },
	{
		text: "Resources",
		items: [
			{ text: "Hosting", link: "/hosting/" },
			{ text: "Architecture", link: "/architecture/" },
			{ text: "Roadmap", link: "/reference/roadmap" },
			{ text: "Benchmarks", link: "/reference/benchmarks" },
			{ text: "Blog", link: "/blog/" },
			{ text: "Changelog", link: "/changelog/" },
			{ text: "FAQs", link: "/faqs/" },
		],
	},
];
