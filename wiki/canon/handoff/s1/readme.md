---
title: "S1 Frontend 개발 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/specs/frontend.md"
  - "wiki/canon/handoff/s1/DESIGN.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/handoff/s1/bootstrap.md"
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/api/shared-models.md"
  - "services/frontend/src/app/App.tsx"
  - "services/frontend/src/common/styles/index.css"
  - "services/frontend/src/common/ui/auth/AuthConsoleShell.tsx"
  - "services/frontend/src/common/styles/handoff/auth-console.css"
  - "services/frontend/src/common/styles/handoff/tokens.css"
  - "services/frontend/src/common/styles/handoff/base.css"
  - "services/frontend/src/common/styles/handoff/components/nav.css"
  - "services/frontend/src/common/styles/handoff/components/outcome-chip.css"
  - "services/frontend/src/common/styles/handoff/pages/dashboard.css"
  - "services/frontend/src/common/styles/handoff/app-shell.css"
  - "services/frontend/src/common/ui/primitives/OutcomeChip.tsx"
  - "services/frontend/src/common/ui/analysis/deepOutcome.ts"
  - "services/frontend/src/common/ui/analysis/RecoveryTracePanel.tsx"
last_verified: "2026-05-08"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "web-only-frontend", "handoff-css-system", "design-system-source-of-truth", "design-doctrine-enforcement", "bootstrap-protocol", "autopilot-redesign-batch", "reviewer-self-judgment-guardrail", "lane-contract-negotiation", "review-tone-palette", "workflow-state-axis", "lane-local-design-doctrine"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/DESIGN.md", "wiki/canon/handoff/s1/bootstrap.md", "wiki/canon/handoff/s1/architecture.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 Frontend 개발 인수인계서

> **새 세션이면 먼저 [`wiki/canon/handoff/s1/bootstrap.md`](bootstrap.md) 를 열 것.** 본 페이지는 그 뒤에 읽는다.
> bootstrap 체크리스트가 전부 ✅ 되기 전에 디자인 작업·변형 제안·자가 판단을 시작하지 않는다.
> 마지막 검증/갱신: **2026-05-08**

## 1. 역할과 경계

- S1은 `services/frontend/` 하위 프론트엔드 코드와 S1 canonical spec/handoff 문서를 관리한다.
- S1은 Electron 없는 **웹 전용 SPA**다.
- S1은 S2 API/WS 계약만 소비하며 다른 lane 코드를 수정하지 않는다.

## 2. 디자인 doctrine 단일화 (2026-05-08)

> 디자인 규칙 본문은 [**`wiki/canon/handoff/s1/DESIGN.md`**](DESIGN.md) 로 이전되었다.

- **권위 체인** — `DESIGN.md` §1
- **구현 계약 (Source-of-truth / Styling ownership / 신규 페이지 절차)** — `DESIGN.md` §2
- **Review-tone palette (5 outcome-quality slot + 1 workflow-state slot)** — `DESIGN.md` §3
- **Severity signal narrow whitelist** — `DESIGN.md` §4
- **금지 사항 (색·토큰 / Typography·Layout / 프로세스)** — `DESIGN.md` §5
- **QA 연결** — `DESIGN.md` §6
- **Lint grep 자동 검증** — `DESIGN.md` §7
- **Lane-local 결정 (디자이너 WR 발행 보류 항목)** — `DESIGN.md` §8

본 페이지에 남은 부분은 lane 일반 인수인계 (구조·행동·검증·소유권 / backlog / 프로세스 금지 / cycle 진행 중 상태). `handoff/s1/design-system.md` 는 mock↔impl sync table + cycle log 운영 추적 전용으로 축소되었다.

## 3. 현재 활성 파일 (주요)

> **2026-05-06 frontend restructure 반영.** `src/{api,components,contexts,hooks,layouts,shared,styles,types,utils}/` 형태에서 `src/{app, common, pages, test-setup}/` 4-bucket 구조로 재편됨. `app/` = entrypoint·라우팅·layout shell, `common/` = api/contexts/hooks/styles/types/ui/utils 등 공유 자원, `pages/` = page 단위, `test-setup/` = vitest hooks.

### 3.1 entrypoint / shell (`src/app/`)

- `services/frontend/src/app/App.tsx` (라우팅 — AuthEntryRoute / RequireAuth / RequireAdmin / ProjectLayoutShell)
- `services/frontend/src/app/main.tsx`
- `services/frontend/src/app/layouts/{GlobalLayout, DashboardLayout, ProjectLayoutShell, ProjectBreadcrumbLayout}.tsx`

### 3.2 공유 자원 (`src/common/`)

- API: `services/frontend/src/common/api/{client.ts, core.ts, source.ts, analysis.ts, projects.ts, pipeline.ts, sdk.ts, gate.ts, approval.ts, auth.ts, dynamic.ts, notifications.ts, report.ts, mock-handler.ts}` (`gate.ts` 는 `@aegis/shared` re-export)
- hooks: `services/frontend/src/common/hooks/{useSdkProgress.ts, ...}` (page 한정 hook 은 페이지 디렉토리)
- styles app-global: `services/frontend/src/common/styles/{index.css, app-base.css, button.css, dialog.css, fonts.css, animations.css, input.css, panel.css, severity.css, toast.css, typography.css}`
- styles handoff (canonical mirror): `services/frontend/src/common/styles/handoff/{tokens,base,auth-console,app-shell,compat,page-surfaces,fonts}.css` + `handoff/components/{button,choreography,dialog,distribution,divider,form-field,inline-stack,input,kpi,lang-tag,list,markdown,nav,outcome-chip,panel,pill,seg,severity,status,toast,toggle}.css` (canonical 11 + handoff-only 확장 — outcome-chip 은 workflow-active-pending tone 포함)
- styles handoff pages: `services/frontend/src/common/styles/handoff/pages/{login,signup,dashboard}.css`
- UI primitives: `services/frontend/src/common/ui/primitives/{OutcomeChip, SeverityBadge, FindingStatusBadge, ConfidenceBadge, SourceBadge, BackButton, Spinner, ConnectionStatusBanner, StateTransitionDialog, SelectField, ...}` (정확한 export 목록은 `index.ts` 참조)
- UI auth: `services/frontend/src/common/ui/auth/AuthConsoleShell.tsx` (login/signup/forgot/reset 공유 shell, `AUTH_CONSOLE_STATUS_ROWS` export)
- UI chrome: `services/frontend/src/common/ui/chrome/{Navbar, Sidebar, ErrorBoundary, NotificationBridge}.tsx`
- UI analysis: `services/frontend/src/common/ui/analysis/{deepOutcome.ts, RecoveryTracePanel.tsx, RecoveryTracePanel.css}`
- UI findings: `services/frontend/src/common/ui/findings/{FindingDetailView.tsx, FindingDetailView.css, NonAcceptedClaimsList.tsx, EvidencePanel.tsx, EvidenceViewer.tsx, ...}` (2026-05-06 PoC outcome surface + typed claim diagnostics viewer 도입)

### 3.3 페이지 (`src/pages/`)

- Auth surface: `LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage`
- 글로벌: `DashboardPage, SettingsPage, AdminRegistrationsPage`
- 프로젝트 surface: `OverviewPage, StaticAnalysisPage, FilesPage, FileDetailPage, VulnerabilitiesPage, AnalysisHistoryPage, ReportPage, QualityGatePage, ApprovalsPage, DynamicAnalysisPage, DynamicTestPage, ProjectSettingsPage`
- 페이지 디렉토리 구조: `pages/<Page>/<Page>.tsx` + `pages/<Page>/components/` + `pages/<Page>/<Page>.css` + `pages/<Page>/<Page>.test.tsx`

### 3.4 테스트 hook (`src/test-setup/`)

- `services/frontend/src/test-setup/{setup.ts, testReconnectionBehavior.ts}`

## 4. 검증 스냅샷 (2026-05-08 cycle 종료)

| 항목 | 결과 |
|---|---|
| handoff shared assets | `/login`, `/signup` + sidebar mock v2 layout 정합 |
| review-tone palette | 5 outcome-quality slot + 1 workflow-state slot (workflow-active-pending). 2026-04-27 cycle에서 AdminReg/Textarea/Radio/Input/Checkbox/two-stage-error/failed-runs-count/is-warn(2x)/ProjectSettings danger zone+SDK failure surfaces 모두 review-tone palette로 마이그레이션 — severity ramp leak production CSS 0건. **2026-05-06 cycle**: PoC outcome surface (`OutcomeChip` cleanPass/poc/quality 3 chip + caution-review claim diagnostics + NonAcceptedClaimsList per-claim viewer)에서 status→review-tone 매핑 정합 — `rejected/repair_exhausted=critical-review`, `under_evidenced/needs_human_review/retried/inconclusive/candidate=caution-review`, `withdrawn=neutral-review`, unknown=`fallback-review` (절대 success 매핑 안 함). 본 doctrine 의 정식 정의는 `DESIGN.md` §3 |
| severity exception | gate / sev-chip / severity-bound numerals + `.modal-content__shoulder.is-fail` + Approvals action-kind icon 6 selectors + 2 eyebrow labels (`DESIGN.md` §4 narrow whitelist 참조). **2026-05-06**: NonAcceptedClaimsList 의 `claim.severity` 표시는 `SeverityBadge` primitive 경유 (sev-chip family 정합) — review-tone 절대 미사용 |
| workflow-active-pending whitelist | 7 base selectors + 2 Admin 대기열 = **총 9 selectors** (`DESIGN.md` §3.2 참조) |
| frontend tests | **857 PASS / 121 files** (2026-05-08 S2 API 적합도 사이클 baseline 714 → +143 신규 tests) |
| Build | PASS, vite CSS warning 0 |
| Typecheck | PASS |
| code-reviewer / critic | **2026-05-06 cycle 1 APPROVE** (3 MINOR all 처리). **2026-05-06 cycle 2 ACCEPT-WITH-RESERVATIONS → 처리 완료** — `oh-my-claudecode:critic` fresh context. 2 MAJOR 본 cycle 내 fix: (M1) `INVALID_INPUT` toast 가이드가 hint 외 INVALID_INPUT 도 hint-specific 메시지 보이는 위험 → `error.detailMessage` 우선 → fallback `SCRIPT_HINT_INVALID_INPUT_TEXT` (when `scriptHintPath` set) → fallback generic. (M2) `buildTargets` 객체가 `handleCreate` useCallback dep 에 들어가 매 렌더 새 ref → 메모이제이션 무효화 → `addBuildTarget = buildTargets.add` stable ref 추출. 4 MINOR (AbortController 부재 / `sourceFiles` dep 불안정 / `getAllByText[0]` vs `within()` / 화살표키 네비게이션 부재) — pre-existing 또는 a11y enhancement, 본 cycle 외 deferred. Open Q (`--card` 토큰이 `index.css` compat layer 정의 — pre-existing 패턴, 다음 token consolidation 사이클 후보). **2026-05-08 S2 API 적합도 사이클** — Critic 3회 (Wave 1 / Wave 2 Phase 1 / Wave 2 Phase 2) 모두 ACCEPT after fix-ups |
| qa-tester (Playwright) | **deferred** — dev server 환경 필요. 다음 round |
| lint grep (production CSS) | hex 0 (DynamicAnalysisPage console theme 제외, 별도 WR) / oklch 0 (handoff/index.css 외) / drift token (`--pass/--fail/--warn/--pending/--neutral/--sb-*`) 0 / Pretendard 직접 0 / severity ramp leak (`DESIGN.md` §4 화이트리스트 외) 0 |
| handoff sync table 정합 | 2026-05-08 갱신 — 9 신규 page-local CSS row 등록 (S2 API 적합도 사이클). `handoff/s1/design-system.md` §1 sync table 운영 추적 |
| lane-local 결정 채택 (디자이너 WR 발행 보류) | (1) Paperlogy-unified mono 정식 채택 — `DESIGN.md` §1·§4 권위와 충돌하지만 lane-local 정책으로 운영, sync table 명시 추적  (2) DynamicAnalysisPage 콘솔 terminal aesthetic page-scoped 정식 인정 — page-local 토큰 유지. 자세한 사유는 `DESIGN.md` §8 |
| LOW backlog 정리 (2026-04-27 round 2) | ApprovalsPage gap 4px/8px → token 매핑, hero-verdict__bar / appr-row__rail / QualityGate hero-verdict__bar `width: 4px` → `var(--space-2)`, ticketRef audit-only 명시 + S2 contract L1 의존 helper text, index.css unused 토큰 82개 제거 (730→586 lines, 정의 113→36 1:1 사용 매칭) |
| 2026-05-04 audit follow-through | F1 (cloneSource body `{url}→{gitUrl}`) S1 단독 처리, F2 (PoC facade outcome gating) S2 협상 완료 + S1 wire-up 완료. F3 (S7 `tool_choice="required"`) / F4 (S3 internal) S1 무관 |
| WR 정리 (2026-05-06, 모두 MCP) | `complete_wr` 3건: poc-facade reply / nonacceptedclaim reply / claim-diagnostics validation notice. 발행 2건: poc-facade-result-outcome-gating / nonacceptedclaim-typed-export — S2 회신·구현 완료 |

## 5. 다음 작업 기준

1. 새 페이지/변형 요청 → `design-doctrine.md` §1 컨텍스트 체크리스트 → §4 변형 전략 (3+축 옵션) → 사용자 선택. 자세한 절차는 `DESIGN.md` §2.3.
2. 미구현 기능은 mock UI OK, 단 구조/상태/문구는 handoff 산출물 + canonical mocks 기준. 새 색/폰트/토큰 0.
3. 문서는 디자인 취향이 아닌 **구조·행동·검증 계약** 기록.
4. handoff shared asset 구조와 실제 코드 동기화 유지 (`handoff/s1/design-system.md` §1 sync table).
5. 디자인 규칙 질문/재판정 → upstream `DESIGN.md` 문자적 권위 인용. lane-local 적용은 `handoff/s1/DESIGN.md`.
6. **Writer 자가 approve 금지**. S1-QA 또는 `code-reviewer` agent 별도 fresh context.
7. **Reviewer "drift, 유지" 자가 판단 통과 금지**.
8. 사용자가 mock 외부 채널 위임 시 의도는 **mock layout 전체 흡수**.
9. **Backend 데이터 정합성 의문 시 자가 판단 매핑 금지** — lane WR 협상.
10. 디자인 doctrine 의 모든 항목 (review-tone / severity whitelist / workflow-state / decision-impact 정합 등) 은 `DESIGN.md` 단일 권위 참조.

## 6. 문서 우선순위

1. 활성 규칙 source-of-truth = wiki canon
2. 디자인 규칙 권위 = upstream `wiki/canon/design-system/DESIGN.md` + mocks + assets, lane-local = `wiki/canon/handoff/s1/DESIGN.md`
3. lane operational tracking = `handoff/s1/design-system.md` (sync table + cycle log)
4. repo 내부 docs 활성 디자인 지침 X
5. historical session/WR 의 과거 용어 = 증거 보존
6. 부팅/라우팅 = `bootstrap.md` 전담
7. **Backend 신규 계약에 대한 frontend 활용 사이클 → 별도 WR 협상**

## 7. redesign / 계약-활용 백로그 (2026-05-06 기준)

### 7.1 완료
- ✅ **2026-05-08 cycle 2 (디자인 지침 단일화)**:
  - `wiki/canon/handoff/s1/DESIGN.md` 신규 (303 lines, 20KB) — 권위 체인 / 구현 계약 / 금지 사항 / review-tone palette / severity narrow whitelist / 신규 페이지 절차 / QA 연결 / lint grep 정책 / lane-local 결정 / 빠른 링크 / 갱신 정책 단일 권위
  - `handoff/s1/design-system.md` operational tracking 전용 축소 (sync table + cycle log)
  - `handoff/s1/readme.md` (이 문서) §2/§2.1/§2.2/§3/§9 design 항목 stub 처리, lane 일반 인수인계 전용
  - `handoff/s1/bootstrap.md` §2.5 lane 계약 entry 갱신
  - 검증: 코드 무변경 (doctrine 단일화는 wiki only), typecheck/vitest/build 영향 없음
- ✅ **2026-05-08 (S2 API 적합도 풀-스윕 — 16 missing + 20 drift + 7 dead 처리)**:
  - **Trigger**: S2 API 계약 전수 감사 — MISSING 16 endpoint (REST + WS), DRIFT 20 type/shape, DEAD 7 (createHeartbeat / registerSdkByPath / fetchModuleReport×3 / fetchGateDetail / fetchGateProfiles). 사용자 요청: 전체 connect + align + 제거.
  - **Wave 1 — 데이터 레이어 (5 병렬 에이전트)**:
    - `pipeline.ts`: `PipelineStatusResponse` 확장 (`message?/error?/isRunning`), `runPipelineTarget` → `{pipelineId, targetId, status}`, `discoverBuildTargets` → `DiscoverBuildTargetsResult ({discovered, created, targets, elapsedMs})`, `createBuildTarget` body `buildSystem?`, 신규 `preparePipeline`/`preparePipelineTarget`.
    - `source.ts`: `UploadStatusSnapshot` `message?/error?/projectPath?`, 신규 `deleteSource(projectId)`.
    - `projects.ts`: `fetchProjectOverview` `.data` unwrap 통일, 신규 `updateProject(projectId, {name})`.
    - `sdk.ts`: `registerSdkByPath` **제거** (DEAD+DRIFT), 신규 `fetchSdkProfiles`/`fetchSdkProfile`/`fetchSdkMetrics` (defensive `unknown` typing).
    - `gate.ts`: `fetchGateProfiles`+`fetchGateDetail` **제거** (DEAD), 신규 `fetchGateRunResults`.
    - `report.ts`: `fetchModuleReport` **제거** (DEAD).
    - `analysis.ts`: 신규 `runDeepAnalysis`/`abortAnalysis`/`fetchAnalysisResultsList`/`deleteAnalysisResult`/`fetchFindingsSummary` (defensive `unknown` typing).
    - `auth.ts`: 신규 `fetchRegistrationRequest`.
    - `approval.ts`: `fetchApprovalCount` → `{pending: number; total?: number}`, 신규 `fetchApprovalDetail`.
    - `notifications.ts`: `fetchNotificationCount` envelope unwrap.
    - `core.ts`: `HealthCheckResponse` 확장 (controlPolicyVersion/requestIdQueried/per-service control fields), `healthCheck`/`healthFetch` `?requestId=`.
    - `wsEnvelope.ts`: `createHeartbeat` **제거** (DEAD, contract-conflicting).
    - WS hooks discipline: seq tracker 4곳, envelope-aware refactor (useDashboardActivityFeed heartbeat 30s 누수 제거), `meta.channel` 검증, `onGiveUp` 5곳, `useDynamicTest` `maxRetries` 5→8 + terminal `testComplete`.
  - **Wave 1.5 — critic fix-up**: `useSdkProgress.test.ts` stale mock 제거, `client.test.ts` runPipelineTarget assertion 갱신, `useBuildTargets.add()` buildSystem 수용, `useBuildTargets.update()` includedPaths throws, notifications envelope unwrap, SdkProfile/SdkMetrics/FindingsSummary `unknown`/`Record<string,unknown>` weakened, fetchApprovalCount total optional, mock-handler.ts 전체 신규 endpoint 갱신, NotificationContext realtimeOffline state.
  - **Wave 2 — UI surfaces (7 wave, opus + sonnet executor)**:
    - **Phase 1 (Wave 2A+2B)**: C1 hook-level preparePipeline + SourceUploadView "빌드 검증" 버튼, B1 BuildTarget edit includedPaths UI gating (auto-lock), B2 discoverBuildTargets count toast (`${discovered}개 발견 · ${created}개 생성 · ${elapsedMs}ms`), C2 Quick/Deep 모드 토글 (caps-mono seg + 화살표키 nav), C3 abort 버튼 + ConfirmDialog danger, C4 결과 delete trash 버튼 + ConfirmDialog danger, C5 FindingsSummaryPanel (defensive render).
    - **Phase 2 (Wave 2.5+2A+2B)**: Wave 2.5 fix-up (dropzone gradient → flat var(--surface), mode-toggle box-shadow 제거, radiogroup 화살표키 nav, trash button keydown preventDefault, controller unit tests, mode-toggle aria-checked DOM assertion, C1 page-level UI mount). Phase 2A: C7 SdkProfilesPanel + C8 SdkMetricsPanel → SdkManagementSection mount, C6 QualityGateRunSection → QualityGatePage (`?runId=` URL param). Phase 2B: C9 fetchApprovalDetail + detailById cache, C10 AdminRegistrationsDetailDialog 신규 + 상세 row 버튼, C11 projects PUT rename + partial-failure toast, C12 source 일괄 삭제 + ConfirmDialog danger + 409 blocker (ApiError.detailMessage).
    - **Wave 2.7 fix-up**: C11 nameUpdated tracking + partial-failure toast, mock-handler 409 blocker simulation, QualityGateRunSection.css raw `10.5px` → `var(--text-2xs)`.
  - **신규 page-local CSS (9 파일)**: SourceUploadView.css / AnalysisHistoryPage.css / FindingsSummaryPanel.css / AdminRegistrationsDetailDialog.css / AdminRegistrationsPage.css 확장 / FilesBuildTargetBar.css / SdkProfilesPanel.css / SdkMetricsPanel.css / QualityGateRunSection.css — 전부 canonical 토큰만, 새 토큰 0, hex 0, oklch 0, severity ramp 0 (`handoff/s1/design-system.md` §1 sync table 등재 완료).
  - **Critic 3회 (모두 fresh context, 모두 ACCEPT after fix-ups)**:
    - Wave 1: REVISE → ACCEPT-WITH-RESERVATIONS (1.5 fix-up) — 2 CRITICAL + 5 MAJOR 전부 처리.
    - Wave 2 Phase 1: ACCEPT-WITH-RESERVATIONS → ACCEPT (2.5 fix-up) — 1 MAJOR + 6 MINOR 전부 처리.
    - Wave 2 Phase 2: ACCEPT-WITH-RESERVATIONS → ACCEPT (2.7 fix-up) — 2 MAJOR 전부 처리.
  - **검증**: typecheck PASS / vitest **840 PASS / 226 todo / 0 fail / 120 files** (baseline 714 → +126) / vite build PASS (2807 modules, 2.67s, exit 0) / production CSS lint grep clean (hex 0 / oklch direct 0 / drift token 0 / Pretendard 직접 0 / Geist Mono 직접 0 / raw rgba 0 / decorative gradient 0 / severity ramp leak 0).
  - **처리 통계**: MISSING 16 → 전부 connect / DRIFT 20 → 전부 align / DEAD 7 → 전부 제거.

- ✅ **2026-05-06 cycle 2 (S2 notice — BuildTarget scriptHintPath wire-up, full porting)**:
  - **Trigger**: WR `s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele` (kind=notice). S2 가 S3 finalized `build.scriptHintPath` 계약의 S1-facing/backend 측 구현 완료 통지 — `BuildTarget.scriptHintPath?: string` optional field 추가, POST/PUT 양쪽 endpoint 수용 (`null` = clear), uploaded source tree picker 재사용 권장, S2 boundary 8가지 validation (empty/absolute/Windows-drive/UNC/backslash/NUL/traversal/symlink-escape/regular-file/≤20KB/UTF-8) → `400 INVALID_INPUT`.
  - **데이터 채널** (S1 단독, BC):
    - `services/frontend/src/common/api/pipeline.ts` — `createBuildTarget` body 에 `scriptHintPath?: string` 추가, `updateBuildTarget` body 에 `scriptHintPath?: string | null` 추가 (null preserved through JSON.stringify, undefined = no-op semantic 유지).
    - `services/frontend/src/common/hooks/useBuildTargets.ts` — `add()` signature 5번째 인자 `scriptHintPath?: string` (empty string 또는 undefined 시 omit), `update()` body 타입 확장 (null pass-through).
  - **UI 신규 (frontend-design pass — `DESIGN.md` §2.3 doctrine §10 Extending 절차 정합)**:
    - `services/frontend/src/pages/FilesPage/components/BuildTargetCreateDialog/BuildTargetScriptHintTree/{BuildTargetScriptHintTree.tsx, .css, .test.tsx}` — single-pick variant (radio-style, file-only clickable, folder = expand-only). `BuildTargetTreeSelector` (multi-check) 와 의미 분리 — 별도 component. canonical 토큰만 (`--border`, `--surface-sunken`, `--border-strong`, `--foreground`, `--foreground-muted`, `--font-code`, `--text-xs/-sm`, `--space-*`, `--radius-sm`, `--primary` for focus ring). 새 토큰 0, hex 0, oklch 0, severity ramp 0.
    - `services/frontend/src/pages/FilesPage/components/BuildTargetCreateDialog/BuildTargetScriptHintField/{BuildTargetScriptHintField.tsx, .css, .test.tsx}` — section frame (`build-target-create-dialog__section` + `__section-title` + `__help` 재사용), display row (uploaded path mono + computed root-relative subtitle), root-mismatch warning (`role="alert"`, `--warning` only — review-tone caution, severity ramp 미사용), clear button. `deriveRootRelative()` 헬퍼 export (root prefix strip, missing-root null fallback). 신규 토큰 0.
  - **Dialog wire**:
    - `useBuildTargetCreateDialog.ts` — `scriptHintPath: string | null` state, `initialScriptHintPath` + `initialRelativePath` props (edit mode reconstruct uploaded path = `${root}${initialScriptHintPath}`), `setScriptHintPath` 반환. submit 시 `deriveScriptHintRoot(name, initialRelativePath)` 로 root 결정 → `toApiScriptHintPath()` 로 root prefix strip 후 backend 전송.
    - `BuildTargetCreateDialog.tsx` — `BuildTargetScriptHintField` mount, `buildTargetRoot` 계산 (`initialRelativePath` 우선, fallback `${name.trim()}/`), `onSubmit` payload 에 `scriptHintPath: string | null` 추가.
    - **400 INVALID_INPUT preflight toast** — `ApiError.code === "INVALID_INPUT"` + `scriptHintPath` non-null 시 hint-specific `SCRIPT_HINT_INVALID_INPUT_TEXT` (BuildTarget 루트 외부 / 비-텍스트 / 20KB 초과 / traversal 등 안내), 그 외 케이스는 generic 실패 toast 유지 (BuildTarget 이름·includedPaths 등 다른 INVALID_INPUT 회귀 분리).
  - **Path semantics**: state 는 raw uploaded path (e.g., `gateway/scripts/build.sh`) 저장. submit 시 BuildTarget root 기준 root-relative (`scripts/build.sh`) 로 strip 후 backend 송신. root prefix mismatch 시 (사용자가 BuildTarget 루트 밖 파일 선택 — 예: name="gateway" 인데 `lib/utils.sh` pick) → `script-hint-field__selected-warning` `role="alert"` 으로 사전 경고 + raw path 그대로 송신 → S2 가 `400 INVALID_INPUT` 으로 reject → preflight toast.
  - **Edit mode 상태**: `useBuildTargetCreateDialog` 가 dual-mode (create + edit) 지원. `onSubmit` 패턴으로 외부 caller 가 edit-mode 진입점을 신설할 때 `initialRelativePath` + `initialScriptHintPath` 전달하면 정상 reconstruct. 단 본 cycle 에서 명시적 edit UI mount site 신설은 out-of-scope (현재 `FilesPage` mount = create only). 별도 cycle 에서 edit UI 진입점 신설 시 hook 추가 변경 없이 사용 가능.
  - **WR 정리 (모두 MCP)**: `complete_wr s2-to-s1-s2-notice-buildtarget-scripthintpath-...` lane=s1.
  - **critic verdict (oh-my-claudecode:critic, fresh context)**: **ACCEPT-WITH-RESERVATIONS** → 본 cycle 내 처리 완료.
    - **MAJOR 1 (처리)**: `useBuildTargetCreateDialog.ts` 의 `INVALID_INPUT` toast 가이드가 `scriptHintPath` non-null 만 체크 → hint 외 (이름·includedPaths 등) 의 `INVALID_INPUT` 도 hint-specific 메시지 보이는 위험. **Fix**: `error.detailMessage` 가 있으면 detailMessage (백엔드 자체 메시지) 우선, 없으면 `scriptHintPath` set 시 hint-specific, 그 외 generic. 검증 테스트 추가 (`prefers ApiError.detailMessage over hint-specific text`).
    - **MAJOR 2 (처리)**: `buildTargets` 가 `handleCreate` useCallback dep 에 들어가 매 렌더 새 객체 ref → memoization 무효화. **Fix**: `addBuildTarget = buildTargets.add` stable ref 추출 후 dep 에 `addBuildTarget` 만 유지 (`useBuildTargets` 가 `add` 를 `useCallback`으로 wrap 하므로 ref 안정).
    - **추가 방어 테스트**: `initialScriptHintPath` 가 leading-slash (`/main.c`) 로 도착하는 미래 백엔드 변경 방어 — `setScriptHintPath` 시 leading slash strip → reconstruction `${root}${normalized}` 로 `src//main.c` 같은 double-slash 방지 + 단위 테스트.
    - **MINOR (deferred)**: `fetchProjectSdks` AbortController 부재 (pre-existing, R18 silent), `sourceFiles` dep 불안정 (pre-existing), `getAllByText[0]` vs `within()` 일관성 (regression 0 confirmed), 트리 화살표키 네비게이션 부재 (a11y enhancement, Tab+Enter 작동).
    - **Open Question**: `BuildTargetScriptHintTree.css:8` 의 `--card` 토큰은 `index.css` compat layer 정의 (handoff/tokens.css 가 아님) — 다른 컴포넌트 (`dialog.css`, `BuildTargetCreateDialog.css`) 도 동일 패턴이라 pre-existing. 다음 token consolidation 사이클 후보.
  - **검증**: 714 frontend tests PASS / 101 files (cycle 2 baseline 679 → +35 신규 — 33 초안 + 2 critic-driven). typecheck PASS. vite build PASS. production CSS lint grep clean (hex 0 outside DynamicAnalysisPage console / oklch 0 / drift token 0 / Pretendard 직접 0 / severity ramp leak 0 — 본 cycle 신규 CSS 파일 2개 모두 canonical 토큰만 사용).

- ✅ **2026-05-06 cycle (non-dynamic full-pipeline contract audit follow-through — F1 + F2 + NonAcceptedClaim viewer)** — 자세한 내용은 `handoff/s1/design-system.md` §2 cycle log
- ✅ **2026-04-27 drift 점검 + review-tone 정합 cycle** — 자세한 내용은 `handoff/s1/design-system.md` §2 cycle log
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
- ✅ **DESIGN.md §3 6번째 slot 신설** (2026-04-26 S1 self-publish) — workflow-active-pending (axis = workflow-state, canonical primary tint, 9 selector 화이트리스트)
- ✅ **DESIGN.md §4 severity exception 갱신** (2026-04-26 S1 self-publish) — `.modal-content__shoulder.is-fail` + Approvals action-kind icon 6 selectors + 2 eyebrow labels
- ✅ **outcome-chip.css 6번째 tone** (2026-04-26) — `.outcome-chip--workflow-active-pending` 추가 (canonical token 만)
- ✅ **QualityGatePage 2026-04-26 mock 01/02 흡수** — hero-verdict compact + override modal + GateProfile cross-fetch (Map cache dedupe) + sparkline + .gate-rule__threshold (current/threshold 직접 표시) + tally cells 폐기
- ✅ **ApprovalsPage 2026-04-26 mock 03~06 흡수** — List + Panel master-detail + Empty x2 + view-toggle + ?selected URL state + ARIA tab + 키보드 nav (Arrow/Enter/Space/Home/End) + workflow-active-pending tone + impactSummary + targetSnapshot
- ✅ **code-reviewer fresh context APPROVE** (2026-04-26) — ITERATE → 3 MAJOR fix (impact panel re-tone + §2.2 whitelist 확장 + eyebrow label 명시) → clean
- ✅ **ai-slop-cleaner pass** (2026-04-26) — net -135 lines, 16 files, post-deslop 691/108 PASS

### 7.2 deferred (이번 cycle 외부)
- 🔄 **qa-tester (Playwright) baseline regenerate** — 사용자 dev server 환경에서 별도 round. 6 surface × 3 viewport (1100/900/640) 시각 회귀 ≤ MINOR pass + console error 0 + prefers-reduced-motion 동작 검증

### 7.3 별도 WR (canonical 영역, 디자이너 처리)
- ✅ 발행 (2026-04-26): `s1-to-designer-canonical-handoff-components-nav.css-.nav-icon-.badge---severity-critical-doctri` — navbar `.nav-icon .badge` 가 severity-critical 사용 (canonical handoff/components/nav.css 영역)
- 🟡 **2026-04-27 cycle 의 두 사안은 lane-local 결정으로 채택, 디자이너 WR 발행 보류 (사용자 지시)** — 자세한 사유는 `DESIGN.md` §8

### 7.4 MINOR sweep
- ✅ **OverviewPage `.trend-summary__item--{new,resolved}` hex** (2026-04-27) — review-tone palette 정합 완료
- ✅ **ReportPage mdash inline style** (2026-04-27) — `.report-table-empty-mark` page CSS class 추출 완료
- ✅ **ApprovalsPage `gap: 4px / 8px` raw → token 매핑** (2026-04-27) — `4px → var(--space-2)` (3 위치 + impact-body 2 위치), `8px → var(--space-3)` (decision row + dialog foot). 6px는 icon+text micro-rhythm pattern 으로 raw 유지 (scale 외, 시각 균형 보존)
- ✅ **ApprovalsPage `.hero-verdict__bar` / `.appr-row__rail` `width: 4px` → `var(--space-2)`** (2026-04-27) — hairline rail 1:1 매핑
- ✅ **QualityGatePage `.hero-verdict__bar { width: 4px }` → `var(--space-2)`** (2026-04-27) — 1:1 매핑
- ✅ **QualityGateOverrideModal `ticketRef` audit-only 명시** (2026-04-27) — input 옆에 `aria-describedby` + helper text 추가 ("영구 저장은 backend `GateResult.override.ticketRefs[]` 계약 확장 후 활성화 — S2 contract L1"). 입력값은 클라이언트 상태로만 보존, S2 계약 확장 전까지 dropped on submit 정책 명시
- ✅ **`services/frontend/src/index.css` unused 토큰 정리** (2026-04-27) — 730 → 586 lines (-144). 미사용 `--cds-*` 77개 + `--aegis-glow-*` 4개 + `--aegis-spacing-05` 1개 정의 제거 (light + dark 양쪽). 정의 113 → 36 (1:1 사용 매칭). canonical 토큰 마이그레이션은 점진적 (`DESIGN.md` §2.2 #4 "신규 스타일 추가 금지" 정책 유지)

### 7.5 backlog (LOW)
- **WR3 (canonical `-deep` token 신설)** — upstream DESIGN.md §3 토큰 표 `--success-deep / --warning-deep / --severity-critical-deep` slot 표준화 검토. backlog (LOW). 2026-04-26 cycle 안 page CSS color-mix derive 로 진행
- **S2 contract L1 (override.ticketRefs)** — `GateResult.override.ticketRefs?: string[]` 추가 시 QualityGateOverrideModal 의 ticketRef 입력 활성화

## 8. 금지 사항 (process / lane only)

> 디자인 doctrine 의 색·토큰·typography·layout·process 금지 사항 전체 목록은 [`DESIGN.md` §5](DESIGN.md#5-금지-사항-단일-권위) 참조. 본 절은 lane 운영 측면의 금지 사항만 유지.

- **Edit/Write 도구 호출 전 Read 선행 누락** — 도구가 회피 불가 hard rule. 사용자 반복 지적 (2026-04-22 + 2026-04-26)
- 다른 lane 코드를 수정하는 것 (S1 은 `services/frontend/` 와 S1 canonical handoff/spec 만)
- WR runtime semantics (`register_wr`/`complete_wr`/`list_my_open_wrs`) 외 wiki MCP 호출 — 일반 wiki page 는 로컬 path 직접 Read/Edit
- WR acceptance criteria 좁게 해석해 mock layout 전면 흡수 의도 누락
- Backend 신규 계약 데이터 정합성을 자가 판단 매핑으로 채우는 것 — lane WR 로 협상 의무
- bootstrap.md 체크리스트 스킵 후 "계약 요약만으로 충분" 판단
- 같은 세션에서 writer/reviewer 겹치기 (`design-doctrine.md` §5) — Reviewer 는 fresh context (S1-QA / `code-reviewer` agent)
- Reviewer 가 "drift 라 유지" 자가 판단으로 mock layout 흡수 누락 통과
- 기존 테스트를 약화시켜 regression을 숨기는 것
- `DESIGN.md` 갱신 없이 review-tone slot / severity narrow whitelist selector / 금지 사항 추가 — doctrine 단일 권위 원칙
