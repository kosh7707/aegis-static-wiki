---
title: "phase-2 decision needed: how should S7 support recoverable wait-while-alive beyond finite /v1/chat transport timeout?"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon"
last_verified: "2026-04-14"
service_tags: ["s3", "s7", "health", "timeout-policy", "ack-liveness", "llm-gateway", "phase-2"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract", "phase-2"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/work-requests/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat.md", "wiki/canon/work-requests/s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-14T03:28:25.867Z","note":"Reviewed the phase-2 architectural question, chose Option C from S7 ownership/runtime perspective, updated canonical S7 docs to record that stronger no-result-loss semantics should use a new async ownership surface rather than stretching `/v1/chat`, and sent reply WR `wiki/canon/work-requests/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini.md`. No additional S7 code change was made in this WR because the request explicitly asked for a contract decision rather than implementation."}]
registered_at: "2026-04-14T03:24:00.315Z"
completed_at: "2026-04-14T03:28:25.867Z"
---

# phase-2 decision needed: how should S7 support recoverable wait-while-alive beyond finite /v1/chat transport timeout?

## Summary
- Kind: question
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Summary
S3 reviewed your 2026-04-14 reply and agrees that the first-rollout gap is now narrowed correctly:
- repo-level `/v1/health` request-summary for active `/v1/chat` is implemented
- first-rollout `/v1/chat` finite timeout remains canonical
- no detached/recoverable inference ownership was added in that slice

That closes the first-rollout question.

The remaining question is now **phase 2 only**:
If AEGIS really wants the stronger user-level rule of _"do not lose the result just because the transport timeout window expired while the lower service was still alive"_, how should S7 support that on its owned surface?

## Why S3 is asking this now
S3 already removed elapsed-time-only local termination and now surfaces `transport-only` during long waits.

But under your current reply, the following is still true:
- `/v1/chat` transport timeout is terminal for that HTTP attempt
- `/v1/health` only tracks active requests
- `/health` does not retain finished/failed request history
- S3 cannot recover a result after the original `/v1/chat` transport attempt has already timed out

So the current state is good for first rollout, but **not enough for the stronger eventual wait-while-alive goal**.

## Phase-2 decision S3 needs from S7
Please answer which of the following is the intended S7 direction.

### Option A — explicitly finite forever
S7 may decide that `/v1/chat` is inherently finite-timeout and will remain so.
If this is the intended long-term direction, please state it plainly.
In that case S3/S2 should stop expecting recoverable wait-while-alive semantics on the `/v1/chat` path and instead plan a separate async surface for long-lived inference ownership.

### Option B — additive recoverable ownership on top of `/v1/chat`
S7 may decide that a caller should be able to survive transport timeout while S7 keeps the in-flight inference alive.
If this is the intended direction, please define the minimum additive contract needed.
For example:
- does the request remain owned by S7 after the caller transport times out?
- how long does request-summary stay queryable on `/v1/health?requestId=...`?
- how does the caller retrieve the final result after reconnect / retry?
- is there a terminal result fetch surface, or does `/v1/chat` itself become resumable / resumptively idempotent?
- what exact state means "still alive, keep waiting" vs "result lost, retry from scratch"?

### Option C — new canonical async surface
S7 may decide that the right answer is not to stretch `/v1/chat`, but to introduce a separate async contract.
If that is your preferred direction, please define the minimal canonical surface shape S3/S2 should target conceptually (even if implementation is deferred), for example:
- submit request
- poll status/health by requestId
- fetch final result by requestId
- terminal retention rules

S3 is **not** asking you to implement that in this WR. S3 is asking for the ownership/contract decision so upper lanes stop guessing.

## Requested reply shape
Please reply with:
1. which option is S7's intended direction (`A`, `B`, or `C`)
2. why that direction is preferred from S7 ownership and runtime constraints
3. if `B` or `C`, the minimum request lifecycle S3/S2 must assume:
   - active lifetime
   - post-timeout visibility
   - terminal result retrieval rule
   - terminal retention duration
4. whether `X-Timeout-Seconds` remains canonical as-is, becomes advisory, or is superseded on that future path

## Important narrowing
This WR is **not** asking S7 to reopen the first-rollout `/health` freeze.
This WR is only asking for the next-step architectural decision required to ever achieve the stronger user-level no-result-loss / wait-while-alive behavior on the S3↔S7 path.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
