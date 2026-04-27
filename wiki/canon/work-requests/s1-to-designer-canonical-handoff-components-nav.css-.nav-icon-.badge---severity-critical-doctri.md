---
title: "canonical handoff/components/nav.css — `.nav-icon .badge` 가 `--severity-critical` 직접 사용 (doctrine §3.4 violation)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri"
last_verified: "2026-04-25"
service_tags: ["s1", "design-system", "navbar"]
decision_tags: ["nav-badge", "severity-color-misuse", "doctrine-3-4", "canonical-handoff-update"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/design-system.md"]
migration_status: "canonicalized"
wr_id: "s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["designer"]
completed_by: []
registered_at: "2026-04-25T10:23:29.949Z"
---

# canonical handoff/components/nav.css — `.nav-icon .badge` 가 `--severity-critical` 직접 사용 (doctrine §3.4 violation)

## Summary
- Kind: request
- From: s1
- To: designer

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-25 Ralph cycle 의 qa-tester 검증에서 발견된 doctrine §3.4 ("severity color non-severity UI 금지") pre-existing 위반.

위치: `wiki/canon/design-system/assets/components/nav.css` 의 `.nav-icon .badge` 룰
복제본: `services/frontend/src/styles/handoff/components/nav.css` (S1 ship 복제 — canonical 1:1 미러링)

문제:
```css
.nav-icon .badge {
  ...
  background: var(--severity-critical);
  ...
}
```

navbar 의 notification 카운트 badge 는 알림 갯수 표시이지 security severity 신호가 아님. canonical doctrine §3.4 에 따라 severity ramp 의 `--severity-critical` 직접 사용은 non-severity UI 에 금지.

S1 lane 권한:
- `services/frontend/src/styles/handoff/components/nav.css` 는 canonical handoff 11개 중 하나 — **S1 직접 수정 금지** (handoff/s1/design-system.md §3.1)
- 따라서 본 WR 로 디자이너 영역에 명시 갱신 요청

## Request

`wiki/canon/design-system/assets/components/nav.css` 의 `.nav-icon .badge` 의 색을 다음 중 하나로 갱신:

### 옵션 A — `--primary` 사용 (interactive 알림이라는 시그널)
```css
background: var(--primary);
```

### 옵션 B — review-tone palette 의 `caution-review` (`--warning` 계열, 알림은 attention 필요)
```css
background: var(--warning);
color: var(--surface);
```

### 옵션 C — `--foreground` neutral high-contrast (가장 보수적, 색만으로 의미 안 부여)
```css
background: var(--foreground);
color: var(--surface);
```

S2 와 사용자 합의 후 디자이너가 옵션 1개 선택해 갱신.

## Acceptance criteria

- [ ] `wiki/canon/design-system/assets/components/nav.css` 의 `.nav-icon .badge` 가 `--severity-*` 토큰 직접 사용 0
- [ ] 갱신 후 `wiki/canon/design-system/readme.md` last_verified bump
- [ ] S1 이 `services/frontend/src/styles/handoff/components/nav.css` 복제본을 1:1 갱신 (drift 0)

## Constraints

- doctrine §3.4 준수
- canonical 어휘 — severity ramp 직접 사용 금지
- mock 의 drift 흡수 금지

## Related

- 2026-04-25 S1 Ralph cycle 의 review-tone palette 신설 (`outcome-chip.css` + `OutcomeChip.tsx` + `deepOutcome.ts`) — non-severity status/outcome UI 의 canonical 어휘 정착
- 같은 cycle 의 다른 backlog 항목 (overview-gate-badge / quality-gate-badge / monitoring-row-flagged / report-status-tone 등의 hardcoded rgb 또는 severity 색 사용) 은 page CSS 영역이라 별도 처리 가능 — 본 WR 은 canonical handoff 영역만

## Completion expectation

- 디자이너가 옵션 결정 후 canonical nav.css 갱신 → S1 이 ship 복제 → `complete_wr lane=designer` (또는 동등 lane)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
