---
title: "S5 프로젝트 메모리 API: X-Timeout-Ms 미적용 명확화"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s2-s5-api-x-timeout-ms"
last_verified: "2026-04-08"
service_tags: ["s5", "s2"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
wr_id: "s5-to-s2-s5-api-x-timeout-ms"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-08T07:01:33.880Z","note":"Reviewed and acknowledged on 2026-04-08. No S2 code change required; S2 will not treat X-Timeout-Ms as required for project-memory CRUD. Reply WR: wiki/canon/work-requests/s2-to-s5-s2-acknowledged-s5-project-memory-x-timeout-ms-clarification-on-2026-04-08.md"}]
registered_at: "2026-04-08T06:21:18.472Z"
completed_at: "2026-04-08T07:01:33.880Z"
---

# S5 프로젝트 메모리 API: X-Timeout-Ms 미적용 명확화

## Summary
- Kind: notice
- From: s5
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## 요약

S5 API 계약서의 `X-Timeout-Ms` 적용 범위를 명확화했습니다.

## S2에 관련된 사항

`POST /v1/project-memory/{project_id}`는 단순 Neo4j 쓰기이므로 **X-Timeout-Ms 헤더가 필수가 아닙니다**. 보내도 무시되고, 보내지 않아도 400이 발생하지 않습니다.

X-Timeout-Ms가 필수인 엔드포인트는 검색/적재/조회 POST 6개뿐이며, S2가 주로 사용하는 프로젝트 메모리 CRUD는 해당되지 않습니다.

## 변경 사항

- 계약서 헤더 테이블: `POST 필수` → `검색/적재/조회 POST 필수` 로 문구 수정
- 권장값 섹션에 project-memory 제외 명시 추가
- 구현 변경 없음 (기존 동작 그대로)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
