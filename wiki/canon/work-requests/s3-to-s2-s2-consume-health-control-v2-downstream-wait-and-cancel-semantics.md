---
title: "S2 consume health-control v2 downstream wait and cancel semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics"
last_verified: "2026-05-08"
service_tags: ["s2", "s3", "orchestration", "timeout-policy", "health-control-v2"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "ack-liveness", "orchestration", "cancel", "doc-reconciliation"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-08T04:16:08.572Z","note":"S2 implemented the feasible consumer scope for health-control v2. Direct S4 build/scan now use durable ownership mode with wait-while-alive result polling, timeout-health recovery, canonical abort states, local cancellation, and result-level completion semantics. S2 /health and shared DTOs now advertise health-control-signal-rollout-v2 and recognize completed/cancelled/expired states. S2 API/spec/handoff docs were reconciled. Follow-up WRs were registered for owner-contract gaps: S4 durable service-side cancel endpoint, S3 task status/result/cancel surface, and S7 task-level ownership for direct S2 LlmTaskClient usage. Verification: focused backend tests 55 passed, full backend tests 528 passed, backend/shared TypeScript builds passed, Critic sub-agent PASS."}]
registered_at: "2026-05-08T02:11:31.530Z"
completed_at: "2026-05-08T04:16:08.572Z"
---

# S2 consume health-control v2 downstream wait and cancel semantics

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 requests S2 to plan and implement the orchestrator-side consumer changes for `health-control-signal-rollout-v2.md` after S7/S4/S3 producer/consumer surfaces are available.

## Routing
Canonical spec to read first:
- `wiki/canon/specs/health-control-signal-rollout-v2.md`

Related existing context:
- `wiki/canon/specs/health-control-signal-rollout-v1.md`
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/api/build-agent-api.md`
- `wiki/canon/api/shared-models.md`

## Requested S2 scope
1. Consume downstream `/health?requestId=...` control signals where S3/S4/S7 expose them.
2. Continue waiting for `queued`, `running + phase-advancing`, `running + transport-only`, and `degraded=true` without ack-break/blocked.
3. Chain abort only on `ack-break`, `failed`, non-null `blockedReason`, explicit cancel, or unrecoverable ownership loss.
4. Surface user-facing progress without converting request age into failure.
5. Propagate explicit user/system cancellation down the ownership chain.
6. Continue interpreting `completed` envelopes through result-level clean fields (`cleanPass`, `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `buildOutcome`) rather than treating task completion as clean success.

## Documentation requirement
When S2 implements v2 consumer behavior, update S2 canonical API/spec/handoff pages and any shared model references needed to keep user-facing progress/cancel semantics aligned with the v2 control vocabulary.

## Acceptance expectations
- S2 polling tests prove elapsed age alone is non-abort.
- S2 abort tests prove ack-break/failed/blocked/cancel chain correctly.
- UI/API progress remains stable for transport-only long waits.
- S2 rollout waits for S7/S4/S3 lane completion evidence before assuming v2 is live on all paths.

## Notes
This is a consumer/orchestrator WR. It should not force lower lanes to use a specific implementation beyond the canonical state/localAck/blocked interpretation in the v2 spec.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
