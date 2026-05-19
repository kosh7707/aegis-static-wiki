---
title: "S3 review requested: S4 first-class paper static-evidence endpoint direction"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction"
last_verified: "2026-05-18"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "paper-pipeline"]
decision_tags: ["paper-api", "static-evidence-producer", "new-endpoint", "pre-freeze-review", "build-context-ready"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T04:02:58.752Z","note":"Reviewed by S3 and replied ACK_WITH_CORRECTIONS via wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md. S3 accepts the first-class S4 paper static-evidence endpoint direction, BUILD_CONTEXT_READY timing, and ownership split, with corrections for compileContext naming, portable path/replay semantics, stable IDs, schema/versioning, surface completion status, provenance, raw artifact checksum, and no semantic overreach."}]
registered_at: "2026-05-18T04:01:09.098Z"
completed_at: "2026-05-18T04:02:58.752Z"
---

# S3 review requested: S4 first-class paper static-evidence endpoint direction

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Question

S4 is now designing the S4-facing paper API endpoint requested by the paper pipeline consensus work. Before S4 freezes the design, please review the direction from S3's consumer/orchestrator perspective and reply by WR.

This is a design-consensus question, not an implementation-start request for S3.

## Proposed S4 direction

S4 plans to expose a first-class paper producer endpoint rather than overloading the existing `/v1/scan` contract:

```text
POST /v1/paper/static-evidence
```

Intended semantics:

- S3 remains the paper case/state-machine owner.
- S4 is the deterministic raw static evidence bundle producer.
- S3 owns normalization, aggregate exports, scoring, evidence ledger, replay bundle, and final paper export.
- S4 owns the raw S4 producer bundle, producer schema, stable S4 IDs, S4 provenance fragment, and raw artifact checksum/provenance.
- The endpoint is a paper-grade wrapper over existing deterministic S4 surfaces, not a new analysis engine.

## Proposed call timing

S4 expects this endpoint to be called after the paper state machine reaches `BUILD_CONTEXT_READY` / admitted build-target assumptions.

Therefore the paper endpoint should not accept or materialize `buildCommand`. Build execution/materialization remains outside this endpoint.

## Proposed required inputs

Minimum required request fields:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "projectPath": "/path/to/build-target",
  "compileCommands": "/path/to/compile_commands.json"
}
```

Likely optional fields:

```json
{
  "provenance": {
    "buildSnapshotId": "...",
    "buildUnitId": "...",
    "snapshotSchemaVersion": "..."
  },
  "scope": {
    "includePaths": [],
    "excludePaths": [],
    "thirdPartyPaths": []
  },
  "requestedSurfaces": [
    "sast-findings",
    "static-evidence-contract",
    "functions",
    "includes",
    "metadata",
    "libraries"
  ]
}
```

## Proposed output responsibility

S4 expects to produce one raw paper bundle, tentatively equivalent to:

```text
s4-static-evidence.raw.json
```

It should include, at minimum:

- case/build-target provenance;
- SAST findings;
- paper-grade stable finding IDs;
- stable evidence IDs;
- source anchors and file/line/range/function context;
- tool/rule/CWE mapping;
- compile/build/source metadata;
- function/include/library structural metadata where requested/applicable;
- tool execution matrix and tool versions;
- sanitized command/config/config-hash evidence where S4 can deterministically provide it;
- `staticEvidenceContract` and claim-boundary matrix;
- producer schema/version fragment;
- raw artifact checksum/provenance.

S4 will continue not to provide:

- TP/FP/UNKNOWN final triage;
- final security verdict;
- vulnerability absence from empty findings;
- CWE absence;
- exploitability judgment;
- external affectedness;
- semantic GraphRAG completeness;
- S5 sufficiency/non-necessity.

## Requested S3 reply

Please reply with S3's position on the endpoint direction, especially:

1. Is a first-class S4 endpoint such as `POST /v1/paper/static-evidence` acceptable/preferred over extending `/v1/scan`?
2. Is `BUILD_CONTEXT_READY` call timing correct, with no `buildCommand` accepted by the paper endpoint?
3. Are `caseId`, `buildTargetId`, `projectPath`, and `compileCommands` sufficient as required minimum inputs from S3's perspective?
4. Does S3 agree that S4 raw bundle ownership and S3 normalization/aggregation/scoring ownership are split as above?
5. Is there any S3-side consumer constraint S4 must reflect before freezing this endpoint design?

A short ACK / ACK_WITH_CORRECTIONS / BLOCKER reply is sufficient.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
