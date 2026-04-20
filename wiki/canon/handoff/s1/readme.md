---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/specs/frontend.md"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/index.css"
  - "services/frontend/src/shared/auth/AuthConsoleShell.tsx"
  - "services/frontend/src/styles/handoff/auth-console.css"
  - "services/frontend/src/styles/handoff/tokens.css"
  - "services/frontend/src/styles/handoff/base.css"
  - "services/frontend/src/styles/handoff/components/nav.css"
  - "services/frontend/src/styles/handoff/pages/dashboard.css"
last_verified: "2026-04-18"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "web-only-frontend", "handoff-css-system"]
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

- 시각 방향은 **외부 handoff 자산**이 결정한다.
- repo 내부 문서는 더 이상 디자인 doctrine을 제공하지 않는다.
- auth entry 화면은 `src/shared/auth/*` 공용 자산을 사용한다.
- 나머지 app surface는 코드 기준 구조/행동/검증 문맥으로만 관리한다.

## 3. 현재 활성 파일

- `services/frontend/src/App.tsx`
- `services/frontend/src/index.css`
- `services/frontend/src/shared/auth/AuthConsoleShell.tsx`
- `services/frontend/src/styles/handoff/tokens.css`
- `services/frontend/src/styles/handoff/auth-console.css`
- `services/frontend/src/pages/LoginPage/*`
- `services/frontend/src/pages/SignupPage/*`

## 4. 검증 스냅샷

2026-04-18 기준:

| 항목 | 결과 |
|---|---|
| handoff shared assets | `/login`, `/signup` 적용 완료 |
| frontend tests | PASS (`74 files / 532 tests`) |
| Build | PASS, chunk-size warning만 존재 |
| Typecheck | PASS |

## 5. 다음 작업 기준

1. 외부 디자이너 산출물이 오면 repo 내부의 이전 디자인 지침을 참고하지 말고 새 산출물을 직접 포팅한다.
2. 미구현 기능은 mock UI로 둘 수 있지만 구조/상태/문구는 현재 handoff 산출물에 맞춘다.
3. 문서는 디자인 취향이 아니라 구조/행동/검증 계약을 기록한다.
4. handoff shared asset 구조와 실제 코드가 계속 일치하는지 확인한다.

## 6. 문서 우선순위

1. 활성 규칙은 wiki canon이 우선이다.
2. repo 내부에는 더 이상 활성 디자인 지침 문서를 두지 않는다.
3. historical session/work-request 문서에 남은 과거 디자인 용어/파일명은 증거 보존 대상이다.

## 7. 금지 사항

- 과거 시각 지침을 활성 기준으로 되살리는 것
- 외부 디자이너 산출물 대신 repo 내부의 낡은 디자인 지침을 참조하는 것
- 기존 테스트를 약화시켜 regression을 숨기는 것
