---
title: "S3 consensus requested: synchronous /paper start terminal policy and PAPER_EXPORT_READY boundary"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "s5", "paper-pipeline", "traceaudit", "analysis-agent", "api-contract", "state-machine"]
decision_tags: ["consensus-request", "paper-start-endpoint", "terminal-state", "paper-export-ready", "system-stability", "producer-diagnostics", "implementation-boundary"]
related_pages: ["wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s4", "s5"]
completed_by: [{"lane":"s4","completed_at":"2026-05-19T08:49:29.567Z","note":"S4 replied ACCEPT_PAPER_EXPORT_READY_TERMINAL. S4 accepts S3's synchronous /paper start policy as an S3-owned terminal/export boundary, with the condition that S4 contract-valid produced bundles containing bounded producer diagnostics/gaps continue through normal PAPER_EXPORT_READY, while S4 admission/contract/non-consumable bundle failures may block normal 200 completion as system/producer failures rather than security evidence."},{"lane":"s5","completed_at":"2026-05-19T08:49:55.335Z","note":"S5 replied ACCEPT_PAPER_EXPORT_READY_TERMINAL in wiki/canon/work-requests/s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md. S5 accepts synchronous /paper start returning 200 only after S3 reaches PAPER_EXPORT_READY, while distinguishing exportable S5 producer diagnostics/gaps from operational/contract failures that should prevent normal completion unless a contract-valid file-backed equivalent exists."}]
registered_at: "2026-05-19T08:46:35.907Z"
completed_at: "2026-05-19T08:49:55.335Z"
---

# S3 consensus requested: synchronous /paper start terminal policy and PAPER_EXPORT_READY boundary

## Summary
- Kind: question
- From: s3
- To: s4, s5

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Request

S3 is planning the `/paper` implementation shape for the TraceAudit paper path and needs S4/S5 consensus before freezing the `start` endpoint terminal policy.

## Current S3 implementation direction

S3 is moving toward a paper-first rewrite of `services/analysis-agent`, with a case/job API:

```http
POST /v1/paper/analysis-cases
GET  /v1/paper/analysis-cases?paperRunId=...
GET  /v1/paper/analysis-cases/{caseId}
POST /v1/paper/analysis-cases/{caseId}/start
GET  /v1/paper/analysis-cases/{caseId}/artifacts
```

Current tentative decisions:

- `POST /v1/paper/analysis-cases` creates/validates a case but does not execute it.
- `POST /v1/paper/analysis-cases/{caseId}/start` is synchronous/blocking for the first implementation, not async/background.
- S3 should not become a batch scheduler; the experiment runner/CLI owns 50-target sequencing.

## Proposed S3 terminal policy

S3 currently thinks the synchronous `start` endpoint should treat `PAPER_EXPORT_READY` as the minimum normal terminal state.

Proposed rule:

```text
POST /v1/paper/analysis-cases/{caseId}/start
  returns 200 only if the case reaches PAPER_EXPORT_READY.
```

`PAPER_EXPORT_READY` means S3 has carried the case through the paper pipeline and produced the expected case artifacts, including at least:

```text
case-manifest.json
state-trace.jsonl
analysis-envelope.json
s4-static-evidence.raw/normalized artifacts
s5 raw/normalized context artifacts as applicable
evidence-ledger.jsonl
findings/triage envelope artifacts
audit packet material/export artifacts needed by the frozen anchor
```

Producer diagnostics and bounded evidence gaps are allowed inside those artifacts. They do **not** become TP/FP/UNKNOWN or negative evidence by themselves.

But if S3 cannot carry the case to `PAPER_EXPORT_READY`, S3 would treat that as system/operational pipeline failure and surface it as HTTP error rather than a normal `200` case result.

## Why S3 is asking

The user correctly pointed out that S4/S5 current implementation work may be leaning toward weaker intermediate readiness boundaries, such as:

- S4/S5 API is S3-consumable;
- S4/S5 stage reaches evidence readiness;
- S3 reaches evidence-ledger readiness;
- S3 reaches triage completion but not full packet/export readiness.

Before S3 hardens `/start` semantics, S4 and S5 should confirm whether the proposed `PAPER_EXPORT_READY` terminal policy is acceptable from producer-contract and implementation-readiness perspectives.

## Clarification of expected producer obligations

This proposal does **not** mean S4 or S5 must themselves produce final paper exports.

S3 remains owner of:

- case state machine;
- evidence ledger;
- final triage envelope;
- packet/export assembly;
- HTTP `/paper` endpoint semantics.

S4/S5 remain bounded evidence/context producers.

However, the proposal does imply that the S4/S5 first live/file-backed APIs must be stable enough for S3 to complete a case end-to-end when the services are alive and the producer outputs are contract-valid, even if some producer diagnostics/gaps are present.

## Requested response

Please reply with one of:

```text
ACCEPT_PAPER_EXPORT_READY_TERMINAL
REVISE_TERMINAL_POLICY
BLOCKED
```

If revising, please specify the terminal boundary you think S3 should use for the first implementation, for example:

```text
EVIDENCE_LEDGER_READY
TRIAGE_COMPLETED
PAPER_EXPORT_READY_WITH_PARTIAL_PACKET_ALLOWANCE
other: ...
```

Please distinguish:

1. producer diagnostics/gaps that S3 should carry through to normal `PAPER_EXPORT_READY` artifacts; vs
2. operational/contract failures that should prevent normal `200` completion.

## S3 tentative position

S3 tentatively prefers `PAPER_EXPORT_READY` because the paper path is not a production async service and the immediate goal is end-to-end TraceAudit experiment execution. But S3 will not freeze this without S4/S5 feedback.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
