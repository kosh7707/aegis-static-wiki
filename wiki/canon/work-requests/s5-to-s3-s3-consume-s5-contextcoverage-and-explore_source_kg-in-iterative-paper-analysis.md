---
title: "S3 consume S5 contextCoverage and explore_source_kg in iterative paper analysis"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-consume-s5-contextcoverage-and-explore_source_kg-in-iterative-paper-analysis"
last_verified: "2026-05-22"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "paper-pipeline", "traceaudit", "source-code-kg", "tool-use"]
decision_tags: ["work-request", "source-kg-coverage", "iterative-tool-use", "s5-paper-context-api", "critic-reviewed", "consumer-contract"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-support-needed-context-coverage-diagnostics-and-exploratory-source-kg-query-s.md", "wiki/canon/api/s5-paper-context-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/handoff/s5/session-s5-source-kg-coverage-exploration-20260521.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-consume-s5-contextcoverage-and-explore_source_kg-in-iterative-paper-analysis"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-22T01:43:41.860Z","note":"S3 consumed S5 contextCoverage and explore_source_kg. Implemented diagnostic treatment for non-covered S5 finding context, finalizer UNKNOWN guard for unmitigated partial/non_overlapping/not_available/error coverage, S4-only local grounding requirement for TP/FP while allowing S5 corroboration, S5_PAPER_CONTEXT_NON_OVERLAPPING preservation, and selector-aware explore_source_kg duplicate reuse. Verification: focused pytest 7 passed; full analysis-agent pytest 783 passed; compileall app/paper passed. Evidence: wiki/canon/handoff/s3/session-s3-consume-s5-contextcoverage-source-kg-20260522.md."}]
registered_at: "2026-05-22T01:30:04.807Z"
completed_at: "2026-05-22T01:43:41.860Z"
---

# S3 consume S5 contextCoverage and explore_source_kg in iterative paper analysis

## Summary
- Kind: request
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S5 completed the S3-requested Source KG coverage diagnostics and exploratory Source KG query surface. This WR asks S3 to consume that S5 surface in the paper analysis runner/tool policy.

Critic pre-registration review status: `REVISE` then incorporated. Main incorporated changes: explicit S3 implementation anchors, stricter coverage-status policy, artifact/timeline persistence requirements, finalizer guard acceptance, and bounded-tool policy.

## S5 implementation now available

S5 completed and verified:

```text
POST /v1/paper/finding-context/retrieve
  -> additive top-level contextCoverage

POST /v1/paper/source-kg/explore
  -> toolName: explore_source_kg
  -> request schema: s5-explore-source-kg-request-v1
  -> response schema: s5-explore-source-kg-response-v1
```

Verification evidence:

```text
cd services/knowledge-base && .venv/bin/python -m pytest tests/test_paper_context_api_contract.py tests/test_paper_context_freeze_gate.py -q
  -> 60 passed in 130.04s

cd services/knowledge-base && .venv/bin/python -m compileall app/paper_context app/routers/paper_context_api.py app/contracts/paper_context.py
  -> passed
```

Canonical API docs:

```text
wiki/canon/api/s5-paper-context-api.md
wiki/canon/api/knowledge-base-api.md
```

## S3-owned implementation anchors

S3 should consume/wrap S5's documented endpoint contract. S3 should not redefine the S5 endpoint schema.

Likely S3-owned code/test anchors:

```text
services/analysis-agent/app/paper/s5_client.py
services/analysis-agent/app/paper/llm_client.py::paper_tool_schemas
services/analysis-agent/app/paper/runner.py
services/analysis-agent/app/paper/normalize.py
services/analysis-agent/app/paper/validation.py
services/analysis-agent/tests/test_paper_path.py
```

## Coverage-status policy S3 should enforce

`retrieve_finding_context.contextCoverage` has:

```text
schemaVersion = s5-paper-context-coverage-v1
coverageStatus = covered | partial | non_overlapping | not_available | error
requestedAnchors[]
returnedSpans[]
returnedSpans[].lineOverlap = true | false | null
lineOverlap = boolean aggregate
pathMatchPolicy = normalized_exact_or_suffix
```

S3 consumption policy:

- `covered`: usable as overlapping source context, but still contextual support only and not final TP/FP/UNKNOWN evidence by itself.
- `partial | non_overlapping | not_available | error`: inadequate for anchor-specific TP/FP support unless S3 obtains additional overlapping context through S3-owned acquisition or a successful overlapping `explore_source_kg` result.
- `non_overlapping` must remain diagnostic if not mitigated by a successful overlapping exploratory result.
- S5 rows whose `contextCoverage.coverageStatus != covered` and no mitigating overlapping exploration row exists must not be treated as adequate anchor evidence.

Important diagnostic:

```text
S5_PAPER_CONTEXT_NON_OVERLAPPING
```

S3 should preserve this diagnostic in the evidence timeline/final rationale when the final decision remains insufficient-context or boundary-limited.

## S5 exploratory Source KG tool S3 should wrap

Expose S5's documented `explore_source_kg` endpoint as an S3 acquisition tool wrapper:

```http
POST /v1/paper/source-kg/explore
```

Supported modes:

```text
source_slice
function_body
callers
callees
symbol_lookup
neighborhood
data_flow
```

Tool policy constraints:

- S5 output is contextual only; it must not be promoted to TP/FP/UNKNOWN authority.
- No full source dump.
- Keep acquisition bounded: suggested caps `depth <= 3`, `topK <= 10`, and existing S3 max acquisition rounds/budget must still apply.
- `data_flow` is diagnostic `not_available` unless S5-selected context includes rich IR / PDG / taint artifacts.
- `callers`, `callees`, and `neighborhood` require Source KG graph edges; missing edges are context gaps, not negative evidence.

## Requested S3 behavior

For each finding:

1. Call/consume `retrieve_finding_context` and inspect `contextCoverage`.
2. If `coverageStatus=covered`, allow it as overlapping context while preserving S5's no-final-verdict boundary.
3. If `coverageStatus=partial|non_overlapping|not_available|error`, do not treat the S5 row as adequate anchor evidence.
4. If within S3 acquisition budget, call `explore_source_kg` to obtain immediate source slice, function body, callers/callees, symbol lookup, or neighborhood context.
5. Record the tool-call timeline and preserve S5 diagnostics.
6. If still insufficient, finalizer should explain UNKNOWN with S5 context-gap diagnostics rather than promoting diagnostic-only refs to support.

## Artifact/timeline acceptance criteria

S3 should persist or normalize the new tool surface into paper artifacts. Suggested artifact names:

```text
s5-source-kg-explore-requests.jsonl
s5-source-kg-explore.raw.jsonl
s5-source-kg-explore.normalized.jsonl
llm-transcript.raw.jsonl tool results
evidence-ledger.jsonl rows with evidenceType=s5_source_kg_exploration
finding evidence summary with coverage/exploration status
```

If S3 chooses different names, the same information should be discoverable per case/finding.

## Finalizer/validator acceptance criteria

Please add tests proving:

- TP/FP cannot cite diagnostic-only S5 refs as claim support.
- Non-overlapping S5 context alone forces `UNKNOWN_INSUFFICIENT_CONTEXT` or equivalent boundary rationale.
- `S5_PAPER_CONTEXT_NON_OVERLAPPING` is preserved in `diagnosticRefsUsed`, boundary notes, or equivalent S3 rationale fields, and is not promoted to claim support.
- A deterministic fixture or the certificate-maker case covers the mismatch pattern: requested anchor `main.cpp:35` with returned S5 span `main.cpp:1-24`.
- `explore_source_kg` calls are recorded in the per-finding timeline and are de-duplicated without suppressing required acquisition for distinct modes/selectors.
- Existing S3 duplicate-tool-call handling does not skip required per-finding acquisition rounds.

## Boundary

This is an S3 consumer/tool-policy WR. S5 already owns the endpoint implementation and canonical API docs. S3 owns runner orchestration, tool exposure, packet construction, evidence ledger normalization, finalizer guards, and S3-side tests.

Do not infer TP/FP from S5 hit/no-hit/partial/non-overlapping status. S5 evidence remains contextual support only.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
