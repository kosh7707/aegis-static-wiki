---
title: "S5/S7 RAG policy alignment for LLM Gateway task-pipeline enrichment"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment"
last_verified: "2026-04-29"
service_tags: ["s7", "s5", "rag", "knowledge-base"]
decision_tags: ["rag-policy", "evidence-grounding", "llm-readiness"]
related_pages: ["wiki/context/decisions/temperature-policy-analysis-20260428.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/handoff/s7/architecture.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment"
wr_kind: "request"
status: "open"
from_lane: "s7"
to_lanes: ["s5"]
completed_by: []
registered_at: "2026-04-29T04:03:53.267Z"
---

# S5/S7 RAG policy alignment for LLM Gateway task-pipeline enrichment

## Summary
- Kind: request
- From: s7
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context
The temperature-policy analysis flagged P14: S7 RAG integration existed, but activation/min-score/evidence authority boundaries were underdocumented. S7 has now documented the current behavior: `/v1/health.rag` exposes `topK`, `minScore`, and `policy=task-pipeline-context-enrichment`; RAG hits affect prompt context/audit/confidence but are not automatically caller EvidenceRefs.

## Request to S5
Please review whether S7's current RAG contract matches S5 KB expectations:

- `AEGIS_RAG_TOP_K=5`
- `AEGIS_RAG_MIN_SCORE=0.35`
- `POST /v1/search` with `query`, `top_k`, `min_score`, `graph_depth`
- RAG hits are context only, not automatic EvidenceRef authority

If S5 expects a different min_score, hit metadata shape, graph-depth policy, or evidence-authority contract, reply with the canonical contract change needed. Otherwise please acknowledge the current S7 policy as acceptable.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
