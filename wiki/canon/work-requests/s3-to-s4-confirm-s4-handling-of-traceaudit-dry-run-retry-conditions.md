---
title: "Confirm S4 handling of TraceAudit dry-run retry conditions"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-confirm-s4-handling-of-traceaudit-dry-run-retry-conditions"
last_verified: "2026-05-19"
service_tags: ["S3", "S4", "paper-path", "traceaudit", "dry-run"]
decision_tags: ["api-contract", "experiment-harness"]
related_pages: ["wiki/canon/handoff/s3/session-traceaudit-50-dry-run-2026-05-20.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-confirm-s4-handling-of-traceaudit-dry-run-retry-conditions"
wr_kind: "question"
status: "open"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: []
registered_at: "2026-05-19T21:07:26.551Z"
---

# Confirm S4 handling of TraceAudit dry-run retry conditions

## Summary
- Kind: question
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## Context
S3 completed a TraceAudit paper-path dry run over all 50 admitted build targets.

Evidence:
- `/tmp/aegis-traceaudit-50-1779202550/runner-summary.json`: initial full run 44/50 completed, 6 failed at S3 start/transport layer.
- `/tmp/aegis-traceaudit-50-1779202550/runner-summary-retry-6.json`: retry run 6/6 completed.
- `/tmp/aegis-traceaudit-50-1779202550/combined-target-report.json`: combined 50/50 reached `PAPER_EXPORT_READY`, total findings 103,666.

## Retry conditions observed
1. Large targets such as OpenSSL and POCO needed a much longer S3->S4 paper-client timeout than the prior 60s default.
2. Some build targets included generated compile command entries outside the admitted source root; S3 experiment harness sanitized these before retry:
   - PCRE2: removed 1 generated outside-root entry.
   - curl/libcurl: removed 2 generated outside-root entries.
   - open62541: removed 4 generated outside-root entries.

## Question for S4
Please confirm whether the current S4 contract is still the intended one:

- S4 should reject compile context source entries outside the admitted source root with a contract error rather than silently accept them.
- Experiment harness / S3-side manifest generation should sanitize or exclude generated outside-root entries before calling S4.
- Large-target scan duration is expected and should be handled by caller timeout configuration, not by changing the S4 paper API contract.

No current blocker: the dry run completed 50/50 after retry. This WR is to confirm the boundary before we freeze the next experiment harness iteration.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
