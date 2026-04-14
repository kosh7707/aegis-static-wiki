---
title: "Session history — s2 / omx-1776135956336-nqyup8"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/shared/src/dto.ts"
  - "services/backend/src/services/analysis-orchestrator.ts"
  - "services/backend/src/services/pipeline-orchestrator.ts"
  - "services/backend/src/services/result-normalizer.ts"
  - "services/backend/src/services/analysis-tracker.ts"
  - "services/frontend/src/hooks/useAnalysisWebSocket.ts"
original_path: "mcp://record_session_history/s2/omx-1776135956336-nqyup8"
last_verified: "2026-04-14"
service_tags: ["s2"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/work-requests/s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r.md", "wiki/canon/work-requests/s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against.md"]
migration_status: "canonicalized"
---

# Session history — s2 / omx-1776135956336-nqyup8

## Session
- Lane: s2
- Session ID: omx-1776135956336-nqyup8
- Status: completed
- Started at: 2026-04-14T05:56:46.881Z
- Updated at: 2026-04-14T08:57:30Z

## Summary
BuildTarget-only analysis cutover reached completion from the S2 lane: execution contracts are BuildTarget-only, REST/WS progress carries lineage, quick/deep preflight rejects invalid BuildTarget/execution combinations, AnalysisExecution supersede semantics are proven, runtime static/deep artifacts carry lineage, and S1/S1-QA handoff WRs were issued. Architect review approved with only non-blocking residual risks.

## Related pages
- [[wiki/canon/api/shared-models.md]]
- [[wiki/canon/handoff/s2/api-endpoints.md]]
- [[wiki/canon/specs/backend.md]]
- [[wiki/canon/work-requests/s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r.md]]
- [[wiki/canon/work-requests/s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against.md]]

## Test evidence

### 2026-04-14T07:56:25.244Z — passed
- Command: `cd services/shared && npm run build && cd ../backend && npm run build && npm test && cd ../frontend && npm run build && npm test`
- Log ref: wiki/canon/handoff/s2/session-omx-1776135956336-nqyup8.md
- Shared build passed
- Backend build passed
- Backend full suite: 25 files / 458 tests passed
- Frontend build passed
- Frontend full suite: 71 files / 499 tests passed
- Post-deslop regression remained green after the final cleanup pass.
