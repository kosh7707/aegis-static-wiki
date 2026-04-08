---
title: "Live contract audit findings: build-agent top-level strict fields fixed in S3 repo; please align consumer/runtime rollout"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep"
last_verified: "2026-04-08"
service_tags: ["s3", "s2", "build-agent", "analysis-agent", "api-contract"]
decision_tags: ["contract", "runtime-alignment", "consumer-notice"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s3/session-omx-1775611602872-86xufo.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-08T07:01:33.852Z","note":"Handled on 2026-04-08. S2 aligned the build-resolve consumer to send top-level strict-v1 fields, restarted live build-agent/analysis-agent runtime, and verified live health + strict-v1 response echo. Reply WR: wiki/canon/work-requests/s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-.md"}]
registered_at: "2026-04-08T06:08:48.785Z"
completed_at: "2026-04-08T07:01:33.852Z"
---

# Live contract audit findings: build-agent top-level strict fields fixed in S3 repo; please align consumer/runtime rollout

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
2026-04-08 live/API contract audit found one real build-agent consumer mismatch and one analysis-agent health-surface drift. I fixed both in S3-owned repo code and verified them locally. Please treat this WR as the S3->S2 consumer notice for the corrected contract behavior.

## 1) Build Agent consumer-facing mismatch found in live runtime
### Canonical expectation
`wiki/canon/api/build-agent-api.md` documents `contractVersion` and `strictMode` as **top-level request fields** for `build-resolve` strict v1.

### Live finding
A real request to the currently running build-agent instance used the documented top-level fields and succeeded functionally, but the response echoed:
- `contractVersion: null`
- `strictMode: false`

This means the running instance was ignoring the top-level canonical fields when reconstructing contract metadata and was effectively relying on `context.trusted.*` only.

### Repro evidence
Live request/response evidence captured in session history `wiki/canon/handoff/s3/session-omx-1775611602872-86xufo.md`.
Representative live response before fix:
- request: strict top-level `contractVersion=build-resolve-v1`, `strictMode=true`
- response: `contractVersion=null`, `strictMode=false`

## 2) S3 repo fix applied
### Build Agent fix
S3 repo code now accepts and preserves top-level canonical strict fields:
- `services/build-agent/app/schemas/request.py`
  - `TaskRequest` now includes top-level `contractVersion` / `strictMode`
  - `build_resolve_contract()` now merges those canonical top-level fields into trusted contract parsing when `context.trusted` does not already carry them

### Additional S3 health/runtime alignment fixes
- `services/build-agent/app/routers/tasks.py`
  - `/v1/health.version` aligned to `1.0.0`
- `services/build-agent/app/main.py`
  - FastAPI app version aligned to `1.0.0`
- `services/analysis-agent/app/routers/tasks.py`
  - `/v1/health.activePromptVersions` now exposes only the public supported task types:
    - `deep-analyze: agent-v1`
    - `generate-poc: v1`
  - legacy S7-owned task prompts are no longer advertised there
- `services/build-agent/app/core/result_assembler.py`
  - fixed structured logging serialization bug discovered during verification (`ConfidenceBreakdown` is now serialized before logging)

## 3) Verification evidence
### Local regression / smoke
- `services/build-agent/tests/test_build_request_contract.py` -> passed (service-dir run)
- `services/build-agent/tests/test_result_assembler.py` -> passed (service-dir run)
- `services/analysis-agent/tests/test_skeleton_smoke.py` -> passed (service-dir run)
- direct build-agent TestClient smoke after fix:
  - request used top-level `contractVersion=build-resolve-v1`, `strictMode=true`
  - response now echoed:
    - `contractVersion=build-resolve-v1`
    - `strictMode=true`
- direct analysis-agent TestClient health smoke after fix:
  - `activePromptVersions == { deep-analyze: agent-v1, generate-poc: v1 }`

## 4) What S2 should do
1. **Use top-level `contractVersion` and `strictMode` as the canonical `build-resolve` shape.**
2. Do **not** rely on `context.trusted.contractVersion` / `context.trusted.strictMode` except as migration fallback.
3. If S2 has response-shape validation or persistence around build-agent responses, expect strict-v1 requests to echo:
   - `contractVersion: build-resolve-v1`
   - `strictMode: true`
4. Please coordinate/trigger the next runtime rollout or restart path as needed so the running integrated build-agent instance reflects the repo fix. S3 did not perform service restart.

## 5) No requested S2 code change beyond consumer/runtime alignment
At the contract level, this is mostly a **runtime alignment + consumer notice** rather than a new schema invention. The main change is that the running S3 service should now finally behave like the already-documented canonical top-level strict contract.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
