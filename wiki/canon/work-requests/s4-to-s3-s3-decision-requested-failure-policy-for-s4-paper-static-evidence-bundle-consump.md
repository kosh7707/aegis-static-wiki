---
title: "S3 decision requested: failure policy for S4 paper static evidence bundle consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["failure-policy", "consumer-contract", "quality-gate"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-interview-20260519.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-decision-requested-failure-policy-for-s4-paper-static-evidence-bundle-consump"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:24:00.886Z","note":"S3 accepted S4's preferred failure policy. Per-tool/per-surface failures after admission should remain produced bundles when otherwise contract-valid, while admission/provenance/shape/trace invariant failures remain failed/non-consumable. Reply registered at wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md."}]
registered_at: "2026-05-19T08:22:25.289Z"
completed_at: "2026-05-19T08:24:00.886Z"
---

# S3 decision requested: failure policy for S4 paper static evidence bundle consumption

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Context
S4 is about to implement the accepted paper static evidence endpoint:

- `POST /v1/paper/static-evidence`
- response schema: `s4-paper-static-evidence-bundle-v1`
- file-backed equivalent: `cases/{caseId}/s4-static-evidence.raw.json`

During S4 implementation interview, we reached the failure-policy question. S4 and the user agree this is not only an S4-local choice; S3 owns the consumer/orchestration side and must explicitly accept how it will consume S4 partial/failed bundles.

## Decision needed from S3
Please decide/accept the failure boundary S3 wants for S4 paper static evidence bundles.

### S4 preferred policy
S4 proposes the following split:

1. **Admission / contract / mandatory provenance failure**
   - Examples: missing `sourceRoot`, missing/invalid `compile_commands.json`, missing mandatory provenance refs, invalid request shape.
   - Result: request rejected or bundle-level `bundleStatus=failed`.
   - S3 should not consume this as usable static evidence.

2. **S4 cannot produce the required top-level contract shape or row-local trace invariants**
   - Examples: cannot produce required surfaces as arrays/singletons at all, inconsistent `staticEvidenceContract` mirror fields, broken producer refs, untraceable rows.
   - Result: `bundleStatus=failed`.
   - S3 should treat this as producer failure, not as security/quality evidence.

3. **Individual surface generation failure after admission**
   - Examples: `functions` extraction failed, `libraries` extraction partially unavailable, one SAST tool failed/timed out, one parser failed.
   - Result: keep `bundleStatus=produced` if the bundle remains contract-valid; mark the affected surface/tool with `surfaceStatus`, `toolRuns[]`, and `diagnostics[]`.
   - S3 must consume this as **bounded static evidence with explicit gaps**, not as complete evidence and not as a verdict.

4. **Current-six tool liveness/execution problems**
   - S4 view: this belongs primarily to **system stability Quality Gate**, not the paper bundle’s security verdict.
   - In the produced bundle, per-tool failure should be visible in `toolRuns[]` and `diagnostics[]`.
   - Separately, CI/validator tests should fail if S4 cannot prove the configured tools are reachable/executable in the implementation environment.

## Question for S3
Does S3 accept the S4 preferred policy above?

If not, please specify the exact consumer rule S3 wants, especially for this case:

> If one of the current-six SAST tools is unavailable or times out after request admission, should S4 return `bundleStatus=failed`, or return `bundleStatus=produced` with that tool/surface marked failed in `toolRuns[]`/`diagnostics[]`?

## S4 implementation impact
S4 will wire this decision into:

- endpoint behavior,
- file-backed artifact validator,
- test fixtures including negative/failure tests,
- `surfaceStatus` / `toolRuns` / `diagnostics` semantics,
- and any follow-up API contract patch if S3 wants stricter language.

## Requested response
Please reply with one of:

- `ACCEPT_S4_POLICY`, or
- `REVISE_POLICY` with concrete S3 consumer rules.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
