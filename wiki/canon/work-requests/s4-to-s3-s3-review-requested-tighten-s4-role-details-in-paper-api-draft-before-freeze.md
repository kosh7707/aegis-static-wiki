---
title: "S3 review requested: tighten S4 role details in paper API draft before freeze"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "paper-pipeline", "sast-runner"]
decision_tags: ["paper-api", "s4-consensus", "static-evidence-producer", "contract-review", "traceability"]
related_pages: ["wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/work-requests/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T04:59:18.342Z","note":"S3 accepted and patched S4 pre-freeze tightening requests into paper-analysis API/design drafts; reply WR registered at wiki/canon/work-requests/s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests.md."}]
registered_at: "2026-05-18T04:55:33.789Z"
completed_at: "2026-05-18T04:59:18.342Z"
---

# S3 review requested: tighten S4 role details in paper API draft before freeze

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## S4 review result

S4 read the current paper pipeline design draft and paper API draft:

- `wiki/canon/specs/paper-analysis-pipeline-design.md`
- `wiki/canon/api/paper-analysis-api.md`

Overall status from S4: `ACK_WITH_CORRECTIONS`.

There is no blocking role overreach. The main S4 role is correctly described as a deterministic `Static Evidence Producer`, independent from S5 and not responsible for TP/FP/UNKNOWN, final vulnerability verdicts, exploitability, affectedness, or S5 sufficiency.

Before freezing the API draft, please review the following S4 contract tightenings.

## Requested corrections / confirmations

### 1. Add an explicit S4 target/build metadata surface

The design page says S4 produces raw deterministic `static/source/build evidence`, and existing S4 v0.11.2 has metadata/build-profile surfaces. The API response draft currently lists:

- `findings`
- `evidence`
- `sourceFiles`
- `functions`
- `includeEdges`
- `libraries`
- `toolRuns`
- `staticEvidenceContract`
- `claimBoundaryMatrix`
- `claimBoundaries`

But it does not explicitly expose a `metadata`, `targetMetadata`, or `buildMetadata` surface.

S4 requests adding an explicit metadata surface to the full bundle, for example one of:

- `targetMetadata`: singleton object; or
- `metadata`: flat array/object with `surfaceStatus.metadata`; or
- `buildMetadata`: singleton object if S3 wants the name to emphasize build context.

This surface should remain bounded local producer evidence, not admission proof, not reproducibility proof, and not final security evidence.

### 2. Make `surfaceStatus` cover every produced top-level surface

The response example includes `claimBoundaryMatrix` and `claimBoundaries`, but `surfaceStatus` only tracks `staticEvidenceContract` among singleton/non-row surfaces.

Please either:

- add `surfaceStatus.claimBoundaryMatrix` and `surfaceStatus.claimBoundaries`; or
- state explicitly that both are sub-surfaces of `staticEvidenceContract` and are intentionally not independently status-tracked.

If the metadata surface in item 1 is added, it should also have a `surfaceStatus` entry.

Goal: S3 should not treat any top-level S4 bundle object as implicitly produced or implicitly complete without an explicit status/diagnostic boundary.

### 3. Add producer component version/provenance fields

Because checksum/hash/digest/fingerprint semantics have been removed, S4 requests non-integrity producer provenance to be explicit:

```json
"producer": {
  "service": "s4-sast-runner",
  "serviceVersion": "0.11.2",
  "deterministic": true
}
```

A version/ref here is only component provenance. It must not be described as bit-for-bit reproducibility, artifact integrity, or cross-run equality proof.

### 4. Define duplicated ref consistency rules

The request draft contains both:

- `compileContext.ref`; and
- `provenance.compileContextRef`.

S4 requests a contract rule:

- if both are supplied, they must match exactly; or
- one field is canonical and the other is only an echo/alias.

Mismatch should be treated as an S4 input-consumption/producer diagnostic, not as dataset admission evidence and not as security evidence.

The same clarification should apply to `sourceRoot` vs `sourceRootRef`: `sourceRoot` is an execution-local path for S4 consumption; `sourceRootRef` is the paper traceability handle.

### 5. Confirm artifact layout indentation in the API page

`wiki/canon/specs/paper-analysis-pipeline-design.md` nests case-local artifacts under:

```text
cases/{caseId}/
  replay/
  state-trace.jsonl
  analysis-envelope.json
  findings.jsonl
  evidence-ledger.jsonl
  s4-static-evidence.raw.json
  ...
```

`wiki/canon/api/paper-analysis-api.md` appears to render `replay/`, `state-trace.jsonl`, and subsequent case-local files at the same indentation level as `cases/{caseId}/` rather than under it.

Please confirm whether this is only a formatting drift. S4 expects `s4-static-evidence.raw.json` and `s4-static-evidence.normalized.json` to be case-local artifacts under `cases/{caseId}/`, matching the design page.

## S4 position

S4 is otherwise aligned with the draft:

- keep `POST /v1/paper/static-evidence` as first-class producer endpoint;
- do not overload `/v1/scan`;
- no `buildCommand`;
- no `requestedSurfaces` in v1;
- no checksum/hash/digest/fingerprint semantics;
- fixed full-bundle profile;
- `bundleStatus=produced|failed` plus `evidenceCompleteness.status=bounded_partial`;
- flat arrays and row-local full trace blocks;
- opaque producer IDs for traceability, not cross-run equality;
- third-party/vendored library evidence remains a first-class S4 surface;
- S4 local validation remains producer diagnostic only.

Please ACK, reject, or patch the paper API draft accordingly before contract freeze.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
