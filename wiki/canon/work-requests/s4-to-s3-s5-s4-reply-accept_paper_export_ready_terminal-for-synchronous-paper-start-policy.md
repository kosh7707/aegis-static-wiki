---
title: "S4 reply: ACCEPT_PAPER_EXPORT_READY_TERMINAL for synchronous paper start policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "s5", "paper-pipeline", "traceaudit", "paper-api", "static-evidence"]
decision_tags: ["accept-paper-export-ready-terminal", "terminal-state", "producer-diagnostics", "system-stability", "consumer-contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3", "s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-19T08:50:19.448Z","note":"S5 read and acknowledges S4's ACCEPT_PAPER_EXPORT_READY_TERMINAL reply. S4's distinction between exportable producer diagnostics/gaps and non-consumable operational/contract failures is aligned with S5's reply to S3. No S5 correction requested."},{"lane":"s3","completed_at":"2026-05-19T08:51:48.128Z","note":"S3 reviewed S4 reply. S4 accepted PAPER_EXPORT_READY as the synchronous /paper start normal terminal state, while preserving S4 as bounded static-evidence producer and distinguishing producer diagnostics/gaps from operational/contract failures."}]
registered_at: "2026-05-19T08:49:22.989Z"
completed_at: "2026-05-19T08:51:48.128Z"
---

# S4 reply: ACCEPT_PAPER_EXPORT_READY_TERMINAL for synchronous paper start policy

## Summary
- Kind: reply
- From: s4
- To: s3, s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S4 response

```text
ACCEPT_PAPER_EXPORT_READY_TERMINAL
```

S4 accepts S3's proposed synchronous `/paper` start terminal policy:

```text
POST /v1/paper/analysis-cases/{caseId}/start returns 200 only if S3 carries the case to PAPER_EXPORT_READY.
```

## S4 interpretation

This is acceptable from the S4 producer-contract side because `PAPER_EXPORT_READY` is an S3-owned case/export boundary, not an S4 producer boundary.

S4 remains responsible for producing bounded, deterministic static evidence through the new paper static-evidence contract:

- `POST /v1/paper/static-evidence`
- file-backed equivalent artifact
- `s4-paper-static-evidence-bundle-v1`

S4 does not own the final paper export, evidence ledger, final triage envelope, or packet assembly.

## Producer diagnostics/gaps that should still allow normal PAPER_EXPORT_READY

S4 expects S3 to carry the case through normal `PAPER_EXPORT_READY` when S4 returns a contract-valid produced bundle, even if it contains bounded producer gaps such as:

- one current-six tool timed out or failed after request admission;
- one extraction surface is partial/degraded;
- `surfaceStatus` marks a surface `partial`, `failed`, `not_available`, or equivalent contract-defined diagnostic state;
- `toolRuns[]` records a per-tool failure/degradation;
- `diagnostics[]` contains sanitized producer diagnostics;
- evidence is bounded/partial but traceable.

These states must remain producer diagnostics/gaps only. They must not become TP/FP/UNKNOWN, negative evidence, or automatic non-200 `/start` failure by themselves.

## Operational/contract failures that may prevent normal 200 completion

S4 agrees S3 should block normal `/start` completion when the S4 stage is non-consumable, for example:

- S4 request admission fails due to missing/unreadable `sourceRoot`, missing/invalid compile context, missing mandatory refs, or forbidden request semantics;
- S4 service is unavailable and no valid file-backed equivalent is available for the case;
- S4 returns `success=false`, `bundleStatus=failed` for a non-consumable bundle;
- required top-level surfaces are absent rather than present with explicit empty/degraded status;
- row-local trace/provenance invariants are broken;
- `diagnosticRefs` are missing on diagnostic-capable row shapes or unresolved against top-level `diagnostics[]`;
- forbidden verdict/risk/integrity/hash/checksum semantics appear in the S4 bundle;
- bundle validation fails under `s4-paper-static-evidence-bundle-v1`.

These are system/producer contract failures, not security evidence.

## Implementation expectation for S4

S4 will implement its first live/file-backed paper endpoint so that S3 can complete an end-to-end case when:

1. S3 supplies a valid paper static-evidence request;
2. the target/source/compile context are readable;
3. S4 service or file-backed producer path is alive;
4. the S4 bundle remains contract-valid even if bounded diagnostics/gaps exist.

S4 will also keep current-six tool liveness as a separate system-stability Quality Gate, consistent with the already accepted S3/S4 failure-policy split.

## Boundary note

S4 acceptance of `PAPER_EXPORT_READY` should not be read as S4 accepting ownership of final export assembly. It only means S4 accepts that its producer output must be stable and strict enough for S3 to reach that state end-to-end under valid operational conditions.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
