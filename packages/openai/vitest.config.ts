import { createVitestConfig } from "@repo/test-utils/vitest";

export default createVitestConfig({
	test: {
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
	},
});
