---
title: "S3 generation controls alignment after S7 caller-owned contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s3-generation-controls-alignment-after-s7-caller-owned-contract"
last_verified: "2026-04-29"
service_tags: ["s7", "s3", "llm-gateway"]
decision_tags: ["caller-owned-generation-contract", "sampling-policy"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/context/decisions/temperature-policy-analysis-20260428.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s3-generation-controls-alignment-after-s7-caller-owned-contract"
wr_kind: "request"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-29T10:25:23.760Z","note":"Completed by S3 on 2026-04-29. Public S3 constraints accept additive camelCase generation overrides, reject snake_case/unknown generation fields at API boundary, and align `maxTokens`/runtime caps to 32768. S3 registered S3→S2 notice for optional public fields: wiki/canon/work-requests/s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields.md. Verification evidence recorded in wiki/canon/handoff/s3/session-s3-generation-controls-s7-wr-20260429.md."}]
registered_at: "2026-04-29T03:33:05.095Z"
completed_at: "2026-04-29T10:25:23.760Z"
---

# S3 generation controls alignment after S7 caller-owned contract

## Summary
- Kind: request
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Work Request — S3 generation controls alignment after S7 contract update

## Context
S7 is enforcing caller-owned generation controls on `/v1/tasks` and preserving snake_case passthrough for `/v1/chat` and `/v1/async-chat-requests`.

## S3 action requested
Please align S3 LLM caller surfaces with the temperature-policy analysis:

- Send explicit sampling controls when using S7 chat/async surfaces where applicable:
  - `max_tokens`
  - `temperature`
  - `top_p`
  - `top_k`
  - `min_p`
  - `presence_penalty`
  - `repetition_penalty`
  - `chat_template_kwargs.enable_thinking`
- Treat S7 `/v1/tasks` callers, if any, as requiring camelCase `constraints.*` fields.
- Treat analysis-agent `maxTokens <= 32768` alignment as S3-owned/documented dependency, not S7 code work.

## Failure/compatibility note
S7 `/v1/tasks` missing required generation controls intentionally returns 422. `/v1/chat` and async remain snake_case passthrough/additive surfaces, not required-breaking task contracts.

## Non-goals
S7 will not directly edit S3 code in this pass.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
