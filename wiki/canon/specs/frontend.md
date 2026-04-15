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
  - "services/frontend/src/layouts/Navbar.tsx"
  - "services/frontend/src/layouts/Sidebar.tsx"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/styles/layout.css"
  - "services/frontend/src/styles/tokens.css"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - "services/frontend/src/test/setup.ts"
last_verified: "2026-04-15"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened", "shell-polish-2026-04"]
related_pages: ["wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md"]
---

# S1 Frontend 현재 구현 스펙

> 이 문서는 `services/frontend/`의 **현재 실제 구현 + 검증된 상태**를 기준으로 작성한 S1 프론트 스펙이다.
> **마지막 검증/갱신: 2026-04-15**

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript + Vite)** 기반의 보안 분석 운영 콘솔이다.

> Electron, preload bridge, `window.api` 계약은 더 이상 사용하지 않는다. 브라우저가 백엔드 HTTP/WS 엔드포인트에 직접 접근하는 웹 애플리케이션이다.

## 2. 현재 구조 핵심

- 런타임 루트는 `src/`다.
- 테스트 bootstrap은 `src/test/setup.ts`에 있다.
- 페이지 구현 16개는 모두 page-per-directory 구조다.
- shell/layout 기준 현재 핵심은 **브랜드가 보이는 navbar + 항상 더 어두운 project sidebar + 라이트 메인 캔버스**다.

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

## 3. 2026-04-15 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 유닛 테스트 | `cd services/frontend && npm test` | PASS (`71` files / `509` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| Playwright 수동 QA | localhost page traversal + screenshots | 진행 중 / shell·empty surface 재검증 완료 |
| Electron 제거 확인 | repo grep | no matches |

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
- `/`, `/projects`는 `/dashboard` 또는 `/login`으로 redirect

프로젝트:
- `/overview`, `/static-analysis`, `/files`, `/files/:fileId`, `/vulnerabilities`, `/analysis-history`, `/report`, `/quality-gate`, `/approvals`, `/dynamic-analysis`, `/dynamic-test`, `/settings`

레이아웃 셸:
- Auth
- Global
- Dashboard
- Project

현재 shell 계약:
- Navbar는 **AEGIS 브랜드 블록 + 우측 전역 액션**을 가진다.
- Project sidebar는 **항상 더 어두운 rail**이며, 본문보다 한 단계 무거운 앵커다.
- `ProjectBreadcrumbLayout`은 localized breadcrumb를 유지한다 (`파일 탐색기`, `품질 게이트`, `승인 큐`, `분석 이력`).

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

### Ownership split
- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

### Style layering
1. palette / tokens (`src/styles/tokens.css`)
2. semantic token usage (`--cds-*`, `--aegis-*`)
3. component/page CSS

## 7. 현재 디자인/톤 계약

- 브랜드: **AEGIS는 generic SaaS가 아니라 trusted operations console**로 보여야 한다.
- shell: dark project rail + readable brand navbar + light main canvas
- empty state: giant neutral panel 금지, readiness + next action + workspace purpose가 보여야 함
- dense surfaces: Files / Vulnerabilities / Static Analysis / Report는 카드 모자이크보다 **작업면 중심**으로 보여야 함
- visible terminology는 의도적 도메인 용어가 아니면 한국어 기준으로 통일한다.

## 8. 현재 우선순위

1. dense populated surface polish
   - `StaticAnalysisPage/components/LatestAnalysisTab.tsx`
   - `StaticAnalysisPage/components/SourceTreeView.tsx`
   - `FilesPage/hooks/useFilesPage.tsx`
   - `VulnerabilitiesPage/components/VulnerabilitiesToolbar.tsx`
   - `DynamicAnalysisPage/components/MonitoringView.tsx`
2. Playwright baseline 재정비
3. frontend design docs / QA guidance drift 지속 정리
4. `/signup` 실제 인증 플로우 연결 준비

## 9. 한 줄 결론

현재 S1 프론트는 **Electron 없는 웹 전용 SPA**이며, 최신 sweep 기준으로 shell/empty-state 방향은 신뢰형 운영 콘솔 톤으로 수렴했고, 다음 승부처는 dense populated work surface polish다.
