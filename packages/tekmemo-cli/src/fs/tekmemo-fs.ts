/**
 * Local filesystem wrapper providing safety checks, atomic writes, and path resolution.
 *
 * @module tekmemo-fs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { CliFsError } from "../errors/cli-errors";
import { normalizeRootDir, resolveInsideRoot } from "./paths";

/**
 * Options for configuring the TekMemo CLI filesystem wrapper.
 */
export interface TekMemoFileSystemOptions {
	/**
	 * Local workspace root directory path.
	 */
	rootDir: string;
	/**
	 * Reject operations targeting `.tekmemo` if it resolves to a symlink.
	 */
	rejectSymlinkedTekMemoDir?: boolean;
}

/**
 * High-level filesystem helper class providing sandboxed relative paths, lstat, exists, and atomic writes.
 */
export class TekMemoFileSystem {
	/**
	 * Normalized absolute workspace root directory path.
	 */
	readonly rootDir: string;
	private readonly rejectSymlinkedTekMemoDir: boolean;

	/**
	 * Creates a TekMemoFileSystem wrapper instance.
	 *
	 * @param options - Configuration options.
	 */
	constructor(options: TekMemoFileSystemOptions) {
		this.rootDir = normalizeRootDir(options.rootDir);
		this.rejectSymlinkedTekMemoDir = options.rejectSymlinkedTekMemoDir ?? true;
	}

	/**
	 * Resolves a relative path to an absolute path inside the rootDir.
	 *
	 * @param relativePath - Relative path to resolve.
	 * @returns The resolved absolute path.
	 * @throws {CliFsError} If traversal is detected.
	 */
	resolve(relativePath: string): string {
		return resolveInsideRoot(this.rootDir, relativePath);
	}

	/**
	 * Ensures the root directory exists and performs basic safety validation checks.
	 */
	async ensureSafeRoot(): Promise<void> {
		await fs.mkdir(this.rootDir, { recursive: true });
		await this.rejectUnsafeTekMemoSymlinkIfNeeded();
	}

	/**
	 * Checks if a relative path exists inside the rootDir.
	 *
	 * @param relativePath - Relative path.
	 * @returns `true` if exists, `false` otherwise.
	 */
	async exists(relativePath: string): Promise<boolean> {
		try {
			await fs.lstat(this.resolve(relativePath));
			return true;
		} catch (error) {
			if (isNodeError(error) && error.code === "ENOENT") return false;
			throw new CliFsError(`Failed checking path "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Reads text content from a file inside the rootDir.
	 *
	 * @param relativePath - Relative path to the file.
	 * @returns File content text.
	 */
	async readText(relativePath: string): Promise<string> {
		try {
			return await fs.readFile(this.resolve(relativePath), "utf8");
		} catch (error) {
			throw new CliFsError(`Failed reading "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Reads text content if the file exists, returning undefined otherwise.
	 *
	 * @param relativePath - Relative path.
	 * @returns File content text, or undefined.
	 */
	async readTextIfExists(relativePath: string): Promise<string | undefined> {
		try {
			return await fs.readFile(this.resolve(relativePath), "utf8");
		} catch (error) {
			if (isNodeError(error) && error.code === "ENOENT") return undefined;
			throw new CliFsError(`Failed reading "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Atomically writes text content to a file inside the rootDir using a rename operation.
	 *
	 * @param relativePath - Relative path to write.
	 * @param content - Text content.
	 */
	async writeText(relativePath: string, content: string): Promise<void> {
		if (typeof content !== "string") {
			throw new CliFsError("content must be a string.");
		}

		const target = this.resolve(relativePath);
		const parent = path.dirname(target);
		await fs.mkdir(parent, { recursive: true });

		const tmp = path.join(
			parent,
			`.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
		);

		try {
			await fs.writeFile(tmp, content, "utf8");
			await fs.rename(tmp, target);
		} catch (error) {
			await fs.rm(tmp, { force: true }).catch(() => undefined);
			throw new CliFsError(`Failed writing "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Appends text content to a file.
	 *
	 * @param relativePath - Relative path.
	 * @param content - Text content to append.
	 */
	async appendText(relativePath: string, content: string): Promise<void> {
		if (typeof content !== "string") {
			throw new CliFsError("content must be a string.");
		}

		const target = this.resolve(relativePath);
		await fs.mkdir(path.dirname(target), { recursive: true });

		try {
			await fs.appendFile(target, content, "utf8");
		} catch (error) {
			throw new CliFsError(`Failed appending "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Recursively creates a directory inside rootDir.
	 *
	 * @param relativePath - Relative directory path.
	 */
	async mkdir(relativePath: string): Promise<void> {
		try {
			await fs.mkdir(this.resolve(relativePath), { recursive: true });
		} catch (error) {
			throw new CliFsError(`Failed creating directory "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Retrieves basic stats for a file path.
	 *
	 * @param relativePath - Relative path.
	 * @returns Simple stats descriptor object.
	 */
	async stat(relativePath: string): Promise<{
		isFile: boolean;
		isDirectory: boolean;
		isSymbolicLink: boolean;
		size: number;
	}> {
		try {
			const stats = await fs.lstat(this.resolve(relativePath));
			return {
				isFile: stats.isFile(),
				isDirectory: stats.isDirectory(),
				isSymbolicLink: stats.isSymbolicLink(),
				size: stats.size,
			};
		} catch (error) {
			throw new CliFsError(`Failed stat for "${relativePath}".`, {
				cause: error,
			});
		}
	}

	/**
	 * Verifies that the `.tekmemo` directory is not a symlink.
	 */
	private async rejectUnsafeTekMemoSymlinkIfNeeded(): Promise<void> {
		if (!this.rejectSymlinkedTekMemoDir) return;

		try {
			const stats = await fs.lstat(this.resolve(".tekmemo"));
			if (stats.isSymbolicLink()) {
				throw new CliFsError("Refusing to use symlinked .tekmemo directory.");
			}
		} catch (error) {
			if (error instanceof CliFsError) throw error;
			if (isNodeError(error) && error.code === "ENOENT") return;
			throw new CliFsError("Failed checking .tekmemo directory safety.", {
				cause: error,
			});
		}
	}
}

/**
 * Checks if error is a Node.js system exception.
 */
function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && "code" in error;
}
