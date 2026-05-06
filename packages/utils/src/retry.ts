/**
 * Retry utilities with exponential backoff and jitter.
 *
 * @remarks
 * Provides `withRetry` for wrapping async operations with retry logic,
 * `isRetryableError` for checking if an error should be retried,
 * and `sleep` for delays.
 *
 * @internal
 */

import { DEFAULT_RETRYABLE_STATUSES } from "./errors";

/**
 * Checks if an error is retryable based on HTTP status codes or error type.
 */
export function isRetryableError(
	error: unknown,
	retryableStatuses: readonly number[] = DEFAULT_RETRYABLE_STATUSES,
): boolean {
	if (typeof error !== "object" || error === null) return false;

	const err = error as Record<string, unknown>;

	if (
		typeof err.status === "number" &&
		retryableStatuses.includes(err.status as number)
	) {
		return true;
	}

	const name = err.name as string | undefined;
	if (
		name?.includes("NetworkError") ||
		name?.includes("TimeoutError") ||
		name?.includes("ECONNREFUSED") ||
		name?.includes("ETIMEDOUT")
	) {
		return true;
	}

	return false;
}

/**
 * Computes exponential backoff delay with optional jitter.
 */
export function computeBackoffDelay(
	attempt: number,
	options: { baseDelayMs: number; maxDelayMs: number; jitter: boolean },
): number {
	const exponential = Math.min(
		options.maxDelayMs,
		options.baseDelayMs * 2 ** attempt,
	);

	if (!options.jitter) {
		return exponential;
	}

	const min = Math.floor(exponential / 2);
	return min + Math.floor(Math.random() * Math.max(1, exponential - min));
}

/**
 * Wraps an async operation with retry logic.
 */
export async function withRetry<T>(
	operation: () => Promise<T>,
	options?: {
		maxRetries?: number | undefined;
		baseDelayMs?: number | undefined;
		maxDelayMs?: number | undefined;
		jitter?: boolean | undefined;
		retryableStatuses?: readonly number[] | undefined;
		isRetryable?: ((error: unknown) => boolean) | undefined;
	},
): Promise<T> {
	const maxRetries = options?.maxRetries ?? 2;
	const baseDelayMs = options?.baseDelayMs ?? 250;
	const maxDelayMs = options?.maxDelayMs ?? 5_000;
	const jitter = options?.jitter ?? true;
	const retryableStatuses =
		options?.retryableStatuses ?? DEFAULT_RETRYABLE_STATUSES;
	const isRetryable =
		options?.isRetryable ?? ((err) => isRetryableError(err, retryableStatuses));

	let lastError: unknown;

	for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;

			if (attempt >= maxRetries || !isRetryable(error)) {
				throw error;
			}

			await sleep(
				computeBackoffDelay(attempt, { baseDelayMs, maxDelayMs, jitter }),
			);
		}
	}

	throw lastError;
}

/**
 * Sleeps for a given number of milliseconds.
 */
/**
 * Sleeps for a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the delay.
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
