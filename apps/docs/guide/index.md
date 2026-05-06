---
title: Guide
description: Learn how to use TekMemo as a file-first memory runtime for AI apps and agents.
---

# Guide

TekMemo helps AI applications keep useful memory without turning the entire system into a hidden prompt string or a locked hosted service.

The core idea is simple:

```txt
Your app writes memory into a .tekmemo/ folder.
Your app can inspect, search, compile, patch, and restore that memory.
TekMemo runs inside the TypeScript application stack you already host.
```

## Start here

1. [Getting Started](/guide/getting-started) gives you the fastest local setup.
2. [Memory Filesystem](/guide/memory-filesystem) explains the `.tekmemo/` structure.
3. [Free Local Testing](/guide/local-testing) shows what you can test without cost.
4. [Packages](/packages/) explains what each package owns.
5. [Examples](/examples/) shows practical integrations.
6. [Hosting](/hosting/) explains how to deploy TekMemo-backed apps.

<AdSlot placement="guide-index-mid" />

## What TekMemo is for

| Use case | How TekMemo helps |
| :--- | :--- |
| AI assistants | Store durable user, workspace, and project memory. |
| Coding agents | Keep repo decisions, conventions, bugs, and previous fixes. |
| Learning agents | Remember learner preferences, progress, and friction points. |
| Support agents | Track customer context without stuffing every chat into the prompt. |
| Internal tools | Share team/project memory across AI workflows. |
| Local prototyping | Test memory behavior without hosted services. |

## What TekMemo is not

TekMemo is not a chatbot UI, a vector database replacement, or an all-in-one agent framework. It is the memory runtime and infrastructure layer that your app, agent, or workflow can use.
