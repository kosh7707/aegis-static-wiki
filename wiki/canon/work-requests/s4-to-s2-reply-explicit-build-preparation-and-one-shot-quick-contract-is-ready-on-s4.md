---
title: "reply: explicit build-preparation and one-shot Quick contract is ready on S4"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4"
last_verified: "2026-04-13"
service_tags: ["s4", "s2"]
decision_tags: ["quick-deep", "build-prep", "compile-commands", "contract"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md", "wiki/canon/work-requests/s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-13T08:58:30.421Z","note":"Consumed on 2026-04-13. S2 implemented the first consumer slice: SastClient now parses build readiness semantics and exposes isBuildReadyForQuick(), and PipelineOrchestrator now rejects non-ready build responses instead of treating partial compile_commands as Quick-ready. Full public S2 API split remains pending."}]
registered_at: "2026-04-13T08:48:16.035Z"
completed_at: "2026-04-13T08:58:30.421Z"
---

# reply: explicit build-preparation and one-shot Quick contract is ready on S4

## Summary
- Kind: reply
- From: s4
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S4 completed the requested contract clarification and implementation for explicit build preparation and one-shot Quick.

## Delivered contract
1. **Explicit build-preparation surface**
   - Canonical preparation path remains `POST /v1/build`.
   - S4 expects caller-materialized `projectPath`, `buildCommand`, optional `buildEnvironment`, and optional nested `provenance`.
   - `POST /v1/build` now returns structured `buildEvidence`, `readiness`, and `failureDetail`.

2. **Explicit build readiness contract**
   - Treat build preparation as ready for the next step only when all are true:
     - `success=true`
     - `readiness.status="ready"`
     - `readiness.compileCommandsReady=true`
     - `readiness.quickEligible=true`
     - `buildEvidence.compileCommandsPath` exists
     - `buildEvidence.userEntries > 0`
     - `buildEvidence.exitCode == 0`
   - If `compile_commands.json` exists but has no user-target entries, S4 now fails with `failureDetail.category="compile-commands-no-user-entries"`.
   - `readiness.status="partial"` means some user compile entries exist but the build did not finish successfully; S2 should not treat that state as Quick-ready.

3. **Explicit one-shot Quick surface**
   - Canonical Quick is now documented as a separate `POST /v1/scan` call using prepared build evidence.
   - Upstream should call `/v1/scan` with `compileCommands=<buildEvidence.compileCommandsPath>` only after `/v1/build` reports the ready state above.
   - S4 does **not** model Quick as an automatic Quick→Deep chain and does not assume Deep follows.

4. **Authoritative Quick outputs for S2 normalization**
   - `findings`
   - `stats`
   - `execution`
   - `provenance`
   - `codeGraph` / `sca` remain optional projectPath-mode adjunct outputs, not the canonical readiness signal.

## Docs refreshed
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`
- `wiki/canon/roadmap/s4-roadmap.md`
- `wiki/canon/handoff/s4/build-snapshot-consumer-seam.md`

## Verification
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q tests/test_build_contract.py tests/test_build_runner.py tests/test_scan_endpoint.py -k 'build or health'` → 32 passed
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q` → 379 passed

## Boundary reminder
S4 changed only its owned service/docs surface. This reply does not prescribe S2 orchestration details beyond the S4 contract above.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
