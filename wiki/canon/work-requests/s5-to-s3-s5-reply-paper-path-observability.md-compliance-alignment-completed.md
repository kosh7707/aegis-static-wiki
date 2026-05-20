---
title: "S5 reply — paper-path observability.md compliance alignment completed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "observability", "paper", "knowledge-base"]
decision_tags: ["request-id-propagation", "structured-logs", "paper-path", "completed"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s4-s5-paper-path-observability.md-compliance-alignment-request.md", "wiki/canon/specs/observability.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/handoff/s5/session-s5-paper-observability-alignment-20260520.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-reply-paper-path-observability.md-compliance-alignment-completed"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T06:25:27.094Z","note":"S3 consumed S5 paper-path observability completion. S3 cleanup removed legacy X-AEGIS-Timeout-Policy emission and now relies on X-Request-Id for S3↔S5 event correlation. Verified with focused paper-path tests, related observability/S4 ownership tests, full analysis-agent pytest, compileall, and diff-check. Live e2e smoke remains separate/pending."}]
registered_at: "2026-05-20T05:40:57.440Z"
completed_at: "2026-05-20T06:25:27.094Z"
---

# S5 reply — paper-path observability.md compliance alignment completed

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply

S5 accepts and has completed the S5-owned portion of S3's paper-path observability alignment request.

## Files changed

S5 code/tests:

```text
services/knowledge-base/app/main.py
services/knowledge-base/app/routers/contracts_api.py
services/knowledge-base/app/routers/paper_context_api.py
services/knowledge-base/tests/test_paper_context_observability.py
```

Canonical documentation/evidence:

```text
wiki/canon/api/s5-paper-context-api.md
wiki/canon/handoff/s5/session-s5-paper-observability-alignment-20260520.md
```

## Implemented behavior

Paper-facing endpoints covered:

```http
GET  /v1/contracts/paper-context
POST /v1/paper/code-kb/prepare
POST /v1/paper/finding-context/retrieve
POST /v1/paper/threat-context/generic
```

RequestId behavior:

- Supplied `X-Request-Id` is stored in request context and returned in `X-Request-Id`.
- Missing `X-Request-Id` on `GET /v1/contracts/paper-context` generates and returns `req-{uuid}`.
- Missing `X-Request-Id` on `POST /v1/paper/*` preserves the existing S5 paper contract by using body `requestId` as the operation request id and returning it in `X-Request-Id`.
- Supplied `X-Request-Id` on `POST /v1/paper/*` must still match body `requestId`; mismatch remains `400 / S5_PAPER_SCHEMA_INVALID`.
- Legacy non-paper S5 no-header behavior is preserved after regression catch; S5 did not silently broaden this WR beyond the paper path.

Malformed request validation:

- Paper validation errors return the common envelope: `success=false`, `error`, `errorDetail.code/message/requestId/retryable`.
- Paper schema validation uses `S5_PAPER_SCHEMA_INVALID`.
- Validation error rendering strips raw Pydantic `input`/`ctx`, so malformed requests do not echo caller secrets such as URLs with credentials or query tokens.
- Missing paper request header still receives a generated/request-context id in the validation error response and `X-Request-Id` response header.

Structured lifecycle logging:

- Paper endpoint logs emit `S5 paper endpoint start`, `S5 paper endpoint end`, and `S5 paper endpoint error`.
- Logs include numeric `level`, epoch-ms `time`, `service=s5-kb`, `msg`, and `requestId` through the existing JSONL logger.
- Lifecycle extras include `method`, `path`, `caseId`, `buildTargetId`, `paperRunId`, optional `findingId`, `status`, `elapsedMs`, and S5 producer/retrieval ids where available.

Representative field list:

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

Service-to-service caveat:

- Current S5 paper-context endpoints call S5 internals/ledger directly and do not perform outbound HTTP service-to-service calls. Therefore no outbound `target/method/path/status/elapsedMs` pair is applicable for this S5 paper path right now.

## Test evidence

TDD RED:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py -q
     -> 4 failed, 0 passed initially.
```

Additional RED for `GET /v1/contracts/paper-context` lifecycle logging:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py::test_paper_contract_logs_request_lifecycle_with_generated_request_id -q
     -> 1 failed in 1.25s.
```

Focused GREEN:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py -q
     -> 5 passed in 5.49s.

cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py -q
     -> 18 passed in 30.24s.
```

Regression catch and fix:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 1 failed, 764 passed in 583.16s.
     Failure: legacy non-paper /v1/search without X-Request-Id received a generated response header.
```

Post-fix regression GREEN:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_observability.py tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
     -> 53 passed in 94.53s.

cd services/knowledge-base && .venv/bin/python -m compileall -q app/main.py app/routers/paper_context_api.py app/routers/contracts_api.py
     -> passed.

cd services/knowledge-base && .venv/bin/python -m pytest tests -q
     -> 765 passed in 586.87s.
```

## Status

S5 side is complete for this WR. S3 can now consume the S5 paper endpoints with requestId-correlated JSONL logs and sanitized common error envelopes on paper-path failures.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
