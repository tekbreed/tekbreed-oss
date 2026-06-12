# @tekbreed/tekmemo-server

<p align="center">
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-server"><img src="https://img.shields.io/npm/v/@tekbreed%2Ftekmemo-server?label=@tekbreed/tekmemo-server&style=for-the-badge" alt="npm version" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss"><img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" /></a> &nbsp; 
  <a href="https://www.npmjs.com/package/@tekbreed/tekmemo-server"><img src="https://img.shields.io/npm/dm/@tekbreed%2Ftekmemo-server?style=for-the-badge" alt="npm downloads" /></a> &nbsp; 
  <a href="https://github.com/tekbreed/oss/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/tekbreed/oss/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI" /></a> &nbsp; 
  <a href="https://oss.tekbreed.com/tekmemo/"><img src="https://img.shields.io/badge/docs-online-blue?style=for-the-badge" alt="Docs" /></a> &nbsp; 
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
</p>

Hono-based TekMemo memory server for self-hosted deployments.

The package contains the runtime-neutral API layer used by the Docker and Cloudflare self-host templates. It is intentionally separate from TekMemo Cloud billing, marketing, CMS, and SaaS-only features.

```ts
import { createInMemoryTekMemoServer } from "@tekbreed/tekmemo-server";

const app = createInMemoryTekMemoServer();
```

Use this package when you want to expose a TekMemo-compatible `/api/v1` HTTP API that works with `@tekbreed/tekmemo-cloud-client`.
