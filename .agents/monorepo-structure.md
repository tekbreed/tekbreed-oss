## Monorepo Structure

```
tekbreed-oss/
├── .github/
│   └── workflows/
├── apps/
│   ├── docs/                   # TekBreed OSS docs site, with TekMemo as the first project
│   ├── self-host-cloudflare/   # TekMemo self-host Cloudflare Worker app
│   ├── self-host-docker/       # TekMemo Docker self-hosting helpers
│   └── self-host-node/         # TekMemo Node self-host app
├── benchmarks/                 # TekMemo benchmark runners
├── examples/                   # Runnable TekMemo examples
├── packages/
│   ├── tekmemo/                # @tekbreed/tekmemo - core memory model, document types, patching
│   ├── ai-sdk/                 # @tekbreed/tekmemo-ai-sdk - Vercel AI SDK integration
│   ├── fs/                     # @tekbreed/tekmemo-fs - local filesystem adapter
│   ├── agentfs/                # @tekbreed/tekmemo-agentfs - AgentFS adapter
│   ├── openai/                 # @tekbreed/tekmemo-openai - OpenAI embedding adapter
│   ├── upstash-vector/         # @tekbreed/tekmemo-upstash-vector - Upstash vector adapter
│   ├── voyageai/               # @tekbreed/tekmemo-voyageai - Voyage AI embedding adapter
│   ├── recall/                 # @tekbreed/tekmemo-recall — semantic recall memory
│   ├── rerank/                 # @tekbreed/tekmemo-rerank — reranking adapter
│   ├── rerank-voyage/          # @tekbreed/tekmemo-rerank-voyage — Voyage reranking adapter
│   ├── benchmark-kit/          # @tekbreed/tekmemo-benchmark-kit — benchmarking tools
│   ├── cli/                    # @tekbreed/tekmemo-cli - CLI package; preserves tekmemo binary
│   ├── mcp-server/             # @tekbreed/tekmemo-mcp-server
│   ├── server/                 # @tekbreed/tekmemo-server
│   └── cloud-client/           # @tekbreed/tekmemo-cloud-client
├── projects/
│   └── tekmemo/                # TekMemo roadmap, architecture, strategy, and planning docs
├── tooling/
│   ├── test-utils/             # @repo/test-utils - testing utilities
│   ├── tsdown-config/          # @repo/tsdown-config - shared tsdown base
│   ├── typescript-config/      # @repo/typescript-config - shared tsconfig bases
│   └── utils/                  # @repo/utils - shared utility helpers
├── biome.json                  # Linting + formatting (Biome)
├── turbo.json                  # Turborepo pipeline config
└── pnpm-workspace.yaml         # PNPM workspace configuration
```