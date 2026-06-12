# `@tekbreed/tekmemo-benchmark-kit`

<p align="center">
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-benchmark-kit"><img src="https://img.shields.io/npm/v/@tekbreed%2Ftekmemo-benchmark-kit?label=@tekbreed/tekmemo-benchmark-kit&style=for-the-badge" alt="npm version" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss"><img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" /></a> &nbsp; 
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-benchmark-kit"><img src="https://img.shields.io/npm/dm/@tekbreed%2Ftekmemo-benchmark-kit?style=for-the-badge" alt="npm downloads" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/tekbreed/oss/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI" /></a> &nbsp; 
  <a href="https://oss.tekbreed.com/tekmemo/"><img src="https://img.shields.io/badge/docs-online-blue?style=for-the-badge" alt="Docs" /></a> &nbsp; 
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
</p>

## Purpose

**Benchmark kit.** Provider-neutral benchmarking toolkit for package, provider, recall, and rerank performance tests.

## Install

```bash
npm install @tekbreed/tekmemo-benchmark-kit
```

## Quick start

```ts
import { createBenchmarkSuite } from "@tekbreed/tekmemo-benchmark-kit";

const suite = createBenchmarkSuite({ name: "recall-smoke" });
```

## Boundary

This package owns its package-level contract only. It does not own TekMemo Cloud billing, dashboards, tenancy, hosted database storage, or provider secrets unless explicitly stated by its package name.

For hosted memory, use `@tekbreed/tekmemo-cloud-client`. For local file-backed memory, use `@tekbreed/tekmemo` with `@tekbreed/tekmemo-fs`. For MCP tools, use `@tekbreed/tekmemo-mcp-server`.

## License

MIT.
