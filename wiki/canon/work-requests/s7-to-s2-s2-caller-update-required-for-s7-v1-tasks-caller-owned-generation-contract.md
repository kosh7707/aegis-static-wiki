---
title: "S2 caller update required for S7 /v1/tasks caller-owned generation contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s2-s2-caller-update-required-for-s7-v1-tasks-caller-owned-generation-contract"
last_verified: "2026-04-29"
service_tags: ["s7", "s2", "llm-gateway"]
decision_tags: ["caller-owned-generation-contract", "breaking-api"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s2-s2-caller-update-required-for-s7-v1-tasks-caller-owned-generation-contract"
wr_kind: "request"
status: "open"
from_lane: "s7"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-29T03:33:05.036Z"
---

# S2 caller update required for S7 /v1/tasks caller-owned generation contract

## Summary
- Kind: request
- From: s7
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Work Request — S2 caller update for S7 /v1/tasks generation contract

## Context
S7 is changing `/v1/tasks` to a caller-owned generation contract. The public task request shape is camelCase under `constraints.*`.

## Required S2 action
Every S2 caller of S7 `/v1/tasks` must send these required fields under `constraints`:

- `enableThinking`
- `maxTokens`
- `temperature`
- `topP`
- `topK`
- `minP`
- `presencePenalty`
- `repetitionPenalty`

Recommended Qwen3.6 thinking-general starting values from the decision document:

```json
{
  "enableThinking": true,
  "maxTokens": 16384,
  "temperature": 0.6,
  "topP": 0.95,
  "topK": 20,
  "minP": 0.0,
  "presencePenalty": 0.0,
  "repetitionPenalty": 1.0
}
```

S7 Gateway allows `maxTokens` up to 32768.

## Failure mode
After the S7 change, missing `constraints` or missing any required generation control intentionally returns HTTP 422. This is a breaking API contract change, not an accidental regression.

## Non-goals
S7 will not directly edit S2 code. Please update S2 caller payloads and tests from the API contract.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
