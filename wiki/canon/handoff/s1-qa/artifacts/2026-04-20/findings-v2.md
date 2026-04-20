# S1-QA Findings v2 — 디자이너 mock 반영도 심층 검수 (소스 근거 보강)
- 세션: `s1-qa / 2026-04-20-mock-adherence-qa-v2`
- 배경: v1(`.omc/autopilot/findings.md`)은 Playwright 렌더 결과 + 핵심 소스 일부만으로 판정. 사용자 지적("프론트 코드 전부 안 봤다") 수용하여 이번엔 소스 전수 스캔으로 재판정.
- 검수 범위:
  - `services/frontend/src/styles/handoff/**/*.css` — 21개 파일, 디자이너 mock 18개 CSS와 1:1 diff + 3개 S1 extension
  - `services/frontend/src/pages/**` — 16 페이지 (Login/Signup/Dashboard + 프로젝트 내부 13)
  - `services/frontend/src/layouts/**`, `contexts/**`, `shared/**`, `api/**`, `hooks/**`, `utils/**`, `constants/**`
- 도구: Read + Grep + Explore sub-agents ×3 (CSS diff / pages audit / infra audit)
- 이전 WR(`wiki/canon/work-requests/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds.md`)은 S1이 이미 처리 착수 — 수정 불가, 본 v2는 **보완 WR**로 송부

## Executive Summary (정정 포함)
- **디자인 토큰 시스템 v1 판단에 오류 있었음** — compat.css가 `--cds-*` → handoff `--primary / --severity-* / --background` 등으로 프록시되는 **1-way 호환 레이어**. 3-way 병존 주장(v1 P2-3)은 **철회**.
- **mock CSS 복제 품질 매우 높음** — 18쌍 중 16쌍 바이트 단위 동일. `fonts.css`만 CDN→로컬 경로 전환(의도적), `dashboard.css`만 3개 규칙 추가(S1 UI 확장).
- **handoff-only 확장(compat/app-shell/page-surfaces)** 은 mock 자산에 없지만 **design-system 규칙과 정합적** — 토큰 재매핑, 페이지 쉘, 페이지 표면 스타일.
- **그러나 core 이슈는 CSS가 아니라 React 컴포넌트 레이어** — Activity feed와 Attention card가 `.panel`/`.att-card` 마크업은 준수하면서도 mock HTML에 구현된 **내러티브·아이콘 다양성·laser bar·arrow affordance·footer meta**가 통째로 누락됨. 토큰이 옳아도 렌더가 단조.
- **PII/보안/기능 측면 P0 없음** 여전히 없음.

## 이전 WR 17개 항목 재판정

| ID | v1 등급 | v2 판정 | 소스 증거 |
|---|---|---|---|
| P1-1 KPI sub | P1 | **유지** | `DashboardPage.tsx:52-57` "프로젝트 활성 · 최근 활동 · 우선 확인" 하드코딩. critical/approvals KPI 없음 |
| P1-2 테이블 컬럼 누락 | P1 | **유지** | `ProjectExplorer.tsx` projects panel 열 정의에 approvals/owner 없음 (mock table columns 9→impl 7) |
| P1-3 live-signal footer | P1 | **유지(보강)** | `RecentActivitySection.tsx:21` `.activity-foot`에 "최근 흐름 요약 · project-derived" 정적 텍스트. `NotificationContext.tsx:79-134` WS는 구독하나 Dashboard activity가 그 스트림에 연결되지 않음 |
| P1-4 Activity 내러티브 | P1 | **유지(확정 강화)** | `useDashboardActivityFeed.ts:37-49` `buildPrimaryActivityEvent()`가 **mock API `/api/projects/:id/activity`가 리턴하는 `ACTIVITIES[]`를 완전히 무시**하고 project 메타 1건으로 재생성. description="가장 마지막 수정" 하드코딩. `ActivityEventCard.tsx:11`은 `<span className="activity-icon success"><Check /></span>` 고정 — event.type 필드 사용 지점 0개 |
| P1-5 Attention 서술 | P1 | **유지(확정 강화)** | `AttentionProjectCard.tsx:39` `탐지 항목 {total}건 · 미해결 {unresolvedDelta ?? 0}건 · {recentProjectUpdate(project)}` 템플릿만. mock의 "X critical, Y high 신규 — +N 증가" 운영 서술 없음. 또 mock `.att-progress` laser bar / `.att-foot .arrow` / 승인/ETA 메타 전부 미구현 |
| P1-6 음수 렌더 | P1 | **유지** | `AttentionProjectCard.tsx:39` 방어 코드 없이 `unresolvedDelta ?? 0`만. 음수 값이 상위에서 오면 그대로 노출됨 |
| P1-7 CTA/섹션 라벨 | P1 | **유지** | `DashboardPage.tsx:51,61-62`, `ProjectExplorer` — "우선 확인", "프로젝트 탐색기", "프로젝트 추가" 문자열 하드코딩 |
| P1-8 CTA 중복/위치 | P1 | **유지** | `DashboardPage.tsx:62`에 "프로젝트 추가" + `ProjectExplorer.tsx`에 "새 프로젝트" 두 CTA 공존 |
| P1-9 severity-low 컬러 | P1 | **범위조정** | `tokens.css:55` `--severity-low: oklch(0.62 0.12 230)` mock §3.4와 일치. `utils/severity.ts:7` 올바른 토큰 참조. **그러나 `index.css:70`에 `--aegis-severity-low: #00539a` 별도 하드 정의**와 `compat.css:52` `var(--severity-low)` 프록시가 동시 존재 → **CSS load order에 따라 토큰 값 불일치 가능**. Report bar 녹색은 handoff `--success: oklch(0.62 0.14 150)` (tokens.css:100)으로 추정, severity 규칙 위반이 아닐 수도 있음. **"Report/Vulnerabilities 컬러 혼재" 주장의 근거 약함, 토큰 이중 정의만 유지** |
| P1-10 승인/거부 severity 버튼 | P1 | **유지** | `components/ui/button.tsx:5-16` destructive variant → danger. `ApprovalDecisionDialog.tsx:60-61` 사용. DESIGN.md §3.4 규칙 위반 |
| P1-11 mock handler 미처리 | P1 | **유지(경로 확정)** | `api/source.ts:132` `apiFetch('/api/files/${fileId}/content')` 호출. `mock-handler.ts:156-157`은 `/api/projects/:id/source/file*` 만 라우팅 — 프로젝트 범위 밖 `/api/files/*/content` 핸들러 없음 |
| P1-12 title flash | P1 | **철회** | `useDashboardDocumentTitle.ts` + `AnalysisHistoryPage.tsx:25` 등 **모두 useEffect로 설정하나 index.html 초기 title "AEGIS"가 있어 페이지 진입 시 일시 표시됨. 이는 SPA 공통 패턴이며 각 페이지 hook 일관성 유지됨**. "drift"로 분류한 것은 지나침. 철회 |
| P2-1 sidebar DS gap | P2 | **유지** | `Sidebar.tsx:50-90` + `tokens.css:132-142` `--aegis-sidebar-*` 정의 존재. DESIGN.md §2/§11에 sidebar 미언급은 여전함 — 디자이너/S1 합의 하에 DESIGN.md 갱신 권장 |
| P2-2 typography | P2 | **유지(확정)** | `handoff/fonts.css`에 Paperlogy 5-weight @font-face 선언. 그러나 `index.css:113,559` `--cds-font-sans: 'Geist Variable', 'Pretendard', system-ui, sans-serif` 로 body font가 덮임. `compat.css`에 font-family 매핑 없음. Paperlogy가 실제 적용되는 경로 없음 — 선언만 있고 유휴 |
| P2-3 token 3-way 병존 | P2 | **철회** | `compat.css:1-63` 전체가 `--cds-* → handoff` 프록시. shadcn `--primary / --card / --ring` 도 `index.css:469` `--primary: #0f62fe` 설정 후 `@theme inline`으로 handoff 토큰 참조. **실질적으로 handoff → shadcn/Carbon 1-way 통합**. 주장 근거 상실. 단 `index.css:70` `--aegis-severity-low: #00539a` 같은 **하드코딩 중복 정의**가 남아 있어 "완전 통일"이라고 하긴 어려움 — **철회하되 새 항목(N-1) 신설** |
| P2-4 Card vs Panel | P2 | **유지** | Dashboard는 `.panel`, 기타 페이지(Overview/Report/ProjectSettings 등)는 shadcn `<Card>`. 시각 rhythm 이중 운영 |
| P2-5 running indicator | P2 | **범위조정** | project/target status enum은 `"ready" \| "building"` (mock-data.ts, target)과 pipeline의 `"running"` (separate). `.gate.running` CSS는 severity.css에 정의돼 있으나 **Attention card level에서 laser bar/dot pulse 마크업이 렌더되지 않음** (`AttentionProjectCard.tsx` 에 `.att-progress` 요소 없음). 데이터 fixture가 아니라 **컴포넌트 마크업 누락**으로 재분류 |
| P2-6 danger icon | P2 | **유지** | `DangerZoneSection.tsx` `<AlertTriangle>` 아이콘이 severity-red 컨텍스트. DESIGN.md §3.4와 충돌 |
| P2-7 heartbeat 정적 | P2 | **유지(확정)** | `LoginPage.tsx:8` `heartbeatTimestamp` 모듈 레벨 상수, `Line 45` `<span className="hb-num">4</span>` 하드코딩. mock `setInterval` 0..9 순환 미구현 |
| P2-8 title flash | P2 | **철회** | P1-12와 동일 사유 |

### 재판정 요약
- **유지(13)**: P1-1,2,3,4,5,6,7,8,10 + P2-1,2,4,6,7
- **범위조정(3)**: P1-9, P2-5 (기존 근거 약해지고 새 근거로 대체), P1-11(경로 확정)
- **철회(3)**: P1-12, P2-3, P2-8
- **근거 강화(2)**: P1-4, P1-5 (소스 하드코딩 확정)

## 신규 Findings (소스 근거 100%)

### P1 — 사용성/계약 위반

**[N-1 IMPL-BUG · /dashboard]** Activity feed가 백엔드 `ACTIVITIES[]` 완전 무시.
- `mock-handler.ts:202` `sub.startsWith("/activity")` → `data.ACTIVITIES` 반환
- 하지만 `useDashboardActivityFeed.ts:30-49`는 projects를 map하여 자체 event 생성. **activity endpoint 한 번도 호출 안 됨**.
- 결과: 실제 backend activity stream이 오더라도 UI에 안 붙음. WS 구독도 무의미.
- 기대: `useDashboardActivityFeed`가 `/api/projects/:id/activity` 호출하고, 각 event의 `type`/`icon`/`html` 필드를 `ActivityEventCard`에서 읽어 렌더.

**[N-2 PATTERN-DRIFT · /dashboard]** AttentionProjectCard에서 mock의 3대 시각 signal 모두 누락:
- `.att-progress` laser bar (running 상태)
- `.att-foot .arrow` 우측 arrow 아이콘
- `.att-foot .left span` 서술 ("3분 전 완료 · 승인 2건 대기" 같은 이벤트 맥락)
- 증거: `AttentionProjectCard.tsx:30-45` 마크업 전수
- 기대: mock `Dashboard.html:131-250` 의 `.att-progress::after`, `.att-foot > .left > span + .sep + span`, `svg.arrow` 재현.

**[N-3 DS-VIOLATION · tokens duplicate]** `index.css:70,312` 에 `--aegis-severity-low: #00539a` 하드 정의 vs `compat.css:52` `--aegis-severity-low: var(--severity-low)` 프록시.
- handoff 토큰이 source of truth여야 하는데 두 정의가 **CSS load order에 따라** 경합.
- 기대: index.css의 `--aegis-severity-*` 직접 정의 삭제, compat.css로 일원화.

### P2 — 디자인/일관성

**[N-4 IMPL-MINOR · /dashboard]** Activity feed "project-derived" 정적 라벨.
- `RecentActivitySection.tsx:21` (추정)에 `<div class="activity-foot">...최근 흐름 요약 · project-derived</div>`. 사용자에게 "derived" 가 무엇인지 불명확.
- mock은 `.activity-foot`에 `<span class="live-dot"></span> WS 연결됨 · 실시간 스트림`.
- 기대: mock copy로 교체 + N-1 완료 후 실제 live 연결 시그널 표출.

**[N-5 COPY-DRIFT · /signup]** 이전 v1 OK로 분류했으나 재검토 결과: `SignupFormCard.tsx:214` 하단 링크 텍스트 `로그인` (mock: `Login.html`로 가는 hyperlink) 정상. 다만 **submit 버튼 텍스트**는 mock `가입 요청 제출` 일치 확인. 신규 이슈 아님 — 정보 기록 목적.

### Withdrawn (v1 잘못 지적)
- **P1-12 title flash** — 공통 SPA 패턴, 각 페이지 일관
- **P2-3 token 3-way 병존** — compat.css로 handoff → cds/shadcn 1-way 프록시 확인. 사실상 일원화
- **P2-8 title flash (중복)** — P1-12와 동일

## 검수한 파일 수
- Read로 직접 연 파일: 메인 컨텍스트에서 39개 (+ 이전 세션 20개)
- 3 sub-agent가 연 파일: 누적 약 80+ (CSS 21 + pages 34+ + api 16 + hooks 8 + contexts 4 + utils 7 + shared + main)
- Grep/Glob 수행: 25회 이상
- 스크린샷 16장(이전 세션 수집) 재활용

## 증거 아티팩트
- 본 문서: 이 파일 (`wiki/canon/handoff/s1-qa/artifacts/2026-04-20/findings-v2.md`)
- v1: `./findings.md` (동일 디렉토리)
- 스크린샷: `./qa-screenshots/qa-*.png` (16)

## 범위 밖
- 테스트 파일(`*.test.*`)의 품질
- 백엔드 API contract / WebSocket payload
- 빌드/번들링 최적화
- 이전 QA 사이클의 visual baseline regression

## QA 쓰기 검증
- `services/frontend/**` 에 Edit/Write 0건
- `wiki/**` 직접 파일 쓰기 0건 (aegis-static-wiki MCP register_wr/record_session_history/append_test_evidence만 사용)
- git 조작 0건
