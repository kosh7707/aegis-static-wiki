---
title: "S5 reply: ACCEPT_WITH_SCOPE for paper-facing Code KB and retrieval tool-call contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont"
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "paper-pipeline", "code-kb", "source-code-kg", "threat-kb"]
decision_tags: ["paper-api", "tool-call-contract", "accept-with-scope", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-define-paper-facing-s3-tool-call-contract-for-code-kb-and-retrieval-evidence.md", "wiki/canon/work-requests/s5-to-s3-s5-reply-ack_with_corrections-for-pre-freeze-paper-code-kb-and-retrieval-produce.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/specs/aegis-traceaudit-benchmark-master.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T02:25:57.593Z","note":"S3 reviewed S5 ACCEPT_WITH_SCOPE paper-facing tool-call contract reply. Accepted as contract direction, not as S5_FREEZE_GATE satisfaction. S3 accepts the three-call shape prepare_code_kb / retrieve_finding_context / retrieve_generic_threat_context and the proposed /v1/paper/* surface, with implementation/tests still required for visibleLeakageClass, generic Threat KB leakage validation, B2/B4 stable rows, and non-verdict/forbidden-inference enforcement."}]
registered_at: "2026-05-19T02:17:41.686Z"
completed_at: "2026-05-19T02:25:57.593Z"
---

# S5 reply: ACCEPT_WITH_SCOPE for paper-facing Code KB and retrieval tool-call contract

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Response

S5 position: **ACCEPT_WITH_SCOPE**.

S5 accepts S3's three-call split for the paper-facing S3→S5 contract:

1. `prepare_code_kb`
2. `retrieve_finding_context`
3. `retrieve_generic_threat_context`

This is not a blocker and not a disagreement with the paper direction. It is also not merely a documentation alias over existing runtime endpoints. S5 understands this as a request to add a small, explicit **paper-facing endpoint/tool surface** that projects current S5 Source Code KG, acquisition, and Threat Retrieval/Judge internals into TraceAudit-safe producer evidence.

Current implementation note:

- Source Code KG ingest/context already exists under `/v1/source-code-kg/*`.
- target-context acquisition and code/threat search already exist under `/v1/target-contexts/.../acquire/*`.
- Judge/Threat Retrieval evidence already exists under `/v1/judge/query` and `/v1/contracts/judge`.
- The exact paper tool names requested by S3 do **not** currently exist as public S5 endpoints. S5 accepts adding them as paper-facing v1 surfaces.

This reply defines the S5-approved v1 contract shape for S3 planning. Implementation should follow in a separate S5 implementation pass with tests first.

## Proposed contract endpoint

S5 should expose the machine-readable paper tool contract as:

```http
GET /v1/contracts/paper-context
```

Contract identity:

```json
{
  "schemaVersion": "s5-paper-context-tools-v1",
  "producer": "s5-knowledge-base",
  "tools": [
    "prepare_code_kb",
    "retrieve_finding_context",
    "retrieve_generic_threat_context"
  ],
  "consumerBoundary": "contextual_support_not_final_verdict",
  "negativeEvidenceAllowed": false,
  "defaultVisibilityMode": "generic"
}
```

S3 may call the HTTP endpoints directly or wrap them as analysis-agent tools with the same names.

## Common request fields

All three calls should share these envelope fields:

```json
{
  "schemaVersion": "s5-paper-tool-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-to-s5-request-001",
  "idempotencyKey": "case-001:s5:prepare-code-kb:001",
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

Rules:

- `requestId` is required for tracing.
- `idempotencyKey` is required for retry-safe paper runs.
- `visibilityMode=generic` is the main benchmark mode.
- Mainline requests must include forbidden leakage classes listed above.
- S5 may use internal identity/checking mechanisms for idempotent replay, but paper-visible responses must not present hashes/checksums as reproducibility or security proof.

## Common evidence row shape

Every reviewer-visible S5 row returned by finding or threat retrieval must use this minimum shape:

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
    "s3EvidenceRefs": ["s3-evidence:s4-finding-001"]
  },
  "surfaceStatus": "produced",
  "visibleLeakageClass": "generic",
  "text": "Bounded source/code context for reviewer-visible audit.",
  "rank": 1,
  "score": 0.82,
  "producerTrace": {
    "s5ProducerRunId": "s5-producer-run-001",
    "codeKbRef": "s5-code-kb:case-001:target-001",
    "sourceKgRef": "s5-source-kg:case-001:target-001",
    "sourceCodeKgSchemaVersion": "source-code-kg-ingest-v1",
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
    "indexVersionRef": "s5-index-version:paper-run-001"
  },
  "diagnostics": []
}
```

Allowed values:

```text
sourceType: code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
```

Main benchmark rule:

- Every returned visible row must include `visibleLeakageClass`.
- Under `visibilityMode=generic`, returned visible rows should normally have `visibleLeakageClass=generic`.
- A row that would expose `cve_id`, `fix_commit`, `advisory`, `exploit_writeup`, or `patch_text` must be redacted, omitted with a diagnostic, or rejected by the leakage validator before it reaches the reviewer-visible packet.

## 1. `prepare_code_kb`

### Endpoint/tool name

```http
POST /v1/paper/code-kb/prepare
```

Tool name:

```text
prepare_code_kb
```

### Purpose

Prepare or validate target-scoped Code KB / Source Code KG readiness for one admitted build target.

This corresponds to:

```text
S5_CODE_KB_READY
```

It does not build a target-specific Threat KB and does not produce final TP/FP/UNKNOWN.

### Behavior

- v1 should be a bounded synchronous call with caller deadline/timeout.
- S5 returns a terminal producer result for the request: `produced`, `partial`, `not_available`, or `error`.
- No fire-and-forget semantics in paper v1.
- If later async behavior is required, it should be a v2 addition with explicit request-status/result retrieval.

### Request schema

```json
{
  "schemaVersion": "s5-prepare-code-kb-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-prepare-001",
  "idempotencyKey": "case-001:prepare-code-kb:001",
  "sourceRootRef": "source-root:case-001:target-001",
  "compileContextRef": "compile-context:case-001:target-001",
  "buildSnapshotId": "build-snapshot-001",
  "buildUnitId": "build-unit-001",
  "sourceContext": {
    "sourceRoot": "/workspace/target",
    "compileCommandsPath": "build/compile_commands.json",
    "scope": {
      "includePaths": [],
      "excludePaths": [],
      "thirdPartyPaths": []
    }
  },
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

Required fields:

```text
caseId
buildTargetId
requestId
idempotencyKey
sourceRootRef
compileContextRef or equivalent compile context ref
visibilityMode
forbiddenLeakageClasses in main benchmark mode
```

Optional fields:

```text
paperRunId
buildSnapshotId
buildUnitId
sourceContext.sourceRoot
sourceContext.compileCommandsPath
sourceContext.scope
```

### Response schema

```json
{
  "schemaVersion": "s5-prepare-code-kb-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "requestId": "s3-s5-prepare-001",
  "idempotencyKey": "case-001:prepare-code-kb:001",
  "codeKbRunId": "s5-code-kb-run-001",
  "s5ProducerRunId": "s5-producer-run-001",
  "surfaceStatus": "produced",
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "readiness": {
    "codeKbReady": true,
    "sourceKgReady": true,
    "rowCounts": {
      "sourceArtifacts": 12,
      "graphNodes": 243,
      "graphEdges": 711,
      "evidenceSnippets": 58
    }
  },
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "paperContextContractVersion": "s5-paper-context-tools-v1",
    "sourceCodeKgContractVersion": "source-code-kg-ingest-v1",
    "sourceCodeKgContextVersion": "source-code-kg-context-v1",
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
    "indexVersionRef": "s5-index-version:paper-run-001",
    "visibilityMode": "generic"
  },
  "diagnostics": []
}
```

### Status semantics

```text
produced      Code KB / Source KG readiness is available for this build target.
partial       S5 produced bounded context but some requested surfaces are missing/degraded.
not_available S5 cannot prepare the requested target context under the paper contract.
error         Producer/input/runtime diagnostic; not security evidence.
```

`partial`, `not_available`, and `error` may support S3 diagnostic rationale or responsible UNKNOWN/defer handling, but they are not TP/FP evidence.

## 2. `retrieve_finding_context`

### Endpoint/tool name

```http
POST /v1/paper/finding-context/retrieve
```

Tool name:

```text
retrieve_finding_context
```

### Purpose

Retrieve finding-level Code KB / Source Code KG context after S3 has S4 findings and source anchors.

Required flow:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

S5 consumes S4-derived context only when S3 sends it explicitly. S5 does not call S4 and does not validate S4 evidence completeness.

### Request schema

```json
{
  "schemaVersion": "s5-retrieve-finding-context-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "requestId": "s3-s5-finding-context-001",
  "idempotencyKey": "case-001:finding-001:code-context:001",
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "finding": {
    "findingId": "s4-finding-001",
    "s3EvidenceRefs": ["s3-evidence:s4-finding-001"],
    "sourceAnchors": [
      {
        "fileRef": "s4-source-file-001",
        "functionRef": "s4-function-001",
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
  "retrievalProfile": "paper-default-v1",
  "topK": 5,
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

### Response schema

```json
{
  "schemaVersion": "s5-retrieve-finding-context-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-finding-context-001",
  "retrievalRunId": "s5-retrieval-run-finding-001",
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
        "s3EvidenceRefs": ["s3-evidence:s4-finding-001"]
      },
      "surfaceStatus": "produced",
      "visibleLeakageClass": "generic",
      "text": "Nearby caller performs bounds check before the flagged call.",
      "rank": 1,
      "score": 0.82,
      "producerTrace": {
        "s5ProducerRunId": "s5-producer-run-001",
        "codeKbRef": "s5-code-kb:case-001:target-001",
        "sourceKgRef": "s5-source-kg:case-001:target-001",
        "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1"
      },
      "diagnostics": []
    }
  ],
  "retrievalTrace": {
    "queryIntent": "finding_local_context",
    "normalizedQuery": "finding source anchor + CWE-120 + local function context",
    "topK": 5,
    "returnedCount": 1,
    "candidatePoolSize": 4,
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true
  },
  "diagnostics": []
}
```

### Status semantics

```text
produced      One or more context rows returned.
no_hit        Request was valid but no relevant context row was found.
partial       Some context was returned but requested anchors/surfaces were incomplete.
not_available Code KB / Source KG surface unavailable for this request.
error         Producer/input/runtime diagnostic.
```

`no_hit` is contextual absence only. It is not safe-code evidence and not FP evidence.

## 3. `retrieve_generic_threat_context`

### Endpoint/tool name

```http
POST /v1/paper/threat-context/generic
```

Tool name:

```text
retrieve_generic_threat_context
```

### Purpose

Return generic Threat KB context for CWE/API/library misuse/security concepts under main benchmark leakage controls.

Mainline mode must not expose CVE IDs, advisories, fix commits, exploit writeups, or patch text.

### Request schema

```json
{
  "schemaVersion": "s5-retrieve-generic-threat-context-request-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-threat-context-001",
  "idempotencyKey": "case-001:finding-001:generic-threat:001",
  "cweCandidates": ["CWE-120"],
  "apiNames": ["strcpy"],
  "libraryIdentity": {
    "name": "libexample",
    "version": "1.2.3",
    "confidence": "observed_by_s4"
  },
  "queryIntent": "generic_threat_context",
  "retrievalProfile": "paper-generic-threat-v1",
  "topK": 5,
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

### Response schema

```json
{
  "schemaVersion": "s5-retrieve-generic-threat-context-response-v1",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "findingId": "s4-finding-001",
  "requestId": "s3-s5-threat-context-001",
  "retrievalRunId": "s5-retrieval-run-threat-001",
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
        "s3EvidenceRefs": []
      },
      "surfaceStatus": "produced",
      "visibleLeakageClass": "generic",
      "text": "CWE-120 covers classic buffer copy operations where bounds are not enforced.",
      "rank": 1,
      "score": 0.91,
      "producerTrace": {
        "s5ProducerRunId": "s5-producer-run-002",
        "threatKbCorpusVersion": "s5-threat-kb-corpus-v1",
        "threatKbIndexVersion": "s5-threat-kb-index-v1",
        "retrievalPolicyVersion": "s5-paper-generic-threat-policy-v1"
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
    "leakagePolicy": "generic_only_no_cve_fix_advisory_exploit_patch",
    "b2b4StableRows": true
  },
  "diagnostics": []
}
```

### Leakage handling

Under `visibilityMode=generic`, S5 must not return reviewer-visible rows with these classes:

```text
cve_id
fix_commit
advisory
exploit_writeup
patch_text
```

If an internal candidate would require those classes, S5 should either:

1. omit the candidate and report a generic diagnostic row;
2. redact it into generic concept text when safe; or
3. return `surfaceStatus=partial` / `error` with a diagnostic such as `FORBIDDEN_LEAKAGE_REDACTED` or `LEAKAGE_POLICY_VIOLATION`.

The diagnostic itself must use `visibleLeakageClass=generic` and must not echo the forbidden ID/text.

## Error model

Paper endpoints should use the normal S5 error envelope where possible and include a machine-readable reason.

Suggested HTTP mapping:

```text
400 timeout/header/schema malformed where S5 current API treats it as bad request
408 caller deadline exceeded before safe completion
409 idempotency key reused with incompatible request shape
422 valid JSON but paper contract violation, e.g. unsupported visibility mode
503 Source KG / Threat KB / ledger dependency not ready
500 unexpected S5 producer failure
```

Suggested producer diagnostic codes:

```text
S5_PAPER_SCHEMA_INVALID
S5_PAPER_IDEMPOTENCY_CONFLICT
S5_PAPER_CODE_KB_NOT_READY
S5_PAPER_SOURCE_KG_NOT_AVAILABLE
S5_PAPER_CONTEXT_NO_HIT
S5_PAPER_CONTEXT_PARTIAL
S5_PAPER_THREAT_KB_NOT_AVAILABLE
S5_PAPER_FORBIDDEN_LEAKAGE_REDACTED
S5_PAPER_LEAKAGE_POLICY_VIOLATION
S5_PAPER_TIMEOUT
S5_PAPER_INTERNAL_ERROR
```

Diagnostics are producer/context diagnostics only. They are not final S3 triage labels.

## Idempotency and retry semantics

- S3 must provide `requestId` and `idempotencyKey`.
- Retrying the same idempotency key with the same normalized request should return the same producer result when available, or safely recompute the same paper projection.
- Reusing the same idempotency key with incompatible request content should return an idempotency conflict diagnostic.
- Retried responses must preserve stable run-local IDs where feasible: `codeKbRunId`, `retrievalRunId`, `itemId`, and `s5ProducerRunId`.
- Idempotency is a producer-run safety contract, not a paper-visible reproducibility proof.

## B2/B4 evidence control

S5 accepts the B2/B4 control requirement.

For the main B2 vs B4 comparison, these endpoints should make it possible for S3 to render both conditions from the same S5 evidence rows/text/order:

```json
{
  "retrievalTrace": {
    "orderingPolicy": "s5-paper-stable-row-order-v1",
    "b2b4StableRows": true
  }
}
```

S5 should not return richer evidence content for B4 than B2. B4 can add ledger refs, producer traces, claim links, and navigation. B2 can hide those affordances. The underlying S5 evidence content should remain controlled unless S3 explicitly requests an ablation or appendix condition.

## Forbidden inference / non-verdict language

S5 paper responses must preserve this boundary:

```text
S5 hit      != vulnerable
S5 no_hit   != safe
S5 error    != FP
S5 partial  != final UNKNOWN by itself
S5 CWE note != affectedness proof
```

Allowed wording:

```text
contextual support
generic security context
producer diagnostic
retrieval context
source/code context
library provenance
insufficient S5 context
```

Forbidden paper-visible authority wording:

```text
vulnerable
safe
clean
true positive
false positive
final verdict
affectedness proof
not affected proof
exploitability proven
```

If current S5 internals contain Judge vocabulary such as `affected`, `not_affected`, `status`, or `qualityGate`, the paper-facing endpoints must project those internals into contextual rows and diagnostics. They must not expose them as final paper verdict authority.

## Producer provenance/version fields

Every response should expose bounded provenance/version refs:

```json
{
  "producerProvenance": {
    "component": "s5-knowledge-base",
    "paperContextContractVersion": "s5-paper-context-tools-v1",
    "sourceCodeKgContractVersion": "source-code-kg-ingest-v1",
    "sourceCodeKgContextVersion": "source-code-kg-context-v1",
    "threatRetrievalContractVersion": "s5-threat-retrieval-evidence-v1",
    "retrievalPolicyVersion": "s5-paper-retrieval-policy-v1",
    "genericThreatPolicyVersion": "s5-paper-generic-threat-policy-v1",
    "threatKbCorpusVersion": "s5-threat-kb-corpus-v1",
    "threatKbIndexVersion": "s5-threat-kb-index-v1",
    "indexVersionRef": "s5-index-version:paper-run-001",
    "visibilityMode": "generic"
  }
}
```

These refs are traceability handles and version/provenance descriptors. They are not final security evidence and not bit-for-bit reproducibility claims.

## S5_FREEZE_GATE status

S5's answer for the freeze gate is **not fully satisfied yet**. This WR establishes the accepted contract direction, but implementation and tests remain.

| Gate item | Status after this reply |
|---|---|
| S5 visible packet schema finalized | Proposed here, not implemented/frozen until S5 paper contract endpoint + tests land. |
| `visibleLeakageClass` emitted for every S5 row | Required by this contract, not yet proven on implemented paper endpoints. |
| Threat KB generic mode tested on synthetic hidden-ledger leakage corpus | Open S5-local implementation/test work. |
| S5 `no_hit` / `partial` / `error` cannot be consumed by S3 as TP/FP evidence | Contractually stated here; S3 consumer checks and S5 producer tests should still be added. |
| S5 never emits final verdict fields or vulnerable/safe-equivalent language | Required by this contract; implementation must strip/remap Judge/affectedness internals in paper-facing projection. |

Impact:

- This does not block S3/S4/ledger core work.
- It does block treating S5/Threat KB RQ5 as mainline until the S5 paper endpoint implementation and leakage/non-verdict tests pass.
- If the gate remains unmet, S5/Threat KB contribution should be exploratory/removed as previously agreed.

## Disagreement with three-call split

No material disagreement.

S5 accepts the three-call split as the right paper-facing shape. The only constraint is naming/scope discipline:

- `retrieve_generic_threat_context` is mainline and generic-only.
- Any CVE/advisory/fix/patch/exploit-aware retrieval should be an explicit appendix/future condition, not a default behavior hidden inside this call.

## Expected S5 implementation work after S3 reconciliation

If S3 accepts this contract direction, S5 implementation should proceed with tests first:

1. contract endpoint `GET /v1/contracts/paper-context`;
2. `POST /v1/paper/code-kb/prepare`;
3. `POST /v1/paper/finding-context/retrieve`;
4. `POST /v1/paper/threat-context/generic`;
5. visible row schema validator requiring `visibleLeakageClass` on every row;
6. generic Threat KB leakage validator using synthetic hidden-ledger leakage fixtures;
7. B2/B4 stable-row/order regression;
8. forbidden-inference regression preventing Judge/affectedness vocabulary from becoming paper-visible final authority.

## Final S5 position

Accepted with scope.

S5 agrees to define and later implement this as a new paper-facing producer contract surface, backed by existing Source Code KG, acquisition, and Threat Retrieval internals, while preserving the producer boundary and S5_FREEZE_GATE requirements.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
