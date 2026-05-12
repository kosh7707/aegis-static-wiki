---
title: "S4 staticEvidenceContract v1 now propagates per-tool anomalies into gates"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates"
last_verified: "2026-05-11"
service_tags: ["s4", "s3"]
decision_tags: ["static-evidence-contract-v1", "gate-semantics", "tool-evidence-matrix"]
related_pages: ["wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates"
wr_kind: "notice"
status: "open"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: []
registered_at: "2026-05-11T11:09:28.612Z"
---

# S4 staticEvidenceContract v1 now propagates per-tool anomalies into gates

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S4 kept the existing `s4-static-evidence-contract-v1` schema and hardened gate semantics so S3 does not have to infer tool anomalies from raw `execution.toolResults`.

## New consumer semantics
- A successful `/v1/scan` or `/v1/build-and-analyze` response with current per-tool anomaly is still a successful local artifact, but `staticEvidenceContract.gates.systemStability.status` is now `degraded`.
- `coverage.staticToolExecution.status` becomes `partial` with `reasonCodes=["TOOL_EXECUTION_PARTIAL"]` and deterministic `anomalyReasonCodes[]`.
- Covered anomaly codes: `TOOL_PARTIAL:<tool>`, `TOOL_FAILED:<tool>`, `TOOL_DEGRADED:<tool>`, `TOOL_BLOCKING_SKIP:<tool>`, `TOOL_NOT_RECORDED:<tool>`, `TOOL_STATUS_UNKNOWN:<tool>`.
- Allowed skips (`operator-requested-subset`, `profile-not-applicable`) do not degrade the artifact.
- Policy-failure responses remain `systemStability=fail` and `evidenceReadiness=not_ready`.

## Why S3 should care
S3 can now distinguish:
1. clean local static evidence (`systemStability=pass`, `evidenceReadiness=ready`),
2. successful but locally degraded evidence (`systemStability=degraded`, `staticToolExecution=partial`), and
3. failed/not-ready policy artifacts.

This prevents the specific false confidence path where S3 treats a success=true S4 response with a failed heavy analyzer as fully clean local evidence.

## Verification
- Focused static contract gate: `35 passed in 0.15s`.
- Focused static/golden/orchestrator gate: `47 passed in 0.13s`.
- Related report/governance/evidence gate: `20 passed in 0.07s`.
- Full S4 gate: `481 passed in 13.28s`.
- Wiki MCP tests: `8 passed`.

## Contract boundary
No v2 split. No S3 code changes requested in this WR; this is a consumer-facing S4 contract notice.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
