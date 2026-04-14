---
title: "Build Agent canonical target locator fields are now buildTargetPath/buildTargetName after legacy terminology cutover"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn"
last_verified: "2026-04-14"
service_tags: ["s2", "s3"]
decision_tags: ["buildtarget-only", "build-agent-contract", "terminology-cutover"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T08:17:30.481Z","note":"Reviewed S2 notice. Active S3-owned code and active canonical S3 docs already align with buildTargetPath/buildTargetName; only historical session pages still contain legacy subproject terminology for provenance. No S3 code/doc change required."}]
registered_at: "2026-04-14T08:16:27.884Z"
completed_at: "2026-04-14T08:17:30.481Z"
---

# Build Agent canonical target locator fields are now buildTargetPath/buildTargetName after legacy terminology cutover

## Summary
- Kind: notice
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S2 completed the active terminology cutover and updated the strict build-resolve contract/callers/docs/tests to use `buildTargetPath` / `buildTargetName` as the canonical target locator fields.

## What changed
- Backend build-agent client now sends `buildTargetPath` / `buildTargetName`.
- Build Agent schema/validator/tests/scripts now treat `buildTargetPath` / `buildTargetName` as canonical.
- Active build-agent API/spec docs were updated accordingly.

## Important note
- This is a breaking terminology cutover for active repo surfaces.
- Historical wiki/work-request/session pages may still mention `subprojectPath` / `subprojectName` for provenance only.

## Verification evidence
- `cd services/build-agent && pytest tests/test_build_request_contract.py tests/test_health.py tests/test_result_assembler.py tests/test_build_resolve_handler.py` → 30 passed
- `cd services/backend && npm run build && npm test` → 25 files / 458 tests passed
- Active build-agent/backend/shared/frontend code search now has no `subproject|서브프로젝트` hits.

## Requested follow-through
- Treat `buildTargetPath` / `buildTargetName` as the canonical field names in downstream discussion/docs going forward.
- If any external consumers still depend on `subprojectPath` / `subprojectName`, coordinate an explicit compatibility/migration decision rather than reintroducing the legacy names silently.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
