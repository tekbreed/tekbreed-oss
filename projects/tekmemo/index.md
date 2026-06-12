# TekMemo Documentation

TekMemo is **developer-owned, file-first memory infrastructure for AI apps and agents**.

Start locally with inspectable `.tekmemo/` memory files, then sync to hosted recall, restore history, teams, API keys, usage controls, and production infrastructure when needed.

---

# The source-of-truth idea

TekMemo starts here:

```txt
.tekmemo/
  manifest.json
  memory/core.md
  memory/notes.md
  events/memory-events.jsonl
  events/conversations.jsonl
  indexes/chunks.jsonl
  graph/nodes.jsonl
  graph/edges.jsonl
  snapshots/snapshots.jsonl
```

Vector stores are indexes.
Cloud is an upgrade path.
The local protocol is the portable memory foundation.

---

# Start here

- [Current Architecture Update](/00-start-here/current-architecture-update)
- [Documentation Map](/00-start-here/documentation-map)
- [Local `.tekmemo/` Protocol](/05-architecture/local-tekmemo-protocol)
- [Memory Architecture](/05-architecture/memory-architecture)

---

# TekMemo OSS

The open-source package line for developers who want memory primitives, adapters, recall, reranking, benchmarking, and local/self-host workflows.

Start with:

- [Package Map](/02-oss-and-packages/package-map)
- [Package Boundaries](/02-oss-and-packages/package-boundaries)
- [Core Runtime](/03-package-reference/core-runtime)
- [`@tekbreed/tekmemo` Package](/03-package-reference/tekmemo)
- [`@tekbreed/tekmemo-fs` Package](/03-package-reference/fs)
- [Vector Recall](/03-package-reference/vector-recall)
- [Reranking](/03-package-reference/reranking)

---

# TekMemo Cloud

The hosted SaaS layer for managed projects, memory dashboards, API keys, usage, billing, tenant routing, and beta revenue.

Start with:

- [Cloud Product Spec](/04-cloud-product/cloud-product-spec)
- [Infra Architecture](/05-architecture/infra-architecture)
- [API Contract](/06-api/api-contract)
- [Pricing and Billing](/08-pricing-billing/pricing-billing)

---

# 1-month survival launch

Your immediate operating system is here:

- [Launch Index](/10-launch-survival/index)
- [4-Week Survival Plan](/10-launch-survival/4-week-survival-plan)
- [Week 1 Checklist](/10-launch-survival/week-1)
- [Week 2 Checklist](/10-launch-survival/week-2)
- [Week 3 Checklist](/10-launch-survival/week-3)
- [Week 4 Checklist](/10-launch-survival/week-4)


---

# AI runtime integrations

- [AI Runtime Integrations](/05-architecture/ai-runtime-integrations)
- [`@tekbreed/tekmemo-tanstack-ai`](/03-package-reference/tanstack-ai)
- [TanStack AI Support Decision](/02-oss-and-packages/tanstack-ai-support)
