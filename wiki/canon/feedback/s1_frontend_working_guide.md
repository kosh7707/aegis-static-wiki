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
  - "services/frontend/src/index.css"
  - "services/frontend/docs/design/SHADCN-REPLATFORM.md"
last_verified: "2026-04-18"
service_tags: ["s1", "platform"]
decision_tags: ["frontend-structure-contract", "web-only-frontend", "src-flattened", "single-css-entrypoint", "design-doc-hierarchy"]
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
6. 스타일 엔트리포인트는 `src/index.css` 하나로 유지한다.

## 4. 프론트엔드 설계 원칙

### Evidence-first UI
모든 주요 화면은 다음 순서를 따른다.
1. 현재 객체가 무엇인지
2. 어떤 상태인지
3. 어떤 결과가 나왔는지
4. 그 결과의 근거가 무엇인지
5. 누가/무엇이/어떤 버전으로 그 결과를 냈는지

### Active styling contract
- shadcn/ui + Tailwind + Radix-style primitives가 기본 구현 수단이다.
- Aceternity는 필수 탐색 레퍼런스지만, 채택은 opt-in이다.
- 새로운 page/component 전용 CSS는 기본적으로 금지하고, utility composition을 우선한다.
- 전역 스타일은 `src/index.css` 하나에서 관리한다.

### Documentation hierarchy
- 활성 규칙의 source-of-truth는 wiki canon(`specs/frontend`, `handoff/s1/readme`, `handoff/s1/architecture`, 본 working guide)이다.
- `services/frontend/docs/design/SHADCN-REPLATFORM.md`는 repo-local mirror/compatibility 문서다.
- vendor-branded inspiration packs were removed from the repo-local design surface.
- session/work-request/history 문서는 과거 판단과 파일명을 보존할 수 있으며, 활성 구현 기준으로 재해석하지 않는다.

## 5. 아키텍처 가이드

### 5.1 실제 디렉터리 구조 (2026-04-18 현재)

```text
services/frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── docs/design/SHADCN-REPLATFORM.md
├── e2e/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── api/
    ├── components/
    ├── constants/
    ├── contexts/
    ├── hooks/
    ├── layouts/
    ├── pages/
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

### 5.3 구조 규칙

#### Page-per-directory
```text
pages/
  <Page>/
    <Page>.tsx
    components/
    ...local helpers
```

#### Styling ownership
1. global theme/base/animation/markdown/toast entry: `src/index.css`
2. generated primitives: `src/components/ui/*`
3. shared wrappers and page/layout TSX utility classes
4. page-level standalone CSS는 현재 실제 구현 기준 제거되었다

### 5.4 Web-only runtime rule
- Electron main/preload를 새로 도입하지 않는다.
- backend connectivity는 브라우저 기반 HTTP/WS 흐름을 기본으로 한다.
- 런타임 경로는 `src/` 기준으로 유지한다.

## 6. 새 페이지/컴포넌트 추가 체크리스트

1. `pages/<Page>/<Page>.tsx` + `pages/<Page>/components` 생성
2. page-local UI는 `pages/<Page>/components`에 둔다
3. `document.title = "AEGIS — {Page Name}"` 설정
4. `App.tsx`에 라우트 추가
5. 스타일은 utility composition 우선, 전역 rule이 필요하면 `src/index.css`에서만 관리
6. 테스트 추가
7. wiki 문서 동기화
8. 웹 전용 런타임 규칙을 깨는 bridge/desktop shell을 도입하지 않는다

## 7. 테스트 전략

현재 신뢰 가능한 자동 검증:
- `cd services/frontend && npm run build`
- `cd services/frontend && npm test`
- `cd services/frontend && npm run typecheck`

## 8. 완료 기준

- 새 코드/실질 리팩터 코드는 page-per-directory + shared primitive 규칙을 따른다.
- 빌드/테스트/타입체크가 green이다.
- wiki 문서와 코드가 서로 모순되지 않는다.
- Electron/bridge 흔적이 재도입되지 않는다.
- standalone helper CSS 파일이 다시 늘어나지 않는다.
