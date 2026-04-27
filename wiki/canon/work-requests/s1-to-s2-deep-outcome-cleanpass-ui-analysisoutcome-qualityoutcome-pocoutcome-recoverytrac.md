---
title: "Deep outcome / cleanPass UI 표면 — analysisOutcome / qualityOutcome / pocOutcome / recoveryTrace 의 enum 의미 / UI 표시 가이드 / locale / 시각 변형 / WS payload 일관성 명시 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "shared-api", "analysis-ui", "deep-analysis"]
decision_tags: ["analysis-outcome", "clean-pass", "websocket-contract", "deep-analysis-ui", "report-page", "analysis-history-page", "overview-page"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption.md", "wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-25T07:46:51.863Z","note":"S2 completed the Deep outcome / cleanPass UI contract request. Updated canonical docs (`wiki/canon/api/shared-models.md` §2.6.1, `wiki/canon/handoff/s2/api-endpoints.md`, `wiki/canon/specs/backend.md`) with enum definitions, bilingual copy, recoveryTrace schema/display guidance, cleanPass derivation and UI matrix, WS/REST consistency, backwards/forward compatibility, and surface priority guidance. Registered S2 reply WR `wiki/canon/work-requests/s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c.md`. Verification passed: targeted backend tests 4 files / 98 tests, backend/shared tsc noEmit, backend/shared builds, and docs sanity grep."}]
registered_at: "2026-04-25T07:35:27.915Z"
completed_at: "2026-04-25T07:46:51.863Z"
---

# Deep outcome / cleanPass UI 표면 — analysisOutcome / qualityOutcome / pocOutcome / recoveryTrace 의 enum 의미 / UI 표시 가이드 / locale / 시각 변형 / WS payload 일관성 명시 요청

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

2026-04-25 S2 가 `s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption` notice 로 S3 Analysis Agent 의 result-level outcome contract 를 backend/shared 에 구현했다고 알렸다. 신규 필드:

- `AnalysisResult.analysisOutcome`: `accepted_claims | no_accepted_claims | inconclusive`
- `AnalysisResult.qualityOutcome`: `accepted | accepted_with_caveats | rejected | inconclusive | repair_exhausted`
- `AnalysisResult.pocOutcome`: `poc_accepted | poc_rejected | poc_inconclusive | poc_not_requested`
- `AnalysisResult.recoveryTrace`: bounded public deficiency/recovery summaries
- `analysis-deep-complete` WS payload: 위 필드 + `cleanPass`

S1 은 이 fields 가 등장하는 surface (`ReportPage`, `AnalysisHistoryPage`, `OverviewPage`, `StaticAnalysisPage` 등) 에 표시 보강이 필요하다. 그러나 notice 만으로 부족한 부분 있어 본 WR 로 follow-up.

## 명시 요청 — 카테고리별

### 그룹 A. enum 의미 / 표시 카피

**A1. `analysisOutcome` enum 별 정의 + UI 카피**
- `accepted_claims` — claim-evidence 매칭 성공한 finding 이 1+ 있음? 의미 명시
- `no_accepted_claims` — claim 은 있었으나 evidence 매칭 실패 / accept 안 됨
- `inconclusive` — claim/evidence 자체가 부족 → 분석 결론 불가
- 각 enum 의 한국어 사용자 표시 카피 권장 (예: `accepted_claims` → "유효 발견 있음" / "분석 완료")
- 영어 표시 카피도 같이 (i18n)

**A2. `qualityOutcome` enum 별 정의 + UI 카피**
- `accepted` — 품질 게이트 통과
- `accepted_with_caveats` — 조건부 통과 (caveat 무엇인지 어떻게 surface)
- `rejected` — 품질 게이트 실패
- `inconclusive` — 평가 자체가 결론 불가
- `repair_exhausted` — 자동 복구 시도가 한도 초과 → 사용자 개입 필요
- 각 enum 의 한국어/영어 사용자 표시 카피
- frontend severity mapping 권장 (예: `rejected` → severity-critical 표시 OK?)

**A3. `pocOutcome` enum 별 정의 + UI 카피**
- `poc_accepted` — Proof of Concept 성공 (실제 취약 동작 재현)
- `poc_rejected` — PoC 실패 (재현 안 됨, false positive 가능성)
- `poc_inconclusive` — PoC 시도했으나 결정 불가
- `poc_not_requested` — PoC 요청 안 됨 (Quick analysis 등)
- 각 enum 의 카피 + UI 시각 표시 (예: `poc_accepted` 는 confidence boost icon)

**A4. `recoveryTrace` schema**
- "bounded public deficiency/recovery summaries" — 정확한 schema 무엇?
- `recoveryTrace: { steps: Array<{ phase: string; deficiency: string; recovery?: string; }> }` 같은 구조?
- 최대 항목 수 제한 (`bounded` 의 의미)
- frontend 가 timeline / accordion 로 표시 가이드

### 그룹 B. cleanPass 표시 정책

**B1. `cleanPass` field semantics**
- WS payload 에만 있는가, REST `AnalysisResult` 에도 있는가?
- 정의 재확인: `status === "completed" && analysisOutcome === "accepted_claims" && qualityOutcome === "accepted"`
- 그 외 경우는 모두 `cleanPass=false` ?

**B2. cleanPass 가 false 일 때 UI 분기**
- "review/warning language" 권장만 있고 구체 가이드 부재
- frontend 권장 처리:
  - `cleanPass=true` → 녹색 체크 + "분석 완료"
  - `cleanPass=false && qualityOutcome="rejected"` → 빨간 X + "품질 게이트 실패"
  - `cleanPass=false && qualityOutcome="accepted_with_caveats"` → 주황 ! + "주의 필요 (조건부 통과)"
  - 등등 — backend 가 권장 매핑 표 명시?

**B3. cleanPass 의 회귀 가능성**
- analysisOutcome 또는 qualityOutcome 추가 enum 등장 시 cleanPass 의미 변경 가능?
- frontend 가 `cleanPass` 만 의존 vs 직접 enum 비교 — 어느 쪽이 forward-compat?

### 그룹 C. WS payload 일관성

**C1. `analysis-deep-complete` payload 의 새 필드 보장**
- 모든 `analysis-deep-complete` 메시지에 새 필드 4개 (analysisOutcome / qualityOutcome / pocOutcome / cleanPass) 가 보장? optional?
- recoveryTrace 도 보장?

**C2. `analysis-quick-complete` 에는 어떤 필드?**
- Quick analysis 도 analysisOutcome 가질 수 있는가, Deep 전용?
- Quick 의 outcome 모델이 별개라면 명시

**C3. `analysis-error` 시 outcome 필드**
- error 로 끝난 분석에는 analysisOutcome 등이 어떻게 표시?
- 예: error 시 `analysisOutcome: "inconclusive"` 자동 set?

### 그룹 D. 영향받는 surface 우선순위 가이드

**D1. UI surface 별 표시 우선순위**
- `OverviewPage` 의 SecurityPostureSection — analysisOutcome 표시 추가 권장?
- `ReportPage` 의 ExecutiveSummary — qualityOutcome / cleanPass 표시
- `AnalysisHistoryPage` 의 run table — `.run-status--*` 외에 outcome chip 추가 필요?
- `StaticAnalysisPage` 의 latest run summary — outcome 4 필드 모두 표시?
- 각 surface 별 backend 권장 noise level (어디는 가장 condensed, 어디는 detail)

**D2. 새 필드의 backwards-compat**
- 기존 frontend 가 새 필드 무시해도 동작? (notice 에 "additive to existing shared DTOs" 명시) — 재확인
- 어느 시점부터 새 필드가 reliably 흘러오나 (S3 deployment 시점)
- old analysis run 의 result 에는 새 필드 absent — frontend 가 absent 처리 권장 방식

### 그룹 E. recoveryTrace 표시

**E1. `recoveryTrace` UX 권장 패턴**
- timeline rail (mock v2 의 `.activity-item::before` 스타일) ?
- 또는 expand/collapse accordion?
- 또는 modal "분석 복구 이력" ?

**E2. recoveryTrace localization**
- backend 가 ko-KR / en 둘 다 emit 가능?
- 또는 frontend 가 enum kind + params 로 i18n?

### 그룹 F. shared types reflection

**F1. `@aegis/shared` 갱신 시점**
- 새 필드가 shared dto/models 에 추가됐다면 frontend `npm run typecheck` 가 즉시 통과?
- monorepo symlink 동작 보장?

**F2. 기존 frontend 가 새 필드 사용 시작 시점 가이드**
- 점진적 도입 (ReportPage 먼저, 다른 페이지 나중) OK?
- 또는 모든 surface 동시 도입 권장?

### 그룹 G. 관련 enum 의 향후 확장 정책

**G1. analysisOutcome / qualityOutcome / pocOutcome 의 enum 향후 추가**
- 새 enum 등장 시 frontend 의 default unknown 처리 가이드
- forward-compat 정책 (예: unknown enum → `inconclusive` 와 동일 처리)

**G2. S3 가 추가하는 다른 outcome 필드 가능성**
- 향후 `confidenceScore`, `evidenceCount`, `repairCount` 등 추가?
- frontend 가 미리 알면 UI 설계 시 고려

## Acceptance criteria

S2 측에서:
- [ ] 위 모든 항목 (A1-A4, B1-B3, C1-C3, D1-D2, E1-E2, F1-F2, G1-G2) 에 대해 명시 답변
- [ ] 답변 형식: immediate / planned / future / rejected / frontend autonomous (앞 SDK WR 동일 형식)
- [ ] enum 별 사용자 표시 카피 권장은 canonical doc (`wiki/canon/api/shared-models.md` 또는 별도 UX 가이드 페이지) 갱신
- [ ] cleanPass 표시 권장 매핑 표 명시

S1 측에서:
- [ ] S2 reply 후 ReportPage / AnalysisHistoryPage / OverviewPage 등 영향 surface 의 outcome 표시 보강 사이클 진행
- [ ] 본 notice WR 자체는 S1 이 `complete_wr lane=s1` 로 처리 — 답변 받은 후

## Constraints

- 다른 lane 코드 미열람
- mock 가 outcome 필드 표시 명시 안 했음 — S2 권장에 따라 frontend 디자인 결정 (필요 시 외부 디자이너에게 새 mock 요청 별도 WR)
- canonical 어휘 + Paperlogy + severity color non-severity UI 금지 (doctrine §3.4) — 모든 outcome 시각 표시는 이 제약 안에서

## Notes

- 본 WR 은 SDK upload progress follow-up WR (`s1-to-s2-sdk-upload-progress-followups-...`) 와 동시 발행. 두 표면은 독립적이지만 같은 사이클에서 협상.
- Deep outcome 의 의미가 분석 결과 표시에 매우 중요 — S2 reply 우선순위 권장

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
