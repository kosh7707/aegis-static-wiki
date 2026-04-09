---
title: "S1 Frontend Architecture Snapshot"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/architecture.md"
last_verified: "2026-04-09"
service_tags: ["s1"]
decision_tags: []
related_pages: []
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 2026-04-09 기준으로 정리한 문서.

---

## 1. 최상위 구조

```text
services/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/design/AEGIS-DESIGN.md    ← 디자인 시스템 증적
├── e2e/
│   ├── fixtures/
│   ├── helpers/
│   ├── specs/
│   ├── __screenshots__/
│   ├── qa-captures/
│   └── test-results/
└── src/
    └── renderer/
        ├── App.tsx
        ├── main.tsx
        ├── api/                14 modules
        ├── components/         root 컴포넌트 + dynamic/finding/static/ui 서브폴더
        ├── constants/
        ├── contexts/           5 providers
        ├── hooks/              9 custom hooks
        ├── layouts/
        ├── pages/              16 page components on disk (co-located CSS 포함)
        ├── styles/             6 files
        ├── types/
        └── utils/              10 utility modules
```

> **Note**: `src/main/` (Electron main process) 디렉터리는 더 이상 존재하지 않는다. S1은 순수 웹 SPA다.

---

## 2. 실제 런타임 라우트 (`src/renderer/App.tsx` 기준)

| 경로 | 실제 element | 상태 | 비고 |
|------|--------------|------|------|
| `/` | `Navigate -> /dashboard` | 운영 중 | 기본 redirect |
| `/login` | `LoginPage` | 운영 중 | Auth layout (navbar 없음) |
| `/signup` | `SignupPage` | 운영 중 | Auth layout (navbar 없음) |
| `/dashboard` | `ProjectsPage` | 운영 중 | Global layout |
| `/settings` | `SettingsPage` | 운영 중 | Global layout |
| `/projects` | `Navigate -> /dashboard` | redirect | 하위 호환성 |
| `/projects/:projectId/overview` | `OverviewPage` | 운영 중 | Project layout |
| `/projects/:projectId/static-analysis` | `StaticAnalysisPage` | 운영 중 | Project layout |
| `/projects/:projectId/files` | `FilesPage` | 운영 중 | Project layout |
| `/projects/:projectId/files/:fileId` | `FileDetailPage` | 운영 중 | Project layout |
| `/projects/:projectId/vulnerabilities` | `VulnerabilitiesPage` | 운영 중 | Project layout |
| `/projects/:projectId/analysis-history` | `AnalysisHistoryPage` | 운영 중 | Project layout |
| `/projects/:projectId/report` | `ReportPage` | 운영 중 | Project layout |
| `/projects/:projectId/quality-gate` | `QualityGatePage` | 운영 중 | Project layout |
| `/projects/:projectId/approvals` | `ApprovalsPage` | 운영 중 | Project layout |
| `/projects/:projectId/dynamic-analysis` | `DynamicAnalysisPage` | 운영 중 (실화면) | Project layout |
| `/projects/:projectId/dynamic-test` | `DynamicTestPage` | 운영 중 (실화면) | Project layout |
| `/projects/:projectId/settings` | `ProjectSettingsPage` | 운영 중 | Project layout |

### Dynamic 라우트 상태 변경 (2026-04-09)

- `DynamicAnalysisPage`, `DynamicTestPage`는 이제 **실제 페이지 컴포넌트가 마운트**된다. `ComingSoonPlaceholder` 제거됨.
- `Sidebar.tsx`에서 `comingSoon` 필터 제거. dynamic-analysis, dynamic-test 항목이 **사이드바에 정상 노출**된다.

---

## 3. 레이아웃 변형 3종

| 레이아웃 | 구성 | 사용 경로 |
|----------|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + Main + StatusBar | `/dashboard`, `/settings` |
| Project | Navbar + Sidebar + Main + StatusBar | `/projects/:projectId/*` |

---

## 4. 주요 컴포넌트 특성

### Navbar
- 높이: 48px
- GitHub-style 라이트 헤더 (`--cds-background` 토큰)
- 구성: 로고 영역 + 검색바(키보드 단축키 `/`) + 알림 벨 + 아바타

### Sidebar
- 너비: 260px
- GitHub-style 라이트 배경
- 활성 항목: rounded 상태 + 파란 accent bar (3px)
- 모든 항목 노출 (`comingSoon` 필터 없음)

### ProjectSettings
- GitHub-style 좌측 sidebar 내비게이션
- 섹션: General, SDK Management, (추가 섹션), Danger Zone

### StatusBar
- 표시 문자열: `"AEGIS v2.1.0 — Embedded Firmware Security Analysis Platform"`
- 모듈 레벨 캐시로 페이지 이동 시 중복 health check 방지

---

## 5. CSS 아키텍처 (2026-04-09~)

### styles/ 디렉터리 (6개 파일)

```text
src/renderer/styles/
├── tokens.css       ← --cds-* / --aegis-* 토큰 단일 정의
├── reset.css
├── animations.css
├── layout.css
├── primitives.css   ← 기본 요소 스타일 (구 components.css 분리)
└── utilities.css
```

**삭제된 파일**: `global.css`, `code-viewer.css`, `highlight.css`, `components.css` (1377줄 모놀리스)

### Co-located CSS 패턴

각 페이지/컴포넌트는 자신과 같은 디렉터리에 CSS 파일을 둔다.

```text
pages/
├── LoginPage.tsx
├── LoginPage.css      ← co-located
├── ProjectsPage.tsx
├── ProjectsPage.css   ← co-located
...
```

---

## 6. CSS 디자인 시스템 규칙 (2026-04-09~)

> 디자인 시스템 전면 교체 후 적용되는 규칙. 퇴행 방지 목적.
> 상세 참조: `docs/design/AEGIS-DESIGN.md`

### 6-1. 토큰 사용 규칙

| 프리픽스 | 용도 | 예시 |
|---------|------|------|
| `--cds-*` | Carbon 공통 (surface, text, interactive, button, border, spacing, type) | `--cds-interactive`, `--cds-layer-01` |
| `--aegis-*` | AEGIS 도메인 (severity, status, sidebar, module, source, confidence) | `--aegis-severity-critical` |

- **하드코딩 금지**: CSS/TSX 어디에도 색상 hex, rgba, font-family 직접 작성 금지 (tokens.css 자체 제외)
- **단일 파일**: 모든 토큰은 `src/renderer/styles/tokens.css`에서 정의
- **테마**: `:root` (라이트) + `[data-theme="dark"]` (다크) 구조
- **준수 상태**: 토큰 규정 위반 0건 (2026-04-09 기준)

### 6-2. 인라인 스타일 규칙

- **원칙: 인라인 금지** — tokenizable 값은 반드시 CSS 클래스로 작성
- **허용 예외**: 런타임 계산값 (`width: ${percent}%`), CSS Variable Injection (`style={{ "--stat-accent": color }}`)
- **유틸리티 우선**: 반복 패턴은 `utilities.css` 클래스 사용

### 6-3. 컴포넌트 스타일 규칙

- **BEM 네이밍**: `.block__element--modifier` 컨벤션 유지
- **Flat design**: 카드/정적 요소에 `box-shadow` 금지. depth는 background-color 레이어링
- **Shadow 허용**: floating 요소만 `var(--cds-shadow-dropdown)`
- **Radius**: `var(--cds-radius)` (2px) 기본, 배지/태그만 `var(--cds-radius-pill)` (24px)
- **Severity/Status**: `var(--aegis-severity-*)` 토큰만 사용

### 6-4. 폰트 규칙

| 역할 | 토큰 | 폰트 |
|------|------|------|
| 본문/UI | `--cds-font-sans` | IBM Plex Sans → Pretendard → system |
| 코드/데이터 | `--cds-font-mono` | IBM Plex Mono → Fira Code → monospace |

- Display(42px+): weight 300. Body(14px): letter-spacing 0.16px. Caption(12px): letter-spacing 0.32px.
- Weight는 600(semibold)까지만 사용.

### 6-5. 사이드바 스타일

- **라이트 배경**: GitHub-style, `--cds-background` 또는 `--cds-layer-01` 토큰 사용
- 활성 상태: rounded + 파란 accent bar
- 이전 규칙("항상 다크") 폐기됨 (2026-04-09)

---

## 7. Title 정책

모든 16개 페이지는 `document.title = "AEGIS — {Page Name}"` 형식을 준수한다.

---

## 8. Vite 개발 서버 프록시

```ts
server: {
  proxy: {
    "/api":    "http://localhost:3000",
    "/health": "http://localhost:3000",
    "/ws":     { target: "ws://localhost:3000", ws: true },
  },
}
```

개발 모드에서 상대 URL + Vite 프록시 사용. Electron IPC 불필요.

---

## 9. 다음 변경 시 체크리스트

- 라우트를 바꾸면 `App.tsx`, `Sidebar.tsx`, `ProjectLayout.tsx`, `wiki/canon/specs/frontend.md`, `wiki/canon/handoff/s1/readme.md`, `wiki/canon/handoff/s1/qa-guide.md`를 같이 갱신할 것.
- dynamic 화면을 수정할 때는 **사이드바 노출 상태 + QA baseline** 함께 확인할 것.
- approval CTA 구조를 바꾸면 `interactions.spec.ts`, `qa-design-audit.spec.ts`, `qa-expert-review.spec.ts`를 함께 확인할 것.
- **디자인 토큰을 변경하면 `docs/design/AEGIS-DESIGN.md`를 반드시 동기화할 것.**
- **새 CSS 파일 추가 시 `tokens.css` 토큰만 참조하고, 하드코딩 색상/폰트 금지.**
- **새 페이지 추가 시 co-located CSS 파일 생성 + `document.title` 설정 필수.**
