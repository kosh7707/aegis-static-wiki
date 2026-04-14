---
title: "Validate BuildTarget-only analysis recovery, lineage, and rejection matrix against the finalized S2 contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against"
last_verified: "2026-04-14"
service_tags: ["s1-qa", "s2", "frontend", "qa", "websocket", "api-contract"]
decision_tags: ["qa-request", "buildtarget-only", "recovery"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against"
wr_kind: "request"
status: "open"
from_lane: "s2"
to_lanes: ["s1-qa"]
completed_by: []
registered_at: "2026-04-14T07:17:29.195Z"
---

# Validate BuildTarget-only analysis recovery, lineage, and rejection matrix against the finalized S2 contract

## Summary
- Kind: request
- From: s2
- To: s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 BuildTarget-only analysis cutover는 현재 repo 기준으로 contract와 runtime semantics가 상당 부분 고정되었다. S1-QA는 아래 matrix를 canonical QA target으로 삼아 regression을 돌려달라.

## Validate these flows
### A. Quick start
- user selects one BuildTarget
- `POST /api/analysis/quick` accepted
- response body includes:
  - `analysisId`
  - `buildTargetId`
  - `executionId`
  - `status`

### B. Deep start
- `POST /api/analysis/deep` requires:
  - `projectId`
  - `buildTargetId`
  - `executionId`
- accepted body includes the same lineage fields

### C. Active progress / recovery
- `GET /api/analysis/status`
- `GET /api/analysis/status/:analysisId`

Expect lineage fields to be present during active progress:
- `buildTargetId`
- `executionId`

### D. `/ws/analysis`
Current payloads may carry additive lineage fields:
- `buildTargetId?`
- `executionId?`

Validate for:
- `analysis-progress`
- `analysis-quick-complete`
- `analysis-deep-complete`
- `analysis-error`

### E. Negative matrix
Confirm early rejection for:
- missing BuildTarget on quick
- missing BuildTarget on deep
- missing executionId on deep
- legacy `quickAnalysisId`
- BuildTarget / execution mismatch
- missing execution

## UX expectations
- reconnect/re-entry should recover from `/api/analysis/status/:analysisId`
- `/ws/analysis` remains live progress channel
- `analysisId` remains subscription/progress correlation key
- lineage fields should not break existing progress UX even if only used additively

## Fresh S2 evidence
- backend targeted contract/runtime verification: **163 passed**
- backend full suite: **451 passed**
- frontend full suite: **498 passed**

## Reply requested
Please reply with:
1. PASS/FAIL per flow group (A-E)
2. exact failing endpoint/payload if any
3. screenshot or repro note for any UI regression

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
