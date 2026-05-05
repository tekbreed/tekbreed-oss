# GEMINI.md — TekMemo Internal

This document serves as the foundational mandate and instructional context for Gemini CLI when working within the `tekmemo-internal` repository.

---

## Project Overview

`tekmemo-internal` is a pnpm monorepo for **TekMemo**, a layered memory runtime for agents and AI applications.

### Core Components
1. **OSS Packages (`packages/`)**:
   - `tekmemo`: The core memory runtime (provider-neutral).
   - `@tekmemo/*`: Official adapters (e.g., `ai-sdk`, `fs`, `openai`, `upstash`, `voyage`).
   - `@repo/*`: Internal workspace tooling (e.g., `tsdown-config`, `typescript-config`, `utils`).
2. **Applications (`apps/`)**:
   - `apps/cloud`: TekMemo Cloud — A React Router v7 SSR application deployed to Cloudflare Workers.
   - `apps/docs`: Documentation site built with VitePress.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Package Manager | `pnpm@9` |
| Build System | Turborepo |
| Language | TypeScript (Strict, ESM) |
| Linter/Formatter | **Biome** (Tabs, Double Quotes) |
| Cloud Framework | React Router v7 (SSR) |
| Cloud Runtime | Cloudflare Workers |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Package Build | `tsdown` (Dual ESM + CJS output) |
| Testing | Vitest (Unit), Playwright (E2E) |

---

## Key Development Commands

Run these from the **repo root**:

```bash
pnpm install                  # Install dependencies
pnpm dev                      # Start all dev servers
pnpm build                    # Build all packages and apps
pnpm typecheck                # Run TypeScript type-checking
pnpm format-and-lint:fix      # Format and lint via Biome (Safe fixes)
pnpm format-and-lint:fix:unsafe # Biome fixes including unsafe ones
pnpm test                     # Run all unit tests
pnpm test:e2e                 # Run Playwright E2E tests
pnpm lint:package             # Validate package exports (publint)
```

---

## Development Conventions & Mandates

### 1. Code Style (Biome)
- **Mandate**: Use Biome for all formatting and linting. **Prettier is not used.**
- **Rules**: Tabs for indentation, double quotes for strings.
- **Action**: Always run `pnpm format-and-lint:fix` before concluding a task.

### 2. TypeScript & Packages
- All packages must be **Strict ESM**.
- Packages must provide **dual ESM + CJS output** using `tsdown`.
- **Naming**:
  - Public OSS: `tekmemo` or `@tekmemo/*`.
  - Internal Tooling: `@repo/*`.
- **Builds**: Use `pkgConfig` from `@repo/tsdown-config` in `tsdown.config.ts`.

### 3. Cloud App Architecture (`apps/cloud`)
- **Routing**: Folder-based "Flat Routes" via `react-router-auto-routes`.
- **Colocation**:
  - `index.tsx`: Main route component.
  - `+loader.server.ts`: Extracted loader logic (if > 5 lines).
  - `+action.server.ts`: Extracted action logic (if > 5 lines).
  - `_layout.tsx`: Route layout.
- **Environment**: Access Cloudflare bindings via `context.cloudflare.env`.

### 4. Architectural Boundaries
- **One-way Dependency**: `apps/cloud` can depend on `packages/*`, but `packages/*` **must never** depend on `apps/cloud`.
- **OSS Neutrality**: Core packages must remain product-neutral and free of cloud-specific logic (auth, billing, etc.).

---

## Testing Requirements

- **Unit Tests**: Mandatory for new logic. Place alongside source: `src/foo.test.ts`.
- **E2E Tests**: Mandatory for major user flows. Located in `apps/cloud/tests/e2e/`.
- **Validation**: Ensure `pnpm test` passes before considering a task complete.

---

## Reference Documents

For deeper architectural context, refer to:
- `AGENTS.md`: Detailed guide for AI agents (contains exhaustive technical specs).
- `docs/00-start-here/documentation-map.md`: Map of all internal documentation.
- `apps/cloud/README.md`: Specific guidance for the Cloud application.
