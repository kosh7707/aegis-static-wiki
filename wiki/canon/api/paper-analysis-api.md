---
title: "AEGIS Paper Analysis API Draft"
page_type: "canonical-api"
canonical: true
source_refs:
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
  - "wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md"
  - "wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "analysis-agent", "sast-runner", "knowledge-base", "paper-pipeline"]
decision_tags: ["paper-api", "analysis-case", "static-evidence-endpoint", "state-machine", "artifact-export", "draft", "s4-consensus"]
related_pages: ["wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md"]
---

# AEGIS Paper Analysis API Draft

> Status: draft, S3/S4 consensus incorporated, S5 API pending, Critic PASS_WITH_CHANGES incorporated.
> Draft owner: S3 / paper harness.
> Last verified: 2026-05-18.

## 1. Scope

This page drafts the new paper-oriented API contract for build-target analysis cases.

It is separate from the production `/v1/tasks` flow. It exists to support reproducible paper experiments in which one admitted build target is one analysis case, and finding-level TP/FP/UNKNOWN triage happens inside that case.

S5 endpoints are provisional placeholders until S5 consensus is complete.

## 2. Versioning and prefixes

S3-facing paper API prefix:

```text
/paper/v1
```

S4 paper producer endpoint, accepted by S3/S4 consensus:

```text
POST /v1/paper/static-evidence
```

The prefix mismatch is acceptable for now because S3 owns orchestration and S4 owns its producer surface. If later desired, S3 may wrap producer calls behind `/paper/v1` without changing S4 raw producer semantics.

## 3. Shared identifiers and refs

The paper contract uses opaque refs, not checksum/hash/digest/fingerprint identities.

Required shared fields:

| Field | Owner | Meaning |
|---|---|---|
| `caseId` | S3/paper harness | Analysis case identity. One case = one build target run. |
| `buildTargetId` | S3/paper harness | Build target identity. |
| `paperRunId` | S3/paper harness | Experiment run identity. |
| `sourceRootRef` | S3/paper harness | Opaque admitted source-root reference. |
| `compileContextRef` | S3/paper harness | Opaque compile-context reference. |
| `buildSnapshotId` | S3/paper harness | Opaque build snapshot reference. |
| `buildUnitId` | S3/paper harness | Opaque build unit reference. |
| `s4RequestId` | S4 | S4 endpoint request identifier. |
| `s4ProducerRunId` | S4 | S4 evidence production run identifier. |
| `bundleRef` | S4 | S4 raw bundle artifact reference. |

Refs are traceability handles. They do not prove bit-for-bit reproducibility or cross-run equality.

## 4. S3 paper analysis-case API

### 4.1 Start/register analysis case

```http
POST /paper/v1/analysis-cases
```

Purpose: create a paper analysis case for one admitted build target and start or prepare the S3-owned state machine.

This endpoint assumes the target has passed admission or is being registered with admission evidence from the paper harness. It should not perform arbitrary build materialization.

#### Request draft

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "buildTarget": {
    "sourceRoot": "/path/to/source-or-target-root",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContext": {
      "type": "compile_commands_json",
      "path": "build/compile_commands.json",
      "ref": "compile-context:case-001:target-001"
    },
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "language": "c/cpp"
  },
  "scope": {
    "includePaths": [],
    "excludePaths": [],
    "thirdPartyPaths": []
  },
  "experiment": {
    "experimentId": "paper-main-001",
    "datasetSplit": "validation",
    "runProfile": "aegis-paper-s3-s4-s5",
    "modelProfile": "qwen-or-frontier-profile"
  },
  "provenance": {
    "datasetRootRef": "dataset-root:paper-dataset-v1"
  }
}
```

#### Response draft

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "status": "CASE_REGISTERED",
  "links": {
    "status": "/paper/v1/analysis-cases/case-001",
    "result": "/paper/v1/analysis-cases/case-001/result",
    "evidence": "/paper/v1/analysis-cases/case-001/evidence",
    "export": "/paper/v1/analysis-cases/case-001/export"
  }
}
```

### 4.2 Get case status

```http
GET /paper/v1/analysis-cases/{caseId}
```

Purpose: return target-level state-machine status.

#### Response draft

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "status": "S4_STATIC_EVIDENCE_READY",
  "stages": [
    {
      "stage": "CASE_REGISTERED",
      "status": "done"
    },
    {
      "stage": "BUILD_CONTEXT_READY",
      "status": "done"
    },
    {
      "stage": "S4_STATIC_EVIDENCE_READY",
      "status": "done",
      "artifactRef": "s4-bundle:case-001:target-001"
    },
    {
      "stage": "S5_CODE_KB_READY",
      "status": "pending"
    }
  ],
  "summary": {
    "s4FindingCount": 0,
    "triagedFindingCount": 0
  }
}
```

### 4.3 Case stage and progress vocabulary

Allowed case stages:

```text
ADMITTED_BUILD_TARGET
CASE_REGISTERED
BUILD_CONTEXT_READY
SETUP_RUNNING
S4_STATIC_EVIDENCE_READY
S5_CODE_KB_READY
S5_FINDING_CONTEXT_READY
S3_TRIAGE_COMPLETED
PAPER_EXPORT_READY
```

Allowed per-stage progress statuses:

```text
pending | running | done | diagnostic
```

Semantics:

| Progress status | Meaning |
|---|---|
| `pending` | Stage has not started. |
| `running` | Stage is currently executing or waiting for a producer response. |
| `done` | Stage completed according to the paper contract. |
| `diagnostic` | Stage produced a producer or operational diagnostic that must be reported separately. |

`diagnostic` is not a finding-level `UNKNOWN`. `UNKNOWN` is a S3 triage outcome for an individual finding when evidence is insufficient or claim boundaries prevent a responsible TP/FP decision.

### 4.4 Get case result

```http
GET /paper/v1/analysis-cases/{caseId}/result
```

Purpose: return the target-level analysis envelope after S3 triage.

#### Response draft

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "status": "S3_TRIAGE_COMPLETED",
  "resultStatus": "triage_completed",
  "analysisEnvelopeSchemaVersion": "s3-paper-analysis-envelope-v1",
  "summary": {
    "findingCount": 12,
    "triageCounts": {
      "TP": 4,
      "FP": 6,
      "UNKNOWN": 2
    }
  },
  "artifactRefs": {
    "caseManifest": "cases/case-001/case-manifest.json",
    "findings": "cases/case-001/findings.jsonl",
    "evidenceLedger": "cases/case-001/evidence-ledger.jsonl",
    "s4RawBundle": "cases/case-001/s4-static-evidence.raw.json"
  }
}
```

### 4.5 Get evidence ledger

```http
GET /paper/v1/analysis-cases/{caseId}/evidence
```

Purpose: return or point to the S3-normalized evidence ledger.

The evidence ledger is S3-owned. It may contain references to S4 raw producer IDs and S5 knowledge evidence IDs, but S3 controls final normalized evidence refs.

### 4.6 Export case artifacts

```http
GET /paper/v1/analysis-cases/{caseId}/export
```

Purpose: return a paper export manifest for the case-local artifacts.

```json
{
  "caseId": "case-001",
  "exportSchemaVersion": "s3-paper-case-export-v1",
  "files": [
    "case-manifest.json",
    "state-trace.jsonl",
    "analysis-envelope.json",
    "findings.jsonl",
    "evidence-ledger.jsonl",
    "s4-static-evidence.raw.json",
    "s4-static-evidence.normalized.json"
  ]
}
```

## 5. S4 paper static-evidence producer API

### 5.1 Endpoint

```http
POST /v1/paper/static-evidence
```

Purpose: produce the raw S4 deterministic static/source/build evidence bundle for one admitted build target.

This endpoint is:
- S4-owned;
- paper-only / paper-first;
- a raw producer surface;
- not a build execution endpoint;
- not a final verdict endpoint;
- not checksum/hash/digest/fingerprint based.

### 5.2 Request draft

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
    "datasetRootRef": "dataset-root:paper-dataset-v1",
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

No `buildCommand` is accepted. No `requestedSurfaces` is accepted in v1.

#### Ref consistency rules

`compileContext.ref` and `provenance.compileContextRef` refer to the same opaque compile-context handle. If both are supplied, they must match exactly. A mismatch is an S4 input-consumption / producer diagnostic; it is not dataset admission evidence and not security evidence.

`sourceRoot` is an execution-local path used by S4 to read files. `provenance.sourceRootRef` is the paper traceability handle for that root. They are intentionally different kinds of value and must not be interpreted as equivalent strings.

### 5.3 Response draft

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
  "producer": {
    "service": "s4-sast-runner",
    "serviceVersion": "0.11.2",
    "deterministic": true
  },
  "provenance": {
    "paperRunId": "paper-run-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "datasetRootRef": "dataset-root:paper-dataset-v1",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001"
  },
  "surfaceStatus": {
    "findings": { "status": "empty", "count": 0 },
    "evidence": { "status": "empty", "count": 0 },
    "sourceFiles": { "status": "empty", "count": 0 },
    "functions": { "status": "empty", "count": 0 },
    "includeEdges": { "status": "empty", "count": 0 },
    "libraries": { "status": "empty", "count": 0 },
    "toolRuns": { "status": "empty", "count": 0 },
    "targetMetadata": { "status": "produced", "count": 1 },
    "staticEvidenceContract": { "status": "produced", "count": 1 },
    "claimBoundaryMatrix": { "status": "empty", "count": 0 },
    "claimBoundaries": { "status": "produced", "count": 1 }
  },
  "findings": [],
  "evidence": [],
  "sourceFiles": [],
  "functions": [],
  "includeEdges": [],
  "libraries": [],
  "toolRuns": [],
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
      "surface": "target-metadata",
      "rawObjectRef": "targetMetadata"
    },
    "language": "c/cpp",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContext": {
      "type": "compile_commands_json",
      "path": "build/compile_commands.json",
      "ref": "compile-context:case-001:target-001"
    },
    "scopeSummary": {
      "includePathCount": 0,
      "excludePathCount": 0,
      "thirdPartyPathCount": 0
    },
    "observedBuildProfile": {
      "compileDatabaseEntries": 0
    }
  },
  "staticEvidenceContract": {},
  "claimBoundaryMatrix": [],
  "claimBoundaries": {
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
}
```

### 5.4 Surface status semantics

S4 `surfaceStatus` vocabulary:

| Status | Meaning |
|---|---|
| `produced` | Surface produced one or more rows or a singleton object. |
| `empty` | Surface was attempted under the fixed full-bundle profile and produced zero rows. Empty is not negative security evidence. |
| `not_available` | Surface could not be produced in this admitted target context, but this is represented as bounded producer evidence/diagnostic. |
| `error` | Surface production hit a producer/input/tool diagnostic. The diagnostic is not security evidence. |

For zero-row arrays, prefer `empty` over `produced` to preserve the distinction between a produced non-empty surface and an attempted empty surface. Every top-level surface in the S4 bundle must either have its own `surfaceStatus` entry or be explicitly defined as a sub-surface of a status-tracked parent. In v1, `targetMetadata`, `staticEvidenceContract`, `claimBoundaryMatrix`, and `claimBoundaries` are independently status-tracked.

### 5.5 Target/build metadata and producer provenance

`targetMetadata` is a singleton S4 surface for local target/build metadata observed or consumed by S4: language, compile context type/path/ref, source-root ref, scope summary, and bounded build-profile facts such as compile database entry counts.

`targetMetadata` is producer evidence only. It is not dataset admission proof, not reproducibility proof, not integrity evidence, and not a final security signal.

`producer.serviceVersion` is component provenance only. It must not be described as bit-for-bit reproducibility, artifact integrity, or cross-run equality proof.

### 5.6 Row-local trace block


Every major row in `findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, and `toolRuns` should include a `trace` block.

```json
{
  "trace": {
    "caseId": "case-001",
    "buildTargetId": "target-001",
    "bundleRef": "s4-bundle:case-001:target-001",
    "s4RequestId": "s4-paper-static-evidence-request-001",
    "s4ProducerRunId": "s4-paper-static-evidence-run-001",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001",
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

Row fields may be null or absent when not applicable, but copied rows must remain traceable.

### 5.7 S4 object IDs

S4 object IDs are opaque producer references:

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
s4:target-metadata:*
```

The generation method is S4-internal and not a paper-facing reproducibility claim.

### 5.8 S4 non-goals

The S4 paper endpoint must not provide or imply:
- TP/FP/UNKNOWN;
- final security verdict;
- vulnerability absence;
- CWE absence;
- exploitability judgment;
- external affectedness;
- semantic GraphRAG completeness;
- S5 sufficiency/non-necessity;
- tool add/remove/upgrade recommendation for runtime triage;
- checksum/hash/digest/fingerprint proof.

## 6. S5 paper API placeholders

S5 details are pending S5 consensus. The following placeholders are not frozen.

Illustrative S5 target setup placeholder only; not frozen until S5 consensus:

```http
POST /v1/paper/code-kb
```

Illustrative S5 finding context placeholder only; not frozen until S5 consensus:

```http
POST /v1/paper/finding-context
```

S5 may replace endpoint names, sync/async behavior, request refs, artifact names, and readiness vocabulary during S5 consensus.

Expected principles:
- S5 target setup forms/validates target-scoped Code KB / Source Code KG from S3-provided source context.
- Threat KB remains target-independent.
- S5 finding context is requested by S3 after S4 findings are available.
- S5 returns contextual evidence/retrieval traces, not final TP/FP/UNKNOWN.
- S5 hit/no-hit must not mean vulnerable/safe by itself.

These endpoint names and schemas are TBD.

## 7. Case-local artifact layout

S3/paper harness should write top-level, case-local, and aggregate artifacts. This API page mirrors the broader layout from `wiki/canon/specs/paper-analysis-pipeline-design.md` so callers can discover both case exports and scoring inputs.

```text
paper-runs/{experimentId}/
  run-manifest.json
  dataset-manifest.json
  admission-report.jsonl
  environment.lock.json
  schemas/
    id-join-contract.json
    state-machine.schema.json
    scoring-input.schema.json
    s4-paper-static-evidence-bundle.schema.json
    s3-analysis-envelope.schema.json
  cases/{caseId}/
    case-manifest.json
    replay/
      s3-paper-request.json
      s4-requests.jsonl
      s5-target-setup-request.json       # TBD
      s5-finding-context-requests.jsonl  # TBD
      state-machine-config.json
      prompt-template-versions.json
    state-trace.jsonl
    analysis-envelope.json
    findings.jsonl
    evidence-ledger.jsonl
    s4-static-evidence.raw.json
    s4-static-evidence.normalized.json
    s5-code-kb.raw.json                  # TBD
    s5-code-kb.normalized.json           # TBD
    s5-finding-context.raw.jsonl         # TBD
    s5-finding-context.normalized.jsonl  # TBD
    normalization-report.jsonl
    llm-transcript.jsonl
    logs/
  aggregate/
    cases.jsonl
    findings.jsonl
    evidence.jsonl
    metrics-input.jsonl
    oracle-labels.jsonl
    finding-match-map.jsonl
    metrics-config.json
    expected-results.json
```

## 8. Error/admission notes

For the paper methodology:
- invalid target admission is handled before paper cases are evaluated;
- S4 local validation failures are producer diagnostics;
- S5 readiness failures are producer diagnostics;
- S3 UNKNOWN is a finding-level triage outcome, not a service failure.

This draft intentionally does not define production-grade retry/degradation policy.

## 10. Critic review incorporation

A Critic review of this page and `wiki/canon/specs/paper-analysis-pipeline-design.md` returned `PASS_WITH_CHANGES` with no blocking design contradiction. This draft incorporates the requested changes:

- S5 endpoint placeholders are explicitly illustrative and non-frozen.
- S3 case-stage and per-stage progress vocabularies are defined, and case result examples use `S3_TRIAGE_COMPLETED` plus a separate `resultStatus`.
- `diagnostic` is separated from finding-level `UNKNOWN`.
- S4 `surfaceStatus` semantics are defined and zero-row arrays use `empty`.
- Replay/artifact claims avoid checksum/hash/digest/fingerprint semantics and the API artifact layout is aligned with the expanded design artifact list.
- S4 pre-freeze tightening is incorporated: target metadata surface, complete surface-status coverage for singleton/top-level surfaces, non-integrity producer version provenance, duplicated-ref consistency rules, and corrected case-local artifact indentation.

## 11. Open issues

1. S5 paper endpoints and schemas are TBD.
2. S3 implementation plan is TBD.
3. Final role names for publication are TBD.
4. Scoring/oracle metric contract is TBD.
5. A follow-up Critic review should run again after S5 consensus changes are incorporated.
