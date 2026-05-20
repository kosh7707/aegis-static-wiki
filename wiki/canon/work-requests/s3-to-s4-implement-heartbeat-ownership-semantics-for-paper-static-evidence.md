---
title: "Implement heartbeat/ownership semantics for paper static-evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence"
last_verified: "2026-05-20"
service_tags: ["S3", "S4", "paper-path", "traceaudit"]
decision_tags: ["timeout-policy", "api-contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-confirm-s4-handling-of-traceaudit-dry-run-retry-conditions.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-implement-heartbeat-ownership-semantics-for-paper-static-evidence"
wr_kind: "request"
status: "open"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: []
registered_at: "2026-05-20T01:12:50.851Z"
---

# Implement heartbeat/ownership semantics for paper static-evidence

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request
S3 is changing the paper-path timeout policy away from absolute HTTP read deadlines. Please align S4's `/v1/paper/static-evidence` contract with the project policy:

> If the service is alive and the request is still progressing or health-check alive, the caller keeps waiting. Terminal timeout should not occur merely because a long-running S4 scan exceeds a caller-side wall clock.

## Requested S4 contract
Please add or confirm one of the following for `/v1/paper/static-evidence`:

1. Durable ownership mode using `Prefer: respond-async` plus status/result endpoints compatible with existing S4 ownership semantics; or
2. NDJSON/heartbeat streaming with health polling; or
3. A formally specified S4 alternative that lets S3 distinguish alive/progressing from terminal failure without an absolute read timeout.

## S3-side assumption for now
S3 will stop using absolute read timeout as the correctness mechanism and will treat long-running paper static-evidence as allowed while the service remains alive. Until S4 provides a first-class status/result contract for paper static-evidence, S3 may use an indefinite synchronous fallback only as compatibility behavior.

## Non-goal
Do not reinterpret long duration as TP/FP/UNKNOWN evidence. This is purely operational liveness/stability policy.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
