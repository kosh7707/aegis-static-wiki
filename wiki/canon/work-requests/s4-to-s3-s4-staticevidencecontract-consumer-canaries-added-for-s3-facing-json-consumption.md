---
title: "S4 staticEvidenceContract consumer canaries added for S3-facing JSON consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption"
last_verified: "2026-05-11"
service_tags: ["s4", "s3"]
decision_tags: ["static-evidence-contract-v1", "consumer-canary", "json-fixtures"]
related_pages: ["wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption"
wr_kind: "notice"
status: "open"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: []
registered_at: "2026-05-11T11:25:49.053Z"
---

# S4 staticEvidenceContract consumer canaries added for S3-facing JSON consumption

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S4 added a staticEvidenceContract consumer-canary harness under the existing `s4-static-evidence-contract-v1` contract. This is not a v2 split and does not change S3 code.

## What was added
- `services/sast-runner/benchmark/static_evidence_consumer_canary.py`
- `services/sast-runner/tests/test_static_evidence_consumer_canaries.py`
- Precomputed full-response JSON fixtures under `services/sast-runner/tests/fixtures/static_evidence_contract/consumer_canaries/`

## Consumer semantics locked by fixtures
The canaries consume only response-shaped JSON with embedded `staticEvidenceContract` and cover:
- top-level `staticEvidenceContract`
- nested `scan.staticEvidenceContract`
- clean pass/ready artifact
- failed-tool degraded/partial artifact
- missing/not-recorded tool metadata artifact
- policy-failure fail/not-ready artifact
- allowed-skip pass/ready artifact
- absent contract and malformed contract behavior
- poisoned raw `execution.toolResults` proving interpretation does not depend on raw runner internals

## Boundary
The harness derives its summary only from:
- `staticEvidenceContract.gates`
- `coverage`
- `claimBoundaries`
- `toolEvidenceMatrix`

It imports no S4 app modules, makes no network/service calls, and does not emit verdict/risk/orchestration fields. The only readiness boolean is `localStaticEvidenceReady`, narrowly defined as `contractPresent && systemStability == "pass" && evidenceReadiness == "ready"`.

## Verification
- Consumer canary focused gate: `9 passed in 0.03s`.
- Consumer canary + contract/golden/report/governance related gate: `63 passed in 0.15s`.
- Full S4 gate: `490 passed in 13.35s`.
- Wiki MCP tests: `8 passed`.

## Request to S3
No code action is required by this WR. Treat it as a contract-consumption fixture/harness notice: S3 can use these canary payloads as examples for safe staticEvidenceContract consumption without reading S4 internals.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
