# TekMemo Cloud — Canonical Turso Schema Design (Prisma)

_Created: 2026-05-02_

## 1. Purpose

This document is the canonical Turso schema design for **TekMemo Cloud**.

It defines:

- control-plane database schema
- pooled tenant-data database schema
- dedicated tenant-data database schema
- API key schema
- usage metering schema
- chunk registry schema
- restore metadata schema
- indexes
- constraints
- practical routing rules

This document is intended for:

- backend engineering
- platform engineering
- database design
- billing/usage implementation
- API implementation
- multi-tenant routing logic

This version keeps the original design, but changes the schema sections from raw SQL to **Prisma schema**.

---

# 2. Architecture summary

TekMemo Cloud uses **two relational layers** in Turso:

## 2.1 Control-plane database
One shared Turso database for:

- tenants
- users
- memberships
- subscriptions
- API keys
- webhooks
- usage counters
- database routing
- billing linkage
- platform-level audit

## 2.2 Tenant-data databases
One or more Turso databases for actual product data:

- projects
- memory documents
- notes
- conversations
- chunk registry
- recall jobs
- restore points
- project activity/audit

## 2.3 Pooled vs dedicated
Early/free tenants can live in **pooled tenant-data DBs**.

Serious paid tenants can move to **dedicated tenant-data DBs**.

### Important design rule
Use the **same logical tenant-data schema** for both pooled and dedicated DBs.

That means:
- always keep `tenant_id`
- always keep `project_id`
- always write tenant-aware queries

This keeps your code path consistent.

---

# 3. Prisma notes for this architecture

Because TekMemo Cloud uses **two different databases** in the app, Prisma should be represented as **two Prisma schemas / two Prisma Clients**, which matches Prisma’s documented multiple-database approach. Prisma’s schema language supports model-level indexes and unique constraints with `@@index` and `@@unique`. citeturn149325search1turn498814search1turn498814search2

## Recommended layout

```text
prisma/
├─ control-plane/
│  └─ schema.prisma
└─ tenant-data/
   └─ schema.prisma
```

This conversion keeps JSON-ish fields as `String` to stay aligned with the original “TEXT storing JSON” design. You can later convert selected fields to `Json` if you want Prisma-level JSON semantics. Prisma supports JSON fields generally, but this document keeps the original storage intent intact. citeturn498814search9turn498814search0

---

# 4. Control-plane database schema

## File: `prisma/control-plane/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("CONTROL_PLANE_DATABASE_URL")
}

model Tenant {
  id                      String               @id
  slug                    String               @unique
  name                    String
  status                  String
  plan                    String
  billing_customer_id     String?
  billing_subscription_id String?
  created_at              String
  updated_at              String

  tenant_memberships      TenantMembership[]
  projects_registry       ProjectRegistry[]
  subscriptions           Subscription[]
  subscription_addons     SubscriptionAddon[]
  api_keys                ApiKey[]
  webhooks                Webhook[]
  webhook_delivery_logs   WebhookDeliveryLog[]
  tenant_database_routes  TenantDatabaseRegistry[]
  usage_events            UsageEvent[]
  usage_counters          UsageCounterPeriodic[]

  @@map("tenants")
  @@index([plan], map: "idx_tenants_plan")
  @@index([status], map: "idx_tenants_status")
}

model User {
  id                    String               @id
  email                 String               @unique
  name                  String?
  avatar_url            String?
  auth_provider         String
  auth_provider_user_id String?
  last_login_at         String?
  created_at            String
  updated_at            String

  tenant_memberships    TenantMembership[]
  project_memberships   ProjectMembership[]
  api_keys              ApiKey[]

  @@map("users")
  @@index([auth_provider, auth_provider_user_id], map: "idx_users_auth_provider")
}

model TenantMembership {
  id         String @id
  tenant_id  String
  user_id    String
  role       String
  status     String
  created_at String
  updated_at String

  tenant     Tenant @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  user       User   @relation(fields: [user_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("tenant_memberships")
  @@unique([tenant_id, user_id])
  @@index([tenant_id], map: "idx_tenant_memberships_tenant")
  @@index([user_id], map: "idx_tenant_memberships_user")
  @@index([tenant_id, role], map: "idx_tenant_memberships_role")
}

model ProjectRegistry {
  id                 String @id
  tenant_id          String
  name               String
  slug               String
  environment        String?
  status             String
  data_db_id         String
  created_by_user_id String?
  created_at         String
  updated_at         String

  tenant             Tenant                @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project_members    ProjectMembership[]
  api_keys           ApiKey[]
  webhooks           Webhook[]

  @@map("projects_registry")
  @@unique([tenant_id, slug])
  @@index([tenant_id], map: "idx_projects_registry_tenant")
  @@index([data_db_id], map: "idx_projects_registry_data_db")
  @@index([tenant_id, status], map: "idx_projects_registry_status")
}

model ProjectMembership {
  id         String @id
  tenant_id  String
  project_id String
  user_id    String
  role       String
  status     String
  created_at String
  updated_at String

  tenant     Tenant          @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project    ProjectRegistry @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  user       User            @relation(fields: [user_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("project_memberships")
  @@unique([project_id, user_id])
  @@index([project_id], map: "idx_project_memberships_project")
  @@index([user_id], map: "idx_project_memberships_user")
  @@index([tenant_id], map: "idx_project_memberships_tenant")
}

model Subscription {
  id                       String @id
  tenant_id                String @unique
  provider                 String
  provider_customer_id     String?
  provider_subscription_id String?
  plan                     String
  billing_interval         String
  status                   String
  current_period_start     String?
  current_period_end       String?
  cancel_at_period_end     Boolean @default(false)
  created_at               String
  updated_at               String

  tenant                   Tenant               @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  addons                   SubscriptionAddon[]

  @@map("subscriptions")
  @@index([status], map: "idx_subscriptions_status")
  @@index([plan], map: "idx_subscriptions_plan")
}

model SubscriptionAddon {
  id              String @id
  tenant_id       String
  subscription_id String
  addon_code      String
  quantity        Int     @default(1)
  active          Boolean @default(true)
  created_at      String
  updated_at      String

  tenant          Tenant       @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  subscription    Subscription @relation(fields: [subscription_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("subscription_addons")
  @@index([tenant_id], map: "idx_subscription_addons_tenant")
  @@index([subscription_id], map: "idx_subscription_addons_subscription")
  @@index([active], map: "idx_subscription_addons_active")
}

model ApiKey {
  id           String  @id
  tenant_id    String
  user_id      String?
  project_id   String?
  key_prefix   String  @unique
  key_hash     String
  label        String
  scopes_json  String
  status       String
  last_used_at String?
  revoked_at   String?
  created_at   String
  updated_at   String

  tenant       Tenant           @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  user         User?            @relation(fields: [user_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project      ProjectRegistry? @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("api_keys")
  @@index([tenant_id], map: "idx_api_keys_tenant")
  @@index([project_id], map: "idx_api_keys_project")
  @@index([user_id], map: "idx_api_keys_user")
  @@index([status], map: "idx_api_keys_status")
}

model Webhook {
  id                  String  @id
  tenant_id           String
  project_id          String?
  endpoint_url        String
  event_types_json    String
  signing_secret_hash String
  status              String
  last_delivery_at    String?
  created_at          String
  updated_at          String

  tenant              Tenant           @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project             ProjectRegistry? @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  deliveries          WebhookDeliveryLog[]

  @@map("webhooks")
  @@index([tenant_id], map: "idx_webhooks_tenant")
  @@index([project_id], map: "idx_webhooks_project")
  @@index([status], map: "idx_webhooks_status")
}

model WebhookDeliveryLog {
  id              String @id
  tenant_id       String
  webhook_id      String
  project_id      String?
  event_type      String
  delivery_status String
  attempt_count   Int     @default(1)
  response_code   Int?
  error_message   String?
  created_at      String

  tenant          Tenant  @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  webhook         Webhook @relation(fields: [webhook_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("webhook_delivery_logs")
  @@index([tenant_id], map: "idx_webhook_delivery_logs_tenant")
  @@index([webhook_id], map: "idx_webhook_delivery_logs_webhook")
  @@index([delivery_status], map: "idx_webhook_delivery_logs_status")
  @@index([created_at], map: "idx_webhook_delivery_logs_created_at")
}

model TenantDatabaseRegistry {
  id            String  @id
  tenant_id     String
  data_db_id    String
  data_db_role  String
  data_db_label String
  region        String?
  active        Boolean @default(true)
  created_at    String
  updated_at    String

  tenant        Tenant  @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("tenant_database_registry")
  @@index([tenant_id], map: "idx_tenant_database_registry_tenant")
  @@index([data_db_id], map: "idx_tenant_database_registry_db")
  @@index([data_db_role], map: "idx_tenant_database_registry_role")
}

model UsageEvent {
  id         String @id
  tenant_id  String
  project_id String?
  user_id    String?
  metric     String
  quantity   Int
  period_key String
  source     String
  request_id String?
  created_at String

  tenant     Tenant @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("usage_events")
  @@index([tenant_id, period_key], map: "idx_usage_events_tenant_period")
  @@index([project_id, period_key], map: "idx_usage_events_project_period")
  @@index([metric, period_key], map: "idx_usage_events_metric_period")
  @@index([created_at], map: "idx_usage_events_created_at")
}

model UsageCounterPeriodic {
  id          String @id
  tenant_id   String
  period_key  String
  metric      String
  used_value  Int    @default(0)
  limit_value Int?
  updated_at  String

  tenant      Tenant @relation(fields: [tenant_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("usage_counters_periodic")
  @@unique([tenant_id, period_key, metric])
  @@index([tenant_id, period_key], map: "idx_usage_counters_tenant_period")
  @@index([metric], map: "idx_usage_counters_metric")
}

model PlatformAuditEvent {
  id           String @id
  tenant_id    String?
  user_id      String?
  actor_type   String
  event_type   String
  target_type  String?
  target_id    String?
  details_json String?
  created_at   String

  @@map("platform_audit_events")
  @@index([tenant_id], map: "idx_platform_audit_events_tenant")
  @@index([user_id], map: "idx_platform_audit_events_user")
  @@index([event_type], map: "idx_platform_audit_events_event_type")
  @@index([created_at], map: "idx_platform_audit_events_created_at")
}
```

---

# 5. Tenant-data database schema

Use this schema for both:

- pooled tenant-data DBs
- dedicated tenant-data DBs

Even in dedicated DBs, keep:
- `tenant_id`
- `project_id`

This avoids branching your app logic.

## File: `prisma/tenant-data/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("TENANT_DATA_DATABASE_URL")
}

model Project {
  id                    String @id
  tenant_id             String
  name                  String
  slug                  String
  environment           String?
  status                String
  created_at            String
  updated_at            String

  memory_documents       MemoryDocument[]
  memory_notes           MemoryNote[]
  memory_conversations   MemoryConversation[]
  chunk_registry         ChunkRegistry[]
  chunk_versions         ChunkVersion[]
  recall_jobs            RecallJob[]
  restore_points         RestorePoint[]
  project_activity_events ProjectActivityEvent[]
  project_api_events     ProjectApiEvent[]

  @@map("projects")
  @@unique([tenant_id, slug])
  @@index([tenant_id], map: "idx_projects_tenant")
  @@index([tenant_id, status], map: "idx_projects_status")
}

model MemoryDocument {
  id                 String @id
  tenant_id          String
  project_id         String
  document_type      String
  content            String
  version            Int    @default(1)
  content_hash       String?
  updated_by_user_id String?
  created_at         String
  updated_at         String

  project            Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("memory_documents")
  @@unique([project_id, document_type])
  @@index([tenant_id, project_id], map: "idx_memory_documents_tenant_project")
  @@index([project_id, document_type], map: "idx_memory_documents_type")
}

model MemoryNote {
  id                 String @id
  tenant_id          String
  project_id         String
  note_kind          String
  title              String?
  content            String
  tags_json          String?
  source_type        String?
  source_id          String?
  created_by_user_id String?
  created_at         String
  updated_at         String

  project            Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("memory_notes")
  @@index([tenant_id, project_id], map: "idx_memory_notes_tenant_project")
  @@index([project_id, note_kind], map: "idx_memory_notes_kind")
  @@index([project_id, created_at], map: "idx_memory_notes_created_at")
}

model MemoryConversation {
  id                 String @id
  tenant_id          String
  project_id         String
  role               String
  summary            String
  raw_reference      String?
  created_by_user_id String?
  created_at         String

  project            Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("memory_conversations")
  @@index([tenant_id, project_id], map: "idx_memory_conversations_tenant_project")
  @@index([project_id, created_at], map: "idx_memory_conversations_created_at")
}

model ChunkRegistry {
  id                 String @id
  tenant_id          String
  project_id         String
  source_type        String
  source_id          String
  source_path        String?
  chunk_id           String
  chunk_hash         String
  chunk_text         String
  section_name       String?
  memory_type        String
  version            Int    @default(1)
  embedding_provider String?
  embedding_model    String?
  vector_store       String?
  vector_namespace   String?
  index_status       String
  indexed_at         String?
  last_error         String?
  created_at         String
  updated_at         String

  project            Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  chunk_versions     ChunkVersion[]

  @@map("chunk_registry")
  @@unique([project_id, chunk_id])
  @@index([tenant_id, project_id], map: "idx_chunk_registry_tenant_project")
  @@index([project_id, source_type, source_id], map: "idx_chunk_registry_source")
  @@index([project_id, source_path], map: "idx_chunk_registry_source_path")
  @@index([project_id, index_status], map: "idx_chunk_registry_status")
  @@index([project_id, memory_type], map: "idx_chunk_registry_memory_type")
  @@index([project_id, chunk_hash], map: "idx_chunk_registry_chunk_hash")
}

model ChunkVersion {
  id                String @id
  tenant_id         String
  project_id        String
  chunk_registry_id String
  version           Int
  chunk_hash        String
  chunk_text        String
  indexed_at        String?
  created_at        String

  chunk_registry    ChunkRegistry @relation(fields: [chunk_registry_id], references: [id], onDelete: Restrict, onUpdate: Cascade)
  project           Project       @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("chunk_versions")
  @@index([chunk_registry_id], map: "idx_chunk_versions_registry")
  @@index([project_id, version], map: "idx_chunk_versions_project_version")
}

model RecallJob {
  id            String @id
  tenant_id     String
  project_id    String
  job_type      String
  source_type   String?
  source_id     String?
  status        String
  queued_at     String
  started_at    String?
  completed_at  String?
  error_message String?

  project       Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("recall_jobs")
  @@index([project_id, status], map: "idx_recall_jobs_project_status")
  @@index([queued_at], map: "idx_recall_jobs_queued_at")
}

model RestorePoint {
  id                 String @id
  tenant_id          String
  project_id         String
  restore_type       String
  object_key         String
  bundle_checksum    String?
  bundle_size_bytes  Int?
  created_by_user_id String?
  status             String
  created_at         String
  expires_at         String?

  project            Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("restore_points")
  @@index([project_id], map: "idx_restore_points_project")
  @@index([project_id, status], map: "idx_restore_points_status")
  @@index([project_id, created_at], map: "idx_restore_points_created_at")
}

model ProjectActivityEvent {
  id           String @id
  tenant_id    String
  project_id   String
  actor_type   String
  actor_id     String?
  event_type   String
  target_type  String?
  target_id    String?
  details_json String?
  created_at   String

  project      Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("project_activity_events")
  @@index([project_id], map: "idx_project_activity_events_project")
  @@index([project_id, event_type], map: "idx_project_activity_events_type")
  @@index([project_id, created_at], map: "idx_project_activity_events_created_at")
}

model ProjectApiEvent {
  id              String @id
  tenant_id       String
  project_id      String
  api_key_id      String?
  request_path    String
  request_method  String
  response_status Int?
  request_id      String?
  created_at      String

  project         Project @relation(fields: [project_id], references: [id], onDelete: Restrict, onUpdate: Cascade)

  @@map("project_api_events")
  @@index([project_id], map: "idx_project_api_events_project")
  @@index([api_key_id], map: "idx_project_api_events_api_key")
  @@index([created_at], map: "idx_project_api_events_created_at")
}
```

---

# 6. Pooled vs dedicated DB rules

## 6.1 Pooled tenant-data DB
Use for:
- Developer Cloud
- small early Pro tenants

### Required query rule
Every query must filter by:
- `tenant_id`
- `project_id` when project-scoped

## 6.2 Dedicated tenant-data DB
Use for:
- most Team tenants once active
- Business
- Enterprise

### Query rule
Still filter by:
- `tenant_id`
- `project_id`

Even though the DB is tenant-scoped, keep code consistent.

---

# 7. API keys schema guidance

API keys live in the control-plane DB because they must be resolvable before tenant DB routing.

## Why
A request arrives with:
- bearer token

You must first know:
- tenant
- project binding
- scopes
- plan
- DB route

before you touch the tenant-data DB.

That means:
- API keys must be resolvable centrally

---

# 8. Usage metering design

Usage metering should be centralized in the control plane.

## Why
Billing and quota enforcement are tenant-wide and plan-wide.

### Recommended write pattern
For each billable operation:
1. insert into `usage_events`
2. upsert the relevant `usage_counters_periodic` row

### Metrics to track
- `projects_count`
- `users_count`
- `storage_bytes`
- `indexing_ops`
- `recall_queries`
- `api_keys_count`
- `webhooks_count`

### Period key format
Use:
- `YYYY-MM`

Example:
- `2026-05`

---

# 9. Chunk registry and source manifest rules

The chunk registry is the foundation of clean reindexing.

## 9.1 Source identity rule
Each indexed source must have:
- `source_type`
- `source_id`
- optional `source_path`

Examples:
- source_type = `document`, source_id = memory document id
- source_type = `note`, source_id = note id
- source_type = `conversation`, source_id = conversation id

## 9.2 Reindex rule
When a source changes:
1. mark prior chunks for that source as `stale`
2. enqueue reindex job
3. write new chunks
4. mark new chunks `indexed`
5. optionally mark stale chunks `deleted` after vector cleanup succeeds

## 9.3 Why this is necessary
Without this table, you cannot reliably:
- remove outdated vectors
- know which source produced which chunks
- recover from partial indexing failures

---

# 10. Restore metadata design

Restore point payloads should not be stored in Turso blobs.

## Turso should store:
- metadata
- object key
- checksum
- size
- status
- creator
- created/expires timestamps

## R2 should store:
- actual restore bundle

This keeps the relational DB small and query-friendly.

---

# 11. Suggested migration order

## Phase 1
Create control-plane models first:
- Tenant
- User
- TenantMembership
- ProjectRegistry
- Subscription
- ApiKey
- TenantDatabaseRegistry
- UsageEvent
- UsageCounterPeriodic

## Phase 2
Create tenant-data models:
- Project
- MemoryDocument
- MemoryNote
- MemoryConversation
- ChunkRegistry
- RecallJob
- RestorePoint
- ProjectActivityEvent

## Phase 3
Add:
- ProjectMembership
- Webhook
- WebhookDeliveryLog
- ChunkVersion
- ProjectApiEvent
- PlatformAuditEvent

This keeps the first release focused.

---

# 12. Recommended application constraints

In addition to Prisma constraints, enforce these in code:

## 12.1 Membership invariants
- one user cannot have duplicate tenant membership
- one user cannot have duplicate project membership

## 12.2 API key invariants
- full secret shown only once
- revoke instead of hard delete
- require at least one scope
- require either project or user binding for standard keys

## 12.3 Project invariants
- slug unique within tenant
- project must map to exactly one active data DB route

## 12.4 Usage invariants
- every billable action must emit a usage event
- every user-visible quota display must come from summary counters, not raw scans

---

# 13. Example DB routing logic

Given:
- bearer API key
- project id in path or body

The server should:

1. resolve API key from `ApiKey`
2. load tenant from `Tenant`
3. verify plan and status
4. verify project access via `ProjectRegistry`
5. resolve `data_db_id` from `ProjectRegistry` or `TenantDatabaseRegistry`
6. connect/query tenant-data DB
7. perform operation
8. write usage event and summary counter update in control plane

This keeps auth/billing separate from project data access.

---

# 14. Canonical recommendation

## Final schema strategy

### Control-plane DB
Owns:
- identity
- billing
- routing
- quotas
- API keys
- webhooks
- platform audit

### Tenant-data DBs
Own:
- project memory
- notes
- conversations
- chunk registry
- restore metadata
- project activity
- recall job state

### Pooled vs dedicated
- pooled for free/dev
- dedicated for active paid tenants

### Important rule
Even in dedicated DBs:
- keep `tenant_id`
- keep `project_id`

This is the recommended canonical Turso schema design for TekMemo Cloud in Prisma.
