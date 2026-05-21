---
title: "S3 addendum: certificate-maker first LLM payload is only about 2k tokens despite 17m pre-first-byte silence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-"
last_verified: "2026-05-21"
service_tags: ["analysis-agent", "llm-gateway", "paper-e2e", "certificate-maker", "dgx-spark"]
decision_tags: ["token-budget", "pre-first-byte", "stream-dispatch", "tools", "max-tokens", "backend-transport-disconnected"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md", "wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-pre-first-byte-disconnect-mitigated-and-instrumented.md", "wiki/canon/handoff/s3/session-s3-certmaker-rerun-after-s7-stream-dispatch-20260521.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-"
wr_kind: "request"
status: "open"
from_lane: "s3"
to_lanes: ["s7"]
completed_by: []
registered_at: "2026-05-21T08:22:26.318Z"
---

# S3 addendum: certificate-maker first LLM payload is only about 2k tokens despite 17m pre-first-byte silence

## Summary
- Kind: request
- From: s3
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context
S3 measured the actual first certificate-maker LLM payload from the committed rerun artifacts. The result contradicts the simple hypothesis that the first finding payload is so huge that 17 minutes of pre-first-byte silence is expected.

## Evidence locations
- Run root: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211`
- Start response: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/start.response.json`
- Monitor snapshots: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/monitor/`
- S4 normalized evidence used for measurement: `/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/cases/case-bt-0001-certificate-maker-traceaudit-7ec6989f9b1c/s4-static-evidence.normalized.json`
- Case id: `case-bt-0001-certificate-maker-traceaudit-7ec6989f9b1c`
- S3 root request id: `e2e-certmaker-rerun-start-20260521-164211`
- S7 async request id: `acr_a3c6de6e40bc42e8`

## S3 payload measurement
S3 reconstructed the first live acquisition request from the run artifact and current S3 prompt builder:

- S4 findings in this case: `19`
- Failure point: first finding acquisition call for `finding:0000`
- First finding rule: `semgrep:rules.cpp.aegis.cpp.cwe-78-popen-with-variable`
- Evidence rows included for the first finding: `3`
- First acquisition user prompt: `5,694 chars`
- First acquisition request body: `7,740 bytes`
- Messages content total: `5,951 chars`
- Tool schema JSON: `1,108 chars`
- Crude input-token estimate: about `1.9k-2.6k tokens` (`chars/4` to `chars/3`)
- Requested completion budget: `max_tokens=32768`

For the remaining findings, reconstructed acquisition bodies were similarly small, roughly `5.5k-5.8k bytes` each, not huge-context requests.

## Important observation
The terminal S7 state for `acr_a3c6de6e40bc42e8` remained pre-response:

- `backendActivity.activitySource=stream-dispatch`
- `streamChunkCount=0`
- `responseBytes=0`
- `approxCompletionChars=0`
- terminal `backendIdleMs/backendElapsedMs≈1065s`
- `blockedReason=backend_transport_disconnected`

So this does not look like slow token generation after a large prompt. It looks like the backend/proxy/vLLM path accepted dispatch but produced no response headers/SSE bytes for ~17m45s.

## S3 interpretation
The first input is only about 2k tokens. That is too small to explain 17 minutes of pre-first-byte silence on a 131k-context Qwen3.6-27B deployment by prompt length alone.

More plausible S7-side experiments:

1. Replay the exact first finding payload with tools enabled vs tools removed.
2. Replay with `max_tokens=32768` vs a small cap such as `512` while keeping input constant.
3. Compare S7 gateway path vs direct DGX proxy path for the same payload.
4. Check whether vLLM opens streaming response headers before first token for this request shape.
5. Isolate whether OpenAI tool schema, chat template controls, `preserve_thinking=false`, or large completion budget causes scheduler/KV allocation or pre-response stall.

## Request to S7
Please use the evidence above in the current certificate-maker follow-up analysis. If possible, run the small matrix above and report whether the blocker is tied to tools, `max_tokens`, S7 gateway/proxy, or vLLM pre-response behavior. If the failure is caused by `max_tokens=32768` rather than input size, S7 should recommend a contract-safe policy for S3 paper calls instead of treating this as unavoidable DGX slowness.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
