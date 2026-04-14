---
title: "first rollout of timeout-policy redesign is /health-only with polling semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics"
last_verified: "2026-04-13"
service_tags: ["s2", "s3", "s4", "s7"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "orchestration"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-13T11:31:57.384Z","note":"Pre-freeze handling completed on S2 side as impact analysis only, per WR boundary. Verified current S2 health aggregation compresses downstream /health into ok/degraded/unreachable, service clients only provide one-shot checkHealth(), and analysis/pipeline orchestration does not yet implement polling-based ack-break chained abort semantics. Recorded the deferred implementation stance and affected code paths in S2 handoff/roadmap for post-freeze follow-up."}]
registered_at: "2026-04-13T11:29:11.290Z"
completed_at: "2026-04-13T11:31:57.384Z"
---

# first rollout of timeout-policy redesign is /health-only with polling semantics

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
Notice for S2: the currently approved first rollout for the timeout-policy redesign is **`/health`-only** and uses **polling-based propagation**.

## Agreed first-rollout boundary
- scope: S3 / S4 / S7 `/health` enhancement only
- no new primary endpoint
- no result payload redesign in this phase
- no full per-request dump from `/health`
- no global numeric stall threshold

## Policy direction
- no hard wall-clock timeout as the main failure trigger
- local ack/progress keeps work alive indefinitely
- local ack break is treated as failure
- the side expecting local ack interrupts first and chains abort upward
- user-visible results are discarded on chained abort
- forensic logs / trace / audit remain

## Why this notice is being sent now
This changes orchestration expectations even without payload redesign:
- upper services are expected to **poll lower-service `/health`**
- polling callers must distinguish progress-capable vs blocked / ack-break summary states
- S2 should treat this as a contract/orchestration change, not merely an observability improvement

## Current rollout sequence
1. S3 sends contract-shaping WRs to S4 and S7
2. S3 collects replies and freezes the common contract
3. Only after contract freeze do S3 / S4 / S7 / S2 begin implementation in parallel

## What S2 should do now
- pre-freeze: orchestration impact analysis only
- post-freeze: implement/update polling-based caller interpretation and chained-abort handling if the frozen contract requires it

## Follow-up
S3 will send a narrower follow-up if the frozen contract materially changes any caller-side interpretation beyond what is stated here.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
