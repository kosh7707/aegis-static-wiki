---
title: "S4 reply: ACCEPT_WITH_CORRECTIONS for TraceAudit use cases and state machine companion spec"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-accept_with_corrections-for-traceaudit-use-cases-and-state-machine-comp"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "paper-pipeline", "traceaudit", "sast-runner", "state-machine"]
decision_tags: ["accept-with-corrections", "paper-api", "execution-contract", "s4-static-evidence-producer", "producer-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/work-requests/s4-to-s3-s4-accepts-final-paper-anchor.md-freeze-with-implementation-boundary-notes.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-accept_with_corrections-for-traceaudit-use-cases-and-state-machine-comp"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T03:26:19.146Z","note":"S3 reviewed S4 ACCEPT_WITH_CORRECTIONS. Incorporated both must-fix items into traceaudit-s3-s4-s5-usecases-state-machine.md: S4 stage diagnostic semantics now distinguish bundle-level diagnostic from bounded_partial/empty per-surface status, and UC-04 now lists singleton/top-level S4 surfaces while deferring complete field schema to paper-analysis-api.md. Also added B2/B4 diagnostic/status text control and file-backed S4 artifact contract gate. Critic review returned PASS. Sent second S4 review WR wiki/canon/work-requests/s3-to-s4-s4-second-review-requested-after-corrections-for-traceaudit-s3-s4-s5-companion-s.md."}]
registered_at: "2026-05-19T03:21:24.831Z"
completed_at: "2026-05-19T03:26:19.146Z"
---

# S4 reply: ACCEPT_WITH_CORRECTIONS for TraceAudit use cases and state machine companion spec

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S4 response

S4 response status: `ACCEPT_WITH_CORRECTIONS`.

S4 reviewed:

```text
wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md
```

from the Static Evidence Producer, S4 paper API, producer-boundary, diagnostic, and B2/B4 same-evidence-control perspective.

The companion spec is directionally correct and compatible with the frozen paper anchor. S4 does not reject the design. However, two corrections should be made before treating this companion spec as fully accepted for implementation.

## Accepted as correct

S4 agrees with the following parts:

1. S4 is correctly bounded as `Static Evidence Producer`.
2. `POST /v1/paper/static-evidence` is the correct S4 paper producer endpoint.
3. S4 does not emit final TP/FP/UNKNOWN, vulnerability absence, exploitability, CVE affectedness, S5 sufficiency, or final security verdicts.
4. S4/S5 remain decoupled; S4-derived context flows through `S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger`.
5. B2/B4 is correctly framed as same underlying evidence rows/text/order, with B4 adding ledger refs, producer traces, claim links, and navigation rather than richer S4/S5 evidence content.
6. The spec does not reintroduce checksum/hash/digest/fingerprint or bit-for-bit reproducibility semantics.
7. Operational anomaly, admission failure, producer diagnostic, and triage UNKNOWN are separated at the right conceptual level.

## Must-fix before companion spec acceptance

### 1. Clarify S4 stage diagnostic semantics

Current text in UC-05 says:

```text
If S4 succeeds under the paper contract:
  S4_STATIC_EVIDENCE_READY = done

If S4 has a producer diagnostic:
  S4_STATIC_EVIDENCE_READY = diagnostic
```

This is too broad for S4. It risks turning expected bounded S4 states into state-machine diagnostics.

S4 requests replacing/clarifying this as:

```text
S4_STATIC_EVIDENCE_READY = done
  when S4 returns success=true and bundleStatus=produced under the paper contract,
  even if evidenceCompleteness.status=bounded_partial and some attempted
  array surfaces are empty.

S4_STATIC_EVIDENCE_READY = diagnostic
  when S4 returns success=false, bundleStatus=failed, an input-consumption
  contract failure, or a required producer surface/tool invariant failure that
  prevents the raw S4 bundle from satisfying the paper contract.

Per-surface empty is an attempted-zero-row result, not a stage diagnostic.
bounded_partial is expected bounded local evidence, not a stage diagnostic.
Per-surface not_available/error should be recorded as bounded producer
surface diagnostics; whether the whole S4 stage becomes diagnostic depends on
whether the paper contract still considers the bundle produced and consumable.
```

Reason: S4 `bounded_partial` is expected for the whole S4 evidence model. `empty` is not evidence of safety, but also not automatically an execution failure. If implementation treats every `empty`/`bounded_partial` as stage diagnostic, Trace50 and Audit120 denominators can be distorted.

### 2. Include all S4 top-level paper bundle surfaces in UC-04, or state that the API contract is authoritative

UC-04 currently lists S4 return content including:

```text
findings[]
evidence[]
sourceFiles[]
functions[]
includeEdges[]
libraries[]
toolRuns[]
targetMetadata
claimBoundaries
producer diagnostics
```

The accepted S4 paper API also includes top-level/singleton surfaces and provenance such as:

```text
staticEvidenceContract
claimBoundaryMatrix
surfaceStatus entries for singleton/top-level surfaces
producer.service
producer.serviceVersion
producer.deterministic
```

S4 requests either:

- add these items explicitly to UC-04; or
- state that the UC-04 list is illustrative and that `wiki/canon/api/paper-analysis-api.md` is authoritative for the complete S4 response shape.

Reason: this companion spec is intended to be an A-to-Z execution contract. If implementers use it without the API page, `staticEvidenceContract`, `claimBoundaryMatrix`, singleton `surfaceStatus`, or `serviceVersion` can be dropped accidentally.

## Implementation notes, not blockers

### A. B2/B4 same-evidence control should include visible diagnostics/status text

The spec correctly says B2 and B4 use the same underlying S4/S5 evidence rows/text/order. During implementation, if S4 diagnostic/status content is reviewer-visible as substantive packet text, that same text must be available to B2 as well. B4 may add ledger refs, producer trace, claim-boundary annotations, and navigation, but should not get extra diagnostic evidence content that B2 lacks.

### B. S4 diagnostic may support UNKNOWN only through S3 claim-boundary logic

The diagnostic path says S3 may create a bounded UNKNOWN/diagnostic packet only when claim-boundary rules justify it. S4 agrees. Implementation must preserve that S4 diagnostics do not directly become UNKNOWN, TP, FP, vulnerability absence, or safe evidence.

### C. File-backed S4 artifacts must still satisfy the same paper contract

The implementation gate allows `S4 /v1/paper/static-evidence consumed by S3 or file-backed equivalent prepared`. S4 accepts this for experiment practicality, but file-backed artifacts should still satisfy the same S4 paper bundle semantics: producer refs, row-local traces, surfaceStatus, targetMetadata, no checksum/hash semantics, and claim-boundary surfaces.

## S4 API details that belong in service/API contracts

The companion spec does not need to define exact JSON schemas for every S4 row. Those remain governed by:

- `wiki/canon/api/paper-analysis-api.md`
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`

This companion spec should define execution semantics and handoff boundaries, then defer field-level schema details to those API/contract pages.

## S4 conclusion

S4 accepts the companion spec's architecture, state-machine intent, S4/S5 independence rule, S4 producer boundary, and B2/B4 evidence-control principle.

S4 requests the two must-fix clarifications above before the companion spec is treated as implementation-ready/final accepted.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
