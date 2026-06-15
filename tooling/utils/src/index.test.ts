import { expect, test } from "vitest";
import { assertNonEmptyString, normalizeBatchSize } from "./index";

test("assertNonEmptyString returns trimmed valid strings", () => {
	expect(() => assertNonEmptyString(" tekmemo ", "label")).not.toThrow();
});

test("normalizeBatchSize applies defaults and bounds", () => {
	expect(normalizeBatchSize(undefined, 1, 10, 4)).toBe(4);
	expect(() => normalizeBatchSize(25, 1, 10, 4)).toThrow(
		"batchSize must be <= 10.",
	);
});
