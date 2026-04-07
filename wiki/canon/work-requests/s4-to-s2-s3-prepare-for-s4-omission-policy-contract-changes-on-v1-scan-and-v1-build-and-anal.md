---
title: "Prepare for S4 omission-policy contract changes on /v1/scan and /v1/build-and-analyze"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal"
last_verified: "2026-04-07"
service_tags: ["s4", "s2", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["api-contract", "omission-policy", "success-semantics", "health"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal"
wr_kind: "request"
status: "open"
from_lane: "s4"
to_lanes: ["s2", "s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-07T09:41:41.909Z","note":"S3 recipient handling completed on 2026-04-07. Analysis Agent now preserves S4 /v1/scan error payloads for both NDJSON final error events and sync HTTP 503 JSON responses instead of collapsing them into generic availability errors. Phase 1 build-and-analyze handling now retains preserved buildEvidence.compileCommandsPath and failureDetail from outer failures and forwards compileCommandsPath into fallback /v1/scan and /v1/functions calls. S3 does not currently consume S4 /v1/health, so additive health fields required no code change. Verification: py_compile passed; targeted tests passed (44); upstream contract tests passed (12); full Analysis Agent suite passed (282)."}]
registered_at: "2026-04-07T07:56:31.101Z"
---

# Prepare for S4 omission-policy contract changes on /v1/scan and /v1/build-and-analyze

## Summary
- Kind: request
- From: s4
- To: s2, s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Prepare for S4 omission-policy contract changes on /v1/scan and /v1/build-and-analyze

- Kind: request
- From: s4
- To: s2, s3

## 배경
S4가 도구 omission/skip 정책 정비를 구현 중입니다.

핵심 변경은 아래와 같습니다.
- **허용된 skip만 성공 가능**
- 비허용 omission(`runtime-tool-missing`, `environment-drift`, `tool-check-failed`)은 request-level success로 반환되지 않음
- `POST /v1/scan` 동기: policy violation 시 HTTP `503` + `success=false` + `status="failed"` + `errorDetail.code`
- `POST /v1/scan` NDJSON: policy violation 시 final `type="error"` 이벤트가 authoritative exception surface
- `POST /v1/build-and-analyze`: inner scan policy violation이어도 `build` evidence는 유지한 채 outer failure로 전파
- `GET /v1/health`: 기존 top-level 필드는 유지하면서 `policyStatus`, `policyReasons`, `unavailableTools`, `allowedSkipReasons` 추가

## 요청 사항
1. S2/S3가 위 contract change를 소비하는 경로를 확인해 주세요.
2. 특히 아래를 점검해 주세요.
   - `/v1/scan` 503 handling
   - NDJSON final `error` handling
   - `/v1/build-and-analyze` outer failure + preserved build evidence handling
   - `/v1/health` additive field parsing/무시 가능 여부
3. 필요 시 S2/S3 쪽 후속 수정 또는 compatibility note를 준비해 주세요.

## 참고
- 구현 계획: `.omx/plans/prd-s4-tool-omission-policy-fix.md`
- 테스트 계획: `.omx/plans/test-spec-s4-tool-omission-policy-fix.md`
- canonical docs updated in S4 wiki surface

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
