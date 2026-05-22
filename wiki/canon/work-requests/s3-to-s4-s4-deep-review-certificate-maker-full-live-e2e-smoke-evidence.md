---
title: "S4 deep-review certificate-maker full live e2e smoke evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence"
last_verified: "2026-05-22"
service_tags: ["s3", "s4", "sast-runner", "paper-pipeline", "traceaudit", "certificate-maker", "e2e-smoke"]
decision_tags: ["work-request", "deep-review", "e2e-evidence", "s4-static-evidence", "paper-readiness"]
related_pages: ["wiki/canon/handoff/s3/session-s3-consume-s5-contextcoverage-source-kg-20260522.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-22T04:22:41.234Z","note":"S4 review completed. Reply WR registered at wiki/canon/work-requests/s4-to-s3-s4-reply-certificate-maker-full-live-e2e-smoke-static-evidence-review.md. Verdict: usable-with-caveats; S4 accepts 19-finding static-evidence bundle as valid paper-smoke evidence. Verification: SHA256SUMS passed; raw/normalized/export IDs and b4 packet coverage consistent. Caveats: enrich gcc-fanalyzer/analyzer-path diagnostics and populate finding functionId/relatedLocations before broad scale."}]
registered_at: "2026-05-22T04:14:18.580Z"
completed_at: "2026-05-22T04:22:41.234Z"
---

# S4 deep-review certificate-maker full live e2e smoke evidence

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 completed a full live TraceAudit e2e smoke for the `bt-0001-certificate_maker` build target. Please perform a deep S4-side review of the S4 static-evidence contribution and its downstream use in the final packets.

## Evidence location

Primary run directory:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336
```

Reviewer entrypoints:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/EVIDENCE-REVIEW.md
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/evidence-review-summary.json
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/finding-review-table.csv
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/SHA256SUMS
```

Archive:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/archives/traceaudit-certmaker-full-live-20260522-111336.tar.gz
/home/kosh/aegis-for-paper/experiments/triage-core-v1/archives/traceaudit-certmaker-full-live-20260522-111336.tar.gz.sha256
```

S4-specific artifacts:

```text
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-requests.jsonl
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.raw.json
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s4-static-evidence.normalized.json
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/findings.jsonl
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/triage-envelope.jsonl
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/finding-evidence-summary.jsonl
.../cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/audit-packets/findings/**/b4.json
```

## Run result to review

```text
status=PAPER_EXPORT_READY
S4 live findings=19
triageCounts: TP=11, FP=5, UNKNOWN=3
qualityGate=warn
qualityGate reasons: SOME_FINDINGS_UNKNOWN, ACQUISITION_TOOL_CALLS_SKIPPED_OR_DUPLICATED
S3/S4/S5/S7 observed errors/warns: none during the monitored window
```

Known review hotspots:

```text
UNKNOWN: finding:0016, finding:0017, finding:0018
Quality duplicate/skipped flag: finding:0008
```

## Requested S4 review

Please deep-review from S4's producer perspective:

1. Confirm S4 really produced 19 findings and that IDs/locations/rules are stable and reviewable.
2. Inspect whether the S4 raw and normalized evidence preserve enough local claim boundary for downstream TP/FP/UNKNOWN triage.
3. For each FP/UNKNOWN and at least a representative subset of TPs, assess whether the S4 finding itself is well-formed, correctly located, and carries sufficient rule/message context.
4. Pay special attention to `finding:0008` because S3 quality gate recorded one acquisition duplicate/skipped event there; determine whether any S4 finding shape or text may have contributed to ambiguous tool behavior.
5. Pay special attention to `finding:0016`-`finding:0018` because final verdicts are UNKNOWN despite covered S5 context; determine whether S4 evidence is too weak, too ambiguous, or correctly bounded.
6. Identify any S4-side contract or artifact improvements needed before scaling beyond certificate-maker.

## Expected reply / acceptance

Please reply with a canonical WR reply or session artifact that includes:

- S4 verdict on run usability: `usable`, `usable-with-caveats`, or `not-usable`.
- Per-finding review table or notes for at least all FP/UNKNOWN findings and `finding:0008`.
- Any S4 contract/schema/logging improvements requested.
- Explicit statement whether S4 accepts the 19-finding static-evidence bundle as valid paper-smoke evidence.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
