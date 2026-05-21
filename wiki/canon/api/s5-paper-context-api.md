---
title: "S5 Paper Context API Contract"
page_type: "canonical-api"
canonical: true
source_refs:
  - "wiki/canon/work-requests/s3-to-s5-s5-draft-detailed-paper-context-api-docs-for-s3-consumer-implementation.md"
  - "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md"
  - "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md"
  - "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md"
  - "wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md"
  - "wiki/canon/api/knowledge-base-api.md"
  - "wiki/canon/work-requests/s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request.md"
last_verified: "2026-05-21"
service_tags: ["s5", "s3", "knowledge-base", "paper-pipeline", "traceaudit", "source-code-kg", "code-kb", "threat-kb", "api-contract", "observability", "source-kg-exploration", "coverage-diagnostics"]
decision_tags: ["paper-api", "s5-paper-context-api", "consumer-contract", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control", "idempotency", "timeout-policy", "critic-reviewed", "implemented-hard-now", "implemented-freeze-gate", "observability-aligned", "source-kg-coverage", "source-kg-exploration"]
related_pages:
  - "wiki/canon/api/paper-analysis-api.md"
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
  - "wiki/canon/api/knowledge-base-api.md"
  - "wiki/canon/handoff/s5/readme.md"
  - "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md"
  - "wiki/canon/handoff/s5/session-s5-paper-context-implementation-interview-20260519.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow.md"
  - "wiki/canon/work-requests/s3-to-s5-s5-support-needed-context-coverage-diagnostics-and-exploratory-source-kg-query-s.md"
---


# S5 Paper Context API Contract


## Current-state overlay — 2026-05-21 bootstrap refresh

S5 additionally verified canonical JSONL logging and `log-analyzer` traceability for the paper/contract path before S3 e2e smoke. See [[wiki/canon/work-requests/s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e]] and [[wiki/canon/handoff/s5/session-s5-log-analyzer-traceability-20260520]].

Live proof request IDs found in `/home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl` and by `log-analyzer.trace_request`:

```text
s5-logproof-contract-20260520-001
s5-logproof-prepare-20260520-001
s5-logproof-finding-20260520-001
s5-logproof-threat-20260520-001
```

All proof rows carried `service=s5-kb`, numeric `level=30`, request ID, method/path, lifecycle start/end messages, status/timing on end rows, and POST case/build/paper IDs where applicable. Health remains a liveness endpoint without explicit lifecycle logging; paper/contract endpoints are the traceability proof surface.

> Status: **S5_FREEZE_GATE pass for S5 producer obligations**.
> Owner: S5 / Knowledge Base lane.
> Consumer: S3 / paper harness.
> Last verified: 2026-05-21.
> Critic status: post-implementation freeze-gate review `PASS`; no blocking S5 implementation issue found.
> Implementation status: the `/v1/paper/*` endpoints and `GET /v1/contracts/paper-context` are implemented in `services/knowledge-base/**` with S5-owned freeze-gate validation. S3 consumer execution remains separately owned and is advertised as `pending_s3_owned_validation`.

### Current-state overlay — 2026-05-21 coverage/exploration update

S5 implemented the S3-requested context-coverage and exploratory Source KG support in response to [[wiki/canon/work-requests/s3-to-s5-s5-support-needed-context-coverage-diagnostics-and-exploratory-source-kg-query-s]]. Additive runtime/API behavior now includes:

- `retrieve_finding_context` returns top-level `contextCoverage` (`schemaVersion=s5-paper-context-coverage-v1`) with `coverageStatus`, requested anchors, returned spans, tri-state `lineOverlap`, and diagnostic rows.
- Same-file but line-disjoint Source KG context is no longer silently `produced`: the response is `surfaceStatus=partial`, `contextCoverage.coverageStatus=non_overlapping`, and includes diagnostic `S5_PAPER_CONTEXT_NON_OVERLAPPING`.
- New endpoint/tool `POST /v1/paper/source-kg/explore` / `explore_source_kg` supports bounded `source_slice`, `function_body`, `callers`, `callees`, `symbol_lookup`, `neighborhood`, and `data_flow` exploration over prepared Source KG selectors. `data_flow` returns explicit `not_available` unless selected rich IR / PDG / taint artifacts exist.
- Freeze-gate endpoint matrices now include the exploratory endpoint for idempotency, visibility fail-closed, malformed leakage class fail-closed, and visible packet validation.

Fresh focused verification:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
     -> 60 passed in 130.04s

cd services/knowledge-base && .venv/bin/python -m compileall app/paper_context app/routers/paper_context_api.py app/contracts/paper_context.py
     -> passed
```

## 1. Scope and boundary

This API makes S5 a bounded **Contextual Knowledge Provider / Code KB Provider** for AEGIS TraceAudit.

Implemented HTTP surface:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/source-kg/explore
POST /v1/paper/threat-context/generic
```

Equivalent S3 tool names:

```text
prepare_code_kb
retrieve_finding_context
explore_source_kg
retrieve_generic_threat_context
```

S5 accepts these names as the v1 paper-facing contract. S3 may call HTTP directly or wrap the same schemas as tools.

S5 owns:

- target-scoped Code KB / Source Code KG readiness;
- finding-scoped code/source context retrieval plus explicit anchor coverage diagnostics;
- bounded exploratory Source KG query support for S3 iterative tool use;
- generic Threat KB context retrieval;
- S5 producer run identifiers, policy versions, and diagnostics;
- leakage filtering for S5-visible rows and B4-visible trace/provenance fields in the hard-now subset;
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

## 2. Implementation mapping

The paper endpoints project existing S5 capabilities instead of exposing raw runtime internals.

| Existing capability | Existing route / contract | Paper projection |
|---|---|---|
| Contract discovery | `GET /v1/contracts/source-code-kg`, `GET /v1/contracts/judge`, `GET /v1/contracts/acquisition`, `GET /v1/contracts/analyst-brief` | `GET /v1/contracts/paper-context` |
| Source Code KG ingest/context | `POST /v1/source-code-kg/ingest`, `POST /v1/source-code-kg/context` | `POST /v1/paper/code-kb/prepare`, code rows plus `contextCoverage` in `retrieve_finding_context`, and bounded exploratory rows in `explore_source_kg` |
| Judge / Threat Retrieval | `POST /v1/judge/query`, `GET /v1/contracts/judge` | generic, non-verdict Threat KB rows in `retrieve_generic_threat_context` |

Implemented files:

```text
services/knowledge-base/app/contracts/paper_context.py
services/knowledge-base/app/paper_context/models.py
services/knowledge-base/app/paper_context/service.py
services/knowledge-base/app/paper_context/freeze_gate.py
services/knowledge-base/app/routers/paper_context_api.py
services/knowledge-base/scripts/paper-freeze-gate.py
services/knowledge-base/tests/test_paper_context_api_contract.py
services/knowledge-base/tests/test_paper_context_freeze_gate.py
services/knowledge-base/tests/test_paper_context_observability.py
```

Wiring updates:

```text
services/knowledge-base/app/main.py
services/knowledge-base/app/routers/contracts_api.py
```

Implementation rule:

```text
Do not expose Judge verdict/status/affectedness vocabulary as paper-visible final authority.
Project it into generic context rows or diagnostics under this contract.
```

## 3. Common transport conventions

All `POST /v1/paper/*` calls are synchronous JSON calls. Required transport shape:

```http
Content-Type: application/json
Accept: application/json
```

`X-Timeout-Ms` is **not required** for S5 paper endpoints. If supplied by a legacy caller, it must be a positive integer, but it is a compatibility/transport hint only and **not** a semantic terminal deadline. S3 may use no-read-timeout compatibility mode for these calls: while S5 is alive and the request is still progressing, caller-side wall-clock expiry must not be interpreted as S5 producer failure or security evidence.

The contract endpoint `GET /v1/contracts/paper-context` also does not require `X-Timeout-Ms`.

Each POST body has required `requestId` and `idempotencyKey`:

```text
requestId: unique per transport attempt.
idempotencyKey: stable for the logical paper operation being retried.
```

If `X-Request-Id` is supplied and differs from body `requestId`, S5 returns `400 / S5_PAPER_SCHEMA_INVALID`.

Paper-specific error codes are preserved in the common error envelope for paper routes. `S5_PAPER_TIMEOUT_HEADER_MISSING_OR_INVALID` now applies only when a legacy `X-Timeout-Ms` header is supplied with an invalid non-positive value, not when the header is absent. Codes include:

```text
S5_PAPER_TIMEOUT_HEADER_MISSING_OR_INVALID
S5_PAPER_SCHEMA_INVALID
S5_PAPER_VISIBILITY_MODE_UNSUPPORTED
S5_PAPER_FORBIDDEN_LEAKAGE_CLASSES_REQUIRED
S5_PAPER_IDEMPOTENCY_CONFLICT
S5_PAPER_LEAKAGE_POLICY_VIOLATION
```

### 3.1 Observability and request-id behavior

S5 paper-facing endpoints are aligned with `wiki/canon/specs/observability.md` for the paper path:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/source-kg/explore
POST /v1/paper/threat-context/generic
```

Request-id rules:

- If `X-Request-Id` is supplied, S5 stores it in request context and returns it in `X-Request-Id`.
- If `X-Request-Id` is missing for `GET /v1/contracts/paper-context`, S5 generates `req-{uuid}` and returns it.
- If `X-Request-Id` is missing for `POST /v1/paper/*`, S5 preserves the existing paper contract by using body `requestId` as the operation request id and returning it in `X-Request-Id`.
- If `X-Request-Id` is supplied for `POST /v1/paper/*`, it must match body `requestId`; mismatches fail with `400 / S5_PAPER_SCHEMA_INVALID`.
- Legacy non-paper S5 endpoints retain their existing no-header behavior unless their own contract already echoes a supplied `X-Request-Id`.

Error-envelope rules:

- Paper HTTP and validation errors use the common envelope:
  `success=false`, `error`, and `errorDetail.code/message/requestId/retryable`.
- Paper validation errors use `S5_PAPER_SCHEMA_INVALID` and sanitize Pydantic errors by removing raw `input`/`ctx` values so malformed requests do not echo caller secrets.

Structured log rules:

- JSONL logs are emitted through the S5 logger with numeric `level`, epoch-ms `time`, `service=s5-kb`, `msg`, and contextual `requestId`.
- Paper endpoint lifecycle logs use messages `S5 paper endpoint start`, `S5 paper endpoint end`, and `S5 paper endpoint error`.
- Lifecycle metadata includes `method`, `path`, `caseId`, `buildTargetId`, `paperRunId`, optional `findingId`, `status`, `elapsedMs`, and S5 producer/retrieval ids where available.
- S5 paper-context endpoints do not perform outbound service-to-service HTTP calls; no outbound `target/method/path/status/elapsedMs` log pair is currently applicable inside this S5 paper path.

Representative log shape:

```json
{
  "level": 30,
  "time": 1779253596407,
  "service": "s5-kb",
  "msg": "S5 paper endpoint end",
  "requestId": "s3-s5-observability-prepare-001",
  "method": "POST",
  "path": "/v1/paper/code-kb/prepare",
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "paperRunId": "paper-run-001",
  "status": 200,
  "elapsedMs": 85,
  "s5ProducerRunId": "s5-producer-run-code-kb-...",
  "surfaceStatus": "produced"
}
```

## 4. Common schema fragments

### 4.1 Common enums

```text
SurfaceStatus = produced | no_hit | partial | not_available | error
ContextCoverageStatus = covered | partial | non_overlapping | not_available | error
SourceKgExploreMode = source_slice | function_body | callers | callees | symbol_lookup | neighborhood | data_flow
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

Any `visibilityMode` other than `generic` fails closed with `422 / S5_PAPER_VISIBILITY_MODE_UNSUPPORTED`.

### 4.2 Common response envelope

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

Producer provenance uses schema-stable keys. Missing families are represented with `null` rather than silent omission.

### 4.3 Diagnostic object

Diagnostics are S5 producer/context diagnostics. They may support S3 diagnostic rationale, but they are not TP/FP evidence.

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

## 5. Minimum paper-visible S5 evidence row

Every reviewer-visible S5 row returned by finding or threat retrieval includes the frozen minimum fields:

```json
{
  "schemaVersion": "s5-paper-evidence-row-v1",
  "retrievalRunId": "s5-retrieval-run-001",
  "itemId": "s5-item-001",
  "sourceType": "code",
  "queryIntent": "finding_local_context",
  "sourceEvidence": {},
  "surfaceStatus": "produced",
  "visibleLeakageClass": "generic",
  "text": "Bounded source/code context for reviewer-visible audit.",
  "orderingKey": "000001:s5-item-001",
  "producerTrace": {
    "s5ProducerRunId": "s5-producer-run-001"
  }
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

## 6. Endpoint: `GET /v1/contracts/paper-context`

Purpose: expose the machine-readable S5 paper context contract snapshot.

The current implementation returns:

```text
schemaVersion = s5-paper-context-contract-v1
contractVersion = s5-paper-context-api-v1
status = implemented_s5_freeze_gate_pass_for_s5_producer_obligations
defaultVisibilityMode = generic
freezeGate.s5FreezeGate = pass
freezeGate.s5VisiblePacketSchemaFinalized = true
freezeGate.validationSuiteVersion = s5-paper-freeze-gate-v1
freezeGate.validationReportRef = s5-freeze-gate-report:s5-paper-freeze-gate-v1
freezeGate.idempotencyDurability = ledger_backed_all_paper_endpoints
freezeGate.s3ConsumerExecutionStatus = pending_s3_owned_validation
freezeGate.missingValidationItems = []
policies.sourceKgQualityGatePolicy = selectable_context_may_be_partial_with_caveats
policies.sourceKgPartialReadiness.surfaceStatus = partial
policies.sourceKgPartialReadiness.stageReadiness = ready
policies.sourceKgPartialReadiness.sourceKgQualityGate = accepted_with_caveats
```

The runtime contract pass is an S5 producer-boundary claim only. It does not mean S3 has executed its own renderer/consumer validation, and it does not turn S5 context into final triage evidence.

## 7. Endpoint: `POST /v1/paper/code-kb/prepare`

Tool name: `prepare_code_kb`.

Purpose: prepare or validate target-scoped Code KB / Source Code KG readiness for one admitted build target.

Implemented request behavior:

- Requires `producerInputRefs.sourceRootRef` and `producerInputRefs.compileContextRef`.
- Optional top-level aliases `sourceRootRef`, `compileContextRef`, `buildSnapshotId`, `buildUnitId` must exactly match canonical nested refs when supplied.
- Accepts `sourceContext.sourceKgIngestRequest` using the native `s5-source-code-kg-ingest-request-v1` schema and calls real `ingest_source_kg`.
- Accepts `sourceContext.sourceKgSelectors` and validates against real `SQLiteLedgerRepository.get_source_kg_context`.
- Does **not** synthesize readiness from source paths alone. If no real Source KG rows are available, it returns `surfaceStatus=not_available`, `stageReadiness=not_ready`, and diagnostic-only readiness fields.

Implemented response behavior:

```text
codeKbRef = s5-code-kb:{caseId}:{buildTargetId}
sourceKgRef = s5-source-kg:{caseId}:{buildTargetId}
```

When real Source KG context is selectable, S5 stores the `sourceKgRef` mapping through the existing ledger `provider_observation` table with provider `s5-paper-context`. No new DB migration is required for the hard-now subset.

### 7.1 Source KG quality caveat overlay — 2026-05-20

`prepare_code_kb` now distinguishes **selectable Source KG presence** from **complete/high-quality source graph coverage**. If a provided Source KG bundle is selectable but has weak provenance, S5 must not over-claim `produced` quality. Examples include smoke/manual harness provenance, low-confidence or manually produced graph edges, graph nodes without snippet coverage, multi-node graphs without edges, or weak graphs with no corroborating rich IR.

For these cases S5 returns:

```json
{
  "surfaceStatus": "partial",
  "stageReadiness": "ready",
  "readiness": {
    "codeKbReady": true,
    "sourceKgReady": true,
    "contextSelectable": true,
    "sourceKgQualityGate": "accepted_with_caveats"
  },
  "diagnostics": [
    {"code": "S5_PAPER_SOURCE_KG_SMOKE_HARNESS_PROVENANCE"},
    {"code": "S5_PAPER_SOURCE_KG_LOW_CONFIDENCE_EDGES"},
    {"code": "S5_PAPER_SOURCE_KG_RICH_IR_NOT_AVAILABLE"}
  ]
}
```

These diagnostics are quality/context caveats only. They are not final security evidence and carry `negativeEvidenceAllowed=false`. The idempotency record schema was advanced to `s5-paper-idempotency-record-v2` so stale v1 cached `produced` prepare responses are not replayed after this quality gate change.

The machine-readable contract endpoint also advertises this behavior under:

```text
policies.sourceKgQualityGatePolicy
policies.sourceKgQualityDiagnostics
policies.sourceKgPartialReadiness
```

This lets S3 discover that selectable Source KG context can be `ready` for consumption while still being marked `partial` for graph-quality confidence.

S3 consumer action:

```text
If prepare_code_kb returns stageReadiness=ready and readiness.contextSelectable=true,
S3 may continue using codeKbRef/sourceKgRef even when surfaceStatus=partial.
When readiness.sourceKgQualityGate=accepted_with_caveats, S3 must preserve the
diagnostic caveats in its packet/trace metadata and must not render the Source KG
as complete/high-confidence graph coverage.
```

This is an additive response/contract-discovery change under `s5-paper-context-api-v1`: existing endpoint paths, request schemas, response schema versions, and enum values are unchanged. Consumers that only require selectable context can continue, but consumers that distinguish clean graph quality from weak graph quality should read `readiness.sourceKgQualityGate` and the diagnostic codes advertised by `GET /v1/contracts/paper-context`.

`stageReadiness` values currently emitted by the implementation:

```text
ready
not_ready
```

Quality caveats are represented by `surfaceStatus=partial` plus diagnostic rows rather than a separate stage readiness value.

## 8. Endpoint: `POST /v1/paper/finding-context/retrieve`

Tool name: `retrieve_finding_context`.

Purpose: retrieve S5 Code KB / Source Code KG context for a specific S4-derived finding after S3 has mediated the S4 evidence.

Required flow:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

Implemented behavior:

- Resolves Source KG selectors from explicit `sourceKgSelectors` first, else from the prepared `sourceKgRef` mapping.
- Calls `SQLiteLedgerRepository.get_source_kg_context` for real ledger context.
- Anchor-matches `finding.sourceAnchors` against Source KG graph nodes/snippets using file path, line overlap, and symbol/display identity.
- Projects matched graph nodes/snippets into generic paper rows.
- Emits `contextCoverage` so S3 can distinguish overlapping, partial, same-file non-overlapping, unavailable, and unsatisfied-anchor cases.
- Returns `rowSetId`, stable ordered `rows[].itemId`, stable ordered `rows[].text`, and stable ordered `rows[].orderingKey`.
- If no prepared Source KG mapping or explicit selectors are available, returns `surfaceStatus=not_available`, `rows=[]`, and primary diagnostic `S5_PAPER_SOURCE_KG_NOT_PREPARED` with `negativeEvidenceAllowed=false`.
- If prepared Source KG selectors exist but cannot resolve to selectable context, returns `surfaceStatus=not_available` with diagnostic `S5_PAPER_SOURCE_KG_NOT_AVAILABLE`.
- If Source KG context is prepared/selectable but no anchor row matches, returns `surfaceStatus=no_hit`, `rows=[]`, and diagnostic `S5_PAPER_CONTEXT_NO_HIT` with `negativeEvidenceAllowed=false`.
- If rows exist but same-file returned spans do not overlap the requested line/range anchor, returns `surfaceStatus=partial`, `contextCoverage.coverageStatus=non_overlapping`, and diagnostic `S5_PAPER_CONTEXT_NON_OVERLAPPING`.

## 9. Endpoint: `POST /v1/paper/source-kg/explore`

Tool name: `explore_source_kg`.

Purpose: expose bounded Source KG exploration for S3's iterative analysis loop without turning S5 into a final verdict authority. S3 can call this after `prepare_code_kb` when one-shot finding context is suspicious but insufficient.

Request schema version:

```text
s5-explore-source-kg-request-v1
```

Required common fields are the same paper fields used by other `POST /v1/paper/*` endpoints: `caseId`, `buildTargetId`, `paperRunId`, `requestId`, `idempotencyKey`, `visibilityMode=generic`, and the full `forbiddenLeakageClasses` set. The request also includes:

```json
{
  "codeKbRef": "s5-code-kb:case-001:target-001",
  "sourceKgRef": "s5-source-kg:case-001:target-001",
  "queryIntent": "source_kg_exploration",
  "retrievalProfile": "paper-source-kg-explore-default-v1",
  "topK": 5,
  "exploration": {
    "mode": "source_slice",
    "path": "main.cpp",
    "lineStart": 35,
    "lineEnd": 35,
    "symbolName": "run",
    "functionRef": null,
    "graphNodeId": null,
    "depth": 1
  }
}
```

At least one of `sourceKgRef`, explicit `sourceKgSelectors`, or an explicit exploration selector (`path`, line, symbol/function, or graph node) must be supplied. In practice, row-producing exploration requires a prepared Source KG mapping (`sourceKgRef`) or explicit selectors that resolve in S5's Source KG ledger. Explicit path/symbol selectors alone are schema-accepted but return `not_available` if S5 cannot resolve them to a prepared Source KG context.

Supported `exploration.mode` values:

| mode | Behavior | Limitation |
|---|---|---|
| `source_slice` | Return bounded evidence snippets by `path` plus optional line/range. | Snippet coverage only; no full source dump. |
| `function_body` | Return matching function graph nodes and linked snippets by symbol or path/line. | Only as complete as S4/S5 Source KG node/snippet facts. |
| `symbol_lookup` | Return matching graph nodes by symbol/function/node selector. | No final evidence inference. |
| `callers` | Return incoming graph-edge neighbors for a seed node. | Requires Source KG `graphEdges`. |
| `callees` | Return outgoing graph-edge neighbors for a seed node. | Requires Source KG `graphEdges`. |
| `neighborhood` | Return bounded incoming/outgoing graph-edge neighborhood. | Depth is bounded; current implementation is conservative. |
| `data_flow` | Return data-flow context only when selected rich IR / PDG / taint artifacts exist. | Otherwise returns `S5_PAPER_SOURCE_KG_DATA_FLOW_NOT_AVAILABLE`. |

Response schema version:

```text
s5-explore-source-kg-response-v1
```

Response fields include `surfaceStatus`, stable `rowSetId`, stable ordered `rows[]`, `retrievalTrace`, `capabilities`, `producerProvenance`, and `diagnostics`. Rows use the same `s5-paper-evidence-row-v1` shape and are subject to the same generic leakage/final-authority sanitizer as finding/threat context rows.

S3 tool-policy guidance:

```text
Use explore_source_kg as bounded evidence navigation only.
A row means contextual source graph/snippet material exists; it does not imply TP/FP/UNKNOWN.
If data_flow or graph-neighborhood modes return not_available, preserve the diagnostic and continue/stop according to S3's own budget.
Do not treat no_hit/not_available as absence-of-vulnerability evidence.
```

## 9.1 Finding-context coverage diagnostics

`POST /v1/paper/finding-context/retrieve` now returns additive top-level `contextCoverage`:

```json
{
  "schemaVersion": "s5-paper-context-coverage-v1",
  "coverageStatus": "covered",
  "requestedAnchors": [
    {"path": "main.cpp", "lineStart": 35, "lineEnd": 35, "function": "run", "symbol": "run"}
  ],
  "returnedSpans": [
    {
      "kind": "source_kg_snippet",
      "path": "main.cpp",
      "startLine": 1,
      "endLine": 24,
      "nodeId": null,
      "snippetId": "snippet-main-1-24",
      "pathMatch": true,
      "lineOverlap": false,
      "symbolOrFunctionMatch": false
    }
  ],
  "lineOverlap": false,
  "diagnostics": [{"code": "S5_PAPER_CONTEXT_NON_OVERLAPPING"}],
  "pathMatchPolicy": "normalized_exact_or_suffix"
}
```

Coverage status semantics:

| coverageStatus | Meaning | S3 consumption |
|---|---|---|
| `covered` | At least one returned span path-matches and overlaps the requested line/range anchor. | May be used as overlapping context, still not final verdict evidence. |
| `partial` | Context exists but overlap cannot be proven or only non-line context matched. | Preserve diagnostic/caveat. |
| `non_overlapping` | Returned context path-matches but line range is disjoint from requested anchor. | Treat as inadequate for anchor-specific reasoning unless S3 obtains more context. |
| `not_available` | Source KG is not prepared/resolved or no selectable span can satisfy the anchor. | Context gap only, no negative evidence. |
| `error` | Reserved for future explicit errors. | Do not infer security result. |

Line overlap is tri-state at returned-span level: `true`, `false`, or `null` when S5 lacks enough line metadata. Path matching uses normalized exact-or-suffix matching.

If rows exist but all same-file returned spans are line-disjoint from the requested anchor, S5 sets:

```json
{
  "surfaceStatus": "partial",
  "contextCoverage": {"coverageStatus": "non_overlapping", "lineOverlap": false},
  "diagnostics": [{"code": "S5_PAPER_CONTEXT_NON_OVERLAPPING"}]
}
```

This specifically covers the certificate-maker mismatch pattern where S3 requested anchors such as `main.cpp:35` but S5 Source KG rows pointed at `main.cpp:1-24`.

## 10. Endpoint: `POST /v1/paper/threat-context/generic`

Tool name: `retrieve_generic_threat_context`.

Purpose: return generic Threat KB context for CWE, CAPEC, API misuse, library provenance, and generic security concepts under mainline leakage controls.

Implemented behavior:

- Calls existing `build_threat_retrieval_evidence` over the S5 ledger.
- Projects only allowlisted generic rows: `weaknessSemantics`, `attackSemantics`, explicit CWE/CAPEC taxonomy fallback rows, and API generic security notes.
- Omits raw `candidateEvidence`, advisory IDs, aliases, risk signals, and Judge/affectedness-adjacent fields.
- Emits generic redaction diagnostics with counts/reasons but no hidden identifiers when internal candidates are omitted.
- If no generic rows can be produced, returns `surfaceStatus=no_hit` with diagnostic-only context gap.

## 11. Leakage policy

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

The freeze-gate implementation applies a key-aware recursive sanitizer/validator to paper POST responses before returning them and to exported S5 guard fixtures. It covers rows, source refs, producer trace/provenance, retrieval trace, diagnostics, visible artifact refs, and unsafe visible keys. The freeze suite includes a synthetic corpus for CVE/GHSA/fix-commit/advisory/exploit-writeup/patch-text leakage plus final-authority vocabulary. Diagnostic `code` fields remain allowed as diagnostic codes only; diagnostic messages/metadata are still subject to the visible-packet policy.

## 12. Idempotency and retry

S3 must provide:

```text
requestId: unique per transport attempt for observability and replay logs.
idempotencyKey: stable for the logical paper operation being retried.
```

Implemented freeze-gate behavior:

```text
cache key = (endpoint, idempotencyKey)
ledger provider = s5-paper-context-idempotency
ledger subjectKey = {endpoint}:{idempotencyKey}
stored value = { schemaVersion, endpoint, idempotencyKey, fingerprint, response }
fingerprint = canonical_json(request body excluding requestId and attempt metadata)
```

Same endpoint + same key + same fingerprint replays the stored paper response, including stable S5 IDs/row surfaces while echoing the current transport `requestId`. Same endpoint + same key + different semantic fingerprint returns `409 / S5_PAPER_IDEMPOTENCY_CONFLICT`. The same `idempotencyKey` may be used by different paper endpoints without collision because endpoint scoping is part of the subject key.

Freeze-gate durability claim:

```text
idempotencyDurability = ledger_backed_all_paper_endpoints
```

## 13. B2/B4 evidence control

S5 supports S3 rendering B2 and B4 from the same evidence rows/text/order through:

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
- S5 must not return richer row text for B4 than for B2.
- The freeze-gate suite validates S5-exported B2/B4 guard fixtures with identical row IDs, text, ordering keys, and diagnostic rows. S3 still owns executing its own renderer/consumer validation over those fixtures.

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

If a backing Judge/Threat Retrieval object contains affectedness/verdict/status vocabulary, the paper projection drops, rewrites, or diagnostic-wraps it before S3 consumption.

## 15. S5_FREEZE_GATE validation status

Gate result vocabulary:

```text
S5_FREEZE_GATE = pass | fail | not_run
```

Current status:

```text
S5_FREEZE_GATE = pass
hard-now subset = implemented and tested
S5 producer freeze-gate obligations = pass
S3 consumer execution status = pending_s3_owned_validation
```

The pass claim is deliberately narrow: S5 has frozen and validated the S5-produced paper-context packets, diagnostics, idempotency behavior, readiness distinctions, and exported S3 guard fixtures. S3 still owns orchestration, rendering, paper packet construction, final triage, and consumer-side execution validation.

The exact runtime `freezeGate.passedChecks` / `validationItems` set is:

```text
contract_snapshot_pass_schema
whole_visible_packet_key_value_guard
generic_threat_leakage_corpus
b2_b4_stable_rows_and_diagnostics
paper_endpoint_idempotency_replay_conflict_matrix
source_kg_not_prepared_distinction
appendix_visibility_fail_closed
s5_exported_consumer_guard_fixtures
malformed_forbidden_leakage_classes_fail_closed
```

Every `validationItems[]` entry includes:

```text
id
status = pass
scope
evidenceRefs
testCommands
lastVerified
```

`freezeGate.missingValidationItems` is `[]`.

Freeze-gate tests in `services/knowledge-base/tests/test_paper_context_freeze_gate.py` cover:

1. exact contract snapshot pass schema and validation item manifest;
2. key-aware whole-visible-packet leakage/final-authority validator;
3. generic Threat KB leakage corpus for CVE/GHSA/fix-commit/advisory/exploit-writeup/patch-text markers;
4. S5-exported B2/B4 stable row and diagnostic fixture validation;
5. ledger-backed idempotency replay/conflict matrix across prepare, finding-context, source-kg exploration, and threat-context endpoints;
6. unprepared Source KG `not_available` vs prepared anchor miss `no_hit` distinction;
7. appendix/non-mainline visibility fail-closed behavior across all paper endpoints;
8. S5-exported S3 consumer guard fixture packaging with S3 execution explicitly pending;
9. malformed `forbiddenLeakageClasses` fail-closed permutations: missing, partial, extra, wrong-case, duplicate.

Timeout/liveness update for S3 WR `s3-to-s5-align-paper-api-calls-with-no-absolute-timeout-liveness-policy` remains:

```text
S5 paper endpoints remain synchronous and bounded by internal work shape.
X-Timeout-Ms is optional and not a semantic terminal deadline.
S3 may wait without a fixed absolute read deadline while S5 remains alive/progressing.
```

S5/Threat KB contributions to RQ5 may now be treated as S5-freeze-gate-ready producer context, still bounded by the no-final-verdict and S3-owned consumer execution boundaries above.

## 16. Verification evidence

Fresh verification from the S5 Source KG coverage/exploration WR:

```text
Focused paper API + freeze gate coverage/exploration regression:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
     -> 60 passed in 130.04s.

Compile check:
cd services/knowledge-base && .venv/bin/python -m compileall app/paper_context app/routers/paper_context_api.py app/contracts/paper_context.py
     -> passed.

Deterministic non-overlap fixture:
tests/test_paper_context_api_contract.py::test_finding_context_reports_non_overlapping_source_kg_coverage
     -> reproduces requested main.cpp:35 against returned main.cpp:1-24 and asserts surfaceStatus=partial, contextCoverage.coverageStatus=non_overlapping, lineOverlap=false, and diagnostic S5_PAPER_CONTEXT_NON_OVERLAPPING.
```

Fresh verification from the S3 observability alignment WR:

```text
TDD RED for missing paper-path observability:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py -q
     -> 4 failed, 0 passed initially.
     Expected failures: paper contract missing generated X-Request-Id; paper POST missing body requestId response echo;
     paper lifecycle logs absent; malformed paper request missing generated request id and sanitized validation log.

TDD RED for paper contract lifecycle logging:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py::test_paper_contract_logs_request_lifecycle_with_generated_request_id -q
     -> 1 failed in 1.25s.
     Expected failure: GET /v1/contracts/paper-context did not log S5 paper endpoint start/end.

Focused observability GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py -q
     -> 5 passed in 5.49s.

Focused observability + paper contract GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py -q
     -> 18 passed in 30.24s.

Regression catch and fix:
cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 1 failed, 764 passed in 583.16s.
     Failure: legacy non-paper /v1/search without X-Request-Id received a generated response header.

Post-fix paper/freeze regression GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
     -> 53 passed in 94.53s.

Post-fix full S5 service-root GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 765 passed in 586.87s.

Compile check:
cd services/knowledge-base && .venv/bin/python -m compileall -q app/main.py app/routers/paper_context_api.py app/routers/contracts_api.py
     -> passed.
```

Fresh verification from the S5 freeze-gate implementation session:

```text
TDD RED baseline:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_freeze_gate.py -q
     -> 6 failed, 9 passed in 26.42s.
     Expected failures: contract still advertised not_run, unprepared Source KG still returned no_hit,
     freeze_gate module was absent, and ledger-backed idempotency records were absent.

Focused freeze-gate GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_freeze_gate.py -q
     -> 34 passed in 114.79s.

Focused + hard-now contract GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
     -> 47 passed in 172.05s.
```

Critic implementation validation initially found one blocker:

```text
validate_visible_packet() did not reject uppercase final-authority keys TP / FP / UNKNOWN.
```

S5 then added a dedicated regression and fixed the validator:

```text
RED for blocker:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_freeze_gate.py::test_whole_visible_packet_validator_rejects_uppercase_final_authority_keys -q
     -> 1 failed in 1.38s.

GREEN for blocker:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_freeze_gate.py::test_whole_visible_packet_validator_rejects_uppercase_final_authority_keys -q
     -> 1 passed in 1.27s.

Post-fix focused + hard-now contract GREEN:
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_freeze_gate.py tests/test_paper_context_api_contract.py -q
     -> 48 passed in 230.45s.

Post-fix audit wrapper GREEN:
cd services/knowledge-base && .venv/bin/python scripts/paper-freeze-gate.py
     -> status pass; nested pytest 48 passed in 382.52s; passedChecks matched the exact freeze-gate set.
```

Related and full-service verification:

```text
Compile + Source KG/Judge related regression:
cd services/knowledge-base && .venv/bin/python -m compileall -q app/paper_context app/contracts/paper_context.py app/routers/paper_context_api.py scripts/paper-freeze-gate.py && .venv/bin/python -m pytest tests/test_source_code_kg_contract_v1.py tests/test_source_code_kg_v1.py tests/test_judge_api_contract_v1.py -q
     -> 129 passed in 189.06s.

Full S5 service-root suite:
cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 759 passed in 1655.67s.
```

Critic validation:

```text
Plan validation: PASS_WITH_CHANGES.
Required changes incorporated: S5-only producer/exported-fixture claim, S3 consumer execution pending;
ledger-backed endpoint-scoped idempotency using provider_observation; mandatory audit wrapper;
appendix visibility frozen as fail_closed_unsupported; canonical docs updated only after GREEN + Critic.

Implementation validation #1: REJECT.
Blocker: uppercase TP/FP/UNKNOWN keys were not rejected by whole-packet validator.

Implementation validation #2: PASS.
Previous blocker closed; S5_FREEZE_GATE may be marked pass for S5-owned producer/exported-fixture obligations,
while S3 consumer execution remains pending S3-owned validation.
```

Retained earlier evidence from hard-now and timeout/liveness sessions:

```text
Hard-now targeted: 13 passed in 23.11s.
Hard-now related regression: 142 passed in 146.41s.
Timeout/liveness targeted: 13 passed in 28.00s.
Timeout/liveness related regression: 142 passed in 139.72s.
Previous full S5 service-root suite before freeze-gate expansion: 725 passed in 667.66s.
```

## 17. Open implementation items after S5_FREEZE_GATE pass

Completed in the Source KG coverage/exploration update:

1. additive `contextCoverage` diagnostics on finding-context responses;
2. same-file line-disjoint coverage represented as `surfaceStatus=partial` plus `S5_PAPER_CONTEXT_NON_OVERLAPPING`;
3. `explore_source_kg` endpoint for bounded source slice/function/symbol/caller/callee/neighborhood/data-flow exploration;
4. freeze-gate endpoint matrices expanded to include `explore_source_kg`.

Completed for the S5 producer freeze gate:

1. paper-context contract snapshot with exact freeze-gate pass schema;
2. paper-facing Pydantic request models and projection service;
3. Code KB prepare over real Source KG ingest/context readiness;
4. finding context retrieval over real Source KG context selection;
5. generic Threat KB projection over real threat retrieval internals plus taxonomy/API fallback;
6. key-aware visible-packet sanitizer and validator;
7. Source KG not-prepared vs valid anchor no-hit state distinction;
8. ledger-backed endpoint-scoped idempotency replay/conflict behavior for all paper endpoints;
9. S5-exported B2/B4/S3 consumer guard fixture validator and freeze-gate audit wrapper;
10. TDD freeze-gate and related regression evidence plus Critic implementation validation.

Remaining outside S5's producer freeze gate:

1. S3-owned consumer execution/renderer validation over S5-exported guard fixtures;
2. S3-owned paper packet construction, scoring, and final triage validation;
3. optional broader CI placement by S2/S3 if they want the S5 freeze wrapper in shared pipelines;
4. commit hygiene for local ledger artifacts before any repository commit.
