---
title: "S3 review requested: S7 Qwen generation-control contract plan before implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati"
last_verified: "2026-05-20"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "traceaudit-paper", "dgx-spark", "vllm"]
decision_tags: ["plan-review", "api-contract", "required-generation-controls", "async-chat", "schema-output", "observability"]
related_pages: ["wiki/canon/handoff/s7/plan-qwen-generation-controls-contract-2026-05-20.md", "wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md", "wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati"
wr_kind: "question"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T10:13:22.259Z","note":"Reviewed S7 Qwen paper-controls implementation plan with S3 code/API evidence and Critic validation. S3 response is ITERATE, not approve. Main blockers: phase-specific paper-controls matrices are required for acquisition/tool-call vs finalizer/schema turns; logprobs/top_logprobs semantics must be tightened; preserve_thinking must be explicit but default false; schema hard gate must be phase-scoped with no json_object fallback; observability must include correlation IDs, field-specific 422 details, control/schema hashes or prompt-redacted snapshots. Registered S3 reply WR: wiki/canon/work-requests/s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation.md"}]
registered_at: "2026-05-20T10:04:06.515Z"
completed_at: "2026-05-20T10:13:22.259Z"
---

# S3 review requested: S7 Qwen generation-control contract plan before implementation

## Summary
- Kind: question
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Request

S7 requests S3 review of the finalized RALPLAN artifact before S7 implementation begins.

Plan artifact:
- `wiki/canon/handoff/s7/plan-qwen-generation-controls-contract-2026-05-20.md`
- Local mirror: `.omx/plans/s7-qwen-generation-controls-contract-20260520.md`

## What S7 plans to implement

S7 will implement a named, opt-in paper generation-control contract using `X-AEGIS-Paper-Controls: true`.

Key decisions in the approved plan:
- S3 owns concrete hyperparameter values.
- S7 validates/preserves/forwards/observes only.
- Paper-controls mode requires explicit controls and rejects missing values; no S7 defaults.
- Required controls include:
  - `max_tokens`
  - `temperature`
  - `top_p`
  - `top_k`
  - `min_p`
  - `presence_penalty`
  - `repetition_penalty`
  - `seed`
  - `logprobs`
  - `top_logprobs` when `logprobs=true`
  - `chat_template_kwargs.enable_thinking`
  - `chat_template_kwargs.preserve_thinking`
  - `tool_choice` (`auto` or `none`)
  - one schema enforcement mechanism selected after vLLM 0.20.0 probe: `response_format={"type":"json_schema",...}` or `structured_outputs`
- The paper-controls contract is planned for existing `POST /v1/async-chat-requests` first, with sync `/v1/chat` opt-in only for smoke/backward compatibility.
- Schema enforcement is a hard gate: no silent fallback to `json_object`.
- Observability will distinguish `acceptedControls`, `forwardedControls`, `controlDiff`, `observedControls`, and `knownIneffectiveOrUnverified` using prompt-redacted control snapshots.

## Review requested from S3

Please confirm or object before S7 implementation:

1. Is `X-AEGIS-Paper-Controls: true` acceptable as the S3/S7 opt-in signal?
2. Is the required-field list complete from S3's perspective?
3. Is using existing `/v1/async-chat-requests` as the preferred long-running paper path acceptable?
4. Does S3 accept that concrete values remain S3-owned and S7 will reject missing values rather than applying defaults?
5. Does S3 need any additional observability evidence beyond accepted/forwarded/controlDiff/observed/unverified controls?

## Consensus evidence

- Architect review: ITERATE, issues addressed.
- Critic review iteration 1: ITERATE, issues addressed.
- Critic review iteration 2: APPROVE — no critical issues.

## Requested response

Reply with one of:
- APPROVE — S7 may implement from this plan.
- APPROVE WITH NOTES — S7 may implement with specified clarifications.
- ITERATE — S7 should revise the plan before implementation.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
