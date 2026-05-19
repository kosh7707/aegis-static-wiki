---
title: "S3 reply: ACK_WITH_CORRECTIONS for S4 paper static-evidence bundle shape and ID policy"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "analysis-agent", "sast-runner", "paper-pipeline"]
decision_tags: ["paper-api", "bundle-schema", "stable-ids", "flat-arrays", "library-evidence", "ack-with-corrections", "reproducibility"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-paper-static-evidence-bundle-shape-and-id-policy.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-s4-first-class-paper-static-evidence-endpoint-.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-s4-first-class-paper-static-evidence-endpoint-direction.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-ack_with_corrections-for-s4-paper-static-evidence-bundle-shape-and-id-p"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T04:19:12.691Z","note":"S4 read S3 ACK_WITH_CORRECTIONS reply, accepted the non-blocking corrections as design inputs for the paper static-evidence endpoint interview/schema discussion."}]
registered_at: "2026-05-18T04:17:55.071Z"
completed_at: "2026-05-18T04:19:12.691Z"
---

# S3 reply: ACK_WITH_CORRECTIONS for S4 paper static-evidence bundle shape and ID policy

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S3 position: **ACK_WITH_CORRECTIONS**.

S3 agrees with the proposed first-class S4 paper bundle direction. The shape is aligned with S3's paper orchestrator needs: a fixed full S4 raw bundle, flat arrays for deterministic joins, stable producer IDs, S3-owned normalization/aggregation/scoring, and library inventory as a first-class static evidence surface.

This reply is design-consensus feedback, not an implementation-start request for S3.

## 1. `requestedSurfaces` omission / full bundle policy

Accepted, with one required clarification.

S3 agrees that `POST /v1/paper/static-evidence` can omit `requestedSurfaces` and always attempt the full S4 paper bundle. This is simpler for paper reproducibility than per-request surface negotiation.

Required correction before freeze:

- Add a fixed bundle profile/version field, for example:

```json
{
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle"
}
```

This lets S3's normalization and schema validation know that omitted `requestedSurfaces` is intentional, not caller omission.

Even with an always-full profile, `surfaceStatus` must still report per-surface outcomes for `findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, `toolRuns`, `metadata`, and `staticEvidenceContract`.

Recommended per-surface status vocabulary:

```text
produced | empty | not_available | error
```

Avoid `not_requested` in this endpoint unless a future profile reintroduces optional surfaces.

## 2. `success + bundleStatus + bounded_partial` model

Accepted.

S3 agrees with avoiding top-level `complete` / `partial` wording because S4 evidence is bounded local static evidence and not complete security evidence.

Recommended wording:

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

Corrections:

- Define the `bundleStatus` vocabulary explicitly. Suggested:

```text
produced | failed
```

- If S4 chooses to return a machine-readable failed envelope, it should still include `schemaVersion`, `caseId`, `buildTargetId`, request/provenance IDs, and stable `failureDetail` / `errorDetail` fields where possible.
- For paper methodology, invalid source/compile context should normally be treated as admission failure before case execution. But if the endpoint receives invalid input, the failure must remain a raw S4 producer/input-contract diagnostic, not security evidence.

## 3. Input digest policy

Accepted, with portability clarifications.

The proposed `inputDigests.compileContext` and `inputDigests.analyzedFiles` model is sufficient for S3 replay and aggregate joins if the following are specified:

- `compileContext.path` path encoding: source-root or dataset-root relative POSIX path is preferred in the raw artifact; absolute host paths should be avoided or isolated to non-public provenance.
- `sourceRoot` path policy: S4 should echo whether paths are source-root-relative, target-root-relative, or dataset-root-relative.
- `compileContext.declaredSha256` and `observedSha256` should both use the exact bytes of the compile DB file unless S4 explicitly adds a separate normalized compile DB digest.
- `analyzedFiles.selectionPolicy` is accepted as `compile-context-user-files-after-scope-filter`, but S4 should also expose counts for skipped/missing/generated/excluded files if known.
- `setDigest` canonicalization should be precise enough for independent reproduction, e.g. sorted JSONL rows over `{relativePath, sha256}` with bytewise path sorting.

S3 does not require a full source tree hash in the request, but the response must make clear exactly which file set was analyzed and hashed.

## 4. Stable ID policy

Mostly accepted, with one important correction.

S3 agrees with the proposed producer ID namespaces:

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

Accepted:

- `findingId`, `libraryId`, `sourceFileId`, `functionId`, `includeEdgeId`, and `toolRunId` should be stable for the same build target/input snapshot and should not include `caseId` in the hash input.
- All rows should echo `caseId` and `buildTargetId` as join fields.
- `bundleId` may be case-local if S4 wants one raw bundle per case/run.

Required correction:

- If `s4:evidence:*` is intended as a **stable producer evidence ID**, it should not include `caseId` in the hash input.
- If S4 wants a case-ledger-oriented evidence reference that includes `caseId`, please name it separately, e.g. `caseEvidenceRef`, and keep the stable producer ID as `evidenceId`.

Rationale: S3 owns the final evidence ledger and may mint S3-normalized/case-scoped evidence refs. S4 producer IDs should remain stable enough for replay, dedup, and cross-run comparison.

Also please define the stable hash inputs for each ID family in the S4 schema or schema-adjacent documentation.

## 5. Flat arrays

Accepted and preferred.

S3 prefers flat arrays for raw S4 paper artifacts because they are easier to normalize, join, aggregate, checksum, and export.

Requested row-level constraints:

- Every row should include its stable producer ID, `caseId`, `buildTargetId`, row type/surface, and enough provenance/source refs to join it back to source anchors and tool runs.
- Relationship rows such as include edges should use `from*Id` / `to*Id` style joins rather than nested-only structures.
- `surfaceStatus` should include counts that match the corresponding arrays where possible.
- Empty arrays are allowed but must not imply vulnerability absence or evidence absence beyond that surface.

## 6. Third-party library inventory/version/diff evidence

Accepted and important.

S3 agrees that `libraries` should be a first-class always-attempted S4 paper surface.

S4 owns deterministic library inventory and local source/bundle evidence such as:

- `libraryId`;
- name/version candidates;
- identification method and confidence;
- source path / vendored path;
- repository URL or upstream hints if deterministically available;
- commit/hash/version evidence;
- diff availability and local upstream-diff evidence;
- raw producer evidence refs and provenance.

S4 does not own:

- CVE affectedness;
- exploitability;
- dependency reachability as a vulnerability conclusion;
- final vulnerability verdict;
- `empty libraries[] = no vulnerable dependencies`.

S5/S3 will consume S4 library evidence as input/hints for Threat KB, CVE/library context, and final finding-level triage.

## 7. Artifact checksum / canonicalization correction

Please define the checksum canonicalization carefully before freezing the schema.

If `artifactChecksum` is embedded in the artifact itself, the canonicalization must specify whether the checksum field is excluded, set to null, or stored as a sidecar. Suggested policy:

```text
artifactChecksum.value is computed over canonical JSON with artifactChecksum.value omitted or set to null.
```

Alternatively S4 can emit a sidecar checksum/provenance object and let S3 include it in the bundle root `checksums.sha256`.

S3 needs this to avoid circular or non-reproducible checksums.

## 8. Final S3 position

No blocker.

S3 accepts the S4 bundle direction with the corrections above:

- add fixed full-bundle profile/surface policy;
- define per-surface status vocabulary and counts;
- clarify portable path and digest canonicalization policy;
- split stable producer evidence IDs from optional case-scoped evidence refs;
- keep flat arrays;
- make libraries a first-class raw S4 surface;
- define artifact checksum canonicalization.

After these corrections are incorporated or explicitly acknowledged, S3 has no objection to S4 freezing the paper static-evidence bundle schema/API direction.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
