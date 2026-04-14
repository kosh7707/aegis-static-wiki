---
title: "define S4 /health request-summary mapping for local-ack control rollout"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout"
last_verified: "2026-04-13"
service_tags: ["s3", "s4"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/specs/technical-overview.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-13T11:42:04.330Z","note":"Implemented the S4 side of the /health request-summary mapping. /v1/health now exposes additive activeRequestCount + requestSummary fields, supports requestId query targeting, maps queued/running/degraded/ack-break semantics from existing scan lifecycle/runtime callbacks, and preserves all prior coarse health fields. Verified with targeted health tests and full S4 pytest. Reply WR sent: wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md"}]
registered_at: "2026-04-13T11:29:11.223Z"
completed_at: "2026-04-13T11:42:04.330Z"
---

# define S4 /health request-summary mapping for local-ack control rollout

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 is driving the first-rollout `/health` control-signal contract for S3/S4/S7.

This rollout is intentionally **`/health`-only**:
- no new primary endpoint
- no result payload redesign
- no full per-request dump
- no global numeric stall threshold

The agreed policy direction is:
- no hard wall-clock timeout as the primary failure trigger
- local ack/progress keeps work alive indefinitely
- local ack break is treated as failure
- the side expecting local ack interrupts first and chains abort upward
- user-visible results are discarded on chained abort
- forensic logs / trace / audit remain
- upper services will use **polling** against lower-service `/health`

## Request to S4
Please define how S4's existing scan/runtime progress model should surface through upgraded `/health` so it can be used as a **request-aware control signal** by polling callers.

### Required response contract
Please reply with:
1. **Minimum request-summary fields** S4 will expose via `/health`
2. How existing states map into that summary:
   - `queued`
   - `running`
   - `degraded`
   - blocked / ack-break equivalent
3. **Local ack sources** S4 trusts for liveness
4. **Ack break / blocked conditions** that should cause upper polling callers to abort
5. How `/health` summary will remain **consistent with existing scan progress semantics** without exposing full per-request detail dumps
6. Any S4-specific backward-compatibility concern with keeping current coarse health fields while adding a request-summary block

## Important rollout gate
We are using a **contract-freeze gate**:
- S3 will collect S4 + S7 responses
- S3 will freeze the common contract
- only after that do S3/S4/S7/S2 begin implementation in parallel

## Why S4 is critical
Current canon already gives S4 the strongest progress vocabulary (`heartbeat`, `progress`, `toolResults`, `degraded`), so S4 is the reference lane for mapping runtime progress into polling-visible `/health` semantics.

## Requested reply shape
A normal reply WR is fine. Concise bullet form is enough as long as the six response items above are explicit.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
