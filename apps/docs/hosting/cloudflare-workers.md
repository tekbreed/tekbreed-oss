---
title: Cloudflare Workers Hosting
description: Host TekMemo-backed TypeScript apps on Cloudflare Workers.
---

# Cloudflare Workers

Cloudflare Workers are a good fit for lightweight memory APIs and agent endpoints when your storage and provider choices support the edge runtime.

## Checklist

| Concern | Recommendation |
| :--- | :--- |
| Filesystem | Workers do not provide a durable local filesystem. |
| Storage | Use Workers-compatible durable storage for memory state. |
| Providers | Confirm embedding, vector, and reranking clients work in Workers. |
| Secrets | Use Worker secrets for provider keys. |

Start with the [Cloudflare Workers example](/examples/cloudflare-workers) when wiring an edge route.
