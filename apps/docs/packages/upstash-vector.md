---
title: Upstash Vector Adapter
description: Use @tekmemo/upstash-vector for BYO semantic recall.
---

# `@tekmemo/upstash-vector`

Use this package when you want TekMemo memory chunks stored in Upstash Vector.

## Install

```sh
npm install @tekmemo/upstash-vector
```

## Important

This package does not generate embeddings. Pair it with `@tekmemo/openai`, `@tekmemo/voyageai`, or your own embedder.

## Typical stack

```txt
tekmemo
+ @tekmemo/fs
+ @tekmemo/openai or @tekmemo/voyageai
+ @tekmemo/upstash-vector
```

Use this for semantic recall when you bring your own provider credentials.
