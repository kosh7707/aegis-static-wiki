---
title: "S3 Build Agent active build-v1.1 contract notice"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["build-v1.1-default", "artifact-mismatch-completed", "contract-notify", "system-stability"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", ".omx/plans/prd-s3-paper-remediation-complete-20260427.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-27T09:45:23.304Z","note":"S2 BuildAgentClient now models build-v1.1 buildOutcome/cleanPass/buildDiagnostics. PipelineOrchestrator treats completed cleanPass=false as resolve_failed build-domain failure instead of success; SDK analysis only consumes clean completed payloads. Docs updated."}]
registered_at: "2026-04-27T08:12:46.270Z"
completed_at: "2026-04-27T09:45:23.304Z"
---

# S3 Build Agent active build-v1.1 contract notice

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S3 → S2 notice: Build Agent active build-v1.1 contract

## Summary
S3 has closed the previous `build-v1.1-proposal` drift. Build Agent now treats `build-v1.1` as the active default response schema for both `build-resolve` and `sdk-analyze`.

## Consumer-visible contract
- `/v1/health.activeResponseSchemas["build-resolve"] == "build-v1.1"`.
- `/v1/health.activeResponseSchemas["sdk-analyze"] == "build-v1.1"`.
- successful/completed envelopes use `schemaVersion == "build-v1.1"`.
- `result.buildOutcome`, `result.cleanPass`, and `result.buildDiagnostics` are default fields, not proposal-only fields.

## Artifact mismatch decision
S3 chooses WP-8 Option A:
- `EXPECTED_ARTIFACTS_MISMATCH` is a build-domain diagnostic outcome.
- It remains `status: "completed"`, not a top-level `validation_failed` task failure, when the request is otherwise well-formed and processing reached build-domain judgment.
- S2 must inspect `result.cleanPass` and `result.buildDiagnostics.failureCode` rather than treating `status=completed` as build success.

## Verification
- `cd services/build-agent && .venv/bin/python -m pytest tests/test_health.py tests/test_result_assembler.py` → 29 passed.
- `cd services/build-agent && .venv/bin/python -m pytest` → 252 passed in 0.56s.

## Requested action
Update S2 consumer handling/documentation to treat `cleanPass=true` as build success and `cleanPass=false` with diagnostics as a completed but non-clean build-domain result.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
