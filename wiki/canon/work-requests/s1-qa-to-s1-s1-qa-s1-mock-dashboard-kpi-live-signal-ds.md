---
title: "S1-QA → S1: 디자이너 mock 반영도 검수 — Dashboard KPI/컬럼/live-signal + DS 일관성"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds"
last_verified: "2026-04-20"
service_tags: ["frontend"]
decision_tags: ["design-mock-adherence", "single-cycle"]
related_pages: ["wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/design-mock-review-workflow.md", "wiki/canon/handoff/s1/usecase-visibility-matrix.md", "wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-s1-qa-s1-mock-dashboard-kpi-live-signal-ds"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-20T05:01:31.493Z","note":"Processed by S1 on 2026-04-20. Actionable P1 items were implemented in services/frontend, feasible P2 consistency items were addressed within S1 ownership, final verification is green (typecheck/build/full tests), and a canonical reply WR was posted at wiki/canon/work-requests/s1-to-s1-qa-s1-s1-qa-reply-mock-adherence-wr-dashboard-kpi-live-signal-ds.md."}]
registered_at: "2026-04-20T04:04:50.859Z"
completed_at: "2026-04-20T05:01:31.493Z"
---

# S1-QA → S1: 디자이너 mock 반영도 검수 — Dashboard KPI/컬럼/live-signal + DS 일관성

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1-QA → S1: 디자이너 mock 반영도 검수 (2026-04-20)

## 발견 환경
- 기준 mock: `/home/kosh/temp/for-aegis-frontend/AEGIS/` (Login.html, Signup.html, Dashboard.html, DESIGN.md, assets/*)
- 대상 impl: `services/frontend` 현재 working tree
- 실행: Playwright MCP, Chromium, viewport 1440×900 & 1600×1200, `VITE_MOCK=true npx vite --port 5180`
- locale=ko-KR, light + dark 샘플
- 상세 findings + 증거 인덱스: `/home/kosh/AEGIS/.omc/autopilot/findings.md`
- 스크린샷 아카이브: `/home/kosh/AEGIS/.omc/autopilot/qa-screenshots/qa-*.png`
- 세션 히스토리: `wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa.md`

## 총평
- **/login, /signup은 mock HTML과 1:1.** class·copy·layout·pre-paint 스크립트 일치. 이 정도면 "완성" 판정.
- **/dashboard는 "부분 반영" 상태.** Tweaks 패널, attention-grid, projects 테이블, activity feed 골격은 살아있음. 다만 mock이 강조한 운영 시그널(critical-open/승인-대기 KPI, 승인대기·담당 컬럼, 풍부한 activity 내러티브, WS 라이브 스트림 표시)이 빠지거나 축약됨.
- **나머지 페이지(Overview/Static Analysis/Files/Vulnerabilities/Analysis History/Report/Quality Gate/Approvals/Settings×2/File Detail)는 DESIGN.md 해석 구성.** 라우트 생존·기능 동작은 OK. 다만 `--cds-*`(Carbon) + `--aegis-*` + shadcn 토큰 3종 병존, Paperlogy·Geist Mono 이분 typography 미적용, severity color가 non-severity UI(승인/거부 버튼)에 노출되는 등 디자인 시스템 일관성이 약함.
- **P0(블로커) 없음.** 아래 항목은 순차 처리 가능.

## 이슈 목록

### P1 — 사용성/계약 위반 (수정 권장)

**[P1-1 COPY/SEMANTIC · /dashboard]** 페이지 헤더 sub 라인의 운영 KPI가 교체됨.
- mock: `N 프로젝트 활성 · X critical open · Y 승인 대기 · 마지막 동기화 HH:MM UTC+9`
- impl: `N 프로젝트 활성 · N 최근 활동 · N 우선 확인`
- critical open / 승인 대기 KPI를 다시 노출해 주세요. 증거: `qa-dashboard-light.png`, `DashboardPage.tsx:52-58`.

**[P1-2 STRUCTURAL · /dashboard]** 프로젝트 테이블 컬럼 누락.
- mock: 9개 (프로젝트/게이트/크리티컬/하이/미디엄/오픈/**승인대기**/마지막분석/**담당**)
- impl: 7개 (승인대기·담당 없음, `.cell-owner` mini-avatar 미적용)
- 증거: `qa-dashboard-light.png` table header.

**[P1-3 PATTERN · /dashboard]** Activity feed footer `"WS 연결됨 · 실시간 스트림"` + `.live-dot` pulse 미구현. DESIGN.md §8.1 3대 live indicator(dot pulse / gate pulse / laser bar) 중 dot/laser가 dashboard 수준에서 관찰되지 않음. `body.no-live` 토글 hook만 있고 시각 표현 없음. 증거: `qa-dashboard-light.png` 최근 활동 foot.

**[P1-4 SEMANTIC · /dashboard]** Activity 내러티브 단조. 모든 항목이 `{프로젝트명} 가장 마지막 수정 · N일 전` 패턴. mock은 event type(success / critical / primary / muted)별로 `<span class="proj">` primary link, `<span class="n critical">14 crit</span>` 숫자 tint, user/branch/clock 아이콘 스위칭이 있는 풍부한 HTML. `ICONS` 매핑과 severity numeral tint 예시는 mock Dashboard.html:542-561. 증거: `qa-dashboard-light.png`.

**[P1-5 SEMANTIC · /dashboard]** Attention card body 축약. 현재 `탐지 항목 5건 · 미해결 2건 · 최근 업데이트 · 25일 전`. mock: `14 critical, 23 high 신규 — 마지막 스캔에서 +9 증가` 또는 `Static 분석 64% · Agent · taint-flow heuristic`. 운영 맥락이 통계 숫자 나열로 퇴보. 증거: `qa-dashboard-light.png` 우선 확인 카드 본문.

**[P1-6 DATA-BUG · /dashboard]** "바디 컨트롤 모듈 ... 미해결 **-1**건" 음수 렌더. 계산식 버그로 보임. 증거: `qa-dashboard-light.png` 두 번째 attention card.

**[P1-7 COPY · /dashboard]** 섹션/CTA 라벨 drift.
- `우선 확인` → mock: `주의 필요`
- `프로젝트 탐색기` → mock: `프로젝트 12` (count badge 패턴 `<h3>프로젝트 <span class="count">12</span></h3>` 미반영)
- `프로젝트 추가` → mock: `새 프로젝트`

**[P1-8 LAYOUT · /dashboard]** `새 프로젝트` CTA가 projects panel-tools 우측에 배치됨. mock은 page-head actions에 있어야 함. 상단 actions엔 `프로젝트 추가`가 따로 있어 CTA 중복 (`DashboardPage.tsx:61-63` + `ProjectExplorer` 내부). 상단으로 통합 제안.

**[P1-9 DS-VIOLATION · Report / Vulnerabilities]** Severity `low` 컬러 불일치.
- DESIGN.md §3.4 `low: muted-blue oklch(0.62 0.12 230)`
- Report "낮음" 수평 바는 녹색, Vulnerabilities 첫 row(CWE-561 `낮음`)는 teal/blue-ish
- 두 페이지 간 `low` 표현도 달라 혼재. severity 토큰 사용 지점에 `--severity-low` 직결시킬 것.
- 증거: `qa-report.png`, `qa-vulnerabilities.png`.

**[P1-10 DS-VIOLATION · /projects/*/approvals]** `승인`(녹색) / `거부`(빨강) 버튼. DESIGN.md §3.4 `Severity colors NEVER appear on non-severity UI (buttons, links, navigation)` 규칙 위반. mock button.css는 `.btn-primary` + `.btn-danger`만 정의(성공계 녹색 버튼 없음). `.btn-primary`만 쓰고 확정 다이얼로그를 여는 패턴 혹은 `.btn-danger`만 노출하는 패턴으로 정렬 제안. 증거: `qa-approvals.png`.

**[P1-11 IMPL-BUG · /projects/*/files/:fileId]** mock handler 미처리 경로 `GET /api/files/f-1/content` → 콘솔 `[MOCK] Unhandled` 경고 2건. 파일 source preview가 `0줄`로 렌더되어 동작 불가. `mock-handler.ts` (services/frontend/src/api/mock-handler.ts:187 근처)에 content 핸들러 추가 필요. 증거: `qa-file-detail.png`, console log.

### P2 — 디자인/일관성 개선

**[P2-1 DS-GAP]** project 라우트 좌측 dark sidebar(`Sidebar.tsx`)가 DESIGN.md에 없음. §11 "Known gaps"에도 sidebar 항목 없음. 두 가지 경로 중 택일:
1. mock 자산에 `assets/components/sidebar.css` 추가를 디자이너에게 요청 (mock-layer — QA가 대리 요청하지 않음, 본 WR 범위 밖)
2. project shell 전용 패턴으로 내부 문서화(`services/frontend/src/layouts/Sidebar.tsx` 주변에 rationale 코멘트, 또는 S1 핸드오프 페이지에 절충안 기록)

**[P2-2 DS-VIOLATION · 전체]** Typography 이분법 미적용.
- DESIGN.md §4.1 Paperlogy(Korean sans) + Geist Mono(숫자/ID/slug/timestamp)
- impl `index.css:113` `--cds-font-sans: 'Geist Variable', 'Pretendard', system`, mono는 `ui-monospace` 시스템 fallback
- `handoff/fonts.css`가 Paperlogy를 선언하나, 본문 `font-family`가 `--cds-font-sans`로 덮여 있음
- 최소한 `body, #root`에 Paperlogy stack을 상위로 올리고, `.mono` / 숫자·타임스탬프 셀에 Geist Mono 클래스 주입.

**[P2-3 DS-VIOLATION · 전체]** Token 시스템 3종 병존(`--cds-*` Carbon / `--aegis-*` 도메인 / shadcn `--primary / --card / --ring` / mock `--background / --foreground / --space-1..13`). 페이지별 어떤 토큰을 쓸지 기준이 없어 보임. 통합 로드맵 문서화(또는 handoff 토큰으로 수렴) 제안.

**[P2-4 DS-VIOLATION · 전체]** Panel 컴포넌트 병존(handoff `.panel`·`.panel-head`·`.panel-tools`·`.panel-foot` vs shadcn `Card`·`CardHeader`·`CardTitle`). Dashboard는 handoff 구조, 기타 페이지는 shadcn. 1px border + `--space-9` 섹션 갭의 시각 rhythm이 페이지별로 다름. 점진적 일원화 제안.

**[P2-5 PATTERN-UNVERIFIED · /dashboard]** Mock data에 `gate=running` / `running=true` 항목이 없어 DESIGN.md §8.1의 `.gate.running::before`, `.cell-name .n.running::after`, `.att-progress::after` laser bar 재현 여부 미확인. mock fixture에 running project 1건 추가 or storybook entry 제안.

**[P2-6 DS-MINOR · /projects/*/settings]** "위험 구역" 섹션 빨강 아이콘 박스. P1-10과 같은 범주(비-severity UI에 severity-red). destructive-section 공식 변형이 DESIGN.md에 없어 현재로선 회색조 + `.btn-danger` CTA만 쓰는 보수적 변환 제안.

**[P2-7 LIVE-SIGNAL · /login]** Heartbeat 카운터가 정적 `last 4 s ago` 고정. mock Login.html:188-201의 `setInterval` 0..9 순환 + `fmtTime` 타임스탬프 재현 제안. 증거: `LoginPage.tsx:44-46`.

**[P2-8 IMPL-MINOR · /projects/*/analysis-history]** document.title 초기 프레임에 `AEGIS`만 표시 후 `AEGIS — 분석 이력`으로 업데이트 (useEffect 기반 지연). 다른 페이지는 즉시 suffix 포함 세팅. 해당 페이지도 즉시 세팅으로 통일 제안.

## OK (별도 action 불필요)
- /login, /signup light 테마 렌더링 — mock HTML 1:1 (class·copy·pre-paint IIFE 포함)
- theme toggle + `aegis.theme` 키 유지 → 라우트 전환 후에도 dark 유지 (white-flash 없음)
- 모든 14 라우트 진입, ErrorBoundary 미노출
- `body.density-compact` / `body.layout-cards` / `body.no-activity` / `body.no-live` 토글 body 클래스로 정상 전파

## 기대 완료 동작
1. P1 12건 → 각 항목에 대한 fix 또는 "현상 유지 + 근거" 회신. 단일 사이클 원칙상 QA는 추가 tracking 하지 않음.
2. P2 8건 → 디자인 토큰/컴포넌트 일원화 로드맵으로 묶어 별도 처리 가능 (이번 WR에서 일괄 fix 요구 아님).
3. 수정 완료 후 `wr_kind=reply`로 본 WR에 회신 주면 S1-QA에서 `complete_wr` 처리.
4. 본 WR에 대해 S1이 수정 착수 전 scope 협의가 필요하면 `wr_kind=question`으로 회신 가능.

## 범위 밖 (다루지 않음)
- 디자이너 mock 자체 수정 제안 (mock-layer는 디자이너 responsibility, QA 대리 요청 금지)
- 실제 백엔드 contract / WebSocket / 성능
- 이전 QA 사이클(visual baseline 24건)의 regression 판정 — 본 WR은 mock 반영도만 다룸

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
