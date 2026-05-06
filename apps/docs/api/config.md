---
title: Config API
description: Configure local memory, recall, provider adapters, and hosted TypeScript apps.
---

# Config API

TekMemo can be configured with `tekmemo.config.ts`.

## Schema shape

| Key | Type | Description |
| :--- | :--- | :--- |
| `root` | `string` | Memory root directory. Defaults to `.tekmemo`. |
| `recall.keyword` | `boolean` | Enables local keyword recall. |
| `recall.semantic` | `boolean` | Enables vector-backed semantic recall. |
| `sync.enabled` | `boolean` | Enables cloud or adapter sync. |
| `sync.provider` | `string` | Sync provider name. |

## Example

```ts
import { defineTekMemoConfig } from 'tekmemo/config'

export default defineTekMemoConfig({
  root: '.tekmemo',
  recall: {
    keyword: true,
    semantic: false
  },
  sync: {
    enabled: false
  }
})
```

<AdSlot placement="config-api-bottom" />
