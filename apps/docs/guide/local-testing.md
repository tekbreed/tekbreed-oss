---
title: Free Local Testing
description: Test TekMemo without paying for hosted infrastructure.
---

# Free Local Testing

TekMemo should be useful before a developer pays anything. The local-first model makes that possible.

## What is free

| Capability | Requires hosting? | Requires paid provider? |
| :--- | :---: | :---: |
| Create `.tekmemo/` files | No | No |
| Read/write core memory | No | No |
| Append notes | No | No |
| Append conversation JSONL | No | No |
| Keyword search | No | No |
| Event log | No | No |
| Snapshots | No | No |
| BYO semantic recall | No | User pays provider |
| Production API endpoint | Yes | No |
| Semantic recall with hosted providers | No | User pays provider |

## Local test modes

### Mode 1: file memory only

Use `tekmemo` and `@tekmemo/fs`.

```sh
npm install tekmemo @tekmemo/fs
```

This mode is enough to test memory creation, updates, notes, conversations, events, and prompt compilation.

### Mode 2: local keyword recall

Keyword recall uses local indexes. It is useful for exact terms, file names, decisions, project names, package names, and IDs.

### Mode 3: BYO semantic recall

Bring your own embedding provider and vector database.

```sh
npm install tekmemo @tekmemo/upstash-vector @tekmemo/openai
```

or:

```sh
npm install tekmemo @tekmemo/upstash-vector @tekmemo/voyageai
```

TekMemo provides the adapters. Your app pays the provider directly.

## Why this matters

This protects both sides:

- developers can test deeply without a credit card
- TekMemo does not pay unlimited AI/vector costs for free users
- teams can choose when production hosting and provider-backed recall become worth paying for

## Recommended local test checklist

- [ ] create a store
- [ ] bootstrap `.tekmemo/`
- [ ] write core memory
- [ ] append notes
- [ ] append conversation entries
- [ ] run keyword recall
- [ ] build prompt-ready memory text
- [ ] inspect files manually
- [ ] delete and restore from snapshot
- [ ] add BYO semantic recall only when needed
