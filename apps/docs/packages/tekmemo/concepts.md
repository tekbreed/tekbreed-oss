# Core concepts

## Core memory

Core memory is the stable project briefing. It should contain the facts an AI assistant should know every time it works in the project.

## Notes memory

Notes are durable records such as decisions, constraints, preferences, references, summaries, and general notes.

## Events

Events record changes over time. They make sync, audit, and agent workflows easier to inspect.

## Recall

Recall turns memory into searchable context. Local recall can be keyword-based. Cloud or provider-backed recall can use vector search and reranking.

## Graph memory

Graph memory stores entities and relationships. It helps answer questions like “what depends on this?” or “how are these two decisions connected?”

## Context package

A context package is the structured payload sent to an AI model or tool. It can combine core memory, notes, recall results, graph context, and source metadata.

## Package architecture

TekMemo is published as three main packages:
- `@tekbreed/tekmemo` (the core runtime containing the filesystem store, graph memory, vector adapters, and API modules)
- `@tekbreed/tekmemo-cli` (the CLI distribution)
- `@tekbreed/tekmemo-mcp-server` (the MCP server)

When writing code to integrate TekMemo, you import everything directly from the core `@tekbreed/tekmemo` package. See the [API Reference](/api/tekmemo/) page for the list of modules and helper APIs.

## Glossary

| Term | Meaning |
| --- | --- |
| **Agent session** | A temporary coding workspace managed by AgentFS, tracking the lifecycle of an agent's task. |
| **Cloud client** | The cloud client module of `@tekbreed/tekmemo`, handling API transport and auth. |
| **Context package** | A structured payload combining core memory, notes, recall results, and graph data to be sent to an AI model. |
| **Core memory** | The stable project briefing (`core.md`). Contains facts the agent must know every time it starts working. |
| **Graph memory** | Nodes (entities, concepts, files) and edges (relationships) that help tools answer architectural questions. |
| **Hybrid runtime** | A CLI mode that writes memory to local files but syncs changes to TekMemo Cloud in the background. |
| **MCP** | Model Context Protocol. An open standard used by the `tekmemo-mcp` server to expose memory to IDEs and agents. |
| **Note** | A durable memory record (e.g., a decision, constraint, or summary) saved to `notes.md`. |
| **Recall** | The process of retrieving relevant memory for a query. Can use keywords (local) or embeddings (cloud/provider). |
| **Snapshot** | A point-in-time backup bundle of project memory, used for rollbacks or migrations. |
| **Sync** | The mechanism of resolving memory state between the local `.tekmemo/` filesystem and the TekMemo Cloud database. |
