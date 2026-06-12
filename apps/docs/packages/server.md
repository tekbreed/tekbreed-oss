# @tekbreed/tekmemo-server

`@tekbreed/tekmemo-server` is the Hono-based API layer for self-hosted TekMemo memory servers.

## Root import

Use the root import for runtime-neutral app construction:

```ts
import { createTekMemoServer } from "@tekbreed/tekmemo-server";
```

The root import avoids Node-only dependencies so Cloudflare Workers can use the shared Hono app.

## Node import

Use the Node subpath for Node/Docker/Railway/Fly deployments:

```ts
import {
	createNodeTekMemoObjectStore,
	createNodeTekMemoQueue,
	createNodeTekMemoStore,
} from "@tekbreed/tekmemo-server/node";
```

The Node runtime supports:

- Postgres memory persistence.
- `pgvector` extension-ready schema.
- Postgres-backed job queue.
- S3-compatible object storage.
- Local filesystem object storage for development.

## Self-hosting with Node

The recommended Node deployment target is `apps/self-host-node` in the [TekMemo repository](https://github.com/tekbreed/oss).

It runs as one API process plus one worker process:

```bash
# API server
npm run server

# Background worker
npm run worker
```

This works with Railway, Fly.io, Render, Coolify, Northflank, and similar hosts.

## Self-hosting with Docker Compose

`apps/self-host-docker` provides a Docker Compose setup that starts:

- `tekmemo-api`
- `tekmemo-worker`
- `postgres` with pgvector
- `minio` for S3-compatible object storage

```bash
cp .env.example .env
docker compose up --build
```

## Connecting a client

Use `@tekbreed/tekmemo-cloud-client` against your self-hosted base URL:

```ts
import { createTekMemoCloudClient } from "@tekbreed/tekmemo-cloud-client";

const client = createTekMemoCloudClient({
	baseUrl: "http://localhost:8787/api/v1",
	apiKey: process.env.TEKMEMO_API_KEY,
	defaultProjectId: "default",
});
```
