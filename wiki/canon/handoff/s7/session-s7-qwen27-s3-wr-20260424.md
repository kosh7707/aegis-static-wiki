---
title: "Session history — s7 / s7-qwen27-s3-wr-20260424"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/tmp/s7_strict_resp.json"
  - "/tmp/s7_tool_resp.json"
  - "/tmp/s7_async_result.json"
  - "services/llm-gateway/logs/llm-gateway-qwen36-27b-20260424.log"
original_path: "mcp://record_session_history/s7/s7-qwen27-s3-wr-20260424"
last_verified: "2026-04-24"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-qwen27-s3-wr-20260424

## Session
- Lane: s7
- Session ID: s7-qwen27-s3-wr-20260424
- Status: completed
- Started at: 2026-04-24T08:30:00Z
- Updated at: 2026-04-24T08:45:00Z

## Summary
Processed S3→S7 WR for Qwen3.6 rollout semantics. Confirmed live DGX Engine and Gateway audit surfaces expose Qwen/Qwen3.6-27B / Qwen/Qwen3.6-27B-default with contextLimit/max_model_len 131072; verified strict JSON, tool-call, async strict JSON, and full S7 pytest. Updated canonical S7 Gateway spec/API/handoff pages with model identity, thinking/strict JSON behavior, qwen3_coder tool-call parser, effective limits, timeout guidance, and async compatibility.

## Related pages
- [[wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md]]
- [[wiki/canon/specs/llm-gateway.md]]
- [[wiki/canon/api/llm-gateway-api.md]]
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md]]

## Test evidence

### 2026-04-24T08:42:50.186Z — passed
- Command: `curl http://10.126.37.19:8000/v1/models && curl http://10.126.37.19:8000/health`
- Log ref: manual-smoke-2026-04-24-engine-models-health
- Engine direct /v1/models returned id/root Qwen/Qwen3.6-27B with max_model_len 131072.
- Engine direct /health returned HTTP 200.

### 2026-04-24T08:42:50.209Z — passed
- Command: `curl http://localhost:8000/v1/models && curl http://localhost:8000/v1/health`
- Log ref: manual-smoke-2026-04-24-gateway-models-health
- Gateway /v1/models returned profileId Qwen/Qwen3.6-27B-default, modelName Qwen/Qwen3.6-27B, contextLimit 131072.
- Gateway /v1/health returned modelProfiles ['Qwen/Qwen3.6-27B-default'] and llmBackend status ok.

### 2026-04-24T08:42:50.238Z — passed
- Command: `POST /v1/chat with X-AEGIS-Strict-JSON: true`
- Log ref: /tmp/s7_strict_resp.json
- Strict JSON smoke returned HTTP 200, X-Model Qwen/Qwen3.6-27B, X-AEGIS-Strict-JSON applied.
- choices[0].message.content parsed as {'ok': True, 'model': 'qwen27'}; no <think> content; reasoning was null.
- Gateway latency header was 4975ms.

### 2026-04-24T08:42:50.266Z — passed
- Command: `POST /v1/chat tool-call smoke with OpenAI tools schema`
- Log ref: /tmp/s7_tool_resp.json
- Gateway returned HTTP 200, X-Model Qwen/Qwen3.6-27B.
- finish_reason was tool_calls; message.content was null; message.tool_calls[0].function.arguments was JSON string {'city':'Seoul'}.
- Gateway latency header was 6274ms.

### 2026-04-24T08:43:03.960Z — passed
- Command: `POST /v1/async-chat-requests with X-AEGIS-Strict-JSON: true; poll status; GET result`
- Log ref: /tmp/s7_async_result.json
- Async submit returned requestId acr_0cb46f2d1ca9431c and accepted status.
- Status reached completed; resultReady true; expiresAt 15 minutes after completion.
- Result wrapped /v1/chat response with model Qwen/Qwen3.6-27B; content parsed as {'async': True, 'ok': True}; reasoning was null.

### 2026-04-24T08:43:03.980Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m pytest -q`
- Log ref: pytest-2026-04-24-s7-full
- 235 passed in 6.19s after Qwen/Qwen3.6-27B default/config/model registry updates.
