# @repo/tsdown-config

Shared `tsdown` configuration for the **TekMemo** monorepo.

> [!IMPORTANT]
> This is an internal-only package.

## Usage

In any package's `tsdown.config.ts`:

```typescript
import { pkgConfig } from "@repo/tsdown-config";

export default pkgConfig({ entry: "src/index.ts" });
```
