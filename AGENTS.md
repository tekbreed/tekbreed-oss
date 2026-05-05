# AGENTS.md — TekMemo Internal

This file provides guidance for AI coding agents (e.g. Codex, Copilot, Antigravity, Claude) working inside this monorepo. Read this before touching any code.

---

## What This Repository Is

`tekmemo-internal` is the private monorepo for **TekMemo** — a **layered memory runtime for agents and AI applications**.

The monorepo is organized around two product surfaces:

1. **Open-source packages** — the file-first memory runtime and its adapters
2. **Slides app** — presentation materials for TekMemo (`apps/slides`)

---

## Monorepo Structure

```
tekmemo-internal/
├── .github/
│   └── workflows/          # (playwright.yml removed — cloud app moved out)
├── apps/
│   ├── slides/                 # TekMemo Slides — Slidev presentation app
│   │   ├── slides.md           # Main slide deck
│   │   ├── components/         # Vue components for slides
│   │   ├── pages/              # Additional slide pages
│   │   └── package.json
│   └── docs/                   # Documentation app
├── packages/
│   ├── tekmemo/                # tekmemo — core memory model, document types, patching
│   ├── ai-sdk/                 # @tekmemo/ai-sdk — Vercel AI SDK integration
│   ├── fs/                     # @tekmemo/fs — local filesystem adapter
│   ├── agentfs/                # @tekmemo/agentfs — AgentFS adapter
│   ├── openai/                 # @tekmemo/openai — OpenAI embedding adapter
│   ├── upstash/                # @tekmemo/upstash — Upstash vector adapter
│   ├── voyage/                 # @tekmemo/voyage — Voyage AI embedding adapter
│   ├── recall/                 # @tekmemo/recall — semantic recall memory
│   ├── rerank/                 # @tekmemo/rerank — reranking adapter
│   ├── rerank-voyage/          # @tekmemo/rerank-voyage — Voyage reranking adapter
│   ├── benchmark-kit/          # @tekmemo/benchmark-kit — benchmarking tools
│   ├── test-utils/             # @tekmemo/test-utils — testing utilities
│   ├── tsdown-config/          # @repo/tsdown-config — shared tsdown base
│   ├── typescript-config/      # @repo/typescript-config — shared tsconfig bases
│   └── utils/                  # @repo/utils — shared utility helpers
├── biome.json                  # Linting + formatting (Biome)
├── turbo.json                  # Turborepo pipeline config
└── pnpm-workspace.yaml         # PNPM workspace configuration
```

> **Note:** `design/` and `docs/` are listed in `.gitignore` — they are local-only and never committed.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Package manager | `pnpm@9` |
| Build orchestration | Turborepo |
| Language | TypeScript (strict, ESM) |
| Package build tool | `tsdown` (dual ESM + CJS output) |
| Linter / Formatter | Biome (tabs, double quotes) |
| Package validation | `publint` |
| Schema validation | `zod` |
| Slides app | Slidev + Vue 3 |
| Unit testing | Vitest |
| Node requirement | `>=22` |

---

## Package Naming Convention

This repo uses **two namespace conventions** — keep them separate:

| Package directory | Published name | Scope |
|---|---|---|
| `packages/tekmemo` | `tekmemo` | none — the OSS core package |
| `packages/ai-sdk` | `@tekmemo/ai-sdk` | `@tekmemo` — public OSS adapters/integrations |
| `packages/fs` | `@tekmemo/fs` | `@tekmemo` |
| `packages/agentfs` | `@tekmemo/agentfs` | `@tekmemo` |
| `packages/openai` | `@tekmemo/openai` | `@tekmemo` |
| `packages/upstash` | `@tekmemo/upstash` | `@tekmemo` |
| `packages/voyage` | `@tekmemo/voyage` | `@tekmemo` |
| `packages/recall` | `@tekmemo/recall` | `@tekmemo` |
| `packages/rerank` | `@tekmemo/rerank` | `@tekmemo` |
| `packages/rerank-voyage` | `@tekmemo/rerank-voyage` | `@tekmemo` |
| `packages/benchmark-kit` | `@tekmemo/benchmark-kit` | `@tekmemo` |
| `packages/test-utils` | `@tekmemo/test-utils` | `@tekmemo` |
| `packages/tsdown-config` | `@repo/tsdown-config` | `@repo` — internal tooling only |
| `packages/typescript-config` | `@repo/typescript-config` | `@repo` — internal tooling only |
| `packages/utils` | `@repo/utils` | `@repo` — internal tooling only |

**Rule:** Public OSS packages → `tekmemo` or `@tekmemo/*`. Internal workspace tooling only → `@repo/*`. Never mix them.

When referencing internal tooling in `devDependencies`, use `"workspace:*"`:

```json
"devDependencies": {
  "@repo/typescript-config": "workspace:*"
}
```

---

## Core Concepts

Before writing any code, understand these memory layers:

| Layer | File | Purpose |
|---|---|---|
| **Core Memory** | `core.md` | Compact, always-relevant canonical truth |
| **Archival Memory** | `notes.md` | Durable notes, summaries, long-form archival |
| **Recall Memory** | `conversations.jsonl` | Indexed fragments for semantic retrieval |
| **Sync State** | Runtime metadata | Whether memory is synced, stale, or queued |
| **Restore Points** | Snapshots | Versioned checkpoints for history and rollback |

Memory is **project-scoped**, **user-scoped**, or **session-scoped**. Never mix scope levels without explicit intent.

---

## Development Commands

Run all commands from the **repo root** unless otherwise specified.

```bash
# Install dependencies
pnpm install

# Start all dev servers (via Turborepo)
pnpm dev

# Build all packages and apps
pnpm build

# Build and watch all packages (persistent)
pnpm build:watch

# Type-check everything
pnpm typecheck

# Format and lint (check only)
pnpm format-and-lint

# Format and lint (auto-fix safe changes)
pnpm format-and-lint:fix

# Format and lint (auto-fix including unsafe changes)
pnpm format-and-lint:fix:unsafe

# Run all unit tests (single pass)
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Validate package exports with publint
pnpm lint:package
```

### Slides app only (`apps/slides`)

```bash
cd apps/slides

# Start Slidev dev server (localhost:3030)
pnpm dev

# Build static slides
pnpm build

# Export slides to PDF/HTML
pnpm export
```

### Package scripts (e.g. `packages/tekmemo`)

```bash
cd packages/tekmemo

# Build (tsdown — dual ESM + CJS)
pnpm build

# Build in watch mode
pnpm build:watch

# Run unit tests (Vitest, watch mode)
pnpm test

# Run unit tests once
pnpm test:run

# Validate package exports
pnpm lint:package
```

---

## Code Style Rules

These are enforced by Biome — do not fight them:

- **Indentation**: tabs (not spaces)
- **Quotes**: double quotes (`"`) in JavaScript/TypeScript
- **Imports**: auto-organized by Biome assist
- **Trailing commas**: yes
- **Semicolons**: yes
- **JSDoc**: Every function, React component, file, and `useEffect` hook MUST be properly documented using JSDoc. Documentation should explain the purpose, parameters, return types, and any side effects or constraints.

Run `pnpm format-and-lint:fix` before committing. If Biome raises a lint error, fix it — do not suppress it unless there is a strong, documented reason.

> ⚠️ **Important:** `prettier` has been removed from this project. Do not add it back. Use `pnpm format-and-lint:fix` (Biome) for all formatting.

---

## TypeScript Rules

- All packages use **strict TypeScript ESM**
- The shared base config is `@repo/typescript-config/base.json` — extend it in every package's `tsconfig.json`
- Do not use `any` unless explicitly required and documented
- Prefer `unknown` over `any` for untrusted external data
- All public package exports must have explicit return types
- Do not use `// @ts-ignore` — fix the type instead
- Target: `ES2022`, module resolution: `bundler`

---

## Testing Requirements

- **Unit Tests**: Mandatory for every new feature and logic-heavy component. Place alongside source: `src/foo.test.ts`.
- **Coverage**: Aim for high test coverage on core packages (`tekmemo`, `recall`, etc.).
- **Validation**: Ensure `pnpm test` passes before considering a task complete.

---

## Package Build Rules (`tsdown`)

OSS packages use `tsdown` for building, **not** `tsc` alone.

### Shared config — always use the factory, never copy-paste options

The base build options live in `@repo/tsdown-config`. Every package's `tsdown.config.ts` **must** import from there:

```ts
// packages/<name>/tsdown.config.ts
import { pkgConfig } from "@repo/tsdown-config";

export default pkgConfig({ entry: "src/index.ts" });
```

Only override what genuinely differs for that package (e.g. a different `entry` or `platform`). Do not duplicate `format`, `sourcemap`, `minify`, `target`, or `platform` unless you have a specific reason to deviate from the base.

The base options that `pkgConfig` applies by default:

| Option | Value |
|---|---|
| `format` | `["esm", "cjs"]` |
| `sourcemap` | `true` |
| `minify` | `false` |
| `target` | `"node20"` |
| `platform` | `"node"` |
| `dts` | `true` |
| `clean` | `true` |
| `fixedExtension` | `true` |

### Export map

All packages must ship a dual ESM + CJS build. The `package.json` export map must always specify all three fields:

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

Run `pnpm lint:package` (via `publint`) to validate the export map before opening a PR.

---

## Package Boundaries

Respect the OSS package boundaries:

| Zone | Packages | Rule |
|---|---|---|
| **OSS core** | `tekmemo`, `@tekmemo/ai-sdk`, `@tekmemo/fs`, `@tekmemo/agentfs` | Must be product-neutral, zero cloud dependencies |
| **Optional OSS** | `@tekmemo/upstash`, `@tekmemo/voyage`, `@tekmemo/openai`, `@tekmemo/recall`, `@tekmemo/rerank`, `@tekmemo/rerank-voyage`, `@tekmemo/benchmark-kit` | Ship only when stable |
| **Internal tooling** | `@repo/tsdown-config`, `@repo/typescript-config`, `@repo/utils`, `@tekmemo/test-utils` | Never published externally |

Do not introduce cloud-specific dependencies into OSS packages.

---

## Adding a New Package

1. Create the directory under `packages/<name>/`
2. Add a `package.json` — name it `@tekmemo/<name>` for a public OSS package, or `@repo/<name>` for internal tooling only. Set `"type": "module"`.
3. Add a `tsconfig.json` extending `@repo/typescript-config/base.json`
4. Add a `tsdown.config.ts` using the shared factory:
   ```ts
   import { pkgConfig } from "@repo/tsdown-config";
   export default pkgConfig({ entry: "src/index.ts" });
   ```
5. Add the standard scripts: `build`, `build:watch`, `test`, `test:run`, `lint:package`
6. Add `@repo/typescript-config` and `@repo/tsdown-config` to `devDependencies`
7. Run `pnpm install` from the root

Do not add a new package unless it has a clear, single responsibility.

---

## Testing

- Unit tests are **mandatory** for every feature that requires them.
- Unit tests live alongside the source file as `<file>.test.ts`.
- Use `vitest` for all unit tests.
- Run from root: `pnpm test` (single pass) or `pnpm test:watch` (watch).
- Run from package: `pnpm test:run` (single pass) or `pnpm test` (watch).

---

## CI / GitHub Actions

Currently, no active CI workflows are configured. The previous Playwright E2E workflow (`.github/workflows/playwright.yml`) was used for the cloud app, which has been moved out of the monorepo.

---

## What Agents Should Avoid

- **Do not** add new npm dependencies without evaluating if an existing package already covers the need
- **Do not** add cloud-specific logic (auth, billing, sync) into any OSS package
- **Do not** use `console.log` in production code — use structured logging or remove it
- **Do not** commit secrets, API keys, or environment values — use `.env` files that are gitignored
- **Do not** run `pnpm build` during a code-editing session unless you are explicitly validating production correctness
- **Do not** add `prettier` — it has been removed; all formatting goes through Biome
- **Do not** use `@repo/` for public OSS packages — that scope is for internal tooling (`utils`, `tsdown-config`, `typescript-config`) only
- **Do not** copy-paste tsdown options into new packages — import `pkgConfig` from `@repo/tsdown-config` instead

---

## Git Conventions

- Branch naming: `feat/<short-description>`, `fix/<short-description>`, `chore/<short-description>`
- Commit messages: imperative mood, present tense (`add memory patch utility`, not `added...`)
- Do not commit directly to `main` — open a PR
- Keep PRs focused: one feature or fix per PR

---

## Key Internal Documents

These documents in `/docs` contain the product vision and should be read before making large architectural decisions. Note: `docs/` is gitignored — it is local only.

| File | Contents |
|---|---|
| `docs/design.md` | Full Figma design brief — UI direction for all 14 screens |
| `docs/90-day-plan.md` | 90-day execution roadmap — OSS launch strategy |
| `docs/OSS-guide.md` | Open-source contribution guide |
| `docs/tekmemo-day-1-bootstrap-guide.md` | Day 1 bootstrap guide — target structure and prerequisites |

---

## Quick Reference

```bash
# Install
pnpm install

# Dev
pnpm dev

# Format and lint (fix) before committing
pnpm format-and-lint:fix

# Type-check before opening a PR
pnpm typecheck

# Run all unit tests
pnpm test

# Validate package exports
pnpm lint:package
```
