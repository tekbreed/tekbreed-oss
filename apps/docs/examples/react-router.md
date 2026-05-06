---
title: React Router v7 Example
description: Use TekMemo in React Router loaders, actions, and Cloudflare deployments.
---

# React Router v7 Example

React Router actions are a natural place to update memory after important user actions.

```ts
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const note = String(formData.get('note') ?? '')

  await appendTimestampedNote(store, {
    timestamp: new Date().toISOString(),
    kind: 'note',
    content: note
  })

  return { ok: true }
}
```

## Recommended pattern

Keep route files thin. Put memory operations in services that can be tested without React Router.

<AdSlot placement="react-router-example-bottom" />
