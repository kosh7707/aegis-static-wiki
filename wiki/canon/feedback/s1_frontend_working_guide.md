---
title: "S1 작업 지침서 — Frontend (React + TypeScript Web SPA)"
page_type: "canonical-feedback"
canonical: true
source_refs:
  - "docs/외부피드백/S1_frontend_working_guide.md"
last_verified: "2026-04-09"
service_tags: ["s1", "platform"]
decision_tags: []
related_pages: []
---

# S1 작업 지침서 — Frontend (React + TypeScript Web SPA)

## 1. 문서 목적

이 문서는 S1이 담당하는 **Frontend 영역**의 책임 범위, 반드시 구현해야 할 기능, 협업 규칙, 기술적 제약, 완료 기준을 명확히 정의하기 위한 작업 지침서다.
이 시스템의 프론트엔드는 단순 대시보드가 아니라, **정적 분석 / 동적 분석 / 동적 테스트 / LLM 분석 결과를 증적 중심으로 탐색하고, triage 하고, 승인 흐름을 처리하는 운영 콘솔**이다.

핵심 원칙은 다음 한 문장으로 요약된다.

> **프론트는 "판단을 만들어내는 곳"이 아니라, 백엔드가 관리하는 Findings / Evidence / Quality Gate / Approval 상태를 정확하고 재검증 가능하게 보여주는 곳이다.**

> **2026-04-09 변경**: S1은 더 이상 Electron 앱이 아니다. 순수 웹 SPA (React + TypeScript, Vite 빌드, BrowserRouter)로 전환됨.

---

## 2. S1의 시스템 내 역할

S1은 아래를 책임진다.

- 순수 웹 SPA 구성 (React + TypeScript, Vite)
- BrowserRouter 기반 라우팅 (HashRouter 아님)
- MVVM + Service 패턴에 따른 View / ViewModel / Service 분리
- 백엔드 REST API 및 WebSocket 이벤트 소비 (Vite proxy 경유)
- 분석 결과, 원시 증적, 품질 게이트, 승인 큐 시각화
- LLM 결과에 대한 provenance(근거 정보) 표시
- 사용자의 triage 작업을 빠르고 안전하게 할 수 있는 UX 제공
- GitHub-style UI 디자인 방향 유지

S1은 아래를 책임지지 않는다.

- 분석 로직의 실제 수행
- ECU 통신 처리
- LLM 호출 로직 및 프롬프트 생성
- Findings의 최종 판정 규칙
- Quality Gate 평가 로직의 실제 결정
- 승인 정책의 결정 자체

즉, **프론트는 표현 계층**이며, 시스템의 상태 진실원(source of truth)은 S2 백엔드다.

---

## 3. 성공 기준

S1이 잘 만들어졌다고 볼 수 있는 기준은 아래와 같다.

1. 사용자가 특정 finding을 열었을 때, **왜 이 finding이 생겼는지 끝까지 따라갈 수 있어야 한다.**
2. LLM이 생성한 설명은 표시하되, **LLM 출력이 사실 그 자체처럼 보이지 않아야 한다.**
3. 실시간 동적 분석 화면에서, 사용자는 **이벤트, 경고, 드롭, 상태 변화, 재연 가능 정보**를 구분해서 볼 수 있어야 한다.
4. 승인 필요한 작업(고위험 동적 테스트, active diagnostic, fuzzing)은 **명확한 승인 상태**로 드러나야 한다.
5. shared 모델 변경 시 프론트가 조용히 깨지지 않고, **명시적 계약 위반으로 드러나야 한다.**

---

## 4. 프론트엔드 설계 원칙

## 4.1 Evidence-first UI

모든 주요 화면은 "요약 → 판단 → 근거" 순서가 아니라, 다음 순서를 따라야 한다.

1. 현재 객체가 무엇인지
2. 어떤 상태인지
3. 어떤 결과가 나왔는지
4. 그 결과의 근거가 무엇인지
5. 누가 / 무엇이 / 어떤 버전으로 그 결과를 냈는지

## 4.2 LLM 결과는 항상 "보조 정보"로 표시

LLM이 생성한 설명, 가설, 클러스터링, remediation draft는 모두 UI에서 명확히 라벨링해야 한다.

표시 원칙:

- "AI 요약", "AI 가설", "AI 보조 설명"처럼 구분
- deterministic rule 결과와 시각적으로 동일하게 보이지 않게 함
- confidence가 있다면 표시하되, confidence를 사실 보증처럼 표현하지 않음
- 검증 실패(schema invalid, evidence ref missing, prompt mismatch)는 눈에 띄게 노출
- LLM만 근거인 경우 badge로 표시: `AI-only`, `Needs Review`

금지:

- LLM 텍스트를 finding 제목으로 그대로 승격
- LLM이 severity를 판단한 결과를 확정값처럼 강조
- 원시 evidence 없이 AI 설명만 먼저 보여주는 구성

## 4.3 실시간 화면은 "스트림 뷰어"이지 "채팅창"이 아니다

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

---

## 5. 아키텍처 가이드 (S1 내부)

## 5.1 실제 디렉터리 구조 (2026-04-09 현재)

```text
src/renderer/
├── App.tsx          ← BrowserRouter + 3종 레이아웃 + 모든 라우트
├── main.tsx
├── api/             ← 14개 모듈 (analysis, approval, auth, ...)
├── components/      ← Navbar, Sidebar, StatusBar, ErrorBoundary 등
├── constants/
├── contexts/        ← 5개 provider
├── hooks/           ← 9개 커스텀 훅
├── layouts/         ← ProjectLayout
├── pages/           ← 16개 페이지 + co-located CSS
├── styles/          ← 6개 파일 (tokens, reset, animations, layout, primitives, utilities)
├── types/
└── utils/           ← 10개 유틸리티 모듈
```

## 5.2 레이아웃 3종

| 레이아웃 | 구성 | 사용 경로 |
|----------|------|-----------|
| Auth | 중앙 카드만 | `/login`, `/signup` |
| Global | Navbar + Main + StatusBar | `/dashboard`, `/settings` |
| Project | Navbar + Sidebar + Main + StatusBar | `/projects/:projectId/*` |

## 5.3 CSS 아키텍처 원칙

### 토큰 체계

| 프리픽스 | 용도 |
|---------|------|
| `--cds-*` | Carbon 공통 (surface, text, interactive, button, border, spacing, type) |
| `--aegis-*` | AEGIS 도메인 (severity, status, module, source, confidence) |

### 필수 준수 사항

- **하드코딩 금지**: CSS/TSX 어디에도 색상 hex, rgba, font-family 직접 작성 금지
- **tokens.css 단일 관리**: 모든 토큰은 `styles/tokens.css`에서만 정의
- **Co-located CSS**: 각 페이지/컴포넌트는 같은 디렉터리에 CSS 파일 배치
- **인라인 스타일 금지**: tokenizable 값은 반드시 CSS 클래스로 작성
- **허용 예외**: 런타임 계산값, CSS Variable Injection

### 컴포넌트 스타일 규칙

- BEM 네이밍: `.block__element--modifier`
- Flat design: 카드/정적 요소에 `box-shadow` 금지
- Shadow 허용: floating 요소만 `var(--cds-shadow-dropdown)`
- Radius: `var(--cds-radius)` (2px) 기본

## 5.4 라우팅

- `BrowserRouter` 사용 (HashRouter 아님). URL에 `#` 없음.
- `/dashboard`가 프로젝트 목록 메인 화면.
- `/projects` 접근 시 `/dashboard`로 redirect.

## 5.5 상태 관리

권장:

- 서버 상태: Query 계열 라이브러리 또는 명시적 cache layer
- 실시간 이벤트 상태: run별 event stream store
- 화면 상태: 각 module viewmodel 내부 상태

주의:

- WebSocket 이벤트를 전역 상태에 무제한 누적하지 않음
- raw 이벤트는 페이지네이션/윈도잉 필요

---

## 6. 새 페이지/컴포넌트 추가 체크리스트

1. `pages/` 또는 `components/` 하위에 `.tsx` + co-located `.css` 파일 생성
2. `document.title = "AEGIS — {Page Name}"` 설정
3. `App.tsx`에 라우트 추가 (적절한 레이아웃 선택)
4. 사이드바 노출이 필요하면 `Sidebar.tsx` items 배열에 추가 (`comingSoon: false`)
5. 토큰 준수: hex/rgb 하드코딩 금지, `--cds-*` / `--aegis-*` 사용
6. 테스트 추가 (`src/**/*.test.tsx`)
7. wiki 문서 동기화 (architecture.md, specs/frontend.md, readme.md, qa-guide.md)

---

## 7. WebSocket / 실시간 표시 요구사항

S1은 WebSocket을 적극적으로 사용하되, 아래를 지켜야 한다.

최소 이벤트 타입 표시:

- `run.status.changed`
- `capture.frame.received`
- `capture.backpressure.notice`
- `rule.matched`
- `finding.created`
- `finding.updated`
- `approval.required`
- `approval.resolved`
- `adapter.connection.changed`
- `simulator.state.changed`
- `llm.annotation.completed`
- `system.validation.failed`

필수 처리:

- 마지막 sequence 번호 추적
- 재연결 시 gap 감지
- 누락 이벤트가 있으면 "일부 이벤트 누락 가능" 표시
- event drop 발생 시 UI에 명시적으로 표시 (`Dropped 14 raw frames`, `Backpressure active`)

---

## 8. 협업 및 문서 교환 규칙

S1은 S2와 shared 모델을 공유하므로, 문서화 없는 변경을 해서는 안 된다.

shared 변경 시 반드시 아래를 작성:

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

## 9. S1이 반드시 고려해야 할 도메인 규칙

## 9.1 Finding 상태는 UI가 임의로 만들지 않는다

상태 목록 예시: Open, Needs Review, Accepted Risk, False Positive, Fixed, Needs Revalidation, Sandbox

## 9.2 Severity와 Confidence를 혼동하지 않는다

- Severity: 시스템 / 정책상 위험도
- Confidence: 분석기나 LLM의 신뢰도 추정값

두 값을 하나의 색이나 badge로 뭉치지 않는다.

## 9.3 AI 결과와 deterministic 결과를 시각적으로 분리

- deterministic rule / analyzer output: 기본 계열
- AI output: 별도 badge와 provenance drawer 제공

---

## 10. 테스트 전략

### 단위 테스트 대상

- mapper, viewmodel, formatting utilities
- evidence locator resolver
- event dedupe logic
- badge/status mapping

### 계약 테스트

shared DTO 샘플 payload를 기준으로: 역직렬화 가능 여부, optional/required 필드 처리, enum 호환성

### E2E 테스트

- `npm test` (Vitest) → 392 tests, 51 files
- `npm run test:e2e` (Playwright) → 전체 E2E

---

## 11. 완료 기준 (Definition of Done)

S1 기능은 아래를 만족할 때 완료로 본다.

- 화면이 shared 계약을 정확히 소비한다.
- API/WS 에러를 사용자에게 이해 가능한 방식으로 보여준다.
- AI 결과가 AI 결과로 구분된다.
- finding에서 evidence까지 2클릭 이내로 이동 가능하다.
- run 상세 화면에서 실시간 상태와 누락/드롭 상황이 드러난다.
- `document.title = "AEGIS — {Page Name}"` 준수.
- CSS 토큰 하드코딩 0건.
- 빌드 0 errors, 테스트 pass.
- shared 변경 시 문서가 남아 있다.

---

## 12. S1에게 요구하는 태도

S1은 "예쁘게 보이는 화면"보다 다음을 우선해야 한다.

1. 운영자가 판단을 검증할 수 있게 만들 것
2. 실시간 상태를 숨기지 않을 것
3. AI의 불확실성을 시각적으로 감출 생각을 하지 않을 것
4. 문서화되지 않은 shared 변경을 하지 않을 것
5. evidence-first 원칙을 깨지 않을 것

이 프론트엔드는 결국 보고서용 UI가 아니라, **분석 결과를 믿을 수 있는지 검증하는 콘솔**이어야 한다.
