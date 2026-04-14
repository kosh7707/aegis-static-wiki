---
title: "S1-QA deep design review of design reference v3/v4 — reject v3 baseline, treat v4 as provisional only"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a"
last_verified: "2026-04-14"
service_tags: ["frontend", "design", "qa"]
decision_tags: ["design-review", "route-coverage", "brand-consistency", "ux"]
related_pages: ["wiki/canon/specs/frontend.md", "wiki/canon/handoff/s1/qa-guide.md", "wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md"]
migration_status: "canonicalized"
wr_id: "s1-qa-to-s1-s1-qa-deep-design-review-of-design-reference-v3-v4-reject-v3-baseline-treat-v4-a"
wr_kind: "request"
status: "completed"
from_lane: "s1-qa"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T05:09:18.240Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1 without additional implementation or verification in this S7 session."}]
registered_at: "2026-04-08T13:55:15.162Z"
completed_at: "2026-04-14T05:09:18.240Z"
---

# S1-QA deep design review of design reference v3/v4 — reject v3 baseline, treat v4 as provisional only

## Summary
- Kind: request
- From: s1-qa
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S1-QA deep design review — docs/design/reference v3 vs v4

- 날짜: 2026-04-08
- 범주: Design review / IA review / brand consistency audit / route coverage audit
- 검토 대상:
  - `docs/design/reference/v3/**`
  - `docs/design/reference/v4/**`
- 기준 문서:
  - `wiki/canon/specs/frontend.md`
  - `wiki/canon/handoff/s1/qa-guide.md`
  - `wiki/canon/work-requests/s1-qa-to-s1-aegis-ibm-carbon-nvidia.md`
  - `wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md`
  - `wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md`
- 검증 방식:
  - Playwright MCP + local static server (`http://127.0.0.1:47891/`)
  - v3/v4 `index.html` viewer 단축키 검증 (`d`, `l`, `ArrowLeft`, `ArrowRight`, `Escape`)
  - 전체 HTML reference 39개 렌더 확인
  - 대표 화면 스크린샷 비교 (projects / overview / analysis / findings / code / report / quality-gate / approvals / settings)

## Executive verdict

### 결론 한 줄
- **v4를 base로 삼는 판단은 타당**하다.
- 하지만 **v3, v4 둘 다 그대로 구현 가능한 수준은 아니다.**
- 특히 **현재 AEGIS 실제 기능/정보구조를 전부 표현하기에는 부족**하고, 두 버전 모두 **비-AEGIS 브랜드/역할/패널이 섞여 있어 정리 없이 구현하면 제품 정체성이 훼손**된다.

### 최종 판정
- **v3**: 참고용으로만 유지. canonical implementation baseline으로 채택 금지.
- **v4**: 채택 가능성 있음. 단, **정리(cleanup) + route coverage 보강 + Carbon 기준 재정렬**이 선행되어야 함.
- 즉, 현재 판단은 **"v4 선택"이 아니라 "v4를 정리 대상으로 채택"**이다.

## 점수표 (5점 만점)

| 항목 | v3 | v4 | 판정 |
|---|---:|---:|---|
| AEGIS 기능 표면 커버리지 | 2.5 | 3.0 | 둘 다 부족, v4가 조금 나음 |
| 브랜드/제품 정체성 | 2.0 | 3.0 | v3는 drift 심각, v4도 아직 불안 |
| 화면 간 일관성 | 1.5 | 3.0 | v4 우세 |
| Analyst-first / Evidence-first 적합도 | 2.5 | 3.5 | v4 우세 |
| Dark/Light parity | 2.5 | 3.5 | v4 우세 |
| AI스러운 artifact 억제 | 1.0 | 2.0 | 둘 다 문제, v3가 훨씬 심각 |
| 구현 베이스로서의 안정성 | 1.5 | 3.0 | v4만 조건부 가능 |

## 핵심 판단 근거

### 1. v4가 v3보다 낫다고 본 이유
1. **운영 콘솔 톤이 더 안정적**이다.
   - overview / analysis / findings / quality gate / settings에서 상태 밀도와 가독성의 균형이 더 좋다.
2. **AEGIS가 다루는 핵심 개념**
   - project
   - findings
   - build targets
   - quality gate
   - approvals
   - report
   가 더 또렷하게 읽힌다.
3. 특히 **dark mode 기준**에서 v4가 훨씬 덜 흔들린다.
4. v3보다 **generic SaaS / 다른 제품 clone 느낌이 덜하다.**

### 2. 그럼에도 v4를 바로 구현하면 안 되는 이유
1. **실제 S1 route coverage가 부족**하다.
2. **AI-generated drift**가 아직 남아 있다.
3. **GitHub/보안 솔루션/컨설팅형 패턴이 혼입**되어 있다.
4. **현재 AEGIS의 async orchestration 성격**(upload / sdk / analysis / pipeline / notifications)이 충분히 보이지 않는다.

## 실제 AEGIS 기능 커버리지 감사

현재 canonical spec 기준에서 S1이 실제로 갖고 있는 주요 사용자 표면:
- `/projects`
- `/settings` (global)
- `/login`
- `/overview`
- `/static-analysis`
- `/files`
- `/files/:fileId`
- `/vulnerabilities`
- `/analysis-history`
- `/report`
- `/quality-gate`
- `/approvals`
- `/settings` (project)
- `/dynamic-analysis` (placeholder)
- `/dynamic-test` (placeholder)

v3/v4 reference가 직접 커버하는 표면:
- projects list
- overview
- analysis
- files/code
- findings
- report
- quality gate
- approvals
- settings

### 누락 / 불충분한 표면
1. **Analysis History 전용 화면 부재**
   - v3 dark analysis에는 `Analysis History` nav가 보이지만, 전용 mockup은 없다.
   - 현재 제품은 실제 route를 가진다. 따라서 mockup 부재는 단순 omission이 아니라 설계 누락이다.
2. **Login surface 부재**
   - 실제 global route 존재.
3. **Global Settings surface 부재**
   - 현재 reference의 settings는 project settings에 가깝다.
4. **File Detail 전용 화면 부재**
   - Code/Files와 file detail이 합쳐져 있지만 현재 route는 분리되어 있다.
5. **Dynamic placeholder route 부재**
   - 현재 제품에서는 숨김 placeholder라도 존재한다. reference에도 placeholder surface 전략이 있어야 한다.
   - 최소한 “현재 intentionally hidden / coming soon”인지 보여주는 canonical placeholder 전략이 필요하다.
6. **Notifications 표면 부재**
   - 거의 모든 화면에 bell 아이콘은 있으나, 드롭다운/empty/error/completed state mockup이 없다.
7. **프로젝트 생성 / 소스 업로드 / SDK 등록 / pipeline 상태 surface 부재**
   - 현재 AEGIS는 단순 조회형 대시보드가 아니라 async job orchestration 제품이다.

## AEGIS 제품 성격 관점에서의 치명적 gap

S2 canonical handoff 기준으로 현재 AEGIS 프론트가 반드시 다뤄야 하는 foreground/background 상태 surface:
- upload
- sdk
- analysis
- pipeline
- notifications

그런데 v3/v4 reference는 대부분 **정적 완료 상태**만 보여준다.

### 이게 왜 문제인가
AEGIS는 “결과를 예쁘게 보여주는 앱”이 아니라,
**업로드 → 탐색 → 빌드 → 분석 → 검토 → 승인**의 긴 비동기 흐름을 운영하는 콘솔이다.

즉 아래가 보여야 한다.
- 현재 무슨 job이 돌아가고 있는지
- quick/deep가 어디까지 왔는지
- sdk가 extracting인지 verifying인지
- pipeline이 target별로 일부 실패했는지
- 페이지 이탈 후 notification으로 completion awareness를 어떻게 받는지

현재 v3/v4는 이 운영 리듬을 거의 보여주지 못한다.
이 점에서 **기능 대표성 부족** 판정이다.

## 페이지별 심층 검토

### A. Projects List
#### v3
- 장점: severity bar와 프로젝트 목록 구조 자체는 이해 가능
- 문제:
  - **브랜드가 `ARCHITECT`로 표기**되는 화면이 존재 (`projects-list-light`) → 즉시 reject 사유
  - GitHub repo list를 너무 직접적으로 흉내 낸 느낌
  - footer / 주변 문구도 AEGIS product ownership이 약함
- 판정: **구현 베이스 불가**

#### v4
- 장점:
  - 카드가 row형으로 정리되어 generic dashboard보다 운영툴에 가까움
  - severity density가 읽기 쉬움
- 문제:
  - `SENTINEL ENGINE`, `PLATFORM CLOUD-CORE` 같은 문구는 AEGIS canon과 무관
  - 프로젝트 생성 이후의 source upload / onboarding 흐름이 안 보임
- 판정: **v4 승, 하지만 cleanup 필요**

### B. Overview
#### v3
- dark는 강한데, overview보다 “보안 통제 콘솔” 느낌이 강해진다.
- `DEPLOY PATCH` CTA는 현재 AEGIS overview의 기본 목적과 어긋난다.
- light/dark의 같은 route가 같은 제품처럼 느껴지지 않는다.

#### v4
- overall hierarchy는 좋다.
- build targets / inventory / open findings가 더 정돈되어 보인다.
- 다만 light overview 우측의 **`System Architecture View` 장식 패널**은 정보 가치보다 장식성이 크다.
- overview는 project health / recent activity / findings / build targets가 중심이어야지, 컨셉 아트 카드가 중심이 되면 안 된다.

### C. Analysis
#### v3
- quick/deep result block이 크고 설명적이라 상태 읽기 자체는 가능
- 다만 CTA와 카드 구성이 조금 더 “보여주기용 보안 대시보드” 같다.
- dark theme에서 GitHub + internal console 톤이 혼재된다.

#### v4
- **가장 안정적인 화면 중 하나**
- filter / run / pipeline trace / summary의 구조가 납득 가능
- 다만 여전히 analysis history가 독립 surface로 분리되지 않아 현재 route와 어긋난다.
- 이 화면은 **v4가 base가 되어도 유지 가능한 축**이다.

### D. Code / Files
#### v3
- 파일 트리 + 우측 detail 구조는 실무적으로 괜찮다.
- 그러나 상단 `Clone`, `Analyze Diff`는 현재 AEGIS files surface와 직접적으로 맞지 않는다.
- code review platform처럼 보이기 쉬움.

#### v4
- 정보 밀도는 좋다.
- 하지만 상단에 **Repositories / Pull Requests / Issues / Marketplace**가 붙는 순간 AEGIS가 repo hosting 제품처럼 보인다.
- 좌측 `Deployments`, `Analytics`도 현재 IA와 맞지 않는다.
- 즉, **코드 페이지 자체보다 주변 shell이 문제**다.

### E. Findings
#### v3
- 일부 화면은 industrial 느낌이 강하지만,
- `Sovereign Sec` 같은 foreign brand가 끼어들어 QA 관점에서 신뢰성이 크게 떨어진다.
- v3 dark findings는 “AEGIS finding triage”보다 “다른 보안 제품의 terminal skin”처럼 보인다.

#### v4
- list 자체는 더 실무형이다.
- 다만 `Deployments` 같은 nav가 끼어드는 순간 다시 제품 정체성이 흐려진다.
- findings는 **Evidence-first**가 제일 중요하므로, extra nav보다 rule/source/evidence/location/status를 더 밀어줘야 한다.

### F. Report
#### v3
- dark report는 시각적으로 강하지만, hero가 너무 크고 theatrical하다.
- `Automotive Division` / `System Admin` 같은 라벨은 현재 canon과 맞지 않는다.
- “보고서 운영 화면”보다 “브랜디드 프레젠테이션”처럼 느껴질 위험이 있다.

#### v4
- report 정보구조 자체는 v3보다 낫다.
- executive summary / tabs / numeric summary는 적절하다.
- 그러나 **`Customize Widget`**는 report seriousness를 떨어뜨리는 패널이다.
- report는 customization demo보다 audit/readout credibility가 먼저여야 한다.

### G. Quality Gate
#### v3
- `Dashboard / Issues / Pull Requests / Actions` 상단 탭,
  `Core Engine / Security Module / API Gateway` 사이드 모듈은 현재 AEGIS route model과 너무 멀다.
- quality gate의 핵심은 gate 기준, 현재 상태, override/history이지 pseudo-platform shell이 아니다.

#### v4
- v3보다 훨씬 낫다.
- gate criteria + history 구조가 더 명료하다.
- 그래도 `Project Sentinel`, `Security Clearance Level 4` 같은 copy는 삭제해야 한다.

### H. Approvals
#### v3
- approval domain 표현은 나쁘지 않지만, `Aegis Engine`, `Repositories`, `Docs`, `Support`가 섞여 있다.
- 화면의 본질은 override/release approval review인데, 주변 정보가 산만하다.

#### v4
- approval list/detail 패턴은 좋다.
- reviewer, labels, linked gate가 읽히는 편이다.
- 다만 `Pending Requests / History / Templates / Analytics`는 현재 제품 scope를 넘는다.
- Approvals는 domain-specific queue면 충분하지, 별도 suite처럼 보일 필요가 없다.

### I. Settings
#### v3
- 기본 구조는 있으나 dark/light에서 제품 톤 차이가 크다.
- 정보 밀도는 괜찮지만 bespoke nav가 섞인다.

#### v4
- General / SDK Management / Build Targets / Adapters 탭은 현재 제품과 가장 잘 맞는 편이다.
- 이 화면은 v4의 강점 중 하나다.
- 다만 global settings와 project settings의 분리가 아직 설계로 명확하지 않다.

## 일관성 감사

### v3 문제
- 같은 제품 안에서 브랜드가 계속 바뀐다.
  - `AEGIS`
  - `ARCHITECT`
  - `Sovereign Sec`
  - `Aegis Engine`
  - `Automotive Division`
- page title도 누락되거나 제각각이다.
- same route의 dark/light가 서로 다른 제품처럼 보인다.
- nav vocabulary가 매 화면 다르다.

### v4 문제
- v3보다 낫지만 아직 drift가 남아 있다.
  - `Project Sentinel`
  - `Sentinel`
  - `Platform Cloud-Core`
  - `Lead Architect`
  - `Sovereign Engineer`
  - `Security Clearance Level 4`
- v4는 **디자인의 뼈대는 안정적**이지만 copy/system cleanup이 반드시 필요하다.

## “AI스러운 부분” 감사

### v3 — 심각
- random brand/role/environment nouns가 너무 많다.
- title/footers/nav가 사람 손으로 만든 제품 언어라기보다 생성 모델이 그럴듯하게 섞은 결과에 가깝다.
- 특히 `ARCHITECT`, `Sovereign Sec`, `Aegis Engine`은 한 제품 안에 공존할 수 없다.

### v4 — 중간
- 정보 구조는 많이 좋아졌지만,
- copy 레벨에서 아직 synthetic security-software 문구가 남아 있다.
- `Project Sentinel`, `Sovereign Engineer`, `Security Clearance Level 4`는 문서 근거 없는 장식적 역할명이다.

## 불필요한 패널 / 제거 권장 요소

### 제거 권장 (v3)
- Overview dark의 `Deploy Patch`
- Code dark의 `Clone`, `Analyze Diff`
- Quality Gate dark의 GitHub형 상단 탭
- foreign product shell 전반

### 제거 권장 (v4)
- Overview light의 `System Architecture View`
- Report dark의 `Customize Widget`
- Code dark의 `Repositories / Pull Requests / Issues / Marketplace`
- Findings/Code의 `Deployments`, `Analytics`
- Approvals의 `Templates`, `Analytics`

## 이미 존재하는 canonical design direction과의 충돌

기존 canonical WR 기준:
- **IBM Carbon을 canonical base**로 삼고
- **NVIDIA식 restraint**를 참고하는 방향이 이미 제안/합의되어 있다.

그 관점에서 보면 v3/v4는 아직:
- Carbon식 semantic token discipline이 문서상 드러나지 않고
- bespoke shell variation이 많고
- GitHub imitation / security-brand imitation이 강해
- “한 제품의 일관된 시스템”보다는 “여러 좋은 화면을 모은 세트”에 가깝다.

즉, **route-level inspiration set으로는 쓸 수 있어도 implementation-ready design system으로는 부족**하다.

## 요청 사항

### P0 (즉시)
1. **v3를 canonical baseline 후보에서 제외**해 달라.
2. **v4를 provisional base로 잠정 선택**하되, 바로 구현하지 말고 cleanup pass를 먼저 진행해 달라.
3. S1이 구현 시작 전 **route coverage matrix**를 작성해 달라.
   - 현재 실제 route
   - 대응 mockup 존재 여부
   - 누락 mockup 목록

### P1 (필수 수정)
1. 모든 화면에서 **foreign brand / synthetic role / invented suite label 제거**
   - 예: ARCHITECT, Sovereign Sec, Project Sentinel, Sentinel Engine, Lead Architect, Sovereign Engineer 등
2. **nav vocabulary 정규화**
   - Overview / Static Analysis / Files / Vulnerabilities(or Findings) / Analysis History / Report / Quality Gate / Approvals / Settings
3. **불필요한 pseudo-GitHub / pseudo-suite 패널 제거**
4. **title / footer / shell copy를 AEGIS canonical language로 통일**
5. **report / overview / code에서 장식 패널보다 domain information 우선**으로 재배치

### P1.5 (기능 대표성 보강)
다음 mockup을 추가해 달라:
1. Analysis History
2. File Detail
3. Global Settings
4. Login
5. Notifications dropdown / empty / unread / completion state
6. Source upload / SDK upload / pipeline progress / analysis progress states
7. Dynamic Analysis / Dynamic Test placeholder strategy

### P2 (후속)
1. v3에서 시각적 에너지/대비가 좋았던 일부 포인트만 선택적으로 흡수
2. light/dark parity를 더 엄격하게 맞추기
3. severity/state token hierarchy를 Carbon 방식으로 더 분명히 재정렬

## Acceptance criteria for next design round
- [ ] v4 base에서 foreign brand/copy drift 0건
- [ ] 현재 S1 실제 route 기준 mockup coverage matrix 완료
- [ ] 필수 누락 surface mockup 추가
- [ ] upload/sdk/analysis/pipeline/notifications progress surface 반영
- [ ] page title / nav / footer / shell 언어 일관화
- [ ] “예쁜 SaaS”가 아니라 “신뢰 가능한 자동차 임베디드 보안 운영 콘솔”로 읽힘

## 첨부 가능한 증거
- `playwright-mcp-v3-overview-light.png`
- `playwright-mcp-v4-overview-light.png`
- `playwright-mcp-v3-projects-list-light.png`
- `playwright-mcp-v4-projects-list-light.png`
- `playwright-mcp-v3-findings-light.png`
- `playwright-mcp-v4-findings-light.png`
- `playwright-mcp-v3-overview-dark.png`
- `playwright-mcp-v4-overview-dark.png`
- `playwright-mcp-v3-index-analysis-dark.png`
- `playwright-mcp-v4-index-analysis-dark.png`
- `playwright-mcp-v3-index-report-dark.png`
- `playwright-mcp-v4-index-report-dark.png`
- `playwright-mcp-v3-index-quality-gate-dark.png`
- `playwright-mcp-v4-index-quality-gate-dark.png`
- `playwright-mcp-v3-index-approvals-dark.png`
- `playwright-mcp-v4-index-approvals-dark.png`
- `playwright-mcp-v3-index-code-dark.png`
- `playwright-mcp-v4-index-code-dark.png`

## 최종 요청
S1은 이 WR을 “어느 시안이 더 예쁜가” 수준으로 처리하지 말고,
**현재 AEGIS 제품을 전부 담아낼 수 있는 canonical redesign baseline을 세우는 작업**으로 받아들여 달라.

현재 QA 판정은 다음과 같다:
- **v3: reject as baseline**
- **v4: accept only as provisional base after cleanup + coverage expansion**

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
