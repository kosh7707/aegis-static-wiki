---
title: "System-stability preflight: confirm S5 KB/GraphRAG readiness and evidence-role semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se"
last_verified: "2026-04-25"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "graphrag", "system-stability"]
decision_tags: ["system-stability", "api-contract", "health", "evidence-role", "graphrag"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-04-25T09:11:25.094Z","note":"S5 answered by reply WR wiki/canon/work-requests/s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili.md. Summary: S5 is aligned enough for S3 to rely on threat KB/CVE/code GraphRAG with conservative interpretation rules; knowledge outputs are contextual only, code graph outputs can be local evidence when tied to analyzed project file/function/line, S5 readiness/error states map to operational evidence, and known gaps are per-capability /ready granularity plus one-active-graph-per-project multi-snapshot limitation."}]
registered_at: "2026-04-25T07:05:23.901Z"
completed_at: "2026-04-25T09:11:25.094Z"
---

# System-stability preflight: confirm S5 KB/GraphRAG readiness and evidence-role semantics

## Summary
- Kind: question
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# WR: S3 system-stability preflight for S5

S3 is beginning the system-stability workstream. Our current target is:

> With valid caller input and live dependencies, S3 must return a schema-valid completed result envelope. Dependency absence/unreadiness may justify task-level failure only when S3 cannot assemble any valid honest response; otherwise partial/timeout/readiness issues should become caveats, recovery trace, or result-level `inconclusive`/`no_accepted_claims` outcomes.

Please confirm whether S5 is currently aligned enough for S3 to rely on it as the CVE/Threat GraphRAG and code GraphRAG provider.

## Questions for S5

1. **Component readiness:** Can S5 expose or confirm readiness separately for CVE lookup, threat/KB search, vector GraphRAG, Neo4j code graph, code-graph ingest, dangerous-callers, and project memory?
2. **Failure boundary:** Which S5 status codes/response fields should S3 interpret as:
   - dependency/runtime unavailable,
   - KB not initialized but recoverable/degraded,
   - timeout with partial evidence,
   - no result/no matching graph data,
   - caller input/contract invalid?
3. **Evidence-role metadata:** Can S5 responses include enough provenance for S3 to classify refs as `knowledge`, `local`, `derived`, or `operational`? In particular, can code-graph/derived results include source-local file/function/line provenance or `sourceLocalRefs`-equivalent metadata?
4. **Graph isolation:** Does code-graph ingest/search preserve project/revision/buildSnapshot isolation so S3 can avoid mixing evidence across targets?
5. **Readiness semantics:** For `neo4jGraph=false`, `graphRag=false`, vector readiness false, or KB timeout, should S3 omit tools, continue with partial evidence, or task-fail?
6. **Traceability:** Does S5 preserve `X-Request-Id` across search/lookup/ingest/call graph/project-memory paths?

## Requested reply

Please reply with:
- current readiness/contract summary,
- known gaps/blockers,
- recommended S3 interpretation rules,
- recent test evidence or commands, if available.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
