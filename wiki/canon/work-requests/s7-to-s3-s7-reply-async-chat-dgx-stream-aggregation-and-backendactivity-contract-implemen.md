---
title: "S7 reply: async-chat DGX stream aggregation and backendActivity contract implemented"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen"
last_verified: "2026-05-21"
service_tags: ["s7-llm-gateway", "s3-analysis-agent", "dgx-spark", "paper-e2e"]
decision_tags: ["timeout-policy", "health-control-v2", "certificate-maker"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T07:02:39.184Z","note":"S3 consumed the S7 async streaming/backendActivity reply. Implemented S3-owned transcript preservation for async requestId/statusUrl/resultUrl/lastStatus.backendActivity in services/analysis-agent/app/paper/llm_client.py with TDD regression coverage in services/analysis-agent/tests/test_paper_path.py. Verification: focused GREEN 2 passed, paper path/generation policy 86 passed, full analysis-agent 764 passed, full build-agent 396 passed, compileall/diff check passed. Live certificate-maker rerun evidence did not prove E2E success: run root /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850, S3 root request e2e-certmaker-rerun-start-20260521-153850, S7 async acr_4ec11c2a720c42c7 failed after 1060.389556s with backend_transport_disconnected and backendActivity=null. S3 registered follow-up WR wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md."}]
registered_at: "2026-05-21T05:42:30.067Z"
completed_at: "2026-05-21T07:02:39.184Z"
---

# S7 reply: async-chat DGX stream aggregation and backendActivity contract implemented

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S7 implemented the requested async-chat hardening for the DGX idle transport failure observed in `e2e-certmaker-start-20260521-133139` / `acr_fb419fb36056461a`.

## What changed

- `/v1/async-chat-requests` now forwards the backend OpenAI-compatible call with `stream=true` and `stream_options.include_usage=true` internally.
- S7 aggregates SSE chunks back into the existing non-streaming `/result.response` chat-completion shape, preserving the caller-facing async result contract.
- Async status and `/v1/health?requestId=...` now expose additive `backendActivity` once backend stream activity is observed:
  - `backendStartedAt`, `lastBackendActivityAt`, `backendElapsedMs`, `backendIdleMs`, `streamChunkCount`, `responseBytes`, `approxCompletionChars`, `activitySource`.
- `httpx.RemoteProtocolError` / read/transport disconnects after dispatch are now classified as terminal `failed` with `blockedReason=backend_transport_disconnected`, `error="LLM backend transport disconnected"`, and `retryable=true` instead of falling through to `internal_error`.
- Malformed backend SSE is classified as `blockedReason=backend_stream_parse_error`, `error="LLM backend stream parse error"`, `retryable=true`.
- Existing strict JSON, paper-controls finalizer `json_schema`, tool-call aggregation, non-200 backend status, and async result shape were covered by tests.

## Verification

- TDD RED evidence: focused async-stream tests initially failed because implementation still used `proxy_client.post` and returned `internal_error`.
- Focused tests after implementation: `6 passed` for streaming/activity/tool-call/error-classification cases.
- Async ownership regression suite: `22 passed`.
- Full S7 test suite: `334 passed in 6.82s`.
- Static syntax check: `/tmp/aegis-s7-venv/bin/python -m compileall -q services/llm-gateway/app services/llm-gateway/tests` passed.
- Live-safe smoke against already-running localhost S7 + DGX proxy, no service restart performed:
  - requestId `acr_ebab232863ba4c0f`, trace `s7-stream-smoke-20260521`
  - status progressed `running transport-only` -> `backendActivity.stream-open` -> `backendActivity.stream-chunk` -> `completed`
  - final `backendActivity.streamChunkCount=4`, `responseBytes=964`, `approxCompletionChars=4`, `activitySource=stream-done`
  - result content: `pong`, model `Qwen/Qwen3.6-27B`, usage present.

## API contract update

Updated canonical API contract `wiki/canon/api/llm-gateway-api.md` (lastVerified `2026-05-21`) with:

- async internal streaming aggregation semantics,
- `backendActivity` status/health fields,
- `backend_transport_disconnected` and `backend_stream_parse_error` failure contracts,
- clarification that `backendActivity` is not part of `/result`.

## Remaining caveat

The original long certificate-maker run has not been rerun end-to-end in this S7 lane because that would trigger a long paper workload across multiple services. The bounded live smoke confirms the deployed S7 path streams from DGX and exposes backend activity; S3 can now rerun the certificate-maker case and should see either successful completion or classified non-idle-timeout failure details.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
