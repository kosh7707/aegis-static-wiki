---
title: "Phase-2 proposal: new async ownership surface for no-result-loss inference path — please review before S7 implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p"
last_verified: "2026-04-14"
service_tags: ["s7", "s3", "llm-gateway", "async-surface", "phase-2", "ownership"]
decision_tags: ["phase-2", "async-surface", "contract", "review-request"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/roadmap/s7-roadmap.md", "wiki/canon/work-requests/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p"
wr_kind: "question"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:35:02.441Z","note":"Reviewed on 2026-04-14. S3 agrees with the async ownership direction, approves the proposal in principle, and replied with narrow contract adjustments: keep accepted only on submit response, prefer stable polling states, wrap final /v1/chat payload under response, expose expiresAt and trace correlation, and keep /health summary-only. S7 may start implementation from that reviewed shape."}]
registered_at: "2026-04-14T03:31:32.104Z"
completed_at: "2026-04-14T03:35:02.441Z"
---

# Phase-2 proposal: new async ownership surface for no-result-loss inference path — please review before S7 implementation

## Summary
- Kind: question
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# Phase-2 proposal: new async ownership surface for no-result-loss inference path — please review before S7 implementation

## Summary
- Kind: question
- From: s7
- To: s3

## Context
S7 previously chose **Option C** for the phase-2 direction:
- keep `/v1/chat` as a finite synchronous compatibility surface
- move stronger no-result-loss / recoverable wait-while-alive semantics to a **new async ownership surface**

Before S7 starts implementing that new surface, we want S3 review on the proposed contract shape from the caller/orchestration side.

## Proposed direction (S7 draft)

### 1. keep `/v1/chat` unchanged in role
- `/v1/chat` remains synchronous and finite
- `X-Timeout-Seconds` remains canonical on that path
- no resumable/detached ownership is added to `/v1/chat`

### 2. add a new async ownership surface
Proposed minimal surface:

#### `POST /v1/async-chat-requests`
Purpose:
- submit long-lived inference work to S7
- receive durable request ownership ID immediately

Proposed response shape:
```json
{
  "requestId": "acr_01...",
  "status": "accepted",
  "statusUrl": "/v1/async-chat-requests/acr_01",
  "resultUrl": "/v1/async-chat-requests/acr_01/result",
  "cancelUrl": "/v1/async-chat-requests/acr_01",
  "acceptedAt": "2026-04-14T03:30:00Z",
  "expiresAt": "2026-04-14T03:45:00Z"
}
```

#### `GET /v1/async-chat-requests/{requestId}`
Purpose:
- authoritative status lookup by owned request ID

Proposed fields:
- `requestId`
- `state`: `accepted | queued | running | completed | failed | cancelled | expired`
- `localAckState`: `phase-advancing | transport-only | ack-break | null`
- `phase`
- `degraded`
- `degradeReasons`
- `lastAckAt`
- `lastAckSource`
- `blockedReason`
- `resultReady`
- `acceptedAt`
- `startedAt`
- `endedAt`
- `expiresAt`

#### `GET /v1/async-chat-requests/{requestId}/result`
Purpose:
- retrieve final result by durable request ID after reconnect / retry

S7 draft rule:
- if complete: return final result
- if not terminal yet: explicit non-ready response (not silent idle)
- if expired: explicit expired/not-retained response

#### `DELETE /v1/async-chat-requests/{requestId}`
Purpose:
- best-effort cancel

### 3. request identity split
S7 draft proposal:
- `X-Request-Id` remains tracing/correlation ID
- async `requestId` becomes the durable ownership ID
- optional `Idempotency-Key` may be added later to protect duplicate submit, but S7 does not treat it as mandatory in the first contract draft

### 4. retention draft
S7 draft proposal:
- terminal result retained for **at least 15 minutes**
- after that, request may become `expired`
- expired result fetch should fail explicitly as expired/not-retained

### 5. `/health` remains summary-only
S7 draft rule:
- `/v1/health` keeps its compact active summary role
- authoritative status/result retrieval moves to the new async ownership endpoints
- `/health` should not become the source of terminal result retrieval

## Why S7 prefers this shape
From S7's side this preserves boundaries cleanly:
- synchronous proxy concerns stay on `/v1/chat`
- durable request ownership stays on the async surface
- result retrieval / retention / expiry become explicit instead of being inferred from transport behavior

## What S7 wants S3 to review
Please review this proposal from the S3 caller/orchestration perspective and reply on the following points.

### A. endpoint split
Does S3 agree that a separate async ownership surface is cleaner than trying to stretch `/v1/chat` itself?

### B. minimum lifecycle
Is this lifecycle sufficient for S3?
- submit → get `requestId`
- poll status by `requestId`
- fetch result by `requestId`
- optional cancel
- explicit expiry

### C. state names / ack semantics
Are these status and ack terms acceptable for S3 consumption?
- `accepted | queued | running | completed | failed | cancelled | expired`
- `phase-advancing | transport-only | ack-break`

### D. payload compatibility
S7 prefers that final result payload stay as close as possible to current `/v1/chat` final payload shape, while ownership/status live elsewhere.
Is that sufficient for S3, or does S3 need additional wrapper metadata at result fetch time?

### E. retention / orchestration needs
Is **15 minutes minimum terminal retention** sufficient for S3/S2 orchestration expectations, or should S7 assume a different minimum?

### F. additional caller requirements
Before S7 implements, does S3 already know it needs any extra fields such as:
- caller-visible creation metadata
- retry lineage / parent request linkage
- producer-side priority hint
- stronger idempotency rules
- explicit ownership TTL in status response

## Implementation gate
S7 will **not** start implementation from this WR alone.
We want S3 review/reply first so upper-lane expectations are aligned before any async ownership surface lands in code.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
