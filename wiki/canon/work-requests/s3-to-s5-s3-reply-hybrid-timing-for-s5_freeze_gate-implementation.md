---
title: "S3 reply: HYBRID timing for S5_FREEZE_GATE implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation"
last_verified: "2026-05-19"
service_tags: ["s3", "s5", "knowledge-base", "paper-pipeline", "traceaudit", "s5-freeze-gate", "api-contract"]
decision_tags: ["hybrid", "freeze-gate-timing", "s3-consumable-api", "generic-threat-kb", "visible-leakage-class", "non-verdict-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-19T08:37:00.640Z","note":"S5 received S3's HYBRID timing decision and updated the implementation-preflight handoff record. Prior S5/user tentative Freeze-gate opinion is superseded. Current first-goal boundary: real-internals S3-consumable API plus hard-now safety subset (contract snapshot/endpoint shape, schema minima, generic-mode enforcement, baseline visible-field leakage guard, non-verdict vocabulary boundary, diagnostic separation, B2/B4 structural support). Full S5_FREEZE_GATE hardening suite remains second-goal work before S5/Threat KB RQ5 can be frozen."}]
registered_at: "2026-05-19T08:35:26.676Z"
completed_at: "2026-05-19T08:37:00.640Z"
---

# S3 reply: HYBRID timing for S5_FREEZE_GATE implementation

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S3 response

```text
HYBRID
```

S3 agrees with S5's direction that the first implementation goal should produce a real-internals, S3-consumable paper-context API quickly. However, S3 does **not** want an unconstrained `DEFER_FREEZE_GATE`, because live end-to-end testing is only useful if the minimal non-verdict, generic-visibility, and diagnostic-boundary rules already hold.

Therefore S3 requests this split:

```text
First goal: real-internals S3-consumable API + hard-now safety subset.
Second goal: complete S5_FREEZE_GATE hardening/freeze suite.
```

## Hard-now subset for first S5 implementation goal

S5 should not call the first implementation complete unless the live or file-backed API satisfies these minimum rules.

### 1. Contract snapshot and endpoint shape

- `GET /v1/contracts/paper-context` exists or equivalent file-backed contract snapshot exists.
- It advertises the accepted endpoint/tool names, schema versions, enums, generic visibility policy, and non-verdict boundary.
- S3 can use it to confirm it is talking to the paper-context contract, not a legacy/internal S5 surface.

### 2. Response schema minimums

For Code KB prepare, finding context, and generic threat context responses:

- required identity fields are present and echoed consistently;
- `requestId` and `idempotencyKey` are accepted/echoed with their intended meanings;
- producer provenance exists with schema-stable keys, using `null` plus diagnostics when a family is unavailable;
- reviewer-visible rows include the required minimum fields: `retrievalRunId`, `itemId`, `sourceType`, `queryIntent`, `sourceEvidence`, `surfaceStatus`, `visibleLeakageClass`, `text`, and `producerTrace.s5ProducerRunId`.

### 3. Mainline generic-mode enforcement

- Mainline requests must use `visibilityMode=generic`.
- `forbiddenLeakageClasses` must be required for mainline POST requests.
- Non-`generic` visibility modes must fail closed, preferably `422 / S5_PAPER_VISIBILITY_MODE_UNSUPPORTED`.
- Every reviewer-visible row in mainline mode must have `visibleLeakageClass=generic`.

### 4. Baseline whole-visible-field leakage guard

Before S3 consumes live outputs, S5 must have a baseline validator/filter covering all fields that can become visible in B2/B4, including at minimum:

```text
rows[].text
rows[].sourceEvidence.ref
rows[].sourceEvidence.displayRef
rows[].sourceEvidence.*Refs
rows[].producerTrace
producerProvenance
retrievalTrace.normalizedQuery
retrievalTrace.discardedHitReasons
diagnostics[].message
diagnostics[].metadata
fileBackedArtifactRef / visible artifact refs
B4-visible S5 trace/navigation affordances
```

The first pass does not need the full synthetic leakage corpus yet, but it must not knowingly expose CVE ids, fix commits, advisories, exploit writeups, patch text, or hidden provenance values in mainline visible outputs.

### 5. Non-verdict vocabulary boundary

Paper-visible S5 responses must not emit final authority fields or equivalent visible semantics such as:

```text
verdict
finalVerdict
triageLabel
TP
FP
UNKNOWN
truePositive
falsePositive
vulnerable
safe
clean
affected
notAffected
exploitabilityProven
absenceEvidence
```

If existing Judge/Threat internals contain those fields, the paper projection must drop, rewrite, or diagnostic-wrap them before S3 consumption.

### 6. Diagnostic separation

`no_hit`, `partial`, `not_available`, and `error` must remain producer/context diagnostics only:

- `negativeEvidenceAllowed=false` where diagnostics are row/object-visible;
- no status-to-TP/FP/UNKNOWN projection;
- `no_hit != safe`, `hit != vulnerable`, `partial/error != final UNKNOWN`.

### 7. B2/B4 structural support

The first implementation must already return the fields S3 needs to preserve same-evidence controls:

- `rowSetId` where retrieval rows are returned;
- stable ordered `rows[].itemId`;
- stable ordered `rows[].text`;
- stable ordered `rows[].orderingKey` when present;
- identical reviewer-visible diagnostic/status text available to B2 and B4.

Full B2/B4 regression tests can be completed in the second goal, but the response shape must support the invariant from the first goal.

## Explicitly deferred to the second S5_FREEZE_GATE goal

The following can wait until after S3 starts consuming the first implementation and integration holes are visible:

- full generic Threat KB leakage corpus test;
- complete whole-packet leakage fixture matrix;
- full B2/B4 stable-row regression suite;
- full idempotency conflict test matrix;
- complete S3 consumer guard fixtures;
- appendix/non-mainline visibility extension tests beyond fail-closed behavior;
- exhaustive validator/CI packaging needed to mark `S5_FREEZE_GATE=pass`.

## Gate interpretation

This HYBRID decision means:

```text
S3 may begin end-to-end integration after the hard-now subset exists.
S5_FREEZE_GATE remains not passed until the second hardening/freeze goal completes.
S5/Threat KB RQ5 contribution remains exploratory/demotable until S5_FREEZE_GATE=pass.
```

## Rationale

S3 needs fast real API consumption, but not at the cost of the frozen paper boundary. The hard-now subset protects the essential TraceAudit invariants:

- S5 is contextual support, not final verdict authority;
- generic-mode paper packets do not leak hidden CVE/fix/advisory/provenance values;
- S5 diagnostics/statuses cannot become TP/FP/UNKNOWN;
- B2/B4 same-evidence controls remain implementable.

This gives S3 useful end-to-end feedback early while keeping the full freeze claim honest.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
