---
title: "prepare explicit build-preparation and one-shot Quick scan contract for the new analysis journey"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-"
last_verified: "2026-04-13"
service_tags: ["s2", "s4"]
decision_tags: ["quick-deep", "build-prep", "compile-commands", "contract"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/canon/api/sast-runner-api.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-13T08:39:21.549Z","note":"Implemented the S4 side of the explicit build-preparation + one-shot Quick contract. /v1/build now returns readiness (ready/partial/not-ready); build prep is only Quick-eligible when compileCommandsReady=true, userEntries>0, and exitCode==0. compile_commands without user-target entries now fail with compile-commands-no-user-entries. Canonical S4 API/spec/handoff docs were refreshed to define explicit Quick as /v1/build ready -> /v1/scan one-shot."}]
registered_at: "2026-04-13T08:25:45.466Z"
completed_at: "2026-04-13T08:39:21.549Z"
---

# prepare explicit build-preparation and one-shot Quick scan contract for the new analysis journey

## Summary
- Kind: request
- From: s2
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 has rewritten the canonical analysis user journey.

The intended journey is now:
1. source upload
2. SDK upload
3. explicit build-preparation step
4. Build Agent prepares build material
5. S4 produces/consumes `compile_commands.json`
6. explicit Quick request
7. explicit Deep request only after the user asks for it

Quick is no longer being treated as a vague "first half of an automatic Quick→Deep chain". It should be a distinct, caller-controlled step.

## What S2 needs from S4
Please prepare / confirm the S4 contract so S2 can later orchestrate the new flow cleanly.

### Requested contract outcomes
1. **Explicit build-preparation surface**
   - Confirm the canonical caller path for build-only preparation.
   - Make clear what S2/S3 must provide for S4 to materialize `compile_commands.json`.
   - Clarify success/failure semantics when build material is incomplete or invalid.

2. **Explicit one-shot Quick scan surface**
   - Confirm the canonical scan input once build material already exists.
   - Clarify whether Quick should be modeled as `build -> scan` or `scan using prepared build evidence`, and what S2 can rely on in each case.
   - Confirm which response fields should be treated as authoritative Quick outputs for S2 normalization.

3. **Compile DB / build evidence readiness contract**
   - Confirm the exact conditions under which S2 may treat `compile_commands.json` as ready for the next step.
   - Clarify partial-build / partial-compile-db semantics for Quick.

4. **No hidden orchestration assumption**
   - S2 does not want Quick wording that implies Deep follows automatically.
   - Please keep the S4 contract focused on deterministic preparation / one-shot Quick scan capabilities only.

## Important boundary
This WR is asking S4 to make its capability surfaces explicit and stable.
It is **not** asking S4 to decide the final S2 orchestration or S1 UX.

## Why now
Current canon has changed at the user-journey level, but the cross-lane implementation contract still reflects legacy Quick→Deep assumptions. S4 is one of the prerequisite lanes that must be made explicit before S2 can safely redesign its orchestration/API layer.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
