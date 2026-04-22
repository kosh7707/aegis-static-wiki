---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/specs/frontend.md"
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/index.css"
  - "services/frontend/src/shared/auth/AuthConsoleShell.tsx"
  - "services/frontend/src/styles/handoff/auth-console.css"
  - "services/frontend/src/styles/handoff/tokens.css"
  - "services/frontend/src/styles/handoff/base.css"
  - "services/frontend/src/styles/handoff/components/nav.css"
  - "services/frontend/src/styles/handoff/pages/dashboard.css"
last_verified: "2026-04-22"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "web-only-frontend", "handoff-css-system", "design-system-source-of-truth", "design-doctrine-enforcement"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> 진입 순서 (가장 먼저): `docs/AEGIS.md` → `docs/mcp.md` → **`wiki/canon/design-system/readme.md`** → **`design-doctrine.md`** → **`DESIGN.md`** → `wiki/canon/handoff/s1/design-system.md` → 이 문서.
> 디자인 작업은 **doctrine §1 컨텍스트 체크리스트를 돌리기 전까지 착수 금지**다.
> 마지막 검증/갱신: **2026-04-22**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical spec/handoff 문서를 관리한다.
- S1은 Electron 없는 **웹 전용 SPA**다.
- S1은 S2 API/WS 계약만 소비하며 다른 lane 코드를 수정하지 않는다.

## 2. 시각 방향의 권위 (빡센 버전)

**AEGIS 프론트엔드의 시각 규칙은 외부 디자이너 handoff가 결정한다. S1은 그 규칙을 번역하지 않는다 — 그대로 집행한다.**

- 권위 3부작 (이 순서가 절대 우선순위):
  1. `wiki/canon/design-system/DESIGN.md` — 시스템 원전 (Philosophy / Color / Typography / Spacing / Components / Patterns / A11y / Extending)
  2. `wiki/canon/design-system/design-doctrine.md` — 프로세스 원칙 (anti-slop / 컨텍스트 우선 / 변형 전략 / writer-reviewer 분리)
  3. `wiki/canon/design-system/readme.md` — 라우팅 + source-of-truth 순서 + 자산 지도
- 구현 계약: lane-local 적용 규칙은 `wiki/canon/handoff/s1/design-system.md` §3 에 있다. 위반 시 CRITICAL/MAJOR/MINOR triage는 `design-doctrine.md` §6 을 따른다.
- **새 페이지/컴포넌트를 손대기 전 반드시** `design-doctrine.md` §1 컨텍스트 체크리스트 + §2 anti-slop 목록을 돌린다. "느낌상 이렇게 하면 좋을 것 같아" 로 착수하면 즉각 규칙 위반으로 회귀한다.
- 디자인 관련 판단이 모호하면 그 자리에서 사용자에게 묻는다. 자가 판단으로 섹션/카피/페이지를 덧붙이지 않는다 (`design-doctrine.md` §3.2).

## 3. Source-of-truth 순서 (충돌 시 상위가 이김)

1. `wiki/canon/design-system/DESIGN.md`
2. `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html`
3. `wiki/canon/design-system/assets/**/*.css` + `shield.svg.md`
4. `services/frontend/src/styles/handoff/**` (ship 복사본)
5. React 구현

(프로세스 권위는 `design-doctrine.md` 가 별도로 강제한다. 시각 권위와 충돌하지 않음 — 무엇을 만들지는 DESIGN.md, 어떻게 만들지는 doctrine.)

## 4. 현재 활성 파일

- `services/frontend/src/App.tsx`
- `services/frontend/src/index.css`
- `services/frontend/src/shared/auth/AuthConsoleShell.tsx`
- `services/frontend/src/styles/handoff/tokens.css`
- `services/frontend/src/styles/handoff/auth-console.css`
- `services/frontend/src/pages/LoginPage/*`
- `services/frontend/src/pages/SignupPage/*`
- `services/frontend/src/pages/ForgotPasswordPage/*`
- `services/frontend/src/pages/ResetPasswordPage/*`

## 5. 검증 스냅샷 (2026-04-22)

| 항목 | 결과 |
|---|---|
| handoff shared assets | `/login`, `/signup` 적용 유지 |
| frontend tests | PASS (`105 files / 599 tests`) |
| Build | PASS (dev + prod) |
| Typecheck | PASS |
| Dashboard / Admin / Settings 헤더 수직 정렬 | 세 페이지 모두 H1 top = 92px |
| LoginPage autocomplete | `name=username/password` + `autocomplete=username/current-password` 로 브라우저 저장 프롬프트 작동 |

## 6. 다음 작업 기준

1. 새 페이지/변형 요청이 오면 `design-doctrine.md` §1 컨텍스트 체크리스트를 먼저 돌린 뒤, §4 변형 전략대로 **3+개 축**의 옵션을 제시한 후 사용자 선택을 받는다.
2. 미구현 기능은 mock UI로 둘 수 있지만 구조/상태/문구는 현재 handoff 산출물과 `wiki/canon/design-system/mocks/*.html` 기준을 따른다. 새 색/폰트/토큰을 만들지 않는다.
3. 문서는 디자인 취향이 아니라 **구조·행동·검증 계약**을 기록한다.
4. handoff shared asset 구조와 실제 코드가 계속 일치하는지 확인한다 (`wiki/canon/handoff/s1/design-system.md` §5 동기화 표).
5. 디자인 규칙 관련 질문·재판정은 `wiki/canon/design-system/DESIGN.md` 를 문자적 권위로 인용한다.
6. Writer 패스를 마친 결과물에 **자가 approve 하지 않는다**. S1-QA lane 으로 핸드오프하거나 `code-reviewer` agent 로 reviewer 패스를 별도 세션에서 돌린다 (`design-doctrine.md` §5).

## 7. 문서 우선순위

1. 활성 규칙의 source-of-truth는 wiki canon이다.
2. 디자인 규칙 권위는 `wiki/canon/design-system/DESIGN.md` + `mocks/**` + `assets/**` 이며, S1 lane-local 적용 규칙은 `wiki/canon/handoff/s1/design-system.md` 에 있다.
3. repo 내부(`services/frontend/docs/**`)에는 활성 디자인 지침 문서를 두지 않는다.
4. historical session/work-request 문서에 남은 과거 디자인 용어/파일명은 증거 보존 대상이다.

## 8. 현재 열린 redesign 백로그 (2026-04-22)

canonical 어휘 이탈 또는 정보 계층 파손이 확인돼 redesign 대상으로 올라온 페이지들. WR 문서에서 상세 acceptance criteria 확인:

- `QualityGatePage` — 게이트 상태 시각화 + 룰 리스트 밀도 재정렬 대상
- `ApprovalsPage` — 승인 대기 큐 triage 워크플로우 + filter-pills 정렬
- `ReportPage` — 보고서 문서 톤 + 섹션 헤드 일관화
- `AnalysisHistoryPage` — 러닝 이력 테이블 + module filter canonical 정렬
- `ProjectSettingsPage` — 2026-04-22 baseline redesign 완료, 2차 polish 대상 (horizontal 정렬 / 필드 디테일 / placeholder 3종 처리 방향 확정 등)

각 항목은 `wiki/canon/work-requests/s1-to-s1-*.md` WR 페이지에서 acceptance criteria / 금지 사항 / 참조 규칙 절 번호를 확인한 뒤 착수한다.

## 9. 금지 사항

- 과거 시각 지침을 활성 기준으로 되살리는 것
- `wiki/canon/design-system/` 자산 대신 repo 내부의 낡은 디자인 지침을 참조하는 것
- `src/styles/handoff/**` 를 원본 자산과 독립적으로 로컬 개정하는 것 (원본 먼저, 복제는 그 뒤)
- DESIGN.md §3 규칙 밖의 색을 컴포넌트/페이지 CSS에 직접 박는 것
- severity color를 non-severity UI (버튼, 링크, 네비게이션) 에 사용하는 것 (§3.4)
- 기존 테스트를 약화시켜 regression을 숨기는 것
- **doctrine §1 컨텍스트 체크리스트를 건너뛰고 redesign에 착수하는 것** — 이번 세션에서 실제 발생한 회귀의 직접 원인이었다
- 같은 세션에서 writer/reviewer 겹치기 (doctrine §5)
