---
title: "AEGIS Paper Analysis Pipeline Design Draft"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md"
  - "wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md"
  - "wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "analysis-agent", "sast-runner", "knowledge-base", "paper-pipeline"]
decision_tags: ["paper-api", "paper-state-machine", "build-target-case", "static-evidence-producer", "code-kb", "evidence-ledger", "s4-consensus", "draft"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md", "wiki/canon/work-requests/s4-to-s3-s4-reply-ack_with_corrections-on-paper-static-evidence-producer-contract-after-i.md", "wiki/canon/work-requests/s3-to-s4-s3-reply-ack-on-s4-final-paper-static-evidence-producer-contract-after-consensus.md", "wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md"]
---

# AEGIS Paper Analysis Pipeline Design Draft

> Status: draft, S3/S4 consensus incorporated, S5 consensus pending, Critic PASS_WITH_CHANGES incorporated.
> Owner for draft: S3 / paper harness.
> Last verified: 2026-05-18.

## 1. Purpose

This page defines the draft paper-oriented analysis pipeline contract for AEGIS. It is intentionally separate from the production/S2-driven task flow.

The immediate goal is to freeze enough S3/S4 design to let S3 draft a new paper API and state machine. S5-facing details remain provisional until S5 completes its own consensus review.

The paper pipeline is about methodology and experiment artifacts, not production service resilience. Operational failures may still be logged, but broad graceful-degradation design is out of scope for this draft.

## 2. Paper-facing roles

Internal lane names are engineering shorthand only. The paper should use role names.

| Internal lane | Paper-facing role | Responsibility |
|---|---|---|
| S3 | Analysis Orchestrator / Evidence-Guided Triage Agent | Owns analysis case, state machine, evidence ledger, triage, normalized artifacts, aggregate exports, scoring, and paper export. |
| S4 | Static Evidence Producer | Produces raw deterministic static/source/build evidence for an admitted build target. |
| S5 | Contextual Knowledge Provider / Code KB Provider | Prepares target-scoped Code KB / Source Code KG and provides contextual retrieval/threat evidence. Details pending S5 consensus. |

## 3. Core units

### 3.1 Build target

A **build target** is a reproducible compilation-context unit: a source/configuration/build boundary for which AEGIS can obtain `compile_commands.json` or an equivalent compile context.

A build target is **not** necessarily the smallest program unit. It may contain many translation units, source files, functions, libraries, SAST findings, and claim candidates.

Examples:
- one executable;
- one `.so` / `.a` library;
- one service/app inside a monorepo;
- one source tree under a specific build configuration/toolchain.

### 3.2 Analysis case

One **analysis case** is one build-target-scoped S3/S4/S5 run.

Definition:

> One analysis case is one build target analysis run in which AEGIS acquires deterministic static/source/build evidence, obtains contextual Code KB / Threat KB evidence, triages the findings inside the build target, and exports a target-level audit/evidence envelope.

Unit distinction:

| Concept | Unit |
|---|---|
| Case unit | build target |
| Triage/scoring unit | individual SAST finding or claim candidate inside that build target |
| Evidence unit | evidence ref / acquisition envelope / retrieval trace |
| Run summary unit | target-level analysis envelope aggregating findings, triage outcomes, evidence coverage, abstentions, and diagnostics |

## 4. Admission principle

Paper experiments should admit only build targets that are already reproducible compilation-context units.

Admission should happen before the S3/S4/S5 analysis state machine. A target that fails admission is not an evaluated analysis case.

Admission criteria, owned by S3/paper harness:
- source path exists;
- build target identity is known;
- compile context exists or can be generated;
- compile DB paths resolve;
- referenced source files exist;
- target is in the intended C/C++ scope;
- S4/S5 can deterministically consume the target under the paper contract.

Distinctions:

| Type | Meaning | Paper handling |
|---|---|---|
| Admission failure | target is not a valid paper case | excluded from evaluated cases; recorded in admission report |
| Operational anomaly | service/infrastructure issue after admission | reported separately, not a triage UNKNOWN |
| Triage UNKNOWN | finding-level evidence/claim-boundary outcome | counted as analysis result |

## 5. State machine draft

The main state machine assumes admitted build targets.

```text
ADMITTED_BUILD_TARGET
CASE_REGISTERED
BUILD_CONTEXT_READY
SETUP_RUNNING
  ├─ S4_STATIC_EVIDENCE_READY
  └─ S5_CODE_KB_READY
S5_FINDING_CONTEXT_READY
S3_TRIAGE_COMPLETED
PAPER_EXPORT_READY
```

### Stage meanings

| Stage | Owner | Meaning |
|---|---|---|
| `ADMITTED_BUILD_TARGET` | S3/paper harness | Dataset/admission gate accepted the build target as a valid analysis case. |
| `CASE_REGISTERED` | S3 | S3 created the analysis case and assigned/accepted case identity. |
| `BUILD_CONTEXT_READY` | S3/paper harness | Compile context is known and ready to pass to evidence producers. |
| `SETUP_RUNNING` | S3 | S3 starts independent S4 and S5 setup branches. |
| `S4_STATIC_EVIDENCE_READY` | S4 → S3 | S4 produced the raw paper static-evidence bundle. |
| `S5_CODE_KB_READY` | S5 → S3 | S5 formed/validated target-scoped Code KB / Source Code KG retrieval substrate. S5 details pending consensus. |
| `S5_FINDING_CONTEXT_READY` | S5 → S3 | After S4 findings exist, S3 asks S5 for finding-level contextual evidence. S5 details pending consensus. |
| `S3_TRIAGE_COMPLETED` | S3 | S3 produced finding-level TP/FP/UNKNOWN records and claim/evidence refs. |
| `PAPER_EXPORT_READY` | S3/paper harness | Case-local and aggregate artifacts are ready for paper evaluation. |

## 6. S4/S5 independence rule

S4 and S5 do not directly call each other in the paper pipeline.

S3 starts both setup branches and mediates any S4-derived context later sent to S5.

```text
S3 starts analysis case
  ├─ S4 setup branch: build-target static evidence acquisition
  └─ S5 setup branch: build-target Code KB / Source Code KG preparation

S4 finding context, if needed by S5:
  S4 -> S3 -> S5 -> S3
```

Rationale:
- S3 remains the case/state-machine owner;
- evidence flow stays auditable;
- hidden S4/S5 coupling is avoided;
- S3 evidence ledger records all producer handoffs.

## 7. S4 static evidence producer consensus

S3 and S4 reached consensus on the S4-facing draft. S4's role is finalized enough to draft API contract text.

### 7.1 Endpoint direction

S4 should expose a first-class paper producer endpoint:

```text
POST /v1/paper/static-evidence
```

It is:
- a paper-grade wrapper over existing deterministic S4 surfaces;
- not a new analysis engine;
- not `/v1/scan` overload;
- not a build execution endpoint;
- called only after admitted target / `BUILD_CONTEXT_READY` assumptions.

The endpoint must not accept or materialize `buildCommand`.

### 7.2 Request identity

S4 paper API uses S3/paper-harness-owned opaque refs, not checksums or fingerprints.

Required admitted-input refs:
- `caseId`;
- `buildTargetId`;
- `compileContext.ref` / `provenance.compileContextRef`;
- `provenance.buildSnapshotId`;
- `provenance.buildUnitId`;
- `provenance.sourceRootRef` or equivalent source-root ref.

Refs are opaque identifiers. If S3 internally generates them deterministically, that method is outside the S4 paper API contract.

Ref consistency rule:
- `compileContext.ref` and `provenance.compileContextRef` refer to the same opaque handle and must match exactly when both are supplied.
- `sourceRoot` is an execution-local path; `provenance.sourceRootRef` is the paper traceability handle. They are different value classes and must not be compared as equivalent strings.
- Mismatches in duplicated refs are S4 input-consumption / producer diagnostics, not dataset admission evidence and not security evidence.

### 7.3 S4 producer/run refs

Every S4 response should include explicit producer refs:

```json
{
  "s4RequestId": "s4-paper-static-evidence-request-001",
  "s4ProducerRunId": "s4-paper-static-evidence-run-001",
  "bundleRef": "s4-bundle:case-001:target-001"
}
```

### 7.4 Producer component provenance

Every S4 response should include non-integrity producer provenance:

```json
{
  "producer": {
    "service": "s4-sast-runner",
    "serviceVersion": "0.11.2",
    "deterministic": true
  }
}
```

`serviceVersion` is component provenance only. It is not bit-for-bit reproducibility evidence, artifact integrity evidence, or a cross-run equality proof.

### 7.5 Fixed full-bundle profile

S4 v1 does not expose `requestedSurfaces`. It always attempts the full S4 paper bundle.

```json
{
  "schemaVersion": "s4-paper-static-evidence-bundle-v1",
  "bundleProfile": "s4-paper-static-evidence-full-v1",
  "surfacePolicy": "always_attempt_full_bundle"
}
```

Per-surface status vocabulary:

```text
produced | empty | not_available | error
```

### 7.6 Status model

S4 should avoid top-level `complete` / `partial` wording because S4 evidence is bounded local static evidence.

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

### 7.7 No checksum/hash/digest/fingerprint semantics

S4 paper API and raw bundle should not expose:

- `compileContext.sha256`;
- `compileContext.digest`;
- `inputDigests`;
- `inputFingerprints`;
- `analyzedFiles.setDigest`;
- `artifactChecksum` / `artifactDigest`;
- hash-based build replay or reproducibility claims.

Any future packaging/integrity concern belongs outside S4 paper evidence semantics and is S3/paper-harness owned if ever needed.

### 7.8 Raw arrays and singleton surfaces

S4 returns flat arrays for normalization, joins, aggregate exports, and JSONL conversion:

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

S4 also exposes explicit singleton/top-level surfaces for contract and metadata context:

```json
{
  "targetMetadata": {},
  "staticEvidenceContract": {},
  "claimBoundaryMatrix": [],
  "claimBoundaries": {}
}
```

`targetMetadata` contains bounded local target/build metadata observed or consumed by S4, such as language, compile context type/path/ref, source-root ref, scope summary, and compile database profile facts. It is not admission proof, reproducibility proof, integrity evidence, or final security evidence.

Every top-level S4 bundle surface must be covered by `surfaceStatus` or explicitly defined as a sub-surface of a status-tracked parent. For v1, `targetMetadata`, `staticEvidenceContract`, `claimBoundaryMatrix`, and `claimBoundaries` are independently status-tracked.

Relationship rows should use explicit IDs/refs such as `from*Id` / `to*Id`, not nested-only structures.

### 7.9 Full row-local trace block

Every major row in every flat S4 array should include a row-local `trace` block so that a copied row remains self-describing and traceable.

Example:

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

The purpose of IDs is traceability, not proving cross-run equality.

### 7.10 Opaque S4 producer IDs

S4 emits opaque producer object references for major objects:

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

The generation method is S4-internal. The paper-facing contract is that IDs are usable references inside the S4 bundle and S3 evidence ledger.

### 7.11 First-class library evidence

S4 includes third-party/vendored library inventory, version, and diff evidence as a first-class always-attempted surface.

S4 owns deterministic local evidence for:
- `libraryId`;
- name/version candidates;
- identification method and confidence;
- source/vendored path;
- repository URL or upstream hints where deterministically available;
- commit/tag/version labels when deterministically observed;
- diff availability and local upstream-diff evidence;
- producer evidence refs and provenance.

These are library provenance labels, not checksum/hash/digest/fingerprint or artifact-integrity claims.

S4 does not own:
- CVE affectedness;
- exploitability;
- dependency reachability as vulnerability conclusion;
- final vulnerability verdict;
- `empty libraries[] = no vulnerable dependencies`.

### 7.12 S4 local validation boundary

S4 may validate local consumability:
- `sourceRoot` exists/readable;
- `compileContext.path` exists/readable;
- compile context type supported;
- compile DB parses;
- referenced/analyzable source files can be resolved;
- required S4 tool/evidence production invariants hold.

These validations are producer diagnostics only. They are not dataset admission proof, reproducibility proof, or security evidence.

## 8. S5 provisional design

S5 details are intentionally provisional until S5 completes consensus review.

Current S3-side assumptions:

- S5 maintains a target-independent Threat KB.
- S5 forms or validates target-scoped Code KB / Source Code KG for a build target path/context supplied by S3.
- `S5_CODE_KB_READY` means target-scoped Code KB readiness, not target-specific Threat KB construction.
- After S4 findings exist, S3 sends finding IDs, source anchors, CWE/rule IDs, library identities, symbols/functions, and query intents to S5 for finding-level enrichment.
- S5 returns contextual knowledge/retrieval evidence, not final TP/FP/UNKNOWN.
- S5 no-hit does not mean safe; S5 hit does not mean vulnerable.

S5-facing API and artifact shapes are TBD.

## 9. Replay/artifact draft

The paper experiment output should have both case-local canonical artifacts and aggregate JSONL exports.

A replayable artifact bundle means documented inputs, configs, traces, producer artifacts, normalized views, and deterministic joins. It does **not** claim bit-for-bit reproducibility, hash identity, checksum integrity, or cross-run equality.

```text
paper-runs/
  {experimentId}/
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
    cases/
      {caseId}/
        case-manifest.json
        replay/
          s3-paper-request.json
          s4-requests.jsonl
          s5-target-setup-request.json       # TBD after S5 consensus
          s5-finding-context-requests.jsonl  # TBD after S5 consensus
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

S3 / paper harness owns:
- normalized artifacts;
- replay inputs;
- aggregate JSONL;
- scoring/oracle artifacts;
- schema namespace and ID/join contract;
- paper export.

S4 owns:
- raw S4 producer artifact;
- raw S4 producer schema;
- S4 provenance fragment;
- stable S4 producer IDs.

S5 ownership is provisional but expected to mirror the pattern:
- raw S5 producer artifacts;
- raw S5 producer schemas;
- S5 provenance fragments;
- stable S5 producer IDs.

## 10. Scoring and labels

Scoring is S3/paper-harness owned.

S4 and S5 do not own:
- oracle labels;
- TP/FP/UNKNOWN scoring;
- metric denominators;
- final vulnerability verdicts.

Expected S3-owned scoring artifacts:
- `oracle-labels.jsonl`;
- `finding-match-map.jsonl` or deterministic matching rules;
- `metrics-config.json`;
- `score_metrics` script;
- expected metric output artifact.

Exact scoring definitions remain outside this S3/S4 static-evidence draft and should be finalized with the paper experiment protocol.

## 11. Non-goals

This draft does not define:
- production API migration;
- S2/S1 UI integration;
- build-agent implementation details;
- service-resilience failure handling;
- S5 final API contract;
- final metric formulas;
- paper role naming finalization.

## 12. Critic review incorporation

A Critic review of this page and `wiki/canon/api/paper-analysis-api.md` returned `PASS_WITH_CHANGES` with no blocking contradiction. This draft incorporates the requested changes:

- S5 API placeholders are explicitly non-frozen until S5 consensus.
- S3 case-state/status vocabulary is defined in the API draft.
- replay/artifact wording avoids hidden bit-for-bit reproducibility, hash identity, checksum integrity, or cross-run equality claims.
- artifact layout includes schema, dataset/admission, environment, normalization, and scoring/oracle files needed for a usable draft.
- S4 pre-freeze tightening is incorporated: target metadata surface, complete top-level surface status tracking, producer version provenance, and duplicated-ref consistency rules.
- S4 library commit/tag/version evidence is qualified as provenance labels, not integrity claims.

## 13. Open issues

1. S5 consensus and S5 paper API shape are pending.
2. Final paper-facing role names must replace S3/S4/S5 before publication.
3. S3 paper API implementation scope must be planned after S5 replies.
4. Scoring/oracle definitions must be reconciled with the experiment protocol.
