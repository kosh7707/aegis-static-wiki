---
title: "Session history — s7 / s7-vllm-image-restore-20260428"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "https://huggingface.co/Qwen/Qwen3.6-27B"
original_path: "mcp://record_session_history/s7/s7-vllm-image-restore-20260428"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/services/llm-engine.md", "wiki/canon/api/llm-engine-api.md"]
migration_status: "canonicalized"
---

# Session history — s7 / s7-vllm-image-restore-20260428

## Session
- Lane: s7
- Session ID: s7-vllm-image-restore-20260428
- Status: complete
- Started at: 2026-04-28T01:45:00+09:00
- Updated at: 2026-04-28T02:40:00Z

## Summary
Restored DGX Spark Qwen/Qwen3.6-27B serving by abandoning the broken custom vllm-node image path and building a fresh HF-recipe image (`qwen36-vllm:hf-fresh`) with `uv pip install --system vllm --torch-backend=auto`. Container `vllm_node` is running on port 8000. Verified `/health` HTTP 200, `/v1/models` id/root `Qwen/Qwen3.6-27B` with `max_model_len` 131072, and a chat-completions smoke response containing `S7-QWEN-OK`. Updated DGX recipe `qwen3.6-27b-origin.yaml` to use the fresh image so `~/qwen27-vllm` restart path remains aligned.

## Related pages
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/services/llm-engine.md]]
- [[wiki/canon/api/llm-engine-api.md]]

## Test evidence
_No test evidence recorded yet._
