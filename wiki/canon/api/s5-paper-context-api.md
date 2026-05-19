---
title: "S5 Paper Context API Contract"
page_type: "canonical-api"
canonical: true
source_refs:
  - "wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md"
  - "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md"
  - "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md"
  - "wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md"
  - "wiki/canon/api/knowledge-base-api.md"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "paper-pipeline", "traceaudit", "source-code-kg", "code-kb", "threat-kb", "api-contract"]
decision_tags: ["paper-api", "s5-paper-context-api", "consumer-contract", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control", "idempotency", "timeout-policy", "critic-reviewed"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md"]
---

# S5 Paper Context API Contract

> Status: **draft contract for S3 review and S5 implementation**.
> Owner: S5 / Knowledge Base lane.
> Consumer: S3 / paper harness.
> Last reviewed against the TraceAudit anchor: 2026-05-19.
> Critic status: `PASS_WITH_CHANGES`; all must-fix items from the Critic review are incorporated in this page.
> Implementation status: the exact `/v1/paper/*` endpoints below are **not yet implemented**. Existing S5 internals already expose Source Code KG, acquisition, Judge/Threat Retrieval, and contract-discovery surfaces; this page defines the safer TraceAudit paper projection S3 can consume without reading S5 source.

## 1. Scope and boundary

This API makes S5 a bounded **Contextual Knowledge Provider / Code KB Provider** for AEGIS TraceAudit.

Expected HTTP surface:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

Equivalent S3 tool names:

```text
prepare_code_kb
retrieve_finding_context
retrieve_generic_threat_context
```

S5 accepts these names as the v1 paper-facing contract. S3 may call HTTP directly or wrap the same schemas as tools.

S5 owns:

- target-scoped Code KB / Source Code KG readiness;
- finding-scoped code/source context retrieval;
- generic Threat KB context retrieval;
- S5 producer run identifiers, policy versions, and diagnostics;
- leakage filtering for all S5-visible rows and B4-visible trace/provenance fields;
- stable row/text/order support needed by B2/B4 packet controls.

S5 does **not** own:

- final `TP | FP | UNKNOWN`;
- S4 evidence completeness validation;
- paper scoring, oracle labels, or packet rendering;
- proof of vulnerability absence;
- hidden CVE/fix/advisory provenance visibility for mainline packets.

Hard boundary:

```text
S5 evidence rows are contextual support, not final verdict authority.
S5 hit != vulnerable.
S5 no_hit != safe.
S5 partial/not_available/error != TP/FP evidence.
```

## 2. Current implementation mapping

The paper endpoints are new S5 surfaces. They should project existing S5 capabilities rather than expose runtime internals directly.

| Existing capability | Existing route / contract | Paper projection |
|---|---|---|
| Contract discovery | `GET /v1/contracts/source-code-kg`, `GET /v1/contracts/judge`, `GET /v1/contracts/acquisition`, `GET /v1/contracts/analyst-brief` | `GET /v1/contracts/paper-context` |
| Source Code KG ingest/context | `POST /v1/source-code-kg/ingest`, `POST /v1/source-code-kg/context` | `POST /v1/paper/code-kb/prepare`, then code rows in `retrieve_finding_context` |
| Target-context acquisition | `/v1/target-contexts/.../acquire/*` | optional internal implementation detail for Code KB / Threat KB lookup |
| Judge / Threat Retrieval | `POST /v1/judge/query`, `GET /v1/contracts/judge` | generic, non-verdict Threat KB rows in `retrieve_generic_threat_context` |

Implementation rule:

```text
Do not expose Judge verdict/status/affectedness vocabulary as paper-visible final authority.
Project it into context rows or diagnostics under this contract.
```

## 3. Common transport conventions

### 3.1 JSON and timeout

All `POST /v1/paper/*` calls are synchronous JSON calls and require:

```http
Content-Type: application/json
Accept: application/json
X-Timeout-Ms: <positive integer>
```

The contract endpoint `GET /v1/contracts/paper-context` does not require `X-Timeout-Ms`.

Timeout behavior:

- v1 is bounded and synchronous; no fire-and-forget paper work;
- durable writes must fail before starting if the remaining deadline is too small;
- if a durable write has safely committed, S5 may return the committed result rather than inventing a false timeout;
- `408` means a producer/runtime deadline failure, not a security fact.

### 3.2 Request IDs and error envelope

Each POST request body has a required `requestId`. S5's observability layer may also attach a transport request id. Recommended behavior:

```text
X-Request-Id, if supplied, should equal requestId.
If both are present and disagree, S5 should prefer the body requestId for paper artifacts and return 400 or emit a diagnostic.
```

Transport or contract failures should use S5's common error envelope where possible:

```json
{
  "success": false,
  "error": "Human-readable message",
  "errorDetail": {
    "code": "S5_PAPER_SCHEMA_INVALID",
    "message": "Human-readable message",
    "requestId": "s3-s5-request-001",
    "retryable": false
  }
}
```

Producer diagnostics inside successful responses are not transport errors and are not final triage labels.

## 4. Common schema fragments

### 4.1 Common enums

```text
SurfaceStatus = produced | no_hit | partial | not_available | error
SourceType = code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
VisibleLeakageClass = generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
VisibilityMode = generic
DiagnosticSeverity = info | warning | error
```

Mainline TraceAudit requests must use:

```json
{
  "visibilityMode": "generic",
  "forbiddenLeakageClasses": [
    "cve_id",
    "fix_commit",
    "advisory",
    "exploit_writeup",
    "patch_text"
  ]
}
```

`appendix_registered` is intentionally **not** a v1 visibility mode. If a request uses any value other than `generic`, S5 must fail closed with `422` / `S5_PAPER_VISIBILITY_MODE_UNSUPPORTED`. Any future CVE/advisory-aware appendix condition requires a new schema or explicit v2 extension with its own registration field, leakage policy, and tests.

### 4.2 Common request envelope

Every `POST /v1/paper/*` request includes or inherits:

```json
{
  "schemaVersion": "endpoint-specific-version",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-request-001",
  "idempotencyKey": "case-001:s5:operation:001",
  "visibilityMode": "generic",
  "forbiddenLeakageClasses": [
    "cve_id",
    "fix_commit",
    "advisory",
    "exploit_writeup",
    "patch_text"
  ],
  "producerInputRefs": {
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001"
  }
}
```

Required on all POST calls:

```text
schemaVersion
caseId
buildTargetId
requestId
idempotencyKey
visibilityMode
forbiddenLeakageClasses
```

`paperRunId` is required for main experiments and optional only for local contract tests.

Canonical ref location rule for typed S3 consumers:

- `producerInputRefs.sourceRootRef` and `producerInputRefs.compileContextRef` are the canonical nested locations.
- `sourceRootRef` and `compileContextRef` may appear top-level only on `prepare_code_kb` as compatibility aliases. If supplied in both places, they must match exactly; mismatch is `400` / `S5_PAPER_SCHEMA_INVALID`.
- `buildSnapshotId` and `buildUnitId` are canonical under `producerInputRefs`; top-level aliases on `prepare_code_kb` follow the same exact-match rule.

### 4.3 Common response envelope

Endpoint responses share:

```json
{
  "schemaVersion": "endpoint-specific-version",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-request-001",
  "idempotencyKey": "case-001:s5:operation:001",
  "s5ProducerRunId": "s5-producer-run-001",
  "surfaceStatus": "produced",
  "producerProvenance": {},
  "diagnostics": []
}
```

### 4.4 Producer provenance

Every response must include bounded provenance/version refs. These are traceability handles, not security proof and not bit-for-bit reproducibility proof.

```json
{
  "component": "s5-knowledge-base",
  "serviceVersion": "s5-dev-or-release-version",
  "paperContextContractVersion": "s5-paper-context-api-v1",
  "sourceCodeKgContractVersion": "source-code-kg-ingest-v1",
  "sourceCodeKgContextVersion": "source-code-kg-context-v1",
  "threatRetrievalContractVersion": "s5-threat-retrieval-evidence-v1",
  "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
  "genericThreatPolicyVersion": "s5-paper-generic-threat-policy-v1",
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "sourceKgIndexVersionRef": "s5-source-kg-index:paper-run-001",
  "threatKbCorpusVersion": "s5-threat-kb-corpus-v1",
  "threatKbIndexVersion": "s5-threat-kb-index-v1",
  "visibilityMode": "generic"
}
```

For typed S3 consumers, the standard provenance keys above are schema-stable. Use `null` plus a diagnostic when a provenance family is expected but unavailable; do not silently omit the key.

### 4.5 Diagnostic object

Diagnostics are S5 producer/context diagnostics. They may support S3 diagnostic rationale or responsible defer/UNKNOWN handling, but they are not TP/FP evidence.

```json
{
  "code": "S5_PAPER_CONTEXT_NO_HIT",
  "message": "No generic context row was found for the requested anchors.",
  "severity": "info",
  "surfaceStatus": "no_hit",
  "consumerPolicy": "diagnostic_only_not_security_evidence",
  "negativeEvidenceAllowed": false,
  "visibleLeakageClass": "generic",
  "relatedItemIds": [],
  "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
  "metadata": {}
}
```

Diagnostic messages and metadata must not echo forbidden leakage values.

Standard diagnostic codes:

```text
S5_PAPER_SCHEMA_INVALID
S5_PAPER_TIMEOUT_HEADER_MISSING_OR_INVALID
S5_PAPER_TIMEOUT
S5_PAPER_IDEMPOTENCY_CONFLICT
S5_PAPER_VISIBILITY_MODE_UNSUPPORTED
S5_PAPER_FORBIDDEN_LEAKAGE_CLASSES_REQUIRED
S5_PAPER_CODE_KB_NOT_READY
S5_PAPER_SOURCE_KG_NOT_AVAILABLE
S5_PAPER_CONTEXT_NO_HIT
S5_PAPER_CONTEXT_PARTIAL
S5_PAPER_THREAT_KB_NOT_AVAILABLE
S5_PAPER_FORBIDDEN_LEAKAGE_REDACTED
S5_PAPER_LEAKAGE_POLICY_VIOLATION
S5_PAPER_NON_VERDICT_PROJECTION_APPLIED
S5_PAPER_INTERNAL_ERROR
```

## 5. Minimum paper-visible S5 evidence row

Every reviewer-visible S5 row returned by finding or threat retrieval must include the frozen minimum fields:

```json
{
  "schemaVersion": "s5-paper-evidence-row-v1",
  "retrievalRunId": "s5-retrieval-run-001",
  "itemId": "s5-item-001",
  "sourceType": "code",
  "queryIntent": "finding_local_context",
  "sourceEvidence": {
    "kind": "source_kg_snippet",
    "ref": "source-kg-snippet:001",
    "displayRef": "src/parser.c:42-47",
    "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
    "sourceCodeKgRefs": {
      "codeKbRef": "s5-code-kb:case-001:target-001",
      "sourceKgRef": "s5-source-kg:case-001:target-001",
      "graphNodeIds": ["source-node-001"],
      "evidenceSnippetIds": ["snippet-001"]
    },
    "threatKbRefs": null
  },
  "surfaceStatus": "produced",
  "visibleLeakageClass": "generic",
  "text": "Bounded source/code context for reviewer-visible audit.",
  "rank": 1,
  "score": 0.82,
  "orderingKey": "000001:s5-item-001",
  "producerTrace": {
    "s5ProducerRunId": "s5-producer-run-001",
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1"
  },
  "diagnostics": []
}
```

Required fields:

```text
schemaVersion
retrievalRunId
itemId
sourceType
queryIntent
sourceEvidence
surfaceStatus
visibleLeakageClass
text
producerTrace.s5ProducerRunId
```

Optional but recommended:

```text
rank
score
scoreBreakdown
orderingKey
sourceEvidence.displayRef
sourceEvidence.s3EvidenceRefs
sourceEvidence.sourceCodeKgRefs
sourceEvidence.threatKbRefs
producerTrace.retrievalPolicyVersion
diagnostics
```

Rows with `sourceType=diagnostic` are allowed only when S3 intentionally renders producer status/diagnostic text. They remain diagnostic-only and must carry `visibleLeakageClass=generic` in mainline mode.

## 6. Leakage policy

### 6.1 Mainline generic mode

In `visibilityMode=generic`, S5 may show:

```text
CWE/CAPEC identifiers and generic descriptions
security concept explanations
API misuse descriptions
generic source-derived code context
generic library provenance notes
producer diagnostics with no hidden leakage values
```

S5 must not show:

```text
CVE IDs
fix commits
advisory identifiers or advisory text
exploit writeups
patch text
hidden provenance ledger values
```

### 6.2 Whole-packet visible-field leakage validation

Generic-mode leakage validation applies to every field that can become reviewer-visible in B2 or B4, not only `rows[].text`. S5 must validate, redact, omit, or fail closed before exposing forbidden values in any of these locations:

```text
rows[].text
rows[].sourceEvidence.ref
rows[].sourceEvidence.displayRef
rows[].sourceEvidence.*Refs
rows[].producerTrace
producerProvenance
retrievalTrace.normalizedQuery
retrievalTrace.discardedHitReasons
diagnostics[].message
diagnostics[].metadata
fileBackedArtifactRef or other visible artifact refs
any B4-visible trace/navigation affordance derived from S5
```

S3 may choose not to render some trace/provenance fields in B2, but B4 can expose them. Therefore the S5 generic-mode validator must treat all B4-visible fields as visible outputs. If S5 cannot prove a field is free of forbidden values, it must redact/omit the field or return `S5_PAPER_LEAKAGE_POLICY_VIOLATION`.

### 6.3 `visibleLeakageClass` behavior

The enum includes forbidden classes because validators, oracle cards, and future non-mainline conditions need to classify what a row would expose. However, mainline reviewer-visible rows must satisfy:

```text
visibilityMode == generic => every visible row visibleLeakageClass == generic
```

If an internal candidate is classified as `cve_id`, `fix_commit`, `advisory`, `exploit_writeup`, or `patch_text`, S5 must do one of:

1. omit it;
2. rewrite it into generic concept text with `visibleLeakageClass=generic`;
3. return a generic diagnostic such as `S5_PAPER_FORBIDDEN_LEAKAGE_REDACTED`;
4. fail closed with `S5_PAPER_LEAKAGE_POLICY_VIOLATION`.

The diagnostic itself must not reveal the hidden value.

## 7. Endpoint: `GET /v1/contracts/paper-context`

Purpose: expose the machine-readable S5 paper context contract snapshot.

Non-goals:

- does not prepare Code KB;
- does not retrieve rows;
- does not indicate S5_FREEZE_GATE pass by itself;
- does not provide final verdict authority.

Example response:

```json
{
  "schemaVersion": "s5-paper-context-contract-v1",
  "contractVersion": "s5-paper-context-api-v1",
  "producer": "s5-knowledge-base",
  "status": "draft_until_implemented_and_tested",
  "consumerBoundary": "contextual_support_not_final_verdict",
  "negativeEvidenceAllowed": false,
  "defaultVisibilityMode": "generic",
  "endpoints": [
    {
      "toolName": "prepare_code_kb",
      "method": "POST",
      "path": "/v1/paper/code-kb/prepare",
      "requestSchemaVersion": "s5-prepare-code-kb-request-v1",
      "responseSchemaVersion": "s5-prepare-code-kb-response-v1",
      "timeoutHeaderRequired": true
    },
    {
      "toolName": "retrieve_finding_context",
      "method": "POST",
      "path": "/v1/paper/finding-context/retrieve",
      "requestSchemaVersion": "s5-retrieve-finding-context-request-v1",
      "responseSchemaVersion": "s5-retrieve-finding-context-response-v1",
      "timeoutHeaderRequired": true
    },
    {
      "toolName": "retrieve_generic_threat_context",
      "method": "POST",
      "path": "/v1/paper/threat-context/generic",
      "requestSchemaVersion": "s5-retrieve-generic-threat-context-request-v1",
      "responseSchemaVersion": "s5-retrieve-generic-threat-context-response-v1",
      "timeoutHeaderRequired": true
    }
  ],
  "enums": {
    "surfaceStatus": ["produced", "no_hit", "partial", "not_available", "error"],
    "sourceType": ["code", "symbol", "cwe", "capec", "generic_security_note", "library_provenance", "diagnostic"],
    "visibleLeakageClass": ["generic", "cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"]
  },
  "policies": {
    "mainlineVisibilityMode": "generic",
    "mainlineForbiddenLeakageClasses": ["cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"],
    "b2b4EvidenceControl": "same_rows_text_order_required",
    "forbiddenInferencePolicy": "producer_status_is_not_final_triage"
  },
  "freezeGate": {
    "s5VisiblePacketSchemaFinalized": false,
    "visibleLeakageClassRequiredForEveryVisibleRow": true,
    "genericThreatKbLeakageCorpusTestRequired": true,
    "diagnosticStatusNotTpFpEvidence": true,
    "finalVerdictFieldsForbidden": true
  }
}
```

## 8. Endpoint: `POST /v1/paper/code-kb/prepare`

Tool name: `prepare_code_kb`.

Purpose: prepare or validate target-scoped Code KB / Source Code KG readiness for one admitted build target. This corresponds to `S5_CODE_KB_READY`.

Non-goals:

- does not retrieve generic Threat KB rows;
- does not return finding-level context rows;
- does not call S4;
- does not decide whether a finding is TP/FP/UNKNOWN;
- does not prove source reproducibility or security integrity.

Example request:

```json
{
  "schemaVersion": "s5-prepare-code-kb-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-prepare-001",
  "idempotencyKey": "case-001:target-001:s5:prepare-code-kb:v1",
  "sourceRootRef": "source-root:case-001:target-001",
  "compileContextRef": "compile-context:case-001:target-001",
  "producerInputRefs": {
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001"
  },
  "sourceContext": {
    "sourceRoot": "/paper-runs/run-001/targets/target-001/source",
    "compileCommandsPath": "/paper-runs/run-001/targets/target-001/evidence/compile_commands.json",
    "language": "c/cpp",
    "scope": {
      "includePaths": ["src/"],
      "excludePaths": ["third_party/"],
      "thirdPartyPaths": ["third_party/"]
    }
  },
  "visibilityMode": "generic",
  "forbiddenLeakageClasses": ["cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"]
}
```

Required fields:

```text
schemaVersion
caseId
buildTargetId
paperRunId
requestId
idempotencyKey
producerInputRefs.sourceRootRef
producerInputRefs.compileContextRef
visibilityMode
forbiddenLeakageClasses
```

Required for live endpoint execution:

```text
sourceContext.sourceRoot or an S5-resolvable source artifact ref
sourceContext.compileCommandsPath or an S5-resolvable compile context artifact ref
```

Optional fields:

```text
producerInputRefs.buildSnapshotId
producerInputRefs.buildUnitId
sourceContext.language
sourceContext.scope
implementationMode = live | file_backed
fileBackedArtifactRef
```

Example response:

```json
{
  "schemaVersion": "s5-prepare-code-kb-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-prepare-001",
  "idempotencyKey": "case-001:target-001:s5:prepare-code-kb:v1",
  "codeKbRunId": "s5-code-kb-run-001",
  "s5ProducerRunId": "s5-producer-run-code-kb-001",
  "surfaceStatus": "produced",
  "stageReadiness": "ready",
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "readiness": {
    "codeKbReady": true,
    "sourceKgReady": true,
    "contextSelectable": true,
    "acceptedSourceRootRef": "source-root:case-001:target-001",
    "acceptedCompileContextRef": "compile-context:case-001:target-001",
    "rowCounts": {
      "sourceArtifacts": 12,
      "graphNodes": 243,
      "graphEdges": 711,
      "evidenceSnippets": 58,
      "richIrArtifacts": 4
    }
  },
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "serviceVersion": "s5-dev",
    "paperContextContractVersion": "s5-paper-context-api-v1",
    "sourceCodeKgContractVersion": "source-code-kg-ingest-v1",
    "sourceCodeKgContextVersion": "source-code-kg-context-v1",
    "threatRetrievalContractVersion": null,
    "retrievalPolicyVersion": null,
    "genericThreatPolicyVersion": null,
    "codeKbRef": "s5-code-kb:case-001:target-001",
    "sourceKgRef": "s5-source-kg:case-001:target-001",
    "sourceKgIndexVersionRef": "s5-source-kg-index:paper-run-001",
    "threatKbCorpusVersion": null,
    "threatKbIndexVersion": null,
    "visibilityMode": "generic"
  },
  "diagnostics": []
}
```

`stageReadiness` values:

```text
ready                  S3 may mark S5_CODE_KB_READY=done.
ready_with_diagnostics S3 may mark S5_CODE_KB_READY=done and record diagnostics.
not_ready              S3 records S5_CODE_KB_READY=diagnostic.
```

Status mapping:

| `surfaceStatus` | `stageReadiness` | S3 handling |
|---|---|---|
| `produced` | `ready` | `S5_CODE_KB_READY=done` |
| `partial` | `ready_with_diagnostics` when `contextSelectable=true` | done with producer diagnostics |
| `partial` | `not_ready` when `contextSelectable=false` | diagnostic |
| `not_available` | `not_ready` | diagnostic |
| `error` | `not_ready` | diagnostic |

## 9. Endpoint: `POST /v1/paper/finding-context/retrieve`

Tool name: `retrieve_finding_context`.

Purpose: retrieve S5 Code KB / Source Code KG context for a specific S4-derived finding after S3 has mediated the S4 evidence.

Required flow:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

S5 must not read from S4 directly or infer hidden S4 context. S3 sends the source anchors and evidence refs it wants S5 to use.

Non-goals:

- does not validate S4 evidence completeness;
- does not return final TP/FP/UNKNOWN;
- does not treat no-hit as safe;
- does not expose generic Threat KB rows except as separately requested by `retrieve_generic_threat_context`.

Example request:

```json
{
  "schemaVersion": "s5-retrieve-finding-context-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-finding-context-001",
  "idempotencyKey": "case-001:s4-finding-001:s5:finding-context:v1",
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "finding": {
    "findingId": "s4-finding-001",
    "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
    "sourceAnchors": [
      {
        "fileRef": "s4-source-file-001",
        "displayPath": "src/parser.c",
        "functionRef": "s4-function-001",
        "symbolName": "parse_header",
        "lineStart": 42,
        "lineEnd": 47
      }
    ],
    "ruleId": "clang-analyzer-security.insecureAPI.strcpy",
    "cweCandidates": ["CWE-120"],
    "toolMessage": "Potential buffer overflow via unchecked copy",
    "libraryIdentity": {
      "name": "libexample",
      "version": "1.2.3",
      "confidence": "observed_by_s4"
    }
  },
  "queryIntent": "finding_local_context",
  "retrievalProfile": "paper-code-context-default-v1",
  "topK": 5,
  "visibilityMode": "generic",
  "forbiddenLeakageClasses": ["cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"]
}
```

Required fields:

```text
schemaVersion
caseId
buildTargetId
paperRunId
findingId
requestId
idempotencyKey
codeKbRef
sourceKgRef
finding.findingId
finding.s3EvidenceRefs
queryIntent
retrievalProfile
topK
visibilityMode
forbiddenLeakageClasses
```

Optional fields:

```text
finding.sourceAnchors
finding.ruleId
finding.cweCandidates
finding.toolMessage
finding.libraryIdentity
producerInputRefs
maxSnippetChars
includeNeighborSymbols
```

Example response:

```json
{
  "schemaVersion": "s5-retrieve-finding-context-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-finding-context-001",
  "idempotencyKey": "case-001:s4-finding-001:s5:finding-context:v1",
  "s5ProducerRunId": "s5-producer-run-finding-001",
  "retrievalRunId": "s5-retrieval-run-finding-001",
  "rowSetId": "s5-row-set-finding-001",
  "surfaceStatus": "produced",
  "rows": [
    {
      "schemaVersion": "s5-paper-evidence-row-v1",
      "retrievalRunId": "s5-retrieval-run-finding-001",
      "itemId": "s5-code-row-001",
      "sourceType": "code",
      "queryIntent": "finding_local_context",
      "sourceEvidence": {
        "kind": "source_kg_snippet",
        "ref": "source-kg-snippet:001",
        "displayRef": "src/parser.c:39-49",
        "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
        "sourceCodeKgRefs": {
          "codeKbRef": "s5-code-kb:case-001:target-001",
          "sourceKgRef": "s5-source-kg:case-001:target-001",
          "graphNodeIds": ["source-node-parse-header"],
          "evidenceSnippetIds": ["snippet-parse-header-039-049"]
        }
      },
      "surfaceStatus": "produced",
      "visibleLeakageClass": "generic",
      "text": "Nearby code checks the input length before the flagged copy operation.",
      "rank": 1,
      "score": 0.82,
      "orderingKey": "000001:s5-code-row-001",
      "producerTrace": {
        "s5ProducerRunId": "s5-producer-run-finding-001",
        "codeKbRef": "s5-code-kb:case-001:target-001",
        "sourceKgRef": "s5-source-kg:case-001:target-001",
        "sourceCodeKgContextVersion": "source-code-kg-context-v1",
        "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1"
      },
      "diagnostics": []
    }
  ],
  "retrievalTrace": {
    "queryIntent": "finding_local_context",
    "normalizedQuery": "s4-finding-001 source anchors + CWE-120 + local symbol context",
    "topK": 5,
    "returnedCount": 1,
    "candidatePoolSize": 4,
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true,
    "discardedHitReasons": [],
    "methodsAttempted": ["source_anchor", "symbol_neighbor", "cwe_hint"],
    "methodsUsed": ["source_anchor", "symbol_neighbor"]
  },
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "paperContextContractVersion": "s5-paper-context-api-v1",
    "sourceCodeKgContractVersion": "source-code-kg-ingest-v1",
    "sourceCodeKgContextVersion": "source-code-kg-context-v1",
    "threatRetrievalContractVersion": null,
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
    "genericThreatPolicyVersion": null,
    "codeKbRef": "s5-code-kb:case-001:target-001",
    "sourceKgRef": "s5-source-kg:case-001:target-001",
    "sourceKgIndexVersionRef": "s5-source-kg-index:paper-run-001",
    "threatKbCorpusVersion": null,
    "threatKbIndexVersion": null,
    "visibilityMode": "generic"
  },
  "diagnostics": []
}
```

No-hit example:

```json
{
  "schemaVersion": "s5-retrieve-finding-context-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "findingId": "s4-finding-404",
  "requestId": "s3-s5-finding-context-404",
  "idempotencyKey": "case-001:s4-finding-404:s5:finding-context:v1",
  "s5ProducerRunId": "s5-producer-run-finding-404",
  "retrievalRunId": "s5-retrieval-run-finding-404",
  "rowSetId": "s5-row-set-finding-404",
  "surfaceStatus": "no_hit",
  "rows": [],
  "retrievalTrace": {
    "queryIntent": "finding_local_context",
    "topK": 5,
    "returnedCount": 0,
    "candidatePoolSize": 0,
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true
  },
  "diagnostics": [
    {
      "code": "S5_PAPER_CONTEXT_NO_HIT",
      "message": "No source context row matched the S3-provided anchors under the requested profile.",
      "severity": "info",
      "surfaceStatus": "no_hit",
      "consumerPolicy": "diagnostic_only_not_security_evidence",
      "negativeEvidenceAllowed": false,
      "visibleLeakageClass": "generic",
      "relatedItemIds": [],
      "s3EvidenceRefs": ["s3-evidence:s4-finding-404"],
      "metadata": {}
    }
  ]
}
```

## 10. Endpoint: `POST /v1/paper/threat-context/generic`

Tool name: `retrieve_generic_threat_context`.

Purpose: return generic Threat KB context for CWE, CAPEC, API misuse, library provenance, and generic security concepts under mainline leakage controls.

Non-goals:

- does not expose CVE IDs, advisories, fix commits, exploit writeups, or patch text in mainline mode;
- does not judge affectedness of a specific library version;
- does not prove exploitability;
- does not decide TP/FP/UNKNOWN.

Example request:

```json
{
  "schemaVersion": "s5-retrieve-generic-threat-context-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-threat-context-001",
  "idempotencyKey": "case-001:s4-finding-001:s5:generic-threat:v1",
  "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
  "cweCandidates": ["CWE-120"],
  "capecCandidates": [],
  "apiNames": ["strcpy"],
  "libraryIdentity": {
    "name": "libexample",
    "version": "1.2.3",
    "confidence": "observed_by_s4"
  },
  "queryIntent": "generic_threat_context",
  "retrievalProfile": "paper-generic-threat-default-v1",
  "topK": 5,
  "visibilityMode": "generic",
  "forbiddenLeakageClasses": ["cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"]
}
```

Required fields:

```text
schemaVersion
caseId
buildTargetId
paperRunId
findingId
requestId
idempotencyKey
queryIntent = generic_threat_context
retrievalProfile
topK
visibilityMode = generic
forbiddenLeakageClasses
at least one of cweCandidates, capecCandidates, apiNames, libraryIdentity
```

Example response:

```json
{
  "schemaVersion": "s5-retrieve-generic-threat-context-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-threat-context-001",
  "idempotencyKey": "case-001:s4-finding-001:s5:generic-threat:v1",
  "s5ProducerRunId": "s5-producer-run-threat-001",
  "retrievalRunId": "s5-retrieval-run-threat-001",
  "rowSetId": "s5-row-set-threat-001",
  "surfaceStatus": "produced",
  "rows": [
    {
      "schemaVersion": "s5-paper-evidence-row-v1",
      "retrievalRunId": "s5-retrieval-run-threat-001",
      "itemId": "s5-threat-row-001",
      "sourceType": "cwe",
      "queryIntent": "generic_threat_context",
      "sourceEvidence": {
        "kind": "threat_kb_node",
        "ref": "CWE-120",
        "displayRef": "CWE-120 generic weakness note",
        "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
        "threatKbRefs": {
          "corpusVersion": "s5-threat-kb-corpus-v1",
          "indexVersion": "s5-threat-kb-index-v1",
          "nodeRef": "cwe:CWE-120"
        }
      },
      "surfaceStatus": "produced",
      "visibleLeakageClass": "generic",
      "text": "CWE-120 describes buffer copy operations where bounds are not enforced before writing into a fixed-size buffer.",
      "rank": 1,
      "score": 0.91,
      "orderingKey": "000001:s5-threat-row-001",
      "producerTrace": {
        "s5ProducerRunId": "s5-producer-run-threat-001",
        "threatKbCorpusVersion": "s5-threat-kb-corpus-v1",
        "threatKbIndexVersion": "s5-threat-kb-index-v1",
        "genericThreatPolicyVersion": "s5-paper-generic-threat-policy-v1",
        "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1"
      },
      "diagnostics": []
    }
  ],
  "retrievalTrace": {
    "queryIntent": "generic_threat_context",
    "normalizedQuery": "CWE-120 strcpy generic misuse context",
    "topK": 5,
    "returnedCount": 1,
    "candidatePoolSize": 3,
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true,
    "leakagePolicy": "generic_only_no_cve_fix_advisory_exploit_patch",
    "redactedCandidateCount": 0
  },
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "paperContextContractVersion": "s5-paper-context-api-v1",
    "sourceCodeKgContractVersion": null,
    "sourceCodeKgContextVersion": null,
    "threatRetrievalContractVersion": "s5-threat-retrieval-evidence-v1",
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
    "genericThreatPolicyVersion": "s5-paper-generic-threat-policy-v1",
    "codeKbRef": null,
    "sourceKgRef": null,
    "sourceKgIndexVersionRef": null,
    "threatKbCorpusVersion": "s5-threat-kb-corpus-v1",
    "threatKbIndexVersion": "s5-threat-kb-index-v1",
    "visibilityMode": "generic"
  },
  "diagnostics": []
}
```

Redaction diagnostic example:

```json
{
  "code": "S5_PAPER_FORBIDDEN_LEAKAGE_REDACTED",
  "message": "One internal candidate was omitted because it was outside generic Threat KB visibility.",
  "severity": "warning",
  "surfaceStatus": "partial",
  "consumerPolicy": "diagnostic_only_not_security_evidence",
  "negativeEvidenceAllowed": false,
  "visibleLeakageClass": "generic",
  "relatedItemIds": [],
  "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
  "metadata": {
    "redactedCandidateCount": 1,
    "redactionReason": "forbidden_leakage_class"
  }
}
```

The message does not identify the hidden CVE/advisory/fix/exploit/patch value.

## 11. Status and HTTP error semantics

Producer `surfaceStatus`:

| Status | Meaning | S3 allowed handling |
|---|---|---|
| `produced` | S5 produced one or more usable producer rows, or Code KB readiness is ready. | Normalize rows/provenance. Still not final verdict. |
| `no_hit` | Valid retrieval request, no relevant row found. Not used by `prepare_code_kb`. | Record contextual absence diagnostic only. Not safe/FP evidence. |
| `partial` | Some rows/context available but requested surfaces degraded, redacted, or incomplete. | Normalize rows plus diagnostics. Not TP/FP evidence. |
| `not_available` | Required S5 backing surface unavailable under paper contract. | Record producer diagnostic/operational anomaly path. |
| `error` | Producer/input/runtime diagnostic. | Record producer diagnostic. Do not convert directly into TP/FP/UNKNOWN. |

HTTP mapping:

```text
200 success with endpoint-specific surfaceStatus
400 malformed JSON, missing required field, missing/invalid X-Timeout-Ms
408 caller deadline exceeded before safe completion
409 idempotency key reused with incompatible normalized request
422 valid JSON but paper contract violation, unsupported visibility mode, missing forbidden leakage list
503 Code KB / Source KG / Threat KB dependency unavailable for this request
500 unexpected S5 producer failure
```

HTTP errors represent transport/contract/runtime failures. Producer `surfaceStatus` represents bounded producer state in a successful paper response.

## 12. Idempotency and retry

S3 must provide:

```text
requestId: unique per transport attempt for observability and replay logs.
idempotencyKey: stable for the logical paper operation being retried.
```

S5 idempotency fingerprint rule:

```text
fingerprint = canonical_json(request body excluding requestId, attempt metadata, and transport-only fields)
```

The fingerprint excludes `requestId`, `X-Request-Id`, `X-Timeout-Ms`, retry counters, and client attempt timestamps. It includes case/build/finding ids, refs, query inputs, visibility policy, retrieval profile, `topK`, and any file-backed artifact refs that affect output.

S5 behavior:

- same `idempotencyKey` + same fingerprint returns the prior result if available, or safely recomputes the same paper projection;
- same `idempotencyKey` + different fingerprint returns `409` / `S5_PAPER_IDEMPOTENCY_CONFLICT`;
- retry-safe outputs should preserve stable `codeKbRunId`, `retrievalRunId`, `itemId`, `rowSetId`, and `s5ProducerRunId` where feasible;
- idempotency is a run-safety contract, not a public reproducibility or integrity proof.

Recommended key shape:

```text
{caseId}:{findingId-or-target}:s5:{operation}:{schemaVersion}:{attempt-family}
```

Example:

```text
case-001:s4-finding-001:s5:generic-threat:v1
```

## 13. B2/B4 evidence control

S5 must support S3 rendering B2 and B4 from the same evidence rows/text/order.

Required response fields:

```json
{
  "rowSetId": "s5-row-set-finding-001",
  "retrievalTrace": {
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true
  }
}
```

Rules:

- S5 returns one canonical ordered row list per request.
- `rowSetId` identifies the canonical row set that S3 must use for both B2 and B4 render inputs.
- A B2/B4 validator must compare `rowSetId`, ordered `rows[].itemId`, ordered `rows[].text`, ordered `rows[].orderingKey`, and any reviewer-visible diagnostic/status text.
- S3 may hide ledger refs/producer traces/claim links in B2 and show them in B4.
- S5 must not return richer row text for B4 than for B2.
- If diagnostic/status text is reviewer-visible, the same diagnostic/status text must be available to B2 and B4.
- Any ablation or non-mainline condition that changes S5 rows/text/order must be explicitly registered by S3 and traceable as a different request/profile.

## 14. Forbidden inference and non-verdict language

S5 paper-visible responses must avoid final-verdict authority.

Forbidden output fields or equivalent semantics:

```text
verdict
finalVerdict
triageLabel
TP
FP
UNKNOWN
truePositive
falsePositive
vulnerable
safe
clean
affected
affectednessProof
notAffected
exploitabilityProven
absenceEvidence
```

Allowed wording:

```text
contextual support
generic security context
source/code context
retrieval context
producer diagnostic
not enough S5 context
context no-hit
redacted by generic visibility policy
```

If a backing Judge/Threat Retrieval object contains affectedness/verdict/status vocabulary, the paper projection must either drop it, rewrite it as bounded context, or emit `S5_PAPER_NON_VERDICT_PROJECTION_APPLIED`.

## 15. S3 normalization and evidence-ledger compatibility

S3 should store raw S5 responses and normalize rows into the evidence ledger.

Recommended S3 ledger mapping:

| S5 field | S3 normalized use |
|---|---|
| `caseId`, `buildTargetId`, `paperRunId` | case/build/run keys |
| `s5ProducerRunId` | producer run key |
| `retrievalRunId` | retrieval operation key |
| `rowSetId` | B2/B4 canonical row set key |
| `rows[].itemId` | raw object / producer item ref |
| `rows[].sourceType` | evidence type family |
| `rows[].queryIntent` | why S3 requested this row |
| `rows[].sourceEvidence` | source/KB reference and S3 upstream evidence links |
| `rows[].surfaceStatus` | producer status, diagnostic only unless `produced` row text is cited as context |
| `rows[].visibleLeakageClass` | leakage visibility audit field |
| `rows[].text` | packet-visible S5 row text |
| `rows[].producerTrace` | B4/ledger trace affordance |
| `diagnostics[]` | producer diagnostic ledger rows or state-trace entries |

S3 must not normalize `no_hit`, `partial`, `not_available`, or `error` into TP/FP evidence. It may use them in responsible diagnostic/defer rationale when claim-boundary rules allow.

## 16. File-backed equivalent

If S3 consumes file-backed S5 artifacts before live endpoints are implemented, the artifacts must satisfy the same schemas:

```text
s5-code-kb.raw.json
s5-code-kb.normalized.json
s5-finding-context.raw.jsonl
s5-finding-context.normalized.jsonl
s5-generic-threat-context.raw.jsonl
s5-generic-threat-context.normalized.jsonl
```

File-backed responses should include:

```json
{
  "implementationMode": "file_backed",
  "fileBackedArtifactRef": "paper-runs/run-001/cases/case-001/s5-finding-context.raw.jsonl",
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "paperContextContractVersion": "s5-paper-context-api-v1"
  }
}
```

File-backed mode must not weaken leakage policy, row schema requirements, B2/B4 stable-row controls, idempotency/fingerprint semantics, or non-verdict boundaries.

## 17. S5_FREEZE_GATE validation plan

S5_FREEZE_GATE is **not satisfied** by this document alone. It passes only after implementation or file-backed equivalent plus tests prove these invariants.

Required S5 tests/validators:

1. **Contract snapshot test**: `GET /v1/contracts/paper-context` returns expected endpoints, schema versions, enums, and policies.
2. **Visible row schema validator**: every reviewer-visible row has `retrievalRunId`, `itemId`, `sourceType`, `queryIntent`, `sourceEvidence`, `surfaceStatus`, and `visibleLeakageClass`.
3. **Whole-packet leakage validator**: no forbidden values appear in rows, source refs, trace/provenance, retrieval trace, diagnostics, file-backed refs, or any B4-visible S5 field.
4. **Generic Threat KB leakage corpus test**: synthetic hidden-ledger fixtures containing CVE IDs, fix commits, advisories, exploit writeups, and patch text never appear in mainline visible rows or diagnostics.
5. **Non-verdict vocabulary test**: paper responses do not contain final verdict fields or visible authority language such as `vulnerable`, `safe`, `TP`, `FP`, `affected`, or `not_affected`.
6. **Diagnostic separation test**: `no_hit`, `partial`, `not_available`, and `error` responses set `negativeEvidenceAllowed=false` and carry diagnostic-only consumer policy.
7. **B2/B4 stable-row regression**: the same request returns the same `rowSetId`, ordered row ids, row text, ordering keys, and reviewer-visible diagnostic/status text under the same `idempotencyKey` / retrieval profile.
8. **Idempotency conflict test**: same key with incompatible normalized request returns `409` and does not silently overwrite producer artifacts.
9. **Appendix-mode fail-closed test**: non-`generic` visibility mode returns `422` until a separate appendix/v2 contract exists.
10. **S3 consumer guard fixture**: S5 provides example responses for S3 tests proving S3 refuses status-to-verdict promotion.

Gate result vocabulary:

```text
S5_FREEZE_GATE = pass | fail | not_run
```

Until `pass`, S5/Threat KB contributions to RQ5 remain exploratory or demoted according to the frozen anchor.

## 18. Open implementation items

1. Add paper-context contract snapshot implementation.
2. Add paper-facing Pydantic models and validators for these request/response/row schemas.
3. Implement Code KB prepare as a projection over Source Code KG ingest/context readiness.
4. Implement finding context retrieval over Source Code KG context selection.
5. Implement generic Threat KB projection with whole-packet leakage validator and non-verdict projection guard.
6. Add S5_FREEZE_GATE test suite.
7. Provide S3 with frozen fixture responses for consumer-adapter tests.

## 19. Critic review incorporation

Critic returned `PASS_WITH_CHANGES`, with no blocking producer-boundary contradiction. This page incorporates the five required corrections:

1. leakage validation now covers all reviewer-visible/B4-visible fields, not only row text or diagnostics;
2. `requestId` is per-attempt while `idempotencyKey` owns logical replay, with an explicit fingerprint rule;
3. appendix visibility mode is fail-closed and unsupported in v1;
4. canonical ref locations and provenance nullability are specified for S3 typed consumers;
5. B2/B4 control is mechanically testable via `rowSetId` plus ordered row/text/status checks.
