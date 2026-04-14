---
title: "Reply: live /v1/chat JSON-only control leak is current pass-through limitation, not a new /health regression"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not"
last_verified: "2026-04-14"
service_tags: ["s7", "s3"]
decision_tags: ["llm-gateway", "response-format", "json-control", "integration"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T00:59:58.936Z","note":"Reviewed and accepted. S7 confirmed the live /v1/chat JSON-only issue is a current pass-through limitation, not a /health regression; S3 should prefer /v1/tasks for strict structured output or explicitly set response_format=json_object + enable_thinking=false and parse message.content only when using /v1/chat."}]
registered_at: "2026-04-14T00:57:46.378Z"
completed_at: "2026-04-14T00:59:58.936Z"
---

# Reply: live /v1/chat JSON-only control leak is current pass-through limitation, not a new /health regression

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: live /v1/chat JSON-only control leak is current pass-through limitation, not a new /health regression

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Reply to `s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke`.
- S7 re-checked current gateway code and reproduced the behavior locally on **2026-04-14** against the live gateway at `http://localhost:8000`.
- This WR is about `/v1/chat` runtime semantics only. It does **not** change the separately frozen `/health` rollout direction.

## Investigation result
### Code-grounded finding
Current `/v1/chat` is a **transparent proxy with light gateway headers**, not a schema-enforcing JSON-only endpoint.

What it does today:
- overrides `model`
- forwards the caller body to the real backend
- forwards caller timeout via `X-Timeout-Seconds`
- returns the backend response body as-is

What it does **not** do today:
- auto-inject `response_format={"type":"json_object"}`
- auto-inject `chat_template_kwargs.enable_thinking=false`
- strip backend `reasoning` fields from the OpenAI-style envelope
- validate that `choices[0].message.content` is strict JSON

This is visible in current S7 code:
- `services/llm-gateway/app/routers/tasks.py` — `/v1/chat` proxy path
- `services/llm-gateway/app/clients/real.py` — JSON mode + `enable_thinking=false` are enforced for the internal Task pipeline client, **not** for `/v1/chat`

## Live evidence gathered by S7 on 2026-04-14
### Reproduction of the leak
S7 sent a local live smoke to `/v1/chat` with only a prompt requesting compact JSON and `max_tokens=64`.

Observed result:
- HTTP 200
- `finish_reason = "length"`
- `choices[0].message.content = null`
- `choices[0].message.reasoning` contained thinking-style text

This matches S3's report in substance.

### Controlled success case
S7 then sent a second live smoke to `/v1/chat` with:
- `response_format: {"type":"json_object"}`
- `chat_template_kwargs: {"enable_thinking": false}`
- `max_tokens: 128`

Observed result:
- HTTP 200
- `finish_reason = "stop"`
- `choices[0].message.content = "{\"ok\":true}"`
- `choices[0].message.reasoning = null`

## Answers to S3's five questions
### 1. Is this an expected current limitation or a bug/regression?
**Expected current limitation of `/v1/chat` pass-through semantics**, not a new `/health` regression.

The live behavior is weaker than strict downstream JSON consumers may want, but it is consistent with the current proxy design: `/v1/chat` does not itself enforce JSON-only output.

### 2. Can `/v1/chat` in current real mode guarantee JSON-only output for small non-tool requests?
**Not by prompt text alone.**

Today S7 can only support caller-directed structured output if the caller explicitly supplies the needed OpenAI-compatible controls. The gateway does not independently guarantee strict JSON-only output for ordinary freeform chat requests.

### 3. Is thinking/reasoning leakage expected in this configuration?
**Yes, if the caller does not explicitly suppress it.**

In current real mode, reasoning leakage is expected when `/v1/chat` is used without explicit structured-output controls such as:
- `chat_template_kwargs.enable_thinking=false`
- `response_format={"type":"json_object"}`

### 4. What should S3 treat as the supported contract today for strict downstream JSON consumption?
S7 recommends the following supported contract today:

#### Preferred
- Use **`/v1/tasks`** whenever the need is task-shaped structured output.
- That path already uses S7-controlled JSON mode, validation, and thinking suppression.

#### If S3 must use `/v1/chat`
Treat strict downstream JSON consumption as supported **only when S3 supplies**:
- `response_format={"type":"json_object"}`
- `chat_template_kwargs={"enable_thinking": false}`
- enough `max_tokens` to avoid truncation into `finish_reason="length"`

And interpret the response as:
- parse **`choices[0].message.content`** as the JSON payload
- do **not** assume the whole OpenAI-style envelope is itself compact-JSON-only
- do **not** assume backend-specific fields such as `reasoning` are absent unless suppressed

### 5. Does S7 want to tighten this in gateway logic, model invocation parameters, or documentation?
S7's immediate recommendation is:
- **tighten documentation/contract wording first**
- do **not** silently hot-change `/v1/chat` semantics during the ongoing rollout without an explicit cross-lane contract update

Possible future tightening directions, if needed later:
- gateway-side opt-in strict JSON mode for `/v1/chat`
- stricter response validation / rejection on JSON-mode requests
- response-envelope scrubbing of backend-specific reasoning fields

But those are **future contract changes**, not the guaranteed behavior today.

## Bottom line for S3
- Your smoke found a real limitation, not a false alarm.
- The gateway is reachable and healthy, but `/v1/chat` currently behaves as a pass-through proxy rather than a hard JSON-only guard.
- For strict downstream JSON today, prefer `/v1/tasks`, or send explicit JSON/thinking controls on `/v1/chat` and parse `message.content` only.

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
