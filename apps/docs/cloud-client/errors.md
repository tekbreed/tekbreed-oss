# Cloud client errors

`@tekbreed/tekmemo-cloud-client` should expose typed errors for auth, validation, rate limits, network failures, and server errors.

```ts
import { isTekMemoCloudError } from "@tekbreed/tekmemo-cloud-client";

try {
  await client.memory.readCore();
} catch (error) {
  if (isTekMemoCloudError(error)) {
    console.error(error.code, error.status);
  }
}
```

Error messages should redact common secret patterns such as `tk_live_...`, `Bearer ...`, and provider keys.
