---
title: "reply: ProjectListItem owner field implemented for Dashboard Project Explorer"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer"
last_verified: "2026-04-27"
service_tags: ["s1", "s2", "shared-api", "dashboard"]
decision_tags: ["contract-extension", "ownership", "dashboard-project-explorer", "implemented"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-projectlistitem-owner-field-for-dashboard-explorer-ownership-column.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by:
  - lane: "s1"
    completed_at: "2026-04-27T18:55:00.000Z"
    note: |
      S1 wire-up 완료 (2026-04-27 fine-tuning 세션). S2 의 owner omit policy 정합.

      변경:
      - `services/frontend/src/pages/DashboardPage/dashboardProjectSignals.ts` — `OWNER_POOL` (8-entry seed array) 제거, `projectOwner()` 가 mock fallback 대신 `project.owner` 만 소비. `ProjectOwnerDisplay` 인터페이스 export. 미공급 시 null 반환.
      - `services/frontend/src/pages/DashboardPage/components/ProjectExplorer.tsx` — owner 셀이 owner 존재 시 `<div class="cell-owner"><span class="mini-avatar">{avatar}</span><span>{name}</span></div>` 복원, 미공급 시 dim `—` placeholder 유지. avatar fallback: `owner.avatar ?? Array.from(owner.name).slice(0,2).join("")`.
      - `services/frontend/src/pages/DashboardPage/hooks/useDashboardActivityFeed.ts` — 승인 요청 activity html 의 `owner.name` 직접 참조를 `ownerDisplay = owner?.name ?? "담당자"` 로 안전 fallback.

      검증:
      - typecheck PASS (`tsc --noEmit`)
      - 693 frontend tests PASS / 108 files (baseline 유지)
      - shared 패키지 rebuild → `ProjectOwnerSummary` / `Project.owner` / `ProjectListItem.owner` types `dist/` 전파 확인
      - 운영 4 시드 프로젝트 모두 owner 미공급 (legacy migrated rows) → `—` placeholder 표시 정상. fake "윤/정/김" 0건.
      - 신규 프로젝트는 S2 가 `req.user` 기반 owner 자동 채움 (S2 reply 명시) — 사용자 dashboard "새 프로젝트" 흐름에서 추후 검증.

      out-of-scope (handled separately):
      - owner 정렬 키 추가 — 현 cycle 에서 사용자가 "토글 마지막 분석 빼고 전부 제거" 지시로 전체 sort 토글 제거함. owner sort 도입은 차후 별도 협상 시.
      - handoff §5 sync table cycle 3 entry — 별도 cycle 정리 시 동시 갱신.
registered_at: "2026-04-27T09:45:08.760Z"
completed_at: "2026-04-27T18:55:00.000Z"
---

# reply: ProjectListItem owner field implemented for Dashboard Project Explorer

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# reply: ProjectListItem owner field implemented for Dashboard Project Explorer

## Summary
- Kind: reply
- From: s2
- To: s1
- Date: 2026-04-27

## Result
S2 implemented the requested additive owner contract for project list rows.

Implemented surfaces:
- `services/shared/src/models.ts`
  - `ProjectOwnerKind = "user" | "system"`
  - `ProjectOwnerSummary { id, name, avatar?, kind? }`
  - `Project.owner?: ProjectOwnerSummary`
- `services/shared/src/dto.ts`
  - `ProjectListItem.owner?: ProjectOwnerSummary`
- `GET /api/projects`
  - returns `owner` when S2 has owner data for the project.
  - omits `owner` for migrated/legacy rows or unauthenticated soft-auth development creations.
- `POST /api/projects`
  - if `req.user` exists, stores that authenticated user's profile as owner.

## Payload example

```json
{
  "success": true,
  "data": [
    {
      "id": "proj-123",
      "name": "Gateway ECU",
      "description": "gateway project",
      "owner": {
        "id": "user-abc",
        "name": "김보안",
        "avatar": "김보",
        "kind": "user"
      },
      "createdAt": "2026-04-27T09:00:00.000Z",
      "updatedAt": "2026-04-27T09:00:00.000Z",
      "severitySummary": { "critical": 0, "high": 1, "medium": 0, "low": 0 },
      "gateStatus": "warning",
      "unresolvedDelta": 1
    }
  ]
}
```

## Omit policy
- `owner` is optional and is omitted when S2 has no reliable owner/creator data.
- Existing DB rows are not fake-backfilled.
- Soft-auth unauthenticated project creation can still omit owner.
- S1 should keep the dim `—` placeholder for omitted owner rows.

## Migration plan
- Existing projects remain valid with absent `owner`.
- New projects created through authenticated sessions will receive `owner` automatically.
- Future owner backfill, owner reassignment mutation, multi-owner roles, or avatar image URL support require a separate WR.

## Verification
- `cd services/shared && npm run build` → passed.
- `cd services/backend && npx tsc --noEmit` → passed.
- `cd services/backend && npx vitest run src/__tests__/contract/api-contract.test.ts src/services/__tests__/pipeline-orchestrator.test.ts` → 2 files / 172 tests passed.

## Notes for S1
- The fields are additive. Existing code that ignores `owner` keeps working.
- `avatar` is a 1–2 character initial derived by S2 from display name; if absent/null, S1 may derive from `name`.
- `name` is UTF-8 JSON; Korean and English display names are safe.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
