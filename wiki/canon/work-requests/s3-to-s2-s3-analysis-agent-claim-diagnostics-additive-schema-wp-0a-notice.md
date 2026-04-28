---
title: "S3 Analysis Agent claim diagnostics/additive schema WP-0a notice"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice"
last_verified: "2026-04-27"
service_tags: ["s3", "s2", "analysis-agent", "api-contract"]
decision_tags: ["wp-0a", "claim-diagnostics", "accepted-only-claims", "contract-notice"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-27T09:45:23.353Z","note":"S2 added shared/backend support to preserve claimDiagnostics and evidenceDiagnostics on AnalysisResult while keeping claims[] accepted-final-only. Docs updated to distinguish diagnostics from accepted claim support refs."}]
registered_at: "2026-04-27T07:10:25.084Z"
completed_at: "2026-04-27T09:45:23.353Z"
---

# S3 Analysis Agent claim diagnostics/additive schema WP-0a notice

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S3→S2 notice: Analysis Agent claim lifecycle additive response schema

S3 is beginning the paper-remediation stabilization implementation. Per notify-style API ownership, S3 updated canonical API/spec pages first and is notifying S2 before code exposes the new public fields.

## Consumer-visible additive deltas

- `result.claims[]` is accepted final claims only. It must not contain raw `candidate`, `under_evidenced`, `rejected`, or other non-accepted lifecycle states.
- Non-accepted lifecycle candidates are exposed through bounded `result.claimDiagnostics[]` and detailed audit/recovery diagnostics.
- Accepted final claims may carry additive lifecycle fields such as `claimId`, `status`, `family`, `requiredSlots`, `filledSlots`, `missingSlots`, and per-claim diagnostics.
- `result.evidenceDiagnostics` may include negative/failed acquisition attempts; these are diagnostics, not claim-support refs.
- Completed-vs-clean semantics remain: `HTTP 200 + status="completed"` means a schema-valid honest envelope, not necessarily accepted claims or clean pass.

## Compatibility expectation

The change is additive and S3-owned. S2 approval wait is not required, but consumer awareness is required. S2 consumers should ignore unknown additive fields if not yet rendered and should use `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `cleanPass`, `claims[]`, `claimDiagnostics[]`, and `evidenceDiagnostics` to distinguish completed/no-accepted/inconclusive/clean states.

## Canonical pages updated

- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/specs/analysis-agent.md`
- `wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md`
- `wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md`
- `wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md`

## Related plan

- `/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md`
- `/home/kosh/AEGIS/.omx/plans/test-spec-s3-paper-remediation-complete-20260427.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
