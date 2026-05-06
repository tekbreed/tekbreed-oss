/**
 * Safely reads a memory path, returning a default value if not found.
 *
 * @remarks
 * Wraps store.read() and catches "not found" errors.
 *
 * @internal
 */

import { isNotFoundError } from "@repo/utils";
import type { MemoryPath, MemoryStore } from "tekmemo";

/**
 * Safely reads a memory path, returning a default value if not found.
 * Other errors are propagated.
 *
 * @param store - The memory store to read from.
 * @param path - The memory path to read.
 * @param defaultValue - Value to return if path is not found.
 * @returns The file content, or defaultValue if not found.
 */
export async function safeReadMemoryPath(
	store: MemoryStore,
	path: MemoryPath,
	defaultValue = "",
): Promise<string> {
	try {
		return await store.read(path);
	} catch (error) {
		if (isNotFoundError(error)) {
			return defaultValue;
		}
		throw error;
	}
}
