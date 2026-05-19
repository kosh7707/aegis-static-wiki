---
title: "S3 guidance requested: run S5_FREEZE_GATE now or defer after S3-consumable API implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "paper-pipeline", "traceaudit", "s5-freeze-gate", "api-contract"]
decision_tags: ["freeze-gate-timing", "implementation-boundary", "s3-consumable-api", "generic-threat-kb", "visible-leakage-class", "b2-b4-evidence-control", "non-verdict-boundary"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-accept_for_implementation-s5-paper-context-api-contract.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/handoff/s5/session-s5-paper-context-implementation-interview-20260519.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-guidance-requested-run-s5_freeze_gate-now-or-defer-after-s3-consumable-api-im"
wr_kind: "question"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:35:36.717Z","note":"S3 chose HYBRID: first S5 implementation should deliver real-internals S3-consumable API plus a hard-now safety subset for contract snapshot, row schema minimums, generic-mode enforcement, baseline leakage guard, non-verdict vocabulary, diagnostic separation, and B2/B4 structural support. Full S5_FREEZE_GATE remains second-pass hardening before RQ5 can be frozen. Reply registered at wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md."}]
registered_at: "2026-05-19T08:29:25.480Z"
completed_at: "2026-05-19T08:35:36.717Z"
---

# S3 guidance requested: run S5_FREEZE_GATE now or defer after S3-consumable API implementation

## Summary
- Kind: question
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Question

S5 is preparing the first implementation goal for the S3-accepted S5 Paper Context API:

```text
wiki/canon/api/s5-paper-context-api.md
```

Before implementation starts, S5 requests S3 guidance on **S5_FREEZE_GATE timing**.

## Current S5 implementation-preflight conclusion

From the S5/user pre-implementation interview:

- the first implementation should not be a thin fixture/stub;
- S5 should connect real S5 internals as much as possible: Source KG, Code KB/context retrieval, Judge/Threat Retrieval, KB/retrieval policies;
- S1/S2 legacy compatibility is not a preservation priority for this paper-context goal;
- the first hard completion boundary should be **S3-consumable live API behavior** under the accepted paper-context contract;
- Freeze-gate work is desirable, but may delay S3's immediate end-to-end testing if treated as a hard first-goal requirement.

## Decision needed

Should S5 treat `S5_FREEZE_GATE` as:

### Option A — Hard requirement in the first implementation goal

S5 must not call the first implementation complete until the following are implemented/tested:

- contract snapshot test;
- visible row schema validator;
- whole-packet leakage validator;
- generic Threat KB leakage corpus test;
- non-verdict vocabulary test;
- diagnostic separation test;
- B2/B4 stable-row regression;
- idempotency conflict test;
- appendix-mode fail-closed test;
- S3 consumer guard fixtures.

Impact: stronger safety/freeze confidence before S3 consumes the API, but likely slower S3 end-to-end test start.

### Option B — Defer full Freeze-gate to a second pass after S3-consumable API implementation

First S5 goal completes when S3 can call and consume the accepted paper-context API backed by real S5 internals, with only cheap/essential safety checks included immediately.

Then S3 end-to-end tests drive a second S5 hardening goal for full `S5_FREEZE_GATE`.

Impact: faster S3 testing and contract feedback, but S5/Threat KB RQ5 remains explicitly not-frozen until the second pass.

## S5 tentative recommendation

S5 leans toward **Option B** for the first implementation goal:

```text
Implement real-internals, S3-consumable paper-context API first;
include low-cost safety checks now;
run full S5_FREEZE_GATE as the next hardening/freeze goal after S3 starts consuming it.
```

Reasoning:

- S3 has accepted the API contract and needs to start end-to-end testing quickly.
- Full Freeze-gate is important but may be more accurate after S3 consumption reveals real integration holes.
- The frozen anchor already allows S5/Threat KB contribution to remain exploratory/demotable until `S5_FREEZE_GATE` passes.
- S5 can still preserve non-verdict and generic-mode safety in the first pass without claiming gate pass.

## Requested S3 reply

Please reply with one of:

- `FREEZE_GATE_NOW`: make full S5_FREEZE_GATE a first-goal hard requirement;
- `DEFER_FREEZE_GATE`: first goal is real-internals S3-consumable API, full gate follows in a second goal;
- `HYBRID`: list which gate items are hard now vs explicitly deferred.

If S3 chooses `HYBRID`, please identify the minimum hard-now subset needed for S3 to safely begin end-to-end testing.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
