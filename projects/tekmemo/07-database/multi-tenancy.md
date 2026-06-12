# Multi-Tenancy Design

## Core decision

TekMemo Cloud should use a hybrid multi-tenant database design:

1. one shared control-plane database
2. pooled tenant-data database(s) for free/dev users
3. dedicated tenant-data databases for serious paid tenants

---

# Control-plane database

Owns:

- tenants
- users
- memberships
- subscriptions
- API keys
- webhooks
- usage counters
- tenant database registry
- project registry

Why:

The app must authenticate, authorize, route, and enforce plans before touching tenant data.

---

# Tenant-data databases

Own:

- projects
- memory documents
- notes
- conversations
- chunk registry
- recall jobs
- restore metadata
- activity logs

---

# Pooled tenant DB

Use for:

- Developer Cloud Free
- small early Pro tenants

Every query must filter by:

- tenant ID
- project ID where applicable

---

# Dedicated tenant DB

Use for:

- active Team tenants
- Business tenants
- Enterprise tenants

Still keep `tenant_id` and `project_id` on rows so code paths remain consistent.

---

# Migration trigger examples

Move pooled -> dedicated when:

- tenant upgrades to Business
- storage grows beyond threshold
- recall/indexing usage grows beyond threshold
- enterprise isolation is requested
- support needs blast-radius isolation

---

# Routing flow

```txt
request
  -> validate session/API key
  -> resolve tenant
  -> resolve project
  -> check plan/quota
  -> read data_db_id from registry
  -> connect to tenant-data DB
  -> execute operation
```
