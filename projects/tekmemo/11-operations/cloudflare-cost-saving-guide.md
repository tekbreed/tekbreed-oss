# Cloudflare Cost-Saving Guide

## Use heavily

### Workers

Use for:

- React Router v7 app
- `/api/v1/*`
- request routing
- API key validation
- quota checks

### Queues

Use for:

- indexing jobs
- webhook delivery
- usage rollups
- restore/export jobs

### R2

Use for:

- snapshots
- restore bundles
- exports
- uploaded artifacts later

### Turnstile

Use for:

- signups
- API key creation
- beta intake/contact forms

### Durable Objects

Use for:

- locks
- rate-limit buckets
- quota coordination
- idempotency keys

### KV

Use for:

- feature flags
- cached plan metadata
- public config

---

## Ignore for now

Do not introduce these into the core path early:

- D1 as primary product DB if Turso is source of truth
- Stream
- Images as a required product dependency
- Browser rendering automation
- extra event buses
- multiple backend apps

---

## Stack rule

```txt
Cloudflare = runtime, async, object storage, cache, coordination, abuse protection
Turso = durable relational source of truth
Upstash = default vector recall
Voyage/OpenAI = embeddings/rerank adapters
```
