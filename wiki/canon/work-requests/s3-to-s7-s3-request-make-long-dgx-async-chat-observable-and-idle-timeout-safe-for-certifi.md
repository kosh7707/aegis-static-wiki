---
title: "S3 request: make long DGX async-chat observable and idle-timeout safe for certificate-maker"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi"
last_verified: "2026-05-21"
service_tags: ["s3-analysis-agent", "s7-llm-gateway", "dgx-spark", "paper-e2e"]
decision_tags: ["timeout-policy", "health-control-v2", "certificate-maker"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-request-make-long-dgx-async-chat-observable-and-idle-timeout-safe-for-certifi"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-21T05:42:38.916Z","note":"S7 implemented internal streaming aggregation for async-chat, additive backendActivity status/health fields, and explicit backend_transport_disconnected/backend_stream_parse_error classifications. Verification: focused streaming/activity tests 6 passed, async ownership suite 22 passed, full S7 tests 334 passed, compileall passed, and live-safe localhost S7 + DGX smoke completed with backendActivity stream chunks and result content `pong`. API contract updated at wiki/canon/api/llm-gateway-api.md; reply WR registered at wiki/canon/work-requests/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen.md."}]
registered_at: "2026-05-21T04:51:35.870Z"
completed_at: "2026-05-21T05:42:38.916Z"
---

# S3 request: make long DGX async-chat observable and idle-timeout safe for certificate-maker

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request

During the certificate-maker paper smoke, S3 confirmed S7 async-chat exposes basic request status, but the long DGX/Qwen3.6-27B backend call still failed after a long silent inference window. Please harden S7 long-running async-chat so that "if all services are alive, the request does not fail due to elapsed time or idle transport silence" holds for DGX Spark paper workloads.

## Evidence

- Paper run: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-smoke-20260521-133139`
- Case: `case-bt-0001-certificate-maker-traceaudit-30a4b01e3382`
- Root request id: `e2e-certmaker-start-20260521-133139`
- S7 async id: `acr_fb419fb36056461a`
- S3 routed correctly to `POST /v1/async-chat-requests` and polled status for ~17 minutes.
- S4 and S5 setup completed before the LLM phase; S3 state trace reached `S4_STATIC_EVIDENCE_READY` and `S5_CODE_KB_READY`.
- S7 status while running was visible:
  - `state=running`
  - `phase=llm-inference`
  - `activeRequestCount=1`
  - health/circuit breaker ready/closed
- Terminal S7 status:
  - `state=failed`
  - `localAckState=ack-break`
  - `blockedReason=internal_error`
  - `error=Async request did not complete successfully`
  - `endedAt=2026-05-21T04:49:34.461Z`
- S3 returned `502` after `TOTAL_TIME=1046.435065` seconds.
- S7 log root cause: `httpx.RemoteProtocolError: Server disconnected without sending a response` in async-chat background request.
- DGX proxy log at the same timestamp: `socat[...] E read(...): Connection timed out`.

## Why this belongs to S7

The failure occurred inside the S7 async-chat backend call after S3 had already handed off to S7 and while S3 was successfully observing S7 status. Separate health checks stayed green, but they did not keep the long backend HTTP response connection alive and did not prove token-generation progress.

## Requested behavior

1. For long DGX async-chat requests, avoid idle backend transport timeout. Candidate implementation: call the DGX OpenAI-compatible backend with streaming enabled and aggregate chunks into the existing async result envelope, or otherwise ensure the backend connection produces/receives keepalive-progress before proxy/VPN idle timeouts.
2. Expose stronger in-flight progress in S7 status, beyond `phase=llm-inference`, when possible:
   - last backend activity timestamp,
   - streamed chunk/token count or approximate output token count,
   - elapsed inference time,
   - clear backend idle/transport failure classification.
3. Preserve the existing async API contract (`/v1/async-chat-requests/{id}`, `/result`) for S3.
4. Ensure long-running certificate-maker paper requests do not fail solely because Qwen3.6-27B is slow when S7, DGX proxy, and backend health are otherwise alive.

## Acceptance checks

- Re-run the certificate-maker paper case or an equivalent long prompt against DGX/Qwen3.6-27B.
- The S7 async status remains queryable throughout the run.
- The status shows in-flight progress or backend activity recency.
- The backend connection does not die with proxy/VPN idle `RemoteProtocolError` before the model completes.
- S3 receives a successful async result or a classified non-idle-timeout failure with actionable error details.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
