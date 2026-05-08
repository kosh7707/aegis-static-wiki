---
title: "Canonicalize FindingsSummary aggregate response shape so S1 can drop Record<string, unknown> defensive rendering"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri"
last_verified: "2026-05-08"
service_tags: ["s1", "s2"]
decision_tags: ["findings-summary-canonicalization", "shared-types-export", "frontend-narrowing"]
related_pages: ["wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s1/s2-api-coverage-audit-20260508.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-canonicalize-findingssummary-aggregate-response-shape-so-s1-can-drop-record-stri"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-08T07:09:06.699Z","note":"S2 completed. @aegis/shared now exports FindingsSummary and FindingSummaryResponse uses it; FindingService.getSummary returns the typed runtime aggregate { total, bySeverity, byStatus }; contract tests and canonical docs updated. Critic verification PASS."}]
registered_at: "2026-05-08T06:43:29.414Z"
completed_at: "2026-05-08T07:09:06.699Z"
---

# Canonicalize FindingsSummary aggregate response shape so S1 can drop Record<string, unknown> defensive rendering

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 배경

S2 API contract `GET /api/projects/:pid/findings/summary` endpoint은 "Finding 집계" 로 명세됐지만 응답 shape은 canonical doc에 명시되지 않았다. S1은 2026-05-08 cycle에서 wire-up 후 `Record<string, unknown>` 으로 타입을 약화했고, `FindingsSummaryPanel` 은 defensive narrowing 으로 `total` + `bySeverity` 두 키만 시도 렌더 (다른 키는 silent drop).

## 현재 S1 상태

`services/frontend/src/common/api/analysis.ts:FindingsSummary = Record<string, unknown>` (TODO 코멘트).
`services/frontend/src/common/api/analysis.ts:fetchFindingsSummary(projectId)` returns `Promise<FindingsSummary>`.
`services/frontend/src/pages/VulnerabilitiesPage/components/FindingsSummaryPanel/FindingsSummaryPanel.tsx` — defensive: if `total` exists 렌더, if `bySeverity` 객체 존재 severity-tinted numerals 렌더, 그 외 "정보 없음" placeholder. NO speculative key invention.

## 요청

다음을 canonical doc + typed export 로 확정:

1. `FindingsSummary` interface — at minimum:
   - `total: number`
   - `bySeverity?: Partial<Record<"critical" | "high" | "medium" | "low" | "info", number>>`
   - `byStatus?: Partial<Record<FindingStatus, number>>`
   - 그 외 백엔드가 실제 emit 하는 모든 aggregate 필드 (e.g., `byModule?`, `byRuleId?`, `recentDelta?`, `acceptedCount?`, `dismissedCount?`)
2. `GET /api/projects/:pid/findings/summary` response envelope 확정 (현재 추측: `{success: true, data: FindingsSummary}`).
3. `wiki/canon/handoff/s2/api-endpoints.md` findings summary row 에 응답 shape 추가.
4. `@aegis/shared` 에 정식 export.

## S1 후속

S2 reply 후 frontend cycle 에서:
- `Record<string, unknown>` → `FindingsSummary` narrow
- `byStatus` 추가 KPI 행 추가 (현재 doc-claim 만 있고 미구현 — Phase 2 critic minor)
- `byModule` / `byRuleId` 등 노출 시 추가 panel section 도입

## Acceptance criteria

- `@aegis/shared` 가 `FindingsSummary` 정식 export
- canonical doc에 응답 shape 명시
- S1 FindingsSummaryPanel 이 typed property access + 모든 known 키 KPI 렌더 가능 상태

## 관련 파일

- `services/frontend/src/common/api/analysis.ts` (S1)
- `services/frontend/src/pages/VulnerabilitiesPage/components/FindingsSummaryPanel/FindingsSummaryPanel.tsx` (S1)
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/api/shared-models.md`

## 우선순위

P1 — UX 시나리오 직결, aggregate 패널 정보 가치 향상 위해 typed shape 필수.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
