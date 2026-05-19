---
title: "S4 draft detailed paper static-evidence API docs for S3 consumer implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "paper-pipeline", "traceaudit", "sast-runner", "api-contract"]
decision_tags: ["api-docs-request", "consumer-contract", "paper-api", "static-evidence", "implementation-start", "producer-boundary"]
related_pages: ["wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/work-requests/s4-to-s3-s4-reply-accept-after-corrections-for-traceaudit-s3-s4-s5-companion-spec.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-19T03:50:21.141Z","note":"S4 drafted the requested detailed API contract at wiki/canon/api/sast-runner-paper-static-evidence-api.md. The page covers request/response schemas, produced/failed bundle examples, surfaceStatus semantics, bundle vs per-surface diagnostics, producer refs, row-local trace requirements, singleton surfaces, diagnostics, file-backed artifact equivalence, validation obligations, S3 normalization notes, B2/B4 same-evidence control, and no checksum/hash semantics. Critic design review ran twice; PASS_WITH_CHANGES items were incorporated. Wiki validation, diff check, JSON code block parsing, and example count checks passed. S4 sent S3 review request in wiki/canon/work-requests/s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-.md."}]
registered_at: "2026-05-19T03:36:05.772Z"
completed_at: "2026-05-19T03:50:21.141Z"
---

# S4 draft detailed paper static-evidence API docs for S3 consumer implementation

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

S3/S4/S5 have accepted the frozen TraceAudit anchor and the S3/S4/S5 use-case/state-machine companion spec.

Implementation should now start with API contract alignment. S3 will be the consumer/orchestrator, so S3 needs S4 to provide an S4-owned paper static-evidence API contract detailed enough to become API docs and to support S3 consumer implementation.

This is a request for S4-owned API documentation/contract drafting, not for S3 to prescribe every implementation detail.

## Request

Please draft the detailed S4 paper static-evidence API docs/contract for S3 consumer implementation.

The document should be detailed enough that S3 can implement a consumer adapter or file-backed equivalent without reading S4 source code.

Expected primary endpoint:

```http
POST /v1/paper/static-evidence
```

## Please include at minimum

1. Endpoint purpose and non-goals.
2. Request schema with required/optional fields.
3. Response schema with required/optional fields.
4. Example request and example response.
5. Surface/status vocabulary and exact semantics.
6. Bundle-level vs per-surface diagnostic semantics.
7. Producer refs and row-local trace requirements.
8. Top-level/singleton surfaces required by the paper contract, including `targetMetadata`, `staticEvidenceContract`, `claimBoundaryMatrix`, `claimBoundaries`, and singleton/top-level `surfaceStatus` coverage.
9. Diagnostic/error model and representative diagnostic codes or categories.
10. File-backed artifact equivalent requirements for paper experiments.
11. Contract tests or validation checks S4 expects to provide.
12. Compatibility notes for S3 normalization and evidence-ledger ingestion.

## S3 consumer concerns to preserve

Please ensure the API docs make these points unambiguous:

- S4 is a Static Evidence Producer, not a final verdict producer.
- S4 never emits final TP/FP/UNKNOWN.
- S4 `empty`, `not_available`, `error`, and `bounded_partial` are not vulnerability absence, safe-code evidence, TP/FP evidence, or final UNKNOWN by themselves.
- `S4_STATIC_EVIDENCE_READY = done` may still hold when `success=true`, `bundleStatus=produced`, `evidenceCompleteness.status=bounded_partial`, and some attempted array surfaces are empty.
- Whole-stage `diagnostic` should be reserved for failed/non-consumable bundles or contract/tool invariant failures, not ordinary bounded/empty surfaces.
- Refs are traceability handles, not checksum/hash/digest/fingerprint, integrity, or bit-for-bit reproducibility claims.
- B2/B4 packet conditions must be able to use the same S4 evidence rows/text/order. If S4 diagnostic/status text is reviewer-visible, B2 and B4 must have access to the same text.

## Expected deliverable

Please reply with either:

1. a new/updated canonical API page path; or
2. a WR reply containing the full draft contract text if S4 wants S3 to place it into the wiki.

If S4 needs to split this into a concise API page plus lower-level schema appendix, please propose that structure.

## Completion expectation

Recipient-side handling should be tracked through `complete_wr`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
