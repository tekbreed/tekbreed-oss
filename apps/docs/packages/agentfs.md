---
title: AgentFS Adapter
description: Use @tekmemo/agentfs for syncable filesystem-backed memory.
---

# `@tekmemo/agentfs`

Use this package when your environment provides an AgentFS-style filesystem backend and you want TekMemo memory to sync across sessions.

## Use cases

- agent workspaces
- portable memory stores
- session checkpoints
- sync before and after runs

## Example

```ts
import { AgentfsMemoryStore, syncBeforeSession, syncAfterSession } from "@tekmemo/agentfs";

await syncBeforeSession(client);
const store = new AgentfsMemoryStore(client, { scope: "project", projectId: "proj_123" });
await syncAfterSession(client, "memory-update");
```
