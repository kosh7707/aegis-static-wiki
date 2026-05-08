---
title: "S7 implement wait-while-alive async LLM ownership per health-control v2"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2"
last_verified: "2026-05-08"
service_tags: ["s7", "s3", "llm-gateway", "timeout-policy", "async-ownership", "health-control-v2"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "async-ownership", "doc-reconciliation"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-08T02:39:29.874Z","note":"S7 implemented and verified health-control v2 async LLM ownership. /v1/chat remains finite; /v1/async-chat-requests no longer imposes a fixed elapsed backend read ceiling, refreshes active queued/running ownership lease, preserves running+transport-only, and keeps explicit terminal failure/cancel/expiry/result semantics. Canonical API/spec docs updated. Evidence recorded in wiki/canon/handoff/s7/session-omx-1778205195183-z7dmmz.md. S7 registered reply WR wiki/canon/work-requests/s7-to-s3-s7-reply-async-llm-ownership-wait-while-alive-health-control-v2-implemented.md."}]
registered_at: "2026-05-08T02:11:11.331Z"
completed_at: "2026-05-08T02:39:29.874Z"
---

# S7 implement wait-while-alive async LLM ownership per health-control v2

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 requests S7 to implement/validate the S7-owned parts of `health-control-signal-rollout-v2.md` for long-running LLM requests.

## Routing
Canonical spec to read first:
- `wiki/canon/specs/health-control-signal-rollout-v2.md`

Related existing API/spec context:
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/specs/health-control-signal-rollout-v1.md`

## Requested S7 scope
1. Keep `/v1/chat` finite if needed as a synchronous compatibility surface.
2. Treat `/v1/async-chat-requests` as the production long-running ownership surface.
3. Remove or neutralize elapsed-time-only backend aborts on async ownership while the backend attempt is alive and no terminal failure exists.
4. Preserve status polling with `queued`/`running`/terminal state plus `localAckState`.
5. Use `running + transport-only` for long non-streaming inference when S7 owns a live attempt but cannot prove token-level progress.
6. Surface real backend failure, parser/contract break, cancel, or expiry as terminal state with `blockedReason` or equivalent terminal detail.
7. Ensure result retrieval remains possible after long completion within documented retention/lease semantics.

## Documentation requirement
When S7 implements v2 behavior, update `wiki/canon/api/llm-gateway-api.md` so it clearly distinguishes finite `/v1/chat` compatibility behavior from async ownership wait-while-alive behavior. Remove or revise stale guidance that says S3 should use a fixed bounded async poll deadline as the target long-running policy.

## Acceptance expectations
- A request can run beyond the former 1740/1800s elapsed ceiling without S7 or S3-style polling cancelling solely because of age.
- Polling clients continue on `queued`/`running` without ack-break/blocked.
- Polling clients abort on `ack-break`, `failed`, `blockedReason`, explicit cancel, or unrecoverable ownership expiry.
- Tests/evidence clearly distinguish compatibility `/v1/chat` finite behavior from async ownership wait-while-alive behavior.

## Notes
This WR asks for S7-owned producer behavior. S3 will update its consumer poller after S7 confirms the async ownership contract is live.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
