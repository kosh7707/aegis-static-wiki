---
title: "S1-QA follow-up review of v5 design reference — strongest candidate so far, but not final"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-s1-qa-follow-up-review-of-v5-design-reference-strongest-candidate-so-far-but-not"
last_verified: "2026-04-09"
service_tags: ["frontend", "design", "qa"]
decision_tags: ["design-review", "implementation-readiness", "route-coverage", "brand-consistency"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/work-requests/s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a.md", "wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-s1-qa-follow-up-review-of-v5-design-reference-strongest-candidate-so-far-but-not"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-09T02:03:29.753Z","note":"Completed as redundant duplicate. Superseded by `wiki/canon/work-requests/s1-qa-to-s1-s1-qa-follow-up-design-review-of-v5-strongest-candidate-so-far-but-not-final.md`, which is the intended canonical v5 follow-up review for S1."}]
registered_at: "2026-04-09T02:02:12.437Z"
completed_at: "2026-04-09T02:03:29.753Z"
---

# S1-QA follow-up review of v5 design reference — strongest candidate so far, but not final

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1-QA follow-up design review — docs/design/reference/v5

- 날짜: 2026-04-09
- 범주: Design review / IA review / route coverage audit / implementation readiness review
- 검토 대상:
  - `docs/design/reference/v5/**`
- 비교 기준:
  - 이전 S1-QA deep design review WR (v3 reject / v4 provisional)
  - `wiki/canon/specs/frontend.md`
  - `wiki/canon/handoff/s1/qa-guide.md`
  - `wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md`
  - `wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md`
  - `wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md`
- 검증 방식:
  - Playwright MCP + local static server (`http://127.0.0.1:47891/`)
  - `v5/index.html` viewer 실동작 확인
  - 18개 non-index HTML 전부 렌더 확인
  - 대표 화면 직접 캡처 (`projects`, `overview`, `analysis`, `report`, `code-light`, `quality-gate-light`, `approvals-light`, `settings-light`)

## Executive verdict

### 결론 한 줄
- **v5는 v4보다 확실히 좋아졌고, 현재까지 나온 reference 중 가장 유망한 버전**이다.
- 다만 **아직 implementation-ready final은 아니다.**
- 현재 판정은 **"v5를 다음 기준본으로 검토 가능"**이지, **"즉시 구현 승인"**이 아니다.

### 최종 판정
- **v3**: reject as baseline (유지)
- **v4**: provisional base (유지)
- **v5**: **strong candidate baseline** — 단, title/copy normalization + shell cleanup + missing surface 보강이 선행되어야 함

## fresh verification evidence

### 구조/렌더 확인
- `docs/design/reference/v5` 존재
- `docs/design/reference/v5/index.html` 존재
- 로컬 서버 `http://127.0.0.1:47891/` 정상 응답
- **18/18 non-index 페이지 렌더 성공**
  - `SUMMARY total=18 ok=18 fail=0`

### viewer 실동작 확인
- `openViewer(...)` 정상 동작
- `d` → dark
- `ArrowRight` → next
- viewer title/src 변경 정상 반영

### 확보한 대표 스크린샷
- `playwright-mcp-v5-index-projects-light.png`
- `playwright-mcp-v5-index-overview-dark.png`
- `playwright-mcp-v5-index-analysis-dark.png`
- `playwright-mcp-v5-index-report-dark.png`
- `playwright-mcp-v5-code-light.png`
- `playwright-mcp-v5-quality-gate-light.png`
- `playwright-mcp-v5-approvals-light.png`
- `playwright-mcp-v5-settings-light.png`

### 추가 브라우저 확인
- `v5/light/code-light.html` → `document.title == ""`
- `v5/light/quality-gate-light.html` → `document.title == ""`
- `v5/light/approvals-light.html` → `AEGIS Approvals | Technical Precision Authority`
- `v5/light/settings-light.html` → `Settings | AEGIS ECU-PowerTrain-v2.1`

## v5가 좋아진 점 (v4 대비)

### 1. 브랜드 drift가 크게 줄었다
v3/v4에서 치명적이었던 다음 계열 문제가 많이 줄어들었다.
- `ARCHITECT`
- `Sovereign Sec`
- `Project Sentinel`
- `Platform Cloud-Core`
- `Lead Architect`
- `Security Clearance Level 4`

v5는 최소한 **화면을 보는 순간 다른 제품처럼 보이는 문제**가 크게 완화되었다.

### 2. IA vocabulary가 더 AEGIS 실제 표면에 가까워졌다
index 기준:
- Projects List
- Overview
- Static Analysis
- Vulnerabilities
- Files
- Approvals
- Report
- Quality Gate
- Settings

이는 v4보다 실제 current S1 route map과 더 정렬되어 있다.

### 3. Analysis History가 더 잘 반영됐다
v3/v4는 analysis history가 nav 텍스트 수준에 머물렀다면, v5는 여러 화면에서 존재감이 더 크다.
특히 analysis-dark 내 history table은 이전보다 진전이다.

### 4. Settings가 실제 제품에 더 가까워졌다
v5 settings는 다음을 더 명확하게 담고 있다.
- General
- SDK Management
- Build Targets
- Adapters
- Notifications

이는 현재 S1+S2 계약에서 중요한 관리 surface를 이전보다 더 잘 반영한다.

### 5. 핵심 화면 품질이 전반적으로 안정됐다
현재 1차 인상 기준 가장 좋은 화면:
- `overview-dark`
- `analysis-dark`
- `projects-list-light`
- `settings-light`

이 4개는 **AEGIS를 “자동차 임베디드 보안 운영 콘솔”로 읽히게 만드는 데 상당히 근접**했다.

## 아직 남은 핵심 문제

### P0-1: page title normalization 미완
직접 브라우저로 확인된 문제:
- `light/code-light.html` → title 비어 있음
- `light/quality-gate-light.html` → title 비어 있음

이건 단순 문구 문제가 아니라:
- 브라우저 탭 식별성
- 스냅샷 회귀 테스트 안정성
- 문서/산출물 완성도
를 모두 해친다.

### P0-2: 일부 title/copy가 여전히 synthetic 하다
예:
- `AEGIS Approvals | Technical Precision Authority`
- `AEGIS — Security Overview`
- `AEGIS Report Page`
- `AEGIS Quality Gate | Project Alpha`

문제:
- AEGIS canon 문맥에서 불필요하게 연출된 naming이 남아 있다.
- 특히 `Technical Precision Authority`, `Project Alpha`는 현재 제품 언어로 보기 어렵다.

### P0-3: report-dark 상단 shell 잔존
`report-dark.html`에 여전히 남은 요소:
- `Analysis Dashboard`
- `Repositories`
- `Security Policies`
- `Target Analytics`

이건 report surface를 **분석 결과 보고서**보다 **별도 suite의 한 페이지**처럼 보이게 만든다.
report는 더 좁고 명확해야 한다.

## 기능 대표성 관점의 남은 gap

v5는 좋아졌지만, 아직도 현재 실제 제품 전체를 다 담지 못한다.

### 여전히 부족한 surface
1. **Login**
2. **Global Settings**
3. **Dynamic Analysis placeholder**
4. **Dynamic Test placeholder**
5. **Source Upload**
6. **SDK Upload / SDK progress state machine**
7. **Pipeline progress / partial failure surface**
8. **Notification dropdown / empty / unread / terminal-completion state**
9. **독립 File Detail route 전략**

### 왜 중요한가
현재 AEGIS는 단순 dashboard product가 아니라:
- upload
- sdk
- analysis
- pipeline
- notifications
을 다루는 **async orchestration product**다.

즉, 정적 완료 화면만 예쁘게 만들어서는 부족하다.
사용자가 실제로 오래 머무는 상태 전이 surface도 reference에 있어야 한다.

## 화면별 코멘트

### Projects List
- v5 light는 이전보다 훨씬 낫다.
- generic repo-hosting 느낌이 줄고, project inventory surface로 읽힌다.
- 다만 여전히 **프로젝트 생성 이후 onboarding / source upload 연결감**은 약하다.

### Overview
- v5 dark overview는 현재 가장 설득력 있는 화면 중 하나다.
- `Security Posture`, `Build Targets`, `Recent Activity`, `Project Metadata` 구성이 잘 읽힌다.
- 이 화면은 v5의 strongest proof다.

### Static Analysis
- v5 dark analysis는 v4보다 더 안정적으로 보인다.
- run card / workflow progress / right-side status 영역이 납득 가능하다.
- 다만 **history route를 완전히 대표하는 별도 독립 surface**까지는 아직 부족하다.

### Files
- v5 light code는 source tree + right detail 구조가 좋다.
- 이전 v4의 repo-hosting shell 오염이 줄어들었다.
- 그러나 title 누락은 즉시 수정 필요.

### Approvals
- v5 light approvals는 domain-specific queue로 잘 읽힌다.
- 이전보다 외부 suite 느낌이 적다.
- 다만 title copy `Technical Precision Authority`는 삭제 대상이다.

### Quality Gate
- v5 light quality gate는 실제 운영 화면처럼 읽힌다.
- pass/fail, execution details, override entrypoint가 자연스럽다.
- 그러나 title 누락은 즉시 수정 필요.

### Settings
- v5 light settings는 현재 버전들 중 가장 제품 적합성이 높다.
- Notifications section을 별도 블록으로 준 것은 좋다.
- 다만 현재는 project settings에 집중되어 있어 global settings 전략은 아직 없다.

### Report
- v5 dark report는 이전보다 더 정리됐지만,
- 상단 shell과 `Target Analytics` 같은 요소가 남아 있어
- 아직 pure report surface로 보기 어렵다.

## 총평

### 현재 위치
- **v5는 v4를 대체할 가능성이 충분하다.**
- 하지만 아직 **v5 final**이라고 선언하면 안 된다.

### QA 관점의 현실적 해석
지금 v5는:
- “이제 드디어 AEGIS답게 보이기 시작한 버전”
- “다음 디자인 라운드의 주 기준본으로 삼을 만한 후보”
- 그러나 아직은 “최종 구현 허가본”이 아니라 “정리 후 구현 가능한 강한 후보”

## 요청 사항

### P0
1. `v5/light/code-light.html` title 추가
2. `v5/light/quality-gate-light.html` title 추가
3. 모든 page title naming policy 통일
4. report-dark 상단 shell 정리 (`Repositories`, `Security Policies` 등 제거 또는 축소)

### P1
1. synthetic copy 제거
   - `Technical Precision Authority`
   - `Project Alpha`
   - 과도한 연출형 라벨들
2. report / approvals / overview의 shell copy를 더 product-owned language로 정리
3. file / report / quality gate / settings의 light/dark parity 재점검

### P1.5
다음 부족한 surface를 reference 세트에 추가해 달라:
1. login
2. global settings
3. upload/source ingest
4. sdk upload / sdk progress
5. pipeline progress / partial-failure
6. notifications dropdown states
7. dynamic-analysis placeholder
8. dynamic-test placeholder

## v5 acceptance criteria (next round)
- [ ] 모든 페이지 title 존재
- [ ] page title naming 정책 통일
- [ ] report-dark 불필요 shell 제거
- [ ] synthetic product copy 제거
- [ ] login/global settings/upload/sdk/pipeline/notifications/dynamic placeholder surface 추가
- [ ] v5를 보고 AEGIS가 “자동차 임베디드 보안 운영 콘솔”로 즉시 읽힘

## 최종 요청
S1은 v5를 **“거의 다 왔다”** 수준으로 보고,
다음 라운드에서는 **마감 다듬기 + 누락 surface 보강**에 집중해 달라.

현재 QA 판정은 다음과 같다:
- **v5: strongest candidate so far**
- **but not final / not implementation-ready without one more cleanup round**

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
