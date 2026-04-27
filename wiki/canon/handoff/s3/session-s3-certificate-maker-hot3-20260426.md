---
title: "Session history — s3 / s3-certificate-maker-hot3-20260426"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-hot3-stability-report.md"
  - "/home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-status.tsv"
  - "/home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-health.jsonl"
  - "/home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-batch.log"
original_path: "mcp://record_session_history/s3/s3-certificate-maker-hot3-20260426"
last_verified: "2026-04-26"
service_tags: ["s3"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/", "wiki/canon/handoff/s3/session-s3-stability-qualitygate-separation-20260425.md", "wiki/canon/handoff/s3/session-s3-certificate-maker-smoke-20260425.md"]
migration_status: "canonicalized"
---

# Session history — s3 / s3-certificate-maker-hot3-20260426

## Session
- Lane: s3
- Session ID: s3-certificate-maker-hot3-20260426
- Status: verified
- Started at: 2026-04-26T15:49:42+09:00
- Updated at: 2026-04-26T16:55:00+09:00

## Summary
Ran certificate-maker E2E hot3 non-failfast stability smoke after full service restart. Counted batch base hot3-20260426-155046 completed 3/3 attempts successfully: stages 2 Build Agent, 3 S4 SAST, 4 S5 GraphRAG ingest, 5 S3 deep-analyze, and 6 S3 generate-poc all passed in every attempt. Service health snapshots were clean (8/8 OK for S7, S3 analysis, S3 build, S4, S5, S2 backend, S1 frontend). Runtime logs showed zero errors and five S3 warnings related to grounding/structured-output recovery; these recovered and did not become task failures. Quality remains unstable: PoC cleanPass=false in all runs, rubrics [6,4,4], and one deep run accepted_with_caveats.

## Related pages
- [[wiki/canon/specs/s3-claim-evidence-state-machine/]]
- [[wiki/canon/handoff/s3/session-s3-stability-qualitygate-separation-20260425.md]]
- [[wiki/canon/handoff/s3/session-s3-certificate-maker-smoke-20260425.md]]

## Test evidence

### 2026-04-26T07:55:43.027Z — passed
- Command: `PATH=/tmp/aegis-jq-bin:$PATH ./scripts/e2e-certificate-maker.sh --run-label hot3-20260426-155046-{01,02,03} --keep-uploads (sequential non-failfast loop)`
- Log ref: /home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-batch.log
- Attempt 1: rc=0; stage2/3/4/5/6 all pass; 2026-04-26T15:50:48+09:00 to 16:17:58+09:00.
- Attempt 2: rc=0; stage2/3/4/5/6 all pass; 2026-04-26T16:18:00+09:00 to 16:31:36+09:00.
- Attempt 3: rc=0; stage2/3/4/5/6 all pass; 2026-04-26T16:31:38+09:00 to 16:52:15+09:00.
- All build/deep/poc responses had status=completed and no top-level failureCode.
- Earlier non-counted batch hot3-20260426-154942 failed preflight only because jq was absent; counted batch used existing scripts/jq-shim.py.

### 2026-04-26T07:56:01.974Z — passed_with_warnings
- Command: `curl health snapshots before/after attempts + final health check; log-analyzer service_stats/search_errors/list_requests/llm_stats`
- Log ref: /home/kosh/aegis-for-paper/.stability-runs/hot3-20260426-155046-health.jsonl
- Health snapshots: 8 snapshots, bad_snapshots=none; S7/S3 analysis/S3 build/S4/S5/S2/S1 all OK in every snapshot.
- Final health: all checked services returned HTTP 200.
- log-analyzer service_stats since 90m: zero errors across s3-agent, s3-build, s4-sast, s5-kb, s6-ecu, s7-gateway.
- Warnings: five s3-agent recovery warnings (grounding nudge, structured-output retry/finalizer) but all recovered and final task responses completed.
- LLM stats: 57 exchanges, avg latency 1m44s, max 5m27s; expected DGX Spark latency, not an operational failure.
