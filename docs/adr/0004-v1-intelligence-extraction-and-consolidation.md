# ADR 0004: v1 intelligence = LLM-based extraction + memory consolidation, via a provider-neutral adapter

- **Status:** Accepted
- **Date:** 2026-06-20
- **Deciders:** Christopher S. Aondona

## Context

TekMemo markets itself as "intelligent memory." An audit of the actual code
(2026-06-20) shows the intelligence is uneven:

| Capability | Status |
|---|---|
| Hybrid recall (BM25 + fuzzy + vector + reranker) | ✅ Strong |
| Recency-weighted decay | ✅ Real (ranking only) |
| Graph auto-extraction | ⚠️ **Pattern-only** — ~7 regex rules in `packages/tekmemo/src/graph/extraction/rule-based-extractor.ts` ("X uses Y", "depends_on", …). Natural prose yields almost nothing. |
| Memory consolidation / merging | ❌ None |
| Semantic deduplication | ❌ None |
| Reasoning / inference over graph | ❌ None |
| LLM-based extraction | ❌ None |

The honest one-liner: strong retrieval, weak extraction, no higher-order memory
intelligence. This matters because ADR 0003's entire moat is "we run the best
local memory engine on managed infra." If a competitor ships memory that
*consolidates and forgets*, they out-position a retrieval-only engine on
capability, no matter how good the retrieval is. Retrieval is table-stakes;
**consolidation is the differentiator.**

## Decision

**v1 intelligence = hybrid retrieval + recency + LLM-based extraction + memory
consolidation.**

1. **LLM-based extractor** as a new **provider-neutral adapter** (mirroring the
   embedder/reranker adapter pattern). Given a note, it extracts arbitrary
   subject–predicate–object triples + entities — not just the 7 regex patterns.
   This makes the knowledge graph actually grow from natural text.
2. **Memory consolidation:** a background/local pass that (a) merges
   semantically-duplicate notes, (b) lets decay actually *retire* superseded
   memories (mark, not delete — preserving the audit trail), (c) resolves
   contradictions via the existing `supersedes` edge type and
   `graph/invalidation/invalidate-superseded-edges.ts` (the plumbing partially
   exists; it needs an LLM trigger instead of only regex).
3. The **rule-based extractor stays** as the zero-config / offline fallback — no
   LLM configured → regex patterns still extract the obvious triples. The LLM
   extractor layers on top when an adapter is configured.

### Extractor shape (sub-decision)

The LLM extractor is a **pluggable adapter, provider-neutral** — not a hard
dependency on one provider. This:

- Honors `AGENTS.md`: "Core protocol contracts must be provider-neutral."
- Mirrors the existing adapter pattern (`@tekbreed/tekmemo-adapter-openai`,
  `-voyage`, `-transformers`).
- **Preserves the local-first thesis:** the `-transformers` adapter already
  proves a model can run fully in-process (ONNX, zero API key). An extractor
  built on a local model adapter means extraction + consolidation can run **100%
  locally, offline, no cloud** — the same zero-config-intelligence property the
  recall engine already has. The OSS stays genuinely smart without requiring any
  provider key.

The `Extractor` interface is **defined in core `packages/tekmemo`**; the first
concrete adapter package (likely a `-transformers`-based local extractor) is
added only when implemented — no speculative empty package.

## Consequences

**Positive:**

- The "intelligent memory" claim maps to concrete, defensible capabilities
  (hybrid recall + LLM-extracted graph + consolidation that merges/retires).
- Consolidation is the capability that makes a user *feel* the system is smart
  (it quietly merges/retires without being asked).
- Provider-neutral + local-model option keeps the local-first thesis intact.

**Negative:**

- Real engineering: an extractor adapter interface, ≥1 implementation, and
  consolidation logic with tests.
- LLM extraction is non-deterministic by nature; consolidation must be careful
  to *mark* (auditable) rather than silently delete, to preserve trust.
- Cost: a hosted-provider extractor has per-call cost; the local-model path
  avoids this but depends on model availability.

## Alternatives considered

1. **Stay rule-based; position as "transparent & deterministic."** Rejected as
   the v1 ceiling: caps the "smart" claim so hard it weakens ADR 0003's managed-
   engine moat (you'd be hosting a *worse* engine than competitors'). The
   rule-based extractor is kept as the *fallback*, not the ceiling.
2. **Full agentic memory (inference + proactive surfacing + semantic dedup +
   consolidation).** Rejected for v1 scope: too large, would slip the launch.
   These remain candidates for the managed-runtime tier or a later OSS release.
3. **Hard dependency on one LLM provider.** Rejected: violates provider-neutral
   rule and breaks local-first.

## Validation

- Confirmed current state: rule-based extractor is pattern-only; no
  `Extractor` interface in core; no consolidation logic (verified by search).
- The `supersedes` edge type and `invalidate-superseded-edges.ts` exist, so the
  consolidation plumbing partially exists.

## Doc/marketing implication

The "super intelligent" claim must map to *specific* capabilities in copy —
"hybrid recall, an LLM-extracted knowledge graph (with a zero-config rule-based
fallback), and memory consolidation that merges duplicates and retires outdated
facts." Not a vague adjective. Tracked as a doc fix.

## References

- Decisions log: `docs/architecture/decisions.md` Q5, Q6 (deferred extractor pkg), Q7
- Rule-based extractor: `packages/tekmemo/src/graph/extraction/rule-based-extractor.ts`
- Recall/decay: `packages/tekmemo/src/recall/hybrid/hybrid-recall.ts`
- Existing supersedes plumbing:
  `packages/tekmemo/src/graph/invalidation/invalidate-superseded-edges.ts`
- Adapter pattern precedent:
  `packages/tekmemo-adapter-{openai,voyage,transformers}`
