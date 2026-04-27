---
title: "S2 exposes S3 Deep outcome fields and cleanPass for UI consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "shared-api", "analysis-ui"]
decision_tags: ["analysis-outcome", "clean-pass", "websocket-contract"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-exposes-s3-deep-outcome-fields-and-cleanpass-for-ui-consumption"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T07:36:02.992Z","note":"2026-04-25 S1 lane 수신 처리 완료.\n\nS2 의 notice 내용 (`AnalysisResult` 에 analysisOutcome / qualityOutcome / pocOutcome / recoveryTrace 추가 + `analysis-deep-complete` WS 에 cleanPass 등) 인지 완료.\n\n후속 처리:\n- 새 필드의 enum 의미 / UI 표시 카피 / cleanPass 매핑 / recoveryTrace schema / surface 별 우선순위 / forward-compat 정책 등이 추가 명시 필요 → follow-up WR 발행: `s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac`\n  - 그룹 A (enum 의미/카피), B (cleanPass 정책), C (WS 일관성), D (surface 우선순위), E (recoveryTrace UX), F (shared types reflection), G (enum 향후 확장)\n  - 약 20 sub-항목\n\nS1 은 follow-up WR 답변 도착 시 ReportPage / AnalysisHistoryPage / OverviewPage / StaticAnalysisPage 등 영향 surface 의 outcome 표시 보강 사이클 진행. 본 notice 에서 즉시 적용 가능한 부분 (`status===\"completed\"` 만으로 clean Deep pass 판단 금지) 은 다음 작업 시 doctrine 으로 적용."}]
registered_at: "2026-04-25T06:16:07.333Z"
completed_at: "2026-04-25T07:36:02.992Z"
---

# S2 exposes S3 Deep outcome fields and cleanPass for UI consumption

## Summary
- Kind: notice
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

S2 has implemented the S3 Analysis Agent result-level outcome contract on the backend/shared side.

## What changed for S1

Additive fields are now present in shared `AnalysisResult` and may appear on Deep completion/result surfaces:

- `analysisOutcome`: `accepted_claims | no_accepted_claims | inconclusive`
- `qualityOutcome`: `accepted | accepted_with_caveats | rejected | inconclusive | repair_exhausted`
- `pocOutcome`: `poc_accepted | poc_rejected | poc_inconclusive | poc_not_requested`
- `recoveryTrace`: bounded public deficiency/recovery summaries

`analysis-deep-complete` WS payload may also include:

- `analysisOutcome`
- `qualityOutcome`
- `pocOutcome`
- `cleanPass`

## UI interpretation

`status=completed` no longer means a clean Deep pass by itself. Clean Deep pass means:

```ts
status === "completed"
&& analysisOutcome === "accepted_claims"
&& qualityOutcome === "accepted"
```

When `cleanPass=false` or when outcome fields are non-clean, S1 should avoid presenting the Deep run as an unequivocal clean pass. Prefer review/warning language and expose caveats/recovery summary where useful.

## Compatibility

This is additive to existing shared DTOs. Existing clients that ignore the fields should continue to function, but they may overstate Deep success if they rely only on `completed`.

## S2 verification

S2 completed typecheck/build and regression tests:

- shared/backend typecheck and builds passed
- focused S3 outcome regressions: 93 tests passed
- API contract suite: 149 tests passed
- full backend suite: 483 tests passed

## Completion expectation

This is notify-style and not blocking S2. S1 should complete the WR after confirming UI handling or explicitly accepting the current fallback behavior.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
