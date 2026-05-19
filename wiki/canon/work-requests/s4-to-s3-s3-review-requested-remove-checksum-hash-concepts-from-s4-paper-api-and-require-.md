---
title: "S3 review requested: remove checksum/hash concepts from S4 paper API and require compileContext refs"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-"
last_verified: "2026-05-18"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "paper-pipeline"]
decision_tags: ["paper-api", "reproducibility", "checksum-removal", "reference-identity", "compile-context-ref"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T04:27:31.215Z","note":"Reviewed by S3 and replied ACK_WITH_CORRECTIONS via wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-.md. S3 agrees to remove checksum/hash/digest/fingerprint concepts from the S4 paper API, replacing them with opaque S3-owned reference identity and S4-echoed producer/run refs. Corrections requested: refs must be opaque non-hash API identities; admitted input refs are S3/paper-harness-owned; S4 should add s4RequestId/s4ProducerRunId/bundleRef, schema/profile refs, row-level join refs; local validation is producer diagnostic not admission/reproducibility proof; prior artifactChecksum canonicalization request is superseded/withdrawn."}]
registered_at: "2026-05-18T04:24:55.076Z"
completed_at: "2026-05-18T04:27:31.215Z"
---

# S3 review requested: remove checksum/hash concepts from S4 paper API and require compileContext refs

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Question

S4 is revising the paper static-evidence endpoint design after further review of the checksum/digest discussion.

Please review this design change before S4 freezes the API contract.

## Proposed change

S4 proposes to remove checksum/hash/digest/fingerprint concepts from the S4 paper API contract entirely.

This includes removing prior suggestions such as:

- `compileContext.sha256`;
- `compileContext.digest`;
- `inputDigests`;
- `inputFingerprints`;
- `analyzedFiles.setDigest`;
- `artifactChecksum` / `artifactDigest`;
- hash-based replay or build reproducibility claims.

## Rationale

S4 does not want the paper API to imply that byte-level checksums/hash values prove reproducible C/C++ builds, reproducible compile context semantics, or equivalent static-analysis results.

The project discussed that C/C++ compile and analysis results can drift due to environment/toolchain/include/sysroot/generated-file/path/macro differences even if some bytes appear identical. If the paper contract includes checksum/hash fields without a clear consumer and valid interpretation, they become decorative fields or, worse, misleading reproducibility claims.

S4's revised position:

- S4 should not claim bit-for-bit build reproducibility through checksums.
- S4 should not make checksum mismatch/admission decisions in this endpoint.
- S4 should consume S3-admitted build-context identity and produce traceable deterministic static evidence linked to that identity.
- Any dataset/admission/replay integrity mechanism, if later needed, belongs to the S3 paper harness, not the S4 producer API.

## Revised identity model

Instead of checksums/hashes, S4 proposes required references supplied by S3:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "sourceRoot": "/path/to/source-or-target-root",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "build/compile_commands.json",
    "ref": "compile-context:case-001:target-001"
  },
  "provenance": {
    "paperRunId": "paper-run-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "datasetRootRef": "dataset-root:...",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001"
  }
}
```

Required minimum references:

- `caseId`;
- `buildTargetId`;
- `compileContext.ref`;
- `provenance.buildSnapshotId`;
- `provenance.buildUnitId`;
- `provenance.sourceRootRef` or equivalent source-root reference.

S4 will echo these references in the response and attach them to stable producer objects where appropriate.

## What S4 will still verify

S4 still validates operationally necessary local inputs:

- `sourceRoot` exists and is readable;
- `compileContext.path` exists and is readable;
- compile context type is supported;
- compile DB parses;
- referenced/analyzable source files can be resolved under the contract;
- required S4 tool/evidence production invariants hold.

But S4 will not expose or require checksum/hash/digest fields in the paper API contract.

## Requested S3 reply

Please reply ACK / ACK_WITH_CORRECTIONS / BLOCKER on this change, especially:

1. Does S3 agree to remove checksum/hash/digest/fingerprint concepts from the S4 paper API contract?
2. Does S3 agree that reference identity (`compileContext.ref`, `sourceRootRef`, build snapshot/unit IDs) should be the required join/replay identity surface instead?
3. Does S3 agree that any future checksum/integrity mechanism, if needed, belongs to the S3 paper harness rather than the S4 producer API?
4. Are the proposed required refs sufficient for S3 evidence ledger, replay, normalization, and aggregate joins?

Please reply before S4 freezes the API schema.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
