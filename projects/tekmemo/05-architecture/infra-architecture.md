# TekMemo Cloud — Canonical Infrastructure Architecture

_Created: 2026-05-02_

## 1. Purpose

This document is the canonical infrastructure architecture for **TekMemo Cloud**.

It defines:

- overall deployment shape
- Cloudflare responsibilities
- Turso responsibilities
- pooled vs dedicated tenant strategy
- multi-tenant routing model
- background job design
- storage strategy
- API runtime boundaries
- project and tenant data boundaries
- operational rules for cost control

This document is intended for:

- backend engineering
- platform engineering
- product architecture
- billing implementation
- data design
- cloud deployment planning

This architecture is optimized for:

- low early-stage cost
- strong multi-tenant isolation
- simple first deployment
- predictable scaling
- clean separation of concerns

---

# 2. Core architecture principle

TekMemo Cloud should be built as:

## **one cloud app, one shared control plane, pooled tenant storage for early tiers, dedicated tenant storage for higher tiers**

The system should use:

- **Cloudflare Workers** for the web app and API runtime
- **Turso** for durable relational data
- **R2** for large objects, exports, snapshots, restore bundles
- **Queues** for async jobs
- **Durable Objects** for coordination and rate-limit/lock state
- **KV** for cache/config only
- **Upstash Vector** for recall storage
- **Voyage / OpenAI embeddings** for vector generation

The main rule is:

## Cloudflare is the runtime and coordination layer  
## Turso is the durable product data layer

Do not duplicate the primary relational model across multiple databases unnecessarily.

---

# 3. High-level system shape

```text
Users / Client Apps
        |
        v
Cloudflare Workers (React Router v7 app + API)
        |
        +--> Auth / Sessions / API key validation
        +--> Tenant + Project routing
        +--> Quota + billing checks
        +--> Durable Objects (locks, coordination, rate buckets)
        +--> KV (cache/config)
        +--> Queues (background jobs)
        +--> R2 (snapshots, exports, files)
        |
        +--> Turso Control Plane DB
        |
        +--> Turso Tenant Data DBs
        |
        +--> Upstash Vector
        |
        +--> Voyage / OpenAI embeddings
```

---

# 4. Cloudflare responsibilities

Cloudflare should be used where it reduces cost and simplifies operations.

## 4.1 Workers
Use Workers as the primary runtime for:

- public marketing pages if served from the cloud app
- authenticated dashboard
- `/api/*` routes
- tenant-aware request routing
- API-key validation
- quota enforcement entrypoint
- billing checks
- webhook management endpoints
- project and memory endpoints

### Why
You are already using React Router v7 with Cloudflare Workers. This means you can serve:

- UI routes
- form actions
- loader/action-backed APIs
- direct API endpoints

from the same deployable application.

### Recommendation
Keep **one cloud app** and expose APIs directly from it.

Do **not** build a separate API-only app initially.

Instead, keep logic separated at the code level:

- routes = thin
- services = reusable domain logic
- repositories = DB access layer
- adapters = external provider wrappers

This gives you one deployment target without mixing all logic into route files.

---

## 4.2 Queues
Use Queues for:

- indexing jobs
- re-index jobs after memory updates
- webhook delivery and retry
- usage event aggregation
- snapshot/export generation
- cleanup tasks
- restore processing

### Why
Indexing and webhook delivery are async by nature.
Moving them off request-time execution reduces latency and avoids wasting Worker CPU on user-facing requests.

---

## 4.3 R2
Use R2 for:

- exports
- restore bundles
- large snapshot artifacts
- audit export files
- uploaded files if TekMemo Cloud supports them later
- changelog/blog media if needed

### Why
R2 is cheaper and more appropriate than forcing large artifacts into Turso.

### Rule
Turso should store metadata about snapshots and exports.  
R2 should store the actual large objects.

---

## 4.4 Durable Objects
Use Durable Objects only for coordination:

- distributed locks
- per-tenant rate-limit counters
- single-writer guards
- idempotency keys
- webhook delivery coordination
- quota gate coordination for bursty traffic

### Why
They are good for stateful coordination, but should not become your main durable product database.

### Rule
Durable Objects are coordination state, not primary product state.

---

## 4.5 KV
Use KV for:

- feature flags
- cached plan metadata
- pricing page cache
- public changelog/blog cache
- low-risk configuration

### Why
KV is good for read-heavy config/cache patterns.

### Rule
Do not store transactional product data in KV.

---

## 4.6 Turnstile
Use Turnstile for:

- sign-up
- login / suspicious auth flows
- API-key creation forms
- waitlist/contact forms
- invite acceptance flows if abuse appears

### Why
It reduces abuse on free tiers and protects expensive backend actions.

---

# 5. Turso responsibilities

Turso should be the main durable relational data layer.

Use it for:

- tenants
- users
- memberships
- projects
- memory documents
- notes
- recall history metadata
- chunk registry
- restore point metadata
- API keys
- billing linkage metadata
- usage counters and summaries
- audit events
- tenant DB routing registry

The key decision is to use **two Turso layers**:

1. **Control Plane DB**
2. **Tenant Data DBs**

---

# 6. Database topology

## 6.1 Control Plane DB
Use one shared Turso database as the control plane.

This DB should contain platform-wide metadata and routing.

### Recommended tables
- `tenants`
- `users`
- `tenant_memberships`
- `projects_registry`
- `subscriptions`
- `billing_customers`
- `billing_events`
- `api_keys`
- `webhooks`
- `usage_counters_periodic`
- `tenant_database_registry`
- `audit_events_platform`
- `invites`
- `plan_limits_snapshot`

### What belongs here
Anything that needs:

- global lookup
- billing integration
- tenant resolution
- API key resolution
- project-to-database routing
- plan enforcement

### What does not belong here
Do not store full project memory content in the control-plane DB.

---

## 6.2 Tenant Data DBs
Use one or more Turso databases for actual tenant project data.

These DBs hold:

- project memory documents
- notes
- conversation history
- chunk registry
- recall metadata
- restore points
- project activity/audit
- indexing job state if persisted relationally

### Recommended tenant-data tables
- `projects`
- `memory_documents`
- `memory_notes`
- `memory_conversations`
- `chunk_registry`
- `chunk_versions`
- `recall_jobs`
- `restore_points`
- `project_activity_events`
- `project_api_events`

### Required boundary
Every product-data row should still carry `project_id`.

Even if the DB is tenant-specific, the actual product boundary is still the project.

---

# 7. Pooled vs dedicated tenant strategy

This is the most important cost-control rule.

## 7.1 Developer Cloud and small tenants
Use **pooled tenant-data DBs** for:

- Developer Cloud
- possibly very small Pro accounts early on

### Why
If every free user gets a dedicated DB immediately, you will burn through active database limits and create unnecessary operational overhead.

### Pooled design rule
A pooled DB may contain many tenants, but every row must include:

- `tenant_id`
- `project_id`

and all queries must filter by tenant and project.

---

## 7.2 Team, Business, Enterprise
Use **dedicated tenant DBs** for:

- most Team tenants once they are active
- all Business tenants
- all Enterprise tenants

### Why
This gives:

- stronger isolation
- easier migration/export
- lower blast radius
- simpler scaling rules
- better enterprise story

---

## 7.3 Migration rule
A tenant should be migrated from pooled -> dedicated when any of these happen:

- tenant upgrades to Team/Business and becomes active enough
- usage crosses a threshold
- storage crosses a threshold
- enterprise contract requires dedicated data placement
- support/internal ops want isolation

### Recommended migration triggers
Example triggers:
- storage > 500 MB
- indexing ops > 100K / month
- recall queries > 50K / month
- plan = Business or Enterprise

These are architecture recommendations. Tune them later with real usage.

---

# 8. Request routing model

Every request must resolve:

1. who the caller is
2. which tenant they belong to
3. which project they are accessing
4. which plan applies
5. which DB to query
6. which external services are needed

## 8.1 Request flow

```text
Request
  -> Cloudflare Worker route
  -> auth / API key validation
  -> resolve tenant
  -> resolve project
  -> resolve plan + quota
  -> resolve tenant-data DB from control-plane registry
  -> execute operation
  -> record usage
  -> enqueue async work if needed
  -> return response
```

## 8.2 DB routing rule
Use the control-plane DB to resolve:

- `tenant_id`
- `project_id`
- current `data_db_id`
- current `data_db_url`
- pooled vs dedicated status

This avoids hardcoding DB routing logic in route handlers.

---

# 9. API runtime boundaries

The cloud app should expose APIs directly, but keep boundaries clear.

## 9.1 Route layer
Owns:
- input validation
- auth
- error mapping
- response shaping

## 9.2 Service layer
Owns:
- domain logic
- plan checks
- quota checks
- business rules
- orchestration

## 9.3 Repository layer
Owns:
- Turso queries
- DB routing use
- transaction boundaries
- persistence details

## 9.4 Adapter layer
Owns:
- Upstash calls
- Voyage/OpenAI calls
- R2 access
- Queue publishing
- webhook delivery
- Turnstile verification

This separation matters because it keeps the “one app” approach maintainable.

---

# 10. Canonical product data model

## 10.1 Tenant
Represents the commercial and administrative boundary.

### Suggested fields
- `id`
- `slug`
- `name`
- `plan`
- `billing_customer_id`
- `status`
- `created_at`
- `updated_at`

## 10.2 User
Represents a person in the system.

### Suggested fields
- `id`
- `email`
- `name`
- `auth_provider`
- `created_at`
- `updated_at`

## 10.3 Tenant membership
Maps users to tenants.

### Suggested fields
- `id`
- `tenant_id`
- `user_id`
- `role`
- `status`
- `created_at`

## 10.4 Project
Represents the primary memory boundary.

### Suggested fields
- `id`
- `tenant_id`
- `name`
- `slug`
- `environment`
- `status`
- `created_at`
- `updated_at`

## 10.5 Memory document
Represents canonical file-backed memory.

### Suggested fields
- `id`
- `tenant_id`
- `project_id`
- `document_type` (`core`, `notes`, `conversations`)
- `content`
- `version`
- `updated_at`

## 10.6 Chunk registry
Tracks which source content was chunked and indexed.

### Suggested fields
- `id`
- `tenant_id`
- `project_id`
- `source_type`
- `source_id`
- `source_path`
- `chunk_id`
- `chunk_hash`
- `version`
- `embedding_provider`
- `vector_namespace`
- `indexed_at`

This table is important because it lets you:
- reindex by source
- remove old chunks by source
- map updates to vector operations cleanly

---

# 11. Usage metering model

Usage must be product-facing and auditable.

## Meter:
- projects
- users
- storage
- indexing operations
- recall queries
- API keys
- webhooks
- retention

## 11.1 Usage write pattern
On each billable/quota event:

1. write usage event
2. update summary counters
3. enqueue downstream analytics if needed

### Suggested event table
`usage_events`
- `id`
- `tenant_id`
- `project_id`
- `user_id`
- `event_type`
- `quantity`
- `period_key`
- `created_at`
- `request_id`

### Suggested summary table
`usage_counters_periodic`
- `tenant_id`
- `period_key`
- `metric`
- `used`
- `limit`
- `updated_at`

---

# 12. Memory indexing flow

Memory indexing should always be async.

## Flow

```text
User/API writes memory
  -> persist memory update in Turso
  -> append audit/activity
  -> enqueue indexing job in Queue
  -> Worker consumer reads job
  -> load source document / changed source
  -> chunk content
  -> embed chunks (Voyage/OpenAI)
  -> upsert chunks to Upstash
  -> update chunk_registry
  -> update job status
```

## Why this is correct
- avoids request-time latency
- makes retries easier
- avoids coupling user writes to external provider availability

---

# 13. Recall query flow

## Flow

```text
Recall request
  -> validate auth and quota
  -> load project + tenant context
  -> embed query text
  -> query Upstash with scope filters
  -> optionally enrich results from Turso source metadata
  -> record recall usage
  -> return scoped recall result
```

### Important rule
Upstash is the recall store.  
Turso is the source-of-truth for product metadata and source relationships.

---

# 14. Restore and snapshot flow

Snapshots should not live as heavy blobs in Turso.

## Flow

```text
Create restore point
  -> collect relevant project memory state
  -> serialize snapshot bundle
  -> upload bundle to R2
  -> persist restore metadata in Turso

Restore project
  -> validate plan and permissions
  -> fetch bundle metadata from Turso
  -> load bundle from R2
  -> restore memory documents
  -> enqueue reindex job
  -> append audit event
```

## Turso stores
- snapshot metadata
- status
- created_by
- created_at
- object key
- bundle checksum

## R2 stores
- actual bundle payload

---

# 15. API keys design

API keys belong in the control-plane DB.

## Suggested table
`api_keys`
- `id`
- `tenant_id`
- `user_id` nullable
- `project_id` nullable
- `key_prefix`
- `key_hash`
- `label`
- `scopes`
- `last_used_at`
- `revoked_at`
- `created_at`

## Recommended rules
- show full secret only once
- store only hash after creation
- support user keys and project keys first
- add service accounts later if needed

---

# 16. Webhooks design

Webhooks also belong in the control-plane DB.

## Suggested table
`webhooks`
- `id`
- `tenant_id`
- `project_id` nullable
- `endpoint_url`
- `secret_hash` or encrypted secret reference
- `events`
- `status`
- `last_delivery_at`
- `created_at`

Webhook deliveries themselves should be:
- queued
- retried
- logged separately

## Suggested delivery log table
`webhook_delivery_logs`
- `id`
- `webhook_id`
- `tenant_id`
- `event_type`
- `status`
- `attempt_count`
- `response_code`
- `created_at`

---

# 17. Cloudflare service responsibilities summary

## Use Cloudflare for:
### Workers
- app + API entrypoint

### Queues
- async jobs

### R2
- snapshots/exports/files

### Durable Objects
- locks/rate limits/coordination

### KV
- cache/config

### Turnstile
- bot protection

## Do not use Cloudflare for:
### D1
Not as the primary product DB in this architecture

### Durable Objects
Not as the primary product memory DB

### KV
Not for transactional product data

---

# 18. What to ignore for now

Do not introduce these unless a real use case appears:

- Cloudflare D1 in the main product data path
- Stream
- Images as a core dependency
- Browser rendering automation
- extra eventing layers beyond Queues
- multiple API apps
- multiple backend repos

These would add moving parts without improving the core TekMemo commercial loop.

---

# 19. Cost-optimization rules

## Rule 1
Use one cloud app for UI + API

## Rule 2
Keep async work off the request path

## Rule 3
Use R2 for large objects, not Turso

## Rule 4
Use pooled DBs for free/small tenants

## Rule 5
Reserve dedicated DBs for higher-value tenants

## Rule 6
Use Durable Objects only where coordination is needed

## Rule 7
Cache low-risk config in KV

## Rule 8
Do not duplicate the primary relational model across Turso and D1

---

# 20. Deployment boundaries

## App deploy
One Cloudflare deployable:
- React Router v7 app
- dashboard
- marketing pages if desired
- `/api/*`

## Shared packages
Keep business logic in shared internal packages:
- domain services
- repositories
- provider adapters
- quota engine
- billing engine

## External systems
- Turso
- Upstash
- Voyage/OpenAI
- R2
- Queues

---

# 21. Environment model

Support environments like:
- development
- staging
- production

## Recommended DB strategy by environment
### Development
- local or small pooled Turso setup
- local OSS components where useful

### Staging
- one control-plane DB
- one pooled tenant DB
- real queue and storage integration

### Production
- one control-plane DB
- pooled tenant DB(s) for free/dev
- dedicated tenant DBs as accounts grow

---

# 22. Canonical recommendation

## Final architecture

### Runtime
- Cloudflare Workers

### Durable relational data
- Turso

### Large objects
- R2

### Async jobs
- Queues

### Coordination
- Durable Objects

### Config/cache
- KV

### Vectors
- Upstash

### Embeddings
- Voyage and OpenAI

### App shape
- one cloud app exposing both UI and API
- clear internal service boundaries
- pooled free/dev tenants
- dedicated paid serious tenants

This is the recommended canonical infrastructure architecture for TekMemo Cloud.
