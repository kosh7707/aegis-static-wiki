---
title: "Plan — S7 Qwen generation-control contract for TraceAudit paper path"
page_type: "plan"
canonical: true
source_refs:
  - ".omx/context/s7-qwen-generation-controls-20260520T094500Z.md"
  - ".omx/plans/s7-qwen-generation-controls-contract-20260520.md"
  - "agent://architect/019e44ce-3a6b-7180-ac31-46080b65683f"
  - "agent://critic/019e44d1-36d1-7720-a6a9-e06a1c731a74"
  - "agent://critic/019e44d3-bc91-71d3-9b99-4e11d5548b7e"
last_verified: "2026-05-20"
service_tags: ["s7-llm-gateway", "s3-analysis-agent", "dgx-spark", "vllm", "traceaudit-paper"]
decision_tags: ["ralplan", "api-contract", "required-generation-controls", "async-chat", "schema-output", "observability", "critic-approved"]
related_pages: ["wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md", "wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md", "wiki/canon/handoff/s7/session-omx-1779266017427-ayixuq.md"]
---

# Plan — S7 Qwen generation-control contract for TraceAudit paper path

## Status
- Mode: `$ralplan` / consensus planning
- Date: 2026-05-20
- Scope: S7 only
- Local plan artifact: `.omx/plans/s7-qwen-generation-controls-contract-20260520.md`
- Context snapshot: `.omx/context/s7-qwen-generation-controls-20260520T094500Z.md`
- Interview evidence: `wiki/canon/handoff/s3/prework-interview-qwen-generation-controls-2026-05-20.md`
- Related S3 WR: `wiki/canon/work-requests/s7-to-s3-s3-align-traceaudit-qwen3.6-27b-generation-profiles-with-verified-s7-dgx-runtime.md`
- Architect review: ITERATE; incorporated explicit strict/paper mode boundary, schema serve-config gate, observability split.
- Critic review iteration 1: ITERATE; incorporated async default, schema hard gate, `tool_choice`, opt-in matrix, concrete observability tests.
- Critic review iteration 2: APPROVE.

## Requirements summary
S7 must provide an explicit TraceAudit/paper generation-control contract so S3-selected Qwen3.6-27B values are required, validated, forwarded, observable, and testable through DGX vLLM 0.20.0. S7 must not choose hyperparameter values and must not silently default missing required controls in the paper path.

## RALPLAN-DR summary

### Principles
1. **S3 owns values**: S7 validates and transports; S3 chooses all hyperparameter values.
2. **No silent defaults in paper mode**: missing required controls fail loudly.
3. **Preserve compatibility**: OpenAI-compatible non-paper callers must not inherit paper-only requirements.
4. **Proof over assumption**: S7 must prove accepted/forwarded/observed controls with tests and DGX probes.
5. **Prompt-redacted observability**: control evidence must be available without relying on full prompt logging.

### Decision drivers
1. Correctness of S3-selected generation controls reaching DGX vLLM 0.20.0.
2. Avoiding high-blast-radius public API breakage on `/v1/chat`.
3. Testable, auditable evidence for every required paper control.

### Viable options considered

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Global strict `/v1/chat` | One contract, catches omissions everywhere | Breaks OpenAI-compatible/default callers | Rejected: high blast radius |
| Pure pass-through | Lowest S7 complexity | Violates user requirement for missing-field errors and weak evidence | Rejected |
| Explicit paper-controls mode on sync and async | Preserves compatibility, enforces paper no-default contract | Additional mode/test matrix | Chosen |
| Async-only strict paper path | Clean long-running ownership | Makes sync paper smoke harder and requires S3 transport change | Partially chosen: async is preferred long-run path, sync opt-in remains available for smoke/compatibility |

## ADR

### Decision
Implement a named, opt-in paper generation-control contract in S7 using `X-AEGIS-Paper-Controls: true`.

- The contract applies to existing `POST /v1/async-chat-requests` first and is the recommended route for long TraceAudit paper calls.
- Sync `POST /v1/chat` may also accept the same opt-in header for smoke/backward compatibility, but its default non-paper behavior must remain compatible.
- Paper-controls mode requires explicit fields and returns 422 on missing/invalid controls.
- Schema enforcement is a hard acceptance gate for paper-controls mode; no silent fallback to `json_object`.

### Drivers
- S3 needs reliable proof that its selected values reach DGX.
- S7 must not silently default or overwrite paper controls.
- Existing non-paper clients should not break.

### Alternatives considered
- Global strict mode on `/v1/chat`.
- Pure pass-through and vLLM-only validation.
- A new dedicated endpoint.

### Why chosen
The chosen option provides no-default correctness for paper calls while containing compatibility risk. It reuses existing async infrastructure rather than inventing another long-running ownership surface.

### Consequences
- S3 must add `X-AEGIS-Paper-Controls: true` and provide all required controls for paper calls.
- S7 tests must cover both opt-in and non-opt-in behavior.
- Schema enforcement may require DGX serve-config verification or escalation if vLLM 0.20.0 cannot enforce the selected schema mechanism.

### Follow-ups
- S3 review of required fields and transport expectations before S3 implementation.
- Future implementation goal must start with `$analyze` and Critic validation before code changes.

## Implementation plan for future S7 goal

### Pre-execution gate
1. Run `$analyze` on S7 code paths to map current validation, forwarding, strict JSON, async, observability, and tests.
2. Ask Critic to validate that `$analyze` correctly identified the problem and scope.
3. Only then enter implementation planning.
4. Follow loop: **plan -> plan validation -> implementation -> implementation validation**.
5. Call Critic periodically after major design/test milestones.

### Step 1 — Contract boundary
- Add paper-controls opt-in detection using `X-AEGIS-Paper-Controls: true`.
- Ensure new strict required fields apply only when this opt-in is present.
- Preserve non-paper `/v1/chat` behavior unless current existing validation already applies.

### Step 2 — Required controls validation
In paper-controls mode, require and validate:
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
- `tool_choice` with allowed values `auto` or `none`
- one schema enforcement field selected after vLLM 0.20.0 probe: `response_format={"type":"json_schema",...}` or `structured_outputs`

Validation failures must return structured 422 details with missing/invalid fields.

### Step 3 — Schema enforcement hard gate
- Probe DGX vLLM 0.20.0 for:
  - `response_format={"type":"json_schema",...}`
  - `structured_outputs={"json":...}`
  - thinking=false
  - thinking=true with `preserve_thinking=true`
- Select the working schema mechanism for paper-controls mode.
- Modify strict JSON behavior so schema requests are preserved/translated instead of overwritten to `json_object`.
- If neither schema mechanism works without a DGX serve-config change, stop and return to planner/user with evidence; do not silently fallback.

### Step 4 — Forwarding and observability
Add prompt-redacted control observability:
- `acceptedControls`: passed S7 validation.
- `forwardedControls`: exact controls sent to vLLM.
- `controlDiff`: added/overwritten/dropped fields; normal expected addition is model override only.
- `observedControls`: response evidence such as logprobs returned, reasoning returned, schema validation result, finish reason.
- `knownIneffectiveOrUnverified`: e.g. fields accepted/forwarded but not externally provable, including online seed reproducibility and any MTP/min_p uncertainty.

Metrics must be low-cardinality; do not put raw values, seed values, prompts, or schema text in labels.

### Step 5 — Async transport
- Implement paper-controls validation on existing `POST /v1/async-chat-requests` first.
- Keep async result/status flow through existing `AsyncChatRequestManager`.
- Sync `/v1/chat` can support paper-controls opt-in for small smoke calls but should not become the required long-running paper path.
- Add a new endpoint only if `$analyze` proves the existing async endpoint cannot support the contract and Critic re-approves.

### Step 6 — Tests and evidence
Required tests:
1. Non-opt-in `/v1/chat` compatibility: no new seed/logprobs/schema requirements.
2. Non-opt-in `/v1/async-chat-requests` compatibility as appropriate for existing schema.
3. Paper-controls missing-field matrix for sync and async: omit each required field -> 422.
4. Paper-controls invalid-field matrix -> 422 before vLLM.
5. `tool_choice` missing/invalid in paper mode -> 422.
6. Fake-backend exact forwarding: accepted fields are forwarded, not overwritten/dropped.
7. Strict schema preservation/enforcement test.
8. Redacted observability snapshot includes all new controls and diff/observed/unverified fields.
9. DGX vLLM 0.20.0 acceptance probes for new fields and schema mechanism.
10. Full S7 pytest.

## Acceptance criteria
- Paper-controls opt-in exists and is documented in code/tests.
- Missing any required paper-control field yields 422 with field-specific details.
- Non-paper callers are not forced to provide paper-only controls.
- S7 does not choose or default concrete hyperparameter values in paper-controls mode.
- Schema enforcement is either proven working on vLLM 0.20.0 or the implementation stops with evidence before claiming completion.
- Observability can show accepted vs forwarded vs observed controls without prompt text.
- Async paper-controls path is tested and recommended for long-running TraceAudit calls.
- S3 has reviewed the plan before S3 begins its own changes.

## Verification path
1. `$analyze` output captured.
2. Critic validates analyze.
3. Plan validation before code changes.
4. Unit and fake-backend tests.
5. DGX vLLM acceptance probes.
6. Full S7 pytest.
7. Critic review before completion claim.
8. Wiki session/evidence update.

## Review changelog
- Added explicit paper-controls opt-in boundary after Architect ITERATE.
- Set existing async endpoint as deterministic long-run default after Critic ITERATE.
- Added `tool_choice` to required paper-controls fields.
- Made schema enforcement a hard gate, not a silent fallback.
- Added opt-in/non-opt-in test matrix.
- Added concrete prompt-redacted observability acceptance.
