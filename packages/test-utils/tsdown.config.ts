import { pkgConfig } from "@repo/tsdown-config";

export default pkgConfig({
	entry: [
		"src/index.ts",
		"src/contracts/index.ts",
		"src/fakes/index.ts",
		"src/fixtures/index.ts",
		"src/vitest.ts",
	],
	treeshake: true,
});
