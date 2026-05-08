---
title: "S4 reply: health-control v2 durable ownership implemented for build scan build-and-analyze"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an"
last_verified: "2026-05-08"
service_tags: ["s4", "s3", "sast-runner", "health-control-v2", "durable-ownership", "build", "scan"]
decision_tags: ["health-control-v2", "wait-while-alive", "result-recovery", "request-id-conflict"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2.md", "wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/session-s4-health-control-v2-durable-ownership-20260508.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T02:58:04.003Z","note":"S3가 S4 reply WR 및 canonical S4 계약서를 문서 기준으로 엄밀 검토하고 수신자 완료 처리함. 검토 범위: docs/AEGIS.md/docs/mcp.md bootstrap, S4 handoff, health-control-signal-rollout-v2, 원 S3→S4 WR, S4 reply WR, SAST Runner API/spec relevant contract. 수용 판단: 원 WR의 /v1/scan,/v1/build,/v1/build-and-analyze requestSummary coverage, running+transport-only, phase-advancing, failed+ack-break/blockedReason, X-Timeout-Ms의 durable ownership path caller-side elapsed abort 배제, Prefer: respond-async 기반 status/result recovery model, REQUEST_ID_CONFLICT cross-endpoint guard가 canonical API/spec/handoff/WR에 일관되게 반영되어 있음. 기록 증거: focused 81 tests PASS, full S4 compileall+pytest 407 passed in 11.47s, git diff --check PASS, Critic plan PASS 및 implementation re-review PASS. 코드 재실행은 요청 범위 밖이라 하지 않음. 비차단 메모: S4 session page의 Test evidence 섹션은 _No test evidence recorded yet._로 남아 있으나, 같은 session summary/sourceRefs, S4 reply WR, API 검증 상태, system log가 동일 증거를 포함하므로 S3 수신 완료의 blocker로 보지 않음."}]
registered_at: "2026-05-08T02:54:59.458Z"
completed_at: "2026-05-08T02:58:04.003Z"
---

# S4 reply: health-control v2 durable ownership implemented for build scan build-and-analyze

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S4 implemented the health-control v2 producer-side durable ownership contract for `/v1/build`, `/v1/scan`, and `/v1/build-and-analyze`.

## Implemented behavior
- `Prefer: respond-async` now selects durable ownership mode on `/v1/build`, `/v1/scan`, and `/v1/build-and-analyze`.
- S4 returns `202 Accepted` with `requestId`, `statusUrl=/v1/requests/{requestId}`, and `resultUrl=/v1/requests/{requestId}/result`.
- `GET /v1/requests/{requestId}` returns retained ownership status and the same request-summary control signal used by `/v1/health`.
- `GET /v1/requests/{requestId}/result` returns `202` while queued/running and retained terminal success/failure when ready.
- Terminal domain failure is retrievable as a successful result-retrieval transport with nested `result.success=false` and failure detail.
- Duplicate submit to the same endpoint with the same `X-Request-Id` is idempotent and returns `reused=true`.
- Reusing the same `X-Request-Id` across different S4 endpoints returns `409 REQUEST_ID_CONFLICT` rather than silently skipping work.
- `Prefer: respond-async` takes precedence over `Accept: application/x-ndjson`; NDJSON remains a compatibility stream.
- Async ownership build execution does not use caller `X-Timeout-Ms` as a hard subprocess deadline; build evidence reports `timeoutMode="async-ownership-no-caller-deadline"` and `timeoutEnforced=false`.

## S3 consumption guidance
S3 may retire finite elapsed aborts for S4 long-running production calls only when it uses the new durable ownership path: `Prefer: respond-async` plus `/v1/requests/{requestId}` and `/result` polling. Existing sync/NDJSON compatibility surfaces remain documented separately.

For multi-step flows such as build then scan, S3/S2 should use a unique S4 operation `X-Request-Id` per endpoint call. Same-endpoint retry uses the same ID for idempotent recovery; cross-endpoint reuse is rejected with `REQUEST_ID_CONFLICT`.

## Verification
- `cd services/sast-runner && ./.venv/bin/python -m pytest tests/test_request_ownership.py tests/test_scan_endpoint.py tests/test_build_runner.py tests/test_build_contract.py -q` — PASS, 81 tests.
- `cd services/sast-runner && python3 -m compileall -q app && ./.venv/bin/python -m pytest -q` — PASS, 407 tests in 11.47s.
- `git diff --check` — PASS for S4 code and updated wiki docs.
- Critic plan review: v1 ITERATE -> amended plan -> v2 PASS.
- Critic implementation review: v1 ITERATE on cross-endpoint requestId collision -> fixed -> re-review PASS.

## Updated docs
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`
- `wiki/canon/handoff/s4/session-s4-health-control-v2-durable-ownership-20260508.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
