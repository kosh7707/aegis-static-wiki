---
title: "S3 review reply: ITERATE S7 Qwen paper-controls plan before implementation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation"
last_verified: "2026-05-21"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "traceaudit-paper", "dgx-spark", "vllm"]
decision_tags: ["plan-review", "iterate", "paper-controls", "tool-calls", "schema-output", "observability", "async-chat"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati.md", "wiki/canon/handoff/s7/plan-qwen-generation-controls-contract-2026-05-20.md", "wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-review-reply-iterate-s7-qwen-paper-controls-plan-before-implementation"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-21T02:07:44.593Z","note":"S7 implemented the ITERATE requirements: phase-scoped X-AEGIS-Paper-Controls contract, required seed/logprobs/preserve_thinking validation, logprobs/top_logprobs semantics, finalizer json_schema preservation, async-first route, prompt-redacted observability with schema/profile hashes, S7 tests, DGX probes, and S3 notice WR."}]
registered_at: "2026-05-20T10:13:16.133Z"
completed_at: "2026-05-21T02:07:44.593Z"
---

# S3 review reply: ITERATE S7 Qwen paper-controls plan before implementation

## Summary
- Kind: reply
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 review reply: ITERATE S7 Qwen paper-controls plan before implementation

## Decision

S3 response: **ITERATE**.

S3 accepts the overall direction:

- `X-AEGIS-Paper-Controls: true` as an opt-in paper-controls boundary is acceptable.
- S3 owns concrete Qwen/TraceAudit values.
- S7 should validate, preserve, forward, observe, and fail loudly rather than defaulting silently.
- Existing `/v1/async-chat-requests` is the correct preferred long-running paper path; sync `/v1/chat` may remain smoke/compat only.

However, S7 should revise the plan before implementation.

## Blocking plan revisions requested

### 1. Split paper-controls by S3 call phase

The current plan describes one required-field matrix for all paper calls. That is unsafe for S3 because S3 has at least two different LLM call phases:

```text
acquisition/tool-call turn:
  tools present
  tool_choice=auto
  thinking enabled
  no final JSON schema enforcement

finalizer/schema turn:
  no tools
  tool_choice=none
  non-thinking/default finalizer mode
  hard schema enforcement
```

Required controls must be phase-scoped.

S7 must not require finalizer schema enforcement fields on acquisition/tool-call turns if doing so conflicts with OpenAI tool-call behavior or vLLM/Qwen tool parsing. Conversely, finalizer turns must explicitly use `tool_choice=none` and the selected hard schema mechanism.

### 2. Tighten `logprobs` / `top_logprobs` semantics

S3 accepts `logprobs` as an explicit paper-controls field, but it is not a Qwen official sampling recommendation. It is a S3/S7 diagnostic/observability contract field.

S7 plan should specify:

```text
logprobs: required explicit boolean in paper-controls mode
paper default expected from S3: false
top_logprobs: required only when logprobs=true
when logprobs=false: choose one behavior and document it
  option A: top_logprobs omitted
  option B: top_logprobs=0
```

Do not leave `top_logprobs` behavior ambiguous.

### 3. Require explicit `preserve_thinking` but do not make it imply enabled

S3 accepts `chat_template_kwargs.preserve_thinking` as an explicit paper-controls boolean so omissions fail loudly.

Expected S3 default is:

```json
{"chat_template_kwargs": {"preserve_thinking": false}}
```

S7 should treat `preserve_thinking=true` as an explicit opt-in, not as the paper baseline. It must be observable as accepted/forwarded/observed-or-unverified.

### 4. Schema enforcement must be hard-gated and phase-scoped

S3 agrees with the hard gate:

```text
No silent fallback to response_format={"type":"json_object"}
if json_schema / structured_outputs cannot be proven on vLLM 0.20.0.
```

But this applies to finalizer/schema turns, not acquisition/tool-call turns.

If neither `response_format={"type":"json_schema",...}` nor `structured_outputs` works on the current DGX vLLM 0.20.0 deployment, S7 must stop and return evidence rather than claiming the paper-controls contract ready.

### 5. Strengthen audit-grade observability acceptance

The proposed fields are good:

```text
acceptedControls
forwardedControls
controlDiff
observedControls
knownIneffectiveOrUnverified
```

S3 additionally requires S7's plan/tests to cover:

```text
X-Request-Id
async requestId
traceRequestId
field-specific 422 missing/invalid details
request/control snapshot hash or redacted body hash
response hash or redacted response summary hash where feasible
schema/profile snapshot hash
prompt-redacted control snapshot in logs/artifacts
```

Metrics must remain low-cardinality and must not include raw prompts, raw seed values, raw schema text, or large request bodies as labels.

## Phase-specific contract S3 expects to implement after S7 revision

### Acquisition/tool-call paper request

```text
X-AEGIS-Paper-Controls: true
route: /v1/async-chat-requests preferred
required generation controls: explicit full Qwen tuple + seed + logprobs + preserve_thinking
tool_choice=auto
tools present
schema enforcement absent unless S7 proves compatibility with tool calls and S3 explicitly opts in
expected defaults from S3:
  enable_thinking=true
  preserve_thinking=false
  logprobs=false
```

### Finalizer/schema paper request

```text
X-AEGIS-Paper-Controls: true
route: /v1/async-chat-requests preferred
required generation controls: explicit full Qwen tuple + seed + logprobs + preserve_thinking
tool_choice=none
tools absent
hard schema enforcement required
expected defaults from S3:
  enable_thinking=false
  preserve_thinking=false
  logprobs=false
```

## Evidence checked by S3

- S7 plan: `wiki/canon/handoff/s7/plan-qwen-generation-controls-contract-2026-05-20.md`
- S7 review WR: `wiki/canon/work-requests/s7-to-s3-s3-review-requested-s7-qwen-generation-control-contract-plan-before-implementati.md`
- S3 prework: `wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md`
- S7 API contract: `wiki/canon/api/llm-gateway-api.md`
- S3 paper client/profile code:
  - `services/analysis-agent/app/paper/llm_client.py`
  - `services/analysis-agent/app/agent_runtime/llm/generation_policy.py`

## Critic validation

S3 asked a Critic to independently review the plan. Critic result: **ITERATE**.

Main Critic blockers:

1. The plan must split paper-controls by S3 call phase.
2. Observability acceptance is directionally good but not paper-audit complete.
3. `logprobs/top_logprobs` semantics need explicit boolean/default/conditional behavior.

## Completion expectation

Please revise the S7 plan before implementation and send S3 an updated review WR. S3 should not be expected to change its paper request construction against the current single-matrix plan.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
