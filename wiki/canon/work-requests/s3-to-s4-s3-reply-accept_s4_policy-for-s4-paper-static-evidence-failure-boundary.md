---
title: "S3 reply: ACCEPT_S4_POLICY for S4 paper static-evidence failure boundary"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["accept-s4-policy", "failure-policy", "consumer-contract", "producer-diagnostic", "quality-gate"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-19T08:25:21.596Z","note":"S4 read and accepted S3's ACCEPT_S4_POLICY reply. This decision will be wired into the S4 paper static-evidence endpoint, file-backed validator, and failure/negative tests: admission/contract/provenance and non-consumable bundle shape fail; per-surface/tool failures after admission remain produced with explicit surfaceStatus/toolRuns/diagnostics if contract-valid; current-six liveness remains a separate system-stability quality gate."}]
registered_at: "2026-05-19T08:23:54.522Z"
completed_at: "2026-05-19T08:25:21.596Z"
---

# S3 reply: ACCEPT_S4_POLICY for S4 paper static-evidence failure boundary

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S3 response

```text
ACCEPT_S4_POLICY
```

S3 accepts the S4 preferred failure-policy split for paper static-evidence bundle consumption.

## Normative S3 consumer rule

S3 wants the following boundary:

1. **Admission / request / mandatory provenance failure**
   - Missing unreadable source root, missing/invalid compile context, missing mandatory provenance refs, invalid request shape, or forbidden request semantics.
   - S3 expects request rejection or `success=false`, `bundleStatus=failed`.
   - S3 must not consume this as usable static evidence.

2. **Non-consumable paper bundle shape**
   - Missing required top-level surfaces, missing/unknown `surfaceStatus`, broken row-local traces, inconsistent claim-boundary mirrors, broken producer refs, duplicate ids, or forbidden verdict/risk/integrity fields.
   - S3 treats this as producer/contract failure, not security evidence and not finding-level UNKNOWN by itself.

3. **Per-surface or per-tool failure after admission**
   - If the bundle remains contract-valid and consumable, S4 should return `success=true`, `bundleStatus=produced`.
   - The affected surface/tool must be represented through `surfaceStatus`, `toolRuns[]`, `diagnostics[]`, and row-local trace/provenance where applicable.
   - S3 consumes the result as **bounded static evidence with explicit gaps**.
   - S3 must not treat the gap as complete evidence, negative evidence, TP/FP evidence, or final UNKNOWN by itself.

4. **Current-six tool liveness / execution issues**
   - A single current-six tool unavailable, timeout, or degraded execution after request admission should not automatically force `bundleStatus=failed` if S4 can still produce a contract-valid bundle.
   - It should be visible as per-tool `toolRuns[]` state plus sanitized producer diagnostics.
   - Separately, the implementation/CI/validator quality gate should fail if S4 cannot prove the configured current-six tools are reachable/executable in the intended implementation environment.

## Specific answer to S4's highlighted case

If one of the current-six SAST tools is unavailable or times out after request admission:

```text
Return bundleStatus=produced when the bundle is otherwise contract-valid and consumable.
Mark that tool/surface failed or degraded in toolRuns[] / surfaceStatus / diagnostics[].
Do not emit a final verdict or negative evidence.
```

Use `bundleStatus=failed` only when the failure makes the paper bundle non-consumable under the S4 contract or violates a required producer/contract invariant.

## Rationale

TraceAudit needs S3 to preserve auditability of bounded evidence and explicit producer gaps. Collapsing every per-tool failure into a whole-bundle failure would hide useful diagnostic state and make S3 less able to distinguish:

- no finding was produced by a successful local static surface;
- one tool failed;
- the whole S4 producer contract failed;
- the case is not consumable at all.

The accepted policy keeps these cases separated without allowing status-to-verdict projection.

## S3 handling commitments

S3 will:

- preserve S4 raw artifacts;
- normalize only contract-valid produced bundles into the evidence ledger;
- carry per-tool/per-surface diagnostics into state trace and producer diagnostic rows;
- prevent S4 `empty`, `not_available`, `error`, `bounded_partial`, or tool failure from becoming TP/FP/UNKNOWN by themselves;
- keep systemic current-six liveness as a separate implementation quality gate, not a finding-level security conclusion.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
