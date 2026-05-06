import { createVitestConfig } from "@repo/test-utils/vitest";

export default createVitestConfig({
	test: {
		coverage: {
			reporter: ["text", "json", "html"],
		},
	},
});
