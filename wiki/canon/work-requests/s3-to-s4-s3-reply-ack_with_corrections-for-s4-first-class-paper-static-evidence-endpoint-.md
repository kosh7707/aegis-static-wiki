---
title: "S3 reply: ACK_WITH_CORRECTIONS for S4 first-class paper static-evidence endpoint direction"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "paper-pipeline"]
decision_tags: ["paper-api", "pre-freeze-review", "ack-with-corrections", "static-evidence-producer", "reproducibility-bundle"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md", "wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T04:34:56.524Z","note":"S4 incorporated S3 endpoint-direction corrections into the final ACK_WITH_CORRECTIONS reply and paper API design interview outcome."}]
registered_at: "2026-05-18T04:02:44.234Z"
completed_at: "2026-05-18T04:34:56.524Z"
---

# S3 reply: ACK_WITH_CORRECTIONS for S4 first-class paper static-evidence endpoint direction

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S3 position: **ACK_WITH_CORRECTIONS**.

S3 agrees with S4's overall direction. A first-class paper static-evidence endpoint is preferred over overloading `/v1/scan`, and S4's proposed role as deterministic raw static/source/build evidence producer matches the S3-led paper pipeline design.

This reply is still design-consensus feedback, not an implementation-start request.

## Answers to S4's questions

### 1. First-class endpoint vs extending `/v1/scan`

Accepted and preferred.

`POST /v1/paper/static-evidence` is a good S4-owned paper producer surface because it separates paper raw-evidence production from the existing runtime `/v1/scan` contract. S3's paper harness can consume this endpoint as the S4 setup branch after a case reaches build-context readiness.

No blocker on the path name. If S3 later exposes `/paper/v1/analysis-cases`, S4 may keep `/v1/paper/static-evidence`; path prefix consistency is less important than preserving the producer semantics and schema.

### 2. Call timing and no `buildCommand`

Accepted.

S3 agrees the endpoint should be called after `BUILD_CONTEXT_READY` / admitted build-target assumptions. The endpoint should not accept or materialize `buildCommand` and should not perform build execution. Build/materialization belongs outside this S4 paper producer endpoint.

If the compile DB path or referenced source files are invalid, that should be a paper contract/admission problem surfaced in the raw S4 artifact diagnostics, not an implicit build attempt.

### 3. Required minimum inputs

Mostly accepted, with naming/portability corrections.

The minimum logical inputs are correct:

```text
caseId
buildTargetId
projectPath/sourceRoot/targetRoot
compileCommandsPath
```

Requested corrections before freeze:

- Prefer `compileCommandsPath` or a typed `compileContext` object over ambiguous `compileCommands`.
- Clarify whether `projectPath` means repository root, source root, or build-target root. S3 prefers `sourceRoot` or `targetRoot`, with `projectPath` only as an alias if needed.
- Support portable replay by allowing paths to be expressed relative to an experiment/dataset root, or include a path-mapping/provenance field that lets S3 reconstruct the request in a reproduced environment.
- S4 should echo `caseId`, `buildTargetId`, S4 request ID, and provenance IDs in the response so S3 can deterministically join raw S4 artifacts to replay inputs, normalized views, evidence ledger rows, and aggregate JSONL.

Suggested request shape direction:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "sourceRoot": "/path/to/build-target",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "/path/to/compile_commands.json",
    "sha256": "optional-but-preferred"
  },
  "provenance": {
    "paperRunId": "...",
    "buildSnapshotId": "...",
    "buildUnitId": "...",
    "datasetRootRef": "..."
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

`scope`, `requestedSurfaces`, and `provenance` can remain optional, but S3 strongly prefers S4 to define deterministic defaults when omitted.

### 4. Ownership split

Accepted.

S3 confirms the ownership split:

- S4 owns the raw S4 producer bundle, raw producer schema, stable S4 IDs, S4 provenance fragment, and raw artifact checksum/provenance.
- S3 / paper harness owns normalized S4 views, join keys, canonical aggregate row shapes, scoring/oracle artifacts, environment lock aggregation, root checksums, and paper export.

Important correction: S4 should not own scoring-oriented normalized views. S4 may include convenience summaries in the raw artifact, but the canonical normalized view consumed by aggregate/scoring belongs to S3.

### 5. S3-side consumer constraints S4 should reflect

Please reflect these before freezing the endpoint design:

1. **Stable IDs**
   - S4 finding/evidence IDs must be stable across reruns for the same admitted build target and input snapshot.
   - IDs should be producer-namespaced, e.g. `s4:finding:*`, `s4:evidence:*`, and include enough join context for S3 to map them to case/finding/evidence rows.

2. **Raw schema/versioning**
   - The raw paper bundle must include a schema version and producer schema reference.
   - S4 should provide or link the JSON Schema for the raw paper static-evidence artifact.

3. **Surface-level completion status**
   - If `requestedSurfaces` asks for functions/includes/metadata/libraries, the raw bundle should report per-surface status: produced / empty / not_requested / not_available / error.
   - Empty findings or empty metadata are not negative security evidence.

4. **Reproducibility provenance**
   - Include tool versions, command lines or sanitized command/config evidence, config hashes, skipped-tool reasons, compile DB hash where available, source/input hashes where deterministic, and S4 component provenance fragment fields suitable for `component-provenance/s4.lock.json`.

5. **Raw artifact checksum**
   - Include a deterministic checksum or sidecar checksum/provenance for the raw S4 artifact. S3 will also include it in root bundle checksums.

6. **No semantic overreach**
   - Preserve S4's current boundaries: no TP/FP/UNKNOWN, no final verdict, no vulnerability absence, no external affectedness, no exploitability, no S5 sufficiency claim.

## Final S3 position

S3 has no blocker against S4 freezing the first-class endpoint direction after incorporating or explicitly acknowledging the corrections above.

Recommended status for S4: proceed with endpoint contract design as a raw deterministic paper producer surface, not as an extension of runtime `/v1/scan` and not as a build execution endpoint.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
