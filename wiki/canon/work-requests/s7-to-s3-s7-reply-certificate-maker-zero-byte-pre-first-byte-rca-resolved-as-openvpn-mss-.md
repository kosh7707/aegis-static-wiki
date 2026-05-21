---
title: "S7 reply: certificate-maker zero-byte pre-first-byte RCA resolved as OpenVPN MSS issue"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-reply-certificate-maker-zero-byte-pre-first-byte-rca-resolved-as-openvpn-mss-"
last_verified: "2026-05-21"
service_tags: ["llm-gateway", "analysis-agent", "paper-e2e", "certificate-maker", "dgx-spark"]
decision_tags: ["pre-first-byte", "openvpn", "mssfix", "mtu", "backend-transport-disconnected", "stream-dispatch"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md", "wiki/canon/work-requests/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/handoff/s7/session-s7-20260521-certmaker-openvpn-mss-rca.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-reply-certificate-maker-zero-byte-pre-first-byte-rca-resolved-as-openvpn-mss-"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-21T09:49:37.713Z","note":"S3 reran the full certificate-maker paper E2E using existing services only. Run /home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-174803 completed with HTTP 200 in 3561.608181s and PAPER_EXPORT_READY. All stages done, artifacts produced: findings.jsonl=19, triage-envelope.jsonl=19, llm-transcript.raw.jsonl=19, evidence-ledger.jsonl=347, audit-packets=100. S7 async metadata is preserved in all finalizer transcripts; last finalizer acr_9ad2ba2a153746b8 ended stream-done with streamChunkCount=248 and responseBytes=63026. The prior zero-byte pre-first-byte backend_transport_disconnected pattern did not recur."}]
registered_at: "2026-05-21T08:45:09.612Z"
completed_at: "2026-05-21T09:49:37.713Z"
---

# S7 reply: certificate-maker zero-byte pre-first-byte RCA resolved as OpenVPN MSS issue

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S7 handled both open S3 WRs for certificate-maker:

- `s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero`
- `s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-`

The addendum was correct and changed the RCA. The first request was not huge: S3 measured about `7.7KB` / `~2k` input tokens with `max_tokens=32768`. S7 no longer treats prompt size/partitioning as the primary explanation for the 17m pre-first-byte silence.

## RCA
Most-supported cause: S7-owned DGX OpenVPN proxy MTU/MSS configuration.

Evidence:
- Failing async request `acr_a3c6de6e40bc42e8` remained at `backendActivity.activitySource=stream-dispatch`, `streamChunkCount=0`, `responseBytes=0`, then failed with `blockedReason=backend_transport_disconnected` after about 17m45s.
- `/v1/health` remained `ready=true`/`llmReady=true`, so coarse health was insufficient.
- Original proxy used OpenVPN `mssfix 1360`.
- During the failing request OpenVPN logged `EMSGSIZE Path-MTU=1380`.
- A controlled hanging probe showed request bytes stuck in the DGX-facing TCP `Send-Q` with a retransmission timer; this indicates the request body was not fully ACKed through the VPN path, not that vLLM was merely slowly thinking.
- Rebuilding/restarting the proxy with `OPENVPN_MSSFIX=1200` made the same request family produce response-side stream chunks immediately.
- Validated probes with `mssfix=1200` showed `max_tokens=32768` with tools enabled can receive first bytes immediately, so `max_tokens=32768` was not the direct zero-byte pre-first-byte cause.

## S7 changes made
- Operational proxy was rebuilt/restarted with `OPENVPN_MSSFIX=1200` on the production `dgx-spark-proxy` port.
- S7 API contract updated: `wiki/canon/api/llm-gateway-api.md` now states that the 2026-05-21 certificate-maker case is an OpenVPN proxy MTU/MSS incident, not a prompt-size incident.
- S7 handoff updated: `wiki/canon/handoff/s7/readme.md` records the revised RCA and evidence.
- S7 engine ops runbook updated: `wiki/canon/handoff/s7/llm-engine-ops.md` now requires `OPENVPN_MSSFIX=1200` and a large POST first-byte smoke; `/health` and `/v1/models` alone are not enough.
- S7 code updated to emit redacted level-40 `llm_exchange` records for async backend timeout/transport-disconnect/stream-parse failures, so future RCA has failure logs without raw paper prompts/schema/seed/response.

## Verification
- Focused async failure logging tests: `2 passed in 0.07s`.
- Async ownership suite: `25 passed in 0.45s`.
- Full S7 suite: `337 passed in 6.88s`.
- `compileall app tests` passed.
- Live S7 health after proxy update: HTTP 200, `ready=true`, `llmReady=true`, `activeRequestCount=0`.
- Large POST first-byte smoke through proxy `127.0.0.1:18000`: payload `6358` bytes, HTTP 200, `TTFB=0.171297s`, total `1.077544s`, SSE first bytes returned.
- Recent OpenVPN log after the `mssfix=1200` smoke showed `EMSGSIZE` count `0`.
- Async paper-mode smoke `acr_b0fdbd8e95754ac9` progressed to `stream-chunk` and terminal `stream-done` with `streamChunkCount=267`, `responseBytes=184697`, `blockedReason=null`.

## Contract guidance for S3
- Continue to treat `stream-dispatch + streamChunkCount=0 + responseBytes=0` as dispatch-only ownership, not model response progress.
- If terminal `backend_transport_disconnected` occurs while last activity remains `stream-dispatch`, classify it as dependency/transport failure, not output deficiency.
- For this certificate-maker incident, do **not** apply prompt splitting as the primary fix. First verify the S7 proxy is running with `OPENVPN_MSSFIX=1200` and that a large POST first-byte smoke passes.
- If the same failure recurs with `mssfix=1200`, no OpenVPN `EMSGSIZE`, and a passing large POST smoke, then reopen S3 request-shaping hypotheses such as tool schema, completion budget, or phase split.

## Remaining risk
This confirms the proxy-path fix and representative large POST/async smokes, but S3 should still rerun the full certificate-maker case end-to-end to prove the entire paper pipeline completes under its live orchestration.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
