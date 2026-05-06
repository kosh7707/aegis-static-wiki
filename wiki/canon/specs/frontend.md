---
title: "S1 Frontend 현재 구현 스펙"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/src/app/App.tsx"
  - "services/frontend/src/common/styles/index.css"
  - "services/frontend/src/common/ui/auth/AuthConsoleShell.tsx"
  - "services/frontend/src/common/styles/handoff/auth-console.css"
  - "services/frontend/src/common/styles/handoff/tokens.css"
  - "services/frontend/src/common/styles/handoff/base.css"
  - "services/frontend/src/common/styles/handoff/components/nav.css"
  - "services/frontend/src/common/styles/handoff/pages/dashboard.css"
last_verified: "2026-05-06"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "web-only-frontend", "external-ui-handoff", "handoff-css-system"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 현재 구현 스펙

> `services/frontend/`의 현재 실제 구현 기준 S1 프론트 스펙이다.
> 마지막 검증/갱신: **2026-05-06**

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript + Vite)** 기반의 자동차 임베디드 보안 분석 운영 콘솔이다. Electron/preload/window bridge는 사용하지 않는다.

## 2. 현재 UI/문서 원칙

현재 활성 원칙은 다음이다.

1. **시각 방향은 repo 내부 지침이 아니라 외부 디자이너 산출물/핸드오프가 결정한다.**
2. **wiki/local 문서는 구조·행동·검증·소유권만 기록하며, 디자인 시스템 지침을 정식 기준으로 두지 않는다.**
3. **미구현 기능은 mock UI로 남길 수 있지만, 현재 코드에 존재하는 DOM/동작/검증 계약은 문서화한다.**
4. **스타일 자산은 runtime concern에 따라 분리될 수 있다.** 현재 auth entry 화면은 `src/common/ui/auth/*` 의 공용 자산을 사용한다.

## 3. 현재 스택

| 영역 | 값 |
|---|---|
| Runtime | React 19 / React DOM 19 |
| Router | React Router 7 |
| Build | Vite 7 |
| Tests | Vitest, Playwright |
| Source layout | `src/{app, common, pages, test-setup}/` (2026-05-06 restructure) |
| Auth shared assets | `src/common/ui/auth/*` |

## 4. 핵심 파일

> 2026-05-06 frontend restructure 반영 (이전 → 현재 매핑은 `wiki/canon/handoff/s1/architecture.md` §5 참고).

- `services/frontend/src/app/App.tsx` — 전역 라우트 구성 (AuthEntryRoute / RequireAuth / RequireAdmin / ProjectLayoutShell)
- `services/frontend/src/app/main.tsx` — Vite entry
- `services/frontend/src/app/layouts/{GlobalLayout, DashboardLayout, ProjectLayoutShell, ProjectBreadcrumbLayout}.tsx`
- `services/frontend/src/common/styles/index.css` — legacy technical CSS / compatibility layer
- `services/frontend/src/common/ui/auth/AuthConsoleShell.tsx` — login/signup/forgot/reset 공용 shell (`AUTH_CONSOLE_STATUS_ROWS` export)
- `services/frontend/src/common/styles/handoff/fonts.css` — handoff font layer
- `services/frontend/src/common/styles/handoff/tokens.css` — handoff token layer
- `services/frontend/src/common/styles/handoff/base.css` — handoff base layer
- `services/frontend/src/common/styles/handoff/auth-console.css` — handoff auth shell layer
- `services/frontend/src/common/styles/handoff/components/*` — canonical 11 + handoff-only 확장 (button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav + outcome-chip/form-field/status/list/dialog/toast/kpi/distribution/markdown/inline-stack)
- `services/frontend/src/common/styles/handoff/pages/{login, signup, dashboard}.css` — handoff page CSS
- `services/frontend/src/common/api/{client, core, source, analysis, projects, pipeline, sdk, gate, approval, auth, dynamic, notifications, report, mock-handler}.ts` — backend API surface (gate.ts 는 `@aegis/shared` re-export)
- `services/frontend/src/common/ui/primitives/*` — OutcomeChip, SeverityBadge, FindingStatusBadge, ConfidenceBadge, SourceBadge, BackButton, Spinner, ConnectionStatusBanner, StateTransitionDialog, SelectField 등
- `services/frontend/src/common/ui/chrome/{Navbar, Sidebar, ErrorBoundary, NotificationBridge}.tsx`
- `services/frontend/src/common/ui/analysis/{deepOutcome.ts, RecoveryTracePanel.tsx, RecoveryTracePanel.css}`
- `services/frontend/src/common/ui/findings/{FindingDetailView.tsx, FindingDetailView.css, NonAcceptedClaimsList.tsx, EvidencePanel.tsx, EvidenceViewer.tsx}` — Finding 상세 + PoC outcome surface + typed claim diagnostics viewer (2026-05-06)
- `services/frontend/src/pages/LoginPage/*`, `services/frontend/src/pages/SignupPage/*`
- `services/frontend/src/test-setup/{setup.ts, testReconnectionBehavior.ts}`

## 5. 라우트/페이지 범위

S1은 다음 19개 page surfaces를 가진다 (page-per-directory 구조 — `src/pages/<Page>/<Page>.{tsx,css,test.tsx}` + `components/`).

Auth surface (4):
1. LoginPage
2. SignupPage
3. ForgotPasswordPage
4. ResetPasswordPage

글로벌 (3):
5. DashboardPage
6. SettingsPage
7. AdminRegistrationsPage

프로젝트 surface (12):
8. OverviewPage
9. StaticAnalysisPage
10. FilesPage
11. FileDetailPage
12. VulnerabilitiesPage
13. AnalysisHistoryPage
14. ReportPage
15. QualityGatePage
16. ApprovalsPage
17. DynamicAnalysisPage
18. DynamicTestPage
19. ProjectSettingsPage

(`auth 4 + 글로벌 3 + 프로젝트 12 = 19`. SettingsPage 는 글로벌 surface 이지만 프로젝트 라우트 노드에서도 동일 component 가 마운트된다.)

## 6. 현재 구현 계약

- AEGIS는 자동차 임베디드 보안 운영 콘솔이다.
- repo 문서는 pass/fail 가능한 DOM/behavior/ownership/verification만 정의한다.
- visual language 자체는 외부 디자이너 산출물이 갱신한다.
- unsupported backend/auth flows는 mock section으로 남길 수 있다.

## 7. 검증 기준

최소 검증:

```bash
cd services/frontend && npm test
cd services/frontend && npm run typecheck
cd services/frontend && npm run build
```

대수술 slice마다 추가로:
- 해당 page/layout targeted tests
- normal + empty/loading/error state 확인
- 주요 상호작용 확인

## 8. 현재 구현 상태 요약

- `/login`, `/signup`, `/forgot-password`, `/reset-password` 는 shared auth 자산 (`src/common/ui/auth/*`) 을 사용한다.
- 문서상 활성 디자인 doctrine은 제거했다.
- build chunk-size warning은 여전히 non-blocking debt다.

## 9. 문서 우선순위와 정리 원칙

1. **정식 활성 기준은 wiki canon**이다: `wiki/canon/specs/frontend.md`, `wiki/canon/handoff/s1/readme.md`, `wiki/canon/handoff/s1/architecture.md`, `wiki/canon/feedback/s1_frontend_working_guide.md`.
2. repo 내부에는 더 이상 활성 디자인 지침 문서를 두지 않는다.
3. historical session/work-request 문서는 증거 보존 대상이며, 활성 구현 기준으로 재해석하지 않는다.
4. 새 문서 정리 작업은 “active guidance를 구조/행동/검증 중심으로 유지하는 것”을 목표로 한다.
