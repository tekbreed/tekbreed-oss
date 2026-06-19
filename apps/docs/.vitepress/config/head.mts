import type { HeadConfig } from "vitepress";
import { site } from "./site.mts";

export const GTAG_ID = "G-D6Q96NPN7K";

export const head: HeadConfig[] = [
	["meta", { name: "theme-color", content: "#2563eb" }],
	["meta", { property: "og:title", content: "TekMemo" }],
	["meta", { property: "og:description", content: site.description }],
	["meta", { property: "og:type", content: "website" }],
	["meta", { property: "og:url", content: site.cloud }],
	["meta", { property: "og:image", content: "/logo.svg" }],
	["meta", { name: "twitter:card", content: "summary_large_image" }],
	["meta", { name: "twitter:title", content: "TekMemo" }],
	["meta", { name: "twitter:description", content: site.description }],
	["meta", { name: "twitter:image", content: "/logo.svg" }],
	["link", { rel: "icon", href: "/logo.svg" }],

	[
		"script",
		{
			async: "",
			src: `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`,
		},
	],
	[
		"script",
		{},
		`
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', '${GTAG_ID}');
      `,
	],
];
