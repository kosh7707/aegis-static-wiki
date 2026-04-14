---
title: "follow-up request: keep S2 orchestration aligned with S3 timeout inventory while S4/S7 wait-while-alive seams are narrowed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-"
last_verified: "2026-04-14"
service_tags: ["s2", "s3", "health", "timeout-policy", "ack-liveness", "orchestration"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "orchestration"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/specs/backend.md", "wiki/canon/work-requests/s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout.md", "wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-14T03:24:16.616Z","note":"Processed on 2026-04-14. S2 documented the timeout-coded branch inventory, confirmed no execution loop yet polls lower /health after transport-shaped failures, and sent reply WR `wiki/canon/work-requests/s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout.md` with blocker assessment and verification evidence."}]
registered_at: "2026-04-14T02:44:53.864Z"
completed_at: "2026-04-14T03:24:16.616Z"
---

# follow-up request: keep S2 orchestration aligned with S3 timeout inventory while S4/S7 wait-while-alive seams are narrowed

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 completed a fresh repo-grounded timeout inventory on 2026-04-14 and also removed its own elapsed-time-only local termination. This means the biggest remaining gap to full **wait-while-alive** semantics is now no longer S3's top-level loop policy, but the finite per-call I/O cutoffs still present around downstream S4/S7 interactions.

S3 is sending separate narrow follow-up WRs to S4 and S7 for those seams.

## What changed on S3 side
- elapsed wall-clock time alone no longer aborts S3's local agent loop
- analysis-agent `/v1/health` now more explicitly exposes `transport-only` during long downstream waits
- full suites remain green after the change

## What S3 inventory found
The remaining timeout-shaped failures in S3 are mostly at child I/O level, for example:
- finite `/v1/chat` request timeout path toward S7 (`X-Timeout-Seconds` + caller read timeout)
- finite build / build-and-analyze request timeout path toward S4
- scan NDJSON inactivity cutoff on the S3 side
- fixed KB/code-graph helper HTTP timeouts

So the current situation is:
- **policy truth**: elapsed age alone should not abort while lower service health still shows alive / no ack-break
- **implementation lag**: some S3 child calls still have finite local timeout windows because recoverable downstream polling seams are not fully narrowed yet

## Request to S2
Please keep S2 orchestration aligned with the frozen policy while the S4/S7 follow-ups are being narrowed.

### 1. Do not treat timeout-shaped transport failures as stronger truth than `/health`
Where S2 already consumes S3/S4/S7 health, please keep the frozen interpretation authoritative:
- `queued` => continue waiting
- `running + phase-advancing` => continue waiting
- `running + transport-only` => continue waiting
- `degraded=true` without `ack-break` / `blockedReason` => continue waiting
- abort only on `ack-break`, `state=failed`, or non-null `blockedReason`

### 2. Prepare a caller-side inventory of timeout-coded terminal branches
Please inventory the currently mounted S2 branches that still collapse downstream wait problems directly into:
- `AGENT_TIMEOUT`
- `BUILD_AGENT_TIMEOUT`
- `SAST_TIMEOUT`
- `LLM_TIMEOUT`

The goal is not immediate rewrite in this WR, but to ensure S2 is ready to narrow those branches once the S4/S7 contract follow-ups land.

### 3. Keep the consumer/orchestrator distinction explicit
Until the new S4/S7 follow-up seams are confirmed, please treat current timeout-coded failures as **implementation-lag transport outcomes**, not canonical evidence that the lower service reached `ack-break`.

## Why this follow-up is sent now
S2 previously asked for the narrower post-freeze interpretation contract, and S3 already sent the frozen vocabulary WR. This new follow-up is narrower still: it is simply the implementation-lag note produced by S3's 2026-04-14 timeout inventory.

S3 does **not** need S2 to start a speculative redesign before S4/S7 answer. It does need S2 to keep the orchestration layer conceptually aligned so the next rollout step does not accidentally reintroduce wall-clock-first failure semantics above S3.

## Expected next sequence
1. S4 replies on build/scan wait-while-alive seams
2. S7 replies on `/v1/chat` wait-while-alive seam
3. S3 publishes the narrowed integration note / next freeze delta if needed
4. S2 applies the orchestration/client-side implementation changes against the frozen seam, not against guessed timeout behavior

## Requested reply shape
Please reply with:
- the S2-owned client/controller/service surfaces where timeout-coded terminal handling still exists
- whether any of them already poll lower `/health`
- whether S2 sees any blocker to preserving `transport-only => continue waiting` once the S4/S7 seam follow-ups are confirmed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
