export const site = {
	name: "TekMemo",
	title: "TekMemo",
	description:
		"File-first memory runtime for AI apps and agents. Start locally with the TypeScript SDK, then deploy wherever your app runs.",
	url: "https://tekmemo.com",
	repo: "https://github.com/tekbreed/tekmemo",
	npm: "https://www.npmjs.com/package/tekmemo",
	author: "TekBreed",
	license: "MIT",
	currentApiVersion: "v0.1",
} as const;

export const product = {
	positioning: "File-first memory infrastructure for AI apps and agents.",
	tagline:
		"Local-first, inspectable, versionable memory for developer-owned AI systems.",
	promise:
		"Use TekMemo locally without cost, bring your own providers for recall, and host it with the TypeScript application stack you already use.",
	memoryRoot: ".tekmemo/",
} as const;
