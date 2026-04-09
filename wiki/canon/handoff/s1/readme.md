---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s1-handoff/README.md"
last_verified: "2026-04-09"
service_tags: ["s1"]
decision_tags: []
related_pages: []
---

# S1 Frontend 개발 인수인계서

> **먼저 `docs/AEGIS.md`를 읽을 것.**
> 이 문서는 `services/frontend/` 기준의 현재 구현 상태, 검증 결과, 라우트/모듈 인벤토리를 다음 세션에 넘기기 위한 최신 진입점이다.
> **마지막 검증/갱신: 2026-04-09**

---

## 문서 구조

| 문서 | 내용 |
|------|------|
| **이 파일 (`README.md`)** | 현재 상태, 검증 결과, 라우트/모듈 요약, 운영 메모 |
| [architecture.md](architecture.md) | 실제 파일 구조, 라우트 표, 레이아웃 3종, CSS 아키텍처, **CSS 디자인 시스템 규칙 (섹션 6)** |
| [qa-guide.md](qa-guide.md) | S1-QA 전용 실행 가이드, 현재 검증 상태, 권장 실행 순서 |
| [roadmap.md](roadmap.md) | 후속 작업 / 대기 항목 |
| `session-*.md` | 세션 로그 |
| [`../specs/frontend.md`](../specs/frontend.md) | 현재 구현 기준 프론트 스펙 |
| **`docs/design/AEGIS-DESIGN.md`** | **AEGIS 디자인 시스템 증적** — 토큰 목록, 색상 팔레트, 타이포 위계, 컴포넌트 패턴, severity 매핑. CSS 변경 시 반드시 참조 및 동기화 |

---

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 handoff/spec 문서를 관리한다.
- S1은 **순수 웹 SPA**다. Electron은 사용하지 않는다.
- 연동 판단은 `wiki/canon/api/*.md` 계약서를 기준으로 한다.
- `services/shared/`는 참조만 하고 직접 소유하지 않는다.
- **`src/renderer/api/mock-handler.ts` (dev-mode mock)는 S1의 유지관리 의무.** QA가 백엔드 없이 작업할 수 있는 완전한 모크 환경을 제공해야 하므로, API 계약 변경 시 `e2e/helpers/api-mocker.ts`뿐 아니라 `mock-handler.ts`도 반드시 동기화할 것.
- 동적 분석/동적 테스트 화면은 **2026-04-09부터 실제 페이지 컴포넌트가 마운트**된다. 사이드바에도 정상 노출.
- QA lane은 별도이며, 상세 절차는 [qa-guide.md](qa-guide.md)를 따른다.
- **CSS/스타일 작업 시**: `architecture.md` 섹션 6 "CSS 디자인 시스템 규칙"과 `docs/design/AEGIS-DESIGN.md`를 반드시 먼저 읽을 것. 토큰 하드코딩 금지, 인라인 스타일 금지 등 규칙이 명시되어 있다.

---

## 2. 2026-04-09 기준 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 의존성 설치 | `npm ci` | PASS |
| 빌드 | `cd services/frontend && npm run build` | PASS (0 errors) |
| 유닛 테스트 | `cd services/frontend && npm test` | PASS (`51` files, `392` tests) |
| TS 진단 | `npx tsc --noEmit --project services/frontend/tsconfig.json` | PASS (`0` errors, `0` warnings) |

---

## 3. 현재 코드베이스 인벤토리

| 항목 | 현재 값 |
|------|---------|
| 페이지 컴포넌트 파일 | `16`개 |
| 마운트된 실화면 컴포넌트 | `16`개 (모든 라우트 실화면) |
| placeholder 라우트 | `0`개 (ComingSoonPlaceholder 전량 제거) |
| API 모듈 | `14`개 |
| 컨텍스트 | `5`개 |
| 커스텀 훅 | `9`개 |
| styles/ 파일 | `6`개 (tokens, reset, animations, layout, primitives, utilities) |
| 유닛 테스트 파일 | `51`개 |
| 총 테스트 수 | `392`개 |
| Playwright spec 파일 | `11`개 |
| **디자인 시스템** | **IBM Carbon `--cds-*` + AEGIS `--aegis-*` 토큰 (`tokens.css` 단일 관리)** |
| lint 설정/스크립트 | **없음** |

---

## 4. 현재 라우트 요약

### 전역

- `/` → `/dashboard` redirect
- `/login` → `LoginPage` (Auth layout)
- `/signup` → `SignupPage` (Auth layout) ← **신규 (2026-04-09)**
- `/dashboard` → `ProjectsPage` (Global layout)
- `/settings` → `SettingsPage` (Global layout)
- `/projects` → `/dashboard` redirect (하위 호환성)

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
- `/projects/:projectId/dynamic-analysis` → `DynamicAnalysisPage` ← **실화면 (2026-04-09)**
- `/projects/:projectId/dynamic-test` → `DynamicTestPage` ← **실화면 (2026-04-09)**
- `/projects/:projectId/settings` → `ProjectSettingsPage`

### 주요 변경 사항 (2026-04-09)

- `HashRouter` → `BrowserRouter`. URL에 `#` 없음.
- `/projects` → `/dashboard`. 프로젝트 목록 메인 경로 변경.
- `DynamicAnalysisPage`, `DynamicTestPage` 실화면 마운트. `ComingSoonPlaceholder` 제거.
- `Sidebar.tsx` `comingSoon` 필터 제거. 모든 항목 사이드바 노출.
- `SignupPage` 신규 추가 (`/signup`).

---

## 5. 핵심 모듈 요약

### API (`src/renderer/api`)

`analysis`, `approval`, `auth`, `client`, `core`, `dynamic`, `gate`, `mock-handler`, `notifications`, `pipeline`, `projects`, `report`, `sdk`, `source`

### Context (`src/renderer/contexts`)

`AuthContext`, `ProjectContext`, `ToastContext`, `AnalysisGuardContext`, `NotificationContext`

### Hooks (`src/renderer/hooks`)

`useAnalysisWebSocket`, `useBuildTargets`, `useElapsedTimer`, `usePipelineProgress`, `useUploadProgress`, `useStaticDashboard`, `useKeyboardShortcuts`, `useAdapters`, `useDynamicTest`

---

## 6. CSS 아키텍처 요약

### styles/ 디렉터리 (6개 파일)

```text
tokens.css       ← --cds-* / --aegis-* 토큰 단일 정의
reset.css
animations.css
layout.css
primitives.css   ← 구 components.css(1377줄) 분해 산출물
utilities.css
```

삭제됨: `global.css`, `code-viewer.css`, `highlight.css`, `components.css`

각 페이지/컴포넌트는 co-located CSS 파일 사용 (`LoginPage.tsx` + `LoginPage.css` 같은 폴더).

---

## 7. UI 디자인 방향 (2026-04-09~)

### 전체 방향

GitHub-inspired 라이트 테마. v6 레이아웃 리디자인 완료.

### Navbar

- 높이: 48px
- `--cds-background` 토큰 배경
- 구성: 로고 + 검색바(키보드 단축키 `/`) + 알림 벨 + 아바타

### Sidebar

- 너비: 260px
- GitHub-style 라이트 배경
- 활성 항목: rounded 상태 + 파란 accent bar (3px)
- 모든 항목 노출 (comingSoon 필터 없음)

### ProjectSettings

- GitHub-style 좌측 sidebar 내비게이션 (General, SDK Management, Danger Zone 등)

### StatusBar

- `"AEGIS v2.1.0 — Embedded Firmware Security Analysis Platform"`
- 모듈 레벨 캐시로 중복 health check 방지

---

## 8. 지금 바로 알아야 할 포인트

- **Electron 없음**: 순수 웹 SPA. IPC, preload, contextBridge 등 Electron 개념 무관.
- **BrowserRouter**: URL에 `#` 없음. 서버/프록시가 SPA fallback을 처리해야 함.
- **`/dashboard`**: 프로젝트 목록의 새 경로. `/projects` 접근 시 redirect.
- **Dynamic 화면 활성화**: `DynamicAnalysisPage`, `DynamicTestPage` 실화면 마운트, 사이드바 노출.
- **16개 페이지 전부 실화면**: placeholder 라우트 0.
- **신뢰 가능한 자동 검증**: `npm run build` + `npm test` (392 PASS) + TS 진단 (0 errors).
- **디자인 시스템**: IBM Carbon 기반 전면 교체 완료 (2026-04-08). CSS 작업 시 `architecture.md` 섹션 6과 `docs/design/AEGIS-DESIGN.md` 먼저 참조.

---

## 9. 다음 세션 우선순위

1. Playwright E2E baseline 재생성 — 디자인 시스템 교체 + 라우트 변경으로 인한 snapshot drift 분류 및 재생성
2. Dynamic 화면 실기능 구현 심도 확인 — `DynamicAnalysisPage`, `DynamicTestPage` 기능 완성도 검토
3. `/signup` 실제 인증 플로우 연결 — 현재 stub 상태
4. S2 계약 갱신 대응 — 프론트엔드 전체 깊이 감사

> 세션 19 (2026-04-09): CSS 구조 분리 (components.css 모놀리스 → primitives.css + co-located), HashRouter → BrowserRouter, /projects → /dashboard, Navbar 신규, Sidebar 재설계(GitHub-style 라이트, comingSoon 제거), Auth/Global/Project 레이아웃 3종, SignupPage 신규, 16페이지 title 정책, StatusBar health check 캐시, Vite proxy, v6 레이아웃 전체 리디자인, ProjectSettings GitHub-style sidebar nav, 토큰 규정 준수 완료. Build 0 errors, 392 tests pass.
