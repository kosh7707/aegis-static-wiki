---
title: "S3 requires thinking-on LLM Gateway semantics for hotN; clarify/remove S7 thinking-off overrides"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin"
last_verified: "2026-04-28"
service_tags: ["s3", "s7", "llm-gateway", "analysis-agent", "strict-json", "thinking-mode"]
decision_tags: ["qwen3.6", "thinking-on", "strict-json", "hotn-readiness", "api-contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/specs/llm-engine.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-requires-thinking-on-llm-gateway-semantics-for-hotn-clarify-remove-s7-thinkin"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-28T05:58:29.241Z","note":"Completed on 2026-04-28. S7 Gateway now defaults effective chat_template_kwargs.enable_thinking to true for /v1/chat, /v1/async-chat-requests, and /v1/tasks real-client path; absent/malformed values are normalized to true. Strict JSON no longer forces thinking off; it still enforces response_format=json_object and final content JSON-object validation/normalization, with caller-facing reasoning scrubbed and original exchange logged. /v1/chat success responses expose X-AEGIS-Effective-Thinking, and llm_exchange logs include effectiveThinking. Docs updated in llm-gateway API/spec, llm-engine spec, S7 readme, and S7 architecture. Evidence: full S7 pytest 239 passed, py_compile passed, live thinking-on smoke HTTP 200 produced AEGIS_OK with reasoning present, live strict JSON thinking-on smoke HTTP 200 produced compact JSON with X-AEGIS-Effective-Thinking=true. Session evidence: wiki/canon/handoff/s7/session-s7-thinking-default-true-20260428.md"}]
registered_at: "2026-04-28T05:43:05.174Z"
completed_at: "2026-04-28T05:58:29.241Z"
---

# S3 requires thinking-on LLM Gateway semantics for hotN; clarify/remove S7 thinking-off overrides

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S3 is preparing certificate-maker hotN/hot20. During preflight, we found that current live and documented S7 behavior contains multiple thinking-off assumptions that conflict with the current research/runtime requirement that Qwen reasoning should stay enabled for S3 analysis-quality paths.

This is not only an S3 local caller issue. S3 will remove its own `/no_think`/`enable_thinking=false` defaults where S3 owns them, but S7 still owns the Gateway/Engine contract for effective thinking mode, strict JSON, async ownership, and response diagnostics.

## Fresh S3 observations

- `GET /v1/health` on S7 Gateway returned `status=ok`, backend `http://10.126.37.19:8000` `status=ok`, circuit breaker `closed`, active requests `0`.
- `GET /v1/models` returned `Qwen/Qwen3.6-27B`, `contextLimit=131072`, profile available.
- Direct non-thinking smoke with `/no_think` and `chat_template_kwargs.enable_thinking=false` returned `content='AEGIS_OK'` quickly, but S3 now treats that as an invalid hotN preflight because it does not reflect required thinking-on behavior.
- Explicit thinking-on smoke (`chat_template_kwargs.enable_thinking=true`, no `/no_think`, `max_tokens=256`) returned HTTP 200 with `message.reasoning` present but `message.content` empty and `finish_reason=length`; i.e. thinking-on needs appropriate token budgets and final-answer handling.
- Repository/docs inspection shows S7 strict JSON mode currently forces `chat_template_kwargs.enable_thinking=false`, and canonical S7 docs state strict JSON disables thinking.

## Contract conflict to resolve

Existing S7 docs/code say strict JSON mode injects:

```json
{"chat_template_kwargs": {"enable_thinking": false}}
```

and scrubs `message.reasoning`.

S3's current hotN direction requires thinking-enabled analysis-quality behavior. If S7 continues to force thinking off in strict JSON / task paths, S3 cannot honestly claim that hot20 validates the intended reasoning path.

## Requested S7 action

Please decide and document the effective S7 policy for Qwen3.6 thinking mode, then update code/docs/tests accordingly.

Preferred outcome:

1. Gateway must not silently force `enable_thinking=false` for S3-owned quality/deep-analysis paths.
2. `/v1/chat` and `/v1/async-chat-requests` should preserve caller-supplied `chat_template_kwargs.enable_thinking=true` unless an explicit, documented exception applies.
3. If strict JSON can support thinking-on, update strict JSON to support it with sufficient token budget guidance and parseable final content guarantees.
4. If strict JSON cannot support thinking-on safely, document that exception explicitly and expose it as an effective-mode diagnostic so S3 can treat strict-finalizer calls as a separate non-thinking mechanical finalization step, not as evidence of analysis-quality reasoning.
5. Add/confirm Gateway diagnostics showing effective thinking mode per request, ideally in logs/audit and optionally health/model-profile docs.
6. Provide a live thinking-on smoke with adequate `max_tokens` that returns non-empty final content and records whether reasoning is separated into `message.reasoning`.

## S3-owned parallel work

S3 will separately remove/adjust S3-local defaults such as:

- `services/analysis-agent/app/agent_runtime/llm/caller.py` default `enable_thinking=False`;
- `services/build-agent/app/agent_runtime/llm/caller.py` default `enable_thinking=False`;
- S3 prompt-builder `/no_think` suffixes where they affect hotN/deep-analysis quality paths;
- S3 eval/hotN request bodies that explicitly disable thinking.

This WR is only for the S7-owned Gateway/Engine contract and runtime diagnostics.

## Acceptance evidence requested

- Updated `wiki/canon/api/llm-gateway-api.md`, `wiki/canon/specs/llm-gateway.md`, and/or `wiki/canon/specs/llm-engine.md` describing effective thinking semantics.
- Focused S7 tests for preserving/overriding `chat_template_kwargs.enable_thinking` as documented.
- Live smoke evidence for `enable_thinking=true` with Qwen/Qwen3.6-27B showing final content is produced under adequate token budget.
- If strict JSON remains thinking-off, a clear statement that this is a mechanical finalization exception, not the analysis reasoning path.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
