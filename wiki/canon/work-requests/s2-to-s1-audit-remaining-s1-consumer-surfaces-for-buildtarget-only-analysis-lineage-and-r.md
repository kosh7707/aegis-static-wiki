---
title: "Audit remaining S1 consumer surfaces for BuildTarget-only analysis lineage and remove any final project-owned assumptions"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r"
last_verified: "2026-04-14"
service_tags: ["s1", "s2", "frontend", "api-contract", "buildtarget"]
decision_tags: ["consumer-audit", "buildtarget-only", "lineage"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T09:12:58.214Z","note":"S1 audit completed. Frontend search shows no remaining `/api/analysis/run`, `quickAnalysisId`, or active-surface `subproject` terminology. Remaining analysis-related `targetIds` naming drift on S1 consumer callbacks was removed where it implied analysis selection rather than pipeline batching. Added recovery hardening so StaticAnalysisPage can reopen by `analysisId` using canonical status/results surfaces."}]
registered_at: "2026-04-14T07:17:49.735Z"
completed_at: "2026-04-14T09:12:58.214Z"
---

# Audit remaining S1 consumer surfaces for BuildTarget-only analysis lineage and remove any final project-owned assumptions

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 has now finalized the current BuildTarget-only analysis contract enough that S1 should do one last consumer audit for any remaining project-owned assumptions.

## Audit checklist for S1
1. No remaining use of:
- `/api/analysis/run`
- `mode`
- `targetIds`
- `quickAnalysisId`

2. Quick / Deep request bodies are canonical:
- Quick: `{ projectId, buildTargetId }`
- Deep: `{ projectId, buildTargetId, executionId }`

3. Accepted response payloads are preserved in client state:
- `analysisId`
- `buildTargetId`
- `executionId`
- `status`

4. Recovery uses the authoritative S2 surfaces:
- `GET /api/analysis/status`
- `GET /api/analysis/status/:analysisId`
- `GET /api/analysis/results/:analysisId`

5. `/ws/analysis` additive lineage fields are consumed safely when present:
- `buildTargetId?`
- `executionId?`

6. Any remaining user-visible wording that still implies project-owned execution should be reviewed and corrected where appropriate.

## Fresh S2 notes
- Current repo frontend was already partially updated during this cutover session, but S1 should still treat this WR as the lane-owned final audit request.
- Current S2 runtime keeps `analysisId` as the live WS correlation key while adding lineage fields additively.

## Reply requested
Please reply with:
- consumer surfaces audited
- any remaining drift found
- whether any additional S2 clarifications are needed before S1 sign-off

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
