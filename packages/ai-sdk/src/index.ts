/**
 * Vercel AI SDK integration for TekMemo.
 *
 * The package supports the original MemoryStore-based local tools and the newer
 * runtime-based API that can plug into local, cloud, or hybrid runtimes.
 *
 * @public
 */

export type {
	AgentSessionInstructionPaths,
	BuildAgentSessionInstructionsOptions,
} from "./agent-session/build-agent-session-instructions";
export { buildAgentSessionInstructions } from "./agent-session/build-agent-session-instructions";
export { buildPrepareCallMemoryText } from "./prepare-call/build-prepare-call-memory-text";
export { safeReadMemoryPath } from "./prepare-call/safe-read-memory-path";
export { buildRuntimeMemoryContext } from "./runtime/build-runtime-memory-context";
export {
	type CreateLocalAiSdkRuntimeOptions,
	createLocalAiSdkRuntime,
} from "./runtime/local-runtime";
export type { MemoryToolInput } from "./schemas/memory-tool-schema";
export { memoryToolInputSchema } from "./schemas/memory-tool-schema";
export type { RuntimeMemoryToolInput } from "./schemas/runtime-memory-tool-schema";
export {
	runtimeMemoryScopeSchema,
	runtimeMemoryToolInputSchema,
} from "./schemas/runtime-memory-tool-schema";
export {
	assertMemoryScope,
	assertScopeAllowed,
	canReadMemoryMetadata,
	createRecallFilters,
	createScopeMetadata,
	inferWriteScope,
	normalizeAccessContext,
	TekMemoScopeError,
} from "./scope/scope-policy";
export { buildMemoryToolDefinition } from "./tools/build-memory-tool-definition";
export {
	buildRuntimeMemoryToolDefinition,
	runRuntimeMemoryTool,
} from "./tools/build-runtime-memory-tool-definition";
export { runStructuredMemoryTool } from "./tools/run-structured-memory-tool";
export type {
	BuildPrepareCallMemoryTextInput,
	MemoryStores,
	MemoryToolExecutionContext,
	SafeReadableMemoryPath,
} from "./types/ai-sdk-memory.js";
export type { MemoryHit, MemoryScope, RetrievalPlan } from "./types/retrieval";
export type {
	AiMemoryAccessContext,
	AiMemoryKind,
	AiMemoryScope,
	AiMemoryScopeMetadata,
	AiMemoryVisibility,
	AiRuntimeCoreMemoryDocument,
	AiRuntimeCreateNoteInput,
	AiRuntimeIndexInput,
	AiRuntimeIndexResult,
	AiRuntimeListNotesInput,
	AiRuntimeMemoryNote,
	AiRuntimePage,
	AiRuntimeRecallHit,
	AiRuntimeRecallInput,
	AiRuntimeRecallResult,
	BuildRuntimeMemoryContextInput,
	BuildRuntimeMemoryContextResult,
	JsonObject,
	JsonPrimitive,
	JsonValue,
	NormalizedAiMemoryAccessContext,
	RuntimeMemoryToolOptions,
	ScopedMemoryWriteInput,
	TekMemoAiRuntime,
} from "./types/runtime";
