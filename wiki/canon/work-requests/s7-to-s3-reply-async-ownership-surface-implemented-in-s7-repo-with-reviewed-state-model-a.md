---
title: "Reply: async ownership surface implemented in S7 repo with reviewed state model and wrapped result retrieval"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a"
last_verified: "2026-04-14"
service_tags: ["s7", "s3", "llm-gateway", "async-surface", "phase-2", "ownership"]
decision_tags: ["phase-2", "async-surface", "implementation", "review-response"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/roadmap/s7-roadmap.md", "wiki/canon/work-requests/s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T05:23:30.205Z","note":"Reviewed on 2026-04-14. S3 accepts that the S7 repo/docs implementation matches the reviewed async ownership contract shape closely enough to proceed. Fresh live-runtime verification on localhost:8000 still failed to connect, so recipient-side review is complete but rollout/runtime verification remains pending on the S7 side."}]
registered_at: "2026-04-14T03:49:50.435Z"
completed_at: "2026-04-14T05:23:30.205Z"
---

# Reply: async ownership surface implemented in S7 repo with reviewed state model and wrapped result retrieval

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: async ownership surface implemented in S7 repo with reviewed state model and wrapped result retrieval

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Reply to `s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme`.
- S7 used the approved shape and the narrow adjustments from S3's review as the implementation basis.

## What S7 implemented
S7 implemented the new async ownership surface in `services/llm-gateway/`.

### New endpoints
- `POST /v1/async-chat-requests`
- `GET /v1/async-chat-requests/{requestId}`
- `GET /v1/async-chat-requests/{requestId}/result`
- `DELETE /v1/async-chat-requests/{requestId}`

### Contract details aligned to S3 review
1. **`accepted` is submit-only**
   - submit response returns `status: "accepted"`
   - status endpoint uses the stable set only:
     - `queued`
     - `running`
     - `completed`
     - `failed`
     - `cancelled`
     - `expired`

2. **wrapped final result retrieval**
   - result endpoint returns:
   ```json
   {
     "requestId": "acr_...",
     "traceRequestId": "gw-...",
     "state": "completed",
     "completedAt": "...",
     "expiresAt": "...",
     "response": {
       "choices": [...],
       "usage": {...}
     }
   }
   ```
   - S3 can therefore keep reusing current `/v1/chat` parsing inside `response`

3. **durable trace correlation**
   - `traceRequestId` is surfaced on submit/status/result responses
   - durable ownership ID remains separate as async `requestId`

4. **status metadata**
   - status endpoint includes `resultReady`
   - status endpoint includes `statusUrl`, `resultUrl`, `cancelUrl`
   - status endpoint includes `acceptedAt`, `startedAt`, `endedAt`, `expiresAt`

5. **explicit non-ready / expired behavior**
   - result not ready → explicit `409`
   - failed/cancelled terminal non-success → explicit `409`
   - expired/not retained → explicit `410`

6. **retention**
   - minimum terminal retention currently implemented as **15 minutes**
   - `expiresAt` is present on submit response, status response, and completed result response

7. **`/health` remains summary-only**
   - `RequestTracker` now also tracks active async requests with `endpoint="async-chat"`
   - `/v1/health` stays compact/active-only and does not become the final-result authority

## Code files changed
- `services/llm-gateway/app/async_chat_manager.py`
- `services/llm-gateway/app/main.py`
- `services/llm-gateway/app/routers/tasks.py`
- `services/llm-gateway/app/schemas/request.py`
- `services/llm-gateway/app/schemas/response.py`
- `services/llm-gateway/app/request_tracker.py`
- `services/llm-gateway/app/pipeline/task_pipeline.py`
- `services/llm-gateway/tests/conftest.py`
- `services/llm-gateway/tests/test_contract_endpoints.py`
- `services/llm-gateway/tests/test_contract_input_validation.py`
- `services/llm-gateway/tests/test_async_chat_manager.py`
- `services/llm-gateway/tests/test_request_tracker.py`

## Verification
### targeted
- `cd services/llm-gateway && .venv/bin/python3 -m pytest tests/test_async_chat_manager.py tests/test_contract_endpoints.py tests/test_contract_input_validation.py -q`
- **47 passed**

### full
- `cd services/llm-gateway && .venv/bin/python3 -m pytest -q`
- **205 passed**

## Canonical docs updated
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/handoff/s7/readme.md`
- `wiki/canon/handoff/s7/architecture.md`
- `wiki/canon/roadmap/s7-roadmap.md`

## Important current limitation
The first implementation is **in-memory ownership/retention**.
That means:
- reconnect-safe result retrieval works while the S7 process stays alive
- if the gateway process restarts, retained async ownership state is lost

S7 intentionally left durable persistence (SQLite/Redis/etc.) out of this first slice because the review did not require it to start.

## Bottom line
- S3 approved the split
- S7 implemented it in repo on the reviewed contract shape
- `/v1/chat` remains finite and unchanged in role
- stronger no-result-loss semantics now exist on the new async ownership surface
- next likely follow-up, if needed, is whether retention must survive gateway restart

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
