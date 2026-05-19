---
title: "S5 draft detailed paper context API docs for S3 consumer implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation"
last_verified: "2026-05-19"
service_tags: ["s3", "s5", "paper-pipeline", "traceaudit", "knowledge-base", "code-kb", "source-code-kg", "threat-kb", "api-contract"]
decision_tags: ["api-docs-request", "consumer-contract", "paper-api", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "implementation-start", "producer-boundary"]
related_pages: ["wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md", "wiki/canon/work-requests/s5-to-s3-s5-second-reply-accept-after-s4-corrections-for-traceaudit-companion-spec.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-19T03:56:28.310Z","note":"S5 completed the requested detailed paper-facing API contract draft and published it at wiki/canon/api/s5-paper-context-api.md. Critic returned PASS_WITH_CHANGES; all must-fix issues were incorporated (whole-visible-field leakage validation, requestId/idempotency semantics, appendix mode fail-closed, canonical schema locations/nullability, rowSetId-based B2/B4 validation). S5 sent S3 a review request WR: wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-paper-context-api-contract-draft-for-traceaudit-consumer-.md. S5_FREEZE_GATE remains not passed until implementation/file-backed equivalent and tests land."}]
registered_at: "2026-05-19T03:36:05.910Z"
completed_at: "2026-05-19T03:56:28.310Z"
---

# S5 draft detailed paper context API docs for S3 consumer implementation

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

S3/S4/S5 have accepted the frozen TraceAudit anchor and the S3/S4/S5 use-case/state-machine companion spec.

Implementation should now start with API contract alignment. S3 will be the consumer/orchestrator, so S3 needs S5 to provide an S5-owned paper context API contract detailed enough to become API docs and to support S3 consumer implementation.

This is a request for S5-owned API documentation/contract drafting, not for S3 to prescribe every implementation detail.

## Request

Please draft the detailed S5 paper context API docs/contract for S3 consumer implementation.

The document should be detailed enough that S3 can implement a consumer adapter or file-backed equivalent without reading S5 source code.

Expected paper-facing surface, based on prior S5 acceptance:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

If S5 wants different final names, please propose them and explain why while preserving the same semantics.

## Please include at minimum

1. Endpoint/tool purpose and non-goals.
2. Request schema with required/optional fields for each endpoint/tool.
3. Response schema with required/optional fields for each endpoint/tool.
4. Example request and example response for each endpoint/tool.
5. Status/error semantics, including `produced`, `no_hit`, `partial`, `not_available`, and `error`.
6. Idempotency/retry expectations, including `requestId` and `idempotencyKey` behavior.
7. Minimum paper-visible S5 evidence row schema.
8. `visibleLeakageClass` behavior and allowed values.
9. Generic Threat KB mode behavior and forbidden leakage classes.
10. Producer provenance/version fields: Code KB, Source KG, Threat KB corpus/index, retrieval policy, run IDs.
11. B2/B4 same-evidence-row/text/order support, including diagnostics/status text when visible.
12. Forbidden-inference / non-verdict language rules.
13. Contract tests or validation checks S5 expects to provide for S5_FREEZE_GATE.
14. Compatibility notes for S3 normalization and evidence-ledger ingestion.

## S3 consumer concerns to preserve

Please ensure the API docs make these points unambiguous:

- S5 is a contextual evidence/retrieval producer, not a final verdict producer.
- S5 never emits final TP/FP/UNKNOWN or paper-visible safe/vulnerable authority.
- S5 hit is not vulnerable; S5 `no_hit` is not safe; S5 `partial`, `not_available`, and `error` are producer diagnostics, not TP/FP evidence.
- Mainline `retrieve_generic_threat_context` must be generic Threat KB mode only.
- CVE IDs, advisories, fix commits, exploit writeups, and patch text are forbidden in mainline reviewer-visible output unless S3 explicitly registers an appendix condition.
- Every paper-visible S5 row must carry `visibleLeakageClass`.
- S5 diagnostics must not echo forbidden leakage values.
- B2 and B4 must be renderable from the same S5 evidence rows/text/order. B4 may add ledger refs, producer traces, claim links, and navigation; B2 hides those affordances.
- S4-derived context is consumed only when S3 explicitly sends it; no S4->S5 side channel.
- S5_FREEZE_GATE remains unmet until implementation and tests prove the contract.

## Expected deliverable

Please reply with either:

1. a new/updated canonical API page path; or
2. a WR reply containing the full draft contract text if S5 wants S3 to place it into the wiki.

If S5 needs to split this into a concise API page plus lower-level schema appendix, please propose that structure.

## Completion expectation

Recipient-side handling should be tracked through `complete_wr`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
