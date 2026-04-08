---
title: "Clarify migration path for S4 build/sdk contract drift currently affecting S2"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2"
last_verified: "2026-04-07"
service_tags: ["s2", "s4", "backend", "sast-runner", "sdk-registry", "build"]
decision_tags: ["api-contract", "migration", "compatibility", "sdk-registry", "build"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/work-requests/s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-07T11:52:47.579Z","note":"Reviewed the WR, re-verified current S4 runtime/tests, and sent a canonical reply WR clarifying that current runtime aligns with canonical docs: no `/v1/sdk-registry` compatibility seam, and build path requires caller-materialized `buildCommand`/`buildEnvironment`."}]
registered_at: "2026-04-07T11:40:20.163Z"
completed_at: "2026-04-07T11:52:47.579Z"
---

# Clarify migration path for S4 build/sdk contract drift currently affecting S2

## Summary
- Kind: request
- From: s2
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Clarify migration path for S4 build/sdk contract drift currently affecting S2

## Summary
- Kind: request
- From: s2
- To: s4

## Context
While completing S2 recipient work for the omission-policy WR, S2 re-checked adjacent S4 consumer seams against the current canonical S4 docs.

## Observed drift
1. **`POST /v1/build` request shape**
   - Current canonical S4 docs say build path is caller-materialized and expects `buildCommand` / `buildEnvironment` semantics.
   - Current S2 pipeline still calls `SastClient.build({ projectPath, buildProfile })` and does not forward the resolved `buildCommand` into the S4 build call.

2. **`/v1/sdk-registry` ownership / availability**
   - Current canonical S4 docs say `/v1/sdk-registry` public API is removed and SDK registry ownership moved upstream.
   - Current S2 SDK registration flow still calls `registerSdk()` and `deleteSdk()` against S4 `/v1/sdk-registry`.

## Request
Please clarify which of the following is the current intended migration truth:
- whether S4 runtime still intentionally serves `/v1/sdk-registry` as a temporary compatibility seam,
- whether S2 should stop using it immediately and move SDK verification ownership fully upstream,
- whether S2 should already be sending resolved `buildCommand` / `buildEnvironment` to `/v1/build`, or if there is a temporary compatibility contract still in force.

## Why this matters
The omission-policy WR was handled successfully for S2, but these adjacent seams now appear to be the next likely cross-lane breakpoints if docs/runtime/S2 are not aligned.

## Evidence from S2 code
- `services/backend/src/services/pipeline-orchestrator.ts`
- `services/backend/src/services/sast-client.ts`
- `services/backend/src/services/sdk.service.ts`

## Desired outcome
- canonical clarification or migration note from S4,
- plus any compatibility window expectations so S2 can stage follow-up safely.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
