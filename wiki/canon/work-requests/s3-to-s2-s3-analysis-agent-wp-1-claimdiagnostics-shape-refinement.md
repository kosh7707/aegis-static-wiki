---
title: "S3 Analysis Agent WP-1 claimDiagnostics shape refinement"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement"
last_verified: "2026-04-27"
service_tags: ["s3", "s2", "analysis-agent", "api-contract"]
decision_tags: ["wp-1", "claim-diagnostics", "contract-notice"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-27T09:45:23.395Z","note":"S2 modeled WP-1 claimDiagnostics object shape as AgentClaimDiagnosticsSummary with lifecycleCounts/nonAcceptedClaims and persists/returns it through analysis results."}]
registered_at: "2026-04-27T07:24:29.263Z"
completed_at: "2026-04-27T09:45:23.395Z"
---

# S3 Analysis Agent WP-1 claimDiagnostics shape refinement

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S3→S2 notice: WP-1 claimDiagnostics exact shape refinement

Follow-up to `wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice.md`.

During WP-1 implementation, S3 fixed the exact additive `result.claimDiagnostics` shape as an object rather than a top-level array:

```json
{
  "claimDiagnostics": {
    "lifecycleCounts": { "under_evidenced": 1 },
    "nonAcceptedClaims": [
      {
        "claimId": "claim-0",
        "status": "under_evidenced",
        "family": "command_injection",
        "primaryLocation": "src/main.c:42",
        "missingEvidence": ["local_or_derived_support"],
        "invalidRefs": [],
        "supportingEvidenceRefs": ["eref-knowledge-CWE-78"],
        "outcomeContribution": "no_accepted_claims"
      }
    ]
  }
}
```

`result.claims[]` remains accepted-final-only. Accepted final claims expose legacy fields plus additive fields: `claimId`, `status`, `requiredEvidence`, `presentEvidence`, `missingEvidence`, `evidenceTrail`, `queryHistory`, `revisionHistory`.

S2 approval wait is not required; this notice is for consumer awareness. Unknown additive fields should be ignored until S2 renders them.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
