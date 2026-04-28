---
title: "Session history — s7 / session-s7-bfcl-tool-benchmark-20260428"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/results/bfcl-v4-gateway-smoke-qwen36-27b-20260428T030647Z/summary.md"
  - "services/llm-gateway/bench/results/bfcl-v4-gateway-smoke-qwen36-27b-20260428T030647Z/raw.json"
original_path: "mcp://record_session_history/s7/session-s7-bfcl-tool-benchmark-20260428"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
---

# Session history — s7 / session-s7-bfcl-tool-benchmark-20260428

## Session
- Lane: s7
- Session ID: session-s7-bfcl-tool-benchmark-20260428
- Status: completed
- Started at: 2026-04-28T03:06:47Z
- Updated at: 2026-04-28T03:12:00Z

## Summary
Ran BFCL v4 official-data Gateway-native tool-calling smoke benchmark against local LLM-Gateway -> DGX vLLM Qwen/Qwen3.6-27B. 25 cases across simple_python, multiple, parallel, parallel_multiple, irrelevance; 24/25 pass (0.96 accuracy), zero s7-gateway errors/warnings in recent logs. One failure used x^2 instead of BFCL expected x**2/lambda expression while selecting correct tools.

## Related pages
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/api/llm-gateway-api.md]]

## Test evidence

### 2026-04-28T03:12:46.777Z — passed-with-one-benchmark-miss
- Command: `services/llm-gateway/.venv/bin/python /tmp/run_bfcl_gateway_smoke.py`
- Log ref: services/llm-gateway/bench/results/bfcl-v4-gateway-smoke-qwen36-27b-20260428T030647Z/summary.md
- Gateway path: POST http://localhost:8000/v1/chat (not direct vLLM), native OpenAI tool_calls, no X-AEGIS-Strict-JSON header.
- Official BFCL v4 data subset from ShishirPatil/gorilla berkeley-function-call-leaderboard bfcl_eval/data.
- 25 cases: 24 passed, accuracy 0.96, meanScore 0.96; by category simple_python 5/5, multiple 5/5, parallel 5/5, parallel_multiple 4/5, irrelevance 5/5.
- Latency mean 22810.08 ms, p50 18135 ms, p95 67783 ms; concurrency 2; aggregate completion tok/s 8.95.
- Log analyzer after run: s7-gateway recent 30m entries=157, errors=0, warns=0, err_rate=0.0%, LLM calls=49, tool_calls ratio=57.1%.
