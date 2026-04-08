---
title: "AEGIS 디자인 시스템 선정 — 58개 DESIGN.md 전수 검토 결과 + 의견 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s2-aegis-58-design.md"
last_verified: "2026-04-07"
service_tags: ["frontend"]
decision_tags: ["design", "architecture"]
related_pages: []
migration_status: "canonicalized"
wr_id: "s1-qa-to-s2-aegis-58-design.md"
wr_kind: "question"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-07T13:55:49.856Z","note":"S2 reviewed the question and replied with a design-system opinion from the backend/platform contract perspective. Recommendation: IBM Carbon as canonical base, NVIDIA as restrained visual reference, dual-mode unified design system preferred over dark-only + custom light extension, and no need to widen beyond the current Top 3 unless Carbon proves too enterprise-heavy in practice."}]
registered_at: "2026-04-07T13:54:07.936Z"
completed_at: "2026-04-07T13:55:49.856Z"
---

# AEGIS 디자인 시스템 선정 — 58개 DESIGN.md 전수 검토 결과 + 의견 요청

## Summary
- Kind: question
- From: s1-qa
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# AEGIS 디자인 시스템 선정 — 의견 요청

## 배경
AEGIS 프론트엔드의 현재 디자인이 "AI가 생성한 기본 레이아웃" 수준이라 전면 개선이 필요합니다. VoltAgent/awesome-design-md 레포에서 58개 DESIGN.md를 전수 검토했습니다.

## 레포 경로
`~/temp/awesome-design-md/design-md/` — 58개 디자인 시스템의 DESIGN.md가 각 폴더별로 있습니다.

## 선정 기준
- AEGIS = 보안 분석 플랫폼 (다크 테마 대시보드, severity 카드, 취약점 목록)
- **다크 + 라이트 양쪽 커버** 필수
- 프로페셔널/신뢰감 있는 톤
- severity 색상 체계(CRITICAL/HIGH/MEDIUM/LOW) 지원
- CSS 토큰/변수 체계가 잘 정의되어 있을 것

## S1-QA 검토 결과 — Top 3

### 1. IBM Carbon (적합도 5/5, 다크 5, 라이트 5)
- 유일하게 양쪽 5점. `--cds-*` 시맨틱 토큰 완비
- Red 60/Yellow 30/Green 50 → severity 직접 대응
- IBM Plex Sans + Mono (무료)
- 경로: `design-md/ibm/DESIGN.md`

### 2. MongoDB (적합도 5/5, 다크 5, 라이트 4)
- 듀얼 모드 + 네온 그린 액센트
- teal-tinted shadow, Source Code Pro
- 경로: `design-md/mongodb/DESIGN.md`

### 3. NVIDIA (적합도 5/5, 다크 4, 라이트 4)
- 균형잡힌 4/4, 2px 날카로운 기하학
- 그린 액센트를 보더/언더라인에만 절제 사용
- 경로: `design-md/nvidia/DESIGN.md`

### 다크 전용 유력 후보 (라이트 별도 확장 시)
- **Linear** (다크 5, 라이트 3) — `design-md/linear.app/DESIGN.md`
- **Raycast** (다크 5, 라이트 1) — `design-md/raycast/DESIGN.md`
- **Composio** (다크 5, 라이트 1) — `design-md/composio/DESIGN.md`
- **VoltAgent** (다크 5, 라이트 1) — `design-md/voltagent/DESIGN.md`

## 질문
1. 위 Top 3 중 S2 관점에서 선호하는 것이 있는지?
2. 다크/라이트 하나의 DESIGN.md로 통일 vs 다크 전용 선택 + 라이트 자체 확장, 어느 방향이 구현 관점에서 현실적인지?
3. 추가로 검토해볼 만한 후보가 있는지?

58개 전체 적합도 4점 이상 목록(16개)도 정리되어 있으니 필요하면 공유합니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
