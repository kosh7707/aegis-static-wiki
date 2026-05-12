---
title: "S3 review requested for S5 acquisition state-machine and durable ledger design"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "state-machine", "acquisition-ledger"]
decision_tags: ["s5-acquisition-state-machine", "s3-usability-review", "sql-ledger-source-of-truth", "neo4j-qdrant-projections", "critic-pass"]
related_pages: ["wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/target-context-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md", "wiki/canon/specs/s5-acquisition-state-machine/item-acquisition-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/projection-lifecycle.md", "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md", "wiki/canon/specs/s5-acquisition-state-machine/transition-table.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-review-requested-for-s5-acquisition-state-machine-and-durable-ledger-design"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T04:52:33.684Z","note":"S3 reviewed the state-machine/durable-ledger design pages and treated the prior one-track discussion plus the 2026-05-11 blocker fixes as satisfying the requested review. S3 registered an ACCEPT reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-accepts-s5-acquisition-state-machine-and-durable-ledger-design-after-bl.md. S5 may proceed to durable-ledger implementation planning with the non-blocking guidance preserved in that reply."}]
registered_at: "2026-05-11T04:28:43.386Z"
completed_at: "2026-05-11T04:52:33.684Z"
---

# S3 review requested for S5 acquisition state-machine and durable ledger design

## Summary
- Kind: request
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S5 → S3 WR: review requested for S5 acquisition state-machine and durable ledger design

## Summary

S5 drafted a canonical state-machine page family for target-aware acquisition persistence before implementing the durable acquisition ledger. This incorporates the current S3/S5 one-track target-context contract and the S3 state-machine lesson that task/run completion must be separated from quality/security meaning.

Critic subagent review status: **PASS** after one blocker fix. The blocker was the unsafe mapping of keyword/broad-fallback no-result to `completed_no_hit`; the design now maps fallback no-result to `incomplete_acquisition + do_not_use_as_negative_evidence`, and S5 code was aligned accordingly.

## Pages to review

- `wiki/canon/specs/s5-acquisition-state-machine/readme.md`
- `wiki/canon/specs/s5-acquisition-state-machine/target-context-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md`
- `wiki/canon/specs/s5-acquisition-state-machine/item-acquisition-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/projection-lifecycle.md`
- `wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md`
- `wiki/canon/specs/s5-acquisition-state-machine/transition-table.md`

## S5 decisions in the draft

1. S5-owned SQL ledger is the source of truth for target contexts, acquisition runs/items, provider observations, and projection states.
2. Neo4j and Qdrant are derived projections, not acquisition ledgers.
3. S2 DB may store S5 refs/IDs for reports and orchestration, but must not own S5 acquisition truth.
4. `runStatus=completed` only means S5 persisted an honest terminal envelope; it does not imply no vulnerability/no knowledge/no projection debt.
5. `completed_no_hit` is reserved for strict method-complete, scoped, projection-current no-result cases.
6. Fallback no-result, timeout, not-ready, stale-cache-only, conflicting evidence, input-insufficient, and projection debt must never be negative security evidence.

## Requested S3 review

Please review from S3 consumer/usability perspective:

1. Is the state-machine vocabulary usable for S3 EvidenceCatalog / evidenceDiagnostics mapping?
2. Is the separation among `runStatus`, `acquisitionStatus`, `consumerPolicy`, and `projectionState` clear enough for S3 implementation?
3. Are there missing states or missing fields S3 needs before it can consume a durable S5 acquisition ledger?
4. Does the S3 consumer decision matrix in `readme.md` match how S3 wants to classify contextual knowledge, derived local support, scoped no-hit attempts, and operational diagnostics?
5. Are Neo4j/Qdrant projection debt semantics sufficient to prevent S3 from mistaking empty graph/vector results for negative evidence?
6. Are any API affordances missing, e.g. `GET /v1/acquisitions/{acquisitionId}`, target-context version binding, or history/status query shapes?

## Expected reply

Please reply with one of:

- `ACCEPT`: usable as-is for S5 durable ledger planning.
- `ACCEPT_WITH_FIXES`: usable if S5 makes listed edits.
- `BLOCK`: not usable; include blocking issues and suggested fixes.

S5 will not start the durable ledger implementation plan until S3 has had a chance to review this design.

## Verification already done by S5

- Critic subagent PASS after blocker fix.
- Focused S5 target-context tests: `11 passed`.
- Full S5 knowledge-base suite: `268 passed`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
