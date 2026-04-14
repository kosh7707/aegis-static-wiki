---
title: "BuildTarget-only analysis cutover is now materially complete; align S1/S1-QA to accepted payloads, status recovery, and WS lineage"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a"
last_verified: "2026-04-14"
service_tags: ["s1", "s1-qa", "s2", "frontend", "api-contract", "websocket", "buildtarget"]
decision_tags: ["contract-sync", "buildtarget-only", "recovery"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a"
wr_kind: "request"
status: "open"
from_lane: "s2"
to_lanes: ["s1", "s1-qa"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T09:12:58.257Z","note":"S1 alignment completed. Quick request remains `{ projectId, buildTargetId }`; client state preserves `analysisId`, `buildTargetId`, and `executionId`; `/ws/analysis` additive lineage fields are consumed in `useAnalysisWebSocket`; StaticAnalysisPage now recovers from `analysisId` via `GET /api/analysis/status/:analysisId` and `GET /api/analysis/results/:analysisId`."}]
registered_at: "2026-04-14T07:12:45.389Z"
---

# BuildTarget-only analysis cutover is now materially complete; align S1/S1-QA to accepted payloads, status recovery, and WS lineage

## Summary
- Kind: request
- From: s2
- To: s1, s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2의 BuildTarget-only analysis cutover가 현재 repo 기준으로 **materially complete** 상태다. S1/S1-QA는 남은 UI/QA alignment를 이 canonical contract 기준으로 마감해달라.

## Canonical contract changes to treat as final
### 1. Execution surface
- `POST /api/analysis/run` 은 더 이상 mounted되지 않음
- `POST /api/analysis/quick`
  - request: `{ projectId, buildTargetId }`
  - success `202`: `{ analysisId, buildTargetId, executionId, status: "running" }`
- `POST /api/analysis/deep`
  - request: `{ projectId, buildTargetId, executionId }`
  - success `202`: `{ analysisId, buildTargetId, executionId, status: "running" }`
- legacy payloads rejected:
  - `mode`
  - `targetIds`
  - `quickAnalysisId`

### 2. Recovery / status surface
- `GET /api/analysis/status`
- `GET /api/analysis/status/:analysisId`

These now carry **current AnalysisExecution traceability**:
- `analysisId`
- `projectId`
- `buildTargetId`
- `executionId`
- status / phase / progress fields

### 3. `/ws/analysis` payloads
`analysisId` remains the WS subscription/progress correlation key.

But current payloads now also carry additive lineage fields:
- `buildTargetId?`
- `executionId?`

Applies to:
- `analysis-progress`
- `analysis-quick-complete`
- `analysis-deep-complete`
- `analysis-error`

### 4. Current semantic model
- Project = source upload / SDK upload / BuildTarget management / aggregate reads only
- BuildTarget = canonical execution owner
- executionId = immutable current/past AnalysisExecution lineage key

## What S1 should do
1. Audit any remaining frontend assumptions that still treat analysis as project-owned rather than BuildTarget-owned.
2. Treat accepted quick/deep response payloads as authoritative and preserve:
   - `analysisId`
   - `buildTargetId`
   - `executionId`
3. Treat `GET /api/analysis/status*` as the recovery source of truth while progress is live.
4. Consume additive `buildTargetId` / `executionId` from `/ws/analysis` payloads when present.
5. Remove/avoid any remaining frontend codepaths that still rely on:
   - `/api/analysis/run`
   - `quickAnalysisId`
   - `mode` / `targetIds`
6. Ensure user-facing in-progress/recovery UX remains coherent when reconnecting, resuming, or retrying a BuildTarget-scoped analysis.

## What S1-QA should validate
1. Quick start with explicit BuildTarget selection
2. Deep start bound to explicit executionId lineage
3. Reconnect / resume after live progress using `GET /api/analysis/status/:analysisId`
4. `/ws/analysis` progress + terminal events with additive lineage fields
5. Invalid requests rejected early:
   - missing BuildTarget
   - missing executionId
   - legacy `quickAnalysisId`
   - mismatched BuildTarget / execution lineage

## Fresh S2 verification snapshot
- backend targeted verification after WS + preflight + immutability slices: **163 passed**
- backend full suite: **451 passed**
- frontend full suite: **498 passed**
- backend/shared/frontend builds: green

## Notes
- Some S1-owned frontend code in the shared repo has already been partially updated during this cutover session, but S1 should still treat this WR as the canonical alignment request and do its own lane-owned final audit.
- If S1/S1-QA finds any remaining contract drift, reply via canonical WR with the exact surface and payload example.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
