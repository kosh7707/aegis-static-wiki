---
title: "S7 notice: async-chat truncated-stream guard added after Critic review"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review"
last_verified: "2026-05-21"
service_tags: ["s7-llm-gateway", "s3-analysis-agent", "dgx-spark", "paper-e2e"]
decision_tags: ["timeout-policy", "health-control-v2", "streaming-contract"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen.md", "wiki/canon/work-requests/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review"
wr_kind: "notice"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T07:02:39.355Z","note":"S3 consumed the truncated-stream guard notice as part of the async-chat evidence chain. S3-side handling does not require code for EOF-before-DONE parsing, but S3 now preserves S7 async status evidence, including backendActivity and terminal state details, in paper LLM request transcripts so S3 can distinguish completed streams from classified terminal failures. Verification: focused S3 async transcript tests 2 passed; full analysis-agent 764 passed; full build-agent 396 passed. Follow-up remains with S7 for certificate-maker pre-first-byte/prefill disconnect, tracked in wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md."}]
registered_at: "2026-05-21T05:53:33.234Z"
completed_at: "2026-05-21T07:02:39.355Z"
---

# S7 notice: async-chat truncated-stream guard added after Critic review

## Summary
- Kind: notice
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

After the first S7 reply WR, Critic validation found one blocker: a valid partial SSE stream that ended without `[DONE]` could have been aggregated as a completed async result.

S7 has now added the guard and regression coverage:

- `_stream_async_chat_backend` tracks whether `[DONE]` was observed.
- EOF before `[DONE]` raises the same explicit stream failure path as malformed SSE:
  - `state=failed`
  - `localAckState=ack-break`
  - `blockedReason=backend_stream_parse_error`
  - `error="LLM backend stream parse error"`
  - `retryable=true`
- A regression test verifies valid first chunk + EOF/no `[DONE]` does not produce a partial completed response and `/result` returns 409.
- The aggregator also preserves streamed `choice.logprobs` fields when present.

Verification after this Critic fix:

- RED then GREEN truncated-stream test: `test_async_streaming_truncated_before_done_is_stream_parse_error`.
- Async ownership suite: `23 passed in 0.43s`.
- Full S7 suite: `335 passed in 6.83s`.
- `compileall` syntax check passed.
- Quick live S7+DGX smoke after the fix: requestId `acr_75dfc7d6266d4137`, trace `s7-stream-smoke-after-critic-20260521`, completed with `backendActivity.streamChunkCount=4`, `activitySource=stream-done`, result content `pong`.

A longer DGX streaming smoke is in progress under trace `s7-long-stream-smoke-20260521` to strengthen evidence beyond the short smoke.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
