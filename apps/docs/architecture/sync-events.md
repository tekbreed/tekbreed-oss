---
title: Sync and Events
description: How TekMemo syncs memory and records changes through event logs.
---

# Sync and Events

TekMemo should record memory changes before any hosted application workflow tries to coordinate them.

## Event types

```txt
MEMORY_CREATED
MEMORY_UPDATED
MEMORY_MERGED
MEMORY_CONFLICT_DETECTED
MEMORY_DEPRECATED
MEMORY_FORGOTTEN
MEMORY_RESTORED
```

## Why events matter

Events make memory auditable. They also power restore, conflict detection, sync reconciliation, and usage analytics.

## Sync flow

```txt
local change
  -> memory event
  -> sync manifest update
  -> hosted app request
  -> hosted index/update/history
```

<AdSlot placement="sync-events-bottom" />
