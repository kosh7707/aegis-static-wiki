---
title: "S5 Current Implementation Snapshot — 2026-05-20"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/knowledge-base/app/main.py"
  - "services/knowledge-base/app/contracts/paper_context.py"
  - "services/knowledge-base/app/observability.py"
  - "services/knowledge-base/app/routers/contracts_api.py"
  - "services/knowledge-base/app/routers/paper_context_api.py"
  - "services/knowledge-base/app/paper_context/service.py"
  - "services/knowledge-base/app/paper_context/freeze_gate.py"
  - "services/knowledge-base/tests/test_paper_context_observability.py"
  - "services/knowledge-base/tests/test_paper_context_api_contract.py"
  - "services/knowledge-base/tests/test_paper_context_freeze_gate.py"
last_verified: "2026-05-21"
service_tags: ["s5", "knowledge-base", "paper-context", "source-code-kg", "threat-kb", "judge", "observability", "log-analyzer"]
decision_tags: ["current-state", "s5-freeze-gate", "producer-boundary", "canonical-jsonl", "request-id-traceability", "paper-api", "source-code-kg", "threat-kb"]
related_pages: ["wiki/canon/handoff/s5/readme.md", "wiki/canon/handoff/s5/architecture.md", "wiki/canon/roadmap/s5-roadmap.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/handoff/s5/session-s5-log-analyzer-traceability-20260520.md", "wiki/canon/work-requests/s5-to-s3-s5-reply-canonical-jsonl-logging-and-log-analyzer-traceability-verified-before-e.md", "wiki/canon/work-requests/s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r.md", "wiki/canon/work-requests/s5-to-s3-s3-consume-s5-source-kg-partial-quality-gate-in-paper-context-flow.md"]
---

# S5 Current Implementation Snapshot — 2026-05-20

> This page is the canonical S5 current-state pointer for documents that predate the 2026-05-20 paper-context/freeze-gate/observability work. Historical pages remain useful for design rationale, but this snapshot is the preferred entry point for active S5 implementation state.

## Bootstrap contract for fresh S5 sessions

Use this page as the compact current-state pointer after reading `docs/AEGIS.md`, `docs/mcp.md`, and [[wiki/canon/handoff/s5/readme]]. A fresh S5 session should not start from historical `docs/**` material or old session logs unless this page links there for a specific reason.

Immediate S5 bootstrap checklist:

```text
1. Confirm lane scope: services/knowledge-base/** only.
2. Check open S5 WRs through list_my_open_wrs(lane="s5", include_to_all=true).
3. Use wiki/canon/api/s5-paper-context-api.md for S3 paper-context consumption.
4. Use wiki/canon/api/knowledge-base-api.md for broader S5/Judge/Source KG contracts.
5. Use log-analyzer for runtime/request tracing; do not scrape logs first unless the MCP is unavailable.
6. Do not claim live certmaker prepare output is partial until prepare_code_kb is rerun after the idempotency v2 patch.
```

## Status summary

S5 / Knowledge Base is ready for S3 e2e smoke within the S5-owned producer/context-provider boundary. After the live certmaker Source KG quality check on 2026-05-20, S5 now distinguishes selectable Source KG presence from complete graph quality: smoke/manual harness or low-confidence Source KG bundles are returned as `surfaceStatus=partial` with `sourceKgQualityGate=accepted_with_caveats`, not as clean `produced` Code KB readiness.

S3 consumer action is required for the additive paper-context contract update: `stageReadiness=ready` and `readiness.contextSelectable=true` still allow S3 to consume `codeKbRef`/`sourceKgRef`, but `readiness.sourceKgQualityGate=accepted_with_caveats` must be preserved as a graph-quality caveat and must not be rendered as complete/high-confidence Source KG coverage.

Current live-facing status:

```text
Service: s5-kb
Port: 8002
Canonical log file: /home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl
Paper contract endpoint: GET /v1/contracts/paper-context
S5 freeze gate: pass
S3 consumer execution status: pending_s3_owned_validation
Open S5 WRs: none at the time of this refresh
Outgoing S5->S3 WR: consume sourceKgQualityGate=accepted_with_caveats
```

## Active responsibilities

S5 owns:

1. Threat KB / GraphRAG retrieval and supporting corpus/index state.
2. Source Code KG / Code KB ingest, selectors, context retrieval, and Source KG diagnostics.
3. Judge/Threat Retrieval/Analyst Brief contracts as contextual support surfaces.
4. Paper-facing contextual evidence for TraceAudit through the S5 Paper Context API.
5. S5 producer run IDs, retrieval run IDs, policy versions, diagnostics, canonical JSONL logs, and log-analyzer traceability.
6. Leakage filtering and no-final-verdict enforcement for S5-visible paper packets.
7. Stable row/text/order support for S3 B2/B4 rendering inputs.

S5 does not own:

1. final `TP | FP | UNKNOWN`;
2. proof of vulnerability presence or absence;
3. S4 static-evidence completeness;
4. S3 paper packet rendering, scoring, oracle labels, or final triage;
5. hidden CVE/fix/advisory/provenance visibility in mainline paper packets.

Hard boundary:

```text
S5 evidence rows are contextual support, not final verdict authority.
S5 hit != vulnerable.
S5 no_hit != safe.
S5 partial/not_available/error != TP/FP evidence.
```

## Active paper-facing API

Implemented S3-consumable S5 paper surface:

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

Runtime contract claims expected from `GET /v1/contracts/paper-context`:

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
policies.sourceKgQualityGatePolicy = selectable_context_may_be_partial_with_caveats
policies.sourceKgQualityDiagnostics = [
  S5_PAPER_SOURCE_KG_SMOKE_HARNESS_PROVENANCE,
  S5_PAPER_SOURCE_KG_LOW_CONFIDENCE_EDGES,
  S5_PAPER_SOURCE_KG_NODE_SNIPPET_COVERAGE_EMPTY,
  S5_PAPER_SOURCE_KG_EDGE_COVERAGE_EMPTY,
  S5_PAPER_SOURCE_KG_RICH_IR_NOT_AVAILABLE
]
policies.sourceKgPartialReadiness.surfaceStatus = partial
policies.sourceKgPartialReadiness.stageReadiness = ready
policies.sourceKgPartialReadiness.sourceKgQualityGate = accepted_with_caveats
policies.sourceKgPartialReadiness.negativeEvidenceAllowed = false
```

## Implementation mapping

Primary paper-context implementation files:

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

Wiring and observability files:

```text
services/knowledge-base/app/main.py
services/knowledge-base/app/observability.py
services/knowledge-base/app/routers/contracts_api.py
```

S5 logging setup:

```text
setup_logging("s5-kb", log_file_name="aegis-knowledge-base")
```

Default log sink:

```text
/home/kosh/AEGIS/logs/aegis-knowledge-base.jsonl
```

## Current verification evidence

Recent S5 verification evidence retained in canonical docs/session history:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
  -> 53 passed

cd services/knowledge-base && .venv/bin/python scripts/paper-freeze-gate.py
  -> status pass; nested paper freeze/API suite passed

cd services/knowledge-base && .venv/bin/python -m pytest tests -q
  -> 765 passed

cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py -q
  -> 18 passed in 37.47s

cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_api_contract.py tests/test_paper_context_observability.py tests/test_paper_context_freeze_gate.py tests/test_source_code_kg_v1.py tests/test_source_code_kg_contract_v1.py -q
  -> 143 passed in 154.34s

curl -sS http://localhost:8002/v1/contracts/paper-context
  -> policies.sourceKgQualityGatePolicy/sourceKgQualityDiagnostics/sourceKgPartialReadiness present

git diff --check -- services/knowledge-base
  -> pass
```

Live pre-smoke observability proof on 2026-05-20 used these request IDs:

```text
s5-logproof-contract-20260520-001
s5-logproof-prepare-20260520-001
s5-logproof-finding-20260520-001
s5-logproof-threat-20260520-001
```

`log-analyzer.trace_request` found all four request IDs from `/home/kosh/AEGIS/logs` with S5 start/end lifecycle rows.

## Health endpoint note

`GET /v1/health` is a liveness probe. It echoes `X-Request-Id` through middleware when the header is supplied, but it intentionally has no explicit lifecycle log in the current S5 implementation. Use `GET /v1/contracts/paper-context` and `POST /v1/paper/*` endpoints for pre-e2e log-analyzer proof.

## Document maintenance rule

For active S5 work after 2026-05-20:

1. Update the canonical wiki first.
2. Treat old local `docs/**` paths as migration/archive surfaces only.
3. Use this snapshot plus the active API/spec pages as the current source of truth.
4. Do not rewrite historical session pages except to add a narrow correction link if a historical page would otherwise mislead active work.
