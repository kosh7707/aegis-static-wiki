---
title: "Prework interview — S3 Qwen generation-control WR"
page_type: "interview-evidence"
canonical: true
source_refs:
  - "user://2026-05-20-simple-interview-request"
  - "user://2026-05-20-interview-answers"
  - "user://2026-05-20-goal-loop-instruction"
last_verified: "2026-05-20"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "dgx-spark", "vllm", "traceaudit-paper"]
decision_tags: ["prework-interview", "hyperparameters", "api-contract", "qwen3.6-27b", "required-generation-controls", "goal-loop", "critic-review"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md", "wiki/canon/handoff/s7/session-omx-1779266017427-ayixuq.md"]
---

# Prework interview — S3 Qwen generation-control WR

## Status
- State: answered.
- Requested by user: run a lightweight interview before starting the S3/S7 generation-control work; explicitly not the deep-interview workflow.
- Date: 2026-05-20

## WR under discussion
- `wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md`

## Interview goal
Clarify the minimum decision boundaries before implementation so S3 can choose hyperparameter values while S7 preserves/forwards the required API contract to DGX vLLM.

## Questions and answers

1. Scope split: should the first implementation slice be only S7 API pass-through/validation tests, or should it also include S3 profile/body changes in the same pass?
   - Answer: This agent is S7. Perform **S7 work only**. S3 work should be requested through WRs, not implemented by S7.

2. Required fields: which candidate fields must be first-class in the S3/S7 contract for this slice?
   - Answer: **All of them.** Do not rely on defaults. Missing required generation-control parameters should produce errors.
   - Required contract should cover the existing tuple plus `seed`, `chat_template_kwargs.preserve_thinking`, `logprobs`/`top_logprobs`, and schema enforcement fields (`response_format=json_schema` or `structured_outputs`, as supported/verified).

3. Hyperparameter ownership: should implementation leave concrete values entirely in S3 profile constants, with S7 validating ranges/pass-through only?
   - Answer: Yes. S7 is a gateway. Actual hyperparameter values, including `seed`, are S3-owned and must be supplied by S3.

4. Finalizer output constraint: should this slice attempt schema enforcement now, or defer it and only preserve the field if supplied?
   - Answer: Implement it now. User will provide an explicit goal.

5. Transport: should S3 paper calls move to S7 async chat now, or keep sync `/v1/chat` for this slice and document the timeout semantics?
   - Answer: User prefers making `/v1/chat` itself asynchronous if that is the better S7 design; S7 already has async-chat machinery that should be considered/reused.
   - Pre-implementation note: S7 currently has `/v1/async-chat-requests` with submit/status/result and unbounded backend read timeout. Changing `/v1/chat` response shape directly would affect OpenAI-compatible sync callers, so the implementation plan must decide whether to keep `/v1/chat` sync by default and add an async mode, or migrate S3 to the existing async endpoint.

6. Verification gate: what is the minimum acceptable live evidence before calling the slice done?
   - Answer: Need a way to test whether each parameter actually behaves correctly, not just whether it appears in JSON.
   - Candidate test ladder:
     1. missing-field tests: omit each required field and assert S7 returns 422;
     2. invalid-value tests: invalid type/range returns 422 before reaching vLLM;
     3. fake-backend forwarding tests: S7 forwards every accepted field exactly once, without defaulting or overwriting;
     4. DGX vLLM acceptance probes: valid values return 200; targeted invalid values return vLLM 400 where applicable;
     5. behavioral checks where externally observable: `logprobs=true` returns non-null logprobs; `enable_thinking=false` yields no reasoning; schema mode rejects/repairs invalid schema shapes or returns schema-conformant JSON; `seed` is validated as integer, with reproducibility treated as limited by online serving nondeterminism.

7. Compatibility: must current existing paper profiles remain available under old profile IDs, or can S3 revise the current IDs in place?
   - Answer: User questions the profile ID concept and thinks it should likely be removed. S7 should not carry profile-ID decisions; S3 owns any internal profile metadata decision.

8. Non-goals: confirm no local hyperparameter search/ablation should be done unless official/S3-selected values fail a concrete contract gate.
   - Answer: Confirmed. No hyperparameter search/ablation as part of this S7 contract work.

9. Goal execution protocol when user starts the implementation goal.
   - Answer: The user normally requires the following loop for goals and wants it included as prework evidence:
     - Always follow **plan -> plan validation -> implementation -> implementation validation**.
     - Before implementation, use the `$analyze` skill to identify **what the problem is** and define the implementation scope.
     - Have a Critic subagent verify that the analyze step worked correctly.
     - Periodically call the Critic subagent during the work so all plans, implementation choices, tests, and claims are reviewed and strengthened.

## S7 implementation implications to carry forward
- S7 must enforce required parameter presence rather than silently defaulting.
- S7 must remain value-agnostic beyond validation/range/schema/pass-through.
- S7 must prove required parameters reach DGX vLLM or fail loudly.
- S3 chooses values and should be instructed through WRs to supply every required field.
- When the user opens the explicit implementation goal, execute with the documented loop: plan -> plan validation -> implementation -> implementation validation, preceded by `$analyze` and checked by recurring Critic review.
