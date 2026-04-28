---
title: "request: add `owner` field to ProjectListItem so the Dashboard Project Explorer can show real ownership instead of seed-mock"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/shared/src/dto.ts"
  - "services/frontend/src/pages/DashboardPage/components/ProjectExplorer.tsx"
  - "services/frontend/src/pages/DashboardPage/dashboardProjectSignals.ts"
  - "wiki/canon/api/shared-models.md"
  - "wiki/canon/handoff/s1/readme.md"
last_verified: "2026-04-27"
service_tags: ["s1", "s2", "shared-api", "dashboard"]
decision_tags: ["contract-extension", "ownership", "dashboard-project-explorer", "anti-mock", "handoff-s1-9-compliance"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-projectlistitem-owner-field-for-dashboard-explorer-ownership-column"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
registered_at: "2026-04-27T16:30:00.000Z"
completed_by:
  - lane: "s2"
    completed_at: "2026-04-27T09:45:30.000Z"
    note: "Implemented ProjectOwnerSummary and ProjectListItem.owner; authenticated project creation stores req.user profile; migrated/unowned rows omit owner; reply WR issued at wiki/canon/work-requests/s2-to-s1-reply-projectlistitem-owner-field-implemented-for-dashboard-project-explorer.md."
---

# request: add `owner` field to ProjectListItem so the Dashboard Project Explorer can show real ownership instead of seed-mock

## Summary
- Kind: request
- From: s1
- To: s2

## Context

Dashboard 의 Project Explorer 테이블 (`/dashboard` → `프로젝트` 섹션) 이 각 행에 "담당" 컬럼을 표시한다. 현재 S2 가 노출하는 `ProjectListItem` (`services/shared/src/dto.ts:51-56`) 에 owner 정보가 없어서, S1 이 `dashboardProjectSignals.ts:72-82` 의 `projectOwner()` 함수에서 `seed-hash → OWNER_POOL[index]` 패턴으로 **deterministic 하지만 fake 한 owner** 를 추첨해 표시 중이었다.

이 패턴은 handoff §9 ("Backend 신규 계약 데이터 정합성을 자가 판단 매핑으로 채우는 것 — lane WR 협상 의무") 을 위반한다. 사용자가 (2026-04-27 fine-tuning 세션에서) "담당의 경우 현재 mock 데이터인가? S2에 요청해야 하는거 아냐?" 로 명시 지적했고, S1 lane 은 즉시 mock 청산 (Project Explorer 의 owner 셀을 dim placeholder `—` 로 전환) 후 본 WR 을 발행한다.

## Current shape (관찰)

```ts
// services/shared/src/dto.ts:51-56
export interface ProjectListItem extends Project {
  lastAnalysisAt?: string;
  severitySummary?: { critical: number; high: number; medium: number; low: number };
  gateStatus?: "pass" | "fail" | "warning";
  unresolvedDelta?: number;
}
```

owner 정보 0건. 현재 dashboard 4개 시드 프로젝트 모두 `OWNER_POOL` 에서 임의로 추첨된 가짜 owner (윤 Yoon / 정 Jung / 김 Kim) 가 노출되고 있었다.

## Requested shape (제안)

`ProjectListItem` 에 `owner` 필드 추가 — 단일 책임자 (또는 primary owner) 모델. 추후 멀티 owner 가 필요하면 별도 cycle 에서 협상.

```ts
export interface ProjectOwnerSummary {
  /** 안정 식별자 — user id 또는 username */
  id: string;
  /** 화면 표시명 (한글/영문 둘 다 허용, 기본 ko-KR) */
  name: string;
  /** 1~2자 이니셜 (UI mini-avatar 용). null 이면 S1 이 name 첫 글자로 derive */
  avatar?: string | null;
  /** 시스템 자동 등록 vs 사람 — 'system' 값일 때 S1 은 "자동" 표시로 fallback */
  kind?: "user" | "system";
}

export interface ProjectListItem extends Project {
  lastAnalysisAt?: string;
  severitySummary?: { critical: number; high: number; medium: number; low: number };
  gateStatus?: "pass" | "fail" | "warning";
  unresolvedDelta?: number;
  /** 프로젝트의 1차 책임자. S2 가 채우지 못하는 경우 (마이그레이션 중 / 시스템 등록 등) undefined 허용 */
  owner?: ProjectOwnerSummary;
}
```

`owner` 는 **optional** — S2 가 데이터 미보유 시 omit 가능하고, S1 은 그 경우 dim placeholder `—` 유지 (이번 cycle 에 적용한 처리 동일).

## UI / sort 영향 (S1 측 wire-up)

S2 가 owner 를 공급하면 S1 은 다음과 같이 즉시 wire-up 한다:

1. `ProjectExplorer.tsx` 의 owner 셀을 placeholder → `<span class="cell-owner">{avatar} {name}</span>` 로 복원
2. `dashboardProjectSignals.ts:projectOwner()` mock fallback 함수 제거
3. 정렬 키 `owner` 추가 — `name` localeCompare 기반
4. Activity feed (`useDashboardActivityFeed.ts:373`) 의 mock owner 호출도 동시 정리

위 4개 작업은 S2 회신 도착 후 S1 lane-local cycle 에서 처리, 별도 reply WR 로 보고.

## Why (motivation)

1. **정직성** — dashboard 가 "이 프로젝트는 누구 책임?" 답을 해야 하는데 현재는 deterministic seed 라 새로고침에도 동일하지만 사실과 무관한 이름이 박혀있다. 운영 사용자가 신뢰할 수 없다.
2. **handoff §9 compliance** — S1 의 mock generation 자체가 lane 계약 위반. 본 WR 로 정합화.
3. **확장성** — 향후 Approval / Audit 화면에서 owner 표시가 필요할 때 동일 필드를 재사용.
4. **사용자 명시 지시** — 2026-04-27 fine-tuning 세션 "담당 만드는 정도는 S2에 WR 넣는걸로 충분하지 않니?" — S2 측 단순 추가 작업으로 판단됨.

## Acceptance criteria

- [ ] `ProjectListItem` 에 `owner?: ProjectOwnerSummary` 필드 추가, `services/shared/src/dto.ts` 갱신
- [ ] `wiki/canon/api/shared-models.md` 의 ProjectListItem 섹션에 owner 필드 명세 추가
- [ ] `GET /api/projects` 응답에 owner 가 채워짐 (S2 가 owner 정보 보유 중인 프로젝트 한정 — 미보유는 omit)
- [ ] `ProjectOwnerSummary` 의 4필드 (id / name / avatar / kind) 모두 ko-KR 1.4-byte 한글 + 영문 latin1 둘 다 안전하게 인코딩
- [ ] S2 reply WR 발행 — payload 예시 + omit 정책 + migration plan 명시

## Out of scope

- 멀티 owner / role-based ownership (lead / contributor 등) — 현재 cycle 외, 추후 별도 협상
- owner 변경 mutation 엔드포인트 — 현재 cycle 외
- avatar 이미지 URL — 1~2자 이니셜만 충분

## Notes

- S1 측은 본 WR 발행과 동시에 ProjectExplorer 의 owner 셀을 `—` placeholder 로 전환했다. mock 잔재 0.
- S1 의 `projectOwner()` 함수는 `useDashboardActivityFeed` 에서 아직 호출되지만 그쪽도 동일 cycle 에서 정리 예정 (S2 회신 도착 후 한꺼번에).
- 본 WR 발행 시 도착하는 S2 측 reply 는 `s2-to-s1-{...}-projectlistitem-owner-field-...` 형태로 회신 부탁.
