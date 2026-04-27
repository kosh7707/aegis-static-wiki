---
title: "Session history — s7 / s7-qwen27-control-script-20260425"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "ssh://accslab@10.126.37.19/home/accslab/aegis-llm-engine/bin/qwen27-vllm"
  - "/home/kosh/AEGIS/tmp/dgx-spark-connection-guide.md"
original_path: "mcp://record_session_history/s7/s7-qwen27-control-script-20260425"
last_verified: "2026-04-25"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/specs/llm-engine.md", "wiki/canon/handoff/s7/readme.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-qwen27-control-script-20260425

## Session
- Lane: s7
- Session ID: s7-qwen27-control-script-20260425
- Status: completed
- Started at: 2026-04-25T23:45:00+09:00
- Updated at: 2026-04-25T23:56:00+09:00

## Summary
Installed DGX Spark Qwen27 vLLM lifecycle control script at /home/accslab/aegis-llm-engine/bin/qwen27-vllm with symlink ~/qwen27-vllm. Supports start/stop/restart/status/health/models/logs/ps, fixed to Qwen/Qwen3.6-27B original dense/no-quantization identity and validates /v1/models id/root/max_model_len. Performed real restart test: stopped and removed vllm_node, relaunched qwen3.6-27b-origin recipe, waited for /health and /v1/models, confirmed ready. Updated S7 LLM Engine ops/spec/handoff and temporary DGX guide.

## Related pages
- [[wiki/canon/handoff/s7/llm-engine-ops.md]]
- [[wiki/canon/specs/llm-engine.md]]
- [[wiki/canon/handoff/s7/readme.md]]

## Test evidence

### 2026-04-25T08:54:01.102Z — passed
- Command: `bash -n ~/aegis-llm-engine/bin/qwen27-vllm`
- Log ref: dgx-qwen27-control-syntax-2026-04-25
- Shell syntax check passed for /home/accslab/aegis-llm-engine/bin/qwen27-vllm.

### 2026-04-25T08:54:01.167Z — passed
- Command: `~/qwen27-vllm restart`
- Log ref: dgx-qwen27-control-restart-2026-04-25
- Script stopped vllm_node, removed stale container, started qwen3.6-27b-origin recipe with --max-model-len 131072 and --gpu-memory-utilization 0.90.
- Wait loop completed when /health returned 200 and /v1/models returned model/root Qwen/Qwen3.6-27B with max_model_len 131072.

### 2026-04-25T08:54:01.213Z — passed
- Command: `~/qwen27-vllm status`
- Log ref: dgx-qwen27-control-status-2026-04-25
- Status showed vllm_node running on image vllm-node:official-0.19.1-cu130.
- Container process: vllm serve Qwen/Qwen3.6-27B --max-model-len 131072 --max-num-batched-tokens 8192 --gpu-memory-utilization 0.9 --enable-auto-tool-choice --tool-call-parser qwen3_coder --reasoning-parser qwen3 --language-model-only -tp 1.
- /health returned 200 and /v1/models reported Qwen/Qwen3.6-27B max_model_len 131072.

### 2026-04-25T08:54:54.137Z — passed
- Command: `fresh Ralph verification: ~/qwen27-vllm status; bash -n ~/qwen27-vllm; grep wiki control-script refs`
- Log ref: ralph-fresh-verification-2026-04-25-qwen27-control-script
- Fresh status after restart: vllm_node running on vllm-node:official-0.19.1-cu130, /health HTTP 200, /v1/models id/root Qwen/Qwen3.6-27B max_model_len 131072.
- Live vLLM command still has no FP8/quantization flags and uses qwen3.6-27B original dense path.
- Script syntax check passed; sha256sum /home/accslab/qwen27-vllm = 9b6a69db79c2997e11c0ed6697fa0886907b680eb324403519e798ec516bec9d.
- Wiki references verified in llm-engine-ops.md, llm-engine.md, and handoff/s7/readme.md.

### 2026-04-25T08:55:29.670Z — passed
- Command: `second fresh Ralph verification: DGX ~/qwen27-vllm health/models/ps + Gateway /v1/models`
- Log ref: ralph-second-fresh-verification-2026-04-25T17:55:18+09:00
- DGX script health returned HTTP 200.
- DGX script models returned id/root Qwen/Qwen3.6-27B and max_model_len 131072.
- DGX script ps showed vllm_node using vllm-node:official-0.19.1-cu130 and vllm serve Qwen/Qwen3.6-27B with --max-model-len 131072, qwen3_coder, qwen3 reasoning parser, --language-model-only, and no quantization/FP8 flags.
- bash -n ~/qwen27-vllm passed.
- Gateway /v1/models returned Qwen/Qwen3.6-27B-default, modelName Qwen/Qwen3.6-27B, contextLimit 131072.

### 2026-04-25T08:56:18.085Z — passed
- Command: `third fresh Ralph verification: DGX ~/qwen27-vllm health/models + docker ps + bash -n, Gateway /v1/models`
- Log ref: ralph-third-fresh-verification-2026-04-25T17:55:56+09:00
- DGX ~/qwen27-vllm health returned HTTP 200.
- DGX ~/qwen27-vllm models returned id/root Qwen/Qwen3.6-27B and max_model_len 131072.
- docker ps showed vllm_node running on vllm-node:official-0.19.1-cu130.
- bash -n ~/qwen27-vllm passed.
- Gateway /v1/models returned Qwen/Qwen3.6-27B-default, modelName Qwen/Qwen3.6-27B, contextLimit 131072.
