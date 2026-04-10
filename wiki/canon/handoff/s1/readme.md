---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/README.md"
  - "services/frontend/src/renderer/App.tsx"
  - "services/frontend/src/renderer/pages/DashboardPage/DashboardPage.tsx"
  - "services/frontend/src/renderer/components/Navbar.tsx"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/plans/prd-frontend-structure-docs.md"
  - ".omx/plans/test-spec-frontend-structure-docs.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 `services/frontend/` 기준의 현재 구현 상태, 검증 결과, 라우트/모듈 인벤토리, 그리고 앞으로의 구조 계약을 다음 세션에 넘기기 위한 최신 진입점이다.
> **마지막 검증/갱신: 2026-04-10**

---

## 문서 구조

| 문서 | 내용 |
|------|------|
| **이 파일 (`README.md`)** | 현재 상태, 검증 결과, 라우트/모듈 요약, 운영 메모 |
| [architecture.md](architecture.md) | 실제 파일 구조, 라우트 표, 레이아웃 셸, 구조/스타일 계약 |
| [qa-guide.md](qa-guide.md) | S1-QA 전용 실행 가이드, 현재 검증 상태, 권장 실행 순서 |
| [roadmap.md](roadmap.md) | 후속 작업 / 대기 항목 |
| `session-*.md` | 세션 로그 |
| [`../specs/frontend.md`](../specs/frontend.md) | 현재 구현 기준 프론트 스펙 |
| **`services/frontend/docs/design/AEGIS-DESIGN.md`** | AEGIS 디자인 시스템 증적 — 토큰 목록, 색상 팔레트, 타이포 위계, 컴포넌트 패턴, severity 매핑 |

---

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical handoff/spec 문서를 관리한다.
- S1은 **순수 웹 SPA**다. Electron은 사용하지 않는다.
- 연동 판단은 `wiki/canon/api/*.md` 계약서를 기준으로 한다.
- `services/shared/`는 참조만 하고 직접 소유하지 않는다.
- `src/renderer/api/mock-handler.ts`는 S1의 유지관리 의무다.
- 동적 분석/동적 테스트 화면은 실제 페이지 컴포넌트가 마운트되어 있으며 사이드바에도 정상 노출된다.
- CSS/스타일 작업 시 `architecture.md`와 `services/frontend/docs/design/AEGIS-DESIGN.md`를 먼저 읽을 것.

---

## 2. 2026-04-10 기준 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS |
| 전체 유닛 | `cd services/frontend && npm test` | PASS (`52` files, `395` tests) |
| TS 진단 | `cd services/frontend && npx tsc --noEmit --project tsconfig.json` | PASS |
| Dashboard 회귀 | `cd services/frontend && npx vitest run src/renderer/pages/DashboardPage/DashboardPage.test.tsx` | PASS (`3` tests) |

---

## 3. 현재 코드베이스 인벤토리

| 항목 | 현재 값 |
|------|---------|
| 페이지 surface | `16`개 |
| page-local 기준 사례 | `DashboardPage/` |
| API 모듈 | `14`개 |
| 컨텍스트 | `5`개 |
| 커스텀 훅 | `10`개 |
| styles/ 파일 | `6`개 |
| 유닛 테스트 파일 | `52`개 |
| 총 테스트 수 | `395`개 |
| Playwright spec 파일 | `11`개 |
| 디자인 시스템 증적 | `services/frontend/docs/design/AEGIS-DESIGN.md` |
| lint 설정/스크립트 | 없음 |

---

## 4. 현재 라우트 요약

### 전역

- `/` → `/dashboard` redirect
- `/login` → `LoginPage` (Auth shell)
- `/signup` → `SignupPage` (Auth shell)
- `/dashboard` → `DashboardPage` (Dashboard shell)
- `/settings` → `SettingsPage` (Global shell)
- `/projects` → `/dashboard` redirect

### 프로젝트 스코프

- `/projects/:projectId/overview` → `OverviewPage`
- `/projects/:projectId/static-analysis` → `StaticAnalysisPage`
- `/projects/:projectId/files` → `FilesPage`
- `/projects/:projectId/files/:fileId` → `FileDetailPage`
- `/projects/:projectId/vulnerabilities` → `VulnerabilitiesPage`
- `/projects/:projectId/analysis-history` → `AnalysisHistoryPage`
- `/projects/:projectId/report` → `ReportPage`
- `/projects/:projectId/quality-gate` → `QualityGatePage`
- `/projects/:projectId/approvals` → `ApprovalsPage`
- `/projects/:projectId/dynamic-analysis` → `DynamicAnalysisPage`
- `/projects/:projectId/dynamic-test` → `DynamicTestPage`
- `/projects/:projectId/settings` → `ProjectSettingsPage`

---

## 5. 지금 바로 알아야 할 구조 계약

### 5.1 새 코드 / 실질 리팩터 코드의 절대 규칙

- **page-per-directory**
  - `pages/<Page>/<Page>.tsx`
  - `pages/<Page>/<Page>.css`
  - `pages/<Page>/components`
- **ownership split**
  - page-local → `pages/<Page>/components`
  - feature-local → `features/<feature>/components`
  - app-global → `components/ui`, `components/layout`
- **style layering**
  - palette/tokens → semantic token → component CSS

### 5.2 Migration note

현재 brownfield 코드는 이 계약으로 완전히 수렴하지 않았다.
`DashboardPage`가 첫 기준 사례이며, 나머지 flat pages / mixed components는 후속 리팩터에서 점진적으로 이전한다.

### 5.3 DashboardPage 기준 사례

`DashboardPage`는 **복제 대상이 아니라 reference specimen**이다.
보존해야 하는 것은:
- tone
- density
- emphasis hierarchy
- component spacing의 인간 친화적 읽기 리듬

즉, 이후 페이지는 레이아웃을 그대로 복제하지 않고 이 시각 원칙을 이어받아야 한다.

---

## 6. 현재 UI/셸 현실

### Navbar
- 높이 48px
- 구성: **shield icon brand + Dashboard nav + bell + avatar**
- top search bar 없음

### Sidebar
- 프로젝트 문맥에서만 렌더
- 260px 너비, 라이트 배경, 활성 항목 accent bar
- dynamic 항목 포함 전부 노출

### Legacy StatusBar (not mounted)
- 레거시 컴포넌트는 코드에 남아 있으나 현재 셸에 마운트되지 않는다.
- QA/문서/후속 리팩터는 이를 기본 UI 전제로 삼지 않는다.

---

## 7. 다음 세션 우선순위

1. canonical wiki 문서 5종 정합 유지
2. broad frontend refactor를 page-per-directory / ownership split 규칙에 맞춰 진행
3. remaining brownfield style drift 정리
4. Playwright E2E baseline 재생성
5. `/signup` 실제 인증 플로우 연결

---

## 8. 한 줄 메모

현재 S1 프론트는 `/dashboard -> DashboardPage`로 전환되었고, 앞으로의 구조 규칙은 **DashboardPage 기준 사례 + page-per-directory + explicit ownership split**으로 고정됐다.
