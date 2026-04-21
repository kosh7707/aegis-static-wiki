---
title: "S1 Design System Adherence Guide"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/canon/feedback/s1_frontend_working_guide.md"
  - "services/frontend/src/styles/handoff/**"
  - "services/frontend/src/shared/auth/AuthConsoleShell.tsx"
last_verified: "2026-04-21"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "design-system-source-of-truth", "handoff-css-system"]
related_pages: ["wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/usecase-visibility-matrix.md", "wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/specs/frontend.md"]
---

# S1 Design System Adherence Guide

> S1이 구현 시 따라야 하는 AEGIS 디자인 시스템 계약의 lane-local 정리.
> 권위 자료는 `wiki/canon/design-system/readme.md` 및 그 아래 자산이며, 본 문서는 **S1 시점에서의 적용 규칙**만 명시한다.
> 마지막 검증/갱신: **2026-04-21**

## 1. 왜 이 문서가 존재하나

- AEGIS 시각 방향은 외부 디자이너가 결정한다 (`wiki/canon/handoff/s1/readme.md` §2, `wiki/canon/feedback/s1_frontend_working_guide.md` §4).
- 디자이너 handoff 자산 전체가 `wiki/canon/design-system/` 에 canonical로 귀속되었다 (2026-04-20).
- S1은 그 자산을 **ship 자격 형태로 복제**해 `services/frontend/src/styles/handoff/**` 아래에서 런타임 import 한다.
- 이 문서는 S1 개발자/에이전트가 **코드와 자산 간 계약**을 놓치지 않도록 lane-local 진입점을 제공한다.

## 2. 필독 자산 (진입 순서)

1. `wiki/canon/design-system/readme.md` — 디자인 시스템 canonical pointer + 소유 경로 지도
2. **`wiki/canon/design-system/design-doctrine.md`** — 프로세스 원칙 (anti-slop · 변형 전략 · writer/reviewer 분리). 새 작업 착수 전 반드시 확인
3. `wiki/canon/design-system/DESIGN.md` — §1~§11 전부 (Philosophy / File Layout / Color / Typography / Spacing / Radius-Shadow-Motion / Components / Patterns / Accessibility / Extending / Known gaps)
4. 페이지 구현 중이라면 `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html` 중 해당 페이지의 mock을 열어 class/copy/marker를 비교
5. 토큰·컴포넌트 규칙이 불분명하면 `wiki/canon/design-system/assets/{tokens,base,auth-console}.css` + `assets/components/*.css` + `assets/pages/*.css`

## 3. S1 구현 계약

### 3.1 Source-of-truth 순서 (충돌 시 상위가 이김)
1. `wiki/canon/design-system/DESIGN.md`
2. `wiki/canon/design-system/mocks/*.html`
3. `wiki/canon/design-system/assets/**/*.css` + `shield.svg.md`
4. `services/frontend/src/styles/handoff/**` (ship 복사본)
5. React 구현

(프로세스 규칙은 `design-doctrine.md` 가 별도 권위. 시각 권위와 충돌하지 않음 — 무엇을 만들지는 DESIGN.md, 어떻게 만들지는 doctrine.)

### 3.2 Styling ownership (수정)
1. **Design system handoff (read-only 복사본)**: `src/styles/handoff/*` — 원본 자산을 1:1 복제한다. 로컬 개정 금지, 원본을 먼저 수정한 뒤 다시 복제한다. 예외적 확장은 `handoff/{compat,page-surfaces,app-shell}.css` 3개에 한해 허용된다.
2. **Auth shared shell**: `src/shared/auth/*` — `auth-console.css` 구조를 유지한 채 React 래퍼만 추가한다.
3. **Legacy Carbon/shadcn 호환 레이어**: `src/index.css` — 신규 스타일을 추가하지 않는다. 토큰 프록시는 `handoff/compat.css` 를 우선한다.
4. **Page/Layout TSX 로직**: 디자인 규칙을 위반하지 않는 선에서만 수정한다.

### 3.3 금지 사항 (doctrine §2 요약)
- DESIGN.md §3 규칙 밖의 색을 컴포넌트/페이지 CSS에 직접 박는 것
- severity color를 non-severity UI (버튼, 링크, 네비게이션) 에 사용하는 것 (§3.4)
- Paperlogy/Geist Mono 이분 typography를 page 단에서 덮어쓰는 것 (§4)
- 그라데이션 배경 / rounded-with-left-border 카드 / SVG 일러스트 / data slop — 자세한 목록은 `design-doctrine.md` §2
- 신규 "view mode" 를 `body.<mode>` 스위치 없이 하드코딩하는 것 (§8.5)
- 운영 신호 영역(Needs Attention, live indicator, critical counter) 을 좁은 뷰포트에서 숨기는 것 (§8.5 hard rule)
- 한 세션에서 writer/reviewer 겹치기 (doctrine §5)

### 3.4 신규 페이지/컴포넌트 추가 절차

1. **doctrine §1 컨텍스트 체크리스트** 먼저 돌린다 (색/밀도/타이포/caps-mono/live signal 재사용 여부).
2. 디자이너 자산에 해당 페이지/컴포넌트가 있는지 확인한다.
   - 있음 → `wiki/canon/design-system/assets/` 에 새 파일이 이미 있다. `services/frontend/src/styles/handoff/` 로 복제한다.
   - 없음 → DESIGN.md §10 "Extending" 절차를 따라 기존 토큰·컴포넌트로 조합한다. 새 색/폰트/토큰을 만들지 않는다.
3. `pages/<Page>/<Page>.tsx` + `pages/<Page>/components/` 구조 유지 (`wiki/canon/feedback/s1_frontend_working_guide.md` §5.3).
4. 페이지 HTML mock이 있으면 그 class·copy·DOM 순서·data-* 속성을 React 구현에 1:1 반영한다.
5. `document.title = "AEGIS — {Page Name}"` 설정, AuthEntryRoute/RequireAuth 중 적절한 가드를 씌운다.
6. `services/frontend/src/styles/handoff/` 와 원본 자산 간 diff를 기록한다. 의도적 adaptation이면 이 문서 §5 동기화 현황에 추가 사유를 남긴다.
7. 변형을 제안하는 요청이면 doctrine §4 전략대로 3+개 축을 미리 제시한다.

## 4. QA 연결

- S1-QA는 본 handoff 자산과 구현의 drift를 단일 사이클 원칙으로 검증한다 (`wiki/canon/handoff/s1/qa-guide.md` + `wiki/canon/handoff/s1/design-mock-review-workflow.md`).
- QA 증거는 mock HTML 경로 (`wiki/canon/design-system/mocks/*.html`) + DESIGN.md 절 번호로 인용한다.
- QA 체크리스트 기준은 `design-doctrine.md` §6 (토큰 준수 / 패턴 준수 / anti-slop 점검 / 반응형·접근성) 을 참조한다.
- 유스케이스 가시성 매트릭스 (`wiki/canon/handoff/s1/usecase-visibility-matrix.md`) 의 MUST 항목은 DESIGN.md 규칙과 모순되지 않도록 유지한다.

## 5. Mock ↔ Impl 동기화 현황 (2026-04-20)

| 파일 | 상태 |
|---|---|
| `tokens.css` | 바이트 동일 |
| `base.css` | 바이트 동일 |
| `auth-console.css` | 바이트 동일 |
| `components/*.css` (11) | 전부 바이트 동일 |
| `pages/login.css` | 바이트 동일 |
| `pages/signup.css` | 바이트 동일 |
| `pages/dashboard.css` | S1이 3개 rule 추가 (activity icon spacing, load-more 패딩, center-cell) — 의도적 |
| `fonts.css` | CDN → 로컬 경로 (의도적 번들 adaptation) |
| `compat.css` / `page-surfaces.css` / `app-shell.css` | handoff-only 확장, 원본 없음 |

신규 drift 발견 시 이 표를 갱신하고 원본 자산과의 관계를 명시한다.

## 6. 참고 경로 빠른 링크

- Design system canonical: `wiki/canon/design-system/readme.md`
- Design system 원전: `wiki/canon/design-system/DESIGN.md`
- **Design doctrine (프로세스)**: `wiki/canon/design-system/design-doctrine.md`
- S1 인수인계: `wiki/canon/handoff/s1/readme.md`
- S1 working guide: `wiki/canon/feedback/s1_frontend_working_guide.md`
- QA guide: `wiki/canon/handoff/s1/qa-guide.md`
- Design mock review workflow: `wiki/canon/handoff/s1/design-mock-review-workflow.md`
- 가시성 매트릭스: `wiki/canon/handoff/s1/usecase-visibility-matrix.md`
- 구현 handoff CSS: `services/frontend/src/styles/handoff/**`
- Auth shared shell: `services/frontend/src/shared/auth/AuthConsoleShell.tsx`
