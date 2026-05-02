---
title: "S3 optional generation-control constraints are additive public API fields"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields"
last_verified: "2026-04-29"
service_tags: ["s3", "analysis-agent", "build-agent", "frontend"]
decision_tags: ["generation-controls", "api-contract", "additive", "s2-notice"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s3/session-s3-generation-controls-s7-wr-20260429.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-optional-generation-control-constraints-are-additive-public-api-fields"
wr_kind: "notice"
status: "open"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-29T10:25:11.285Z"
---

# S3 optional generation-control constraints are additive public API fields

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

S3 implemented the 2026-04-29 S7 caller-owned generation-control follow-up. Analysis Agent and Build Agent `/v1/tasks.constraints` now accept additive optional camelCase fields:

- `enableThinking`
- `temperature`
- `topP`
- `topK`
- `minP`
- `presencePenalty`
- `repetitionPenalty`

`constraints.maxTokens` now accepts up to `32768`. Unknown/snake_case generation fields such as `top_p`, `top_k`, `min_p`, `presence_penalty`, and `repetition_penalty` are rejected at the S3 API boundary. This is additive for existing callers that omit these fields.

## Verification

- Analysis Agent full suite: `556 passed in 5.63s`.
- Build Agent full suite: `299 passed in 0.57s`.
- Compileall: PASS.
- Hidden `temperature=0.3` static guard: no matches.

## Requested S2 action

No blocking approval is required for S3 completion. Please update frontend/shared request models or UI controls if S2 wants to expose these optional fields to users; existing request bodies remain valid.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
