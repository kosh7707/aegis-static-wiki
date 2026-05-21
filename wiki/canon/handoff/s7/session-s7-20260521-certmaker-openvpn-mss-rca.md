---
title: "Session history — s7 / s7-20260521-certmaker-openvpn-mss-rca"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-164211/start.response.json"
  - "docker logs dgx-spark-proxy"
  - "/tmp/s7-large-post-smoke.out"
original_path: "mcp://record_session_history/s7/s7-20260521-certmaker-openvpn-mss-rca"
last_verified: "2026-05-21"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md", "wiki/canon/work-requests/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-20260521-certmaker-openvpn-mss-rca

## Session
- Lane: s7
- Session ID: s7-20260521-certmaker-openvpn-mss-rca
- Status: completed
- Started at: 2026-05-21T08:20:00Z
- Updated at: 2026-05-21T08:45:00Z

## Summary
S7 handled S3 certificate-maker zero-byte pre-first-byte WRs. RCA changed from prompt-size/shape to DGX OpenVPN proxy MTU/MSS: mssfix 1360 produced EMSGSIZE Path-MTU=1380 and DGX-facing TCP Send-Q/retransmission; mssfix 1200 restored immediate stream chunks. S7 updated llm-gateway API contract, S7 handoff, and llm-engine ops runbook; added redacted async backend failure llm_exchange logging and tests.

## Related pages
- [[wiki/canon/api/llm-gateway-api.md]]
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/handoff/s7/llm-engine-ops.md]]
- [[wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-still-disconnects-after-stream-dispatch-with-zero.md]]
- [[wiki/canon/work-requests/s3-to-s7-s3-addendum-certificate-maker-first-llm-payload-is-only-about-2k-tokens-despite-.md]]

## Test evidence

### 2026-05-21T08:44:43.958Z — passed
- Command: `cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests/test_contract_endpoints.py::TestAsyncChatOwnershipSurface::test_async_paper_pre_first_byte_failure_exchange_log_is_redacted tests/test_contract_endpoints.py::TestAsyncChatOwnershipSurface::test_async_remote_protocol_error_before_first_byte_reports_dispatch_activity && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests/test_contract_endpoints.py::TestAsyncChatOwnershipSurface && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q && /tmp/aegis-s7-venv/bin/python -m compileall -q app tests`
- Log ref: local shell output 2026-05-21T08:44Z
- Focused async failure logging tests: 2 passed in 0.07s.
- Async ownership surface suite: 25 passed in 0.45s.
- Full S7 pytest suite: 337 passed in 6.88s.
- compileall app/tests passed with no output.
- ruff check skipped because ruff is not installed in this environment.

### 2026-05-21T08:44:44.059Z — passed
- Command: `DGX proxy mssfix=1200 large POST first-byte smoke through http://127.0.0.1:18000/v1/chat/completions`
- Log ref: local shell output 2026-05-21T08:44Z
- Payload size 6358 bytes.
- S7 health before smoke: HTTP 200, ready=true, llmReady=true, activeRequestCount=0.
- Large POST streaming smoke: HTTP 200, TTFB 0.171297s, total 1.077544s, bytes 978.
- First bytes were OpenAI-compatible SSE data for chat completion chunk.
- Recent OpenVPN log EMSGSIZE count after mssfix=1200 smoke: 0.
