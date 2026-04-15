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
  - "services/frontend/src/layouts/Navbar.tsx"
  - "services/frontend/src/layouts/Sidebar.tsx"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/pages/FilesPage/FilesPage.tsx"
  - "services/frontend/src/pages/StaticAnalysisPage/StaticAnalysisPage.tsx"
  - "services/frontend/src/pages/ReportPage/ReportPage.tsx"
  - "services/frontend/src/pages/VulnerabilitiesPage/VulnerabilitiesPage.tsx"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
last_verified: "2026-04-15"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened", "page-root-decomposition", "shell-polish-2026-04"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 `services/frontend/` 기준의 현재 구현 상태, 검증 결과, 라우트/모듈 인벤토리, 그리고 다음 세션의 정리 우선순위를 넘기기 위한 최신 진입점이다.
> **마지막 검증/갱신: 2026-04-15**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical handoff/spec 문서를 관리한다.
- S1은 **순수 웹 SPA**다. Electron, preload, desktop shell은 사용하지 않는다.
- `src/api/mock-handler.ts`와 프론트 mock/auth 흐름은 S1의 유지관리 의무다.
- 동적 분석/동적 테스트 화면은 실제 페이지 컴포넌트가 마운트되어 있으며 사이드바에도 정상 노출된다.

## 2. 2026-04-15 기준 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`71` files / `509` tests) |
| 타입체크 | `cd services/frontend && npm run typecheck` | PASS |
| Playwright shell/page sweep | localhost page traversal + screenshots | 진행 중 / 주요 shell·empty surface 재검증 완료 |

## 3. 현재 구조 메모

- 런타임 소스 루트는 `src/`다.
- 모든 페이지는 **page-local `components/` / `hooks/`** 구조를 갖고 있다.
- 현재 큰 정리 축은 **page root decomposition은 거의 끝났고, dense populated surface polish가 남아 있다**.
- 테스트 bootstrap은 `src/test/setup.ts`에 있다.

## 4. 현재 UI / shell 현실

- Navbar: **AEGIS 브랜드 블록 + 대시보드 링크 + 설정/테마/알림/아바타**
- Sidebar: **항상 더 어두운 project rail**
- `ProjectBreadcrumbLayout`: localized breadcrumb (`파일 탐색기`, `품질 게이트`, `승인 큐`, `분석 이력`)
- auth: localStorage mock 기준이며 로그인/회원가입 화면은 **split hero + auth panel** 구조
- empty state: giant neutral panel을 피하고, readiness + next action + workspace purpose를 보여주는 방향으로 정리 중
- `FilesPage`는 VS Code 스타일의 **resizable split workspace**를 가진다.

## 5. 지금 바로 알아야 할 디자인 계약

- AEGIS는 **trusted operations console**로 읽혀야 한다.
- dark sidebar + light main canvas 계층을 유지한다.
- dense surfaces(Files / Vulnerabilities / Static Analysis / Report)는 카드 모자이크가 아니라 작업면으로 보여야 한다.
- visible terminology는 의도적 고유명사가 아니면 한국어 기준으로 통일한다.
- `services/frontend/docs/design/AEGIS-DESIGN.md`와 `wiki/canon/specs/frontend.md`가 최신 디자인 계약의 기준이다.

## 6. 다음 세션 우선순위

1. dense populated surface 추가 polish
   - `DynamicAnalysisPage/components/MonitoringView.tsx`
   - `StaticAnalysisPage/components/LatestAnalysisTab.tsx`
   - `StaticAnalysisPage/components/SourceTreeView.tsx`
   - `FilesPage/hooks/useFilesPage.tsx`
   - `VulnerabilitiesPage/components/VulnerabilitiesToolbar.tsx`
2. Playwright E2E baseline / screenshot baseline 재정비
3. frontend design / QA docs drift 계속 정리
4. `/signup` / `/login` 실제 backend auth 연동 준비

## 7. 한 줄 메모

현재 S1 프론트는 **Electron 없는 웹 전용 SPA**이며, shell/empty-state 방향은 신뢰형 운영 콘솔 톤으로 수렴했고, 다음 단계는 dense populated work surface polish다.
