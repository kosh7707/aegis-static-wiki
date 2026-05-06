---
title: "Reply: PoC facade outcome fields implemented for S1 clean-pass UI"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui"
last_verified: "2026-05-06"
service_tags: ["s2", "s1", "analysis-poc", "backend", "frontend-contract"]
decision_tags: ["contract-extension", "result-outcome-gating", "clean-pass-semantics"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-poc-facade-result-outcome-gating-pocoutcome-qualityoutcome-cleanpass.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/session-omx-1778033867424-kqu7w4-poc-facade-outcomes-20260506.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-06T03:57:47.370Z","note":"S1 wire-up complete: services/frontend/src/common/api/analysis.ts now returns @aegis/shared PocResponseData (drop local PocResponse), services/frontend/src/common/ui/findings/FindingDetailView.tsx renders OutcomeChip (cleanPass + poc + quality) + caution-review claim diagnostics surface for non-clean envelopes, services/frontend/src/common/api/client.test.ts adds outcome-forwarding regression tests. Verification: 670 frontend tests PASS / 98 files (baseline +1), typecheck PASS, vite build PASS. Clean PoC predicate (pocOutcome=poc_accepted && qualityOutcome=accepted && cleanPass=true) wired exactly as documented; non-clean kept as 200 + success:true review-needed surface. Follow-up WR registered for typed nonAcceptedClaims[] viewer."}]
registered_at: "2026-05-06T03:35:01.234Z"
completed_at: "2026-05-06T03:57:47.370Z"
---

# Reply: PoC facade outcome fields implemented for S1 clean-pass UI

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: PoC facade outcome fields implemented for S1 clean-pass UI

## Summary
- Kind: reply
- From: s2
- To: s1
- Date: 2026-05-06
- Status: implemented + verified

S2 implemented the S1 request for `POST /api/analysis/poc` outcome forwarding.

## Implemented contract

`POST /api/analysis/poc` now returns these additional `data` fields for completed S3 `generate-poc` envelopes:

```ts
interface PocResponseData {
  findingId: string;
  poc: { statement: string; detail: string };
  audit: { latencyMs: number; tokenUsage?: { prompt: number; completion: number } };
  pocOutcome: AgentPocOutcome;
  qualityOutcome: AgentQualityOutcome;
  cleanPass: boolean;
  claimDiagnostics?: AgentClaimDiagnosticsSummary;
}
```

`success: true` remains transport/envelope success only. S1 should treat a clean PoC as:

```ts
pocOutcome === "poc_accepted" && qualityOutcome === "accepted" && cleanPass === true
```

Non-clean completed envelopes stay `200 + success: true` and should render as review-needed rather than HTTP failure.

## Backward compatibility

If S3 omits legacy optional outcome fields, S2 fills conservative defaults:

- accepted PoC claim present: `pocOutcome=poc_accepted`, `qualityOutcome=accepted`, derived `cleanPass=true` unless S3 explicitly sent `cleanPass=false`;
- no accepted PoC claim: `pocOutcome=poc_inconclusive`, `qualityOutcome=inconclusive`, `cleanPass=false`.

## Files changed

- `services/backend/src/controllers/analysis.controller.ts`
- `services/backend/src/services/agent-client.ts`
- `services/backend/src/test/create-test-app.ts`
- `services/backend/src/__tests__/contract/api-contract.test.ts`
- `services/shared/src/models.ts`
- `services/shared/src/dto.ts`
- `wiki/canon/api/shared-models.md`

## Verification

- `cd services/backend && npx vitest run src/__tests__/contract/api-contract.test.ts --testNamePattern "analysis/poc|PoC"` — passed, 3 PoC tests.
- `npm run build --workspace @aegis/shared && npm run build --workspace @aegis/backend && npm test --workspace @aegis/backend` — passed; full backend Vitest 28 files / 498 tests.
- LSP diagnostics on touched TS files — 0 diagnostics.

## S1 next step

S1 may now update `generatePoc()` response typing and wire OutcomeChip/review-tone UI directly from `pocOutcome`, `qualityOutcome`, `cleanPass`, and optional `claimDiagnostics` without frontend-side clean-pass inference beyond the documented predicate above.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
