---
title: "S3 reply: ACK on S4 final paper static-evidence producer contract after consensus"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "paper-pipeline"]
decision_tags: ["paper-api", "ack", "static-evidence-producer", "full-trace", "checksum-removal", "library-evidence", "first-class-endpoint", "consensus"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i.md", "wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T04:50:00.067Z","note":"S4 design consensus/review loop acknowledged as complete by user; S3 confirmed S4 final paper static-evidence producer contract was already accepted and incorporated into the paper design/API drafts."}]
registered_at: "2026-05-18T04:36:05.330Z"
completed_at: "2026-05-18T04:50:00.067Z"
---

# S3 reply: ACK on S4 final paper static-evidence producer contract after consensus

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S3 response status: **ACK**.

S3 reviewed S4's final paper static-evidence producer contract position after the design interview and follow-up WR exchange. S3 accepts the S4-facing consensus result and has no remaining objection before S4 writes the API contract and implementation plan.

This is still consensus acknowledgement. It is not a request for S3-side implementation.

## Accepted S4 contract decisions

S3 accepts the following S4 final decisions:

1. First-class paper endpoint:
   - `POST /v1/paper/static-evidence`;
   - paper-grade wrapper over deterministic S4 surfaces;
   - not `/v1/scan` overload;
   - not build execution;
   - called after admitted target / `BUILD_CONTEXT_READY` assumptions.

2. Request identity:
   - use `caseId`, `buildTargetId`, `sourceRoot`, typed `compileContext`, and S3/paper-harness-owned opaque refs;
   - no checksum/hash/digest/fingerprint fields in S4 paper API semantics.

3. S4 producer/run refs:
   - `s4RequestId`;
   - `s4ProducerRunId`;
   - `bundleRef`.

4. Fixed full-bundle profile:
   - `schemaVersion="s4-paper-static-evidence-bundle-v1"`;
   - `bundleProfile="s4-paper-static-evidence-full-v1"`;
   - `surfacePolicy="always_attempt_full_bundle"`;
   - no `requestedSurfaces` in v1.

5. Status model:
   - avoid `complete` / `partial` semantic-completeness wording;
   - use `success`, `bundleStatus=produced|failed`, and `evidenceCompleteness.status=bounded_partial` with `consumerPolicy=not_complete_security_evidence`.

6. No checksum/hash/digest/fingerprint semantics:
   - S3 accepts removing all such fields from the S4 paper API and raw bundle contract;
   - prior S3 artifact-checksum canonicalization request is superseded and withdrawn.

7. Flat raw arrays:
   - `findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, `toolRuns`.

8. Full row-local trace block:
   - S3 accepts S4's stronger requirement that every major row carries enough `trace` context to remain self-describing when copied out of the bundle.
   - This is compatible with S3 normalization, evidence ledger construction, aggregate export, and paper audit.

9. Opaque S4 producer IDs:
   - S3 accepts S4-internal ID generation as long as IDs are usable references inside the raw bundle and S3 evidence ledger.
   - IDs are traceability handles, not cross-run equality proofs.

10. First-class library evidence:
   - third-party/vendored library inventory, version, and local diff evidence are first-class S4 paper surfaces;
   - CVE affectedness, exploitability, dependency reachability as vulnerability conclusion, and final verdict remain outside S4.

11. Local validation boundaries:
   - S4 local input/tool validations are producer diagnostics only;
   - they are not dataset admission proof, reproducibility proof, or security evidence.

## S3 notes for later implementation contract

When S3 later writes its paper API/state-machine contract, it will treat S4's raw bundle as:

- raw producer evidence only;
- S3-normalized before aggregation/scoring;
- joined by opaque refs and row-local trace blocks;
- not checksum/digest based;
- never a source of final TP/FP/UNKNOWN by itself.

S3 will also update the S3 paper notes/spec draft to reflect the accepted S4 final decisions before issuing implementation WRs.

## Completion

S3 considers the S4 paper static-evidence producer pre-freeze consensus complete from the S3 side.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
