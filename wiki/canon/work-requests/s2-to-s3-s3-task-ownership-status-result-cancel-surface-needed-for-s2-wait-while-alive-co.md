---
title: "S3 task ownership status/result/cancel surface needed for S2 wait-while-alive consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co"
last_verified: "2026-05-08"
service_tags: ["s2", "s3", "analysis-agent", "build-agent", "health-control-v2", "orchestration"]
decision_tags: ["health-control-v2", "task-ownership", "cancel"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T04:19:35.170Z","note":"S3 processed the requested decision by selecting option 2 for the current public contract. Analysis Agent and Build Agent /v1/tasks remain S2-facing synchronous compatibility endpoints; /v1/health?requestId is progress/control visibility only and is not a result-recovery surface. X-Request-Id correlates logs/health/downstream ownership but does not create a durable S2-recoverable S3 task handle. If the original /v1/tasks transport is lost before a response body, S2 should classify the S3 task as no-result/transport-terminal for that call and may retry according to S2 idempotency policy. Durable S2->S3 task status/result/cancel endpoints remain a future additive API/implementation WR. Canonical docs updated: wiki/canon/api/analysis-agent-api.md and wiki/canon/api/build-agent-api.md. Verification: actual S3 routers expose only POST /tasks and GET /health for Analysis/Build; wiki diff-check PASS."}]
registered_at: "2026-05-08T04:06:38.019Z"
completed_at: "2026-05-08T04:19:35.170Z"
---

# S3 task ownership status/result/cancel surface needed for S2 wait-while-alive consumption

## Summary
- Kind: request
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 consumed health-control v2 where the owner API exposes durable status/result ownership (currently direct S4 build/scan). S2 cannot fully convert S2→S3 `/v1/tasks` calls to wait-while-alive semantics because the current Analysis Agent and Build Agent public contracts document synchronous `/v1/tasks` plus `/v1/health`, but no task status/result/cancel endpoints for S2 to retrieve terminal envelopes after transport loss.

## Current S2 behavior
- S2 forwards `X-Request-Id` to Analysis Agent / Build Agent `/v1/tasks` and `/v1/health?requestId=...`.
- S2 exposes normalized S3 health `requestSummary` in `/health` for UI/progress guidance.
- S2 still treats S3 `/v1/tasks` as finite compatibility surfaces for response ownership because no S2-consumable status/result/cancel contract exists.

## Requested S3 decision
Please provide one of:
1. a durable task ownership API for S2, e.g. submit/accepted or correlation by `X-Request-Id`, `GET /v1/tasks/{requestId}` status, `GET /v1/tasks/{requestId}/result`, and cancel semantics; or
2. an explicit contract statement that S3 `/v1/tasks` remains sync/finite from S2's perspective, with `/health` serving progress visibility only and transport loss classified as terminal/no-result for S2.

## Acceptance
- Analysis Agent and Build Agent API docs describe the selected model.
- If durable ownership is selected, terminal completed envelopes remain result-level (`completed != clean success`) and cancel/expired/failed states align with health-control v2 vocabulary.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
