---
title: Hosting Security
description: Security guidance for hosted TekMemo applications.
---

# Hosting Security

TekMemo memory may contain sensitive user or project context. Treat it as application data.

## Baseline controls

| Control | Why it matters |
| :--- | :--- |
| Scope separation | Prevents user, project, and session memory from mixing accidentally. |
| Secret handling | Keeps provider keys and credentials out of memory records. |
| Access control | Restricts who can read or mutate memory files. |
| Retention | Defines when memory should be deleted or compacted. |
| Backups | Protects durable memory from accidental loss. |

Do not store secrets in memory records. Store credentials in your host's secret manager and reference them only through application configuration.
