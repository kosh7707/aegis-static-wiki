---
title: "S5 API 계약 테스트 66건 완료 — 전 엔드포인트 응답 shape 검증됨"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-api-66-shape"
last_verified: "2026-04-08"
service_tags: ["s5", "s3"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-api-66-shape"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-08T06:34:34.365Z","note":"Reviewed the S5 notice on 2026-04-08. Confirmed S3 already sends X-Timeout-Ms on the S5 POST endpoints called from S3-owned surfaces: /v1/search (ThreatSearch, KnowledgeTool), /v1/search/batch, /v1/code-graph/{projectId}/ingest, /v1/code-graph/{projectId}/search, /v1/code-graph/{projectId}/dangerous-callers, and /v1/cve/batch-lookup. Also noted that S5 provenance seam readiness and Neo4j-required search behavior are already aligned with current S3 Phase 1 handling. No S3 code change was required from this notice."}]
registered_at: "2026-04-08T06:21:08.469Z"
completed_at: "2026-04-08T06:34:34.365Z"
---

# S5 API 계약 테스트 66건 완료 — 전 엔드포인트 응답 shape 검증됨

## Summary
- Kind: notice
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## 요약

S5 Knowledge Base API 계약서(`wiki/canon/api/knowledge-base-api.md`) 기준으로 HTTP 레벨 계약 테스트 66건을 작성하여 전수 통과했습니다.

## S3에 관련된 사항

1. **X-Timeout-Ms 필수**: S5의 검색/적재/조회 POST 엔드포인트 6개(`/v1/search`, `/v1/search/batch`, `/v1/code-graph/*/ingest`, `/v1/code-graph/*/search`, `/v1/code-graph/*/dangerous-callers`, `/v1/cve/batch-lookup`)는 `X-Timeout-Ms` 헤더 누락 시 **400을 반환**합니다. S3가 이 헤더를 보내고 있는지 확인 부탁드립니다.

2. **provenance seam 검증 완료**: `buildSnapshotId`, `buildUnitId`, `sourceBuildAttemptId` 필드가 ingest → search → callers/callees → dangerous-callers → project-memory 전 경로에서 정상 전달됨을 확인했습니다. S3에서 provenance를 사용할 준비가 되면 안심하고 전달하셔도 됩니다.

3. **threat search Neo4j 필수**: `/v1/search`, `/v1/search/batch`는 Neo4j 미연결 시 503을 반환합니다 (degraded vector-only 경로 없음). 기존 WR(`s5-to-s3-search-readiness-and-provenance-update`)과 동일한 내용이나, 이번 테스트로 재확인되었습니다.

## 테스트 위치

`services/knowledge-base/tests/test_api_contract.py` (66 tests, 229 total with existing suite)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
