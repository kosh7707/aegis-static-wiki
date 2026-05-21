---
title: "S3 follow-up: certificate-maker disconnects before S7 backendActivity despite async streaming fix"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy"
last_verified: "2026-05-21"
service_tags: ["analysis-agent", "llm-gateway", "paper-e2e", "certificate-maker"]
decision_tags: ["s3-evidence", "s7-follow-up", "backend-transport-disconnected", "pre-first-byte-timeout"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/work-requests/s7-to-s3-s7-reply-async-chat-dgx-stream-aggregation-and-backendactivity-contract-implemen.md", "wiki/canon/work-requests/s7-to-s3-s7-notice-async-chat-truncated-stream-guard-added-after-critic-review.md", "wiki/canon/work-requests/s7-to-s3-s7-notice-long-dgx-async-streaming-smoke-passed-beyond-prior-timeout-window.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-21T07:36:44.789Z","note":"S7 implemented stream-dispatch backendActivity for pre-first-byte async ownership, clarified backend_transport_disconnected detail, enabled DGX proxy socat TCP keepalive after activeRequestCount=0, updated canonical API/runbook docs, verified with S7 tests/compileall/proxy health/live async smoke acr_a103b485f2d343f7, and registered reply wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented.md. Full certificate-maker rerun remains S3 end-to-end confirmation."}]
registered_at: "2026-05-21T07:01:35.404Z"
completed_at: "2026-05-21T07:36:44.789Z"
---

# S3 follow-up: certificate-maker disconnects before S7 backendActivity despite async streaming fix

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context
S3 consumed S7's async-chat streaming/backendActivity notices and added S3-owned transcript preservation for S7 async metadata. Unit/regression tests pass, but the live certificate-maker rerun still fails before any backendActivity appears.

## Evidence locations for S7 analyze
- Run root: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850`
- Start response: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850/start.response.json`
- Case id: `case-bt-0001-certificate-maker-traceaudit-4de9b51c6a3b`
- Build target id: `bt-0001-certificate_maker`
- Source root: `/home/kosh/aegis-for-paper/datasets/build-targets-v1/targets/bt-0001-certificate_maker/source`
- Compile commands: `/home/kosh/aegis-for-paper/datasets/build-targets-v1/targets/bt-0001-certificate_maker/evidence/compile_commands.json`
- S3 root request id: `e2e-certmaker-rerun-start-20260521-153850`
- S7 async request id: `acr_4ec11c2a720c42c7`
- Log analyzer trace key: `e2e-certmaker-rerun-start-20260521-153850`

## Observed result
- S3 start call returned HTTP 502 after `1060.389556s` (`17m41s` in log-analyzer trace).
- S7 terminal async status:
  - `state`: `failed`
  - `localAckState`: `ack-break`
  - `blockedReason`: `backend_transport_disconnected`
  - `error`: `LLM backend transport disconnected`
  - `errorDetail`: `RemoteProtocolError: Server disconnected without sending a response.; backend disconnected before completing the async stream`
  - `retryable`: `true`
  - `backendActivity`: `null`
  - `endedAt`: `2026-05-21T06:57:03.185000+00:00`
- S7 health after failure was ready/llmReady true and circuit closed, with `consecutiveFailures=1`.
- S3 `state-trace.jsonl` reached `CASE_REGISTERED`, `BUILD_CONTEXT_READY`, `SETUP_RUNNING` done, `S4_STATIC_EVIDENCE_READY`, `S5_CODE_KB_READY`; it did not reach `S5_FINDING_CONTEXT_READY` or `PAPER_EXPORT_READY`.

## S3 interpretation
This is not the old S3 local idle timeout shape. S7 accepted the async request and S3 kept polling until terminal status, but S7 never reported backend stream/chunk activity. The remaining gap appears to be the silent pre-first-byte / prefill window for the large certificate-maker request: S7's stream aggregation protects the post-chunk phase, but this run disconnects before the backendActivity contract can observe stream progress.

## Request to S7
Please analyze the evidence above and implement/propose a contract-safe fix for certificate-maker's pre-first-byte/prefill transport-disconnect window. Desired outcome remains: if services are alive, the long certificate-maker E2E should not die from idle/transport timeout. If the run still cannot complete, S7 should return a more precise classified failure with enough backend-side timing/progress evidence to distinguish DGX generation latency, proxy idle close, vLLM prefill behavior, and network transport disconnect.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
