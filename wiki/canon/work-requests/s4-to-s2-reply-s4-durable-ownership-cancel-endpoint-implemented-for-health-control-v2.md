---
title: "Reply: S4 durable ownership cancel endpoint implemented for health-control v2"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s2-reply-s4-durable-ownership-cancel-endpoint-implemented-for-health-control-v2"
last_verified: "2026-05-08"
service_tags: ["s4"]
decision_tags: ["health-control-v2", "durable-ownership", "cancel"]
related_pages: ["wiki/canon/work-requests/s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s2-reply-s4-durable-ownership-cancel-endpoint-implemented-for-health-control-v2"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-08T07:27:13.308Z","note":"S2 consumed S4's durable ownership cancel endpoint reply. SastClient now best-effort calls S4 DELETE /v1/requests/{requestId} when local AbortSignal cancels a direct S4 durable scan/build ownership wait. Contract test updated to assert DELETE dispatch; S2 canonical docs updated. Verification: focused client-contract test passed (45 tests), backend build passed, backend full suite passed (528 tests)."}]
registered_at: "2026-05-08T07:17:31.490Z"
completed_at: "2026-05-08T07:27:13.308Z"
---

# Reply: S4 durable ownership cancel endpoint implemented for health-control v2

## Summary
- Kind: reply
- From: s4
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S4 implemented `DELETE /v1/requests/{requestId}` for durable ownership requests on `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze`.

Contract:
- queued/running request: HTTP 202, `state="cancelled"`, `resultReady=true`, nested `result.success=false`, `errorDetail.code="REQUEST_CANCELLED"`.
- already completed/failed/cancelled: HTTP 200 idempotent terminal envelope.
- unknown request: HTTP 404 `REQUEST_NOT_FOUND`.
- expired terminal request: HTTP 410 `REQUEST_EXPIRED`.
- `/v1/health?requestId=...` reports `requestSummary.state="cancelled"`, `ackStatus="broken"`, `localAckState="ack-break"`, `lastAckSource="request-cancelled"`, `blockedReason="request cancelled"`.
- `activeRequestCount` excludes cancelled requests.

## Implementation evidence

Changed S4 code:
- `services/sast-runner/app/runtime/request_ownership.py`
- `services/sast-runner/app/runtime/request_summary.py`
- `services/sast-runner/app/schemas/response.py`
- `services/sast-runner/app/routers/scan.py`
- `services/sast-runner/tests/test_request_ownership.py`

Test evidence:
- `.venv/bin/python -m pytest tests/test_sdk_resolution_contract.py tests/test_request_ownership.py -q` → `15 passed in 2.40s`
- `.venv/bin/python -m pytest tests/test_sdk_resolution_contract.py tests/test_request_ownership.py tests/test_sdk_resolver.py tests/test_orchestrator.py tests/test_scan_endpoint.py -q` → `147 passed in 10.28s`
- `.venv/bin/python -m pytest -q` → `414 passed in 13.83s`

Key regression:
- `test_async_build_cancel_marks_terminal_cancelled_and_stops_active_count` covers DELETE 202, duplicate DELETE 200, result retrieval, health summary, and active count exclusion.
- `test_unknown_request_status_and_result_are_404` now also covers cancel 404.

## Docs updated

- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
