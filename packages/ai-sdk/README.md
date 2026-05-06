# @tekmemo/ai-sdk

Vercel AI SDK integration for **TekMemo**. This package enables AI agents to interact with their own memory through structured tools and automated context injection.

## Features

- **Context Building**: Automatically assemble Core, Archival, and Recall memory into a prompt-ready string.
- **Structured Tools**: Ready-to-use `memoryTool` for the AI SDK `generateText` and `streamText` functions.
- **Retrieval Planning**: Configurable retrieval logic to decide which memory layers to read for a given call.

## Installation

```bash
# pnpm
pnpm add @tekmemo/ai-sdk tekmemo

# npm
npm install @tekmemo/ai-sdk tekmemo

# yarn
yarn add @tekmemo/ai-sdk tekmemo
```

## Usage

### Using the Memory Tool

```typescript
import { generateText } from "ai";
import { buildMemoryToolDefinition } from "@tekmemo/ai-sdk";
import { store } from "./my-store";

const { text } = await generateText({
  model: openai("gpt-4o"),
  tools: {
    manage_memory: buildMemoryToolDefinition({ store })
  },
  prompt: "Remember that my birthday is tomorrow."
});
```

### Injecting Memory Context

```typescript
import { buildPrepareCallMemoryText } from "@tekmemo/ai-sdk";

const context = await buildPrepareCallMemoryText({
  stores: { workspace: store },
  retrievalPlan: { readUserMemory: true, readArchivalMemory: true },
  baseInstructions: "You are a helpful assistant with access to the following memory:"
});

// Pass `context` to your system prompt
```

## Related Packages

- [`tekmemo`](../tekmemo): Core memory models and logic.
