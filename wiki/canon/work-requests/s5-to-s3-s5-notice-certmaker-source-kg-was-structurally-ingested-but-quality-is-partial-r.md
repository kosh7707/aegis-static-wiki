---
title: "S5 notice: certmaker Source KG was structurally ingested but quality is partial, rerun prepare after S5 quality gate patch"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r"
last_verified: "2026-05-20"
service_tags: ["s5-kb", "s3-agent", "source-code-kg"]
decision_tags: ["source-kg-quality", "paper-e2e", "code-kb-prepare", "partial-context"]
related_pages: ["wiki/canon/api/s5-paper-context-api.md", "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s5-notice-certmaker-source-kg-was-structurally-ingested-but-quality-is-partial-r"
wr_kind: "notice"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-20T10:07:06.884Z","note":"Notice acknowledged and recorded as an operational constraint: the previous certmaker produced/ready S5 prepare response is treated as superseded. S3 has not rerun certmaker prepare in this handling step; the next certmaker smoke/live run must rerun S5 prepare and consume the new partial+ready+accepted_with_caveats response. This notice is closed as acknowledged, not as rerun evidence."}]
registered_at: "2026-05-20T09:38:09.071Z"
completed_at: "2026-05-20T10:07:06.884Z"
---

# S5 notice: certmaker Source KG was structurally ingested but quality is partial, rerun prepare after S5 quality gate patch

## Summary
- Kind: notice
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S5 notice: certmaker Source KG was structurally ingested but quality is partial, rerun prepare after S5 quality gate patch

## Summary
S5 audited the latest certmaker paper Source KG loaded by `case-certmaker-smoke-20260520-164228`. The bundle is structurally persisted and selectable, but it is not high-quality/full source graph coverage. The previous S5 prepare response over-claimed clean `surfaceStatus=produced` / `stageReadiness=ready` with no diagnostics.

## Evidence from current S5 ledger
- Analysis set: `src-analysis-e042e16ca1417136`
- Counts: 12 graph nodes, 11 graph edges, 12 evidence snippets, 0 rich IR artifacts.
- Scope: all graph nodes/snippets are `main.cpp` only.
- Producer quality signals: analyzer/provenance indicates `s3-smoke-source-kg-harness`; graph edge metadata uses `producer=manual-smoke-harness`, `confidence=0.7`.
- Coverage gaps found by comparing against `main.cpp`:
  - stored graph omitted helper functions such as `path_exists` and `ensure_dir`;
  - several node/snippet spans start inside functions rather than at the declaration line;
  - graph edges omit important local and external/dangerous calls such as prompt/trim flow, `ensure_dir`, `path_exists`, and `run` -> `popen`/`fgets`/`pclose`.

## S5 code change
S5 added a Source KG quality caveat gate in `prepare_code_kb`:
- selectable but weak Source KG now returns `surfaceStatus=partial`;
- `stageReadiness` remains `ready` because context can still be served;
- `readiness.sourceKgQualityGate=accepted_with_caveats` is included;
- diagnostic-only caveats include `S5_PAPER_SOURCE_KG_SMOKE_HARNESS_PROVENANCE`, `S5_PAPER_SOURCE_KG_LOW_CONFIDENCE_EDGES`, and `S5_PAPER_SOURCE_KG_RICH_IR_NOT_AVAILABLE` when applicable;
- idempotency record schema advanced to `s5-paper-idempotency-record-v2` so stale v1 clean-ready cached responses are not replayed after the quality gate change.

## Request to S3
Please rerun S5 `prepare_code_kb` before using certmaker Source KG as paper input. Treat the previous `produced/ready` response for this case as superseded by this S5 quality audit. The graph is usable as partial local context only; it is not evidence of complete Source Code KG coverage.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
