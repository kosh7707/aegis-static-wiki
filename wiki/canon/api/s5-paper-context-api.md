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
last_verified: "2026-05-19"
service_tags: ["s5", "s3", "knowledge-base", "paper-pipeline", "traceaudit", "source-code-kg", "code-kb", "threat-kb", "api-contract"]
decision_tags: ["paper-api", "s5-paper-context-api", "consumer-contract", "s5-freeze-gate", "generic-threat-kb", "visible-leakage-class", "producer-boundary", "b2-b4-evidence-control", "idempotency", "timeout-policy", "critic-reviewed", "implemented-hard-now"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/readme.md", "wiki/canon/work-requests/s3-to-s5-s3-reply-hybrid-timing-for-s5_freeze_gate-implementation.md", "wiki/canon/handoff/s5/session-s5-paper-context-implementation-interview-20260519.md"]
---

# S5 Paper Context API Contract

> Status: **implemented hard-now subset for S3 consumption**.
> Owner: S5 / Knowledge Base lane.
> Consumer: S3 / paper harness.
> Last verified: 2026-05-19.
> Critic status: implementation review `PASS_WITH_CHANGES`; no blocking S5 implementation issue found.
> Implementation status: the `/v1/paper/*` endpoints are implemented in `services/knowledge-base/**` for the S3 HYBRID hard-now subset. `S5_FREEZE_GATE` remains **not_run / not passed** until the second hardening goal completes.

## 1. Scope and boundary

This API makes S5 a bounded **Contextual Knowledge Provider / Code KB Provider** for AEGIS TraceAudit.

Implemented HTTP surface:

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
| Source Code KG ingest/context | `POST /v1/source-code-kg/ingest`, `POST /v1/source-code-kg/context` | `POST /v1/paper/code-kb/prepare`, then code rows in `retrieve_finding_context` |
| Judge / Threat Retrieval | `POST /v1/judge/query`, `GET /v1/contracts/judge` | generic, non-verdict Threat KB rows in `retrieve_generic_threat_context` |

Implemented files:

```text
services/knowledge-base/app/contracts/paper_context.py
services/knowledge-base/app/paper_context/models.py
services/knowledge-base/app/paper_context/service.py
services/knowledge-base/app/routers/paper_context_api.py
services/knowledge-base/tests/test_paper_context_api_contract.py
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

All `POST /v1/paper/*` calls are synchronous JSON calls and require:

```http
Content-Type: application/json
Accept: application/json
X-Timeout-Ms: <positive integer>
```

The contract endpoint `GET /v1/contracts/paper-context` does not require `X-Timeout-Ms`.

Each POST body has required `requestId` and `idempotencyKey`:

```text
requestId: unique per transport attempt.
idempotencyKey: stable for the logical paper operation being retried.
```

If `X-Request-Id` is supplied and differs from body `requestId`, S5 returns `400 / S5_PAPER_SCHEMA_INVALID`.

Paper-specific error codes are preserved in the common error envelope for paper routes, including:

```text
S5_PAPER_TIMEOUT_HEADER_MISSING_OR_INVALID
S5_PAPER_SCHEMA_INVALID
S5_PAPER_VISIBILITY_MODE_UNSUPPORTED
S5_PAPER_FORBIDDEN_LEAKAGE_CLASSES_REQUIRED
S5_PAPER_IDEMPOTENCY_CONFLICT
S5_PAPER_LEAKAGE_POLICY_VIOLATION
```

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
status = implemented_hard_now_subset_freeze_gate_not_passed
defaultVisibilityMode = generic
freezeGate.s5FreezeGate = not_run
freezeGate.hardNowSubsetImplemented = true
```

This endpoint does not itself mean `S5_FREEZE_GATE=pass`.

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

`stageReadiness` values:

```text
ready
ready_with_diagnostics
not_ready
```

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
- Returns `rowSetId`, stable ordered `rows[].itemId`, stable ordered `rows[].text`, and stable ordered `rows[].orderingKey`.
- If no context row matches, returns `surfaceStatus=no_hit`, `rows=[]`, and a diagnostic with `negativeEvidenceAllowed=false`.

Caveat for future hardening: missing/unmapped Source KG preparation currently becomes a diagnostic no-hit style response. A stricter state-machine distinction between “not prepared/unavailable” and “valid anchored no-hit” is a second-goal hardening item.

## 9. Endpoint: `POST /v1/paper/threat-context/generic`

Tool name: `retrieve_generic_threat_context`.

Purpose: return generic Threat KB context for CWE, CAPEC, API misuse, library provenance, and generic security concepts under mainline leakage controls.

Implemented behavior:

- Calls existing `build_threat_retrieval_evidence` over the S5 ledger.
- Projects only allowlisted generic rows: `weaknessSemantics`, `attackSemantics`, explicit CWE/CAPEC taxonomy fallback rows, and API generic security notes.
- Omits raw `candidateEvidence`, advisory IDs, aliases, risk signals, and Judge/affectedness-adjacent fields.
- Emits generic redaction diagnostics with counts/reasons but no hidden identifiers when internal candidates are omitted.
- If no generic rows can be produced, returns `surfaceStatus=no_hit` with diagnostic-only context gap.

## 10. Leakage policy

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

The hard-now implementation applies a baseline recursive sanitizer/validator to paper POST responses before returning them. It covers rows, source refs, producer trace/provenance, retrieval trace, diagnostics, and visible artifact refs represented in the response object. Full synthetic leakage corpus/matrix coverage remains deferred to the second S5_FREEZE_GATE hardening goal.

## 11. Idempotency and retry

S3 must provide:

```text
requestId: unique per transport attempt for observability and replay logs.
idempotencyKey: stable for the logical paper operation being retried.
```

Implemented hard-now behavior:

```text
cache key = (endpoint, idempotencyKey)
stored value = { fingerprint, response }
fingerprint = canonical_json(request body excluding requestId and attempt metadata)
```

Same key + same fingerprint replays the stored paper response. Same key + different fingerprint returns `409 / S5_PAPER_IDEMPOTENCY_CONFLICT`.

This is an in-process run-safety implementation for the first S3-consumable goal; full durable idempotency matrix/hardening remains deferred.

## 12. B2/B4 evidence control

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
- Full B2/B4 regression suite remains deferred to the second freeze-gate hardening goal.

## 13. Forbidden inference and non-verdict language

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

## 14. S5_FREEZE_GATE validation plan

S5_FREEZE_GATE is **not satisfied** by this hard-now implementation alone. It passes only after the second hardening/freeze goal proves the full invariant suite.

Hard-now tests implemented in `services/knowledge-base/tests/test_paper_context_api_contract.py` cover:

1. contract snapshot endpoint shape;
2. timeout header required for all POSTs;
3. non-`generic` visibility fail-closed;
4. missing/incorrect forbidden leakage classes fail-closed;
5. prepare without real Source KG data does not synthesize success;
6. seeded Source KG prepare/retrieve using real `SQLiteLedgerRepository + ingest_source_kg`;
7. no-hit diagnostic with `negativeEvidenceAllowed=false`;
8. whole-visible-field leakage guard over source rows/provenance/refs;
9. non-verdict vocabulary guard;
10. B2/B4 structural fields;
11. idempotency same-key replay and conflict.

Deferred to the second `S5_FREEZE_GATE` goal:

- full generic Threat KB leakage corpus/matrix;
- complete whole-packet leakage fixture matrix;
- full B2/B4 stable-row regression suite;
- full durable idempotency conflict matrix;
- complete S3 consumer guard fixtures;
- appendix/non-mainline visibility extension tests beyond fail-closed;
- exhaustive CI packaging needed to mark `S5_FREEZE_GATE=pass`.

Gate result vocabulary:

```text
S5_FREEZE_GATE = pass | fail | not_run
```

Current status:

```text
S5_FREEZE_GATE = not_run
hard-now subset = implemented and tested
```

Until `pass`, S5/Threat KB contributions to RQ5 remain exploratory or demotable according to the frozen anchor.

## 15. Verification evidence

Fresh verification from the implementation session:

```text
RED: services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q
     -> 4 failed, 9 errors before implementation because paper-context endpoints/modules were missing.

GREEN targeted: services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py -q
     -> 13 passed in 23.11s.

Related regression: services/knowledge-base/.venv/bin/python -m pytest services/knowledge-base/tests/test_paper_context_api_contract.py services/knowledge-base/tests/test_source_code_kg_contract_v1.py services/knowledge-base/tests/test_source_code_kg_v1.py services/knowledge-base/tests/test_judge_api_contract_v1.py -q
     -> 142 passed in 146.41s.

Compile check: services/knowledge-base/.venv/bin/python -m compileall -q services/knowledge-base/app/paper_context services/knowledge-base/app/routers/paper_context_api.py services/knowledge-base/app/contracts/paper_context.py
     -> pass.

Full S5 service-root suite: cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 725 passed in 667.66s.
```

Note: a repo-root invocation of the full S5 suite produced 3 relative-path failures in tests that read `app/main.py` and `scripts/neo4j-seed.py` from the current working directory. Re-running from `services/knowledge-base`, which matches those tests' path assumptions, passed.

Critic validation:

```text
Plan validation #1: REJECT -> plan needed exact schemas/mapping/errors/tests.
Plan validation #2: PASS_WITH_CHANGES -> clarified CWE/CAPEC fallback, idempotency cache, router wiring.
Implementation validation: PASS_WITH_CHANGES -> no blocking S5 implementation issue; docs must state hard-now implemented but S5_FREEZE_GATE not passed.
```

## 16. Open implementation items after hard-now

Completed for the first S3-consumable goal:

1. paper-context contract snapshot implementation;
2. paper-facing Pydantic request models and projection service;
3. Code KB prepare over real Source KG ingest/context readiness;
4. finding context retrieval over real Source KG context selection;
5. generic Threat KB projection over real threat retrieval internals plus taxonomy/API fallback;
6. hard-now safety tests for S3 HYBRID subset.

Remaining for second S5_FREEZE_GATE hardening goal:

1. full synthetic leakage corpus and fixture matrix;
2. durable idempotency or complete conflict matrix, if required by S3 runtime;
3. richer distinction between Source KG not-prepared/unavailable and valid anchored no-hit;
4. complete S3 consumer guard fixtures; S3-owned `paper-analysis-api` updates should be coordinated via S3 rather than silently edited by S5;
5. formal `S5_FREEZE_GATE=pass` CI packaging and audit.
