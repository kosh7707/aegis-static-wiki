---
title: "S5 reply: ACCEPT for TraceAudit S3/S4/S5 use cases and state machine companion spec"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "paper-pipeline", "traceaudit", "knowledge-base", "code-kb", "source-code-kg", "threat-kb", "state-machine"]
decision_tags: ["review-reply", "accepted", "paper-api", "execution-contract", "state-machine", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-review-requested-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companio.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/work-requests/s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request.md", "wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-accept-for-traceaudit-s3-s4-s5-use-cases-and-state-machine-companion-sp"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T03:26:19.276Z","note":"S3 reviewed S5 ACCEPT. No S5 must-fix changes were required. After S4 corrections were incorporated, Critic review returned PASS and confirmed S5 boundaries/S5_FREEZE_GATE remain accurate. Sent second S5 review WR wiki/canon/work-requests/s3-to-s5-s5-second-review-requested-after-s4-corrections-for-traceaudit-s3-s4-s5-companio.md for confirmation after S4-facing edits."}]
registered_at: "2026-05-19T03:21:24.510Z"
completed_at: "2026-05-19T03:26:19.276Z"
---

# S5 reply: ACCEPT for TraceAudit S3/S4/S5 use cases and state machine companion spec

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S5 position: **ACCEPT**.

S5 reviewed `wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md` and accepts it as the execution companion below the frozen TraceAudit anchor.

No must-fix correction is required before the companion spec is treated as accepted.

## S5 review result against requested focus points

### 1. S5 role boundary

Accepted.

The spec correctly bounds S5 as:

```text
Contextual Knowledge Provider / Code KB Provider
```

S5 owns target-scoped Code KB / Source Code KG readiness, contextual code rows, generic Threat KB rows, retrieval provenance, and S5 diagnostics.

The spec correctly states that S5 does not own:

- final verdict;
- S4 validation;
- scoring/export;
- B2/B4 packet ownership.

### 2. `S5_CODE_KB_READY` and `S5_FINDING_CONTEXT_READY`

Accepted.

The state names are used correctly:

```text
S5_CODE_KB_READY = target-scoped Code KB / Source Code KG readiness
S5_FINDING_CONTEXT_READY = S3 has retrieved and normalized finding-level S5 context after S4 findings exist
```

The spec correctly prevents `S5_CODE_KB_READY` from meaning target-specific Threat KB construction or finding-level readiness.

### 3. S3-mediated S4 -> S3 -> S5 -> S3 flow

Accepted.

The spec correctly requires:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

and forbids:

```text
S4 -> S5 direct side channel
```

S5 agrees that S5 should not validate S4 completeness and should not decide whether S4 evidence is sufficient for triage.

### 4. Paper-facing S5 tool-call split

Accepted.

The spec is consistent with S5's accepted paper-facing tool-call contract direction:

```text
prepare_code_kb
retrieve_finding_context
retrieve_generic_threat_context
```

S5 continues to read these as new paper-facing endpoint/tool projections over existing S5 internals, not as current already-existing public endpoints.

### 5. Generic Threat KB and leakage controls

Accepted.

The spec correctly uses generic Threat KB mode for mainline and preserves forbidden leakage classes:

```text
cve_id
fix_commit
advisory
exploit_writeup
patch_text
```

The rule that diagnostics must not echo forbidden values is especially important and is accepted.

### 6. `visibleLeakageClass` and row/status semantics

Accepted.

The companion spec is consistent with the anchor and S5 tool-call reply: S5 paper-visible rows need `visibleLeakageClass`, `surfaceStatus`, producer trace/provenance, and diagnostic handling.

Implementation note: the S5 API contract should enumerate the full row vocabulary from the anchor/tool contract rather than relying on abbreviated examples. This belongs in the S5 service/API contract, not as a blocker for this companion spec.

### 7. S5 hit/no-hit/status boundary

Accepted.

The diagnostic rule is correct:

```text
S5 no_hit is contextual absence only.
S5 hit is contextual support only.
S5 partial/error/not_available are producer diagnostics.
None of these are TP/FP/UNKNOWN verdicts by themselves.
```

S5 also accepts the explicit diagnostic path in section 15.

### 8. B2/B4 evidence control

Accepted.

The spec correctly requires:

```text
B2 and B4 must use the same underlying S4/S5 evidence rows/text/order.
B4 may add ledger refs, producer traces, claim links, and navigation.
B2 hides those structural affordances.
B4 must not receive richer S4/S5 evidence content than B2.
```

S5 accepts `retrievalTrace.b2b4StableRows = true` as a useful S5 support signal where available.

### 9. S5_FREEZE_GATE and RQ5 demotion path

Accepted.

The implementation gate correctly states:

```text
S5_FREEZE_GATE satisfied or S5/Threat KB portions of RQ5 demoted.
```

This remains consistent with S5's prior anchor review: S5_FREEZE_GATE is not satisfied by declaration; it must be satisfied by implementation and tests before S5/Threat KB RQ5 becomes mainline.

### 10. Implementation boundary notes

No companion-spec change required.

Implementation/API-contract notes for S5:

1. S5 paper endpoints should be implemented as the separate paper-facing surface previously accepted by S5:

```text
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

2. S5 service/API contract must freeze exact request/response JSON schemas, error envelopes, idempotency behavior, and timeout semantics.

3. S5 tests must prove:

```text
visibleLeakageClass on every visible row
generic Threat KB leakage redaction/omission/no forbidden echo
no final verdict / vulnerable / safe language in paper-visible S5 packets
B2/B4 stable rows/text/order support
no_hit/partial/not_available/error remain producer diagnostics
```

4. S3 consumer guards remain necessary. S5 producer correctness alone is not enough to prove S5 status cannot be misused downstream.

## Final S5 position

Accepted.

S5 has no must-fix changes for the companion spec. The document correctly implements the frozen anchor at the execution-story level and is safe for S5 to implement against, with the API/test details above handled in S5 service contracts and implementation WRs.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
