---
title: "S3 follow-up: certificate-maker still disconnects after stream-dispatch with zero backend bytes"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero"
last_verified: "2026-05-21"
service_tags: ["analysis-agent", "llm-gateway", "paper-e2e", "certificate-maker", "dgx-spark"]
decision_tags: ["pre-first-byte", "stream-dispatch", "backend-transport-disconnected", "timeout-policy"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented.md", "wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/handoff/s7/llm-engine-ops.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-21T08:45:21.384Z","note":"Handled by S7. RCA revised to DGX OpenVPN proxy MTU/MSS issue; proxy rebuilt with OPENVPN_MSSFIX=1200; API/handoff/ops docs updated; reply WR registered at wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-zero-byte-pre-first-byte-rca-resolved-as-openvpn-mss-.md."}]
registered_at: "2026-05-21T08:01:52.342Z"
completed_at: "2026-05-21T08:45:21.384Z"
---

# S3 follow-up: certificate-maker still disconnects after stream-dispatch with zero backend bytes

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context
S3 reran the certificate-maker TraceAudit scenario after S7's pre-first-byte instrumentation/proxy keepalive reply. The new S7 instrumentation is visible, but the end-to-end run still fails at the same class of pre-response transport disconnect.

## Evidence locations for S7 analyze
- Run root: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211`
- Start response: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/start.response.json`
- Monitor snapshots: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/monitor/`
- Case id: `case-bt-0001-certificate-maker-traceaudit-7ec6989f9b1c`
- S3 root request id: `e2e-certmaker-rerun-start-20260521-164211`
- S7 async request id: `acr_a3c6de6e40bc42e8`
- Log analyzer trace key: `e2e-certmaker-rerun-start-20260521-164211`

## Observed result
- S3 start call returned HTTP 502 after `1066.721052s`; log-analyzer trace duration was `17m47s`.
- S3/S4/S5 setup succeeded before LLM:
  - `BUILD_CONTEXT_READY` done
  - `S4_STATIC_EVIDENCE_READY` done
  - `S5_CODE_KB_READY` done
  - `SETUP_RUNNING` done
- S7 terminal async status:
  - `state`: `failed`
  - `localAckState`: `ack-break`
  - `blockedReason`: `backend_transport_disconnected`
  - `lastAckSource`: `backend-transport-disconnected`
  - `error`: `LLM backend transport disconnected`
  - `errorDetail`: `RemoteProtocolError: Server disconnected without sending a response.; backend disconnected before response headers or stream activity, or before completing the async stream`
  - `retryable`: `true`
- S7 `backendActivity` was present but never progressed beyond dispatch:
  - `activitySource`: `stream-dispatch`
  - `streamChunkCount`: `0`
  - `responseBytes`: `0`
  - `approxCompletionChars`: `0`
  - terminal `backendElapsedMs/backendIdleMs`: about `1065s`
- S7 health after failure was `ready=true`, `llmReady=true`, `activeRequestCount=0`, circuit closed, `consecutiveFailures=1`.
- S7 emitted no level>=40 logs for the S3 root request id or async id in log-analyzer.

## S3 interpretation
S7's instrumentation fix worked: S3 can now distinguish pre-first-byte dispatch ownership from actual response-side backend progress. However, the desired timeout-policy invariant is still not met for certificate-maker: services are alive, but the backend/proxy path disconnects after a long pre-response idle window with zero response bytes.

## Request to S7
Please continue the S7-side analysis/fix for certificate-maker. The next fix should address why a DGX/vLLM request can remain in `stream-dispatch` for ~17m45s with no response headers/SSE bytes and then disconnect despite proxy TCP keepalive. If S7 concludes this cannot be solved only in gateway/proxy, please return a precise contract recommendation for S3 (for example prompt/context partitioning or explicit prefill budget policy) with evidence showing why.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
