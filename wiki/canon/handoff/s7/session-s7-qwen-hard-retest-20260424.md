---
title: "Session history — s7 / s7-qwen-hard-retest-20260424"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/results/compare-qwen-hard-notthinking-bwrap-rescored-20260424T2138BWRAP/comparison.json"
  - "services/llm-gateway/bench/results/qwen36-27b-origin-hard-notthinking-bwrap-rescored-20260424T2138BWRAP/summary.json"
  - "services/llm-gateway/bench/results/qwen36-35b-a3b-hard-notthinking-bwrap-rescored-20260424T2138BWRAP/summary.json"
  - "services/llm-gateway/bench/results/qwen35-122b-hard-notthinking-bwrap-rescored-20260424T2138BWRAP/summary.json"
original_path: "mcp://record_session_history/s7/s7-qwen-hard-retest-20260424"
last_verified: "2026-04-23"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/session-s7-qwen-benchmark-20260423.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-qwen-hard-retest-20260424

## Session
- Lane: s7
- Session ID: s7-qwen-hard-retest-20260424
- Status: verified-partial-live-switch-blocked
- Started at: 2026-04-23T12:31:25Z
- Updated at: 2026-04-24T21:39:00Z

## Summary
Resumed interrupted autopilot for S7 Qwen hard retest. Completed hard-suite harness hardening, replaced unsafe generated-code execution with bubblewrap-isolated hidden tests, added rescore utility, verified 235 S7 tests passing, re-scored existing hard no-thinking raw outputs, and confirmed endpoint healthy on Qwen/Qwen3.6-35B-A3B vLLM 0.19.1. Final rescored diagnostic comparison ties Qwen3.6-35B-A3B and Qwen3.6-27B at qualityScore=0.68; Qwen3.5-122B trails at 0.5467. SSH model switching is currently blocked by auth, so no new live three-model thinking-on rerun was performed in this resume.

## Related pages
- [[wiki/canon/handoff/s7/session-s7-qwen-benchmark-20260423.md]]

## Test evidence

### 2026-04-23T21:34:59.421Z — passed
- Command: `cd services/llm-gateway && env -u AEGIS_STITCH_API_KEY -u STITCH_API_KEY .venv/bin/python -m pytest -q tests/test_bench_scoring.py tests/test_bench_client_compare.py && curl http://10.126.37.19:8000/v1/models && curl http://10.126.37.19:8000/version && curl -i http://10.126.37.19:8000/health`
- Log ref: local terminal / stop-hook fresh verification 2026-04-24T21:45Z
- Fresh hook verification: targeted bench tests 29 passed.
- Endpoint /v1/models actual/root Qwen/Qwen3.6-35B-A3B, max_model_len=131072.
- Endpoint /version vLLM 0.19.1.
- Endpoint /health HTTP 200 OK.

### 2026-04-23T21:49:47.421Z — passed
- Command: `ssh -i ~/.ssh/dgx_spark accslab@10.126.37.19 'cd ~/spark-vllm-docker && docker stop/rm vllm_node && ./run-recipe.sh qwen3.6-27b-origin --solo -d --gpu-memory-utilization 0.90 --max-model-len 131072' && cd services/llm-gateway && .venv/bin/python -m bench.runner --suite hard --mode quality --thinking-mode off --model-label qwen36-27b-origin-fresh --expected-model Qwen/Qwen3.6-27B --output-dir bench/results/qwen36-27b-origin-fresh-hard-notthinking-20260423T214437Z`
- Log ref: services/llm-gateway/bench/results/qwen36-27b-origin-fresh-hard-notthinking-20260423T214437Z/summary.json
- Freshly loaded original Qwen/Qwen3.6-27B on DGX Spark via qwen3.6-27b-origin recipe; not FP8.
- /v1/models actual=root=Qwen/Qwen3.6-27B, max_model_len=131072; /version vLLM 0.19.1; /health HTTP 200.
- vLLM log: Model loading took 50.22 GiB and 65.62s; available KV cache 55.08 GiB; GPU KV cache 225,008 tokens; maximum concurrency for 131,072-token requests 6.73x.
- No-thinking smoke returned QWEN27_ORIGINAL_OK with HTTP 200; thinking smoke returned QWEN27_THINK_OK with HTTP 200.
- Fresh hard no-thinking benchmark: qualityScore=0.68, errored=0, malformed=0, passRate=0.6, p50 latency=1320ms, p95 latency=126297ms, elapsed=218.6s.
