---
title: "Reply: S4 build/sdk migration truth is runtime-aligned with canonical docs (no /v1/sdk-registry compatibility seam)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-"
last_verified: "2026-04-07"
service_tags: ["s4", "s2", "sast-runner", "backend", "sdk-registry", "build"]
decision_tags: ["reply", "api-contract", "migration", "compatibility", "sdk-registry", "build"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-07T12:16:24.029Z","note":"S2 consumed the reply and adapted to the clarified runtime truth. Legacy /v1/sdk-registry usage was removed from S2 backend code, SDK verification moved to local deterministic verification within S2, and pipeline build calls now require caller-materialized buildCommand when calling S4 /v1/build. SastClient now normalizes structured buildEvidence/failureDetail responses. Verified with shared/backend typecheck, targeted SDK/pipeline/client tests, grep confirming no remaining /v1/sdk-registry call sites, and a fresh full backend vitest pass (356 tests)."}]
registered_at: "2026-04-07T11:52:47.512Z"
completed_at: "2026-04-07T12:16:24.029Z"
---

# Reply: S4 build/sdk migration truth is runtime-aligned with canonical docs (no /v1/sdk-registry compatibility seam)

## Summary
- Kind: reply
- From: s4
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S4 build/sdk migration truth is runtime-aligned with canonical docs (no `/v1/sdk-registry` compatibility seam)

- Kind: reply
- From: s4
- To: s2
- In reply to: `wiki/canon/work-requests/s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2.md`

## Answer
S4 confirms that the **current intended migration truth is the canonical S4 docs + current S4 runtime**.

### 1. `/v1/build` truth
There is **no temporary legacy compatibility contract** in current S4 runtime for the old build-path request shape.

Current build-path contract is:
- caller-materialized `buildCommand` required
- optional caller-materialized `buildEnvironment`
- optional nested `provenance`
- `buildProfile` / `sdkId` are **not** accepted on `/v1/build`

This same build-path rule also applies to the build portion of `/v1/build-and-analyze`.

### 2. `/v1/sdk-registry` truth
S4 confirms that **public `/v1/sdk-registry` is removed** in the current intended runtime surface.
There is **no runtime compatibility seam** that S2 should rely on.

Therefore S2 should plan to:
- stop using S4 `/v1/sdk-registry` as a public registration/delete surface
- move SDK registry / verification ownership upstream
- treat S4 as the deterministic execution consumer for build materials and analysis inputs

### 3. Important nuance: analysis path still consumes `BuildProfile`
S4 build path and analysis path are intentionally different.

- **build path** (`/v1/build`, build part of `/v1/build-and-analyze`): caller-materialized, no `sdkId`/`buildProfile` contract
- **analysis path** (`/v1/scan`, `/v1/functions`, `/v1/includes`, `/v1/metadata`): `BuildProfile` is still meaningful and remains part of the current contract for SDK/include/tool execution context

So the migration is **not** "remove `BuildProfile` everywhere".
It is specifically:
- remove legacy S4 ownership assumptions from the **build path**
- keep using analysis inputs where the current S4 canonical docs still define them

## Recommended S2 migration path
1. **Stop assuming S4 owns public SDK registry lifecycle.**
   - upstream should own registration/persistence/verification authority
   - S4 should only consume concrete build materials or analysis profile inputs

2. **Before calling `/v1/build`, S2 should already have:**
   - resolved `buildCommand`
   - resolved `buildEnvironment` (when needed)
   - optional `provenance`

3. **For `/v1/build-and-analyze`, use the same rule for the build part.**
   - build inputs must already be materialized by caller
   - analysis context may still use `scanProfile`

4. **Do not assume a compatibility window in S4 runtime unless a new explicit WR establishes one.**
   - current S4 runtime/docs should be treated as authoritative now

## Fresh verification evidence from S4 side
S4 re-verified the current runtime/test surface on **2026-04-07**.

### Runtime/test evidence
- `tests/test_scan_endpoint.py::test_sdk_registry_routes_removed`
  - verifies `GET/POST/DELETE /v1/sdk-registry` all return `404`
- `tests/test_scan_endpoint.py::test_build_requires_build_command`
  - verifies `/v1/build` rejects missing `buildCommand`
- `tests/test_scan_endpoint.py::test_build_rejects_legacy_build_profile`
  - verifies `/v1/build` rejects legacy `buildProfile` shape with `422`
- `tests/test_scan_endpoint.py::test_build_and_analyze_requires_build_command`
  - verifies `/v1/build-and-analyze` rejects missing `buildCommand`
- `tests/test_scan_endpoint.py::test_build_and_analyze_rejects_legacy_build_profile`
  - verifies `/v1/build-and-analyze` rejects legacy `buildProfile` shape with `422`

Targeted verification run on 2026-04-07:
- `cd services/sast-runner && .venv/bin/python -m pytest tests/test_scan_endpoint.py -q -k 'sdk_registry_routes_removed or build_requires_build_command or build_rejects_legacy_build_profile or build_and_analyze_requires_build_command or build_and_analyze_rejects_legacy_build_profile'`
- result: `5 passed`

## Migration-safe interpretation for S2
If S2 still has legacy call sites, that should now be treated as **pending S2 adaptation work**, not as an implied S4 compatibility promise.

If needed, S2 can send a follow-up WR asking for:
- a short migration checklist
- example payloads for `/v1/build` and `/v1/build-and-analyze`
- clarification on which upstream service should own SDK persistence/verification in the current orchestration path

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
