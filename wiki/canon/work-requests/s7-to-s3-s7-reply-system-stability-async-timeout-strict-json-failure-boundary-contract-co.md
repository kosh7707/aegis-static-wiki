---
title: "S7 reply — system-stability async/timeout/strict-JSON failure-boundary contract confirmed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co"
last_verified: "2026-04-25"
service_tags: ["s7", "llm-gateway", "llm-engine", "strict-json", "async-ownership"]
decision_tags: ["system-stability", "api-contract", "timeout", "async-ownership", "strict-json", "output-deficiency"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f.md", "wiki/canon/work-requests/s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/specs/llm-engine.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co"
wr_kind: "reply"
status: "open"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: []
registered_at: "2026-04-25T09:08:04.076Z"
---

# S7 reply — system-stability async/timeout/strict-JSON failure-boundary contract confirmed

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 reply — system-stability async/timeout/strict-JSON failure-boundary contract confirmed

## Summary

S7 confirms the S3 system-stability boundary for both WRs:

- Valid S3 input + live S7 dependency + model-output/schema/strict-JSON deficiency may be treated by S3 as `output_deficient` / recovery-triage material when S3 can assemble an honest schema-valid completed envelope.
- True S7 dependency/runtime failure remains task-level failure: backend unavailable, circuit open, hard timeout, cancellation, async retention expiry, or oversized/caller-invalid input.
- Canonical contract details were added to `wiki/canon/api/llm-gateway-api.md` under `S3 system-stability interpretation contract (2026-04-25)` and summarized in `wiki/canon/specs/llm-gateway.md`.

## Current S7 contract

### Sync `/v1/chat`

- OpenAI-compatible pass-through with Gateway model override to `Qwen/Qwen3.6-27B`.
- `X-Request-Id` is propagated to the LLM Engine and returned on responses; Gateway generates `gw-*` if absent.
- `X-Timeout-Seconds` is honored for read timeout; default/max is 1800s.
- Circuit breaker open and backend connect failure return HTTP 503 with `retryable=true`; hard timeout returns HTTP 504 with `retryable=true`.
- `X-AEGIS-Strict-JSON: true` is stable. Gateway forces `response_format={"type":"json_object"}` and `chat_template_kwargs.enable_thinking=false`, validates `choices[0].message.content` as a top-level JSON object, compact-normalizes success, and scrubs `message.reasoning` to `null`.
- Sync strict JSON violation returns HTTP 502 with machine-readable body: `error="Strict JSON contract violated"`, `errorDetail`, `retryable=true`, `strictJson=true`.

### Async ownership

- Submit: `POST /v1/async-chat-requests` returns `202 Accepted`, durable `requestId=acr_*`, `traceRequestId`, `statusUrl`, `resultUrl`, `cancelUrl`, and `expiresAt`.
- Status states are bounded to `queued | running | completed | failed | cancelled | expired`; `accepted` appears only in submit response.
- `queued`/`running` expose `localAckState`; `transport-only` means alive transport but progress-unproven.
- Terminal results/errors are retained for at least 15 minutes; expired result lookup returns explicit `410`.
- Async strict JSON failures become terminal `failed`, not `completed`, with `blockedReason="strict_json_contract_violation"`, `errorDetail`, and `retryable=true`.
- Async surface supersedes `X-Timeout-Seconds`; S3 should keep its own bounded polling deadline. S3's `llm_async_poll_deadline_ms=1740000` is compatible with S7's 1800s backend timeout envelope.

## Recommended S3 interpretation rules

| Condition | S3 interpretation |
|---|---|
| Backend unreachable/connect failure, circuit open, overload/retryable backend HTTP, hard timeout, cancellation, async retention expiry | dependency/runtime failure, not output deficiency |
| Input too large / request budget exceeded | caller-shaping/budget failure, not model output deficiency |
| Strict JSON violation after live backend response, malformed/non-object content, empty completion, schema/grounding failures after S7 retries | live-runtime output deficiency/recovery path if S3 can honestly assemble a schema-valid result envelope |

## Health/capability/trace gaps

- `/v1/health` exposes backend readiness, circuit-breaker state, concurrency, active request count, request summary, RAG state, and model profile names.
- `/v1/models` exposes profile/model identity and `contextLimit=131072`.
- Known gap: no explicit `costTier`, `queueDepth`, or queue-saturation percentage field currently exists. Use `activeRequestCount`, `llmConcurrency`, `circuitBreaker`, and async status as readiness signals.

## Fresh evidence (2026-04-25)

- `cd services/llm-gateway && .venv/bin/python -m pytest -q tests/test_contract_endpoints.py tests/test_async_chat_manager.py tests/test_contract_input_validation.py tests/test_registry.py` → `60 passed in 1.25s`.
- Gateway `/v1/health` → HTTP 200, `llmMode=real`, `modelProfiles=["Qwen/Qwen3.6-27B-default"]`, `llmBackend.status=ok`, `circuitBreaker.state=closed`, `activeRequestCount=0`, `llmConcurrency=4`.
- Gateway `/v1/models` → `modelName=Qwen/Qwen3.6-27B`, `contextLimit=131072`, `status=available`.
- DGX `~/qwen27-vllm health; ~/qwen27-vllm models` → `health_http=200`, served `id/root=Qwen/Qwen3.6-27B`, `max_model_len=131072`.
- Live strict JSON smoke through Gateway → HTTP 200, `content` parsed as JSON object `{"ok": true, "purpose": "wr-smoke"}`, `reasoning=None`.
- Live async strict JSON smoke → submit `202`, polls `running transport-only` then `completed`, result content parsed as JSON object `{"ok": true, "surface": "async"}`, `reasoning=None`.

## Completion handling

S7 is completing both original S3 WRs with this reply and the canonical API/spec updates above.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
