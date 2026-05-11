# TekMemo self-host Node runtime

This app is the portable Node.js deployment target for the TekMemo memory server. Use it for Dockerfile-based hosts such as Railway, Fly.io, Render, Coolify, Northflank, and custom VPS deployments.

It runs the shared Hono app from `@tekmemo/server` and uses:

- Postgres for projects, core memory, notes, and the default job queue.
- `pgvector` extension-ready schema for future vector indexing.
- S3-compatible object storage for production Node deployments.
- The same `/api/v1` contract as TekMemo Cloud.

Run locally:

```bash
cp apps/self-host-node/.env.example apps/self-host-node/.env
pnpm --filter @tekmemo/self-host-node migrate
pnpm --filter @tekmemo/self-host-node dev
```

For Railway/Fly-style hosts, deploy the Dockerfile once and run two processes from the same image:

```bash
pnpm --filter @tekmemo/self-host-node server
pnpm --filter @tekmemo/self-host-node worker
```
