# `@tekbreed/tekmemo-adapters`

<p align="center">
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-adapters"><img src="https://img.shields.io/npm/v/@tekbreed%2Ftekmemo-adapters?label=@tekbreed/tekmemo-adapters&style=for-the-badge" alt="npm version" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss"><img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" /></a> &nbsp; 
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-adapters"><img src="https://img.shields.io/npm/dm/@tekbreed%2Ftekmemo-adapters?style=for-the-badge" alt="npm downloads" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/tekbreed/oss/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI" /></a> &nbsp; 
  <a href="https://oss.tekbreed.com/tekmemo/"><img src="https://img.shields.io/badge/docs-online-blue?style=for-the-badge" alt="Docs" /></a> &nbsp; 
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
</p>

Convenience package for TekMemo adapter imports.

The core `@tekbreed/tekmemo` package stays provider-neutral and does not depend on AI SDK, vector store, embedding, rerank, or cloud transport packages. `@tekbreed/tekmemo-adapters` is the optional aggregation package for apps that want one install target and predictable adapter import paths.

## Install

```bash
npm install @tekbreed/tekmemo-adapters
```

Install external peers only for the adapter subpaths you use:

```bash
# AgentFS session workspace adapter
npm install @tekbreed/tekmemo-adapters @tekbreed/tekmemo-agentfs tekmemo

# AI SDK tools
npm install @tekbreed/tekmemo-adapters ai tekmemo @tekbreed/tekmemo-fs

# OpenAI embedding adapter
npm install @tekbreed/tekmemo-adapters openai

# Upstash Vector recall adapter
npm install @tekbreed/tekmemo-adapters @upstash/vector
```

VoyageAI adapters use HTTP/fetch and do not require a provider SDK package.

## Usage

Import implementation APIs from subpaths:

```ts
import { createTekMemoAgentSession } from "@tekbreed/tekmemo-adapters/agentfs";
import { defineTekMemoTools } from "@tekbreed/tekmemo-adapters/ai-sdk";
import { createVoyageEmbedder } from "@tekbreed/tekmemo-adapters/voyageai";
import { createOpenAIEmbedder } from "@tekbreed/tekmemo-adapters/openai";
import { createUpstashRecallStore } from "@tekbreed/tekmemo-adapters/upstash-vector";
import { createVoyageReranker } from "@tekbreed/tekmemo-adapters/rerank-voyage";
import { createTekMemoCloudClient } from "@tekbreed/tekmemo-adapters/cloud-client";
```

The root import is metadata-only:

```ts
import { adapterImportPaths, tekMemoAdapters } from "@tekbreed/tekmemo-adapters";
```

This design prevents the root import from loading optional peer dependencies such as `ai`, `openai`, or `@upstash/vector`.

## Reexported subpaths

| Import path | Reexports |
| --- | --- |
| `@tekbreed/tekmemo-adapters/agentfs` | `@tekbreed/tekmemo-agentfs` |
| `@tekbreed/tekmemo-adapters/ai-sdk` | `@tekbreed/tekmemo-ai-sdk` |
| `@tekbreed/tekmemo-adapters/cloud-client` | `@tekbreed/tekmemo-cloud-client` |
| `@tekbreed/tekmemo-adapters/openai` | `@tekbreed/tekmemo-openai` |
| `@tekbreed/tekmemo-adapters/openai/testing` | `@tekbreed/tekmemo-openai/testing` |
| `@tekbreed/tekmemo-adapters/upstash-vector` | `@tekbreed/tekmemo-upstash-vector` |
| `@tekbreed/tekmemo-adapters/voyageai` | `@tekbreed/tekmemo-voyageai` |
| `@tekbreed/tekmemo-adapters/voyageai/testing` | `@tekbreed/tekmemo-voyageai/testing` |
| `@tekbreed/tekmemo-adapters/rerank-voyage` | `@tekbreed/tekmemo-rerank-voyage` |
| `@tekbreed/tekmemo-adapters/rerank-voyage/testing` | `@tekbreed/tekmemo-rerank-voyage/testing` |

## Package boundary

`@tekbreed/tekmemo-adapters` depends on first-party adapter packages. The core `@tekbreed/tekmemo` package does not depend on `@tekbreed/tekmemo-adapters`.
