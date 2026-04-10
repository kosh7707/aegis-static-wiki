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
  - "services/frontend/src/api/core.ts"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/layouts/ProjectLayoutShell.tsx"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/handoff/s1/qa-guide.md"]
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 2026-04-10 기준으로 정리한 문서.

## 1. 최상위 구조

```text
services/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/design/AEGIS-DESIGN.md
├── e2e/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── api/
    ├── components/
    ├── constants/
    ├── contexts/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── styles/
    ├── test/
    │   └── setup.ts
    ├── test-utils/
    ├── types/
    └── utils/
```

> `src/main/`과 preload bridge는 제거되었고, 예전의 중첩된 renderer 런타임 트리도 더 이상 존재하지 않는다. S1은 순수 웹 SPA다.

## 2. 실행/빌드 구조

- `npm run dev` → Vite dev server
- `npm run dev:mock` → mock mode Vite dev server
- `npm run build` → Vite production build (`dist/`)
- `npm run typecheck` → focused web/API bootstrap typecheck
- `npm test` → Vitest
- `npm run test:e2e` → Playwright

## 3. 실제 런타임 라우트 (`src/App.tsx` 기준)

전역:
- `/login`, `/signup`, `/dashboard`, `/settings`
- `/`, `/projects`는 `/dashboard`로 redirect

프로젝트:
- `/overview`, `/static-analysis`, `/files`, `/files/:fileId`, `/vulnerabilities`, `/analysis-history`, `/report`, `/quality-gate`, `/approvals`, `/dynamic-analysis`, `/dynamic-test`, `/settings`

## 4. 레이아웃 셸

- `GlobalLayout.tsx` — 전역 설정 화면 shell
- `DashboardLayout.tsx` — 대시보드 shell
- `ProjectLayoutShell.tsx` — 프로젝트 shell(navbar + sidebar + nested routes)
- `ProjectBreadcrumbLayout.tsx` — breadcrumb + nested outlet wrapper
- `NotificationBridge.tsx` — projectId 기반 notification provider bridge

> `StatusBar`는 현재 셸 어디에도 마운트되지 않는다.

## 5. CSS / 디자인 시스템 구조

```text
src/styles/
├── tokens.css
├── reset.css
├── animations.css
├── layout.css
├── primitives.css
└── utilities.css
```

- 디자인 시스템 증적 경로: `services/frontend/docs/design/AEGIS-DESIGN.md`
- 각 페이지는 co-located CSS를 사용한다.

## 6. 구조 / ownership 계약

### Page-per-directory
- `pages/<Page>/<Page>.tsx`
- `pages/<Page>/<Page>.css`
- `pages/<Page>/components`

현재 16개 페이지 구현 파일은 모두 이 규칙으로 정리되어 있다.

### Ownership split
- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

### Style layering
1. palette / tokens (`src/styles/tokens.css`)
2. semantic token usage (`--cds-*`, `--aegis-*`)
3. component/page CSS

## 7. DashboardPage reference specimen 규칙

`DashboardPage`는 **레이아웃 복제 대상**이 아니다.
유지해야 하는 것은 다음 네 가지다.
- tone
- density
- emphasis hierarchy
- component spacing의 읽기 편한 리듬

## 8. 다음 변경 시 체크리스트

- 라우트를 바꾸면 `App.tsx`, `Sidebar.tsx`, `ProjectBreadcrumbLayout.tsx`, core docs 3종, `qa-guide.md`, 이 문서를 같이 갱신할 것
- build/runtime 흐름을 바꾸면 `package.json`, `vite.config.ts`, Playwright webServer 설정, canonical docs를 같이 갱신할 것
- 경로 이동 시 `index.html`, `tsconfig.json`, `src/test/setup.ts`, design docs, e2e helper comments까지 같이 정리할 것
