---
title: "S1 Frontend Architecture Snapshot"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/architecture.md"
  - "services/frontend/src/renderer/App.tsx"
  - "services/frontend/src/renderer/components/Navbar.tsx"
  - "services/frontend/src/renderer/pages/DashboardPage/DashboardPage.tsx"
  - "services/frontend/src/renderer/styles/layout.css"
  - "services/frontend/src/renderer/styles/tokens.css"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/plans/prd-frontend-structure-docs.md"
last_verified: "2026-04-10"
service_tags: ["s1"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/handoff/s1/qa-guide.md"]
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 2026-04-10 기준으로 정리한 문서.

---

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
    └── renderer/
        ├── App.tsx
        ├── main.tsx
        ├── api/                14 modules
        ├── components/         brownfield mixed root + ui/static/dynamic/finding
        ├── constants/
        ├── contexts/           5 providers
        ├── hooks/              10 custom hooks
        ├── layouts/
        ├── pages/
        │   ├── DashboardPage/  ← page-per-directory 기준 사례
        │   └── *.tsx / *.css   ← legacy flat pages (migration 대상)
        ├── styles/             6 files
        ├── types/
        └── utils/              utility modules
```

> `src/main/` (Electron main process) 디렉터리는 존재하지 않는다. S1은 순수 웹 SPA다.

---

## 2. 실제 런타임 라우트 (`src/renderer/App.tsx` 기준)

| 경로 | 실제 element | 상태 | 비고 |
|------|--------------|------|------|
| `/` | `Navigate -> /dashboard` | 운영 중 | 기본 redirect |
| `/login` | `LoginPage` | 운영 중 | Auth shell |
| `/signup` | `SignupPage` | 운영 중 | Auth shell |
| `/dashboard` | `DashboardPage` | 운영 중 | Dashboard shell |
| `/settings` | `SettingsPage` | 운영 중 | Global shell |
| `/projects` | `Navigate -> /dashboard` | redirect | 하위 호환성 |
| `/projects/:projectId/overview` | `OverviewPage` | 운영 중 | Project shell |
| `/projects/:projectId/static-analysis` | `StaticAnalysisPage` | 운영 중 | Project shell |
| `/projects/:projectId/files` | `FilesPage` | 운영 중 | Project shell |
| `/projects/:projectId/files/:fileId` | `FileDetailPage` | 운영 중 | Project shell |
| `/projects/:projectId/vulnerabilities` | `VulnerabilitiesPage` | 운영 중 | Project shell |
| `/projects/:projectId/analysis-history` | `AnalysisHistoryPage` | 운영 중 | Project shell |
| `/projects/:projectId/report` | `ReportPage` | 운영 중 | Project shell |
| `/projects/:projectId/quality-gate` | `QualityGatePage` | 운영 중 | Project shell |
| `/projects/:projectId/approvals` | `ApprovalsPage` | 운영 중 | Project shell |
| `/projects/:projectId/dynamic-analysis` | `DynamicAnalysisPage` | 운영 중 | Project shell |
| `/projects/:projectId/dynamic-test` | `DynamicTestPage` | 운영 중 | Project shell |
| `/projects/:projectId/settings` | `ProjectSettingsPage` | 운영 중 | Project shell |

---

## 3. 레이아웃 셸

| 셸 | 구성 | 사용 경로 |
|----|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + full-width content | `/settings` |
| Dashboard | Navbar + edge-to-edge content | `/dashboard` |
| Project | Navbar + Sidebar + content | `/projects/:projectId/*` |

> `StatusBar`는 현재 셸 어디에도 마운트되지 않는다.

---

## 4. 주요 컴포넌트 특성

### Navbar
- 높이: 48px
- GitHub-style 라이트 헤더 (`--cds-background`)
- 구성: **shield icon brand + Dashboard nav + bell + avatar**
- legacy search bar는 현재 존재하지 않는다.

### Sidebar
- 프로젝트 shell에서만 렌더
- 260px 너비
- 활성 항목: accent bar + rounded active state
- 모든 항목 노출 (`comingSoon` 필터 없음)

### DashboardPage
- `pages/DashboardPage/`에 위치한 현재 기준 사례
- page-local components:
  - `ProjectExplorer`
  - `NeedsAttentionSection`
  - `RecentActivitySection`
  - `CreateProjectForm`
- page-local model helper: `dashboardModel.ts`

### Legacy StatusBar (not mounted)
- 레거시 컴포넌트로 코드에만 남아 있음
- 현재 운영 셸의 일부는 아님

---

## 5. CSS / 디자인 시스템 구조

### styles/ 디렉터리

```text
src/renderer/styles/
├── tokens.css
├── reset.css
├── animations.css
├── layout.css
├── primitives.css
└── utilities.css
```

### 디자인 시스템 증적

- 현재 로컬 디자인 증적 경로: `services/frontend/docs/design/AEGIS-DESIGN.md`
- wiki/구조 문서는 이 경로를 기준으로 현재 디자인 시스템을 설명한다.

### Co-located CSS 패턴

새 코드 / 실질 리팩터 코드는 다음 패턴을 따른다.

```text
pages/
  DashboardPage/
    DashboardPage.tsx
    DashboardPage.css
    components/
      ProjectExplorer.tsx
      NeedsAttentionSection.tsx
      RecentActivitySection.tsx
```

기존 flat page 파일들은 migration 대상이다.

---

## 6. 구조 / ownership 계약 (새 코드 / 실질 리팩터 코드에 대한 절대 규칙)

### 6-1. Page-per-directory

모든 새 페이지와 실질 리팩터 페이지는:
- `pages/<Page>/<Page>.tsx`
- `pages/<Page>/<Page>.css`
- `pages/<Page>/components`
구조를 따른다.

### 6-2. Ownership split

- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

현재 `components/` 루트는 혼합 상태이므로, brownfield 리팩터 동안 점진적으로 이전한다.

### 6-3. Style layering

구성 원칙:
1. palette / tokens (`styles/tokens.css`)
2. semantic token usage (`--cds-*`, `--aegis-*`)
3. component/page CSS

TSX는 구조/조립을 담당하고, tokenizable style은 CSS에서 표현한다.

---

## 7. DashboardPage reference specimen 규칙

`DashboardPage`는 **레이아웃 복제 대상**이 아니다.
이 페이지에서 추출해 다른 화면에 유지해야 하는 것은 다음이다.

- tone
- density
- emphasis hierarchy
- component spacing의 읽기 편한 리듬

즉, 페이지별 레이아웃은 달라도 **조용한 표면 계층 / 빠른 스캔 / 적절한 강조 / 편안한 간격**은 유지해야 한다.

---

## 8. Migration note

이 문서의 구조 규칙은 **앞으로의 절대 규칙**이지만, 현재 brownfield 전체가 이미 이를 만족한다고 가정하지 않는다.
현재 상태는 다음과 같이 이해해야 한다.

- `DashboardPage` → 기준 사례
- 나머지 flat pages → migration 대상
- mixed `components/` → ownership 정리 대상
- 일부 brownfield CSS drift → 후속 스타일 정합 대상

---

## 9. 다음 변경 시 체크리스트

- 라우트를 바꾸면 `App.tsx`, `Sidebar.tsx`, `ProjectLayout.tsx`, core docs 3종, `qa-guide.md`, 이 문서를 같이 갱신할 것
- `DashboardPage` 구조/스타일을 바꾸면 reference specimen 설명도 같이 갱신할 것
- 디자인 토큰/디자인 시스템 증적 경로를 바꾸면 `services/frontend/docs/design/AEGIS-DESIGN.md` 참조도 같이 정리할 것
- 새 CSS는 토큰 기반이어야 하며, 구조 규칙을 위반하는 새 flat page를 만들지 말 것
