---
title: "S1 Lane DESIGN — 디자인 지침 단일화"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/canon/feedback/s1_frontend_working_guide.md"
  - "services/frontend/src/common/styles/handoff/**"
last_verified: "2026-05-08"
service_tags: ["s1"]
decision_tags: ["design-system-source-of-truth", "review-tone-palette", "workflow-state-axis", "severity-narrow-whitelist", "lane-local-design-doctrine"]
related_pages: ["wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/bootstrap.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/specs/frontend.md"]
---

# S1 Lane DESIGN — 디자인 지침 단일화

> **이 문서는 S1 lane-local 디자인 doctrine 의 단일 진입점이다.** 이전에 `handoff/s1/design-system.md`, `handoff/s1/readme.md` §2/§2.1/§2.2/§3/§9 에 흩어져 있던 디자인 규칙을 본 페이지로 통합한다.
>
> **upstream `wiki/canon/design-system/DESIGN.md` (디자이너 권위) 와 다른 파일.** 본 페이지는 S1 lane-local 적용 규칙. upstream 은 시스템 정의 자체 (74KB, 디자이너 소유, S1 수정 금지). 둘은 path 로 구분: upstream = `design-system/DESIGN.md`, lane-local = `handoff/s1/DESIGN.md`.
>
> 마지막 검증/갱신: **2026-05-08**

---

## 1. 권위 체인

AEGIS 프론트엔드의 시각 규칙은 외부 디자이너 handoff 가 결정한다. **S1 은 그 규칙을 번역하지 않는다 — 그대로 집행한다.**

### 1.1 권위 우선순위 (절대)

1. `wiki/canon/design-system/DESIGN.md` — 시스템 자체 (토큰 · 컴포넌트 · 패턴 · §1 Philosophy / §3 Color / §4 Typography / §5 Spacing / §6 Radius·Shadow·Motion / §7 Components / §8 Patterns / §9 Accessibility / §10 Extending / §11 Known gaps)
2. `wiki/canon/design-system/design-doctrine.md` — 프로세스 (§1 컨텍스트 체크리스트 5축 / §2 anti-slop / §3 Content / §4 3+축 변형 전략 / §5 writer-reviewer 분리 / §6 CRITICAL/MAJOR/MINOR triage / §7.1 착수 전 행동 수칙)
3. `wiki/canon/design-system/readme.md` — canonical pointer + 소유 경로 지도
4. `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html` — 참조 구현 (layout 권위)
5. `wiki/canon/design-system/assets/**` — Canonical CSS 자산 (tokens / base / fonts / auth-console / components/* / pages/* / shield.svg.md)
6. **본 페이지 (`handoff/s1/DESIGN.md`)** — S1 lane-local 적용 규칙 + review-tone palette + severity narrow whitelist
7. `services/frontend/src/common/styles/handoff/**` — ship 복사본 (canonical 11 + handoff-only 확장)
8. React 구현

(시각 권위 = upstream DESIGN.md, 프로세스 권위 = design-doctrine.md, lane 적용 = 본 페이지. 충돌 시 상위 이김.)

### 1.2 mock 의 정확한 위상

- **mock 은 layout 참고용** — drift (Pretendard / `--sb-*` / 신규 토큰 등) 흡수 금지
- 그러나 **mock 의 layout 자체** 는 사용자 명시 위임 시 흡수 의무
- Reviewer 의 "drift, 유지" 자가 판단 함정 — mock layout 흡수 누락을 통과시키지 않는다

---

## 2. S1 구현 계약

### 2.1 Source-of-truth 순서 (충돌 시 상위 이김)

§1.1 의 1·4·5·7·8 순서가 그대로 styling source-of-truth.

### 2.2 Styling ownership

1. **Design system handoff (read-only 복사본)** — `src/common/styles/handoff/*` — upstream `assets/` 1:1 복제. 로컬 개정 금지, 원본을 먼저 수정 후 재복제. **Canonical 11 (button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav) 무수정.**
2. **handoff-only 확장 (S1 자체 신설 OK)** — `handoff/{compat,page-surfaces,app-shell}.css` + `handoff/components/{outcome-chip,form-field,status,list,dialog,toast,kpi,distribution,markdown,inline-stack}.css`. upstream 에 없는 AEGIS 전용 vocabulary. 새 파일 추가 시 `handoff/s1/design-system.md` §1 동기화 현황에 등록.
3. **Auth shared shell** — `src/common/ui/auth/*` — upstream `auth-console.css` 구조 유지한 채 React 래퍼만 추가.
4. **Legacy Carbon/shadcn 호환 레이어** — `src/common/styles/index.css` — 신규 스타일 추가 금지. 토큰 프록시는 `handoff/compat.css` 우선.
5. **Page/Layout TSX 로직** — 디자인 규칙 위반 없는 선에서만 수정.

### 2.3 신규 페이지/컴포넌트 추가 절차

1. `design-doctrine.md` §1 컨텍스트 체크리스트 5축 (색 / 밀도 / 타이포 이분 / caps-mono / live signal 재사용) 먼저 실행.
2. 디자이너 자산에 해당 페이지/컴포넌트가 있는지 확인.
   - 있음 → `wiki/canon/design-system/assets/` 에 새 파일이 이미 있다. `services/frontend/src/common/styles/handoff/` 로 복제.
   - 없음 → upstream DESIGN.md §10 "Extending" 절차로 기존 토큰·컴포넌트로 조합. **새 색·폰트·토큰 도입 금지.**
3. `pages/<Page>/<Page>.tsx` + `pages/<Page>/components/` 구조 유지 (`feedback/s1_frontend_working_guide.md` §5.3).
4. 페이지 HTML mock 있으면 class·copy·DOM 순서·data-* 속성을 React 구현에 1:1 반영.
5. `document.title = "AEGIS — {Page Name}"` 설정, `AuthEntryRoute`/`RequireAuth` 중 적절한 가드.
6. `src/common/styles/handoff/` 와 upstream 자산 간 diff 기록. 의도적 adaptation 이면 `handoff/s1/design-system.md` §1 동기화 현황에 사유 추가.
7. 변형 제안 요청이면 `design-doctrine.md` §4 전략대로 **3+개 축 옵션**을 미리 제시 (같은 축 세 번 금지).
8. **Backend 신규 계약 활용 시** — frontend 자가 매핑 금지. 미공급 필드는 dim "—" placeholder + cross-fetch entry point 박아두고 lane WR 협상.

---

## 3. Review-tone palette (severity color non-severity UI 분리)

`design-doctrine.md` §3.4 의 정공법 — non-severity status/outcome UI 는 severity ramp 사용 금지하고 별도 review-tone 어휘로 표현.

### 3.1 outcome-quality 축 (5 slot — 결과 품질 caveat 표현)

| slot | 의미 | 적용 surface | 토큰 |
|---|---|---|---|
| `positive` | clean / accepted / poc_accepted / approval-approved / sdk-ready / gate-pass | success surface | `--success` / `--success-surface` |
| `neutral-review` | no_accepted_claims / poc_not_requested | neutral surface | `--foreground-muted` / `--surface-sunken` |
| `caution-review` | accepted_with_caveats / inconclusive / SDK pending / sdk-progress / gate-warning / decision-impact-summary | warning surface | `--warning` / `--warning-surface` |
| `critical-review` | rejected / repair_exhausted / SDK install_failed / approval-rejected / sdk-failed / gate-fail | danger surface | `--danger` / `--danger-surface` |
| `fallback-review` | unknown enum / old result / approval-expired | neutral surface | `--foreground-subtle` / `--surface-sunken` |

### 3.2 workflow-state 축 (6번째 slot — 사람 결정 대기 active queue, 2026-04-26 신설)

upstream mock 의 `--pending oklch(0.58 0.16 250)` (hue 250 = blue) 사용처는 **outcome 축이 아니라 workflow 축**이다. 5 outcome-quality slot 과 다른 axis. `caution-review` (warning amber, hue 65) 와 의미 다르므로 분리.

| slot | 의미 | 토큰 |
|---|---|---|
| `workflow-active-pending` | approval-pending / 사람 결정을 기다리는 active queue state | `--primary` / `--primary-surface` |

**적용 selector 화이트리스트** (page CSS 안에서만 6번째 slot 사용):

- `.approval-status--pending`
- `.hero-verdict.v-pending`
- `.verdict-pending`
- `.appr-row.s-pending .appr-rail`
- `.appr-li.s-pending .appr-li__verdict`
- `.empty-state.is-pending`
- `.hero-stat.is-pending .val`
- `.admin-reg-kpi .status-chip--pending .status-chip__count` (Admin 대기열 카운트, 2026-04-27 추가)
- `.admin-reg-row--pending` (Admin 대기 row tint, 2026-04-27 추가)

화이트리스트 외 새 selector 도입 시 **본 §3.2 갱신 PR 동반 의무**. 다른 page 도입 시 별도 협상.

### 3.3 canonical 위치

- `services/frontend/src/common/styles/handoff/components/outcome-chip.css` (handoff-only 확장 — Deep outcome 전용 + workflow-active-pending 6번째 tone)
- React 어휘: `services/frontend/src/common/ui/primitives/OutcomeChip.tsx` + `services/frontend/src/common/ui/analysis/deepOutcome.ts`
- page-local 동일 어휘: `.approval-status--*`, `.report-status-tone--*`, `.report-module-status--*`, `.overview-{gate,sdk,target-summary}-badge--*`, `.quality-gate-{badge,status-banner}--*` 등

---

## 4. Severity signal 예외 — narrow whitelist

다음 selector 들은 severity ramp (`--severity-critical/-high/-medium/-low`) 직접 사용 OK (signal 자체 또는 narrow exception). **이 외는 모두 §3 review-tone palette 사용 의무.**

### 4.1 Canonical severity components (signal 자체)

- `.gate.{blocked,warn,pass,running}` / `.cell-gate.{...}` — gate 가 곧 severity signal
- `.sev-chip.{critical,high,medium,low}` — finding/vulnerability severity 표시
- severity-bound numerals (예: "3 critical findings" 의 `3`) — upstream DESIGN.md §3.4 narrow exception

### 4.2 Gate context override exception (2026-04-26 추가)

- `.modal-content__shoulder.is-fail` — QualityGate override modal shoulder (gate context P3)

### 4.3 Action-kind iconography (Approvals action 대표 아이콘 — gate.override / accepted_risk 의 severity-bound semantic, 2026-04-26 추가)

같은 action-kind size variant 3개 모두 narrow whitelist:

- `.appr-icon.k-override` / `.appr-icon.k-risk` — appr-row 큰 아이콘 (32px)
- `.appr-li.k-override .appr-li__icon` / `.appr-li.k-risk .appr-li__icon` — Panel 마스터 리스트 미니 아이콘 (24px)
- `.appr-detail-pane__head-icon.k-override` / `.appr-detail-pane__head-icon.k-risk` — Panel detail-pane 헤드 아이콘 (40px)

매핑:
- `.k-override` = gate.override action — `--severity-critical` (gate context)
- `.k-risk` = finding.accepted_risk action — `--severity-high` (severity-bound action)

### 4.4 Action-kind eyebrow label (severity-bound semantic label, 2026-04-26 추가)

action-icon 옆 텍스트 라벨 ("GATE OVERRIDE" / "ACCEPTED RISK") — severity-bound numerals 의 텍스트 analog:

- `.appr-row.k-override .appr-eyebrow .lab` / `.appr-row.k-risk .appr-eyebrow .lab`

### 4.5 Severity-bound finding tags (sev-chip family, 2026-04-27 정식 등록)

`.sev-chip.*` 의 page-local 동등 vocabulary — finding/vulnerability severity 직접 표시:

- `.report-sev-tag.{--critical,--high,--medium,--low}` (+ `::before` dot) — ReportPage findings table tag
- `.hist-sev-summary__val.{--critical,--high,--medium,--low}` — AnalysisHistoryPage severity 카운트 (severity-bound numerals chip 형태)

### 4.6 Gate verdict block (gate context family, 2026-04-27 정식 등록)

`.gate.{blocked,warn,...}` 의 page-local 동등 vocabulary — Gate 평가 verdict 의 severity-mapped 시각 신호:

- `.hero-verdict--blocked` 의 `__bar` / `__icon` / `__title` — `--severity-critical` (gate fail 신호)
- `.hero-verdict--caution` 의 `__bar` / `__icon` / `__title` — `--severity-high` (gate warning 신호)

(`.hero-verdict--ok` / `.hero-verdict--running` 은 review-tone canonical 토큰 사용 — `--success` / `--primary`.)

### 4.7 추가 시 의무

위 항목 외 모든 status/outcome/state UI 는 §3 review-tone palette 사용. 추가 예외 도입 시 **본 §4 갱신 PR 동반 의무** — broad permission 금지, narrow specific selector 만.

**중요**: decision-impact summary 패널 (`.appr-detail-pane__impact*` / `.approval-decision-dialog .appr-detail__impact*`) 은 severity ramp 사용 **금지**. caution-review tone (`--warning` / `--warning-surface`) 사용 — impactSummary 는 결정 리스크 review surface 이지 severity signal 자체가 아님.

---

## 5. 금지 사항 (단일 권위)

### 5.1 색·토큰

- upstream DESIGN.md §3 규칙 밖의 색을 컴포넌트/페이지 CSS 에 직접 박는 것
- **severity color 를 non-severity UI 에 사용** (upstream DESIGN.md §3.4) — 단 §4 narrow whitelist 만
- 새 토큰 / 새 색 도입 — review-tone 도 canonical 토큰 (`--success` / `--warning` / `--danger` / `--primary` / `--foreground-*` / `--surface-*`) 만 조합
- mock drift 토큰 흡수 (`--pass` / `--fail` / `--warn` / `--pending` / `--neutral` / `--sb-*` / `--source-*-surface/-border` 등) — 어휘 자체 무의식적 사용 금지
- workflow status (pending/approved/rejected/expired 등) 를 `.sev-chip` (severity component) 에 매핑 — review-tone page-local class 사용
- `--pending` slot 신설 (mock drift) — workflow-active-pending 어휘 + canonical `--primary` / `--primary-surface` 사용 (§3.2 6번째 slot)
- workflow-active-pending 화이트리스트 selector 외 다른 page 에 도입 — **본 §3.2 갱신 PR 동반 의무**
- decision-impact summary 패널 에 severity ramp 사용 — caution-review tone (warning surface) 만 (§4.7)
- raw hex / oklch direct (color-mix 안 제외) / Pretendard 직접 / Geist Mono 직접 / raw rgba — production CSS 0 건 의무 (§7 lint grep)

### 5.2 Typography·Layout

- Paperlogy/Geist Mono 이분 typography 를 page 단에서 덮어쓰는 것 (upstream DESIGN.md §4)
- 그라데이션 배경 / rounded-with-left-border 카드 / SVG 일러스트 / data slop — 자세한 목록은 `design-doctrine.md` §2
- 신규 "view mode" 를 `body.<mode>` 스위치 없이 하드코딩 (upstream DESIGN.md §8.5)
- 운영 신호 영역 (Needs Attention, live indicator, critical counter, hero-verdict, gate-card meta, sparkline 등) 을 좁은 뷰포트에서 숨기는 것 (upstream DESIGN.md §8.5 hard rule) — `display: none` 금지, stack 으로
- canonical handoff 11개 (button/input/panel/pill/seg/toggle/severity/lang-tag/divider/choreography/nav) 수정 — handoff-only 확장 (outcome-chip / form-field / status / list / dialog 등) 추가는 OK

### 5.3 프로세스

- 한 세션에서 writer/reviewer 겹치기 (`design-doctrine.md` §5) — Reviewer 는 fresh context (S1-QA / `code-reviewer` agent)
- Reviewer 의 "drift, 유지" 자가 판단으로 mock layout 흡수 누락 통과
- WR acceptance criteria 좁게 해석해 mock layout 전면 흡수 의도 누락
- Backend 신규 계약 데이터 정합성을 자가 판단 매핑 (예: hardcoded threshold map) 으로 채우는 것 — lane WR 협상 의무
- 과거 시각 지침을 활성 기준으로 되살리는 것
- `wiki/canon/design-system/` 자산 대신 repo 내부의 낡은 디자인 지침 참조
- repo 내부에 활성 디자인 지침 문서를 두는 것 (`specs/frontend.md` §9.2) — 유일한 활성 lane-local doctrine = 본 페이지
- 기존 테스트를 약화시켜 regression 을 숨기는 것
- `design-doctrine.md` §1 컨텍스트 체크리스트 건너뛰고 redesign 착수
- bootstrap.md 체크리스트 스킵 후 "계약 요약만으로 충분" 판단
- **Edit/Write 도구 호출 전 Read 선행 누락** — 도구가 회피 불가 hard rule (사용자 반복 지적: 2026-04-22 + 2026-04-26)

---

## 6. QA 연결

- S1-QA 는 본 doctrine 과 구현의 drift 를 단일 사이클 원칙으로 검증한다 (`handoff/s1/qa-guide.md` + `handoff/s1/design-mock-review-workflow.md`).
- QA 증거는 mock HTML 경로 (`wiki/canon/design-system/mocks/*.html` 또는 cycle-specific mock 경로) + upstream DESIGN.md 절 번호로 인용.
- QA 체크리스트 기준은 `design-doctrine.md` §6 (토큰 준수 / 패턴 준수 / anti-slop 점검 / 반응형·접근성) 참조.
- 유스케이스 가시성 매트릭스 (`handoff/s1/usecase-visibility-matrix.md`) 의 MUST 항목은 upstream DESIGN.md 규칙과 모순되지 않도록 유지.

---

## 7. Lint grep 자동 검증 (production CSS 0 건 의무)

다음 패턴은 production CSS (handoff layer + page CSS) 에서 모두 0 건이어야 한다:

| 패턴 | 정책 | 예외 |
|---|---|---|
| `oklch(...)` 직접 사용 | 금지 | `color-mix(in srgb, var(--token) X%, transparent)` 안의 oklch 토큰 참조는 OK |
| `#[0-9a-f]{3,8}` (hex 색) | 금지 | DynamicAnalysisPage console terminal aesthetic page-local 토큰 (lane-local 정식 채택) — 별도 WR |
| drift token 어휘 (`--pass` / `--fail` / `--warn` / `--pending` / `--neutral` / `--sb-*`) | 금지 | 없음 |
| `Pretendard` 직접 font-family 선언 | 금지 | upstream `tokens.css` 의 `--font-sans` ramp 안에 있는 fallback 으로만 |
| `Geist Mono` 직접 font-family 선언 | 금지 | upstream `tokens.css` 의 `--font-mono` ramp 안에 있는 fallback 으로만 |
| raw `rgba(...)` | 금지 | 없음 |
| `--severity-{critical,high,medium,low}` 직접 사용 | §4 narrow whitelist 안에서만 OK | §4.1~§4.6 모든 selector |
| `.sb-` / `.crumb-` mock drift 흡수 | 금지 | 없음 |

---

## 8. Lane-local 결정 (디자이너 WR 발행 보류)

본 lane 이 upstream 권위와 충돌하는 결정을 채택한 항목 — `handoff/s1/design-system.md` §1 sync table 에 명시 추적:

### 8.1 Paperlogy-unified mono 정식 채택 (2026-04-27)

- upstream DESIGN.md §1·§4 권위는 `'Geist Mono Variable'` ramp.
- S1 lane 은 `--font-mono` 매핑을 `'Paperlogy', 'Pretendard Variable', ..., sans-serif` 로 통일 + 추가 `--font-code` (ASCII monospace ramp — `ui-monospace, 'SF Mono', ..., monospace`) 도입.
- 사유: `@fontsource-variable/geist-mono` 미설치 + 한국어 ↔ 데이터 시각 톤 통일.
- 향후 디자이너 갱신 동기화 시 정합 검토.

### 8.2 DynamicAnalysisPage 콘솔 terminal aesthetic page-scoped 정식 인정 (2026-04-27)

- `--console-fg/-bg/-bg-hi/-green/-amber/-red/-red-soft` 등 page-local CSS custom property.
- canonical 토큰 흡수 보류, terminal aesthetic surface 한정 시각 어휘로 제한.
- **다른 surface 재사용 금지**.

---

## 9. 빠른 링크

### upstream (디자이너 권위, S1 수정 금지)

- Design system canonical: `wiki/canon/design-system/readme.md`
- Design system 원전: `wiki/canon/design-system/DESIGN.md`
- Design doctrine (프로세스): `wiki/canon/design-system/design-doctrine.md`
- Mocks: `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html`
- Canonical CSS 자산: `wiki/canon/design-system/assets/**`

### S1 lane-local

- **본 doctrine (단일 권위)**: `wiki/canon/handoff/s1/DESIGN.md` (이 문서)
- S1 인수인계 (역할/구조/검증/backlog): `wiki/canon/handoff/s1/readme.md`
- Mock ↔ Impl 동기화 / cycle log: `wiki/canon/handoff/s1/design-system.md` (operational tracking 만 유지)
- Bootstrap 프로토콜: `wiki/canon/handoff/s1/bootstrap.md`
- Architecture snapshot: `wiki/canon/handoff/s1/architecture.md`
- QA guide: `wiki/canon/handoff/s1/qa-guide.md`
- Design mock review workflow: `wiki/canon/handoff/s1/design-mock-review-workflow.md`
- 가시성 매트릭스: `wiki/canon/handoff/s1/usecase-visibility-matrix.md`
- Working guide: `wiki/canon/feedback/s1_frontend_working_guide.md`

### 코드

- 구현 handoff CSS: `services/frontend/src/common/styles/handoff/**`
- Auth shared shell: `services/frontend/src/common/ui/auth/AuthConsoleShell.tsx`
- UI primitives: `services/frontend/src/common/ui/primitives/**`
- OutcomeChip vocabulary: `services/frontend/src/common/ui/primitives/OutcomeChip.tsx`
- deepOutcome mapping: `services/frontend/src/common/ui/analysis/deepOutcome.ts`

---

## 10. 갱신 정책

- 본 페이지는 **doctrine 단일 권위**. 새 review-tone slot / 새 severity narrow whitelist selector / 새 금지 사항 등은 본 페이지에서만 갱신한다.
- `handoff/s1/design-system.md` 는 **operational tracking 전용** (§1 mock↔impl sync table + §2 cycle log) 으로 유지. 새 cycle entry 는 그쪽에 추가.
- `handoff/s1/readme.md` 는 **lane 일반 인수인계 전용** (역할/경계/구조/검증/backlog/금지사항-process). 디자인 규칙 본문은 본 페이지로 위임.
- 변경 사항이 upstream `design-system/DESIGN.md` 권위와 충돌하면 **즉시 사용자에게 확인** + WR 협상 의무. 자가 판단 lane-local 채택은 §8 에 명시 추적.
