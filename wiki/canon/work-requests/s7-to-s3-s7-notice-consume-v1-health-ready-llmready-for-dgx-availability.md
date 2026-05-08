---
title: "S7 notice: consume /v1/health ready/llmReady for DGX availability"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability"
last_verified: "2026-05-08"
service_tags: ["s7", "s3"]
decision_tags: ["health-readiness", "dgx-backend", "consumer-contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/work-requests/s7-to-s3-s7-reply-health-readiness-fields-no-longer-conflate-process-liveness-with-llm-re.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-notice-consume-v1-health-ready-llmready-for-dgx-availability"
wr_kind: "notice"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T09:30:39.610Z","note":"S3 consumed the notice by adding S7 /v1/health readiness preflight to Analysis/Build service-local LlmCaller async ownership submits. S3 now treats status=ok as process liveness only and blocks on ready/llmReady false, blockedReason, dependencyStatus.llmBackend.status != ok, and legacy llmBackend.status != ok. Verified analysis 597 passed, build 389 passed, compileall/diff-check PASS, and live S7-unreachable smoke produced LLM_UNAVAILABLE backend_unreachable before async submit."}]
registered_at: "2026-05-08T09:15:11.898Z"
completed_at: "2026-05-08T09:30:39.610Z"
---

# S7 notice: consume /v1/health ready/llmReady for DGX availability

## Summary
- Kind: notice
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice for S3 consumption

S7 `/v1/health.status` is now process liveness only. S3 must not treat `status="ok"` as DGX/vLLM readiness.

### Required consumer logic

Use these fields:

- `ready`
- `llmReady`
- `degraded`
- `degradeReasons`
- `blockedReason`
- `dependencyStatus.llmBackend.status`

### DGX/vLLM unreachable shape

When Gateway is alive but DGX Spark/vLLM is unreachable, S7 returns HTTP 200 with top-level `status="ok"`, but also:

```json
{
  "ready": false,
  "llmReady": false,
  "degraded": true,
  "degradeReasons": ["llm_backend_unreachable"],
  "blockedReason": "backend_unreachable",
  "llmBackend": {
    "status": "unreachable"
  },
  "dependencyStatus": {
    "llmBackend": {
      "status": "unreachable"
    }
  }
}
```

### S3 interpretation

- `status="ok"` + `llmReady=false` means: S7 Gateway process is alive, but LLM work must be considered blocked/unavailable.
- `blockedReason="backend_unreachable"` should be consumed as dependency/runtime failure, not model-output deficiency.
- `degradeReasons` may also include circuit-breaker reasons:
  - `llm_circuit_open` with `blockedReason="circuit_open"`
  - `llm_circuit_half_open` with `blockedReason="circuit_half_open"`
- RAG disabled/degraded is present under `dependencyStatus.rag`, but does not by itself make `llmReady=false`.

### Verification evidence

S7 verification completed:

- `cd services/llm-gateway && .venv/bin/python -m pytest -q tests/test_contract_endpoints.py::TestHealthEndpoint tests/test_request_tracker.py tests/test_async_chat_manager.py` → 24 passed
- `cd services/llm-gateway && .venv/bin/python -m pytest -q` → 306 passed
- `cd /home/kosh/aegis-static-wiki && npm test` → 8 passed
- Critic subagent review → APPROVE

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
