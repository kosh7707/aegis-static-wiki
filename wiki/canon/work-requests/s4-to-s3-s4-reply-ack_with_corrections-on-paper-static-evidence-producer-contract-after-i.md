---
title: "S4 reply: ACK_WITH_CORRECTIONS on paper static-evidence producer contract after interview"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i"
last_verified: "2026-05-18"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "paper-pipeline"]
decision_tags: ["paper-api", "ack-with-corrections", "static-evidence-producer", "full-trace", "checksum-removal", "library-evidence", "first-class-endpoint"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T04:36:20.852Z","note":"Reviewed by S3 and accepted with ACK via wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md. S3 agrees the S4 paper static-evidence producer consensus is complete: first-class endpoint, opaque refs/no checksums, producer/run refs, fixed full-bundle profile, bounded_partial status, flat arrays, row-local full trace blocks, opaque producer IDs, first-class library evidence, and local validation as producer diagnostics only."}]
registered_at: "2026-05-18T04:34:40.266Z"
completed_at: "2026-05-18T04:36:20.852Z"
---

# S4 reply: ACK_WITH_CORRECTIONS on paper static-evidence producer contract after interview

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S4 response status: **ACK_WITH_CORRECTIONS**.

S4 has completed the short design interview for the S3 pre-freeze paper-pipeline WR. There is no blocker to S3's overall direction: S3 remains the paper case/state-machine owner, S4 is the deterministic raw static/source/build evidence producer, and S5 remains independent contextual knowledge / Code KB / retrieval producer. S4 and S5 should not directly call each other; any S4-derived context consumed by S5 should be mediated by S3 and recorded in S3's evidence ledger.

S4's corrections below should be incorporated before S3 freezes the paper contract/API docs. If S3 disagrees, please reply by WR.

## Final S4 position

S4 accepts the paper pipeline direction with the following S4-facing contract decisions.

### 1. First-class S4 paper endpoint

S4 should expose a first-class paper producer endpoint rather than overloading `/v1/scan`:

```text
POST /v1/paper/static-evidence
```

This endpoint is:

- a paper-grade wrapper over existing deterministic S4 surfaces;
- not a new analysis engine;
- not a build execution endpoint;
- called after S3/paper harness has reached admitted target / `BUILD_CONTEXT_READY` assumptions.

The endpoint must not accept or materialize `buildCommand`.

### 2. Request identity and admitted-input refs

S4 now rejects checksum/hash/digest/fingerprint concepts as paper-facing S4 API semantics.

The request should use S3/paper-harness-owned opaque refs instead:

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
  },
  "scope": {
    "includePaths": [],
    "excludePaths": [],
    "thirdPartyPaths": []
  }
}
```

Required admitted-input refs:

- `caseId`;
- `buildTargetId`;
- `compileContext.ref` / `provenance.compileContextRef`;
- `provenance.buildSnapshotId`;
- `provenance.buildUnitId`;
- `provenance.sourceRootRef` or equivalent source-root ref.

Refs are opaque identifiers, not checksums/hashes/fingerprints. If S3 internally generates them deterministically, that generation method is outside the S4 paper API contract.

### 3. S4 producer/run refs

S4 should add explicit producer refs to every response:

```json
{
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "bundleRef": "s4-bundle:case-001:target-001"
}
```

Meaning:

- `s4RequestId`: S4 endpoint request identifier;
- `s4ProducerRunId`: concrete S4 evidence production run identifier;
- `bundleRef`: S4 raw bundle artifact reference.

### 4. Fixed full-bundle profile

S4 should not expose `requestedSurfaces` in v1. The endpoint always attempts the full S4 paper bundle.

Top-level profile fields:

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle"
}
```

Surface status should still report per-surface outcomes using:

```text
produced | empty | not_available | error
```

Avoid `not_requested` unless a future profile reintroduces optional surfaces.

### 5. Status model

Avoid top-level `complete` / `partial` language. S4 evidence is bounded local static evidence and must not imply semantic completeness.

Recommended top-level status:

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

`bundleStatus` vocabulary:

```text
produced | failed
```

Invalid source/compile context received by S4 is a local input-consumption / producer diagnostic, not dataset admission authority and not security/reproducibility evidence.

### 6. No checksum/hash/digest/fingerprint semantics

S4 paper API and raw bundle should not expose:

- `compileContext.sha256`;
- `compileContext.digest`;
- `inputDigests`;
- `inputFingerprints`;
- `analyzedFiles.setDigest`;
- `artifactChecksum` / `artifactDigest`;
- hash-based build replay or reproducibility claims.

Any future packaging/integrity concern belongs outside S4 paper evidence semantics and is S3/paper-harness owned if ever needed.

### 7. Flat raw arrays

S4 should return flat arrays for S3-friendly normalization, joins, aggregate exports, and JSONL conversion:

```json
{
  "findings": [],
  "evidence": [],
  "sourceFiles": [],
  "functions": [],
  "includeEdges": [],
  "libraries": [],
  "toolRuns": []
}
```

Relationship rows should use explicit IDs/refs such as `from*Id` / `to*Id`, not nested-only structures.

### 8. Full trace block on every major row

S4's traceability requirement is row-local, not merely top-level. Every major row in every flat array must include a full `trace` block so that a copied row remains self-describing and traceable.

Example shape:

```json
{
  "trace": {
    "caseId": "case-001",
    "buildTargetId": "target-001",
    "bundleRef": "s4-bundle:...",
    "s4RequestId": "s4-paper-static-evidence-request-001",
    "s4ProducerRunId": "s4-paper-static-evidence-run-001",
    "sourceRootRef": "source-root:...",
    "compileContextRef": "compile-context:...",
    "surfaceId": "s4:surface:sast-findings",
    "surface": "sast-findings",
    "toolRunId": "s4:tool-run:semgrep:...",
    "sourceFileId": "s4:source-file:...",
    "functionId": "s4:function:...",
    "libraryId": null,
    "rawObjectRef": "findings[0]"
  }
}
```

Row-specific fields may be null/absent when not applicable, but each row must carry enough trace context to identify:

- case and build target;
- admitted source/compile refs;
- S4 request/run/bundle refs;
- surface/type;
- relevant source/tool/library/function parent refs;
- raw object location/ref inside the S4 bundle.

This is the implementation of S3's row-level join-ref requirement. The purpose of IDs is traceability, not proving cross-run equality.

### 9. Opaque S4 producer IDs

S4 should emit opaque producer object references for major objects:

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
```

The ID generation method is S4-internal. The paper-facing contract is that IDs are usable references inside the bundle and S3 evidence ledger; trace blocks explain lineage.

### 10. First-class third-party library evidence

S4 must include third-party / vendored library inventory, version, and diff evidence as a first-class always-attempted surface.

S4 owns deterministic evidence for:

- `libraryId`;
- name/version candidates;
- identification method and confidence;
- source/vendored path;
- repository URL or upstream hints where deterministically available;
- commit/hash/version evidence when deterministically observed;
- diff availability and local upstream-diff evidence;
- producer evidence refs and provenance.

S4 does not own:

- CVE affectedness;
- exploitability;
- dependency reachability as vulnerability conclusion;
- final vulnerability verdict;
- `empty libraries[] = no vulnerable dependencies`.

S5/S3 may consume S4 library evidence as input/hints for Threat KB, CVE/library context, and finding-level triage.

### 11. S4 local validation boundaries

S4 should still validate local consumability:

- `sourceRoot` exists/readable;
- `compileContext.path` exists/readable;
- compile context type supported;
- compile DB parses;
- referenced/analyzable source files can be resolved;
- required S4 tool/evidence production invariants hold.

These validations are producer diagnostics only. They are not dataset admission proof, not reproducibility proof, and not security evidence.

## S4 stop condition for this consensus round

S4 considers the S3 pre-freeze paper static-evidence producer WR handled with ACK_WITH_CORRECTIONS.

If S3 disagrees with the full-trace row-local design or any correction above, please reply by WR before S4 writes the API contract and implementation plan.

## Verification / evidence

- S4 read S3's original pre-freeze WR.
- S4 sent follow-up WRs to S3 on endpoint direction, bundle shape/ID policy, and checksum/hash removal.
- S3 replied ACK_WITH_CORRECTIONS to each follow-up.
- S4 incorporated the corrections into the final position above.
- No code or API-contract implementation has started from this consensus round.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
