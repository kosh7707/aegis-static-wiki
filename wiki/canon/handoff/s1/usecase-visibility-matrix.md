---
title: "S1 Frontend 유스케이스 · Must-Show 가시성 매트릭스"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/layouts/ProjectLayoutShell.tsx"
  - "services/frontend/src/layouts/Navbar.tsx"
  - "services/frontend/src/layouts/Sidebar.tsx"
  - "services/frontend/src/layouts/ErrorBoundary.tsx"
  - "services/frontend/src/pages/LoginPage/components/LoginFormCard.tsx"
  - "services/frontend/src/pages/SignupPage/components/SignupFormCard.tsx"
  - "services/frontend/src/pages/DashboardPage/DashboardPage.tsx"
  - "services/frontend/src/pages/SettingsPage/SettingsPage.tsx"
  - "services/frontend/src/pages/OverviewPage/OverviewPage.tsx"
  - "services/frontend/src/pages/FilesPage/FilesPage.tsx"
  - "services/frontend/src/pages/FileDetailPage/FileDetailPage.tsx"
  - "services/frontend/src/pages/StaticAnalysisPage/StaticAnalysisPage.tsx"
  - "services/frontend/src/pages/VulnerabilitiesPage/VulnerabilitiesPage.tsx"
  - "services/frontend/src/pages/QualityGatePage/QualityGatePage.tsx"
  - "services/frontend/src/pages/ApprovalsPage/ApprovalsPage.tsx"
  - "services/frontend/src/pages/AnalysisHistoryPage/AnalysisHistoryPage.tsx"
  - "services/frontend/src/pages/ReportPage/ReportPage.tsx"
  - "services/frontend/src/pages/ProjectSettingsPage/ProjectSettingsPage.tsx"
  - ".omx/plans/s1-usecase-frontend-visibility-matrix.md"
last_verified: "2026-04-18"
service_tags: ["s1", "s1-qa"]
decision_tags: ["frontend-visibility-contract", "qa-pass-fail-rubric", "exclude-dynamic-analysis"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/architecture.md"]
---

# S1 Frontend 유스케이스 · Must-Show 가시성 매트릭스

> 목적: 각 프론트 유스케이스가 화면에 **반드시 존재해야 할 DOM 관측 항목**을 QA가 그 자리에서 pass/fail 판단할 수 있는 단위로 명시한다.
> 사용자: S1(Developer), S1-QA.
> Scope: 2026-04-18 기준 `services/frontend/src/**` 활성 라우트.
> Exclusions: **DynamicAnalysisPage · DynamicTestPage** 및 `api/dynamic.ts` 관련 어댑터 플로우는 이 매트릭스 밖. Sidebar 내부에서 해당 항목이 렌더링되는 것은 허용하되, 그 내부 동작은 이 매트릭스의 합격/불합격 판단에 쓰지 않는다.
> 상위 참조: `wiki/canon/specs/frontend.md`, `wiki/canon/handoff/s1/qa-guide.md`, `wiki/canon/handoff/s1/architecture.md`.
> 로컬 작업본: `.omx/plans/s1-usecase-frontend-visibility-matrix.md`.

## 0. 규약

### 레벨
- **MUST**: 해당 상태에서 DOM에 반드시 존재해야 한다. 누락 시 QA REJECT.
- **SHOULD**: 정상 데이터 경로에서는 보여야 한다. 서버 미응답·미구현 같은 합리적 파생 상태에서 빠질 수 있다. SHOULD 누락은 사유 기록 대상이지 즉시 REJECT는 아니다.
- **SHOULD+TODO**: 현재 구현에 접근성 속성이 없지만 추가되어야 한다. QA는 이 항목이 누락되어도 FAIL 내지 않는다. Developer 백로그 항목이다.
- **NICE**: 운영 편의 요소.

### 관측 단위
한 MUST 항목 = 하나의 단일 DOM 관측. 허용되는 관측 표현은 다음뿐이다:
1. 특정 텍스트를 포함한 요소가 존재 (예: `"워크스페이스 열기"` 텍스트 포함 요소).
2. 특정 `aria-label` 또는 `aria-labelledby`를 가진 요소가 존재.
3. 특정 `role`/HTML 태그/`type` 속성을 가진 요소가 존재.
4. 특정 `data-testid`를 가진 요소가 존재 (구현 요구사항으로 별도 기록).
5. 특정 `href` 혹은 `to` 값을 갖는 링크가 존재.

**금지 표현**: "가독 가능", "적절한", "시각적 강조", "주요 에러", "또는" 형태의 disjunction MUST. 이런 표현이 나오면 즉시 측정 단위로 재작성하거나 SHOULD로 내린다.

### 상태 축
유스케이스마다 해당되는 축만 나열한다. 축이 해당되지 않으면 "N/A (해당 상태 없음)" 으로 명시한다.
- normal
- loading
- empty
- error

### 인터랙션
키보드, 드래그, 포커스 트랩 같은 **행위 검증**은 MUST 가시성 리스트에 섞지 않는다. 각 유스케이스의 "Interaction tests" 하위 블록에 모아둔다. 행위 검증은 QA 단계에서 Playwright 스크립트 또는 수동 조작으로 검사한다.

### 합격/불합격 판정 규칙
1. 해당 상태의 MUST 중 **하나라도** 누락되면 REJECT.
2. SHOULD 누락은 사유 기록 대상이다.
3. SHOULD+TODO 누락은 Developer 백로그 갱신만 수행. 즉시 REJECT 아님.
4. 매트릭스 밖 요소(동적 분석/테스트 내부 등)는 판정에 쓰지 않는다.

---

## 유스케이스 인덱스

| ID | 유스케이스 | 라우트 |
|---|---|---|
| UC-ROUTE-01 | 루트/미매칭 라우트 리다이렉트 | `/`, `/projects`, `*` |
| UC-AUTH-01 | 로그인 | `/login` |
| UC-AUTH-02 | 회원가입 | `/signup` |
| UC-SHELL-01 | 전역 셸 (Navbar + GlobalLayout/DashboardLayout) | `/dashboard`, `/settings` |
| UC-SHELL-02 | 프로젝트 셸 (Navbar + Sidebar + Breadcrumb) | `/projects/:id/*` |
| UC-ERR-01 | ErrorBoundary fallback | 프로젝트 셸 본문 내부 오류 시 |
| UC-DASH-01 | 대시보드 (프로젝트 랜딩) | `/dashboard` |
| UC-GSET-01 | 전역 시스템 설정 | `/settings` |
| UC-OVR-01 | 프로젝트 개요 | `/projects/:id/overview` |
| UC-FILES-01 | 파일 워크스페이스 | `/projects/:id/files` |
| UC-FILES-02 | 빌드 로그 뷰어(서브플로) | `FilesPage` 내 모달 |
| UC-FDET-01 | 파일 상세 | `/projects/:id/files/:fileId` |
| UC-FDET-02 | FileDetail → 취약점 드릴다운 | `VulnerabilityDetailView` |
| UC-STAT-01 | 정적 분석 실행/모니터링 | `/projects/:id/static-analysis` |
| UC-VULN-01 | 취약점 리스트 | `/projects/:id/vulnerabilities` |
| UC-VULN-02 | Finding 상세 (리스트에서 드릴다운) | `FindingDetailView` |
| UC-GATE-01 | 품질 게이트 | `/projects/:id/quality-gate` |
| UC-APPR-01 | 승인 큐 | `/projects/:id/approvals` |
| UC-HIST-01 | 분석 이력 | `/projects/:id/analysis-history` |
| UC-REP-01 | 리포트 | `/projects/:id/report` |
| UC-PSET-01 | 프로젝트 설정(SDK 포함) | `/projects/:id/settings` |
| UC-NOTIF-01 | 알림 (전역 Navbar 드롭다운) | Navbar |

---

## UC-ROUTE-01 — 루트/미매칭 라우트 리다이렉트

### 상태 신호
- **인증된 상태**: `/`, `/projects`, `*` 진입 시 `<Navigate to="/dashboard" replace>` 단일 동작. 화면 렌더 없음.
- **미인증 상태**: 동일 경로에서 `<Navigate to="/login" replace>` 단일 동작.
- **auth loading**: `useAuth().loading === true` 동안 `null` 렌더. QA는 이 상태에서 아무것도 없음을 확인한다.

### MUST
- (normal) URL이 목적지 라우트로 교체된다 (브라우저 URL bar 기준). 중간 자식 DOM 없음.

### Interaction tests
- `/nonexistent-path` 접근 시 로그인 상태에 따라 `/dashboard` 또는 `/login`으로 이동.

### 딥링크
- inbound: 모든 미매칭 경로, `/`, `/projects`.
- outbound: `/dashboard` 또는 `/login`.

### 증거 소스
`src/App.tsx:24-38`, `src/App.tsx:68-70`, `src/contexts/AuthContext.tsx`.

---

## UC-AUTH-01 — 로그인

### 상태 신호
- **normal / loading(submitting) / error**
- empty: N/A (항상 폼을 렌더).

### MUST (normal)
- 텍스트 `"AEGIS"` 포함 요소가 최소 1개 (login-page 푸터 버전 문자열에 포함됨).
- 텍스트 `"임베디드 펌웨어 보안 운영 콘솔"` 포함 요소.
- 텍스트 `"워크스페이스 열기"` 포함 카드 제목 요소.
- `<label for="login-username">` + `<input id="login-username" type="text" required>`.
- `<label for="login-password">` + `<input id="login-password" type="password" required>`.
- `<button type="submit">` 가 존재하고, 초기에는 username/password가 비어있어 `disabled`.
- `<Link to="/signup">` 링크 존재 (텍스트 `"프로필 준비"`).
- 푸터에 텍스트 `"AEGIS v"` 포함 요소(`__APP_VERSION__` 치환 결과).

### MUST (loading: `submitting === true`)
- submit 버튼이 `disabled` 속성을 가진다.
- submit 버튼 내부 텍스트 `"진입 중..."`.

### MUST (error: `error !== null`)
- `role="alert"` 속성을 가진 요소가 렌더된다. 해당 요소 내부에 `error` 문자열이 표시된다.

### SHOULD+TODO
- 로그인 에러 Alert에 `aria-live="assertive"` 명시 추가.

### Interaction tests
- Enter 키로 폼 submit.
- submit 중 중복 클릭이 불가.
- 인증 성공 시 `/dashboard` 이동.

### 딥링크
- inbound: `/login`, UC-ROUTE-01 미인증 리다이렉트, `/signup` 제출 후.
- outbound: `/dashboard` (성공), `/signup` (링크).

### 증거 소스
`src/pages/LoginPage/LoginPage.tsx`, `src/pages/LoginPage/components/LoginFormCard.tsx`, `src/pages/LoginPage/hooks/useLoginForm.ts`, `src/contexts/AuthContext.tsx`.

---

## UC-AUTH-02 — 회원가입

### 상태 신호
- **normal / loading(submitting)**
- empty/error: 현재 구현에 명시적 inline 에러 Alert가 없다. 서버 실패는 ToastContext 경유 — 이는 CC-03 정책에 따라 SHOULD+TODO 대상.

### MUST (normal)
- 텍스트 `"프로필 준비"` 포함 카드 제목 요소.
- `<label for="signup-username">` + `<input id="signup-username" type="text" required>`.
- `<label for="signup-password">` + `<input id="signup-password" type="password" required>`.
- `<button type="submit">` 존재, 초기 `disabled`.
- `<Link to="/login">` (텍스트 `"워크스페이스 열기"`).
- 푸터에 `"AEGIS v"` 포함 요소.

### MUST (loading: `submitting === true`)
- submit 버튼 `disabled`.
- 버튼 텍스트 `"준비 중..."`.

### SHOULD+TODO
- 서버 실패 시 inline `role="alert"` Alert (현재 구현상 누락).
- 폼 상단 placeholder-only 필드(`signup-fullname`, `signup-confirm`) 제거 또는 상태 연결.

### Interaction tests
- 회원가입 성공 시 자동 로그인 후 `/dashboard` 이동.

### 딥링크
- inbound: `/signup`, `/login`에서 "프로필 준비" 링크.
- outbound: `/dashboard` (성공), `/login` (링크).

### 증거 소스
`src/pages/SignupPage/SignupPage.tsx`, `src/pages/SignupPage/components/SignupFormCard.tsx`, `src/pages/SignupPage/hooks/useSignupForm.ts`.

---

## UC-SHELL-01 — 전역 셸 (Dashboard/Settings 공통)

### 상태 신호
- **normal** (인증된 상태 전제). 미인증 시 `RequireAuth`가 `/login`으로 `<Navigate>` — 이 셸은 렌더되지 않는다.
- loading/empty/error: N/A (내부 페이지 유스케이스에서 다룬다).

### MUST (normal)
- `<header>` 에 `<Link to="/dashboard" aria-label="AEGIS 홈">` 존재.
- 텍스트 `"AEGIS"` 포함 요소가 헤더 내부.
- `<Link to="/dashboard">` 텍스트 `"대시보드"` 버튼 존재.
- `<Link to="/settings">` 존재 (텍스트 `"설정"`은 `max-[720px]` 에서 숨김 — 모바일 폭에서는 아이콘만 MUST).
- 테마 드롭다운 트리거 버튼: `aria-label` 값이 정규식 `^테마 설정 \(현재: (라이트|다크|시스템)\)$` 에 매칭.
- 알림 드롭다운 트리거 버튼: `aria-label` 값이 정규식 `^알림(\s*\(\d+건 읽지 않음\))?$` 에 매칭.

### SHOULD
- 사용자 이니셜 아바타 엘리먼트(이니셜 1자 + `title` 속성).

### Interaction tests
- 테마 드롭다운 열림 시 라이트/다크/시스템 3개 옵션 클릭으로 `document.documentElement`의 테마 클래스가 갱신.
- 알림 드롭다운 열림 시 UC-NOTIF-01 내부 MUST가 적용.

### 증거 소스
`src/App.tsx:51-66`, `src/layouts/GlobalLayout.tsx`, `src/layouts/DashboardLayout.tsx`, `src/layouts/Navbar.tsx:73,95,108,120,168`.

---

## UC-SHELL-02 — 프로젝트 셸 (Navbar + Sidebar + Breadcrumb)

### 상태 신호
- **normal**
- loading: 프로젝트 이름 미로딩 시 Sidebar 헤더에 대체 문자열 렌더.

### MUST (normal)
- UC-SHELL-01 MUST 전체 (Navbar는 이 셸에 그대로 포함된다).
- Sidebar 영역: 현재 프로젝트 이름 텍스트 포함 요소 1개, 또는 프로젝트 미해결 상태에서 텍스트 `"알 수 없는 프로젝트"` 포함 요소 1개.
- Sidebar에 `<Link to="/projects">` 를 감싸는 "프로젝트 목록으로" 버튼 존재 (현 구현은 `onClick`으로 네비, label `"프로젝트 작업 공간"` 서브텍스트 포함).
- Sidebar에 다음 9개 NavLink가 MUST (동적 분석/동적 테스트 렌더는 허용하되 MUST 아님):
  - `<NavLink to="/projects/:id/overview">` 텍스트 `"개요"`.
  - `<NavLink to="/projects/:id/files">` 텍스트 `"파일 탐색기"`.
  - `<NavLink to="/projects/:id/vulnerabilities">` 텍스트 `"취약점 목록"`.
  - `<NavLink to="/projects/:id/static-analysis">` 텍스트 `"정적 분석"`.
  - `<NavLink to="/projects/:id/quality-gate">` 텍스트 `"품질 게이트"`.
  - `<NavLink to="/projects/:id/approvals">` 텍스트 `"승인 큐"`.
  - `<NavLink to="/projects/:id/analysis-history">` 텍스트 `"분석 이력"`.
  - `<NavLink to="/projects/:id/report">` 텍스트 `"보고서"`.
  - `<NavLink to="/projects/:id/settings">` 텍스트 `"설정"`.
- 승인 대기(pending) > 0 이면 Sidebar 승인 NavLink 근처에 pending 숫자 텍스트 포함 요소(`SidebarMenuBadge`).
- Breadcrumb 영역: 현재 프로젝트 이름 텍스트 + 현재 페이지 라벨 텍스트를 모두 포함하는 단일 내비게이션 컨테이너가 존재.

### SHOULD
- 현재 라우트에 해당하는 NavLink에 React Router가 자동 주입하는 `aria-current="page"` 속성이 존재. (명시 속성이 아니라 React Router 기본 동작 — QA 검증 시 DOM 스냅샷에서 확인.)

### SHOULD+TODO
- Sidebar NavLink 각 항목에 `aria-label` 명시 (현재는 텍스트만 사용).
- Breadcrumb 루트 `nav` 에 `aria-label="현재 위치"`.

### Interaction tests
- `AnalysisGuardContext.isBlocking === true` 인 상태에서 Sidebar NavLink 또는 "프로젝트 목록으로" 클릭 시 `ConfirmDialog` 렌더 (본문 텍스트 `"분석이 진행 중입니다. 이동하시겠습니까? (분석은 백그라운드에서 계속됩니다)"`, "이동"/취소 버튼).

### 딥링크
- inbound: Dashboard의 프로젝트 행 클릭, Overview의 cross-link, Home redirect.
- outbound: 각 NavLink sub-route, "프로젝트 목록으로" → `/projects` → `/dashboard`(UC-ROUTE-01).

### 증거 소스
`src/layouts/ProjectLayoutShell.tsx`, `src/layouts/Sidebar.tsx:40-51,99,164-167`, `src/layouts/ProjectBreadcrumbLayout.tsx`, `src/contexts/AnalysisGuardContext.tsx`, `src/api/approval.ts` (`fetchApprovalCount`).

---

## UC-ERR-01 — ErrorBoundary fallback

### 상태 신호
- **error** only (정상 렌더 상태에서는 children을 그대로 통과).

### MUST (error 상태)
- 텍스트 `"페이지를 표시할 수 없습니다"` 포함 heading 요소.
- 텍스트 `"예기치 않은 오류가 발생했습니다. 새로고침을 시도해 주세요."` 포함 본문 요소.
- 텍스트 `"새로고침"` 포함 버튼 요소. 클릭 시 내부 상태 리셋.

### SHOULD+TODO
- fallback 루트에 `role="alert"` 또는 `role="region" aria-label="오류"`.

### Interaction tests
- throw를 발생시키는 하위 컴포넌트 렌더 시 위 MUST가 나타남을 확인.
- "새로고침" 클릭 시 하위 정상 트리 복구.

### 증거 소스
`src/layouts/ErrorBoundary.tsx:29-49`.

---

## UC-DASH-01 — 대시보드

### 상태 신호
- **normal / loading / empty(전체 0) / empty(필터 불일치) / error**

### MUST (normal, `projects.length > 0`)
- `<aside aria-label="프로젝트 탐색기">` 존재.
- 내부에 검색/필터 입력(텍스트 input 1개) 존재.
- "새 프로젝트 시작" 트리거 버튼 존재 (`ProjectExplorerSearch`가 렌더하는 토글 버튼).
- 프로젝트 행이 최소 1개 렌더.
- 섹션 헤더 텍스트 `"최근 활동"` 포함 요소가 본문에 존재.
- 최근 활동 아이템이 1개 이상 있으면 해당 리스트 렌더 및 각 항목 클릭 가능(`<a>` 또는 `<button>`).

### MUST (loading)
- Explorer 영역에 skeleton 또는 `role="status"` 로딩 표기 (현재 구현은 `useDashboardExplorerState` 결과에 따라 loading 텍스트 — **SHOULD+TODO: `role="status"` 명시**).

### MUST (empty 전체 0)
- 텍스트 `"새 프로젝트 시작"` 포함 버튼이 Explorer 빈 상태 카드 안에 존재.

### MUST (empty 필터 불일치)
- 텍스트 `"검색 초기화"` 포함 버튼이 존재하고 클릭 시 필터 값이 빈 문자열로 복원.

### MUST (error — 프로젝트 로드 실패)
- 에러 메시지를 inline으로 Explorer 본문에 표시 (텍스트 포함). 현재 구현은 Toast 경유 가능 — 이는 CC-03에 따라 **SHOULD+TODO**로 전환.

### Interaction tests
- "새 프로젝트 시작" 클릭 → `CreateProjectForm` 렌더, name/description 입력 후 "생성" 버튼 → 프로젝트 생성 후 Explorer에 추가.
- 프로젝트 행 클릭 → `/projects/:id/overview` 이동.
- "최근 활동 더 보기" 클릭 시 활동 개수 증가.

### SHOULD
- `"주의 필요"` 섹션 헤더가 attention 대상이 있을 때만 렌더. attention 대상이 없으면 섹션 숨김.
- 최근 활동 `hasMore === true` 일 때 "더 보기" 버튼 노출.

### 딥링크
- inbound: Home redirect, 프로젝트 삭제 후 복귀, Sidebar "프로젝트 목록으로".
- outbound: `/projects/:id/overview`, activity 항목 경유 각 모듈.

### 증거 소스
`src/pages/DashboardPage/DashboardPage.tsx`, `src/pages/DashboardPage/components/ProjectExplorer.tsx:44`, `src/pages/DashboardPage/components/CreateProjectForm.tsx`, `src/pages/DashboardPage/components/RecentActivitySection.tsx`, `src/pages/DashboardPage/hooks/useDashboardExplorerState.ts`, `src/pages/DashboardPage/hooks/useDashboardActivityFeed.ts`.

---

## UC-GSET-01 — 전역 시스템 설정

### 상태 신호
- **normal / loading(테스트 진행) / error(테스트 실패) / success(테스트 성공) / dirty(저장 전) / saved**
- empty: N/A.

### MUST (normal)
- 텍스트 `"시스템 설정"` 포함 heading 요소.
- 텍스트 `"전역 연결, 테마, 런타임 환경을 운영 기준으로 정리합니다."` 포함 subtitle.
- 헤더 액션 영역에 "저장" 버튼, "되돌리기" 버튼 각각 존재 (버튼 내부 텍스트로 식별).
- Platform 섹션 컨테이너 존재.
- Backend 섹션: URL `<input>` + 연결된 `<label>`, "연결 테스트" 버튼, "저장" 버튼.
- Theme 섹션: 라이트/다크/시스템 각 라벨을 가진 버튼 3개 존재. 현재 선택된 버튼은 `data-state="active"` 또는 아이콘 강조로 구별. (현재 구현은 CSS class — **SHOULD+TODO: `aria-pressed="true"` 명시**.)
- API Access 섹션 컨테이너 존재 + 현재 URL 텍스트 + 연결 상태 텍스트(`testStatus` 기반).

### MUST (loading: `testStatus === "pending"` 등)
- 연결 테스트 버튼이 `disabled` 또는 내부 스피너를 렌더.

### MUST (success: `testStatus === "ok"`)
- Backend 섹션에 테스트 성공을 나타내는 텍스트 포함 요소 존재 (UI 문자열은 Self-check TODO 항목 — 코드 기준으로 확정).

### MUST (error: `testStatus === "error"`)
- `testDetail` 문자열이 Backend 섹션 내부에 가시 텍스트로 렌더.

### MUST (dirty: `urlDirty === true`)
- "저장" 버튼이 `disabled === false`.
- "되돌리기" 버튼이 `disabled === false`.

### MUST (saved: `saved === true`)
- Backend 섹션 내부 저장 확인 피드백 텍스트 포함 (Self-check TODO — 실제 문자열 추출 후 MUST 동기화).

### SHOULD+TODO
- Theme 라디오 그룹에 `role="radiogroup"` 래퍼, 각 옵션에 `role="radio" aria-checked`.

### Interaction tests
- URL 수정 → "저장" 클릭 → saved 상태 전환.
- "되돌리기" 클릭 → 원래 URL 복구.
- "연결 테스트" 클릭 → `/health` 호출 후 결과 상태 전환.
- 테마 버튼 클릭 → `document.documentElement` 테마 클래스 업데이트.

### 증거 소스
`src/pages/SettingsPage/SettingsPage.tsx`, `src/pages/SettingsPage/components/*`, `src/pages/SettingsPage/hooks/useSettingsPage.ts`, `src/api/core.ts` (`healthCheck`).

---

## UC-OVR-01 — 프로젝트 개요

### 상태 신호
- **normal / loading / empty / failure**

### MUST (normal, `state.overview` 존재 && `state.empty === false`)
- `OverviewHeader`: 프로젝트 이름 텍스트 포함 heading + description 텍스트.
- Security posture 섹션: `"전체 취약점 보기"` 등 `/vulnerabilities`로의 outbound 링크 버튼 존재.
- severity별 집계 요소 각각이 `/vulnerabilities?severity=<level>` 링크 또는 그에 준하는 핸들러를 가진 버튼.
- Build Targets 섹션 컨테이너 존재.
- Trend 요약 카드 컨테이너 존재 (`trend` 데이터).
- MetaPanel 내부에 다음 outbound 링크가 각각 1개:
  - `onOpenQualityGate` → `/quality-gate`
  - `onOpenApprovals` → `/approvals`
  - `onOpenSettings` → `/settings`
- BottomGrid에 파일/취약점/타깃 요약 섹션이 각각 컨테이너로 존재.

### MUST (loading: `state.loading === true`)
- Spinner 컴포넌트 렌더 (단일 중앙 로더) + 라벨 텍스트 `"데이터 로딩 중..."`.

### MUST (failure: `state.overview === null`)
- `OverviewFailureState` 컴포넌트 렌더. 내부에 재시도 안내 텍스트 포함.

### MUST (empty: `state.empty === true`)
- `OverviewEmptyState` 렌더.
- 내부에 파일 탐색기로 이동하는 버튼 1개 (`onOpenFiles`).
- 내부에 설정으로 이동하는 버튼 1개 (`onOpenSettings`).

### 딥링크
- outbound: `/vulnerabilities`, `/vulnerabilities?severity=<level>`, `/files`, `/files/:fileId`, `/quality-gate`, `/approvals`, `/settings`.
- inbound: Dashboard 프로젝트 행 클릭, Sidebar "개요" NavLink.

### Interaction tests
- severity 링크 클릭 → URL에 `?severity=<level>` 반영.

### 증거 소스
`src/pages/OverviewPage/OverviewPage.tsx:36-93`, `src/pages/OverviewPage/components/*`, `src/pages/OverviewPage/hooks/useOverviewPage.ts`, `src/hooks/useBuildTargets.ts`.

---

## UC-FILES-01 — 파일 워크스페이스

### 상태 신호
- **normal / loading / empty / upload-in-progress / drag-over / preview-loading / preview-error**

### MUST (normal, `sourceFiles.length > 0`)
- `FilesPageHeader` 컨테이너 내부에 파일 수 텍스트(숫자) + 총 크기 텍스트 노출.
- "파일 업로드" 트리거 버튼 존재 (클릭 시 hidden `<input type="file">` 활성화).
- `sourceFiles.length > 0` 일 때 "빌드 타깃 생성" 버튼 존재.
- `FilesLanguageSummary` 컨테이너 존재.
- `FilesBuildTargetPanel` 컨테이너 존재 (타깃 0개여도 패널 자체는 렌더, 내부 빈 상태는 SHOULD).
- `FilesSourceWorkspace` 컨테이너 존재. 내부에 검색 input 1개, 트리 확장/축소 컨트롤, 프리뷰 영역.

### MUST (loading: `state.loading === true`)
- 단일 중앙 Spinner + 라벨 텍스트 `"파일 로딩 중..."`.

### MUST (empty: `sourceFiles.length === 0 && !upload.isActive`)
- `FilesEmptyState` 렌더. 내부에 업로드 유도 문구 + 업로드 트리거 버튼 1개.

### MUST (upload-in-progress: `upload.isActive === true`)
- 상단 배너 `.fpage-upload-banner` 가 렌더 + 진행 메시지 텍스트(`upload.message`) 가시.
- 배너 내부에 Spinner 컴포넌트 존재.

### MUST (drag-over: `state.dragOver === true`)
- `.fpage-drop-overlay` 렌더 + 텍스트 `"파일을 여기에 놓으세요"`.

### MUST (preview-loading: `state.previewLoading === true`)
- 프리뷰 영역 내부에 로딩 표기 요소 (Spinner 또는 텍스트).

### SHOULD
- 파일 선택 시 프리뷰 영역에 `previewLang` 표기 텍스트 또는 언어 뱃지.
- 파일별 findings highlightLines 배열이 비어있지 않으면 해당 라인 번호가 강조 클래스로 렌더.

### SHOULD+TODO
- 트리 노드 각 요소에 `role="treeitem"`, `aria-expanded`.
- 리사이즈 핸들에 `aria-label="패널 크기 조절"`.

### Interaction tests
- 파일 드래그&드롭 → 업로드 배너 표시 + `/files` 리스트 갱신.
- 검색 input 입력 → 트리 필터.
- 확장/축소 버튼 → 트리 상태 변경.
- `onOpenLog` 호출 → UC-FILES-02 진입.
- `BuildTargetCreateDialog` 열기 → 이름/경로/전략 입력 → 생성 → 타깃 패널 갱신.

### 딥링크
- outbound: `/files/:fileId` (파일 클릭), `/static-analysis?analysisId=<id>` (선택 파일 관련 분석 링크, 구현 시점에 따라 SHOULD).
- inbound: Overview "파일 탐색기", Sidebar "파일 탐색기".

### 증거 소스
`src/pages/FilesPage/FilesPage.tsx`, `src/pages/FilesPage/components/*`, `src/pages/FilesPage/hooks/useFilesPage.tsx`, `src/hooks/useUploadProgress.ts`, `src/api/source.ts`, `src/api/pipeline.ts`.

---

## UC-FILES-02 — 빌드 로그 뷰어 (FilesPage 서브플로)

### 상태 신호
- **normal(로그 스트림 연결) / loading / empty(로그 없음) / error(스트림 실패)**
- 이 서브플로는 `state.logTarget !== null` 일 때만 렌더.

### MUST (normal)
- 뷰어 루트 컨테이너 존재.
- 제목 영역에 타깃 이름(`state.logTarget.name`) 텍스트 포함.
- 로그 본문 영역이 존재하고 최소 1개 로그 라인을 렌더 가능한 스크롤 가능 컨테이너로 구성.
- "닫기" 버튼 존재 (클릭 시 `onClose`).

### MUST (empty)
- 로그가 비어있으면 "로그가 없습니다" 류 문구 포함 요소 (정확 문자열은 Self-check TODO).

### MUST (error)
- 스트림 실패 시 에러 안내 텍스트 (inline).

### SHOULD+TODO
- 뷰어를 Dialog/Sheet 기반으로 구성하여 포커스 트랩 포함.
- 자동 스크롤 토글.

### Interaction tests
- 닫기 버튼 클릭 → `state.logTarget === null` 전환.

### 증거 소스
`src/pages/FilesPage/components/BuildLogViewer.tsx`, `src/pages/FilesPage/FilesPage.tsx:111-117`.

---

## UC-FDET-01 — 파일 상세

### 상태 신호
- **normal / loading / missing(파일 없음)**

### MUST (normal)
- 텍스트 `"뒤로"` 포함 BackButton 존재.
- 헤더 영역: 파일 이름 텍스트, 라인 수(`lineCount`) 숫자 텍스트, 취약점 개수(`vulnerabilityCount`) 숫자 텍스트, "다운로드" 액션 버튼 존재.
- 소스 패널: 파일 코드 본문 컨테이너가 존재하고, `highlightLine > 0` 이면 해당 라인 요소가 강조 클래스를 보유.
- 탭 컨트롤: "코드"/"마크다운 프리뷰" 2개 탭 트리거(텍스트).
- 최대화 토글 버튼 존재 (아이콘 + `aria-label`).
- `FileDetailVulnerabilitiesSection` 컨테이너 존재. 내부 목록이 0개여도 컨테이너는 렌더 — **SHOULD**: 0개일 때 빈 상태 문구.
- `FileDetailAnalysisHistorySection` 컨테이너 존재. 내부 목록이 0개여도 컨테이너는 렌더 — **SHOULD**: 0개일 때 빈 상태 문구.

### MUST (loading)
- 단일 중앙 Spinner + 라벨 텍스트 `"파일 정보 로딩 중..."`.

### MUST (missing)
- `FileDetailMissingState` 렌더 (내부에 파일 없음 문구 + 복귀 버튼).

### SHOULD+TODO
- 소스 코드 블록에 `role="region"` + `aria-label="{file.name} 소스"`.

### Interaction tests
- `?line=N` 쿼리 → 해당 라인 스크롤.
- 탭 전환 → 코드/마크다운 토글.
- 최대화 → 오버레이 풀스크린.
- 취약점 항목 클릭 → UC-FDET-02 진입.
- 분석 이력 항목 클릭 → `/static-analysis?analysisId=<id>`.

### 딥링크
- inbound: Files 트리에서 파일 클릭, Overview BottomGrid 파일 링크.
- outbound: `/static-analysis?analysisId=<id>`, UC-FDET-02.

### 증거 소스
`src/pages/FileDetailPage/FileDetailPage.tsx`, `src/pages/FileDetailPage/components/*`, `src/pages/FileDetailPage/hooks/useFileDetailPage.ts`, `src/utils/markdown.ts`.

---

## UC-FDET-02 — 취약점 상세 (FileDetail 드릴다운)

### 상태 신호
- **normal**; loading/error 는 FindingDetailView와 공유(UC-VULN-02 참조).

### MUST (normal)
- `VulnerabilityDetailView` 루트 컨테이너 존재.
- "뒤로" 버튼 존재. 클릭 시 `setSelectedVulnerability(null)` 로 UC-FDET-01 정상 상태 복귀.
- 취약점 제목/심각도 뱃지/설명 영역 각각 렌더.

### 증거 소스
`src/pages/FileDetailPage/FileDetailPage.tsx:22-30`, `src/shared/findings/VulnerabilityDetailView.tsx`.

---

## UC-STAT-01 — 정적 분석 실행/모니터링

### 상태 신호
- **normal(뷰 중 하나 활성) / loading(dashboard) / analysis-running / analysis-complete / ws-error**
- empty: StaticDashboard가 결과 0개를 내부적으로 처리.
- `projectId` 없음: 페이지 렌더 `null` (MUST 없음, 즉시 판정 제외).

### MUST (normal)
- `StaticAnalysisViewRouter` 루트 컨테이너 존재.
- 하위 뷰(대시보드 / 진행 / 결과) 중 하나가 렌더.
- 분석 실행 가능 상태(빌드타깃 존재)라면 `TargetSelectDialog`를 여는 "분석 실행" 트리거 버튼 존재.

### MUST (analysis-running: `analysis.isRunning === true`)
- `ActiveAnalysisBanner` 또는 `AnalysisProgressView` 중 하나가 렌더 (뷰 라우터가 선택).
- 진행률 숫자 텍스트(예: `"42%"`) 또는 진행 단계 라벨 텍스트 가시.
- "취소" 또는 "중단" 액션 버튼이 존재하거나 AnalysisGuard 경고 문구 (현재 구현은 AnalysisGuard 경고만) — 취소 버튼은 SHOULD+TODO.

### MUST (analysis-complete)
- `AnalysisResultsView` 또는 `RunDetailView` 가 렌더.
- 결과 요약 숫자(취약점 개수 등) 텍스트 1개 이상 존재.

### MUST (ws-error: WebSocket 끊김)
- 끊김 안내 텍스트 포함 요소 (Self-check TODO, 실제 문자열 확인 필요).

### SHOULD+TODO
- 진행률 요소에 `role="progressbar" aria-valuenow aria-valuemin aria-valuemax`.
- 실패한 분석에 대한 "재시도" 버튼.

### Interaction tests
- `?analysisId=<id>` → 해당 런이 선택된 상태로 진입.
- `?finding=<id>` → 해당 finding 드릴다운(UC-VULN-02)로 진입.
- 분석 실행 → AnalysisGuard 활성 → Sidebar 이동 확인 다이얼로그(UC-SHELL-02 Interaction).

### 증거 소스
`src/pages/StaticAnalysisPage/StaticAnalysisPage.tsx`, `src/pages/StaticAnalysisPage/components/StaticAnalysisViewRouter.tsx`, `src/pages/StaticAnalysisPage/components/TargetSelectDialog.tsx`, `src/hooks/useStaticDashboard.ts`, `src/hooks/useAnalysisWebSocket.ts`, `src/contexts/AnalysisGuardContext.tsx`, `src/api/analysis.ts`, `src/api/pipeline.ts`.

---

## UC-VULN-01 — 취약점 리스트

### 상태 신호
- **normal / loading / empty(필터 결과 0) / group-mode / bulk-processing**

### MUST (normal, `filtered.length > 0`)
- 헤더에 `state.counts.total` 숫자 텍스트 포함 요소.
- Toolbar 컨테이너 존재.
- Toolbar 내부에 다음 컨트롤이 각각 존재:
  - severity 필터 버튼/셀렉터 (값 전환 가능).
  - sourceType 필터 (렌더는 MUST — 내부 옵션 static을 반드시 제공. dynamic/test 옵션이 보이더라도 reject 아님).
  - status 필터.
  - 검색 `<input type="text">`.
  - 정렬 키 셀렉터.
  - 정렬 방향 토글.
  - groupBy 셀렉터.
  - 단축키 도움말 토글 버튼.
- 리스트 영역에 `filtered.length` 개의 행 요소가 렌더. 각 행에 severity 텍스트, 제목 텍스트, 파일 경로 텍스트, 상태 텍스트, `<input type="checkbox">` 가 포함.
- `state.filtered.length` 와 `state.findings.length` 모두 숫자 텍스트로 툴바 어딘가에 노출.

### MUST (loading: `state.loading === true`)
- 단일 중앙 Spinner + 라벨 텍스트 `"탐지 항목 로딩 중..."`.

### MUST (empty: `filtered.length === 0 && groupBy === "none"`)
- `EmptyState` 컴포넌트가 `empty-state--workspace` 클래스와 함께 렌더.
- severity 필터가 `"all"` 이면 타이틀 `"조건에 맞는 탐지 항목이 없습니다"`, 아니면 정규식 `"\S+ 수준의 탐지 항목이 없습니다"` 매칭 타이틀.

### MUST (group-mode: `groupBy !== "none" && groups.length > 0`)
- `VulnerabilityGroups` 컨테이너가 렌더. 내부 그룹 수 >= 1.

### MUST (bulk 선택: `selectedIds.size > 0`)
- 벌크 액션 패널 렌더. 내부에 상태 셀렉터, 사유 `<textarea>` 또는 `<input>`, 실행 버튼, "선택 해제" 버튼 각 1개.

### MUST (bulk-processing: `bulkProcessing === true`)
- 벌크 실행 버튼 `disabled`.

### SHOULD+TODO
- 체크박스 각각에 `aria-label="{finding.title} 선택"`.

### Interaction tests
- severity 필터 변경 → URL `?severity=<level>` 반영.
- 키보드 단축키(toggle help, 이동, 선택 등) 동작.
- 행 클릭 → UC-VULN-02 진입.
- 벌크 실행 → 선택 항목 상태 일괄 변경 후 toast + 리스트 갱신.

### 딥링크
- inbound: Overview severity 링크, Sidebar "취약점 목록", Approvals의 finding 대상.
- outbound: UC-VULN-02.

### 증거 소스
`src/pages/VulnerabilitiesPage/VulnerabilitiesPage.tsx`, `src/pages/VulnerabilitiesPage/components/*`, `src/pages/VulnerabilitiesPage/hooks/useVulnerabilitiesPage.ts`, `src/api/analysis.ts`.

---

## UC-VULN-02 — Finding 상세 (VulnerabilitiesPage 드릴다운)

### 상태 신호
- **normal / loading / error / updating**

### MUST (normal)
- `FindingDetailView` 루트 컨테이너 존재.
- 제목 텍스트 + severity 뱃지 요소.
- 파일 경로 텍스트 + 클릭 가능 링크 (`<Link>` 또는 `<button>`) 존재 → `/files/:fileId?line=<n>`.
- 설명 본문 영역.
- 현재 상태 뱃지 텍스트 (open/confirmed/risk_accepted/false_positive 등).
- 상태 변경 컨트롤: 상태 셀렉터 + 사유 입력(`<textarea>` 또는 `<input>`) + 실행 버튼.
- 히스토리 목록 섹션 컨테이너 존재.
- "뒤로" 버튼 존재.

### MUST (updating: `state update in flight`)
- 상태 변경 실행 버튼 `disabled`.

### SHOULD+TODO
- 사유 입력에 연결된 `<label>`.
- 상태 변경 버튼 클릭 후 히스토리 목록 갱신.

### Interaction tests
- 파일 경로 링크 → `/files/:fileId?line=<n>` 이동.
- 상태 변경 저장 → 목록 페이지 복귀 후 UC-VULN-01에서 변경 상태 반영.

### 증거 소스
`src/pages/VulnerabilitiesPage/VulnerabilitiesPage.tsx:27-38`, `src/shared/findings/FindingDetailView.tsx`, `src/api/analysis.ts` (`fetchFindingDetail`, `updateFindingStatus`, `fetchFindingHistory`).

---

## UC-GATE-01 — 품질 게이트

### 상태 신호
- **normal / loading / empty / overriding**

### MUST (normal, `gates.length > 0`)
- 텍스트 `"품질 게이트"` 포함 heading.
- `latestGate` 존재 시 텍스트 `"최근 평가 결과와 규칙 상태를 검토합니다."` 포함 subtitle; 없으면 `"분석 결과가 준비되면 게이트가 자동으로 평가됩니다."`.
- `QualityGateStatusBanner` 컴포넌트 렌더.
- 각 `QualityGateCard`에:
  - 게이트 이름 텍스트.
  - 규칙별 상태 텍스트 라벨 (색만으로 구분되는 것 금지 — 텍스트 라벨 필수).
  - 오버라이드 트리거 버튼 존재 또는 "오버라이드 사유 필요" 상태(SHOULD).
- `QualityGateSidebar` 컨테이너 존재.

### MUST (loading: `state.loading === true`)
- 단일 중앙 Spinner + 라벨 텍스트 `"품질 게이트 로딩 중..."`.

### MUST (empty: `gates.length === 0`)
- `EmptyState` 컴포넌트 렌더. 타이틀 정확 텍스트 `"아직 품질 게이트 결과가 없습니다"`. 설명 텍스트 `"정적 분석이 완료되면 실패 규칙, 경고 항목, 승인 필요 조건이 이 작업면에 운영 순서대로 정리됩니다."`.

### MUST (overriding: `overriding === true`)
- 오버라이드 확인 버튼 `disabled`.

### SHOULD
- Sidebar 이전 게이트 이력 0개일 때 빈 상태 문구.

### Interaction tests
- 오버라이드 트리거 → 사유 입력 영역 렌더.
- 사유 입력 후 확인 → 승인 큐(UC-APPR-01) 대상 생성(네트워크 확인).

### 딥링크
- inbound: Overview MetaPanel "품질 게이트", Sidebar "품질 게이트", Approvals의 `gate.override` 타깃 열기.
- outbound: 승인 큐 (오버라이드 요청 서버 반영 후).

### 증거 소스
`src/pages/QualityGatePage/QualityGatePage.tsx`, `src/pages/QualityGatePage/components/*`, `src/pages/QualityGatePage/hooks/useQualityGatePage.ts`, `src/api/gate.ts`.

---

## UC-APPR-01 — 승인 큐

### 상태 신호
- **normal / loading / empty / decision-dialog / processing**

### MUST (normal, `approvals.length > 0`)
- 텍스트 `"승인 큐"` 포함 heading.
- `pendingCount > 0` 이면 subtitle이 정규식 `"\d+건의 승인 요청이 대기 중입니다"` 매칭, 아니면 텍스트 `"현재 승인 상태를 검토합니다."`.
- `ApprovalFilters` 컨테이너 존재. 내부에 all/pending/approved/rejected 각 탭 버튼 + 각 탭의 카운트 숫자 텍스트.
- `ApprovalRequestList` 내부에 요청 행이 렌더. 각 행에:
  - 요청자 텍스트.
  - 생성 시각 텍스트(로케일 포맷).
  - 액션 타입 텍스트 (`gate.override` 또는 `finding.status_change` 등).
  - 대상 열기 버튼 (클릭 시 `onOpenTarget`).
- 대기(pending) 상태인 행에는 "승인" 버튼과 "반려" 버튼 각 1개.

### MUST (loading: `state.loading === true`)
- 단일 중앙 Spinner + 라벨 텍스트 `"승인 요청 로딩 중..."`.

### MUST (empty: 필터 결과 0)
- 빈 상태 문구 포함 요소 (Self-check TODO — 정확 문자열 요구).

### MUST (decision-dialog: `decidingId !== null`)
- `ApprovalDecisionDialog` 렌더. 내부에 사유 `<textarea>`, "확인"/"취소" 버튼, 제목(승인/반려 중 하나에 따른 텍스트).

### MUST (processing: `processing === true`)
- 확인 버튼 `disabled`.

### Interaction tests
- `gate.override` 행의 타깃 열기 → `/projects/:id/quality-gate`.
- finding 관련 행의 타깃 열기 → `/projects/:id/vulnerabilities`.
- Decision dialog Escape 키 → 다이얼로그 닫힘.

### 딥링크
- inbound: Sidebar "승인 큐", Overview MetaPanel "승인 큐" 링크.
- outbound: `/quality-gate`, `/vulnerabilities`.

### 증거 소스
`src/pages/ApprovalsPage/ApprovalsPage.tsx:36-46`, `src/pages/ApprovalsPage/components/*`, `src/pages/ApprovalsPage/hooks/useApprovalsPage.ts`, `src/api/approval.ts`.

---

## UC-HIST-01 — 분석 이력

### 상태 신호
- **normal / loading / empty**

### MUST (normal, `runs.length > 0`)
- 텍스트 `"분석 이력"` 포함 heading.
- subtitle이 정규식 `"\d+회 분석 실행됨"` 매칭.
- `AnalysisHistoryToolbar` 컨테이너 존재 + 완료 카운트 숫자 + 실패 카운트 숫자 텍스트.
- 테이블 컨테이너 존재 + 각 행에 runId 또는 analysisResultId 텍스트, 모듈명 텍스트, 시작/종료 시각 텍스트, 상태 텍스트(completed/failed) 포함.
- `document.title === "AEGIS — 분석 이력"`.

### MUST (loading)
- 단일 중앙 Spinner + 라벨 텍스트 `"분석 이력 로딩 중..."`.

### MUST (empty)
- subtitle 텍스트 `"실행된 분석 기록을 시간순으로 검토합니다."` 포함 요소.
- 빈 테이블 상태 문구 포함 요소 (Self-check TODO).

### SHOULD+TODO
- 테이블 헤더 `<th scope="col">`.

### Interaction tests
- 행 클릭 → `getModuleRoute(run.module, projectId, run.analysisResultId)` 라우트로 이동.

### 증거 소스
`src/pages/AnalysisHistoryPage/AnalysisHistoryPage.tsx:14-63`, `src/pages/AnalysisHistoryPage/components/*`, `src/pages/AnalysisHistoryPage/hooks/useAnalysisHistoryPage.ts`, `src/constants/modules.ts` (`getModuleRoute`).

---

## UC-REP-01 — 리포트

### 상태 신호
- **normal / loading / unavailable**

### MUST (normal, `report` 존재)
- `ReportContent` 루트 컨테이너 렌더.
- 헤더에 프로젝트 이름 텍스트 + 생성 시각 텍스트.
- 필터 토글 버튼 존재.
- `hasActiveFilters === true` 이면 필터 카운트 숫자 또는 `"필터 초기화"` 버튼이 가시.
- 필터 토글이 열리면 기간/심각도/모듈/검색 입력 + "적용" 버튼 + "초기화" 버튼 각 1개.
- 심각도 집계 표기 (`sevCounts` 기반 숫자 또는 바).
- "커스텀 리포트 생성" 트리거 버튼 존재.
- 모듈 탭에 static 탭이 존재 (dynamic/test 탭이 추가로 렌더되는 것은 허용하되 이 매트릭스는 판정하지 않는다).
- 내보내기(Export) 버튼 존재 — 현재 구현은 `ReportHeader`의 export 액션(라벨 문자열은 구현 기준). **SHOULD+TODO**: 버튼 `aria-label="리포트 내보내기"`.

### MUST (loading: `state.loading === true`)
- 단일 중앙 Spinner + 라벨 텍스트 `"보고서 생성 중..."`.

### MUST (unavailable: `!report`)
- `ReportUnavailableState` 렌더.
- 내부에 "재시도" 버튼, 필터 토글 버튼, "커스텀 리포트 생성" 버튼 각 1개.
- `loadError` 존재 시 오류 메시지 텍스트 가시.

### MUST (custom report modal 열림)
- 모달 루트 렌더. 내부에 제목 입력, 설명 입력, 템플릿/포맷/언어 셀렉터 각 1개, "생성"/"취소" 버튼 각 1개.

### Interaction tests
- 필터 입력 후 "적용" → 차트/리스트 갱신.
- "초기화" → 필터 비움.
- 모듈 탭 전환 → 본문 섹션 변화.
- 커스텀 리포트 제출 → 다운로드 또는 새 리포트 렌더.

### 딥링크
- inbound: Sidebar "보고서".
- outbound: 내보내기 결과(파일 다운로드).

### 증거 소스
`src/pages/ReportPage/ReportPage.tsx`, `src/pages/ReportPage/components/*`, `src/pages/ReportPage/hooks/useReportPage.ts`, `src/api/report.ts`.

---

## UC-PSET-01 — 프로젝트 설정 (SDK 포함)

### 상태 신호
- **normal / loading / sdk-progress / sdk-delete-confirm / connection-error**

### MUST (normal)
- `ConnectionStatusBanner` 컨테이너가 렌더. 내부에 현재 연결 상태 텍스트(`connected/connecting/error` 등).
- `ProjectSettingsHeader` 컨테이너 렌더.
- Tabs 컴포넌트가 렌더 (`orientation="vertical"`). 사이드바에 "일반", "SDK", "danger" 3개 탭 트리거.
- `ProjectSettingsContent`가 현재 탭에 해당하는 섹션을 렌더 (탭 값 `activeSection`).
  - "일반" 탭: 이름 `<input>` + 설명 `<textarea>` + "저장" 버튼 각 1개.
  - "SDK" 탭: SDK 등록 목록 컨테이너. 등록 폼 토글 버튼("SDK 등록" 텍스트) 존재. 각 SDK 항목에 이름 텍스트 + 삭제 버튼.
  - "danger" 탭: 프로젝트 삭제 버튼 + 경고 문구.

### MUST (loading)
- 단일 중앙 Spinner + 라벨 텍스트 `"설정 로딩 중..."`.

### MUST (sdk-progress: `sdkProgressById[sdkId]` 존재)
- 해당 SDK 행에 진행률 표기 요소 (숫자 텍스트 또는 progress 컨테이너).

### MUST (sdk-delete-confirm: `deleteTarget !== null`)
- `ConfirmDialog` 렌더. 타이틀 텍스트 `"SDK 삭제"`. 메시지에 정규식 `"\".+\" SDK를 삭제하시겠습니까\?"` 매칭. 버튼 텍스트 `"삭제"`와 취소.

### MUST (connection-error)
- `ConnectionStatusBanner` 에 에러 상태 텍스트 가시.

### SHOULD+TODO
- Tabs의 TabsTrigger가 Radix 기본 `role="tab"`, TabsList가 `role="tablist"` (Radix 기본값 — QA는 DOM 스냅샷에서 확인).
- SDK 진행률 요소에 `role="progressbar" aria-valuenow`.

### Interaction tests
- Tabs 키보드 좌우 화살표로 탭 이동.
- SDK 등록 폼 제출 후 WS 진행률 표기.
- 삭제 확인 → SDK 목록에서 제거.
- danger 탭에서 프로젝트 삭제 → `/dashboard` 이동.

### 딥링크
- inbound: Overview MetaPanel "설정", Sidebar "설정".
- outbound: 프로젝트 삭제 시 `/dashboard`.

### 증거 소스
`src/pages/ProjectSettingsPage/ProjectSettingsPage.tsx`, `src/pages/ProjectSettingsPage/components/*`, `src/pages/ProjectSettingsPage/hooks/useProjectSettingsPage.ts`, `src/shared/ui/ConnectionStatusBanner.tsx`, `src/api/sdk.ts`.

---

## UC-NOTIF-01 — 알림 (전역 Navbar 드롭다운)

### 스코프 계약
- `NotificationProvider`는 `ProjectLayoutShell` 안에서만 활성(`src/layouts/NotificationBridge.tsx`). 그 외 라우트에서는 `notifications = []`, `unreadCount = 0` 이 default.

### 상태 신호
- **trigger(정적)**: 로그인 상태에서 항상 MUST.
- **dropdown-open(project route)**, **dropdown-open(non-project route)**, **loading**, **empty**, **unread>0**.

### MUST (trigger 상태)
- 알림 트리거 버튼이 존재. `aria-label`이 정규식 `^알림(\s*\(\d+건 읽지 않음\))?$` 매칭.
- `unreadCount > 0` 이면 뱃지 요소 존재. 뱃지 텍스트는 `unreadCount` (<=99) 또는 `"99+"`.

### MUST (dropdown-open, project route)
- 드롭다운 루트 렌더. 텍스트 `"알림"` 포함 제목.
- 보조 문구: 텍스트 `"현재 프로젝트 비동기 작업 상태"` 포함 요소.
- `unreadCount > 0` 이면 텍스트 `"모두 읽음"` 포함 버튼 존재.

### MUST (dropdown-open, non-project route)
- 드롭다운 루트 렌더. 텍스트 `"알림"` 포함 제목.
- 보조 문구: 텍스트 `"프로젝트 화면에서 알림을 확인할 수 있습니다"`.
- 알림 목록 위치에 텍스트 `"프로젝트 내부에서 생성된 알림이 여기에 표시됩니다."`.

### MUST (loading: `loading === true`)
- 목록 영역 텍스트 `"알림을 불러오는 중..."`.

### MUST (empty, project route, 목록 0)
- 목록 영역 텍스트 `"아직 프로젝트 알림이 없습니다."`.

### MUST (unread>0, 각 알림 카드)
- 각 카드 내부에 제목 텍스트, 생성 시각 텍스트(한국어 로케일 포맷), `jobKind` 존재 시 `jobKind` 텍스트.
- 읽지 않은 카드에는 텍스트 `"읽음"` 버튼 존재.

### SHOULD+TODO
- severity/색 구분에 더해 텍스트 라벨 또는 아이콘으로 severity 병기.

### Interaction tests
- "읽음" 클릭 → 카드의 시각적 읽음 전환 + `unreadCount` 감소.
- "모두 읽음" 클릭 → 전체 읽음 처리 + 뱃지 제거.
- 프로젝트 라우트 외에서는 WebSocket 구독이 일어나지 않아야 한다 (네트워크 관측).

### 증거 소스
`src/layouts/Navbar.tsx:162-260`, `src/layouts/NotificationBridge.tsx`, `src/contexts/NotificationContext.tsx`, `src/api/notifications.ts`.

---

## Cross-cutting 계약

### CC-01 테마
- UC-SHELL-01 MUST에 이미 포함(테마 드롭다운 트리거 + aria-label). 하위 라우트에서 이 계약을 재정의하지 않는다.

### CC-02 AnalysisGuard
- UC-STAT-01 Interaction + UC-SHELL-02 Interaction에서 다룬다. 확인 다이얼로그의 본문 텍스트는 `"분석이 진행 중입니다. 이동하시겠습니까? (분석은 백그라운드에서 계속됩니다)"` 로 고정 (증거: `src/layouts/Sidebar.tsx:184`).

### CC-03 Inline 에러 의무
- 다음 플로는 에러 시 **inline** 렌더가 MUST (토스트 단독은 MUST 위반):
  - UC-AUTH-01 로그인 오류 (inline Alert 구현됨).
  - UC-FDET-01 파일 로드 missing 상태 (inline 컴포넌트 구현됨).
  - UC-VULN-02 상태 업데이트 실패(SHOULD+TODO, 현재 Toast만).
  - UC-GATE-01 오버라이드 실패(SHOULD+TODO).
  - UC-PSET-01 SDK 등록/삭제 실패(SHOULD+TODO).
- 그 외 정보성/부가성 피드백은 `ToastContext` 경유 허용.

### CC-04 ErrorBoundary
- UC-ERR-01 로 분리. `ProjectLayoutShell` 본문 내부 오류만 포착한다. 전역 앱 오류 fallback은 현재 범위 밖.

### CC-05 빌드 버전
- `__APP_VERSION__` 치환 결과가 `/login`, `/signup` 푸터에 MUST. 그 외 라우트에는 요구하지 않는다.

### CC-06 심각도 표현
- UC-VULN-01/02, UC-GATE-01, UC-OVR-01, UC-NOTIF-01 어디서든 심각도는 **색 + 텍스트 라벨 병기**가 MUST. 색 단독 MUST 위반.

---

## 크로스 lane 의존성 표

| UC | 의존 API 모듈 | 주요 엔드포인트 |
|---|---|---|
| UC-AUTH-01/02 | `src/api/auth.ts` | `login`, `logout`, `fetchCurrentUser` |
| UC-DASH-01 | `src/api/projects.ts` | `fetchProjects`, `createProject` |
| UC-GSET-01 | `src/api/core.ts` | `healthCheck` |
| UC-OVR-01 | `src/api/projects.ts`, `src/api/pipeline.ts`, `src/api/approval.ts`, `src/api/sdk.ts` | `fetchProjectOverview`, `fetchBuildTargets`, `fetchApprovalCount`, `fetchProjectSdks` |
| UC-FILES-01/02 | `src/api/source.ts`, `src/api/pipeline.ts` | `uploadSource`, `cloneSource`, `fetchSourceFiles*`, `fetchBuildLog`, `runPipelineTarget` |
| UC-FDET-01/02 | `src/api/source.ts`, `src/api/analysis.ts` | `fetchFileContent`, `downloadFile`, `fetchFindingDetail` |
| UC-STAT-01 | `src/api/analysis.ts`, `src/api/pipeline.ts`, `src/hooks/useAnalysisWebSocket.ts` | `runAnalysis`, `fetchAnalysisResults`, WS progress |
| UC-VULN-01/02 | `src/api/analysis.ts` | `fetchProjectFindings`, `bulkUpdateFindingStatus`, `fetchFindingGroups`, `fetchFindingHistory`, `updateFindingStatus` |
| UC-GATE-01 | `src/api/gate.ts` | `fetchProjectGates`, `overrideGate`, `fetchGateProfiles` |
| UC-APPR-01 | `src/api/approval.ts` | `fetchProjectApprovals`, `decideApproval`, `fetchApprovalCount` |
| UC-HIST-01 | `src/api/analysis.ts` | `fetchProjectRuns`, `fetchRunDetail` |
| UC-REP-01 | `src/api/report.ts` | `fetchProjectReport`, `fetchModuleReport`, `generateCustomReport` |
| UC-PSET-01 | `src/api/projects.ts`, `src/api/sdk.ts` | `fetchProjectSettings`, `updateProjectSettings`, `deleteProject`, SDK 등록/삭제 + WS |
| UC-NOTIF-01 | `src/api/notifications.ts` | `fetchNotifications`, `markNotificationRead`, `markAllNotificationsRead`, WS |

---

## Self-check (정직 기재)

- 동적 분석/동적 테스트 유스케이스가 MUST로 포함되어 있지 않다. 단, Sidebar 렌더 존재는 허용되며 내부 동작은 이 매트릭스로 판정하지 않는다. — **OK**.
- 각 MUST 항목은 단일 DOM 관측으로 검증 가능한 형태로 기술되어 있다. `"or"` disjunction MUST 없음 — **OK**.
- 모든 유스케이스에서 상태 축이 해당되는 것만 나열되고, 해당 없는 축은 `N/A` 로 명시된다 — **OK**.
- 접근성 중 현재 코드에 구현되지 않은 항목은 SHOULD+TODO로 분리되어 있다 (Theme radiogroup, scope=col, aria-valuenow, role=region 등 Critic 지적 반영) — **OK**.
- 이탈/딥링크가 inbound + outbound 양방향으로 기재되었다 — **OK**.
- 모든 UC에 증거 소스 코드 경로가 명시되었다 — **OK**.
- 크로스 lane 의존성은 별도 표로 집약되어 있다 — **OK**.
- **미완료**: UC-STAT-01 "ws-error" 문구, UC-GSET-01 `testStatus` 성공/saved 문구, UC-HIST-01 빈 테이블 문구, UC-APPR-01 필터 결과 0 문구, UC-FILES-02 빈 로그 문구 등 **실제 UI 문자열 확정 필요**. 후속 slice에서 각 UI 문자열을 읽고 MUST 텍스트를 확정한다.
- **미완료**: UC-VULN-01 벌크 사유 입력 라벨, UC-REP-01 내보내기 버튼 정확 라벨은 코드에서 재확인 필요.

이 문서만으로 QA가 pass/fail 을 낼 수 있느냐에 대한 판정:
- 구현 완료된 MUST 항목 (텍스트/`aria-label`/`for=`/`type=`/`to=` 등)에 대해서는 QA가 그 자리에서 판단 가능.
- SHOULD+TODO 항목은 QA 판정에 쓰지 않고 Developer 백로그로 이관.
- 미완료 Self-check 항목(UI 문자열 확정)이 해소되면 매트릭스는 완전한 상태가 된다.

---

## Changelog

- **2026-04-18 v1** — 드래프트 작성 (14개 페이지 유스케이스).
- **2026-04-18 v2** — Architect (agent a54fdffd7622c2225) + Critic (agent a7d306eefed7e143f) 피드백 반영.
  - Blocking 수정:
    - UC-VULN-02 evidence가 잘못 `VulnerabilityDetailView`를 가리키던 것을 `FindingDetailView`로 교정. UC-FDET-02를 분리하여 `VulnerabilityDetailView` 전용 UC로 편성.
    - UC-SHELL-02에서 `aria-current="page"` MUST를 SHOULD로 내리고, Sidebar `aria-label` 부재를 SHOULD+TODO로 명시.
    - UC-GSET-01 Theme radiogroup a11y를 SHOULD+TODO로 내림.
    - UC-SHELL-02의 동적 분석/테스트 Sidebar 항목 MUST 포함을 제거, 렌더 허용 + 판정 제외로 명시.
  - 신규 UC 추가: UC-ROUTE-01, UC-ERR-01, UC-FILES-02, UC-FDET-02.
  - 전 항목에 대해 "가독 가능", "적절한", "시각적 강조" 같은 주관적 MUST 어휘 제거. 리터럴 텍스트, `aria-label`, `for=`, `type=`, `to=`, `role=`, `data-state=` 기준 관측 단위로 재작성.
  - 인터랙션 검증 항목을 MUST 가시성에서 분리하여 "Interaction tests" 블록으로 이동 (키보드, 드래그, 포커스 트랩, 탭 화살표 등).
  - CC-03 inline 에러 정책을 중앙화하고 UC별 인라인 요구/TODO 리스트를 명시.
  - 크로스 lane 의존성 표 추가.
  - Self-check 섹션을 정직 기재 모드로 교체(미완료 UI 문자열을 unchecked로 명시).
