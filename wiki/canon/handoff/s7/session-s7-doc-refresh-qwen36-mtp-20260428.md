---
title: "Session history — s7 / session-s7-doc-refresh-qwen36-mtp-20260428"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/s7-qwen36-mtp-benchmark-report.md"
  - "wiki/canon/handoff/s7/session-s7-qwen36-mtp-benchmark-20260428.md"
  - "wiki/canon/handoff/s7/session-s7-bfcl-tool-benchmark-20260428.md"
  - "wiki/canon/handoff/s7/session-s7-vllm-image-restore-20260428.md"
original_path: "mcp://record_session_history/s7/session-s7-doc-refresh-qwen36-mtp-20260428"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/specs/llm-engine.md", "wiki/canon/api/llm-engine-api.md", "wiki/canon/handoff/s7/llm-engine-ops.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/architecture.md"]
migration_status: "canonicalized"
---

# Session history — s7 / session-s7-doc-refresh-qwen36-mtp-20260428

## Session
- Lane: s7
- Session ID: session-s7-doc-refresh-qwen36-mtp-20260428
- Status: completed
- Started at: 2026-04-28
- Updated at: 2026-04-28

## Summary
Updated S7 canonical documentation after Qwen3.6-27B vLLM restore/MTP rollout: handoff, LLM Engine spec/API, LLM Engine ops, LLM Gateway spec, and architecture now describe vLLM 0.20.0 HF-fresh image qwen36-vllm:hf-fresh, MTP=1 serving recipe, max_model_len=131072, BFCL/tool-call evidence, strict bwrap A/B benchmark, DGX cleanup, and DGX Korean runbook. Verified docs with grep/content checks and git diff --check.

## Related pages
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/specs/llm-engine.md]]
- [[wiki/canon/api/llm-engine-api.md]]
- [[wiki/canon/handoff/s7/llm-engine-ops.md]]
- [[wiki/canon/specs/llm-gateway.md]]
- [[wiki/canon/handoff/s7/architecture.md]]

## Test evidence

### 2026-04-28T05:20:12.076Z — passed
- Command: `cd /home/kosh/aegis-static-wiki && git diff --check -- wiki/canon/handoff/s7/readme.md wiki/canon/specs/llm-engine.md wiki/canon/api/llm-engine-api.md wiki/canon/handoff/s7/llm-engine-ops.md wiki/canon/specs/llm-gateway.md wiki/canon/handoff/s7/architecture.md wiki/system/index.md wiki/system/log.md`
- Log ref: local shell output: no whitespace errors
- Validated markdown diff for touched S7 docs and wiki system pages.

### 2026-04-28T05:20:16.801Z — passed
- Command: `python3 content check for last_verified=2026-04-28, MTP/Qwen3.6 sections, and stale API model/context examples`
- Log ref: local shell output: S7 doc verification passed after final spec sync.
- Confirmed all six primary S7 docs have last_verified=2026-04-28.
- Confirmed Qwen3.6 vLLM 0.20.0/MTP=1/runbook/BFCL/benchmark markers are present.
- Confirmed llm-engine-api.md no longer contains stale Qwen3.5-122B, 262,144, or 258,048 examples.
