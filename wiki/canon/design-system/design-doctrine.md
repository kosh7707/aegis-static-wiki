---
title: "AEGIS Design Doctrine — Process Principles for S1 & S1-QA"
page_type: "canonical-design-system"
canonical: true
source_refs:
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/readme.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/feedback/s1_frontend_working_guide.md"
  - "services/frontend/src/styles/handoff/app-shell.css"
last_verified: "2026-04-21"
service_tags: ["s1", "s1-qa", "platform"]
decision_tags: ["design-process", "anti-slop", "variation-strategy", "writer-reviewer-separation"]
related_pages: ["wiki/canon/design-system/readme.md", "wiki/canon/design-system/DESIGN.md", "wiki/canon/handoff/s1/design-system.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/feedback/s1_frontend_working_guide.md"]
---

# AEGIS Design Doctrine — Process Principles

> DESIGN.md 가 "시스템이 무엇인지" 를 정의한다면, 이 문서는 **"그 시스템 안에서 어떻게 일하는지"** 를 정의한다.
> S1 구현·S1-QA 검증·에이전트 자동화 모두 동일한 프로세스 원칙을 따른다.
> 마지막 검증/갱신: **2026-04-21**

## 0. 이 문서의 역할

`wiki/canon/design-system/` 3부작의 마지막 조각:

| 문서 | 다루는 것 |
|---|---|
| `readme.md` | 라우팅 · 소유 경로 · source-of-truth 순서 |
| `DESIGN.md` | 시스템 그 자체 (토큰 · 컴포넌트 · 패턴) |
| **`design-doctrine.md`** (본 문서) | **프로세스** · anti-slop · 변형 전략 · 검증 분리 |

디자인 작업을 시작하기 전 이 문서와 DESIGN.md §1 Philosophy 두 절을 반드시 확인한다.

**스코프:** 이 doctrine은 `wiki/canon/design-system/` 의 canonical 3문서 (readme/DESIGN/doctrine), `assets/**`, `mocks/**` 에 정의된 규칙을 실천하는 방법을 담는다. `services/frontend/src/styles/handoff/app-shell.css` 같은 **handoff-only 확장 파일**(원본 assets에 없고 AEGIS 구현 전용으로 자라난 레이어)은 기존 결정을 회피하지 말고 그대로 따르되, 새로 추가하는 규칙은 반드시 이 doctrine과 DESIGN.md의 정책 범위 안에 있어야 한다.

---

## 1. 컨텍스트 우선 원칙

**맥락을 갖추기 전에 디자인하지 않는다.** 바닥에서 발명하는 디자인은 거의 항상 기존 시각 어휘에서 이탈하고 re-work를 낳는다.

새 페이지·컴포넌트·변형 요청을 받으면 이 순서로 먼저 **읽는다**:

1. `wiki/canon/design-system/DESIGN.md` — 관련 절 (Color §3 / Typography §4 / Patterns §8)
2. `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html` — 가장 가까운 레이아웃
3. `wiki/canon/design-system/assets/**/*.css` — canonical 권위. 규칙이 모호하면 여기가 정답.
4. `services/frontend/src/styles/handoff/` — 위의 ship 복제본. 기존 구현 어휘를 빠르게 scan 할 때는 여기가 편함.
5. `services/frontend/src/pages/<NearestPage>/` — 기존 구현의 class · copy · DOM 구조 · 상호작용
6. 필요하면 mock 원본 (`/home/kosh/temp/for-aegis-frontend/AEGIS/assets/**`)

**관찰 체크리스트** (구현 전 머릿속에서 한 바퀴 돌려본다):

- 색 사용 규칙 — severity ramp / `--primary` / `--foreground-muted` 중 어디에 해당?
- 밀도 — 같은 카드 내부는 `--space-5`, 섹션 간은 `--space-9` 리듬
- typography 이분 — 데이터/ID/타임스탬프는 mono, 산문은 Paperlogy
- caps-mono 라벨 여부 (metadata → uppercase + tracking-caps)
- 패딩 · 호버 상태 · 전환 속도 (`--duration-fast 140ms` / `--duration-base 200ms`)
- live 시그널 3종 (pulse dot / gate pulse / laser bar) 재사용 가능 여부

이 중 어느 하나라도 기존 패턴과 충돌 없이 재사용 가능하면 **반드시 재사용한다**. 새 variant가 필요하면 component CSS에서 **확장**하고, page CSS에 새 스타일을 가두지 않는다 (DESIGN.md §10).

---

## 2. Anti-slop 룰 (피해야 할 시각적 트로프)

아래는 일반 AI 생성 프론트엔드의 기본값이자 우리 디자인에서는 **금지**되는 패턴이다. 에이전트가 스스로 제안했을 때도 즉시 거부한다.

**원칙:** 모든 anti-slop 룰은 **장식(decoration)을 금지할 뿐 의미 전달(signal)은 금지하지 않는다.** 어떤 시각 요소가 상태·심각도·상호작용 신호를 **그 자체로 실어 나르면** 허용된다. 단순히 "멋져 보이게" 존재하면 금지.

### 2.1 금지 목록

| 트로프 | 이유 | 대안 / 예외 |
|---|---|---|
| **장식 목적**의 hue-shift 그라데이션 배경 (보라-핑크, 청-오렌지 등 채도 이동) | "Information over decoration" (§1) 위반 | flat surface + 1px border. **예외:** `--surface` ↔ `--surface-sunken` color-mix 서브틀 depth gradient, severity-tinted 6-10% 워시 (DESIGN.md §8.2 `.att-card::before`) 는 허용 — 이들은 계층을 표현하는 신호이지 장식이 아님 |
| **장식 목적**의 둥근 모서리 + 좌측 컬러 보더 카드 (블로그/마케팅 스타일) | 분석가 워크벤치에 어울리지 않음 | `.sev-chip` · `.gate` · severity rail (`::before`). **예외:** 상태/심각도 신호를 실어 나르는 semantic left-border (`.gate-result-card--pass/fail/warning`, `.quality-gate-status-banner--*`, `.dynamic-session-table-flagged`, `.monitoring-row-flagged`, `.active-analysis-banner`, `.file-detail-source-line--highlighted`, `.overview-security-posture__card--critical/high/medium/low`) 는 허용 — border의 색이 곧 meaning |
| 보라색 그라데이션 on 화이트 | 가장 흔한 AI slop | `--primary` flat electric blue |
| 의미 없는 장식 이모지 | 브랜드 요소가 아니면 소음 | placeholder 또는 lucide-react 아이콘 (16/14px) |
| SVG로 그린 가짜 일러스트 | 저품질 신호 | placeholder + 실제 자산 요청 |
| Inter · Roboto · Fraunces · Arial · 기본 system-ui | 정체성 없음 | **Paperlogy** (sans) + **Geist Mono** (data) 고정 |
| 아무 데나 박은 숫자/스탯/아이콘 ("data slop") | 정보 계층 흐림 | 숫자는 severity/count/size 의미를 가질 때만, 아이콘은 기능을 할 때만 |
| 툴팁 없는 rounded badge 쏟아내기 | 스캔 가능성 저하 | 필요한 곳에 `.lang-tag` / `.sev-chip` 하나만 |
| `--primary` 를 non-interactive 요소에 적용 | DESIGN.md §3.3 rule — primary = interactive only (+ `.proj` link 예외) | severity · foreground · surface 토큰 사용 |

### 2.2 Signal vs decoration 판별 (좌측 보더 / 그라데이션 결정 규칙)

새 패턴을 만들기 전 다음 3가지를 확인:

1. **이 요소의 색/형태가 바뀌면 사용자가 다른 행동을 해야 하는가?** → 신호. 허용.
2. **이 요소를 흑백으로 렌더하면 정보가 손실되는가?** → 신호. 단, 색만으로 상태를 표현하면 접근성 위반 — 반드시 icon/text 동반 (§6.4).
3. **이 요소가 단지 "섹션의 시작" 을 예쁘게 표시하는가?** → 장식. 금지.

예:
- `.gate-result-card--fail { border-left: 4px solid var(--aegis-severity-critical) }` → 색이 바로 "이 게이트가 fail 이다" 를 전달 → **신호, 허용**.
- `.marketing-card { border-left: 4px solid var(--primary) }` → 단지 강조 → **장식, 금지**.
- `.report-summary-card { background: linear-gradient(180deg, var(--surface), color-mix(in srgb, var(--surface-sunken) 30%, transparent)) }` → 카드 안쪽이 살짝 깊어 보이게 만드는 surface-depth cue → **허용 (2% rule)**.
- `.hero { background: linear-gradient(135deg, #9333ea, #ec4899) }` → hue-shift 장식 → **금지**.

### 2.3 Data slop 기준선

- 화면에 떠 있는 숫자는 **하나같이 의미가 있어야** 한다. "33 Files / 320.5 KB / 1 Targets / ready" 처럼 **상태 신호**가 명확하면 OK. 막연히 "14 곳 발견 · 7개 변화 · 2 항목" 같은 공란 채우기 카운터는 금지.
- 아이콘 역시 동일 — 클릭 가능하거나 심볼로써 고유 의미를 갖지 않는 아이콘은 제거한다.
- "1000 no's for every yes" — 요소 하나 넣기 전에 빼는 것부터 시도한다.

---

## 3. Content 규칙

### 3.1 filler 금지

**공간이 비어 보이는 것이 콘텐츠를 만들어 채울 이유가 되지는 않는다.** 공간이 비었다면 그건 레이아웃·구성으로 풀 문제이지, 플레이스홀더 텍스트나 더미 섹션을 심어 해결할 문제가 아니다.

### 3.2 섹션·카피·페이지 추가는 사용자 확인 후

에이전트가 "이런 섹션을 추가하면 더 좋을 것 같습니다" 라고 느끼면 **먼저 묻는다**. 단독 판단으로 섹션을 덧붙이지 않는다. 사용자가 대상·목표를 가장 잘 안다.

### 3.3 사이즈 하한

- 화면 데이터 라벨: `--text-xs (12px)` 이하는 쓰지 않는다 (caps-mono 10-10.5px는 예외).
- 실제 본문: `--text-sm (13px)` / `--text-base (14px)`.
- 모바일 탭 대상: 높이 최소 **44px** (DESIGN.md `.btn-lg`).
- 데스크톱 버튼 기본 38px, 작은 변형 28px.

### 3.4 카피 톤

- 분석가 전용 워크벤치 — **조용하고 사실적** 이다. 마케팅 말투 금지 (exciting, powerful, seamlessly, empower 등).
- Korean primary. 영어 기술 용어는 섞어 써도 되지만 UI 명령은 한국어 우선.
- caps-mono 라벨은 영문 대문자. (예: `FILES`, `SIZE`, `PREVIEW · SELECT TO INSPECT`)
- 빈 상태 / 오류 상태 카피는 **무엇을 할지** 알려야 한다. "데이터가 없습니다" 가 아닌 "소스 아카이브를 업로드하면 분석이 시작됩니다".

---

## 4. 변형(variation) 전략

S1·S1-QA가 디자인 옵션을 제안하거나 개선안을 낼 때의 규칙.

### 4.1 3+개, 보수 → 새로운 시도 순

한 가지 개선 요청이 들어오면 **3개 이상의 변형** 을 준비한다. 순서는:

1. **기존 패턴 그대로** — 현재 컴포넌트 · 토큰만 재조합한 가장 보수적인 안
2. **패턴 확장** — DESIGN.md §10 Extending 절차로 component CSS를 늘린 안
3. **novel** — 레이아웃 · 인터랙션 · 밀도 축 중 하나를 과감히 바꾼 안

**같은 축을 세 번 건드리는 얕은 변형은 금지.** 폰트 크기만 3단계로 제시하는 것은 변형이 아니라 옵션 열거. 각 변형은 **서로 다른 축** (레이아웃 · 색 · 타이포 · 인터랙션 · 밀도 · 정보 계층) 을 건드려야 한다.

### 4.2 플레이스홀더는 나쁜 실제 시도보다 낫다

요청된 아이콘/이미지/차트가 없으면 **placeholder로 표시**한다. SVG로 일러스트를 즉석에서 그리지 않는다. 코드 주석으로 `// TODO: real asset from designer` 를 남긴다.

### 4.3 "Yes, and" 보다 "No, not yet"

3+개 변형 중 전부를 채택할 필요는 없다. 변형의 목적은 사용자가 **축을 이해하고 선택** 하게 하는 것이지, 선택지를 늘려 머리를 아프게 하는 것이 아니다.

---

## 5. Writer / Reviewer 분리 (MEMORY 반영)

전역 `~/.claude/CLAUDE.md` 의 `<execution_protocols>` 룰 — "Keep authoring and review as separate passes: writer pass creates or revises content, reviewer/verifier pass evaluates it later in a separate lane. Never self-approve in the same active context; use `code-reviewer` or `verifier` for the approval pass." — 를 디자인 컨텍스트에 구체화한 것.

### 5.1 한 패스에서 자기 승인 금지

- **Writer 패스**: 디자인/구현을 작성하거나 개정한다. 끝나면 멈춘다.
- **Reviewer 패스**: 별개의 lane/세션에서 결과물을 평가한다. writer와 reviewer는 **같은 컨텍스트** 에서 겹치지 않는다.

### 5.2 S1 ↔ S1-QA 실무 매핑

- S1이 페이지를 만들거나 고친다 → writer
- S1-QA가 mock 대비 검수한다 → reviewer
- 한 세션에서 S1이 "내가 보기엔 잘 됨" 이라고 자가 approve 하지 않는다. 항상 WR을 발행하거나 다음 S1-QA 세션에 넘긴다.

### 5.3 에이전트 자동화

Claude Code autopilot / ralph / team 등이 디자인 작업을 수행할 때:

- 작성 agent (`executor`, `designer`) 는 완료 후 **자신의 결과물에 approve 도장을 찍지 않는다**.
- 검증은 `code-reviewer`, `verifier`, `critic`, 혹은 별도 스폰된 agent가 **fresh context** 에서 수행한다.
- `done` 전 Playwright 스크린샷은 **선택적 진단**이지 승인이 아니다.

---

## 6. 검증 체크리스트 (reviewer 패스용)

S1-QA 또는 verifier agent가 디자인 결과물을 심사할 때 훑는 항목. 각 항목의 severity 분류(**CRITICAL / MAJOR / MINOR**)는 S1-QA가 triage 할 때 우선순위 판단에 사용.

### 6.1 토큰 준수

- [ ] **CRITICAL** — 새로 만든 색 없음 (severity ramp / `--primary` / `--foreground-*` / `--surface-*` 만 사용)
- [ ] **MAJOR** — Paperlogy/Geist Mono 이분 지켜짐 (mono가 data/ID/timestamp에만, sans가 prose에)
- [ ] **MAJOR** — `--space-*` 스케일만 사용, 임의 px 없음
- [ ] **MINOR** — `--duration-fast/-base` + `--ease-out` 외 motion 토큰 없음

### 6.2 패턴 준수

- [ ] **MAJOR** — `.panel` / `.sev-chip` / `.gate` / `.filter-pills` / live indicator 3종 재사용
- [ ] **MAJOR** — caps-mono 라벨 규칙 (metadata = uppercase + tracking-caps + `--foreground-subtle` + mono)
- [ ] **CRITICAL** — severity 컬러가 non-severity UI에 쓰이지 않음 (DESIGN.md §3.4 규칙)
- [ ] **MAJOR** — live signal은 `body.no-live` + `prefers-reduced-motion` 동시 종료

### 6.3 Anti-slop 점검

- [ ] **MAJOR** — 장식 목적 그라데이션 / 장식 목적 rounded-with-left-border 카드 / SVG 일러스트 없음 (§2.2 판별 규칙으로 signal vs decoration 구분)
- [ ] **MAJOR** — data slop (의미 없는 카운터 · 아이콘) 없음
- [ ] **MAJOR** — filler 섹션 없음
- [ ] **CRITICAL** — Paperlogy/Geist Mono 외 폰트 박혀 있지 않음 (Inter/Roboto/Arial 금지)

### 6.4 반응형 · 접근성

- [ ] **CRITICAL** — Needs Attention · live indicator · critical counter 가 좁은 뷰포트에서도 숨겨지지 않음 (DESIGN.md §8.5 hard rule)
- [ ] **MAJOR** — `@media (prefers-reduced-motion: reduce)` 아래 motion 비활성
- [ ] **MAJOR** — 키보드 focus 링이 기본 스타일에서 살아 있음
- [ ] **CRITICAL** — 색만으로 상태를 표현하지 않음 (severity는 color + icon + text 조합)

Severity 가이드:
- **CRITICAL** 위반 = 머지 차단. 다음 S1 세션에서 선결과제로 처리.
- **MAJOR** 위반 = 같은 PR 안에서 고친다. 후속 WR로 분리해도 되지만 다음 QA round 전에는 해결.
- **MINOR** 위반 = backlog 에 기록, 시간 되면 정리.

---

## 7. 에이전트 행동 수칙

에이전트(Claude Code · Codex-CLI · sub-agent) 가 이 doctrine을 따를 때의 구체적 행동:

### 7.1 작업 착수 전

1. 이 문서 + DESIGN.md §1 Philosophy + 해당 페이지의 기존 `pages/<PageName>/` 디렉토리를 읽는다.
2. 사용자 요청이 모호하면 **구현 전에 질문** 한다. "요청이 명확해 보여서 바로 착수합니다" 라고 말하고 난 뒤 엉뚱한 것을 만들지 않는다.
3. 변형이 필요한 요청이면 §4 전략대로 3+개 축을 미리 명시한다.

### 7.2 작업 중

1. `wiki/canon/design-system/` 의 3개 문서 중 하나를 **수정하지 않는다** (디자이너 영역). 디자인 시스템을 확장해야 하면 WR로 요청한다.
2. React 구현이 DESIGN.md 규칙을 위반해야 할 것 같으면 **구현을 멈추고** 사용자에게 확인한다.
3. Playwright 스크린샷은 자기 검증이 아니라 diagnostics. 문제를 찾는 용도이지 승인하는 용도 아님.

### 7.3 작업 완료 후

1. writer 패스를 종료하고 멈춘다. 자가 approve 금지.
2. 결과물이 디자인 regression 가능성이 있으면 `s1-qa` lane 또는 `code-reviewer` agent 에게 핸드오프.
3. 변경이 mock ↔ impl drift를 만들면 `wiki/canon/handoff/s1/design-system.md` §5 동기화 현황을 갱신할 WR을 낸다.

---

## 8. 이 문서의 갱신 정책

- Anti-slop 목록 (§2) 에 새 항목 추가는 **실제 발생한 regression을 근거로** 제안한다. 근거는 S1-QA findings 문서(`wiki/canon/handoff/s1-qa/artifacts/<date>/findings*.md`) 또는 WR 형식으로 기록된 구체 사례여야 하며, "느낌상 보기 싫다" 같은 주관만으로 확장하지 않는다.
- §5 Writer/Reviewer 분리 규칙은 전역 CLAUDE.md `<execution_protocols>` 와 연동되어 있으므로 한 쪽을 바꿀 때 다른 쪽을 함께 확인한다.
- `last_verified` 는 이 doctrine의 의사결정이 실제 최신 세션에서 검증되었을 때 bump 한다.
- §2.1 예외 목록에 새 semantic left-border / surface-depth gradient 패턴이 생기면 함께 업데이트 — 목록이 오래되면 agent가 같은 판단 반복.
