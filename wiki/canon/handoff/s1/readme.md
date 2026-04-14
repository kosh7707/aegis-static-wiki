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
  - "services/frontend/src/pages/FilesPage/FilesPage.tsx"
  - "services/frontend/src/pages/StaticAnalysisPage/StaticAnalysisPage.tsx"
  - "services/frontend/src/pages/ReportPage/ReportPage.tsx"
  - "services/frontend/src/pages/VulnerabilitiesPage/VulnerabilitiesPage.tsx"
last_verified: "2026-04-14"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened", "page-root-decomposition"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 `services/frontend/` 기준의 현재 구현 상태, 검증 결과, 라우트/모듈 인벤토리, 그리고 다음 세션의 정리 우선순위를 넘기기 위한 최신 진입점이다.
> **마지막 검증/갱신: 2026-04-14**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical handoff/spec 문서를 관리한다.
- S1은 **순수 웹 SPA**다. Electron, preload, desktop shell은 사용하지 않는다.
- `src/api/mock-handler.ts`와 프론트 mock/auth 흐름은 S1의 유지관리 의무다.
- 동적 분석/동적 테스트 화면은 실제 페이지 컴포넌트가 마운트되어 있으며 사이드바에도 정상 노출된다.

## 2. 2026-04-14 기준 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`71` files, `451` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| 페이지 루트 분해 점검 | `python3` inventory scan (`services/frontend/src/pages/*/*.tsx`) | 모든 페이지가 page-local `components/`/`hooks/`를 가짐 |
| TSC 진단 | `npx tsc --noEmit --pretty false --project services/frontend/tsconfig.json` | 0 errors / 0 warnings |

## 3. 현재 코드베이스 인벤토리

| 항목 | 현재 값 |
|------|---------|
| 페이지 surface | `16`개 |
| page-per-directory 완료 | `16`개 |
| page-root decomposition | `16/16` 완료 |
| API 모듈 | `16`개 |
| 컨텍스트 | `8`개 |
| 커스텀 훅 | `17`개 |
| 레이아웃 파일 | `12`개 |
| styles/ 파일 | `6`개 |
| 유닛 테스트 파일 | `71`개 |
| 총 테스트 수 | `451`개 |
| Playwright spec 파일 | `12`개 |

## 4. 현재 구조 메모

- 런타임 소스 루트는 `src/`다.
- `App.tsx`, `main.tsx`, `api/`, `pages/`, `styles/` 등이 전부 `src/` 바로 아래에 있다.
- 모든 페이지는 **page-local `components/` / `hooks/`** 구조를 갖고 있으며, 최근 세션에서 page root orchestration을 대거 분해했다.
- 현재 큰 정리 축은 **page root 분해는 거의 끝났고**, 남은 일은 page 내부 대형 component/hook hotspot 정리다.
- 테스트 bootstrap은 `src/test/setup.ts`에 있다.

## 5. 지금 바로 알아야 할 구조 계약

- **page-per-directory**
- **ownership split** (`page-local` / `feature-local` / `app-global`)
- **style layering** (`palette/tokens → semantic token → component CSS`)
- **page root는 routing/orchestration만 유지하고, UI/상태는 page-local component/hook로 이동**

`DashboardPage`는 여전히 reference specimen이며, 유지 대상은 tone / density / emphasis / spacing rhythm이다.

## 6. 현재 UI / shell 현실

- Navbar: Dashboard nav + 우측 설정 진입점
- Sidebar: project context 전용 shell
- `ProjectBreadcrumbLayout` = breadcrumb + nested `Outlet`
- auth는 현재 **localStorage mock** 기준이며 `/` 진입 시 로그인 상태에 따라 `/login` 또는 `/dashboard`로 라우팅된다.
- `FilesPage`는 VS Code 스타일의 **resizable split workspace**를 가진다.
- 최근 sweep 기준으로 decorative page-header/empty-state icon slot과 `<14px` runtime hardcode는 정리된 상태다.

## 7. 다음 세션 우선순위

1. page 내부 대형 hotspot 추가 분해
   - `DynamicAnalysisPage/components/MonitoringView.tsx`
   - `StaticAnalysisPage/components/LatestAnalysisTab.tsx`
   - `StaticAnalysisPage/components/SourceTreeView.tsx`
   - `FilesPage/hooks/useFilesPage.tsx`
   - `VulnerabilitiesPage/components/VulnerabilitiesToolbar.tsx`
2. remaining brownfield style drift / dense surface polish
3. Playwright E2E baseline 재검토
4. `/signup` / `/login` 실제 backend auth 연동 준비
5. 남은 shared/ui 장기 debt 정리

## 8. 한 줄 메모

현재 S1 프론트는 **Electron 없는 웹 전용 SPA**이며, page root decomposition은 사실상 끝났고 다음 단계는 page 내부 대형 component/hook hotspot 정리다.
