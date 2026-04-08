---
title: "S1 Frontend Architecture Snapshot"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/architecture.md"
last_verified: "2026-04-08"
service_tags: ["s1"]
decision_tags: []
related_pages: []
---

# S1 Frontend Architecture Snapshot

> `services/frontend/`의 실제 코드 구조와 라우팅/모듈/테스트 자산을 2026-04-08 기준으로 정리한 문서.

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
    ├── main/
    │   ├── index.ts
    │   └── preload.ts
    └── renderer/
        ├── App.tsx
        ├── main.tsx
        ├── api/                14 modules
        ├── components/         58 components total
        ├── constants/
        ├── contexts/           5 providers
        ├── hooks/              9 custom hooks
        ├── layouts/
        ├── pages/              15 page components on disk
        ├── styles/
        ├── types/
        └── utils/              10 utility modules
```

---

## 2. 실제 런타임 라우트 (`src/renderer/App.tsx` 기준)

| 경로 | 실제 element | 상태 | 검증 근거 |
|------|--------------|------|-----------|
| `/` | `Navigate -> /projects` | 운영 중 | `navigation.spec.ts` PASS |
| `/login` | `LoginPage` | 운영 중 | App 라우트 정의 |
| `/projects` | `ProjectsPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/settings` | `SettingsPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/overview` | `OverviewPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/static-analysis` | `StaticAnalysisPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/files` | `FilesPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/files/:fileId` | `FileDetailPage` | 운영 중 | file click flows in E2E suites |
| `/projects/:projectId/vulnerabilities` | `VulnerabilitiesPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/analysis-history` | `AnalysisHistoryPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/report` | `ReportPage` | 운영 중 | full E2E route/snapshot coverage |
| `/projects/:projectId/quality-gate` | `QualityGatePage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/approvals` | `ApprovalsPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/settings` | `ProjectSettingsPage` | 운영 중 | `navigation.spec.ts` PASS |
| `/projects/:projectId/dynamic-analysis` | `ComingSoonPlaceholder` | placeholder | `qa-design-audit.spec.ts` |
| `/projects/:projectId/dynamic-test` | `ComingSoonPlaceholder` | placeholder | `qa-design-audit.spec.ts` |

### 중요한 차이: 파일은 있지만 현재 미마운트인 자산

- `src/renderer/pages/DynamicAnalysisPage.tsx`, `DynamicTestPage.tsx`
- `src/renderer/components/dynamic/*`
- `src/renderer/hooks/useAdapters.ts`, `useDynamicTest.ts`
- `src/renderer/api/dynamic.ts`

`Sidebar.tsx`는 `comingSoon` 항목을 렌더링하지 않으므로 dynamic placeholder 경로는 **라우트는 존재하지만 네비게이션에는 숨겨져 있다.**

---

## 3~6. (기존 섹션 생략 — 변경 없음)

페이지/모듈 인벤토리, 테스트 자산, 빌드/타입/도구 메모, 아키텍처 사실은 이전 버전과 동일.

---

## 7. CSS 디자인 시스템 규칙 (2026-04-08~)

> 디자인 시스템 전면 교체 후 적용되는 규칙. 퇴행 방지 목적.
> 상세 참조: `docs/design/AEGIS-DESIGN.md`

### 7-1. 토큰 사용 규칙

| 프리픽스 | 용도 | 예시 |
|---------|------|------|
| `--cds-*` | Carbon 공통 (surface, text, interactive, button, border, spacing, type) | `--cds-interactive`, `--cds-layer-01` |
| `--aegis-*` | AEGIS 도메인 (severity, status, sidebar, module, source, confidence) | `--aegis-severity-critical`, `--aegis-sidebar-bg` |

- **하드코딩 금지**: CSS/TSX 어디에도 색상 hex, rgba, font-family 직접 작성 금지 (highlight.css 구문 강조 테마 제외)
- **단일 파일**: 모든 토큰은 `src/renderer/styles/tokens.css`에서 정의
- **테마**: `:root` (라이트) + `[data-theme="dark"]` (다크) 구조

### 7-2. 인라인 스타일 규칙

- **원칙: 인라인 금지** — tokenizable 값은 반드시 CSS 클래스로 작성
- **허용 예외**: 런타임 계산값 (`width: ${percent}%`), CSS Variable Injection (`style={{ "--stat-accent": color }}`)
- **유틸리티 우선**: 반복 패턴은 `utilities.css` 클래스 사용 (`.flex-center`, `.flex-between`, `.flex-gap-*`)

### 7-3. 컴포넌트 스타일 규칙

- **BEM 네이밍**: `.block__element--modifier` 컨벤션 유지
- **Flat design**: 카드/정적 요소에 `box-shadow` 금지. depth는 background-color 레이어링
- **Shadow 허용**: floating 요소만 `var(--cds-shadow-dropdown)`
- **Radius**: `var(--cds-radius)` (2px) 기본, 배지/태그만 `var(--cds-radius-pill)` (24px)
- **Severity/Status**: `var(--aegis-severity-*)` 토큰만 사용

### 7-4. 폰트 규칙

| 역할 | 토큰 | 폰트 |
|------|------|------|
| 본문/UI | `--cds-font-sans` | IBM Plex Sans → Pretendard → system |
| 코드/데이터 | `--cds-font-mono` | IBM Plex Mono → Fira Code → monospace |

- Display(42px+): weight 300. Body(14px): letter-spacing 0.16px. Caption(12px): letter-spacing 0.32px.
- Weight는 600(semibold)까지만 사용.

### 7-5. 사이드바

- **항상 다크**: `--aegis-sidebar-*` 테마 불변 토큰 사용
- `--cds-background` 사용 **금지** (라이트 테마에서 흰색이 됨)

---

## 8. 다음 변경 시 체크리스트

- 라우트를 바꾸면 `App.tsx`, `Sidebar.tsx`, `ProjectLayout.tsx`, `wiki/canon/specs/frontend.md`, `wiki/canon/handoff/s1/readme.md`, `wiki/canon/handoff/s1/qa-guide.md`를 같이 갱신할 것.
- dynamic 화면을 다시 노출할 때는 **placeholder 제거 + 사이드바 공개 + QA baseline 재생성**을 한 세트로 처리할 것.
- approval CTA 구조를 바꾸면 `interactions.spec.ts`, `qa-design-audit.spec.ts`, `qa-expert-review.spec.ts`를 함께 확인할 것.
- **디자인 토큰을 변경하면 `docs/design/AEGIS-DESIGN.md`를 반드시 동기화할 것.**
- **새 CSS 파일 추가 시 `tokens.css` 토큰만 참조하고, 하드코딩 색상/폰트 금지.**
