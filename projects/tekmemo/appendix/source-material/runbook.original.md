# TekMemo Runbook v2

## 1. What TekMemo is

### Simple definition

**TekMemo is memory for AI apps and AI agents.**

It helps AI systems remember useful information about:

* users,
* projects,
* files,
* teams,
* decisions,
* conversations,
* codebases,
* workflows,
* and previous agent actions.

The simplest way to explain it:

> TekMemo is a smart memory notebook that AI apps can read from and write to.

When an AI app uses TekMemo, it does not need to start from zero every time the user asks a question.

---

## 2. Layman explanation

Imagine you hired a very smart assistant.

The assistant can help you write code, summarize files, plan products, explain concepts, write documentation, and solve problems.

But there is a problem.

Every morning, the assistant forgets everything.

So you keep repeating yourself:

> “Remember that this project uses React Router v7.”

> “Remember that we chose Prisma instead of raw SQL.”

> “Remember that this workspace is for TekMemo.”

> “Remember that this user prefers simple explanations first.”

> “Remember that this customer is on the Professional plan.”

> “Remember that this agent already reviewed the repo.”

That is frustrating.

TekMemo solves that problem.

It gives the AI a memory system.

So when the user comes back later, the AI can say:

> “I remember this project. I know the stack, the decisions, the files, the current task, and the previous context.”

That is TekMemo.

---

## 3. Professional explanation

**TekMemo is a file-first memory runtime for AI applications, AI agents, and developer workspaces.**

It provides a structured system for capturing, storing, indexing, retrieving, updating, syncing, and governing memory across users, workspaces, teams, repositories, agents, and workflows.

TekMemo is designed to make AI systems:

* persistent,
* context-aware,
* workspace-aware,
* file-aware,
* user-aware,
* explainable,
* auditable,
* and reusable across sessions.

It is not just chat history.

It is not just a vector database.

It is not just a document search system.

It is the memory layer that sits between an AI app and the information it needs to behave intelligently over time.

---

# 4. The core idea

## 4.1 Normal AI app

A normal AI app works like this:

```txt
User asks question
        ↓
AI model answers
        ↓
Context is mostly forgotten
```

The app may keep chat history, but chat history is not the same as structured memory.

---

## 4.2 AI app with TekMemo

An AI app with TekMemo works like this:

```txt
User asks question
        ↓
App asks TekMemo: "What do we already know?"
        ↓
TekMemo retrieves relevant memory
        ↓
AI model answers with context
        ↓
TekMemo stores new useful memory
```

So the AI improves over time.

---

# 5. What “file-first memory runtime” means

## 5.1 File-first

**File-first** means TekMemo stores memory in readable files before indexing it.

For example:

```md
# Project Stack

- Frontend: React Router v7
- Runtime: Cloudflare Workers
- Database: Turso
- ORM: Prisma
- UI: shadcn/ui
- Styling: Tailwind CSS
```

This file can be read by:

* humans,
* AI agents,
* developer tools,
* sync systems,
* Git,
* dashboards,
* and search/indexing engines.

The file is the source of truth.

---

## 5.2 Runtime

**Runtime** means TekMemo is not only storage.

It actively decides:

* what should be remembered,
* where memory belongs,
* how memory should be searched,
* what memory is relevant,
* what memory should be injected into the AI prompt,
* what memory should be updated,
* what memory should be forgotten,
* and which agent/user/app can access memory.

So TekMemo is not passive storage.

It is an active memory system.

---

# 6. What TekMemo is not

## 6.1 TekMemo is not only a vector database

A vector database stores embeddings.

That is useful, but incomplete.

A vector database answers:

```txt
Which text chunks are similar to this query?
```

TekMemo answers:

```txt
Which memory should this AI app use, from which scope, with which permission, and how should that memory be updated later?
```

TekMemo can use a vector database internally, but TekMemo itself is bigger than vector search.

---

## 6.2 TekMemo is not only RAG

RAG usually means:

```txt
Search documents → send results to AI → generate answer
```

TekMemo includes RAG, but goes further.

TekMemo also handles:

* long-term memory,
* user preferences,
* workspace context,
* team knowledge,
* agent state,
* decisions,
* memory updates,
* conflict detection,
* memory review,
* memory deletion,
* and sync between local and cloud.

---

## 6.3 TekMemo is not only chat history

Chat history is raw.

Memory is distilled.

Chat history says:

```txt
User and assistant exchanged 40 messages about Prisma.
```

Memory says:

```md
# Database Decision

The TekMemo cloud app should use Prisma as the primary ORM instead of raw SQL.
```

The second one is more useful.

TekMemo converts noisy interactions into clean reusable memory.

---

## 6.4 TekMemo is not only a notes app

A notes app stores notes.

TekMemo stores AI-usable memory.

It does not just save information.

It makes the information:

* searchable,
* scoped,
* ranked,
* retrievable,
* editable,
* indexable,
* permission-aware,
* and usable inside AI prompts.

---

# 7. Why TekMemo matters

AI products are moving from simple chatbots to agents.

A simple chatbot can answer one question.

An agent needs to continue work.

For example, an agent may need to:

* inspect a codebase,
* remember architecture decisions,
* generate docs,
* create tasks,
* resume previous work,
* coordinate with another agent,
* learn from files,
* and use project-specific context.

Without memory, the agent keeps starting over.

TekMemo gives the agent continuity.

---

# 8. Main problem TekMemo solves

## 8.1 The repeated context problem

Users keep saying the same things again and again.

Example:

```txt
Use TypeScript.
Use Prisma.
Use React Router v7.
Use Cloudflare Workers.
Do not use raw SQL.
Use shadcn/ui.
Do not make components more than 100 lines.
Follow our product naming.
```

TekMemo stores these once and retrieves them later.

---

## 8.2 The lost decisions problem

Product and engineering decisions get buried in chats.

Example:

```txt
We decided that Builder and Professional plans should only have workspace memory.
Elite Engineer should have both workspace memory and user memory.
```

Without TekMemo, the AI may forget this.

With TekMemo, it becomes durable memory.

---

## 8.3 The generic AI answer problem

Without memory, AI gives generic answers.

With TekMemo, AI gives specific answers.

Generic answer:

> “You can create a database schema with tables for users and projects.”

TekMemo-powered answer:

> “Since TekMemo uses workspace-scoped memory and Prisma, create `Workspace`, `MemoryEntry`, `MemorySource`, `MemoryChunk`, `MemoryIndexJob`, and `MemoryAccessPolicy` models.”

---

## 8.4 The multi-agent coordination problem

If multiple agents work together, they need shared memory.

Example:

* Research agent finds information.
* Coding agent uses it.
* Docs agent documents it.
* Review agent checks it.
* Product agent updates roadmap.

TekMemo becomes the shared memory layer between them.

---

# 9. TekMemo product pillars

## 9.1 File-first memory

Memory is stored in readable files.

This makes TekMemo:

* transparent,
* portable,
* debuggable,
* Git-friendly,
* human-readable,
* and easy to sync.

---

## 9.2 Scoped memory

Memory belongs somewhere.

A memory can belong to:

* a user,
* a workspace,
* a team,
* an organization,
* an agent,
* a repository,
* a file,
* a session,
* or a workflow.

This prevents memory leakage.

---

## 9.3 Retrieval-ready memory

Memory is not only stored.

It is prepared for fast retrieval using:

* keyword search,
* vector search,
* metadata filtering,
* recency ranking,
* confidence scoring,
* and permission filtering.

---

## 9.4 Human-editable memory

Users should be able to inspect and edit what the AI remembers.

This builds trust.

A user should be able to:

```txt
View memory
Edit memory
Approve memory
Reject memory
Delete memory
Move memory to another scope
Mark memory as outdated
```

---

## 9.5 Agent-ready memory

Agents need memory to work over time.

TekMemo should allow agents to:

* read memory,
* write memory,
* update task state,
* store run summaries,
* remember repo structure,
* store previous failures,
* and retrieve relevant context before acting.

---

## 9.6 Cloud and local support

TekMemo should support both:

| Mode          | Meaning                                                             |
| ------------- | ------------------------------------------------------------------- |
| Local TekMemo | Runs on the developer’s machine or inside a project                 |
| TekMemo Cloud | Hosted dashboard, sync, API keys, teams, billing, and shared memory |

This gives users privacy, portability, and hosted convenience.

---

# 10. Core TekMemo products

## 10.1 TekMemo Core

The core engine.

It handles:

* memory creation,
* memory storage,
* memory retrieval,
* memory updates,
* memory deletion,
* memory indexing,
* memory scopes,
* and memory permissions.

---

## 10.2 TekMemo SDK

Used by developers to add memory to their AI apps.

Example:

```ts
await tekmemo.remember({
  scope: "workspace",
  workspaceId: "ws_123",
  type: "decision",
  title: "Use Prisma",
  content: "Use Prisma as the primary ORM for the TekMemo cloud app.",
});
```

---

## 10.3 TekMemo CLI

Used from the terminal.

Example commands:

```bash
tekmemo init
tekmemo remember "This repo uses pnpm and Turborepo"
tekmemo search "database decisions"
tekmemo add ./docs
tekmemo sync
tekmemo status
```

---

## 10.4 TekMemo Cloud

The hosted product.

It provides:

* dashboard,
* hosted memory API,
* workspaces,
* teams,
* API keys,
* usage tracking,
* billing,
* sync,
* review queue,
* memory browser,
* and memory analytics.

---

## 10.5 TekMemo OS

The local-first memory runtime.

It can live inside a project as:

```txt
.tekmemo/
```

It allows developers to keep memory close to their codebase.

---

## 10.6 TekMemo Docs

The documentation site.

It should explain:

* what TekMemo is,
* how to install it,
* how memory works,
* how to use the SDK,
* how to use the CLI,
* how to self-host,
* how to use TekMemo Cloud,
* and how to build AI apps with memory.

The docs app can remain separate from the cloud app.

The cloud app is for product usage.

The docs app is for public documentation, API references, guides, changelog, blog, and SEO.

---

# 11. TekMemo memory scopes

Memory must be scoped.

A scope answers:

> Who owns this memory?

## 11.1 Main scopes

| Scope               | Meaning                          | Example                                    |
| ------------------- | -------------------------------- | ------------------------------------------ |
| User memory         | Belongs to one person            | “User prefers TypeScript examples.”        |
| Workspace memory    | Belongs to one project/workspace | “This workspace is for TekChat rebuild.”   |
| Team memory         | Shared by a team                 | “Engineering uses Biome.”                  |
| Organization memory | Shared company-wide              | “All products use Tek* naming.”            |
| Agent memory        | Belongs to one AI agent          | “Docs agent indexed API v1.”               |
| Repository memory   | Belongs to a codebase            | “This repo uses Turborepo.”                |
| File memory         | Comes from a specific file       | “This PDF contains pricing notes.”         |
| Session memory      | Temporary current-session memory | “User is currently designing auth flow.”   |
| Customer memory     | Belongs to one customer/account  | “Customer is on Professional plan.”        |
| Artifact memory     | Attached to generated output     | “This roadmap generated the sprint tasks.” |

---

# 12. TekMemo memory types

A type answers:

> What kind of memory is this?

| Type        | Meaning                   | Example                                    |
| ----------- | ------------------------- | ------------------------------------------ |
| Fact        | Stable information        | “The app uses Cloudflare Workers.”         |
| Preference  | User/team preference      | “Prefer copy-paste-ready code.”            |
| Decision    | Accepted decision         | “Use Prisma instead of raw SQL.”           |
| Constraint  | Rule to follow            | “Components should stay under 100 lines.”  |
| Summary     | Compressed history        | “The meeting discussed pricing.”           |
| Research    | Saved research finding    | “Bunny may be cheaper for idle workloads.” |
| Codebase    | Repo-specific knowledge   | “Auth routes live in `apps/cloud`.”        |
| Task        | Current or completed work | “Project details page is missing.”         |
| Error       | Known issue               | “Vector index expects 1536 dimensions.”    |
| Customer    | Account-specific info     | “Customer requested onboarding help.”      |
| Learning    | Learner profile           | “Student struggles with async/await.”      |
| Agent state | Agent progress            | “Code agent completed file scan.”          |
| Policy      | Access or product rule    | “Professional plan has workspace memory.”  |
| Temporary   | Expiring memory           | “Promo ends April 30, 2026.”               |

---

# 13. TekMemo memory layers

Memory layers determine priority.

Not all memory should be treated equally.

## Recommended priority order

```txt
1. System rules
2. Safety rules
3. Current user request
4. Selected files
5. Active workflow state
6. Workspace memory
7. Repository memory
8. User memory
9. Team memory
10. Organization memory
11. Retrieved documents
12. Conversation summary
13. Recent chat messages
14. Temporary session memory
15. Historical archive memory
```

## Why this matters

Suppose organization memory says:

```txt
Use Express for backend apps.
```

But workspace memory says:

```txt
This project uses Hono on Cloudflare Workers.
```

For that workspace, TekMemo should prioritize the workspace memory.

That is how the AI avoids wrong assumptions.

---

# 14. How TekMemo works behind the scenes

## 14.1 Memory capture flow

When a user says something important, TekMemo checks whether it should become memory.

Example user message:

```txt
For TekMemo Cloud, use Prisma instead of raw SQL.
```

Behind the scenes:

```txt
1. Detect important statement
2. Classify it as a decision
3. Determine scope: workspace
4. Check if similar memory already exists
5. Create or update memory file
6. Add metadata
7. Index memory
8. Make it available for future retrieval
```

Possible stored memory:

```md
# Database Decision

Status: accepted  
Type: decision  
Scope: workspace  
Confidence: high  

Use Prisma as the primary ORM for TekMemo Cloud instead of raw SQL.
```

---

## 14.2 Retrieval flow

When the user later asks:

```txt
How should I structure the database?
```

TekMemo does this:

```txt
1. Receive query
2. Identify active user and workspace
3. Search relevant memory
4. Filter by permissions
5. Rank by relevance
6. Select useful memory
7. Build AI context
8. Send context to model
9. Generate answer
```

The model sees something like:

```txt
Relevant memory:
- TekMemo Cloud uses Prisma instead of raw SQL.
- The project runs on Cloudflare Workers.
- The user prefers copy-paste-ready Prisma schema.
```

Then the AI gives a specific answer.

---

## 14.3 File ingestion flow

When a file is added:

```txt
1. Upload or detect file
2. Extract text
3. Detect file type
4. Split file into chunks
5. Summarize key points
6. Store source reference
7. Create memory candidates
8. Generate embeddings
9. Store metadata
10. Make file searchable
```

Example:

```txt
User uploads: tekmemo-pricing.md
```

TekMemo creates:

```txt
File source
Memory chunks
Pricing summary
Plan rules
Search index
Vector index
```

---

## 14.4 Agent run memory flow

When an AI agent completes work:

```txt
1. Agent starts task
2. TekMemo creates run memory
3. Agent reads relevant memory
4. Agent performs actions
5. Agent writes progress logs
6. Agent stores final summary
7. TekMemo extracts new decisions or facts
8. Memory is updated
```

Example run summary:

```md
# Agent Run Summary

Task: Add memory layers page  
Status: completed  

Files changed:
- app/routes/memory-layers.tsx
- app/components/memory-layer-card.tsx

Remaining work:
- Add settings page
- Add memory review queue
```

---

## 14.5 Conflict detection flow

Memory can conflict.

Old memory:

```txt
The project uses Express.
```

New memory:

```txt
The project uses Hono.
```

TekMemo should detect this.

Possible result:

```txt
Conflict detected.

Old memory:
- Backend uses Express.

New memory:
- Backend uses Hono.

Suggested action:
- Mark Express memory as outdated.
- Save Hono as active memory.
```

This prevents the AI from mixing old and new context.

---

## 14.6 Sync flow

For local and cloud memory:

```txt
1. Local memory changes
2. TekMemo records change event
3. Sync checks cloud state
4. Conflicts are detected
5. Compatible changes are merged
6. Cloud index updates
7. Local sync status updates
```

Example:

```txt
Local .tekmemo/ updated
        ↓
TekMemo Cloud receives changes
        ↓
Memory is indexed
        ↓
Dashboard shows updated memory
```

---

# 15. Suggested file structure

A simple file-first structure:

```txt
.tekmemo/
  manifest.json
  memory/
    workspace/
      overview.md
      decisions.md
      constraints.md
      stack.md
      tasks.md
      research.md

    user/
      preferences.md
      profile.md
      learning.md

    repo/
      structure.md
      commands.md
      conventions.md
      known-issues.md

    agents/
      code-agent.md
      docs-agent.md
      review-agent.md

  sources/
    files/
    chats/
    runs/

  indexes/
    keyword-index.json
    vector-index.json
    metadata.json

  sync/
    changes.log
    status.json
```

## What each part does

| Path               | Purpose                             |
| ------------------ | ----------------------------------- |
| `manifest.json`    | Project-level TekMemo configuration |
| `memory/workspace` | Workspace memory                    |
| `memory/user`      | User-specific memory                |
| `memory/repo`      | Codebase memory                     |
| `memory/agents`    | Agent-specific memory               |
| `sources/files`    | References to source documents      |
| `sources/chats`    | Conversation-derived memory sources |
| `sources/runs`     | Agent run logs                      |
| `indexes`          | Search and retrieval indexes        |
| `sync`             | Local/cloud sync metadata           |

---

# 16. Suggested memory schema

A memory entry should have both content and metadata.

```ts
type MemoryEntry = {
  id: string;
  title: string;
  content: string;

  scope: "user" | "workspace" | "team" | "organization" | "agent" | "repository" | "session";
  type:
    | "fact"
    | "preference"
    | "decision"
    | "constraint"
    | "summary"
    | "research"
    | "codebase"
    | "task"
    | "error"
    | "policy"
    | "temporary";

  status: "active" | "outdated" | "archived" | "deleted";
  confidence: "low" | "medium" | "high";

  sourceType: "manual" | "chat" | "file" | "agent" | "api" | "system";
  sourceId?: string;

  workspaceId?: string;
  userId?: string;
  teamId?: string;
  organizationId?: string;
  agentId?: string;
  repositoryId?: string;

  tags: string[];

  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};
```

---

# 17. Suggested Prisma data model

For TekMemo Cloud, you can keep the file-first concept while still using Prisma for metadata, sync, permissions, and indexing.

```prisma
model Workspace {
  id          String        @id @default(cuid())
  name        String
  slug        String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  memories    MemoryEntry[]
  sources     MemorySource[]
  agents      Agent[]
}

model MemoryEntry {
  id             String   @id @default(cuid())
  title          String
  content        String

  scope          String
  type           String
  status         String   @default("active")
  confidence     String   @default("medium")

  sourceType     String
  sourceId       String?

  workspaceId    String?
  userId         String?
  teamId         String?
  organizationId String?
  agentId        String?
  repositoryId   String?

  filePath       String?
  checksum       String?

  tags           String   @default("[]")

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  expiresAt      DateTime?

  workspace      Workspace? @relation(fields: [workspaceId], references: [id])
  chunks         MemoryChunk[]
}

model MemoryChunk {
  id            String   @id @default(cuid())
  memoryEntryId String
  content       String
  chunkIndex    Int
  tokenCount    Int?
  embeddingId   String?

  createdAt     DateTime @default(now())

  memoryEntry   MemoryEntry @relation(fields: [memoryEntryId], references: [id])
}

model MemorySource {
  id          String   @id @default(cuid())
  workspaceId String?
  type        String
  title       String
  uri         String?
  metadata    String   @default("{}")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace? @relation(fields: [workspaceId], references: [id])
}

model Agent {
  id          String   @id @default(cuid())
  workspaceId String?
  name        String
  type        String
  status      String   @default("active")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace   Workspace? @relation(fields: [workspaceId], references: [id])
  runs        AgentRun[]
}

model AgentRun {
  id          String   @id @default(cuid())
  agentId     String
  task        String
  status      String
  summary     String?

  startedAt   DateTime @default(now())
  completedAt DateTime?

  agent       Agent @relation(fields: [agentId], references: [id])
  steps       AgentRunStep[]
}

model AgentRunStep {
  id          String   @id @default(cuid())
  runId       String
  type        String
  content     String
  status      String

  createdAt   DateTime @default(now())

  run         AgentRun @relation(fields: [runId], references: [id])
}
```

---

# 18. Primary use cases

## 18.1 AI chat memory

### Layman version

A user has an AI chat app.

They do not want to keep explaining the same project every day.

TekMemo remembers the project.

### Example

User says:

```txt
This workspace is for building TekMemo Cloud.
We use React Router v7, Cloudflare Workers, Prisma, and Turso.
```

Later the user asks:

```txt
Create the auth plan.
```

The AI already knows the stack.

### Professional version

TekMemo provides persistent workspace context for AI chat systems, enabling the AI to retrieve relevant project facts, decisions, constraints, and user preferences before generating a response.

---

## 18.2 Coding agent memory

### Layman version

A coding agent needs to remember how the codebase works.

### Example memory

```md
# Repo Memory

- Package manager: pnpm
- Monorepo tool: Turborepo
- Frontend: React Router v7
- UI: shadcn/ui
- Formatting: Biome
- Runtime: Cloudflare Workers
```

### Professional version

TekMemo provides repository-aware memory for coding agents, allowing them to preserve architecture summaries, dependency maps, commands, style rules, and previous task outcomes.

---

## 18.3 Documentation assistant

### Layman version

A docs AI remembers how the docs are structured.

### Example

Memory:

```txt
Docs must support versioned API references.
The latest version should show by default.
Older versions should remain accessible.
```

Later request:

```txt
Create the API docs structure.
```

The AI follows the existing rule.

### Professional version

TekMemo supports documentation memory by storing versioning rules, content structure, API references, terminology, changelog patterns, and style constraints.

---

## 18.4 Product planning assistant

### Layman version

A founder uses AI to plan products.

TekMemo remembers previous decisions.

### Example

```txt
TekMemo should have Core, Cloud, OS, SDK, CLI, and Docs.
```

Later:

```txt
Create the pricing page.
```

The AI uses the actual product structure.

### Professional version

TekMemo acts as product memory infrastructure, preserving product decisions, positioning, roadmap items, feature definitions, launch plans, and constraints.

---

## 18.5 AI tutor

### Layman version

A learning platform AI remembers each student.

### Example

```txt
Student understands JavaScript basics but struggles with async/await.
```

Later, when teaching promises, the AI adjusts the explanation.

### Professional version

TekMemo enables learner-specific memory for adaptive education, including skill state, lesson progress, misconceptions, preferences, submissions, and remediation history.

---

## 18.6 Customer support agent

### Layman version

A support AI remembers a customer’s previous issues.

### Example

```txt
Customer had a billing problem last week.
Temporary credit was granted.
Payment retry is pending.
```

Later:

```txt
My account is still not active.
```

The AI knows the context.

### Professional version

TekMemo enables account-level support memory, storing ticket history, previous resolutions, plan details, escalations, and unresolved issues.

---

## 18.7 Sales assistant

### Layman version

A sales AI remembers each lead.

### Example

```txt
Lead is interested in team memory.
Concern: data privacy.
Next step: send self-hosting details.
```

### Professional version

TekMemo supports sales memory by storing account context, objections, buying signals, follow-up actions, plan fit, and conversation summaries.

---

## 18.8 Marketing assistant

### Layman version

A marketing AI remembers the brand.

### Example

```txt
TekMemo should be positioned as memory infrastructure, not a generic chatbot.
```

### Professional version

TekMemo stores brand voice, positioning, audience segments, campaign history, approved claims, and channel-specific messaging rules.

---

## 18.9 Research assistant

### Layman version

AI research does not disappear after one chat.

### Example

```txt
Research found that local-first memory is useful for privacy-focused developers.
```

Later, the user can ask:

```txt
What did we find about local-first memory?
```

### Professional version

TekMemo converts research outputs into durable memory artifacts containing findings, sources, summaries, conclusions, and uncertainty notes.

---

## 18.10 Multi-agent systems

### Layman version

Different AI agents can share memory.

Example:

```txt
Research agent finds information.
Coding agent builds feature.
Docs agent writes docs.
Review agent checks quality.
```

TekMemo gives them shared context.

### Professional version

TekMemo acts as a shared memory substrate for multi-agent systems, preserving agent state, task history, outputs, decisions, and inter-agent context.

---

## 18.11 Internal company knowledge base

### Layman version

A company uploads documents.

AI can answer questions from them.

### Professional version

TekMemo powers AI-native knowledge bases by combining file ingestion, memory extraction, semantic retrieval, metadata, permissions, and workspace-level access control.

---

## 18.12 Personal AI assistant

### Layman version

A personal AI remembers the user’s habits and projects.

### Example

```txt
User prefers detailed explanations with examples.
User is currently building TekMemo.
```

### Professional version

TekMemo provides user-level long-term memory for personalization, preferences, goals, active projects, and recurring workflows.

---

# 19. Theoretical examples

## Example 1: TekMemo inside TekChat

### Situation

A user creates a workspace:

```txt
TekChat Rebuild
```

They upload:

```txt
architecture.md
pricing.md
memory-plan.md
ui-rules.md
roadmap.md
```

TekMemo stores:

```txt
Workspace purpose
Product decisions
Tech stack
Memory rules
Pricing constraints
UI constraints
```

### Later request

```txt
Design the memory layers page.
```

### Behind the scenes

TekMemo retrieves:

```txt
- TekChat is workspace-first.
- Memory layers should be visible.
- Builder and Professional plans have workspace memory only.
- Elite Engineer has workspace and user memory.
- UI should use rounded-lg cards.
- Components should stay under 80–100 lines.
```

### Result

The AI produces a relevant page instead of a generic settings screen.

---

## Example 2: TekMemo for TekMemo Cloud

### Situation

The cloud app needs to manage hosted memory.

TekMemo stores product decisions:

```txt
Use Prisma.
Use Cloudflare Workers.
Use Turso.
Use React Router v7.
Separate docs app from cloud app.
Keep docs public and SEO-friendly.
```

### Later request

```txt
Create the workspace schema.
```

### Behind the scenes

TekMemo retrieves:

```txt
- Use Prisma schema.
- Avoid raw SQL.
- Workspace owns memories.
- Memory entries need scope, type, status, confidence, source, and timestamps.
```

### Result

The AI generates a Prisma-first schema aligned with the product.

---

## Example 3: TekMemo for a codebase

### Situation

A coding agent scans a repo.

It stores:

```md
# Codebase Memory

- This is a Turborepo monorepo.
- Apps are inside `apps/`.
- Shared UI is inside `packages/ui`.
- The docs app uses VitePress.
- The cloud app uses React Router v7.
```

### Later request

```txt
Add a docs blog page like Vitest.
```

### Behind the scenes

TekMemo retrieves:

```txt
- Docs app is VitePress.
- Blog page should be compact.
- Pages should have ad-ready areas.
- API docs should support versions.
```

### Result

The AI gives a structure that fits the actual docs app.

---

## Example 4: TekMemo for a learner

### Situation

A student is using an AI tutor.

Memory:

```md
# Learner Memory

- Student is learning Node.js.
- Student understands basic JavaScript.
- Student struggles with middleware.
- Student prefers layman explanation before professional explanation.
```

### Later request

```txt
Explain authentication middleware.
```

### Result

The AI explains with a simple analogy first, then shows professional backend terminology.

---

## Example 5: TekMemo for customer support

### Situation

Customer support memory:

```md
# Customer Memory

Customer: Acme Inc.
Plan: Professional
Issue: Memory sync failed.
Previous action: Support asked them to reconnect their workspace.
Status: Waiting for customer confirmation.
```

### Later message

```txt
My memory sync is still not working.
```

### Result

The AI does not start from zero.

It knows the issue is continuing.

---

## Example 6: TekMemo for agents

### Situation

A code agent was asked to update the project page.

Memory:

```md
# Agent Task Memory

Task: Add project details page.
Status: partial.

Completed:
- Added project list.
- Added new project dialog.

Missing:
- Project details page.
- Memory layers page.
- Project settings page.
```

### Later request

```txt
Continue the projects feature.
```

### Result

The agent knows exactly what remains.

---

# 20. TekMemo operational runbook

## 20.1 When a user says “remember this”

TekMemo should:

```txt
1. Capture the statement.
2. Ask whether it is user, workspace, team, or organization memory if unclear.
3. Classify the memory type.
4. Save it.
5. Index it.
6. Confirm that it was saved.
```

Example:

```txt
Remember that this project should use Prisma.
```

Stored as:

```md
# Database Preference

Type: decision  
Scope: workspace  
Confidence: high  

This project should use Prisma for database access.
```

---

## 20.2 When a user uploads a file

TekMemo should:

```txt
1. Store file source.
2. Extract text.
3. Chunk content.
4. Summarize file.
5. Extract possible memories.
6. Store file-level memory.
7. Index chunks.
8. Make the file searchable.
```

---

## 20.3 When a user asks a question

TekMemo should:

```txt
1. Identify active scope.
2. Search relevant memory.
3. Filter unauthorized memory.
4. Rank memory.
5. Build prompt context.
6. Send to AI model.
7. Return answer.
8. Detect if new memory should be saved.
```

---

## 20.4 When an agent starts a task

TekMemo should:

```txt
1. Create agent run.
2. Retrieve task-relevant memory.
3. Provide memory to agent.
4. Track steps.
5. Save task summary.
6. Save new decisions.
7. Mark unresolved tasks.
```

---

## 20.5 When memory changes

TekMemo should:

```txt
1. Compare new memory with old memory.
2. Detect duplicate or conflicting facts.
3. Merge if compatible.
4. Mark old memory as outdated if replaced.
5. Ask for review if confidence is low.
```

---

## 20.6 When memory is deleted

TekMemo should:

```txt
1. Mark memory as deleted or remove it permanently.
2. Remove it from indexes.
3. Stop retrieving it.
4. Record audit event if needed.
```

---

# 21. Recommended TekMemo Cloud pages

## 21.1 Dashboard

Shows:

* total memories,
* active workspaces,
* indexed files,
* API usage,
* sync status,
* recent memory activity,
* memory health.

---

## 21.2 Workspaces

Shows all workspaces.

Each workspace should have:

* overview,
* memory entries,
* files,
* agents,
* API keys,
* sync status,
* settings.

---

## 21.3 Memory Browser

Allows users to:

* search memory,
* filter by scope,
* filter by type,
* edit memory,
* delete memory,
* mark outdated,
* move scope.

---

## 21.4 Memory Layers

Shows how memory is prioritized.

Example layers:

```txt
Workspace memory
Repository memory
User memory
Team memory
Organization memory
Session memory
```

---

## 21.5 Files

Shows uploaded/indexed files.

Each file should show:

* title,
* type,
* source,
* status,
* chunk count,
* last indexed time,
* related memories.

---

## 21.6 Review Queue

Shows AI-suggested memories waiting for approval.

Actions:

```txt
Approve
Edit
Reject
Move scope
Merge with existing
```

---

## 21.7 Agents

Shows agents connected to TekMemo.

Examples:

* Code Agent
* Docs Agent
* Research Agent
* Support Agent
* Tutor Agent

---

## 21.8 Sync

Shows:

* local sync status,
* cloud sync status,
* conflicts,
* last sync time,
* pending changes.

---

## 21.9 API Keys

For developers using TekMemo SDK.

Shows:

* API key name,
* workspace access,
* permissions,
* last used,
* usage.

---

## 21.10 Settings

Controls:

* workspace settings,
* memory retention,
* privacy,
* permissions,
* sync options,
* indexing options.

---

# 22. Recommended docs structure

For the VitePress docs app:

```txt
docs/
  index.md

  guide/
    what-is-tekmemo.md
    quickstart.md
    file-first-memory.md
    memory-scopes.md
    memory-types.md
    memory-layers.md
    retrieval.md
    sync.md
    agents.md
    self-hosting.md

  sdk/
    index.md
    installation.md
    remember.md
    retrieve.md
    update.md
    forget.md
    workspaces.md
    agents.md

  cli/
    index.md
    init.md
    remember.md
    search.md
    add.md
    sync.md
    status.md

  cloud/
    overview.md
    dashboard.md
    workspaces.md
    api-keys.md
    billing.md
    security.md

  api/
    v1/
      index.md
      memory.md
      workspaces.md
      files.md
      agents.md

  blog/
    index.md
    introducing-tekmemo.md

  changelog/
    index.md
```

The docs app should be separate from the cloud app.

The cloud app is for logged-in product usage.

The docs app is for public education, SEO, guides, API docs, changelog, and blog.

---

# 23. MVP recommendation

Do not build everything first.

The best MVP should prove one thing:

> Developers can add reliable memory to AI apps without building memory infrastructure from scratch.

## MVP features

Build these first:

```txt
1. Workspace memory
2. User memory
3. File-first storage
4. Manual memory creation
5. Memory search
6. Memory retrieval API
7. Memory update/delete
8. Basic SDK
9. Basic CLI
10. Basic cloud dashboard
11. Basic file ingestion
12. Basic sync
```

## Defer these

Do not start with:

```txt
1. Complex multi-agent orchestration
2. Advanced analytics
3. Full enterprise RBAC
4. Heavy workflow automation
5. Complex visual memory graph
6. Advanced conflict resolution UI
```

---

# 24. First target users

## 24.1 AI app developers

They need a memory backend for their AI products.

Positioning:

> Add durable memory to your AI app without building a custom memory system.

---

## 24.2 Coding agent builders

They need repo memory and task continuity.

Positioning:

> Give your coding agents memory across sessions, files, and tasks.

---

## 24.3 SaaS builders

They want AI features inside their apps.

Positioning:

> Make your AI features workspace-aware and user-aware.

---

## 24.4 Open-source developers

They want local-first tools.

Positioning:

> A file-first memory runtime you can inspect, version, and self-host.

---

# 25. Suggested pricing logic

Since TekMemo has local, open-source, and cloud parts, pricing should be simple.

## Free / Open Source

For developers using local memory.

Includes:

* local `.tekmemo`,
* CLI,
* basic SDK,
* local file memory,
* local search.

---

## Builder

For indie developers and small apps.

Includes:

* hosted workspaces,
* API keys,
* basic memory API,
* file ingestion,
* basic sync.

---

## Professional

For teams and production apps.

Includes:

* team workspaces,
* higher usage,
* review queue,
* better sync,
* memory analytics,
* role-based access.

---

## Elite / Enterprise

For companies.

Includes:

* advanced permissions,
* audit logs,
* SSO later,
* dedicated limits,
* custom retention,
* priority support,
* self-hosting support.

---

# 26. API examples

## 26.1 Remember

```ts
await tekmemo.remember({
  scope: "workspace",
  workspaceId: "ws_123",
  type: "decision",
  title: "Use Prisma",
  content: "Use Prisma as the primary ORM for TekMemo Cloud.",
  tags: ["database", "prisma", "architecture"],
});
```

---

## 26.2 Retrieve

```ts
const memories = await tekmemo.retrieve({
  workspaceId: "ws_123",
  query: "What database tool should this project use?",
  limit: 5,
});
```

---

## 26.3 Update

```ts
await tekmemo.update("mem_123", {
  content:
    "Use Prisma as the primary ORM, but allow raw SQL for advanced migrations when necessary.",
});
```

---

## 26.4 Forget

```ts
await tekmemo.forget("mem_123");
```

---

## 26.5 Add file

```ts
await tekmemo.files.add({
  workspaceId: "ws_123",
  path: "./docs/architecture.md",
});
```

---

## 26.6 Search

```ts
const results = await tekmemo.search({
  workspaceId: "ws_123",
  query: "memory layers",
});
```

---

# 27. CLI examples

```bash
tekmemo init
```

Creates:

```txt
.tekmemo/
```

---

```bash
tekmemo remember "This repo uses Prisma and Cloudflare Workers"
```

Stores a memory.

---

```bash
tekmemo search "database decisions"
```

Searches memory.

---

```bash
tekmemo add ./docs
```

Indexes documentation.

---

```bash
tekmemo sync
```

Syncs local memory with TekMemo Cloud.

---

```bash
tekmemo status
```

Shows memory and sync status.

---

# 28. The key product story

The product story should be:

```txt
AI apps are becoming agents.

Agents need memory.

But memory is hard to build correctly.

Developers need memory that is scoped, durable, searchable, inspectable, and safe.

TekMemo gives them that.
```

---

# 29. One-line pitches

## Simple

> TekMemo helps AI apps remember.

## Developer

> File-first memory for AI apps and agents.

## Technical

> A scoped, retrieval-ready memory runtime for AI-native applications.

## Open-source

> Local-first memory infrastructure for developers building AI agents.

## Enterprise

> Governed memory infrastructure for AI systems across teams, workspaces, and agents.

## Investor

> TekMemo is the memory layer for the next generation of AI applications and autonomous agents.

---

# 30. Final product definition

## Layman version

TekMemo is like a smart notebook for AI.

It helps AI remember important things about users, projects, files, teams, and previous work.

So instead of repeating yourself every time, the AI can continue from where you stopped.

---

## Professional version

TekMemo is a file-first memory runtime for AI applications and agents.

It provides scoped, durable, inspectable, retrievable, and governable memory across users, workspaces, teams, files, repositories, workflows, and agents.

It enables AI systems to preserve context, personalize behavior, retrieve relevant knowledge, maintain project continuity, coordinate agent workflows, and safely update or forget memory over time.

---

# 31. Recommended final direction

TekMemo should be positioned as:

> **The memory infrastructure layer for AI apps and agents.**

The first version should focus on:

```txt
1. Developers
2. AI app builders
3. Workspace memory
4. File-first storage
5. SDK and CLI
6. Cloud dashboard
7. Simple retrieval API
```

Do not over-position it as a general productivity app.

TekMemo is infrastructure.

The strongest angle is:

> Developers can build AI apps with long-term memory without designing their own memory system from scratch.
