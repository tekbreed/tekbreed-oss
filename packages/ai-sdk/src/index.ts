/**
 * Vercel AI SDK integration for TekMemo.
 *
 * @remarks
 * Provides memory tooling for AI SDK, including tool definition
 * building, structured tool execution, and memory path safety.
 *
 * @public
 */

export { buildPrepareCallMemoryText } from "./prepare-call/build-prepare-call-memory-text";
export { safeReadMemoryPath } from "./prepare-call/safe-read-memory-path";
export type { MemoryToolInput } from "./schemas/memory-tool-schema";
export { memoryToolInputSchema } from "./schemas/memory-tool-schema";
export { buildMemoryToolDefinition } from "./tools/build-memory-tool-definition";
export { runStructuredMemoryTool } from "./tools/run-structured-memory-tool";
export type {
	BuildPrepareCallMemoryTextInput,
	MemoryStores,
	MemoryToolExecutionContext,
	SafeReadableMemoryPath,
} from "./types/ai-sdk-memory.js";
