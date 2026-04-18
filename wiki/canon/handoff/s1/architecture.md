---
title: "S1 Frontend Architecture Snapshot"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/components.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/index.css"
  - "services/frontend/docs/design/SHADCN-REPLATFORM.md"
last_verified: "2026-04-18"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "web-only-frontend", "shadcn-replatform", "single-css-entrypoint", "design-doc-hierarchy"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 정리한 문서.
> 마지막 갱신: **2026-04-18**

## 1. 최상위 구조

```text
services/frontend/
├── package.json
├── components.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/design/SHADCN-REPLATFORM.md
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

## 5. UI architecture — active contract

현재 활성 계약은:

- `services/frontend/docs/design/SHADCN-REPLATFORM.md`
- `services/frontend/components.json`
- `services/frontend/src/index.css`
- `services/frontend/src/components/ui/*`

### Layering

1. **single CSS entrypoint**: `src/index.css`
2. generated shadcn/Radix primitives: `src/components/ui/*`
3. app behavior/shared wrappers: `src/shared/ui/*`
4. page/layout/components use Tailwind utility classes directly
5. standalone page/component CSS는 현재 실제 코드 기준 제거됨

### Documentation boundary

- wiki canon(`specs/frontend`, `handoff/s1/readme`, `handoff/s1/architecture`, `feedback/s1_frontend_working_guide`)가 활성 설계 기준이다.
- `services/frontend/docs/design/SHADCN-REPLATFORM.md`는 repo-local mirror다.
- repo-local design surface에는 vendor-branded inspiration pack이 남아 있지 않다.
- history/session/work-request 문서에 남은 과거 CSS 파일명은 구조 drift가 아니라 기록 보존일 수 있다.

## 6. Page ownership

All 16 pages remain page-per-directory, but page-local CSS files are no longer required:

```text
pages/<Page>/<Page>.tsx
pages/<Page>/components
```

Page-level final migration requires normal/empty/error/primary-interaction evidence and targeted tests.

## 7. Current architectural debt

- CSS debt is no longer page-scoped; styling is centralized in `src/index.css`.
- build chunk-size warning remains non-blocking and is the main frontend infra debt.
- future cleanup focus is code-splitting / bundle structure, not page CSS removal.

## 8. Next-change checklist

- Do not add new standalone CSS files casually; prefer component utility composition.
- Do not claim a page is fully migrated until it has page-level evidence and reviewer approval.
- Update wiki canon first when frontend design architecture changes.
- Keep active docs and local mirrors aligned; treat older design packs as reference-only.
