/**
 * Simple mutex lock for path-based exclusive operations.
 *
 * @remarks
 * Ensures that operations on the same path are serialized (run one at a time).
 * Used by `NodeFsMemoryStore` to prevent concurrent writes to the same file.
 *
 * @internal
 */
export class PathLock {
	private readonly queues = new Map<string, Promise<void>>();

	/**
	 * Runs a task exclusively for a given key.
	 *
	 * @param key - The path/key to lock on.
	 * @param task - The async task to run.
	 * @returns The result of the task.
	 */
	async runExclusive<T>(key: string, task: () => Promise<T>): Promise<T> {
		const previous = this.queues.get(key) ?? Promise.resolve();
		let release!: () => void;
		const current = new Promise<void>((resolve) => {
			release = resolve;
		});
		const queued = previous.then(
			() => current,
			() => current,
		);

		this.queues.set(key, queued);

		try {
			await previous.catch(() => undefined);
			return await task();
		} finally {
			release();
			if (this.queues.get(key) === queued) {
				this.queues.delete(key);
			}
		}
	}

	/**
	 * Returns the number of active locks.
	 *
	 * @returns The number of paths currently being processed.
	 */
	size(): number {
		return this.queues.size;
	}
}
