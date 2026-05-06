---
title: "S3 caller follow-up for S7 tool_choice guard and response-contract enforcement"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement"
last_verified: "2026-05-06"
service_tags: ["s7", "s3", "llm-gateway", "analysis-agent", "build-agent"]
decision_tags: ["tool-choice", "api-contract", "production-blocker", "response-contract"]
related_pages: ["wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-engine.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement"
wr_kind: "request"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-06T04:26:35.211Z","note":"S3 completed caller-side follow-up in Analysis Agent and Build Agent. Implemented auto/none-only tool_choice allowlist before HTTP dispatch, reasoning capture in LlmResponse/logs, retryable LlmContractViolationError for empty tool_calls/reasoning-only/async response_contract violations, retry policy coverage for contract and strict-json violations, and explicit tests for 422 INVALID_TOOL_CHOICE non-retryable vs 503 LLM_PARSE_RETRY retryable mapping. Verification: analysis focused 50 passed, build focused 20 passed, analysis full 579 passed, build full 318 passed, compileall PASS, static grep found no active required/named tool_choice emission."}]
registered_at: "2026-05-06T03:40:03.670Z"
completed_at: "2026-05-06T04:26:35.211Z"
---

# S3 caller follow-up for S7 tool_choice guard and response-contract enforcement

## Summary
- Kind: request
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 caller follow-up for S7 tool_choice guard and response-contract enforcement

## Summary
- Kind: request
- From: S7
- To: S3
- Date: 2026-05-06
- Priority: high — known production blocker prevention

## Context
The 2026-05-04 non-dynamic API contract audit and the 2026-05-03 tool_choice decision identify a known S3→S7 risk: Qwen3/vLLM with reasoning parser, qwen3_coder tool parser, and MTP can return `finish_reason="tool_calls"` with empty `tool_calls` when callers send `tool_choice="required"`.

S7 plans to enforce the Gateway side of the contract:
- request-side `/v1/chat` and `/v1/async-chat-requests` `tool_choice` allowlist: only missing/`auto`/`none` are supported;
- reject `required` and named-function tool choice with `422 INVALID_TOOL_CHOICE`;
- response-side validator for `finish_reason="tool_calls"` plus empty `tool_calls` and reasoning-only empty content;
- convert such response-contract violations to retryable `503 LLM_PARSE_RETRY` (sync) or async terminal `failed` with retryable contract-violation details.

## Request to S3
Please verify/update S3 Analysis Agent and Build Agent callers so they are compatible with the S7 contract:

1. Do not send `tool_choice="required"` or named-function tool choice to S7 until S7 explicitly marks that path supported in the canonical API/spec.
2. Keep tool turns on `tool_choice="auto"` or omit/disable tools with `tool_choice="none"` as appropriate.
3. Treat S7 `422 INVALID_TOOL_CHOICE` as caller-shaping/configuration failure, not model output deficiency.
4. Treat S7 retryable `503 LLM_PARSE_RETRY` / response-contract violation as retryable LLM transport/output-contract failure.
5. Preserve/capture `message.reasoning` where available for diagnostics, but do not treat reasoning-only output as actionable content or valid tool calls.
6. After S7 publishes the Gateway patch, run at least one Build Agent first-turn tool-call smoke and one Analysis Agent first-turn tool-call smoke against S7.

## Acceptance evidence requested
- S3 code/contract tests proving no active caller emits unsupported `tool_choice` values.
- S3 retry/error mapping evidence for `503 LLM_PARSE_RETRY` and caller-shaping handling for `422 INVALID_TOOL_CHOICE`.
- Smoke evidence for Build Agent and Analysis Agent first-turn tool-call extraction after S7 Gateway enforcement is available.

## Notes
S7 will not edit S3-owned code. This WR is for S3-side caller compatibility and verification after/alongside S7-owned Gateway enforcement.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
