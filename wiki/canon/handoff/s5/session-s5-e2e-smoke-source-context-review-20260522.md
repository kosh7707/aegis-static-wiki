---
title: "Session history — s5 / s5-e2e-smoke-source-context-review-20260522"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/EVIDENCE-REVIEW.md"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/evidence-review-summary.json"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-code-kb.raw.json"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-finding-context.raw.jsonl"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/s5-source-kg-explore.normalized.jsonl"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-full-live-20260522-111336/cases/case-bt-0001-certificate-maker-traceaudit-6afd0d788336/triage-envelope.jsonl"
original_path: "mcp://record_session_history/s5/s5-e2e-smoke-source-context-review-20260522"
last_verified: "2026-05-22"
service_tags: ["s5"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence.md", "wiki/canon/api/s5-paper-context-api.md"]
migration_status: "canonicalized"
---

# Session history — s5 / s5-e2e-smoke-source-context-review-20260522

## Session
- Lane: s5
- Session ID: s5-e2e-smoke-source-context-review-20260522
- Status: reviewed_usable_with_caveats
- Started at: 2026-05-22
- Updated at: 2026-05-22

## Summary
Reviewed certificate-maker full-live e2e smoke S5 Source KG evidence. Verdict: usable-with-caveats as paper-smoke source-context evidence. Code KB setup is selectable but partial quality: 14 nodes/snippets, 0 graph edges, 0 rich IR; all 19 contextCoverage statuses are covered with true line overlap. Exploration rows exist for all findings; source_slice/function_body are useful, graph-neighborhood/callers are limited by absent edges. UNKNOWN 0016-0018 are not S5 coverage failures; they stem from missing caller/data-flow expansion and S3 selector construction. finding:0008 malformed explore_source_kg tool string is S3 tool parsing/prompting, not S5 schema. Generic threat context is mostly no_hit or generic API-note and low value for this native source-only smoke.

## Related pages
- [[wiki/canon/work-requests/s3-to-s5-s5-deep-review-certificate-maker-full-live-e2e-smoke-source-context-evidence.md]]
- [[wiki/canon/api/s5-paper-context-api.md]]

## Test evidence
_No test evidence recorded yet._
