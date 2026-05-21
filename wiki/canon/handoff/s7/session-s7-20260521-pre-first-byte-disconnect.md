---
title: "Session history — s7 / s7-20260521-pre-first-byte-disconnect"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-153850/start.response.json"
  - "services/llm-gateway/app/routers/tasks.py"
  - "services/llm-gateway/tests/test_contract_endpoints.py"
original_path: "mcp://record_session_history/s7/s7-20260521-pre-first-byte-disconnect"
last_verified: "2026-05-21"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/llm-engine-ops.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-20260521-pre-first-byte-disconnect

## Session
- Lane: s7
- Session ID: s7-20260521-pre-first-byte-disconnect
- Status: verified
- Started at: 2026-05-21T06:57:03Z
- Updated at: 2026-05-21T07:35:00Z

## Summary
Resolved S3 follow-up WR by adding pre-first-byte stream-dispatch telemetry, enabling DGX proxy TCP keepalive, updating API/runbook docs, and verifying with tests plus live async smoke.

## Related pages
- [[wiki/canon/work-requests/s3-to-s7-s3-follow-up-certificate-maker-disconnects-before-s7-backendactivity-despite-asy.md]]
- [[wiki/canon/api/llm-gateway-api.md]]
- [[wiki/canon/handoff/s7/llm-engine-ops.md]]

## Test evidence

### 2026-05-21T07:36:04.643Z — passed
- Command: `cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q tests/test_contract_endpoints.py::TestAsyncChatOwnershipSurface`
- Log ref: local shell output
- 24 passed in 0.43s

### 2026-05-21T07:36:04.755Z — passed
- Command: `cd services/llm-gateway && PYTHONPATH=. /tmp/aegis-s7-venv/bin/pytest -q`
- Log ref: local shell output
- 336 passed in 6.83s

### 2026-05-21T07:36:04.852Z — passed
- Command: `/tmp/aegis-s7-venv/bin/python -m compileall -q app tests`
- Log ref: local shell output
- No compile errors emitted

### 2026-05-21T07:36:04.952Z — passed
- Command: `live async smoke via POST /v1/async-chat-requests and status/result polling`
- Log ref: acr_a103b485f2d343f7
- Initial running status exposed backendActivity.activitySource=stream-dispatch with streamChunkCount=0 and responseBytes=0.
- Terminal result completed with assistant content OK.
- Proxy logs showed socat tcp keepalive keepidle=60 keepintvl=15 keepcnt=8; /v1/models returned Qwen/Qwen3.6-27B; S7 /v1/health ready=true llmReady=true activeRequestCount=0.
