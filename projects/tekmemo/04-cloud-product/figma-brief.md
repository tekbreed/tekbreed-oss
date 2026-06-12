# TekMemo Cloud — Figma Design Brief v2

_Created: 2026-05-02_

Design a production-grade SaaS application for **TekMemo Cloud**.

## Product positioning
TekMemo Cloud is **hosted, multi-tenant memory infrastructure for AI apps and agents**.

It combines:
- hosted project memory
- recall APIs
- sync and restore history
- API keys and webhooks
- usage metering
- billing
- tenant/project administration

## Core product concepts
- **Tenant** = organization/account boundary
- **Project** = primary memory boundary inside a tenant
- **Memory** = core memory, notes, conversations/recall history
- **Recall** = semantic search / retrieval layer
- **API** = project/user scoped access through API keys
- **Billing** = plans, quotas, add-ons, annual billing
- **Usage** = indexing ops, recall queries, storage, users, projects

## Plans
- OSS / Self-host — Free
- Developer Cloud — Free
- Pro — $14/month
- Team — $59/month
- Business — $169/month
- Enterprise — Custom

## Billing model
- monthly + annual
- annual saves ~15%
- add-ons:
  - Indexing Pack
  - Recall Pack
  - Storage Pack
  - Retention Pack
  - Extra User Pack
  - Extra Project Pack

## Product navigation
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

## Pages to design

### 1. Marketing site / landing page
Need:
- hero
- OSS vs Cloud comparison
- how it works
- pricing preview
- API highlight
- cloud features
- final CTA

### 2. Pricing page
Need:
- billing toggle (monthly/annual)
- five plan cards
- comparison table
- add-ons section
- FAQ
- CTA blocks

### 3. Overview dashboard
Need:
- current plan
- quota cards
- usage progress bars
- project count
- recent activity
- upgrade/add-on recommendations
- alerts

### 4. Projects list page
Need:
- search
- filters
- project cards/table
- storage used
- indexing volume
- recall volume
- members count
- last activity
- create project CTA

### 5. Project details page
Need:
- project summary
- usage
- memory shortcuts
- API keys for project
- members
- restore points
- activity log

### 6. Memory page
Subviews:
- Core Memory
- Notes
- Conversations / Recall History
- Restore History

Need:
- markdown editor or structured editor
- note list
- search
- timestamps
- history/audit sidebar

### 7. Recall page
Need:
- semantic recall tester
- recent recall queries
- indexed chunk stats
- indexing status
- failed jobs
- usage meter

### 8. Usage page
Need:
- current billing period usage
- category charts
- limits vs used
- warnings
- add-on suggestions
- history trend

### 9. Billing page
Need:
- current plan
- annual/monthly state
- upgrade/downgrade controls
- add-ons
- invoices
- payment method
- renewal date

### 10. API page
Subpages:
- API Keys
- Docs access
- API Usage
- Rate Limits

### 11. API keys page
Need:
- create key modal
- key type selector
  - User key
  - Project key
- scopes
- revoke flow
- one-time secret reveal state
- last used

### 12. Webhooks page
Need:
- create webhook endpoint
- list endpoints
- events subscribed
- delivery logs
- signing secret info
- retries

### 13. Team page
Need:
- members
- invitations
- roles
- project access
- role badges

### 14. Settings page
Need:
- tenant profile
- retention defaults
- security
- notifications
- data/export controls

## Required UX patterns
- very clear quota visualization
- upgrade prompts only when justified
- technical but polished SaaS look
- strong information hierarchy
- dashboard should feel product-led, not infra-console-heavy

## Design language
- production-ready SaaS
- clean, modern, high-contrast
- minimal but serious
- suitable for technical founders, engineers, and product teams
- both **light and dark mode**

## Visual direction
- premium but restrained
- not playful
- not overly enterprise-grey
- sharp cards
- clear tables
- strong chart readability
- elegant empty states
- clean settings and billing UX

## Components that must exist
- plan cards
- quota cards
- usage bars
- project table
- audit log list
- API key table
- webhook delivery table
- pricing comparison table
- billing switch
- upgrade modal
- create API key modal
- create project modal

## Important design constraints
- Keep **Projects** central, because projects are the product boundary
- Keep **Usage** and **Billing** very understandable
- Make **API** and **Memory** first-class navigation items
- Show a difference between free and paid capabilities clearly
- Make Team/Business feel like real upgrades, not just bigger quotas

## Deliverables
Design:
1. landing page
2. pricing page
3. overview dashboard
4. projects list
5. project details
6. memory page
7. recall page
8. usage page
9. billing page
10. API keys page
11. webhooks page
12. team page
13. settings page

Generate all major screens in:
- light mode
- dark mode

## Tone
The product should feel like:
- a serious developer infrastructure SaaS
- purpose-built for AI memory systems
- more understandable than generic infra tools
- more trustworthy than black-box memory APIs
