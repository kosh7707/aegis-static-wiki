---
title: "S1-QA 실행 가이드"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/qa-guide.md"
last_verified: "2026-04-09"
service_tags: ["s1"]
decision_tags: []
related_pages: []
---

# S1-QA 실행 가이드

> **역할**: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane
> **최신 상태 반영일**: 2026-04-09

---

## 1. 역할과 기본 원칙

- QA는 `services/frontend/src/renderer/**` 구현 코드를 읽지 않는다.
- 판단 기준은 아래 네 문서다.
  1. `docs/AEGIS.md` (부트스트랩 라우터)
  2. `wiki/canon/handoff/s1/readme.md`
  3. `wiki/canon/specs/frontend.md`
  4. `wiki/canon/api/shared-models.md`
- 동적 분석/동적 테스트는 **2026-04-09부터 실화면 마운트** 상태다. placeholder가 아니다.
- repo의 Playwright 자산은 참고 가능하지만, **이 문서의 현재 검증 상태를 우선 기준**으로 삼는다.
- S1은 Electron이 아닌 **순수 웹 SPA**다. Electron 관련 동작은 더 이상 존재하지 않는다.

---

## 2. 2026-04-09 기준 자동 검증 상태

| 영역 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS (0 errors) |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`392` tests, `51` files) |
| TS 진단 | `npx tsc --noEmit --project services/frontend/tsconfig.json` | PASS (0 errors) |

> Playwright E2E baseline은 디자인 시스템 교체 + 라우트 변경 이후 재생성이 필요한 상태다.
> 따라서 QA 우선순위는 **라우트 생존 여부 + 신규 화면(dynamic, signup) 동작 확인 + visual baseline 재생성**이다.

---

## 3. 현재 제품 표면(실제 라우트)

### 전역 라우트

- `/dashboard` — 프로젝트 목록 (구 `/projects`, redirect 처리됨)
- `/signup` — 신규 (2026-04-09)
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
- `/dynamic-analysis` — **실화면** (2026-04-09 활성화)
- `/dynamic-test` — **실화면** (2026-04-09 활성화)
- `/settings`

### QA가 알아야 할 현재 사실

- `/projects`로 접근하면 `/dashboard`로 redirect된다. 정상 동작이다.
- `/`로 접근하면 `/dashboard`로 redirect된다.
- dynamic 경로는 라우트에 존재하고 **사이드바에도 노출**된다.
- Navbar: 48px 높이, 검색바, 알림 벨, 아바타.
- Sidebar: 260px 너비, GitHub-style 라이트 배경, 모든 항목 노출.
- 모든 페이지 `document.title = "AEGIS — {Page Name}"` 형식.
- StatusBar: `"AEGIS v2.1.0 — Embedded Firmware Security Analysis Platform"`.

---

## 4. 도구 우선순위

1. **Playwright MCP / 공식 Playwright skill**
   - 실제 브라우저 확인이 필요할 때 우선 사용
2. **Playwright CLI**
   - 회귀 재현, spec 재실행, baseline 확인이 필요할 때 사용
3. **log-analyzer MCP**
   - 콘솔/에러 원인 추적이 필요할 때 사용

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

1. `npx playwright test e2e/specs/navigation.spec.ts`
2. `/dashboard` 진입 확인 (구 `/projects` redirect 포함)
3. `/signup` 페이지 진입 확인 (신규)
4. 프로젝트 하위 핵심 라우트 진입 확인
5. `/dynamic-analysis`, `/dynamic-test`는 **실화면이 보여야 정상** (placeholder가 아님)
6. 사이드바에 dynamic 항목이 노출되는지 확인

### B. GitHub-style UI 확인

1. Navbar 48px 높이 / 검색바 / 아바타 노출
2. Sidebar 260px / 라이트 배경 / 활성 항목 파란 accent bar
3. ProjectSettings 좌측 sidebar nav 동작 확인

### C. Title 정책 확인

각 페이지 접속 시 `document.title` = `"AEGIS — {Page Name}"` 형식 준수 여부.

### D. Visual baseline 재생성

디자인 시스템 교체(2026-04-08) 및 라우트 변경(2026-04-09) 이후 snapshot baseline 재생성 필요.

1. `visual-qa.spec.ts` — 기존 baseline과 diff 확인
2. `visual-qa-dark.spec.ts`
3. `responsive.spec.ts`
4. `theme.spec.ts`

확인 포인트:
- baseline이 오래된 것인지 (의도된 디자인 변경)
- 실제 레이아웃이 깨진 것인지

### E. 신규/변경 화면 집중 확인

1. `/signup` — 카드 레이아웃, 타이틀 정책, StatusBar 문자열
2. `/dashboard` — ProjectsPage 정상 렌더링
3. `/projects/:projectId/dynamic-analysis` — 실화면 (DynamicAnalysisPage)
4. `/projects/:projectId/dynamic-test` — 실화면 (DynamicTestPage)

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

1. `/dashboard` redirect — `/`, `/projects` 두 경로 모두 `/dashboard`로 이동하는지
2. `/signup` 신규 페이지 동작 및 title 정책
3. `/dynamic-analysis`, `/dynamic-test` 실화면 마운트 확인 (placeholder가 아닌지)
4. Sidebar에 dynamic 항목이 모두 노출되는지 (`comingSoon` 숨김 없음)
5. visual snapshot diff — 디자인 시스템 교체 + v6 레이아웃 리디자인으로 인한 의도적 변경인지 실제 regression인지 분류
6. Navbar/Sidebar GitHub-style UI 적용 여부

---

## 9. 금지 / 주의

- 구현 코드를 보고 원인을 단정하지 말 것
- baseline mismatch를 무조건 스냅샷 갱신으로 덮지 말 것
- `/dynamic-analysis`, `/dynamic-test`를 더 이상 placeholder로 기대하지 말 것 (실화면임)
- `/projects` 접근 시 redirect를 실패로 오해하지 말 것
- lint는 현재 공식 게이트가 아니므로, QA 결과는 **브라우저 동작/스크린샷/로그** 중심으로 정리할 것
