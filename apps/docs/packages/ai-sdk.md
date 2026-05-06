---
title: AI SDK Integration
description: Use @tekmemo/ai-sdk to add safe memory tools to AI SDK apps.
---

# `@tekmemo/ai-sdk`

Use this package when you want an AI SDK app or agent to read and write TekMemo memory through safe structured tools.

## Install

```sh
npm install tekmemo @tekmemo/fs @tekmemo/ai-sdk
```

## What it does

- builds memory tool definitions
- validates tool input
- executes safe memory commands
- builds prompt-ready memory context
- supports recall hits when available

## Example

```ts
import { buildMemoryToolDefinition } from "@tekmemo/ai-sdk";

const memoryTool = buildMemoryToolDefinition({ store });
```

The package does not expose arbitrary filesystem access.
