---
title: "ProjectSettingsPage phase-2 polish after canonical baseline"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-projectsettingspage-phase-2-polish-after-canonical-baseline"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-projectsettingspage-phase-2-polish-after-canonical-baseline"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-22T07:47:53.448Z"
---

# ProjectSettingsPage phase-2 polish after canonical baseline

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-22 baseline redesign 으로 `.panel + filter-pills + sev-chip + form-field` canonical 어휘로 전환 완료 (commit `d134b6c`). 아직 남은 polish 지점이 있어 2차 패스로 추적한다.

## Scope

- `services/frontend/src/pages/ProjectSettingsPage/**`

## Remaining items (작업 착수 전 사용자 확인 필수 — doctrine §3.2)

### A. Placeholder 3종 처리 방향 확정
- `build-targets` / `notifications` / `adapters` 탭이 현재 "RESERVED" label + 간단 empty-state. 실제 기능 도입 시점까지 유지할지, 아니면 탭 자체를 숨길지 결정 필요.
- 선택지 예시: (1) 현재 유지 — "준비 중" 안내, (2) pill에 `(soon)` suffix + disabled 상태, (3) 아예 탭에서 제거하고 기능 도입 시 재추가.

### B. Horizontal 정렬 일관성
- General 탭 `.form-field` 폭 vs Danger 탭 panel 폭 차이 점검. 모두 `.panel` 내 정렬이지만 form-field 개별 폭 지정 유무로 시각 어긋남 가능.

### C. SDK 관리 세부
- 등록된 SDK 카드의 `.sdk-stepper` 는 page-local 클래스지만 canonical severity/gate 패턴과 비교해 시각 정합 점검.
- `.sdk-card__meta` code chip 스타일이 DESIGN.md code styling과 정렬되는지 확인.

### D. Dirty gate 와 URL section 동기화
- 현재는 General 섹션만 dirty 상태 가짐. 향후 SDK / Danger 섹션에서도 변경 요구가 생기면 dirty 통합 or 섹션별 분리 결정 필요.

### E. Responsive 검증
- 960px 이하에서 `.filter-pills--tabs` 6개가 줄바꿈 시 시각 체크.
- 모바일에서 SDK 카드 `.sdk-card__header` 내 배지들 줄바꿈 품질 확인.

## Design rules

- DESIGN.md §3.4 severity 규칙 엄수: 확장 시 새 색 도입 0건
- `design-doctrine.md` §1 컨텍스트 체크리스트 선행
- `design-doctrine.md` §4 변형 전략: 2차 변경 제안 시 3+개 축 제시

## Acceptance criteria

- [ ] 각 remaining item 에 대한 사용자 확정 후 착수
- [ ] Baseline 에서 회귀 0건 (기존 23 테스트 통과 유지)
- [ ] Writer 패스 종료 후 reviewer 핸드오프

## Constraints

- Baseline의 URL-synced section 라우팅 보존 (`?section=` deep-link)
- 기존 delete-project / updateProjectSettings API 계약 보존
- canonical handoff CSS 무수정

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
