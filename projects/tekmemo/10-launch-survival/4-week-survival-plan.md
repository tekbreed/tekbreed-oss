# TekMemo — 4-Week Survival Execution Plan

_Created: 2026-05-02_

## 1. Mission

This is the **4-week survival plan** for shipping:

1. **TekMemo OSS live**
2. **TekMemo Cloud beta live**
3. **first revenue path active**

This plan is optimized for:

- very limited time
- very limited money
- one-month deadline
- getting something **real** online fast
- reducing unnecessary scope
- maximizing the chance of:
  - public launch
  - beta signups
  - first paying users
  - first service/integration income

This is **not** the full ideal roadmap.

This is the **fastest serious path**.

---

# 2. What success means in 4 weeks

At the end of 4 weeks, success means:

## OSS
- TekMemo repo is public
- core packages are installable
- docs exist
- at least 2 examples exist
- clear README exists
- basic OSS positioning is live

## Cloud
- TekMemo Cloud beta is online
- users can sign up or join waitlist/beta
- users can create a tenant
- users can create a project
- users can edit core memory
- users can append notes
- users can generate API keys
- basic recall works
- usage is visible
- pricing page is live
- contact / upgrade / pay intent path is live

## Revenue path
At least one of these is active:
- paid beta signup
- setup/integration offer
- consulting call booking
- preorders / early-access pricing
- direct founder outreach offer

---

# 3. Critical scope cuts

To hit this in 4 weeks, you must **cut hard**.

## Do not build in the first 4 weeks
- enterprise
- SSO
- full team permissions depth
- advanced analytics
- webhook system if it slows you down
- full restore UI
- all providers in the UI
- too many add-ons
- blog perfection
- deep changelog system
- fancy marketing site animations
- overly broad dashboard polish
- complete admin tooling
- multiple cloud apps
- multiple auth providers if one is enough
- every package documented perfectly before launch

## Build only what helps launch
- OSS packages
- one clear docs story
- cloud beta onboarding
- project + memory core loop
- recall basic loop
- API keys
- pricing page
- payment intent or direct sales flow
- a way for people to contact/pay you

---

# 4. Launch strategy for survival mode

Because you need money quickly, do **not** depend only on self-serve SaaS revenue in 4 weeks.

Use **two launch tracks at once**:

## Track A — Product
Ship:
- OSS
- Cloud beta
- pricing
- signup
- API keys
- recall demo

## Track B — Service revenue
Sell:
- setup package
- memory architecture help
- integration help
- early beta onboarding
- “we will help you wire TekMemo into your app”

This is important.

In 4 weeks, **service revenue is more likely than pure self-serve SaaS revenue**.

So the launch should include both:

- **product pricing**
- **service offer**

---

# 5. Final 4-week target architecture

Use this as the launch stack:

## OSS
- `@tekbreed/tekmemo`
- `@tekbreed/tekmemo-ai-sdk`
- `@tekbreed/tekmemo-fs`
- `@tekbreed/tekmemo-agentfs`
- `@tekbreed/tekmemo-upstash`
- one embedder public enough to demo (Voyage or OpenAI)

## Cloud beta
- React Router v7 + Cloudflare Workers
- Turso control-plane DB
- one pooled tenant-data DB
- Upstash for recall
- one embedder provider only in beta
- R2 only if needed for snapshots later
- API keys
- pricing page
- usage page
- simple billing intent flow

## Recommendation
Use **one embedder provider in the beta**.
Do not try to fully support both Voyage and OpenAI in the Cloud UI in the first 4 weeks.

Choose the one that is:
- cheaper for you
- easier to wire
- easier to explain

---

# 6. Week 1 — Foundation and first working product loop

## Week 1 goal
Get the repo, OSS core, cloud shell, and first end-to-end memory loop working locally and in staging.

## Week 1 non-negotiable outcome
By end of Week 1, you should be able to:

- run the monorepo
- run TekMemo OSS locally
- run TekMemo Cloud locally/staging
- create a tenant
- create a project
- read/update core memory

If this is not working by the end of Week 1, the month is at risk.

---

## Week 1 priorities

### A. Lock the repo structure
You should not keep rethinking structure after this week.

#### Deliverables
- private monorepo scaffolded
- apps:
  - `apps/tekmemo-cloud`
  - `apps/docs`
- packages:
  - `packages/tekmemo`
  - `packages/ai-sdk`
  - `packages/fs`
  - `packages/agentfs`
  - `packages/upstash`
  - one embedder package

### B. Finish `@tekbreed/tekmemo`
This is the core runtime.

#### Must work
- bootstrap memory store
- core memory read/write
- notes append
- conversations append
- structured memory commands

### C. Finish `@tekbreed/tekmemo-fs`
You need one working local backend fast.

### D. Scaffold cloud app architecture
Implement the backend structure enough to start real work.

#### Must exist
- route shell
- `src/core`
- `src/http`
- `src/db`
- `src/auth`
- `src/tenants`
- `src/projects`
- `src/memory`

### E. Create control-plane DB v1
Do not implement the full schema yet.
Build only the minimum.

#### Minimum tables
- `tenants`
- `users`
- `tenant_memberships`
- `projects_registry`
- `api_keys`
- `tenant_database_registry`

### F. Create pooled tenant-data DB v1
Minimum only.

#### Minimum tables
- `projects`
- `memory_documents`
- `memory_notes`
- `memory_conversations`

### G. Implement first project + memory loop
This is the most important loop.

#### Must work
- create tenant
- create project
- get core memory
- update core memory

---

## Week 1 recommended day split

### Day 1
- monorepo scaffold
- app/package folders
- root configs
- cloud app boots
- docs app boots

### Day 2
- finish `@tekbreed/tekmemo`
- finish `@tekbreed/tekmemo-fs`
- local memory example works

### Day 3
- scaffold cloud app backend folders
- create control-plane DB client
- create tenant-data DB router stub

### Day 4
- implement control-plane schema minimum
- implement tenant/project repositories
- implement create tenant and create project flows

### Day 5
- implement core memory read/update
- connect project page to core memory API
- local/staging smoke test

### Day 6
- fix integration breaks
- add request context
- add error handling
- add very basic auth/session flow

### Day 7
- stabilize
- no new features
- document what works
- list blockers for Week 2

---

## Week 1 exit criteria
- monorepo is stable
- `@tekbreed/tekmemo` works
- cloud app boots
- create tenant works
- create project works
- core memory update works
- one staging deploy exists

---

# 7. Week 2 — Recall, API keys, OSS release prep, and public docs

## Week 2 goal
Make TekMemo real enough to demo publicly and make the cloud beta usable for early developers.

## Week 2 non-negotiable outcome
By end of Week 2, you should be able to:

- generate API keys
- append notes
- run basic recall
- expose a working API
- prepare OSS repo for public release

---

## Week 2 priorities

### A. API keys
This is critical because TekMemo Cloud needs a usable integration story.

#### Must work
- create API key
- list API keys
- revoke API key
- bearer auth validation

### B. Notes flow
#### Must work
- append note
- list notes
- note stored in DB
- note visible in dashboard

### C. Minimal recall pipeline
Do not overbuild.

#### Must work
- explicit recall index trigger
- basic chunking
- one embedder provider
- Upstash upsert
- recall query endpoint
- recall query tester in dashboard

### D. Usage recording minimum
You do not need full billing yet, but you do need usage visibility.

#### Minimum metrics
- projects count
- indexing ops
- recall queries
- API keys count

### E. OSS public-release prep
Public repo should be basically ready by end of Week 2.

#### Minimum OSS deliverables
- README
- installation instructions
- quickstart
- package descriptions
- 2 examples:
  - local filesystem example
  - AI SDK example or simple cloud-style example

### F. Docs app
#### Must exist
- homepage
- getting started
- package overview
- cloud waitlist or cloud page
- pricing teaser or link

---

## Week 2 recommended day split

### Day 8
- API keys schema + services
- bearer auth middleware/service

### Day 9
- notes CRUD minimum
- notes page/UI

### Day 10
- Upstash adapter integration in cloud
- one embedder provider integration in cloud

### Day 11
- recall query endpoint
- recall query tester UI
- explicit index trigger

### Day 12
- usage counters minimum
- overview page cards
- API usage summary minimum

### Day 13
- OSS README/docs/examples
- docs app getting started
- docs app package pages

### Day 14
- stabilize all of Week 2
- record demo video/screenshots
- prep public OSS launch branch/repo

---

## Week 2 exit criteria
- API keys work
- notes work
- recall basic loop works
- usage basics visible
- docs app usable
- OSS release is ready to go public next week

---

# 8. Week 3 — Public OSS launch, pricing page, billing path, cloud beta onboarding

## Week 3 goal
Go public with OSS and make the cloud beta commercially legible.

## Week 3 non-negotiable outcome
By end of Week 3, TekMemo OSS should be live publicly, and TekMemo Cloud should have:

- pricing page
- signup/beta path
- a way to collect payment intent or direct revenue
- a clear onboarding path

---

## Week 3 priorities

### A. Public OSS launch
This is the week you launch TekMemo publicly.

#### Must launch
- public repo
- README
- docs app public pages
- package overview
- examples
- roadmap summary

### B. Pricing page
Use the final pricing you already locked.

#### Must show
- Developer Cloud
- Pro
- Team
- Business
- Enterprise
- add-ons
- OSS vs Cloud

### C. Cloud beta onboarding
#### Must work
- sign up / login
- create tenant
- create project
- see dashboard
- generate API key
- read/update memory
- run recall query

### D. Revenue path
Because you need money quickly, launch with at least one of these:

#### Recommended
- “Early Beta Setup” service
- “We help integrate TekMemo into your app” call
- “Founding user” paid beta
- direct founder email / calendar CTA

### E. Billing path
You do not need perfect billing automation if it slows you down.

#### Acceptable Week 3 version
- pricing page live
- “Request beta access” or “Join paid beta” flow
- manual onboarding + manual invoice/payment link if necessary

#### Better version
- self-serve upgrade flow at least stubbed
- billing page with current plan and upgrade CTA

### F. Dashboard IA alignment
Align the real app with:
- Overview
- Projects
- Memory
- Recall
- Usage
- Billing
- API Keys
- Settings

You do not need every section fully deep, but the structure should exist.

---

## Week 3 recommended day split

### Day 15
- public OSS repo sync/finalize
- launch docs cleanup

### Day 16
- pricing page implementation
- OSS vs Cloud page
- cloud landing page adjustments

### Day 17
- cloud onboarding flow polish
- tenant/project creation UX polish

### Day 18
- billing page v1
- manual or semi-manual payment path
- service offer page/section

### Day 19
- API docs minimum
- API keys page polish
- usage page polish

### Day 20
- public launch prep
- screenshots
- launch post drafts
- founder outreach list

### Day 21
- launch OSS publicly
- open cloud beta or paid beta intake
- announce service/setup offer

---

## Week 3 exit criteria
- TekMemo OSS is public
- cloud pricing page is live
- cloud beta intake is live
- product can be demoed end-to-end
- a revenue path exists publicly

---

# 9. Week 4 — Close gaps, beta onboard users, get first income

## Week 4 goal
Turn what you launched into something people can actually pay for and use without constant breakage.

## Week 4 non-negotiable outcome
By end of Week 4, TekMemo Cloud beta must be live enough to onboard real users, and you should be actively pushing for first income.

---

## Week 4 priorities

### A. Close the most painful product gaps
Focus only on blockers to:
- onboarding
- using the API
- using recall
- understanding pricing
- trusting the product

#### Likely gap list
- bad auth edge cases
- bad tenant/project routing bugs
- recall instability
- broken usage counters
- missing error states
- poor empty states
- poor upgrade prompts

### B. Add minimum billing and usage trust
#### Must be true
- plans visible
- usage visible
- hard caps on free work
- API keys count enforced
- projects count enforced
- index/recall usage tracked enough to explain limits

### C. Improve beta readiness
#### Must work better
- onboarding email / message
- quickstart for beta users
- support channel or email
- stable staging/production
- logs good enough to debug problems

### D. Get first income deliberately
This week is not “wait and hope.”

You should actively:
- message potential design partners
- offer setup calls
- offer early beta migration help
- offer “founding user” discount
- ask for payment to onboard serious teams

### E. Add the bare minimum polish to trust the product
#### Focus areas
- overview page
- pricing page
- API keys page
- memory page
- docs quickstart
- clear contact path

### F. Changelog and blog
Do not overbuild.
But do publish:
- one launch post
- one changelog entry
- one docs quickstart

---

## Week 4 recommended day split

### Day 22
- fix top onboarding blockers
- fix auth/API key issues

### Day 23
- fix recall pipeline stability
- fix chunk registry / indexing reliability issues

### Day 24
- usage/quota display cleanup
- billing/upgrade CTA cleanup

### Day 25
- docs quickstart polish
- beta onboarding guide
- API getting started guide

### Day 26
- outreach day
- direct messages/emails
- offer setup/integration package
- book calls

### Day 27
- onboard first beta users manually
- observe failures
- fix only the most blocking issues

### Day 28
- finalize beta launch state
- push launch/update post
- tighten support path
- review income opportunities and next moves

---

## Week 4 exit criteria
- cloud beta is live and usable
- OSS is live and documented
- at least one revenue path is active
- product is demoable and somewhat trustworthy
- you have direct user conversations or paying interest

---

# 10. Weekly priorities in one view

## Week 1
**Foundation + first project/core memory loop**

## Week 2
**Recall + API keys + OSS release prep**

## Week 3
**Public OSS launch + cloud pricing + beta onboarding + revenue path**

## Week 4
**Fix blockers + onboard beta users + push for first income**

---

# 11. What counts as “live” at the end of 4 weeks

## TekMemo OSS live means
- public repo
- packages published or publish-ready
- docs available
- examples available
- README solid

## TekMemo Cloud beta live means
- public landing/pricing page
- signup or beta intake
- dashboard usable
- create project works
- core memory works
- notes work
- recall works basically
- API keys work
- usage visible
- support contact exists

## Expecting income means
At least one of these is true:
- paid beta users
- paid setup calls
- integration contract started
- founder/user prepayment
- strong paid onboarding pipeline active

---

# 12. Revenue strategy for the month

Do not rely only on subscriptions in month one.

## Recommended month-one offers

### Offer 1 — Founding Beta
- discounted early access
- direct support
- faster onboarding

### Offer 2 — Setup / Integration Package
- fixed price
- help wiring TekMemo into customer app

### Offer 3 — Architecture Review
- 60–90 minute paid session
- memory architecture guidance

### Offer 4 — White-glove onboarding
- pay to get onboarded into beta fast

This gives you more ways to make money quickly.

---

# 13. Daily working rule

Every day, ask:

## Does this task help one of these?
- ship OSS
- ship cloud beta
- make onboarding work
- make pricing understandable
- make someone willing to pay

If not, cut or postpone it.

---

# 14. Things you must not do in this month

- rebuild architecture repeatedly
- chase too many integrations
- perfect enterprise features
- overdesign admin systems
- overengineer analytics
- overpolish blog/changelog
- build features before the core loop is stable
- avoid outreach until “everything is perfect”

---

# 15. Canonical recommendation

For the next 4 weeks, the plan is:

## Week 1
Foundation and core cloud loop

## Week 2
Recall, API keys, usage basics, OSS release prep

## Week 3
Public OSS launch, cloud pricing, beta onboarding, revenue path live

## Week 4
Fix blockers, onboard beta users, push for first income

This is the fastest serious path to:
- TekMemo OSS live
- TekMemo Cloud beta live
- first revenue possibility within a month
