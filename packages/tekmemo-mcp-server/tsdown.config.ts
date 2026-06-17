import { pkgConfig } from "@repo/tsdown";

export default pkgConfig({
	entry: {
		index: "src/index.ts",
		"bin/tekmemo-mcp": "src/bin/tekmemo-mcp.ts",
	},
});
