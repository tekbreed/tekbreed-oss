# TekMemo Cloud — Canonical API Endpoint Map and Contract Spec

_Created: 2026-05-02_

## 1. Purpose

This document defines the canonical API surface for **TekMemo Cloud**.

It is intended for:

- backend engineering
- frontend engineering
- API docs
- SDK work later
- product design
- testing
- billing/quota enforcement
- auth and API key implementation

It defines:

- API structure
- authentication rules
- endpoint groups
- request/response shapes
- status code conventions
- quota-sensitive endpoints
- route naming
- API design rules

This is a **product API contract**, not a generated OpenAPI document.

---

# 2. API design principles

TekMemo Cloud’s API should be:

- tenant-aware
- project-aware
- plan-aware
- quota-aware
- predictable
- versionable
- easy to document

## Core rules

### Rule 1
All API routes should live under:

```text
/api/v1/*
```

### Rule 2
The API should be served directly from the main cloud app.

### Rule 3
Authentication should use:

```http
Authorization: Bearer <api_key>
```

### Rule 4
Every response should include a stable request ID.

### Rule 5
Errors should use a consistent JSON error envelope.

### Rule 6
Project-scoped operations should require a project ID in the path whenever possible.

### Rule 7
Quota-checked endpoints should return clear usage-related errors.

---

# 3. API authentication and authorization

## 3.1 Auth model
Use API keys.

Supported key types at launch:

- user keys
- project keys

Service account keys can be added later.

## 3.2 Auth header

```http
Authorization: Bearer tm_...
```

## 3.3 Auth flow

On each request:

1. parse bearer token
2. resolve API key
3. verify hash and revocation status
4. resolve tenant
5. resolve optional project binding
6. check scopes
7. check plan and quota
8. perform operation
9. record usage
10. return response

## 3.4 Required scopes

Recommended scope names:

- `project:read`
- `project:write`
- `memory:read`
- `memory:write`
- `memory:index`
- `memory:recall`
- `usage:read`
- `apikey:manage`
- `webhook:manage`

---

# 4. Common response conventions

## 4.1 Success envelope

Recommended pattern:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

## 4.2 List response pattern

```json
{
  "data": [],
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "nextCursor": null
    }
  }
}
```

## 4.3 Error envelope

```json
{
  "error": {
    "code": "quota_exceeded",
    "message": "Your plan has reached its monthly indexing limit.",
    "details": {}
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## 4.4 Common status codes

- `200` OK
- `201` Created
- `202` Accepted
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Unprocessable Entity
- `429` Too Many Requests
- `500` Internal Server Error

---

# 5. API groups

TekMemo Cloud v1 should expose these endpoint groups:

1. Health
2. Me / Tenant Context
3. Projects
4. Memory
5. Recall
6. Usage
7. Billing
8. API Keys
9. Webhooks

---

# 6. Health endpoints

## `GET /api/v1/health`

### Purpose
Basic runtime health check.

### Auth
No auth required for minimal health check.

### Response
```json
{
  "data": {
    "status": "ok",
    "service": "tekmemo-cloud",
    "version": "v1"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 7. Me / tenant context endpoints

## `GET /api/v1/me`

### Purpose
Return the current authenticated API key context.

### Auth
Required

### Scopes
Any valid key

### Response
```json
{
  "data": {
    "tenant": {
      "id": "ten_123",
      "name": "Acme",
      "plan": "team"
    },
    "apiKey": {
      "id": "key_123",
      "label": "Backend key",
      "type": "project"
    },
    "project": {
      "id": "proj_123",
      "name": "Main App"
    },
    "scopes": [
      "project:read",
      "memory:read",
      "memory:write"
    ]
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 8. Projects endpoints

## `GET /api/v1/projects`

### Purpose
List projects visible to the authenticated key.

### Scopes
- `project:read`

### Response
```json
{
  "data": [
    {
      "id": "proj_123",
      "name": "Main App",
      "slug": "main-app",
      "environment": "prod",
      "status": "active",
      "createdAt": "2026-05-02T12:00:00.000Z",
      "updatedAt": "2026-05-02T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/projects`

### Purpose
Create a project.

### Scopes
- `project:write`

### Request
```json
{
  "name": "Main App",
  "slug": "main-app",
  "environment": "prod"
}
```

### Response
`201 Created`

```json
{
  "data": {
    "id": "proj_123",
    "name": "Main App",
    "slug": "main-app",
    "environment": "prod",
    "status": "active",
    "createdAt": "2026-05-02T12:00:00.000Z",
    "updatedAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId`

### Purpose
Get a single project.

### Scopes
- `project:read`

### Response
```json
{
  "data": {
    "id": "proj_123",
    "name": "Main App",
    "slug": "main-app",
    "environment": "prod",
    "status": "active",
    "createdAt": "2026-05-02T12:00:00.000Z",
    "updatedAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `PATCH /api/v1/projects/:projectId`

### Purpose
Update project metadata.

### Scopes
- `project:write`

### Request
```json
{
  "name": "Main App Updated",
  "environment": "staging"
}
```

### Response
```json
{
  "data": {
    "id": "proj_123",
    "name": "Main App Updated",
    "slug": "main-app",
    "environment": "staging",
    "status": "active",
    "updatedAt": "2026-05-02T13:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/projects/:projectId/archive`

### Purpose
Archive a project.

### Scopes
- `project:write`

### Response
```json
{
  "data": {
    "id": "proj_123",
    "status": "archived"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 9. Memory endpoints

Memory endpoints are the core product API.

---

## `GET /api/v1/projects/:projectId/memory/core`

### Purpose
Read core memory.

### Scopes
- `memory:read`

### Response
```json
{
  "data": {
    "projectId": "proj_123",
    "documentType": "core",
    "content": "# Core Memory\n\n## Identity\n- ...",
    "version": 3,
    "updatedAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `PUT /api/v1/projects/:projectId/memory/core`

### Purpose
Replace core memory content.

### Scopes
- `memory:write`

### Request
```json
{
  "content": "# Core Memory\n\n## Identity\n- Workspace: Main App"
}
```

### Behavior
- writes canonical memory
- records audit/event
- records usage if needed
- enqueues indexing job

### Response
```json
{
  "data": {
    "projectId": "proj_123",
    "documentType": "core",
    "version": 4,
    "updatedAt": "2026-05-02T12:30:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId/memory/notes`

### Purpose
List notes.

### Scopes
- `memory:read`

### Query params
- `kind`
- `cursor`
- `limit`

### Response
```json
{
  "data": [
    {
      "id": "note_123",
      "kind": "decision",
      "title": "Memory model decision",
      "content": "Use file-first memory.",
      "tags": ["architecture", "decision"],
      "createdAt": "2026-05-02T12:00:00.000Z",
      "updatedAt": "2026-05-02T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "nextCursor": null
    }
  }
}
```

---

## `POST /api/v1/projects/:projectId/memory/notes`

### Purpose
Append a note.

### Scopes
- `memory:write`

### Request
```json
{
  "kind": "decision",
  "title": "Memory model decision",
  "content": "Use file-first memory.",
  "tags": ["architecture", "decision"]
}
```

### Behavior
- writes structured note
- updates canonical note document if applicable
- records project activity
- enqueues indexing

### Response
`201 Created`

```json
{
  "data": {
    "id": "note_123",
    "kind": "decision",
    "title": "Memory model decision",
    "createdAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId/memory/conversations`

### Purpose
List conversation history records.

### Scopes
- `memory:read`

### Query params
- `cursor`
- `limit`

### Response
```json
{
  "data": [
    {
      "id": "conv_123",
      "role": "assistant",
      "summary": "Explained the architecture decision.",
      "createdAt": "2026-05-02T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "nextCursor": null
    }
  }
}
```

---

## `POST /api/v1/projects/:projectId/memory/conversations`

### Purpose
Append a conversation history item.

### Scopes
- `memory:write`

### Request
```json
{
  "role": "assistant",
  "summary": "Explained the architecture decision.",
  "rawReference": "msg_123"
}
```

### Response
```json
{
  "data": {
    "id": "conv_123",
    "createdAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId/memory/restore-points`

### Purpose
List restore points.

### Scopes
- `memory:read`

### Response
```json
{
  "data": [
    {
      "id": "rp_123",
      "type": "manual",
      "status": "available",
      "createdAt": "2026-05-02T12:00:00.000Z",
      "expiresAt": "2026-08-02T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/projects/:projectId/memory/restore-points`

### Purpose
Create a restore point.

### Scopes
- `memory:write`

### Request
```json
{
  "type": "manual"
}
```

### Response
`202 Accepted`

```json
{
  "data": {
    "id": "rp_123",
    "status": "queued"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/projects/:projectId/memory/restore-points/:restorePointId/restore`

### Purpose
Restore a project to a restore point.

### Scopes
- `memory:write`

### Response
`202 Accepted`

```json
{
  "data": {
    "restorePointId": "rp_123",
    "status": "queued"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 10. Recall endpoints

Recall is the semantic retrieval layer.

---

## `POST /api/v1/projects/:projectId/recall/query`

### Purpose
Run a semantic recall query.

### Scopes
- `memory:recall`

### Quota-sensitive
Yes

### Request
```json
{
  "query": "memory architecture decision",
  "topK": 5,
  "memoryTypes": ["core", "notes"]
}
```

### Response
```json
{
  "data": {
    "results": [
      {
        "id": "chunk_123",
        "score": 0.98,
        "text": "Use file-first memory.",
        "memoryType": "notes",
        "sourceType": "note",
        "sourceId": "note_123",
        "sectionName": "Architecture"
      }
    ]
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/projects/:projectId/recall/index`

### Purpose
Explicitly enqueue indexing for a source or full project.

### Scopes
- `memory:index`

### Quota-sensitive
Yes

### Request
```json
{
  "scope": "project"
}
```

or

```json
{
  "scope": "source",
  "sourceType": "note",
  "sourceId": "note_123"
}
```

### Response
`202 Accepted`

```json
{
  "data": {
    "jobId": "job_123",
    "status": "queued"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId/recall/jobs`

### Purpose
List recall/indexing jobs.

### Scopes
- `memory:read`

### Response
```json
{
  "data": [
    {
      "id": "job_123",
      "jobType": "index",
      "status": "completed",
      "queuedAt": "2026-05-02T12:00:00.000Z",
      "completedAt": "2026-05-02T12:01:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 11. Usage endpoints

Usage endpoints expose quota and metering state.

---

## `GET /api/v1/usage`

### Purpose
Get tenant-wide usage summary for the current billing period.

### Scopes
- `usage:read`

### Response
```json
{
  "data": {
    "plan": "team",
    "periodKey": "2026-05",
    "metrics": {
      "projects": {
        "used": 6,
        "limit": 20
      },
      "users": {
        "used": 4,
        "limit": 10
      },
      "storageBytes": {
        "used": 104857600,
        "limit": 1073741824
      },
      "indexingOps": {
        "used": 12000,
        "limit": 150000
      },
      "recallQueries": {
        "used": 5000,
        "limit": 75000
      }
    }
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/projects/:projectId/usage`

### Purpose
Get project-scoped usage summary.

### Scopes
- `usage:read`

### Response
```json
{
  "data": {
    "projectId": "proj_123",
    "metrics": {
      "storageBytes": {
        "used": 5242880
      },
      "indexingOps": {
        "used": 3000
      },
      "recallQueries": {
        "used": 1200
      }
    }
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 12. Billing endpoints

At launch, billing endpoints can be tenant/admin-focused.

---

## `GET /api/v1/billing/plan`

### Purpose
Get current plan and limits.

### Scopes
- `usage:read`

### Response
```json
{
  "data": {
    "plan": "team",
    "billingInterval": "monthly",
    "status": "active",
    "currentPeriodStart": "2026-05-01T00:00:00.000Z",
    "currentPeriodEnd": "2026-06-01T00:00:00.000Z",
    "limits": {
      "projects": 20,
      "users": 10,
      "storageBytes": 1073741824,
      "indexingOps": 150000,
      "recallQueries": 75000
    },
    "addons": [
      {
        "code": "indexing_pack",
        "quantity": 1
      }
    ]
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/billing/upgrade`

### Purpose
Upgrade the current plan.

### Scopes
This is usually dashboard-auth only, but if exposed by API:
- tenant admin scope required

### Request
```json
{
  "targetPlan": "business",
  "billingInterval": "annual"
}
```

### Response
```json
{
  "data": {
    "status": "pending",
    "targetPlan": "business",
    "billingInterval": "annual"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/billing/addons`

### Purpose
Attach an add-on.

### Request
```json
{
  "addonCode": "indexing_pack",
  "quantity": 1
}
```

### Response
```json
{
  "data": {
    "status": "active",
    "addonCode": "indexing_pack",
    "quantity": 1
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 13. API key endpoints

---

## `GET /api/v1/api-keys`

### Purpose
List API keys visible to caller.

### Scopes
- `apikey:manage`

### Response
```json
{
  "data": [
    {
      "id": "key_123",
      "label": "Backend key",
      "keyPrefix": "tm_live_abc",
      "scopes": ["memory:read", "memory:write"],
      "status": "active",
      "projectId": "proj_123",
      "lastUsedAt": "2026-05-02T12:00:00.000Z",
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/api-keys`

### Purpose
Create an API key.

### Scopes
- `apikey:manage`

### Request
```json
{
  "label": "Backend key",
  "projectId": "proj_123",
  "scopes": ["memory:read", "memory:write", "memory:recall"]
}
```

### Response
`201 Created`

```json
{
  "data": {
    "id": "key_123",
    "label": "Backend key",
    "keyPrefix": "tm_live_abc",
    "secret": "tm_live_secret_full_value",
    "scopes": ["memory:read", "memory:write", "memory:recall"],
    "projectId": "proj_123",
    "createdAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

### Important rule
The `secret` is only returned once.

---

## `POST /api/v1/api-keys/:apiKeyId/revoke`

### Purpose
Revoke an API key.

### Scopes
- `apikey:manage`

### Response
```json
{
  "data": {
    "id": "key_123",
    "status": "revoked",
    "revokedAt": "2026-05-02T13:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 14. Webhook endpoints

---

## `GET /api/v1/webhooks`

### Purpose
List webhook endpoints.

### Scopes
- `webhook:manage`

### Response
```json
{
  "data": [
    {
      "id": "wh_123",
      "endpointUrl": "https://example.com/webhook",
      "eventTypes": ["memory.updated", "quota.exceeded"],
      "status": "active",
      "lastDeliveryAt": "2026-05-02T12:00:00.000Z",
      "createdAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/webhooks`

### Purpose
Create a webhook.

### Scopes
- `webhook:manage`

### Request
```json
{
  "endpointUrl": "https://example.com/webhook",
  "eventTypes": ["memory.updated", "quota.exceeded"],
  "projectId": "proj_123"
}
```

### Response
`201 Created`

```json
{
  "data": {
    "id": "wh_123",
    "endpointUrl": "https://example.com/webhook",
    "eventTypes": ["memory.updated", "quota.exceeded"],
    "status": "active",
    "createdAt": "2026-05-02T12:00:00.000Z"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `POST /api/v1/webhooks/:webhookId/revoke`

### Purpose
Revoke a webhook endpoint.

### Scopes
- `webhook:manage`

### Response
```json
{
  "data": {
    "id": "wh_123",
    "status": "revoked"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

---

## `GET /api/v1/webhooks/:webhookId/deliveries`

### Purpose
List webhook delivery attempts.

### Scopes
- `webhook:manage`

### Response
```json
{
  "data": [
    {
      "id": "wdl_123",
      "eventType": "memory.updated",
      "deliveryStatus": "success",
      "attemptCount": 1,
      "responseCode": 200,
      "createdAt": "2026-05-02T12:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_123"
  }
}
```

---

# 15. Quota-sensitive endpoints

These endpoints should always run quota checks:

- `POST /api/v1/projects`
- `PUT /api/v1/projects/:projectId/memory/core`
- `POST /api/v1/projects/:projectId/memory/notes`
- `POST /api/v1/projects/:projectId/memory/conversations`
- `POST /api/v1/projects/:projectId/memory/restore-points`
- `POST /api/v1/projects/:projectId/recall/query`
- `POST /api/v1/projects/:projectId/recall/index`
- `POST /api/v1/api-keys`
- `POST /api/v1/webhooks`

## Example quota error

```json
{
  "error": {
    "code": "quota_exceeded",
    "message": "Your plan has reached its monthly indexing limit.",
    "details": {
      "metric": "indexingOps",
      "used": 25000,
      "limit": 25000,
      "plan": "pro"
    }
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

Status code:
- `429` when limit is quota/rate related
- `403` when plan or permission forbids the action entirely

---

# 16. Rate-limit-sensitive endpoints

Rate limits should especially apply to:

- recall query
- memory write
- API key create
- webhook create
- project create

Suggested rate limiting happens outside route logic and should be applied before heavy downstream work when possible.

---

# 17. Request validation rules

All write endpoints should validate:

- required fields
- field lengths
- allowed enum values
- project binding
- tenant access
- scope compatibility

## Examples

### Project slug
- lowercase
- URL-safe
- unique within tenant

### Memory note
- `kind` required
- `content` required
- `tags` optional

### API key
- at least one scope
- project exists if `projectId` supplied
- key count must stay under plan limit

---

# 18. Pagination rules

Use cursor pagination where list growth can be large.

Recommended for:

- notes
- conversations
- projects
- webhook deliveries
- activity logs later

Pattern:
- `cursor`
- `limit`

Response:
```json
{
  "data": [],
  "meta": {
    "requestId": "req_123",
    "pagination": {
      "nextCursor": null
    }
  }
}
```

---

# 19. Versioning rules

Use path versioning:

```text
/api/v1/*
```

## Rules
- do not break v1 contracts casually
- additive fields are acceptable
- breaking changes require a new version

---

# 20. Internal vs public endpoints

## Public API
Routes under:
- `/api/v1/*`

## Internal-only routes
Use:
- `/internal/*`

These should be protected and not documented as public product API.

Examples:
- queue consumers
- operational checks
- internal job triggers
- debug/health routes

---

# 21. Recommended endpoint map summary

## Health
- `GET /api/v1/health`

## Context
- `GET /api/v1/me`

## Projects
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/:projectId`
- `PATCH /api/v1/projects/:projectId`
- `POST /api/v1/projects/:projectId/archive`

## Memory
- `GET /api/v1/projects/:projectId/memory/core`
- `PUT /api/v1/projects/:projectId/memory/core`
- `GET /api/v1/projects/:projectId/memory/notes`
- `POST /api/v1/projects/:projectId/memory/notes`
- `GET /api/v1/projects/:projectId/memory/conversations`
- `POST /api/v1/projects/:projectId/memory/conversations`
- `GET /api/v1/projects/:projectId/memory/restore-points`
- `POST /api/v1/projects/:projectId/memory/restore-points`
- `POST /api/v1/projects/:projectId/memory/restore-points/:restorePointId/restore`

## Recall
- `POST /api/v1/projects/:projectId/recall/query`
- `POST /api/v1/projects/:projectId/recall/index`
- `GET /api/v1/projects/:projectId/recall/jobs`

## Usage
- `GET /api/v1/usage`
- `GET /api/v1/projects/:projectId/usage`

## Billing
- `GET /api/v1/billing/plan`
- `POST /api/v1/billing/upgrade`
- `POST /api/v1/billing/addons`

## API Keys
- `GET /api/v1/api-keys`
- `POST /api/v1/api-keys`
- `POST /api/v1/api-keys/:apiKeyId/revoke`

## Webhooks
- `GET /api/v1/webhooks`
- `POST /api/v1/webhooks`
- `POST /api/v1/webhooks/:webhookId/revoke`
- `GET /api/v1/webhooks/:webhookId/deliveries`

---

# 22. Recommended implementation order

## Phase 1
- health
- me
- projects
- core memory
- notes
- usage
- API keys

## Phase 2
- conversations
- recall query
- recall indexing
- restore points

## Phase 3
- billing endpoints
- webhooks
- richer job visibility

This keeps the first release aligned with the core commercial loop.

---

# 23. Canonical recommendation

TekMemo Cloud v1 should expose:

- project management
- core memory CRUD
- notes append/list
- conversation history append/list
- recall query/index
- usage visibility
- billing summary
- API key management
- webhook management

served directly from the Cloudflare-hosted React Router v7 app under:

```text
/api/v1/*
```

This is the canonical API endpoint map and contract direction for TekMemo Cloud.
