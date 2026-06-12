## Package Naming Convention

This repo uses **two namespace conventions** — keep them separate:

| Package directory | Published name | Scope |
|---|---|---|
| `packages/tekmemo` | `@tekbreed/tekmemo` | `@tekbreed` - TekMemo core |
| `packages/ai-sdk` | `@tekbreed/tekmemo-ai-sdk` | `@tekbreed` - TekMemo OSS package |
| `packages/fs` | `@tekbreed/tekmemo-fs` | `@tekbreed` |
| `packages/agentfs` | `@tekbreed/tekmemo-agentfs` | `@tekbreed` |
| `packages/openai` | `@tekbreed/tekmemo-openai` | `@tekbreed` |
| `packages/upstash-vector` | `@tekbreed/tekmemo-upstash-vector` | `@tekbreed` |
| `packages/voyageai` | `@tekbreed/tekmemo-voyageai` | `@tekbreed` |
| `packages/recall` | `@tekbreed/tekmemo-recall` | `@tekbreed` |
| `packages/rerank` | `@tekbreed/tekmemo-rerank` | `@tekbreed` |
| `packages/rerank-voyage` | `@tekbreed/tekmemo-rerank-voyage` | `@tekbreed` |
| `packages/benchmark-kit` | `@tekbreed/tekmemo-benchmark-kit` | `@tekbreed` |
| `tooling/test-utils` | `@repo/test-utils` | `@repo` — internal tooling only |
| `tooling/tsdown-config` | `@repo/tsdown-config` | `@repo` — internal tooling only |
| `tooling/typescript-config` | `@repo/typescript-config` | `@repo` — internal tooling only |
| `tooling/utils` | `@repo/utils` | `@repo` — internal tooling only |

**Rule:** Public OSS packages → `@tekbreed/tekmemo` or `@tekbreed/tekmemo-*`. Internal workspace tooling only → `@repo/*`. Never mix them.

When referencing internal tooling in `devDependencies`, use `"workspace:*"`:

```json
"devDependencies": {
  "@repo/typescript-config": "workspace:*"
}
```