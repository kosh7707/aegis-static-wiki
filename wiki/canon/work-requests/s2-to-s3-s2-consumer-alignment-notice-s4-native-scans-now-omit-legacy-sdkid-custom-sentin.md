---
title: "S2 consumer alignment notice: S4 native scans now omit legacy sdkId custom sentinel"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s2-consumer-alignment-notice-s4-native-scans-now-omit-legacy-sdkid-custom-sentin"
last_verified: "2026-04-21"
service_tags: ["s2", "s3", "s4", "backend", "build-agent", "sast-runner", "api-contract"]
decision_tags: ["contract-change", "sdk-profile", "native-build", "sast-scan"]
related_pages: ["wiki/canon/work-requests/s4-to-s2-s3-legacy-buildprofile.sdkid-custom-sentinel-removed-from-s4-analysis-path-omit-sdk.md", "wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s2-consumer-alignment-notice-s4-native-scans-now-omit-legacy-sdkid-custom-sentin"
wr_kind: "notice"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-21T07:29:12.672Z","note":"S3 checked S4-facing paths. Runtime paths now strip sdkId='custom' before S4 scan/functions/metadata/build-and-analyze payloads while preserving real sdkIds and other profile fields. Focused tests and full analysis-agent suite passed."}]
registered_at: "2026-04-21T07:25:32.411Z"
completed_at: "2026-04-21T07:29:12.672Z"
---

# S2 consumer alignment notice: S4 native scans now omit legacy sdkId custom sentinel

## Summary
- Kind: notice
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
S4 removed the legacy `buildProfile.sdkId = "custom"` sentinel from S4 analysis-path requests. S2 has aligned its SAST scan consumer behavior.

## S2 behavior now
- S2 may still keep local `BuildProfile.sdkId = "custom"` as an internal/default user-defined/native profile sentinel.
- Before calling S4 scan endpoints, S2 strips `sdkId: "custom"` from `buildProfile`.
- Native/non-SDK S4 scan requests therefore omit `sdkId`.
- Managed SDK scans still send a real registered/present `sdkId`.

## Why S3 is copied
The original S4 notice targeted both S2 and S3. If any S3 Build Agent / analysis-agent path still constructs or forwards S4 scan/build profiles, please apply the same rule:

- native/non-SDK build => omit `sdkId`
- managed SDK build => send real registered/present `sdkId`
- never send `sdkId: "custom"` to S4

## S2 verification
- Added S2 `SastClient` contract coverage proving `sdkId: "custom"` is omitted from outgoing `/v1/scan` payload.
- Full backend verification passed: 27 files / 482 tests; backend build passed.

## Requested S3 action
Please confirm whether S3 has any remaining S4-facing path that can emit `sdkId: "custom"`. If yes, align it to omit `sdkId`; if no, complete this notice as no-op.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
