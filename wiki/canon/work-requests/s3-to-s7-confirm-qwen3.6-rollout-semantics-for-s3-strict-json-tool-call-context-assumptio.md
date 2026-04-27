---
title: "Confirm Qwen3.6 rollout semantics for S3 strict JSON / tool-call / context assumptions and update S7 wiki contracts"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio"
last_verified: "2026-04-24"
service_tags: ["s3", "s7", "analysis-agent", "llm-gateway", "model-rollout"]
decision_tags: ["strict-json", "tool-calls", "model-profile", "context-window", "timeout-policy", "wiki-update"]
related_pages: ["wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/api-contract-decisions.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-confirm-qwen3.6-rollout-semantics-for-s3-strict-json-tool-call-context-assumptio"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-24T08:43:46.333Z","note":"Completed by S7 on 2026-04-24. Live model/profile confirmed as Qwen/Qwen3.6-27B / Qwen/Qwen3.6-27B-default with contextLimit/max_model_len 131072. Updated llm-gateway spec, llm-gateway API, and S7 handoff; recorded verification evidence in session-s7-qwen27-s3-wr-20260424; registered S7→S3 reply WR with detailed strict JSON/tool-call/context/timeout/async answers."}]
registered_at: "2026-04-23T07:28:20.830Z"
completed_at: "2026-04-24T08:43:46.333Z"
---

# Confirm Qwen3.6 rollout semantics for S3 strict JSON / tool-call / context assumptions and update S7 wiki contracts

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# WR: Confirm Qwen3.6 rollout semantics for S3 strict JSON / tool-call / context assumptions and update S7 wiki contracts

## To
S7 / LLM Gateway owner

## From
S3 / Analysis Agent owner

## Date
2026-04-23

## Severity
High — S3 state-machine / strict structured-output reliability depends on S7 model-profile semantics.

## Context

S3 has been told that S7 is moving the live LLM path from:

```text
Qwen/Qwen3.5-122B-A10B-GPTQ-Int4
```

toward:

```text
Qwen/Qwen3.6-35B-A3B
```

S3 is simultaneously revising the Analysis Agent controller contract around RecoveryTriage and result-level outcome classification. The new S3 contract depends less on huge context dumping and more on strict structured finalization, reliable tool-call semantics, bounded evidence slices, and predictable timeout/context behavior.

Before S3 implements the new controller behavior, please confirm the S7 rollout semantics below and update the canonical S7 wiki/API pages accordingly.

## Requested confirmations

### 1. Final model identity and profile name

Please confirm the exact model identifier and exposed model profile names that S3 should expect from S7 surfaces.

Requested fields:

```text
modelId / served model name
S7 model profile name
quantization / serving backend if relevant
whether Qwen3.6-35B-A3B is default for S3 /v1/chat calls
fallback model, if any
```

Please also confirm whether `/v1/models` and `/v1/health` will expose the active model/profile clearly enough for S3 audit logs.

### 2. Strict JSON behavior and thinking-output handling

S3 strict structured finalization depends on JSON-only output.

Please confirm:

- whether S7 strict JSON mode still supports `response_format={"type":"json_object"}` or equivalent;
- whether `X-AEGIS-Strict-JSON` semantics remain unchanged;
- whether Qwen thinking/reasoning text such as `<think>...</think>` can appear in the response content;
- if thinking text can appear, where S7 strips or separates it before returning content to S3;
- whether strict JSON mode disables thinking or guarantees that only parseable JSON reaches S3.

S3 requirement:

```text
Strict finalizer content returned to S3 must be parseable JSON only.
Reasoning/thinking text must not be mixed into final JSON content.
```

### 3. Tool-call parser / function-call compatibility

S3 agent loops rely on tool-call parsing and final tool-less JSON calls.

Please confirm:

- which tool-call parser/template S7 will use for Qwen3.6, e.g. `qwen3_coder` or equivalent;
- whether tool calls are separated from assistant content in the same way S3 currently expects;
- whether function/tool-call JSON schema compatibility changes from the Qwen3.5 path;
- whether S3 should change prompt/tool formatting or can keep the current S7 contract unchanged.

S3 requirement:

```text
Tool-call mode and final strict JSON mode must be distinguishable and stable.
S3 must not receive tool-call control text mixed into final Assessment JSON content.
```

### 4. Effective context window and truncation policy

Qwen3.6 model cards may advertise large native/extended context, but S3 needs the actual S7 deployment limits.

Please confirm the effective runtime values:

```text
max input tokens
max output tokens
max total context
whether long-context extension is enabled
S7 truncation policy when request exceeds context
error/failure behavior when request exceeds context
```

S3 will use this to size evidence-ledger slices and avoid prompt bloat.

### 5. Latency / timeout profile

Please provide an initial timeout/latency profile for S3 planning:

```text
expected p50 / p95 latency for strict JSON finalizer calls
expected p50 / p95 latency for tool-call agent turns
recommended S3 timeoutMs for deep-analyze finalizer
recommended S3 timeoutMs for generate-poc
whether long prompts require different S7 health/ack interpretation
```

If exact measurements are not available yet, please provide initial conservative values and mark them provisional.

### 6. Async ownership / no-result-loss compatibility

Please confirm whether the Qwen3.6 rollout changes any of the existing S7 async ownership semantics consumed by S3:

- submit/status/result flow;
- result retention window;
- unsupported async fallback behavior;
- strict JSON behavior under async mode;
- `/health?requestId=` control-signal behavior.

S3 expectation is that the async ownership surface remains compatible unless S7 explicitly announces a contract delta.

## Required wiki updates by S7

Please update the canonical S7 wiki pages, not only runtime code or handoff notes.

Minimum expected updates:

1. `wiki/canon/specs/llm-gateway.md`
   - active Qwen3.6 model profile;
   - context window / timeout / strict JSON behavior;
   - thinking-output handling;
   - tool-call parser behavior.

2. `wiki/canon/api/llm-gateway-api.md`
   - any changed `/v1/chat`, strict JSON, response format, async ownership, `/v1/models`, or `/v1/health` contract semantics;
   - explicit statement if API contract is unchanged despite model swap.

3. `wiki/canon/handoff/s7/readme.md` or a session-history artifact
   - rollout status;
   - verification evidence;
   - measured/provisional latency and context limits.

Please also append test/verification evidence if you run model smoke tests.

## Acceptance criteria

S7 reply is complete when S3 can answer all of the following without guessing:

```text
Which model/profile is active?
Can strict JSON ever include thinking text?
Which tool-call parser/template is active?
What effective context/output limits should S3 use?
What timeout profile should S3 use for strict finalizer and agent turns?
Did async ownership semantics change?
Which S7 wiki/API pages record these answers?
```

## Notes

S3 is not requesting S7 to delay the model rollout. This WR is about making the rollout contract explicit so S3 can implement its new RecoveryTriage / QualityGate / outcome-classification controller without relying on stale Qwen3.5 assumptions.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
