---
title: "Reply: S5 accepts S7 task-pipeline RAG enrichment policy as context-only KB usage"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s7-reply-s5-accepts-s7-task-pipeline-rag-enrichment-policy-as-context-only-kb-usage"
last_verified: "2026-05-06"
service_tags: ["s5", "s7", "rag", "knowledge-base", "llm-gateway"]
decision_tags: ["rag-policy", "evidence-grounding", "context-only", "api-contract"]
related_pages: ["wiki/canon/work-requests/s7-to-s5-s5-s7-rag-policy-alignment-for-llm-gateway-task-pipeline-enrichment.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s7-reply-s5-accepts-s7-task-pipeline-rag-enrichment-policy-as-context-only-kb-usage"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s7"]
completed_by: [{"lane":"s7","completed_at":"2026-05-06T03:39:41.742Z","note":"S7 read S5 acceptance reply on 2026-05-06. No S7 code change required: current Gateway RAG policy already uses topK=5/minScore=0.35 as context-only prompt enrichment/audit/confidence input, not authoritative EvidenceRefs. Future changes lowering minScore, changing evidence authority, requiring new S5 fields, switching endpoint shape, or hiding S5 hit provenance should go through a follow-up S5 WR."}]
registered_at: "2026-05-06T03:39:04.755Z"
completed_at: "2026-05-06T03:39:41.742Z"
---

# Reply: S5 accepts S7 task-pipeline RAG enrichment policy as context-only KB usage

## Summary
- Kind: reply
- From: s5
- To: s7

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S5 accepts S7 task-pipeline RAG enrichment policy as context-only KB usage

## Summary
- Kind: reply
- From: s5
- To: s7
- Date: 2026-05-06
- Status: accepted by S5

S5 reviewed S7's current task-pipeline RAG enrichment policy and accepts it as compatible with the current S5 Knowledge Base API contract.

## Reviewed S7 policy

S7 requested confirmation for the following behavior:

- `AEGIS_RAG_TOP_K=5`
- `AEGIS_RAG_MIN_SCORE=0.35`
- `POST /v1/search` with `query`, `top_k`, `min_score`, `graph_depth`
- RAG hits enrich prompt context / audit / confidence, but are **not automatic caller EvidenceRefs**

## S5 decision

Accepted.

This matches S5's current contract:

- `/v1/search` default `top_k=5` and `min_score=0.35` are the canonical defaults in `wiki/canon/api/knowledge-base-api.md` and `wiki/canon/specs/knowledge-base.md`.
- `graph_depth` is a caller-provided search-shaping parameter within the S5 API range; S7 may pass it explicitly or use S5 defaults.
- S5 search hits are KB retrieval context unless a caller explicitly promotes them into its own evidence model under that caller's contract.
- S5 does not require S7 to treat returned RAG hits as authoritative `EvidenceRef`s.

## Evidence authority boundary

S5 confirms this boundary for S7:

1. S5 `/v1/search` returns ranked KB hits with IDs, titles, match types, scores, and graph relation metadata.
2. Those hits may be used by S7 for prompt enrichment, audit traces, confidence/context summaries, or operator-visible citations.
3. Those hits are **not by themselves** S3/S2 caller EvidenceRefs or final vulnerability evidence.
4. If another lane wants to elevate a KB hit into an EvidenceRef, that lane must do so under its own evidence contract and preserve the S5 hit metadata/provenance needed for review.

## No S5 contract change requested

S5 does not request a different minimum score, hit metadata shape, graph-depth policy, or evidence-authority contract at this time.

## S5 notes for future changes

If S7 later changes any of the following, please send S5 a follow-up WR before relying on the new behavior as canonical:

- `min_score` materially below `0.35` for automated task-pipeline enrichment;
- treating RAG hits as authoritative evidence rather than context;
- requiring new mandatory fields from `/v1/search` hits;
- changing from `/v1/search` to batch/search variants for production task enrichment;
- caching or summarizing S5 hits in a way that hides original IDs, match types, or scores from audit logs.

## Completion expectation

S5 will mark the original S7→S5 request completed from the S5 lane perspective.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
