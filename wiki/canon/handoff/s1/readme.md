---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/api/mock-handler.ts"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/plans/prd-flatten-frontend-src.md"
  - ".omx/plans/test-spec-flatten-frontend-src.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 `services/frontend/` 기준의 현재 구현 상태, 검증 결과, 라우트/모듈 인벤토리, 그리고 앞으로의 구조 계약을 다음 세션에 넘기기 위한 최신 진입점이다.
> **마지막 검증/갱신: 2026-04-10**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical handoff/spec 문서를 관리한다.
- S1은 **순수 웹 SPA**다. Electron, preload, desktop shell은 사용하지 않는다.
- `src/api/mock-handler.ts`는 S1의 유지관리 의무다.
- 동적 분석/동적 테스트 화면은 실제 페이지 컴포넌트가 마운트되어 있으며 사이드바에도 정상 노출된다.

## 2. 2026-04-10 기준 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`64` files, `426` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| src flatten 확인 | `cd services/frontend && find src -maxdepth 1 -type d | sort` | root-level source directories only |
| Electron 제거 확인 | `cd /home/kosh/AEGIS && rg -n "from ['\"]electron['\"]|window\.api|contextBridge|BrowserWindow|preload\.js|preload\.ts|dev:main|build:main" services/frontend -g '!services/frontend/dist' -S` | no matches |

## 3. 현재 코드베이스 인벤토리

| 항목 | 현재 값 |
|------|---------|
| 페이지 surface | `16`개 |
| page-per-directory 완료 | `16`개 |
| API 모듈 | `14`개 |
| 컨텍스트 | `5`개 |
| 커스텀 훅 | `10`개 |
| 레이아웃 파일 | `5`개 |
| styles/ 파일 | `6`개 |
| 유닛 테스트 파일 | `64`개 |
| 총 테스트 수 | `426`개 |
| Playwright spec 파일 | `12`개 |

## 4. 현재 구조 메모

- 런타임 소스 루트는 `src/`다.
- `App.tsx`, `main.tsx`, `api/`, `pages/`, `styles/` 등이 전부 `src/` 바로 아래에 있다.
- 테스트 bootstrap은 `src/test/setup.ts`에 있다.
- `layouts/`에는 `DashboardLayout`, `GlobalLayout`, `NotificationBridge`, `ProjectBreadcrumbLayout`, `ProjectLayoutShell`이 존재한다.

## 5. 지금 바로 알아야 할 구조 계약

- **page-per-directory**
- **ownership split** (`page-local` / `feature-local` / `app-global`)
- **style layering** (`palette/tokens → semantic token → component CSS`)

`DashboardPage`는 reference specimen이며, 유지 대상은 tone / density / emphasis / spacing rhythm이다.

## 6. 현재 UI/셸 현실

- Navbar: shield icon brand + Dashboard nav + bell + avatar
- Sidebar: 260px, project context only
- `ProjectBreadcrumbLayout` = breadcrumb + nested `Outlet`
- `ProjectLayoutShell` = 실제 프로젝트 shell
- `StatusBar`는 현재 셸에 마운트되지 않음
- backend connectivity는 preload bridge 대신 direct HTTP/WS 사용

## 7. 다음 세션 우선순위

1. mixed `components/` ownership 정리
2. remaining brownfield style drift 정리
3. Playwright E2E baseline 재생성
4. `/signup` 실제 인증 플로우 연결
5. 페이지별 세부 UI 조정

## 8. 한 줄 메모

현재 S1 프론트는 **Electron 없는 웹 전용 SPA**이며, 런타임 소스도 `src/` 루트로 평탄화되었다.
