---
title: Memory Records
description: The durable record shape used by TekMemo memory stores.
---

# Memory Records

A memory record is a durable unit of remembered information. Records are designed to be small enough to retrieve and review, but rich enough to preserve provenance.

## Recommended fields

| Field | Purpose |
| :--- | :--- |
| `id` | Stable record identifier. |
| `scope` | Project, user, or session ownership boundary. |
| `type` | Category such as fact, preference, decision, summary, or fragment. |
| `content` | The remembered text or structured payload. |
| `metadata` | Source, tags, confidence, timestamps, and provider-specific hints. |

## Scope discipline

Keep project, user, and session memory separate unless you intentionally promote a record across scopes.

Session memory is useful during one workflow. User memory should follow a person. Project memory should describe a repo, app, or workspace.

## Retrieval

Recall packages can index memory records for semantic search. The core runtime remains file-first and provider-neutral.
