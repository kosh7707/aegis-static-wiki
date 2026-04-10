---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/qa-guide.md"
  - "services/frontend/src/renderer/App.tsx"
  - "services/frontend/src/renderer/components/Navbar.tsx"
  - "services/frontend/src/renderer/pages/DashboardPage/DashboardPage.tsx"
  - ".omx/plans/test-spec-frontend-structure-docs.md"
last_verified: "2026-04-10"
service_tags: ["s1", "s1-qa"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1-QA 실행 가이드

> **역할**: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> **최신 상태 반영일**: 2026-04-10

---

## 1. 역할과 기본 원칙

- QA는 `services/frontend/src/renderer/**` 구현 코드를 읽지 않는다.
- 판단 기준은 아래 네 문서다.
  1. `docs/AEGIS.md`
  2. `wiki/canon/handoff/s1/readme.md`
  3. `wiki/canon/specs/frontend.md`
  4. `wiki/canon/api/shared-models.md`
- 동적 분석/동적 테스트는 실화면 마운트 상태다.
- repo의 Playwright 자산은 참고 가능하지만, 현재 문서의 검증 상태를 우선 기준으로 삼는다.
- S1은 Electron이 아닌 순수 웹 SPA다.

---

## 2. 2026-04-10 기준 자동 검증 상태

| 영역 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`395` tests, `52` files) |
| TS 진단 | `cd services/frontend && npx tsc --noEmit --project tsconfig.json` | PASS |
| 대시보드 회귀 | `cd services/frontend && npx vitest run src/renderer/pages/DashboardPage/DashboardPage.test.tsx` | PASS (`3` tests) |

> Playwright E2E baseline은 디자인 시스템 교체 + 라우트/셸 변경 이후 계속 재생성/재분류가 필요한 상태다.

---

## 3. 현재 제품 표면(실제 라우트)

### 전역 라우트

- `/dashboard` — `DashboardPage`
- `/signup`
- `/login`
- `/settings`

### 프로젝트 라우트

- `/overview`
- `/static-analysis`
- `/files`
- `/files/:fileId`
- `/vulnerabilities`
- `/analysis-history`
- `/report`
- `/quality-gate`
- `/approvals`
- `/dynamic-analysis`
- `/dynamic-test`
- `/settings`

### QA가 알아야 할 현재 사실

- `/projects`로 접근하면 `/dashboard`로 redirect된다.
- `/`로 접근하면 `/dashboard`로 redirect된다.
- dynamic 경로는 라우트에 존재하고 사이드바에도 노출된다.
- Navbar: 48px 높이, **shield icon brand + Dashboard nav + bell + avatar**.
- legacy top search bar는 더 이상 기대하지 않는다.
- Sidebar: 260px 너비, 라이트 배경, 모든 항목 노출.
- `StatusBar`는 현재 기본 셸에 마운트되지 않는다.
- 모든 페이지는 `document.title = "AEGIS — {Page Name}"` 형식이어야 한다.

---

## 4. 도구 우선순위

1. **Playwright MCP / 공식 Playwright skill**
2. **Playwright CLI**
3. **log-analyzer MCP**

### CLI 핵심 명령

```bash
cd services/frontend

npm test
npm run build
npx playwright test e2e/specs/navigation.spec.ts
npx playwright test e2e/specs/interactions.spec.ts
npx playwright test e2e/specs/visual-qa.spec.ts
npx playwright test e2e/specs/visual-qa-dark.spec.ts
npx playwright test e2e/specs/responsive.spec.ts
npx playwright test e2e/specs/theme.spec.ts
npm run test:e2e
```

---

## 5. 권장 QA 실행 순서

### A. 라우트/기본 생존 확인

1. `navigation.spec.ts`
2. `/dashboard` 진입 확인 (`/`, `/projects` redirect 포함)
3. `/signup` 페이지 진입 확인
4. 프로젝트 하위 핵심 라우트 진입 확인
5. `/dynamic-analysis`, `/dynamic-test` 실화면 확인
6. 사이드바에 dynamic 항목 노출 확인

### B. 셸/UI 확인

1. Navbar 48px / shield icon / Dashboard nav / bell / avatar
2. legacy top search bar가 **없어야 정상**
3. Sidebar 260px / 라이트 배경 / 활성 항목 accent bar
4. `StatusBar`가 기본 셸에 없음을 전제로 확인
5. ProjectSettings 좌측 nav 동작 확인

### C. Title 정책 확인

각 페이지 접속 시 `document.title = "AEGIS — {Page Name}"` 형식 준수 여부.

### D. Visual baseline 재생성

디자인 시스템 교체 + DashboardPage 기준 사례 정리 이후 snapshot baseline 재생성 필요.

확인 포인트:
- baseline이 오래된 것인지
- 실제 레이아웃이 깨진 것인지
- DashboardPage 스타일 원칙(톤/밀도/강조/간격)이 무너졌는지

### E. 신규/변경 화면 집중 확인

1. `/signup` — 카드 레이아웃, title 정책
2. `/dashboard` — `DashboardPage` 정상 렌더링
3. `/projects/:projectId/dynamic-analysis` — 실화면
4. `/projects/:projectId/dynamic-test` — 실화면

---

## 6. 테스트 자산 맵

| spec | 목적 |
|------|------|
| `navigation.spec.ts` | BrowserRouter 라우팅/사이드바/핵심 서브페이지 smoke |
| `interactions.spec.ts` | 생성/필터/quality gate/approval 상호작용 |
| `responsive.spec.ts` | 480/768/1024 반응형 스냅샷 |
| `theme.spec.ts` | light/dark/system 테마 전환 |
| `visual-qa.spec.ts` | 주요 라이트 테마 페이지 스냅샷 |
| `visual-qa-dark.spec.ts` | 주요 다크 테마 페이지 스냅샷 |
| `qa-design-audit.spec.ts` | 광범위한 화면/상호작용/빈 상태/반응형 audit |
| `qa-expert-review.spec.ts` | expert review 흐름 검증 |
| `qa-finding-detail.spec.ts` | finding detail drill-down 회귀 |
| `qa-redesign-review.spec.ts` | 리디자인 스냅샷 회귀 |
| `qa-verify-s1-response.spec.ts` | 특정 S1 응답/수정 검증 |

---

## 7. 이슈 보고 포맷

```md
# S1-QA → S1: {이슈 제목}

- 날짜: YYYY-MM-DD
- 범주: Route regression | Interaction bug | Visual drift | Responsive bug
- 실행 명령: `{실행한 명령}`
- 환경: `{viewport} / {theme} / mock 여부`
- 증거:
  - 스크린샷: `services/frontend/e2e/test-results/...`
  - 에러 컨텍스트: `services/frontend/e2e/test-results/.../error-context.md`

## 현상
{무엇이 보였는지}

## 기대 동작
{spec 또는 handoff 기준}

## 재현 절차
1. ...
2. ...
3. ...
```

---

## 8. 지금 QA가 특히 봐야 할 것

1. `/dashboard` redirect — `/`, `/projects` 모두 `/dashboard`로 이동하는지
2. `/dashboard`가 `DashboardPage`를 안정적으로 렌더링하는지
3. Navbar에서 legacy top search가 제거된 현재 셸이 의도대로 보이는지
4. `StatusBar`가 더 이상 기본 셸 전제가 아닌 점을 기준으로 baseline을 재해석할 것
5. dynamic routes가 placeholder가 아니라 실화면인지
6. visual snapshot diff가 DashboardPage style principle(톤/밀도/강조/간격) 관점에서 regression인지 판단할 것

---

## 9. 금지 / 주의

- 구현 코드를 보고 원인을 단정하지 말 것
- baseline mismatch를 무조건 스냅샷 갱신으로 덮지 말 것
- `/dynamic-analysis`, `/dynamic-test`를 placeholder로 기대하지 말 것
- `/projects` redirect를 실패로 오해하지 말 것
- Navbar search나 StatusBar를 현재 UI 필수 요소라고 가정하지 말 것
