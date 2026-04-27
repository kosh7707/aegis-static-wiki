---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/specs/frontend.md"
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/handoff/s1/bootstrap.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/api/shared-models.md"
  - "services/frontend/src/App.tsx"
  - "services/frontend/src/index.css"
  - "services/frontend/src/shared/auth/AuthConsoleShell.tsx"
  - "services/frontend/src/styles/handoff/auth-console.css"
  - "services/frontend/src/styles/handoff/tokens.css"
  - "services/frontend/src/styles/handoff/base.css"
  - "services/frontend/src/styles/handoff/components/nav.css"
  - "services/frontend/src/styles/handoff/components/outcome-chip.css"
  - "services/frontend/src/styles/handoff/pages/dashboard.css"
  - "services/frontend/src/styles/handoff/app-shell.css"
  - "services/frontend/src/shared/ui/OutcomeChip.tsx"
  - "services/frontend/src/shared/analysis/deepOutcome.ts"
  - "services/frontend/src/shared/analysis/RecoveryTracePanel.tsx"
last_verified: "2026-04-27"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "web-only-frontend", "handoff-css-system", "design-system-source-of-truth", "design-doctrine-enforcement", "bootstrap-protocol", "autopilot-redesign-batch", "reviewer-self-judgment-guardrail", "lane-contract-negotiation", "review-tone-palette", "workflow-state-axis"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/bootstrap.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **새 세션이면 먼저 [`wiki/canon/handoff/s1/bootstrap.md`](bootstrap.md) 를 열 것.** 본 페이지는 그 뒤에 읽는다.
> bootstrap 체크리스트가 전부 ✅ 되기 전에 디자인 작업·변형 제안·자가 판단을 시작하지 않는다.
> 마지막 검증/갱신: **2026-04-27**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical spec/handoff 문서를 관리한다.
- S1은 Electron 없는 **웹 전용 SPA**다.
- S1은 S2 API/WS 계약만 소비하며 다른 lane 코드를 수정하지 않는다.

## 2. 시각 방향의 권위 (빡센 버전)

**AEGIS 프론트엔드의 시각 규칙은 외부 디자이너 handoff가 결정한다. S1은 그 규칙을 번역하지 않는다 — 그대로 집행한다.**

- 권위 3부작 (이 순서가 절대 우선순위):
  1. `wiki/canon/design-system/DESIGN.md`
  2. `wiki/canon/design-system/design-doctrine.md`
  3. `wiki/canon/design-system/readme.md`
- 구현 계약: lane-local 적용 규칙은 `wiki/canon/handoff/s1/design-system.md` §3 에 있다. 위반 시 CRITICAL/MAJOR/MINOR triage는 `design-doctrine.md` §6 을 따른다.
- **mock 은 레이아웃 참고용** — drift (Pretendard / `--sb-*` / 신규 토큰 등) 흡수 금지. 그러나 mock 의 **layout 자체** 는 사용자 명시 위임 시 흡수 의무.
- **Reviewer 의 자가 판단 함정**: "drift 라 유지" 같은 캐주얼한 결정으로 mock layout 흡수 누락 통과 금지.

### 2.1 Review-tone palette (severity color non-severity UI 분리)

doctrine §3.4 의 정공법 — non-severity status/outcome UI 는 severity ramp 사용 금지하고 별도 review-tone 어휘로 표현.

#### outcome-quality 축 (5 slot — 결과 품질 caveat 표현)

- `positive` (clean / accepted / poc_accepted / approval-approved / sdk-ready / gate-pass) → `--success` / `--success-surface`
- `neutral-review` (no_accepted_claims / poc_not_requested) → `--foreground-muted` / `--surface-sunken`
- `caution-review` (accepted_with_caveats / inconclusive / SDK pending / sdk-progress / gate-warning / decision-impact-summary) → `--warning` / `--warning-surface`
- `critical-review` (rejected / repair_exhausted / SDK install_failed / approval-rejected / sdk-failed / gate-fail) → `--danger` / `--danger-surface`
- `fallback-review` (unknown enum / old result / approval-expired) → `--foreground-subtle` / `--surface-sunken`

#### workflow-state 축 (6번째 slot — 사람의 결정 대기 active queue state) — 2026-04-26 신설

mock 의 `--pending oklch(0.58 0.16 250)` (hue 250 = blue) 사용처는 **outcome 축이 아니라 workflow 축**이다. 5 outcome-quality slot 과 다른 axis. caution-review (warning amber, hue 65) 와 의미가 다르므로 분리:

- `workflow-active-pending` (approval-pending / 사람의 결정을 기다리는 active queue state) → `--primary` / `--primary-surface`

**적용 셀렉터 화이트리스트** (page CSS 안에서만 6번째 slot 사용):

- `.approval-status--pending`
- `.hero-verdict.v-pending`
- `.verdict-pending`
- `.appr-row.s-pending .appr-rail`
- `.appr-li.s-pending .appr-li__verdict`
- `.empty-state.is-pending`
- `.hero-stat.is-pending .val`

**2026-04-27 추가 (Admin 대기열 active queue state):**

- `.admin-reg-kpi .status-chip--pending .status-chip__count` — Admin Registrations KPI 대기 카운트
- `.admin-reg-row--pending` — 대기 중인 등록 row tint (`--primary-surface` 60%)

화이트리스트 외 새 selector 도입 시 본 §2.1 갱신 PR 동반 의무. 다른 page 도입 시 별도 협상.

#### canonical 위치

- `services/frontend/src/styles/handoff/components/outcome-chip.css` (handoff-only 확장 — Deep outcome 전용 + workflow-active-pending)
- React 어휘: `services/frontend/src/shared/ui/OutcomeChip.tsx` + `services/frontend/src/shared/analysis/deepOutcome.ts`
- page-local 동일 어휘 (page CSS 내): `.approval-status--*`, `.report-status-tone--*`, `.report-module-status--*`, `.overview-{gate,sdk,target-summary}-badge--*`, `.quality-gate-{badge,status-banner}--*` 등

### 2.2 Severity signal 예외 — narrow whitelist (broad permission 금지)

다음 셀렉터들은 severity ramp 직접 사용 OK (signal 자체 또는 narrow exception). 이 외는 모두 §2.1 review-tone palette 사용 의무.

#### Canonical severity components (signal 자체)

- `.gate.{blocked,warn,pass,running}` / `.cell-gate.{...}` — gate 가 곧 severity signal
- `.sev-chip.{critical,high,medium,low}` — finding/vulnerability 의 severity 표시
- severity-bound numerals (예: "3 critical findings" 의 `3`) — DESIGN.md §3.4 narrow exception

#### Gate context override exception (2026-04-26 추가)

- `.modal-content__shoulder.is-fail` — QualityGate override modal shoulder (gate context P3)

#### Action-kind iconography (Approvals action 대표 아이콘 — gate.override / accepted_risk action 의 severity-bound semantic, 2026-04-26 추가)

같은 action-kind 의 size variant 3개 모두 narrow whitelist:

- `.appr-icon.k-override` / `.appr-icon.k-risk` — appr-row 의 큰 아이콘 (32px)
- `.appr-li.k-override .appr-li__icon` / `.appr-li.k-risk .appr-li__icon` — Panel 마스터 리스트의 미니 아이콘 (24px)
- `.appr-detail-pane__head-icon.k-override` / `.appr-detail-pane__head-icon.k-risk` — Panel detail-pane 헤드 아이콘 (40px)

`.k-override` = gate.override action — `--severity-critical` (gate context).
`.k-risk` = finding.accepted_risk action — `--severity-high` (severity-bound action).

#### Action-kind eyebrow label (severity-bound semantic label, 2026-04-26 추가)

action-icon 옆의 텍스트 라벨 ("GATE OVERRIDE" / "ACCEPTED RISK") — severity-bound numerals 의 텍스트 analog:

- `.appr-row.k-override .appr-eyebrow .lab` / `.appr-row.k-risk .appr-eyebrow .lab`

#### 추가 시 의무

위 항목 외 모든 status/outcome/state UI 는 §2.1 review-tone palette 사용. 추가 예외 도입 시 **본 §2.2 갱신 PR 동반 의무** — broad permission 금지, narrow specific selector 만.

**중요**: decision-impact summary 패널 (`.appr-detail-pane__impact*` / `.approval-decision-dialog .appr-detail__impact*`) 은 severity ramp 사용 **금지**. caution-review tone (`--warning` / `--warning-surface`) 사용 — impactSummary 는 결정 리스크 review surface 이지 severity signal 자체가 아님.

## 3. Source-of-truth 순서 (충돌 시 상위가 이김)

1. `wiki/canon/design-system/DESIGN.md`
2. `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html`
3. `wiki/canon/design-system/assets/**/*.css` + `shield.svg.md`
4. `services/frontend/src/styles/handoff/**` (ship 복사본)
5. React 구현

## 4. 현재 활성 파일 (주요)

- `services/frontend/src/App.tsx`
- `services/frontend/src/index.css`
- `services/frontend/src/shared/auth/AuthConsoleShell.tsx`
- `services/frontend/src/shared/ui/OutcomeChip.tsx`
- `services/frontend/src/shared/analysis/{deepOutcome.ts, RecoveryTracePanel.tsx, RecoveryTracePanel.css}`
- `services/frontend/src/styles/handoff/{tokens,base,auth-console,app-shell}.css`
- `services/frontend/src/styles/handoff/components/outcome-chip.css` (workflow-active-pending tone 포함)
- `services/frontend/src/layouts/Sidebar.tsx`
- `services/frontend/src/hooks/useSdkProgress.ts`
- `services/frontend/src/api/sdk.ts`
- `services/frontend/src/api/gate.ts` (`@aegis/shared` re-export)
- `services/frontend/src/pages/{LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage}/*`
- `services/frontend/src/pages/ProjectSettingsPage/*`
- `services/frontend/src/pages/AnalysisHistoryPage/*`
- `services/frontend/src/pages/ReportPage/*`
- `services/frontend/src/pages/OverviewPage/*`
- `services/frontend/src/pages/StaticAnalysisPage/*`
- `services/frontend/src/pages/QualityGatePage/*` (2026-04-26 mock 01/02 흡수 완료)
- `services/frontend/src/pages/ApprovalsPage/*` (2026-04-26 mock 03~06 흡수 완료)

## 5. 검증 스냅샷 (2026-04-27 cycle 종료)

| 항목 | 결과 |
|---|---|
| handoff shared assets | `/login`, `/signup` + sidebar mock v2 layout 정합 |
| review-tone palette | 5 outcome-quality slot + 1 workflow-state slot (workflow-active-pending). 2026-04-27 cycle에서 AdminReg/Textarea/Radio/Input/Checkbox/two-stage-error/failed-runs-count/is-warn(2x)/ProjectSettings danger zone+SDK failure surfaces 모두 review-tone palette로 마이그레이션 — severity ramp leak production CSS 0건 |
| severity exception | gate / sev-chip / severity-bound numerals + `.modal-content__shoulder.is-fail` + Approvals action-kind icon 6 selectors + 2 eyebrow labels (2026-04-26 §2.2 갱신, 2026-04-27 cycle 변동 없음) |
| workflow-active-pending whitelist | 2026-04-26 7 selectors + **2026-04-27 +2** (`.admin-reg-kpi .status-chip--pending .status-chip__count`, `.admin-reg-row--pending`) — Admin 대기열 도입 |
| frontend tests | **691 PASS / 108 files** (baseline 유지) |
| Build | PASS, esbuild CSS warning 0 |
| Typecheck | PASS |
| code-reviewer / critic | **APPROVE** (2026-04-27 fresh context, ITERATE → 1 MAJOR + 1 MINOR fix + `--destructive` 13곳 review-tone 통일 → re-verified clean) |
| qa-tester (Playwright) | **deferred** — dev server 환경 필요. 다음 round |
| lint grep (production CSS) | hex 0 (DynamicAnalysisPage console theme 제외, 별도 WR) / oklch 0 (handoff/index.css 외) / drift token (`--pass/--fail/--warn/--pending/--neutral/--sb-*`) 0 / Pretendard 직접 0 / severity ramp leak (§2.2 화이트리스트 외) 0 |
| handoff §5 sync table 정합 | 2026-04-27 갱신 — tokens.css / auth-console.css / dashboard.css 의 실제 drift와 사유 명시 (이전 "바이트 동일" 기재 부정확 수정) |
| lane-local 결정 채택 (디자이너 WR 발행 보류) | (1) Paperlogy-unified mono 정식 채택 — DESIGN.md §1·§4 권위와 충돌하지만 lane-local 정책으로 운영, sync table 명시 추적  (2) DynamicAnalysisPage 콘솔 terminal aesthetic page-scoped 정식 인정 — page-local 토큰 유지 |
| LOW backlog 정리 (2026-04-27 round 2) | ApprovalsPage gap 4px/8px → token 매핑, hero-verdict__bar / appr-row__rail / QualityGate hero-verdict__bar `width: 4px` → `var(--space-2)`, ticketRef audit-only 명시 + S2 contract L1 의존 helper text, index.css unused 토큰 82개 제거 (730→586 lines, 정의 113→36 1:1 사용 매칭) |

## 6. 다음 작업 기준

1. 새 페이지/변형 요청 → `design-doctrine.md` §1 컨텍스트 체크리스트 → §4 변형 전략 (3+축 옵션) → 사용자 선택.
2. 미구현 기능은 mock UI OK, 단 구조/상태/문구는 handoff 산출물 + canonical mocks 기준. 새 색/폰트/토큰 0.
3. 문서는 디자인 취향이 아닌 **구조·행동·검증 계약** 기록.
4. handoff shared asset 구조와 실제 코드 동기화 유지.
5. 디자인 규칙 질문/재판정 → DESIGN.md 문자적 권위 인용.
6. **Writer 자가 approve 금지**. S1-QA 또는 `code-reviewer` agent 별도 fresh context.
7. **Reviewer "drift, 유지" 자가 판단 통과 금지**.
8. 사용자가 mock 외부 채널 위임 시 의도는 **mock layout 전체 흡수**.
9. **Backend 데이터 정합성 의문 시 자가 판단 매핑 금지** — lane WR 협상.
10. **Non-severity status/outcome UI 는 review-tone palette** (§2.1) 사용. severity ramp 직접 사용 doctrine §3.4 위반.
11. **Severity signal 예외** (§2.2) — narrow whitelist 내 셀렉터만 severity ramp 직접 사용 OK.
12. **workflow-state 축** (§2.1 6번째 slot) — workflow-active-pending 만, 화이트리스트 7 selector 만.
13. **decision-impact summary 패널** — caution-review tone (warning surface), severity ramp 금지.

## 7. 문서 우선순위

1. 활성 규칙 source-of-truth = wiki canon
2. 디자인 규칙 권위 = DESIGN.md + mocks + assets, lane-local = handoff/s1/design-system.md
3. repo 내부 docs 활성 디자인 지침 X
4. historical session/WR 의 과거 용어 = 증거 보존
5. 부팅/라우팅 = bootstrap.md 전담
6. **Backend 신규 계약에 대한 frontend 활용 사이클 → 별도 WR 협상**

## 8. redesign / 계약-활용 백로그 (2026-04-27 기준)

### 8.1 완료
- ✅ **2026-04-27 drift 점검 + review-tone 정합 cycle**:
  - severity ramp leak 7곳 → review-tone palette 마이그레이션 (AdminReg KPI count/row tint/reject reason · Textarea/Radio/Input/Checkbox aria-invalid · two-stage-error · failed runs count · OverallStatusTab/kpi.css is-warn · ProjectSettings danger zone + SDK 실패 surfaces 모두 `--danger` / `--warning` / `--primary` 로 정합)
  - hex 잔재 11곳 → canonical 토큰 정합 (OverviewPage trend-summary · AdapterSelector · Analysis(Async)ProgressView · DynamicTestPage · ConnectionStatusBanner · FilesPage build-target-row+section-summary+target-library + folder-icons · FileDetailHeader inline)
  - ReportFindingsSection inline `style={{color}}` mdash → `.report-table-empty-mark` page CSS class
  - handoff §5 sync table 정합 갱신 (tokens.css / auth-console.css / dashboard.css 의 실제 drift 명시 — 이전 "바이트 동일" 기재 정정)
  - handoff §2.1 6번째 slot 화이트리스트 +2 (Admin 대기열 도입)
  - handoff/s1/design-system.md §6 cycle entry 추가
  - lane-local 결정 채택 — Paperlogy-unified mono 정식 / DynamicAnalysisPage console terminal aesthetic page-scoped 정식 (디자이너 WR 발행 보류 — 사용자 지시)
- ✅ **2026-04-27 LOW backlog 정리 round 2** (사용자 지시 "전부 처리"):
  - ApprovalsPage gap `4px → var(--space-2)` (5 위치) / `8px → var(--space-3)` (2 위치). 6px는 micro-rhythm pattern raw 유지
  - ApprovalsPage `.hero-verdict__bar` / `.appr-row__rail` width 4px → `var(--space-2)`
  - QualityGatePage `.hero-verdict__bar` width 4px → `var(--space-2)`
  - QualityGateOverrideModal ticketRef audit-only 명시 — `aria-describedby` + helper text + S2 contract L1 의존 명시
  - `services/frontend/src/index.css` unused 토큰 82개 정의 제거 — 730 → 586 lines (-144). 정의 113 → 36 (1:1 사용 매칭)
  - 검증 재실행: 691/108 PASS, typecheck PASS, build PASS (2.41s, CSS warning 0), lint grep clean
- ✅ **2026-04-27 critic ITERATE → fix → APPROVE round 3**:
  - **MAJOR fix**: `shared/ui/SelectField.css` `[aria-invalid="true"]` `--severity-critical` → `--danger` (form-* 5 sibling 컴포넌트 일관)
  - **MINOR fix**: `pages/StaticAnalysisPage/StaticAnalysisPage.css` `.two-stage-error-card` / `.two-stage-error-head` `--destructive` → `--danger` (sibling `.two-stage-error` 블록과 통일)
  - **`--destructive` 토큰 review-tone 통일** (critic awareness flag): 13 위치 일괄 마이그레이션 — ConnectionStatusBanner / FilesPage / ErrorBoundary / handoff/components/dialog.css / handoff/app-shell.css / SettingsPage 의 workflow error/danger surface 모두 `--danger` 로 (shadcn legacy `--destructive` → review-tone critical-review 일관)
  - critic fresh context 재평가 → **APPROVE** (verdict: 모든 fix evidence-verified, 새 위반 0)
- ✅ **ProjectSettingsPage** — 2026-04-22 baseline + 2026-04-25 phase-2 polish + 2026-04-25 mock v2 layout 전면 적용 + 2026-04-25 SDK 신규 계약 활용
- ✅ **AnalysisHistoryPage** — 2026-04-25 canonical run-row + Deep outcome compact chip
- ✅ **ReportPage** — 2026-04-25 Analyst's Document + 3 outcome chip + RecoveryTracePanel + ABCD review-tone migration + MINOR sweep
- ✅ **OverviewPage** — 2026-04-25 SecurityPostureSection compact chip + React key fix + ABCD hex→canonical
- ✅ **StaticAnalysisPage** — 2026-04-25 Deep latest 3 outcome chip + RecoveryTracePanel expanded
- ✅ **Sidebar** — 2026-04-25 mock v2 layout
- ✅ **OutcomeChip + deepOutcome + RecoveryTracePanel** — review-tone palette canonical
- ✅ **review-tone palette migration** (2026-04-25 ABCD Stream A+B) — ReportPage / OverviewPage / QualityGatePage / ApprovalsPage 의 page CSS hex/severity-non-severity 정리
- ✅ **WR1 — S1→S2 mock 흡수 계약 보강** (2026-04-26) — 발행 + S2 회신 도착 + H1·H2·H3·H4·H5·H6·H7 모두 구현 + complete_wr 처리
- ✅ **handoff §2.1 6번째 slot 신설** (2026-04-26 S1 self-publish) — workflow-active-pending (axis = workflow-state, canonical primary tint, 7 selector 화이트리스트)
- ✅ **handoff §2.2 severity exception 갱신** (2026-04-26 S1 self-publish) — `.modal-content__shoulder.is-fail` + Approvals action-kind icon 6 selectors + 2 eyebrow labels
- ✅ **outcome-chip.css 6번째 tone** (2026-04-26) — `.outcome-chip--workflow-active-pending` 추가 (canonical token 만)
- ✅ **QualityGatePage 2026-04-26 mock 01/02 흡수** — hero-verdict compact + override modal + GateProfile cross-fetch (Map cache dedupe) + sparkline + .gate-rule__threshold (current/threshold 직접 표시) + tally cells 폐기
- ✅ **ApprovalsPage 2026-04-26 mock 03~06 흡수** — List + Panel master-detail + Empty x2 + view-toggle + ?selected URL state + ARIA tab + 키보드 nav (Arrow/Enter/Space/Home/End) + workflow-active-pending tone + impactSummary + targetSnapshot
- ✅ **code-reviewer fresh context APPROVE** (2026-04-26) — ITERATE → 3 MAJOR fix (impact panel re-tone + §2.2 whitelist 확장 + eyebrow label 명시) → clean
- ✅ **ai-slop-cleaner pass** (2026-04-26) — net -135 lines, 16 files, post-deslop 691/108 PASS

### 8.2 deferred (이번 cycle 외부)
- 🔄 **qa-tester (Playwright) baseline regenerate** — 사용자 dev server 환경에서 별도 round. 6 surface × 3 viewport (1100/900/640) 시각 회귀 ≤ MINOR pass + console error 0 + prefers-reduced-motion 동작 검증

### 8.3 별도 WR (canonical 영역, 디자이너 처리)
- ✅ 발행 (2026-04-26): `s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri` — navbar `.nav-icon .badge` 가 severity-critical 사용 (canonical handoff/components/nav.css 영역)
- 🟡 **2026-04-27 cycle 의 두 사안은 lane-local 결정으로 채택, 디자이너 WR 발행 보류 (사용자 지시)**:
  - Paperlogy-unified mono — handoff/tokens.css drift 를 lane-local 정식 정책으로 운영 (handoff/s1/design-system.md §5 sync table tokens.css row 명시 추적)
  - DynamicAnalysisPage console terminal aesthetic — page-scoped 토큰 (`--console-fg/-bg/-bg-hi/-green/-amber/-red/-red-soft`) 형태로 정식 인정. 다른 surface 재사용 금지, terminal aesthetic surface 한정 시각 어휘로 제한

### 8.4 MINOR sweep
- ✅ **OverviewPage `.trend-summary__item--{new,resolved}` hex** (2026-04-27) — review-tone palette 정합 완료
- ✅ **ReportPage mdash inline style** (2026-04-27) — `.report-table-empty-mark` page CSS class 추출 완료
- ✅ **ApprovalsPage `gap: 4px / 8px` raw → token 매핑** (2026-04-27) — `4px → var(--space-2)` (3 위치 + impact-body 2 위치), `8px → var(--space-3)` (decision row + dialog foot). 6px는 icon+text micro-rhythm pattern 으로 raw 유지 (scale 외, 시각 균형 보존)
- ✅ **ApprovalsPage `.hero-verdict__bar` / `.appr-row__rail` `width: 4px` → `var(--space-2)`** (2026-04-27) — hairline rail 1:1 매핑
- ✅ **QualityGatePage `.hero-verdict__bar { width: 4px }` → `var(--space-2)`** (2026-04-27) — 1:1 매핑
- ✅ **QualityGateOverrideModal `ticketRef` audit-only 명시** (2026-04-27) — input 옆에 `aria-describedby` + helper text 추가 ("영구 저장은 backend `GateResult.override.ticketRefs[]` 계약 확장 후 활성화 — S2 contract L1"). 입력값은 클라이언트 상태로만 보존, S2 계약 확장 전까지 dropped on submit 정책 명시
- ✅ **`services/frontend/src/index.css` unused 토큰 정리** (2026-04-27) — 730 → 586 lines (-144). 미사용 `--cds-*` 77개 + `--aegis-glow-*` 4개 + `--aegis-spacing-05` 1개 정의 제거 (light + dark 양쪽). 정의 113 → 36 (1:1 사용 매칭). canonical 토큰 마이그레이션은 점진적 (handoff §3.2 #4 "신규 스타일 추가 금지" 정책 유지)

### 8.5 backlog (LOW)
- **WR3 (canonical `-deep` token 신설)** — DESIGN.md §3 토큰 표 `--success-deep / --warning-deep / --severity-critical-deep` slot 표준화 검토. backlog (LOW). 2026-04-26 cycle 안 page CSS color-mix derive 로 진행
- **S2 contract L1 (override.ticketRefs)** — `GateResult.override.ticketRefs?: string[]` 추가 시 QualityGateOverrideModal 의 ticketRef 입력 활성화

## 9. 금지 사항

- 과거 시각 지침을 활성 기준으로 되살리는 것
- `wiki/canon/design-system/` 자산 대신 repo 내부의 낡은 디자인 지침 참조
- canonical handoff 11개 (button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav) 수정 — handoff-only 확장 (outcome-chip / form-field / status / list / dialog 등) 추가는 OK
- DESIGN.md §3 규칙 밖의 색을 컴포넌트/페이지 CSS에 직접 박는 것
- **severity color를 non-severity UI 사용** (DESIGN.md §3.4) — 단 §2.2 narrow whitelist 만. non-severity status/outcome 은 §2.1 review-tone palette 만
- 기존 테스트를 약화시켜 regression을 숨기는 것
- doctrine §1 컨텍스트 체크리스트 건너뛰고 redesign 착수
- 같은 세션에서 writer/reviewer 겹치기 (doctrine §5)
- bootstrap.md 체크리스트 스킵 후 "계약 요약만으로 충분" 판단
- mock drift (Pretendard 단독 / `--sb-*` prefix / `--source-*-surface/-border` 페어 / `.ver-tag` severity-medium / `.tab.danger` severity-critical 등) 무의식적 흡수
- Reviewer 가 "drift 라 유지" 자가 판단으로 mock layout 흡수 누락 통과
- WR acceptance criteria 좁게 해석해 mock layout 전면 흡수 의도 누락
- Backend 신규 계약 데이터 정합성을 자가 판단 매핑으로 채우는 것 — lane WR 로 협상 의무
- 새 토큰 / 새 색 도입 — review-tone 도 canonical 토큰 (`--success` / `--warning` / `--danger` / `--primary` / `--foreground-*` / `--surface-*`) 만 조합
- workflow state (pending/approved/rejected/expired 등) 를 `.sev-chip` (severity component) 에 매핑 — review-tone page-local class 사용
- `--pending` slot 신설 (mock drift) — workflow-active-pending 어휘 + canonical `--primary` / `--primary-surface` 사용 (§2.1 6번째 slot)
- workflow-active-pending 화이트리스트 selector 외 다른 page 에 도입 — 본 §2.1 갱신 PR 동반 의무
- **decision-impact summary 패널** (`.appr-detail-pane__impact*` / `.approval-decision-dialog .appr-detail__impact*`) 에 severity ramp 사용 — caution-review tone 만 (§2.1)
- **Edit/Write 도구 호출 전 Read 선행 누락** — 도구가 회피 불가 hard rule. 사용자 반복 지적 (2026-04-22 + 2026-04-26)
