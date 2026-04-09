---
title: "S1 Frontend 현재 구현 스펙"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/frontend.md"
last_verified: "2026-04-09"
service_tags: ["s1"]
decision_tags: []
related_pages: []
---

# S1 Frontend 현재 구현 스펙

> 이 문서는 `services/frontend/`의 **현재 실제 구현 + 검증된 상태**를 기준으로 작성한 S1 프론트 스펙이다.
> **마지막 검증/갱신: 2026-04-09**

---

## 1. 서비스 정의

S1 프론트엔드는 **순수 웹 SPA (React + TypeScript)** 기반의 보안 분석 운영 콘솔이다.
핵심 역할은 다음 세 가지다.

1. 프로젝트/분석 결과/품질 게이트/승인 상태를 **읽기 쉽게 표현**한다.
2. finding, run, report, approval 상태를 **Evidence-first UI**로 보여준다.
3. 백엔드가 계산한 결과를 프론트가 임의 해석하지 않고 **표현 계층**으로 유지한다.

> Electron은 사용하지 않는다. 브라우저에서 직접 접근하는 웹 애플리케이션이다.

---

## 2. 설계 원칙

### 2-1. Evidence-first

화면은 가능한 한 아래 순서를 따른다.

1. 무엇을 보고 있는가
2. 현재 상태가 무엇인가
3. 어떤 결과가 나왔는가
4. 근거가 무엇인가
5. 어떤 run / 모델 / 버전이 이 결과를 만들었는가

### 2-2. Analyst-first

현재 IA는 보안 분석가/플랫폼 운영자가 가장 자주 쓰는 흐름에 맞춰져 있다.

- 프로젝트 선택
- overview 확인
- static analysis drill-down
- files / vulnerabilities / analysis history 확인
- quality gate / approvals / report 검토
- dynamic analysis / dynamic test 실행 확인

### 2-3. Dynamic surface는 현재 실화면 마운트

동적 분석/동적 테스트 관련 페이지는 현재 **실제 페이지 컴포넌트가 마운트**된다.
`/dynamic-analysis`, `/dynamic-test`는 ComingSoonPlaceholder가 아니라 `DynamicAnalysisPage`, `DynamicTestPage`를 렌더링한다.
사이드바에도 정상 노출된다.

---

## 3. 2026-04-09 검증 스냅샷

| 항목 | 명령 | 결과 |
|------|------|------|
| 빌드 | `cd services/frontend && npm run build` | PASS (0 errors) |
| 유닛 테스트 | `cd services/frontend && npm test` | PASS (`51` files / `392` tests) |
| TS 진단 | `npx tsc --noEmit --project services/frontend/tsconfig.json` | PASS (0 errors) |

---

## 4. 현재 스택

| 항목 | 현재 값 |
|------|---------|
| 런타임 | 순수 웹 SPA (브라우저) |
| UI | React / React DOM `^19.x` |
| 라우팅 | `react-router-dom ^7.x` + `BrowserRouter` |
| 빌드 | Vite `^7.x` |
| 테스트 | Vitest `^4.x`, Playwright `^1.x` |
| 코드 하이라이트 | `highlight.js` |
| 마크다운 | `react-markdown` + `remark-gfm` |
| 공유 타입 | `@aegis/shared` |
| 스타일 | CSS tokens (`--cds-*` / `--aegis-*`) + co-located CSS |
| 개발 프록시 | Vite proxy (`/api`, `/health`, `/ws` → localhost:3000) |

---

## 5. 현재 구현 범위

### 5-1. 글로벌 라우트

| 경로 | element | 레이아웃 | 상태 |
|------|---------|---------|------|
| `/` | `/dashboard` redirect | — | 운영 중 |
| `/login` | `LoginPage` | Auth | 운영 중 |
| `/signup` | `SignupPage` | Auth | 운영 중 |
| `/dashboard` | `ProjectsPage` | Global | 운영 중 |
| `/settings` | `SettingsPage` | Global | 운영 중 |
| `/projects` | `/dashboard` redirect | — | 하위 호환 |

### 5-2. 프로젝트 라우트

| 경로 | element | 상태 | 비고 |
|------|---------|------|------|
| `/overview` | `OverviewPage` | 운영 중 | overview dashboard |
| `/static-analysis` | `StaticAnalysisPage` | 운영 중 | 최신 분석/전체 현황, run/finding drill-down |
| `/files` | `FilesPage` | 운영 중 | 파일 탐색 |
| `/files/:fileId` | `FileDetailPage` | 운영 중 | 파일 상세 |
| `/vulnerabilities` | `VulnerabilitiesPage` | 운영 중 | 취약점 목록 |
| `/analysis-history` | `AnalysisHistoryPage` | 운영 중 | run history |
| `/report` | `ReportPage` | 운영 중 | 보고서/감사 추적 |
| `/quality-gate` | `QualityGatePage` | 운영 중 | gate 결과/override |
| `/approvals` | `ApprovalsPage` | 운영 중 | approval queue |
| `/dynamic-analysis` | `DynamicAnalysisPage` | 운영 중 (실화면) | 사이드바 노출 |
| `/dynamic-test` | `DynamicTestPage` | 운영 중 (실화면) | 사이드바 노출 |
| `/settings` | `ProjectSettingsPage` | 운영 중 | GitHub-style 좌측 nav |

### 5-3. 화면 구현 상태

| 화면/영역 | 현재 상태 |
|----------|-----------| 
| Dashboard (Projects) | 구현 완료 |
| Overview | 구현 완료 |
| Static Analysis | 구현 완료 |
| Files + File Detail | 구현 완료 |
| Vulnerabilities | 구현 완료 |
| Analysis History | 구현 완료 |
| Report | 구현 완료 |
| Quality Gate | 구현 완료 |
| Approvals | 구현 완료 |
| Global Settings | 구현 완료 |
| Project Settings | 구현 완료 (GitHub-style sidebar nav) |
| Dynamic Analysis | 실화면 마운트 (2026-04-09 활성화) |
| Dynamic Test | 실화면 마운트 (2026-04-09 활성화) |
| Signup | 구현 완료 (신규, 2026-04-09) |

---

## 6. 구현 자산 인벤토리

### 6-1. 규모

| 항목 | 수량 |
|------|------|
| 페이지 컴포넌트 파일 | 16 |
| 마운트된 실화면 컴포넌트 | 16 |
| placeholder 라우트 | 0 (ComingSoonPlaceholder 전량 제거) |
| API 모듈 | 14 |
| 컨텍스트 | 5 |
| 커스텀 훅 | 9 |
| styles/ 파일 | 6 |
| 유닛 테스트 파일 | 51 |
| 총 테스트 수 | 392 |

### 6-2. API 모듈

`analysis`, `approval`, `auth`, `client`, `core`, `dynamic`, `gate`, `mock-handler`, `notifications`, `pipeline`, `projects`, `report`, `sdk`, `source`

### 6-3. Context

`AuthContext`, `ProjectContext`, `ToastContext`, `AnalysisGuardContext`, `NotificationContext`

### 6-4. Hooks

`useAnalysisWebSocket`, `useBuildTargets`, `useElapsedTimer`, `usePipelineProgress`, `useUploadProgress`, `useStaticDashboard`, `useKeyboardShortcuts`, `useAdapters`, `useDynamicTest`

---

## 7. 현재 제품 동작 규칙

### 7-1. Sidebar 규칙

- 프로젝트 문맥에서는 project sub-navigation을 보여준다.
- 모든 항목 노출 (`comingSoon` 필터 없음). dynamic-analysis, dynamic-test도 정상 표시.
- 260px 너비, GitHub-style 라이트 배경, 파란 accent bar (활성 항목).

### 7-2. Navbar

- 48px 높이, GitHub-style 라이트 헤더.
- 구성: 로고 + 검색바 + 알림 벨 + 아바타.

### 7-3. Notification scope

- `NotificationBridge`가 현재 URL에서 `projectId`를 추출해 `NotificationProvider`에 전달한다.

### 7-4. Breadcrumb

- `ProjectLayout`이 breadcrumb와 `Outlet`을 담당한다.
- 파일 상세는 `files/:fileId` 경로를 `파일 상세`로 표시한다.

### 7-5. Title 정책

모든 16개 페이지: `document.title = "AEGIS — {Page Name}"` 형식 준수.

### 7-6. StatusBar

- 표시 문자열: `"AEGIS v2.1.0 — Embedded Firmware Security Analysis Platform"`
- 모듈 레벨 캐시로 중복 health check 방지.

---

## 8. CSS 아키텍처

### styles/ 디렉터리 (6개 파일)

```text
tokens.css       ← --cds-* / --aegis-* 토큰 단일 정의
reset.css
animations.css
layout.css
primitives.css   ← 구 components.css(1377줄) 분해 후 기본 요소 담당
utilities.css
```

- `global.css`, `code-viewer.css`, `highlight.css`, `components.css` 삭제됨.
- 각 페이지/컴포넌트는 co-located CSS 파일 사용.
- 하드코딩된 hex/rgb 0건.

---

## 9. QA / 테스트 규약

### 현재 신뢰 가능한 자동 검증

1. `npm run build` → PASS
2. `npm test` → 392 PASS (51 files)
3. TS 진단 → 0 errors

### 의미

- 빌드 + 유닛 테스트 + 타입 검사 모두 green.
- E2E Playwright 전체 상태는 별도 QA 실행으로 확인.

---

## 10. known gaps / 후속 작업

1. Dynamic 화면(DynamicAnalysisPage, DynamicTestPage) 실기능 구현 심도 확인
2. Playwright E2E baseline 재생성 (디자인 시스템 교체 + 라우트 변경 반영)
3. `/signup` 페이지 실제 인증 플로우 연결 (현재 stub)
4. 라우트/QA/README/architecture/spec 문서 4종 동기화 유지

---

## 11. 한 줄 결론

현재 S1 프론트는 **순수 웹 SPA로 전환 완료**, 16개 페이지 전부 실화면 마운트, GitHub-style UI, BrowserRouter 기반, 빌드/유닛/TS 검사 모두 green 상태다.
