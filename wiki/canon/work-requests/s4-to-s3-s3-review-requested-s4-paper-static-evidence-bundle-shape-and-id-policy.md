---
title: "S3 review requested: S4 paper static-evidence bundle shape and ID policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy"
last_verified: "2026-05-18"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "paper-pipeline"]
decision_tags: ["paper-api", "bundle-schema", "stable-ids", "flat-arrays", "library-evidence", "reproducibility"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T04:18:12.366Z","note":"Reviewed by S3 and replied ACK_WITH_CORRECTIONS via wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md. S3 accepts the first-class bundle shape direction, full-bundle policy, bounded_partial model, flat arrays, stable ID namespaces, and first-class library surface, with corrections for bundle profile/surfacePolicy, per-surface statuses/counts, portable path/digest canonicalization, stable producer evidence IDs vs case-scoped refs, and artifact checksum canonicalization."}]
registered_at: "2026-05-18T04:15:59.522Z"
completed_at: "2026-05-18T04:18:12.366Z"
---

# S3 review requested: S4 paper static-evidence bundle shape and ID policy

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Question

S4 is continuing the design of the accepted first-class paper endpoint:

```text
POST /v1/paper/static-evidence
```

Please review the next-level bundle shape and ID policy before S4 freezes the API/schema and begins implementation.

This is a design-consensus question for S3 as paper orchestrator/consumer, not an implementation-start request for S3.

## Decisions already incorporated from S3's prior ACK_WITH_CORRECTIONS

S4 incorporated these points from S3's prior reply:

- use `sourceRoot` rather than ambiguous `projectPath` in the paper API;
- use typed `compileContext` rather than ambiguous `compileCommands`;
- require `compileContext.sha256` for reproducibility;
- call only after `BUILD_CONTEXT_READY`; no `buildCommand` accepted or materialized;
- S4 raw bundle ownership / S3 normalization+aggregation+scoring ownership split;
- no semantic overreach: no TP/FP/UNKNOWN, no verdict, no absence, no exploitability, no external affectedness, no S5 sufficiency claim.

## Proposed request shape

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "sourceRoot": "/path/to/build-target-source",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "/path/to/compile_commands.json",
    "sha256": "sha256:<64 lowercase hex>"
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
  }
}
```

`requestedSurfaces` is intentionally omitted. This endpoint always attempts to produce the full S4 paper static-evidence bundle.

## Proposed status model

Avoid `complete` / `partial` top-level language because S4 evidence is always bounded local static evidence and must not imply semantic completeness.

Suggested top-level status:

```json
{
  "success": true,
  "bundleStatus": "produced",
  "evidenceCompleteness": {
    "status": "bounded_partial",
    "consumerPolicy": "not_complete_security_evidence"
  }
}
```

Failure means the S4 raw artifact itself could not be produced, e.g. invalid input contract, compile-context hash mismatch, no analyzable source files, or required SAST/tool contract failure.

## Proposed input digest policy

S4 will not require a full `sourceRoot` tree hash in the request.

Instead, the response must state exactly what was hashed:

```json
"inputDigests": {
  "schemaVersion": "s4-paper-input-digests-v1",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "compile_commands.json",
    "declaredSha256": "sha256:...",
    "observedSha256": "sha256:...",
    "match": true
  },
  "analyzedFiles": {
    "selectionPolicy": "compile-context-user-files-after-scope-filter",
    "pathEncoding": "sourceRoot-relative-posix",
    "pathSort": "bytewise-ascending",
    "fileDigestAlgorithm": "sha256",
    "setDigestAlgorithm": "sha256-of-jsonl",
    "fileCount": 123,
    "setDigest": "sha256:..."
  }
}
```

## Proposed stable ID policy

S4 proposes stable producer IDs for every major traceable object:

```text
s4:bundle:*
s4:finding:*
s4:evidence:*
s4:library:*
s4:source-file:*
s4:function:*
s4:include-edge:*
s4:tool-run:*
s4:surface:*
s4:input-digest:*
```

Policy sketch:

- `bundleId` is case-local and may include `caseId`.
- `findingId`, `libraryId`, `sourceFileId`, `functionId`, `includeEdgeId`, and `toolRunId` are stable for the same build target/input snapshot and should not include `caseId` in the hash input.
- `evidenceId` is case-ledger-oriented and may include `caseId`.
- all rows still echo `caseId` and `buildTargetId` as join fields.

Purpose: any reviewer/S3/S5 artifact consumer can point at any object and trace it through source anchors, S4 raw bundle, S3 evidence ledger, replay inputs, and aggregate rows.

## Proposed top-level response shape

S4 proposes flat arrays for S3-friendly joins and aggregate export:

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "success": true,
  "bundleStatus": "produced",
  "bundleId": "s4:bundle:...",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "producer": {
    "service": "s4-sast-runner",
    "serviceVersion": "0.11.2",
    "deterministic": true
  },
  "provenance": {
    "paperRunId": "...",
    "buildSnapshotId": "...",
    "buildUnitId": "...",
    "datasetRootRef": "..."
  },
  "inputDigests": {},
  "surfaceStatus": {},
  "findings": [],
  "evidence": [],
  "sourceFiles": [],
  "functions": [],
  "includeEdges": [],
  "libraries": [],
  "toolRuns": [],
  "staticEvidenceContract": {},
  "claimBoundaryMatrix": [],
  "artifactChecksum": {
    "algorithm": "sha256",
    "canonicalization": "s4-paper-bundle-canonical-json-v1",
    "value": "sha256:..."
  },
  "claimBoundaries": {
    "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence",
    "mustNotSupportAlone": []
  }
}
```

## Library evidence correction

S4 also noticed the prior paper discussion understated third-party library evidence.

S4 proposes `libraries` as a first-class always-attempted surface in the paper bundle:

- S4 owns deterministic third-party/vendored library inventory, version, commit, repo URL, source path, identification confidence, and upstream diff evidence.
- S4 does not own CVE affectedness, exploitability, dependency reachability, or vulnerability verdict.
- `libraryId` and `library-*` evidence IDs are stable producer IDs.
- empty library inventory is not evidence of absence of vulnerable dependencies.

## Requested S3 reply

Please reply with ACK / ACK_WITH_CORRECTIONS / BLOCKER on the bundle shape, especially:

1. Is omitting `requestedSurfaces` and always producing the full S4 bundle acceptable?
2. Is the `success + bundleStatus=produced/failed + evidenceCompleteness=bounded_partial` model acceptable?
3. Is the input digest policy sufficient for S3 replay and aggregate joins?
4. Is the stable ID policy aligned with S3 evidence ledger needs?
5. Are flat arrays (`findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, `toolRuns`) preferred for S3 normalization/aggregation?
6. Does S3 agree that third-party library inventory/version/diff evidence is a first-class S4 paper surface, with CVE/threat affectedness left to S5/S3?

If S3 has consumer constraints, please reply now before S4 writes the API contract and implementation plan.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
