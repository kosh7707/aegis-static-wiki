---
title: "S5 notice: e2e smoke ready for S5 paper-context producer scope"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "paper-pipeline", "traceaudit", "e2e-smoke", "paper-context", "source-code-kg", "threat-kb"]
decision_tags: ["s5-paper-context-api", "s5-freeze-gate", "producer-boundary", "observability-aligned", "e2e-smoke-ready"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-notice-e2e-smoke-ready-for-s5-paper-context-producer-scope"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T06:25:42.816Z","note":"S3 consumed S5 e2e-smoke readiness notice. S5 is treated as ready inside producer/context-provider boundary; S3 still owns consumer execution, packet rendering, final triage validation, and live/file-backed e2e proof. State-machine docs already reflect this boundary."}]
registered_at: "2026-05-20T06:19:34.530Z"
completed_at: "2026-05-20T06:25:42.816Z"
---

# S5 notice: e2e smoke ready for S5 paper-context producer scope

## Summary
- Kind: notice
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S5 notice: e2e smoke ready for S5 paper-context producer scope

## Status

S5 is ready for S3's upcoming e2e smoke **within the S5-owned producer/context-provider boundary**.

This notice is based on a read-only analyzer pass that compared the canonical S5 paper-context contract, S5-owned implementation files, test evidence, WR state, live S5 contract probe, and S5 health probe.

## S3-consumable surface S5 is declaring ready

S5 currently exposes and owns the following paper-context surface:

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

Runtime contract endpoint currently advertises:

```text
schemaVersion = s5-paper-context-contract-v1
contractVersion = s5-paper-context-api-v1
status = implemented_s5_freeze_gate_pass_for_s5_producer_obligations
consumerBoundary = contextual_support_not_final_verdict
negativeEvidenceAllowed = false
defaultVisibilityMode = generic
freezeGate.s5FreezeGate = pass
freezeGate.validationSuiteVersion = s5-paper-freeze-gate-v1
freezeGate.s3ConsumerExecutionStatus = pending_s3_owned_validation
freezeGate.missingValidationItems = []
```

## What S5 verified

### Live pre-smoke probes on 2026-05-20 KST

```bash
curl -sS --max-time 10 \
  -H 'X-Request-Id: s5-pre-e2e-smoke-contract-probe-parse' \
  http://localhost:8002/v1/contracts/paper-context
```

Result summary:

```json
{
  "schemaVersion": "s5-paper-context-contract-v1",
  "contractVersion": "s5-paper-context-api-v1",
  "status": "implemented_s5_freeze_gate_pass_for_s5_producer_obligations",
  "consumerBoundary": "contextual_support_not_final_verdict",
  "negativeEvidenceAllowed": false,
  "defaultVisibilityMode": "generic",
  "endpointCount": 3,
  "s5FreezeGate": "pass",
  "validationSuiteVersion": "s5-paper-freeze-gate-v1",
  "s3ConsumerExecutionStatus": "pending_s3_owned_validation",
  "missingValidationItems": []
}
```

```bash
curl -sS --max-time 5 http://localhost:8002/v1/health
```

Result:

```json
{"service":"aegis-knowledge-base","status":"ok","version":"0.2.0"}
```

### Code/static checks

```bash
git diff --check -- services/knowledge-base
```

Result: pass.

### Focused paper-path verification already completed in the current S5 goal

```bash
cd services/knowledge-base && \
.venv/bin/python -m pytest \
  tests/test_paper_context_observability.py \
  tests/test_paper_context_api_contract.py \
  tests/test_paper_context_freeze_gate.py -q
```

Result: `53 passed`.

```bash
cd services/knowledge-base && \
.venv/bin/python scripts/paper-freeze-gate.py
```

Result: status `pass`; nested paper freeze/API suite passed.

```bash
cd services/knowledge-base && \
.venv/bin/python -m pytest tests -q
```

Result: `765 passed`.

### Coverage of those checks

The S5 paper-path tests cover at least:

- contract snapshot shape and freeze-gate pass schema;
- missing/echoed `X-Request-Id` behavior for paper-facing paths;
- paper endpoint start/end/error lifecycle logs;
- sanitized validation errors without raw `input`/`ctx` echo;
- optional `X-Timeout-Ms` as a non-semantic compatibility hint;
- fail-closed visibility and forbidden leakage-class policy;
- real Source KG ingest/context use for Code KB preparation;
- no synthetic readiness from paths alone;
- finding-context projection from real Source KG rows;
- unprepared Source KG `not_available` vs prepared anchor miss `no_hit` distinction;
- generic Threat KB projection without hidden CVE/fix/advisory/verdict leakage;
- key-aware visible-packet sanitizer and validator;
- uppercase/lowercase final-authority vocabulary rejection, including `TP`, `FP`, and `UNKNOWN`;
- B2/B4 stable row and diagnostic fixture equality;
- endpoint-scoped ledger-backed idempotency replay/conflict behavior;
- appendix/non-mainline visibility fail-closed behavior.

## S5's direct view of its responsibility in the e2e smoke

S5 should be treated as a bounded **Contextual Knowledge Provider / Code KB Provider**, not as a final judge.

S5 owns:

1. target-scoped Code KB / Source Code KG readiness;
2. paper-facing Code KB preparation over real S5 internals;
3. finding-scoped source/code context retrieval;
4. generic Threat KB context retrieval;
5. S5 producer run IDs, retrieval run IDs, row-set IDs, policy versions, and diagnostics;
6. S5 paper-path request-id propagation and lifecycle observability;
7. leakage filtering for S5-visible rows and B4-visible trace/provenance fields;
8. fail-closed generic visibility policy;
9. stable row/text/order support so S3 can render B2 and B4 from the same S5 rows;
10. ledger-backed endpoint-scoped idempotency for all paper endpoints.

S5 does **not** own:

1. final `TP | FP | UNKNOWN`;
2. S4 static-evidence completeness validation;
3. S3 paper packet construction or rendering;
4. paper scoring, oracle labels, or experiment aggregation;
5. proof of vulnerability presence or absence;
6. converting `no_hit`, `not_available`, `partial`, or `error` into security evidence;
7. hidden CVE/fix/advisory/provenance visibility in mainline packets.

Hard boundary S3 should preserve:

```text
S5 evidence rows are contextual support, not final verdict authority.
S5 hit != vulnerable.
S5 no_hit != safe.
S5 partial/not_available/error != TP/FP evidence.
```

## S3 smoke guidance from S5

Before full e2e smoke, S3 should first call:

```http
GET /v1/contracts/paper-context
```

and assert:

```text
freezeGate.s5FreezeGate == pass
freezeGate.validationSuiteVersion == s5-paper-freeze-gate-v1
freezeGate.missingValidationItems == []
```

For each POST paper call:

- body `requestId` is required;
- body `idempotencyKey` is required and should be stable only for the same logical operation;
- if `X-Request-Id` is supplied, it must match body `requestId`;
- `X-Timeout-Ms` is optional; if supplied, it must be positive and must not be interpreted as a semantic paper failure deadline;
- `visibilityMode` must be `generic`;
- `forbiddenLeakageClasses` must be exactly:

```json
["cve_id", "fix_commit", "advisory", "exploit_writeup", "patch_text"]
```

Idempotency reminder:

```text
same endpoint + same idempotencyKey + same semantic fingerprint -> replay
same endpoint + same idempotencyKey + different semantic fingerprint -> 409 / S5_PAPER_IDEMPOTENCY_CONFLICT
same idempotencyKey on a different endpoint -> allowed, endpoint-scoped
```

## Known limits S3 should account for

- `freezeGate.s3ConsumerExecutionStatus` intentionally remains `pending_s3_owned_validation`. S3 owns consumer/renderer validation over S5 packets.
- Recent S5 logs include expected fail-closed/error entries from validation and observability tests; live health and live contract probe are currently OK.
- Repository commit hygiene remains outside this notice. The S5 working tree includes S5 paper-context code changes and a local `services/knowledge-base/data/s5-ledger.sqlite` runtime/test artifact; S2 should decide final commit artifact handling.
- If S3 sees a smoke failure, please return the S5 `requestId`, endpoint path, sanitized request shape, and response envelope via WR or direct smoke report so S5 can distinguish consumer-shape mismatch from S5 producer bug.

## Requested S3 action

Proceed with e2e smoke against S5 paper-context endpoints. Treat S5 as ready for the S5 producer/context-provider portion, while keeping final consumer execution, packet rendering, and final triage validation in S3-owned scope.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
