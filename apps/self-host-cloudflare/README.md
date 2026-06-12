# TekMemo Cloudflare self-host

This template runs the Hono-based `@tekbreed/tekmemo-server` package on Cloudflare Workers.

```bash
cp .dev.vars.example .dev.vars
pnpm dev
```

Then use `@tekbreed/tekmemo-cloud-client` with your deployed Worker URL plus `/api/v1`.

The current template uses the in-memory store as the first runnable slice. Replace it with the D1/R2/Queues-backed store when Cloudflare storage adapters are added.
