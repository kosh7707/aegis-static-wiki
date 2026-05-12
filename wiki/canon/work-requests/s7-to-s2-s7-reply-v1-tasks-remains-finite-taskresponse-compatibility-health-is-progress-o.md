---
title: "S7 reply: /v1/tasks remains finite TaskResponse compatibility; health is progress-only"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s2-s7-reply-v1-tasks-remains-finite-taskresponse-compatibility-health-is-progress-o"
last_verified: "2026-05-11"
service_tags: ["s7"]
decision_tags: ["task-ownership", "health-control-v2"]
related_pages: ["wiki/canon/work-requests/s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s2-s7-reply-v1-tasks-remains-finite-taskresponse-compatibility-health-is-progress-o"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-11T00:46:58.206Z","note":"S2 reviewed and accepted the S7 reply. S2 canonical docs already state that direct S2→S7 /v1/tasks remains finite compatibility, /v1/health is progress/control visibility only, and S2 does not claim durable status/result/cancel consumption until an owner contract exists. Evidence checked in wiki/canon/handoff/s2/readme.md, wiki/canon/handoff/s2/api-endpoints.md, wiki/canon/specs/backend.md, and current LlmTaskClient endpoint usage."}]
registered_at: "2026-05-08T09:10:40.434Z"
completed_at: "2026-05-11T00:46:58.206Z"
---

# S7 reply: /v1/tasks remains finite TaskResponse compatibility; health is progress-only

## Summary
- Kind: reply
- From: s7
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S7 selected the explicit finite-compatibility model for current S2 direct `LlmTaskClient` consumption.

### Contract decision

- `/v1/tasks` remains the finite synchronous `TaskResponse` envelope surface.
- S7 does not currently expose durable `/v1/tasks/{id}/status`, `/v1/tasks/{id}/result`, or `/v1/tasks/{id}/cancel` semantics.
- `POST /v1/tasks` terminal success/failure is returned in the HTTP response body and is not retained as a durable task envelope after the in-flight tracker is cleared.
- `/v1/health?requestId=...` is active progress/control visibility only; it is not result recovery and does not preserve completed/failed `/v1/tasks` history.
- `/v1/async-chat-requests` is durable ownership for OpenAI-compatible chat payloads, not a drop-in replacement for `/v1/tasks` TaskResponse envelopes.
- A future reconnect-safe durable TaskResponse surface should be distinct, e.g. `/v1/async-tasks`, rather than changing current `/v1/tasks` semantics in place.

### Documentation updated

- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/handoff/s7/architecture.md`
- `wiki/canon/handoff/s7/readme.md`

### Related implementation

The same pass added machine-readable `/v1/health` readiness fields so S2/S3 callers can distinguish process liveness from LLM backend readiness.

### Verification

- `cd services/llm-gateway && .venv/bin/python -m pytest -q tests/test_contract_endpoints.py::TestHealthEndpoint tests/test_request_tracker.py tests/test_async_chat_manager.py` → 24 passed
- `cd services/llm-gateway && .venv/bin/python -m pytest -q` → 306 passed
- `cd /home/kosh/aegis-static-wiki && npm test` → 8 passed
- Critic subagent review → APPROVE

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
