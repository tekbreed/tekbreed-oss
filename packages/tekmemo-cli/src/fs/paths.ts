/**
 * CLI File path safety validation and resolution helpers.
 *
 * @module paths
 */

import path from "node:path";
import { CliFsError } from "../errors/cli-errors";

/**
 * Normalizes and resolves a root directory path, enforcing basic security assertions.
 *
 * @param rootDir - The raw input directory path.
 * @returns The resolved absolute path.
 * @throws {CliFsError} If the rootDir is empty or contains null bytes.
 */
export function normalizeRootDir(rootDir: string): string {
	if (typeof rootDir !== "string" || rootDir.trim().length === 0) {
		throw new CliFsError("rootDir must be a non-empty string.");
	}

	if (rootDir.includes("\0")) {
		throw new CliFsError("rootDir must not contain null bytes.");
	}

	return path.resolve(rootDir);
}

/**
 * Safely resolves a relative path inside a root directory, preventing directory traversal escapes.
 *
 * @param rootDir - The absolute path of the root directory.
 * @param relativePath - The relative path to resolve inside the root.
 * @returns The resolved absolute path.
 * @throws {CliFsError} If path validation fails or the path attempts to escape the root directory.
 */
export function resolveInsideRoot(
	rootDir: string,
	relativePath: string,
): string {
	if (typeof relativePath !== "string" || relativePath.trim().length === 0) {
		throw new CliFsError("relativePath must be a non-empty string.");
	}

	if (relativePath.includes("\0")) {
		throw new CliFsError("relativePath must not contain null bytes.");
	}

	if (path.isAbsolute(relativePath)) {
		throw new CliFsError("relativePath must not be absolute.");
	}

	const normalized = relativePath.replaceAll("\\", "/");

	if (normalized.split("/").includes("..")) {
		throw new CliFsError("relativePath must not contain path traversal.");
	}

	const resolved = path.resolve(rootDir, normalized);
	const relative = path.relative(rootDir, resolved);

	if (relative.startsWith("..") || path.isAbsolute(relative)) {
		throw new CliFsError("Resolved path escaped rootDir.");
	}

	return resolved;
}
