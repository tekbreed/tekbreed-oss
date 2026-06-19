/**
 * Shared internal helpers for Tekmemo runtime implementations.
 *
 * @internal
 */

import type {
	MemoryContextInput,
	MemoryContextResult,
	RecallItem,
} from "./types";

/**
 * Truncates a string to fit within a specific byte limit, appending a notice at the end.
 *
 * @param text - The string to truncate.
 * @param maxBytes - The maximum byte limit constraint.
 * @returns The original string or truncated string with truncation notice.
 */
export function truncateUtf8(text: string, maxBytes: number): string {
	if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
	let low = 0;
	let high = text.length;
	while (low < high) {
		const mid = Math.floor((low + high + 1) / 2);
		if (Buffer.byteLength(text.slice(0, mid), "utf8") <= maxBytes) low = mid;
		else high = mid - 1;
	}
	return `${text.slice(0, low).trimEnd()}\n\n[Output truncated to ${maxBytes} bytes]`;
}

export interface PaginationOptions {
	cursor?: string;
	limit?: number;
	defaultLimit: number;
	maxLimit: number;
}

/**
 * The agent-facing directive emitted at the top of every context block. It
 * tells the model how to act on the memory sections that follow, so the
 * returned context is self-explaining rather than a bare data dump.
 *
 * Keep this short, imperative, and tool-agnostic so it reads correctly under
 * any host (MCP client, AI SDK runtime, CLI). It mirrors the guidance already
 * baked into the `tekmemo.context` / `tekmemo.recall` / `tekmemo.remember`
 * tool descriptions.
 */
export const AGENT_CONTEXT_DIRECTIVE = `TekMemo is your long-term memory — treat it as the single source of truth for project identity, architecture, constraints, and decisions.

- Adhere to memory: follow the constraints, decisions, and preferences below. Stored facts override assumptions and guesses.
- Recall before answering: when a fact, convention, or prior decision might exist, call tekmemo.recall instead of re-deriving it.
- Persist discoveries: when you learn a durable decision, constraint, preference, or architectural fact, call tekmemo.remember (classify with kind, set confidence) without waiting to be asked.
- Never store secrets, credentials, or environment values. Respect read-only intent where indicated.`;

export function normalizeLimit(
	limit: number | undefined,
	defaultLimit: number,
	maxLimit: number,
): number {
	if (limit === undefined) return defaultLimit;
	if (!Number.isFinite(limit) || limit < 1) return defaultLimit;
	return Math.min(Math.floor(limit), maxLimit);
}

export function encodeCursor(offset: number, namespace?: string): string {
	const payload: JsonObject = { v: 1, offset };
	if (namespace !== undefined) payload.namespace = namespace;
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(cursor?: string, namespace?: string): number {
	if (cursor === undefined) return 0;
	try {
		const decoded = JSON.parse(
			Buffer.from(cursor, "base64url").toString("utf8"),
		) as { v?: number; offset?: number; namespace?: string };
		if (decoded.namespace !== undefined && namespace !== undefined) {
			if (decoded.namespace !== namespace) return 0;
		}
		return typeof decoded.offset === "number" ? decoded.offset : 0;
	} catch {
		return 0;
	}
}

export function paginateArray<T>(
	items: T[],
	options: PaginationOptions,
	namespace?: string,
): { items: T[]; nextCursor?: string } {
	const limit = normalizeLimit(
		options.limit,
		options.defaultLimit,
		options.maxLimit,
	);
	const offset = decodeCursor(options.cursor, namespace);
	const slice = items.slice(offset, offset + limit);
	const nextOffset = offset + slice.length;
	const hasMore = nextOffset < items.length;
	return {
		items: slice,
		...(hasMore ? { nextCursor: encodeCursor(nextOffset, namespace) } : {}),
	};
}

import type { JsonObject } from "./types";

/**
 * Builds the unified agent context by querying core memory, recent memories,
 * and executing semantic recall, then truncating to fit within maxBytes.
 */
export async function buildContext(
	operations: {
		readCoreMemory?: (
			signal?: AbortSignal,
		) => Promise<{ content: string; warnings?: string[] }>;
		readNotesMemory?: (
			signal?: AbortSignal,
		) => Promise<{ content: string; warnings?: string[] }>;
		listRecentMemories?: (
			input: { limit?: number },
			signal?: AbortSignal,
		) => Promise<{
			items: Array<{
				id: string;
				type?: string;
				timestamp?: string;
				summary?: string;
			}>;
			warnings?: string[];
		}>;
		recall: (
			input: MemoryContextInput,
			signal?: AbortSignal,
		) => Promise<{ items: RecallItem[]; warnings?: string[] }>;
	},
	input: MemoryContextInput,
	signal?: AbortSignal,
): Promise<MemoryContextResult> {
	const maxBytes = input.maxBytes ?? 64_000;
	const sections: MemoryContextResult["sections"] = [];
	const warnings: string[] = [];
	let recallItems: RecallItem[] = [];

	// Lead with an agent directive so the returned context is self-explaining:
	// the model learns how to USE the sections below (adhere, recall before
	// guessing, persist discoveries) from the very first block. Placed here so
	// all strategies — local, cloud, hybrid — emit the same instructions.
	sections.push({
		type: "directive",
		title: "How to use TekMemo context",
		content: AGENT_CONTEXT_DIRECTIVE,
	});

	if (input.includeCore !== false && operations.readCoreMemory) {
		try {
			const core = await operations.readCoreMemory(signal);
			if (core.content.trim()) {
				sections.push({
					type: "core",
					title: "Core Memory",
					content: core.content.trim(),
				});
			}
			if (core.warnings?.length) warnings.push(...core.warnings);
		} catch (error) {
			warnings.push(
				`Could not read core memory: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	if (input.includeRecent !== false && operations.listRecentMemories) {
		try {
			const recent = await operations.listRecentMemories(
				{ limit: Math.min(input.limit ?? 5, 20) },
				signal,
			);
			if (recent.items.length > 0) {
				const content = recent.items
					.map(
						(item) =>
							`- ${item.timestamp ?? "unknown"} ${item.type ?? "memory"}: ${item.summary ?? item.id}`,
					)
					.join("\n");
				sections.push({
					type: "recent",
					title: "Recent Memory Events",
					content,
				});
			}
			if (recent.warnings?.length) warnings.push(...recent.warnings);
		} catch (error) {
			warnings.push(
				`Could not read recent memory: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	try {
		const recall = await operations.recall(input, signal);
		recallItems = recall.items;
		if (recall.items.length > 0) {
			const content = recall.items
				.map(
					(item, index) =>
						`${index + 1}. ${item.text}${item.score === undefined ? "" : `\n   score: ${item.score}`}`,
				)
				.join("\n\n");
			sections.push({ type: "recall", title: "Relevant Recall", content });
		}
		if (recall.warnings?.length) warnings.push(...recall.warnings);
	} catch (error) {
		warnings.push(
			`Recall failed: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	if (input.includeNotes === true && operations.readNotesMemory) {
		try {
			const notes = await operations.readNotesMemory(signal);
			if (notes.content.trim()) {
				sections.push({
					type: "notes",
					title: "Notes Memory",
					content: notes.content.trim(),
				});
			}
			if (notes.warnings?.length) warnings.push(...notes.warnings);
		} catch (error) {
			warnings.push(
				`Could not read notes memory: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	const text = truncateUtf8(
		sections
			.map((section) => `## ${section.title}\n\n${section.content}`)
			.join("\n\n"),
		maxBytes,
	);

	return {
		text,
		sections,
		items: recallItems,
		...(warnings.length === 0 ? {} : { warnings }),
	};
}
