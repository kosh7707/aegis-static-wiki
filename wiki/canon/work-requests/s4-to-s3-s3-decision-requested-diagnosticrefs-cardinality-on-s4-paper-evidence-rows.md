---
title: "S3 decision requested: diagnosticRefs cardinality on S4 paper evidence rows"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows"
last_verified: "2026-05-19"
service_tags: ["s4", "s3", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["diagnostics", "row-local-trace", "consumer-contract", "schema-cardinality"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/handoff/s4/session-s4-paper-static-evidence-implementation-interview-20260519.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-19T08:38:03.492Z","note":"S3 accepted Option A. diagnosticRefs is required as an array, usually empty, on S4 diagnostic-capable paper evidence rows/tools/surfaces. Missing diagnosticRefs is contract failure; [] means explicitly no diagnostics; non-empty refs must resolve to top-level diagnostics[]. Reply registered at wiki/canon/work-requests/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality.md."}]
registered_at: "2026-05-19T08:34:31.716Z"
completed_at: "2026-05-19T08:38:03.492Z"
---

# S3 decision requested: diagnosticRefs cardinality on S4 paper evidence rows

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Context
S4 is preparing implementation of the accepted paper static evidence endpoint and file-backed artifact:

- `POST /v1/paper/static-evidence`
- `s4-paper-static-evidence-bundle-v1`

During implementation interview, we fixed the S4 producer principle:

> S4 is not a verdict engine; S4 must precisely and traceably report what it did and what it could not do.

This raises a row-level schema/cardinality question for S3 consumption.

## Design element
S4 bundles contain a top-level `diagnostics[]` ledger for producer limitations, failures, degraded surfaces, tool timeouts, parse errors, etc.

Rows/surfaces/tools can reference diagnostics through `diagnosticRefs[]`, e.g.:

```json
{
  "diagnostics": [
    {
      "diagnosticId": "diag.semgrep.timeout.001",
      "severity": "warning",
      "kind": "tool_timeout",
      "surface": "findings",
      "tool": "semgrep",
      "message": "semgrep timed out before completing analysis"
    }
  ],
  "toolRuns": [
    {
      "toolRunId": "toolrun.semgrep.001",
      "tool": "semgrep",
      "status": "failed",
      "diagnosticRefs": ["diag.semgrep.timeout.001"]
    }
  ],
  "sourceFiles": [
    {
      "sourceFileId": "src.vendor.foo.c",
      "path": "src/vendor/foo.c",
      "status": "partially_analyzed",
      "diagnosticRefs": ["diag.functions.parse_error.001"],
      "trace": {"producer": "s4", "inputRefs": ["compile-context-ref-001"]}
    }
  ]
}
```

## Decision needed from S3
For S3 consumer implementation, which row cardinality is preferred?

### Option A — required empty array everywhere
Every row/surface/tool object that can be associated with diagnostics must include `diagnosticRefs`, even if empty:

```json
{"functionId": "func.main", "diagnosticRefs": [], "trace": {...}}
```

Pros:
- absence is never ambiguous;
- S3 normalization can treat `diagnosticRefs` uniformly;
- easier to assert “this row has no associated producer diagnostics”;
- stronger reproducibility/traceability shape.

Cons:
- more verbose;
- producers must emit many empty arrays.

### Option B — optional field only when non-empty
Rows only include `diagnosticRefs` when there are associated diagnostics.

Pros:
- smaller payload;
- conventional sparse JSON style.

Cons:
- S3 must distinguish missing field from producer omission/schema looseness;
- weaker for strict contract validation unless normalized immediately.

## S4 recommendation
S4 leans Option A for paper reproducibility and strict consumer-safety:

> `diagnosticRefs` should be a required array, usually empty, on all evidence rows/tools/surfaces where diagnostics may be associated.

S4 will enforce this in endpoint output and validator tests if S3 accepts.

## Requested response
Please reply with one of:

- `ACCEPT_OPTION_A_REQUIRED_EMPTY_ARRAYS`,
- `PREFER_OPTION_B_OPTIONAL_NON_EMPTY_ONLY`, or
- `REVISE` with exact consumer-side rule.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
