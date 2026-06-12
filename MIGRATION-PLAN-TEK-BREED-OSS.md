# TekBreed OSS Repository Migration Plan

This document outlines the phased approach to migrate the repository to the TekBreed OSS umbrella monorepo structure while keeping TekMemo as the first product family.

## Overview
Rework the repository into a TekBreed OSS umbrella monorepo while keeping TekMemo as the first product family. This migration will:
- Rename packages/imports to `@tekbreed/*`
- Move internal tooling out of `packages/`
- Make docs umbrella-oriented
- Preserve existing package boundaries
- NOT merge adapters into `@tekbreed/tekmemo/*` subpaths yet (follow-up work)

## Phase 1: Internal Tooling Isolation
**Goal**: Move private tooling to `tooling/` without breaking workspace

### Steps:
1. Move internal packages from `packages/` to `tooling/`:
   - `packages/typescript-config` → `tooling/typescript-config`
   - `packages/tsdown-config` → `tooling/tsdown-config`
   - `packages/test-utils` → `tooling/test-utils`
   - `packages/utils` → `tooling/utils`
   - `packages/changelog-generator` → `tooling/changelog-generator`
2. Update `pnpm-workspace.yaml` to include `tooling/*`
3. Update root scripts, Turbo filters, and any path assumptions referencing these packages
4. Verify internal tooling still accessible via `@repo/*` (e.g., `@repo/typescript-config`)

### Validation Checkpoints:
- `pnpm install` succeeds
- Internal tooling still accessible via `@repo/*`
- No broken imports in remaining packages
- All affected packages can still build/test

## Phase 2: Public Package Renaming (Dependency-Ordered Batches)
**Goal**: Rename `@tekmemo/*` → `@tekbreed/*` batches to minimize breakage

### Strategy: Rename leaf packages first (no dependents), then work upward

#### Batch 1: Leaf Packages (no dependents)
- `tekmemo-benchmark-kit` → `@tekbreed/tekmemo-benchmark-kit`
- `tekmemo-upstash-vector` → `@tekbreed/tekmemo-upstash-vector`
- `tekmemo-voyageai` → `@tekbreed/tekmemo-voyageai`
- `tekmemo-openai` → `@tekbreed/tekmemo-openai`
- `tekmemo-recall` → `@tekbreed/tekmemo-recall`
- `tekmemo-rerank` → `@tekbreed/tekmemo-rerank`
- `tekmemo-rerank-voyage` → `@tekbreed/tekmemo-rerank-voyage`

#### Batch 2: Middleware Packages
- `tekmemo-fs` → `@tekbreed/tekmemo-fs`
- `tekmemo-agentfs` → `@tekbreed/tekmemo-agentfs`
- `tekmemo-ai-sdk` → `@tekbreed/tekmemo-ai-sdk`
- `tekmemo-graph` → `@tekbreed/tekmemo-graph`
- `tekmemo-mcp-server` → `@tekbreed/tekmemo-mcp-server`
- `tekmemo-cli` → `@tekbreed/tekmemo-cli`

#### Batch 3: Core Packages
- `tekmemo` → `@tekbreed/tekmemo`
- `tekmemo-adapters` → `@tekbreed/tekmemo-adapters`
- `tekmemo-server` → `@tekbreed/tekmemo-server`
- `tekmemo-cloud-client` → `@tekbreed/tekmemo-cloud-client`

#### Batch 4: Apps/Examples
- Apps/examples to be renamed to `@tekbreed/*` (specific names TBD based on current naming)

### For Each Batch:
1. Update `package.json` name field to `@tekbreed/*`
2. Update dependencies in ALL packages referencing renamed packages
3. Update import statements in source code (`from "tekmemo/..."` → `from "@tekbreed/tekmemo/..."`)
4. Update exports in `package.json` if needed
5. Update any references in bin fields, etc.

### Validation Checkpoints (After Each Batch):
- `pnpm install` succeeds
- Batch packages build: `pnpm --filter @tekbreed/<name> build`
- Direct dependents of batch packages still build/test
- No broken imports found via `grep -r "old-package-name" --exclude-dir=node_modules .`

## Phase 3: Import & Reference Sweep
**Goal**: Fix all remaining references across repo

### Steps:
1. Update all source imports (`from "tekmemo/..."` → `from "@tekbreed/tekmemo/..."`)
2. Update dynamic imports/requires
3. Update benchmark scripts, examples, ChangeSets config
4. Update README files, generated package docs
5. Update `apps/docs` references and navigation
6. Update any documentation snippets or code examples

### Validation Checkpoints:
- `pnpm format-and-lint:fix` (after all text updates)
- `pnpm typecheck` (zero errors)
- `pnpm test` (all unit tests pass)
- `pnpm examples:check` (if exists, catches stale example imports)
- `pnpm docs:build` (documentation builds without broken links)

## Phase 4: TekBreed OSS Docs Conversion
**Goal**: Structure `apps/docs` for umbrella org with package grouping

### Steps:
1. Update navbar: Group sections by product family (TekMemo | TekCode [future] | ...)
2. For TekMemo section: Create sidebar with subsections for each `@tekbreed/tekmemo-*` package
3. Each subsection should contain:
   - Package overview
   - API reference (auto-generated if possible)
   - Usage examples
   - Migration notes (if applicable)
4. Preserve existing TekMemo content but repackage under new TekMemo section structure
5. Ensure future product families (TekCode, etc.) can be added similarly

### Validation Checkpoints:
- `pnpm docs:build` succeeds
- Manual navbar/sidebar interaction check
- All package documentation accessible and properly grouped
- Navigation works correctly between sections

## Phase 5: Final Verification
**Goal**: Confirm migration completeness

### Steps:
1. `pnpm build` (all packages)
2. `pnpm lint:package` (validate export maps via publint)
3. `pnpm release:dry-run` or `pnpm pack:dry-run` (check manifests)
4. Smoke test `tekmemo` CLI binary still works (verify bin field in `@tekbreed/tekmemo-cli`)
5. Verify AGENTS.md still references correct .agents/ files
6. Run comprehensive test suite to ensure nothing broken

## Key Risk Mitigations

### Dependency Breaks Mitigation:
- Use dependency-ordered batches (leaf to root)
- Validate after each batch with `pnpm install` and build tests
- Keep track of what each batch affects to limit blast radius

### Missed References Mitigation:
- After each phase, run: `grep -r "tekmemo" --exclude-dir=node_modules --exclude-dir=.git .` to find stragglers
- Pay special attention to: docs, examples, benchmark scripts, ChangeSets config
- Use IDE search across the whole workspace for missed references

### Binary Name Preservation:
- Explicitly preserve `tekmemo` CLI name in `@tekbreed/tekmemo-cli/package.json` bin field
- Verify after migration that `tekmemo` command still works as expected

### Rollback Strategy:
- Since this is intentionally a breaking change, ensure you have:
  - Clean backup/pre-migration branch
  - Clear documentation of pre-migration state
  - No expectation of in-place rollback (per assumptions)

## Assumptions (From Original Plan)
- This is intentionally a breaking package-name migration
- Existing source folders such as `packages/fs` can keep their directory names for now; the package name is the public API
- TekCode packages are future additions and should not be created in this migration
- Internal `@repo/*` tooling names remain private and unchanged, even though their directories move to `tooling/`

## Success Criteria
- All packages publishable with new `@tekbreed/*` names
- All imports and references updated correctly
- Documentation properly structured under TekBreed OSS umbrella
- CLI binary `tekmemo` still functional
- All tests passing
- Build system working correctly
- No regressions in functionality

## Next Steps
1. Create backup/pre-migration branch
2. Begin with Phase 1: Internal Tooling Isolation
3. Proceed through phases sequentially with validation at each step
4. Address any issues immediately before moving to next phase
5. Complete final verification and sign-off

---
*This plan is designed to be executed in sequence, with each phase building on the previous one. Validation checkpoints are critical to catch issues early and minimize disruption.*