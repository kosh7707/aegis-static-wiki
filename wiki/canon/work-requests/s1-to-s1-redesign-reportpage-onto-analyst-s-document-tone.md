---
title: "Redesign ReportPage onto Analyst's Document tone"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone"
last_verified: "2026-04-25"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-redesign-reportpage-onto-analyst-s-document-tone"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T06:28:08.171Z","note":"2026-04-25 autopilot Phase 2d 로 완료.\n\n변경 (12개 파일):\n- `ReportPage.css` — 전체 재작성. 하드코딩 hex / 장식 border-left / `--primary` non-interactive 사용 / 커스텀 timeline 클래스 제거. canonical `.distribution-*`, `.activity-item`, `.form-field` 통합. print 스타일 (`@media print` shadow 제거 + section break-inside) 보강\n- `components/ReportContent.tsx` — `.page-shell` 루트, 탭 active state 정합\n- `components/ReportHeader.tsx` — invalid `variant` prop 제거\n- `components/ReportExecutiveSummary.tsx` — 커스텀 summary bar → `.distribution-list/__row/__meta/__label/__count/__bar/__fill--sev-*` canonical\n- `components/ReportFiltersPanel.tsx` — `.panel + .panel-head + .panel-body + .form-field` 구조\n- `components/ReportFindingsSection.tsx` — `.panel + .panel-body` + caps-mono 컬럼 헤더\n- `components/ReportRunsSection.tsx`, `ReportApprovalsSection.tsx`, `ReportAuditLogSection.tsx` — `.panel` + `report-list-*` 어휘 통일\n- `components/ReportAuditTimelineCard.tsx` — `.activity-item + .activity-icon + .activity-content` canonical (dashboard.css §8.3 timeline rail 자동)\n- `components/ReportModuleBreakdown.tsx` — `.panel` 통일, `report-module-status--{warning,stable}` 텍스트 라벨 동반\n- `components/CustomReportModal.tsx` — `.form-field + .form-label + .form-input/textarea + .form-hint` 계층, native select 대신 SelectField (Radix)\n\nAcceptance criteria 매핑:\n- 모든 섹션 `.panel + .panel-head + .panel-body` 통일\n- executive summary / module breakdown = `.distribution-*` canonical 재사용\n- CustomReportModal = canonical form-field\n- audit log = activity-item timeline rail\n- print 스타일 유지\n- 섹션 리듬 `--space-9` (top-level) / `--space-5` (panel-body)\n- typography 이분: data/ID/timestamp = mono, prose = Paperlogy\n\n검증:\n- typecheck PASS, test 20/20 PASS (9 test files)\n- 통합 599 tests PASS, build PASS\n- code-reviewer (Phase 4a): CRITICAL 0, MINOR 5건 (border-radius 3px hardcoded, --font-code drift, activity-item--last dead class, inline style 다수, hardcoded radius 6px)\n- qa-tester (Phase 4b): 3 viewports PASS, console error 0\n\nConstraints 보존:\n- 데이터 모델 변경 0 (`reportPresentation.ts` 인터페이스 유지)\n- print target selector 보존\n- canonical handoff CSS 무수정\n- Paperlogy 강제, mock 의 Pretendard / `--source-rule-surface/-border` / `--source-ai-surface/-border` drift 무시 (베이스 토큰 `--source-rule`/`-ai` 는 tokens.css 에 정의됨, 사용 OK)\n\nbacklog (MINOR — 별도 PR/세션):\n- `activity-item--last` dead class 제거 (`:last-child` 가 이미 처리)\n- inline style → page CSS class 추출 (5건)\n- `--font-code` 사용처 → `--font-mono` 통일 (단 `tokens.css` 의 `--font-mono` Paperlogy drift 와 별개)\n- hardcoded `border-radius: 6px` → `var(--radius-sm)`"}]
registered_at: "2026-04-22T07:46:59.407Z"
completed_at: "2026-04-25T06:28:08.171Z"
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
