---
title: "design-system/readme.md §7 라우팅에 handoff/s1/bootstrap.md 진입 링크 추가 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-designer-design-system-readme.md-7-handoff-s1-bootstrap.md"
last_verified: "2026-04-25"
service_tags: ["s1", "s1-qa", "design-system"]
decision_tags: ["bootstrap-protocol", "design-authority-routing", "anti-regression"]
related_pages: ["wiki/canon/handoff/s1/bootstrap.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/design-system/readme.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/design-system/DESIGN.md"]
migration_status: "canonicalized"
wr_id: "s1-to-designer-design-system-readme.md-7-handoff-s1-bootstrap.md"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["designer"]
completed_by: []
registered_at: "2026-04-25T05:23:15.924Z"
---

# design-system/readme.md §7 라우팅에 handoff/s1/bootstrap.md 진입 링크 추가 요청

## Summary
- Kind: request
- From: s1
- To: designer

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-24 S1 세션에서 새 에이전트가 `wiki/canon/handoff/s1/readme.md` 상단 "진입 순서" 인용블록만 읽고 `design-doctrine.md` / `DESIGN.md` 본문, `mocks/*.html`, `assets/**` 자산을 하나도 열지 않은 채 "파악 완료"로 보고하는 회귀가 재발했다. 사용자의 명시 지시("싹 다 읽어와")가 있어야 본문에 도달.

진단: 진입 순서가 선언형 한 줄이고 강제성 · 체크포인트 · 읽기 수단이 분리·누락 → 에이전트는 우회 가능한 문맥에서 요약 경로를 택한다.

대응: 2026-04-24 S1 lane이 `wiki/canon/handoff/s1/bootstrap.md` 를 신설했다 (linear script · phase-단위 체크리스트 · 자산별 읽기 수단 명시 · 실무 제약 레지스트리 · 착수 전 6-게이트). 동시에 `handoff/s1/readme.md` 최상단 인용블록도 bootstrap 포인터 한 줄로 교체했다.

남은 비대칭: **`design-system/readme.md` §7 "라우팅" 섹션은 여전히 직접 6단계 (`docs/AEGIS.md` → `handoff/s1/readme.md` 또는 `qa-guide.md` → `design-system/readme.md` → `design-doctrine.md` → `DESIGN.md` → `mocks/**` + `assets/**`)** 를 가리킨다. design-system/readme로 직접 들어오는 에이전트가 bootstrap 체크리스트를 우회할 수 있다.

`design-system/` 3개 문서(`readme.md`, `DESIGN.md`, `design-doctrine.md`)는 doctrine §7.2 "수정하지 않는다" 영역이라 S1이 직접 편집할 수 없다. 따라서 본 WR로 디자이너 측 갱신을 요청한다.

## Request

`wiki/canon/design-system/readme.md` §7 "라우팅 (Claude Code / Codex-CLI 부트스트랩)" 절차를 다음과 같이 보강:

### 변경 전 (현재)

```
1. docs/AEGIS.md (AEGIS repo root) — lane router
2. wiki/canon/handoff/s1/readme.md 또는 wiki/canon/handoff/s1/qa-guide.md
3. wiki/canon/design-system/readme.md (이 문서) — …
4. wiki/canon/design-system/design-doctrine.md — …
5. 필요 시 wiki/canon/design-system/DESIGN.md 전문 참조
6. 페이지 구현 시 wiki/canon/design-system/mocks/*.html + assets/** 를 계약으로 읽음
```

### 변경 후 (제안)

```
1. docs/AEGIS.md (AEGIS repo root) — lane router
2. **wiki/canon/handoff/s1/bootstrap.md — S1·S1-QA 부팅 전용 단일 스크립트 (필수, skip 금지)**
3. wiki/canon/handoff/s1/readme.md 또는 wiki/canon/handoff/s1/qa-guide.md — 계약·현재 상태·백로그
4. wiki/canon/design-system/readme.md (이 문서) — 디자인 규칙을 다룰 때 redirect 중간 지점
5. wiki/canon/design-system/design-doctrine.md — 어떻게 작업할지
6. 필요 시 wiki/canon/design-system/DESIGN.md 전문 참조
7. 페이지 구현 시 wiki/canon/design-system/mocks/*.html + assets/** 를 계약으로 읽음
```

핵심: bootstrap을 **2단계로 격상**하여, design-system/readme로 우회 진입한 에이전트도 첫 페이지 이전 단계에서 bootstrap 체크리스트를 만나도록 한다. bootstrap 체크리스트 자체가 §3~§6의 read targets 를 모두 enforced 순서로 다시 부른다.

## Acceptance criteria

- [ ] `design-system/readme.md` §7 라우팅 항목에 `wiki/canon/handoff/s1/bootstrap.md` 가 2단계로 추가됨
- [ ] 추가된 항목에 "필수, skip 금지" 또는 동등한 의미의 강제성 표현 포함
- [ ] 기존 6단계 의미는 유지 (numbering만 한 칸씩 밀림)
- [ ] `last_verified` bump
- [ ] 변경사항이 `design-doctrine.md` §7.2 "3개 문서 수정 금지" 정책과 충돌하지 않도록 디자이너 본인 편집으로 처리

## Constraints

- design-system 3부작(readme/DESIGN/doctrine) 외 자산 수정 금지
- bootstrap.md 본문은 S1 관리이므로 design-system 측에서 그 내용을 미러링하지 않음 (drift 방지). §7에는 **링크와 강제성 표현만** 추가한다.
- 추가된 항목은 doctrine §1 컨텍스트 우선 원칙과 §7.1 "작업 착수 전" 절차의 운영 보강이며 신규 정책이 아님

## Notes

- bootstrap.md 본문의 §6 실무 제약 레지스트리에 wiki MCP 응답 크기 제한 / mocks HTML `.md` 접미사 규약 / handoff drift 방향 등이 정리되어 있어, design-system/readme 본문에 동일 정보를 중복 기재할 필요는 없다.
- 본 WR 처리 후 S1 lane은 bootstrap.md `last_verified` 도 함께 bump한다 (실증 갱신).

## Completion expectation

- Recipient (designer) 가 처리 후 `complete_wr` 로 마무리.
- design-system 3부작 외 lane 코드/자산은 변경하지 않음.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
