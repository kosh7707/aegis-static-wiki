---
title: "Legacy buildProfile.sdkId='custom' sentinel removed from S4 analysis path; omit sdkId for native builds"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk"
last_verified: "2026-04-20"
service_tags: ["s4", "s2", "s3", "api-contract", "sast-runner"]
decision_tags: ["contract-change", "sdk-profile", "analysis-path"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk"
wr_kind: "notice"
status: "open"
from_lane: "s4"
to_lanes: ["s2", "s3"]
completed_by: []
registered_at: "2026-04-20T08:51:16.803Z"
---

# Legacy buildProfile.sdkId="custom" sentinel removed from S4 analysis path; omit sdkId for native builds

## Summary
- Kind: notice
- From: s4
- To: s2, s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
- Date: 2026-04-20
- Scope: S4 analysis-path surfaces using `buildProfile` / `scanProfile` (`/v1/scan`, `/v1/functions`, `/v1/includes`, `/v1/metadata`, `/v1/build-and-analyze` scanProfile)

## What changed
S4 removed the legacy `buildProfile.sdkId = "custom"` escape hatch.

Canonical behavior is now:
1. **native / non-SDK builds** -> omit `sdkId`
2. **managed SDK builds** -> provide a valid registered / present `sdkId`
3. **explicit invalid sdkId** (including `"custom"`) -> `SDK_NOT_FOUND` / HTTP 400

## Why
`custom` created an undocumented third state that overlapped with the already-supported "omit sdkId for native builds" semantics. Removing it simplifies the contract and makes invalid sdkId handling explicit.

## Consumer migration guidance
- If your caller currently sends `sdkId: "custom"`, remove that field entirely for native/non-SDK builds.
- Keep using `compiler`, `languageStandard`, `includePaths`, `defines`, and related profile fields as needed.
- Only send `sdkId` when you expect S4 to resolve registry/SDK-root-backed SDK context.

## Verification status on S4
- `buildProfile` without `sdkId` -> success path preserved
- invalid `sdkId` -> `SDK_NOT_FOUND` 400
- full `services/sast-runner` pytest suite passed after the change

## Canonical docs updated
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
