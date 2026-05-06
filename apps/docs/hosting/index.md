---
title: Hosting
description: Host TekMemo-backed TypeScript applications.
---

# Hosting

TekMemo runs inside your TypeScript application. The docs focus on hosting the app that uses TekMemo, not a separate hosted TekMemo cloud service.

## Supported paths

| Host | Use when |
| :--- | :--- |
| [Vercel](/hosting/vercel) | Your app uses Next.js, React Router, or serverless functions. |
| [Cloudflare Workers](/hosting/cloudflare-workers) | You want edge runtime deployment and compatible storage bindings. |
| [Node Servers](/hosting/node) | You run Express, Hono, workers, queues, or long-lived agents on a server. |

## Storage note

Local filesystem memory works best in development and durable Node environments. Serverless and edge deployments should use durable storage intentionally rather than assuming an ephemeral filesystem will persist memory.
