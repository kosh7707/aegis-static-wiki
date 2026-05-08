---
title: "S7 task-level ownership contract needed for S2 direct LlmTaskClient health-control v2 consumption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr"
last_verified: "2026-05-08"
service_tags: ["s2", "s7", "llm-gateway", "health-control-v2", "task-api"]
decision_tags: ["health-control-v2", "async-ownership", "cancel"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr"
wr_kind: "request"
status: "open"
from_lane: "s2"
to_lanes: ["s7"]
completed_by: []
registered_at: "2026-05-08T04:06:38.099Z"
---

# S7 task-level ownership contract needed for S2 direct LlmTaskClient health-control v2 consumption

## Summary
- Kind: request
- From: s2
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S7 now exposes `/v1/async-chat-requests`, but S2's direct `LlmTaskClient` consumes S7 `/v1/tasks` for dynamic annotate/test-plan/report-style task calls. S2 cannot migrate that direct task path to durable wait-while-alive ownership without a task-level status/result/cancel contract or an approved replacement surface.

## Current S2 behavior
- S2 sends the full caller-owned generation tuple to S7 `/v1/tasks`.
- S2 forwards request IDs to S7 `/v1/health?requestId=...` for aggregate progress/control visibility.
- S2 treats `/v1/tasks` as a finite compatibility surface; it does not reinterpret `/v1/async-chat-requests` as a task result API because that endpoint returns raw chat responses, not S7 task envelopes.

## Requested S7 decision
Please provide one of:
1. a durable S7 task ownership surface for `/v1/tasks` semantics (status/result/cancel) that returns `TaskResponse` envelopes; or
2. a documented migration path for S2 task callers to use an async endpoint without losing task schema/prompt semantics; or
3. an explicit statement that S2 direct `/v1/tasks` remains finite compatibility and health is progress-only for this path.

## Acceptance
- `wiki/canon/api/llm-gateway-api.md` states the selected model.
- If durable task ownership is selected, terminal `completed` remains an envelope result and not clean success; failed/cancelled/expired semantics align with health-control v2.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
