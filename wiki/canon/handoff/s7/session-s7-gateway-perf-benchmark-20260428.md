---
title: "Session history — s7 / s7-gateway-perf-benchmark-20260428"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/results/gateway-perf-short-qwen36-27b-20260428T025506Z/summary.md"
  - "services/llm-gateway/bench/results/gateway-perf-short-qwen36-27b-20260428T025506Z/raw.json"
original_path: "mcp://record_session_history/s7/s7-gateway-perf-benchmark-20260428"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-gateway-perf-benchmark-20260428

## Session
- Lane: s7
- Session ID: s7-gateway-perf-benchmark-20260428
- Status: complete
- Started at: 2026-04-28T02:42:00Z
- Updated at: 2026-04-28T02:58:00Z

## Summary
Ran S7 LLM-Gateway performance checks against `POST /v1/chat` on localhost:8000 backed by DGX `Qwen/Qwen3.6-27B`. Health/models verified, then short latency/generation/tool-call benchmarks were executed. Results stored under `services/llm-gateway/bench/results/gateway-perf-short-qwen36-27b-20260428T025506Z/`. Gateway usage after run: 21 chat requests, 0 errors, 1744 prompt tokens, 2220 completion tokens. Log analyzer for last 30m: s7-gateway errors=0, warns=0, avg latency 21.7s, max 3m3s, tool_calls ratio 23.8%.

## Related pages
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/api/llm-gateway-api.md]]

## Test evidence

### 2026-04-28T02:57:08.526Z — pass
- Command: `services/llm-gateway: custom httpx benchmark through `POST http://localhost:8000/v1/chat`; health/models/usage curls; log-analyzer service_stats/search_errors/llm_stats since 30m`
- Log ref: s7-gateway-perf-short-qwen36-27b-20260428T025506Z
- Gateway health before run: `status=ok`, `llmMode=real`, backend endpoint `http://10.126.37.19:8000`, circuit breaker `closed`, `llmConcurrency=4`, active requests 0.
- Gateway models before run: profile `Qwen/Qwen3.6-27B-default`, modelName `Qwen/Qwen3.6-27B`, contextLimit 131072, status available.
- Short benchmark output dir: `services/llm-gateway/bench/results/gateway-perf-short-qwen36-27b-20260428T025506Z/`.
- Pong latency sequential n=3: 3/3 OK, mean 634.6 ms, p95 635.8 ms, mean completion tok/s 3.15.
- Short generation sequential n=2: 2/2 OK, mean latency 13,804.0 ms, p95 13,800.0 ms, mean completion tokens 67, mean completion tok/s 4.86.
- Short generation concurrency=2: 2/2 OK, wall 13,400.0 ms, aggregate completion tok/s 9.4, per-request mean completion tok/s 4.71.
- Tool-call sequential n=3: 3/3 OK, mean latency 5,994.63 ms, p95 5,996.0 ms, all returned `finish_reason=tool_calls` with `classify_risk` arguments `{"severity":"high"}`.
- Tool-call concurrency=2: 2/2 OK, wall 6,264.1 ms, aggregate completion tok/s 8.94, all returned expected tool call.
- Gateway usage after run: 21 chat requests, 0 errors, tokens 1744 prompt / 2220 completion / 3964 total.
- Log analyzer since 30m: s7-gateway entries 70, errors 0, warns 0, avg latency 21.7s, max 3m3s; LLM exchange total 21, tool_calls ratio 23.8%.
