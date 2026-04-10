---
title: "S1 작업 지침서 — Frontend (React + TypeScript Web SPA)"
page_type: "canonical-feedback"
canonical: true
source_refs:
  - "docs/외부피드백/S1_frontend_working_guide.md"
  - "services/frontend/src/renderer/App.tsx"
  - "services/frontend/src/renderer/pages/DashboardPage/DashboardPage.tsx"
  - "services/frontend/src/renderer/styles/tokens.css"
  - "services/frontend/docs/design/AEGIS-DESIGN.md"
  - ".omx/specs/deep-interview-frontend-refactor-structure-docs.md"
  - ".omx/plans/prd-frontend-structure-docs.md"
last_verified: "2026-04-10"
service_tags: ["s1", "platform"]
decision_tags: ["frontend-structure-contract", "dashboard-reference-specimen"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1 작업 지침서 — Frontend (React + TypeScript Web SPA)

## 1. 문서 목적

이 문서는 S1이 담당하는 **Frontend 영역**의 책임 범위, 반드시 구현해야 할 구조 규칙, 협업 규칙, 기술적 제약, 완료 기준을 명확히 정의하기 위한 작업 지침서다.

이 프론트엔드는 단순 대시보드가 아니라, **정적 분석 / 동적 분석 / 동적 테스트 / LLM 분석 결과를 증적 중심으로 탐색하고, triage 하고, 승인 흐름을 처리하는 운영 콘솔**이다.

핵심 원칙은 다음 한 문장으로 요약된다.

> **프론트는 "판단을 만들어내는 곳"이 아니라, 백엔드가 관리하는 Findings / Evidence / Quality Gate / Approval 상태를 정확하고 재검증 가능하게 보여주는 곳이다.**

---

## 2. S1의 시스템 내 역할

S1은 아래를 책임진다.

- 순수 웹 SPA 구성 (React + TypeScript, Vite)
- BrowserRouter 기반 라우팅 (HashRouter 아님)
- 백엔드 REST API 및 WebSocket 이벤트 소비
- 분석 결과, 원시 증적, 품질 게이트, 승인 큐 시각화
- LLM 결과에 대한 provenance 표시
- 팀 전체가 따를 프론트 구조/스타일 계약 유지

S1은 아래를 책임지지 않는다.

- 분석 로직의 실제 수행
- ECU 통신 처리
- LLM 호출 로직 및 프롬프트 생성
- Findings의 최종 판정 규칙
- Quality Gate 평가 로직의 실제 결정
- 승인 정책의 결정 자체

즉, **프론트는 표현 계층**이며 시스템의 상태 진실원은 S2 백엔드다.

---

## 3. 성공 기준

S1이 잘 만들어졌다고 볼 수 있는 기준은 아래와 같다.

1. 사용자가 특정 finding을 열었을 때 **왜 이 finding이 생겼는지 끝까지 따라갈 수 있어야 한다.**
2. LLM 출력은 보조 정보로 분리되어야 하며 사실 그 자체처럼 보이지 않아야 한다.
3. 운영 화면은 스캔 가능하고, 증적/상태/근거가 분리되어야 한다.
4. shared 모델 변경 시 프론트가 조용히 깨지지 않고 **명시적 계약 위반으로 드러나야 한다.**
5. 새 코드와 실질 리팩터 코드는 **동일한 구조 규칙**을 따라야 한다.

---

## 4. 프론트엔드 설계 원칙

### 4.1 Evidence-first UI

모든 주요 화면은 다음 순서를 따른다.

1. 현재 객체가 무엇인지
2. 어떤 상태인지
3. 어떤 결과가 나왔는지
4. 그 결과의 근거가 무엇인지
5. 누가 / 무엇이 / 어떤 버전으로 그 결과를 냈는지

### 4.2 실시간 화면은 "스트림 뷰어"이지 "채팅창"이 아니다

동적 분석 / 동적 테스트 화면은 채팅형 UI가 아니라 운영 콘솔이어야 한다.

반드시 보여야 하는 것:
- run 상태
- 수신 이벤트 수 / 드롭 수 / backlog
- rule match 수
- anomaly 수
- approval required 이벤트
- adapter / simulator 연결 상태
- raw event feed와 qualified event feed의 차이
- stop / pause / kill switch 상태

### 4.3 Reference specimen, not screenshot law

`DashboardPage`는 **스타일 기준 사례(reference specimen)** 다.
이 페이지를 이후 화면들이 그대로 복제해야 하는 것은 아니다.
보존할 대상은 다음 네 가지다.

- tone
- density
- emphasis hierarchy
- component spacing의 인간 친화적 읽기 리듬

즉, 레이아웃을 픽셀 복제하는 대신 **읽기 편한 간격과 조용한 정보 위계**를 추출해야 한다.

---

## 5. 아키텍처 가이드 (S1 내부)

## 5.1 실제 디렉터리 구조 (2026-04-10 현재)

```text
src/renderer/
├── App.tsx
├── main.tsx
├── api/             ← 14개 모듈
├── components/      ← brownfield 혼합 계층 (global + legacy mixed)
├── constants/
├── contexts/        ← 5개 provider
├── hooks/           ← 10개 custom hooks
├── layouts/         ← ProjectLayout
├── pages/
│   ├── DashboardPage/   ← 기준 사례 (page-per-directory)
│   └── *.tsx / *.css    ← legacy flat pages (migration 대상)
├── styles/          ← 6개 파일 (tokens, reset, animations, layout, primitives, utilities)
├── types/
└── utils/
```

## 5.2 레이아웃 셸

| 셸 | 구성 | 사용 경로 |
|----|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + full-width content | `/settings` |
| Dashboard | Navbar + edge-to-edge content | `/dashboard` |
| Project | Navbar + Sidebar + content | `/projects/:projectId/*` |

> `StatusBar`는 현재 레이아웃에 마운트되지 않는다.

## 5.3 구조 규칙 (새 코드 / 실질 리팩터 코드에 대한 절대 규칙)

### Page-per-directory

새로 만들거나 실질적으로 리팩터하는 페이지는 아래 구조를 따른다.

```text
pages/
  <Page>/
    <Page>.tsx
    <Page>.css
    components/
    ...local helpers
```

### Ownership split

- **page-local** → `pages/<Page>/components`
- **feature-local** → `features/<feature>/components`
- **app-global** → `components/ui`, `components/layout`

현재 brownfield `components/`는 혼합 상태이므로, 기존 코드는 점진적으로 이 규칙으로 이전한다.

### Migration note

문서가 규칙을 정의한다고 해서 현재 모든 코드가 이미 완전히 맞는 것은 아니다.
기존 flat pages와 mixed components는 **migration-in-progress**로 간주한다.

## 5.4 CSS 아키텍처 원칙

### 토큰 체계

| 프리픽스 | 용도 |
|---------|------|
| `--cds-*` | Carbon 공통 (surface, text, interactive, button, border, spacing, type) |
| `--aegis-*` | AEGIS 도메인 (severity, status, module, source, confidence) |

### 스타일 계층 규칙

새 코드 / 실질 리팩터 코드는 다음 계층을 따른다.

1. **palette / tokens** (`styles/tokens.css`)
2. **semantic token usage** (`--cds-*`, `--aegis-*`)
3. **component/page CSS**

TSX는 구조/조립을 우선하고, tokenizable styling은 CSS에서 처리한다.

### 필수 준수 사항

- 하드코딩 색상/폰트 금지 (tokens.css 자체 제외)
- tokenizable 값의 인라인 스타일 금지
- 허용 예외: 런타임 계산값, CSS Variable Injection
- BEM 네이밍 유지

> 일부 brownfield CSS에는 아직 legacy radius/shadow cleanup 대상이 남아 있을 수 있다. 그 자체는 현재 구조 계약의 예외가 아니라 **후속 리팩터 대상 debt**로 본다.

---

## 6. 새 페이지/컴포넌트 추가 체크리스트

1. `pages/<Page>/<Page>.tsx` + `pages/<Page>/<Page>.css` 생성
2. page-local UI는 `pages/<Page>/components`에 둔다
3. `document.title = "AEGIS — {Page Name}"` 설정
4. `App.tsx`에 라우트 추가 (적절한 셸 선택)
5. app-global로 올릴 가치가 없는 UI는 `components/` 루트에 두지 않는다
6. 토큰 준수: `--cds-*` / `--aegis-*`만 사용
7. 테스트 추가
8. wiki 문서 동기화

---

## 7. 협업 및 문서 교환 규칙

S1은 S2와 shared 모델을 공유하므로, 문서화 없는 변경을 해서는 안 된다.

shared 변경 시 반드시 아래를 남긴다.
1. 변경 요약
2. 변경된 타입/DTO 목록
3. breaking / non-breaking 여부
4. 프론트 영향 범위
5. 백엔드 영향 범위
6. 샘플 payload 전/후
7. 마이그레이션 메모
8. 테스트 케이스 변경점

문서화 없이 금지되는 변경:
- enum 값 추가/삭제
- 상태명 변경
- 필수 필드 추가
- 이벤트 타입 이름 변경
- WebSocket payload 구조 변경

---

## 8. 테스트 전략

### 단위 테스트 대상

- mapper / formatter / utility
- badge/status mapping
- page-local view model helper
- event dedupe logic
- ownership/style 규칙을 반영한 page specimen regression

### 현재 신뢰 가능한 자동 검증

- `cd services/frontend && npm run build`
- `cd services/frontend && npm test` → `52` files / `395` tests
- `cd services/frontend && npx tsc --noEmit --project tsconfig.json`
- `cd services/frontend && npx vitest run src/renderer/pages/DashboardPage/DashboardPage.test.tsx`

---

## 9. 완료 기준 (Definition of Done)

S1 작업은 아래를 만족할 때 완료로 본다.

- 화면이 shared 계약을 정확히 소비한다.
- API/WS 에러를 사용자에게 이해 가능한 방식으로 보여준다.
- AI 결과가 AI 결과로 구분된다.
- `DashboardPage` 기준 사례에서 추출한 tone/density/emphasis/spacing 원칙이 새 리팩터 코드에 반영된다.
- 새 코드/실질 리팩터 코드는 page-per-directory + ownership split 규칙을 따른다.
- 빌드/테스트/타입 검사가 green이다.
- wiki 문서와 코드가 서로 모순되지 않는다.

---

## 10. S1에게 요구하는 태도

S1은 "예쁘게 보이는 화면"보다 다음을 우선해야 한다.

1. 운영자가 판단을 검증할 수 있게 만들 것
2. 실시간 상태를 숨기지 않을 것
3. AI의 불확실성을 시각적으로 감출 생각을 하지 않을 것
4. 문서화되지 않은 shared 변경을 하지 않을 것
5. evidence-first 원칙을 깨지 않을 것
6. 구조 규칙을 일회성 선호가 아니라 **팀 계약**으로 유지할 것

이 프론트엔드는 결국 보고서용 UI가 아니라, **분석 결과를 믿을 수 있는지 검증하는 콘솔**이어야 한다.
