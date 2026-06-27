# AGENTS.md - TekMemo

## Behavioral Rules

- **Do not** add new npm dependencies without evaluating if an existing package already covers the need
- **Do not** use `console.log` in production code — use structured logging or remove it
- **Do not** commit secrets, API keys, or environment values — use `.env` files that are gitignored
- **Do not** run `pnpm build` during a code-editing session unless you are explicitly validating production correctness
- **Do not** add `prettier` — it has been removed; all formatting goes through Biome
- **Do not** use `@repo/` for public OSS packages — that scope is for internal tooling only
- **Do not** copy-paste tsdown options into new packages — import `pkgConfig` from `@repo/tsdown` instead
- **Do not** create a second `Tekmemo`/`NodeFsMemoryStore` instance on the same `.tekmemo/` root — the local contract is single-process (Q28); a second writer gets a `LockHeldError`. Call `dispose()` to release before handing the root to another process, or pass `lock: false` only when an external coordinator serializes access
- **Connector discipline (ADR 0002)**: connectors run locally; connector ingest writes notes with `source: "connector"`, a stable `sourceRefs[0].sourceId` (the external id), and a content-derived `id` with **no wall-clock** in the hashed bytes (`connectorNoteId` in `@tekbreed/tekmemo-connectors`). Tokens never touch disk or the file replica — only the opaque `secretRef` lives in `.tekmemo/connectors.json`; resolve tokens at run time via the injected `SecretResolver` and keep them in memory only. `.tekmemo/secrets.json` is a dev-only fallback, gitignored, never synced
- **DRY & SSOT everywhere**: Enforce Single Source of Truth and Don't-Repeat-Yourself across the **entire workspace**, including the cloud app. Do not duplicate knowledge, logic, constants, or copy that already lives elsewhere — extract to a shared module, type, or constant and import it. Do not duplicate knowledge in this file that already exists in TekMemo memory

## Pointers

**Always** reference [./.agents/rules/tekmemo-cloud.md](./.agents/rules/tekmemo-cloud.md) for cloud app conventions, style, and architecture rules.

- Workspace rules: [.agents/rules](./.agents/rules)
- Global skills: `~/.agents/skills/`
- MCP config: `opencode.json`

