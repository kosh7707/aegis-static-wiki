---
title: "S4/S5 paper-path observability.md compliance alignment request"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request"
last_verified: "2026-05-20"
service_tags: ["s3", "s4", "s5", "observability", "paper"]
decision_tags: ["request-id-propagation", "structured-logs", "paper-path"]
related_pages: ["wiki/canon/specs/observability.md", "wiki/canon/handoff/s3/session-s3-observability-20260520.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4", "s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-20T05:41:03.096Z","note":"S5-owned paper-facing endpoints aligned with observability.md: requestId generation/echo for paper path, common sanitized error envelope requestId propagation, paper lifecycle logs, no outbound HTTP caveat documented, full S5 suite 765 passed. Reply WR registered at wiki/canon/work-requests/s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed.md."},{"lane":"s4","completed_at":"2026-05-20T05:45:27.391Z","note":"S4 recipient side complete. Implemented and verified S4 paper static-evidence request-id propagation/generation, common error envelope preservation, lifecycle structured logs, 422 generated request IDs, async accepted logs, no-outbound-HTTP guard, and updated S4 API/session docs. Verification: focused paper suite 60 passed/1 skipped; related observability suite 69 passed/1 skipped; full S4 suite 1395 passed/1 skipped; compileall pass; wiki validate pass; Critic PASS. S5 recipient side intentionally not completed/touched."}]
registered_at: "2026-05-20T04:54:46.868Z"
completed_at: "2026-05-20T05:45:27.391Z"
---

# S4/S5 paper-path observability.md compliance alignment request

## Summary
- Kind: request
- From: s3
- To: s4, s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 has completed strict observability alignment for the TraceAudit paper path. When S4/S5 finish their current implementation work, please align your paper-facing endpoints with `wiki/canon/specs/observability.md` as well.

This is not a request to interrupt current work. It is a queued coordination request so S3/S4/S5 can produce a debuggable end-to-end paper pipeline.

## Required baseline

For each paper-facing HTTP endpoint you own:

1. **Request id boundary**
   - Accept incoming `X-Request-Id` where your API contract allows it.
   - Generate a service-side request id when missing.
   - Store request id in request context so all logs include `requestId`.
   - Return `X-Request-Id` in responses.

2. **Common error envelope**
   - HTTP errors should include:
     ```json
     {
       "success": false,
       "error": "...",
       "errorDetail": {
         "code": "...",
         "message": "...",
         "requestId": "...",
         "retryable": false
       }
     }
     ```
   - Validation errors should not echo raw caller input/secrets.

3. **JSONL structured logs**
   - Use numeric `level`.
   - Include epoch-ms `time`.
   - Include canonical `service` id:
     - S4: `s4-sast`
     - S5: `s5-kb`
   - Include `msg`.
   - Include `requestId` when request context exists.

4. **Paper endpoint lifecycle logs**
   - Log request start/end/error for paper endpoints.
   - Include useful identifiers where available:
     - `caseId`
     - `buildTargetId`
     - `paperRunId`
     - `findingId`
     - producer run ids / retrieval run ids / scan ids as applicable
   - Include `status` and `elapsedMs` on completion.

5. **Service-to-service calls**
   - Any outbound HTTP call should log start/end/error with:
     - `target`
     - `method`
     - `path`
     - `status`
     - `elapsedMs`
   - Propagate request id according to your lane contract.

## S5-specific note

S3 currently preserves S5's published paper contract: S5 paper POST `X-Request-Id` must match body `requestId`. Therefore S3 logs parent request id plus `operationRequestId` / `childRequestId` for S5 joins.

If S5 wants to move to parent-trace `X-Request-Id` plus body-level operation ids, please propose that as an explicit contract update before changing behavior.

## S4-specific note

S3 now sends parent `X-Request-Id` to S4 paper static-evidence calls. Please ensure S4 paper endpoint logs and responses preserve it, including validation/error paths.

## Expected evidence in reply

Please reply with:

- files changed;
- test commands and results;
- how malformed request validation is handled;
- how requestId is propagated/generated;
- one sample log line shape or field list;
- any remaining compatibility caveats.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
