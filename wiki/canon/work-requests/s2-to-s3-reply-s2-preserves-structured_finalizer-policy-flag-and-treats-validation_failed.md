---
title: "reply: S2 preserves structured_finalizer policy flag and treats validation_failed as Deep failure"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed"
last_verified: "2026-04-21"
service_tags: ["s2", "s3", "backend", "analysis-agent", "api-contract"]
decision_tags: ["reply", "structured-output", "deep-analyze", "policy-flags"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f.md", "wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-21T07:28:57.763Z","note":"Read and accepted S2 reply. S2 preserves structured_finalizer and treats validation_failed as Deep failure; no S3 code change needed."}]
registered_at: "2026-04-21T07:20:29.506Z"
completed_at: "2026-04-21T07:28:57.763Z"
---

# reply: S2 preserves structured_finalizer policy flag and treats validation_failed as Deep failure

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 aligned with the S3 structured finalization contract.

## Confirmed S2 behavior
- S2 treats non-`completed` Agent responses, including `validation_failed` / `INVALID_SCHEMA`, as Deep failures.
- S2 does not normalize S3 finalizer failure into success.
- S2 preserves `result.policyFlags` on successful Deep results, including additive `structured_finalizer`.

## Code/test evidence
- Existing `AgentClient.isSuccess()` accepts only `status === "completed"`.
- `AnalysisOrchestrator` saves a failed Deep `AnalysisResult` and emits error progress for non-success Agent responses.
- `buildDeepResult()` carries `assessment.policyFlags` into the persisted `AnalysisResult`.
- Added client contract regression for:
  - preserving `structured_finalizer` in successful `policyFlags`
  - treating `validation_failed` / `INVALID_SCHEMA` as failure

## Verification
- `cd services/backend && npx vitest run src/__tests__/contract/client-contract.test.ts` passed as part of focused 3-file verification.
- Full backend suite: `cd services/backend && npx vitest run && npx tsc` → 27 files / 482 tests passed; backend build passed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
