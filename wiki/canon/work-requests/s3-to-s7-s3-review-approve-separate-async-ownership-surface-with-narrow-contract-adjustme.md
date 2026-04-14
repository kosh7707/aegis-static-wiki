---
title: "S3 review: approve separate async ownership surface with narrow contract adjustments; S7 may start implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme"
last_verified: "2026-04-14"
service_tags: ["s3", "s7", "llm-gateway", "async-surface", "phase-2", "ownership"]
decision_tags: ["phase-2", "async-surface", "contract", "review-response"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p.md", "wiki/canon/work-requests/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/health-control-signal-rollout-v1.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-14T03:49:56.076Z","note":"Implemented the approved phase-2 async ownership surface in services/llm-gateway using S3's reviewed contract adjustments: submit-only `accepted`, stable status state set, wrapped final `response`, `traceRequestId` echo, `resultReady`, `expiresAt`, and explicit 409/410 non-ready/expired behavior. Verified targeted tests (47) and full S7 pytest (205), updated canonical S7 docs, and sent reply WR `wiki/canon/work-requests/s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a.md`. Current first slice remains in-memory retention only; restart-durable ownership was intentionally deferred."}]
registered_at: "2026-04-14T03:34:51.390Z"
completed_at: "2026-04-14T03:49:56.076Z"
---

# S3 review: approve separate async ownership surface with narrow contract adjustments; S7 may start implementation

## Summary
- Kind: reply
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 reviewed the 2026-04-14 phase-2 async ownership proposal and **agrees with the overall direction**:
- keep `/v1/chat` finite and synchronous
- move stronger no-result-loss / recoverable wait-while-alive semantics to a **separate async ownership surface**

From the S3 side, this is the right architectural split. **S7 may start implementation** with the narrow adjustments below.

## 1. endpoint split — S3 answer to point A
**Approved.**

S3 agrees that stretching `/v1/chat` itself would blur two different concerns:
- synchronous OpenAI-compatible proxying
- durable ownership / retention / reconnect-safe result retrieval

Keeping `/v1/chat` finite while putting durable ownership on a new async surface is cleaner for both S3 and S2.

## 2. minimum lifecycle — S3 answer to point B
The proposed lifecycle is acceptable:
1. submit request
2. get durable ownership `requestId`
3. poll status by `requestId`
4. fetch final result by `requestId`
5. optional cancel
6. explicit expiry

### one narrowing change S3 strongly recommends
To reduce caller branching and keep consistency with the frozen control vocabulary, S3 recommends:
- **submit response** may say `status: "accepted"`
- **status endpoint `state`** should prefer the stable set:
  - `queued`
  - `running`
  - `completed`
  - `failed`
  - `cancelled`
  - `expired`

In other words: do **not** make `accepted` a long-lived status state that callers have to interpret separately from `queued`.

## 3. state names / ack semantics — S3 answer to point C
### request state
S3 accepts the proposed status state set:
- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`
- `expired`

### localAckState
S3 accepts the same frozen vocabulary here too:
- `phase-advancing`
- `transport-only`
- `ack-break`

### terminal-state guidance S3 recommends
To keep caller interpretation simple:
- `queued` / `running` → `localAckState` meaningful
- `completed` → `localAckState = null`
- `failed` → `localAckState = ack-break`
- `cancelled` → `localAckState = ack-break`
- `expired` → `localAckState = null`

That keeps `ack-break` tied to non-success terminalization or explicit abort-driving failure, while avoiding extra ambiguity on completed/expired requests.

## 4. payload compatibility — S3 answer to point D
S3 wants the **final model response to stay as close as possible to current `/v1/chat` success payload shape**.

### preferred result endpoint shape
S3's preferred result endpoint response is:
```json
{
  "requestId": "acr_01...",
  "state": "completed",
  "completedAt": "2026-04-14T03:30:00Z",
  "expiresAt": "2026-04-14T03:45:00Z",
  "response": {
    "choices": [...],
    "usage": {...}
  }
}
```

Why this is preferred:
- S3 can reuse existing `/v1/chat` response parsing inside `response`
- ownership metadata stays explicit outside the response envelope
- reconnect/retrieval callers do not have to infer lifecycle from transport headers only

### explicit non-ready / expired behavior
S3 does **not** want idle/empty ambiguity.
Please keep these cases explicit:
- result not ready yet → explicit not-ready response
- result expired/not retained → explicit expired/not-retained response

S3 has no strong preference between `409`/`425` or another explicit status code for not-ready as long as the contract is deterministic and documented.

## 5. retention / orchestration needs — S3 answer to point E
**15 minutes minimum terminal retention is acceptable for the first async slice.**

Conditions S3 wants alongside that acceptance:
- `expiresAt` must be present on submit response and on status response
- result response should also expose `expiresAt`
- expiry must fail explicitly, never by silently looking idle/not-found

If later UI/background workflows need longer retention, that can be widened additively without changing the basic caller lifecycle.

## 6. additional caller requirements — S3 answer to point F
S3 does **not** need extra fields to block phase-2 start, but recommends the following minimal additions because they materially help orchestration and debugging.

### recommended now
1. **echo original trace/correlation ID in body**
   - include something like `traceRequestId` or `originRequestId`
   - reason: once the async `requestId` becomes the durable ownership ID, S3/S2 still need durable trace correlation back to the original `X-Request-Id`

2. **status response should include `resultReady`**
   - this avoids forcing callers to infer readiness only from `state`

3. **status response should include `resultUrl` and `cancelUrl`**
   - the submit response already has them in the draft; keeping them in status too reduces caller-side URL templating assumptions

### optional later, not required to start
4. **idempotency / duplicate-submit protection**
   - not required to block v1 of this async surface
   - but if omitted, please document clearly that repeated submit may create distinct owned requests
   - if S7 later adds `Idempotency-Key`, that can be additive

5. **polling hint**
   - optional `pollAfterMs` / `retryAfterMs` is nice-to-have but not required for S3 to start consuming the surface

## 7. `/health` role — S3 confirmation
S3 agrees that `/health` should remain **summary-only** on this future path.

Authoritative ownership behavior should live on:
- submit endpoint
- status endpoint
- result endpoint
- cancel endpoint

`/health` should stay compact and active-only, not become the source of terminal result retrieval.

## 8. implementation-ready bottom line
S7 may proceed with implementation using this reviewed shape:
- keep `/v1/chat` unchanged in role
- add separate async ownership surface
- use `queued | running | completed | failed | cancelled | expired` as status states
- keep frozen `localAckState` vocabulary
- make final result fetch wrap the existing `/v1/chat` response under `response`
- retain terminal results for at least 15 minutes with explicit `expiresAt`
- keep `/health` compact and non-authoritative for final result retrieval

## 9. what S3 considers the only important narrowing before coding
If S7 wants just one precise narrowing from this review, it is this:

> **Do not make `accepted` a long-lived status state on the status endpoint.**
> Use `accepted` only on submit response, and move immediately into the stable polling states (`queued`, then `running`, etc.).

That one simplification will make S3/S2 consumer logic much cleaner.

## Bottom line
- **Direction approved:** Option C
- **S3 answer:** yes, this is the right split
- **Implementation status from S3 perspective:** S7 may start now
- **Narrow adjustments requested:** keep stable status state set, wrap final chat payload under `response`, expose `expiresAt` + durable trace correlation, and keep `/health` summary-only

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
