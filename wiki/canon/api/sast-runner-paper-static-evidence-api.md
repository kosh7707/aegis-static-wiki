---
title: "S4 Paper Static Evidence API Contract"
page_type: "canonical-api"
canonical: true
source_refs:
  - "wiki/canon/work-requests/s3-to-s4-s4-draft-detailed-paper-static-evidence-api-docs-for-s3-consumer-implementation.md"
  - "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md"
  - "wiki/canon/api/paper-analysis-api.md"
  - "wiki/canon/specs/sast-runner-static-evidence-contract.md"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "paper-pipeline", "traceaudit", "sast-runner", "static-evidence"]
decision_tags: ["paper-api", "static-evidence-endpoint", "s4-static-evidence-producer", "consumer-contract", "producer-boundary", "b2-b4-evidence-control", "critic-pass-with-changes-incorporated"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Paper Static Evidence API Contract

> Status: implementation-aligned S4 paper producer contract; S3 accepted core consumer semantics.
> Owner: S4 / SAST Runner.
> Endpoint: `POST /v1/paper/static-evidence`.
> Last verified: 2026-05-19.
> Scope: field-level S4 producer contract for TraceAudit paper experiments.

## 1. Purpose and authority

This page is the S4-owned detailed contract for producing a paper static-evidence bundle that S3 can consume without reading S4 source code.

```http
POST /v1/paper/static-evidence
```

The endpoint produces one raw deterministic static/source/build evidence bundle for one already-admitted build target. S3 stores this as `s4-static-evidence.raw.json`, validates it, normalizes it into `s4-static-evidence.normalized.json`, and imports rows into the S3 evidence ledger.

`wiki/canon/api/paper-analysis-api.md` may summarize this endpoint, but this page is authoritative for S4 request/response semantics until superseded by another S4-owned contract.

## 2. Non-goals and producer boundary

The endpoint is **not**:

- a build execution endpoint;
- a compile-context generation endpoint;
- a production `/v1/tasks` workflow;
- a TP/FP/UNKNOWN endpoint;
- a final security verdict endpoint;
- a CVE affectedness, exploitability, or dependency reachability endpoint;
- a GraphRAG, semantic retrieval, or LLM endpoint;
- a checksum/hash/digest/fingerprint or artifact-integrity proof surface.

Only S3 may emit final finding-level `TP | FP | UNKNOWN`.

Forbidden inferences:

| S4 output | Must not be consumed as |
|---|---|
| `findings=[]` | safe code, false positive, no vulnerability, CWE absence |
| `surfaceStatus.*.status="empty"` | negative security evidence |
| `surfaceStatus.*.status="not_available"` | TP/FP/UNKNOWN, safe evidence, or absence evidence |
| `surfaceStatus.*.status="error"` | TP/FP/UNKNOWN, safe evidence, or absence evidence |
| `evidenceCompleteness.status="bounded_partial"` | failed S4 stage, complete coverage, or negative evidence |
| `diagnostics[]` | final security conclusion |
| library version/commit/tag evidence | CVE affectedness, integrity proof, or reproducible-build proof |

## 3. Request schema

### 3.1 Example request

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
    "datasetRootRef": "dataset-root:build-targets-v1",
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

### 3.2 Required request fields

| Field | Type | Owner | Semantics |
|---|---|---|---|
| `caseId` | string | S3 | Analysis case identity. |
| `buildTargetId` | string | S3 | Build-target identity for the case. |
| `sourceRoot` | string | S3/S4 runtime | Execution-local path S4 reads. Not a public identity ref. |
| `compileContext.type` | string | S3 | `compile_commands_json` in v1. |
| `compileContext.path` | string | S3 | Path to compile context, absolute or relative to `sourceRoot` by deployment convention. |
| `compileContext.ref` | string | S3 | Opaque compile-context traceability ref. |
| `provenance.paperRunId` | string | S3 | Experiment run identity. |
| `provenance.buildSnapshotId` | string | S3 | Opaque build snapshot ref. |
| `provenance.buildUnitId` | string | S3 | Opaque build unit ref. |
| `provenance.sourceRootRef` | string | S3 | Opaque admitted source-root ref. |
| `provenance.compileContextRef` | string | S3 | Must equal `compileContext.ref`. |

Optional fields:

| Field | Default | Semantics |
|---|---|---|
| `provenance.datasetRootRef` | absent | Opaque dataset root ref; echoed if supplied. |
| `scope.includePaths` | `[]` | Execution-local include scope hints. |
| `scope.excludePaths` | `[]` | Execution-local exclusion hints. |
| `scope.thirdPartyPaths` | `[]` | Execution-local vendored/third-party path hints. |

`sourceRoot` and `scope.*Paths` are execution-local inputs. Paper identity and traceability use refs and row-local traces.

### 3.3 Forbidden request fields

The v1 paper endpoint always attempts the fixed full bundle profile. It must reject or fail closed on fields that try to convert it into a build, verdict, orchestration, or integrity surface.

Forbidden examples:

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

### 3.4 Request validation failures

| Rule | Reason code | Meaning |
|---|---|---|
| Unsupported `compileContext.type` | `UNSUPPORTED_COMPILE_CONTEXT_TYPE` | Input-consumption diagnostic. |
| `compileContext.ref != provenance.compileContextRef` | `COMPILE_CONTEXT_REF_MISMATCH` | Input-consumption diagnostic, not admission evidence. |
| `sourceRoot` unreadable | `SOURCE_ROOT_UNREADABLE` | Producer diagnostic or pre-bundle request failure. |
| `compileContext.path` unreadable | `COMPILE_CONTEXT_UNREADABLE` | Producer diagnostic or pre-bundle request failure. |
| Compile DB parse fails | `COMPILE_CONTEXT_PARSE_FAILED` | Producer diagnostic. |
| No analyzable C/C++ entries | `COMPILE_CONTEXT_NO_ANALYZABLE_ENTRIES` | Producer diagnostic; not no-vulnerability evidence. |
| Forbidden field present | `PAPER_STATIC_EVIDENCE_REQUEST_FORBIDDEN_FIELD` | Fail closed. |

## 4. Response envelope and HTTP behavior

S4 should return a paper bundle envelope whenever it can parse enough request identity to do so.

| HTTP / envelope | Meaning | S3 stage interpretation |
|---|---|---|
| `200`, `success=true`, `bundleStatus="produced"` | Contract-valid consumable bundle | `S4_STATIC_EVIDENCE_READY = done` |
| `200`, `success=false`, `bundleStatus="failed"` | Parsed request but non-consumable S4 bundle | `S4_STATIC_EVIDENCE_READY = diagnostic` |
| `4xx` before bundle envelope | Request cannot be parsed/validated enough to create paper bundle | Input/operational anomaly, not finding UNKNOWN |
| `5xx` or transport failure | Service/runtime anomaly | Operational anomaly, not finding UNKNOWN |

Raw exceptions, host secrets, raw stdout/stderr, and arbitrary caller strings must not be echoed.

### 4.1 Required top-level response fields

| Field | Type | Required | Semantics |
|---|---:|:---:|---|
| `schemaVersion` | string | yes | `s4-paper-static-evidence-bundle-v1`. |
| `bundleProfile` | string | yes | `s4-paper-static-evidence-full-v1`. |
| `surfacePolicy` | string | yes | `always_attempt_full_bundle`. |
| `success` | boolean | yes | True only for contract-valid consumable bundle. |
| `bundleStatus` | enum | yes | `produced | failed`. |
| `evidenceCompleteness` | object | yes | Always bounded local static evidence. |
| `caseId`, `buildTargetId` | string | yes | Echo S3 identities. |
| `s4RequestId` | string | yes | S4 endpoint invocation id. |
| `s4ProducerRunId` | string | yes | S4 evidence production run id. |
| `bundleRef` | string | yes | S4 bundle artifact ref. |
| `producer` | object | yes | S4 component provenance. |
| `provenance` | object | yes | Echoed S3/paper refs. |
| `surfaceStatus` | object | yes | Status for every array and singleton/top-level surface. |
| `diagnostics` | array | yes | Sanitized producer diagnostics; empty if none. |
| `findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, `toolRuns` | arrays | yes | Flat row surfaces; present even when empty. |
| `targetMetadata` | object | yes | Singleton target/build metadata surface. |
| `staticEvidenceContract` | object | yes | S4 static evidence readiness/claim-boundary contract. |
| `claimBoundaryMatrix` | array | yes | Top-level mirror/projection of claim boundary rows. |
| `claimBoundaries` | object | yes | Top-level mirror/projection of boundary doctrine. |

Additive fields are allowed, but S3 must not need them for v1.

### 4.2 Producer provenance

```json
{
  "producer": {
    "service": "s4-sast-runner",
    "serviceVersion": "0.11.2",
    "deterministic": true
  }
}
```

`serviceVersion` is component provenance only. It is not bit-for-bit reproducibility, artifact integrity, or cross-run equality proof.

## 5. Bundle-level vs per-surface diagnostic semantics

### 5.1 Bundle status

| Field | Values | Rule |
|---|---|---|
| `success` | `true | false` | True only if the bundle is consumable under this contract. |
| `bundleStatus` | `produced | failed` | `produced` means S3 may normalize; `failed` means diagnostic-only producer artifact. |
| `evidenceCompleteness.status` | `bounded_partial` | Expected. Never means complete security coverage or stage failure. |

`complete` and `partial` are not bundle statuses in v1.

### 5.2 Stage transition rule

```text
S4_STATIC_EVIDENCE_READY = done
  when success=true and bundleStatus=produced.
```

This remains true when:

- `evidenceCompleteness.status="bounded_partial"`;
- `findings=[]`;
- one or more array surfaces are `empty`;
- optional local surfaces are `not_available` or `error`, if the raw bundle still satisfies the paper contract and is consumable.

```text
S4_STATIC_EVIDENCE_READY = diagnostic
  when success=false, bundleStatus=failed, request/input-consumption failure,
  required producer surface failure, required current-tool invariant failure,
  malformed bundle, or non-consumable bundle.
```

A stage diagnostic is not a finding-level `UNKNOWN` by itself.

## 6. Surface status contract

Every top-level surface must have one `surfaceStatus` entry.

### 6.1 Required surface keys

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

`diagnostics[]` is a required top-level diagnostic ledger, but it is not itself a status-tracked evidence surface in v1. Individual evidence surfaces point to diagnostic rows through `diagnosticRefs[]`; S3 must not require `surfaceStatus.diagnostics`.

### 6.2 Surface status vocabulary

| Status | Applies to | Meaning | Security inference |
|---|---|---|---|
| `produced` | arrays or singletons | One or more rows or singleton object emitted. | Positive local producer evidence only. |
| `empty` | arrays | Attempted and zero rows produced. | Not negative evidence. |
| `partial` | arrays or singletons | Attempted and produced bounded/incomplete evidence because some tool or surface work was degraded. | Producer diagnostic only. |
| `failed` | arrays or singletons | Attempted and failed under this producer contract. | Producer diagnostic only. |
| `not_available` | arrays or singletons | Could not produce in this target/context. | Producer diagnostic only. |
| `skipped` | arrays or singletons | Deliberately not attempted under an explicit producer reason. | Producer diagnostic only. |
| `error` | arrays or singletons | Compatibility alias for attempted producer failure. New paper bundles should prefer `failed`. | Producer diagnostic only. |

### 6.3 Surface status object shape

```json
{
  "status": "produced",
  "count": 1,
  "consumerPolicy": "local_static_structure_only",
  "reasonCodes": [],
  "diagnosticRefs": []
}
```

Required keys: `status`, `count`, `consumerPolicy`, `reasonCodes`, `diagnosticRefs`.

Implementation-aligned rule: `diagnosticRefs` is required on every `surfaceStatus` entry. Use `diagnosticRefs: []` to explicitly state that no producer diagnostic is associated with the surface. `partial`, `failed`, `not_available`, `skipped`, and `error` require non-empty `diagnosticRefs` that resolve against top-level `diagnostics[]`.

S3 must fail closed if a required `surfaceStatus` key is missing or uses an unknown status.

## 7. Top-level mirrors vs `staticEvidenceContract`

`staticEvidenceContract` retains the existing S4 contract shape from `wiki/canon/specs/sast-runner-static-evidence-contract.md`.

The paper bundle also requires top-level `claimBoundaryMatrix` and `claimBoundaries` so S3 can consume boundary rules without knowing the nested S4 runtime contract layout.

Projection rule:

```text
staticEvidenceContract.claimBoundaryMatrix  -> top-level claimBoundaryMatrix
staticEvidenceContract.claimBoundaries      -> top-level claimBoundaries
```

If S4 emits both nested and top-level values, they must be semantically equal. S3 should treat mismatch as a non-consumable bundle or unsafe projection. If an implementation stores the values only once internally, the wire/file response must still expose the top-level mirrors required by this paper contract.

`surfaceStatus.claimBoundaryMatrix` and `surfaceStatus.claimBoundaries` track the top-level paper surfaces.

## 8. Row-local trace requirements

Every row in these arrays must include `trace`:

```text
findings[]
evidence[]
sourceFiles[]
functions[]
includeEdges[]
libraries[]
toolRuns[]
```

Singleton `targetMetadata` must also include `trace`.

Minimum trace block:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "bundleRef": "s4-bundle:case-001:target-001",
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "sourceRootRef": "source-root:case-001:target-001",
  "compileContextRef": "compile-context:case-001:target-001",
  "surfaceId": "s4:surface:sast-findings",
  "surface": "findings",
  "toolRunId": "s4:tool-run:semgrep:case-001",
  "sourceFileId": "s4:source-file:case-001:0",
  "functionId": null,
  "libraryId": null,
  "rawObjectRef": "findings[0]"
}
```

Fields may be `null` when not applicable, but a copied row must remain traceable without surrounding bundle context.

S4 object IDs are opaque refs for audit/join purposes. Their generation method is S4-internal and is not a cross-run equality claim.

## 9. Deterministic ordering for B2/B4 control

S4 does not own packet rendering, but it must emit stable row order for a fixed input environment so S3 can render B2 and B4 from the same rows/text/order.

Recommended order:

| Surface | Ordering rule |
|---|---|
| `toolRuns[]` | Current-six order: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`. |
| `sourceFiles[]` | Compile DB order after S4 normalization, with deterministic tie-break by source-root-relative path. |
| `findings[]` | Tool order, then source path, start line, rule id, message. |
| `evidence[]` | Referenced finding/source/tool order, then evidence type. |
| `functions[]` | Source file order, then start line/name. |
| `includeEdges[]` | Source file order, then include occurrence order. |
| `libraries[]` | Source path, then library name/version candidate. |
| `diagnostics[]` | Stage/surface order, then reason code. |
| `claimBoundaryMatrix[]` | Stable claim id order defined by S4 static evidence contract. |

If reviewer-visible diagnostic/status text is rendered in B4, the exact same text must be available to B2 without ledger refs/traces/claim links/navigation.

## 10. Row schemas: S3 consumer minimum

S4 may add fields, but S3 must be able to consume the minimum below.

### 10.1 `findings[]`

Required fields:

```text
findingId
toolId
ruleId
message
severity
cweCandidates[]
location.sourceFileId
location.path
location.startLine
location.endLine
functionId|null
evidenceRefs[]
diagnosticRefs[]
trace
```

Semantics:

- A finding is a local SAST warning/observation, not TP/FP/UNKNOWN.
- `cweCandidates[]` are local extraction/normalization hints, not CWE affectedness proof.

### 10.2 `evidence[]`

Required fields:

```text
evidenceId
evidenceType
producer = s4
findingId|null
sourceFileId|null
text
consumerPolicy
diagnosticRefs[]
trace
```

`text` is reviewer-visible evidence content when S3 renders it. B2 and B4 must receive the same rendered text/order.

### 10.3 `sourceFiles[]`

Required fields:

```text
sourceFileId
path
language
compileContextRef
diagnosticRefs[]
trace
```

Use source-root-relative paths where possible. Host-local paths are execution details, not paper identity.

### 10.4 `functions[]`

Required fields:

```text
functionId
sourceFileId
name
qualifiedName
location.startLine
location.endLine
diagnosticRefs[]
trace
```

Function rows are structural static evidence only.

### 10.5 `includeEdges[]`

Required fields:

```text
includeEdgeId
fromSourceFileId
includeText
toSourceFileId|null
resolved
diagnosticRefs[]
trace
```

Include edges are structural/source evidence only.

### 10.6 `libraries[]`

Required fields:

```text
libraryId
name
versionCandidates[]
identityMethod
confidence
sourcePath
repoUrl|null
diffSummary|null
consumerPolicy
diagnosticRefs[]
trace
```

Allowed library evidence includes local identity, version labels, tag labels, commit labels, repository hints, and local upstream-diff evidence where deterministically observed. These are bounded library identity/version/provenance labels only. They are not artifact-integrity proofs, reproducible-build proofs, CVE affectedness evidence, exploitability evidence, or no-vulnerable-dependency evidence.

### 10.7 `toolRuns[]`

Required fields:

```text
toolRunId
toolId
status
findingsCount
version|null
elapsedMs|null
degraded
degradeReasons[]
consumerPolicy
diagnosticRefs[]
trace
```

Current-six tool ids:

```text
semgrep
cppcheck
flawfinder
clang-tidy
scan-build
gcc-fanalyzer
```

Tool execution state is not a vulnerability verdict.

Paper endpoint `toolRuns[].status` vocabulary:

```text
success
failed
timeout
not_available
skipped
```

`failed`, `timeout`, `not_available`, and `skipped` require non-empty `diagnosticRefs`.

## 11. Singleton/top-level surfaces

### 11.1 `targetMetadata`

Required fields:

```text
trace
language
sourceRootRef
compileContext.type
compileContext.path
compileContext.ref
scopeSummary.includePathCount
scopeSummary.excludePathCount
scopeSummary.thirdPartyPathCount
observedBuildProfile.compileDatabaseEntries
observedBuildProfile.analyzableSourceFiles
```

`targetMetadata` is producer metadata only. It is not admission proof, reproducibility proof, integrity evidence, or final security signal.

### 11.2 `staticEvidenceContract`

Required minimum:

```text
schemaVersion = s4-static-evidence-contract-v1
analysisProfile
artifactKind
producer
provenance
gates
coverage
claimBoundaries
claimBoundaryMatrix
toolEvidenceMatrix
followUpHints
```

`qualityEvaluation` is `not_evaluated` unless a validation/report profile actually ran. Any consumer-facing readiness such as `localStaticEvidenceReady` is a consumer-shape/readiness verdict only; it is not vulnerability quality, TP/FP/UNKNOWN, or safe-code evidence.

### 11.3 `claimBoundaryMatrix[]`

Required claim rows include at least:

```text
local-static-artifact
reported-finding-positive-evidence
absence-of-vulnerability
cwe-absence
build-configuration-dependent-negative-claim
runtime-behavior
external-vulnerability-affectedness
semantic-graph-completeness
exploitability-judgment
final-security-verdict
```

Negative/final/out-of-scope claims remain unsupported even when `findings=[]` and all local tool runs are clean.

### 11.4 `claimBoundaries`

Required minimum:

```json
{
  "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence",
  "mustNotSupportAlone": [
    "final-security-verdict",
    "vulnerability-absence",
    "cwe-absence",
    "exploitability-judgment",
    "external-affectedness",
    "semantic-graphrag-completeness",
    "s5-sufficiency"
  ]
}
```

## 12. Diagnostic/error model

### 12.1 Diagnostic row shape

```json
{
  "diagnosticId": "s4:diagnostic:case-001:0",
  "severity": "error",
  "category": "input-consumption",
  "reasonCode": "COMPILE_CONTEXT_PARSE_FAILED",
  "surface": "targetMetadata",
  "message": "Compile context could not be parsed.",
  "consumerPolicy": "producer_diagnostic_not_security_evidence",
  "trace": {
    "caseId": "case-001",
    "buildTargetId": "target-001",
    "bundleRef": "s4-bundle:case-001:target-001",
    "s4RequestId": "s4-paper-static-evidence-request-001",
    "s4ProducerRunId": "s4-paper-static-evidence-run-001",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001",
    "surface": "targetMetadata",
    "rawObjectRef": "diagnostics[0]"
  }
}
```

Diagnostics may support S3 claim-boundary or diagnostic rationale only. They are not direct TP/FP/UNKNOWN, safe evidence, or absence evidence.

### 12.2 Diagnostic categories

```text
request-contract
input-consumption
tool-execution
producer-invariant
surface-unavailable
surface-error
operational
```

### 12.3 Representative reason codes

```text
PAPER_STATIC_EVIDENCE_REQUEST_INVALID
PAPER_STATIC_EVIDENCE_REQUEST_FORBIDDEN_FIELD
UNSUPPORTED_COMPILE_CONTEXT_TYPE
COMPILE_CONTEXT_REF_MISMATCH
SOURCE_ROOT_UNREADABLE
COMPILE_CONTEXT_UNREADABLE
COMPILE_CONTEXT_PARSE_FAILED
COMPILE_CONTEXT_NO_ANALYZABLE_ENTRIES
COMPILE_CONTEXT_SOURCE_UNRESOLVED
REQUIRED_TOOL_UNAVAILABLE
REQUIRED_TOOL_EXECUTION_INCOMPLETE
SURFACE_NOT_AVAILABLE
SURFACE_PRODUCTION_FAILED
STATIC_EVIDENCE_CONTRACT_MISSING
SURFACE_STATUS_INCOMPLETE
ROW_TRACE_MISSING
DUPLICATE_ROW_ID
PRODUCER_INTERNAL_ERROR
```

Diagnostic text must be sanitized. It must not echo raw source contents, raw stdout/stderr, secrets, arbitrary exception reprs, or unreviewed host paths.

## 13. Produced and failed bundle examples

The examples below are contract-shape examples, not complete generated fixtures. They intentionally keep row payloads compact, but all shown `count` values match the arrays/objects shown. Any real fixture used by S3/S4 tests must satisfy the stricter rules from sections 8-12 and 16, including all current-six tool rows and all required claim-boundary rows.

### 13.1 Produced compact bundle example

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle",
  "success": true,
  "bundleStatus": "produced",
  "evidenceCompleteness": {
    "status": "bounded_partial",
    "consumerPolicy": "not_complete_security_evidence"
  },
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "bundleRef": "s4-bundle:case-001:target-001",
  "producer": { "service": "s4-sast-runner", "serviceVersion": "0.11.2", "deterministic": true },
  "provenance": {
    "paperRunId": "paper-run-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001"
  },
  "surfaceStatus": {
    "findings": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "evidence": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "sourceFiles": { "status": "produced", "count": 1, "consumerPolicy": "local_static_structure_only", "reasonCodes": [] },
    "functions": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "includeEdges": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "libraries": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_no_vulnerable_dependencies", "reasonCodes": [] },
    "toolRuns": { "status": "produced", "count": 1, "consumerPolicy": "local_tool_execution_state_only", "reasonCodes": [] },
    "targetMetadata": { "status": "produced", "count": 1, "consumerPolicy": "producer_metadata_only", "reasonCodes": [] },
    "staticEvidenceContract": { "status": "produced", "count": 1, "consumerPolicy": "claim_boundary_contract", "reasonCodes": [] },
    "claimBoundaryMatrix": { "status": "produced", "count": 1, "consumerPolicy": "claim_boundary_contract", "reasonCodes": [] },
    "claimBoundaries": { "status": "produced", "count": 1, "consumerPolicy": "claim_boundary_contract", "reasonCodes": [] }
  },
  "diagnostics": [],
  "findings": [],
  "evidence": [],
  "sourceFiles": [
    {
      "sourceFileId": "s4:source-file:case-001:0",
      "path": "src/main.c",
      "language": "c",
      "compileContextRef": "compile-context:case-001:target-001",
      "trace": {
        "caseId": "case-001",
        "buildTargetId": "target-001",
        "bundleRef": "s4-bundle:case-001:target-001",
        "s4RequestId": "s4-paper-static-evidence-request-001",
        "s4ProducerRunId": "s4-paper-static-evidence-run-001",
        "sourceRootRef": "source-root:case-001:target-001",
        "compileContextRef": "compile-context:case-001:target-001",
        "surfaceId": "s4:surface:source-files",
        "surface": "sourceFiles",
        "sourceFileId": "s4:source-file:case-001:0",
        "rawObjectRef": "sourceFiles[0]"
      }
    }
  ],
  "functions": [],
  "includeEdges": [],
  "libraries": [],
  "toolRuns": [
    {
      "toolRunId": "s4:tool-run:semgrep:case-001",
      "toolId": "semgrep",
      "status": "ok",
      "findingsCount": 0,
      "version": "1.45.0",
      "elapsedMs": 123,
      "degraded": false,
      "degradeReasons": [],
      "consumerPolicy": "local_tool_execution_state_only_not_vulnerability_verdict",
      "trace": {
        "caseId": "case-001",
        "buildTargetId": "target-001",
        "bundleRef": "s4-bundle:case-001:target-001",
        "s4RequestId": "s4-paper-static-evidence-request-001",
        "s4ProducerRunId": "s4-paper-static-evidence-run-001",
        "sourceRootRef": "source-root:case-001:target-001",
        "compileContextRef": "compile-context:case-001:target-001",
        "surfaceId": "s4:surface:tool-runs",
        "surface": "toolRuns",
        "toolRunId": "s4:tool-run:semgrep:case-001",
        "rawObjectRef": "toolRuns[0]"
      }
    }
  ],
  "targetMetadata": {
    "trace": {
      "caseId": "case-001",
      "buildTargetId": "target-001",
      "bundleRef": "s4-bundle:case-001:target-001",
      "s4RequestId": "s4-paper-static-evidence-request-001",
      "s4ProducerRunId": "s4-paper-static-evidence-run-001",
      "sourceRootRef": "source-root:case-001:target-001",
      "compileContextRef": "compile-context:case-001:target-001",
      "surfaceId": "s4:surface:target-metadata",
      "surface": "targetMetadata",
      "rawObjectRef": "targetMetadata"
    },
    "language": "c/cpp",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContext": { "type": "compile_commands_json", "path": "evidence/compile_commands.json", "ref": "compile-context:case-001:target-001" },
    "scopeSummary": { "includePathCount": 0, "excludePathCount": 0, "thirdPartyPathCount": 0 },
    "observedBuildProfile": { "compileDatabaseEntries": 1, "analyzableSourceFiles": 1 }
  },
  "staticEvidenceContract": {
    "schemaVersion": "s4-static-evidence-contract-v1",
    "analysisProfile": "c-cpp-core",
    "artifactKind": "s4-static-evidence-artifact",
    "producer": { "service": "s4-sast-runner", "deterministic": true },
    "provenance": {},
    "gates": {},
    "coverage": {},
    "claimBoundaries": { "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence" },
    "claimBoundaryMatrix": [ { "claimId": "absence-of-vulnerability", "supportStatus": "unsupported" } ],
    "toolEvidenceMatrix": [],
    "followUpHints": []
  },
  "claimBoundaryMatrix": [
    {
      "claimId": "absence-of-vulnerability",
      "claimType": "negative-security-claim",
      "supportStatus": "unsupported",
      "reasonCodes": ["EMPTY_OR_MISSING_S4_EVIDENCE_IS_NOT_NEGATIVE_EVIDENCE"],
      "consumerPolicy": "do_not_use_as_negative_evidence",
      "evidenceRefs": ["claimBoundaries.negativeEvidencePolicy"],
      "summary": "S4 cannot support vulnerability absence."
    }
  ],
  "claimBoundaries": {
    "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence",
    "mustNotSupportAlone": ["final-security-verdict", "vulnerability-absence", "cwe-absence", "exploitability-judgment", "external-affectedness", "semantic-graphrag-completeness", "s5-sufficiency"]
  }
}
```

### 13.2 Failed compact bundle example

A failed bundle preserves as much safe producer evidence as possible but is not a consumable static-evidence bundle. Counts below match the emitted arrays/objects.

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle",
  "success": false,
  "bundleStatus": "failed",
  "evidenceCompleteness": { "status": "bounded_partial", "consumerPolicy": "not_complete_security_evidence" },
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "bundleRef": "s4-bundle:case-001:target-001",
  "producer": { "service": "s4-sast-runner", "serviceVersion": "0.11.2", "deterministic": true },
  "provenance": { "paperRunId": "paper-run-001", "buildSnapshotId": "build-snapshot-001", "buildUnitId": "build-unit-001", "sourceRootRef": "source-root:case-001:target-001", "compileContextRef": "compile-context:case-001:target-001" },
  "surfaceStatus": {
    "findings": { "status": "error", "count": 0, "consumerPolicy": "producer_diagnostic_not_security_evidence", "reasonCodes": ["REQUIRED_TOOL_EXECUTION_INCOMPLETE"], "diagnosticRefs": ["s4:diagnostic:case-001:0"] },
    "evidence": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "sourceFiles": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "functions": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "includeEdges": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_negative_evidence", "reasonCodes": [] },
    "libraries": { "status": "empty", "count": 0, "consumerPolicy": "empty_is_not_no_vulnerable_dependencies", "reasonCodes": [] },
    "toolRuns": { "status": "error", "count": 0, "consumerPolicy": "local_tool_execution_state_only", "reasonCodes": ["REQUIRED_TOOL_EXECUTION_INCOMPLETE"], "diagnosticRefs": ["s4:diagnostic:case-001:0"] },
    "targetMetadata": { "status": "error", "count": 0, "consumerPolicy": "producer_diagnostic_not_security_evidence", "reasonCodes": ["REQUIRED_TOOL_EXECUTION_INCOMPLETE"] },
    "staticEvidenceContract": { "status": "error", "count": 0, "consumerPolicy": "claim_boundary_contract_unavailable", "reasonCodes": ["STATIC_EVIDENCE_CONTRACT_MISSING"] },
    "claimBoundaryMatrix": { "status": "empty", "count": 0, "consumerPolicy": "claim_boundary_contract_unavailable", "reasonCodes": ["STATIC_EVIDENCE_CONTRACT_MISSING"] },
    "claimBoundaries": { "status": "produced", "count": 1, "consumerPolicy": "claim_boundary_contract", "reasonCodes": [] }
  },
  "diagnostics": [
    {
      "diagnosticId": "s4:diagnostic:case-001:0",
      "severity": "error",
      "category": "tool-execution",
      "reasonCode": "REQUIRED_TOOL_EXECUTION_INCOMPLETE",
      "surface": "toolRuns",
      "message": "A required local static analysis tool did not complete under the paper contract.",
      "consumerPolicy": "producer_diagnostic_not_security_evidence",
      "trace": { "caseId": "case-001", "buildTargetId": "target-001", "rawObjectRef": "diagnostics[0]" }
    }
  ],
  "findings": [],
  "evidence": [],
  "sourceFiles": [],
  "functions": [],
  "includeEdges": [],
  "libraries": [],
  "toolRuns": [],
  "targetMetadata": {},
  "staticEvidenceContract": {},
  "claimBoundaryMatrix": [],
  "claimBoundaries": { "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence", "mustNotSupportAlone": ["final-security-verdict", "vulnerability-absence"] }
}
```

## 14. File-backed artifact equivalent

S3 may consume a file-backed artifact instead of live HTTP if the artifact is equivalent to the live endpoint response.

Convention:

```text
cases/{caseId}/s4-static-evidence.raw.json
cases/{caseId}/s4-static-evidence.validation.json
```

`s4-static-evidence.raw.json` is the bundle. `s4-static-evidence.validation.json` is S4's first-pass validation report over that exact raw bundle.

File-backed artifacts must satisfy the same contract:

- all required top-level fields;
- all array surfaces present, even when empty;
- required singleton/top-level surfaces present;
- `surfaceStatus` covers every top-level surface;
- row-local traces on all major rows and `targetMetadata`;
- `diagnostics[]` present and sanitized;
- `diagnosticRefs` required arrays on diagnostic-capable rows and surface status entries;
- no TP/FP/UNKNOWN/verdict/safe/risk fields;
- no checksum/hash/digest/fingerprint/artifact-hash/replay-hash semantics;
- B2/B4-visible row text/order preserved.

Recommended file-backed refs:

```text
s4RequestId = s4-file-backed-request:{caseId}:{buildTargetId}
s4ProducerRunId = s4-file-backed-run:{caseId}:{buildTargetId}
bundleRef = s4-bundle:{caseId}:{buildTargetId}
```

These are traceability refs only.

Validation report minimum:

```json
{
  "schemaVersion": "s4-static-evidence-validation-v1",
  "bundleRef": "s4-bundle:case-001:target-001:request-001",
  "overallStatus": "pass",
  "contractValidation": {
    "status": "pass",
    "errors": [],
    "warnings": []
  },
  "producerSanityValidation": {
    "status": "pass",
    "errors": [],
    "warnings": []
  }
}
```

`contractValidation` covers consumer-safety/schema/trace/forbidden semantics. `producerSanityValidation` covers S4 operational honesty such as current-six tool-run presence, explicit tool statuses, and diagnostic reasons for degraded/non-success work.

## 15. S3 normalization and evidence-ledger ingestion

S3 should:

1. Store the raw response unchanged as `s4-static-evidence.raw.json`.
2. Validate bundle-level required fields before creating normalized rows.
3. Record `s4RequestId`, `s4ProducerRunId`, and `bundleRef` in state trace and evidence ledger provenance.
4. Preserve `trace.rawObjectRef` and source array name for every raw row.
5. Create S3 normalized `evidenceRef` values without changing S4 raw IDs.
6. Preserve array order for B2/B4 unless an explicit ablation changes ordering.
7. Render diagnostic/status text in B2 and B4 from the same raw text/order if it is reviewer-visible.
8. Use `claimBoundaries` and `claimBoundaryMatrix` to prevent status-to-verdict projection.

S3 must fail closed on:

- missing required top-level fields;
- missing `surfaceStatus` keys;
- unknown enum values;
- missing row-local traces;
- duplicate row IDs;
- claim-boundary mirror mismatch;
- request/provenance refs that do not match the case;
- verdict/risk/safe/TP/FP/UNKNOWN fields emitted by S4 as producer claims;
- checksum/hash/digest/fingerprint fields emitted as identity/integrity/replay proof.

Unknown additive fields should be ignored unless they resemble verdict/risk/checksum semantics.

## 16. Contract validation checks expected from S4

S4 should provide executable tests or validators before implementation is mainline-ready.

| Check | Required assertion |
|---|---|
| Request schema | Required fields accepted; forbidden fields rejected/fail closed. |
| Compile context admission | `compile_commands.json` is parsed explicitly; source files are selected from the compile DB, not an arbitrary project walk; source-root escapes fail closed. |
| Ref consistency | `compileContext.ref` and `provenance.compileContextRef` mismatch produces diagnostic/failure. |
| Produced bundle shape | Full `s4-paper-static-evidence-bundle-v1` required field set present. |
| Failed bundle shape | `success=false`, `bundleStatus=failed`, diagnostics, and safe partial surfaces validate. |
| Surface status coverage | Every array and singleton/top-level surface has `surfaceStatus` with required `diagnosticRefs`. |
| Empty semantics | `findings=[]` and array `empty` can still produce `success=true`, `bundleStatus=produced`. |
| Stage diagnostic semantics | `bounded_partial` alone never makes the bundle failed. |
| Required tool invariant | Every produced paper bundle has all current-six `toolRuns[]`; unavailable/incomplete tools require explicit producer diagnostics. |
| Row trace | Every major row and `targetMetadata` has required trace refs. |
| Diagnostic refs | Diagnostic-capable rows and surface status entries always include `diagnosticRefs`; non-empty refs resolve against top-level `diagnostics[]`. |
| Claim-boundary mirrors | Top-level `claimBoundaryMatrix`/`claimBoundaries` match the static contract projection. |
| Claim boundary | Unsupported negative/final verdict claims stay unsupported even with empty findings. |
| Diagnostics | Sanitized category/reason-code diagnostics only. |
| Forbidden verdict fields | No TP/FP/UNKNOWN/final verdict/safe/risk-score fields are emitted as S4 claims. |
| Forbidden integrity fields | No checksum/hash/digest/fingerprint/artifact-hash/replay-hash fields are emitted as identity, integrity, or reproducibility claims. |
| Duplicate IDs | Malformed or duplicate IDs fail closed. |
| Validation report split | S4 emits `contractValidation` and `producerSanityValidation` separately. |
| File-backed equivalence | Raw file artifact validates against same schema as live response and has a matching validation report. |
| B2/B4 stability | Fixture proves same row text/order feeds both packet conditions. |

Existing `staticEvidenceContract` and consumer canary tests remain relevant but are not sufficient alone. The paper endpoint also needs envelope, top-level surface, trace, file-backed, and B2/B4 order checks.

## 17. Compatibility with existing S4 APIs

`POST /v1/paper/static-evidence` is a paper producer wrapper over existing deterministic S4 evidence surfaces. S3 should not need to call older S4 surfaces directly to build the paper bundle:

```text
/v1/scan
/v1/functions
/v1/includes
/v1/metadata
/v1/libraries
```

The older surfaces remain production/compatibility APIs. The paper endpoint is the canonical S4 raw producer surface for TraceAudit experiments.

## 18. Open implementation decisions

S4 may finalize these without changing paper semantics:

- additional row fields beyond the S3 minimum;
- exact validator CLI name/location;
- exact internal mapping from existing S4 surfaces to paper rows.

Already fixed for the current implementation:

- row IDs are bundle-local stable IDs, not cross-bundle/hash/checksum identities;
- `compileContext.path` is resolved absolute or relative to `sourceRoot`;
- compile DB source entries are normalized under `sourceRoot`; source-root escapes fail closed.

Any change to producer-boundary semantics, required surfaces, row traceability, B2/B4 same-evidence control, or checksum/hash exclusion requires S3 review.
