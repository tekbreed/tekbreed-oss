/**
 * MCP Tool definitions configuration mapping schemas and safety constraints.
 *
 * @module definitions
 */

import {
	booleanSchema,
	graphEdgeSchema,
	graphNodeSchema,
	numberSchema,
	objectSchema,
	sourceRefSchema,
	stringSchema,
} from "../schema";
import type { JsonObject, McpToolDefinition } from "../types";

const commonScopeProperties: JsonObject = {
	workspaceId: stringSchema(
		"Workspace id. The runtime decides whether this is required.",
		256,
	),
	projectId: stringSchema("Project id inside the workspace.", 256),
};

const kindSchema: JsonObject = {
	type: "string",
	enum: [
		"decision",
		"constraint",
		"goal",
		"preference",
		"reference",
		"summary",
		"note",
	],
	description: "Memory kind. Defaults to note.",
};

/**
 * Creates and returns all MCP tool definitions supported by TekMemo.
 * Configures lists pagination properties to match maxPageSize where appropriate.
 *
 * @param maxPageSize - The maximum allowed page limit size constraint.
 * @returns An array of all available McpToolDefinitions.
 */
export function createToolDefinitions(
	maxPageSize: number,
): McpToolDefinition[] {
	return [
		{
			name: "tekmemo_agent_session_start",
			title: "Start TekMemo Agent Session",
			description:
				"Create an AgentFS-backed TekMemo session workspace and return paths/resources for coding agents.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					task: stringSchema("Agent task or brief.", 4096),
					actorId: stringSchema("Actor id such as assistant:codex.", 256),
					sessionId: stringSchema("Optional safe session id.", 256),
					...commonScopeProperties,
				},
				["task"],
			),
		},
		{
			name: "tekmemo_agent_session_read",
			title: "Read TekMemo Agent Session File",
			description: "Read one AgentFS session file.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					sessionId: stringSchema("Session id.", 256),
					path: stringSchema("Session file path.", 2048),
					...commonScopeProperties,
				},
				["sessionId", "path"],
			),
		},
		{
			name: "tekmemo_agent_session_write",
			title: "Write TekMemo Agent Session File",
			description:
				"Write an allowed working/ or output/ file in an AgentFS session.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					sessionId: stringSchema("Session id.", 256),
					path: stringSchema("Session file path.", 2048),
					content: stringSchema("File content.", 200_000),
					...commonScopeProperties,
				},
				["sessionId", "path", "content"],
			),
		},
		{
			name: "tekmemo_agent_session_append",
			title: "Append TekMemo Agent Session File",
			description:
				"Append to an allowed working/ or output/ file in an AgentFS session.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					sessionId: stringSchema("Session id.", 256),
					path: stringSchema("Session file path.", 2048),
					content: stringSchema("Content to append.", 200_000),
					...commonScopeProperties,
				},
				["sessionId", "path", "content"],
			),
		},
		{
			name: "tekmemo_agent_session_extract",
			title: "Extract TekMemo Agent Session Memory",
			description:
				"Extract summary, durable memory, follow-ups, errors, and changes from an AgentFS session.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					sessionId: stringSchema("Session id.", 256),
					...commonScopeProperties,
				},
				["sessionId"],
			),
		},
		{
			name: "tekmemo_agent_session_complete",
			title: "Complete TekMemo Agent Session",
			description:
				"Extract, checkpoint, push, and optionally persist durable memory from an AgentFS session.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					sessionId: stringSchema("Session id.", 256),
					extractDurableMemory: booleanSchema(
						"Persist output/durable-memory.md into TekMemo notes.",
					),
					checkpointLabel: stringSchema("Checkpoint label.", 128),
					...commonScopeProperties,
				},
				["sessionId"],
			),
		},
		{
			name: "tekmemo.health",
			title: "TekMemo Health",
			description:
				"Check TekMemo MCP runtime health, mode, and available capabilities.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema({}),
			outputSchema: objectSchema(
				{
					ok: { type: "boolean" },
					name: { type: "string" },
					version: { type: "string" },
					mode: { type: "string" },
					capabilities: { type: "array", items: { type: "string" } },
				},
				["ok", "name", "version", "capabilities"],
			),
		},
		{
			name: "tekmemo.context",
			title: "Build TekMemo Agent Context",
			description:
				"REQUIRED at the start of every task: build task-ready memory context by combining core memory, recent memory, and recall. TekMemo is the single source of truth for project identity, architecture, constraints, and decisions — ALWAYS call this before planning or writing code so your work adheres to stored memory. The returned text already tells you how to act on it. Read-only.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					query: stringSchema("Current user task or context query.", 4096),
					...commonScopeProperties,
					limit: {
						type: "integer",
						minimum: 1,
						maximum: maxPageSize,
						description: "Maximum recall items to include.",
					},
					maxBytes: {
						type: "integer",
						minimum: 1024,
						maximum: 262144,
						description: "Maximum context text bytes.",
					},
					includeCore: booleanSchema("Include core memory."),
					includeNotes: booleanSchema("Include notes memory."),
					includeRecent: booleanSchema("Include recent memory events."),
					includeGraph: booleanSchema("Ask runtime for graph-aware context."),
					includeSources: booleanSchema("Include source references."),
					filters: {
						type: "object",
						description: "Runtime-specific JSON filters.",
					},
				},
				["query"],
			),
		},
		{
			name: "tekmemo.recall",
			title: "Recall TekMemo Memory",
			description:
				"Semantic + lexical memory search. Use this proactively — before answering, when unsure, or when a fact might already be known. Phrases it understands: synonyms and paraphrases, not just exact keywords. Call it instead of guessing or re-deriving facts. Read-only; never modifies memory.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					query: stringSchema("Natural language recall query.", 4096),
					...commonScopeProperties,
					limit: {
						type: "integer",
						minimum: 1,
						maximum: maxPageSize,
						description: "Maximum results to return.",
					},
					includeGraph: booleanSchema(
						"Whether to include graph-aware recall if supported.",
					),
					includeSources: booleanSchema(
						"Whether to include source references.",
					),
					filters: {
						type: "object",
						description: "Runtime-specific JSON filters.",
					},
				},
				["query"],
			),
		},
		{
			name: "tekmemo.remember",
			title: "Remember TekMemo Memory",
			description:
				"Persist a durable fact so future agents benefit — call this WITHOUT being asked whenever you discover a decision, constraint, preference, or architectural fact. Use kind to classify (decision/constraint/goal/preference/reference/summary/note). Set confidence to reflect certainty. Hosts may require user consent; never store secrets. This is what makes memory accumulate intelligently.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					title: stringSchema("Optional title.", 512),
					content: stringSchema("Memory note content.", 100_000),
					kind: kindSchema,
					confidence: numberSchema("Confidence score.", 0, 1),
					source: stringSchema("Source actor or origin label.", 512),
					...commonScopeProperties,
					tags: {
						type: "array",
						items: stringSchema("Tag", 128),
						maxItems: 50,
					},
					sourceRefs: { type: "array", items: sourceRefSchema, maxItems: 100 },
					metadata: { type: "object", description: "JSON metadata." },
				},
				["content"],
			),
		},

		{
			name: "tekmemo.read_core_memory",
			title: "Read Core Memory",
			description:
				"Read core memory: the stable, hand-curated project identity, rules, and constraints. This is authoritative — treat its contents as hard constraints that override assumptions. Read-only.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(commonScopeProperties),
		},
		{
			name: "tekmemo.read_notes_memory",
			title: "Read Notes Memory",
			description: "Read TekMemo notes memory.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(commonScopeProperties),
		},
		{
			name: "tekmemo.list_recent_memories",
			title: "List Recent Memory Events",
			description:
				"List recent TekMemo memory events for review and debugging.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema({
				...commonScopeProperties,
				limit: { type: "integer", minimum: 1, maximum: maxPageSize },
			}),
		},
		{
			name: "tekmemo.validate",
			title: "Validate TekMemo Memory",
			description: "Validate TekMemo memory health and report warnings/errors.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema({
				...commonScopeProperties,
				strict: booleanSchema("Treat warnings as deployment blockers."),
			}),
		},
		{
			name: "tekmemo.snapshot",
			title: "Create TekMemo Snapshot",
			description:
				"Create a memory snapshot before major agentic changes. Hosts should request authorization.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema({
				...commonScopeProperties,
				label: stringSchema("Short snapshot label.", 128),
				type: {
					type: "string",
					enum: ["manual", "automatic", "pre-sync", "pre-restore"],
				},
			}),
		},
		{
			name: "tekmemo.update_core_memory",
			title: "Update Core Memory",
			description:
				"Replace stable core memory. This is high-impact and should require explicit user approval.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					content: stringSchema("New core memory markdown.", 200_000),
					...commonScopeProperties,
				},
				["content"],
			),
		},

		{
			name: "tekmemo.sync_status",
			title: "TekMemo Sync Status",
			description:
				"Read the cloud file-replica status for this project: the server manifest, the current cursor, storage usage, and last sync timestamp. Read-only.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(commonScopeProperties),
		},
		{
			name: "tekmemo.sync_pull",
			title: "TekMemo Sync Pull",
			description:
				"Pull file replicas from TekMemo Cloud: request presigned download URLs for files the local workspace is missing or behind on, plus paths removed server-side. The runtime performs the actual byte download, verify, and write.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema({
				...commonScopeProperties,
				since: stringSchema(
					"Opaque cursor to pull everything changed since.",
					512,
				),
			}),
		},
		{
			name: "tekmemo.sync_push",
			title: "TekMemo Sync Push",
			description:
				"Push local `.tekmemo/` file replicas to TekMemo Cloud using the two-phase push contract: request presigned upload URLs for changed/missing files, then confirm the uploads. The runtime performs the actual byte upload between the two phases. Hosts should authorize this write.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
			inputSchema: objectSchema({
				...commonScopeProperties,
				baseCursor: stringSchema(
					"Optional cursor the client last synced at.",
					512,
				),
			}),
		},
		{
			name: "tekmemo.graph_upsert_nodes",
			title: "Upsert Graph Nodes",
			description:
				"Create or update graph memory nodes. This is a write operation and should require user authorization.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					workspaceId: stringSchema("Workspace id.", 256),
					nodes: {
						type: "array",
						items: graphNodeSchema,
						minItems: 1,
						maxItems: 100,
					},
				},
				["nodes"],
			),
		},
		{
			name: "tekmemo.graph_upsert_edges",
			title: "Upsert Graph Edges",
			description:
				"Create or update graph memory edges. This is a write operation and should require user authorization.",
			safety: "write",
			annotations: {
				readOnlyHint: false,
				destructiveHint: false,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					workspaceId: stringSchema("Workspace id.", 256),
					edges: {
						type: "array",
						items: graphEdgeSchema,
						minItems: 1,
						maxItems: 200,
					},
				},
				["edges"],
			),
		},
		{
			name: "tekmemo.graph_neighbors",
			title: "Find Graph Neighbors",
			description:
				"Read graph neighbors around a node with direction, edge type, weight, cursor, and limit controls.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					workspaceId: stringSchema("Workspace id.", 256),
					nodeId: stringSchema("Seed node id.", 256),
					direction: { type: "string", enum: ["in", "out", "both"] },
					edgeTypes: {
						type: "array",
						items: stringSchema("Edge type", 128),
						maxItems: 50,
					},
					minWeight: numberSchema("Minimum edge weight.", 0, 1),
					limit: { type: "integer", minimum: 1, maximum: maxPageSize },
					cursor: stringSchema(
						"Opaque cursor returned by a previous call.",
						512,
					),
				},
				["nodeId"],
			),
		},
		{
			name: "tekmemo.graph_path",
			title: "Find Graph Path",
			description:
				"Find a graph path between two nodes. Use weighted=true for strength-aware pathfinding when supported by the runtime.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema(
				{
					workspaceId: stringSchema("Workspace id.", 256),
					from: stringSchema("Start node id.", 256),
					to: stringSchema("Target node id.", 256),
					weighted: booleanSchema("Prefer weighted pathfinding."),
					maxDepth: { type: "integer", minimum: 1, maximum: 25 },
					edgeTypes: {
						type: "array",
						items: stringSchema("Edge type", 128),
						maxItems: 50,
					},
					minWeight: numberSchema("Minimum edge weight.", 0, 1),
				},
				["from", "to"],
			),
		},
		{
			name: "tekmemo.readiness",
			title: "TekMemo Readiness",
			description: "Check TekMemo Cloud production readiness.",
			safety: "read",
			annotations: {
				readOnlyHint: true,
				idempotentHint: true,
				openWorldHint: false,
			},
			inputSchema: objectSchema({}),
		},
	];
}
