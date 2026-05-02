---
title: "S3 Pass-A claimDiagnostics lifecycle proof fields and generate-poc accepted-only lifecycle notice"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only"
last_verified: "2026-04-28"
service_tags: ["s3", "analysis-agent", "api-contract", "claim-diagnostics", "generate-poc"]
decision_tags: ["agent-v1.1", "accepted-only-claims", "pass-a", "notify-style-contract"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only"
wr_kind: "notice"
status: "open"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-28T08:26:23.642Z"
---

# S3 Pass-A claimDiagnostics lifecycle proof fields and generate-poc accepted-only lifecycle notice

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

S3 Pass-A semantic remediation additively refines `agent-v1.1` claim diagnostics and generate-poc lifecycle behavior.

## Consumer-visible contract points

- `result.claims[]` remains accepted-only.
- `result.claimDiagnostics.nonAcceptedClaims[]` may now include bounded lifecycle proof fields: `requiredEvidence`, `presentEvidence`, `missingEvidence`, `evidenceTrail`, and `revisionHistory`.
- `outcomeContribution="rejected_unsupported"` indicates the candidate cited refs but all cited refs were invalid/missing, so the state machine reached `rejected`.
- `outcomeContribution="needs_human_review"` indicates sticky NHR remained diagnostic-only because no explicit human-acceptance path exists yet.
- `generate-poc` raw producer claims now pass through `diagnose_claim_evidence()` and `transition_claim_status()` before appearing in `result.claims[]`.
- Trusted upstream bare ref IDs are allowlisted/generic support only; they do not fabricate family-specific slots unless slot-bearing evidence is present.
- Zero accepted PoC claims still produce `HTTP 200 + status=completed` with `analysisOutcome=no_accepted_claims`/diagnostics rather than a public task-level output error.

## Approval

Notify-style contract. S3 is not waiting for approval; S2 should update consumers/fixtures if they assumed nonAccepted diagnostics had only the older minimal shape.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
