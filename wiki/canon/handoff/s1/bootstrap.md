---
title: "S1 · S1-QA Bootstrap Protocol"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/AEGIS.md"
  - "docs/mcp.md"
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/design-doctrine.md"
  - "wiki/canon/design-system/mocks/Login.html"
  - "wiki/canon/design-system/mocks/Signup.html"
  - "wiki/canon/design-system/mocks/Dashboard.html"
  - "wiki/canon/design-system/assets/tokens.css"
  - "wiki/canon/design-system/assets/base.css"
  - "wiki/canon/design-system/assets/fonts.css"
  - "wiki/canon/design-system/assets/auth-console.css"
  - "wiki/canon/design-system/assets/components/"
  - "wiki/canon/design-system/assets/pages/"
  - "wiki/canon/design-system/assets/shield.svg.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/handoff/s1/qa-guide.md"
  - "services/frontend/src/styles/handoff/"
last_verified: "2026-04-24"
service_tags: ["s1", "s1-qa"]
decision_tags: ["bootstrap-protocol", "design-authority-routing", "anti-regression", "read-method-registry"]
related_pages: ["wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/design-system/design-doctrine.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# S1 · S1-QA Bootstrap Protocol

> 새 세션 / 새 에이전트의 **첫 동작 전용 단일 스크립트**.
> 이 페이지의 체크리스트를 전부 ✅ 하기 전에는 redesign · 변형 제안 · 자가 판단 착수 **금지**.
> 근거: `wiki/canon/handoff/s1/readme.md` §9, `wiki/canon/design-system/design-doctrine.md` §1·§7.1.
> 마지막 검증/갱신: **2026-04-24**

---

## 0. 이 페이지가 존재하는 이유

`handoff/s1/readme.md` 상단에 "진입 순서" 인용블록이 있어도 에이전트가 **계약 요약만 읽고 원전 본문까지 도달하지 못하는** 회귀가 반복된다.

**실증 (2026-04-24 S1 세션):** 에이전트가 `handoff/s1/readme.md` 본문만 읽고 "파악 완료" 보고. 사용자가 "제대로 이해했니?"를 재차 물었을 때에야 `DESIGN.md` · `design-doctrine.md` 본문과 `mocks/*.html` · `assets/**` 를 하나도 열지 않았음이 드러남. "싹 다 읽어와"라는 명시 지시가 있어야 원전에 도달.

진단: 진입 순서가 선언형 인용블록 한 줄로만 있고 **강제성 · 체크포인트 · 읽기 수단**이 분리·누락되어 있었다. 에이전트는 우회 가능한 문맥을 만나면 요약 경로를 택한다.

본 페이지는 그 회귀를 구조적으로 차단한다:

1. **linear script** — 선언형 목록이 아닌 phase-단위 체크리스트. 순서 고정.
2. **읽기 수단 명시** — 각 자산마다 wiki MCP / 로컬 Read / chunked Read 중 어느 것을 써야 하는지 명시.
3. **실무 제약 레지스트리** — wiki MCP 응답 크기 제한, `.md` 접미사 규약, handoff-only 확장 목록 등 부팅 중 실제로 부딪히는 제약을 한 표에 모음.
4. **착수 전 게이트** — Phase 4의 6개 조건이 전부 ✅ 아니면 redesign에 진입하지 않는다.

AEGIS 다른 lane은 이런 구조를 쓰지 않는다. S1·S1-QA에서 먼저 시도하는 패턴이며, 회귀가 실제로 줄어드는지 관찰 후 다른 lane으로 확산 여부 판단한다.

---

## 1. Phase 0 — 라우터 정착

목표: AEGIS repo 전체 라우팅과 MCP 가용성을 먼저 박아두고 시작.

- [ ] `docs/AEGIS.md` — 로컬 Read. lane 라우팅 · 코드 소유권 · lane bootstrap map.
- [ ] `docs/mcp.md` — 로컬 Read. `aegis-static-wiki` / `log-analyzer` 사용 규칙.
- [ ] lane 선언 확정: **S1** (프론트 개발) 또는 **S1-QA** (코드 미열람 · 브라우저 검증). 이번 세션의 lane을 명시적으로 고정한다.

---

## 2. Phase 1 — 디자인 권위

순서 고정: **프로세스 → 시스템 → 참조 구현 → Canonical CSS → lane 계약.**
이 순서를 바꾸면 "시스템부터 이해하려다 프로세스를 건너뜀"이 반복된다.

### 2.1 프로세스 원전 — `design-doctrine.md`

- [ ] `wiki/canon/design-system/design-doctrine.md` — `mcp__aegis-static-wiki__read_page`
  - **왜:** §1 컨텍스트 체크리스트 (5축) / §2 anti-slop (signal vs decoration 판별) / §3 Content / §4 3+축 변형 전략 / §5 writer-reviewer 분리 / §6 CRITICAL/MAJOR/MINOR triage / §7.1 착수 전 행동 수칙.
  - **착수 전 필수 — 이 문서를 건너뛰고 redesign에 들어가면 handoff §9에 명시된 회귀 시나리오에 바로 진입한다.**

### 2.2 시스템 원전 — `DESIGN.md`

- [ ] `wiki/canon/design-system/DESIGN.md` — **74KB, chunked read 필요**
  - **주의:** `read_page` 단일 호출은 token limit으로 실패한다. 두 가지 경로:
    1. `mcp__aegis-static-wiki__read_page` 호출 → 실패 응답의 **저장 경로**(`tool-results/…` 파일)를 `Read` 도구로 offset/limit 분할 read
    2. 로컬 경로 `/home/kosh/aegis-static-wiki/wiki/canon/design-system/DESIGN.md` 를 `Read` offset/limit 으로 직접 chunked read
  - **읽을 절:** §1 Philosophy / §3 Color (severity ramp + `.proj` 예외 + severity-bound numerals 예외) / §4 Typography (이분) / §5 Spacing (5/9 리듬) / §6 Radius·Shadow·Motion / §7 Components (quick reference) / §8 Patterns (live 3종 · severity rail · timeline rail · caps-mono · 반응형 hard rule · density modes · choreography) / §9 Accessibility / §10 Extending / §11 Known gaps.

### 2.3 참조 구현 — Mock HTML

**wiki MCP는 `.md` 접미사 규약이라 HTML 미지원.** `read_page` 호출 시 `wiki/canon/design-system/mocks/Login.html.md` 를 찾아 ENOENT로 실패한다. **로컬 Read 전용.**

- [ ] `/home/kosh/aegis-static-wiki/wiki/canon/design-system/mocks/Login.html` — Auth 2-column shell 참조
- [ ] `/home/kosh/aegis-static-wiki/wiki/canon/design-system/mocks/Signup.html` — 4-step onboarding + org-verify 참조
- [ ] `/home/kosh/aegis-static-wiki/wiki/canon/design-system/mocks/Dashboard.html` — Needs Attention / Projects / Activity / Tweaks 참조

### 2.4 Canonical CSS 자산

원본이 권위. `services/frontend/src/styles/handoff/**` 는 1:1 복사본이며 drift 시 원본을 재복제한다.

- [ ] `wiki/canon/design-system/assets/tokens.css` — 모든 `--*` 토큰 실제 값 (oklch 계산 포함)
- [ ] `wiki/canon/design-system/assets/base.css` — reset · `:focus-visible` · `.mono` · `@media (prefers-reduced-motion)`
- [ ] `wiki/canon/design-system/assets/fonts.css` — Paperlogy 300-700 · Geist Mono
- [ ] `wiki/canon/design-system/assets/auth-console.css` — `.shell / .brand-panel / .form-panel / .form-wrap(.wide)` 58/42 split
- [ ] `wiki/canon/design-system/assets/shield.svg.md` — Shield paths FROZEN (navbar compact / auth detailed 두 변종)
- [ ] `wiki/canon/design-system/assets/components/` — **11개**:
  `button · input · panel · pill · seg · toggle · severity · lang-tag · divider · choreography · nav`
- [ ] `wiki/canon/design-system/assets/pages/` — **3개**: `login · signup · dashboard`

> **읽기 수단**: `.css`는 wiki MCP `read_page`가 되지만 본문 응답이 거대한 파일은 chunked read 전환이 필요. 로컬 경로 `/home/kosh/aegis-static-wiki/wiki/canon/design-system/assets/**` 직접 Read도 가능하며 실무 편의상 자주 쓰인다.

### 2.5 S1 lane-local 계약

- [ ] **`wiki/canon/handoff/s1/DESIGN.md` — `read_page`** (2026-05-08 단일화)
  - 권위 체인 (§1) / 구현 계약 (§2) / Review-tone palette (§3) / Severity narrow whitelist (§4) / 금지 사항 (§5) / QA 연결 (§6) / Lint grep 자동 검증 (§7) / Lane-local 결정 (§8) / 빠른 링크 (§9).
- [ ] `wiki/canon/handoff/s1/design-system.md` — `read_page` (operational tracking 전용)
  - Mock ↔ Impl 동기화 현황 (§1) + Cycle 별 산출물 요약 (§2). doctrine 본문은 위 `DESIGN.md` 로 이전됨.

---

## 3. Phase 2 — AEGIS 구현 전용 확장 (S1 lane만)

> **S1-QA는 Phase 2를 건너뛴다.** S1-QA는 프론트 코드를 열람하지 않는다 (`docs/AEGIS.md` §3). QA는 Phase 4 완료 후 `handoff/s1/qa-guide.md` 로 바로 이동.

`assets/` 원본에 **없는** AEGIS 전용 레이어. canonical 어휘로 부족한 실제 페이지들이 이 레이어에서 vocab을 빌려 쓴다. redesign 시 새로 만들지 말고 여기 있는지 먼저 확인한다.

### 3.1 Shell 확장 (3)

- [ ] `services/frontend/src/styles/handoff/compat.css` — Carbon `--cds-*` / `--aegis-*` 토큰 프록시 (legacy shadcn 계층 호환)
- [ ] `services/frontend/src/styles/handoff/app-shell.css` — `.app-shell / .page-region / .page-shell / .page-head / .section-head`, `.app-sidebar*` (프로젝트 identity block · back chip · group-label · badge · foot), `.page-breadcrumbs*`, `.nav-dropdown*` · `.nav-user*` · `.nav-menu-item*`, `.surface-grid-{2,3}`, `.btn-link / .btn-icon(-sm)`, `.target-status-badge`, `modal-overlay-in / modal-content-in` keyframes, `back-link / panel-empty / filter-sort-wrap / filter-select`, `.kpi__{value,unit,hint}`, 기타 다수 lane vocab
- [ ] `services/frontend/src/styles/handoff/page-surfaces.css` — `.page-dual-grid / .page-triple-grid / .page-kpi-row / .page-toolbar / .page-meta-inline / .page-block-list / .page-list-item / .placeholder-table / .page-section-stack / .page-panel-soft / .dashboard-grid / .chip-sev.{critical,high,medium,low} / .att-chips / .dashboard-empty-inline`

### 3.2 Component 확장 (9)

- [ ] `services/frontend/src/styles/handoff/components/form-field.css` — `.form-field / .form-label(.--required) / .form-hint / .form-error` + `[data-invalid] / [data-disabled]`
- [ ] `services/frontend/src/styles/handoff/components/status.css` — `.status-chips / .status-chip__{label,count}`, `.rank-list / .rank-list__item / .rank-row(.--clickable) + __{index,primary,primary--path,primary--rule,count,bar,bar-fill,chev}`, `.run-row + __{primary,time,chev}`, `.run-status + __dot`, `.run-status--{completed,running(pulse),failed,pending}`, `.run-detail-view*` (run 상세 레이아웃 vocab)
- [ ] `services/frontend/src/styles/handoff/components/list.css` — `.list-item(.--clickable / .--divider) + __{content,trailing,chevron}`
- [ ] `services/frontend/src/styles/handoff/components/dialog.css` — `.confirm-dialog + __{header,icon(.is-danger / .is-default),copy,title,description,footer}`, `.modal-overlay / .modal-content` (animation 포함)
- [ ] `services/frontend/src/styles/handoff/components/toast.css` — `.toast-stack / .toast + __{icon,message,action,close}`, `.toast--{warning,error,success}`
- [ ] `services/frontend/src/styles/handoff/components/kpi.css` — `.kpi dt / .kpi dd / .kpi dd.is-warn`
- [ ] `services/frontend/src/styles/handoff/components/distribution.css` — `.distribution-{list,row,meta,label,count,bar,fill} / .distribution-fill--{rule,ai,hybrid,sev-critical,sev-high,sev-medium,sev-low}`
- [ ] `services/frontend/src/styles/handoff/components/markdown.css` — `.markdown-{content,heading(.--h1..--h6),paragraph,list(.--unordered,.--ordered),quote,rule,table,image,link,inline-code,code-block(__lang,__code)}`
- [ ] `services/frontend/src/styles/handoff/components/inline-stack.css` — `.inline-stack / .scroll-area`

### 3.3 App 엔트리 (선택)

구현 시 처음 페이지 셸을 붙일 때만:

- [ ] `services/frontend/src/App.tsx` — 라우팅 (AuthEntryRoute / RequireAuth / RequireAdmin / ProjectLayoutShell)
- [ ] `services/frontend/src/index.css` — legacy Carbon/shadcn 호환 레이어 (신규 스타일 추가 금지)
- [ ] `services/frontend/src/shared/auth/AuthConsoleShell.tsx` — Auth 공유 shell React 래퍼

---

## 4. Phase 3 — 열린 WR 점검

- [ ] `mcp__aegis-static-wiki__list_my_open_wrs lane=s1` (또는 `s1-qa`) — 본인 lane 큐
- [ ] `to-all` notice 별도 판정 — 다른 lane에서 온 공지가 내 lane에 영향을 주는지 즉시 판단. 영향 없으면 `complete_wr` 로 본인 lane 완료 기록. `to-all` 삭제는 발신자 책임.
- [ ] 착수할 WR의 acceptance criteria · constraints · design rules 절 번호 전부 읽음

---

## 5. Phase 4 — 착수 전 게이트

아래 6개 조건이 **전부 ✅** 되기 전에는 redesign / 변형 제안 / 구현에 진입하지 않는다. 하나라도 비면 돌아가서 마저 채운다.

- [ ] Phase 0 ~ (S1이면 0-3, S1-QA면 0-2 + Phase 3) 체크리스트 100% 완료
- [ ] 착수할 WR body의 acceptance criteria 전부 읽고 내면화
- [ ] `design-doctrine.md` §1 컨텍스트 체크리스트 5축 (색 / 밀도 / 타이포 이분 / caps-mono / live signal 재사용) 실행
- [ ] `design-doctrine.md` §2 anti-slop 목록 훑고 해당 redesign이 §2.1 금지 목록에 저촉되지 않는지 확인
- [ ] 변형 제안이 필요한 요청이면 §4에 따라 **서로 다른 축**의 3+개 옵션 초안 준비 (같은 축 세 번 금지)
- [ ] Writer 패스 종료 후 **자가 approve 하지 않을** 것 확인 (§5). Reviewer는 S1-QA 또는 `code-reviewer` agent 에게 fresh context 로 핸드오프

---

## 6. 실무 제약 레지스트리

부팅 중 실제로 부딪히는 도구/경로 제약을 한 표에 모았다. 모르면 우회 경로 없이 포기하게 되므로 경험을 여기에 축적한다.

| 자산 | 읽기 수단 | 주의 |
|---|---|---|
| wiki 일반 `.md` 페이지 | `mcp__aegis-static-wiki__read_page` | 가장 먼저 시도 |
| `wiki/canon/design-system/DESIGN.md` (74KB) | ① `read_page` → 실패 응답의 저장 경로를 `Read` chunked ② 로컬 `/home/kosh/aegis-static-wiki/wiki/canon/design-system/DESIGN.md` 를 `Read` offset/limit | 단일 `read_page` 호출로 끝내려 하면 token limit 실패. chunked 대체 경로가 없다고 판단하고 포기하면 회귀 |
| `mocks/*.html` | 로컬 Read (`/home/kosh/aegis-static-wiki/wiki/canon/design-system/mocks/*.html`) | wiki MCP는 `.md` 접미사 규약이라 ENOENT. **MCP로 시도하지 말 것.** |
| `assets/*.css` | wiki MCP 또는 로컬 Read 모두 가능 | 일괄 병렬 read일 때는 로컬 경로 Read가 편함 |
| `services/frontend/src/styles/handoff/**` | 로컬 Read | ship 복사본. drift 발견 시 원본 우선, handoff를 재복제. 수정 방향은 원본 → handoff, 역방향 아님 |
| 열린 WR 목록 | `mcp__aegis-static-wiki__list_my_open_wrs` | `list_pages scope=all` 은 응답 폭발(114KB+)로 거의 실패. WR 조회는 전용 도구 사용 |
| `to-all` notice 완료 기록 | `mcp__aegis-static-wiki__complete_wr lane=<self>` | 본인 lane에만 완료 스탬프. notice 삭제는 발신자 몫 |

---

## 7. 금지 사항 (부팅 단계 한정)

`design-doctrine.md` §7 은 작업 단계 전반을 다룬다. 아래는 **부팅 단계에 한정된** 반복 회귀 목록이다:

- 체크리스트를 **스킵**하고 "계약 요약만으로 충분"이라 판단하는 것 — §0 실증 사례의 직접 원인
- `read_page` 1회 실패 시 chunked / 로컬 Read 대안 없이 포기하는 것
- `mocks/*.html` 을 wiki MCP로 반복 시도하며 시간 낭비 — 경로 규약을 문서화된 대로 따를 것
- Phase 4 게이트 없이 redesign / 변형 제안에 바로 착수하는 것
- 본 페이지 자체를 수정해 체크리스트를 약화시키는 것 — 변경이 필요하면 별도 WR 발행
- 본 페이지에 **디자인 규칙 자체**(토큰 값·컴포넌트 스펙)를 중복 기술하는 것 — 여기는 **라우팅/프로토콜** 전용. 규칙 본문은 DESIGN.md/doctrine/readme가 canonical

---

## 8. 갱신 정책

- 새 실증 사례(회귀 발생)가 나오면 §0 의 예시를 갱신하고 §7 의 금지 목록에 반영. 근거 없는 "느낌상 추가"는 하지 않음 (doctrine §8 정책 차용)
- 새 handoff-only 확장 파일이 `services/frontend/src/styles/handoff/` 에 생기면 §3 목록 갱신
- 실무 제약 레지스트리 (§6) 는 부팅 중 **처음 마주쳤을 때마다** 추가
- `last_verified` 는 본 protocol 이 실제 신규 세션에서 성공적으로 돌아간 날짜로 bump
- 본 페이지가 다른 lane(S2~S7)으로 확산될 가치가 확인되면 공통 패턴을 `wiki/system/` 아래로 추출 고려. 현재는 **S1·S1-QA 실험**에 한정
