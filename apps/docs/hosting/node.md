---
title: Node Hosting
description: Host TekMemo-backed TypeScript apps in durable Node environments.
---

# Node Servers

Node servers are the most direct production environment for file-first TekMemo stores.

Use this path for Express, Hono on Node, background workers, CLIs, queues, and long-running agents.

## Checklist

| Concern | Recommendation |
| :--- | :--- |
| Node version | Use Node 22 or newer. |
| Storage | Mount a durable volume for `.tekmemo/` state. |
| Backups | Back up memory files with the same care as application data. |
| Permissions | Limit filesystem access to the app's memory directory. |
| Observability | Track memory writes, recall latency, and provider errors. |
