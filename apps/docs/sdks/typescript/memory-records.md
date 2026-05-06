---
title: TypeScript Memory Records
description: Working with memory records from the TypeScript SDK.
---

# Memory Records

TypeScript apps use memory records to persist durable context.

Keep records small, scoped, and traceable. A record should usually represent one fact, decision, preference, summary, or retrieved fragment.

## Scope

| Scope | Use for |
| :--- | :--- |
| Project | Repo conventions, product facts, architecture decisions. |
| User | Preferences, long-lived personal context, consented profile details. |
| Session | Short-lived workflow state. |

Prefer explicit promotion from session memory into user or project memory after review.
