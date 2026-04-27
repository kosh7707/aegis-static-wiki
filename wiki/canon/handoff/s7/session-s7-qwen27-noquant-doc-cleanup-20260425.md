---
title: "Session history — s7 / s7-qwen27-noquant-doc-cleanup-20260425"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "ssh://accslab@10.126.37.19/docker-exec-vllm-ps"
  - "http://10.126.37.19:8000/v1/models"
  - "services/llm-gateway/bench/targets.py"
  - "services/llm-gateway/bench/README.md"
original_path: "mcp://record_session_history/s7/s7-qwen27-noquant-doc-cleanup-20260425"
last_verified: "2026-04-25"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/llm-engine.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/handoff/s7/architecture.md", "wiki/canon/handoff/s7/readme.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md", "wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-qwen27-noquant-doc-cleanup-20260425

## Session
- Lane: s7
- Session ID: s7-qwen27-noquant-doc-cleanup-20260425
- Status: completed
- Started at: 2026-04-25T20:30:00+09:00
- Updated at: 2026-04-25T20:45:00+09:00

## Summary
Clarified S7 current DGX serving identity as original dense Qwen/Qwen3.6-27B, not Qwen/Qwen3.6-27B-FP8, with no vLLM model quantization override. Updated canonical LLM Engine spec, LLM Engine ops, S7 architecture, S7 handoff, Gateway spec/API notes, and benchmark harness docs. Cleaned small DGX temp files and verified only Qwen3.6-27B HF cache remains; vLLM process command has no FP8/quantization flags; /v1/models reports id/root Qwen/Qwen3.6-27B max_model_len 131072.

## Related pages
- [[wiki/canon/specs/llm-engine.md]]
- [[wiki/canon/handoff/s7/llm-engine-ops.md]]
- [[wiki/canon/handoff/s7/architecture.md]]
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/specs/llm-gateway.md]]
- [[wiki/canon/api/llm-gateway-api.md]]
- [[wiki/canon/handoff/s7/session-s7-qwen27-cutover-20260424.md]]
- [[wiki/canon/handoff/s7/session-s7-qwen27-s3-wr-20260424.md]]

## Test evidence

### 2026-04-25T06:57:16.687Z — passed
- Command: `curl http://127.0.0.1:8000/v1/models on DGX`
- Log ref: dgx-v1-models-2026-04-25-noquant-proof
- Returned id Qwen/Qwen3.6-27B, root Qwen/Qwen3.6-27B, max_model_len 131072.
- This proves the served model name/root is not Qwen/Qwen3.6-27B-FP8.

### 2026-04-25T06:57:16.728Z — passed
- Command: `docker exec vllm_node ps -eo pid,cmd | grep vllm serve`
- Log ref: dgx-vllm-process-command-2026-04-25
- Live command: vllm serve Qwen/Qwen3.6-27B --max-model-len 131072 --max-num-batched-tokens 8192 --gpu-memory-utilization 0.9 --enable-auto-tool-choice --tool-call-parser qwen3_coder --reasoning-parser qwen3 --language-model-only -tp 1.
- No --quantization flag, no FP8 checkpoint path, no FP8 served model name.

### 2026-04-25T06:57:16.802Z — passed
- Command: `find ~/.cache/huggingface/hub -maxdepth 1 -type d -name 'models--Qwen--*'`
- Log ref: dgx-hf-cache-2026-04-25-after-cleanup
- Only models--Qwen--Qwen3.6-27B remains under HuggingFace hub cache.
- Old Qwen3.6-27B-FP8, Qwen3.6-35B-A3B, and Qwen3.5-122B caches were removed. Disk remains about 118GB used / 3.4TB available.

### 2026-04-25T06:57:16.830Z — passed
- Command: `cd services/llm-gateway && .venv/bin/python -m py_compile bench/targets.py && .venv/bin/python -m bench.targets`
- Log ref: bench-targets-2026-04-25-noquant-doc-update
- bench.targets prints qwen36-27b as current S7 quality-first default with original dense checkpoint, not Qwen3.6-27B-FP8, no quantization override.
- Former 35B-A3B and Qwen3.5-122B entries are now marked non-live/removed-cache comparison targets.
