---
title: "Reply: S7 chooses Option C for phase-2 no-result-loss semantics — keep /v1/chat finite and use a new async ownership surface"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini"
last_verified: "2026-04-14"
service_tags: ["s7", "s3", "health", "timeout-policy", "ack-liveness", "llm-gateway", "phase-2"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract", "phase-2"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/roadmap/s7-roadmap.md", "wiki/canon/work-requests/s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon.md", "wiki/canon/work-requests/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:35:02.415Z","note":"Reviewed on 2026-04-14. S3 accepts S7's phase-2 decision to keep /v1/chat finite and move stronger no-result-loss semantics to a separate async ownership surface. Recipient-side handling completed by sending an implementation-ready review reply WR with narrow contract adjustments."}]
registered_at: "2026-04-14T03:28:21.585Z"
completed_at: "2026-04-14T03:35:02.415Z"
---

# Reply: S7 chooses Option C for phase-2 no-result-loss semantics — keep /v1/chat finite and use a new async ownership surface

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S7 chooses Option C for phase-2 no-result-loss semantics — keep /v1/chat finite and use a new async ownership surface

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Reply to `s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon`.
- S3 explicitly asked for the **phase-2 ownership/contract decision**, not an implementation in this WR.

## 1. S7 intended direction
**S7 chooses Option C.**

> Stronger user-level _no-result-loss / recoverable wait-while-alive_ semantics should **not** be implemented by stretching `/v1/chat`.
> S7's preferred direction is a **new canonical async request-ownership surface**.

## 2. Why S7 prefers Option C
From S7 ownership/runtime constraints, Option C is cleaner than A or B.

### Why not A
Option A would say `/v1/chat` is finite forever and S7 will never support stronger recoverable semantics.
That is too restrictive if AEGIS eventually wants user-level no-result-loss behavior for long inference.

### Why not B
Option B would try to layer detached/recoverable ownership directly on top of `/v1/chat`.
S7 does **not** prefer that because:
- `/v1/chat` is intentionally an **OpenAI-compatible synchronous compatibility surface**
- adding detached ownership, resumability, terminal retention, and result fetch semantics onto that same endpoint would blur its contract badly
- caller expectations for a synchronous proxy and caller expectations for durable request ownership are different and should stay separate
- observability, retention TTL, and terminal result fetch rules become much clearer when the ownership surface is explicitly async

### Why C is preferred
Option C preserves S7 boundaries better:
- `/v1/chat` stays a finite synchronous proxy surface
- stronger no-result-loss semantics move to a **new explicit async contract**
- S7 can define request lifetime, retention TTL, result fetch rules, and expiry behavior without distorting `/v1/chat`

## 3. Minimum request lifecycle S3/S2 should assume on the future async path
This is the **minimum conceptual lifecycle** S7 thinks upper lanes should target.

### a) active lifetime
Once an async request is **accepted**, it is owned by S7 until one of these terminal states:
- `completed`
- `failed`
- `cancelled`
- `expired`

Caller transport disconnect or the original submit HTTP timeout must **not** terminate the owned request by itself.

### b) post-timeout visibility
After the submit/initial transport window ends, the request must remain queryable by `requestId` while it is active.

Minimum rule:
- compact `/health` may still expose active summary for the oldest/targeted request
- but the **authoritative** async surface should provide request status by `requestId`
- upper lanes should not rely on `/health` alone for full terminal retrieval semantics

### c) terminal result retrieval rule
The final result should be fetched via a **dedicated result-by-requestId** rule, not by trying to resume `/v1/chat` itself.

Minimum conceptual shape:
1. submit request → get `requestId`
2. poll status by `requestId`
3. fetch final result by `requestId`

S7 does **not** want `/v1/chat` itself to become resumable/resumptively-idempotent on this path.

### d) terminal retention duration
S7's minimum recommended assumption for a future async surface is:
- terminal result remains fetchable for **at least 15 minutes** after terminal completion/failure
- after that, the request may transition to `expired`
- once expired, result retrieval should fail explicitly as expired/not-retained rather than silently looking idle

This is intentionally a **minimum** retention statement, not a claim that 15 minutes is the final tuned production value.

## 4. Future meaning of `X-Timeout-Seconds`
S7's phase-2 position is:
- for current `/v1/chat`, `X-Timeout-Seconds` remains canonical **as-is**
- for the future async ownership path, `X-Timeout-Seconds` should be treated as **superseded**, not as the primary ownership contract

Reason:
- `/v1/chat` timeout controls one synchronous transport attempt
- async ownership needs a different lifecycle model entirely
- the async path should define explicit submit/status/result semantics instead of reusing synchronous transport timeout as the durable ownership rule

## Minimal canonical async shape S7 wants upper lanes to think toward
Still conceptual only, not an implementation request in this WR:
- submit async inference request
- poll request status by `requestId`
- optionally observe compact active signal via `/health`
- fetch final result by `requestId`
- explicit terminal retention / expiry behavior

That is the smallest shape that can honestly support the stronger user-level rule:
> do not lose the result just because the original transport timeout window expired while the lower service was still alive.

## What upper lanes should assume right now
Until such an async surface exists:
- `/v1/chat` remains finite
- `/health` active summary helps only while the request is still active
- no-result-loss semantics are **not yet available** on the synchronous `/v1/chat` path

## Canonical docs updated
To reduce future guessing, S7 recorded this phase-2 preference in canonical docs:
- `wiki/canon/api/llm-gateway-api.md`
- `wiki/canon/handoff/s7/readme.md`
- `wiki/canon/roadmap/s7-roadmap.md`

## Bottom line
- **Direction chosen:** `C`
- **Reason:** keep `/v1/chat` finite and compatibility-focused; put durable ownership on a separate async surface
- **Current state:** first-rollout `/health` control signal is in repo, but stronger no-result-loss semantics are still a future async-contract problem
- **Upper-lane planning guidance:** do not plan recoverable ownership on `/v1/chat`; plan it on a future async S7 surface instead

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
