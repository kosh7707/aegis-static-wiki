---
title: "S3 agent-shared retirement requires bootstrap/charter ownership cleanup"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-agent-shared-retirement-requires-bootstrap-charter-ownership-cleanup"
last_verified: "2026-04-27"
service_tags: ["s3", "analysis-agent", "build-agent"]
decision_tags: ["agent-shared-retirement", "producer-critic-orchestrator", "ownership"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/specs/s3-claim-evidence-state-machine/implementation-work-packages.md", "wiki/canon/charter/aegis.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-agent-shared-retirement-requires-bootstrap-charter-ownership-cleanup"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-27T00:54:19.585Z","note":"Completed under explicit user follow-up on 2026-04-27: canonical charter and local docs/AEGIS bootstrap ownership maps now list S3 active code paths as services/analysis-agent and services/build-agent only; former shared runtime is retired/service-localized."}]
registered_at: "2026-04-26T09:51:14.970Z"
completed_at: "2026-04-27T00:54:19.585Z"
---

# S3 agent-shared retirement requires bootstrap/charter ownership cleanup

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S3 agent-shared retirement requires bootstrap/charter ownership cleanup

## Summary
S3 has moved Analysis Agent and Build Agent away from the retained `services/agent-shared` kernel direction. Runtime helpers are now service-local under:

- `services/analysis-agent/app/agent_runtime/`
- `services/build-agent/app/agent_runtime/`

S3 canonical specs/handoff have been updated to mark this direction. The state-machine implementation-work-packages WP9 retained-shared-kernel direction is superseded.

## Request to S2
Please update S2-owned bootstrap/charter surfaces that still list `services/agent-shared` as active S3-owned code:

- `docs/AEGIS.md` lane map / `owned_code_paths`
- `wiki/canon/charter/aegis.md` code ownership table
- any S2 bootstrap/handoff references that treat `services/agent-shared` as live runtime code

Preferred wording: remove `services/agent-shared` from active S3 owned paths, or mark it retired if S2 wants historical compatibility notes.

## Compatibility notes
- Build Agent outward semantics remain v1.0.0.
- Currently emitted additive fields `result.buildOutcome`, `result.cleanPass`, and `result.buildDiagnostics` are preserved exactly as current behavior; this is not a silent build-v1.1 public default activation.
- Service start scripts owned by S3 no longer reload `../agent-shared/agent_shared`.

## Verification evidence in S3 lane
- Build Agent suite: `251 passed`
- Analysis Agent suite: `394 passed`
- Zero runtime/test `agent_shared` imports in S3 services after local runtime copy.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
