---
title: "Session history — S7 / s7-qwen-benchmark-20260423"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/results/qwen36-35b-standard-20260423T112124Z/summary.json"
  - "services/llm-gateway/bench/results/qwen35-122b-standard-20260423T115409Z/summary.json"
  - "services/llm-gateway/bench/results/qwen36-27b-standard-20260423T120823Z/summary.json"
  - "services/llm-gateway/bench/results/compare-qwen-three-way-20260423T122020Z/comparison.json"
original_path: "mcp://record_session_history/s7/s7-qwen-benchmark-20260423"
last_verified: "2026-04-23"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/session-s7-qwen-benchmark-20260423.md"]
migration_status: "canonicalized"
---

> Supersession note (2026-04-25): early `qwen36-27b` benchmark entries in this session used/mentioned `Qwen/Qwen3.6-27B-FP8` and are historical only. Current live serving and final decision use original `Qwen/Qwen3.6-27B` with no quantization override; see `session-s7-qwen27-cutover-20260424.md` and `session-s7-qwen27-s3-wr-20260424.md`.

# Session history — S7 / s7-qwen-benchmark-20260423

## Session
- Lane: S7
- Session ID: s7-qwen-benchmark-20260423
- Status: verified-three-way-standard
- Started at: 2026-04-23T09:56:06Z
- Updated at: 2026-04-23T12:27:00Z

## Summary
Ran live standard S7 Qwen benchmark for three models on DGX Spark: Qwen/Qwen3.6-35B-A3B, Qwen/Qwen3.5-122B-A10B-GPTQ-Int4, and Qwen/Qwen3.6-27B served from Qwen/Qwen3.6-27B-FP8 checkpoint with served-model-name Qwen/Qwen3.6-27B. All three standard runs completed with qualityScore=1.0, passRate=1.0, errored=0, malformed=0, decisive=7. Three-way compare recommendation is route-by-workload because quality scores tied; operational diagnostics favor Qwen3.6-35B-A3B (p50=4376ms, serving_tps=34.69) over qwen35-122b (p50=18780ms, serving_tps=13.81) and qwen36-27b (p50=17335ms, serving_tps=8.64). Endpoint restored to Qwen/Qwen3.6-35B-A3B; /health OK; vLLM 0.19.1.

## Related pages
- [[wiki/canon/handoff/s7/session-s7-qwen-benchmark-20260423.md]]

## Test evidence

### 2026-04-23T12:27:11.691Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m bench.runner --base-url http://10.126.37.19:8000 --request-path direct --suite standard --mode all --model-label qwen36-35b-a3b --expected-model Qwen/Qwen3.6-35B-A3B --output-dir bench/results/qwen36-35b-standard-20260423T112124Z`
- Log ref: services/llm-gateway/bench/results/qwen36-35b-standard-20260423T112124Z/summary.json
- qualityScore=1.0; allScoredMean=1.0; total=17; errored=0; malformed=0; decisive=7
- p50 latency=4376ms; p95 latency=34761ms; serving mean completion tok/s=34.69
- actualModel=Qwen/Qwen3.6-35B-A3B; maxModelLen=131072; vLLM=0.19.1

### 2026-04-23T12:27:28.148Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m bench.runner --base-url http://10.126.37.19:8000 --request-path direct --suite standard --mode all --model-label qwen35-122b --expected-model Qwen/Qwen3.5-122B-A10B-GPTQ-Int4 --output-dir bench/results/qwen35-122b-standard-20260423T115409Z`
- Log ref: services/llm-gateway/bench/results/qwen35-122b-standard-20260423T115409Z/summary.json
- qualityScore=1.0; allScoredMean=1.0; total=17; errored=0; malformed=0; decisive=7
- p50 latency=18780ms; p95 latency=65521ms; serving mean completion tok/s=13.81
- actualModel=Qwen/Qwen3.5-122B-A10B-GPTQ-Int4; maxModelLen=262144; vLLM=0.19.1

### 2026-04-23T12:27:35.846Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m bench.runner --base-url http://10.126.37.19:8000 --request-path direct --suite standard --mode all --model-label qwen36-27b --expected-model Qwen/Qwen3.6-27B --output-dir bench/results/qwen36-27b-standard-20260423T120823Z`
- Log ref: services/llm-gateway/bench/results/qwen36-27b-standard-20260423T120823Z/summary.json
- qualityScore=1.0; allScoredMean=1.0; total=17; errored=0; malformed=0; decisive=7
- p50 latency=17335ms; p95 latency=127735ms; serving mean completion tok/s=8.64
- actualModel=Qwen/Qwen3.6-27B; root checkpoint=Qwen/Qwen3.6-27B-FP8; maxModelLen=131072; vLLM=0.19.1

### 2026-04-23T12:27:43.751Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m bench.compare --summary qwen35-122b=... --summary qwen36-35b-a3b=... --summary qwen36-27b=... --output-dir bench/results/compare-qwen-three-way-20260423T122020Z`
- Log ref: services/llm-gateway/bench/results/compare-qwen-three-way-20260423T122020Z/comparison.json
- recommendation=route-by-workload; winner=none because all quality scores tied
- operational ordering in comparison.md: qwen36-35b-a3b first, qwen35-122b second, qwen36-27b third
- Post-compare tests: targeted 18 passed; full S7 224 passed.

### 2026-04-23T12:27:48.830Z — passed
- Command: `curl http://10.126.37.19:8000/v1/models && curl http://10.126.37.19:8000/version && curl -i http://10.126.37.19:8000/health`
- Log ref: local terminal
- Endpoint restored to Qwen/Qwen3.6-35B-A3B after benchmark; max_model_len=131072
- vLLM version=0.19.1
- /health returned HTTP 200

### 2026-04-23T21:31:17.117Z — passed
- Command: `cd services/llm-gateway && env -u AEGIS_STITCH_API_KEY -u STITCH_API_KEY .venv/bin/python -m pytest -q tests/test_bench_scoring.py tests/test_bench_client_compare.py && env -u AEGIS_STITCH_API_KEY -u STITCH_API_KEY .venv/bin/python -m pytest -q tests`
- Log ref: local terminal / autopilot resume 2026-04-24T21:38Z
- Targeted bench tests: 29 passed.
- Full S7 test suite: 235 passed.
- Unsafe in-process generated-Python scoring was replaced with python_function_bwrap hidden-test scorer using bubblewrap isolation and timeout.
- Current endpoint sanity: /v1/models actual Qwen/Qwen3.6-35B-A3B, /version 0.19.1, /health HTTP 200.

### 2026-04-23T21:31:25.272Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m bench.rescore --suite hard ... && .venv/bin/python -m bench.compare --summary ...`
- Log ref: services/llm-gateway/bench/results/compare-qwen-hard-notthinking-bwrap-rescored-20260424T2138BWRAP/comparison.json
- Re-scored existing hard no-thinking raw outputs with current bubblewrap hidden-test scorer.
- qwen36-35b-a3b: qualityScore=0.68, errored=0, malformed=0.
- qwen36-27b-origin: qualityScore=0.68, errored=0, malformed=0, actual/root Qwen/Qwen3.6-27B.
- qwen35-122b: qualityScore=0.5467, errored=0, malformed=0.
- Recommendation=route-by-workload because 35B-A3B and 27B tied within minDelta=0.03; the previous standard suite was confirmed saturated and non-decisive.
