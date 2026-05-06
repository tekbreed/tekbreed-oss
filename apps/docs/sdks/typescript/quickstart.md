---
title: TypeScript Quickstart
description: Start using TekMemo in a local TypeScript project.
---

# Quickstart

The fastest path is local file memory.

```sh
pnpm add tekmemo @tekmemo/fs
```

Create a `.tekmemo/` store in your project workspace, write memory records through the runtime, and read them back when composing agent context.

## Recommended flow

1. Start with local memory in development.
2. Keep records scoped by project, user, or session.
3. Add tests around memory writes and recall behavior.
4. Add provider-backed recall only when keyword or direct record reads are not enough.

See [examples](/examples/) for framework-specific usage.
