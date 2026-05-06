# `@repo/test-utils`

Shared contract tests, fixtures, and fakes for TekMemo packages.

This package makes every adapter obey the same behavioral contract.

## Why it exists

TekMemo has many packages:

- `@tekmemo/fs`
- `@tekmemo/agentfs`
- `@tekmemo/voyageai`
- `@tekmemo/openai`
- `@tekmemo/recall`
- `@tekmemo/upstash-vector`
- `@tekmemo/turso-vector`
- `@tekmemo/qdrant`
- `@tekmemo/rerank`
- `@tekmemo/rerank-voyage`

Without shared contract tests, each adapter can accidentally behave differently.

This package prevents that.

## Install

```bash
pnpm add -D @repo/test-utils vitest
```

## Memory store contract

```ts
import { defineMemoryStoreContractTests } from "@repo/test-utils/contracts";

defineMemoryStoreContractTests({
  name: "@tekmemo/fs",
  async createStore() {
    return createNodeFsMemoryStore({ rootDir });
  },
  async cleanup() {
    await rm(rootDir, { recursive: true, force: true });
  }
});
```

## Embedder contract

```ts
import { defineEmbedderContractTests } from "@repo/test-utils/contracts";

defineEmbedderContractTests({
  name: "@tekmemo/voyageai",
  createEmbedder() {
    return createVoyageEmbedder({ client: fakeClient, expectedDimensions: 4 });
  },
  expectedDimensions: 4
});
```

## Recall store contract

```ts
import { defineRecallStoreContractTests } from "@repo/test-utils/contracts";

defineRecallStoreContractTests({
  name: "@tekmemo/upstash-vector",
  async createStore() {
    return createUpstashRecallStore({ index: fakeIndex, dimensions: 3 });
  }
});
```

## Reranker contract

```ts
import { defineRerankerContractTests } from "@repo/test-utils/contracts";

defineRerankerContractTests({
  name: "@tekmemo/rerank-voyage",
  createReranker() {
    return createVoyageReranker({ client: fakeClient });
  }
});
```

## Package boundary

This package owns:

- contract test definitions
- fake stores/providers
- reusable fixtures
- reusable assertions
- mutation-safety helpers

It does **not** own:

- production runtime behavior
- provider integrations
- cloud billing
- BYOK encryption
- `.tekmemo/` protocol implementation
