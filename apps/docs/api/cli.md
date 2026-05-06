---
title: CLI API
description: TekMemo CLI commands for local memory, inspection, indexing, snapshots, and sync.
---

# CLI API

The TekMemo CLI helps developers operate `.tekmemo/` stores.

## Commands

```sh
tekmemo init
tekmemo status
tekmemo inspect
tekmemo index
tekmemo search "project decisions"
tekmemo snapshot create "before-launch"
tekmemo sync push
tekmemo sync pull
```

## `tekmemo init`

Creates a `.tekmemo/` folder with the default memory filesystem.

```sh
tekmemo init
```

## `tekmemo inspect`

Prints the memory manifest, files, indexes, and sync state.

```sh
tekmemo inspect
```

<AdSlot placement="cli-api-bottom" />
