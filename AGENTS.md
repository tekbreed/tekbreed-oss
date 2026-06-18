# AGENTS.md - TekBreed OSS

This file is the bootstrap for agents working in this repo.
**All project knowledge lives in TekMemo** — use MCP tools, not this file.

## TekMemo Memory (REQUIRED)

This repo uses TekMemo as its single source of truth for project knowledge.
At the **start of every task**, agents MUST:

1. **Load context** — Search your available tools for TekMemo context/memory tools (e.g. `context`, `recall`, `read_core_memory`, `read_notes_memory`) and call the appropriate one with the task description.
2. **Look up details** — If the initial context is insufficient, use TekMemo recall/search tools to find specific domain knowledge.
3. **Adhere to memory** — Follow any constraints, decisions, and references returned by TekMemo.
4. **Persist new facts** — When new facts, decisions, or constraints are discovered during work, store them via TekMemo remember/write tools so future agents benefit.

TekMemo is the **single source of truth** for project identity, architecture, constraints, and decisions.
This file contains only behavioral rules and pointers — no project facts.

## Behavioral Rules

- **Do not** add new npm dependencies without evaluating if an existing package already covers the need
- **Do not** use `console.log` in production code — use structured logging or remove it
- **Do not** commit secrets, API keys, or environment values — use `.env` files that are gitignored
- **Do not** run `pnpm build` during a code-editing session unless you are explicitly validating production correctness
- **Do not** add `prettier` — it has been removed; all formatting goes through Biome
- **Do not** use `@repo/` for public OSS packages — that scope is for internal tooling only
- **Do not** copy-paste tsdown options into new packages — import `pkgConfig` from `@repo/tsdown-config` instead
- **DRY & SSOT**: Do not duplicate knowledge in this file that already exists in TekMemo memory

## Pointers

- Workspace rules: [.agents/rules](./.agents/rules)
- Global skills: `~/.agents/skills/`
- MCP config: `opencode.json`

