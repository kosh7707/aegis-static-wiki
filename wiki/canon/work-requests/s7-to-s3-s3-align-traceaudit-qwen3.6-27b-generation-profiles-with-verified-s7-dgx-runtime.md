---
title: "S3: choose values and supply all S7-required Qwen generation controls"
page_type: "canonical-work-request"
canonical: true
source_refs:
  - "mcp://register_wr"
  - "/tmp/aegis-hyperparam-report.md"
  - "user://2026-05-20-interview-answers"
last_verified: "2026-05-20"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "dgx-spark", "vllm", "traceaudit-paper"]
decision_tags: ["hyperparameters", "qwen3.6-27b", "api-contract", "required-parameters", "schema-output", "async-chat"]
related_pages: ["wiki/canon/handoff/s7/session-omx-1779266017427-ayixuq.md", "wiki/canon/handoff/s7/llm-gateway-api.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md"]
---

# S3: choose values and supply all S7-required Qwen generation controls

## Summary
- Kind: request
- From: s7
- To: s3
- Decision boundary: **S3 owns the choice of TraceAudit hyperparameter values.** S7's responsibility is gateway API validation/pass-through to DGX vLLM.
- User direction: S7 should not prescribe values. S3 must fill the values. S7 will aim to reject missing required generation controls rather than applying defaults silently.

## Request
S7 asks S3 to prepare for an S7 gateway contract where every required generation-control field must be supplied explicitly by S3. S3 should choose the concrete values and update its request construction accordingly; S7 should only validate, preserve, and forward.

## Background / evidence
- Source report reviewed: `/tmp/aegis-hyperparam-report.md`.
- Current DGX runtime was verified through the OpenVPN/socat proxy path:
  - Host direct `10.126.37.19:8000` is not reachable; `127.0.0.1:18000` proxy is the working path.
  - DGX host: `spark-be83`; vLLM container: `vllm_node`, image `qwen36-vllm:hf-fresh`, up ~3 weeks.
  - Actual vLLM version is **0.20.0**, not 0.21.0.
  - vLLM serve command includes `--enable-auto-tool-choice`, `--tool-call-parser qwen3_coder`, `--reasoning-parser qwen3`, `--max-model-len 131072`, `--language-model-only`, `-tp 1`.
- S7 `/v1/chat` structurally forwards current supported fields to vLLM, but when `X-AEGIS-Strict-JSON` is set it currently overwrites `response_format` to `{"type":"json_object"}`. This is expected to change in S7 contract work if schema enforcement is required.
- S7 already has async chat infrastructure under `/v1/async-chat-requests`; S7 will evaluate how to expose/reuse that for long paper calls without silently changing OpenAI-compatible sync semantics unexpectedly.

## Required S3 decisions / work

1. S3 owns the final hyperparameter values.
   - S7 may document Qwen/DGX constraints, but S3 decides concrete values.
   - Do not rely on S7 defaults.

2. S3 must be prepared to supply all required generation-control fields explicitly.
   - Existing tuple:
     - `max_tokens`
     - `temperature`
     - `top_p`
     - `top_k`
     - `min_p`
     - `presence_penalty`
     - `repetition_penalty`
     - `chat_template_kwargs.enable_thinking`
     - `tool_choice` (`auto`/`none` only on current S7 stack)
   - Additional first-class required/candidate fields for the upcoming S7 contract:
     - top-level `seed`
     - `chat_template_kwargs.preserve_thinking`
     - top-level `logprobs`
     - top-level `top_logprobs` when `logprobs=true`
     - schema enforcement field: either `response_format={"type":"json_schema",...}` or `structured_outputs`, depending on the S7/vLLM 0.20.0 contract selected.

3. S3 should not preserve value decisions in S7-specific profile IDs.
   - User questioned the profile-ID concept and suggested removing it.
   - S3 owns whether profile metadata remains useful internally; S7 should not depend on profile IDs.

4. Coordinate with S7 on transport semantics.
   - Current sync `/v1/chat` has finite read timeout semantics.
   - S7 has async chat machinery; S3 should be ready to use the selected S7 long-running chat contract once S7 finalizes it.

## Main risk to verify
The main concern is not just S3 request construction; it is whether generation controls actually reach DGX vLLM and are accepted/validated by vLLM 0.20.0. Fields may be dropped, overwritten, blocked by strict-json handling, or unsupported by vLLM 0.20.0 unless tested.

## Validation expectation
- S3 unit tests proving request builders include all S3-selected required fields and do not rely on S7 defaults.
- S7 fake-backend/captured-forwarding tests proving required fields survive S7 forwarding.
- DGX vLLM 0.20.0 acceptance probes for every new required field.
- Behavioral checks where observable:
  - missing required field -> S7 422;
  - invalid type/range -> S7 422 before vLLM;
  - invalid vLLM-specific value -> vLLM/S7 visible error;
  - `logprobs=true` -> non-null logprobs in response;
  - schema enforcement -> schema-conformant output or explicit contract failure;
  - `seed` -> integer accepted/validated, while reproducibility remains limited by online serving nondeterminism.

## Non-goals
- No S7-side hyperparameter search or ablation.
- No S7-owned concrete value selection.
- No silent defaults for generation controls in the S7 paper path.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
