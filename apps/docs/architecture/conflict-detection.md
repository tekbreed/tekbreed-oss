---
title: Conflict Detection
description: How TekMemo should detect stale, duplicate, and contradictory memory.
---

# Conflict Detection

Memory becomes risky when old facts remain active after newer facts replace them.

## Example

```txt
Old: The app uses Express.
New: The app now uses Hono.
```

A memory system should not keep both as equally active truth.

## Conflict types

| Type | Example |
| :--- | :--- |
| Direct contradiction | “Uses Express” vs “uses Hono”. |
| Preference replacement | “Prefers long answers” vs “prefers concise answers”. |
| Policy conflict | “Store all chats” vs “do not store private chats”. |
| Duplicate memory | Same fact stored many times. |
| Stale memory | Old project decision no longer valid. |

## Resolution outcomes

```txt
keep both with note
mark old stale
merge duplicates
ask user to resolve
apply policy rule
```

## Future implementation

Conflict detection should use:

- memory type
- source timestamp
- confidence score
- scope
- semantic similarity
- graph relations
- policy rules
- user approval hooks
