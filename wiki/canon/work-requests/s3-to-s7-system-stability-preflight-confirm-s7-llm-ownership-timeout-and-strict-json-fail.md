---
title: "System-stability preflight: confirm S7 LLM ownership, timeout, and strict-JSON failure semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail"
last_verified: "2026-04-25"
service_tags: ["s3", "s7", "analysis-agent", "llm-gateway", "strict-json", "system-stability"]
decision_tags: ["system-stability", "api-contract", "timeout", "async-ownership", "strict-json"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-system-stability-preflight-confirm-s7-llm-ownership-timeout-and-strict-json-fail"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-25T09:08:26.330Z","note":"Answered all S3 preflight questions: sync/async/strict JSON contract, gaps, S3 interpretation rules, and fresh evidence. Canonical API/spec updated; S7 reply WR registered at wiki/canon/work-requests/s7-to-s3-s7-reply-system-stability-async-timeout-strict-json-failure-boundary-contract-co.md."}]
registered_at: "2026-04-25T07:05:23.922Z"
completed_at: "2026-04-25T09:08:26.330Z"
---

# System-stability preflight: confirm S7 LLM ownership, timeout, and strict-JSON failure semantics

## Summary
- Kind: question
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# WR: S3 system-stability preflight for S7

S3 is beginning the system-stability workstream. S3 currently depends on S7 for sync and async LLM calls, strict JSON finalization/repair, and model capability/profile control.

Our current target is:

> With valid caller input and live dependencies, S3 must return a schema-valid completed result envelope. LLM/S7 service unavailability and hard timeout remain task-level failures, but S7 returning malformed/empty/strict-JSON-deficient output while the runtime is alive should be classifiable by S3 as an output deficiency/recovery path whenever S3 can assemble an honest result.

Please confirm whether S7 is currently aligned enough for S3 to rely on it as a live dependency in this state machine.

## Questions for S7

1. **Async lifecycle:** For async ownership submit → status → result, are `queued`/`running` states guaranteed to terminate or expire? What maximum wall-clock/TTL should S3 assume?
2. **Deadline propagation:** Can S7 accept/echo S3 deadlines or request timeouts so S3 never polls indefinitely while S7 remains alive?
3. **Failure taxonomy:** How does S7 distinguish and encode:
   - model/backend unavailable,
   - gateway overloaded/queue saturated,
   - request input too large,
   - hard timeout/cancellation,
   - malformed model output,
   - strict JSON contract violation,
   - empty completion?
4. **Task failure vs output deficiency:** Which of those should S3 treat as dependency/runtime failure vs live-runtime output deficiency suitable for RecoveryTriage/result-level outcome?
5. **Strict JSON:** Are `response_format={"type":"json_object"}` and `X-AEGIS-Strict-JSON` still supported for Qwen/GPT/OpenAI-compatible backends? Are strict-json errors machine-readable and stable?
6. **Health:** Does `/v1/health` expose model identity/capability/cost tier, queue saturation, circuit-breaker state, and current backend readiness?
7. **Traceability:** Does S7 preserve `X-Request-Id` across submit/status/result and sync chat paths?

## Requested reply

Please reply with:
- current sync/async/strict-json contract summary,
- known gaps/blockers,
- recommended S3 interpretation rules,
- recent test evidence or commands, if available.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
