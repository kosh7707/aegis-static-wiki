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
last_verified: "2026-04-27"
service_tags: ["s1"]
decision_tags: ["external-ui-handoff", "design-system-source-of-truth", "handoff-css-system", "review-tone-palette", "workflow-state-axis"]
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

## 5. Mock ↔ Impl 동기화 현황 (2026-04-27)

| 파일 | 상태 |
|---|---|
| `tokens.css` | **drift (의도적, S1 lane-local 결정)** — `--font-mono` 매핑이 canonical 의 `'Geist Mono Variable'` ramp 대신 **Paperlogy-unified** (`'Paperlogy', 'Pretendard Variable', ..., sans-serif`). 추가 `--font-code` (실사용 0). `.mono { font-feature-settings: 'zero', 'ss01' }` 대신 `font-variant-numeric: tabular-nums`. 사유: `@fontsource-variable/geist-mono` 미설치 + 한국어 ↔ 데이터 시각 톤 통일. lane-local 정식 채택 — DESIGN.md §1·§4 권위와 본 sync table 사이 충돌은 본 row 기재로 명시 추적, 추후 디자이너 측 갱신 동기화 시 정합 |
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

신규 drift 발견 시 이 표를 갱신하고 원본 자산과의 관계를 명시한다.

## 6. Cycle 별 산출물 요약

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
