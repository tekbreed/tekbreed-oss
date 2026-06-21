# New Architecture — Decisions Log

> **Status:** Living document. Captures decisions resolved during the
> `new-architecture.md` design session (connectors, cloud shape, decay/conflict,
> package triage, cloud stack, pricing, connector set) and the follow-on
> session 2 (ai-sdk extraction, package review, docs IA). Updated inline as each
> branch of the design tree is resolved. **Q1–Q10 + S2-Q1 + Q11–Q14 are all
> locked.** Numbering is collision-free:
> - **Q1–Q5** — original open questions (connectors, decay/conflict, cloud
>   purpose, intelligence scope).
> - **Q6** — package triage. **Q7** — per-package review. **Q8** — tech stack
>   (license decision folded in here). **Q9** — pricing. **Q10** — connector set.
> - **S2-Q1** — session 2: `ai-sdk/` extraction. (Numbered `S2-Q*` to avoid
>   collision with the original `Q*` series.)
> - **Q11–Q14** — implementation-time decisions (worker build blocker, DB naming,
>   project provisioning, cursor format).
>
> **Relationship to other docs:**
> - Governs and extends `docs/architecture/cloud-sync-and-refactor.md` (the
>   locked cloud-sync refactor spec, decisions D1–D9).
> - Supersedes the rough proposal in root `new-architecture.md` (its open
>   questions are answered here one by one).
> - ADRs (`docs/adr/`) are reserved for decisions that are hard-to-reverse,
>   surprising without context, and the result of a real trade-off. Decisions
>   from this session promoted to ADRs:
>   - [ADR 0002](../adr/0002-connectors-run-locally.md) — connectors run locally
>     (from Q1–Q3).
>   - [ADR 0003](../adr/0003-managed-runtime-tier.md) — managed-runtime tier,
>     foundation-first (from Q4).
>   - [ADR 0004](../adr/0004-v1-intelligence-extraction-and-consolidation.md) —
>     v1 intelligence surface (from Q5).
>   - [ADR 0005](../adr/0005-cloud-tech-stack.md) — cloud tech stack (from Q8).
>   - [ADR 0006](../adr/0006-pricing-and-entitlements.md) — pricing tiers +
>     Polar + entitlement model (from Q9).
>   - [ADR 0007](../adr/0007-ai-sdk-extraction.md) — extract the Vercel AI SDK
>     integration to an adapter package; runtime-via-Tekmemo contract origin
>     (from S2-Q1).
>   Q10 (connector set) and the license decision (folded into Q8) are captured in
>   this log; the provider-neutral `Connector` interface from Q10 folds into
>   ADR 0002's extensibility coverage.
>
> **How to read:** each entry has `Question → Answer → Rationale → Status →
> Open sub-questions`. A decision is **Locked** once the user confirms it;
> **Draft** while still being grilled.

---

## Q1 — Where do connectors (Notion, GitHub, …) execute?

- **Question:** `new-architecture.md` §3 said "connectors should be in the cloud
  and sync with local memory engine." But the locked refactor (`cloud-sync-and-
  refactor.md` D1/D2) makes the cloud a dumb file replica that never embeds,
  recalls, extracts, or ingests. These conflict. Where do connectors run?
- **Answer:** **Connectors run locally; the cloud only replicates the resulting
  files.** (User picked Option A, 2026-06-20.)
- **Rationale:** A connector is an ingestion operation — it fetches, normalizes,
  chunks, embeds, and extracts into `.tekmemo/`. Ingestion is an engine concern;
  the engine is local. Hosting connectors server-side would re-open the
  "cloud-as-engine" decision the refactor just closed and would force the cloud
  to embed/extract, contradicting D7 (indexes derived locally). Cloud stays dumb.
- **Status:** **Locked.** Reaffirms D1/D2; does not modify them.
- **Open sub-questions:** none for this decision (see Q2 for how connectors are
  added/run).

---

## Q2 — How do users add and run connectors if execution is local?

- **Question:** If connectors run on the user's machine, can users still "add"
  them from the web? Where does configuration live, and what triggers a run?
- **Answer:** **Config syncs down from the web dashboard; the local runtime
  executes on schedule/session.** (User picked Option 1, 2026-06-20.)
  - **Control plane = TekMemo Cloud dashboard** (the future `apps/api` build
    target): user adds a connector and pastes a token. The cloud stores config
    + a credential pointer. This is the Linear/`.git/config` model — editable
    from the UI, acted on locally.
  - **Data plane = local runtime** (CLI / MCP server / scheduled daemon): pulls
    the connector config down via sync, fetches the external source (Notion,
    GitHub, …), ingests through the **local** engine into `.tekmemo/`, and the
    resulting files sync back up like any other canonical file.
  - **Execution only happens while the local runtime is alive.** Honest for a
    local-first OSS product (like `git` only fetching when you run it).
- **Rationale:** Keeps D1/D2 intact — the cloud holds config + a pointer, never
  engine logic. No new hosted-worker cost. Consistent with the "one brain + a
  mirror" thesis in §1.3 of the refactor doc.
- **Status:** **Locked** (core model **and** both implementation details below).
- **Implementation details (both locked, 2026-06-20, user accepted the
  recommended Option A):**
  1. **Connector-config storage shape:** connector config becomes the **11th
     canonical file** — `.tekmemo/connectors.json` — joining the 10 in
     `packages/tekmemo/src/core/constants/memory-paths.ts`. It is a sync unit:
     `computeLocalManifest()` in `file-replication.ts` walks 11 files now
     (10 canonical + snapshots + `connectors.json`). Every device sees the same
     connector setup via the existing file-replication sync.
  2. **Secret handling:** tokens **never** ride in the file-replica (R2 blobs
     are readable; `packages/tekmemo-cli/src/utils/secrets.ts` is built to catch
     exactly this). `.tekmemo/connectors.json` holds only an opaque `secretRef`
     (e.g. `"ss_abc123"`) per connector — type, schedule, source mapping,
     enabled flag, and the ref — **never** the token itself. Tokens live in
     TekMemo Cloud's server-side secret store (TekAuth / Turso-encrypted or
     Cloudflare Secret). The local runtime fetches the token over an
     authenticated call right before a run, holds it in memory only, never
     writes it to disk.
- **Cloud contract additions (to be folded into §7/§12 of the refactor doc):**
  - One new canonical file: `.tekmemo/connectors.json` (sync unit, no secrets).
  - One new authenticated endpoint on the future cloud for secret retrieval,
    e.g. `GET /v1/projects/:projectId/connectors/:connectorId/secret` → returns
    the decrypted token to an authenticated, scoped client. This is a
    **config-plane** call (control), not a data-plane/engine call; it does not
    violate D2 (no hosted recall/ingestion).
- **Pattern reference:** GitHub Actions secrets / Vercel env vars — the *what*
  is versioned (synced config), the *credential* is fetched live.

---

## Q3 — Memory decay & conflict resolution: is the local engine smart enough?

- **Question (from `new-architecture.md` open question 2):** with connectors now
  ingesting external data locally and multi-device sync, is the local memory
  engine smart enough to handle memory decay and conflict resolution?
- **Answer:** **Yes for recall decay and human multi-device conflicts; needed a
  new rule for connector re-ingestion conflicts.** (Resolved 2026-06-20, user
  accepted the recommended Option A.)
- **Findings (verified in code):**
  1. **Recall decay — already implemented.** `packages/tekmemo/src/recall/hybrid/
     hybrid-recall.ts` (lines 89–185) scores
     `finalScore = 0.7·relevance + 0.2·recency + 0.1·confidence`, where `recency`
     is an exponential half-life decay (default 30 days; now→1.0, 30d→0.5,
     60d→0.25). It self-tunes ranking toward current relevance, never
     hard-deletes. Smart enough for ranking.
  2. **Human multi-device conflicts — already decided + implemented (D6).**
     Last-writer-wins per file + mandatory pre-sync snapshot.
     `packages/tekmemo/src/tekmemo/sync/file-replication.ts` calls
     `createPreSyncSnapshot()` before every mutating `push` and `pull` (lines
     204, 226) and fails closed. Correct for single-user multi-device (the
     Dropbox/iCloud model).
  3. **Connector re-ingestion conflicts — were NOT safe under D6 alone.**
     Scheduled connectors re-ingest the same external content on multiple
     devices and can produce non-deterministic sha256s (timestamps, ordering),
     causing phantom manifest conflicts; and under last-writer-wins a connector
     run could silently clobber a concurrent *human* note in the same file.
- **Decision (Option A, locked): connector isolation + content-deterministic
  writes.**
  - **Connector isolation:** connector-ingested content writes to **its own**
    region, never intermingled with human-authored notes in a way that a
    background connector run can overwrite a human note under D6. (Exact storage
    shape — new region vs. inside `notes.md` with a stable discriminator — see
    the sub-question below; both satisfy isolation.)
  - **Content-deterministic writes:** connector writes are keyed by **stable
    external id**, with no wall-clock or volatile ordering embedded in the
    hashed bytes. Re-ingesting unchanged external content → identical sha256 on
    every device → manifest diff reports "no change" → no phantom conflict, no
    needless upload.
  - D6 is **unchanged** and remains correct for human edits. No event-log
    engine, no new per-line conflict machinery.
- **Sub-question (storage shape) — Locked: inside `notes.md` with a stable
  `source: connector` discriminator (no new canonical region).** Rationale:
  - `notes.md` is already append-only markdown where every entry carries a
    `source:` field and a content-derived stable `metadata.id` (e.g.
    `mem_d42f34bce417d0e5`).
  - The schema (`packages/tekmemo-mcp-server/src/schema.ts` `sourceRefSchema`,
    line ~110) already enumerates `"connector"` as a valid `sourceType`, with a
    `sourceId` field for the stable external id.
  - So connector notes fit the existing data model **with zero new files**: a
    connector note is just a note with `source: connector`, `sourceId:
    <external-id>`, and a content-derived `id` (so re-ingest of unchanged
    content reproduces the same bytes).
  - `.tekmemo/connectors.json` (from Q2) holds the *connector config*; the
    *ingested content* lives in `notes.md` (and derived `chunks.jsonl` /
    `embeddings.jsonl` / graph nodes as usual). Config ≠ content.
  - Rejected alternative: a new `.tekmemo/sources/` region as extra sync units.
    More files, more sync surface, no benefit over the existing discriminator
    model that the schema already supports.
- **Status:** **Locked.**
- **Footnote (out of scope for v1):** decay affects **ranking only**, not
  storage. Nothing is garbage-collected. A user connecting a large Notion
  workspace (tens of thousands of pages) will see unbounded JSONL growth in
  `chunks.jsonl` / `embeddings.jsonl` / `graph/nodes.jsonl`. This is acceptable
  at v1 (single-user scale, R2 is cheap) but is flagged as a future concern
  (retention/TTL/archive policy), not a v1 blocker.
## Q4 — How does TekMemo Cloud stay unique and relevant long-term?

- **Question (from `new-architecture.md` open question 3):** how do we make
  TekMemo Cloud VERY unique and outstanding to capture users' attention and
  remain relevant in the long term?
- **Contradiction surfaced:** `README.md` lines 145–146 and `ROADMAP.md` lines
  35–37 promise the cloud will host recall/vector/graph/evals ("🌱 early
  access" / "managed versions of the capabilities the OSS runtime computes
  locally"). But the v1 cloud on this branch is a **file replica** — it does
  not instantiate the `Tekmemo` runtime (verified in code:
  `packages/tekmemo/src/tekmemo/sync/file-replication.ts`; the trimmed
  `TekMemoCloudClient` in `cloud-client/types.ts` exposes only
  `health`/`readiness`/`sync`). So v1 physically cannot run recall yet.
- **Answer (locked, 2026-06-20, Option A):** **The cloud's long-term purpose is
  to run the local engine and host memory for API integration. The v1
  file-replica is the foundation for that — not an alternative to it.**
  - **Thesis (the founder's stated intent, affirmed):** "the whole point of the
    cloud is to run the local engine. If you can't/won't run it yourself, we
    host your memory and you integrate via API." This is the Vercel/Supabase
    model applied to memory: self-host the runtime free (OSS), or pay us to run
    the *same code* on managed infra.
  - **Why "foundation-first" sequencing is required, not optional:** to run the
    engine on hosted infra, the cloud first needs the user's `.tekmemo/` files
    resident in R2. That is exactly what the v1 file-replica refactor builds.
    Sync is the *prerequisite* for the managed engine, not a competitor to it.
    The files must exist in the cloud before the cloud can run an engine over
    them.
  - **v1 cloud (this refactor):** file-replica sync + dashboard + connector
    config (Q1–Q3) + health/readiness. Ships soon. The `TekMemoCloudClient`
    contract stays at `health`/`readiness`/`sync` (+ the planned
    `connectors/:id/secret` from Q2).
  - **v1.x / v2 cloud (managed-runtime tier):** spin up the identical `Tekmemo`
    runtime + an embedder (the existing `-transformers` adapter) on Cloudflare
    Workers/Pages against the user's R2-resident files; expose
    recall/memory/graph by *additively* re-expanding `TekMemoCloudClient` with
    the engine namespaces. Single engine implementation running in two places
    (laptop + managed infra) against the same files → no drift, one source of
    truth. This is when the README's "hosted vector recall / graph / evals"
    promise becomes literally true.
- **Rationale for sequencing (why ship file-replica first, not hold v1):**
  1. The file-replica work is already ~80% done on this branch; shipping it
     delivers sync *now* and produces the R2-resident files the managed engine
     will read.
  2. The managed-runtime tier is a separate, larger effort (process lifecycle,
     concurrency, memory, cold starts, compute billing) that depends on the
     file-replica existing first — building them serially, labeled v1 then v1.x,
     is faster and less risky than holding v1 for both.
  3. Layering on top of a finished file-replica is clean; tearing up a
     half-built one to bolt on compute mid-stream is a mess.
- **What this does NOT change:** D1/D2/D5 for v1 stand. The managed-runtime tier
  is the next milestone after v1, recorded here so positioning stays honest.
- **Doc fixes required (tracked, not yet applied):**
  - `README.md` lines 145–146: split "Hosted managed MCP endpoint" (the
    Cloudflare Worker — separate, real) from "Hosted vector recall / graph /
    evals" (reframe as the *managed-runtime tier*, a v1.x/v2 milestone, not v1
    early access).
  - `ROADMAP.md` lines 35–37: move "Hosted vector recall / graph / evals" to
    "Later," annotated as the managed-runtime tier built on top of v1 sync.
  - `README.md` architecture section / OSS-vs-Cloud table: state the thesis —
    local-first by default; managed-engine-as-a-service when you don't want to
    run it.
- **Status:** **Locked.**
- **Candidate for ADR:** yes — strong ADR candidate. Hard to reverse (defines
  the cloud's long-term product shape), surprising (a "managed engine" that is
  the local engine re-hosted, sequenced foundation-first), real trade-off
  (ship-now vs. hold-for-compute). Promote at end of session.
## Q5 — How smart/super-intelligent is TekMemo? (v1 intelligence scope)

- **Question (from `new-architecture.md` open question 4):** how smart and
  super-intelligent is TekMemo?
- **Honest current state (audited in code):**
  | Capability | Status | Where |
  |---|---|---|
  | Hybrid recall (BM25 + fuzzy + optional vector + reranker) | ✅ Strong | `packages/tekmemo/src/recall/hybrid/hybrid-recall.ts`; proven by `tests/intelligence/local-intelligence.test.ts` (zero-config "login auth" → finds "Authentication uses JWT") |
  | Recency-weighted decay | ✅ Real (ranking only) | `hybrid-recall.ts` half-life, 30-day default |
  | Graph auto-extraction | ⚠️ **Weak / pattern-only** | `packages/tekmemo/src/graph/extraction/rule-based-extractor.ts` — ~7 regex patterns ("X uses Y", "depends_on", "prefers", …). Natural prose yields almost nothing. |
  | Memory consolidation / merging | ❌ None | Same fact written twice = two notes |
  | Semantic deduplication | ❌ None | — |
  | Reasoning / inference over graph | ❌ None | Traversal + filters only |
  | Proactive surfacing | ❌ None | Recall is query-time only |
  | LLM-based extraction | ❌ None | No LLM in the extraction path |
- **One-liner:** TekMemo has genuinely strong retrieval, weak pattern-based
  graph extraction, and no higher-order memory intelligence (consolidation,
  inference, semantic dedup, proactivity). It is "a strong search engine with
  decay," not yet an intelligent memory system in the Mem0/Zep sense.
- **Answer (locked, 2026-06-20, Option B):** **v1 intelligence = hybrid
  retrieval + recency + LLM-based extraction + memory consolidation.**
  - **LLM-based extractor** (pluggable via a new adapter interface, mirroring the
    embedder adapters — see sub-question below): given a note, extract
    arbitrary subject–predicate–object triples + entities, not just the 7 regex
    patterns. Makes the graph actually grow from natural text.
  - **Memory consolidation:** a background/local pass that (a) merges
    semantically-duplicate notes, (b) lets decay actually *retire* superseded
    memories (mark, not delete — preserves the audit trail), (c) resolves
    contradictions ("we used JWT" → later "we switched to OAuth" → first marked
    superseded via the existing `supersedes` edge type the rule-based extractor
    already emits). The plumbing partially exists (`graph/invalidation/
    invalidate-superseded-edges.ts`, the `supersedes` relation type).
  - Rule-based extractor **stays** as the zero-config / offline fallback (no LLM
    configured → regex patterns still extract the obvious triples). LLM
    extractor is layered on top when an adapter is configured.
- **Rationale:** Q4's moat is "we run the best local memory engine on managed
  infra." Retrieval is table-stakes; **consolidation is the differentiator.** A
  competitor shipping memory that consolidates/forgets/infer will out-position
  a retrieval-only engine on capability. Consolidation is also the thing that
  makes a user *feel* the system is smart (it quietly merges/retires without
  being asked).
- **Sub-question — extractor shape (locked): pluggable adapter, provider-neutral.**
  - Mirrors the existing embedder/reranker adapter pattern
    (`@tekbreed/tekmemo-adapter-openai`, `-voyage`, `-transformers`).
  - Honors `AGENTS.md`: "Core protocol contracts must be provider-neutral."
  - **Key consequence for the local-first thesis:** the `-transformers` adapter
    already proves an LLM-capable model can run fully in-process (ONNX, zero API
    key). An LLM extractor built on a local model adapter means **extraction +
    consolidation can run 100% locally, offline, no cloud** — the same
    "zero-config intelligence" property the recall engine already has. The OSS
    stays genuinely smart without requiring any provider key.
  - Rejected alternative: hard dependency on one LLM provider. Violates
    provider-neutral rule and breaks local-first.
- **Explicitly out of scope for v1 (deferred, not killed):**
  - Multi-hop semantic inference across the graph (A depends-on B, B depends-on
    C ⇒ infer A depends-on C).
  - Proactive surfacing (memory injected into context without a query).
  - Full agentic memory loop (Q's Option C).
  - These are candidates for the managed-runtime tier (Q4) or a later OSS
    release, not v1.
- **Doc/marketing implication:** the "super intelligent" claim must map to
  *specific* capabilities in copy — "hybrid recall, auto-extracted knowledge
  graph (LLM + rule-based), and memory consolidation that merges duplicates and
  retires outdated facts." Not a vague adjective. Tracked as a doc fix.
- **Status:** **Locked.**
- **Candidate for ADR:** yes — defines the intelligence surface for v1 and the
  provider-neutral extractor contract. Promote at end of session.
## Q6 — Package triage: remove / keep / add under the new architecture

- **Question (from `new-architecture.md` open question 5):** with this new
  architecture, which packages should be removed and which should stay?
- **Audit method:** reviewed all 9 `packages/*`, both `apps/*`, `tooling/*`, and
  `benchmarks/` against decisions Q1–Q5 + AGENTS.md rules. Each verdict grounded
  in code (consumer counts, dependency direction, architecture fit).
- **Verdicts (all locked, 2026-06-20):**

  | Package / App | Verdict | Why (grounded) |
  |---|---|---|
  | `packages/tekmemo` | **KEEP** (core) | The engine. Non-negotiable; Q4/Q5 depend on it. |
  | `packages/tekmemo-cli` | **KEEP** | Local execution surface for connectors (Q1/Q2); will grow connector commands. |
  | `packages/tekmemo-mcp-server` | **KEEP** | Agent integration surface; already mid-refactor on this branch. |
  | `packages/tekmemo-adapter-openai` | **KEEP** | Embedder adapter; provider-neutral (AGENTS.md). |
  | `packages/tekmemo-adapter-voyage` | **KEEP** | Embedder + reranker adapter; provider-neutral. |
  | `packages/tekmemo-adapter-transformers` | **KEEP** (strategic) | Local-first keystone: zero-API-key embeddings, and per Q5 the basis for a local LLM extractor. |
  | `packages/tekmemo-testing` | **KEEP** | Shared contract tests/fixtures; used by all packages. |
  | `apps/docs` | **KEEP** | Docs site; update content per Q4/Q5 doc-fix lists. |
  | `tooling/*` (typescript, utils, tsdown) | **KEEP** | Internal `@repo/*` per AGENTS.md; unchanged. |
  | `packages/tekmemo-adapter-upstash` | **REMOVE** | **6a.** Zero consumers (no src refs outside itself). Cloud vector-store adapter contradicts D1/D2 (cloud = file replica, not a vector DB). Pre-launch (D8) → delete, no deprecation cycle. |
  | `packages/tekmemo-benchmark-kit` ↔ `benchmarks/` | **CONSOLIDATE (6b)** | Two overlapping benchmark efforts. Keep `tekmemo-benchmark-kit` as the **published** reusable lib (datasets, runners, thresholds); make `benchmarks/` (private `@tekbreed/benchmarks`) **consume** the kit and own only results (`benchmark-results/{full,release,smoke}`). One source of truth: kit owns code, workspace owns results. Matches ROADMAP "Benchmark suite publication." |
  | `apps/tekmemo-mcp-worker` | **SHELVE for v1 (6c)** | Currently built on the **deleted cloud engine** — its `Env` is `TEKMEMO_API_KEY`/`TEKMEMO_API_URL`/`cloud-only runtime` (verified in `apps/tekmemo-mcp-worker/src/index.ts`). Broken under new arch. Rewriting to run the engine in-Worker = the managed-runtime tier (Q4), sequenced as v1.x/v2. So: shelve for v1, remove from deploy path, reopen as the managed-runtime milestone. README line 145 "Hosted managed MCP endpoint" → "Later." |
  | `packages/tekmemo-connectors` | **ADD (6d)** | Locked by Q1–Q3. The local connector framework + built-in Notion/GitHub connectors. New published package. |
  | `packages/tekmemo-adapter-extractor` | **DEFER (6d)** | Q5 locked an LLM extractor as pluggable/provider-neutral, but no implementation exists yet. Don't create an empty package speculatively. **Define the `Extractor` interface in core `packages/tekmemo` now**; add the first concrete adapter package only when built (likely a `-transformers`-based local extractor to preserve zero-config intelligence). |

- **Net package count change:** 9 → 9 published (remove upstash −1, add
  tekmemo-connectors +1), plus the deferred extractor adapter later.
- **Status:** **Locked.**
- **Candidate for ADR:** yes — shapes the published surface and removes an
  architecture-contradicting package. Promote at end of session.
## Q7 — Per-package final review ("so we don't come back again")

- **Purpose:** for every surviving package/app, state exactly what must change
  to conform to the locked decisions (Q1–Q6) + the in-flight refactor (D1–D9),
  grounded in the actual code state on this branch.
- **Critical finding (verified on branch):** the refactor is **mid-flight**.
  Despite −4642/+1124 lines changed, two locked items are *not yet done* in
  code: `TekMemoRuntimeMode` in `packages/tekmemo/src/tekmemo/types.ts:10`
  **still contains `"cloud"`** (D4 wants it gone), and `memory-paths.ts` has
  **no connectors path yet** (Q2 needs it). So the branch must finish its own
  D-items before any Q1–Q6 work begins.

### `packages/tekmemo` (core runtime) — the bulk of the work
- **Finish D4 (modes):** `TekMemoRuntimeMode` → `"local" | "hybrid" | "memory"`;
  drop `"cloud"`. `RuntimeReadPolicy`/`WritePolicy` drop `"cloud-only"`. Update
  `config.ts` `resolveMode`/`isRuntimeMode`/`isReadPolicy`/`isWritePolicy`.
- **Q2 — connectors as 11th canonical file:** add
  `.tekmemo/connectors.json` to `CANONICAL_TEKMEMO_FILES` in
  `packages/tekmemo/src/core/constants/memory-paths.ts` (currently 10 files).
  `file-replication.ts` `computeLocalManifest()` then walks 11 files + snapshots
  automatically (it derives from the constant). Define the `connectors.json`
  schema: `{ connectors: [{ id, type, enabled, schedule, sourceMapping,
  secretRef }] }` — **never** the token.
- **Q3 — connector-write discipline:** enforce that connector ingest writes
  notes with `source: "connector"`, stable `sourceId` (external id), and a
  content-derived `id` (no wall-clock in hashed bytes). The schema
  (`packages/tekmemo-mcp-server/src/schema.ts` `sourceRefSchema`) already
  accepts `sourceType: "connector"`. The discipline is in the *connector*
  writer (the new `tekmemo-connectors` package), not core.
- **Q5 — intelligence surface:**
  - Define the provider-neutral `Extractor` interface here (mirrors the embedder
    contract in `packages/tekmemo/src/...`). It does **not** exist yet (verified).
  - Add **memory consolidation**: a local pass that (a) merges semantically-dup
    notes, (b) marks superseded facts via the existing `supersedes` edge type +
    `graph/invalidation/invalidate-superseded-edges.ts`, (c) respects decay for
    *retirement* (mark) not deletion.
  - Keep the rule-based extractor as the zero-config fallback; LLM extractor
    layers on top when an adapter is configured.
- **Acceptance (D-list from refactor doc §15):** `cloud-strategy.ts` deleted
  (✅ done); `TekMemoCloudClient` trimmed to health/readiness/sync (✅ done);
  mode/policy types trimmed (❌ pending — see above); file-based sync types +
  `file-replication.ts` (✅ done); pre-sync snapshot before mutations (✅ done).

### `packages/tekmemo-cli` — add connector commands
- **Q1/Q2:** add a `tekmemo connectors` command group — `add`, `remove`, `list`,
  `run`. `add` writes to `.tekmemo/connectors.json` (local, no token — token is
  the server-side `secretRef`); `run` invokes the local connector framework.
- **Q4:** remove any cloud-engine-only commands that assumed hosted recall/graph
  (verify against the in-progress `cloud.ts` diff — already −2000 lines on this
  branch; finish the trim to sync-only commands).
- Keep all local-engine commands unchanged.

### `packages/tekmemo-mcp-server` — finish the trim, add consolidation tooling
- The branch already cut ~600 lines from `tools/handlers.ts` + `definitions.ts`
  and trimmed `factory.ts`. Finish removing any tool that delegated to the
  deleted cloud engine namespaces.
- **Q5:** consider exposing a consolidation tool (`tekmemo_consolidate` or an
  automatic background tick) so MCP clients benefit from the new intelligence
  without code changes.
- Verify `sourceRefSchema` (`schema.ts`) already supports `connector` — ✅
  confirmed; no schema change needed for Q3.

### `packages/tekmemo-adapter-transformers` — basis for future local extractor
- **No changes for v1.** Keep as the zero-API-key embedder.
- **Q5/Q6 note:** when the first LLM extractor is built, a local implementation
  likely lives here (or a sibling `-adapter-extractor-transformers`) to preserve
  the zero-config-intelligence property. Deferred — do not pre-build.

### `packages/tekmemo-adapter-openai` / `-voyage` — unchanged
- Provider-neutral embedder/reranker adapters. No changes under Q1–Q6. They are
  also the model for the future extractor-adapter shape (Q5).

### `packages/tekmemo-testing` — extend fixtures
- Add contract fixtures for: file-based sync over 11 canonical files (incl.
  `connectors.json` with a `secretRef` and no token), connector-write
  determinism (same external content → same sha256), and consolidation
  (supersede + merge). The shared fakes are the right home for these.

### `packages/tekmemo-connectors` — **NEW, build from scratch**
- The local connector framework + ≥1 built-in connector (Notion or GitHub as
  the reference impl). Executes ingestion locally (Q1), reads config from
  `.tekmemo/connectors.json` (Q2), resolves `secretRef` → token via the future
  authenticated `GET .../connectors/:id/secret` endpoint, writes notes with
  `source: "connector"` + deterministic ids (Q3).
- Depends on `@tekbreed/tekmemo` (core) for the write path. Published as
  `@tekbreed/tekmemo-connectors`.

### `apps/docs` — content fixes (tracked in Q4/Q5)
- Rewrite OSS-vs-Cloud framing: v1 cloud = file-replica sync + connectors
  config; managed-runtime tier (hosted engine) is v1.x/v2. Fix README lines
  145–146 and ROADMAP lines 35–37 references that the docs site mirrors.
- Add a "Connectors" doc (local execution, web-config, secret handling) and an
  "Intelligence" doc (hybrid recall + LLM extraction + consolidation).

### `apps/tekmemo-mcp-worker` — **SHELVE (6c)**
- Remove from the deploy path for v1 (CI/`wrangler deploy`). Document that it
  reopens as the first instance of the managed-runtime tier (Q4). Its current
  `cloud-only runtime` wiring is dead against the new arch and must not ship.

### `packages/tekmemo-adapter-upstash` — **REMOVE (6a)**
- Delete the package, drop it from `pnpm-workspace.yaml` glob (covered by
  `packages/*`), and remove any README/package-table references (README line
  115). Pre-launch → no deprecation cycle.

### `benchmarks/` ↔ `packages/tekmemo-benchmark-kit` — **CONSOLIDATE (6b)**
- `tekmemo-benchmark-kit` owns code (datasets, runners, thresholds);
  `benchmarks/` (`@tekbreed/benchmarks`, private) consumes it and owns only
  result artifacts under `benchmark-results/`. Remove duplicated suite/dataset
  code from `benchmarks/`.

### `tooling/*` — unchanged
- `@repo/typescript`, `@repo/utils`, `@repo/tsdown`. Internal per AGENTS.md.

- **Sequencing note:** finish the in-flight D4/D5 refactor items on
  `packages/tekmemo` first (they're half-done on this branch), then Q2's
  connectors.json + Q5's Extractor interface + consolidation, then the new
  `tekmemo-connectors` package, then docs. Removals (upstash, worker shelving)
  can happen in parallel.

---

## Q8 — Tech stack for TekMemo Cloud (broke + launch-ASAP)

- **Question (from `new-architecture.md` new question 8):** what tech stack for
  TekMemo Cloud? Proposed: Better Auth, Railway, Turso/Drizzle, R2, React Router
  v8, Tailwind, Voyage adapter. Constraint: **completely broke, must launch
  ASAP.** Also: what's missing in the stack?
- **Hard constraints honored:** broke (favor free tiers / zero monthly cost) +
  ASAP (favor what's already started + official docs + minimal ops).

### Locked stack (v1 file-replica cloud)

| Layer | Choice | Why (cost/ASAP/arch-fit) |
|---|---|---|
| **Compute (API + dashboard)** | **Cloudflare Workers — ONE Worker** running Hono API + React Router **v8** framework-mode SSR dashboard, served via Static Assets | Hono + `@cloudflare/hono` adapter; RRv8 has first-class official support on Workers via the GA `@react-router/cloudflare` adapter + Cloudflare Vite plugin (verified: `@react-router/cloudflare@8.0.1` is `latest`). Free tier covers v1 (sync + dashboard are small). **Splittable to two Workers via service bindings** when the 3MB-free / 10MB-paid bundle cap bites or when the managed-runtime tier (ADR 0003) lands — no rewrite, just a seam. |
| **Blob storage** | **Cloudflare R2** | Already locked (`cloud-sync-and-refactor.md` §12.2). ~$0.015/GB, **free egress** — critical for a sync product (downloads are the main traffic). |
| **Metadata DB** | **Turso (libSQL) + Drizzle ORM** | Already locked (§12.2). libSQL/SQLite, free tier covers v1; Drizzle for type-safe DX matching the TS-everywhere stack. |
| **Auth** | **Better Auth** *(pending capability check)* | Must cleanly handle: (a) `tk_live_…` API keys for machine-to-machine sync, (b) OAuth callbacks for Notion/GitHub connectors, (c) scoped tokens (`memory:sync`). **Verify before final commit**; if it can't do all three, pick an alternative. |
| **Static assets / hosting** | **Workers + Static Assets** (NOT Pages) | Cloudflare has announced Pages ↔ Workers are **converging**; Workers + Static Assets is the recommended path for new projects. A single Worker serves SSR HTML + JS/CSS. |
| **CSS** | **Tailwind CSS** | Standard, fast, zero cost. |
| **Scheduling / queues / idempotency** | **Upstash QStash + Redis + Workflow** | Serverless, generous free tier (QStash ~10k msg/day free). QStash → connector schedules (Q1/Q2) + consolidation passes (Q5); Redis → rate limit/cursors/idempotency; Workflow → the managed-tier recall/extract pipelines later. **≠ the removed `tekmemo-adapter-upstash` vector adapter (Q6) — different product, no conflict.** |
| **Email** | **Managed Plunk** (account already held, NOT self-hosted) | $0.001/email, 3k free/mo, zero ops. Replaces earlier Resend suggestion. |
| **Observability (errors)** | **Sentry free tier** | Zero ops. |
| **Load testing** | **Grafana k6** | CLI, no server; sits beside `tekmemo-benchmark-kit` + `benchmarks/`. (Full Grafana+Prometheus dashboard deferred — overkill for v1.) |

### Corrections made to the original proposal

1. **React Router: confirmed v8 (revises an earlier, erroneous v8→v7 downgrade).**
   The first draft of ADR 0005 downgraded the proposal from v8 to v7, believing
   v8 hadn't shipped. That belief was wrong: `react-router@8.0.1` is the `latest`
   dist-tag and **`@react-router/cloudflare@8.0.1`** ships the official GA
   Cloudflare Workers adapter (verified via `npm view react-router dist-tags` /
   `npm view @react-router/cloudflare dist-tags`). v8 is the target; `apps/cloud`
   already pins `react-router@8.0.0`. v8 framework mode is the officially-
   supported SSR-on-Workers path. See ADR 0005 "Revision history."
2. **Railway removed from v1.** Railway has no meaningful free tier for
   production (~$5/mo floor). v1 is file-replica — it fits entirely in
   Cloudflare/Upstash free tiers. **Railway deferred to the managed-runtime
   tier** (ADR 0003), which is the one workload that can't be serverless (engine
   + ONNX models blow past the 10MB Worker cap).
3. **Pages → Workers + Static Assets.** Pages is converging into Workers;
   building new infra on it is wrong. One Worker serves SSR + assets.
4. **Voyage adapter is not a cloud-stack piece.** It's an OSS *runtime* embedder
   (`tekmemo-adapter-voyage`); v1 cloud does no embedding (D2). It matters again
   only at the managed-runtime tier.

### "What's missing?" — gaps that were absent from the proposal

1. **R2 presigned-URL generation** (server-side, via the R2 S3-compatible API —
   `aws4fetch` or `@aws-sdk/client-s3`). The entire sync model (§4.4/§4.5)
   depends on the server issuing presigned PUT/GET URLs.
2. **Secrets store for connector tokens** (ADR 0002). Tokens must not touch R2.
   v1: Turso-encrypted column or **Workers Secrets / KV**.
3. **Background scheduler** → covered now by Upstash QStash (above).
4. **Billing/entitlements enforcement** (§12.3). v1 free-tier-only launch:
   a Turso `entitlements` table read on every push. Paid billing via **Polar**
   (MoR + benefits API; see Q9) — wired when the Pro tier launches, not before.
5. **Email** → covered by Plunk (above).
6. **Observability** → covered by Sentry (above).

### Deployment topology (one Worker now, splittable later)

```
apps/tekmemo-cloud/            ← NEW. ONE Cloudflare Worker, MIT.
  ├── api/                     ← Hono (/v1/sync/*, health, connectors/:id/secret)
  ├── dashboard/               ← React Router v8 framework mode (SSR)
  └── assets binding           ← serves JS/CSS from the same deploy
# apps/tekmemo-mcp-worker/     ← SHELVED (Q6). Reopens as Worker 2 (managed
#                                 runtime) or as a service-bound companion.
```

- Worker 1 (cloud) + Worker 2 (managed runtime, future) communicate via
  **service bindings** — same Cloudflare account, same repo.
- The cloud Worker `import`s from `@tekbreed/tekmemo` (workspace types, no npm
  publish needed pre-launch). It must implement 31 exported types from
  `cloud-client/types.ts`.

### License decision (locked)

- **Whole repo stays MIT** (current state: root + `@tekbreed/tekmemo`).
- **Rejected: AGPL / closed-source on the cloud.** Reasons:
  1. AGPL's copyleft trigger is *distribution*; a hosted SaaS isn't distributed
     (the "ASP loophole"), so it barely protects a service — yet it *does* bite
     OSS adopters (most enterprises block AGPL deps on sight, fatal for a
     pre-launch OSS project that needs adoption).
  2. The cloud's value is **operational** (R2/Turso/Workers/keys/uptime/support),
     not the source. Copying the Worker code yields empty bindings + zero users.
     Same model as Supabase / Plunk / Cal.com / PostHog — open-core, hosted-rev.
  3. The cloud `import`s MIT types from the core; a restrictive license on the
     cloud half would force a clean-room boundary inside one repo — friction that
     breaks "ship ASAP."
- **Real protection comes from:** (a) **trademark** — reserve "TekMemo" /
  "TekMemo Cloud" so nobody else can brand their hosted version; (b) the
  operational moat; (c) **SSOT of the client types** (you publish
  `@tekbreed/tekmemo`, you control protocol evolution — followers stay a step
  behind); (d) data/network-effects once users have memory in *your* cloud.
- **One legitimate exception (not applicable):** if proprietary/closed third-
  party code were taken into the cloud Worker, that portion would need closing.
  None exists in this stack (Hono, RRv8, Drizzle, CF bindings — all open).

- **Status:** **Locked.**
- **Candidate for ADR:** yes — strong ADR candidate. Hard to reverse (the
  compute/storage/hosting choice + license frame the whole cloud), surprising
  (Workers-not-Pages, RR-not-SPA, MIT-not-AGPL despite "protect the cloud"
  instinct), real trade-offs (free-tier limits vs. Railway ease; openness vs.
  nominal protection). Promote after the Better Auth capability check confirms.

---

## Q9 — Pricing tiers for TekMemo Cloud

- **Question (from `new-architecture.md` new question 6):** what should the
  actual pricing be and what tiers should we have?
- **Grounding:** v1 runs on free tiers (R2 free egress, Turso free, Workers
  free, Upstash free, Plunk 3k/mo free), so **per-user cost ≈ $0**. Pricing is
  therefore a positioning + growth exercise, not cost-recovery. Enforcement
  follows the locked §12.3 model: **capability checks (`maxHostedStorageBytes`,
  `maxConnectors`), never `plan === "Pro"`.**
- **Answer (locked, 2026-06-20, Option B):** **Free (generous) + Pro ($9) +
  Teams (Coming Soon, disabled).**

  | Tier | Price | Storage | Connectors | Status |
  |---|---|---|---|---|
  | **Free** | $0 | ~1 GB hosted | **1** (GitHub *or* Notion) | Ships v1 |
  | **Pro** | **$9/mo** | ~25 GB hosted | **up to 3** (GitHub, Notion, + whatever ships) | Ships v1 |
  | **Teams** | **$24/mo** (list price, shown disabled) | ~100 GB + shared workspace (future) | **unlimited** | "Coming Soon" button, disabled — captures demand, no billing built |

- **Rationale:**
  - **Generous Free tier** is non-negotiable for OSS dev-tool adoption (the
    Supabase/Plunk/PostHog/Turso playbook). The OSS is the funnel; the cloud's
    Free tier is the activation step.
  - **One paid tier at v1** (Pro) avoids premature tier-ladder complexity; Teams
    added when funded (Pro revenue or sponsorships), per the ADR-0003
    managed-runtime sequencing. Billed via **Polar** (Q9), not Stripe.
  - **Teams "Coming Soon" (disabled)** captures demand signal + anchors the
    value ladder now, while it's cheap to change the number, without building
    billing/seat-management prematurely.
- **Entitlement model (numeric caps, not named-feature allowlists):**
  - Storage: `entitlements.maxHostedStorageBytes` (already locked, §12.3). Free
    ~1GB, Pro ~25GB, Teams ~100GB.
  - **Connectors: `entitlements.maxConnectors`** (new). Enforced as
    `connectors.length < maxConnectors` — Free=1, Pro=3, Teams=∞. **Not** a
    per-connector allowlist, per §12.3's "no `plan === 'Pro'`" principle.
    - Free: exactly 1 (GitHub *or* Notion).
    - Pro: up to 3, of whatever exists in the catalog at launch. If only
      GitHub+Notion ship at launch, Pro users get a 3-slot allowance that fills
      when connector #3 lands (Q10). **No phantom promise.**
    - Teams: unlimited, whatever the catalog holds when Teams ships.
- **Cost/margin math (honest):** R2 ≈ $0.015/GB → 25GB ≈ $0.38/mo cost at Pro
  (~96% margin at $9); 100GB ≈ $1.50/mo at Teams (~94% margin at $24). Free at
  1GB ≈ $0.015/mo — negligible.
- **Billing provider (locked, corrects earlier Stripe assumption): Polar, not
  Stripe.** Verified fit:
  - **Merchant of Record** → handles global sales tax/VAT (Stripe Tax would be
    extra cost/complexity). Offloads tax compliance entirely — significant for a
    solo founder.
  - **Benefits API** (`/v1/benefits/`) → maps directly to the §12.3 entitlement
    model (gating by `maxHostedStorageBytes` / `maxConnectors`).
  - **Metered/usage-based billing** → storage overage can be billed per
    byte-event.
  - **Fee reality (on record):** as of 2026, Polar Starter = **5% + 50¢ per
    transaction**. On a $9 Pro sub: ~$0.95 fee → net ~$8.05. Higher than Stripe's
    ~2.9% + 30¢ on small txns, but the trade (MoR + tax handled + billing UI +
    OSS-native) is worth it at broke+ASAP. Move to a lower-rate tier if volume
    grows.
- **Teams decisions (locked):**
  - **List price locked now: $24/mo** (3× Pro, deliberately not a round multiple).
    Locked while cheap to change; implementation deferred.
  - **Per-seat billing model (intended, for honest page copy): $24/seat/mo.**
    Implementation (seats, shared workspace, SCIM) deferred to when Teams ships,
    gated on Pro revenue or sponsorships (per ADR 0003).
- **Status:** **Locked.**
- **Candidate for ADR:** yes — defines the commercial shape + the
  entitlement-based enforcement model. Promote at end of session.

---

## Q10 — Connector set: is Notion + GitHub enough? what third?

- **Question (from `new-architecture.md` new question 7):** are Notion and
  GitHub enough connectors, or which other relevant ones do we need?
- **Lens:** connectors are how TekMemo proves its "intelligent memory" thesis
  (Q5) in practice — ingested content must get *consolidated, deduped, recallable
  by meaning*, not just dumped. So the third connector is chosen for **demo
  value + overlap with paying users** ($9 Pro ICP), not ease of build.
- **Answer (locked, 2026-06-20, Option A):**
  - **v1 ships GitHub + Notion.** Both non-negotiable for v1:
    - **GitHub** — mandatory; TekMemo is "memory for AI apps and coding agents"
      (README). Issues/PRs/discussions/READMEs → recallable context is the
      killer coding-agent demo. OAuth well-trodden.
    - **Notion** — mandatory; the dominant knowledge base for TekMemo's exact
      startup/indie-hacker/dev-tool audience. Pages/databases → memory is a
      compelling cloud pitch.
  - **Linear is queued as connector #3** (first post-launch addition). Why:
    maximum audience overlap with paying Pro users (Linear's ICP ≈ TekMemo's);
    best consolidation demo (Linear issues + GitHub PRs + Notion decisions often
    describe the same thing from different angles → the Q5 consolidation thesis
    made visible); clean GraphQL API + OAuth, buildable within broke+ASAP.
  - **Pro's 3-slot allowance (from Q9) is honest at 2 connectors:** the cap is
    `maxConnectors=3` checked as `length < 3`, not a named-feature list. With 2
    shipped, Pro users have one unfilled slot that fills when Linear lands — no
    phantom promise (per §12.3 "no `plan === 'Pro'`" principle).
- **Explicitly deferred (Teams-tier or later):**
  - **Slack** — huge overlap + classic "memory" use case, but **noisy** (volume
    risks the unbounded-JSONL-growth footnote from Q3) and Slack API rate-limits
    are painful. Defer; revisit when consolidation/retention is mature.
  - **Confluence** — enterprise knowledge base, Teams-tier magnet; Atlassian
    OAuth is heavy, not broke+ASAP ICP at v1.
  - **Google Drive/Docs** — universal but Google OAuth + Drive API scope reviews
    are slow/approval-heavy; broke+ASAP hostile.
  - **X/Reddit** — low overlap with paying dev-tool users; noisy.
- **Framework decision (locked): provider-neutral `Connector` interface from day
  one.** The new `packages/tekmemo-connectors` (from Q6) defines a shared
  `Connector` interface; each connector (GitHub, Notion, later Linear/Slack/…) is
  a plugin implementing it — mirroring the embedder/extractor adapter pattern
  everywhere else in the codebase (AGENTS.md: "provider-neutral"). Adding a
  connector later = "write a new adapter," not "refactor the framework."
- **Status:** **Locked.**
- **Candidate for ADR:** partial — the *set* is a product roadmap call (better
  in this log + ROADMAP than an ADR), but the **provider-neutral Connector
  interface** is ADR-worthy (shapes the extensibility contract). Fold into the
  Q1/Q6 connector ADR coverage.

---

## S2-Q1 — `ai-sdk/` and `agentfs/`: stay in core or extract?

> **Session 2 scope note:** the original session's Q1–Q10
> (Q1–Q5 original open questions; Q6 triage, Q7 per-package review, Q8 stack,
> Q9 pricing, Q10 connector set) are locked. This session continues the grill
> with four new branches: (S2-Q1) composability of the two remaining un-scoped
> core subsystems, (S2-Q2) package code review, (S2-Q3) docs architecture,
> (S2-Q4) root-docs alignment. Numbered `S2-Q*` to avoid collision with the
> original `Q*` numbering.

- **Question:** `packages/tekmemo/src/ai-sdk/` (Vercel AI SDK integration) and
  `packages/tekmemo/src/agentfs/` (session-workspace layer) are un-scoped under
  the new architecture. With "composable as possible + extending soon," do they
  stay in core or get extracted?
- **Grounding (audited in code):**
  - **`ai-sdk/` = a provider integration, not a primitive.** `createAiSdkRuntime
    FromTekmemo(memo)` bridges a `Tekmemo` into `TekMemoAiRuntime`;
    `buildMemoryToolDefinition` / `runStructuredMemoryTool` wrap a **Vercel AI
    SDK** tool (zod discriminated union: view/create/update/search);
    `buildPrepareCallMemoryText` / `buildRuntimeMemoryContext` inject memory
    text into prompts. `ai` is an **optional peer dep** in core today
    (`>=5.0.0 <7.0.0`, resolved `ai@^6`). Core's root `index.ts` re-exports
    Vercel-specific tool schemas — i.e. core's public surface is *not*
    provider-neutral today.
  - **`agentfs/` = a framework-agnostic primitive.** `AgentfsLikeClient`
    interface (readText/writeText/appendText/exists/deleteText + optional
    sync). `createTekMemoAgentSession` spins an isolated per-session workspace
    (context/working/output), pulls memory in, scaffolds, extracts curated
    durable memory → `notes.md`, with checkpoint + sync before/after. Imports
    core only (`MemoryStore`, `MemoryPath`, canonical paths). **Zero** AI-SDK
    dep, **zero** AI-vendor dep. It is the session equivalent of `sync/`.
  - **Consumers:** `packages/tekmemo-cli/src/commands/agent.ts`;
    `examples/{nextjs,openai-agents-sdk,ai-sdk}/`; `apps/docs` (4 pages).
  - **Contradiction surfaced:** `AGENTS.md` requires "Core protocol contracts
    must be provider-neutral." Every other integration follows the adapter
    pattern in its own package (`tekmemo-adapter-openai/-voyage/-transformers`,
    future `-extractor`/`-connectors`). **The Vercel AI SDK integration is the
    one violator living inside core.** `agentfs` is clean.
- **Answer (locked, 2026-06-20, Option B):** **Extract `ai-sdk/` to a new
  published adapter package; keep `agentfs/` in core.**
  - `packages/tekmemo/src/ai-sdk/*` → **new `@tekbreed/tekmemo-adapter-ai-sdk`**
    (published). It owns the Vercel AI SDK tool wrapper, runtime bridge,
    prepare-call memory text, agent-session instructions, scope policy. The
    `ai` peer dep moves from "optional in core" to "real dep of the adapter"
    (correct: depending on the AI SDK adapter means depending on the AI SDK).
  - `packages/tekmemo/src/agentfs/` **stays in core.** It is a primitive over
    the memory store (like `sync/`, `graph/`, `recall/`), not tied to any AI
    vendor.
- **Rationale:**
  1. **Pattern parity.** Embedder / reranker / extractor / connector all follow
     "protocol contract in core, provider impl in `tekmemo-adapter-*`." The
     Vercel AI SDK integration is a provider impl — it belongs on the same seam.
  2. **Extensibility is additive.** "Add LangChain / OpenAI Agents SDK / Mastra
     support" = new adapter package, import the runtime contract from core,
     ship. Core never changes. Under status quo, each new framework bloats core.
  3. **Core stays provider-neutral.** Today core's `index.ts` re-exports Vercel-
     specific tool schemas; a user wanting only the memory engine still pulls
     those types. After extraction, core's surface is vendor-free.
  4. **`agentfs` correctly stays.** No provider coupling; extracting it (the
     rejected Option C) is fragmentation for its own sake.
- **Migration footprint (finite, ~1 session):** move `src/ai-sdk/*` → new
  package; update imports in `packages/tekmemo-cli/src/commands/agent.ts` + the
  three `examples/*` + the 4 `apps/docs` pages; drop the `ai` optional peer dep
  from core `package.json`; republish. No runtime behavior change.
- **Sub-question (locked, 2026-06-20, Option 2): interface splits into two
  layers with different homes.**
  - **L1 — runtime interface → core**, renamed `TekMemoAiRuntime` →
    **`TekMemoMemoryRuntime`**. Methods: `recall`, `readCoreMemory`,
    `updateCoreMemory`, `listNotes`, `createNote`, optional `index`. Pure
    memory operations, zero framework types. The name change drops the
    AI-SDK-flavored naming so a future reader doesn't assume vendor coupling.
    Replaces its `JsonObject` re-export from `ai` with core's own `JsonObject`
    (`core/types/json.ts`) — removes the last AI-SDK type leak from core.
  - **L2 — Vercel tool/protocol layer → the adapter.**
    `buildMemoryToolDefinition` / `runStructuredMemoryTool` (zod tool wrapper),
    `memoryToolInputSchema`, `buildPrepareCallMemoryText`,
    `buildRuntimeMemoryContext`, `buildAgentSessionInstructions`,
    `scopePolicy`. All Vercel-AI-SDK-specific; stays with the impl.
  - **Precedent (why this split is correct):** the embedder pattern already does
    exactly this — `Embedder` *interface* is a core type, OpenAI/Voyage/
    transformers *implementations* are adapter packages. The memory-runtime
    interface follows the identical seam. When `tekmemo-adapter-langchain` (or
    OpenAI Agents SDK / Mastra) is built later, it implements the **same**
    `TekMemoMemoryRuntime` — zero new interface to invent, identical memory
    semantics across frameworks.
  - **Rename footprint (bounded):** the interface file, `tekmemo-runtime.ts`,
    the adapter's exports, `tekmemo-cli/src/commands/agent.ts`,
    `examples/ai-sdk/`, 3 test files, the 4 `apps/docs` pages.
- **Status:** **Locked** (Option B + sub-question Option 2 + rename).
  **Executed 2026-06-20** — the migration described above is now landed and
  validated in code (not docs-only): the 14 `src/ai-sdk/*` files moved into
  `packages/tekmemo-adapter-ai-sdk/` (+ tests + README + LICENSE + tsdown/
  tsconfig/ vitest), `TekMemoAiRuntime` renamed to `TekMemoMemoryRuntime`
  (framework-neutral L1 contract now in `packages/tekmemo/src/ai-runtime/`),
  the `ai` peer dep dropped from core, and the 3 `examples/*` consumers +
  `examples/package.json` updated. **Validated green:** `pnpm install`;
  typecheck on core, adapter, CLI, MCP server, examples; test:run on core
  (369), adapter (23 | 3 skipped), CLI (98), MCP server (40) — all pass.
  Resolves the "S2-Q1 recorded complete but never executed" gap noted in
  [`s2-q2-package-review.md`](./s2-q2-package-review.md) §B3. Docs drift
  (`apps/docs/.../ai-sdk/*`, `ROADMAP.md`) remains, scoped to S2-Q3/Q4.
- **Candidate for ADR:** **yes** — hard to reverse (published package boundary
  + a renamed core contract), surprising (moving code *out* of core + renaming
  a public type pre-launch), real trade-off (status-quo convenience vs.
  composability). Drafted as [ADR 0007](../adr/0007-ai-sdk-extraction.md).

---

## Q11 — Cloud Worker build: `@cloudflare/vite-plugin` × React Router v8 manifest incompatibility

- **Discovered:** 2026-06-20, during P0 verify-c (production build gate).
- **Symptom:** `pnpm build` in `apps/cloud` fails in the third (Cloudflare
  Worker) build phase:
  ```
  [plugin react-router:virtual-modules]
  Error: ENOENT: no such file or directory, open
  '.../apps/cloud/build/client/.vite/manifest.json'
  ```
- **What actually happens (traced in installed source):**
  1. RR's client env build correctly emits `build/client/.vite/manifest.json`
     (visible in the build log: `6.68 kB`).
  2. RR's SSR env build runs and calls `cleanViteManifests()` (`@react-router/dev/dist/vite.js`),
     which deletes `.vite/manifest.json` for every environment whose
     `viteManifestEnabled` is false — including the **client** manifest — then
     removes the now-empty `build/client/.vite/` directory.
  3. `@cloudflare/vite-plugin@1.42.1` then starts its **own** Worker
     environment build (`tekmemo_cloud`), whose `react-router:virtual-modules`
     load hook re-reads `build/client/.vite/manifest.json` to build the inlined
     browser manifest — but step 2 already deleted it → `ENOENT`.
- **Why this is external, not our bug:** `@react-router/cloudflare@8.0.1`
  ships **no Vite plugin/preset** (runtime adapters only), so the
  `@cloudflare/vite-plugin` Worker build is the only Worker-bundling path.
  RR v8 (released days ago) relocated manifests + "always enables" the Vite
  Environment API; `@cloudflare/vite-plugin@1.42.1` officially supports only
  RR v7. No public fix or v8-aware version exists yet (confirmed via web
  search 2026-06-20).
- **Scope of impact:** **Production build/deploy path only.** The Vite dev
  server (`pnpm dev`), `tsc` typecheck, and `vitest` are all **green** —
  `workers/dev-api.ts` + `vite/dev-api.ts` serve `/v1/*` and SSR identically
  to prod. Verified: `/` → 200 (SSR dashboard HTML renders), `/v1/health` →
  200 `{data,meta}`, `/v1/readiness` → 200 with capabilities, `/v1/nope` → 404
  envelope.
- **Options considered:**
  - **A. Pin React Router to v7** (the version `@cloudflare/vite-plugin`
    officially supports). Highest certainty; costs the v8 improvements we
    picked it for and touches `react-router`, `@react-router/dev`,
    `@react-router/cloudflare`, and any v8-only API we use (`ServerRouter`
    no-`abortDelay`, `meta` signature, auto-routes). Reversible.
  - **B. Ship a tiny Vite plugin that snapshots `build/client/.vite/manifest.json`
    on the client env `writeBundle` and restores it before the Worker env
    reads it.** Keeps v8; fragile (patches third-party ordering), must be
    re-validated on every bump of either package.
  - **C. Drop `@cloudflare/vite-plugin`, build the Worker manually**
    (`react-router build` produces `build/server/index.js`, a valid Worker
    entry; point `wrangler.jsonc` `main` at it and run `wrangler deploy`
    separately). Most control; loses the plugin's dev-time binding injection
    (`context.cloudflare.env`) and `persistState`, so the dev-server story
    changes.
  - **D. Wait for a v8-aware `@cloudflare/vite-plugin` release** and proceed
    on P1/P2 (schema, sync handlers, presign) which don't need the prod build.
    Build gate is only needed at first deploy.
- **Status:** **Open — needs user decision.** Recorded here so the blocker is
  traceable. P1/P2 work (Drizzle schema, sync handlers, R2 presign, auth) is
  unblocked and proceeds regardless; only the production deploy is gated.
- **Candidate for ADR:** yes, once resolved — it's surprising (a green dev
  cycle + a red prod build on bleeding-edge deps) and the resolution is a
  real trade-off.

---

## Q12 — DB naming convention: `snake_case` identifiers, `camelCase` consts, `PascalCase` types

- **Question:** before generating the first Drizzle migration (P1.3), we need a
  locked DB naming convention so every table/column/index reads consistently
  and there is no drift between the relational layer (Drizzle) and raw SQL
  (migrations, dashboards, ad-hoc queries). Which convention?
- **Answer (locked, 2026-06-21):**
  - **DB identifiers** (table names, column names, index/constraint names) =
    `snake_case`.
  - **Drizzle table consts** (the JS variable holding the table definition) =
    `camelCase`.
  - **Inferred row types** (`typeof table.$inferSelect` / `$inferInsert`) =
    `PascalCase`.
  - Drizzle decouples the JS name from the DB name: the first arg to
    `sqliteTable()` is the literal DB string; the variable name is TS-only. So
    the const `apiKeys` maps to the table `api_keys`, and idiomatic JS
    `account.apiKey` maps to the column `api_key`.
- **Rationale:**
  - SQLite/libSQL, like Postgres, folds unquoted identifiers to lowercase and
    has no native camelCase. `snake_case` is the ecosystem norm (Turso, Postgres,
    Drizzle's own generated SQL) and reads cleanly in raw SQL — important when
    debugging migrations or querying the dashboard DB by hand.
  - Keeping the **JS/TS surface idiomatic** (`camelCase` consts/props,
    `PascalCase` types) means app code reads like the rest of the TS-everywhere
    codebase; the `snake_case` stays where it belongs — in the DB and migrations.
  - Decoupled naming is Drizzle's intended pattern, not a workaround: the
    column-builder arg is explicitly the DB string, the property access is the
    app string. No global config or mapper needed.
- **Examples (already applied in `apps/cloud/src/db/schema.ts`):**
  | Layer | Identifier | Example |
  |---|---|---|
  | Table (DB) | `snake_case` | `api_keys`, `project_files`, `sync_cursors` |
  | Column (DB) | `snake_case` | `account_id`, `polar_customer_id`, `max_hosted_storage_bytes` |
  | Index (DB) | `snake_case` | `project_files_project_path_uq` |
  | Const (TS) | `camelCase` | `apiKeys`, `projectFiles`, `syncCursors` |
  | Property (TS) | `camelCase` | `account.apiKey`, `project.accountId` |
  | Row type (TS) | `PascalCase` | `ApiKey`, `ProjectFile`, `SyncCursor` (when inferred) |
- **Enforcement:** the convention is encoded in the JSDoc header of
  `apps/cloud/src/db/schema.ts` and is the review bar for every future schema
  change. No lint rule added (Drizzle's column-builder API doesn't expose the
  literal name to a linter cleanly); enforced by review + the header doc.
- **Status:** **Locked.** Applied to the five tables shipped so far
  (`accounts`, `api_keys`, `projects`, `project_files`, `sync_cursors`); the
  convention governs all future tables (e.g. the `users` / Better-Auth tables
  when auth lands).
- **Open sub-questions:** none.
- **Candidate for ADR:** no — a naming convention is a style rule, not a hard-
  to-reverse / surprising / real-trade-off decision. It lives here as the
  governing reference and in the schema header.

---

## Q13 — Project provisioning: auto-provision on first push

- **Question:** when a client calls `/v1/projects/:projectId/sync/*` against a
  `:projectId` that does not yet exist in the `projects` table, how should the
  cloud behave? The spec (§4) assumes a project exists, but nothing in the auth
  / account flow creates one, and `projects.isDefault` implies an account gets a
  default project at some point.
- **Answer (locked, 2026-06-21, recommended Option A):** **auto-provision on
  first push; pull/status return empty for a missing project.**
  - **Push** (`POST …/sync/push` / `…/sync/push/complete`): if `:projectId` is
    absent in `projects`, lazily create it owned by the authenticated account
    (`projects.accountId = c.var.account.id`), with the id taken verbatim from
    the URL path. This is the git model — the remote appears on first push.
    Ownership is established at provisioning; a subsequent push by a *different*
    account's key to the same id is a 403 (handled by the existing ownership
    check, not by provisioning).
  - **Pull / status** on a missing project return an **empty** result
    (`manifest: {}`, `cursor: "0"`, `storageBytes: 0`) rather than a 404, so a
    brand-new client's first pull is a clean no-op rather than an error. This
    matches "the cloud holds nothing yet," which is the truth for a missing
    project.
- **Rationale:**
  - Local-first: the first device's first push is the act that brings the
    project into existence server-side. No out-of-band provisioning step, no
    dashboard prerequisite, no chicken-and-egg between "configure sync" and
    "create project."
  - Keeps sync handlers self-contained — provisioning is a push-path concern,
    not a separate control-plane endpoint that would have to be built and
    documented before v1 can sync.
  - `projects.is_default` stays for the future dashboard's notion of a default
    project per account; it is not set by auto-provision (a sync-provisioned
    project is just "a project this key has synced").
- **Implementation:** `ensureProject(db, accountId, projectId)` — returns the
  existing project if present (after the ownership check), else inserts one. The
  ownership check (`project.accountId === account.id`) is performed for every
  authenticated sync request regardless of provisioning, so a key that does not
  own an existing project gets 403 before any sync logic runs.
- **Status:** **Locked.**
- **Open sub-questions:** none.
- **Candidate for ADR:** no — a small, reversible behavioural choice grounded in
  the local-first thesis; recorded here as the reference for the sync handlers.

---

## Q14 — Cursor format: plain decimal string

- **Question:** `sync_cursors.seq` is an integer and `SyncCursor` is a string.
  The client treats the cursor as opaque, but the server must pick a concrete
  encoding for pull-`since` comparisons and for the value returned on push/pull.
- **Answer (locked, 2026-06-21, recommended Option A):** **the cursor is the
  plain decimal string of `seq`** (e.g. `"42"`). `since` is parsed back to an
  integer with `Number(...)`; comparisons are numeric.
- **Rationale:**
  - `seq` is already an integer monotonic counter; `String(seq)` is the obvious
    encoding. No base64, no JSON, no `{seq, projectId}` envelope — none of which
    buy anything for a single-project, single-counter value.
  - Trivially debuggable by hand (read the cursor in a log, compare to
    `sync_cursors.seq` in the DB directly).
  - `cursor: "0"` doubles as the "no commits yet" sentinel for a fresh project,
    which is what pull/status return for a not-yet-pushed project (Q13). A
    missing project and a project with no commits are indistinguishable from the
    cursor alone — which is correct (the cloud holds nothing either way).
- **Status:** **Locked.**
- **Open sub-questions:** none. If a future requirement needs cross-project or
  sharded cursors, the encoding can change; the client contract (opaque string)
  is unaffected.
- **Candidate for ADR:** no — a trivial encoding choice, recorded here only so
  the handlers stay consistent.

