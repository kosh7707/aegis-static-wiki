---
title: "S1 Frontend Architecture Snapshot"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
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
decision_tags: ["frontend-structure-contract", "web-only-frontend", "external-ui-handoff", "handoff-css-system"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 정리한 문서.
> 마지막 갱신: **2026-04-18**

## 1. 최상위 구조

```text
services/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── e2e/
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── api/
    ├── components/ui/
    ├── constants/
    ├── contexts/
    ├── hooks/
    ├── layouts/
    ├── lib/utils.ts
    ├── pages/
    ├── shared/
    │   └── auth/
    ├── test/
    ├── test-utils/
    ├── types/
    └── utils/
```

S1은 순수 웹 SPA다. Electron/preload/window bridge는 없다.

## 2. 실행/빌드 구조

- `npm run dev` → Vite dev server
- `npm run dev:mock` → mock mode Vite dev server
- `npm run build` → Vite production build (`dist/`)
- `npm run typecheck` → TypeScript check
- `npm test` → Vitest
- `npm run test:e2e` → Playwright

## 3. 런타임 라우트

전역:
- `/login`, `/signup`, `/dashboard`, `/settings`
- `/`, `/projects`, `*`는 auth 상태에 따라 redirect

프로젝트:
- `/overview`, `/static-analysis`, `/files`, `/files/:fileId`, `/vulnerabilities`, `/analysis-history`, `/report`, `/quality-gate`, `/approvals`, `/dynamic-analysis`, `/dynamic-test`, `/settings`

## 4. 레이아웃 셸

- `GlobalLayout.tsx`
- `DashboardLayout.tsx`
- `ProjectLayoutShell.tsx`
- `ProjectBreadcrumbLayout.tsx`
- `NotificationBridge.tsx`
- `Navbar.tsx`
- `Sidebar.tsx`
- `shared/auth/AuthConsoleShell.tsx`

## 5. 구조 계약

### Layering

1. app-global theme/base/runtime rules: `src/index.css`
2. handoff shared assets: `src/shared/auth/*`
3. generated/shared UI primitives: `src/components/ui/*`, `src/shared/ui/*`
4. page/layout/components logic: `src/pages/*`, `src/layouts/*`, `src/hooks/*`

### Documentation boundary

- wiki canon(`specs/frontend`, `handoff/s1/readme`, `handoff/s1/architecture`, `feedback/s1_frontend_working_guide`)가 활성 구조 기준이다.
- repo 내부에는 활성 디자인 지침 문서를 두지 않는다.
- history/session/work-request 문서에 남은 과거 용어는 기록 보존일 수 있다.

## 6. Page ownership

All 16 pages remain page-per-directory. Auth pages consume shared assets under `src/shared/auth/*`:

```text
pages/<Page>/<Page>.tsx
pages/<Page>/components
```

Page-level final migration requires normal/empty/error/primary-interaction evidence and targeted tests.

## 7. Current architectural debt

- handoff shared assets와 다른 app surfaces 사이의 styling 일관성은 여전히 후속 정리 대상이다.
- build chunk-size warning remains non-blocking and is the main frontend infra debt.
- future cleanup focus is code-splitting / bundle structure and wider handoff-driven rollout.

## 8. Next-change checklist

- handoff shared asset 변경 시 login/signup 동시 영향 여부를 먼저 본다.
- page 구조와 실제 테스트 자산이 계속 정렬되는지 확인한다.
- Update wiki canon first when frontend structure changes.
