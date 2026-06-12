# AI Runtime Integrations

TekMemo should support multiple AI runtimes without putting runtime-specific code in the core package.

## Principle

```txt
tekmemo = memory protocol and core contracts
runtime integration package = tool bridge for a specific AI SDK
```

This prevents the core runtime from becoming coupled to one AI framework.

## Current integrations

```txt
@tekbreed/tekmemo-ai-sdk
@tekbreed/tekmemo-tanstack-ai
```

## `@tekbreed/tekmemo-ai-sdk`

Use this when the host app uses Vercel AI SDK-style tools.

It should expose TekMemo memory actions as AI SDK-compatible tools.

## `@tekbreed/tekmemo-tanstack-ai`

Use this when the host app uses TanStack AI.

TanStack AI uses a `toolDefinition()` architecture where a tool schema is defined once and then implemented on the server or client.

TekMemo should expose TanStack AI tools through:

```ts
createTekMemoTanStackTools({
  toolDefinition,
  runtime
});
```

## Behind the scenes

The flow is:

```txt
TanStack AI chat()
  -> model decides to call TekMemo tool
  -> toolDefinition server implementation runs
  -> runtime reads/writes/searches TekMemo memory
  -> result returns to model
```

For read/search tools:

```txt
model asks about memory
  -> tekmemo_read_memory or tekmemo_search_memory
  -> returns context
```

For mutation tools:

```txt
model wants to update memory
  -> approval gate
  -> tekmemo_write_memory / tekmemo_append_note / tekmemo_record_event
  -> local or hosted runtime writes memory
```

## Runtime interface

The TanStack integration should depend on a small runtime object:

```ts
interface TekMemoTanStackRuntime {
  read(path: string): Promise<string> | string;
  write(path: string, content: string): Promise<void> | void;
  append(path: string, content: string): Promise<void> | void;
  searchMemory?(input: {
    query: string;
    topK?: number;
    filter?: Record<string, unknown>;
  }): Promise<{
    results: Array<{
      id: string;
      text?: string;
      score: number;
      metadata?: Record<string, unknown>;
    }>;
  }>;
}
```

## Why runtime injection matters

The integration package should not know whether memory is backed by:

- `@tekbreed/tekmemo-fs`
- `@tekbreed/tekmemo-agentfs`
- TekMemo Cloud
- a test fake
- another storage adapter

The host app wires the runtime.

## Approval policy

Mutation tools should require approval by default:

```txt
write memory
append note
record event
```

Read-only tools should not require approval by default:

```txt
read memory
search memory
```

## Package boundary

Runtime-specific integration packages should never own:

- provider keys
- billing
- tenant routing
- quota enforcement
- vector provider selection
- `.tekmemo/` protocol definitions

They only translate TekMemo memory capabilities into tools for the target AI runtime.
