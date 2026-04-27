---
title: "S3 Analysis Agent state-machine result outcome contract will become default after current test-gated implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte"
last_verified: "2026-04-25"
service_tags: ["s3", "s2", "analysis-agent", "api-contract"]
decision_tags: ["state-machine", "result-outcome", "completed-vs-clean-pass", "notify-style-contract"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/api-contract-decisions.md", "wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-analysis-agent-state-machine-result-outcome-contract-will-become-default-afte"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-25T05:40:30.700Z","note":"Implemented S2 side of S3 Analysis Agent result outcome contract: shared model/DTO outcome fields, backend AgentClient typing/logging, SQLite/DAO persistence, Deep orchestration clean-pass semantics, websocket payload additions, docs updates, and regression tests. Verification passed: shared/backend typecheck and builds, focused S3 outcome regressions (93 tests), API contract suite (149 tests), full backend suite (483 tests)."}]
registered_at: "2026-04-24T14:22:17.894Z"
completed_at: "2026-04-25T05:40:30.700Z"
---

# S3 Analysis Agent state-machine result outcome contract will become default after current test-gated implementation

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

S3 is implementing the 2026-04-24 claim-evidence state-machine public contract change on a notify-style basis.

## What changes

Analysis Agent `TaskSuccessResponse.result` gains additive outcome fields:

- `analysisOutcome`: `accepted_claims | no_accepted_claims | inconclusive`
- `qualityOutcome`: `accepted | accepted_with_caveats | rejected | inconclusive | repair_exhausted`
- `pocOutcome`: `poc_accepted | poc_rejected | poc_inconclusive | poc_not_requested`
- `recoveryTrace`: bounded public deficiency/recovery summaries

`completed` now means S3 returned a schema-valid honest review envelope. It does not mean clean pass.

## Failure-boundary change

For valid endpoint input and health-alive required services, S3-owned internal deficiencies such as `INVALID_SCHEMA`-class final output deficiency, ref/grounding/quality rejection, no accepted claims, and PoC rejection will return `HTTP 200 + status=completed` with result-level outcomes instead of terminal public task failure.

True task failure remains non-2xx for invalid input, unsafe/out-of-authority request, genuinely unavailable/dead dependency, hard timeout/cancel, or impossible envelope assembly/internal exception.

## Clean-pass interpretation

- Clean deep pass = `completed + analysisOutcome=accepted_claims + qualityOutcome=accepted`
- Clean PoC pass = `completed + pocOutcome=poc_accepted + qualityOutcome=accepted`

## Timing

This notice is sent before S3 default runtime exposure. S3 is adding contract tests and implementation in S3-owned code. No S2 approval wait is required by the current project policy, but S2 should update consumers/hot gates to inspect result-level outcomes rather than treating `completed` as clean pass.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
