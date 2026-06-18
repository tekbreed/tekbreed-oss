# Architecture

TekMemo is designed around inspectable memory boundaries.

## Layers

1. **Memory primitives** — Core types, document/event helpers, validation, and canonical file paths (`@tekbreed/tekmemo`)
2. **Runtime strategies** — Local (filesystem), cloud, hybrid (policy router), and in-memory strategies
3. **`Tekmemo` client** — A unified façade that picks a strategy from the resolved config and exposes one API surface
4. **Recall and providers** — Embedding, vector search, and reranking adapters
5. **Graph memory** — Entities and relationships module
6. **Cloud client** — TekMemo Cloud API transport module
7. **Integrations** — Standalone CLI (`@tekbreed/tekmemo-cli`), MCP server (`@tekbreed/tekmemo-mcp-server`), and AI SDK tool helpers

See [The `Tekmemo` client](../client) for how the façade composes these layers.
