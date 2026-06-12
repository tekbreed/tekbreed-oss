# TekMemo Cloud Product Specification

## Product definition

TekMemo Cloud is the hosted SaaS layer for TekMemo.

It provides:

- hosted project memory
- dashboard-based memory inspection
- API keys
- semantic recall
- usage metering
- pricing/billing path
- tenant/project management
- future team workflows

---

# Core entities

## Tenant

The organization/account boundary.

Owns:

- users
- projects
- subscription
- API keys
- usage
- provider/BYOK settings later

## Project

The primary memory boundary.

Owns:

- core memory
- notes
- conversations
- recall index
- restore points
- activity events

## Memory

Durable knowledge stored as inspectable documents and records.

## Recall

Semantic retrieval against indexed project memory.

## API key

A scoped credential used by external apps and services.

---

# First-release screens

## Required

- Overview
- Projects
- Project detail
- Memory
- Notes
- Recall
- API Keys
- Usage
- Billing
- Settings

## Defer

- deep team roles
- webhooks depth
- enterprise SSO
- advanced analytics
- full admin tools

---

# UI principles

1. Memory must feel inspectable.
2. Recall must show provenance.
3. API keys must feel safe and understandable.
4. Quotas must be visible but not annoying.
5. The product should feel like developer infrastructure, not a generic chatbot.
