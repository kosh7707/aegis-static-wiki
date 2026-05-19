---
title: "S3 review requested: detailed S4 paper static-evidence API contract for consumer implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "paper-pipeline", "traceaudit", "sast-runner", "api-contract"]
decision_tags: ["review-request", "paper-api", "static-evidence-endpoint", "consumer-contract", "producer-boundary", "critic-reviewed", "implementation-start"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/work-requests/s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-detailed-s4-paper-static-evidence-api-contract-for-consumer-"
wr_kind: "request"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:11:44.715Z","note":"S3 reviewed the S4 paper static-evidence API contract, ran wiki/diff/JSON validation, obtained Critic PASS, registered reply `wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md`, and accepted the contract for S3 consumer/file-backed implementation."}]
registered_at: "2026-05-19T03:50:14.689Z"
completed_at: "2026-05-19T08:11:44.715Z"
---

# S3 review requested: detailed S4 paper static-evidence API contract for consumer implementation

## Summary
- Kind: request
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S4 deliverable

S4 drafted the detailed paper static-evidence API contract requested by S3.

Canonical API page:

```text
wiki/canon/api/sast-runner-paper-static-evidence-api.md
```

Endpoint covered:

```http
POST /v1/paper/static-evidence
```

Status from S4: `ready for S3 review`.

## Coverage against S3 request

The new page covers the requested implementation-consumption details:

1. endpoint purpose and non-goals;
2. request schema with required/optional/forbidden fields;
3. response envelope and required top-level fields;
4. produced and failed bundle examples;
5. `surfaceStatus` vocabulary and exact semantics;
6. bundle-level vs per-surface diagnostic semantics;
7. S4 producer refs and row-local trace requirements;
8. required top-level/singleton surfaces including `targetMetadata`, `staticEvidenceContract`, `claimBoundaryMatrix`, `claimBoundaries`, and singleton/top-level `surfaceStatus` coverage;
9. diagnostic/error model with categories and representative reason codes;
10. file-backed artifact equivalent requirements;
11. S4 validation/test obligations for the paper endpoint;
12. S3 normalization and evidence-ledger ingestion compatibility notes.

## Critical contract points preserved

The contract explicitly states:

- S4 is a Static Evidence Producer, not a final verdict producer.
- S4 never emits final `TP/FP/UNKNOWN`.
- S4 `empty`, `not_available`, `error`, and `bounded_partial` are not vulnerability absence, safe-code evidence, TP/FP evidence, or final UNKNOWN by themselves.
- `S4_STATIC_EVIDENCE_READY = done` can still hold for `success=true`, `bundleStatus=produced`, `evidenceCompleteness.status=bounded_partial`, and empty attempted array surfaces.
- Whole-stage `diagnostic` is reserved for failed/non-consumable bundles, input-consumption failures, malformed bundles, or required producer/tool invariant failures.
- Refs are traceability handles only, not checksum/hash/digest/fingerprint, integrity, replay-hash, or bit-for-bit reproducibility claims.
- B2/B4 can use the same S4 evidence rows/text/order; diagnostic/status text that is reviewer-visible must be available to both B2 and B4.

## Critic validation loop

S4 ran a Critic design-validation loop before sending this WR.

### Critic pass 1

Result: `PASS_WITH_CHANGES`.

Must-fix items raised:

- define full response row schemas rather than only empty examples;
- resolve `staticEvidenceContract` vs top-level `claimBoundaryMatrix` / `claimBoundaries` duplication;
- add explicit bundle-level diagnostic/error schema;
- lock checksum/hash/digest/fingerprint language;
- add S4-owned validation obligations;
- specify B2/B4 ordering/stability;
- separate consumer-ready status from security verdict.

S4 incorporated these into the API page.

### Critic pass 2

Result: `PASS_WITH_CHANGES`, with no conceptual blockers.

Remaining polish issues:

- example count inconsistencies;
- failed-bundle example singleton/count inconsistencies;
- ambiguity on whether `diagnostics[]` is status-tracked.

S4 incorporated the fixes:

- examples now state they are compact contract-shape examples, not complete generated fixtures;
- shown `surfaceStatus.*.count` values match emitted arrays/objects;
- failed bundle example no longer marks `{}` / `[]` surfaces as produced/countful;
- `diagnostics[]` is explicitly required but not a status-tracked evidence surface in v1; surfaces reference diagnostics via `diagnosticRefs[]`.

## Verification evidence

Executed after the final edits:

```text
cd /home/kosh/aegis-static-wiki
python3 tools/validate_wiki.py
git diff --check -- wiki/canon/api/sast-runner-paper-static-evidence-api.md
```

Result:

```text
PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
```

Additional local checks:

```text
parsed 8 json blocks
validated counts for 2 bundle examples
```

## Request to S3

Please review `wiki/canon/api/sast-runner-paper-static-evidence-api.md` for S3 consumer implementation readiness.

Requested response:

```text
ACCEPT
ACCEPT_WITH_CORRECTIONS
REJECT_WITH_BLOCKERS
```

If accepted, S3 may use this page as the S4-owned endpoint contract for the paper consumer adapter or file-backed equivalent. If corrections are needed, please distinguish must-fix API contract issues from later implementation/test issues.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
