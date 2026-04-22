---
title: "Redesign ApprovalsPage as canonical triage queue"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-redesign-approvalspage-as-canonical-triage-queue"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/work-requests/s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-redesign-approvalspage-as-canonical-triage-queue"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-22T07:46:36.915Z"
---

# Redesign ApprovalsPage as canonical triage queue

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

`services/frontend/src/pages/ApprovalsPage/` 는 승인 대기 큐 triage 화면. 현재 canonical `.filter-pills` / `.sev-chip` / `.panel-head .count` / `.approvals-pill` 활용도가 낮고 Filter UI가 drop-down 중심이라 analyst 워크플로우(빠른 훑고 승인/반려) 에 맞지 않는다. AdminRegistrationsPage v2 의 Triage Queue 패턴을 참조해 정렬한다.

## Scope

- `ApprovalsPage.tsx`, `ApprovalsPage.css`
- `components/ApprovalDecisionDialog.tsx`
- `components/ApprovalFilters.tsx`
- `components/ApprovalRequestList.tsx`
- `hooks/useApprovalsPage.ts`

## Design rules to apply

- DESIGN.md §7 canonical `.panel` + `.panel-head` + `.filter-pills filter-pills--tabs` + `.sev-chip` 재사용.
- DESIGN.md §3.4 severity ramp 를 decision priority 에 맵핑 (critical finding 승인 요청은 `sev-chip critical` 등).
- `design-doctrine.md` §2.3 data-slop 기준: 의미 없는 카운터/배지 제거.
- `design-doctrine.md` §1 컨텍스트 체크리스트 선행.
- 참조 구현: `services/frontend/src/pages/AdminRegistrationsPage/` (2026-04-22 redesign 결과물)

## Acceptance criteria

- [ ] filter UI는 `.filter-pills filter-pills--tabs` 기반, 기본 필터 = pending
- [ ] 각 요청 row는 `.page-list-item` 또는 `.panel-body` 내 grid row — hover affordance 가 실제 클릭 타겟과 일치 (전체 row가 클릭 가능해야 함)
- [ ] status badge `.sev-chip` 재사용, 새 컬러 0건
- [ ] 의사결정 dialog는 canonical `ConfirmDialog` 재사용 가능 여부 검토, 불가 시 `.panel` + `.panel-body` + form-field로 구성
- [ ] 비어있는 필터는 doctrine §3.1 "filler 금지" 따라 실제 카피가 있는 empty state 유지
- [ ] frontend tests + typecheck + build PASS
- [ ] Writer 패스 종료 후 reviewer 핸드오프

## Constraints

- 기존 approve/reject API 계약 보존
- canonical handoff CSS 무수정

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
