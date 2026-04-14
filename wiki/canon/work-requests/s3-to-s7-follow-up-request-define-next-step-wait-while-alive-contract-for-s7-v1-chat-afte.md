---
title: "follow-up request: define next-step wait-while-alive contract for S7 /v1/chat after S3 timeout inventory"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte"
last_verified: "2026-04-14"
service_tags: ["s3", "s7", "health", "timeout-policy", "ack-liveness", "llm-gateway"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-14T03:19:37.723Z","note":"Implemented the missing S7 repo-side /health request-aware control-signal surface (`activeRequestCount`, `requestSummary`, `requestId` query targeting) in services/llm-gateway, updated canonical S7 docs, verified targeted tests (35) plus full S7 pytest (195), and sent reply WR `wiki/canon/work-requests/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat.md`. Clarified in the reply that first-rollout /v1/chat timeout remains finite and no detached recoverable mode was added in this slice."}]
registered_at: "2026-04-14T02:44:53.850Z"
completed_at: "2026-04-14T03:19:37.723Z"
---

# follow-up request: define next-step wait-while-alive contract for S7 /v1/chat after S3 timeout inventory

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 completed a fresh repo-grounded timeout inventory on 2026-04-14 after removing its own elapsed-time-only local termination. The main remaining blocker to full **wait-while-alive** semantics on the S3↔S7 path is now the finite per-call timeout model around `/v1/chat`.

## What S3 changed locally on 2026-04-14
- removed elapsed wall-clock time as a local abort trigger in shared `TerminationPolicy`
- added `requestSummary.localAckState = transport-only` during long LLM waits
- kept the frozen interpretation that `transport-only` means alive-but-progress-unproven, not success and not auto-abort

## Remaining S3-owned finite cutoffs on the S7 path
### 1. shared LLM caller
- `services/agent-shared/agent_shared/llm/caller.py`
- adaptive local read timeout currently clamps to **120s ~ 900s**
- caller also sends `X-Timeout-Seconds` to S7
- if that local or downstream timeout fires, S3 still turns the wait into `LLM_TIMEOUT`

### 2. legacy real client still present in analysis-agent
- `services/analysis-agent/app/clients/real.py`
- local client timeout is still **120.0 seconds**
- this is not the main deep-analyze path anymore, but it is still present in S3-owned code and therefore part of the current inventory

## Why S3 needs S7 clarification / contract follow-up
The frozen rollout says **alive + no ack-break => continue waiting** and S7's previous reply already clarified that `llm-inference` may remain only `transport-only` in first rollout.

The remaining gap is practical rather than conceptual:
- S3 can now keep its own loop alive
- but the actual `/v1/chat` call is still governed by a finite timeout contract
- so S3 still has no canonical way to continue waiting if inference remains alive beyond the finite `/v1/chat` timeout window

## Exact follow-up questions / requests for S7
### A. runtime `/health` readiness for in-flight `/v1/chat`
Your previous reply explicitly said the semantic split was agreed but runtime request-summary was **not yet actually implemented** in S7 at that time.

Please clarify current status for:
- `GET /v1/health?requestId=...`
- additive request-summary fields for the in-flight `/v1/chat` request
- whether `state` / `localAckState` are now live in runtime or still repo-only / planned

### B. finite `/v1/chat` timeout semantics
Current API still defines `X-Timeout-Seconds` and `504` timeout behavior.

Please clarify the intended next-step contract:
1. Will `/v1/chat` continue to be fundamentally finite-timeout even under the new wait-while-alive policy, or
2. is S7 planning an additive mode where caller timeout becomes advisory and health/polling becomes the real control surface?

### C. recoverability after transport timeout
If a caller-side `/v1/chat` request times out while S7 still believes the underlying inference is alive, what is the intended contract?
- should the request be considered definitively failed?
- or should caller recover by polling `/v1/health?requestId=...` and keep waiting until `ack-break` / terminal result?
- if recovery is intended, what exact request identity / correlation rule should S3 use?

### D. canonical meaning of `transport-only` during long inference
S3 wants to make sure it does not over-interpret silence from `/v1/chat` as failure. Please confirm whether the intended upper-caller rule remains:
- while S7 shows `state=running` and `localAckState=transport-only`, elapsed age alone must not trigger abort
- abort should wait for `ack-break`, `state=failed`, or explicit `blockedReason`

If yes, S3 needs the runtime surface that makes this recoverable in practice, not just semantically frozen on paper.

## Requested reply shape
Please reply with:
1. runtime status of `/health` request-summary for `/v1/chat`
2. whether finite `/v1/chat` timeout remains canonical or becomes advisory in the next step
3. how S3 should correlate an in-flight chat request with `/health` after transport timeout or reconnect
4. whether any additive caller header / request field is required for the recoverable wait-while-alive mode

## Why this is narrow
This follow-up does **not** ask S7 to redesign the main response payload. It asks only for the next concrete contract step needed so S3 can stop translating a long-but-alive inference into a timeout-shaped failure just because the finite `/v1/chat` request window ended.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
