---
title: "Session history — s7 / session-s7-qwen36-mtp-benchmark-20260428"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/llm-gateway/bench/mtp_gateway_ab.py"
  - "services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/s7-qwen36-mtp-benchmark-report.md"
  - "services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/final-gateway-health.json"
original_path: "mcp://record_session_history/s7/session-s7-qwen36-mtp-benchmark-20260428"
last_verified: "2026-04-28"
service_tags: ["s7"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/handoff/s7/readme.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
---

# Session history — s7 / session-s7-qwen36-mtp-benchmark-20260428

## Session
- Lane: s7
- Session ID: session-s7-qwen36-mtp-benchmark-20260428
- Status: completed
- Started at: 2026-04-28T03:17:59Z
- Updated at: 2026-04-28T04:20:00Z

## Summary
Autopilot ran S7 LLM-Gateway Qwen3.6-27B MTP A/B benchmarks, enabled vLLM MTP num_speculative_tokens=1 on DGX, strengthened benchmark validators after review, bundled BFCL evidence, and produced an approved Markdown report. Final strict bwrap-backed A/B: no-MTP 8/8 aggregate 7.638 completion tok/s, MTP=1 8/8 aggregate 15.132 completion tok/s. BFCL smoke remained 24/25 accuracy 0.96. Final Gateway health OK.

## Related pages
- [[wiki/canon/handoff/s7/readme.md]]
- [[wiki/canon/api/llm-gateway-api.md]]

## Test evidence

### 2026-04-28T04:20:22.608Z — passed
- Command: `services/llm-gateway/.venv/bin/python -m bench.mtp_gateway_ab --label baseline-no-mtp-bwrap-run / --label mtp-1-bwrap-run; plus BFCL smoke artifacts bundled`
- Log ref: services/llm-gateway/bench/results/mtp-ab-qwen36-27b-strict-20260428T034632Z/s7-qwen36-mtp-benchmark-report.md
- Final report approved by verifier and code-reviewer subagents.
- Strict bwrap-backed micro-benchmark: no-MTP 8/8, aggregate completion tok/s 7.638, latency mean 21004.5 ms; MTP=1 8/8, aggregate completion tok/s 15.132, latency mean 10243 ms.
- BFCL Gateway smoke evidence bundled: baseline 25 cases 24 passed accuracy 0.96; MTP 25 cases 24 passed accuracy 0.96.
- Final Gateway health artifact shows status ok, backend ok, circuit breaker closed, activeRequestCount 0.
- Generated-code validator executes only inside bubblewrap subprocess and fails closed if bwrap unavailable.
