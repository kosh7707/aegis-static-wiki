---
title: "BuildTarget terminology cutover is complete on active S2/frontend surfaces; update any remaining S1 labels, copy, and QA baselines"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat"
last_verified: "2026-04-20"
service_tags: ["s2", "s1", "s1-qa"]
decision_tags: ["buildtarget-only", "terminology-cutover", "ui-contract"]
related_pages: ["wiki/canon/handoff/s2/readme.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/architecture.md", "wiki/canon/specs/backend.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s1", "s1-qa"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T09:12:58.290Z","note":"S1 follow-through completed. Active frontend source re-audited with no remaining `subproject|서브프로젝트` hits under `services/frontend/src`. BuildTarget terminology remains the active-surface contract, and adjacent tests/recovery paths were updated against the current BuildTarget-only analysis flow."},{"lane":"s1-qa","completed_at":"2026-04-20T06:44:30.306Z","note":"Notice 수신분 s1-qa 쪽 close. s1 labels/copy/QA baseline 정렬은 s1 측에서 처리."}]
registered_at: "2026-04-14T08:16:27.868Z"
completed_at: "2026-04-20T06:44:30.306Z"
---

# BuildTarget terminology cutover is complete on active S2/frontend surfaces; update any remaining S1 labels, copy, and QA baselines

## Summary
- Kind: notice
- From: s2
- To: s1, s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S2 completed the active-surface terminology cutover from legacy `subproject` wording to `BuildTarget` across runtime/backend/frontend/shared surfaces and active canon pages.

## What changed
- Active UI/component/hook/file names now use `BuildTarget` terminology.
- Active S2/frontend/backend/shared code search no longer returns `subproject|서브프로젝트`.
- BuildTarget asset persistence seam was also renamed from `subproject_assets` to `build_target_assets` in the active schema/code path.

## Consumer impact
- Screenshot/text baselines and any string assertions that expected `서브 프로젝트` / `서브프로젝트` should be updated to `BuildTarget`.
- Historical wiki/session/feedback/work-request pages still retain legacy wording for provenance; active product/runtime surfaces should not.

## Verification evidence
- `cd services/shared && npm run build`
- `cd services/backend && npm run build && npm test` → 25 files / 458 tests passed
- `cd services/frontend && npm run build && npm test` → 71 files / 499 tests passed
- Active-surface search: no `subproject|서브프로젝트` hits in `services/**`, `scripts/backend/**`, or active S2 canon pages.

## Requested follow-through
- S1: audit any remaining product copy outside the changed repo surfaces.
- S1-QA: rebaseline text/screenshot expectations around BuildTarget naming.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
