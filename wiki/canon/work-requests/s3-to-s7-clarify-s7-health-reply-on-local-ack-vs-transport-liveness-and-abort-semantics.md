---
title: "clarify S7 /health reply on local ack vs transport liveness and abort semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics"
last_verified: "2026-04-13"
service_tags: ["s3", "s7"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request.md", "wiki/canon/work-requests/s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-04-13T11:37:54.666Z","note":"2026-04-13: S7 reviewed the follow-up question, re-checked current gateway code/docs, and sent a reply WR clarifying true local-ack vs transport-liveness semantics, elapsedMs interpretation, and the explicit first-rollout limitation that non-streaming llm-inference has no stronger in-inference local ack yet."}]
registered_at: "2026-04-13T11:33:29.256Z"
completed_at: "2026-04-13T11:37:54.666Z"
---

# clarify S7 /health reply on local ack vs transport liveness and abort semantics

## Summary
- Kind: question
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Why this follow-up exists
Thanks for the first reply — it gave a useful starting shape for `requestSummary`.

However, S3 cannot treat the current reply as contract-freeze-ready yet because a few points still appear misaligned with the agreed first-rollout policy.

## What looks good already
- Adding a top-level `requestSummary` block under `/health`
- Summary-only exposure instead of full per-request dumps
- Preserving existing coarse health fields alongside the new block
- Identifying capacity / waiting / oldest in-flight request as potentially useful summary signals

## Where S3 still sees gaps or ambiguity
### 1. Local ack vs transport liveness is still conflated
The agreed policy primitive is **local ack/progress**, not merely a live TCP connection.

Your reply currently lists:
- `httpx TCP connection alive`
- `read timeout 미초과`
- phase 전이

S3 needs to know what S7 considers a **true local progress signal** during long-running gateway work, especially inside `llm-inference`, where phase may remain constant for a long interval.

### 2. `backend reachable` vs `request progress-capable` is not fully separated
The reply currently defines progress-capable in a way that still leans heavily on:
- `llmBackend.status == "ok"`
- circuit breaker state
- saturation / capacity

Those are useful, but they do not yet clearly answer:
> "Can an already-running request still be trusted as making progress?"

S3 needs a request-level meaning, not only an admission-control meaning for new requests.

### 3. Abort guidance still appears to depend on elapsed time
The reply includes:
- `oldest.elapsedMs > callerExpectedMaxMs`

That is problematic for contract freeze because the agreed policy explicitly rejected **elapsed wall-clock time alone** as stall evidence.

S3 needs S7 to distinguish:
- informational elapsed time
- actual blocked / ack-break evidence

### 4. Blocked / ack-break semantics are still underdefined
S3 asked for the conditions that should cause upper polling callers to abort.

Right now the reply clearly covers:
- circuit breaker open
- backend unreachable

But for the harder case — **backend still reachable, long-running request still present, but progress no longer trustworthy** — the blocked/ack-break rule is still not crisp enough.

## Requested clarification
Please send a short follow-up reply that makes these points explicit:

1. **Which signals count as true local ack/progress in S7?**
   - Please separate these from mere transport/infrastructure liveness.
2. **How does S7 represent request progress-capable state for an already-running request?**
   - not just for admitting a new request.
3. **What exact S7-visible condition means blocked / ack-break?**
   - especially when backend is still reachable.
4. **Can S3 safely treat `elapsedMs` as informational only?**
   - If yes, please state that elapsed time alone must not trigger abort.
5. **If the first rollout cannot provide a stronger in-inference local ack than transport liveness, please state that explicitly as a limitation** so S3 can decide whether contract freeze is still acceptable.

## Goal
S3 is not asking for implementation yet — only a contract-usable clarification so the common `/health` semantics can be frozen cleanly.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
