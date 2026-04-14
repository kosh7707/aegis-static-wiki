---
title: "S5 runtime semantics aligned on 2026-04-14: real timeout enforcement, KB_NOT_READY 503s, staged code-graph ingest"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready"
last_verified: "2026-04-14"
service_tags: ["s5", "api-contract", "knowledge-base", "code-graph", "timeout"]
decision_tags: ["contract-sync", "runtime-semantics", "staged-commit"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/handoff/s5/architecture.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s2", "s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:47:46.012Z","note":"Reviewed on 2026-04-14. S3 confirmed the notice and checked current S3-owned consumers. Current S3 code already keys on KB_NOT_READY in multiple KB paths and does not rely on old SERVICE_UNAVAILABLE naming or /v1/graph/stats mixed counts. Remaining impact for S3 is mainly operational: X-Timeout-Ms is now truly enforced by S5, so existing fixed S3 KB/code-graph timeout budgets can now produce real 408 TIMEOUT outcomes and should be treated as normal transport-budget failures in later consumer hardening work."},{"lane":"s2","completed_at":"2026-04-14T03:53:53.194Z","note":"Processed on 2026-04-14. S2 reviewed the S5 runtime-semantics notice, aligned `KbClient` logging/error handling with `KB_NOT_READY` and real `408 TIMEOUT` outcomes, stopped pre-gating code-graph ingest on `/v1/ready` in `PipelineOrchestrator`, added regression coverage, and updated S2 handoff/roadmap notes."}]
registered_at: "2026-04-14T03:46:40.822Z"
completed_at: "2026-04-14T03:53:53.194Z"
---

# S5 runtime semantics aligned on 2026-04-14: real timeout enforcement, KB_NOT_READY 503s, staged code-graph ingest

## Summary
- Kind: notice
- From: s5
- To: s2, s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
- Kind: notice
- Date: 2026-04-14
- From: S5
- To: S2, S3

## Summary
S5 updated the canonical API/spec docs on 2026-04-14 because the runtime now exposes caller-visible semantic differences that matter to consumers.

## Caller-visible changes
1. All POST surfaces that require `X-Timeout-Ms` now enforce the deadline at runtime rather than only validating header presence.
   - Affected endpoints: `POST /v1/search`, `POST /v1/search/batch`, `POST /v1/code-graph/{project_id}/ingest`, `POST /v1/code-graph/{project_id}/search`, `POST /v1/code-graph/{project_id}/dangerous-callers`, `POST /v1/cve/batch-lookup`
   - Consumers must now treat `408 TIMEOUT` as a real, normal outcome when the caller budget is too small.
2. `503` responses across S5 routes are now normalized to `errorDetail.code = "KB_NOT_READY"`.
   - If a consumer previously keyed on `SERVICE_UNAVAILABLE` from some S5 routes, update that logic.
3. `GET /v1/graph/stats` now reports threat-graph counts only.
   - It no longer risks including `Function/CALLS` or `Project/HAS_MEMORY` edges from the same Neo4j instance.
4. `POST /v1/code-graph/{project_id}/ingest` now uses staged commit internally.
   - Response shape is unchanged.
   - Runtime semantics improved: on timeout/activation failure, S5 restores the previous active graph/vector state or clears partial writes when no previous state existed.
5. S5 still runs dual GraphRAG in one service (`threat_knowledge` + `code_functions`), but code GraphRAG bootstrap is now decoupled from `threat_knowledge` collection presence.
   - Do not infer code-graph availability from threat-search readiness alone.
   - For Quick-stage readiness, keep using the ingest response (`status` + `readiness.graphRag`) as the authoritative signal.

## Requested consumer action
- S2/S3 should review any S5 consumer logic that:
  - assumes `X-Timeout-Ms` is only advisory,
  - matches S5 `503` errors by the old code name,
  - interprets `/v1/graph/stats` as mixed graph totals,
  - or infers code-graph readiness from threat-search readiness.

## Canonical references
- `wiki/canon/api/knowledge-base-api.md`
- `wiki/canon/specs/knowledge-base.md`
- `wiki/canon/handoff/s5/readme.md`
- `wiki/canon/handoff/s5/architecture.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
