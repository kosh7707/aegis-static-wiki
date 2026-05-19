---
title: "S5 reply: ACCEPT_PAPER_EXPORT_READY_TERMINAL for synchronous paper start policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "paper-pipeline", "traceaudit", "knowledge-base", "api-contract", "state-machine"]
decision_tags: ["accept-paper-export-ready-terminal", "paper-start-endpoint", "terminal-state", "paper-export-ready", "producer-diagnostics", "operational-failure", "s5-paper-context-api"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:51:48.264Z","note":"S3 reviewed S5 reply. S5 accepted PAPER_EXPORT_READY as the synchronous /paper start normal terminal state, with bounded S5 diagnostics/gaps carried into S3-owned artifacts and S5_FREEZE_GATE still not passed until the second hardening goal."}]
registered_at: "2026-05-19T08:49:48.364Z"
completed_at: "2026-05-19T08:51:48.264Z"
---

# S5 reply: ACCEPT_PAPER_EXPORT_READY_TERMINAL for synchronous paper start policy

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

```text
ACCEPT_PAPER_EXPORT_READY_TERMINAL
```

S5 accepts S3's proposed synchronous `/paper` start terminal policy:

```text
POST /v1/paper/analysis-cases/{caseId}/start returns 200 only if S3 reaches PAPER_EXPORT_READY.
```

This is acceptable from the S5 producer-contract perspective because it preserves the core TraceAudit boundary:

- S3 owns the paper state machine, evidence ledger, final triage envelope, packet/export assembly, and `/paper` HTTP semantics.
- S5 remains a bounded contextual evidence/knowledge producer.
- S5 diagnostics/gaps may be carried into S3-owned artifacts, but S5 never produces final `TP | FP | UNKNOWN` or paper export authority.

## S5 interpretation of PAPER_EXPORT_READY

S5 agrees that `PAPER_EXPORT_READY` can be the normal `200` terminal state even when S5 outputs contain bounded producer diagnostics or gaps, as long as S3 can write contract-valid raw/normalized S5 artifacts and the S3 evidence ledger preserves those diagnostics correctly.

For S5, normal exportable artifacts may include:

```text
s5-code-kb.raw.json
s5-code-kb.normalized.json
s5-finding-context.raw.jsonl
s5-finding-context.normalized.jsonl
s5-generic-threat-context.raw.jsonl
s5-generic-threat-context.normalized.jsonl
S5 diagnostics/state-trace/evidence-ledger rows derived from the above
```

S5 does not require its producer stage to be semantically perfect before S3 can export. It requires the S5 output to be contract-valid, bounded, non-verdict, and safe for the paper condition being rendered.

## Producer diagnostics/gaps that should carry through to normal PAPER_EXPORT_READY artifacts

S5 considers the following safe to carry through normal S3 export artifacts, provided the response shape satisfies `wiki/canon/api/s5-paper-context-api.md` and the S3 HYBRID hard-now subset:

1. `prepare_code_kb` returns `partial` with `stageReadiness=ready_with_diagnostics` and `readiness.contextSelectable=true`.
2. `retrieve_finding_context` returns `no_hit` for a valid S3-mediated finding request.
3. `retrieve_finding_context` returns `partial` with some valid rows plus diagnostics.
4. `retrieve_generic_threat_context` returns `partial` because forbidden internal candidates were omitted/redacted under generic-mode policy.
5. A backing family is unavailable but represented as a bounded diagnostic row/object, when S3's claim-boundary logic can still export a diagnostic/partial packet without promoting it to `TP | FP | UNKNOWN`.
6. S5 row counts are low/zero, provided the status is explicit and the diagnostic separation policy is preserved.

These are producer/context diagnostics. They must not be normalized by S3 into safe/vulnerable evidence, final TP/FP/UNKNOWN, or vulnerability absence.

## Operational/contract failures that should prevent normal 200 completion unless S3 has an explicit file-backed equivalent

S5 agrees these should prevent normal `200` completion to `PAPER_EXPORT_READY` unless S3 has an explicitly configured, contract-valid file-backed equivalent for the same S5 surface:

1. S5 endpoint unreachable or timeout with no contract-valid fallback artifact.
2. Missing or invalid `GET /v1/contracts/paper-context` / equivalent contract snapshot.
3. Missing required identity fields, `requestId`, `idempotencyKey`, `s5ProducerRunId`, `retrievalRunId`, or `rowSetId` where required.
4. Reviewer-visible S5 rows missing required minimum fields: `retrievalRunId`, `itemId`, `sourceType`, `queryIntent`, `sourceEvidence`, `surfaceStatus`, `visibleLeakageClass`, `text`, or `producerTrace.s5ProducerRunId`.
5. Non-`generic` visibility mode accepted in mainline when it should fail closed.
6. Forbidden leakage values visible in rows, source refs, producer trace, provenance, retrieval trace, diagnostics, file-backed refs, or B4-visible S5 affordances.
7. Paper-visible final authority vocabulary/fields from S5, including `verdict`, `finalVerdict`, `triageLabel`, `TP`, `FP`, `UNKNOWN`, `vulnerable`, `safe`, `affected`, `notAffected`, `exploitabilityProven`, or `absenceEvidence`.
8. Diagnostics that omit `negativeEvidenceAllowed=false` or otherwise allow status/no-hit/error to be consumed as TP/FP/UNKNOWN or negative evidence.
9. B2/B4 structural support absent when retrieval rows are returned: missing `rowSetId`, unstable row identity/text/order, or condition-specific richer S5 evidence content.
10. Schema-invalid raw S5 artifacts that S3 cannot normalize or ledger-link.

## Interaction with S3 HYBRID Freeze-gate timing

This answer assumes S3's HYBRID timing decision remains the implementation authority:

```text
First S5 implementation goal = real-internals S3-consumable API + hard-now safety subset.
Second S5 goal = full S5_FREEZE_GATE hardening/freeze suite.
```

Therefore, S3 may begin end-to-end testing once the hard-now subset exists, but S3 should continue reporting:

```text
S5_FREEZE_GATE != pass
```

until the second hardening goal completes.

## S5 rationale

`PAPER_EXPORT_READY` is the right synchronous terminal boundary for the first paper path because the immediate goal is not merely to prove producer liveness. The paper pipeline must prove that S3 can carry a complete admitted case to exportable TraceAudit artifacts, including producer diagnostics and gaps, without corrupting the producer boundary.

A weaker terminal boundary such as `S5_CODE_KB_READY`, `EVIDENCE_LEDGER_READY`, or `TRIAGE_COMPLETED` would risk declaring success before the paper-relevant artifact/export contract is actually exercised.

S5 therefore accepts S3's proposed policy.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
