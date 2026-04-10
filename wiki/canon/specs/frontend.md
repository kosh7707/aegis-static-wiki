---
title: "S1 Frontend 현재 구현 스펙"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/frontend.md"
  - "services/frontend/src/renderer/App.tsx"
  - "services/frontend/src/renderer/components/Navbar.tsx"
  - "services/frontend/src/renderer/pages/DashboardPage/DashboardPage.tsx"
  - "services/frontend/src/renderer/styles/layout.css"
  - "services/frontend/src/renderer/styles/tokens.css"
  - ".omx/specs/deep-interview-frontend-refactor-structure-docs.md"
  - ".omx/plans/prd-frontend-structure-docs.md"
  - ".omx/plans/test-spec-frontend-structure-docs.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen"]
related_pages: ["wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md"]
---

# S1 Frontend 현재 구현 스펙

> 이 문서는 `services/frontend/`의 **현재 실제 구현 + 검증된 상태**를 기준으로 작성한 S1 프론트 스펙이다.
> **마지막 검증/갱신: 2026-04-10**

---

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript)** 기반의 보안 분석 운영 콘솔이다.
핵심 역할은 다음 세 가지다.

1. 프로젝트/분석 결과/품질 게이트/승인 상태를 **읽기 쉽게 표현**한다.
2. finding, run, report, approval 상태를 **Evidence-first UI**로 보여준다.
3. 백엔드가 계산한 결과를 프론트가 임의 해석하지 않고 **표현 계층**으로 유지한다.

> Electron은 사용하지 않는다. 브라우저에서 직접 접근하는 웹 애플리케이션이다.

---

## 2. 설계 원칙

### 2-1. Evidence-first

화면은 가능한 한 아래 순서를 따른다.

1. 무엇을 보고 있는가
2. 현재 상태가 무엇인가
3. 어떤 결과가 나왔는가
4. 근거가 무엇인가
5. 어떤 run / 모델 / 버전이 이 결과를 만들었는가

### 2-2. Analyst-first

현재 IA는 보안 분석가/플랫폼 운영자가 가장 자주 쓰는 흐름에 맞춰져 있다.

- 프로젝트 선택
- overview 확인
- static analysis drill-down
- files / vulnerabilities / analysis history 확인
- quality gate / approvals / report 검토
- dynamic analysis / dynamic test 실행 확인

### 2-3. Dynamic surface는 현재 실화면 마운트

동적 분석/동적 테스트 관련 페이지는 현재 **실제 페이지 컴포넌트가 마운트**된다.
`/dynamic-analysis`, `/dynamic-test`는 ComingSoonPlaceholder가 아니라 `DynamicAnalysisPage`, `DynamicTestPage`를 렌더링한다.
사이드바에도 정상 노출된다.

### 2-4. Normative future, honest present

프론트 구조 규칙은 **새로 만들거나 실질적으로 리팩터하는 코드에는 절대 규칙**으로 적용한다.
다만 현재 brownfield 코드 전체가 이미 그 규칙을 100% 만족한다고 문서화하지는 않는다. 기존 구조는 **migration-in-progress**로 다룬다.

---

## 3. 2026-04-10 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 유닛 테스트 | `cd services/frontend && npm test` | PASS (`52` files / `395` tests) |
| TS 진단 | `cd services/frontend && npx tsc --noEmit --project tsconfig.json` | PASS |
| 대시보드 회귀 | `cd services/frontend && npx vitest run src/renderer/pages/DashboardPage/DashboardPage.test.tsx` | PASS (`3` tests) |

---

## 4. 현재 스택

| 항목 | 현재 값 |
|------|---------|
| 런타임 | 순수 웹 SPA (브라우저) |
| UI | React / React DOM `^19.x` |
| 라우팅 | `react-router-dom ^7.x` + `BrowserRouter` |
| 빌드 | Vite `^7.x` |
| 테스트 | Vitest `^4.x`, Playwright `^1.x` |
| 코드 하이라이트 | `highlight.js` |
| 마크다운 | `react-markdown` + `remark-gfm` |
| 공유 타입 | `@aegis/shared` |
| 스타일 | CSS tokens (`--cds-*` / `--aegis-*`) + co-located CSS |
| 개발 프록시 | Vite proxy (`/api`, `/health`, `/ws` → localhost:3000) |
| 디자인 시스템 증적 | `services/frontend/docs/design/AEGIS-DESIGN.md` |

---

## 5. 현재 구현 범위

### 5-1. 글로벌 라우트

| 경로 | element | 레이아웃 | 상태 |
|------|---------|---------|------|
| `/` | `/dashboard` redirect | — | 운영 중 |
| `/login` | `LoginPage` | Auth | 운영 중 |
| `/signup` | `SignupPage` | Auth | 운영 중 |
| `/dashboard` | `DashboardPage` | Dashboard | 운영 중 |
| `/settings` | `SettingsPage` | Global | 운영 중 |
| `/projects` | `/dashboard` redirect | — | 하위 호환 |

### 5-2. 프로젝트 라우트

| 경로 | element | 상태 | 비고 |
|------|---------|------|------|
| `/overview` | `OverviewPage` | 운영 중 | overview dashboard |
| `/static-analysis` | `StaticAnalysisPage` | 운영 중 | 최신 분석/전체 현황, run/finding drill-down |
| `/files` | `FilesPage` | 운영 중 | 파일 탐색 |
| `/files/:fileId` | `FileDetailPage` | 운영 중 | 파일 상세 |
| `/vulnerabilities` | `VulnerabilitiesPage` | 운영 중 | 취약점 목록 |
| `/analysis-history` | `AnalysisHistoryPage` | 운영 중 | run history |
| `/report` | `ReportPage` | 운영 중 | 보고서/감사 추적 |
| `/quality-gate` | `QualityGatePage` | 운영 중 | gate 결과/override |
| `/approvals` | `ApprovalsPage` | 운영 중 | approval queue |
| `/dynamic-analysis` | `DynamicAnalysisPage` | 운영 중 (실화면) | 사이드바 노출 |
| `/dynamic-test` | `DynamicTestPage` | 운영 중 (실화면) | 사이드바 노출 |
| `/settings` | `ProjectSettingsPage` | 운영 중 | GitHub-style 좌측 nav |

### 5-3. 레이아웃 셸

| 셸 | 구성 | 사용 경로 |
|----|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + full-width content | `/settings` |
| Dashboard | Navbar + edge-to-edge content | `/dashboard` |
| Project | Navbar + Sidebar + content | `/projects/:projectId/*` |

> `StatusBar` 컴포넌트는 레거시로 남아 있지만 현재 `App.tsx` 레이아웃에 **마운트되어 있지 않다**.

---

## 6. 구현 자산 인벤토리

| 항목 | 수량 |
|------|------|
| 페이지 surface | 16 |
| page-local 폴더화 기준 사례 | 1 (`DashboardPage`) |
| API 모듈 | 14 |
| 컨텍스트 | 5 |
| 커스텀 훅 | 10 |
| styles/ 파일 | 6 |
| 유닛 테스트 파일 | 52 |
| 총 테스트 수 | 395 |

### Hooks

`useAdapters`, `useAnalysisWebSocket`, `useBuildTargets`, `useDynamicTest`, `useElapsedTimer`, `useKeyboardShortcuts`, `usePipelineProgress`, `useSdkProgress`, `useStaticDashboard`, `useUploadProgress`

---

## 7. 현재 제품 동작 규칙

### 7-1. Navbar

- 높이: 48px
- GitHub-style 라이트 헤더
- 구성: **shield icon brand + Dashboard nav + 알림 벨 + 아바타**
- legacy top search bar는 더 이상 없다.

### 7-2. Sidebar

- 프로젝트 문맥에서는 project sub-navigation을 보여준다.
- 모든 항목 노출 (`comingSoon` 필터 없음).
- 260px 너비, GitHub-style 라이트 배경, 파란 accent bar (활성 항목).

### 7-3. Notification scope

- `NotificationBridge`가 현재 URL에서 `projectId`를 추출해 `NotificationProvider`에 전달한다.

### 7-4. Breadcrumb

- `ProjectLayout`이 breadcrumb와 `Outlet`을 담당한다.
- 파일 상세는 `files/:fileId` 경로를 `파일 상세`로 표시한다.

### 7-5. Title 정책

모든 16개 페이지는 `document.title = "AEGIS — {Page Name}"` 형식을 준수한다.

### 7-6. StatusBar

- `StatusBar`는 레거시 컴포넌트로 코드베이스에 남아 있다.
- 현재 레이아웃에는 마운트되지 않는다.
- 문서/QA는 더 이상 이를 기본 UI 구성요소로 가정하지 않는다.

---

## 8. 프론트 구조 규칙 (새 코드 / 실질 리팩터 코드에 대한 절대 규칙)

### 8-1. Page-per-directory

새로 만들거나 실질적으로 리팩터하는 페이지는 다음 형태를 따른다.

```text
pages/
  <Page>/
    <Page>.tsx
    <Page>.css
    components/
    ...local helpers
```

`DashboardPage`는 현재 이 규칙의 **기준 사례(reference specimen)** 다.

### 8-2. Ownership split

- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

현재 brownfield `components/`는 혼합 상태이므로 점진적으로 이 규칙으로 이전한다.

### 8-3. Style layering

프론트 스타일 계층은 다음 순서를 따른다.

1. **palette / tokens** (`styles/tokens.css`)
2. **semantic token usage** (`--cds-*`, `--aegis-*`)
3. **component/page CSS**

TSX는 구조/조립을 우선하고, tokenizable styling은 CSS에서 처리한다.

---

## 9. DashboardPage 기준 사례

`DashboardPage`는 **복제 대상**이 아니라 **스타일 원칙 추출 대상**이다.
문서화 시 보존해야 하는 것은 다음 네 가지다.

- tone
- density
- emphasis hierarchy
- component spacing의 인간 친화적 읽기 리듬

즉, 이후 다른 페이지는 Dashboard를 픽셀 복제할 필요가 없고, 대신 **조용한 표면 계층 / 스캔 가능한 밀도 / 명확한 강조 / 읽기 편한 간격**을 유지해야 한다.

---

## 10. CSS 아키텍처

### styles/ 디렉터리 (6개 파일)

```text
tokens.css
reset.css
animations.css
layout.css
primitives.css
utilities.css
```

- 각 페이지/컴포넌트는 co-located CSS를 사용한다.
- 디자인 시스템 증적은 `services/frontend/docs/design/AEGIS-DESIGN.md`를 참조한다.
- 현재 brownfield CSS에는 일부 legacy radius/shadow 값이 남아 있을 수 있으므로, 구조 계약과 전역 토큰 정합은 후속 리팩터에서 계속 수렴시킨다.

---

## 11. known gaps / 후속 작업

1. canonical wiki 5문서 전체 정합 유지
2. broad frontend refactor를 page-per-directory / ownership split 규칙에 맞춰 진행
3. remaining brownfield style drift(legacy radius/shadow/hardcoded cleanup) 정리
4. Playwright E2E baseline 재생성
5. `/signup` 실제 인증 플로우 연결

---

## 12. 한 줄 결론

현재 S1 프론트는 **순수 웹 SPA + BrowserRouter 기반 운영 콘솔**이며, `/dashboard`는 이제 `DashboardPage`를 렌더링한다. 앞으로의 프론트 구조 규칙은 `DashboardPage`를 기준 사례로 삼아 **page-per-directory + ownership split + token→semantic→CSS layering**으로 수렴한다.
