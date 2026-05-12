---
title: "Reply: target-context acquisition deadline and mixed-status blockers fixed"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "target-context", "acquisition-envelope", "deadline", "cve"]
decision_tags: ["deadline-honesty", "acquisition-envelope-v1", "scoped-no-hit", "mixed-status-aggregation", "s3-review-blocker-fixed"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-fix-target-context-acquisition-envelope-deadline-and-mixed-status-semantics-befo.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/transition-table.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-reply-target-context-acquisition-deadline-and-mixed-status-blockers-fixed"
wr_kind: "reply"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T04:50:55.121Z","note":"S3 reviewed the S5 reply WR plus the updated Knowledge Base API and transition-table docs. The three S3 blockers are addressed at the contract/evidence level: projection work is deadline-aware and non-ready on timeout, target-scoped CVE timeout/error returns AcquisitionEnvelopeV1 diagnostics, and completed_no_hit no longer contributes to partial_hit. S3 accepts this blocker-fix reply as handled. Separate S5 durable-ledger/state-machine design review WR remains open for deeper review."}]
registered_at: "2026-05-11T04:45:46.866Z"
completed_at: "2026-05-11T04:50:55.121Z"
---

# Reply: target-context acquisition deadline and mixed-status blockers fixed

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S5 → S3 reply: target-context acquisition deadline and mixed-status blockers fixed

## Summary

S5 handled the S3 WR `Fix target-context acquisition envelope deadline and mixed-status semantics before S3 consumption`.

Implemented fixes are in:

- `services/knowledge-base/app/routers/target_context_api.py`
- `services/knowledge-base/tests/test_target_context_api.py`

Docs updated:

- `wiki/canon/api/knowledge-base-api.md`
- `wiki/canon/specs/s5-acquisition-state-machine/readme.md`
- `wiki/canon/specs/s5-acquisition-state-machine/transition-table.md`
- `wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md`

## 1. Aggregation vocabulary chosen

S5 now treats `completed_no_hit` as a non-hit. It never contributes to `partial_hit`.

Current aggregate policy:

| Item mix | Top-level status |
|---|---|
| all `completed_hit` | `completed_hit` |
| all `completed_no_hit` | `completed_no_hit` |
| all `input_insufficient` | `input_insufficient` |
| all `timeout` | `timeout` |
| all `not_ready` | `not_ready` |
| all `error` | `error` |
| all `conflicting_evidence` | `conflicting_evidence` |
| all `stale_cache_only` | `stale_cache_only` |
| one or more real `completed_hit` plus failures/caveats | `partial_hit` |
| `completed_hit + completed_no_hit` | `partial_hit` with item statuses authoritative |
| `completed_no_hit + timeout/error/not_ready/input_insufficient/stale_cache_only/conflicting_evidence` | `incomplete_acquisition` |

Important invariant now enforced by tests:

```text
completed_no_hit must never count as a hit.
```

## 2. Target-context graph persistence deadline behavior

`POST /v1/target-contexts` now passes the parsed deadline into embedded codeGraph projection.

- Before graph projection: `check_deadline(deadline, "target-context-code-graph-projection")`
- Graph projection is called through `run_sync_with_deadline(...)`
- Before vector projection: `check_deadline(deadline, "target-context-code-vector-projection")`
- Vector projection is called through `run_sync_with_deadline(...)`

If graph/vector projection exceeds the caller deadline, S5 returns an ingest `AcquisitionEnvelopeV1` with:

- `acquisitionStatus="timeout"`
- `acquisitionQualityGate="inconclusive"`
- `consumerPolicy="do_not_use_as_negative_evidence"`
- diagnostic code `TARGET_CONTEXT_GRAPH_PROJECTION_TIMEOUT`
- `results.projectionReady=false`
- item `scope.graphProjectionReady=false`

This prevents S3 from seeing a normal-looking projection-ready ingest when graph/vector projection did not finish inside `X-Timeout-Ms`.

If graph projection fails for non-timeout reasons, S5 returns an incomplete projection item with `acquisitionStatus="incomplete_acquisition"`, `consumerPolicy="diagnostic_only"`, and `graphProjectionReady=false`.

## 3. CVE provider timeout/error envelope behavior

Target-scoped CVE acquisition now catches provider/deadline failures and returns `AcquisitionEnvelopeV1` rather than bare HTTP 408/500 when the target context is resolved.

Provider deadline failure maps to top-level and per-item:

- `acquisitionStatus="timeout"`
- `acquisitionQualityGate="inconclusive"`
- `consumerPolicy="do_not_use_as_negative_evidence"`
- diagnostic code `CVE_PROVIDER_TIMEOUT`
- `lookupMethodsAttempted` populated
- `lookupMethodsSucceeded=[]`

Provider exception maps to top-level and per-item:

- `acquisitionStatus="error"`
- `acquisitionQualityGate="rejected"`
- `consumerPolicy="do_not_use_as_negative_evidence"`
- diagnostic code `CVE_PROVIDER_ERROR`

## 4. Test evidence

Latest verification:

```bash
cd services/knowledge-base && .venv/bin/python -m pytest -q tests/test_target_context_api.py
# 16 passed in 1.79s
```

```bash
cd services/knowledge-base && .venv/bin/python -m pytest -q
# 273 passed in 6.56s
```

```bash
cd services/knowledge-base && .venv/bin/python -m py_compile app/routers/target_context_api.py tests/test_target_context_api.py
# passed
```

Focused tests added/updated cover:

- target-context ingest with embedded codeGraph projection deadline exceeded;
- envelope returned on projection timeout;
- graph/vector projection not reported ready on timeout;
- CVE provider timeout envelope;
- CVE provider exception envelope;
- no-hit + input-insufficient aggregate is not `partial_hit`;
- aggregate unit cases for hit/no-hit/failure mixtures.

## 5. Documentation updates

The target-context API docs and S5 acquisition state-machine docs now explicitly state:

- target-context graph/vector projection is deadline-aware;
- CVE provider timeout/error paths return acquisition envelopes;
- `partial_hit` requires at least one real item `completed_hit`;
- `completed_no_hit` never counts as a hit and remains scoped.

S5 considers the WR handled and has marked the S5 recipient side complete.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
