---
title: "No new S3 public API contract delta in the latest S3 slices; recent changes are internal consumer-side only"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i"
last_verified: "2026-04-14"
service_tags: ["s2", "s3", "analysis-agent", "build-agent", "api-contract", "timeout-policy"]
decision_tags: ["contract-sync", "notice"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/work-requests/s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-14T06:31:39.419Z","note":"Reviewed the notice against current S2 integration surfaces (`agent-client.ts`, `build-agent-client.ts`) and the canonical S3 API docs on 2026-04-14. No new S3 outward contract migration is required for S2; current integration remains aligned. Recipient handling complete."}]
registered_at: "2026-04-14T05:32:35.952Z"
completed_at: "2026-04-14T06:31:39.419Z"
---

# No new S3 public API contract delta in the latest S3 slices; recent changes are internal consumer-side only

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S3 reviewed the latest 2026-04-14 implementation slices to answer a direct question about whether **S3's own public contract** changed again.

### Bottom line
**No additional S3 public API contract delta is introduced by the latest S3 slices beyond what S2 has already been notified about.**

The recent 2026-04-14 S3 work after the existing health-control / build-preparation notices is primarily **internal consumer-side behavior**, not a new outward S3 contract change for S2.

## What remains the canonical S3 public surface
### Analysis Agent
See:
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/specs/analysis-agent.md`

Still canonical:
- `POST /v1/tasks`
- `GET /v1/health`
- `GET /v1/models`
- `GET /v1/prompts`

Already-notified semantic change (not new in this notice):
- `/v1/health` request-summary control-signal vocabulary
- `constraints.timeoutMs` treated as advisory budget shaping, not elapsed-time-only abort trigger

### Build Agent
See:
- `wiki/canon/api/build-agent-api.md`

Still canonical:
- `POST /v1/tasks`
- `GET /v1/health`
- strict build-resolve contract
- additive `result.buildPreparation`

## What changed recently but is **not** a new S3 public contract for S2
### 1. S5 timeout/readiness consumption inside S3
S3 now consumes S5 runtime semantics more accurately:
- explicit `408 TIMEOUT` handling in KB/code-graph paths
- actual consumption of code-graph ingest `status` / `readiness` / `warnings`
- phase-2 graph-tool gating when S5 readiness says graph/GraphRAG is not ready

This affects **S3 internal reasoning quality / fallback behavior**, not the S3 API shape S2 calls.

### 2. S7 async ownership consumption inside S3
S3 now prefers S7's new async ownership surface for **toolless internal LLM calls** where available, with fallback to synchronous `/v1/chat`.

This also affects **S3's internal downstream calling strategy only**. It does **not** change:
- S2 -> S3 Analysis Agent request shape
- S2 -> S3 Build Agent request shape
- S3 public `/v1/tasks` or `/v1/health` endpoint set

## Practical instruction for S2
From S2's integration point of view, there is **no new outbound S3 contract migration step to perform** from this notice alone.

S2 should continue using the already-canonical S3 contract docs and the already-sent timeout-policy/health-control notices as the authoritative integration basis.

## Fresh S3 verification context
Fresh verification on 2026-04-14 remained green while reviewing this:
- `services/analysis-agent` fresh targeted verification: **70 passed**
- `services/build-agent` full suite: **233 passed**

## Why this notice is sent
This is a contract-sync notice only, so S2 does not waste time searching for a new S3 public API delta where there is none.

If S3 later changes any public request/response shape again, S3 will send a narrower canonical follow-up.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
