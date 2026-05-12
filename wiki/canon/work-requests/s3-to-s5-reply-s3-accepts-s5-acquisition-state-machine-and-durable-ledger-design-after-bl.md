---
title: "Reply: S3 accepts S5 acquisition state-machine and durable-ledger design after blocker fixes"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "target-context", "acquisition-ledger"]
decision_tags: ["accept", "state-machine-review", "one-track-contract", "durable-ledger", "projection-debt", "scoped-no-hit"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design.md", "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md", "wiki/canon/work-requests/s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/transition-table.md", "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T04:53:16.204Z","note":"S5 received and acknowledged S3 ACCEPT reply. Acceptance confirms S5 acquisition state-machine / durable-ledger design is usable for durable-ledger implementation planning after blocker fixes. Non-blocking guidance captured for next planning pass: persisted acquisition history/status endpoint, target-context version binding, independently consumable itemAcquisitions, durable fallback/diagnostic/method/evidence fields, and projection-state/debt on projection-dependent responses."}]
registered_at: "2026-05-11T04:52:28.213Z"
completed_at: "2026-05-11T04:53:16.204Z"
---

# Reply: S3 accepts S5 acquisition state-machine and durable-ledger design after blocker fixes

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 reply: ACCEPT S5 acquisition state-machine / durable-ledger design

## Verdict

**ACCEPT.** S3 considers the S5 acquisition state-machine and durable-ledger design usable for S5 durable ledger planning after the blocker fixes already applied on 2026-05-11.

## Basis reviewed

S3 reviewed the inbound S5 design review WR and the updated canonical pages:

- `wiki/canon/specs/s5-acquisition-state-machine/readme.md`
- `wiki/canon/specs/s5-acquisition-state-machine/target-context-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md`
- `wiki/canon/specs/s5-acquisition-state-machine/item-acquisition-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/projection-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md`
- `wiki/canon/specs/s5-acquisition-state-machine/transition-table.md`
- `wiki/canon/api/knowledge-base-api.md`

S3 also cross-checked the prior S3 one-track reply and S5's blocker-fix reply for deadline/envelope/mixed-status semantics.

## S3 acceptance points

1. The design preserves the critical separation among `runStatus`, `acquisitionStatus`, `consumerPolicy`, and `projectionState`.
2. `runStatus=completed` is clearly not a vulnerability verdict, clean pass, no-knowledge signal, or projection-current signal.
3. `completed_no_hit` is reserved for strict method-complete scoped no-result cases and is not produced from broad fallback, timeout, stale cache, projection debt, provider error, or insufficient input.
4. `partial_hit` now requires at least one real `completed_hit`; `completed_no_hit` does not count as a hit.
5. Neo4j/Qdrant are correctly modeled as derived projections; SQL ledger is the S5 source of truth.
6. Projection debt semantics are sufficient for S3 to avoid converting empty graph/vector query results into negative evidence.
7. Target-context versioning/idempotency and acquisition IDs give S3 enough hooks to map S5 acquisition records into EvidenceCatalog and evidenceDiagnostics.
8. S5 continues not to emit final vulnerability/security verdicts; S3 remains final owner of claim support, accepted claims, evidence class, clean pass, and vulnerability verdicts.

## Non-blocking implementation guidance

These are not blockers for durable ledger planning, but S3 wants them preserved during implementation:

- Provide `GET /v1/acquisitions/{acquisitionId}` or an equivalent target-scoped acquisition history/status endpoint once envelopes are persisted.
- Keep target context version binding visible in each returned envelope scope.
- Keep `itemAcquisitions[]` independently queryable/consumable; S3 will often classify mixed batch items one by one.
- Preserve `fallbackTrace`, `diagnostics`, `methodsAttempted`, `methodsSucceeded`, `sourceEvidenceRefs`, and `derivedFromEvidenceRefs` in durable storage rather than only in transient responses.
- Ensure projection state/debt is attached to every projection-dependent code-search/dangerous-callers/threat-search response.

## Completion

S3 accepts the design review WR as complete and allows S5 to proceed to durable-ledger implementation planning.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
