---
title: "Session history — s2 / 2026-05-11-s2-api-contract-compliance"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/backend/src/services/sast-client.ts"
  - "services/backend/src/services/kb-client.ts"
  - "services/backend/src/services/pipeline-orchestrator.ts"
  - "services/backend/src/services/analysis-orchestrator.ts"
  - "services/backend/src/__tests__/contract/client-contract.test.ts"
  - "services/backend/src/services/__tests__/pipeline-orchestrator.test.ts"
  - "services/backend/src/services/__tests__/analysis-orchestrator.test.ts"
original_path: "mcp://record_session_history/s2/2026-05-11-s2-api-contract-compliance"
last_verified: "2026-05-11"
service_tags: ["s2"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
---

# Session history — s2 / 2026-05-11-s2-api-contract-compliance

## Session
- Lane: s2
- Session ID: 2026-05-11-s2-api-contract-compliance
- Status: verified
- Started at: 2026-05-11T00:36:53+09:00
- Updated at: 2026-05-11T10:52:30+09:00

## Summary
Aligned S2 downstream API-contract handling for S4 SDK scan profiles and S5 code-graph canonical payload/counters. Added regression tests for sdkId none normalization, bare uploaded sdk-* rejection, pipeline and analysis-path non-registered descriptors, and S5 functions[].calls/no call_edges behavior. Critic subagent checkpoint approved.

## Related pages
- [[wiki/canon/specs/backend.md]]
- [[wiki/canon/handoff/s2/api-endpoints.md]]
- [[wiki/canon/api/shared-models.md]]
- [[wiki/canon/api/sast-runner-api.md]]
- [[wiki/canon/api/knowledge-base-api.md]]

## Test evidence

### 2026-05-11T01:52:27.130Z — passed
- Command: `npm test --prefix services/backend -- --run __tests__/contract/client-contract.test.ts services/__tests__/pipeline-orchestrator.test.ts services/__tests__/analysis-orchestrator.test.ts && npm test --prefix services/backend -- --run __tests__/contract/api-contract.test.ts && npm run build --prefix services/shared && npm run build --prefix services/backend`
- Log ref: wiki/canon/handoff/s2/session-2026-05-11-s2-api-contract-compliance.md
- S2 downstream contract/orchestrator regression suite: 84 tests passed.
- S1-facing API contract suite: 161 tests passed.
- services/shared TypeScript build passed.
- services/backend TypeScript build passed.

### 2026-05-11T01:53:15.714Z — passed
- Command: `python3 reachability smoke: GET S1 :5173/, S2 :3000/health, S3 :8001/:8003 /v1/health, S4 :9000/v1/health, S5 :8002 /v1/health + /v1/ready, S7 :8000/v1/health, S6 :4000/health`
- Log ref: wiki/canon/handoff/s2/session-2026-05-11-s2-api-contract-compliance.md
- No services were started or stopped by this check.
- All checked endpoints returned HTTP 200.
- S7 process status ok, ready=true, llmReady=true, degraded=false, blockedReason=null, dependencyStatus.llmBackend.status=ok.
- S5 ready=true with qdrant initialized and neo4j connected; readiness nodeCount=2071 edgeCount=3359.
- S4 status ok, policyStatus ok, all six tools available, activeRequestCount=0.
- S3 analysis/build health ok with requestSummary.state=idle and no active requests.
- Log analyzer showed no level>=50 logs in the last 15 minutes; service stats for s6-ecu and s7-gateway showed 0 errors/warnings.
