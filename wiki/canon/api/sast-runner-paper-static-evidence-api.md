---
title: "S4 Paper Static Evidence API Contract"
page_type: "canonical-api"
canonical: true
source_refs:
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/app/scanner/paper_static_evidence.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
  - "services/sast-runner/tests/test_scan_router_logging.py"
  - "services/sast-runner/tests/test_main_startup_logging.py"
  - "wiki/canon/work-requests/s3-to-s4-s3-reply-accept-s4-paper-static-evidence-api-contract.md"
  - "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md"
  - "wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md"
last_verified: "2026-05-20"
service_tags: ["s4", "s3", "paper-pipeline", "traceaudit", "sast-runner", "static-evidence", "observability"]
decision_tags: ["paper-api", "static-evidence-endpoint", "s4-static-evidence-producer", "consumer-contract", "producer-boundary", "durable-ownership", "s4-static-evidence-freeze-gate"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s4/s4-paper-static-evidence-implementation-crystallization.md"]
---

# S4 Paper Static Evidence API Contract

Last verified: 2026-05-20
Owner: S4 / SAST Runner
Endpoint: `POST /v1/paper/static-evidence`
Current gate: `S4_STATIC_EVIDENCE_FREEZE_GATE = pass`

This is the S4-owned producer contract for TraceAudit paper experiments. S3 may summarize it in the paper API, but this page is the detailed source of truth for what S4 emits and what S4 refuses to claim.

## 1. Purpose

`POST /v1/paper/static-evidence` produces one raw deterministic static/source/build-evidence bundle for one already-admitted build target. S3 stores the raw bundle, validates/normalizes it, and imports normalized rows into its evidence ledger.

S4 does **not** build the target in this endpoint. It consumes an already-created source root plus compile context and reports:

- what local static analysis and source-structure work it attempted;
- what it produced;
- what it could not produce;
- why any surface/tool/row is partial, empty, failed, unavailable, or skipped.

## 2. Non-goals and forbidden interpretations

The paper endpoint is not a verdict engine. It is not any of the following:

- TP/FP/UNKNOWN classifier;
- final security verdict producer;
- exploitability or affectedness judge;
- CVE lookup surface;
- GraphRAG, semantic retrieval, or LLM endpoint;
- build execution endpoint;
- checksum/hash/digest/fingerprint/integrity/reproducibility proof surface;
- proof that `findings=[]` means safe code.

Forbidden consumer projections:

| S4 output | Must not be read as |
|---|---|
| `findings=[]` | no vulnerability / false positive / CWE absence |
| `surfaceStatus.*.status="empty"` | negative security evidence |
| `surfaceStatus.*.status="not_available"`, `failed`, `error`, `skipped` | finding-level UNKNOWN or verdict evidence |
| `evidenceCompleteness.status="bounded_partial"` | complete coverage or failed stage by itself |
| library version/tag/commit evidence | CVE affectedness, dependency safety, or integrity proof |
| `toolRuns[]` | vulnerability verdict |

## 3. Request schema

Minimum request:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "sourceRoot": "/paper/targets/target-001/source",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "evidence/compile_commands.json",
    "ref": "compile-context:case-001:target-001"
  },
  "provenance": {
    "paperRunId": "paper-run-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "datasetRootRef": "dataset-root:paper-v1",
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

Required identity fields: `caseId`, `buildTargetId`, `sourceRoot`, `compileContext.type`, `compileContext.path`, `compileContext.ref`, `provenance.paperRunId`, `provenance.buildSnapshotId`, `provenance.buildUnitId`, `provenance.sourceRootRef`, `provenance.compileContextRef`.

`compileContext.type` is `compile_commands_json` in v1. `provenance.compileContextRef` must match `compileContext.ref`. `sourceRoot` and scope paths are execution-local inputs; durable paper identity is carried by refs and row traces.

Forbidden request fields include, but are not limited to:

```text
buildCommand
buildEnvironment
requestedSurfaces
options.tools
sdkId
verdict
expectedLabel
oracleLabel
cveId
advisoryId
fixCommit
checksum
sha256
hash
digest
fingerprint
artifactHash
replayHash
```

Forbidden fields fail closed with `PAPER_STATIC_EVIDENCE_REQUEST_FORBIDDEN_FIELD`.

## 4. HTTP and ownership behavior

| HTTP/envelope | Meaning | S3 interpretation |
|---|---|---|
| `200`, `success=true`, `bundleStatus="produced"` | Consumable S4 paper bundle | `S4_STATIC_EVIDENCE_READY=done` |
| `200`, `success=false`, `bundleStatus="failed"` | Parsed request but non-consumable S4 producer bundle | stage diagnostic, not finding UNKNOWN |
| `202` with `Prefer: respond-async` | Durable S4 ownership accepted | S3 polls while request is queued/running and S4 remains healthy |
| pre-envelope `4xx` | request not parsable/valid enough for bundle | input/operational anomaly |
| `5xx`/transport failure | service/runtime anomaly | operational anomaly |

Async ownership uses:

```http
GET /v1/requests/{requestId}
GET /v1/requests/{requestId}/result
DELETE /v1/requests/{requestId}
```

Resubmitting the same `X-Request-Id` to the same endpoint while S4 still owns the request returns the existing ownership status rather than launching duplicate work. Reusing the same id for another endpoint is a conflict.

## 5. Top-level response contract

Required top-level fields:

```text
schemaVersion = s4-paper-static-evidence-bundle-v1
bundleProfile = s4-paper-static-evidence-full-v1
surfacePolicy = always_attempt_full_bundle
success
bundleStatus = produced | failed
evidenceCompleteness
caseId
buildTargetId
s4RequestId
s4ProducerRunId
bundleRef
producer
provenance
surfaceStatus
diagnostics[]
findings[]
evidence[]
sourceFiles[]
functions[]
includeEdges[]
libraries[]
toolRuns[]
targetMetadata
staticEvidenceContract
claimBoundaryMatrix[]
claimBoundaries
```

All arrays must be present even when empty. `diagnostics[]` must be present and sanitized. Additive fields are allowed only if they do not create verdict/risk/integrity/checksum semantics.

Producer provenance minimum:

```json
{
  "producer": {
    "service": "s4-sast-runner",
    "serviceVersion": "0.11.2",
    "deterministic": true
  }
}
```

`serviceVersion` is component provenance only, not bit-for-bit reproducibility.

## 6. Surface status contract

Required `surfaceStatus` keys:

```text
findings
evidence
sourceFiles
functions
includeEdges
libraries
toolRuns
targetMetadata
staticEvidenceContract
claimBoundaryMatrix
claimBoundaries
```

Every entry has:

```json
{
  "status": "produced",
  "count": 1,
  "consumerPolicy": "local_static_structure_only",
  "reasonCodes": [],
  "diagnosticRefs": []
}
```

Allowed statuses: `produced`, `empty`, `partial`, `failed`, `not_available`, `skipped`, `error` (compat alias; prefer `failed` for new bundles).

Rules:

- `diagnosticRefs` is required on every surface status entry.
- `diagnosticRefs: []` means no associated producer diagnostic.
- `partial`, `failed`, `not_available`, `skipped`, and `error` require non-empty refs resolving against `diagnostics[]`.
- `empty` is valid only when a surface was attempted and produced zero rows.
- A required missing surface status makes the bundle non-consumable.

## 7. Row-local trace and IDs

Every row in `findings[]`, `evidence[]`, `sourceFiles[]`, `functions[]`, `includeEdges[]`, `libraries[]`, and `toolRuns[]` must include `trace`. `targetMetadata` also includes `trace`.

Minimum trace fields:

```text
caseId
buildTargetId
bundleRef
s4RequestId
s4ProducerRunId
sourceRootRef
compileContextRef
surfaceId
surface
rawObjectRef
```

Join fields such as `toolRunId`, `sourceFileId`, `functionId`, and `libraryId` appear when applicable. IDs are bundle-local audit refs. They are not cross-bundle identity, hash, checksum, or equality claims.

## 8. Row minimums

### `findings[]`
Required: `findingId`, `toolId`, `ruleId`, `message`, `severity`, `cweCandidates[]`, `location`, `functionId|null`, `evidenceRefs[]`, `diagnosticRefs[]`, `trace`.

### `evidence[]`
Required: `evidenceId`, `evidenceType`, `producer="s4"`, `findingId|null`, `sourceFileId|null`, `text`, `consumerPolicy`, `diagnosticRefs[]`, `trace`.

### `sourceFiles[]`
Required: `sourceFileId`, `path`, `language`, `compileContextRef`, `diagnosticRefs[]`, `trace`.

### `functions[]`
Required: `functionId`, `sourceFileId`, `name`, `qualifiedName`, `location`, `diagnosticRefs[]`, `trace`.

### `includeEdges[]`
Required: `includeEdgeId`, `fromSourceFileId`, `includeText`, `toSourceFileId|null`, `resolved`, `diagnosticRefs[]`, `trace`.

### `libraries[]`
Required: `libraryId`, `name`, `versionCandidates[]`, `identityMethod`, `confidence`, `sourcePath`, `repoUrl|null`, `diffSummary|null`, `consumerPolicy`, `diagnosticRefs[]`, `trace`.

### `toolRuns[]`
Required: `toolRunId`, `toolId`, `status`, `findingsCount`, `version|null`, `elapsedMs|null`, `degraded`, `degradeReasons[]`, `consumerPolicy`, `diagnosticRefs[]`, `trace`.

Additive Semgrep effective-coverage fields may appear on tool rows: `coverage`, `coverageDegraded`, and `coverageReasons[]`. `status="success"` with `coverageDegraded=true` remains an execution success but requires a `tool-coverage` diagnostic so S3 cannot read `findingsCount=0` as clean evidence.

`toolRuns[]` must include all current-six tool ids in stable order. Non-success status requires diagnostics. Success with coverage caveats also requires diagnostics.

## 9. `staticEvidenceContract` and claim-boundary mirrors

The bundle includes the normal S4 `staticEvidenceContract` plus top-level mirrors:

```text
staticEvidenceContract.claimBoundaryMatrix -> claimBoundaryMatrix
staticEvidenceContract.claimBoundaries     -> claimBoundaries
```

The top-level mirrors must be semantically equal to the nested values. Mismatch is an unsafe projection / non-consumable condition.

Required unsupported claim rows include at least absence-of-vulnerability, CWE absence, runtime behavior, external affectedness, semantic graph completeness, exploitability judgment, and final security verdict.

## 10. File-backed equivalent

A file-backed artifact is valid only if it is contract-equivalent to the live endpoint response:

```text
cases/{caseId}/s4-static-evidence.raw.json
cases/{caseId}/s4-static-evidence.validation.json
```

Validation report minimum:

```json
{
  "schemaVersion": "s4-static-evidence-validation-v1",
  "bundleRef": "s4-bundle:case-001:target-001",
  "overallStatus": "pass",
  "contractValidation": { "status": "pass", "errors": [], "warnings": [] },
  "producerSanityValidation": { "status": "pass", "errors": [], "warnings": [] }
}
```

`contractValidation` covers schema/trace/forbidden/consumer-safety invariants. `producerSanityValidation` covers S4 honesty: current-six tool rows, explicit statuses, diagnostics for degraded work, and surface counts.

## 11. B2/B4 evidence-control rule

S4 does not own packet rendering, but it must provide stable row ordering and reviewer-visible evidence/diagnostic text so S3 can render B2 and B4 from the same rows, text, and order.

Recommended stable order: current-six tool order, then source path, line, rule id/message for findings; source-file order for structure rows; stage/surface order for diagnostics; fixed claim id order for claim boundaries.

## 12. Validation checks S4 owns

S4 freeze readiness requires positive and negative executable coverage for:

- required request fields and forbidden fields;
- compile-context parsing and source-root escape rejection;
- produced and failed bundle shapes;
- full surface-status coverage and count reconciliation;
- row-local trace required fields;
- required `diagnosticRefs` and reference resolution;
- sanitized diagnostics;
- current-six `toolRuns[]` honesty, including Semgrep effective-coverage diagnostics;
- duplicate ID failure;
- claim-boundary mirror consistency;
- no verdict/risk/safe/TP/FP/UNKNOWN fields;
- no checksum/hash/digest/fingerprint/integrity/reproducibility aliases;
- file-backed/live-equivalent validation;
- B2/B4 same evidence text/order;
- async ownership and JSONL lifecycle logging;
- no outbound HTTP/static cross-service calls from the producer.

## 13. Current evidence

Latest S4 verification supporting this contract:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py -q
# 60 passed, 1 skipped (recorded in freeze-gate session)

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1406 passed, 1 skipped in 34.39s
```

Log-analyzer proof exists for request `req-s4-log-proof-1779259710-6143`: S4 emitted canonical JSONL lifecycle logs from paper request start to terminal HTTP 200, with non-empty `s4ProducerRunId` and `bundleStatus=produced`.
