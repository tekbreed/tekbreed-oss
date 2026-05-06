---
title: Vercel Hosting
description: Host TekMemo-backed TypeScript apps on Vercel.
---

# Vercel

Use Vercel for TekMemo-backed Next.js, React Router, or API route deployments.

## Checklist

| Concern | Recommendation |
| :--- | :--- |
| Runtime | Use packages that are compatible with the selected Node or edge runtime. |
| Persistence | Do not rely on serverless temp storage for durable memory. |
| Secrets | Store provider keys in Vercel environment variables. |
| Recall | Use hosted vector and embedding providers when semantic recall is needed. |

For local development, use `@tekmemo/fs`. For production, choose storage that persists across deployments and function instances.
