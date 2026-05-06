---
title: "S7 Gateway generation-control contract updated — S2 callers must follow wiki contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s2-s7-gateway-generation-control-contract-updated-s2-callers-must-follow-wiki-contr"
last_verified: "2026-05-02"
service_tags: ["s7", "s2", "llm-gateway", "api-contract"]
decision_tags: ["caller-owned-generation", "temperature-policy", "breaking-contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/session-omx-1777438836294-vm2fva.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s2-s7-gateway-generation-control-contract-updated-s2-callers-must-follow-wiki-contr"
wr_kind: "request"
status: "completed"
from_lane: "s7"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-02T16:15:33.623Z","note":"S2 direct S7 caller path updated to send the full caller-owned generation tuple with S2 defaults true/16384/0.6/0.95/20/0.0/0.0/1.0. Canonical S2 contracts updated; targeted tests and backend suite passed."}]
registered_at: "2026-04-29T08:06:22.937Z"
completed_at: "2026-05-02T16:15:33.623Z"
---

# S7 Gateway generation-control contract updated — S2 callers must follow wiki contract

## Summary
- Kind: request
- From: s7
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 Gateway generation-control contract updated — S2 callers must follow wiki contract

## Summary

S7 updated the LLM Gateway generation-control contract on 2026-04-29. The canonical contract is in the wiki; please treat the wiki as the source of truth.

Read first:
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/llm-gateway.md`

## What changed

S7 no longer injects hidden generation defaults. Callers must send all generation controls explicitly.

For `/v1/tasks`, the required camelCase fields remain:
- `constraints.enableThinking`
- `constraints.maxTokens`
- `constraints.temperature`
- `constraints.topP`
- `constraints.topK`
- `constraints.minP`
- `constraints.presencePenalty`
- `constraints.repetitionPenalty`

Missing values return 422 by contract.

The contract was also tightened for OpenAI-compatible chat surfaces:
- `/v1/chat`
- `/v1/async-chat-requests`

Those now require snake_case fields:
- `max_tokens`
- `temperature`
- `top_p`
- `top_k`
- `min_p`
- `presence_penalty`
- `repetition_penalty`
- `chat_template_kwargs.enable_thinking`

S7 validates presence, type, and range before forwarding.

## S2 action requested

Please review the updated S7 wiki contract and ensure any S2 caller path that invokes S7 sends the complete generation tuple. If S2 delegates caller behavior to S3 for chat/agent paths, no direct S2 code change may be needed, but the platform-facing contract should still be considered updated.

## Verification on S7 side

S7 verified the change with:
- Focused regression: `100 passed`
- Full S7 test suite: `292 passed`
- Hidden-default zero gate: `PASS`
- Wiki validation: `PASS`
- Critic re-review: `APPROVE`

## Notes

S7 did not inspect or edit S2 code. This WR is the handoff boundary for caller-side alignment.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
