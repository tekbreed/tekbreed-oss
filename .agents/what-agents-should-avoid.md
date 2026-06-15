## What Agents Should Avoid

- **Do not** add new npm dependencies without evaluating if an existing package already covers the need
- **Do not** add cloud-specific logic (auth, billing, sync) into any OSS package
- **Do not** use `console.log` in production code — use structured logging or remove it
- **Do not** commit secrets, API keys, or environment values — use `.env` files that are gitignored
- **Do not** run `pnpm build` during a code-editing session unless you are explicitly validating production correctness
- **Do not** add `prettier` — it has been removed; all formatting goes through Biome
- **Do not** use `@repo/` for public OSS packages — that scope is for internal tooling (`utils`, `tsdown-config`, `typescript-config`) only
- **Do not** copy-paste tsdown options into new packages — import `pkgConfig` from `@repo/tsdown-config` instead