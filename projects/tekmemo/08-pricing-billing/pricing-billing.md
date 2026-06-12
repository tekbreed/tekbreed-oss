# TekMemo Cloud — Canonical Pricing, Billing, API, and API Keys Spec

_Created: 2026-05-02_

## 1. Purpose

This document is the canonical product and commercial specification for **TekMemo Cloud**.

It defines:

- product plans
- quotas and limits
- annual pricing
- add-ons
- hard caps vs soft caps
- billing behavior
- API product design
- API key model
- usage metering
- upgrade and overage rules

It is intended for:

- product
- engineering
- billing implementation
- dashboard design
- docs
- pricing page copy
- support playbooks

This document applies to **TekMemo Cloud** only.

It does **not** define TekMemo OSS/self-host licensing or packaging beyond the cloud boundary.

---

# 2. Product model

TekMemo has two delivery models:

## 2.1 TekMemo OSS / Self-host
Free, open-source, self-hosted.

Users run:

- `@tekbreed/tekmemo`
- `@tekbreed/tekmemo-ai-sdk`
- `@tekbreed/tekmemo-fs`
- `@tekbreed/tekmemo-agentfs`
- `@tekbreed/tekmemo-upstash`
- `@tekbreed/tekmemo-voyage`
- `@tekbreed/tekmemo-openai`

on their own infrastructure.

TekMemo OSS does not consume TekMemo Cloud resources.

---

## 2.2 TekMemo Cloud
Hosted, multi-tenant SaaS.

TekMemo Cloud provides:

- hosted project memory
- hosted sync
- hosted retention/history
- hosted restore points
- hosted recall infrastructure coordination
- hosted usage metering
- hosted API access
- hosted team/project administration

TekMemo Cloud is the paid commercial layer.

---

# 3. Multi-tenant architecture model

TekMemo Cloud should use a **multi-tenant control plane**.

## 3.1 Tenant definition

A **tenant** is an organization/account boundary.

A tenant owns:

- users
- projects
- API keys
- usage counters
- billing/subscription
- memory stores
- vector recall resources
- restore/history resources
- webhooks
- audit data

## 3.2 Project definition

A **project** is the primary memory boundary inside a tenant.

A project owns:

- canonical memory files
- archival notes
- recall history
- chunk registry
- indexing metadata
- restore points
- project-level API keys (if allowed)
- project settings

## 3.3 User definition

A **user** belongs to a tenant.

A user may have:

- a role
- access to one or more projects
- personal API keys
- audit identity
- usage attribution for user-driven actions

---

# 4. Product plans

The final plan ladder is:

1. OSS / Self-host — Free
2. Developer Cloud — Free
3. Pro — $14/month
4. Team — $59/month
5. Business — $169/month
6. Enterprise — Custom

---

# 5. Plan definitions

## 5.1 OSS / Self-host — Free

### Intended user
- developers
- startups self-hosting
- teams wanting full infrastructure control

### Includes
- all OSS packages
- self-hosting
- community support

### Does not include
- hosted cloud resources
- hosted sync
- hosted billing
- hosted restore UI
- hosted multi-tenant admin

### Limit model
Unlimited on TekMemo Cloud because it does not use TekMemo Cloud.

---

## 5.2 Developer Cloud — Free

### Intended user
- evaluation
- proof of concept
- OSS users trying hosted TekMemo Cloud
- solo developers exploring API integration

### Limits
- **1 project**
- **1 user**
- **25 MB memory storage**
- **2,500 indexing operations / month**
- **1,000 recall queries / month**
- **7-day retention**
- **1 API key**
- **0 webhooks**
- **basic API access**
- **community support only**

### Included features
- hosted project memory
- basic dashboard
- basic usage view
- API key management
- basic recall
- core memory editing

### Excluded features
- shared projects
- roles/permissions
- advanced restore UI
- advanced audit history
- add-ons
- priority support

### Limit behavior
- **hard cap**
- no add-ons
- no grace overage
- upgrade required when limits are reached

---

## 5.3 Pro — $14/month

### Intended user
- solo builders
- freelancers
- consultants
- indie product developers

### Limits
- **5 projects**
- **1 user**
- **100 MB memory storage**
- **25,000 indexing operations / month**
- **10,000 recall queries / month**
- **30-day retention**
- **3 API keys**
- **1 webhook endpoint**
- **basic restore points**
- **basic audit/history**

### Included features
- hosted sync
- restore points
- project dashboard
- API access
- usage dashboard
- basic billing dashboard

### Excluded features
- team collaboration
- multi-user permissions
- advanced analytics
- enterprise auth

### Limit behavior
- hard cap on projects
- hard cap on users
- soft cap on usage
- add-ons allowed
- small grace buffer allowed

---

## 5.4 Team — $59/month

### Intended user
- startups
- small engineering teams
- internal platform teams
- teams sharing memory-enabled projects

### Limits
- **20 projects**
- **10 users**
- **1 GB memory storage**
- **150,000 indexing operations / month**
- **75,000 recall queries / month**
- **90-day retention**
- **10 API keys**
- **10 webhook endpoints**
- **shared projects**
- **basic roles and permissions**
- **checkpoint restore UI**
- **basic audit trail**

### Included features
- team members
- shared projects
- project-level admin
- better restore/history
- quota warnings
- priority support

### Excluded features
- advanced audit exports
- SSO
- advanced admin analytics
- SLA

### Limit behavior
- hard cap on projects
- hard cap on users
- soft cap on usage
- add-ons allowed
- small grace buffer allowed

---

## 5.5 Business — $169/month

### Intended user
- production teams
- SaaS teams
- platform teams
- businesses running multiple memory-enabled apps

### Limits
- **100 projects**
- **25 users**
- **10 GB memory storage**
- **750,000 indexing operations / month**
- **300,000 recall queries / month**
- **180-day retention**
- **50 API keys**
- **50 webhook endpoints**
- **advanced audit/history**
- **usage analytics**
- **admin controls**
- **better restore/history controls**

### Included features
- stronger tenant administration
- analytics
- advanced history
- richer quota visibility
- more operational controls
- faster support

### Excluded features
- SSO/SAML
- dedicated SLA
- custom contract terms
- dedicated onboarding

### Limit behavior
- hard cap on projects
- hard cap on users
- soft cap on usage
- add-ons allowed
- small grace buffer allowed

---

## 5.6 Enterprise — Custom

### Intended user
- larger organizations
- compliance-sensitive teams
- businesses requiring contracts and support guarantees

### Includes
- custom users/projects
- custom storage
- custom indexing
- custom recall volume
- custom retention
- SSO / SAML
- onboarding
- SLA
- audit exports
- dedicated support
- private deployment guidance
- negotiated API limits
- optional service accounts

---

# 6. Annual pricing

Use approximately **15% annual discount**.

## Final annual prices

| Plan | Monthly | Annual |
|---|---:|---:|
| Pro | $14/month | **$143/year** |
| Team | $59/month | **$599/year** |
| Business | $169/month | **$1,699/year** |

Enterprise is custom.

## Billing behavior for annual plans
- annual billing is paid upfront
- annual plans receive the same monthly-equivalent quotas, reset monthly
- unused quota does not roll over by default
- annual discount does not stack with other general discounts unless explicitly allowed

---

# 7. Metering model

TekMemo Cloud should meter product-facing resources, not raw infrastructure internals.

## 7.1 Metered dimensions

The primary billable dimensions are:

1. **projects**
2. **users**
3. **memory storage**
4. **indexing operations**
5. **recall queries**
6. **retention**
7. **API keys**
8. **webhook endpoints**

## 7.2 Definitions

### Project
A hosted memory workspace boundary under a tenant.

### User
A member of a tenant with access to at least one project.

### Memory storage
Durable hosted memory data stored for a tenant/project.

Includes:
- canonical memory
- archival notes
- recall history records
- retained restore snapshots within the plan retention window

Does not include:
- transient request payloads
- ephemeral processing buffers
- expired or purged retention data

### Indexing operation
One meaningful chunk indexing event.

This should mean:
- one chunk embedded and written for recall
or
- one existing chunk re-embedded and updated

It should not mean:
- every keystroke
- every internal database write
- every small autosave event

### Recall query
One top-level semantic recall request triggered by the user or the user’s application.

It should not mean:
- internal reranking steps
- internal metadata filters
- hidden subqueries you trigger internally

### Retention
The duration durable history and restore data remain available.

---

# 8. Hard caps vs soft caps

## 8.1 Hard caps
Use hard caps for:
- projects
- users
- API keys
- webhook endpoints
- retention window on lower tiers
- all free-tier usage

## 8.2 Soft caps
Use soft caps for paid tiers on:
- indexing operations
- recall queries
- storage

## 8.3 Grace buffer
Paid tiers should receive a small temporary grace buffer.

Recommended:
- **up to 5% over included usage**
- once exceeded, writes or queries pause until:
  - add-on is added
  - plan is upgraded
  - usage period resets

Developer Cloud gets **no grace buffer**.

---

# 9. Add-ons

Do not launch with pay-as-you-go as the default pricing model.

Launch with add-on packs for paid tiers.

## 9.1 Indexing Pack
- **+25,000 indexing operations / month**
- **$8/month**

## 9.2 Recall Pack
- **+25,000 recall queries / month**
- **$6/month**

## 9.3 Storage Pack
- **+5 GB storage**
- **$10/month**

## 9.4 Retention Pack
- **+90 days retention**
- **$12/month**

## 9.5 Extra User Pack
Team and Business only
- **+5 users**
- **$15/month**

## 9.6 Extra Project Pack
Pro, Team, and Business
- **+10 projects**
- **$10/month**

## 9.7 Add-on rules
- add-ons are monthly recurring unless purchased as annual add-ons
- add-ons apply immediately after purchase
- add-ons can be removed at the next billing cycle if usage is back under included limits
- add-ons do not stack beyond reasonable internal safety thresholds without support intervention

Developer Cloud gets **no add-ons**.

Enterprise gets **custom negotiated allocations** instead of standard add-ons.

---

# 10. Limit behavior and enforcement

## 10.1 Warning thresholds
Send warnings at:
- 70%
- 85%
- 95%

Channels:
- in-app banners
- tenant admin email
- optional webhook event

## 10.2 At 100% usage

### Developer Cloud
- hard stop
- upgrade required

### Paid plans
- apply grace buffer up to 5%
- after grace is exhausted:
  - indexing pauses
  - recall pauses or degrades gracefully
  - additional storage writes are blocked until upgrade/add-on/reset

## 10.3 Recommended UX
For paid plans:
- do not silently fail
- clearly show:
  - current usage
  - exceeded quota
  - recommended add-on
  - upgrade path

---

# 11. Feature matrix

| Feature | Developer Cloud | Pro | Team | Business | Enterprise |
|---|---|---|---|---|---|
| Hosted cloud | Yes | Yes | Yes | Yes | Yes |
| Projects | 1 | 5 | 20 | 100 | Custom |
| Users | 1 | 1 | 10 | 25 | Custom |
| Memory storage | 25 MB | 100 MB | 1 GB | 10 GB | Custom |
| Indexing ops / month | 2,500 | 25,000 | 150,000 | 750,000 | Custom |
| Recall queries / month | 1,000 | 10,000 | 75,000 | 300,000 | Custom |
| Retention | 7 days | 30 days | 90 days | 180 days | Custom |
| API keys | 1 | 3 | 10 | 50 | Custom |
| Webhooks | 0 | 1 | 10 | 50 | Custom |
| Shared projects | No | No | Yes | Yes | Yes |
| Roles/permissions | No | No | Basic | Advanced | Advanced |
| Restore UI | No | Basic | Yes | Advanced | Advanced |
| Audit trail | No | Basic | Basic | Advanced | Advanced |
| Usage analytics | No | No | Basic | Yes | Yes |
| SSO/SAML | No | No | No | No | Yes |
| SLA | No | No | No | No | Yes |

---

# 12. Billing model

## 12.1 Billing units
Bills should be tied to:
- plan subscription
- active add-ons
- annual vs monthly cadence

## 12.2 Billing cadence
Support:
- monthly
- annual

## 12.3 Upgrade behavior
Recommended:
- upgrades are prorated immediately
- higher limits become active immediately

## 12.4 Downgrade behavior
Recommended:
- downgrades take effect at next billing cycle
- warn user if current usage exceeds future plan limits

## 12.5 Cancellation behavior
Recommended:
- access remains through end of billing period
- data retention on cancellation should be clearly documented
- optionally provide export before deletion

## 12.6 Failed payments
Recommended:
- grace period of 3–7 days
- warnings to tenant admins
- pause write operations before permanent suspension
- do not immediately delete data

---

# 13. API product model

TekMemo Cloud should expose a hosted API.

## 13.1 API goals
The API should let customers:

- create and manage projects
- read and update memory
- append notes and recall history
- index memory
- query recall
- inspect usage
- manage API keys and webhooks where allowed

## 13.2 Launch API scope
V1 should expose only the essential product surface.

### Projects
- create project
- list projects
- get project
- update project metadata

### Memory
- read core memory
- update core memory
- append notes
- append conversation entries

### Recall
- submit chunks for indexing
- query recall results

### Usage
- current usage summary
- current plan limits
- current quota status

### API keys
- create
- list
- revoke

### Webhooks
- create
- list
- revoke

---

# 14. API authentication

## 14.1 Authentication model
Use **API keys** as the primary v1 authentication model.

This is the correct v1 choice because API keys are:

- familiar
- easy to implement
- easy for backend integrations
- well suited for server-to-server use
- easy to meter and revoke

## 14.2 Header format
Use:

```http
Authorization: Bearer <api_key>
```

Do not lead with a custom header unless there is a strong internal reason.

---

# 15. API key model

## 15.1 API key ownership
Every key belongs to:
- a tenant
- optionally a user
- optionally a project
- a permissions scope set

## 15.2 API key fields
Each key should store:

- internal id
- public prefix for display
- hashed secret
- tenant id
- optional user id
- optional project id
- human-readable label
- scopes
- created at
- last used at
- revoked at / revoked flag

Never store raw secrets in plaintext after creation.

## 15.3 API key visibility
Show only:
- prefix
- label
- scope summary
- created at
- last used at

The full secret should only be shown once at creation.

---

# 16. API key types

## 16.1 User API key
Good for:
- personal scripts
- testing
- solo integrations

Bound to:
- tenant
- user
- optional project

## 16.2 Project API key
Good for:
- project-scoped app integration
- server-side access limited to one project

Bound to:
- tenant
- project

## 16.3 Service account API key
Useful later for:
- automation
- CI/CD
- backend-only integrations

### Launch recommendation
Launch with:
- user keys
- project keys

Add service accounts later if needed.

---

# 17. API key scopes

Recommended scopes:

- `project:read`
- `project:write`
- `memory:read`
- `memory:write`
- `memory:index`
- `memory:recall`
- `usage:read`
- `webhook:manage`
- `apikey:manage`

## Scope rules
- Developer Cloud: minimal scopes only
- Pro: user and project-scoped keys
- Team and Business: user and project-scoped keys with broader management features
- Enterprise: custom policies possible

---

# 18. API authorization flow

Every request should flow like this:

1. parse bearer token
2. resolve API key
3. validate hash match and revocation state
4. resolve tenant
5. resolve optional project binding
6. check scopes
7. check plan and quota
8. perform operation
9. record usage
10. return response

This is the correct multi-tenant control-plane behavior.

---

# 19. API rate limits

Monthly quotas are not enough.

Also apply rate limits.

## Suggested request-rate limits

| Plan | Requests / minute |
|---|---:|
| Developer Cloud | 60 |
| Pro | 300 |
| Team | 1,000 |
| Business | 3,000 |
| Enterprise | Custom |

Rate limits are for abuse control, not billing.

---

# 20. API connection model

## 20.1 How customers connect
Customers integrate TekMemo Cloud by:

1. creating a tenant/account
2. creating a project
3. generating an API key
4. using the key in their backend/server
5. calling hosted memory and recall endpoints

## 20.2 Recommended integration guidance
Tell customers clearly:

- keep API keys on the server
- do not expose API keys in public frontend code
- use project-scoped keys where possible
- rotate keys when staff or environments change

---

# 21. Webhooks

TekMemo Cloud should support webhooks.

## 21.1 Recommended events
- `memory.updated`
- `indexing.completed`
- `indexing.failed`
- `recall.ready`
- `usage.warning`
- `quota.exceeded`
- `restorepoint.created`

## 21.2 Plan support
- Developer Cloud: none
- Pro: 1
- Team: 10
- Business: 50
- Enterprise: custom

## 21.3 Webhook security
Use:
- signing secret
- replay protection
- retry policy
- delivery logs in dashboard

---

# 22. Usage recording

Every billable or quota-relevant action should produce usage events.

## 22.1 Usage events should record
- tenant id
- project id
- user id if available
- event type
- quantity
- timestamp
- source (dashboard, API, system)
- request id

## 22.2 Usage event types
- indexing operation
- recall query
- storage growth event
- API request
- key creation
- webhook delivery

Not all need to be customer-visible, but billable ones must be auditable.

---

# 23. Dashboard pages required to support pricing and API

To make this pricing system real, TekMemo Cloud needs these pages:

## 23.1 Billing
- current plan
- monthly vs annual
- renewal date
- invoice history
- add-ons
- upgrade/downgrade controls

## 23.2 Usage
- current usage by category
- limits
- warning states
- overage/add-on suggestions

## 23.3 API keys
- create key
- list keys
- revoke key
- last used
- scopes
- project/user binding

## 23.4 Webhooks
- create endpoint
- list endpoints
- delivery logs
- retries
- signing secret info

## 23.5 Projects
- project count
- project-level quota visibility
- project API keys if allowed

---

# 24. Product copy recommendations

## Pricing page positioning
TekMemo Cloud should be positioned as:

**Hosted, multi-tenant memory infrastructure for AI apps and agents.**

## Value framing
Customers are paying for:

- hosted sync
- durable memory storage
- recall infrastructure
- restore/history
- team/project management
- hosted API access
- usage control and visibility

Not just “Markdown memory.”

---

# 25. Recommended launch defaults

## Pricing
- Developer Cloud — Free
- Pro — $14/month
- Team — $59/month
- Business — $169/month
- Enterprise — Custom

## Annual
- Pro — $143/year
- Team — $599/year
- Business — $1,699/year

## Add-ons
- Indexing Pack — $8
- Recall Pack — $6
- Storage Pack — $10
- Retention Pack — $12
- Extra User Pack — $15
- Extra Project Pack — $10

## Auth
- API keys only at launch
- Bearer auth
- user keys + project keys

---

# 26. Still-open implementation decisions

These should be finalized during build, but they do not block pricing launch copy.

## 26.1 Should Developer Cloud have 0 or 1 webhook?
Recommendation:
- give it **0**
- keep webhooks as paid differentiation

## 26.2 Should storage include snapshots fully?
Recommendation:
- yes, if retained and customer-visible
- no, if short-lived internal temp artifacts

## 26.3 Should Team get analytics?
Recommendation:
- basic usage summary only
- keep deeper analytics for Business

## 26.4 Should add-ons be self-serve from day one?
Recommendation:
- yes for Pro/Team/Business if billing implementation is ready
- otherwise support upgrades first, add add-ons shortly after launch

---

# 27. Final canonical summary

## Plans
- OSS / Self-host — Free
- Developer Cloud — Free
- Pro — $14/month
- Team — $59/month
- Business — $169/month
- Enterprise — Custom

## Billing model
- fixed subscription plans
- annual discount
- add-on packs
- hard caps for structure
- soft caps for usage on paid tiers
- hard caps on free cloud

## API model
- hosted API included
- API keys for auth
- user keys and project keys
- bearer auth
- tenant-aware, project-aware authorization
- plan-aware quota enforcement

## Product model
- multi-tenant cloud
- project-scoped memory
- usage metering across indexing, recall, storage, users, and projects

This is the final recommended product, billing, API, and API key structure for TekMemo Cloud.
