import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import AdSlot from "./components/AdSlot.vue";
import BlogIndex from "./components/BlogIndex.vue";
import HomePanels from "./components/HomePanels.vue";
import SidebarBrand from "./components/SidebarBrand.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	Layout() {
		return h(DefaultTheme.Layout, null, {
			"sidebar-nav-before": () => h(SidebarBrand),
			"aside-outline-after": () =>
				h(AdSlot, { placement: "aside-after-toc", size: "rail" }),
			"doc-before": () => h(AdSlot, { placement: "doc-top", size: "banner" }),
			"doc-after": () => h(AdSlot, { placement: "doc-bottom", size: "banner" }),
		});
	},
	enhanceApp({ app }) {
		app.component("AdSlot", AdSlot);
		app.component("BlogIndex", BlogIndex);
		app.component("HomePanels", HomePanels);
	},
} satisfies Theme;
