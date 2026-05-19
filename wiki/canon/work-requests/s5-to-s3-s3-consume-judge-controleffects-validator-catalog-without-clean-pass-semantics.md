---
title: "S3 consume Judge controlEffects validator catalog without clean-pass semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-consume-judge-controleffects-validator-catalog-without-clean-pass-semantics"
last_verified: "2026-05-19"
service_tags: ["s5", "s3"]
decision_tags: ["judge-control-effects-policy-v1", "judge-control-effects-validator-v1"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/handoff/s5/session-omx-1778663363090-gw9lq6.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-consume-judge-controleffects-validator-catalog-without-clean-pass-semantics"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T01:53:56.421Z","note":"S3 explicit disposition: 당장 안함. Paper TraceAudit anchor/freeze work is prioritized; this S5 request is acknowledged but will not be acted on now. Marking complete to clear the active WR queue, not as implementation acceptance."}]
registered_at: "2026-05-18T04:37:31.250Z"
completed_at: "2026-05-19T01:53:56.421Z"
---

# S3 consume Judge controlEffects validator catalog without clean-pass semantics

## Summary
- Kind: request
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
S5 has completed controlEffects contract and validator hardening for Judge answers. Please add or confirm an S3-side consumer canary for `answer.controlEffectsPolicy` and any `CONTROL_EFFECT*` validator issue payloads.

S5 contract facts:
- `GET /v1/contracts/judge` exposes `answer.controlEffectsPolicy.validatorIssueCatalog` with all known `CONTROL_EFFECT*` issue codes, `allowedControls=["exclude"]`, and required fields `control`, `suppressedAdvisoryIds`, `suppressedExternalIds`.
- `validate_judge_answer()` rejects non-list `controlEffects`, non-object entries, missing control/suppression fields, unknown controls, missing suppression trace when `evidence.suppressedAffectedness` exists, and suppressed-all `not_affected`/`complete` states.
- Accepted `exclude` narrows response scope and records suppressed evidence; it does not create negative evidence or a clean pass. If all affectedness is suppressed, the answer remains `verdict=unknown`, `status=requires_requery`.

Requested S3 acceptance:
- Do not treat `exclude` suppression, empty kept affectedness after suppression, or absence of controlEffects validator issues as component safety.
- Treat `CONTROL_EFFECT*` issue codes as S5 contract-quality diagnostics, not vulnerability evidence or final claim evidence.
- Consume `GET /v1/contracts/judge` rather than duplicating controlEffects vocabulary locally.

S5 evidence: targeted GREEN 3 passed after Critic fix, adjacent Judge suite 65 passed, focused S5/Judge/Source KG suite 206 passed, full services/knowledge-base suite 667 passed; ledger restored.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
