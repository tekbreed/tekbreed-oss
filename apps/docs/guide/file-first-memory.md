---
title: File-First Memory
description: How TekMemo stores memory as inspectable project files.
---

# File-First Memory

TekMemo treats memory as application state that developers can inspect, test, diff, back up, and review.

Instead of hiding memory inside a hosted service, the runtime writes durable state into a `.tekmemo/` directory owned by your app or agent workspace.

## Why files

| Property | Benefit |
| :--- | :--- |
| Inspectable | Developers can read memory without special tools. |
| Versionable | Teams can snapshot, compare, and restore memory state. |
| Testable | Unit tests can create temporary memory stores. |
| Portable | Memory can move with a repo, workspace, or deployment volume. |
| Provider-neutral | Recall providers can change without changing the core record model. |

## What belongs in memory

Use TekMemo for durable facts, preferences, decisions, summaries, and retrieved fragments that should survive beyond a single prompt.

Do not store secrets, raw credentials, or private data unless your application has explicit consent, encryption, retention, and deletion controls.

## Runtime shape

The TypeScript SDK reads and writes memory through package APIs. The local filesystem adapter persists that state to disk, while recall and provider packages add indexing when semantic retrieval is needed.
