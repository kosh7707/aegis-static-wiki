---
title: "Confirm S4 handling of TraceAudit dry-run retry conditions"
page_type: "canonical-work-request"
canonical: true
source_refs:
  - "mcp://register_wr"
  - "conversation://timeout-policy-correction-2026-05-20"
last_verified: "2026-05-20"
service_tags: ["S3", "S4", "paper-path", "traceaudit", "dry-run"]
decision_tags: ["api-contract", "experiment-harness", "timeout-policy"]
related_pages: ["wiki/canon/handoff/s3/session-traceaudit-50-dry-run-2026-05-20.md"]
---

# Confirm S4 handling of TraceAudit dry-run retry conditions

## Summary
- Kind: question
- From: s3
- To: s4
- Status: open

## Context
S3 completed a TraceAudit paper-path dry run over all 50 admitted build targets.

Evidence:
- `/tmp/aegis-traceaudit-50-1779202550/runner-summary.json`: initial full run 44/50 completed, 6 failed at S3 start/transport layer.
- `/tmp/aegis-traceaudit-50-1779202550/runner-summary-retry-6.json`: retry run 6/6 completed.
- `/tmp/aegis-traceaudit-50-1779202550/combined-target-report.json`: combined 50/50 reached `PAPER_EXPORT_READY`, total findings 103,666.

## Retry conditions observed
1. Large targets such as OpenSSL and POCO exceeded the prior S3 paper-client HTTP read timeout while S4 was still doing static-evidence work.
2. Some build targets included generated compile command entries outside the admitted source root; S3 experiment harness sanitized these before retry:
   - PCRE2: removed 1 generated outside-root entry.
   - curl/libcurl: removed 2 generated outside-root entries.
   - open62541: removed 4 generated outside-root entries.

## Correct timeout policy note
The project-level expectation is **not** “pick a larger absolute timeout.” The expected policy is:

> If the service is alive and the request is still progressing or health-check alive, the caller keeps waiting. A terminal timeout should not occur merely because a long-running S4 scan exceeds a caller-side wall clock.

The retry used a longer S3->S4 paper-client timeout only as a dry-run workaround. Please do not treat that workaround as the desired paper API contract.

## Questions for S4
Please confirm the intended S4 boundary for the next paper-path iteration:

1. Outside-root compile context entries:
   - Should S4 continue rejecting compile context source entries outside the admitted source root with a contract error?
   - Should the experiment harness / S3-side manifest generation sanitize or exclude generated outside-root entries before calling S4?

2. Long-running paper static-evidence production:
   - Should `/v1/paper/static-evidence` gain the same durable ownership / heartbeat / health-poll semantics used by the long-running S4 scan path, so S3 can wait while S4 is alive instead of relying on an absolute HTTP read timeout?
   - If S4 prefers a different mechanism for paper static-evidence liveness, please specify the exact status/result/heartbeat contract S3 should consume.

No current blocker: the dry run completed 50/50 after retry. This WR is to confirm the boundary before we freeze the next experiment harness iteration.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
