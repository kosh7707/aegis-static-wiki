---
title: "AEGIS Design System — External Handoff Canonical"
page_type: "canonical-design-system"
canonical: true
source_refs:
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/design-system/mocks/"
  - "wiki/canon/design-system/assets/"
  - "services/frontend/src/styles/handoff/"
  - "designer-handoff:external-channel"
last_verified: "2026-04-20"
service_tags: ["s1", "s1-qa", "platform"]
decision_tags: ["external-ui-handoff", "analysts-console", "handoff-css-system", "design-system-source-of-truth"]
related_pages:
  - "wiki/canon/design-system/DESIGN.md"
  - "wiki/canon/handoff/s1/design-system.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/canon/handoff/s1/qa-guide.md"
  - "wiki/canon/feedback/s1_frontend_working_guide.md"
  - "wiki/canon/specs/frontend.md"
---

# AEGIS Design System — External Handoff Canonical

> 외부 디자이너가 인수한 AEGIS 디자인 시스템의 canonical source-of-truth.
> S1 구현과 S1-QA 검증 모두 **이 문서와 그 아래 자산**을 권위로 따른다.
> 마지막 검증/갱신: **2026-04-20**

## 1. 이 페이지의 역할

- AEGIS 프런트엔드의 **시각 방향은 외부 디자이너 handoff가 결정**한다는 S1 정책(`wiki/canon/handoff/s1/readme.md` §2, `wiki/canon/feedback/s1_frontend_working_guide.md` §4)의 **권위 자료 위치를 확정**한다.
- DESIGN.md + HTML mock 3종 + CSS 토큰·컴포넌트·페이지 규칙 전체를 **단일 canonical 디렉토리**(`wiki/canon/design-system/`)에 귀속시켜, Claude Code / Codex-CLI 등 에이전트가 S1 레인을 부팅할 때 참조 경로를 헤매지 않도록 한다.
- repo 내부(`services/frontend/docs/**`)에는 활성 디자인 지침 문서를 두지 **않는다**. 시각 규칙이 필요하면 반드시 이 canonical 페이지로 리다이렉트한다.

## 2. 소유 경로 (디렉토리 지도)

```text
wiki/canon/design-system/
├── readme.md                        ← 이 문서 (canonical pointer + 라우팅)
├── DESIGN.md                         ← 디자인 시스템 전체 지침서 (source of truth)
├── mocks/
│   ├── Login.html                    ← Auth 2-column shell 참조
│   ├── Signup.html                   ← Onboarding 4-step flow 참조
│   └── Dashboard.html                ← Projects/Activity/Tweaks 전체 참조
└── assets/
    ├── tokens.css                    ← oklch 기반 color/space/type/motion 토큰
    ├── base.css                      ← reset / html-body defaults / .sr-only / focus-visible
    ├── fonts.css                     ← Paperlogy @font-face (Korean sans)
    ├── auth-console.css              ← Login/Signup 58/42 split shell
    ├── shield.svg.md                 ← shield icon canonical (compact + detailed variants)
    ├── components/                   ← 11 개 컴포넌트 규칙
    │   ├── button.css, choreography.css, divider.css, input.css,
    │   ├── lang-tag.css, nav.css, panel.css, pill.css, seg.css,
    │   └── severity.css, toggle.css
    └── pages/                        ← 3 개 페이지 규칙
        ├── dashboard.css
        ├── login.css
        └── signup.css
```

`scraps/` 폴더에 있던 초안/폐기물은 의도적으로 **제외**한다.

## 3. Source-of-truth 순서

구현·검증·문서 작성 어느 경우든 충돌 시 아래 순서가 우선한다.

1. `wiki/canon/design-system/DESIGN.md` — 정책·규칙·토큰 스펙의 문자적 권위
2. `wiki/canon/design-system/mocks/{Login,Signup,Dashboard}.html` — 페이지 구조·class 네이밍·copy·마이크로 인터랙션의 참조 구현
3. `wiki/canon/design-system/assets/**/*.css` + `shield.svg.md` — 토큰·컴포넌트·페이지 스타일의 구체화
4. `services/frontend/src/styles/handoff/**` — 위 자산을 **1:1 복제**한 ship 전용 복사본 (런타임 import 대상)
5. `services/frontend/src/**/*.{tsx,ts}` — React 구현

handoff/ CSS와 원본 assets/ CSS 간 drift가 발생하면 원본이 우선이다. S1은 drift 발견 시 handoff/ 를 원본에 맞춰 다시 복제한다.

## 4. 적용 대상과 경계

| 대상 | 따라야 하는 것 | 비고 |
|---|---|---|
| **S1** (`services/frontend/`) | 토큰·컴포넌트·패턴 전부 | 신규 페이지 추가 시 §5 Extending 절차 필수 |
| **S1-QA** (`s1-qa`) | DESIGN.md §1~§11 전부, mock HTML 1:1 비교 | QA 검증 시 증거 기준으로 인용 |
| **다른 lane (S2~S7)** | 참조 금지 의무는 없으나, S1이 노출하는 UI 계약을 이해하려면 읽어도 됨 | 수정 권한은 S1 전용 |
| **디자이너** | DESIGN.md / mocks / assets 본인 갱신 시 본 문서의 `last_verified` 함께 bump | 갱신 시 `handoff/` 포팅은 S1 책임 |

## 5. Extending 규칙 (신규 페이지/컴포넌트 추가 시)

DESIGN.md §10 요약 + AEGIS 구현 관점 보강:

1. 새 페이지는 `assets/pages/<page>.css` 를 원본에 먼저 추가한 뒤 `services/frontend/src/styles/handoff/pages/<page>.css` 로 복제한다.
2. authenticated route는 `assets/components/nav.css` 와 `<nav class="nav">` 마크업을 **재사용**하며, 페이지 파일에 nav 스타일을 중복 선언하지 않는다.
3. 새로운 색상이 필요하면 **기존 severity ramp에서 빌린다**. 색을 새로 만들지 않는다 (DESIGN.md §3 규칙 준수).
4. 새 컴포넌트 variant가 필요하면 `assets/components/*.css` 에서 **확장**한다. page CSS에 컴포넌트 스타일을 가두지 않는다.
5. 운영 신호 영역(Needs Attention, live indicator 3종, `.proj` link 등)은 좁은 뷰포트에서도 **숨기지 말고** 재배치한다 (DESIGN.md §8.5 hard rule).
6. 새 "view mode"(밀도/레이아웃/토글 계열)는 `body.<mode>` 클래스로 gate 하고 Tweaks 패널에서 전환 가능하게 만든다.
7. 추가된 자산은 `handoff/` 포팅과 함께 이 readme의 §2 지도에 **반영**한다.

## 6. Mock ↔ 구현 동기화 현황

- 2026-04-20 deep-audit 결과: `handoff/` 21 파일 중 18개가 원본 assets 와 **바이트 동일**. 2개만 의도적 adaptation:
  - `fonts.css`: CDN URL → 로컬 경로 (Vite 번들)
  - `dashboard.css`: S1이 추가한 3개 rule (activity icon spacing, load-more 패딩, table center-cell)
- `compat.css`, `app-shell.css`, `page-surfaces.css` 3개는 **handoff-only 확장**. 원본에 없으며 AEGIS 구현 전용 (Carbon `--cds-*` 토큰 프록시 / 페이지 쉘 / 페이지 표면 스타일).
- 상세 비교 기록: 이 날짜 세션 히스토리 `wiki/canon/handoff/s1-qa/session-2026-04-20-mock-adherence-qa-v2.md` 참조.

## 7. 라우팅 (Claude Code / Codex-CLI 부트스트랩)

에이전트가 S1 또는 S1-QA 레인으로 들어올 때 권장 진입 순서:

1. `docs/AEGIS.md` (AEGIS repo root) — lane router
2. `wiki/canon/handoff/s1/readme.md` 또는 `wiki/canon/handoff/s1/qa-guide.md`
3. **`wiki/canon/design-system/readme.md`** (이 문서) — 디자인 규칙을 다룰 땐 여기가 `DESIGN.md` 로 리다이렉트되는 중간 지점
4. 필요 시 `wiki/canon/design-system/DESIGN.md` 전문 참조
5. 페이지 구현 시 `wiki/canon/design-system/mocks/*.html` + `assets/**` 를 계약으로 읽음

## 8. 갱신 정책

- 디자이너 handoff가 갱신될 때마다 이 페이지의 `last_verified` 와 §6 "Mock ↔ 구현 동기화 현황"을 함께 bump 한다.
- 디자인 규칙이 바뀐 경우 `DESIGN.md` 를 덮어쓴 뒤 §2 지도 / §5 Extending 규칙 변동 여부를 점검한다.
- `handoff/` 포팅이 갱신되면 S1 세션 히스토리에 mock ↔ impl diff 요약을 기록한다.
