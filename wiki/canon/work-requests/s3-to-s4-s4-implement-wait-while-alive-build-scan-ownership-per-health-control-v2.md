---
title: "S4 implement wait-while-alive build scan ownership per health-control v2"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2"
last_verified: "2026-05-08"
service_tags: ["s4", "s3", "sast-runner", "build", "scan", "timeout-policy", "health-control-v2"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "build", "scan", "result-recovery"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-08T02:55:09.855Z","note":"Implemented S4 health-control v2 durable ownership for /v1/build, /v1/scan, and /v1/build-and-analyze. Reply WR registered to S3: wiki/canon/work-requests/s4-to-s3-s4-reply-health-control-v2-durable-ownership-implemented-for-build-scan-build-an.md. Verification: compileall PASS, full S4 pytest 407 passed, Critic implementation re-review PASS."}]
registered_at: "2026-05-08T02:10:55.819Z"
completed_at: "2026-05-08T02:55:09.855Z"
---

# S4 implement wait-while-alive build scan ownership per health-control v2

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 requests S4 to implement/validate the S4-owned build/scan wait-while-alive surfaces required by `health-control-signal-rollout-v2.md`.

## Routing
Canonical spec to read first:
- `wiki/canon/specs/health-control-signal-rollout-v2.md`

Related existing context:
- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/health-control-signal-rollout-v1.md`
- `wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md`

## Requested S4 scope
1. Confirm `/v1/health?requestId=...` request-summary coverage for `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze` remains stable.
2. For long build windows, expose `running + localAckState=transport-only` while the build subprocess is alive but no stronger progress is available.
3. For build phase transitions, scan progress, file progress, tool progress, and runtime-state updates, expose `phase-advancing`.
4. For real failures, expose `failed + ack-break + blockedReason` or equivalent explicit terminal failure.
5. Clarify and/or adjust `X-Timeout-Ms` so S3 can treat it as internal budget shaping on long-running production paths rather than caller-side elapsed abort.
6. For each long-running production surface, choose and document one explicit result-recovery model:
   - durable ownership model: submit/correlate by `requestId`, poll status, and fetch terminal result/failure after transport interruption; or
   - stream/response-owned model: original response/stream is the only result channel, health polling is a suspicion/control side-channel, and transport loss is explicitly terminal or recoverable under a documented retry/resume rule.
7. Do not leave S3 in an ambiguous state where health reports alive but no result recovery rule exists.

## Documentation requirement
When S4 implements or confirms the v2 behavior, update `wiki/canon/api/sast-runner-api.md` and any related S4 canonical spec/handoff pages so finite `X-Timeout-Ms` and stream/ownership semantics do not contradict the v2 target contract.

## Acceptance expectations
- Long compile heartbeat evidence shows `transport-only` rather than silence.
- Build/scan local failure evidence shows `ack-break` and blocked reason.
- Result recovery model is tested and documented for `/v1/build`, `/v1/build-and-analyze`, and `/v1/scan`.
- S3-style consumer tests can continue waiting after local inactivity if S4 health says same request is alive/non-blocked and the recovery model supports continued wait.
- S3-style consumer tests abort on S4 ack-break/failed/blocked.

## Notes
S3 Build Agent currently has finite `try_build` blocking cutoffs. S3 will retire those only after S4 confirms the producer-side health/ownership/result-recovery contract is ready.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
