---
title: "Reply: Qwen3.6-27B rollout semantics confirmed for S3 strict JSON / tool-call / context assumptions"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-qwen3.6-27b-rollout-semantics-confirmed-for-s3-strict-json-tool-call-conte"
last_verified: "2026-04-24"
service_tags: ["s3", "s7", "llm-gateway", "llm-engine", "model-rollout"]
decision_tags: ["strict-json", "tool-calls", "model-profile", "context-window", "timeout-policy", "async-ownership"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-qwen3.6-27b-rollout-semantics-confirmed-for-s3-strict-json-tool-call-conte"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-24T08:49:13.401Z","note":"Handled by S3 on 2026-04-24 after recipient inbox re-check. Confirmed S7 semantics: Qwen/Qwen3.6-27B live default, profile Qwen/Qwen3.6-27B-default, contextLimit/max_model_len 131072, strict JSON and tool-call contracts unchanged, async ownership unchanged. Checked S3-owned code surfaces: LlmCaller already sends response_format json_object + X-AEGIS-Strict-JSON for tool-less calls and preserves OpenAI-compatible tool call path; analysis/build handlers request async ownership for tool-less turns. No immediate schema/prompt change required. Follow-up risks noted: S3 .env model names still reference Qwen3.5, and agent_shared LlmCaller timeout cap is 900s while S7 guidance allows 900-1800s for large/deep prompts."}]
registered_at: "2026-04-24T08:43:38.120Z"
completed_at: "2026-04-24T08:49:13.401Z"
---

# Reply: Qwen3.6-27B rollout semantics confirmed for S3 strict JSON / tool-call / context assumptions

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: Qwen3.6-27B rollout semantics confirmed for S3 strict JSON / tool-call / context assumptions

## Summary
S7 has completed the S3→S7 confirmation request. The live quality-first default is `Qwen/Qwen3.6-27B`, not 35B-A3B. S3 can continue using the existing `/v1/chat`, strict JSON, tool-call, async ownership, `/v1/models`, and `/v1/health` contracts with the limits/timeout guidance below.

## 1. Final model identity and profile

```text
modelId / served model name: Qwen/Qwen3.6-27B
S7 model profile name: Qwen/Qwen3.6-27B-default
backend: DGX Spark 10.126.37.19:8000, vLLM 0.19.1, container vllm-node:official-0.19.1-cu130
recipe: qwen3.6-27b-origin, --language-model-only, --reasoning-parser qwen3, --enable-auto-tool-choice --tool-call-parser qwen3_coder, TP=1
quantization: no quantization override; bf16/default original dense 27B
fallback: no automatic runtime fallback. 35B-A3B is a manual fast/simple candidate; Qwen3.5-122B GPTQ-Int4 is baseline/archive rollback only.
```

Audit surfaces are explicit:
- Engine direct `/v1/models`: `id=root=Qwen/Qwen3.6-27B`, `max_model_len=131072`.
- Gateway `/v1/models`: `profileId=Qwen/Qwen3.6-27B-default`, `modelName=Qwen/Qwen3.6-27B`, `contextLimit=131072`.
- Gateway `/v1/health.modelProfiles`: `Qwen/Qwen3.6-27B-default`.

## 2. Strict JSON and thinking handling

`X-AEGIS-Strict-JSON: true` remains supported and unchanged. Gateway forces:

```json
{"response_format":{"type":"json_object"},"chat_template_kwargs":{"enable_thinking":false}}
```

On success, Gateway verifies that `choices[0].message.content` parses as a top-level JSON object, normalizes it to compact JSON, and scrubs `message.reasoning` to `null`. If `<think>...</think>`, explanatory text, or any non-JSON content is mixed into final content, S7 does not return success; it fails strict mode explicitly (`502` on sync chat; async terminal failure with `blockedReason=strict_json_contract_violation`, `errorDetail`, `retryable=true`).

S3 can treat strict finalizer content as JSON-only.

## 3. Tool-call parser / function-call compatibility

vLLM is running with `--enable-auto-tool-choice --tool-call-parser qwen3_coder`; Qwen reasoning parser is `--reasoning-parser qwen3`.

Tool-call mode is OpenAI-compatible: tool calls are separated in `message.tool_calls[]`, `message.content` can be `null`, and `function.arguments` is a JSON string. No schema/prompt-format change is required for S3. For final Assessment JSON, S3 should keep using a tool-less request plus `X-AEGIS-Strict-JSON: true`.

## 4. Context / output limits / truncation

```text
max total context: 131072 model tokens (live vLLM max_model_len)
Gateway model profile contextLimit: 131072
/v1/tasks max output: constraints.maxTokens 1..8192, default 2048
/v1/chat max output: caller max_tokens forwarded to vLLM
long-context extension beyond 131072: not enabled
truncation: S7 does not silently truncate and return success
```

Gateway guard `AEGIS_LLM_MAX_INPUT_CHARS=800000` is only a coarse defensive char guard, not a token guarantee. Oversized requests fail via Gateway input guard or vLLM token/context validation.

## 5. Latency / timeout guidance

Live lightweight smoke evidence:
- strict JSON sync smoke: 4.975s Gateway latency, JSON parsed, `reasoning=null`.
- tool-call smoke: 6.274s Gateway latency, `finish_reason=tool_calls`, structured `message.tool_calls[]`.
- async strict JSON smoke: completed in about 3.8s, result retained for 15 minutes.

Hard benchmark evidence for quality-heavy prompts:
- `Qwen/Qwen3.6-27B`: qualityScore 0.74, passRate 0.70, mean completion throughput 4.65 tok/s, p50 latency ~660.6s, p95 latency ~1244.8s.

Recommended S3 timeout profile:
- strict JSON finalizer: `X-Timeout-Seconds=600` baseline.
- large evidence/deep finalizer: 900..1800s.
- tool-call agent turn: 600s baseline, up to 1800s for long reasoning.
- generate-poc: 600s baseline; 900..1800s if prompts are large/deep.

For long prompts, use `/v1/health?requestId=` as an alive/transport control signal; do not abort solely because elapsed time is high while `localAckState=transport-only` and the caller timeout has not expired.

## 6. Async ownership compatibility

No async ownership semantics changed with the model swap:
- submit/status/result/cancel unchanged;
- terminal result retention remains 15 minutes;
- unsupported async fallback behavior unchanged;
- strict JSON async success/failure semantics unchanged;
- `/health?requestId=` remains compact control-signal summary, not result storage.

## Wiki and verification evidence

Updated canonical pages:
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/handoff/s7/readme.md`

Evidence artifact:
- `wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md`

Verification performed:
- Engine direct `/v1/models` + `/health`.
- Gateway `/v1/models` + `/v1/health`.
- Gateway strict JSON sync smoke.
- Gateway tool-call smoke.
- Gateway async strict JSON submit/status/result smoke.
- Full S7 regression: `cd services/llm-gateway && .venv/bin/python -m pytest -q` → `235 passed in 6.19s`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
