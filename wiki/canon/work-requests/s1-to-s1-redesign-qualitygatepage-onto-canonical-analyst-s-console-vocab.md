---
title: "Redesign QualityGatePage onto canonical Analyst's Console vocab"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "redesign-backlog"]
related_pages: ["wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s1-redesign-qualitygatepage-onto-canonical-analyst-s-console-vocab"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-22T07:46:11.533Z"
---

# Redesign QualityGatePage onto canonical Analyst's Console vocab

## Summary
- Kind: request
- From: s1
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

`services/frontend/src/pages/QualityGatePage/` 는 외부 handoff 자산이 도입되기 이전 스타일로 남아 있어 `.panel` / `.sev-chip` / `.gate` / `.filter-pills` 등 canonical 컴포넌트를 거의 쓰지 않는다. 현재 화면은 게이트 상태 배너와 룰 결과 리스트가 주력이지만 상태 시각화가 semantic signal이 아닌 장식성 색칠 중심이고, 룰 행 밀도가 낮다.

## Scope

- `QualityGatePage.tsx`, `QualityGatePage.css`
- `components/QualityGateCard.tsx`
- `components/QualityGateRuleResultRow.tsx`
- `components/QualityGateSidebar.tsx`
- `components/QualityGateStatusBanner.tsx`
- `qualityGatePresentation.ts`

## Design rules to apply (literal)

- DESIGN.md §3.4 severity palette 를 gate status에 1:1 매핑: `fail → severity-critical` / `warning → severity-high` / `pass → success` / `running → primary (.gate.running live pulse)`.
- DESIGN.md §7 `.gate` + `.cell-gate` 재사용. 새 상태 색 만들지 말 것.
- DESIGN.md §8.4 caps-mono label 규칙. 룰 ID / 시간 / 카운트는 mono, prose는 Paperlogy.
- DESIGN.md §5 섹션 리듬 — panel 내부 `--space-5`, 섹션 간 `--space-9`.
- `design-doctrine.md` §2.2 signal-vs-decoration 판별: status-tinted 좌측 border가 허용 예외인지 판단 후 인용.
- `design-doctrine.md` §1 컨텍스트 체크리스트 반드시 선행.

## Acceptance criteria

- [ ] 페이지 루트는 `.page-shell` + canonical `.panel` 계층 구조 (status banner → rule sections)
- [ ] 모든 상태 배지 및 row status는 `.gate` / `.cell-gate` 재사용, 새 컬러 토큰 도입 0건
- [ ] 룰 결과 행은 `.page-block-list` / `.page-list-item` 패턴 또는 `.panel-body` 안 테이블 — 무엇을 쓰든 doctrine §6.2 pattern checklist 통과
- [ ] `running` 상태는 DESIGN.md §8.1 live signal 3종 (pulse dot / gate pulse / laser bar) 중 하나만 재사용, `body.no-live` + `prefers-reduced-motion` 동시 종료 보장
- [ ] caps-mono label 에 영문 uppercase + `--tracking-caps` 적용, Korean prose는 body sans
- [ ] 가로 1100 / 900 뷰포트에서 정보 숨겨짐 0건 (DESIGN.md §8.5)
- [ ] 변경 후 frontend tests + typecheck + build PASS
- [ ] Writer 패스 종료 후 S1-QA 또는 `code-reviewer` 에게 reviewer 패스 핸드오프 (doctrine §5)

## Constraints

- canonical handoff CSS 파일 수정 금지. 페이지 local CSS 에서만 조합.
- 기존 라우팅·상태 계산 로직 보존.
- 새 섹션 추가 전 사용자 확인 (doctrine §3.2).

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
