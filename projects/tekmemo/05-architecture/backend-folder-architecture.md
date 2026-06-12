# TekMemo Cloud — Canonical Backend Folder Architecture and Service Map

_Created: 2026-05-02_

## 1. Purpose

This document defines the canonical backend folder architecture and service map for **TekMemo Cloud**.

It is designed for:

- **React Router v7**
- **Cloudflare Workers**
- **Turso**
- **Upstash Vector**
- **Voyage / OpenAI embeddings**
- **R2**
- **Queues**
- **Durable Objects**
- **KV**
- **Turnstile**

It is intended to align application code structure with the previously defined:

- infrastructure architecture
- Turso schema design
- pricing/billing/API model
- multi-tenant routing model

This document answers:

- how the cloud app should be structured
- where API routes should live
- how services should be organized
- where DB routing should happen
- where provider adapters should live
- how queues and background jobs should be structured
- what should be shared vs route-specific

---

# 2. Core architectural principle

TekMemo Cloud should use:

## **one Cloudflare app, thin routes, strong service layer, clear repository/adapters boundary**

That means:

- UI routes and API routes live in the **same app**
- business logic does **not** live in route files
- DB access does **not** live in route files
- external provider calls do **not** live in route files
- route files should mostly:
  - validate input
  - call a service
  - shape the response

The main dependency direction should be:

```text
routes
  -> services
    -> repositories
    -> adapters
    -> policies
```

Never invert this.

---

# 3. High-level app structure

## Recommended app layout

```text
apps/tekmemo-cloud/
├─ app/
│  ├─ routes/
│  ├─ entry.server.tsx
│  ├─ root.tsx
│  ├─ styles/
│  └─ env.server.ts
│
├─ src/
│  ├─ core/
│  ├─ auth/
│  ├─ tenants/
│  ├─ projects/
│  ├─ memory/
│  ├─ recall/
│  ├─ billing/
│  ├─ usage/
│  ├─ api-keys/
│  ├─ webhooks/
│  ├─ db/
│  ├─ queues/
│  ├─ storage/
│  ├─ integrations/
│  ├─ http/
│  ├─ policies/
│  ├─ workers/
│  ├─ telemetry/
│  └─ utils/
│
├─ packages/
│  └─ (workspace packages consumed here)
│
├─ public/
├─ package.json
├─ tsconfig.json
└─ wrangler.jsonc
```

---

# 4. Route structure

React Router v7 routes should be separated into:

- **marketing/public routes**
- **dashboard routes**
- **API routes**
- **auth routes**
- **internal/system routes** if needed

## Recommended `app/routes/` structure

```text
app/routes/
├─ _marketing._index.tsx
├─ _marketing.pricing.tsx
├─ _marketing.docs.tsx
├─ _marketing.changelog.tsx
├─ _marketing.blog.tsx
│
├─ _auth.sign-in.tsx
├─ _auth.sign-up.tsx
├─ _auth.verify.tsx
│
├─ _app.tsx
├─ _app._index.tsx
├─ _app.projects.tsx
├─ _app.projects.$projectId.tsx
├─ _app.memory.tsx
├─ _app.recall.tsx
├─ _app.usage.tsx
├─ _app.billing.tsx
├─ _app.api.tsx
├─ _app.webhooks.tsx
├─ _app.team.tsx
├─ _app.settings.tsx
│
├─ api.projects.ts
├─ api.projects.$projectId.ts
├─ api.memory.core.ts
├─ api.memory.notes.ts
├─ api.memory.conversations.ts
├─ api.recall.query.ts
├─ api.recall.index.ts
├─ api.usage.ts
├─ api.api-keys.ts
├─ api.webhooks.ts
│
├─ internal.queue.index.ts
├─ internal.queue.webhooks.ts
└─ internal.health.ts
```

## Notes
- public routes can render marketing content
- dashboard routes render UI
- `api.*` routes return JSON and act as your hosted API
- `internal.*` routes are optional for internal/debug/ops use

---

# 5. `src/` domain structure

The `src/` folder should contain the real backend structure.

Use **domain-oriented modules**, not one giant `lib/` folder.

---

## 5.1 `src/core/`

Owns common application primitives.

### Recommended contents
```text
src/core/
├─ types/
├─ errors/
├─ result/
├─ ids/
├─ time/
├─ constants/
└─ index.ts
```

### Responsibilities
- shared types
- typed errors
- helper types like `Result`
- ID generation helpers
- common constants
- common time helpers

### Rule
No business-specific logic here.

---

## 5.2 `src/http/`

Owns request/response primitives.

### Recommended contents
```text
src/http/
├─ json.ts
├─ request-context.ts
├─ parse-body.ts
├─ parse-search-params.ts
├─ response-errors.ts
├─ validation.ts
└─ index.ts
```

### Responsibilities
- JSON response helpers
- request context construction
- error-to-response mapping
- validation wrappers
- auth extraction helpers
- shared API response patterns

### Rule
This is transport-layer code, not business logic.

---

## 5.3 `src/auth/`

Owns authentication and session handling.

### Recommended contents
```text
src/auth/
├─ services/
│  ├─ sign-in.service.ts
│  ├─ sign-up.service.ts
│  ├─ verify-turnstile.service.ts
│  └─ session.service.ts
├─ repositories/
│  ├─ users.repository.ts
│  └─ sessions.repository.ts
├─ policies/
│  └─ auth.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- login/signup flows
- session creation
- Turnstile verification
- auth provider integration
- current user resolution

### Rule
API key auth should not live here; that belongs to `api-keys/`.

---

## 5.4 `src/tenants/`

Owns tenant-level logic.

### Recommended contents
```text
src/tenants/
├─ services/
│  ├─ create-tenant.service.ts
│  ├─ get-tenant.service.ts
│  ├─ update-tenant.service.ts
│  └─ resolve-tenant-by-slug.service.ts
├─ repositories/
│  └─ tenants.repository.ts
├─ policies/
│  └─ tenant-access.policy.ts
├─ types/
└─ index.ts
```

### Responsibilities
- tenant creation
- tenant lookup
- tenant state checks
- tenant status validation
- tenant access policies

---

## 5.5 `src/projects/`

Owns project-level logic.

### Recommended contents
```text
src/projects/
├─ services/
│  ├─ create-project.service.ts
│  ├─ list-projects.service.ts
│  ├─ get-project.service.ts
│  ├─ update-project.service.ts
│  └─ archive-project.service.ts
├─ repositories/
│  ├─ projects-registry.repository.ts
│  └─ tenant-projects.repository.ts
├─ policies/
│  └─ project-access.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- project CRUD
- project access checks
- project-to-DB routing lookups
- project membership checks

### Important boundary
Project access policy should be separate from memory logic.

---

## 5.6 `src/memory/`

Owns the core product logic for durable memory.

### Recommended contents
```text
src/memory/
├─ services/
│  ├─ get-core-memory.service.ts
│  ├─ update-core-memory.service.ts
│  ├─ append-note.service.ts
│  ├─ append-conversation.service.ts
│  ├─ list-notes.service.ts
│  ├─ list-conversations.service.ts
│  ├─ create-restore-point.service.ts
│  └─ restore-memory.service.ts
├─ repositories/
│  ├─ memory-documents.repository.ts
│  ├─ memory-notes.repository.ts
│  ├─ memory-conversations.repository.ts
│  ├─ restore-points.repository.ts
│  └─ project-activity.repository.ts
├─ orchestrators/
│  ├─ memory-write.orchestrator.ts
│  └─ memory-restore.orchestrator.ts
├─ policies/
│  ├─ memory-access.policy.ts
│  └─ memory-write.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- durable memory reads/writes
- notes management
- conversation history append
- restore point creation
- restore orchestration

### Important rule
The memory domain owns **durable source-of-truth content**.
It does **not** directly own vector retrieval logic.

---

## 5.7 `src/recall/`

Owns semantic recall and indexing orchestration.

### Recommended contents
```text
src/recall/
├─ services/
│  ├─ query-recall.service.ts
│  ├─ enqueue-indexing.service.ts
│  ├─ reindex-source.service.ts
│  └─ get-recall-usage.service.ts
├─ repositories/
│  ├─ chunk-registry.repository.ts
│  └─ recall-jobs.repository.ts
├─ orchestrators/
│  ├─ indexing-job.orchestrator.ts
│  ├─ recall-query.orchestrator.ts
│  └─ source-reindex.orchestrator.ts
├─ policies/
│  ├─ recall-access.policy.ts
│  └─ indexing.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- recall queries
- indexing orchestration
- reindex orchestration
- chunk registry management
- recall job tracking

### Important rule
This domain owns the bridge between:
- memory source data
- embeddings
- vector storage

---

## 5.8 `src/billing/`

Owns subscription and commercial logic.

### Recommended contents
```text
src/billing/
├─ services/
│  ├─ get-current-plan.service.ts
│  ├─ upgrade-plan.service.ts
│  ├─ downgrade-plan.service.ts
│  ├─ list-invoices.service.ts
│  ├─ apply-addon.service.ts
│  └─ remove-addon.service.ts
├─ repositories/
│  ├─ subscriptions.repository.ts
│  ├─ addons.repository.ts
│  └─ billing-events.repository.ts
├─ policies/
│  └─ billing.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- current plan resolution
- upgrade/downgrade logic
- add-on handling
- invoice data lookup
- billing state validation

---

## 5.9 `src/usage/`

Owns usage metering and quota calculations.

### Recommended contents
```text
src/usage/
├─ services/
│  ├─ record-usage.service.ts
│  ├─ get-usage-summary.service.ts
│  ├─ check-quotas.service.ts
│  ├─ list-usage-history.service.ts
│  └─ get-upgrade-recommendation.service.ts
├─ repositories/
│  ├─ usage-events.repository.ts
│  └─ usage-counters.repository.ts
├─ policies/
│  ├─ quota-enforcement.policy.ts
│  └─ grace-buffer.policy.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- usage recording
- quota checks
- usage summaries
- warnings
- upgrade/add-on recommendation logic

### Important rule
Every billable action should pass through this layer or trigger it.

---

## 5.10 `src/api-keys/`

Owns API key creation, validation, and policy.

### Recommended contents
```text
src/api-keys/
├─ services/
│  ├─ create-api-key.service.ts
│  ├─ list-api-keys.service.ts
│  ├─ revoke-api-key.service.ts
│  ├─ validate-api-key.service.ts
│  └─ get-api-key-usage.service.ts
├─ repositories/
│  └─ api-keys.repository.ts
├─ policies/
│  ├─ api-key-scope.policy.ts
│  └─ api-key-limit.policy.ts
├─ crypto/
│  ├─ hash-api-key.ts
│  ├─ verify-api-key.ts
│  └─ generate-api-key.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- API key generation
- hashing and verification
- scope enforcement
- API key listing/revocation
- API-key-based auth resolution

### Important rule
This domain must work **before** tenant-data DB routing happens.

---

## 5.11 `src/webhooks/`

Owns webhook registration and delivery orchestration.

### Recommended contents
```text
src/webhooks/
├─ services/
│  ├─ create-webhook.service.ts
│  ├─ list-webhooks.service.ts
│  ├─ revoke-webhook.service.ts
│  ├─ enqueue-webhook-delivery.service.ts
│  └─ list-webhook-delivery-logs.service.ts
├─ repositories/
│  ├─ webhooks.repository.ts
│  └─ webhook-delivery-logs.repository.ts
├─ policies/
│  └─ webhook-limit.policy.ts
├─ crypto/
│  └─ sign-webhook-payload.ts
├─ schemas/
└─ index.ts
```

### Responsibilities
- webhook CRUD
- event routing
- signing
- retry delivery
- logs

### Important rule
Actual delivery should be queued, not executed inline in most cases.

---

## 5.12 `src/db/`

Owns DB routing, DB client creation, and transactional boundaries.

### Recommended contents
```text
src/db/
├─ control-plane/
│  ├─ client.ts
│  ├─ transaction.ts
│  └─ index.ts
├─ tenant-data/
│  ├─ router.ts
│  ├─ client.ts
│  ├─ transaction.ts
│  └─ index.ts
├─ registry/
│  └─ resolve-tenant-db.ts
├─ types/
└─ index.ts
```

### Responsibilities
- control-plane DB client
- tenant-data DB client
- pooled vs dedicated DB resolution
- DB routing by tenant/project
- transaction helpers

### Important rule
Repositories should consume DB clients from here.  
Routes should never instantiate DB connections directly.

---

## 5.13 `src/storage/`

Owns large object storage integration.

### Recommended contents
```text
src/storage/
├─ services/
│  ├─ upload-snapshot.service.ts
│  ├─ get-snapshot-download-url.service.ts
│  ├─ upload-export.service.ts
│  └─ delete-expired-objects.service.ts
├─ adapters/
│  └─ r2.adapter.ts
└─ index.ts
```

### Responsibilities
- snapshot bundle upload
- export storage
- object retrieval
- cleanup

### Important rule
Only metadata stays in Turso.
Actual heavy bundles live in R2.

---

## 5.14 `src/queues/`

Owns queue publishing and message contracts.

### Recommended contents
```text
src/queues/
├─ messages/
│  ├─ indexing-job.ts
│  ├─ webhook-delivery-job.ts
│  ├─ restore-job.ts
│  └─ usage-rollup-job.ts
├─ publishers/
│  ├─ enqueue-indexing-job.ts
│  ├─ enqueue-webhook-job.ts
│  ├─ enqueue-restore-job.ts
│  └─ enqueue-usage-rollup-job.ts
├─ consumers/
│  ├─ handle-indexing-job.ts
│  ├─ handle-webhook-job.ts
│  ├─ handle-restore-job.ts
│  └─ handle-usage-rollup-job.ts
└─ index.ts
```

### Responsibilities
- queue payload schema
- publishing jobs
- consuming jobs
- retry-safe processing

### Important rule
Message payloads must be minimal and stable.

---

## 5.15 `src/integrations/`

Owns external provider wrappers.

### Recommended contents
```text
src/integrations/
├─ turso/
├─ upstash/
├─ voyage/
├─ openai/
├─ cloudflare/
│  ├─ r2/
│  ├─ kv/
│  ├─ queues/
│  ├─ durable-objects/
│  └─ turnstile/
└─ index.ts
```

### Responsibilities
- provider-specific adapters
- request shaping
- provider response normalization
- retries/backoff if needed

### Important rule
Services should not know provider SDK details.
Services should talk to domain-specific adapter interfaces.

---

## 5.16 `src/policies/`

Owns policy composition used across domains.

### Recommended contents
```text
src/policies/
├─ plan-limits.policy.ts
├─ tenant-status.policy.ts
├─ role-access.policy.ts
├─ project-scope.policy.ts
├─ upgrade-eligibility.policy.ts
└─ index.ts
```

### Responsibilities
- reusable policies
- plan-aware rules
- role-based checks
- shared access constraints

### Rule
If the same business rule appears in 3 domains, it belongs here.

---

## 5.17 `src/workers/`

Owns Worker-specific coordination points.

### Recommended contents
```text
src/workers/
├─ bindings.ts
├─ env.ts
├─ request-handler.ts
├─ durable-objects/
│  ├─ tenant-lock.do.ts
│  ├─ rate-limit.do.ts
│  └─ quota-gate.do.ts
└─ index.ts
```

### Responsibilities
- Cloudflare bindings typing
- environment parsing
- Durable Object classes
- Worker-specific runtime wiring

### Important rule
Most business logic should still live outside `src/workers/`.

---

## 5.18 `src/telemetry/`

Owns logging, audit, and observability helpers.

### Recommended contents
```text
src/telemetry/
├─ logger.ts
├─ audit.ts
├─ request-metrics.ts
├─ usage-metrics.ts
└─ index.ts
```

### Responsibilities
- structured logs
- request correlation IDs
- usage/audit helper emission
- error instrumentation

---

## 5.19 `src/utils/`

Owns generic utilities.

### Rule
Keep this small.
Do not let `utils/` become your real architecture.

---

# 6. Repository structure rules

Repositories should be:

- thin
- table-focused
- persistence-only
- unaware of route concerns

## Good repository responsibilities
- CRUD queries
- list queries
- upserts
- transactions with explicit semantics

## Bad repository responsibilities
- billing decisions
- quota policy
- response formatting
- provider API calls

---

# 7. Service structure rules

Services should be:

- domain actions
- composable
- testable
- unaware of HTTP transport specifics

## Good service names
- `create-project.service.ts`
- `update-core-memory.service.ts`
- `query-recall.service.ts`
- `create-api-key.service.ts`

## Good service responsibilities
- validate domain rules
- call repositories
- call policies
- call adapters
- emit usage events
- enqueue async work if needed

---

# 8. Orchestrators vs services

Use **orchestrators** only when multiple domains or external systems must be coordinated.

## Use a service when:
- one domain action is happening
- dependencies are contained

## Use an orchestrator when:
- multiple repositories/domains/providers are involved
- order of operations matters
- background work and persistence must be coordinated

### Example orchestrators
- memory write -> audit -> usage -> indexing queue
- restore -> R2 fetch -> Turso update -> reindex queue
- recall query -> embed -> Upstash -> usage record

---

# 9. API route design

API routes should be very thin.

## Example route flow
1. parse auth
2. validate input
3. construct request context
4. call service/orchestrator
5. return JSON

## Do not do this in routes
- DB routing
- direct SQL
- embedding provider calls
- vector store calls
- billing logic
- quota math

---

# 10. Request context design

Create one request context per request.

## Suggested fields
- request ID
- tenant ID
- project ID
- user ID
- API key ID
- plan
- role
- environment
- DB routing info if already resolved

### Why
This reduces repeated lookup work and makes logs coherent.

---

# 11. Recommended file examples

## Example: `src/api-keys/services/validate-api-key.service.ts`
Should:
- hash/verify provided key
- load API key row
- check status
- return resolved tenant/project/scopes

## Example: `src/db/registry/resolve-tenant-db.ts`
Should:
- consult control-plane registry
- return pooled/dedicated DB target
- abstract DB routing away from services

## Example: `src/usage/services/check-quotas.service.ts`
Should:
- load counters
- load plan limits
- compute hard cap / soft cap / grace state
- return a typed decision

## Example: `src/recall/orchestrators/recall-query.orchestrator.ts`
Should:
- check quota
- embed query text
- query vector store
- record usage
- return result

---

# 12. Background job architecture

All heavy or retry-prone work should move into queues.

## Indexing jobs
Use for:
- memory update indexing
- reindex by source
- restore-time reindex

## Webhook jobs
Use for:
- event fan-out
- retries
- delivery logging

## Usage rollup jobs
Use for:
- periodic aggregation
- reconciliation
- analytics precomputation

## Restore jobs
Use for:
- large restore bundle handling
- export generation

---

# 13. Durable Object usage

Use Durable Objects for:
- per-tenant lock
- per-tenant rate limit bucket
- quota burst protection
- idempotency coordination

## Do not use DOs for
- core memory tables
- billing tables
- project registry
- API keys source of truth

---

# 14. Code ownership by package vs app

Your workspace packages should remain reusable.

## Packages should own
- `@tekbreed/tekmemo`
- `@tekbreed/tekmemo-ai-sdk`
- `@tekbreed/tekmemo-fs`
- `@tekbreed/tekmemo-agentfs`
- `@tekbreed/tekmemo-upstash`
- `@tekbreed/tekmemo-voyage`
- `@tekbreed/tekmemo-openai`

## Cloud app should own
- tenant model
- billing model
- quota enforcement
- API key management
- project management
- dashboard-specific service composition
- multi-tenant DB routing

---

# 15. Suggested folder map in one view

```text
apps/tekmemo-cloud/
├─ app/
│  └─ routes/
│
├─ src/
│  ├─ core/
│  ├─ http/
│  ├─ auth/
│  ├─ tenants/
│  ├─ projects/
│  ├─ memory/
│  ├─ recall/
│  ├─ billing/
│  ├─ usage/
│  ├─ api-keys/
│  ├─ webhooks/
│  ├─ db/
│  ├─ storage/
│  ├─ queues/
│  ├─ integrations/
│  ├─ policies/
│  ├─ workers/
│  ├─ telemetry/
│  └─ utils/
```

This is the structure I recommend you follow.

---

# 16. First release build order

If you are building this incrementally, use this order:

## Phase 1
- `core`
- `http`
- `db`
- `auth`
- `tenants`
- `projects`

## Phase 2
- `memory`
- `usage`
- `api-keys`

## Phase 3
- `recall`
- `queues`
- `storage`

## Phase 4
- `billing`
- `webhooks`
- `team`
- `advanced telemetry`

This keeps the first release focused on:
- auth
- tenants
- projects
- memory
- quotas
- API keys

---

# 17. Canonical recommendation

For TekMemo Cloud, use:

- **one Cloudflare app**
- **thin React Router routes**
- **domain folders in `src/`**
- **shared control-plane DB access**
- **tenant-data DB routing through `src/db/`**
- **domain services**
- **external providers isolated in adapters**
- **queues for async work**
- **Durable Objects only for coordination**

This is the canonical backend folder architecture and service map for TekMemo Cloud.
