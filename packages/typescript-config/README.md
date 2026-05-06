# @repo/typescript-config

Shared TypeScript configurations for the **TekMemo** monorepo.

> [!IMPORTANT]
> This is an internal-only package.

## Usage

In any package's `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```
