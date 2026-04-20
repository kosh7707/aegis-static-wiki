# S1-QA Findings — 디자이너 mock 반영도 검수
- 세션: s1-qa-2026-04-20-mock-adherence
- 대상 impl: `services/frontend` (S1 구현 완료본)
- 기준 mock: `wiki/canon/design-system/` (DESIGN.md + `mocks/{Login,Signup,Dashboard}.html` + `assets/*` — aegis-static-wiki repo 내 canonical 캡처)
- 환경: Chromium via Playwright MCP, http://localhost:5180, `VITE_MOCK=true`, light + dark 샘플
- 검수 범위: 14개 운영 라우트 + auth 2 + file detail. dynamic-analysis/dynamic-test는 사용자 지시로 스킵.
- 평가 기준: design-mock-review-workflow single-cycle rule. mock-layer(copy/token/signature/layout/pattern) vs impl-layer(버그/데이터/mock handler) 구분.

## Executive Summary
- **Login / Signup / Dashboard** 3개 mock 완성본 페이지는 HTML 구조와 copy 레벨에서 1:1 반영됨. CSS 토큰/컴포넌트가 `services/frontend/src/styles/handoff/` 로 통째 포팅됨. 전반적으로 디자이너 의도가 올바르게 옮겨짐.
- **Dashboard는 "부분"이 정확함** — Tweaks 패널, attention-grid, projects 테이블, activity feed의 골자는 구현. 단 `가장 마지막 수정 N일 전` 식 축약 서술, 컬럼 누락, live-signal 누락, KPI copy 교체 등 mock이 강조한 운영 시그널이 약해짐.
- **기타 페이지(Overview/Static Analysis/Files/Vulnerabilities/Analysis History/Report/Quality Gate/Approvals/Settings*2/File Detail)**: 디자이너가 HTML을 주지 않은 영역으로, S1이 DESIGN.md 기반 해석 구성. 페이지 골격과 severity palette 기초는 따라감. 단 `--cds-*` (Carbon) 토큰 스택과 shadcn `Card` 컴포넌트가 handoff token/panel 시스템과 **병존**하여 디자인 일관성 저하. Paperlogy·Geist Mono 이분 typography가 반영되지 않음. Severity color가 non-severity UI(승인/거부 버튼, 위험구역 아이콘)에 사용되어 DESIGN.md §3.4의 "severity NEVER appear on non-severity UI" 규칙 위반.
- **P0 블로커는 발견되지 않음.** 모든 라우트 진입 정상, error boundary 미노출.

## Findings (bucketed)

### P1 — 사용성/계약 위반 (수정 권장)

| # | Tag | 페이지 | 내용 | 증거 |
|---|---|---|---|---|
| P1-1 | COPY/SEMANTIC | /dashboard | 페이지 헤더 sub의 운영 KPI 교체. mock: `N 프로젝트 활성 · X critical open · Y 승인 대기 · 마지막 동기화 HH:MM`. impl: `N 프로젝트 활성 · N 최근 활동 · N 우선 확인`. "critical open / 승인 대기" KPI 상실. | `qa-dashboard-light.png`, DashboardPage.tsx:52-58 |
| P1-2 | STRUCTURAL | /dashboard | 프로젝트 테이블 컬럼 누락. mock 9개(프로젝트/게이트/크리티컬/하이/미디엄/오픈/**승인대기**/마지막분석/**담당**). impl 7개 — 승인대기·담당 없음. mock cell-owner 패턴(mini-avatar + 이름) 미적용. | `qa-dashboard-light.png` table header |
| P1-3 | PATTERN | /dashboard | Activity feed footer "WS 연결됨 · 실시간 스트림" + `.live-dot` pulse 미구현. DESIGN.md §8.1 "Live / Running indicator" 3대 패턴 중 2개(dot pulse, laser bar)가 dashboard 수준에서 관찰되지 않음. | `qa-dashboard-light.png` 활동 패널 foot |
| P1-4 | SEMANTIC | /dashboard | Activity feed 내러티브 단조. mock은 `<b>motor-control-unit</b> Quality Gate <b>BLOCKED</b> — 룰 3/7 실패` 같이 event type별 서술. impl은 모든 항목 `{프로젝트명} 가장 마지막 수정 · N일 전` 패턴만. `<span class="proj">` primary color 링크, severity numeral tint 미활용. | `qa-dashboard-light.png` 최근 활동 |
| P1-5 | SEMANTIC | /dashboard | Attention card body 축약. mock: `14 critical, 23 high 신규 — 마지막 스캔에서 +9 증가` / `Static 분석 64% · Agent · taint-flow heuristic`. impl: `탐지 항목 5건 · 미해결 2건 · 최근 업데이트 · 25일 전`. 운영 맥락 서술이 통계 요약으로 퇴보. | `qa-dashboard-light.png` 우선 확인 카드 |
| P1-6 | DATA-BUG | /dashboard | Attention card "바디 컨트롤 모듈 ... 미해결 **-1**건" 음수 렌더. 계산식 버그로 추정. | `qa-dashboard-light.png` 두 번째 카드 |
| P1-7 | COPY | /dashboard | 섹션/CTA 라벨 drift: `우선 확인`(mock: 주의 필요), `프로젝트 탐색기`(mock: `프로젝트 12` with count badge), `프로젝트 추가`(mock: `새 프로젝트`). panel-head count badge 패턴(`<h3>프로젝트 <span class="count">12</span></h3>`) 미반영. | `qa-dashboard-light.png` |
| P1-8 | LAYOUT | /dashboard | `새 프로젝트` CTA가 상단 actions(mock)가 아니라 projects panel-tools 우측에 배치됨. 상단 actions에는 `프로젝트 추가`가 이미 있어 CTA 중복. | DashboardPage.tsx:61-63 + ProjectExplorer 내부 |
| P1-9 | DS-VIOLATION | Report, Vulnerabilities | Severity `low` 컬러 불일치. DESIGN.md §3.4 `low: muted-blue oklch(0.62 0.12 230)`. Report 페이지에서 "낮음" 수평 바가 **녹색**(success green으로 추정), Vulnerabilities 리스트 `src/crypto_utils.c`는 blue-ish teal. 두 페이지에서 표현 혼재. | `qa-report.png` 심각도 분포 바, `qa-vulnerabilities.png` 첫 row rail |
| P1-10 | DS-VIOLATION | /projects/*/approvals | `승인` 버튼 녹색 / `거부` 버튼 빨강. DESIGN.md §3.4 "Severity colors NEVER appear on non-severity UI (buttons, links, navigation)" 규칙 위반. mock은 `.btn-primary` + `.btn-danger`만 정의하며 성공계 녹색 버튼은 없음. | `qa-approvals.png` 하단 버튼 |
| P1-11 | IMPL-BUG | /projects/*/files/:fileId | mock handler 미처리 경로 `GET /api/files/f-1/content` → 콘솔에 `[MOCK] Unhandled` 경고 2회. 파일 source preview가 비어 있음(0줄 표시). 사용자가 파일 선택 시 "발견된 취약점 0건" 문구만 보고 content를 못 봄. | `qa-file-detail.png`, mock-handler.ts:187 |

### P2 — 디자인/일관성 개선

| # | Tag | 페이지 | 내용 | 증거 |
|---|---|---|---|---|
| P2-1 | DS-VIOLATION | project 라우트 전반 | 왼쪽 sidebar(`Sidebar.tsx`)가 design-system에 없음. DESIGN.md §11 "Known gaps" 항목으로 문서화되지 않은 추가 컴포넌트. mock nav.css는 최상단 가로 nav만 정의. sidebar를 design-system에 편입하거나 AEGIS 전용 "project shell" 패턴으로 `DESIGN.md §2`에 추가 필요. | `qa-overview.png` 좌측 패널 |
| P2-2 | DS-VIOLATION | 전체 | Typography 이분법 미적용. DESIGN.md §4.1은 Paperlogy(Korean sans) + Geist Mono(숫자/ID/slug/timestamp). impl `index.css`는 `--cds-font-sans: 'Geist Variable', 'Pretendard', system`, 본문 Korean에 Paperlogy 영향 없음. mono가 `ui-monospace` 시스템 fallback으로 `--cds-font-mono`에 선언 — Geist Mono 웹폰트 로드 자체는 dashboard HTML에만 존재. | index.css:113, handoff/fonts.css vs mock fonts.css |
| P2-3 | DS-VIOLATION | 전체 | Token 시스템 병존. mock `--background / --foreground / --surface / --space-1..13 / --severity-*` vs impl `--cds-background / --cds-text-primary / --cds-spacing-01..12 / --aegis-severity-*` + shadcn `--primary / --card / --ring`. 3개 토큰 네임스페이스가 공존하여 페이지별 사용 기준이 모호. | `src/index.css`, `src/styles/handoff/tokens.css` |
| P2-4 | DS-VIOLATION | 전체 | Panel 컴포넌트 병존. Dashboard는 handoff `.panel > .panel-head + .panel-tools` 구조, 기타 페이지는 shadcn `Card > CardHeader > CardTitle`. 시각 rhythm(1px border, 40px `--space-9` 섹션 갭, `.panel-foot` meta 링크)과 shadcn 기본 치수가 혼재. | `qa-overview.png` vs `qa-dashboard-light.png` |
| P2-5 | PATTERN-UNVERIFIED | /dashboard | 프로젝트 데이터에 `gate=running`/`running=true` 항목이 없어 DESIGN.md §8.1 `.gate.running::before`, `.cell-name .n.running::after`, `.att-progress::after` laser bar 3대 running indicator 재현 여부 미확인. mock data 보강 또는 스토리북 fixture 필요. | mock data DashboardPage ActivityFeed |
| P2-6 | COPY-MINOR | /projects/*/settings | "위험 구역" 섹션에 severity-red 아이콘 박스. 의미론적이지만 P1-10과 동일 카테고리(비-severity UI에 severity color). destructive-action 공식 변형 컴포넌트가 DESIGN.md에 없음 — §7에 `.btn-danger`만 있고 section header 빨강 가이드 부재. | `qa-project-settings.png` |
| P2-7 | LIVE-SIGNAL | /login | Heartbeat 카운터가 정적 `last 4 s ago` 고정. mock Login.html은 `setInterval` 기반 0..9 순환 + 타임스탬프. brand panel의 "system heartbeat" 생동감 loss. DESIGN.md §8 기본 패턴은 아니나 mock HTML에 명시된 behavior. | LoginPage.tsx:44-46 |
| P2-8 | IMPL-MINOR | /projects/*/analysis-history | 진입 직후 document.title이 `AEGIS`(suffix 없음)로 한 프레임 표시 후 `AEGIS — 분석 이력`으로 업데이트. 다른 페이지는 static 메타로 즉시 세팅됨. title flash 일관성 drift. | playwright navigate 결과 Title=AEGIS at T03:56:39 |

### OK (mock 반영 확인)

- **/login**: shell 2열 분할 / brand-panel(shield SVG, wordmark, region·status spec, brand-hero, status-block 4 rows, brand-meta footer) / form-panel(theme-toggle, `AEGIS · PRODUCTION` eyebrow, kr-aegis-01.prod meta, 이메일·비밀번호·`SHOW`/`hide` toggle·remember checkbox, primary CTA `로그인`, fine-print, `가입 요청` 링크) — **mock 1:1**. class/copy 전부 일치.
- **/signup**: brand-panel(onboarding step counter 01/04, onboard-list 4 items with current NOW tag, upcoming 2-4), form-panel(`AEGIS · ACCESS REQUEST` eyebrow, 가입 승인 notice, section-group 01 계정 정보 3필드 + 02 조직 접근 3-field-ish with verify button, strength ticks, terms + audit checkbox, primary CTA, 로그인 링크) — **mock 1:1**. 단 `orgVerification` state 전이는 본 QA에서 interaction 미수행.
- **/dashboard** 골자: top nav, page-head, attention-grid 3-up, cols(projects + activity), tweaks panel(TWEAKS, 밀도 comfortable/compact, 레이아웃 table/cards, 활동 피드 토글, 라이브 스트림 토글) — class 네이밍 및 body density-compact/layout-cards/no-activity/no-live 토글 전파 일치.
- **Theme toggle + pre-paint IIFE** 동작 확인 (`localStorage.setItem('aegis.theme','dark')` 후 즉시 dark 적용, flash 없음).

## Verification checklist
- [x] Login/Signup/Dashboard light + dark 샘플 수집
- [x] Project 12 라우트 중 10+2 placeholder 라우트 진입 (동적 스킵 per user)
- [x] Error boundary 미노출 (모든 페이지)
- [x] Console critical error 없음 (`favicon.ico 404`, `[MOCK] Unhandled: /api/files/:id/content` 2건만 관찰)
- [x] services/frontend/** 파일 쓰기 0건 (Edit/Write 미사용, 기존 working tree 상태 유지)
- [x] mock-layer vs impl-layer 태깅 완료

## Evidence artifacts
모든 스크린샷은 인접 디렉토리 `./qa-screenshots/` 아래 수집 (aegis-static-wiki repo: `wiki/canon/handoff/s1-qa/artifacts/2026-04-20/qa-screenshots/`):
- `qa-login-light.png`
- `qa-signup-light.png`, `qa-signup-light-v2.png`
- `qa-dashboard-light.png`, `qa-dashboard-dark.png`
- `qa-overview.png`
- `qa-static-analysis.png`
- `qa-files.png`
- `qa-vulnerabilities.png`
- `qa-analysis-history.png`
- `qa-report.png`
- `qa-quality-gate.png`
- `qa-approvals.png`
- `qa-project-settings.png`
- `qa-global-settings.png`
- `qa-file-detail.png`
