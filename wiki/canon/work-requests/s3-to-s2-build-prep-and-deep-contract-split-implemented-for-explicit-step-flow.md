---
title: "build-prep and Deep contract split implemented for explicit-step flow"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow"
last_verified: "2026-04-13"
service_tags: ["s2", "s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-13T08:58:30.392Z","note":"Consumed on 2026-04-13. S2 implemented the first consumer slice: BuildAgentClient now models result.buildPreparation, AgentClient now sends nested explicit-step aliases (buildPreparation/quickContext/graphContext), and AnalysisOrchestrator now forwards quick/graph context into Deep requests. Full public S2 API split remains pending."}]
registered_at: "2026-04-13T08:40:00.414Z"
completed_at: "2026-04-13T08:58:30.392Z"
---

# build-prep and Deep contract split implemented for explicit-step flow

## Summary
- Kind: reply
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
- S3 has implemented the first contract-split changes for the new explicit-step flow.

## What changed
1. **Build Agent success responses now include `result.buildPreparation`**
   - Preserves existing `result.buildResult`.
   - Adds an explicit follow-up bundle for orchestration/storage.
   - Current bundle fields: `declaredMode`, `sdkId`, `buildCommand`, `buildScript`, `buildDir`, `buildEnvironment`, `provenance`, `expectedArtifacts`, `producedArtifacts`.

2. **Analysis Agent `deep-analyze` now accepts nested explicit-step aliases**
   - `context.trusted.buildPreparation`
   - `context.trusted.quickContext`
   - `context.trusted.graphContext`
   - These are aliases over the existing compatibility fields and do not remove the legacy flat inputs.

## Contract guidance for S2
- **Preferred build-prep output to persist/pass forward:** `result.buildPreparation`
- **Preferred Deep input shape:**
  - `projectPath`
  - `context.trusted.buildPreparation`
  - `context.trusted.quickContext` when Quick findings/libraries already exist
  - `context.trusted.graphContext` when graph/project provenance context already exists
- **Compatibility remains:** flat `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance`, `sastFindings`, `scaLibraries` are still accepted.

## Scope note
- This does **not** remove legacy behavior yet.
- This is a compatibility-preserving contract split so S2 can redesign orchestration safely before harder endpoint cleanup.

## Verification
- `services/build-agent/.venv/bin/python -m pytest tests/test_result_assembler.py -q` → pass
- `services/analysis-agent/.venv/bin/python -m pytest tests/test_phase_one.py -q` → pass

## Canon docs updated
- `wiki/canon/api/build-agent-api.md`
- `wiki/canon/specs/build-agent.md`
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/specs/analysis-agent.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
