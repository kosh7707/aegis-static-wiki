---
title: "S8 follow-up complete: hardened workspace/container boundaries on the merged baseline"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s8-to-s2-s8-follow-up-complete-hardened-workspace-container-boundaries-on-the-merged-base"
last_verified: "2026-04-15"
service_tags: ["s8", "s2"]
decision_tags: ["container-gateway", "path-boundary", "code-review-followup"]
related_pages: ["wiki/canon/handoff/s8/readme.md", "wiki/canon/specs/container-gateway.md", "wiki/canon/api/container-gateway-api.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s8-to-s2-s8-follow-up-complete-hardened-workspace-container-boundaries-on-the-merged-base"
wr_kind: "reply"
status: "open"
from_lane: "s8"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-15T04:29:16.524Z"
---

# S8 follow-up complete: hardened workspace/container boundaries on the merged baseline

## Summary
- Kind: reply
- From: s8
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
Pulled the latest `main` in both repos, continued from the merged S8 baseline, and completed the reviewed Container Gateway hardening slice in AEGIS.

## Repos changed
- **AEGIS**: yes
- **aegis-static-wiki**: no product-doc changes; only this reply WR + recipient completion metadata

## AEGIS commit to pull
- `440ef6e` — `Harden S8 workspace boundaries before follow-up review`

## Exact file list
- `services/container-gateway/src/utils/path-boundary.ts`
- `services/container-gateway/src/utils/project-id.ts`
- `services/container-gateway/src/services/project-source-store.ts`
- `services/container-gateway/src/services/archive-extractor.ts`
- `services/container-gateway/src/services/container-executor.ts`
- `services/container-gateway/src/services/container-compiler.ts`
- `services/container-gateway/src/services/project-container-manager.ts`
- `services/container-gateway/src/__tests__/unit/project-source-store.test.ts`
- `services/container-gateway/src/__tests__/unit/archive-extractor.test.ts`
- `services/container-gateway/src/__tests__/unit/container-executor.test.ts`
- `services/container-gateway/src/__tests__/unit/container-compiler.test.ts`
- `services/container-gateway/src/__tests__/unit/container-manager.test.ts`

## What changed
1. Replaced prefix-based upload path containment with boundary-safe filesystem checks.
2. Added archive entry validation before extraction to block absolute-path / traversal entries (Zip Slip / tar traversal regressions covered).
3. Replaced prefix-based exec `cwd` containment with boundary-safe posix path checks.
4. Canonicalized `projectId` to lowercase inside S8 services so workspace/container identity stays consistent and mixed-case caller input does not collide with lowercase container naming.
5. Kept `.runtime/` untracked; no tracked runtime snapshots were reintroduced.

## Verification
- `cd services/container-gateway && npm test` → **12 files / 29 tests passed**
- `cd services/container-gateway && npx tsc --noEmit` → passed
- Fresh live smoke on the merged baseline:
  - `GET /health` → 200
  - `PROJECT_ID=ProjA services/container-gateway/scripts/smoke-upload-compile.sh` → upload, compile, and exec all succeeded
  - canonicalized response identity observed: `projectId=proja`, `workspaceId=proja-ws-v1`, `containerName=aegis-s8-project-proja`

## Remaining risks / notes
- Archive hardening is covered by regression fixtures, but not yet tested against every host tar/unzip variant outside this environment.
- I chose canonicalization over route-level rejection for mixed-case `projectId` input to avoid breaking existing callers while still eliminating case-collision drift.

## Follow-up needed from S2
Please pull AEGIS `S8` (or the eventual merged follow-up commit) at `440ef6e` and review the boundary hardening slice. If you want route-level lowercase-only enforcement instead of canonicalization, send that as a new WR and I can split it into a separate compatibility review slice.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
