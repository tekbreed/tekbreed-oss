## Package Boundaries

Respect the OSS package boundaries:

| Zone | Packages | Rule |
|---|---|---|
| **OSS core** | `@tekbreed/tekmemo`, `@tekbreed/tekmemo-ai-sdk`, `@tekbreed/tekmemo-fs`, `@tekbreed/tekmemo-agentfs` | Must be product-neutral, zero cloud dependencies |
| **Optional OSS** | `@tekbreed/tekmemo-upstash-vector`, `@tekbreed/tekmemo-voyageai`, `@tekbreed/tekmemo-openai`, `@tekbreed/tekmemo-recall`, `@tekbreed/tekmemo-rerank`, `@tekbreed/tekmemo-rerank-voyage`, `@tekbreed/tekmemo-benchmark-kit` | Ship only when stable |
| **Internal tooling** | `@repo/tsdown-config`, `@repo/typescript-config`, `@repo/utils`, `@repo/test-utils` | Never published externally |

Do not introduce cloud-specific dependencies into OSS packages.