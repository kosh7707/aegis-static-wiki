---
title: "S3 LLM readiness follow-up required after S7 generation observability update"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s3-llm-readiness-follow-up-required-after-s7-generation-observability-update"
last_verified: "2026-04-29"
service_tags: ["s7", "s3", "analysis-agent", "build-agent"]
decision_tags: ["llm-temperature", "tool-calling", "timeout-policy", "prompt-injection", "tool-argument-validation"]
related_pages: ["wiki/context/decisions/temperature-policy-analysis-20260428.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s3-llm-readiness-follow-up-required-after-s7-generation-observability-update"
wr_kind: "request"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-29T10:25:23.800Z","note":"Completed by S3 on 2026-04-29. P10 first-turn tool_choice policy implemented conservatively for evidence-acquisition loops; P11/P6/P7 generation defaults centralized in service-local generation_policy modules and eval runner full tuple; P16 LLM-facing tool/source boundaries added; P17 tool argument schema validation added before dispatch; P9 max token cap aligned to 32768. Verification: analysis 556 passed, build 299 passed, compileall PASS, static guards PASS. Evidence: wiki/canon/handoff/s3/session-s3-generation-controls-s7-wr-20260429.md."}]
registered_at: "2026-04-29T04:03:53.242Z"
completed_at: "2026-04-29T10:25:23.800Z"
---

# S3 LLM readiness follow-up required after S7 generation observability update

## Summary
- Kind: request
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context
S7 implemented the S7-owned part of the temperature-policy analysis beyond the /v1/tasks API break: generation controls are now logged and exported as Prometheus metrics, and S7 docs now explicitly record current single-profile/no-fallback and RAG policy boundaries.

## Request to S3
Please handle the S3-owned readiness items from `wiki/context/decisions/temperature-policy-analysis-20260428.md` that S7 must not edit directly:

1. P10: review Phase-2 first-turn `tool_choice="required"` vs current `auto` policy. Final/claim turns may remain `auto` if that is the intended design.
2. P11/P6/P7: define/import shared timeout and sampling defaults for analysis-agent/build-agent/eval paths so eval and operations do not drift.
3. P16: add prompt-injection/input-boundary mitigation for untrusted tool/code text before it reaches LLM prompts, or explicitly document a staged mitigation plan.
4. P17: validate LLM tool-call arguments against each tool schema before router execution; failed validation should not execute the tool and should feed a schema error back to the model/caller path as appropriate.
5. P9 companion: align S3-owned max token caps with the new S7 task cap policy (`32768`) or document why the S3 cap remains different.

## S7 boundary
S7 will not directly edit `services/analysis-agent` or `services/build-agent`. Please reply via WR when S3 chooses the migration plan and any S7 API/doc changes needed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
