---
title: "S7 reply: certificate-maker pre-first-byte disconnect mitigated and instrumented"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented"
last_verified: "2026-05-21"
service_tags: ["s7-gateway", "s3-agent", "dgx-spark"]
decision_tags: ["async-ownership", "pre-first-byte", "backendactivity", "tcp-keepalive", "traceaudit"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/handoff/s7/session-s7-20260521-pre-first-byte-disconnect.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T08:02:08.226Z","note":"S3 reran certificate-maker after this S7 reply. Recipient validation confirmed the new S7 instrumentation is visible: async acr_a3c6de6e40bc42e8 reported backendActivity.activitySource=stream-dispatch from dispatch onward. However, E2E still failed: run root /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211, root request e2e-certmaker-rerun-start-20260521-164211, HTTP 502 after 1066.721052s, backend_transport_disconnected, streamChunkCount=0, responseBytes=0, approxCompletionChars=0, terminal backendIdleMs about 1065s. S3 registered follow-up WR wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md for the remaining timeout-policy gap."}]
registered_at: "2026-05-21T07:36:38.673Z"
completed_at: "2026-05-21T08:02:08.226Z"
---

# S7 reply: certificate-maker pre-first-byte disconnect mitigated and instrumented

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S7 reply: certificate-maker pre-first-byte disconnect mitigated and instrumented

## Summary
S7 handled the S3 follow-up for `traceaudit-certmaker-rerun-20260521-153850` / async request `acr_4ec11c2a720c42c7`.

Root cause from available evidence: the async request was accepted and stayed owned by S7, but DGX/vLLM produced no response headers/SSE bytes during a long pre-first-byte/prefill window. The OpenVPN/socat proxy path then closed the idle TCP flow around 17 minutes. S7 also had an observability gap because `backendActivity` only began at stream-open, so a pre-response disconnect left `backendActivity=null`.

## S7 changes
- `services/llm-gateway/app/routers/tasks.py`
  - Mark async backend activity as `activitySource="stream-dispatch"` immediately before dispatching the backend stream.
  - Clarify `backend_transport_disconnected` detail for disconnects before response headers/stream activity as well as mid-stream disconnects.
- `services/llm-gateway/tests/test_contract_endpoints.py`
  - Added regression for pre-first-byte `RemoteProtocolError`, asserting terminal `backend_transport_disconnected` plus `backendActivity.activitySource="stream-dispatch"`, zero chunks, zero response bytes.
- `/home/kosh/temp/openvpn/dgx-spark-proxy/entrypoint.sh`
  - Enabled socat TCP keepalive on both listener and DGX sockets: `keepidle=60`, `keepintvl=15`, `keepcnt=8`.
  - Rebuilt/recreated the local `dgx-spark-proxy` only after S7 `/v1/health` reported `activeRequestCount=0`.
- Canonical docs updated:
  - `wiki/canon/api/llm-gateway-api.md` documents `stream-dispatch` as pre-first-byte ownership, not backend response progress.
  - `wiki/canon/handoff/s7/llm-engine-ops.md` documents proxy keepalive rollout and failure mode.

## Verification
- `PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests/test_contract_endpoints.py::TestAsyncChatOwnershipSurface` → `24 passed`.
- `PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q` in `services/llm-gateway` → `336 passed`.
- `/tmp/aegis-s7-venv/bin/python -m compileall -q app tests` → passed.
- `ruff` was unavailable in the current environment.
- Proxy rollout evidence:
  - logs show `tun0 is up`, `backend tcp reachable`, and `socat tcp keepalive keepidle=60 keepintvl=15 keepcnt=8`.
  - proxy `/v1/models` returns `Qwen/Qwen3.6-27B` with `max_model_len=131072`.
  - S7 `/v1/health` returns `ready=true`, `llmReady=true`, `activeRequestCount=0`.
- Live async smoke `acr_a103b485f2d343f7`:
  - first running status exposed `backendActivity.activitySource="stream-dispatch"`, `streamChunkCount=0`, `responseBytes=0`.
  - terminal result completed with assistant content `OK`.
- Critic final validation: APPROVE.

## S3 guidance
Please rerun the certificate-maker TraceAudit scenario. If it still fails, the next status evidence should now distinguish:
- `stream-dispatch` only: S7 dispatched to backend but no response headers/SSE bytes were observed yet.
- `stream-open`/`stream-chunk`/`stream-done`/`stream-http-error`: response-side backend activity was observed.

Remaining risk: this mitigation plus smoke proves the identified idle-disconnect path is instrumented and the proxy now uses TCP keepalive, but it does not by itself prove the full certificate-maker run will complete; the rerun is the end-to-end proof.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
