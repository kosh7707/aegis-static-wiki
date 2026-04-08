---
title: "S2 handled build-agent/analysis-agent rollout and consumer alignment on 2026-04-08"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-"
last_verified: "2026-04-08"
service_tags: ["s2", "s3", "runtime", "build-agent", "analysis-agent", "api-contract"]
decision_tags: ["reply", "runtime-alignment", "consumer-alignment"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep.md", "wiki/canon/work-requests/s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/analysis-agent-api.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-08T07:09:16.124Z","note":"Reviewed S2 reply on 2026-04-08 and verified the key rollout claims live. Fresh checks confirmed analysis-agent /v1/health now exposes only deep-analyze and generate-poc, build-agent /v1/health now reports version 1.0.0, build-agent strict-v1 live response now echoes contractVersion=build-resolve-v1 and strictMode=true, and post-rollout generate-poc live smoke completed successfully. Recipient-side handling complete."}]
registered_at: "2026-04-08T07:01:24.723Z"
completed_at: "2026-04-08T07:09:16.124Z"
---

# S2 handled build-agent/analysis-agent rollout and consumer alignment on 2026-04-08

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 processed both open S3 WRs on **2026-04-08**. We completed the runtime rollout and aligned the S2 consumer path for `build-resolve` strict-v1 requests.

## Actions completed
1. Restarted the live S3 runtime surfaces using:
   - `scripts/start-build-agent.sh`
   - `scripts/start-analysis-agent.sh`
2. Updated S2 consumer code so pipeline `build-resolve` requests now send canonical top-level strict fields:
   - `contractVersion: build-resolve-v1`
   - `strictMode: true`
   and canonical subproject aliases:
   - `subprojectPath`
   - `subprojectName`
3. Expanded S2 contract coverage so the documented REST surface remains fully request-level tested after the consumer alignment.

## Verification evidence
### Live runtime (2026-04-08)
- `GET http://localhost:8001/v1/health`
  - `activePromptVersions == { deep-analyze: agent-v1, generate-poc: v1 }`
- `GET http://localhost:8003/v1/health`
  - `version == 1.0.0`
- Live strict-v1 build request `req-s2-live-build-rollout-success-001`
  - response `status == completed`
  - response `contractVersion == build-resolve-v1`
  - response `strictMode == true`

### Local verification
- `services/build-agent/tests/test_build_request_contract.py` + `tests/test_result_assembler.py` passed
- `services/analysis-agent/tests/test_skeleton_smoke.py` passed
- `services/backend` targeted consumer tests passed
- `services/backend` full suite passed (`21 files / 391 tests`)
- `services/backend` and `services/shared` typecheck passed

## S2 code touched
- `services/backend/src/services/build-agent-client.ts`
- `services/backend/src/services/pipeline-orchestrator.ts`
- `services/backend/src/services/__tests__/pipeline-orchestrator.test.ts`
- plus existing contract-test expansion files kept green:
  - `services/backend/src/__tests__/contract/api-contract.test.ts`
  - `services/backend/src/test/create-test-app.ts`

## Note
The positive live strict-v1 verification above was performed on a valid build request path and is now aligned with the canonical build-agent contract.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
