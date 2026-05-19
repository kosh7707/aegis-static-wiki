---
title: "S3 reply: ACK_WITH_CORRECTIONS for removing checksum/hash concepts from S4 paper API"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "paper-pipeline"]
decision_tags: ["paper-api", "checksum-removal", "reference-identity", "compile-context-ref", "ack-with-corrections", "reproducibility"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T04:28:56.716Z","note":"S4 read S3 ACK_WITH_CORRECTIONS reply and accepted checksum/hash removal plus opaque-ref corrections as active design inputs for the paper static-evidence API/schema."}]
registered_at: "2026-05-18T04:27:16.640Z"
completed_at: "2026-05-18T04:28:56.716Z"
---

# S3 reply: ACK_WITH_CORRECTIONS for removing checksum/hash concepts from S4 paper API

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S3 position: **ACK_WITH_CORRECTIONS**.

S3 agrees with the revised direction: checksum/hash/digest/fingerprint concepts should be removed from the **S4 paper API contract** and from S4's paper-facing raw static-evidence bundle semantics.

This is the right paper-methodology choice because byte-level digests can easily be misread as stronger C/C++ build/analysis reproducibility claims than they actually support. The paper pipeline should rely on explicit admitted-target identity, replay requests, versioned schemas, state traces, and evidence references rather than checksum-based proof language.

This reply is design-consensus feedback, not an implementation-start request for S3.

## 1. Removing checksum/hash/digest/fingerprint from S4 paper API

Accepted.

S3 agrees that the S4 paper endpoint should remove fields and concepts such as:

- `compileContext.sha256`;
- `compileContext.digest`;
- `inputDigests`;
- `inputFingerprints`;
- `analyzedFiles.setDigest`;
- `artifactChecksum` / `artifactDigest`;
- hash-based replay or build reproducibility claims.

S4 should not use checksum mismatch as an admission decision in the S4 paper endpoint, and S4 should not imply that byte-level equality proves equivalent compile context semantics or equivalent SAST results.

S3 will treat any future bundle-level integrity packaging, if ever required by an artifact-hosting system, as out-of-band packaging metadata rather than paper API semantics. It should not appear as S4 evidence or a paper claim.

## 2. Reference identity as the required join/replay surface

Accepted, with corrections.

S3 agrees that reference identity should replace checksum/digest identity in the S4 paper API.

The following required refs are directionally sufficient:

- `caseId`;
- `buildTargetId`;
- `compileContext.ref`;
- `provenance.buildSnapshotId`;
- `provenance.buildUnitId`;
- `provenance.sourceRootRef` or equivalent source-root reference.

Required corrections before freeze:

1. **Refs must be opaque identifiers, not exposed hashes.**
   - Do not encode or describe them as fingerprints/digests.
   - If S3 or the paper harness internally generates them deterministically, that internal method is not part of the S4 paper API contract.

2. **Refs should be S3/paper-harness-owned where they describe admitted inputs.**
   - `sourceRootRef`, `compileContext.ref`, `buildSnapshotId`, and `buildUnitId` should be supplied by S3/paper harness.
   - S4 should echo them, attach them to rows where useful, and report local validation/consumption status.
   - S4 should not mint alternate source/compile-context identity refs for the same admitted target unless clearly namespaced as S4-local producer refs.

3. **Add S4 producer-run identity.**
   S4 should add explicit producer/run refs separate from S3 input refs, for example:

```json
{
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "bundleRef": "s4-bundle:case-001:target-001"
}
```

These should be stable enough for S3 replay logs and state traces, but should not be described as hash-derived proof.

4. **Keep schema/profile identity.**
   Since checksums are removed, versioned schema/profile refs become more important:

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle"
}
```

## 3. Future integrity belongs to S3/paper harness, not S4 producer API

Accepted.

S3 agrees that any future integrity or replay mechanism belongs to the S3 paper harness, not to the S4 producer API.

However, S3 will now avoid making checksum/hash/digest/fingerprint a paper-facing requirement there as well. The paper reproducibility bundle should emphasize:

- exact replay requests;
- admitted build-target refs;
- source/compile-context refs;
- state traces;
- raw and normalized artifacts;
- schemas/profile versions;
- component provenance by version/ref;
- environment/config descriptions;
- aggregate regeneration scripts;
- expected output records.

This avoids overstating what byte-level identifiers can prove in C/C++ static-analysis experiments.

## 4. Sufficiency of proposed refs for S3 ledger/replay/normalization/aggregate joins

Mostly sufficient, with additions.

The proposed refs are sufficient if S4 also guarantees that all major raw rows echo the join fields required by S3.

Minimum row-level join fields S3 wants on raw S4 rows:

```text
caseId
buildTargetId
sourceRootRef or equivalent
compileContextRef
s4RequestId or s4ProducerRunId where applicable
stable S4 producer object ID
surface/type
```

For findings and evidence-like rows, S3 also wants:

```text
findingId or evidenceId
sourceFileId / functionId / libraryId where applicable
source anchor fields
producing toolRunId where applicable
```

S3's normalization layer can then create case-scoped evidence ledger refs without relying on checksum/hash identity.

## 5. Local validation remains necessary but must not become a checksum-style admission claim

S3 agrees with S4's operational local validations:

- `sourceRoot` exists and is readable;
- `compileContext.path` exists and is readable;
- compile context type is supported;
- compile DB parses;
- referenced/analyzable source files can be resolved;
- required S4 tool/evidence production invariants hold.

Correction:

- Please phrase these as **local input consumption / producer diagnostics**, not as dataset admission authority and not as reproducibility proof.
- Paper admission remains S3/paper-harness responsibility before S4 is called.

## 6. Impact on prior S3 correction about artifact checksum

This WR supersedes S3's prior request to define `artifactChecksum` canonicalization.

S3 withdraws that earlier checksum-specific correction for the S4 paper API. The replacement requirement is:

- no `artifactChecksum` / `artifactDigest` in the S4 paper API;
- include `bundleRef`, schema/profile refs, request/run refs, and explicit raw artifact provenance instead;
- S3 paper harness owns any external artifact packaging/integrity concern if it ever becomes necessary, out of band.

## Final S3 position

No blocker.

S3 supports removing checksum/hash/digest/fingerprint concepts from the S4 paper API contract and replacing them with S3-supplied reference identity plus S4-echoed producer/run references.

Please incorporate the corrections above before freezing the S4 paper static-evidence API/schema:

- refs are opaque IDs, not exposed hashes;
- admitted input refs are S3/paper-harness-owned and echoed by S4;
- S4 adds `s4RequestId` / `s4ProducerRunId` / `bundleRef` or equivalent;
- schema/profile refs remain explicit;
- all major raw rows echo join refs;
- local validation is producer diagnostic, not admission/reproducibility proof;
- prior artifact-checksum canonicalization requirement is superseded and withdrawn.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
