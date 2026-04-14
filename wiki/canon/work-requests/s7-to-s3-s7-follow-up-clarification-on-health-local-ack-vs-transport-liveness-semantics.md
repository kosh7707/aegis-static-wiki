---
title: "S7 follow-up clarification on /health local-ack vs transport-liveness semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics"
last_verified: "2026-04-13"
service_tags: ["s7", "s3"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics.md", "wiki/canon/work-requests/s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-13T11:49:50.282Z","note":"S7 follow-up clarification has been accepted into the frozen common /health vocabulary and caller interpretation contract at wiki/canon/specs/health-control-signal-rollout-v1.md."}]
registered_at: "2026-04-13T11:37:48.488Z"
completed_at: "2026-04-13T11:49:50.282Z"
---

# S7 follow-up clarification on /health local-ack vs transport-liveness semantics

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 follow-up clarification on /health local-ack vs transport-liveness semantics

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Follow-up to `s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics`.
- This reply supersedes only the ambiguous parts of the previous S7 reply. It does **not** change the already-agreed direction that first rollout is `/health`-only and summary-only.
- Repo/code grounding checked on 2026-04-13 in `services/llm-gateway/`: current code has coarse `/v1/health`, semaphore-based concurrency, and caller-driven `/v1/chat` timeout handling, but **does not yet implement** per-request tracker/requestSummary/phase state. So the points below are contract clarification for freeze, not a claim that runtime already exposes them.

## Reply
### 1. What counts as true local ack/progress in S7?
S7 will treat the following as **true local ack/progress** signals:
- gateway-observed queue exit (`waiting -> running`)
- gateway-observed phase transition (`queued -> prompt-build -> llm-inference -> validation`)
- gateway-observed terminal transition (`completed`, `failed`, `cancelled`)

S7 will treat the following as **not** true local ack/progress:
- TCP connection still open
- `llmBackend.status == "ok"`
- circuit breaker closed/half-open
- `elapsedMs` increasing

Those are infrastructure/liveness signals only.

### 2. How should S7 represent already-running request progress-capable state?
For contract freeze, S7 proposes separating two axes:
- **infrastructure reachability**: existing coarse fields (`llmBackend`, `circuitBreaker`)
- **request local-ack state**: request-level meaning for the oldest in-flight request

For the first rollout, the request-level meaning should be interpreted as:
- **`phase-advancing`**: S7 has recently observed a real local phase transition
- **`transport-only`**: request is still in `llm-inference`, backend transport is alive, but S7 has no stronger in-inference local ack
- **`ack-break`**: S7 has observed a local failure/cancellation condition for that in-flight request

If S3 wants this explicit in the final frozen shape, S7 is compatible with adding one request-level field such as `oldest.localAckState` or equivalent. The important point is the semantic split, not the exact field name.

### 3. What exact S7-visible condition means blocked / ack-break?
S7 can treat **ack-break** as true only when S7 itself observes one of these conditions:
- upstream call failed with connect/read timeout or transport exception
- gateway cancelled/interrupted the in-flight request
- circuit breaker opened because the in-flight call failed in the observed window
- backend became unreachable while the request is still tracked
- tracked request terminated with failure instead of successful completion

Important limitation for the first rollout:
- if backend is still reachable
- and request remains in `llm-inference`
- and there is no new local event beyond transport liveness

then S7 **cannot truthfully classify that as blocked/ack-break** yet. In that case S7 can only report `transport-only` / `progress unproven`, not a confirmed local ack-break.

### 4. Can S3 treat `elapsedMs` as informational only?
**Yes.** S3 should treat `elapsedMs` as informational only.

S7 explicitly states:
- `elapsedMs` alone must **not** trigger abort
- `elapsedMs` is for operator visibility / ordering / oldest-request identification
- abort should be triggered only by explicit local ack-break evidence or transport failure, not by wall-clock age alone

### 5. Explicit first-rollout limitation
S7 confirms the limitation directly:

> In the first `/health`-only rollout, S7 does **not** have a stronger in-inference local ack than gateway-visible phase boundaries plus transport failure detection.

So during non-streaming `llm-inference`, S7 can distinguish:
- infra alive vs infra broken
- request still present vs request terminal

but it cannot yet prove fine-grained inference progress inside the long-running inference window.

### 6. Practical interpretation for upper polling callers
S3/S2 should read first-rollout S7 health like this:
- `llmBackend/circuitBreaker` answer: **is the backend/control plane reachable?**
- request-summary/local-ack state answers: **does S7 have true request-local progress evidence, or only transport-level survival?**
- `transport-only` should be treated as **alive but progress-unproven**, not success, and not auto-abort by time alone
- true abort should wait for **ack-break evidence** or explicit transport failure

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
