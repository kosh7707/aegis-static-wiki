---
title: "S7 implemented phase-scoped Qwen paper-controls contract for S3 TraceAudit path"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path"
last_verified: "2026-05-20"
service_tags: ["s7-llm-gateway", "s3-analysis-agent", "traceaudit-paper", "qwen3.6-27b", "dgx-spark", "vllm"]
decision_tags: ["paper-controls", "api-contract", "async-chat", "json-schema", "observability", "implementation-complete"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/work-requests/s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation.md", "wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md", "wiki/canon/handoff/s7/plan-qwen-generation-controls-contract-2026-05-20.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-implemented-phase-scoped-qwen-paper-controls-contract-for-s3-traceaudit-path"
wr_kind: "notice"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T10:48:45.018Z","note":"Reviewed and accepted from S3 consumer perspective. S7 phase-scoped paper-controls contract matches the requested acquisition/finalizer split: acquisition requires non-empty tools + tool_choice=auto and rejects schema/strict JSON; finalizer requires tool_choice=none + json_schema response_format and preserves schema under strict JSON; common controls include seed/logprobs/preserve_thinking; logprobs/top_logprobs rules and prompt-redacted controlObservability are tested. Verification: S7 full tests passed (328 passed in 6.88s) and compileall passed. S3 follow-up remains: update S3 request construction to send X-AEGIS-Paper-Controls and phase-specific async requests. Non-blocking note: S3 should omit tools on finalizer rather than send tools=[]; treat schemaValidationApplied observability as forwarded/backend-enforced schema evidence, not independent S7 schema validation."}]
registered_at: "2026-05-20T10:44:37.284Z"
completed_at: "2026-05-20T10:48:45.018Z"
---

# S7 implemented phase-scoped Qwen paper-controls contract for S3 TraceAudit path

## Summary
- Kind: notice
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S7 implemented phase-scoped Qwen paper-controls contract for S3 TraceAudit path

## Summary
S7 implemented the S3 ITERATE revisions for the TraceAudit paper Qwen generation-control contract.

S3 should now implement its side by sending `X-AEGIS-Paper-Controls: true` and supplying every required control explicitly. S7 still does not choose hyperparameter values; S3 owns all concrete values.

## Route guidance
- Preferred production/long-running route: `POST /v1/async-chat-requests`.
- Sync smoke/compat route: `POST /v1/chat`.

## Common required paper controls
For both phases S3 must send:
- `max_tokens`
- `temperature`
- `top_p`
- `top_k`
- `min_p`
- `presence_penalty`
- `repetition_penalty`
- `seed`
- `logprobs`
- `chat_template_kwargs.enable_thinking`
- `chat_template_kwargs.preserve_thinking`
- `tool_choice`

`logprobs=true` requires `top_logprobs` as a non-negative integer. `logprobs=false` requires `top_logprobs` to be omitted.

## Phase-specific contract

### Acquisition/tool-call turn
Required shape:
- `tools`: non-empty list
- `tool_choice`: `auto`
- no `response_format`
- no `structured_outputs`
- do not send `X-AEGIS-Strict-JSON`

### Finalizer/schema turn
Required shape:
- no tools
- `tool_choice`: `none`
- `response_format={"type":"json_schema", "json_schema": {"schema": ...}}`
- `response_format={"type":"json_object"}` is not sufficient for paper-controls mode

If `X-AEGIS-Strict-JSON: true` is also present on finalizer, S7 preserves S3's `json_schema` and does not overwrite it with `json_object`. Acquisition plus strict JSON is rejected as phase-incompatible.

## Observability delivered
Paper-mode exchange logs include prompt-redacted `controlObservability` with:
- `requestId`
- async `requestId` when present
- `traceRequestId`
- accepted/forwarded/observed controls
- control diff
- `schemaSnapshotHash`
- `profileSnapshotHash`
- request/control/response-summary hashes
- known-unverified fields

Paper-mode logs are tested not to include raw prompt text, raw schema text, raw seed values, or raw response body content.

## Verification evidence
- Analyze artifact: `.omx/analysis/s7-paper-controls-analyze-20260520.md`
- Plan artifact: `.omx/plans/s7-paper-controls-implementation-plan-20260520.md`
- Critic analyze review: APPROVE
- Critic plan review: ITERATE then APPROVE after log-redaction/profile-hash/strict-coexistence revisions
- S7 tests: `cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests` => `328 passed in 6.61s`
- DGX vLLM probe: seed/logprobs/top_logprobs/preserve_thinking request returned HTTP 200 with logprobs returned
- DGX vLLM probe: `response_format={"type":"json_schema",...}` finalizer returned HTTP 200 with schema-shaped JSON content and no reasoning
- Final Critic implementation validation: APPROVE

## S3 action requested
Update S3 paper request construction to use the contract above, especially:
1. use `/v1/async-chat-requests` for production paper runs;
2. split acquisition vs finalizer request shapes;
3. omit `top_logprobs` when `logprobs=false`;
4. use `response_format=json_schema` only on finalizer/schema turns;
5. keep concrete Qwen hyperparameter values owned by S3.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
