# TekMemo — Week 1 Daily Execution Checklist

_Created: 2026-05-02_

## Purpose

This document is the **daily execution checklist for Week 1** of the TekMemo 4-week survival plan.

Week 1 exists to produce one thing:

## By the end of Week 1, you must have a real working base:
- monorepo scaffolded
- TekMemo core package working
- local filesystem adapter working
- cloud app booting
- control-plane DB minimum working
- pooled tenant-data DB minimum working
- tenant creation working
- project creation working
- core memory read/update working
- one staging deploy working

If Week 1 slips, the whole 4-week survival plan becomes risky.

---

# Week 1 mission

At the end of this week, you must be able to do this:

1. open the cloud app
2. sign in or simulate authenticated access
3. create a tenant
4. create a project
5. open the project
6. read core memory
7. update core memory
8. see the result persisted

That is the target.

---

# Week 1 scope rules

## Build only these things this week
- monorepo structure
- core package
- fs adapter
- cloud app shell
- backend folder structure
- control-plane DB minimum
- tenant-data DB minimum
- tenant/project loop
- core memory loop

## Do not build this week
- recall
- Upstash integration
- usage dashboards
- billing
- pricing logic
- add-ons
- webhooks
- changelog/blog
- advanced UI polish
- advanced auth provider matrix
- advanced permissions
- restore system depth
- agentfs integration in cloud
- full docs polish

---

# Day 1 — Lock repo structure and boot everything

## Day 1 goal
By the end of Day 1, the monorepo exists and both apps boot.

## Primary outputs
- monorepo root created
- apps/docs created
- apps/tekmemo-cloud created
- packages folders created
- root configs created
- cloud app runs
- docs app runs

## Checklist

### Monorepo root
- [ ] create private monorepo root
- [ ] add root `package.json`
- [ ] add `pnpm-workspace.yaml`
- [ ] add `turbo.json`
- [ ] add `tsconfig.base.json`
- [ ] add root `.gitignore`

### Apps
- [ ] scaffold `apps/tekmemo-cloud`
- [ ] scaffold `apps/docs`
- [ ] confirm cloud app boots locally
- [ ] confirm docs app boots locally

### Packages
- [ ] create `packages/tekmemo`
- [ ] create `packages/ai-sdk`
- [ ] create `packages/fs`
- [ ] create `packages/agentfs`
- [ ] create `packages/upstash`
- [ ] create one embedder package you want to use first in cloud beta

### Shared config
- [ ] set root TypeScript config
- [ ] set root build scripts
- [ ] set root lint/typecheck scripts
- [ ] make workspace imports resolve

### Decision lock
- [ ] confirm final package names
- [ ] confirm app names
- [ ] confirm docs app remains VitePress
- [ ] confirm cloud app remains React Router v7 + Workers

## End-of-day proof
You should be able to run:
- cloud app
- docs app
- workspace typecheck/build skeleton

## Day 1 hard stop rule
Do not start real feature implementation until the workspace boots cleanly.

---

# Day 2 — Finish `@tekbreed/tekmemo` core package and local filesystem adapter

## Day 2 goal
By the end of Day 2, `@tekbreed/tekmemo` and `@tekbreed/tekmemo-fs` must work locally.

## Primary outputs
- `@tekbreed/tekmemo` package implemented enough for Week 1
- `@tekbreed/tekmemo-fs` implemented
- local example works

## Checklist

### `@tekbreed/tekmemo`
- [ ] create memory path constants
- [ ] define `MemoryStore` interface
- [ ] define memory document types
- [ ] add default templates for:
  - [ ] core memory
  - [ ] notes
  - [ ] conversations
- [ ] implement `bootstrapMemoryStore`
- [ ] implement `readCoreMemory`
- [ ] implement append note helper
- [ ] implement append conversation helper
- [ ] implement structured command runner:
  - [ ] view
  - [ ] create
  - [ ] update
  - [ ] search

### `@tekbreed/tekmemo-fs`
- [ ] create filesystem-backed store implementation
- [ ] connect it to `MemoryStore`
- [ ] confirm bootstrap works on disk
- [ ] confirm core memory file is created
- [ ] confirm notes file is created
- [ ] confirm conversations file is created

### Tests/examples
- [ ] make one simple local example
- [ ] read core memory from local store
- [ ] update core memory
- [ ] append note
- [ ] append conversation
- [ ] confirm file output looks correct

## End-of-day proof
You should be able to run a local script that:
1. boots memory store
2. reads core memory
3. updates core memory
4. appends notes
5. appends conversations

## Day 2 hard stop rule
Do not start AgentFS or Upstash work today.
Only finish the local core runtime.

---

# Day 3 — Scaffold cloud backend architecture and DB access foundations

## Day 3 goal
By the end of Day 3, the cloud app should have the real backend structure and DB access stubs.

## Primary outputs
- backend folder structure exists
- request context exists
- control-plane DB client exists
- tenant-data DB router stub exists
- one `/api/v1/health` endpoint works

## Checklist

### Cloud app backend structure
- [ ] create `src/core`
- [ ] create `src/http`
- [ ] create `src/auth`
- [ ] create `src/tenants`
- [ ] create `src/projects`
- [ ] create `src/memory`
- [ ] create `src/db`
- [ ] create `src/policies`
- [ ] create `src/workers`
- [ ] create `src/telemetry`

### Worker/runtime setup
- [ ] type Cloudflare bindings
- [ ] create env parser
- [ ] create request ID helper
- [ ] create request context builder
- [ ] create JSON response helper
- [ ] create standard API error helper

### DB layer
- [ ] create control-plane client
- [ ] create tenant-data client abstraction
- [ ] create DB routing stub
- [ ] create repository folder structure

### Routes
- [ ] create `/api/v1/health`
- [ ] return success JSON envelope
- [ ] confirm request ID is included

## End-of-day proof
You should be able to hit:
- `/api/v1/health`

and confirm:
- the app runs on Workers dev
- route structure works
- request context exists
- DB layer stubs compile

## Day 3 hard stop rule
Do not overbuild services yet.
This day is for architecture scaffolding only.

---

# Day 4 — Implement control-plane DB minimum

## Day 4 goal
By the end of Day 4, the control-plane DB must support tenant and project registry basics.

## Primary outputs
- minimum control-plane schema exists
- repositories work
- tenant creation works
- project registry insert works
- DB routing registry works enough for one pooled DB

## Minimum tables for today
- `tenants`
- `users`
- `tenant_memberships`
- `projects_registry`
- `api_keys` (table can exist even if not fully used yet)
- `tenant_database_registry`

## Checklist

### Schema
- [ ] create control-plane migration or SQL
- [ ] create indexes for tenant/project lookup
- [ ] seed one pooled tenant-data DB route in `tenant_database_registry`

### Repositories
- [ ] create tenants repository
- [ ] create users repository
- [ ] create memberships repository
- [ ] create project registry repository
- [ ] create tenant DB registry repository

### Services
- [ ] create tenant service
- [ ] create project registry service
- [ ] create resolve-tenant-db service

### Smoke tests
- [ ] create a tenant row
- [ ] create a user row
- [ ] create membership row
- [ ] create a project registry row
- [ ] resolve pooled DB route successfully

## End-of-day proof
You should be able to:
- create a tenant in control plane
- create a project registry row
- resolve which tenant-data DB the project should use

## Day 4 hard stop rule
Do not build UI polish.
Control plane must be real first.

---

# Day 5 — Implement pooled tenant-data DB minimum and first project/memory loop

## Day 5 goal
By the end of Day 5, the core product loop must work against the real DB structure.

## Primary outputs
- pooled tenant-data DB minimum exists
- project exists in tenant DB
- core memory can be read
- core memory can be updated

## Minimum tenant-data tables for today
- `projects`
- `memory_documents`
- `memory_notes`
- `memory_conversations`

## Checklist

### Schema
- [ ] create tenant-data schema
- [ ] add indexes for project and document lookups
- [ ] create one pooled tenant-data DB

### Repositories
- [ ] create projects repository for tenant DB
- [ ] create memory documents repository
- [ ] create notes repository stub
- [ ] create conversations repository stub

### Services
- [ ] create project service in tenant DB
- [ ] create get core memory service
- [ ] create update core memory service

### API routes
- [ ] add create project API route
- [ ] add get project API route
- [ ] add get core memory API route
- [ ] add update core memory API route

### UI
- [ ] create bare projects page
- [ ] create bare project details page
- [ ] create bare core memory page or section
- [ ] wire update form

## End-of-day proof
From the cloud app UI or API, you must be able to:
1. create project
2. open project
3. load core memory
4. update core memory
5. refresh and see persisted value

## Day 5 hard stop rule
This loop must work before adding notes UI depth or anything recall-related.

---

# Day 6 — Stabilize auth, request context, and basic tenant/project UX

## Day 6 goal
Make the first working flow more stable and less fragile.

## Primary outputs
- basic auth/session flow or simulated protected mode works
- tenant/project access checks exist
- better error handling exists
- project creation + project view are more usable

## Checklist

### Auth/session
- [ ] implement simplest viable auth path
- [ ] add current user resolution
- [ ] add tenant membership resolution
- [ ] add project access checks

### Request context
- [ ] ensure tenant resolution is stable
- [ ] ensure project resolution is stable
- [ ] ensure request ID is logged
- [ ] ensure route handlers use context

### Error handling
- [ ] normalize 400/401/403/404/500 responses
- [ ] make missing project errors understandable
- [ ] make unauthorized access errors understandable

### UX
- [ ] improve project create form
- [ ] improve empty state when no projects exist
- [ ] improve empty state when no core memory exists
- [ ] add minimal loading/error states

## End-of-day proof
The first loop should no longer feel like a fragile prototype.
It should feel like an early but real product path.

## Day 6 hard stop rule
Do not start recall today unless all Day 5 flow breakages are fixed.

---

# Day 7 — Week 1 stabilization, staging deploy, and Week 2 prep

## Day 7 goal
Stabilize the foundation and prepare to move into recall/API keys next week.

## Primary outputs
- staging deploy works
- bugs from Days 1–6 are fixed
- Week 2 backlog is clean
- no foundation-level uncertainty remains

## Checklist

### Deploy/staging
- [ ] deploy latest cloud app to staging
- [ ] confirm env vars set
- [ ] confirm DB connections work
- [ ] confirm create tenant/project/core memory flow works in staging

### Stabilization
- [ ] fix the top 5 broken flows
- [ ] remove dead code from scaffolding
- [ ] clean route naming
- [ ] clean service names
- [ ] clean repository boundaries

### Documentation
- [ ] write internal README for current architecture
- [ ] list exactly what works
- [ ] list exactly what is not built yet
- [ ] list blockers for Week 2

### Week 2 prep
- [ ] decide which embedder provider you are using first in cloud beta
- [ ] confirm Upstash route for recall
- [ ] confirm API key model approach
- [ ] confirm OSS public repo prep tasks

## End-of-day proof
Week 1 should end with:
- working staging deploy
- working project/core memory loop
- stable enough code structure to start recall and API keys

## Day 7 hard stop rule
Do not add new Week 2 features today.
This is a stabilization day.

---

# Week 1 deliverables summary

By the end of Week 1, you should have:

## Repo/workspace
- [ ] monorepo scaffolded
- [ ] cloud app scaffolded
- [ ] docs app scaffolded
- [ ] package folders scaffolded

## OSS
- [ ] `@tekbreed/tekmemo` working
- [ ] `@tekbreed/tekmemo-fs` working
- [ ] local example working

## Cloud backend
- [ ] backend folder structure in place
- [ ] request context in place
- [ ] health endpoint working
- [ ] control-plane DB minimum working
- [ ] pooled tenant-data DB minimum working

## Product loop
- [ ] create tenant works
- [ ] create project works
- [ ] get core memory works
- [ ] update core memory works
- [ ] project page exists
- [ ] core memory page/section exists

## Deployment
- [ ] one staging deploy working

---

# Daily operating rules for Week 1

## Rule 1
If a task does not help tenant -> project -> core memory working, postpone it.

## Rule 2
Do not switch architecture mid-week.

## Rule 3
Do not chase polish before the loop works.

## Rule 4
Every day should end with something testable.

## Rule 5
If a task takes too long, reduce scope instead of slipping the day.

---

# Best end-of-week question

At the end of Week 1, ask:

## Can a user create a tenant, create a project, open the project, and update core memory in staging?

If the answer is yes, Week 1 succeeded.
If the answer is no, do not move on casually — fix that before Week 2.
