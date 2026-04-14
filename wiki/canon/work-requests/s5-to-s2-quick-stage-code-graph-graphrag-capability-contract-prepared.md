---
title: "Quick-stage code-graph / GraphRAG capability contract prepared"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared"
last_verified: "2026-04-13"
service_tags: ["s5", "s2"]
decision_tags: ["quick-deep", "graphrag", "code-graph", "contract"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/work-requests/s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-13T08:58:30.446Z","note":"Consumed on 2026-04-13. S2 implemented the first consumer slice: KbClient now sends X-Timeout-Ms + function call lists to ingest, parses graph readiness semantics, and AnalysisOrchestrator/PipelineOrchestrator now consume GraphRAG readiness instead of assuming any ingest implies ready. Full public S2 API split remains pending."}]
registered_at: "2026-04-13T08:36:15.170Z"
completed_at: "2026-04-13T08:58:30.446Z"
---

# Quick-stage code-graph / GraphRAG capability contract prepared

## Summary
- Kind: reply
- From: s5
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S5 prepared and implemented the Quick-stage caller contract for code-graph / GraphRAG formation.

## Contract outcome
1. **Canonical ingest surface**
   - Caller-controlled ingest surface remains `POST /v1/code-graph/{project_id}/ingest`.
   - Minimum required call shape is: `project_id` path + `functions[]` request body + `X-Timeout-Ms` header.
   - `functions[]` entries should carry at least `name`, `file`, `line`, and `calls[]` for Quick-stage graph formation.

2. **Idempotent / repeatable semantics**
   - The surface is a repeatable replace operation for the active project graph.
   - Response now exposes:
     - `replaceMode: "replace_project_graph"`
     - `operation.repeatable: true`
     - `operation.replacedExistingGraph: bool`
   - Same-project replays therefore overwrite the previous active graph instead of creating parallel retained snapshots.

3. **Readiness / completion semantics**
   - The authoritative completion signal is now the ingest response fields:
     - `status`: `ready` | `partial` | `empty`
     - `readiness.neo4jGraph`
     - `readiness.vectorIndex`
     - `readiness.graphRag`
   - S2 should treat the graph as ready for the next stage only when:
     - `status == "ready"`
     - and `readiness.graphRag == true`
   - `partial` means Neo4j graph creation succeeded but vector / GraphRAG formation is incomplete.
   - `empty` means the active project graph has no function content and is not next-stage ready.
   - `warnings` may include `VECTOR_INDEX_INCOMPLETE` for degraded ingest outcomes.

4. **GraphRAG role boundary**
   - This reply stays on capability semantics only.
   - It does not prescribe whether S2 should trigger ingest after upload, build-prep, or Quick; that orchestration decision remains on S2.

## Implementation / docs
- S5 code updated so ingest responses now return overwrite + readiness semantics.
- Canonical docs updated:
  - `wiki/canon/api/knowledge-base-api.md`
  - `wiki/canon/specs/knowledge-base.md`

## Verification
- `cd services/knowledge-base && .venv/bin/python -m pytest tests/test_code_graph_service.py tests/test_api_contract.py -q` → 87 passed
- `cd services/knowledge-base && .venv/bin/python -m pytest tests/ -q` → 233 passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
