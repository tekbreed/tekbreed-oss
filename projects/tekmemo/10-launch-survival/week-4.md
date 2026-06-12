# TekMemo — Week 4 Daily Execution Checklist

_Created: 2026-05-02_

## Purpose

This document is the **daily execution checklist for Week 4** of the TekMemo 4-week survival plan.

Week 4 exists to produce one thing:

## By the end of Week 4, TekMemo Cloud beta must be usable enough for real onboarding, and you must be actively pushing for first income.

This is not the week for large new systems.

This is the week for:

- fixing the highest-friction product problems
- making the beta feel trustworthy
- onboarding real users
- closing for money
- learning what breaks under real usage

If Week 4 is spent adding random features, the month ends with code but no traction.

---

# Week 4 mission

At the end of Week 4, you must be able to say:

1. TekMemo OSS is public
2. TekMemo Cloud beta is live
3. onboarding works well enough
4. API keys and recall are usable
5. pricing is understandable
6. users can contact or pay you
7. you are actively trying to close first revenue

That is the target.

---

# Week 4 scope rules

## Build only these things this week
- bug fixes that block onboarding
- recall reliability fixes
- auth/API key fixes
- quota/usage clarity fixes
- onboarding docs improvements
- support path improvements
- founder outreach
- beta user onboarding
- revenue-closing actions

## Do not build this week
- new large domains
- enterprise features
- advanced team systems
- deep analytics
- perfect webhook platform
- major redesigns
- second cloud app
- new provider sprawl
- unnecessary abstraction work
- perfect docs for every edge case

---

# Day 22 — Fix onboarding blockers and auth/API key pain

## Day 22 goal
By the end of Day 22, the highest-friction onboarding problems must be removed.

## Primary outputs
- auth flow more stable
- API key creation and use more reliable
- tenant/project creation less fragile
- top onboarding blockers fixed

## Checklist

### Identify top blockers
- [ ] list the 5 most painful onboarding problems
- [ ] rank them by “can this stop a beta user from getting value?”
- [ ] ignore low-value polish issues today

### Likely fix areas
- [ ] auth/session edge cases
- [ ] invalid redirect behavior
- [ ] tenant resolution bugs
- [ ] project creation bugs
- [ ] API key creation errors
- [ ] bearer auth parsing failures
- [ ] bad unauthorized messages

### Product UX fixes
- [ ] improve onboarding empty states
- [ ] improve error messages during project creation
- [ ] improve API key success state
- [ ] improve “copy key now” flow
- [ ] improve first project guidance

### Supportability
- [ ] add request IDs to more user-facing errors where useful
- [ ] improve server logs for auth/API key failures
- [ ] capture failure points in a support note

## End-of-day proof
A new beta user should be able to:
1. enter the cloud app
2. create a tenant/project
3. create an API key
4. use the key without hitting obvious confusion or failure

## Day 22 hard stop rule
Do not add new product areas.
Only remove friction from the core path.

---

# Day 23 — Fix recall and indexing reliability

## Day 23 goal
By the end of Day 23, recall should feel stable enough for real beta use.

## Primary outputs
- indexing path more reliable
- chunk registry issues reduced
- recall query path more predictable
- failure visibility improved

## Checklist

### Reliability fixes
- [ ] inspect indexing job failures
- [ ] inspect embedder call failures
- [ ] inspect Upstash query/upsert failures
- [ ] fix obvious retry/idempotency problems
- [ ] fix stale chunk handling problems
- [ ] fix indexing jobs that never complete cleanly

### Chunk registry integrity
- [ ] confirm source -> chunk mapping is correct
- [ ] confirm updated source marks stale chunks correctly
- [ ] confirm new chunks are written correctly
- [ ] confirm project scoping is correct
- [ ] confirm tenant scoping is correct

### Recall UX
- [ ] improve “no results” state
- [ ] improve error state for failed recall
- [ ] improve recent jobs visibility if available
- [ ] improve project-specific recall clarity

### Observability
- [ ] log failed indexing jobs clearly
- [ ] log failed recall queries clearly
- [ ] capture provider errors with enough context

## End-of-day proof
You should be able to:
1. update memory or notes
2. index successfully
3. run recall
4. trust that results are coming from the right project/source

## Day 23 hard stop rule
Do not chase retrieval perfection.
Fix reliability and obvious correctness only.

---

# Day 24 — Quota, usage, pricing clarity, and upgrade paths

## Day 24 goal
By the end of Day 24, users should understand what they are using and what plan they are on.

## Primary outputs
- usage displays are clearer
- limits are clearer
- pricing and upgrade prompts are clearer
- free vs paid boundaries are visible

## Checklist

### Usage clarity
- [ ] verify usage counters are updating correctly
- [ ] verify overview usage cards are accurate enough
- [ ] verify usage page categories make sense
- [ ] ensure projects count shows correctly
- [ ] ensure API keys count shows correctly
- [ ] ensure indexing ops show correctly
- [ ] ensure recall queries show correctly

### Pricing clarity
- [ ] align current plan display with pricing page
- [ ] improve billing page summary copy
- [ ] improve upgrade CTAs
- [ ] improve soft-cap or hard-cap messages
- [ ] add “what happens at limit” explanation if needed

### Upgrade paths
- [ ] show upgrade prompt where limit pressure is real
- [ ] show contact/sales path from billing page
- [ ] show add-on intent path if add-ons are not yet fully automated

### Trust improvements
- [ ] avoid hidden limits
- [ ] avoid ambiguous usage labels
- [ ] avoid raw infra jargon in the UI

## End-of-day proof
A beta user should be able to answer:
- what plan am I on?
- what am I using?
- what happens if I hit a limit?
- how do I upgrade or contact you?

## Day 24 hard stop rule
Do not build full automated billing if it blocks clarity improvements.

---

# Day 25 — Beta onboarding guide, docs quickstart, and support path

## Day 25 goal
By the end of Day 25, beta users should have a guided path instead of relying on guessing.

## Primary outputs
- beta onboarding guide exists
- docs quickstart improved
- support contact path improved
- cloud + API getting started is easier

## Checklist

### Docs
- [ ] write cloud beta quickstart
- [ ] write API getting started short guide
- [ ] write “first 10 minutes in TekMemo Cloud”
- [ ] write “create project -> write memory -> create API key -> query recall” guide
- [ ] ensure links between docs and cloud app are clear

### Support path
- [ ] add support email or contact CTA in app
- [ ] add “report issue” path
- [ ] add “need setup help?” CTA
- [ ] add sales/setup link where appropriate

### In-app help
- [ ] link docs from overview page
- [ ] link docs from API keys page
- [ ] link docs from recall page
- [ ] improve onboarding helper copy

### Product trust
- [ ] add small status/help notes where confusion is common
- [ ] make empty states actionable, not decorative

## End-of-day proof
A beta user should be able to onboard with much less hand-holding than before.

## Day 25 hard stop rule
Do not write huge docs.
Write the shortest docs that unblock real usage.

---

# Day 26 — Founder outreach and revenue push

## Day 26 goal
By the end of Day 26, you must be actively trying to get paid.

## Primary outputs
- outreach started
- beta invites sent
- setup/integration offer pushed
- direct conversations initiated

## Important rule
This is not optional.
You need money, so this day is a business day as much as a product day.

## Checklist

### Outreach list usage
- [ ] message people on your shortlist
- [ ] send beta invites
- [ ] send setup/integration offer
- [ ] send architecture-review offer
- [ ] send founding-user pitch

### Offers to push
At least one of:
- [ ] founding beta access
- [ ] setup package
- [ ] integration help
- [ ] architecture review call
- [ ] white-glove onboarding

### Materials
- [ ] short pitch message
- [ ] docs link
- [ ] pricing link
- [ ] cloud beta link
- [ ] direct contact path

### Goal for the day
- [ ] start real conversations
- [ ] get calls booked
- [ ] get serious interest
- [ ] ask for money, not just feedback

## End-of-day proof
By the end of Day 26, you should have:
- people contacted
- at least some replies or leads
- at least one meaningful attempt to convert interest into money

## Day 26 hard stop rule
Do not hide in feature work today.
This day is for pushing the product into the market.

---

# Day 27 — Onboard first beta users manually and fix what breaks

## Day 27 goal
By the end of Day 27, you should have learned from real user onboarding attempts.

## Primary outputs
- at least one real onboarding flow run
- top real-world breakages identified
- top real-world breakages fixed or queued

## Checklist

### Manual onboarding
- [ ] walk one beta user through setup if possible
- [ ] observe where they get stuck
- [ ] note confusing language
- [ ] note unclear UI
- [ ] note broken assumptions

### Fixes
Prioritize only:
- [ ] onboarding blockers
- [ ] API key blockers
- [ ] recall blockers
- [ ] pricing confusion
- [ ] support/contact confusion

### Product observation checklist
- [ ] can they create project easily?
- [ ] can they update memory easily?
- [ ] can they create API key?
- [ ] can they use recall?
- [ ] do they understand pricing?
- [ ] do they know what to do next?

### Support
- [ ] create a small manual onboarding checklist for yourself
- [ ] create a “known issues” note
- [ ] create a “beta user FAQ” note

## End-of-day proof
You should know:
- what real users trip over
- what is actually good enough
- what must be fixed before stronger promotion

## Day 27 hard stop rule
Do not interpret silence as success.
Use actual onboarding attempts to learn.

---

# Day 28 — Finalize beta state, publish update, and review next-move opportunities

## Day 28 goal
Close the month with a coherent beta state and a realistic next-step plan.

## Primary outputs
- beta state stabilized
- launch/update post published
- support path clear
- revenue opportunities reviewed
- next 2–4 week focus list drafted

## Checklist

### Product state
- [ ] fix last critical blocker from Day 27
- [ ] verify core loop still works
- [ ] verify pricing page still accurate
- [ ] verify docs links still accurate
- [ ] verify support path visible

### Public update
- [ ] publish a progress/update post
- [ ] publish changelog note if needed
- [ ] share product links again
- [ ] share beta link again
- [ ] remind people of service/setup offer

### Business review
- [ ] list everyone contacted
- [ ] list who replied
- [ ] list who seemed serious
- [ ] list who needs follow-up
- [ ] list what offer got the most interest

### Planning
- [ ] identify the top 5 priorities for the next 2–4 weeks
- [ ] identify what to stop doing
- [ ] identify what to double down on
- [ ] identify what can wait until money comes in

## End-of-day proof
You should end the month with:
- OSS live
- cloud beta live
- product more stable
- real outreach done
- some signal around where money may come from

## Day 28 hard stop rule
Do not end the month by disappearing into code again.
Finish with visibility, follow-up, and clarity.

---

# Week 4 deliverables summary

By the end of Week 4, you should have:

## Product
- [ ] onboarding blockers reduced
- [ ] recall more reliable
- [ ] API keys more reliable
- [ ] usage and pricing clearer
- [ ] docs quickstart improved
- [ ] support path improved

## Business
- [ ] outreach sent
- [ ] beta invites sent
- [ ] setup/service offer pushed
- [ ] real onboarding attempts made
- [ ] follow-up list created

## Public trust
- [ ] launch/update post published
- [ ] product links stable
- [ ] pricing page accurate
- [ ] beta state coherent

---

# Daily operating rules for Week 4

## Rule 1
This week is about conversion, trust, and reliability.

## Rule 2
Only fix problems that block usage or payment.

## Rule 3
Do not add large new systems.

## Rule 4
Spend real time on outreach and money, not just code.

## Rule 5
If a task does not improve onboarding, reliability, or revenue chances, postpone it.

---

# End-of-month success check

At the end of Week 4, ask:

## Do I have:
- a public OSS product?
- a usable cloud beta?
- a working API key and recall story?
- a pricing page?
- a support/contact path?
- active outreach?
- at least one concrete path to first income?

If yes, the month succeeded.

If not, the next move is not “more random features.”
The next move is fixing the exact gap that prevents that answer from being yes.
