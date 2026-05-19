---
title: "S4 paper static evidence implementation crystallization"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "conversation://current-thread"
  - "mcp://aegis-static-wiki/register_wr"
  - "mcp://aegis-static-wiki/complete_wr"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "s5", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["implementation-crystallization", "paper-static-evidence", "failure-policy", "diagnostics", "quality-gate", "tdd"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-interview-20260519.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_s4_policy-for-s4-paper-static-evidence-failure-boundary.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality.md", "wiki/canon/work-requests/s3-to-s4-s5-s3-consensus-requested-synchronous-paper-start-terminal-policy-and-paper_export_.md", "wiki/canon/work-requests/s4-to-s3-s5-s4-reply-accept_paper_export_ready_terminal-for-synchronous-paper-start-policy.md"]
---

# S4 paper static evidence implementation crystallization

## Purpose

This page crystallizes the pre-implementation interview for the S4 paper static-evidence endpoint. It is the implementation handoff for the next S4 coding loop.

The implementation objective is to make S4 a deterministic, non-LLM, paper-ready static-evidence producer that S3 can consume safely for TraceAudit experiments.

## Crystallized principle

S4 is not a verdict engine. S4 is an evidence producer.

The core implementation principle is:

> S4 must precisely and traceably report what it did and what it could not do.

Therefore:

- S4 must not convert evidence gaps into TP/FP/UNKNOWN, risk, verdict, exploitability, or negative evidence.
- S4 must not hide failed, skipped, unavailable, partial, or degraded work.
- Every S4 action or non-action must have an explainable, traceable reason.
- S3 consumes S4 evidence and diagnostics, but S4 owns first-pass validity of its own output.

## Scope decision

The new paper endpoint is the S4 canonical producer interface:

```http
POST /v1/paper/static-evidence
```

The file-backed equivalent is:

```text
{caseRoot}/s4-static-evidence.raw.json
{caseRoot}/s4-static-evidence.validation.json
```

Implementation may reuse existing S4 internals, but it must not be shaped by legacy S1/S2-facing API compatibility. Future consumers that need S4 paper evidence should adapt to this new endpoint and artifact contract.

## Live and file-backed implementation

First implementation must deliver both paths in the same loop:

1. live endpoint: `POST /v1/paper/static-evidence`;
2. file-backed raw artifact: `s4-static-evidence.raw.json`;
3. file-backed validation artifact: `s4-static-evidence.validation.json`.

The live endpoint and file-backed producer must share the same builder and validator logic. Raw output must be the same bundle shape in both paths.

## Fixture basis and anti-overfitting rule

The first smoke/fixture basis should use a real admitted target from `/home/kosh/aegis-for-paper`, not only a synthetic toy C project.

Anti-overfitting constraints:

- no target-specific path/name hardcoding;
- inputs must come through a dataset/case manifest/compile context;
- validators must check contract shape, trace, `surfaceStatus`, `toolRuns`, diagnostics, and boundary semantics, not target-specific contents;
- the real target is smoke evidence only, not the basis for special-case implementation;
- adding a second target smoke soon is preferred to prevent accidental overfitting.

## Failure policy accepted by S3

S3 accepted S4's failure-policy split.

### Bundle/request failure

Admission, request, provenance, and contract failures may reject the request or yield:

```json
{"success": false, "bundleStatus": "failed"}
```

Examples:

- missing or unreadable `sourceRoot`;
- missing/invalid compile context;
- missing mandatory provenance refs;
- forbidden request semantics;
- non-consumable bundle shape;
- missing required top-level surfaces;
- broken row-local traces;
- inconsistent claim-boundary mirrors;
- broken producer refs;
- duplicate IDs;
- forbidden verdict/risk/integrity/checksum/hash fields;
- unresolved diagnostic refs.

These are producer/system/contract failures, not security evidence.

### Produced bundle with bounded gaps

After admission, per-surface or per-tool failures do not automatically fail the whole bundle if the bundle remains contract-valid and consumable.

S4 should return:

```json
{"success": true, "bundleStatus": "produced"}
```

and represent affected gaps through:

- `surfaceStatus`;
- `toolRuns[]`;
- `diagnostics[]`;
- row-local trace/provenance where applicable.

Single current-six tool timeout/unavailability after admission should be represented as producer diagnostics, not as automatic bundle failure.

## Current-six liveness boundary

Current-six tool liveness is a separate system-stability Quality Gate.

The paper bundle may be produced with a per-tool failure row if still contract-valid, but CI/validator quality gates must fail if S4 cannot prove configured current-six tools are reachable/executable in the intended implementation environment.

Current-six tools:

- `semgrep`
- `cppcheck`
- `flawfinder`
- `clang-tidy`
- `scan-build`
- `gcc-fanalyzer`

## `diagnosticRefs` cardinality accepted by S3

S3 accepted Option A: required empty arrays.

For diagnostic-capable row/tool/surface objects:

```text
missing diagnosticRefs  => schema/contract failure
diagnosticRefs: []      => explicitly no associated producer diagnostics
diagnosticRefs: [...]   => refs must resolve against top-level diagnostics[]
```

This applies at minimum to:

- `findings[]`
- `evidence[]`
- `sourceFiles[]`
- `functions[]`
- `includeEdges[]`
- `libraries[]`
- `toolRuns[]`

It does not need to be forced onto pure envelope/provenance objects unless their schema explicitly supports diagnostics.

## ID and trace policy

S4 row IDs are bundle-local stable IDs.

Rules:

- S4 owns deterministic per-call/per-bundle ID assignment.
- IDs must be unique within a bundle.
- IDs are not hash/checksum/integrity claims.
- IDs do not carry cross-bundle identity.
- Cross-bundle equivalence/identity is S3/S5 normalization or ledger responsibility.
- Row-level auditability must come from `trace` and provenance, not from ID semantics alone.

## Validation report split

S4 must generate validation evidence for its own output. Validation is not delegated solely to S3 or CI.

Validation report shape should separate:

```json
{
  "schemaVersion": "s4-static-evidence-validation-v1",
  "bundleRef": "...",
  "overallStatus": "pass|fail",
  "contractValidation": {
    "status": "pass|fail",
    "errors": [],
    "warnings": []
  },
  "producerSanityValidation": {
    "status": "pass|fail",
    "errors": [],
    "warnings": []
  }
}
```

### Contract validation

Contract validation proves S3 consumer safety. It covers:

- required top-level fields;
- forbidden fields;
- required top-level surfaces;
- row-local trace requirements;
- duplicate IDs;
- `diagnosticRefs` presence and resolution;
- `surfaceStatus`, `toolRuns`, and `diagnostics` structural consistency;
- claim-boundary mirror consistency;
- no verdict/risk/integrity/checksum/hash semantics.

### Producer sanity validation

Producer sanity validation proves S4 operational honesty/completeness. It covers:

- all current-six tools appear in `toolRuns[]`;
- every current-six toolRun has an explicit status;
- non-success tool states have diagnostic reasons;
- all required surfaces have explicit `surfaceStatus` entries;
- non-`produced`/`empty` surface states have diagnostic reasons;
- the bundle adequately states what S4 did and could not do.

## `toolRuns[]` rule

Every produced paper bundle must include all current-six tools in `toolRuns[]`, regardless of success/failure.

Each toolRun must have explicit status, such as:

- `success`
- `failed`
- `timeout`
- `not_available`
- `skipped`

For `failed`, `timeout`, `not_available`, or `skipped`, `diagnosticRefs` must be non-empty and point to top-level `diagnostics[]` entries explaining the reason.

Missing current-six toolRun rows are producer sanity failures.

## `surfaceStatus` rule

Major S4 paper surfaces must always have `surfaceStatus` entries:

- `findings`
- `evidence`
- `sourceFiles`
- `functions`
- `includeEdges`
- `libraries`
- `targetMetadata`
- `staticEvidenceContract`
- `claimBoundaryMatrix`
- `claimBoundaries`

Each surface must have an explicit state such as:

- `produced`
- `partial`
- `empty`
- `failed`
- `not_available`
- `skipped`

`produced` and `empty` may have `diagnosticRefs: []`.

`partial`, `failed`, `not_available`, and `skipped` require diagnostic reasons.

Missing required `surfaceStatus` entries are contract validation failures.

## `empty` semantics

`empty` means a surface was successfully attempted/produced and yielded zero rows.

For example, `findings: []` with `surfaceStatus.findings.status = "empty"` is valid when tools/surfaces actually ran and produced zero findings. This is common for SAST tools and must remain a first-class normal state.

Failed, not-run, unavailable, or skipped analysis must never be disguised as `empty`.

## S3 `/paper start` terminal compatibility

S4 accepted S3's synchronous `/paper` start policy:

```text
POST /v1/paper/analysis-cases/{caseId}/start returns 200 only if S3 reaches PAPER_EXPORT_READY.
```

This is an S3-owned terminal/export boundary, not an S4 producer boundary.

S4's implementation obligation is to produce strict enough live/file-backed evidence for S3 to reach `PAPER_EXPORT_READY` under valid operational conditions.

Contract-valid S4 bundles with bounded diagnostics/gaps should still allow normal `PAPER_EXPORT_READY`. S4 admission/contract/non-consumable bundle failures may prevent normal 200 completion as system/producer failures.

## Test gates for implementation

Release readiness requires all gates below; they are independent perspectives, not a single priority ladder.

### Gate 1 — contract validator

Must include positive and negative tests for:

- required fields;
- forbidden fields;
- duplicate IDs;
- missing row-local trace;
- missing `diagnosticRefs` on diagnostic-capable rows;
- unresolved diagnostic refs;
- missing required `surfaceStatus`;
- invalid produced/failed boundary;
- forbidden verdict/risk/hash/checksum semantics.

### Gate 2 — producer sanity validator

Must include positive and negative tests for:

- all current-six `toolRuns[]` present;
- missing toolRun fails producer sanity;
- non-success tool status without diagnostic fails;
- required surfaces have explicit status;
- non-produced/non-empty surface status without diagnostic fails;
- `empty` only means successful zero-row production.

### Gate 3 — file-backed artifact

Must produce and validate:

```text
s4-static-evidence.raw.json
s4-static-evidence.validation.json
```

from a real admitted target while avoiding target-specific implementation.

### Gate 4 — live endpoint

`POST /v1/paper/static-evidence` must return the same contract-valid bundle shape and pass the same validator.

### Gate 5 — current-six liveness

Must verify configured current-six tools are reachable/executable as a separate system-stability Quality Gate.

## Implementation stop condition

The next S4 implementation loop may stop only when:

1. the live endpoint exists and returns contract-valid paper bundles;
2. the file-backed producer writes raw and validation artifacts;
3. the shared builder/validator is used by both paths;
4. contract and producer-sanity validation are implemented with negative tests;
5. current-six toolRun and liveness behavior are tested;
6. a real admitted target smoke passes without target-specific hardcoding;
7. docs/API notes are updated if implementation reveals contract drift;
8. S3 is notified by WR after implementation/verification evidence is available.
