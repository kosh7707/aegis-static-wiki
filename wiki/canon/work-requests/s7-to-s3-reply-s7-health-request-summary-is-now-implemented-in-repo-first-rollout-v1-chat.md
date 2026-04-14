---
title: "Reply: S7 /health request-summary is now implemented in repo; first-rollout /v1/chat timeout remains finite"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat"
last_verified: "2026-04-14"
service_tags: ["s7", "s3", "health", "timeout-policy", "ack-liveness", "llm-gateway"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "implementation"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/roadmap/s7-roadmap.md", "wiki/canon/work-requests/s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:24:13.999Z","note":"Reviewed on 2026-04-14. S3 accepts that first-rollout /health request-summary gap is closed in repo, but finite /v1/chat transport timeout remains canonical. Handling outcome: registered follow-up phase-2 decision WR asking S7 to choose the long-term recoverable wait-while-alive direction beyond the first rollout."}]
registered_at: "2026-04-14T03:19:33.433Z"
completed_at: "2026-04-14T03:24:13.999Z"
---

# Reply: S7 /health request-summary is now implemented in repo; first-rollout /v1/chat timeout remains finite

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S7 /health request-summary is now implemented in repo; first-rollout /v1/chat timeout remains finite

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Reply to `s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte`.
- User-directed S7 follow-up on 2026-04-14 was to **implement the missing runtime surface properly first, then reply**.

## What S7 implemented in repo on 2026-04-14
S7 implemented the previously missing **request-aware `/v1/health` control-signal surface** in `services/llm-gateway/`.

### Code changes
- added `app/request_tracker.py`
- wired tracker into `app/main.py`
- updated `app/pipeline/task_pipeline.py`
- updated `app/routers/tasks.py`
- expanded `tests/test_contract_endpoints.py`
- added `tests/test_request_tracker.py`

### Runtime shape now exposed by repo code
`GET /v1/health` now additively exposes:
- `activeRequestCount`
- `requestSummary.requestId`
- `requestSummary.endpoint`
- `requestSummary.taskType`
- `requestSummary.state`
- `requestSummary.localAckState`
- `requestSummary.degraded`
- `requestSummary.degradeReasons`
- `requestSummary.lastAckAt`
- `requestSummary.lastAckSource`
- `requestSummary.blockedReason`
- `requestSummary.phase`
- `requestSummary.elapsedMs`

### Query targeting
- `GET /v1/health?requestId=<X-Request-Id>` is now supported.
- If that request is still active, S7 returns that request summary.
- If it is no longer active, S7 returns idle summary rather than retaining history.

## Exact answers to S3's follow-up

### 1. runtime status of `/health` request-summary for `/v1/chat`
**Repo status: implemented now.**

The code now tracks in-flight `/v1/chat` and `/v1/tasks` requests and projects them into additive `/v1/health` control-signal fields.

Important rollout note:
- this reply confirms **repo implementation + tests + canonical docs update**
- it does **not** claim that any already-running localhost:8000 process has been restarted yet
- live runtime confirmation still requires process restart / redeploy and smoke verification

### 2. does finite `/v1/chat` timeout remain canonical?
**Yes — in the current first-rollout implementation, `/v1/chat` remains finite-timeout.**

Concretely:
- `X-Timeout-Seconds` behavior remains in place
- transport timeout on that HTTP request is still treated as terminal failure for that transport attempt
- S7 did **not** implement detached/recoverable inference ownership in this slice
- this slice was intentionally scoped to the frozen `/health`-only first rollout

So the current state is:
- `/health` control-signal surface: **implemented**
- recoverable long-lived `/v1/chat` beyond finite transport timeout: **not implemented in this slice**

### 3. how should S3 correlate an in-flight chat request with `/health`?
Use the existing request identity:
- caller sends or receives `X-Request-Id`
- caller polls `GET /v1/health?requestId=<that-id>`

Current rule:
- while the request is still active, S7 can return its request summary
- after terminal completion/failure, S7 removes it from active tracking and `/health` falls back to idle/no-match summary

So this correlation supports **active-request polling**, not post-terminal history recovery.

### 4. is any additive caller header / request field required?
**No additional header or body field is required for this first-rollout health surface.**

For the implemented repo slice:
- existing `X-Request-Id` is enough for correlation
- `requestId` query param on `/v1/health` is enough for targeting
- existing `X-Timeout-Seconds` remains the transport-timeout control on `/v1/chat`

## S7 local-ack semantics now represented in repo
S7's current repo-grounded projection is:
- queue acceptance / queue exit / phase transitions => true local ack (`phase-advancing`)
- long non-streaming `llm-inference` wait => `localAckState = transport-only`
- transport/backend failure observed by S7 => transient internal `ack-break` mapping, but S7 does not keep terminal request history on `/health`

This means S3 can now observe the active in-flight distinction between:
- `running + phase-advancing`
- `running + transport-only`

but cannot yet recover a request **after** its `/v1/chat` transport timeout has already terminalized the HTTP attempt.

## Verification
### targeted regression
- `cd services/llm-gateway && .venv/bin/python3 -m pytest tests/test_contract_endpoints.py tests/test_request_tracker.py -q`
- **35 passed**

### full S7 suite
- `cd services/llm-gateway && .venv/bin/python3 -m pytest -q`
- **195 passed**

### diagnostics
- LSP diagnostics on changed Python files: **0 errors**

## Canonical docs updated
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/handoff/s7/readme.md`
- `wiki/canon/handoff/s7/architecture.md`
- `wiki/canon/roadmap/s7-roadmap.md`

## Bottom line
S7 has now closed the missing repo/runtime-surface gap for the **first-rollout `/health` control signal**.

The remaining open design question is narrower:
- whether a **later** slice should keep `/v1/chat` finite forever, or
- introduce a recoverable wait-while-alive mode with separate detached ownership beyond the transport timeout window.

That next step is intentionally left outside this first implementation slice.

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
