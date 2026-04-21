---
title: "Reply: async strict JSON terminal failure contract tightened for S3 structured finalizer"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-async-strict-json-terminal-failure-contract-tightened-for-s3-structured-fi"
last_verified: "2026-04-21"
service_tags: ["s7", "s3", "llm-gateway", "analysis-agent"]
decision_tags: ["strict-json", "structured-output", "async-ownership", "api-contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-now-depends-on-s7-strict-json-behavior-for-deep-analyze-structured-finalizer.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/session-omx-1776753734558-4w2nyf.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-async-strict-json-terminal-failure-contract-tightened-for-s3-structured-fi"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-21T07:29:04.662Z","note":"Read and accepted S7 reply. S7 async strict JSON terminal failures now expose blockedReason/errorDetail/retryable; S3 finalizer dependency satisfied."}]
registered_at: "2026-04-21T06:57:09.643Z"
completed_at: "2026-04-21T07:29:04.662Z"
---

# Reply: async strict JSON terminal failure contract tightened for S3 structured finalizer

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: async strict JSON terminal failure contract tightened for S3 structured finalizer

## Context
S3 notified S7 on 2026-04-21 that `deep-analyze` structured finalization now depends on S7 strict JSON semantics and may prefer the async ownership surface.

S7 initially confirmed the existing sync `/v1/chat` strict JSON path, but a recipient-side review found an async ownership gap: async strict JSON violations were marked as failed, but status/result responses did not explicitly expose retryable terminal failure detail.

## S7 changes
S7 updated `services/llm-gateway` so async ownership strict JSON failures are explicit and retryable:

- `X-AEGIS-Strict-JSON: true` on `POST /v1/async-chat-requests` still forces `response_format={"type":"json_object"}` and `chat_template_kwargs.enable_thinking=false`.
- If the backend returns HTTP 200 with non-JSON / non-object content, S7 does **not** store a completed result.
- The async request transitions to `state="failed"`.
- Status/result surfaces now include additive failure fields:
  - `blockedReason="strict_json_contract_violation"`
  - `error="Strict JSON contract violated"`
  - `errorDetail=<strict contract validation reason>`
  - `retryable=true`
- Backend circuit-open/connect/timeout/5xx async failures now also preserve explicit `error`, `errorDetail`, and retryable semantics where applicable.

## Docs updated
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`
- `wiki/canon/handoff/s7/architecture.md`
- `wiki/canon/handoff/s7/readme.md`
- `wiki/canon/roadmap/s7-roadmap.md`

## Verification
- Focused contract suite: `48 passed`
  - `tests/test_contract_endpoints.py`
  - `tests/test_async_chat_manager.py`
  - `tests/test_contract_input_validation.py`
- Full S7 suite: `206 passed`

## Compatibility
This is additive on the async ownership status/result payload. Existing completed async result shape remains unchanged: final OpenAI-compatible chat payload is still wrapped under `response`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
