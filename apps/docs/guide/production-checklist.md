---
title: Production Checklist
description: Checklist for moving a TekMemo integration from local testing to production.
---

# Production Checklist

Use this checklist before using TekMemo in a production AI app.

## Memory model

- [ ] choose scopes: user, workspace, project, agent, session, policy
- [ ] decide what belongs in core memory
- [ ] decide what belongs in archival notes
- [ ] decide which facts should be structured JSONL
- [ ] define retention rules
- [ ] define forgetting rules

## Storage

- [ ] start with local `.tekmemo/` in development
- [ ] choose durable production storage before relying on memory across deploys
- [ ] configure snapshots
- [ ] test restore behavior
- [ ] avoid storing secrets in memory files

## Recall

- [ ] start with keyword recall
- [ ] add vector recall only when needed
- [ ] set embedding dimensions explicitly
- [ ] ensure vector index dimensions match embedder output
- [ ] track source-to-chunk mappings
- [ ] re-index changed sources safely

## AI integration

- [ ] inject only compact core memory by default
- [ ] retrieve archival memory on demand
- [ ] keep memory tools structured and safe
- [ ] block arbitrary filesystem or shell access
- [ ] log every memory mutation

## Security

- [ ] scope provider API keys to the minimum required permissions
- [ ] rotate compromised provider keys
- [ ] avoid exposing user-private memory across tenants
- [ ] review policy memory updates
- [ ] keep audit/event logs

## Hosting

- [ ] confirm the host has durable storage for memory state
- [ ] configure provider request budgets
- [ ] test deployment rollback with memory files intact
- [ ] export memory before high-risk migrations
