---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/specs/frontend.md"
  - "services/frontend/docs/design/SHADCN-REPLATFORM.md"
  - "services/frontend/package.json"
  - "services/frontend/components.json"
  - "services/frontend/src/index.css"
last_verified: "2026-04-18"
service_tags: ["s1"]
decision_tags: ["shadcn-replatform", "aceternity-reference", "frontend-skill-review-gate", "web-only-frontend", "single-css-entrypoint", "design-doc-hierarchy"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> 먼저 `docs/AEGIS.md`와 `docs/mcp.md`를 읽을 것.
> 마지막 검증/갱신: **2026-04-18**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical spec/handoff 문서를 관리한다.
- S1은 Electron 없는 **웹 전용 SPA**다.
- S1은 S2 API/WS 계약만 소비하며 다른 lane 코드를 수정하지 않는다.

## 2. 현재 큰 방향

S1은 bespoke CSS/design doctrine을 폐기하고 **shadcn/ui + Tailwind + Radix-style primitives** 기반으로 이동했다.

- shadcn/ui: 기본 app primitives source
- Aceternity UI: 필수 탐색/레퍼런스 source, opt-in adoption
- reviewer: `$frontend-skill`을 쓰는 hard-veto critic
- stylesheet entrypoint: `services/frontend/src/index.css` **하나**

## 3. 3강 실행 체계

| 역할 | 책임 |
|---|---|
| Component sourcing worker | shadcn/ui와 Aceternity UI를 탐색하고 sourcing matrix를 작성한다. 코드 구현/최종승인 권한 없음. |
| Developer | 선택된 primitives/components를 S1 코드에 통합하고 기능/테스트를 보존한다. |
| Reviewer | `$frontend-skill`을 로드해 AI Slop, 과한 motion, generic SaaS look, AEGIS 부적합을 veto한다. 코드 작성/자료탐색 금지. |

충돌 시 reviewer가 우선이다.

## 4. 현재 활성 파일

- `services/frontend/components.json`
- `services/frontend/src/index.css`
- `services/frontend/src/components/ui/*`
- `.omx/plans/ralplan-s1-shadcn-replatform.md`
- `.omx/plans/test-spec-s1-shadcn-replatform.md`
- `.omx/plans/s1-shadcn-component-sourcing-matrix-template.md`
- `.omx/plans/s1-shadcn-reviewer-gate-template.md`

## 5. 검증 스냅샷

2026-04-18 기준:

| 항목 | 결과 |
|---|---|
| standalone page/component/global helper CSS | 제거 완료 |
| remaining stylesheet entrypoint | `src/index.css` 단일 파일 |
| frontend tests | PASS (`74 files / 527 tests`) |
| Build | PASS, chunk-size warning만 존재 |
| Typecheck | PASS |

## 6. 다음 작업 기준

1. 새 스타일은 가능하면 component utility composition으로 해결한다.
2. Aceternity는 mandatory search지만, motion-heavy adoption은 reviewer 승인 전 금지다.
3. 기존 design docs는 active 기준에서 제거한다. session/history/evidence는 보존한다.
4. 디자인 관련 문서가 현재 코드 구조(단일 stylesheet entrypoint)를 반영하는지 항상 확인한다.

## 7. 문서 우선순위

1. 활성 규칙은 wiki canon이 우선이다.
2. `services/frontend/docs/design/SHADCN-REPLATFORM.md`는 로컬 mirror/compatibility 문서다.
3. repo-local design surface에는 vendor-branded inspiration pack이 남아 있지 않다.
4. historical session/work-request 문서에 남아 있는 과거 디자인 용어/파일명은 증거 보존 대상이다.

## 8. 금지 사항

- shadcn을 reference-only로 쓰고 bespoke CSS source-of-truth를 다시 늘리는 것
- Aceternity motion을 장식 목적으로 붙이는 것
- Developer가 자기 작업을 visual approve하는 것
- 기존 테스트를 약화시켜 regression을 숨기는 것
