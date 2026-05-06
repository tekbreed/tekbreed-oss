import type { HeadConfig } from "vitepress";
import { site } from "./site.mts";

export const head: HeadConfig[] = [
	["link", { rel: "icon", type: "image/svg+xml", href: "/tekmemo.svg" }],
	["meta", { name: "theme-color", content: "#0f172a" }],
	["meta", { name: "application-name", content: site.name }],
	["meta", { name: "apple-mobile-web-app-title", content: site.name }],
	["meta", { property: "og:type", content: "website" }],
	["meta", { property: "og:title", content: site.title }],
	["meta", { property: "og:description", content: site.description }],
	["meta", { property: "og:image", content: "/og.png" }],
	["meta", { name: "twitter:card", content: "summary_large_image" }],
	["meta", { name: "twitter:title", content: site.title }],
	["meta", { name: "twitter:description", content: site.description }],
	["meta", { name: "twitter:image", content: "/og.png" }],
];
