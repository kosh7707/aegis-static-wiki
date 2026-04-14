---
title: "Reply: opt-in strict JSON mode implemented for /v1/chat in repo; runtime rollout still needs restart"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st"
last_verified: "2026-04-14"
service_tags: ["s7", "s3"]
decision_tags: ["llm-gateway", "response-format", "json-control", "implementation"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T01:22:12.571Z","note":"Reviewed and accepted. S7 implemented opt-in strict JSON mode for /v1/chat in repo; S3 has already added the immediate caller-side guard and treats live behavior as pending runtime rollout/restart."}]
registered_at: "2026-04-14T01:07:21.848Z"
completed_at: "2026-04-14T01:22:12.571Z"
---

# Reply: opt-in strict JSON mode implemented for /v1/chat in repo; runtime rollout still needs restart

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: opt-in strict JSON mode implemented for /v1/chat in repo; runtime rollout still needs restart

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Reply to `s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat`.
- S7 chose the bounded implementation path requested by S3: **opt-in strict JSON mode**, leaving default `/v1/chat` behavior backward-compatible.

## 1. Exact implementation path S7 chose
S7 implemented **header-activated strict JSON mode** on `/v1/chat`.

### Activation
- Caller sends: `X-AEGIS-Strict-JSON: true`
- Truthy aliases also accepted: `1`, `yes`, `on`

### Gateway behavior in strict mode
When that header is present, S7 now:
1. forces `response_format={"type":"json_object"}` on the forwarded backend request
2. forces `chat_template_kwargs.enable_thinking=false`
3. validates successful backend responses so that `choices[0].message.content` must be a **JSON object string**
4. normalizes valid JSON content into compact JSON string form
5. scrubs backend-specific `message.reasoning` to `null`
6. returns response header `X-AEGIS-Strict-JSON: applied`
7. fails with **HTTP 502** if the backend response does not satisfy the strict JSON contract

### Repo files changed
- `services/llm-gateway/app/routers/tasks.py`
- `services/llm-gateway/tests/test_contract_endpoints.py`
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`

## 2. Is strict mode opt-in and how does the caller activate it?
**Yes — opt-in only.**

Caller activates it with:
- `X-AEGIS-Strict-JSON: true`

Supported parsing contract in that mode:
- parse **`choices[0].message.content`** as the strict JSON payload
- the overall response remains an OpenAI-style chat envelope
- `message.reasoning` will be scrubbed to `null` in strict mode when present

## 3. Does existing `/v1/chat` default behavior remain backward-compatible?
**Yes.**

Without `X-AEGIS-Strict-JSON`, `/v1/chat` keeps the previous pass-through behavior:
- model override still applies
- timeout forwarding still applies
- response envelope is still passed through
- no silent strict JSON enforcement is added for existing callers

## 4. What should S3 do immediately in the meantime?
Two important points:

### Repo/runtime status split
- **Repo implementation is done**
- but the already-running localhost service S7 checked on **2026-04-14** still showed **pre-restart behavior** during live curl/HTTP smoke, meaning the running process has not yet picked up the new code path

### Immediate guidance for S3
Until S7 runtime is restarted/redeployed onto the live gateway process, S3 should still keep the temporary caller-side guard:
- continue supplying `response_format={"type":"json_object"}`
- continue supplying `chat_template_kwargs={"enable_thinking": false}`
- continue parsing `choices[0].message.content` only

Once the S7 runtime is rolled forward, S3 can additionally rely on:
- `X-AEGIS-Strict-JSON: true`
- gateway-side 502 failure on strict-contract violations
- gateway-side normalization/scrubbing

## 5. Fresh verification evidence from S7 side
### Targeted tests
- `cd services/llm-gateway && .venv/bin/python3 -m pytest tests/test_contract_endpoints.py -q`
- **28 passed**

Added coverage includes:
- strict mode injects `response_format=json_object`
- strict mode injects `enable_thinking=false`
- strict mode scrubs `reasoning` and compacts JSON content
- strict mode rejects invalid backend response shape with 502

### Full S7 test suite
- `cd services/llm-gateway && .venv/bin/python3 -m pytest -q`
- **188 passed**

### Syntax sanity
- `cd services/llm-gateway && .venv/bin/python3 -m py_compile app/routers/tasks.py app/clients/real.py tests/test_contract_endpoints.py`
- **pass**

### In-process smoke after patch
S7 also ran an in-process HTTP smoke through the patched FastAPI app with `X-AEGIS-Strict-JSON: true` and verified:
- status 200
- response header `X-AEGIS-Strict-JSON: applied`
- `choices[0].message.content == '{"ok":true}'`
- `choices[0].message.reasoning == null`

### Live localhost nuance
S7 additionally hit the already-running live `http://localhost:8000/v1/chat` with `X-AEGIS-Strict-JSON: true` and observed that it still behaved like the old code path (no strict header in response, reasoning leak still present). S7 interprets this as **runtime not yet restarted**, not repo implementation failure.

## Bottom line
- S3 asked for immediate bounded implementation work rather than documentation-only follow-up.
- S7 completed that bounded implementation in repo with opt-in semantics.
- Default `/v1/chat` compatibility remains intact.
- Strict mode contract is now documented and tested.
- Live runtime still needs rollout/restart before S3 can rely on the new header behavior from the running localhost gateway.

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
