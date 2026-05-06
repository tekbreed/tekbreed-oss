---
title: Package Boundaries
description: How TekMemo packages stay small, testable, and provider-agnostic.
---

# Package Boundaries

TekMemo should stay modular so developers can adopt only what they need.

## Rule

The core runtime defines contracts. Adapter packages implement those contracts.

```txt
tekmemo
  -> contracts and memory logic
@tekmemo/fs
  -> local filesystem store
@tekmemo/ai-sdk
  -> AI SDK integration
@tekmemo/upstash-vector
  -> vector store adapter
@tekmemo/openai and @tekmemo/voyageai
  -> embedding adapters
```

## Why this matters

Clean boundaries make the product easier to test, document, price, and support.

<AdSlot placement="package-boundaries-bottom" />
