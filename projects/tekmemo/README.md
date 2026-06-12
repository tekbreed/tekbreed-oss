# TekMemo Documentation System

This archive reorganizes TekMemo into a comprehensive documentation system for:

- product strategy
- OSS package architecture
- the canonical `.tekmemo/` local memory protocol
- provider adapters
- TekMemo Cloud
- database and infrastructure
- API contracts
- pricing and billing
- testing and benchmarking
- 1-month survival launch execution
- operations and governance

The documentation is written to be dropped into a VitePress docs app or read directly as Markdown.

## Start here

Open:

```txt
/docs/index.md
```

Then follow:

```txt
/docs/00-start-here/current-architecture-update.md
/docs/05-architecture/local-tekmemo-protocol.md
/docs/00-start-here/documentation-map.md
/docs/10-launch-survival/index.md
/docs/02-oss-and-packages/package-map.md
```

## Important principle

Do not treat this as a brainstorm folder. Treat it as the source of truth.

When implementation decisions change, update the relevant canonical file instead of creating scattered notes.


## TanStack AI update

This documentation bundle now includes TanStack AI support:

```txt
docs/05-architecture/ai-runtime-integrations.md
docs/03-package-reference/tanstack-ai.md
docs/02-oss-and-packages/tanstack-ai-support.md
```
