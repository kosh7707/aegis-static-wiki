---
title: "S3 consume S5 Source KG partial-quality gate in paper context flow"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "paper-pipeline", "source-code-kg", "code-kb", "api-contract"]
decision_tags: ["paper-api", "consumer-contract", "source-kg-quality", "additive-contract-update"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md", "wiki/canon/work-requests/s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T10:07:06.732Z","note":"Implemented S3 consumer handling for S5 selectable partial Source KG quality caveats. S3 now accepts partial+ready+contextSelectable only when readiness.sourceKgQualityGate=accepted_with_caveats, preserves readiness/diagnostic caveats in s5-code-kb.normalized.json, and keeps diagnostics as producer caveats. Verification: services/analysis-agent pytest test_paper_path.py test_generation_policy.py -> 78 passed; compileall/diff-check PASS. Critic review PASS."}]
registered_at: "2026-05-20T09:58:15.129Z"
completed_at: "2026-05-20T10:07:06.732Z"
---

# S3 consume S5 Source KG partial-quality gate in paper context flow

## Summary
- Kind: request
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request

Please update S3 paper-context consumption to recognize S5's additive Source KG quality caveat fields.

## Background

S5 audited the live certmaker Source KG bundle and found it was structurally/selectably ingested but weak-quality as a Code KG: smoke/manual harness provenance, low-confidence/manual graph edges, 0 rich IR artifacts, and incomplete graph coverage compared with the source.

S5 therefore no longer over-claims weak selectable Source KG bundles as clean `surfaceStatus=produced` readiness.

## Contract fields S3 should consume

`GET /v1/contracts/paper-context` now advertises:

```text
policies.sourceKgQualityGatePolicy = selectable_context_may_be_partial_with_caveats
policies.sourceKgQualityDiagnostics
policies.sourceKgPartialReadiness.surfaceStatus = partial
policies.sourceKgPartialReadiness.stageReadiness = ready
policies.sourceKgPartialReadiness.sourceKgQualityGate = accepted_with_caveats
policies.sourceKgPartialReadiness.negativeEvidenceAllowed = false
```

`POST /v1/paper/code-kb/prepare` may return:

```json
{
  "surfaceStatus": "partial",
  "stageReadiness": "ready",
  "readiness": {
    "codeKbReady": true,
    "sourceKgReady": true,
    "contextSelectable": true,
    "sourceKgQualityGate": "accepted_with_caveats"
  },
  "diagnostics": [
    {"code": "S5_PAPER_SOURCE_KG_SMOKE_HARNESS_PROVENANCE"},
    {"code": "S5_PAPER_SOURCE_KG_LOW_CONFIDENCE_EDGES"},
    {"code": "S5_PAPER_SOURCE_KG_RICH_IR_NOT_AVAILABLE"}
  ]
}
```

## Requested S3 behavior

1. If `stageReadiness=ready` and `readiness.contextSelectable=true`, continue to consume `codeKbRef` and `sourceKgRef` even when `surfaceStatus=partial`.
2. If `readiness.sourceKgQualityGate=accepted_with_caveats`, preserve the diagnostics in S3 packet/trace metadata.
3. Do not render such Source KG as complete/high-confidence graph coverage.
4. Keep treating all S5 diagnostics as contextual producer caveats, not final security evidence or negative evidence.
5. Prefer discovering the policy from `GET /v1/contracts/paper-context` rather than hard-coding prose-only assumptions.

## Compatibility note

This is additive under `s5-paper-context-api-v1`: endpoint paths, request schemas, response schema versions, and enum vocabulary are unchanged. The consumer-visible semantic change is that weak but selectable Source KG can be `partial + ready + accepted_with_caveats` instead of clean `produced`.

## S5 verification evidence

- TDD RED then GREEN for weak smoke/manual Source KG partial quality behavior.
- Machine-readable contract test updated for the new policy fields.
- Relevant S5 suite passed: paper-context API/observability/freeze-gate plus Source KG suites, `143 passed`.
- Live S5 `/v1/contracts/paper-context` exposes the new policy fields.
- Critic final review: PASS, no blockers; S3 discovery judged sufficient.

## Acceptance suggestion

S3 can close this WR when its paper-context consumer either:

- explicitly handles `readiness.sourceKgQualityGate=accepted_with_caveats`, or
- records a conscious decision that current smoke flow already preserves S5 diagnostics without representing partial Source KG as complete graph coverage.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
