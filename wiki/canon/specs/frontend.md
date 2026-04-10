---
title: "S1 Frontend 현재 구현 스펙"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/api/core.ts"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/styles/layout.css"
  - "services/frontend/src/styles/tokens.css"
  - "services/frontend/src/test/setup.ts"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/plans/prd-flatten-frontend-src.md"
  - ".omx/plans/test-spec-flatten-frontend-src.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened"]
related_pages: ["wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md"]
---

# S1 Frontend 현재 구현 스펙

> 이 문서는 `services/frontend/`의 **현재 실제 구현 + 검증된 상태**를 기준으로 작성한 S1 프론트 스펙이다.
> **마지막 검증/갱신: 2026-04-10**

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript + Vite)** 기반의 보안 분석 운영 콘솔이다.

> Electron, preload bridge, `window.api` 계약은 더 이상 사용하지 않는다. 브라우저가 백엔드 HTTP/WS 엔드포인트에 직접 접근하는 웹 애플리케이션이다.

## 2. 현재 구조 핵심

- 런타임 루트는 이제 `src/`다.
- 예전의 중첩된 renderer 트리는 제거되고 런타임 소스가 `src/` 바로 아래로 승격되었다.
- 테스트 bootstrap은 `src/test/setup.ts`에 위치한다.
- 페이지 구현 16개는 모두 page-per-directory 구조다.

```text
src/
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

## 3. 2026-04-10 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 유닛 테스트 | `cd services/frontend && npm test` | PASS (`64` files / `426` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| src flatten 확인 | `cd services/frontend && find src -maxdepth 1 -type d | sort` | root-level source directories only |
| Electron 제거 확인 | `cd /home/kosh/AEGIS && rg -n "from ['\"]electron['\"]|window\.api|contextBridge|BrowserWindow|preload\.js|preload\.ts|dev:main|build:main" services/frontend -g '!services/frontend/dist' -S` | no matches |

## 4. 현재 스택

| 항목 | 현재 값 |
|------|---------|
| 런타임 | 순수 웹 SPA (브라우저) |
| UI | React / React DOM `^19.x` |
| 라우팅 | `react-router-dom ^7.x` + `BrowserRouter` |
| 빌드 | Vite `^7.x` (`dist/`) |
| 테스트 | Vitest `^4.x`, Playwright `^1.x` |
| 스타일 | CSS tokens (`--cds-*` / `--aegis-*`) + co-located CSS |
| 개발 프록시 | Vite proxy (`/api`, `/health`, `/ws` → localhost:3000) |

## 5. 라우트 / 셸

전역:
- `/login`, `/signup`, `/dashboard`, `/settings`
- `/`, `/projects`는 `/dashboard`로 redirect

프로젝트:
- `/overview`, `/static-analysis`, `/files`, `/files/:fileId`, `/vulnerabilities`, `/analysis-history`, `/report`, `/quality-gate`, `/approvals`, `/dynamic-analysis`, `/dynamic-test`, `/settings`

레이아웃 셸:
- Auth
- Global
- Dashboard
- Project

`ProjectBreadcrumbLayout`은 breadcrumb + nested `Outlet`, `ProjectLayoutShell`은 실제 프로젝트 shell(navbar + sidebar + content) 역할을 맡는다.

## 6. 프론트 구조 규칙

### Page-per-directory

```text
pages/
  <Page>/
    <Page>.tsx
    <Page>.css
    components/
    ...local helpers
```

현재 16개 페이지 구현 파일은 모두 이 규칙으로 정리되어 있다.

### Ownership split
- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

### Style layering
1. palette / tokens (`src/styles/tokens.css`)
2. semantic token usage (`--cds-*`, `--aegis-*`)
3. component/page CSS

## 7. DashboardPage 기준 사례

`DashboardPage`는 **복제 대상이 아니라 스타일 원칙 추출 대상**이다.
보존 대상:
- tone
- density
- emphasis hierarchy
- component spacing의 인간 친화적 읽기 리듬

## 8. 후속 작업

1. mixed `components/` ownership 정리
2. remaining brownfield style drift 정리
3. Playwright E2E baseline 재생성
4. `/signup` 실제 인증 플로우 연결

## 9. 한 줄 결론

현재 S1 프론트는 **Electron 없는 웹 전용 SPA**이며, 런타임 소스는 `src/` 바로 아래로 평탄화되어 유지된다.
