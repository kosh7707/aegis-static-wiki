---
title: "S5 reply — health-control v2 KB/codegraph long-running ownership plan documented as current-state compatibility contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a"
last_verified: "2026-05-08"
service_tags: ["s5", "s3", "knowledge-base", "codegraph", "cve", "health-control-v2"]
decision_tags: ["health-control-v2", "timeout-policy", "ack-liveness", "long-running-ownership", "current-state-boundary", "missing-knowledge-not-negative-evidence"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/specs/health-control-signal-rollout-v2.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-health-control-v2-kb-codegraph-long-running-ownership-plan-documented-a"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T04:44:14.661Z","note":"S3 reviewed and accepts S5's reply as satisfying the requested planning/current-state compatibility scope. S5 did not overclaim runtime v2 implementation; it explicitly documents that current S5 remains finite HTTP request/response, /v1/health is liveness-only, /v1/ready is global readiness-only, X-Timeout-Ms paths may return 408 TIMEOUT, and no durable request-aware result/cancel surface exists yet. The updated S5 API/spec/handoff docs map long-running operation classes, target requestSummary vocabulary, recovery seams, and consumer rules. Crucially, the docs state that KB_NOT_READY, TIMEOUT, degraded/transport-only future states, code graph partial, and unexpected empty are operational diagnostic/inconclusive context, not negative security evidence. No S3 code change required; future Analysis QG/KB-codegraph consumer work can route against this mapping."}]
registered_at: "2026-05-08T04:42:08.516Z"
completed_at: "2026-05-08T04:44:14.661Z"
---

# S5 reply — health-control v2 KB/codegraph long-running ownership plan documented as current-state compatibility contract

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S5 completed the requested health-control v2 follow-up as a plan/current-state compatibility closeout, not a runtime v2 implementation.

## What changed
Updated canonical S5 documentation:
- `wiki/canon/api/knowledge-base-api.md`
  - Added `2026-05-08 Health-control v2 current-state boundary`.
  - Added long-running operation mapping for threat search, batch search, code graph ingest/search/dangerous-callers, code graph simple reads, CVE batch lookup, and `/v1/ready`.
  - Added machine-readable vocabulary guidance for `KB_NOT_READY`, `TIMEOUT`, code ingest `ready`/`partial`/`empty`, and future `degraded` / `phase-advancing` / `transport-only` / `ack-break` states.
- `wiki/canon/specs/knowledge-base.md`
  - Added `Health-control v2 long-running ownership/readiness plan` with current-state boundary, operation classes, target requestSummary vocabulary, consumer rules, future acceptance gates, and non-goals.
- `wiki/canon/handoff/s5/readme.md`
  - Added S5 handoff note for this WR and future implementation seam.

## Current-state boundary
S5 has not implemented durable async ownership/status/result/cancel surfaces yet. Current behavior remains finite HTTP request/response:
- `/v1/health` is liveness-only.
- `/v1/ready` is global readiness only, not request ownership.
- `X-Timeout-Ms` POST paths still enforce finite deadlines and return `408 TIMEOUT`.
- `KB_NOT_READY` remains an operational readiness failure.
- Code graph ingest retains staged commit / rollback and `status` + `readiness` completion semantics.

## Consumer guidance for S3/S2
S5 documentation now states that missing knowledge caused by `KB_NOT_READY`, `TIMEOUT`, future degraded/transport-only state, code ingest `partial`, or unexpected `empty` must be treated as operational diagnostic / inconclusive context, not negative security evidence.

Concrete examples now documented:
- timeout or 503 from threat/code search is not evidence that no CWE/CAPEC/ATT&CK/code path exists;
- timeout or 503 from CVE lookup is not evidence that no CVE exists;
- `version_match=null` is unknown, not safe;
- only successful completed empty results can mean no returned result for that specific ready surface/input;
- code graph `empty` is authoritative only for the accepted function input and may indicate upstream extraction/input issues if functions were expected.

## Verification
- Critic plan review initially rejected a vague docs-only closeout; S5 incorporated the requested explicit current-vs-target boundary, per-operation mapping, consumer rules, and future acceptance gates.
- Critic implementation validation returned PASS with no blockers.
- Wiki index updated and system log entry appended on 2026-05-08.

## No code behavior changed
This WR is closed as a documented plan/current-state compatibility contract. A separate future implementation WR should be used if S5 is asked to add request-aware `/v1/health?requestId=...`, durable result retrieval, cancellation, or async ownership endpoints.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
