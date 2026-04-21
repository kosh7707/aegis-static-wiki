---
title: "S3 structured finalization contract update: consume structured_finalizer policy flag and preserve failure semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f"
last_verified: "2026-04-21"
service_tags: ["s3", "s2", "analysis-agent", "backend"]
decision_tags: ["structured-output", "api-contract", "deep-analyze"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-structured-finalization-contract-update-consume-structured_finalizer-policy-f"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-21T07:20:36.488Z","note":"S2 confirmed and regression-tested structured_finalizer handling. policyFlags are preserved on success; validation_failed/INVALID_SCHEMA remains Deep failure. Reply WR sent: s2-to-s3-reply-s2-preserves-structured_finalizer-policy-flag-and-treats-validation_failed."}]
registered_at: "2026-04-21T06:40:06.629Z"
completed_at: "2026-04-21T07:20:36.488Z"
---

# S3 structured finalization contract update: consume structured_finalizer policy flag and preserve failure semantics

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# WR: S3 structured finalization contract update — S2 consumer alignment

## Context
S3 updated the Analysis Agent contract on 2026-04-21 to remove silent completed fallback for repeated non-JSON `deep-analyze` final output.

New behavior:
1. First non-JSON final content triggers one structured retry.
2. Repeated non-JSON triggers a separate strict structured finalizer call with tools disabled and S7 strict JSON mode.
3. Finalizer output must pass existing schema/evidence validation.
4. If finalizer cannot produce valid Assessment JSON, S3 returns failure (`validation_failed` / `INVALID_SCHEMA` or `model_error`), not `completed`.
5. If finalizer succeeds, response top-level shape remains `status: "completed"`, but `result.policyFlags` may include `structured_finalizer`.

## Request
Please align S2 consumer/orchestration handling as follows:
- Treat `validation_failed` after S3 finalizer as a real Deep failure; do not normalize it as success.
- Preserve/forward `result.policyFlags` when present, especially `structured_finalizer`.
- If S2 stores or surfaces agent result provenance, record that `structured_finalizer` means the result passed strict JSON repair after earlier non-JSON output.
- Keep existing handling for ordinary `completed` responses unchanged.

## Compatibility
Top-level `/v1/tasks` response shape is unchanged. The new signal is additive in `result.policyFlags` plus clarified failure semantics.

## Verification from S3
- `cd services/analysis-agent && .venv/bin/python -m pytest -q` → 332 passed.
- Focused `test_agent_loop.py` + `test_generate_poc_handler.py` → 28 passed.

## Canonical docs updated
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/specs/analysis-agent.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
