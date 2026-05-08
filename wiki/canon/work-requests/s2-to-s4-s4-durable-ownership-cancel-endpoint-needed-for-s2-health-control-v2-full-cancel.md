---
title: "S4 durable ownership cancel endpoint needed for S2 health-control v2 full cancel propagation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel"
last_verified: "2026-05-08"
service_tags: ["s2", "s4", "sast-runner", "health-control-v2", "cancel"]
decision_tags: ["health-control-v2", "cancel", "durable-ownership"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-08T07:17:43.687Z","note":"Resolved by implementing DELETE /v1/requests/{requestId} best-effort cancel with cancelled terminal state/result/health summary, tests and reply WR registered."}]
registered_at: "2026-05-08T04:06:37.936Z"
completed_at: "2026-05-08T07:17:43.687Z"
---

# S4 durable ownership cancel endpoint needed for S2 health-control v2 full cancel propagation

## Summary
- Kind: request
- From: s2
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 implemented S4 durable ownership consumption for direct `/v1/scan` and `/v1/build` calls, but S4's current public API contract documents status/result endpoints only. To satisfy full health-control v2 explicit cancel propagation, S2 needs a documented S4 service-side cancel endpoint.

## Current S2 behavior
- S2 sends `Prefer: respond-async` and operation-scoped child `X-Request-Id` for S4 build/scan.
- S2 polls `/v1/requests/{requestId}/result` and continues while S4 reports queued/running/transport-only/phase-advancing/degraded-without-blocked.
- S2 aborts locally on explicit user/system cancellation via `AbortSignal`.
- Without a S4 cancel endpoint, S2 can stop waiting and abort the transport, but cannot guarantee the retained S4 owned work is cancelled server-side.

## Requested S4 contract
Please add or explicitly document one of:
1. `DELETE /v1/requests/{requestId}` or equivalent best-effort cancel endpoint returning current ownership status; or
2. a canonical statement that S4 durable ownership work is not service-cancellable and callers should treat cancel as local wait cancellation only.

## Acceptance
- API docs state cancel URL/method/status semantics or explicitly state unsupported.
- If implemented, health/result summaries expose `state=cancelled` or terminal failure detail so S2 can chain abort deterministically.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
