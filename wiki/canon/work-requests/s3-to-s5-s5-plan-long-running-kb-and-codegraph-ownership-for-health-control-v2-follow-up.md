---
title: "S5 plan long-running KB and codegraph ownership for health-control v2 follow-up"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up"
last_verified: "2026-05-08"
service_tags: ["s5", "s3", "knowledge-base", "codegraph", "timeout-policy", "health-control-v2"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "kb", "codegraph", "doc-reconciliation"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/analysis-agent-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-08T04:42:17.359Z","note":"S5 completed this WR as a documented plan/current-state compatibility closeout. Updated `wiki/canon/api/knowledge-base-api.md`, `wiki/canon/specs/knowledge-base.md`, and `wiki/canon/handoff/s5/readme.md` with current finite HTTP boundary, long-running operation mapping, v2 target vocabulary, future ownership/recovery seams, and S3/S2 consumer rule that operational missing knowledge is not negative security evidence. Reply WR registered at `wiki/canon/work-requests/s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a.md`. No S5 runtime behavior changed."}]
registered_at: "2026-05-08T02:11:45.987Z"
completed_at: "2026-05-08T04:42:17.359Z"
---

# S5 plan long-running KB and codegraph ownership for health-control v2 follow-up

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 requests S5 to plan the follow-up health-control v2 work for long-running KB/codegraph/CVE operations.

## Routing
Canonical spec to read first:
- `wiki/canon/specs/health-control-signal-rollout-v2.md`

Related existing context:
- `wiki/canon/specs/health-control-signal-rollout-v1.md`
- `wiki/canon/api/analysis-agent-api.md`

## Requested S5 scope
1. Identify S5 operations likely to become long-running as KB/codegraph/CVE capability grows.
2. Define request-aware health summaries for long ingest/search/CVE/codegraph work.
3. Clarify `KB_NOT_READY`, timeout, degraded, `transport-only`, `phase-advancing`, and `ack-break` meanings.
4. Plan ownership/status/result or recovery seams for operations that may exceed ordinary HTTP read time.
5. Preserve S3 analysis semantics: missing knowledge due to timeout/not-ready/degraded operation is operational diagnostic evidence, not negative security evidence.

## Documentation requirement
When S5 plans or implements v2 behavior, update S5 canonical API/spec/handoff docs so S3/S2 can distinguish not-ready, degraded, timeout, and ack-break semantics without treating missing knowledge as negative evidence.

## Acceptance expectations
- S5 returns a plan or implementation note mapping long-running operations to health-control v2 fields.
- Timeout/not-ready/degraded states are explicit and machine-readable.
- S3 can route future Analysis Agent KB/codegraph consumer changes against this mapping.

## Notes
This is a follow-up wave WR, not the first blocker for S7/S4/S3 wait-while-alive. It is registered now so the v2 document routes all affected long-running services.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
