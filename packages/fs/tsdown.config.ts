import { pkgConfig } from "@repo/tsdown-config";

export default pkgConfig({
	entry: ["src/index.ts"],
	external: ["@tekbreed/tekmemo"],
});
