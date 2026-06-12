# TekMemo — Week 2 Daily Execution Checklist

_Created: 2026-05-02_

## Purpose

This document is the **daily execution checklist for Week 2** of the TekMemo 4-week survival plan.

Week 2 exists to produce one thing:

## By the end of Week 2, you must have a real developer-facing beta core:
- API keys working
- notes flow working
- basic recall working
- minimal usage tracking working
- docs app usable
- OSS repo ready for public release
- cloud beta demoable beyond just core memory

If Week 2 slips, Week 3 public launch becomes weak or fake.

---

# Week 2 mission

At the end of this week, you must be able to do this:

1. create or view a project
2. update core memory
3. append notes
4. generate an API key
5. call the API with bearer auth
6. trigger indexing
7. run a recall query
8. see basic usage numbers
9. show a docs page that explains how to use TekMemo

That is the target.

---

# Week 2 scope rules

## Build only these things this week
- API keys
- notes flow
- minimal recall pipeline
- minimal usage tracking
- docs app minimum
- OSS release prep
- basic cloud demo polish

## Do not build this week
- full billing system
- full pricing enforcement depth
- webhooks if they slow you down
- advanced team permissions
- advanced restore UX
- advanced analytics
- public launch polish beyond what is needed
- multiple embedders in cloud beta
- complex background job dashboards
- enterprise anything

---

# Day 8 — API keys foundation

## Day 8 goal
By the end of Day 8, API keys must be creatable, storable, and usable for auth.

## Primary outputs
- API key schema working
- create/list/revoke API key services working
- bearer auth validation working
- API request context can resolve API key identity

## Checklist

### Schema and repositories
- [ ] confirm `api_keys` table is created in control-plane DB
- [ ] build `api-keys.repository.ts`
- [ ] add:
  - [ ] create API key query
  - [ ] list API keys query
  - [ ] revoke API key query
  - [ ] lookup by prefix query

### Crypto
- [ ] implement API key generator
- [ ] implement API key prefix logic
- [ ] implement API key hashing
- [ ] implement API key verification helper

### Services
- [ ] implement create API key service
- [ ] implement list API keys service
- [ ] implement revoke API key service
- [ ] implement validate API key service

### HTTP/auth
- [ ] parse `Authorization: Bearer ...`
- [ ] resolve API key in request context
- [ ] map API key to tenant/project/scopes
- [ ] return unauthorized response for invalid keys

### Routes
- [ ] create `GET /api/v1/me`
- [ ] create `GET /api/v1/api-keys`
- [ ] create `POST /api/v1/api-keys`
- [ ] create `POST /api/v1/api-keys/:apiKeyId/revoke`

## End-of-day proof
You should be able to:
1. create an API key
2. copy the secret once
3. use the secret in Bearer auth
4. hit `/api/v1/me`
5. revoke the key and see auth fail after revocation

## Day 8 hard stop rule
Do not start recall today until API keys are truly usable.

---

# Day 9 — Notes flow and project-level memory usefulness

## Day 9 goal
By the end of Day 9, notes must be a real product feature.

## Primary outputs
- note append works
- note list works
- notes page works
- notes write path records activity
- notes are ready to feed recall later

## Checklist

### Schema/repositories
- [ ] confirm `memory_notes` table exists
- [ ] implement notes repository
- [ ] add create note query
- [ ] add list notes query
- [ ] add basic filters by kind or cursor

### Services
- [ ] implement append note service
- [ ] implement list notes service
- [ ] implement note validation
- [ ] emit project activity event for note creation

### API
- [ ] create `GET /api/v1/projects/:projectId/memory/notes`
- [ ] create `POST /api/v1/projects/:projectId/memory/notes`

### UI
- [ ] build notes list page or section
- [ ] build create note form
- [ ] show empty state when no notes exist
- [ ] show timestamps
- [ ] show note kind

### Data model quality
- [ ] choose note kinds for v1:
  - [ ] decision
  - [ ] constraint
  - [ ] preference
  - [ ] reference
  - [ ] summary

## End-of-day proof
You should be able to:
1. create a note from the UI or API
2. list notes
3. refresh and see notes persisted
4. verify note write created activity event

## Day 9 hard stop rule
Do not try to make notes perfect.
Just make them real and usable.

---

# Day 10 — Minimal recall pipeline wiring

## Day 10 goal
By the end of Day 10, the first indexing path should exist.

## Primary outputs
- one embedder provider selected for cloud beta
- Upstash integration wired
- chunk registry minimum exists
- explicit indexing flow can run

## Critical decision
Choose **one** embedder provider for cloud beta now.

## Recommendation
Pick whichever is:
- cheaper for you
- easier to wire
- easiest to trust in the next 2 weeks

Do **not** support both in the beta UI now.

## Checklist

### Schema
- [ ] add `chunk_registry`
- [ ] add `recall_jobs` minimum

### Integrations
- [ ] wire Upstash adapter in cloud app
- [ ] wire one embedder provider in cloud app
- [ ] build environment config for those providers

### Services/orchestrators
- [ ] create minimal chunking helper
- [ ] create indexing enqueue service
- [ ] create indexing worker/consumer logic or direct async path if queue consumer is not ready
- [ ] create source-to-chunk registry writes

### Scope cuts
For today, indexing can be:
- explicit trigger only
- manual reindex action
- note/core-memory based only

It does **not** have to be fully automatic yet if that slows you down.

## End-of-day proof
You should be able to:
1. take a project source
2. chunk it
3. embed it
4. upsert to Upstash
5. record chunk registry rows

## Day 10 hard stop rule
Do not spend the whole day tuning retrieval quality.
Just get the pipeline connected.

---

# Day 11 — Recall query endpoint and tester

## Day 11 goal
By the end of Day 11, recall must work from the product.

## Primary outputs
- recall query endpoint works
- recall query tester UI works
- query usage can be counted
- results are visible and understandable

## Checklist

### Services
- [ ] implement recall query service
- [ ] implement recall orchestrator:
  - [ ] quota check hook stub or call
  - [ ] embed query
  - [ ] query Upstash
  - [ ] shape results
  - [ ] record usage

### API
- [ ] create `POST /api/v1/projects/:projectId/recall/query`
- [ ] create `POST /api/v1/projects/:projectId/recall/index`
- [ ] create `GET /api/v1/projects/:projectId/recall/jobs` if possible

### UI
- [ ] build recall query tester
- [ ] input field for query
- [ ] topK input or fixed default
- [ ] render results list
- [ ] show score if useful
- [ ] show source type or section if possible
- [ ] show empty state when no results exist

### Data quality
- [ ] confirm query path is scoped by project
- [ ] confirm results come back only for correct project/tenant

## End-of-day proof
You should be able to:
1. create/update memory
2. index it
3. run a recall query
4. see matching results in UI/API

## Day 11 hard stop rule
Ignore advanced reranking and clever search UX.
Make the recall loop work first.

---

# Day 12 — Usage tracking minimum and overview page usefulness

## Day 12 goal
By the end of Day 12, usage should be visible enough to support pricing later.

## Primary outputs
- usage events minimum working
- usage counters minimum working
- overview page shows useful product numbers
- project and API key counts visible

## Minimum metrics for Week 2
- projects count
- API keys count
- indexing ops
- recall queries

Storage can stay rough if needed this week.

## Checklist

### Schema
- [ ] confirm `usage_events` table exists
- [ ] confirm `usage_counters_periodic` table exists

### Services
- [ ] implement record usage service
- [ ] implement usage summary service
- [ ] implement upsert counter logic
- [ ] implement current period key helper

### Hook usage into real paths
- [ ] project creation increments project count
- [ ] API key creation increments API key count
- [ ] indexing increments indexing ops
- [ ] recall query increments recall query count

### UI
- [ ] build overview cards for:
  - [ ] project count
  - [ ] API key count
  - [ ] indexing ops
  - [ ] recall queries
- [ ] build `GET /api/v1/usage`
- [ ] build `GET /api/v1/projects/:projectId/usage` if possible

## End-of-day proof
Overview page should feel more real now.
You should be able to see numbers that actually change as you use the system.

## Day 12 hard stop rule
Do not build full billing.
Just track enough usage to support Week 3 pricing credibility.

---

# Day 13 — OSS docs, examples, and public release prep

## Day 13 goal
By the end of Day 13, TekMemo OSS should be almost public-release ready.

## Primary outputs
- README strong enough
- getting started docs exist
- package overview docs exist
- at least 2 examples work
- docs app has real OSS content

## Checklist

### Public OSS repo prep
- [ ] decide public repo structure
- [ ] prepare sync/export flow from private repo
- [ ] decide what folders go public first

### README
- [ ] one-line pitch
- [ ] what TekMemo is
- [ ] package list
- [ ] quick install
- [ ] quickstart
- [ ] examples links
- [ ] OSS vs Cloud explanation
- [ ] roadmap summary

### Docs app minimum
- [ ] homepage
- [ ] getting started
- [ ] package overview
- [ ] local filesystem example
- [ ] AI SDK integration overview or simple memory flow doc
- [ ] Cloud page / beta page

### Examples
At minimum:
- [ ] local filesystem example
- [ ] API or simple AI SDK example

### Positioning
- [ ] keep docs product-neutral enough for OSS
- [ ] avoid over-centering cloud in OSS docs
- [ ] explain file-first memory clearly

## End-of-day proof
Someone external should be able to:
- land on the docs
- understand what TekMemo is
- install it
- run one example

## Day 13 hard stop rule
Do not spend the whole day writing long essays.
Make docs useful, not exhaustive.

---

# Day 14 — Week 2 stabilization and Week 3 launch prep

## Day 14 goal
Stabilize everything from Week 2 and prepare for the Week 3 public push.

## Primary outputs
- API keys stable
- notes stable
- recall stable enough to demo
- docs usable
- public launch prep list ready

## Checklist

### Stabilization
- [ ] fix broken API auth cases
- [ ] fix note creation/list bugs
- [ ] fix recall indexing/query bugs
- [ ] fix usage counter bugs
- [ ] clean obvious route/service naming issues

### Demo readiness
- [ ] verify end-to-end flow:
  - [ ] create tenant
  - [ ] create project
  - [ ] update core memory
  - [ ] append note
  - [ ] create API key
  - [ ] call API
  - [ ] run recall query
- [ ] capture screenshots or screen recording
- [ ] list talking points for public launch

### Week 3 prep
- [ ] prepare public OSS launch checklist
- [ ] prepare pricing page tasks
- [ ] prepare beta signup or intake flow tasks
- [ ] prepare service offer page/content tasks
- [ ] prepare outreach list

## End-of-day proof
You should now have a real product demo:
- memory
- notes
- recall
- API keys
- docs

## Day 14 hard stop rule
Do not start building pricing page or billing flows yet unless Week 2 work is already stable.

---

# Week 2 deliverables summary

By the end of Week 2, you should have:

## API
- [ ] API keys create/list/revoke
- [ ] bearer auth works
- [ ] `/api/v1/me` works
- [ ] memory and recall routes expanding

## Product
- [ ] notes work
- [ ] recall basic loop works
- [ ] project-scoped recall works
- [ ] overview usage basics work

## Data
- [ ] `chunk_registry` exists
- [ ] `recall_jobs` minimum exists
- [ ] `usage_events` exists
- [ ] `usage_counters_periodic` exists

## Docs/OSS
- [ ] README strong
- [ ] docs app usable
- [ ] examples ready
- [ ] public OSS release nearly ready

## Demo readiness
- [ ] you can demo project + notes + recall + API keys end-to-end

---

# Daily operating rules for Week 2

## Rule 1
Every day must move you closer to a public demo.

## Rule 2
Do not add a second embedder provider to cloud beta this week.

## Rule 3
Do not overbuild usage/billing yet.

## Rule 4
If recall works but is not beautiful, keep moving.

## Rule 5
Week 2 is about developer usefulness, not polish.

---

# Best end-of-week question

At the end of Week 2, ask:

## Can someone create an API key, write memory, index it, query it, and understand how TekMemo works from the docs?

If yes, Week 2 succeeded.
If no, Week 3 public launch will be weak and should not be treated as done.
