---
title: "S1 Design System Adherence Guide"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/canon/feedback/s1_frontend_working_guide.md"
  - "services/frontend/src/styles/handoff/**"
  - "services/frontend/src/shared/auth/AuthConsoleShell.tsx"
last_verified: "2026-05-06"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "design-system-source-of-truth", "handoff-css-system", "review-tone-palette", "workflow-state-axis", "claim-diagnostics-viewer"]
related_pages: ["wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/handoff/s1/usecase-visibility-matrix.md", "wiki/canon/feedback/s1_frontend_working_guide.md", "wiki/canon/specs/frontend.md"]
---

# S1 Design System Adherence Guide

> S1이 구현 시 따라야 하는 AEGIS 디자인 시스템 계약의 lane-local 정리.
> 권위 자료는 `wiki/canon/design-system/readme.md` 및 그 아래 자산이며, 본 문서는 **S1 시점에서의 적용 규칙**만 명시한다.
> 마지막 검증/갱신: **2026-04-27**

## 1. 왜 이 문서가 존재하나

- AEGIS 시각 방향은 외부 디자이너가 결정한다 (`wiki/canon/handoff/s1/readme.md` §2, `wiki/canon/feedback/s1_frontend_working_guide.md` §4).
- 디자이너 handoff 자산 전체가 `wiki/canon/design-system/` 에 canonical로 귀속되었다 (2026-04-20).
- S1은 그 자산을 **ship 자격 형태로 복제**해 `services/frontend/src/styles/handoff/**` 아래에서 런타임 import 한다.
- 이 문서는 S1 개발자/에이전트가 **코드와 자산 간 계약**을 놓치지 않도록 lane-local 진입점을 제공한다.

## 2. 필독 자산 (진입 순서)

1. `wiki/canon/design-system/readme.md` — 디자인 시스템 canonical pointer + 소유 경로 지도
2. **`wiki/canon/design-system/design-doctrine.md`** — 프로세스 원칙 (anti-slop · 변형 전략 · writer/reviewer 분리). 새 작업 착수 전 반드시 확인
3. `wiki/canon/design-system/DESIGN.md` — §1~§11 전부 (Philosophy / File Layout / Color / Typography / Spacing / Radius-Shadow-Motion / Components / Patterns / Accessibility / Extending / Known gaps)
4. **`wiki/canon/handoff/s1/readme.md` §2.1 / §2.2** — review-tone palette (6 slot, axis 2개) + severity exception narrow whitelist. 2026-04-26 cycle 에서 §2.1 6번째 slot (workflow-active-pending) + §2.2 narrow whitelist 9 selectors 신설/확장
5. 페이지 구현 중이라면 `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html` 중 해당 페이지의 mock을 열어 class/copy/marker를 비교
6. 토큰·컴포넌트 규칙이 불분명하면 `wiki/canon/design-system/assets/{tokens,base,auth-console}.css` + `assets/components/*.css` + `assets/pages/*.css`

## 3. S1 구현 계약

### 3.1 Source-of-truth 순서 (충돌 시 상위가 이김)
1. `wiki/canon/design-system/DESIGN.md`
2. `wiki/canon/design-system/mocks/*.html`
3. `wiki/canon/design-system/assets/**/*.css` + `shield.svg.md`
4. `services/frontend/src/styles/handoff/**` (ship 복사본 + handoff-only 확장)
5. React 구현

(프로세스 규칙은 `design-doctrine.md` 가 별도 권위. 시각 권위와 충돌하지 않음 — 무엇을 만들지는 DESIGN.md, 어떻게 만들지는 doctrine.)

### 3.2 Styling ownership (수정)
1. **Design system handoff (read-only 복사본)**: `src/styles/handoff/*` — 원본 자산을 1:1 복제한다. 로컬 개정 금지, 원본을 먼저 수정한 뒤 다시 복제한다. **Canonical 11 (button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav) 무수정.**
2. **handoff-only 확장 (S1 자체 신설 OK)**: `handoff/{compat,page-surfaces,app-shell}.css` + `handoff/components/{outcome-chip,form-field,status,list,dialog,toast,kpi,distribution,markdown,inline-stack}.css`. 원본에 없는 AEGIS 전용 vocabulary. 새 파일 추가 시 본 §5 동기화 현황에 등록.
3. **Auth shared shell**: `src/shared/auth/*` — `auth-console.css` 구조를 유지한 채 React 래퍼만 추가한다.
4. **Legacy Carbon/shadcn 호환 레이어**: `src/index.css` — 신규 스타일을 추가하지 않는다. 토큰 프록시는 `handoff/compat.css` 를 우선한다.
5. **Page/Layout TSX 로직**: 디자인 규칙을 위반하지 않는 선에서만 수정한다.

### 3.3 금지 사항 (doctrine §2 + handoff §9 요약)

#### 색·토큰
- DESIGN.md §3 규칙 밖의 색을 컴포넌트/페이지 CSS에 직접 박는 것
- **severity color를 non-severity UI 에 사용** (DESIGN.md §3.4) — 단 handoff §2.2 narrow whitelist 만 (gate/cell-gate/sev-chip/severity-bound numerals + `.modal-content__shoulder.is-fail` + Approvals action-icon 6 selectors + 2 eyebrow labels)
- 새 토큰 / 새 색 도입 — review-tone 도 canonical 토큰 (`--success` / `--warning` / `--danger` / `--primary` / `--foreground-*` / `--surface-*`) 만 조합
- mock drift 토큰 흡수 (`--pass` / `--fail` / `--warn` / `--pending` / `--neutral` / `--sb-*` / `--source-*-surface/-border` 등) — 어휘 자체 무의식적 사용 금지

#### review-tone palette (handoff §2.1, 2026-04-26 갱신)
- workflow status (pending/approved/rejected/expired 등) 를 `.sev-chip` (severity component) 에 매핑 — review-tone page-local class 사용
- `--pending` slot 신설 (mock drift) — workflow-active-pending 어휘 + canonical `--primary` / `--primary-surface` 사용 (§2.1 6번째 slot)
- workflow-active-pending 화이트리스트 7 selector 외 다른 page 에 도입 — handoff §2.1 갱신 PR 동반 의무
- decision-impact summary 패널 (`.appr-detail-pane__impact*` / `.approval-decision-dialog .appr-detail__impact*`) 에 severity ramp 사용 — caution-review tone (warning surface) 만

#### typography·layout
- Paperlogy/Geist Mono 이분 typography를 page 단에서 덮어쓰는 것 (§4)
- 그라데이션 배경 / rounded-with-left-border 카드 / SVG 일러스트 / data slop — 자세한 목록은 `design-doctrine.md` §2
- 신규 "view mode" 를 `body.<mode>` 스위치 없이 하드코딩하는 것 (§8.5)
- 운영 신호 영역(Needs Attention, live indicator, critical counter, hero-verdict, gate-card meta, sparkline 등) 을 좁은 뷰포트에서 숨기는 것 (§8.5 hard rule) — `display: none` 금지, stack 으로

#### 프로세스
- 한 세션에서 writer/reviewer 겹치기 (doctrine §5) — Reviewer 는 fresh context (S1-QA / `code-reviewer` agent)
- Reviewer 의 "drift, 유지" 자가 판단으로 mock layout 흡수 누락 통과
- WR acceptance criteria 좁게 해석해 mock layout 전면 흡수 의도 누락
- Backend 신규 계약 데이터 정합성을 자가 판단 매핑 (e.g. hardcoded threshold map) 으로 채우는 것 — lane WR 협상 의무 (handoff §9)

### 3.4 신규 페이지/컴포넌트 추가 절차

1. **doctrine §1 컨텍스트 체크리스트** 먼저 돌린다 (색/밀도/타이포/caps-mono/live signal 재사용 여부).
2. 디자이너 자산에 해당 페이지/컴포넌트가 있는지 확인한다.
   - 있음 → `wiki/canon/design-system/assets/` 에 새 파일이 이미 있다. `services/frontend/src/styles/handoff/` 로 복제한다.
   - 없음 → DESIGN.md §10 "Extending" 절차를 따라 기존 토큰·컴포넌트로 조합한다. 새 색/폰트/토큰을 만들지 않는다.
3. `pages/<Page>/<Page>.tsx` + `pages/<Page>/components/` 구조 유지 (`wiki/canon/feedback/s1_frontend_working_guide.md` §5.3).
4. 페이지 HTML mock이 있으면 그 class·copy·DOM 순서·data-* 속성을 React 구현에 1:1 반영한다.
5. `document.title = "AEGIS — {Page Name}"` 설정, AuthEntryRoute/RequireAuth 중 적절한 가드를 씌운다.
6. `services/frontend/src/styles/handoff/` 와 원본 자산 간 diff를 기록한다. 의도적 adaptation이면 이 문서 §5 동기화 현황에 추가 사유를 남긴다.
7. 변형을 제안하는 요청이면 doctrine §4 전략대로 3+개 축을 미리 제시한다.
8. **Backend 신규 계약 활용 시** — frontend 자가 매핑 금지. 미공급 필드는 dim "—" placeholder + cross-fetch entry point 박아두고 lane WR 협상 (handoff §9).

## 4. QA 연결

- S1-QA는 본 handoff 자산과 구현의 drift를 단일 사이클 원칙으로 검증한다 (`wiki/canon/handoff/s1/qa-guide.md` + `wiki/canon/handoff/s1/design-mock-review-workflow.md`).
- QA 증거는 mock HTML 경로 (`wiki/canon/design-system/mocks/*.html` 또는 cycle-specific mock 경로) + DESIGN.md 절 번호로 인용한다.
- QA 체크리스트 기준은 `design-doctrine.md` §6 (토큰 준수 / 패턴 준수 / anti-slop 점검 / 반응형·접근성) 을 참조한다.
- 유스케이스 가시성 매트릭스 (`wiki/canon/handoff/s1/usecase-visibility-matrix.md`) 의 MUST 항목은 DESIGN.md 규칙과 모순되지 않도록 유지한다.
- **lint grep 자동 검증 (handoff §8.1)** — `oklch(/hex` (excluding color-mix), drift token 어휘 (`--pass/--fail/--warn/--pending/--neutral/--sb-`), `Pretendard/Geist Mono` 직접, `.sb-/.crumb` 흡수 → 모두 production CSS 0건 의무

## 5. Mock ↔ Impl 동기화 현황 (2026-05-06)

| 파일 | 상태 |
|---|---|
| `tokens.css` | **drift (의도적, S1 lane-local 결정)** — `--font-mono` 매핑이 canonical 의 `'Geist Mono Variable'` ramp 대신 **Paperlogy-unified** (`'Paperlogy', 'Pretendard Variable', ..., sans-serif`). 추가 `--font-code` (ASCII monospace ramp — `ui-monospace, 'SF Mono', ..., monospace`. **2026-04-27 deslop cycle 재확인**: production CSS 32 usage 실재 (정의 2건 별도) — handoff/components/status.css, handoff/app-shell.css, OverviewPage/StaticAnalysisPage page CSS, FindingList/FindingShared. 이전 "실사용 0" 기재 부정확). `.mono { font-feature-settings: 'zero', 'ss01' }` 대신 `font-variant-numeric: tabular-nums`. 사유: `@fontsource-variable/geist-mono` 미설치 + 한국어 ↔ 데이터 시각 톤 통일. lane-local 정식 채택 — DESIGN.md §1·§4 권위와 본 sync table 사이 충돌은 본 row 기재로 명시 추적, 추후 디자이너 측 갱신 동기화 시 정합 |
| `base.css` | 바이트 동일 |
| `auth-console.css` | **drift (의도적, S1 self-publish)** — SPA full-viewport 적응으로 `height: 100vh`, `overflow: hidden`, `min-height: 0`, `.form-panel { justify-content: flex-start }` (canonical은 `center`), `.form-wrap.wide { margin-block: auto }` 추가. 사유: SPA shell 안에서 form pane이 viewport 안에 안정적으로 들어가도록. canonical mock은 standalone HTML이라 viewport 가정이 다름 |
| `components/*.css` (canonical 11) | 전부 바이트 동일 — button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav |
| `components/outcome-chip.css` (handoff-only 확장) | 2026-04-26 6번째 tone 추가 — `.outcome-chip--workflow-active-pending` (canonical `--primary` / `--primary-surface` 사용, 새 토큰 0). 원본 자산 없음 (S1 self-publish, handoff §2.1 6번째 slot 동반) |
| `components/kpi.css` (handoff-only 확장) | **2026-04-27 review-tone 정합** — `.kpi dd.is-warn` color 가 `--severity-high` → `--warning` (review-tone caution). threshold-near KPI signal은 워크플로 caution이지 finding severity 아님 (handoff §2.1 정합) |
| `components/{form-field,status,list,dialog,toast,distribution,markdown,inline-stack}.css` | handoff-only 확장. 원본 없음 |
| `pages/login.css` | 바이트 동일 |
| `pages/signup.css` | 바이트 동일 |
| `pages/dashboard.css` | **base 추출 + scope 재맵핑 (의도적, S1 self-publish)** — canonical의 `.page-head { display:flex; ... }` / `.section-head` base 룰을 `services/frontend/src/styles/handoff/app-shell.css` 로 추출하고, `pages/dashboard.css` 는 `.dashboard-main .page-head h1 em` 등 dashboard-unique scope로 재맵핑. 활동 아이콘 spacing / load-more 패딩 / center-cell 추가 룰 유지 |
| `fonts.css` | CDN → 로컬 경로 (의도적 번들 adaptation), 헤더 주석 제거 |
| `compat.css` / `page-surfaces.css` / `app-shell.css` | handoff-only 확장, 원본 없음 |
| `services/frontend/src/pages/FilesPage/components/BuildTargetCreateDialog/BuildTargetScriptHintTree/BuildTargetScriptHintTree.css` (page-local, handoff layer 아님) | **2026-05-06 cycle 2 도입** — single-pick file picker tree (`.script-hint-tree`, `__row(--folder/--file/--selected/--disabled)`, `__indent`, `__radio(/-spacer)`, `__chevron(-spacer)`, `__folder-icon`, `__file-icon`, `__name(--folder/--file)`, `__count`). 모든 토큰 canonical (`--border`, `--surface-sunken`, `--border-strong`, `--foreground`, `--foreground-muted`, `--font-code`, `--text-xs/-sm`, `--weight-semibold`, `--space-*`, `--radius-sm`, `--primary` for focus outline only). 새 토큰 0, hex 0, oklch 0, severity ramp 0. selection state affordance 는 `--surface-sunken` bg + `--border-strong` 2px left rail + bold (workflow-active-pending whitelist 외 영역이라 primary tint 회피, neutral selection 표현). `BuildTargetTreeSelector` (multi-check) 와 의미 분리된 별도 component — 단일 file pick semantics 명확화 |
| `services/frontend/src/pages/FilesPage/components/BuildTargetCreateDialog/BuildTargetScriptHintField/BuildTargetScriptHintField.css` (page-local, handoff layer 아님) | **2026-05-06 cycle 2 도입** — section frame container (`__selected`, `__selected-meta/-label/-path/-relative/-warning`, `__clear`, `__placeholder`). selection card 는 `--surface-sunken` bg + `--border-subtle` 1px outer + `--border-strong` 3px left rail + `--font-code` mono path display. root-mismatch warning 는 `--warning` color only (review-tone caution-review tone 정합, severity ramp 미사용 — handoff §2.1 정합). placeholder 는 dashed `--border-subtle` + italic muted text. clear button ghost (`--border` → hover `--border-strong`). 모든 토큰 canonical, 새 토큰 0, hex 0, oklch 0, severity ramp 0. dialog body 의 기존 section vocab (`build-target-create-dialog__section` + `__section-title` + `__help`) 재사용 — IncludedPathsField 와 동일 frame |
| `services/frontend/src/common/ui/findings/FindingDetailView.css` (page-local, handoff layer 아님) | **2026-05-06 PoC outcome surface 도입** — `.finding-poc-outcome-row` (OutcomeChip 3개 horizontal row) + `.finding-poc-diagnostics` + `__title/__counts/__code/__count` (caution-review tone — `--warning` / `--warning-surface`) + `.finding-poc-claims-list` + `.finding-poc-claim` + `__head/__chip-row/__family/__code/__primary/__meta/__body/__field/__evidence/__trail/__history` (NonAcceptedClaimsList collapsible viewer). 모든 토큰 canonical (`--success` / `--warning` / `--primary` / `--surface-sunken` / `--border-subtle` / `--space-*` / `--text-*` / `--weight-*` / `--font-code` / `--radius-sm` / `--foreground{,-muted}`). 새 토큰 0, hex 0, oklch 0, severity ramp 0 (severity 표시는 `SeverityBadge` primitive 경유 — handoff §2.2 sev-chip whitelist 정합). `common/ui/findings/` 는 multi-page 재사용 디렉토리이므로 다른 page 가 동일 caution-review claim viewer 패턴 도입 시 (a) 본 component 추출 또는 (b) page-scoped class 신설로 협상 — 두 page 가 같은 `.finding-poc-*` selector 에 직접 의존하면 anti-pattern |

신규 drift 발견 시 이 표를 갱신하고 원본 자산과의 관계를 명시한다.

## 6. Cycle 별 산출물 요약

### 2026-05-06 cycle 2 (S2 notice — BuildTarget scriptHintPath full-port wire-up)
- **Trigger**: WR `s2-to-s1-s2-notice-buildtarget-scripthintpath-...` (kind=notice). S2 가 BuildTarget 에 optional `scriptHintPath?: string` 추가, POST/PUT 양쪽 endpoint 수용 (`null` = clear), 8가지 boundary validation → `400 INVALID_INPUT`. 사용자 요청: 풀 포팅 + 신규 UI.
- **데이터 채널**: `pipeline.ts` create/update body type 확장 (null pass-through for clear semantic, undefined omit for no-op). `useBuildTargets.add()` 5번째 인자 `scriptHintPath?: string` (empty/undefined → omit).
- **신규 컴포넌트 (frontend-design pass)**:
  - `BuildTargetScriptHintTree` — single-pick variant (radio-style indicator via `Circle` / `CircleDot`, file-only clickable, folder click = expand-only). `BuildTargetTreeSelector` (multi-check) 와 의미 분리된 별도 component.
  - `BuildTargetScriptHintField` — section frame (handoff §3.4 doctrine §10 Extending 준수 — 기존 dialog `__section`/`__section-title`/`__help` vocab 재사용), display row (uploaded path mono + computed root-relative subtitle), root-mismatch warning (`role="alert"`, `--warning` color only — review-tone caution, severity ramp 미사용), clear button ghost. `deriveRootRelative()` helper export.
- **CSS 디자인 결정 (handoff §3.3 정합)**:
  - selection state affordance: `--surface-sunken` bg + `--border-strong` 2px left rail + bold. workflow-active-pending whitelist 외 영역이므로 primary tint 회피 — neutral selection 표현.
  - root-mismatch warning: `--warning` color only (caution-review tone). severity ramp 미사용.
  - 모든 토큰 canonical (`--border`, `--border-subtle`, `--border-strong`, `--surface-sunken`, `--foreground`, `--foreground-muted`, `--font-code`, `--text-xs/-sm`, `--weight-semibold`, `--space-*`, `--radius-sm`, `--primary` for focus only, `--warning` only for caution warning). 새 토큰 0, hex 0, oklch 0, severity ramp 0.
- **Dialog wire**: `useBuildTargetCreateDialog` 가 `scriptHintPath` state + `initialScriptHintPath` + `initialRelativePath` props 추가, edit-mode reconstruct (`${root}${initialScriptHintPath}`), submit 시 `toApiScriptHintPath()` 로 root-strip. `BuildTargetCreateDialog` 가 `BuildTargetScriptHintField` mount + `buildTargetRoot` 계산. 400 INVALID_INPUT preflight toast (hint-specific text — handoff §9 정합, generic 실패 toast 와 분리).
- **Path semantics**: state = raw uploaded path. submit 시 BuildTarget root prefix strip → backend root-relative. mismatch 시 raw path 송신 + 사전 alert 경고 → S2 reject → preflight toast.
- **handoff §5 sync table 갱신** (이 문서) — 2 신규 page-local CSS row 등록 (BuildTargetScriptHintTree.css + BuildTargetScriptHintField.css), canonical 토큰 어휘 + 의미 분리 명시.
- **WR closure (MCP)**: `complete_wr s2-to-s1-s2-notice-buildtarget-scripthintpath-...` lane=s1.
- **critic verdict (oh-my-claudecode:critic, fresh context)**: ACCEPT-WITH-RESERVATIONS → 처리 완료. M1 (`INVALID_INPUT` toast 가이드 hint 외 leak) → `error.detailMessage` 우선 fallback chain. M2 (`buildTargets` 객체 useCallback dep ref 불안정) → `addBuildTarget = buildTargets.add` stable ref 추출. 추가 방어 (`initialScriptHintPath` leading-slash strip, double-slash 방지). MINOR 4건 + Open Q 1건 deferred (pre-existing 또는 a11y enhancement).
- **검증**: 714 frontend tests PASS / 101 files (cycle 2 baseline 679 → +35 신규 — pipeline +5 / hook +4 / ScriptHintTree +7 / ScriptHintField +11 / dialog scriptHintPath surface +8 incl. critic-driven 2). typecheck PASS. vite build PASS. production CSS lint grep clean.

### 2026-05-06 cycle (non-dynamic full-pipeline contract audit follow-through — F1 Git clone body fix + F2 PoC outcome wire-up + NonAcceptedClaim typed viewer)
- **Audit context**: `wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md` 의 F1·F2 follow-through. F3 (S7 `tool_choice="required"`) / F4 (S3 internal) 는 S1 무관, 본 cycle 외.
- **F1 — `cloneSource` body mismatch (S1 단독)**:
  - `services/frontend/src/common/api/source.ts:80-90` — `cloneSource` 인자명 `url` → `gitUrl`, body `{url, branch}` → `{gitUrl, branch}`. canonical contract `wiki/canon/api/shared-models.md:915` + backend controller 정합. UI caller 변수명도 이미 `gitUrl` 이었으므로 의미 정합.
  - `services/frontend/src/common/api/client.test.ts` — `cloneSource` 회귀 테스트 2건 추가 (canonical body 키 검증 + branch omit + `body.url` undefined 명시).
- **F2 — PoC outcome wire-up (S1 ↔ S2 협상)**:
  - WR `s1-to-s2-poc-facade-result-outcome-gating-pocoutcome-qualityoutcome-cleanpass` 발행 → S2 reply `s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui` (S2 가 `pocOutcome` / `qualityOutcome` / `cleanPass` / `claimDiagnostics?` forward 구현 + `@aegis/shared` `PocResponseData` 정식 export, BC 정책 명시).
  - S1 wire-up:
    - `services/frontend/src/common/api/analysis.ts` — local `PocResponse` 인터페이스 제거, `@aegis/shared` `PocResponseData` 채택 + re-export.
    - `services/frontend/src/common/ui/findings/FindingDetailView.tsx` — PoC 카드에 `OutcomeChip` 3개 (`cleanPass` headline + `poc` + `quality` sm) + non-clean (`!cleanPass`) 시 `lifecycleCounts` caution-review surface. Clean PoC predicate 하드코딩 0 — `pocData.cleanPass` 직접 사용 (S2-prescribed). `tokenUsage` optional guard.
    - `latencyMs <100ms` 시 `<0.1초` 표시 (cosmetic 정직성 — `0.0초` 모호성 제거).
- **F2 후속 — typed `NonAcceptedClaim` viewer (S1 ↔ S2 follow-up)**:
  - WR `s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla` 발행 → S2 reply `s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim` + S2 notice `s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-and-malformed-diagnost`.
  - S2 가 `NonAcceptedClaim` + `NonAcceptedClaimLifecycleStage` + `NonAcceptedClaimOutcomeContribution` + `NonAcceptedClaimEvidenceTrailEntry` + `NonAcceptedClaimRevisionHistoryEntry` 정식 export, `AgentClaimDiagnosticsSummary.nonAcceptedClaims?: NonAcceptedClaim[]` narrow, S2 boundary runtime validation 추가 (malformed = omit, untyped 노출 0).
  - S1 측 신규: `services/frontend/src/common/ui/findings/NonAcceptedClaimsList.tsx` — collapsible per-claim viewer.
    - `status` 필드 canonical lifecycle key 사용 (S2 가 `lifecycleStage` alias 합성 안 함 — S1 도 alias 0).
    - status→review-tone 매핑: `rejected/repair_exhausted=critical-review`, `under_evidenced/needs_human_review/retried/inconclusive/candidate=caution-review`, `withdrawn=neutral-review`, unknown=`fallback-review` (절대 success 매핑 안 함).
    - sort priority: `rejected → repair_exhausted → needs_human_review → under_evidenced → retried → inconclusive → candidate → withdrawn`, 동률 시 `retryCount` desc.
    - viewer gate `claimDiagnostics?.nonAcceptedClaims?.length > 0` (S2 notice prescription).
    - severity 표시는 `SeverityBadge` primitive (handoff §2.2 sev-chip whitelist 정합 — review-tone 절대 미사용).
    - body 영역: rejectionReason / detail / outcomeContribution / requiredEvidence (present-missing tinting `--success`/`--warning`) / evidenceTrail / revisionHistory / invalidRefs.
    - 타입 access: `NonAcceptedClaim` 만 (handoff §9 정합, untyped `Record<string, unknown>` access 0).
  - 신규 page-local CSS — `.finding-poc-claims-list` + `.finding-poc-claim*`. canonical 토큰만, 새 토큰 0.
  - 신규 unit test `NonAcceptedClaimsList.test.tsx` — 9 테스트 (status→tone helper 3 / sortClaims invariants 2 / render head 1 / expand body 1 / empty array smoke 1 / claimId-absent fallback 1).
- **handoff §5 sync table 갱신** (이 문서) — `FindingDetailView.css` page-local row 신규 등록 + 다른 page 재사용 협상 정책 명시.
- **WR 정리 (모두 MCP)**:
  - `complete_wr s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui` lane=s1 (2026-05-06T03:57:47.370Z)
  - `complete_wr s2-to-s1-reply-nonacceptedclaim-typed-export-...` lane=s1 (2026-05-06T05:52:51.922Z)
  - `complete_wr s2-to-s1-notice-poc-claimdiagnostics-now-has-s2-runtime-validation-...` lane=s1 (2026-05-06T05:52:56.280Z)
- **critic verdict (oh-my-claudecode:critic, fresh context)**: **APPROVE**. 3 MINOR (evidenceTrail fallback chain 문서화 / `claims=[]` defensive smoke test / `latencyMs` cosmetic) → 본 cycle 안에서 모두 처리. 추가 위반 0.
- **검증**: 679 frontend tests PASS / 99 files (baseline 670 → +9 신규 — cloneSource 2 + generatePoc outcome 1 + NonAcceptedClaimsList 6+1 idx 1 empty 1; 본 cycle 시작 670 → +9). typecheck PASS. vite build PASS. production CSS lint grep clean (hex 0 outside DynamicAnalysisPage console / oklch 0 / drift token 0 / Pretendard 직접 0 / severity ramp leak 0).

### 2026-04-27 cycle 2 (autopilot deslop — DynamicAnalysisPage badge token migration + type slop + dead fallback + auth status row 통합 + §2.2 정식 등록)
- **DynamicAnalysisPage 비-console 영역 hex 5종 → canonical 토큰 마이그레이션** (handoff §2.1 review-tone palette 정합):
  - `.monitoring-connection-badge--connected` / `.monitoring-injection-badge--normal` / `.dynamic-status-badge--monitoring` (`#10b981` family) → `var(--success)`
  - `.monitoring-injection-badge--crash` (`#ef4444` family) → `var(--danger)`
  - `.monitoring-injection-badge--anomaly` (`#f59e0b` family) → `var(--warning)`
  - `.monitoring-injection-badge--timeout` (`#0ea5e9` family) → `var(--primary)`
  - `.dark .monitoring-*` / `.dark .dynamic-status-badge--monitoring` 별도 override 6개 제거 (canonical 토큰은 theme-aware)
  - 보존 영역: line 165+ console aesthetic 의 `--console-fg/-bg/-bg-hi/-green/-amber/-red/-red-soft` page-local 토큰 (handoff §8.3 lane-local 정식 채택, 이번 cycle 변경 없음)
- **AI slop 정리**:
  - `var(--warning, var(--info))` defensive fallback 2 위치 (`OverviewPage.css:151` `.overview-identity__stat--warn`, `StaticAnalysisPage.css:17` `.static-dashboard-identity__stat--warn`) → `var(--warning)` 단순화 (canonical token이라 fallback 무의미, dead defensive code)
  - `StaticAnalysisPage.css:285` raw `oklch(0.62 0.14 150 / 0.3)` → `color-mix(in srgb, var(--success) 30%, transparent)` (oklch 직접 사용 금지 정책 정합)
  - `as any` ConnectionStatusBanner cast 2 위치 (`DynamicAnalysisHistoryView:149`, `DynamicTestHistoryView:158`) → 제거. props 타입을 `string` → `ConnectionState` 로 narrow + hooks chain (`useDynamicAnalysisPage:128`, `useDynamicTestPage:18`) 동반 정합
  - `loginStatusRows` const 3 위치 동일 복제 (LoginPage / ForgotPasswordPage / ResetPasswordPage) → `AUTH_CONSOLE_STATUS_ROWS` 로 `shared/auth/AuthConsoleShell.tsx` export, 3 페이지 모두 import 로 전환
- **handoff §2.2 narrow whitelist 정식 확장** (이전 cycle 미등록 selector 형식화):
  - **Severity-bound finding tags (sev-chip family)**: `.report-sev-tag.{--critical,--high,--medium,--low}` (+ `::before`), `.hist-sev-summary__val.{--critical,--high,--medium,--low}` — `.sev-chip` 의 page-local 동등 vocabulary
  - **Gate verdict block (gate context family)**: `.hero-verdict--blocked` 의 `__bar`/`__icon`/`__title` (`--severity-critical`), `.hero-verdict--caution` 의 동일 3 selectors (`--severity-high`) — `.gate.{blocked,warn}` 의 page-local 동등 vocabulary. `--ok`/`--running` 은 review-tone (`--success`/`--primary`) 사용
  - 사유: 이전 cycle 의 lint grep "leak 0건" 클레임이 위 selector 들을 누락. 형식화로 narrow whitelist 명시
- **API 계약 정합 감사** (autopilot Phase 2.3): 14 frontend api 파일 × 50+ endpoint 전수 점검 — wiki/canon/api/* 및 `@aegis/shared` 와 **0 mismatch**. S2-WR 발행 불필요
- **critic verdict (fresh context)**: APPROVE. MINOR 4건 (모두 documentation precision, blocking 0):
  - `constants/languages.ts` 의 inline color 사용처는 2 위치 (`useFilesPage.tsx:220`, `FileDetailHeader.tsx:21,57`) — 이전 "단 1 위치" 기재가 undercount. keep 결정 자체는 유지 (GitHub linguist semantic data)
  - `--cds-*` legacy token 25 usage (page CSS, compat layer 경유) 잔재. 이번 cycle out-of-scope, 다음 cycle 검토 대상
  - `FileDetailHeader.tsx:21` 의 `"var(--cds-text-placeholder)"` fallback — 사전 존재 legacy, 별도 정합 cycle 대상
  - `--font-code` usage count "14+" → 정확히 32 usage (정의 2 별도). 본 cycle 의 sync table row 정정 완료
- **WS 정밀 감사 (사용자 follow-up 요청)**: 7 채널 × path/query/message-type/envelope/seq/heartbeat/reconnect 전수 점검 — `shared-models.md` §4 와 0 mismatch. 단 1건 MINOR 식별 → 본 cycle 안에서 해결:
  - `utils/wsEnvelope.ts:167` `createReconnectingWs.onclose` 가 모든 close 를 동일 reconnect 시도 → close code `4000` (S2 missing subscription key, `shared-models.md` §4.5) 시 retry 중단 + `setState("failed")` + `onGiveUp` 호출 분기 추가
  - 신규 단위 테스트 2건 (`utils/wsEnvelope.test.ts` `describe("createReconnectingWs close code handling")`): 4000 시 no-retry + onGiveUp / 1006 transient 시 reconnect 진행. MockWebSocket harness 추가
  - 회귀 검증: 693 PASS / 109 files (이전 691/108 + 신규 2 tests). 첫 시도에서 8 wsReconnect + 2 hook tests 가 `event.code` 접근 throw 로 깨짐 → defensive `event?.code` (optional chaining) 으로 수정 (기존 mock `onclose: () => void` signature 호환), 모두 복구
  - **critic verdict (fresh context)**: APPROVE. backend `ws-broadcaster.ts` 가 4000 만 사용하고 1000/1006 등은 retry 진행이 의도된 동작임을 확인. MINOR 3건 (handoff 파일카운트 trivia / mock signature 불일치 / 코드 주석 §4.5 ref → shared broadcaster 로 정정 — 본 cycle 내 정정 완료)
- **검증**: 691 frontend tests PASS / 108 files (baseline 유지) · typecheck PASS · production CSS lint grep clean (hex 0 outside DynamicAnalysisPage console / oklch 0 outside handoff·index.css / drift token 0 / Pretendard 직접 0 / severity ramp leak now §2.2 갱신 화이트리스트 안에)

### 2026-04-27 cycle (drift 점검 + review-tone 정합 + lane-local 결정 채택)
- **점검 결과 식별**:
  - tokens.css / auth-console.css / dashboard.css 가 §5 표 "바이트 동일" 기재와 실제 drift 불일치 → 사실로 갱신
  - severity ramp leak 7곳 (AdminReg KPI count + row tint + reject reason / Textarea+Radio+Input+Checkbox aria-invalid / two-stage-error / failed runs count / OverallStatusTab is-warn / kpi.css is-warn / ProjectSettings danger zone + sdk-stepper-failed + sdk-status-badge-failed + sdk-upload-zone-error + sdk-expanded-failed-rail) — 모두 review-tone palette (`--danger` / `--warning` / `--primary`) 로 마이그레이션
  - hex 잔재 11곳 (OverviewPage trend-summary / AdapterSelector / Analysis(Async)ProgressView / DynamicTestPage / ConnectionStatusBanner / FilesPage build-target-row+section-summary+target-library + ftree+build-tree folder-icon / FileDetailHeader inline) — 모두 canonical 토큰 (`--success` / `--severity-medium` / `--warning` / `--cds-text-placeholder`) 로 정합
  - ReportFindingsSection inline `style={{color}}` mdash → `.report-table-empty-mark` page CSS class 추출
- **handoff §5 sync table 갱신** (이 문서) — tokens.css / auth-console.css / dashboard.css 의 실제 drift와 사유 명시 (이전 "바이트 동일" 기재 부정확)
- **handoff/s1/readme.md §2.1 6번째 slot 화이트리스트 확장** — `.admin-reg-kpi .status-chip--pending .status-chip__count` + `.admin-reg-row--pending` 2 selector 추가 (workflow-active-pending tone — Admin 대기열 active queue state)
- **lane-local 결정 채택 (디자이너 WR 발행 보류 — 사용자 지시)**:
  - **Paperlogy-unified mono 정식 채택** — DESIGN.md §1·§4 권위와 충돌하지만 lane-local 정식 정책으로 운영. tokens.css drift 사유와 함께 §5 sync table 에 명시 추적
  - **DynamicAnalysisPage 콘솔 terminal aesthetic page-scoped 정식 인정** — `--console-fg/-bg/-bg-hi/-green/-amber/-red/-red-soft` 등 page-local CSS custom property 형태 유지. canonical 토큰 흡수 보류 (다른 surface 재사용 0, terminal aesthetic surface 한정 시각 어휘로 제한)
- **deferred (이 cycle 안)**: m3 ApprovalsPage `gap: 4px/6px` micro-rhythm — icon+text 미세 rhythm pattern으로 raw 유지. m4 hero-verdict__bar `width: 4px` — hairline rail raw 유지 OK
- **검증**: 691 frontend tests PASS / 108 files (baseline 유지) · typecheck PASS · production CSS lint grep clean (hex 0 outside DynamicAnalysisPage console / severity ramp leak 0 outside §2.2 whitelist) · code-reviewer fresh context APPROVE (대기)

### 2026-04-26 cycle (mock 흡수 — QualityGate / Approvals)
- **6 mock 흡수**: QG (01 + 02) + Approvals (03 + 04 + 05 + 06)
- **handoff §2.1 review-tone palette 6번째 slot 신설**: `workflow-active-pending` (axis = workflow-state, canonical `--primary` tint, 7 selector 화이트리스트). S1 self-publish.
- **handoff §2.2 severity exception narrow whitelist 확장**: `.modal-content__shoulder.is-fail` (gate context) + Approvals action-kind icon 6 selectors (k-override / k-risk × appr-icon / appr-li__icon / appr-detail-pane__head-icon) + 2 eyebrow labels (.appr-row.k-{override,risk} .appr-eyebrow .lab). S1 self-publish.
- **outcome-chip.css 6번째 tone 추가** (handoff-only 확장 영역)
- **WR1 (S1→S2) 계약 보강**: 발행 + 회신 도착 + 7 필드 (H1·H2·H3·H4·H5·H6·H7) backend 488 tests PASS + complete_wr 처리
- **검증**: 691 frontend tests PASS / 108 files (+9 신규) · typecheck PASS · build PASS · lint grep clean · code-reviewer APPROVE · ai-slop-cleaner net -135 lines

### 2026-04-25 cycle (sidebar / ProjectSettings / AnalysisHistory / Report / SDK 신규 / Deep outcome)
- 자세한 내용은 `wiki/canon/handoff/s1/readme.md` §8.1 참고

## 7. 참고 경로 빠른 링크

- Design system canonical: `wiki/canon/design-system/readme.md`
- Design system 원전: `wiki/canon/design-system/DESIGN.md`
- **Design doctrine (프로세스)**: `wiki/canon/design-system/design-doctrine.md`
- S1 인수인계: `wiki/canon/handoff/s1/readme.md`
- S1 working guide: `wiki/canon/feedback/s1_frontend_working_guide.md`
- QA guide: `wiki/canon/handoff/s1/qa-guide.md`
- Design mock review workflow: `wiki/canon/handoff/s1/design-mock-review-workflow.md`
- 가시성 매트릭스: `wiki/canon/handoff/s1/usecase-visibility-matrix.md`
- 구현 handoff CSS: `services/frontend/src/styles/handoff/**`
- Auth shared shell: `services/frontend/src/shared/auth/AuthConsoleShell.tsx`
