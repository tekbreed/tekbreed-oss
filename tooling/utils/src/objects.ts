/**
 * Object manipulation utilities.
 *
 * @internal
 */

/**
 * Checks if a value is a plain object (not null, not array, not Date, etc.).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a plain object, `false` otherwise.
 */
export function isPlainObject(
	value: unknown,
): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep clones a JSON-serializable value.
 *
 * @param value - The value to clone.
 * @returns A deep clone of the value.
 */
export function cloneJsonValue<T>(value: T): T {
	if (value === undefined) return value as T;
	return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Deep clones a record (plain object).
 *
 * @param value - The record to clone.
 * @returns A deep clone of the record, or `undefined` if input was `undefined`.
 */
export function cloneRecord<T extends Record<string, unknown> | undefined>(
	value: T,
): T {
	if (value === undefined) return value;
	return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Asserts that an object key is safe (not a prototype pollution key).
 *
 * @param key - The key to check.
 * @param name - Field name for error messages (defaults to "key").
 * @throws `Error` If the key is a prototype pollution key.
 */
export function assertSafeObjectKey(key: string, name = "key"): void {
	if (key === "__proto__" || key === "constructor" || key === "prototype") {
		throw new Error(`${name} is not allowed.`);
	}
}
