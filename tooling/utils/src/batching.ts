/**
 * Array batching utilities.
 *
 * @internal
 */

/**
 * Splits an array into chunks of a specified size.
 *
 * @param items - The array to split.
 * @param size - The maximum chunk size (must be a positive integer).
 * @returns An array of chunks.
 * @throws `Error` If size is not a positive integer.
 */
export function chunkArray<T>(items: readonly T[], size: number): T[][] {
	if (!Number.isInteger(size) || size <= 0) {
		throw new Error("size must be a positive integer.");
	}

	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}
