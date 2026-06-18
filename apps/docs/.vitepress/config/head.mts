import type { HeadConfig } from "vitepress";
import { site } from "./site.mts";

export const head: HeadConfig[] = [
	["meta", { name: "theme-color", content: "#2563eb" }],
	["meta", { property: "og:title", content: "TekMemo" }],
	["meta", { property: "og:description", content: site.description }],
	["meta", { property: "og:type", content: "website" }],
	["meta", { property: "og:url", content: site.cloud }],
	["meta", { property: "og:image", content: `${site.cloud}/og-image.png` }],
	["meta", { name: "twitter:card", content: "summary_large_image" }],
	["meta", { name: "twitter:title", content: "TekMemo" }],
	["meta", { name: "twitter:description", content: site.description }],
	["meta", { name: "twitter:image", content: `${site.cloud}/og-image.png` }],
	["link", { rel: "icon", href: "/logo.svg" }],
];
