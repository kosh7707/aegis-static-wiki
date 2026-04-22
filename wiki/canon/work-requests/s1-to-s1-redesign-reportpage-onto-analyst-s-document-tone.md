---
title: "Redesign ReportPage onto Analyst's Document tone"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-22T07:46:59.407Z"
---

# Redesign ReportPage onto Analyst's Document tone

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

`services/frontend/src/pages/ReportPage/` 는 보고서 화면으로 executive summary / findings / runs / approvals / audit log / module breakdown / filters 등 섹션 다수를 담는다. 현재 섹션별 카드 톤이 일관되지 않고 section-header 어휘가 `.panel-head` canonical 과 어긋나 있으며, CustomReportModal 의 폼 요소가 canonical `form-field` 규칙 밖이다.

## Scope

- `ReportPage.tsx`, `ReportPage.css`
- `components/ReportHeader.tsx`
- `components/ReportContent.tsx`
- `components/ReportExecutiveSummary.tsx`
- `components/ReportFiltersPanel.tsx`
- `components/ReportFindingsSection.tsx`
- `components/ReportRunsSection.tsx`
- `components/ReportApprovalsSection.tsx`
- `components/ReportAuditLogSection.tsx`
- `components/ReportAuditTimelineCard.tsx`
- `components/ReportModuleBreakdown.tsx`
- `components/ReportUnavailableState.tsx`
- `components/CustomReportModal.tsx`

## Design rules to apply

- DESIGN.md §7 `.panel + .panel-head h3 + .panel-body` 계층으로 모든 섹션 통일. custom section-header 제거.
- DESIGN.md §4.4 typography dichotomy: 데이터/ID/타임스탬프는 mono, prose는 Paperlogy.
- DESIGN.md §3.4 severity numerals — 수치만 severity 컬러 허용, surrounding prose 금지.
- DESIGN.md §5 섹션 리듬 (`--space-9` top-level / `--space-5` panel-body internal).
- 참조: SettingsPage "Preferences Document" 톤 + VulnerabilitiesPage "Analyst's Register" 둘 다의 합집합.
- `design-doctrine.md` §2.1 anti-slop: 그라데이션 장식 / 장식용 rounded-with-left-border 카드 / 의미 없는 아이콘 배지 전부 감사.

## Acceptance criteria

- [ ] 모든 섹션이 `.panel + .panel-head + .panel-body` 계층
- [ ] executive summary / module breakdown 의 숫자 시각화는 `.severity-tally` 또는 `.severity-bar` canonical 재사용
- [ ] CustomReportModal 은 `.form-field + .form-label + .form-input/textarea + .form-hint` 재사용, native select 금지
- [ ] audit log / timeline 은 DESIGN.md §8.3 `.activity-item::before` timeline rail 패턴 재사용 고려
- [ ] print 스타일 (window.print()) 유지 — panel chrome 인쇄 시 shadow 제거 rule 포함
- [ ] frontend tests + typecheck + build PASS
- [ ] Writer 패스 종료 후 reviewer 핸드오프

## Constraints

- 보고서 데이터 모델 변경 금지, presentation 만 수정
- 기존 print target 셀렉터 보존 (CSS media query 유지)
- canonical handoff CSS 무수정

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
