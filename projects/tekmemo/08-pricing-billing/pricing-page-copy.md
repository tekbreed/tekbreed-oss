# TekMemo Cloud — Pricing Page Copy and Dashboard IA

_Created: 2026-05-02_

This document is the design-ready companion to:

- `tekmemo-cloud-pricing-billing-api-spec.md`

It is intended for:

- product design
- landing page design
- pricing page implementation
- dashboard information architecture
- growth pages
- onboarding flows
- API docs coordination

It contains:

1. pricing page copy
2. feature and limits copy
3. plan comparison copy
4. FAQ copy
5. dashboard IA
6. page-level structure for cloud app design
7. recommended navigation
8. billing and API management page structure

---

# 1. Pricing page goals

The pricing page must do four things clearly:

1. explain what TekMemo Cloud is
2. show why users would choose cloud over self-hosting
3. make the plan differences obvious
4. make upgrade decisions easy

The page should avoid sounding like:

- generic vector DB pricing
- generic AI token pricing
- generic SaaS storage pricing

The page should position TekMemo Cloud as:

## Hosted, multi-tenant memory infrastructure for AI apps and agents

The value is:

- hosted sync
- durable memory storage
- recall infrastructure
- restore/history
- API access
- team/project management
- usage controls
- predictable pricing

---

# 2. Pricing page hero copy

## Headline options

### Option A
**Simple pricing for hosted memory infrastructure**

### Option B
**Ship memory-enabled AI apps without building the backend yourself**

### Option C
**Hosted memory, recall, sync, and APIs for production AI apps**

## Recommended headline
**Hosted memory infrastructure for AI apps and agents**

## Subheadline
TekMemo Cloud gives you hosted project memory, recall APIs, sync, restore history, and multi-tenant controls — without forcing you to build the entire memory layer yourself.

## Primary CTA
**Start free**

## Secondary CTA
**Use OSS / Self-host**

## Supporting note
Start with Developer Cloud or self-host TekMemo for free. Upgrade only when you need more projects, more usage, team collaboration, and stronger controls.

---

# 3. Positioning block

## Section heading
**Two ways to use TekMemo**

## Card 1 — OSS / Self-host
### Title
**Self-host TekMemo**

### Copy
Use the open-source packages on your own infrastructure. Best for developers who want full control or already have their own platform stack.

### CTA
**View OSS**

## Card 2 — TekMemo Cloud
### Title
**Use TekMemo Cloud**

### Copy
Use the hosted version with built-in sync, usage metering, API keys, restore points, and tenant/project management.

### CTA
**Start free**

---

# 4. Pricing cards copy

## Developer Cloud — Free

### Label
**Developer Cloud**

### Price
**$0**

### Tagline
For trying hosted TekMemo

### Short description
A tightly limited hosted plan for evaluating the dashboard, API, and hosted memory workflow.

### Included bullets
- 1 project
- 1 user
- 25 MB storage
- 2,500 indexing ops / month
- 1,000 recall queries / month
- 7-day retention
- 1 API key

### CTA
**Start free**

### Footnote
Best for testing integrations and evaluating the hosted product.

---

## Pro — $14/month

### Label
**Pro**

### Price
**$14/mo**

### Annual note
**$143/year**

### Tagline
For solo builders

### Short description
A production-ready solo plan for developers shipping memory-enabled AI products.

### Included bullets
- 5 projects
- 1 user
- 100 MB storage
- 25,000 indexing ops / month
- 10,000 recall queries / month
- 30-day retention
- 3 API keys
- 1 webhook endpoint

### CTA
**Choose Pro**

### Footnote
Great for indie products, freelancers, and solo internal tools.

---

## Team — $59/month

### Label
**Team**

### Price
**$59/mo**

### Annual note
**$599/year**

### Tagline
For startups and small teams

### Short description
Collaboration, shared projects, stronger quotas, and the controls small teams need.

### Included bullets
- 20 projects
- 10 users
- 1 GB storage
- 150,000 indexing ops / month
- 75,000 recall queries / month
- 90-day retention
- 10 API keys
- 10 webhook endpoints
- shared projects

### CTA
**Choose Team**

### Footnote
Built for teams building together on top of hosted memory infrastructure.

---

## Business — $169/month

### Label
**Business**

### Price
**$169/mo**

### Annual note
**$1,699/year**

### Tagline
For production teams

### Short description
Advanced controls, better history, stronger quotas, and better operational visibility for serious usage.

### Included bullets
- 100 projects
- 25 users
- 10 GB storage
- 750,000 indexing ops / month
- 300,000 recall queries / month
- 180-day retention
- 50 API keys
- 50 webhook endpoints
- advanced audit/history
- usage analytics

### CTA
**Choose Business**

### Footnote
Best for platform teams and companies running memory as part of production systems.

---

## Enterprise — Custom

### Label
**Enterprise**

### Price
**Custom**

### Tagline
For larger organizations

### Short description
Custom limits, SSO, contracts, onboarding, and support for teams with security and governance requirements.

### Included bullets
- custom projects and users
- custom storage and usage
- SSO / SAML
- SLA
- onboarding
- audit exports
- dedicated support
- private deployment guidance

### CTA
**Talk to sales**

### Footnote
For larger organizations with stricter governance and support needs.

---

# 5. Pricing toggles

The pricing page should support:

## Billing toggle
- Monthly
- Annual

## Annual savings callout
Use:
**Save ~15% with annual billing**

---

# 6. Add-ons section copy

## Section heading
**Scale without changing plans**

## Section subheading
Paid plans can expand with add-ons instead of forcing an immediate upgrade.

## Add-on cards

### Indexing Pack
- +25,000 indexing operations / month
- $8/month

### Recall Pack
- +25,000 recall queries / month
- $6/month

### Storage Pack
- +5 GB storage
- $10/month

### Retention Pack
- +90 days retention
- $12/month

### Extra User Pack
- +5 users
- $15/month
- Team and Business only

### Extra Project Pack
- +10 projects
- $10/month

## Add-on note
Developer Cloud does not support add-ons. Enterprise limits are custom.

---

# 7. Plan comparison table copy

## Section heading
**Compare plans**

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
| Roles and permissions | No | No | Basic | Advanced | Advanced |
| Restore UI | No | Basic | Yes | Advanced | Advanced |
| Audit trail | No | Basic | Basic | Advanced | Advanced |
| Usage analytics | No | No | Basic | Yes | Yes |
| SSO / SAML | No | No | No | No | Yes |
| SLA | No | No | No | No | Yes |

---

# 8. Pricing FAQ copy

## FAQ 1
### Question
Can I use TekMemo for free?

### Answer
Yes. You can self-host TekMemo for free using the open-source packages, or use Developer Cloud for a tightly limited hosted plan.

---

## FAQ 2
### Question
What is the difference between TekMemo OSS and TekMemo Cloud?

### Answer
TekMemo OSS is self-hosted and runs on your own infrastructure. TekMemo Cloud is the hosted version with managed sync, hosted history and restore, API key management, usage metering, and multi-tenant administration.

---

## FAQ 3
### Question
What happens when I hit my plan limits?

### Answer
Developer Cloud uses hard caps and requires an upgrade when limits are reached. Paid plans use hard caps for projects and users, and soft caps with a small grace buffer for usage. Add-ons can expand indexing, recall, storage, retention, users, or projects.

---

## FAQ 4
### Question
Do you offer pay-as-you-go pricing?

### Answer
Not as the primary launch model. TekMemo Cloud uses clear fixed plans with optional add-ons so pricing stays predictable.

---

## FAQ 5
### Question
Can I use the API on the free plan?

### Answer
Yes. Developer Cloud includes basic API access with a small quota and one API key.

---

## FAQ 6
### Question
What counts as an indexing operation?

### Answer
An indexing operation is one meaningful chunk that is embedded and written into recall storage, or one existing chunk that is re-embedded and updated.

---

## FAQ 7
### Question
What counts as a recall query?

### Answer
A recall query is one top-level semantic recall request made through TekMemo Cloud. Internal filtering and retrieval plumbing are not counted separately.

---

## FAQ 8
### Question
Can I upgrade later without losing data?

### Answer
Yes. Upgrades should be immediate, and paid plans are designed to expand quotas, retention, and admin capabilities without forcing a migration.

---

## FAQ 9
### Question
Can I start with self-hosting and move to cloud later?

### Answer
Yes. TekMemo is designed so teams can begin with OSS and adopt TekMemo Cloud when they want hosted infrastructure and team controls.

---

# 9. Pricing page IA

## Recommended page sections in order

1. Hero
2. OSS vs Cloud split
3. Pricing cards
4. Billing toggle
5. Plan comparison table
6. Add-ons
7. FAQ
8. Final CTA

## Final CTA block
### Heading
**Start free, then scale when your usage becomes real**

### Copy
Use Developer Cloud for evaluation, Pro for solo production use, or move into Team and Business as your memory layer becomes part of a real product or internal platform.

### CTAs
- Start free
- View OSS
- Talk to sales

---

# 10. TekMemo Cloud dashboard IA

The dashboard should be organized around the product model, not around raw infrastructure.

## Primary navigation

### Top-level nav
- Overview
- Projects
- Memory
- Recall
- Usage
- Billing
- API
- Webhooks
- Team
- Settings

---

# 11. Dashboard page structure

## 11.1 Overview

### Goal
Give the user a fast understanding of:

- current plan
- key usage numbers
- project count
- recall/indexing activity
- warnings
- recent changes

### Page sections
- current plan card
- usage summary cards
- recent project activity
- quota alerts
- recent recall/indexing events
- upgrade/add-on recommendation banner if relevant

### Key cards
- Projects used / limit
- Storage used / limit
- Indexing ops this month / limit
- Recall queries this month / limit
- Retention window
- Active API keys

---

## 11.2 Projects

### Goal
Manage hosted memory projects.

### List view
- project name
- environment or label
- storage used
- indexing volume
- recall volume
- last activity
- members count (where applicable)
- actions menu

### Project details
Sections:
- project summary
- project usage
- project settings
- project API keys
- project members (Team+)
- project memory access
- project restore points
- project activity log

---

## 11.3 Memory

### Goal
Manage durable memory content.

### Views
- Core Memory
- Notes
- Conversations / Recall History
- Restore History

### Core Memory view
- Markdown editor or structured editor
- save state
- last updated
- audit sidebar
- promote/supersede tools if later added

### Notes view
- note list
- filters
- search
- timestamps
- source labels

### Conversations / Recall History
- append history list
- summarized entries
- search/filter
- export if allowed later

---

## 11.4 Recall

### Goal
Expose the recall layer as a product concept.

### Sections
- recall query tester
- recent recall queries
- indexed chunk volume
- retrieval quality notes
- indexing status
- failed indexing jobs
- recall usage meter

### Good design principle
Do not make this page look like a raw vector DB console.

Make it feel like:
- semantic memory retrieval
- scoped by project
- understandable to product teams

---

## 11.5 Usage

### Goal
Make limits and quotas transparent.

### Sections
- current billing period summary
- usage charts by category
- limit bars
- warning states
- add-on suggestions
- historical usage trend

### Categories shown
- storage
- indexing
- recall
- API request rate health
- active API keys
- webhooks used

---

## 11.6 Billing

### Goal
Manage subscription and commercial settings.

### Sections
- current plan
- monthly vs annual switch
- upcoming renewal date
- invoices
- payment method
- add-ons
- upgrade/downgrade controls
- cancellation controls

### Important UX behavior
Show:
- what changes immediately
- what changes next billing cycle
- what happens if current usage exceeds a lower plan

---

## 11.7 API

### Goal
Give developers a clean place to manage hosted API access.

### Subpages
- API Keys
- API Docs
- Usage
- Rate Limits

### API Keys page
- create key
- key type (user or project)
- scopes
- label
- created at
- last used
- revoke

### Docs entry
- getting started
- auth format
- endpoint groups
- examples
- SDK references later if added

### Usage subpage
- API request volume
- errors
- top endpoints
- rate-limit state

---

## 11.8 Webhooks

### Goal
Manage webhook integrations.

### List page
- endpoint URL
- event subscriptions
- status
- last delivery
- secret rotation
- actions

### Detail page
- endpoint metadata
- event selection
- delivery attempts
- failures
- retry controls
- signing secret info

---

## 11.9 Team

### Goal
Manage multi-user access on Team+ plans.

### Sections
- members
- invitations
- roles
- access summary
- project assignments

### Roles
Suggested initial roles:
- Owner
- Admin
- Member
- Read-only

---

## 11.10 Settings

### Goal
Manage tenant-level settings.

### Sections
- tenant profile
- security
- retention defaults
- project defaults
- notifications
- data export/deletion requests
- audit preferences
- branding later if needed

---

# 12. API key UX copy

## Page heading
**API Keys**

## Intro copy
Create API keys to connect your backend and services to TekMemo Cloud. Keep keys on the server, scope them narrowly, and rotate them when environments or teams change.

## Create key modal fields
- Key name
- Key type
  - User key
  - Project key
- Project binding (if project key)
- Scopes
- Optional note/description

## After create success state
### Heading
**Copy your key now**

### Body
This is the only time the full secret will be shown. Store it securely. TekMemo Cloud will only show the key prefix after this step.

### Actions
- Copy key
- Done

---

# 13. Billing UX copy

## Current plan card
### Label
Current plan

### Example content
**Team**
Renews on June 2, 2026  
Includes 20 projects, 10 users, 1 GB storage, 150,000 indexing ops/month, and 75,000 recall queries/month.

## Usage warning card
### Heading
**You are nearing your indexing limit**

### Body
You have used 85% of your monthly indexing operations. Add an Indexing Pack or upgrade your plan to avoid interruptions.

### CTA
- Add Indexing Pack
- Compare plans

---

# 14. Upgrade flow copy

## Upgrade modal heading
**Upgrade your plan**

## Copy
Your new plan limits will apply immediately. Billing will be prorated for the remainder of your current billing cycle.

## Confirm CTA
**Upgrade now**

---

# 15. Downgrade flow copy

## Downgrade modal heading
**Downgrade plan**

## Copy
Your downgrade will take effect at the next billing cycle. If your current usage exceeds the target plan’s limits, some features or write operations may pause when the downgrade becomes active.

## Confirm CTA
**Schedule downgrade**

---

# 16. Empty states

## No projects
### Heading
**Create your first project**

### Body
Projects are the primary memory boundary inside TekMemo Cloud. Create a project to start editing core memory, appending notes, and using recall.

### CTA
**Create project**

---

## No API keys
### Heading
**Create your first API key**

### Body
Use API keys to connect your backend to TekMemo Cloud. We recommend project-scoped keys whenever possible.

### CTA
**Create API key**

---

## No webhooks
### Heading
**No webhook endpoints yet**

### Body
Create a webhook endpoint to receive events like memory updates, indexing completion, and quota warnings.

### CTA
**Create webhook**

---

# 17. Design principles for the cloud app

## Principle 1
Do not design it like a generic infra admin console.

## Principle 2
Make plans and quotas visible, but not overwhelming.

## Principle 3
Keep memory and recall understandable as product concepts.

## Principle 4
Make API and billing feel first-class, not bolted on.

## Principle 5
Use upgrade and add-on prompts sparingly and only when justified.

---

# 18. Minimal first release dashboard scope

If the first release must be smaller, build only these pages first:

- Overview
- Projects
- Memory
- Usage
- Billing
- API Keys
- Settings

Then add:
- Recall
- Webhooks
- Team

after the core product loop is stable.

---

# 19. Final design-ready summary

## Pricing page should communicate
- open source vs cloud clearly
- predictable pricing
- hosted value
- clear quotas
- clear upgrade path

## Dashboard should support
- project management
- memory editing
- recall visibility
- usage transparency
- billing controls
- API key management

This document should be used together with the canonical pricing/billing/API spec when designing TekMemo Cloud.
