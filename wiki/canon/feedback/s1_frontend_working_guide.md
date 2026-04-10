---
title: "S1 작업 지침서 — Frontend (React + TypeScript Web SPA)"
page_type: "canonical-feedback"
canonical: true
source_refs:
  - "services/frontend/package.json"
  - "services/frontend/tsconfig.json"
  - "services/frontend/vite.config.ts"
  - "services/frontend/playwright.config.ts"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/layouts/ProjectBreadcrumbLayout.tsx"
  - "services/frontend/src/styles/tokens.css"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/plans/prd-flatten-frontend-src.md"
last_verified: "2026-04-10"
service_tags: ["s1", "platform"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen", "web-only-frontend", "src-flattened"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1 작업 지침서 — Frontend (React + TypeScript Web SPA)

## 1. 문서 목적

이 문서는 S1이 담당하는 Frontend 영역의 책임 범위, 구조 규칙, 협업 규칙, 기술적 제약, 완료 기준을 정의한다.

## 2. S1의 시스템 내 역할

S1은 아래를 책임진다.
- 순수 웹 SPA 구성 (React + TypeScript, Vite)
- BrowserRouter 기반 라우팅
- 백엔드 REST API 및 WebSocket 이벤트 소비
- 분석 결과, 원시 증적, 품질 게이트, 승인 큐 시각화
- LLM 결과 provenance 표시
- 팀 전체가 따를 프론트 구조/스타일 계약 유지

S1은 아래를 책임지지 않는다.
- Electron main/preload 같은 desktop shell 관리
- 분석 로직의 실제 수행
- ECU 통신 처리
- LLM 호출 로직 및 프롬프트 생성
- Findings/Quality Gate의 최종 판정

## 3. 성공 기준

1. 사용자가 특정 finding을 열었을 때 근거를 끝까지 따라갈 수 있다.
2. 운영 화면은 스캔 가능하고 증적/상태/근거가 분리된다.
3. 새 코드와 실질 리팩터 코드는 동일한 구조 규칙을 따른다.
4. Electron/bridge 의존 없이 브라우저에서 직접 실행 가능하다.
5. 런타임 소스 루트는 `src/`로 유지된다.

## 4. 프론트엔드 설계 원칙

### Evidence-first UI
모든 주요 화면은 다음 순서를 따른다.
1. 현재 객체가 무엇인지
2. 어떤 상태인지
3. 어떤 결과가 나왔는지
4. 그 결과의 근거가 무엇인지
5. 누가/무엇이/어떤 버전으로 그 결과를 냈는지

### Reference specimen
`DashboardPage`는 스타일 기준 사례(reference specimen)다.
보존 대상:
- tone
- density
- emphasis hierarchy
- component spacing의 인간 친화적 읽기 리듬

## 5. 아키텍처 가이드

### 5.1 실제 디렉터리 구조 (2026-04-10 현재)

```text
services/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/design/AEGIS-DESIGN.md
├── e2e/
└── src/
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

### 5.2 레이아웃 셸

| 셸 | 구성 | 사용 경로 |
|----|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + full-width content | `/settings` |
| Dashboard | Navbar + edge-to-edge content | `/dashboard` |
| Project | Navbar + Sidebar + content | `/projects/:projectId/*` |

> `StatusBar`는 현재 레이아웃에 마운트되지 않는다.

### 5.3 구조 규칙

#### Page-per-directory
```text
pages/
  <Page>/
    <Page>.tsx
    <Page>.css
    components/
    ...local helpers
```

현재 16개 페이지 구현은 이 규칙으로 정리되어 있다.

#### Ownership split
- page-local → `pages/<Page>/components`
- feature-local → `features/<feature>/components`
- app-global → `components/ui`, `components/layout`

#### Style layering
1. palette / tokens (`src/styles/tokens.css`)
2. semantic token usage (`--cds-*`, `--aegis-*`)
3. component/page CSS

### 5.4 Web-only runtime rule
- Electron main/preload를 새로 도입하지 않는다.
- backend connectivity는 브라우저 기반 HTTP/WS 흐름을 기본으로 한다.
- 런타임 경로는 `src/` 기준으로 유지한다.

## 6. 새 페이지/컴포넌트 추가 체크리스트

1. `pages/<Page>/<Page>.tsx` + `pages/<Page>/<Page>.css` 생성
2. page-local UI는 `pages/<Page>/components`에 둔다
3. `document.title = "AEGIS — {Page Name}"` 설정
4. `App.tsx`에 라우트 추가
5. 토큰 준수: `--cds-*` / `--aegis-*`만 사용
6. 테스트 추가
7. wiki 문서 동기화
8. 웹 전용 런타임 규칙을 깨는 bridge/desktop shell을 도입하지 않는다

## 7. 테스트 전략

### 현재 신뢰 가능한 자동 검증
- `cd services/frontend && npm run build`
- `cd services/frontend && npm test` → `64` files / `426` tests
- `cd services/frontend && npm run typecheck`
- `cd services/frontend && find src -maxdepth 1 -type d | sort`
- `cd /home/kosh/AEGIS && rg -n "from ['\"]electron['\"]|window\.api|contextBridge|BrowserWindow|preload\.js|preload\.ts|dev:main|build:main" services/frontend -g '!services/frontend/dist' -S`

## 8. 완료 기준

- 새 코드/실질 리팩터 코드는 page-per-directory + ownership split 규칙을 따른다.
- 빌드/테스트/타입체크가 green이다.
- wiki 문서와 코드가 서로 모순되지 않는다.
- Electron/bridge 흔적이 재도입되지 않는다.
- 옛 중첩 런타임 경로 전제가 재도입되지 않는다.
