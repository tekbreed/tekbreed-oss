# TekMemo Operational Runbook

## 1. User says “remember this”

Flow:

```txt
input
  -> classify memory type
  -> write memory record
  -> update memory document if needed
  -> enqueue indexing
  -> record usage
  -> return confirmation
```

## 2. User uploads/adds a source

Flow:

```txt
source received
  -> create source manifest entry
  -> parse/chunk
  -> embed
  -> index
  -> update chunk registry
```

## 3. User asks a question

Flow:

```txt
query
  -> resolve project memory scope
  -> embed query
  -> vector recall
  -> rerank if enabled
  -> return source-backed memory snippets
```

## 4. Memory changes

Flow:

```txt
memory updated
  -> mark old chunks stale
  -> enqueue reindex
  -> write new chunks
  -> update chunk registry
  -> optionally delete stale vectors
```

## 5. Memory is deleted

Flow:

```txt
delete request
  -> verify permission
  -> mark source deleted
  -> delete vectors by source
  -> append audit event
```

## 6. Provider outage

Behavior:

- do not lose source memory
- keep write operation durable
- mark indexing job failed/retryable
- show recall/indexing degraded status

## 7. Quota exceeded

Behavior:

- free tier: hard stop
- paid tiers: grace buffer then pause/write-protect relevant action
- show clear upgrade/add-on/contact path

## 8. Support minimum

Every failed request should have:

- request ID
- tenant/project context in logs
- safe user-facing error
- provider error captured without leaking secrets
