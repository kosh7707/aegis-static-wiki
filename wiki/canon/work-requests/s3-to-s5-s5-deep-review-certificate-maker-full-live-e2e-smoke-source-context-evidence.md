---
title: "S5 deep-review certificate-maker full live e2e smoke source-context evidence"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence"
last_verified: "2026-05-22"
service_tags: ["s3", "s5", "e2e-smoke", "certificate-maker", "source-kg", "paper-evidence"]
decision_tags: ["review-request", "evidence-review"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-deep-review-certificate-maker-full-live-e2e-smoke-evidence.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence"
wr_kind: "request"
status: "open"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: []
registered_at: "2026-05-22T04:15:59.586Z"
---

# S5 deep-review certificate-maker full live e2e smoke source-context evidence

## Summary
- Kind: request
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S3 completed a full live certificate-maker e2e smoke run for the paper harness. Please perform a deep S5 review of the source-context / Source KG evidence and confirm whether this run is usable as paper-smoke source-context evidence before we scale further.

## Primary evidence locations

Run directory:

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

S5-specific artifacts:

```text
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-code-kb.raw.json
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-code-kb.normalized.json
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-setup-requests.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-finding-context-requests.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-finding-context.raw.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-finding-context.normalized.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-generic-threat-context-requests.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-generic-threat-context.raw.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-generic-threat-context.normalized.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore-requests.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore.raw.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore.normalized.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/finding-evidence-summary.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/llm-transcript.raw.jsonl
/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/evidence-ledger.jsonl
```

## Observed run summary

```text
status=PAPER_EXPORT_READY
S4 live findings=19
triageCounts: TP=11, FP=5, UNKNOWN=3
qualityGate=warn
qualityGate reasons: SOME_FINDINGS_UNKNOWN, ACQUISITION_TOOL_CALLS_SKIPPED_OR_DUPLICATED
S5 finding context requests=19
S5 generic threat requests=19
S5 source-kg explore requests=33
contextCoverage: 19/19 findings had overlapping S5 context rows
sourceKgExploration: 19/19 findings had exploration rows
observed errors/warns during monitored window: none
```

Known hotspots:

```text
UNKNOWN findings: finding:0016, finding:0017, finding:0018
Duplicate/skipped acquisition flag: finding:0008
```

## Requested S5 deep review

1. Confirm the certificate-maker code-kb setup / Source KG ingest quality for this run.
2. Confirm `contextCoverage` is truthful: all 19 findings show covered/overlapping S5 context; verify there is no false coverage caused by normalization or overly broad overlap matching.
3. Inspect `s5-source-kg-explore-*` rows, selectors/modes, retrieval traces, and normalized ledger refs for quality and per-finding usefulness.
4. Deep-review `finding:0016`, `finding:0017`, and `finding:0018`: S5 context was covered but S3 finalizer returned UNKNOWN. Determine whether S5 context/tool affordances were insufficient, whether better Source KG modes/call graph/data-flow expansion could help, or whether S3 should have used available context better.
5. Review `finding:0008`, which triggered `ACQUISITION_TOOL_CALLS_SKIPPED_OR_DUPLICATED` and showed a malformed-looking requested tool string in S3 summary (`explore_source_kg\n</parameter`). Determine whether S5 response shape, schema, or S3 prompting/context could have contributed.
6. Assess whether generic threat context rows were useful/correct or too generic/noisy.
7. Recommend S5 API, coverage, artifact, logging, or schema improvements before scaling to additional build targets.

## Requested reply / acceptance criteria

Please reply with:

- S5 verdict on source-context evidence: `usable`, `usable-with-caveats`, or `not-usable`.
- Per-finding notes for the three UNKNOWN findings and at least representative TP/FP findings.
- Confirm/deny that S5 accepts this run as paper-smoke source-context evidence.
- List any S5 contract/schema improvements and any follow-up S3 WRs needed.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
