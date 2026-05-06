---
title: Cloudflare Workers Example
description: Use TekMemo in Cloudflare Worker-based apps and APIs.
---

# Cloudflare Workers Example

Cloudflare Workers are a good fit for lightweight memory-enabled TypeScript endpoints when your storage and provider choices support the Workers runtime.

```ts
export default {
  async fetch(request: Request, env: Env) {
    const response = await fetch("https://memo.tekbreed.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${env.TEKMEMO_API_KEY}`
      }
    })

    return Response.json(await response.json())
  }
}
```

## Recommended use

Use Workers for cloud-hosted project memory, recall APIs, and tenant-aware request routing. Use local file memory during development.

<AdSlot placement="workers-example-bottom" />
