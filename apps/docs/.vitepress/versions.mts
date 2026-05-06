import type { DefaultTheme } from "vitepress";

export type ApiVersion = {
	label: string;
	version: string;
	link: string;
	latest?: boolean;
};

export const latestApiVersion = "v0.1";

export const apiVersions: ApiVersion[] = [
	//  {
	//   label: 'v0.1',
	//   version: 'v0.1',
	//   link: '/api/v0.1',
	//   latest: true
	// }
	{
		label: "v0.1",
		version: "v0.1",
		link: "/api/",
		latest: true,
	},
];

export const apiVersionNavItems: DefaultTheme.NavItemWithLink[] =
	apiVersions.map((item) => ({
		text: item.latest ? `${item.label} latest` : item.label,
		link: item.link,
	}));

export const previousApiVersions = apiVersions.filter((item) => !item.latest);
