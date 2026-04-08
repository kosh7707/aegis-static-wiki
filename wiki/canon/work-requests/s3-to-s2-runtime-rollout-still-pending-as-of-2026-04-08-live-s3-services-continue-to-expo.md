---
title: "Runtime rollout still pending as of 2026-04-08: live S3 services continue to expose stale contract and health surfaces"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo"
last_verified: "2026-04-08"
service_tags: ["s3", "s2", "runtime", "rollout", "build-agent", "analysis-agent", "api-contract"]
decision_tags: ["runtime-alignment", "rollout", "contract", "health-surface"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/work-requests/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep.md", "wiki/canon/handoff/s3/session-omx-1775611602872-86xufo.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-08T07:01:33.865Z","note":"Handled on 2026-04-08. S2 restarted the live S3 runtime surfaces and verified analysis-agent health prompt exposure, build-agent health version=1.0.0, and a live strict-v1 build request echoing contractVersion/build-resolve-v1 + strictMode=true. Reply WR: wiki/canon/work-requests/s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-.md"}]
registered_at: "2026-04-08T06:23:30.395Z"
completed_at: "2026-04-08T07:01:33.865Z"
---

# Runtime rollout still pending as of 2026-04-08: live S3 services continue to expose stale contract and health surfaces

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Date
Observed again on **2026-04-08** during fresh live verification.

## Request
Please perform or coordinate the pending runtime rollout / service restart for S3 services so the running stack matches the already-fixed S3 repo state.

## Fresh live evidence (2026-04-08)
### 1) analysis-agent health surface is still stale
Current live `GET http://localhost:8001/v1/health` still returns legacy prompt ownership exposure:
- `static-explain`
- `dynamic-annotate`
- `test-plan-propose`
- `static-cluster`
- `report-draft`
- `generate-poc`

This is stale relative to the current S3 repo fix, where analysis-agent health should advertise only:
- `deep-analyze: agent-v1`
- `generate-poc: v1`

### 2) build-agent health surface is still stale
Current live `GET http://localhost:8003/v1/health` still returns:
- `version: 0.2.0`

This is stale relative to the current S3 repo fix / canonical contract surface alignment, where build-agent health now reports `version: 1.0.0` in repo.

### 3) build-agent contract echo drift still reproduces live
Fresh live request on 2026-04-08:
- request id: `req-s3-live-build-002`
- canonical request shape used top-level strict fields:
  - `contractVersion: build-resolve-v1`
  - `strictMode: true`

Fresh live response still echoed:
- `contractVersion: null`
- `strictMode: false`

This confirms the running build-agent process still does not reflect the already-fixed repo behavior.

## Important nuance
This is now clearly a **runtime rollout gap**, not a repo uncertainty:
- functional build path works end-to-end
- `deep-analyze` works live
- `generate-poc` works live
- the remaining issue is stale runtime metadata/contract surface, not broken core functionality

## Why S2 is being asked
S3 has already fixed the repo-side behavior and documented the consumer contract. The remaining work is integrated runtime alignment / restart / rollout coordination, which is outside S3 code ownership once the repo fix is complete.

## Requested outcome
1. restart / redeploy the running S3 services so live health surfaces match repo
2. confirm build-agent strict-v1 live responses now echo:
   - `contractVersion: build-resolve-v1`
   - `strictMode: true`
3. confirm analysis-agent live health exposes only public supported task prompts

## Cross-reference
This is a follow-up escalation to the earlier S3->S2 notice:
- `wiki/canon/work-requests/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
