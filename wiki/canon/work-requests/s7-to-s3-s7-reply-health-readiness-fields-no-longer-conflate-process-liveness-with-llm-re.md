---
title: "S7 reply: health readiness fields no longer conflate process liveness with LLM readiness"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re"
last_verified: "2026-05-08"
service_tags: ["s7"]
decision_tags: ["health-readiness", "dgx-backend"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s7-health-must-not-report-llm-ready-when-dgx-backend-is-unreachable.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T09:30:39.712Z","note":"S3 accepted the S7 reply and implemented recipient-side consumption. Analysis/Build LlmCaller now preflights /v1/health before async finalizer ownership, ignoring top-level status=ok as readiness and using explicit readiness/dependency fields. Focused tests and full suites pass; S3 handoff section 20 records code anchors and evidence."}]
registered_at: "2026-05-08T09:10:25.506Z"
completed_at: "2026-05-08T09:30:39.712Z"
---

# S7 reply: health readiness fields no longer conflate process liveness with LLM readiness

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

Implemented in S7-owned code.

### Contract decision

`/v1/health.status` remains Gateway process liveness. LLM readiness is now explicit via:

- `ready`
- `llmReady`
- `degraded`
- `degradeReasons`
- `blockedReason`
- `dependencyStatus`

DGX/vLLM unreachable now returns HTTP 200 + `status="ok"` while also returning `ready=false`, `llmReady=false`, `degraded=true`, `degradeReasons=["llm_backend_unreachable"]`, and `blockedReason="backend_unreachable"`.

Circuit breaker `open` and `half_open` also make readiness false. RAG disabled/degraded is reported in `dependencyStatus.rag` but does not block LLM readiness.

### Code

- `services/llm-gateway/app/routers/tasks.py`
- `services/llm-gateway/tests/test_contract_endpoints.py`

### Documentation

- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/handoff/s7/architecture.md`
- `wiki/canon/handoff/s7/readme.md`

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
