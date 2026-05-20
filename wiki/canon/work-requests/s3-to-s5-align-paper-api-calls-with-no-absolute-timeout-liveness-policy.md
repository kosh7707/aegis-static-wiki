---
title: "Align paper API calls with no-absolute-timeout liveness policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy"
last_verified: "2026-05-20"
service_tags: ["S3", "S5", "paper-path", "traceaudit"]
decision_tags: ["timeout-policy", "api-contract"]
related_pages: ["wiki/canon/handoff/s3/session-traceaudit-50-dry-run-2026-05-20.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy"
wr_kind: "request"
status: "open"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: []
registered_at: "2026-05-20T01:12:50.945Z"
---

# Align paper API calls with no-absolute-timeout liveness policy

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request
S3 is changing the paper-path timeout policy away from fixed caller-side absolute timeouts. Please align S5 paper endpoints with the project policy:

> If the service is alive and the request is still progressing or health-check alive, the caller keeps waiting. Terminal timeout should not occur merely because S5 work exceeds a caller-side wall clock.

## S5 endpoints in scope
- `/v1/paper/code-kb/prepare`
- `/v1/paper/finding-context/retrieve`
- `/v1/paper/threat-context/generic`

## Requested S5 contract
Please specify or implement how S3 should consume long-running S5 paper calls:

1. Durable ownership / async status+result endpoints; or
2. heartbeat/streaming liveness; or
3. explicit endpoint-level guarantee that paper calls are bounded and caller read timeout is only a transport fallback, not a semantic terminal timeout.

## S3-side assumption for now
S3 will remove fixed absolute read deadlines as the paper-path correctness mechanism. If S5 paper calls remain synchronous, S3 may use no-read-timeout compatibility mode while waiting for a first-class liveness contract.

## Non-goal
S5 timeout/no-hit/diagnostic surfaces must remain operational/contextual diagnostics only, not security evidence.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
