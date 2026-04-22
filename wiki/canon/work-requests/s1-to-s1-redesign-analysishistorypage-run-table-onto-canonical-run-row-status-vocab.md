---
title: "Redesign AnalysisHistoryPage run table onto canonical run-row/status vocab"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-redesign-analysishistorypage-run-table-onto-canonical-run-row-status-vocab"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-redesign-analysishistorypage-run-table-onto-canonical-run-row-status-vocab"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-22T07:47:24.640Z"
---

# Redesign AnalysisHistoryPage run table onto canonical run-row/status vocab

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

`services/frontend/src/pages/AnalysisHistoryPage/` 는 러닝 이력 + 모듈 필터 + 요약 카드 3종 (전체/완료/실패) 을 담는다. 모듈 필터 탭이 custom button group으로 되어 있고, 러닝 테이블은 canonical `.run-row` / `.run-status` / `.cell-gate` 재사용이 부분적이며, toolbar stat 카드 3개가 `.status-chips` 규칙 밖에 있다.

## Scope

- `AnalysisHistoryPage.tsx`, `AnalysisHistoryPage.css`
- `components/AnalysisHistoryRunsTable.tsx`
- `components/AnalysisHistoryToolbar.tsx`
- `hooks/useAnalysisHistoryPage.ts`
- `dashboardTypes` 중 AnalysisHistory 관련 타입 (필요 시 read-only)

## Design rules to apply

- DESIGN.md §7 `.panel + .panel-head h3 + .panel-tools` 구조로 재배치.
- Module filter 는 `.filter-pills filter-pills--tabs + .pill + .pill .dot.running` canonical 재사용.
- 요약 카운트 3종 (전체/완료/실패) 은 `.status-chips + .status-chip + .status-chip__count` 재사용, 실패 count만 severity-critical 틴트.
- 러닝 row 는 DESIGN.md §7 `.run-row` + `.run-status` (completed/running/failed/pending) 로 정렬.
- `running` 상태는 `.run-status--running .run-status__dot` 내장 pulse 재사용, `body.no-live` + `prefers-reduced-motion` 종료.
- `design-doctrine.md` §2.3 data slop: 의미 없는 카운터 제거.
- `design-doctrine.md` §1 컨텍스트 체크리스트 선행.

## Acceptance criteria

- [ ] 러닝 테이블은 `.run-row` + `.run-status--*` canonical, custom status 배지 0개
- [ ] 필터 탭은 `.filter-pills filter-pills--tabs`
- [ ] 요약 카드는 `.status-chips` 패턴, 또는 `.severity-tally--row` 참조 — 새 색 토큰 0개
- [ ] 빈 상태/로딩 상태는 doctrine §3.1 filler 금지 기준 통과 (행동 가능한 카피)
- [ ] 반응형: 900px 이하 테이블 가로 스크롤 또는 card layout 토글
- [ ] frontend tests + typecheck + build PASS
- [ ] Writer 패스 종료 후 reviewer 핸드오프

## Constraints

- 기존 러닝 data fetching 계약 보존
- 파일 상세 페이지로의 drill-down 라우팅 보존
- canonical handoff CSS 무수정

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
