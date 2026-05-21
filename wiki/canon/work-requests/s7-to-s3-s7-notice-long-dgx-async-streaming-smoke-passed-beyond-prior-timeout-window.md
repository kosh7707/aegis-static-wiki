---
title: "S7 notice: long DGX async streaming smoke passed beyond prior timeout window"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window"
last_verified: "2026-05-21"
service_tags: ["s7-llm-gateway", "s3-analysis-agent", "dgx-spark", "paper-e2e"]
decision_tags: ["timeout-policy", "health-control-v2", "streaming-contract"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen.md", "wiki/canon/work-requests/s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review.md", "wiki/canon/work-requests/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window"
wr_kind: "notice"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T07:02:39.530Z","note":"S3 consumed the long DGX streaming smoke notice and ran the actual certificate-maker path for recipient-side validation. The S7 long-smoke evidence is accepted as proof that post-stream activity can stay observable beyond the prior timeout window, but it does not cover certificate-maker's pre-first-byte/prefill silent window. Certificate-maker rerun evidence: /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850, root request e2e-certmaker-rerun-start-20260521-153850, async acr_4ec11c2a720c42c7, HTTP 502 after 1060.389556s, blockedReason=backend_transport_disconnected, backendActivity=null. S3 registered S7 follow-up WR for that remaining gap."}]
registered_at: "2026-05-21T06:10:46.744Z"
completed_at: "2026-05-21T07:02:39.530Z"
---

# S7 notice: long DGX async streaming smoke passed beyond prior timeout window

## Summary
- Kind: notice
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Notice

S7 completed a longer live DGX streaming smoke after the truncated-stream Critic fix.

## Evidence

- Surface: already-running localhost S7 `/v1/async-chat-requests` to DGX/Qwen3.6-27B via the configured proxy. No service restart was performed.
- Trace request id: `s7-long-stream-smoke-20260521`
- Async request id: `acr_3addbe96969848f4`
- Start: `2026-05-21T05:51:58.556Z`
- Completed: `2026-05-21T06:10:12.766Z`
- Elapsed: `1098.0s` (~18.3 minutes), exceeding the prior ~17 minute failure window.
- Final state: `completed`, `blockedReason=null`, `localAckState=null`.
- Final `backendActivity`:
  - `streamChunkCount=4099`
  - `responseBytes=973363`
  - `approxCompletionChars=8192`
  - `activitySource=stream-done`
- Result usage: `prompt_tokens=45`, `completion_tokens=8192`, `total_tokens=8237`.
- Finish reason: `length`.

## Interpretation

This is not the full certificate-maker paper run, but it is an equivalent long DGX async streaming workload through S7 that ran beyond the timestamp at which the previous non-streaming async call died with `RemoteProtocolError`/proxy idle timeout. The request stayed observable through `backendActivity` and completed without `internal_error`, `backend_timeout`, or `backend_transport_disconnected`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
