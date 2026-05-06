import { pkgConfig } from "@repo/tsdown-config";

export default pkgConfig({
	entry: ["src/index.ts", "src/testing/index.ts"],
	treeshake: true,
});
