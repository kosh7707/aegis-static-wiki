---
title: "S7: unblock TraceAudit live smoke with async chat, request observability, and profile passthrough"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s7-unblock-traceaudit-live-smoke-with-async-chat-request-observability-and-profi"
last_verified: "2026-05-21"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "dgx-spark", "traceaudit-paper", "observability"]
decision_tags: ["async-chat", "x-request-id", "hyperparameters", "response-format", "tool-calls", "live-smoke"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md", "wiki/canon/handoff/s7/llm-gateway-api.md", "wiki/canon/handoff/s7/llm-engine-ops.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s7-unblock-traceaudit-live-smoke-with-async-chat-request-observability-and-profi"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-21T02:07:49.708Z","note":"S7 side unblocked the requested contract: async chat is the documented long-running route; paper-controls validation/forwarding preserves generation/profile/schema fields; prompt-redacted exchange observability with request/trace IDs and hashes is implemented; fake-backend tests and DGX probes were recorded. Follow-up live smoke execution is now S3-owned using the new contract."}]
registered_at: "2026-05-20T09:31:53.135Z"
completed_at: "2026-05-21T02:07:49.708Z"
---

# S7: unblock TraceAudit live smoke with async chat, request observability, and profile passthrough

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7: unblock TraceAudit live smoke with async chat, request observability, and profile passthrough

## Summary
S3 agrees that S7-side work should land before the next LLM-backed TraceAudit live smoke. The previous certificate-maker run reached S4 and S5 successfully, then stalled at the first S3→S7 `/v1/chat` call. Because no model response arrived, S3 could not evaluate tool-call behavior or claim/evidence quality.

## Requested S7 work before next live smoke

### 1. Long-running paper calls must use a supported no-false-timeout path
- Provide or confirm the paper-safe `/v1/async-chat-requests` path for long DGX Qwen3.6 calls.
- S3 expects long calls to wait while the service is alive rather than failing due to a fixed sync read timeout.
- If sync `/v1/chat` remains finite-timeout by design, document that S3 must use async for paper live runs.

### 2. Add request-level observability for `/v1/chat` and async chat
S7 should emit requestId-correlated logs for:
- inbound request start: `requestId`, model, message count, content length, `max_tokens`, sampling tuple, `chat_template_kwargs`, `tool_choice`, tool count/names, response_format/strict-json mode;
- backend forward start: backend URL/path, propagated requestId/header, payload size, selected endpoint mode;
- backend completion/error: status, elapsedMs, first-byte/stream/completion phase if available, exception class, abort cause;
- active request health: active request count and per-request phase (`queued`, `backend_wait`, `generating`, `streaming`, `completed`, `failed`) with elapsedMs.

### 3. Preserve/forward paper generation profile fields
S7 should verify and document which fields survive to vLLM 0.20.0 through the DGX path:
- `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `max_tokens`, `seed`;
- `chat_template_kwargs.enable_thinking`;
- `chat_template_kwargs.preserve_thinking` if supported, but S3 does not request it as default;
- `tools` and `tool_choice=auto` for acquisition calls.

### 4. Do not silently degrade schema/response format
- If S3 sends `response_format={"type":"json_object"}`, forward it as such.
- If S3 later sends `json_schema` / structured output, S7 should either preserve/translate it or return an explicit unsupported error.
- Avoid silently overwriting caller intent in a way that makes S3 think schema enforcement was active when it was not.

### 5. Tool-call readiness evidence
Before S3 reruns certificate-maker live smoke, S7 should provide one of:
- fake-backend test evidence showing tools/tool_choice survive S7 forwarding; or
- live DGX captured-exchange evidence showing a request with tools reaches the backend shape expected by vLLM/Qwen.

## S3 stance
- S3 will keep Qwen official sampling values as the paper baseline.
- S3 will not enable `preserve_thinking` by default.
- S3 will treat `seed` as a requested reproducibility field, not as a guarantee of complete determinism.
- S3 will move paper live calls to async once S7 confirms the contract.

## Completion expectation
Please reply with the implemented/verified API behavior, any unsupported fields, and the exact evidence path/log references S3 should inspect before the next live smoke.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
