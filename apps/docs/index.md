---
layout: home

hero:
  name: "TekMemo"
  text: "File-first memory for AI apps and agents"
  tagline: "Build agents that remember without hiding state in a black box. Start with local .tekmemo files and the TypeScript SDK, then deploy the same memory runtime wherever your app runs."
  image:
    light: /tekmemo.svg
    dark: /tekmemo.svg
    alt: TekMemo
  actions:
    - theme: brand
      text: Start locally
      link: /guide/getting-started
    - theme: alt
      text: TypeScript SDK
      link: /sdks/typescript/
    - theme: alt
      text: Examples
      link: /examples/

features:
  - title: Local testing costs nothing
    details: Use the core runtime and local filesystem adapter without hosted services, vector databases, or paid provider keys.
    link: /guide/local-testing
    linkText: Test for free

  - title: Memory is inspectable
    details: Memory lives in a .tekmemo folder with core memory, notes, events, indexes, graph state, snapshots, and sync metadata.
    link: /guide/memory-filesystem
    linkText: See the filesystem

  - title: TypeScript-first packages
    details: "Install only what you need: core runtime, local FS, AI SDK tools, recall, reranking, and bring-your-own embedding providers."
    link: /packages/
    linkText: View packages

  - title: Hosting is your choice
    details: TekMemo runs inside TypeScript apps, Node services, React Router loaders, Next.js routes, Hono handlers, and Cloudflare Workers.
    link: /hosting/
    linkText: Host TekMemo

  - title: Built for production memory
    details: Event logs, chunk registries, conflict review, memory decay, graph recall, benchmarks, and governance are part of the product direction.
    link: /architecture/
    linkText: Read architecture

  - title: Designed for developers
    details: Use TekMemo in CLIs, React Router, Hono, Cloudflare Workers, coding agents, MCP tools, and long-running AI workflows.
    link: /examples/
    linkText: Browse examples
---

<AdSlot placement="home-after-hero" size="banner" />

<HomePanels />
