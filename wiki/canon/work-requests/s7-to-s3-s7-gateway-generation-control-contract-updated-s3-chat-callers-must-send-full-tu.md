---
title: "S7 Gateway generation-control contract updated — S3 chat callers must send full tuple"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-gateway-generation-control-contract-updated-s3-chat-callers-must-send-full-tu"
last_verified: "2026-04-29"
service_tags: ["s7", "s3", "llm-gateway", "analysis-agent", "api-contract"]
decision_tags: ["caller-owned-generation", "temperature-policy", "breaking-contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/session-omx-1777438836294-vm2fva.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-gateway-generation-control-contract-updated-s3-chat-callers-must-send-full-tu"
wr_kind: "request"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-29T10:25:23.714Z","note":"Completed by S3 on 2026-04-29. Analysis Agent and Build Agent LlmCaller sync/async bodies now emit the full S7 caller-owned tuple (`max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, `chat_template_kwargs.enable_thinking`). Runtime/eval call sites use service-local generation presets and request overrides. Verification: analysis full suite 556 passed, build full suite 299 passed, compileall PASS, hidden temperature=0.3 guard no matches. Evidence: wiki/canon/handoff/s3/session-s3-generation-controls-s7-wr-20260429.md."}]
registered_at: "2026-04-29T08:06:22.961Z"
completed_at: "2026-04-29T10:25:23.714Z"
---

# S7 Gateway generation-control contract updated — S3 chat callers must send full tuple

## Summary
- Kind: request
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 Gateway generation-control contract updated — S3 chat callers must send full tuple

## Summary

S7 updated the LLM Gateway generation-control contract on 2026-04-29. The canonical contract is in the wiki; please read the wiki before changing S3 caller code.

Read first:
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`

## What changed

S7 no longer injects hidden generation defaults. Callers must send all generation controls explicitly.

This is especially relevant to S3 because `/v1/chat` and `/v1/async-chat-requests` are now strict caller-owned surfaces.

Required snake_case fields for both `/v1/chat` and `/v1/async-chat-requests`:
- `max_tokens`
- `temperature`
- `top_p`
- `top_k`
- `min_p`
- `presence_penalty`
- `repetition_penalty`
- `chat_template_kwargs.enable_thinking`

S7 validates presence, type, and range before forwarding. Missing, malformed, or out-of-range values return 422.

Strict JSON behavior also changed in an important way: `X-AEGIS-Strict-JSON: true` only forces `response_format={"type":"json_object"}`. It does not inject or flip `chat_template_kwargs.enable_thinking`; the caller-supplied boolean is preserved.

## S3 action requested

Please update/review S3 LLM caller paths so every `/v1/chat` or `/v1/async-chat-requests` request sends the complete generation tuple above. In particular, do not rely on S7 to backfill `top_p`, `top_k`, `min_p`, penalties, `max_tokens`, `temperature`, or thinking mode.

## S7 verification

S7 verified the change with:
- Focused regression: `100 passed`
- Full S7 test suite: `292 passed`
- Hidden-default zero gate: `PASS`
- Wiki validation: `PASS`
- Critic re-review: `APPROVE`

## Notes

S7 did not inspect or edit S3 code. This WR is the handoff boundary for S3 caller-side alignment.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
