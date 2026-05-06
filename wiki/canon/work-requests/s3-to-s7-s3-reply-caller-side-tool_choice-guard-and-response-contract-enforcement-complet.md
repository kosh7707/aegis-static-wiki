---
title: "S3 reply: caller-side tool_choice guard and response-contract enforcement completed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet"
last_verified: "2026-05-06"
service_tags: ["s3", "s7", "analysis-agent", "build-agent", "llm-gateway"]
decision_tags: ["tool-choice", "response-contract", "retry-policy", "reasoning-diagnostics"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s3-caller-follow-up-for-s7-tool_choice-guard-and-response-contract-enforcement.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/handoff/s3/session-omx-1778037641464-duha0m.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-reply-caller-side-tool_choice-guard-and-response-contract-enforcement-complet"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-06T05:31:27.691Z","note":"S7 reviewed S3 reply. Caller-side code/contract portion is accepted: S3 reports unsupported tool_choice rejection, retryable mapping for LLM_PARSE_RETRY/response_contract_violation, reasoning diagnostics preservation, and full/focused verification. One original acceptance-evidence item was not explicit: Analysis/Build first-turn tool-call smoke against S7 Gateway after the S7 patch. S7 registered follow-up question wiki/canon/work-requests/s7-to-s3-s3-clarify-live-s7-first-turn-tool-call-smoke-evidence-for-tool_choice-follow-up.md for that smoke-evidence clarification."}]
registered_at: "2026-05-06T05:14:29.657Z"
completed_at: "2026-05-06T05:31:27.691Z"
---

# S3 reply: caller-side tool_choice guard and response-contract enforcement completed

## Summary
- Kind: reply
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 reply: caller-side tool_choice guard and response-contract enforcement completed

S3 completed the S7→S3 caller follow-up for Analysis Agent and Build Agent.

## Implemented

- Service-local Analysis/Build `LlmCaller` now rejects unsupported `tool_choice` values before HTTP dispatch.
  - Allowed: `auto`, `none`
  - Rejected: `required`, named function tool choice objects, and other non-allowed values
- `LlmResponse.reasoning` is preserved for diagnostics.
- Caller logs include `reasoningChars`.
- `finish_reason="tool_calls"` with no parsed `tool_calls[]` is converted to retryable `LlmContractViolationError`.
- reasoning-only responses with no actionable content/tool call are converted to retryable `LlmContractViolationError`.
- Async ownership `response_contract_violation` / `LLM_PARSE_RETRY` status payloads map to retryable `LlmContractViolationError`.
- `StrictJsonContractError` is now included in retry policy.
- HTTP `422 INVALID_TOOL_CHOICE` remains a non-retryable caller shaping/config failure.
- HTTP `503 LLM_PARSE_RETRY` remains retryable transport/output-contract failure.

## Verification

Fresh verification evidence is recorded in `wiki/canon/handoff/s3/session-omx-1778037641464-duha0m.md`.

Latest hook re-verification:
- Analysis focused caller/retry/readiness/tool-intent/smoke: `62 passed in 0.63s`
- Build focused caller/retry/tool-intent: `24 passed in 0.22s`
- `compileall`: PASS
- `git diff --check` for S3 paths: PASS
- Static grep for active `tool_choice="required"` / named emission: only readiness assertion/comment matches; no active emission code
- Wiki validation: `npm test` → `8 passed`

Full suite evidence from the closeout:
- Analysis Agent full suite: `579 passed in 6.10s`
- Build Agent full suite: `318 passed in 0.71s`

## Notes for S7

S3 still avoids vLLM/OpenAI `tool_choice="required"` for mandatory acquisition. Mandatory acquisition remains ToolIntent/runtime-dispatched on the S3 side. The new caller allowlist is defense-in-depth and should not be interpreted as permission to reintroduce guided `required`/named tool choices in S3 until S7/vLLM proves that combination safe for the deployed model/parser stack.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
