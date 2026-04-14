---
title: "start immediate S7 work on opt-in strict JSON mode for /v1/chat"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat"
last_verified: "2026-04-14"
service_tags: ["s3", "s7"]
decision_tags: ["llm-gateway", "response-format", "json-control", "implementation"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-14T01:07:27.653Z","note":"2026-04-14: S7 implemented opt-in strict JSON mode for /v1/chat in repo via X-AEGIS-Strict-JSON activation, added gateway-side request control injection and response validation/normalization, updated S7 docs/contracts, verified with targeted/full tests plus in-process smoke, and replied to S3 with rollout status. Live localhost runtime still showed stale pre-restart behavior, so runtime rollout/restart remains needed before callers can observe the new header semantics."}]
registered_at: "2026-04-14T01:02:20.193Z"
completed_at: "2026-04-14T01:07:27.653Z"
---

# start immediate S7 work on opt-in strict JSON mode for /v1/chat

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 reviewed S7's reply on the live `/v1/chat` JSON-only control leak.

The limitation is now understood and accepted as current behavior, but the user wants **S7 to start work immediately** rather than leaving this as documentation-only backlog.

## Requested work
Please begin **bounded implementation work now** on the safest tightening path for `/v1/chat`.

### Requested direction
Prefer an **opt-in strict JSON mode** rather than silently changing the default pass-through behavior for every caller.

## Requested implementation goal
S7 should implement a path where a caller can request strict downstream JSON behavior from `/v1/chat`, and S7 enforces that contract more strongly than today.

### Minimum acceptable outcome
A caller-enabled strict mode that:
1. ensures JSON-mode invocation controls are applied
   - `response_format={"type":"json_object"}`
   - `chat_template_kwargs.enable_thinking=false`
2. rejects or clearly fails requests/responses that do not satisfy the strict mode contract
3. gives callers an unambiguous supported contract for parsing strict JSON
4. does **not** silently break existing non-strict `/v1/chat` callers

### Optional but desirable tightening
- response-envelope scrubbing of backend-specific `reasoning` leakage in strict mode
- clearer gateway-side validation/rejection on malformed JSON-mode responses

## What S3 needs back
Please reply with:
1. the exact implementation path S7 chose
2. whether strict mode is opt-in and how the caller activates it
3. whether existing `/v1/chat` default behavior remains backward-compatible
4. what S3 should do immediately in the meantime, if any temporary caller-side guard is still required
5. fresh verification evidence from S7 side

## Why now
S3 already reproduced the live limitation and accepted the diagnosis. The next useful step is implementation, not more diagnosis.

## Scope note
This WR is about `/v1/chat` response-control tightening only. It does not reopen the separate `/health` rollout freeze work.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
