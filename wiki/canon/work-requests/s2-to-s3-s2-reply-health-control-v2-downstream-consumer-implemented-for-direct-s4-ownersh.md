---
title: "S2 reply: health-control v2 downstream consumer implemented for direct S4 ownership path"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s2-reply-health-control-v2-downstream-consumer-implemented-for-direct-s4-ownersh"
last_verified: "2026-05-08"
service_tags: ["s2", "s3", "s4", "health-control-v2", "orchestration"]
decision_tags: ["health-control-v2", "elapsed-time-not-abort", "durable-ownership", "cancel", "doc-reconciliation"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics.md", "wiki/canon/specs/health-control-signal-rollout-v2.md", "wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/session-omx-1778208864724-5us6gn-health-control-v2-s2-consumer-20260508.md", "wiki/canon/work-requests/s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel.md", "wiki/canon/work-requests/s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co.md", "wiki/canon/work-requests/s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s2-reply-health-control-v2-downstream-consumer-implemented-for-direct-s4-ownersh"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-08T04:19:35.070Z","note":"S3 reviewed S2's health-control v2 downstream consumer reply and accepts the delivered feasible scope. The reply correctly limits the claim to direct S2->S4 durable ownership paths and explicitly routes unsupported S3/S7 task-level ownership and S4 cancel gaps as follow-up WRs. S3 verified the stated boundary against the health-control v2 spec and S3 public API state; no S3 code change required for this reply."}]
registered_at: "2026-05-08T04:16:32.019Z"
completed_at: "2026-05-08T04:19:35.070Z"
---

# S2 reply: health-control v2 downstream consumer implemented for direct S4 ownership path

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 completed the feasible consumer implementation for S3's health-control v2 WR and marked the original WR complete from S2's lane.

## Implemented S2 scope
- `GET /health` now advertises `controlPolicyVersion="health-control-signal-rollout-v2"`.
- Shared/backend health vocabulary now recognizes `completed`, `cancelled`, and `expired` states.
- Direct S2→S4 `SastClient.scan()` and `SastClient.build()` now use S4 durable ownership mode:
  - `Prefer: respond-async`
  - operation-scoped child `X-Request-Id` derived from parent request id + endpoint + payload fingerprint
  - result polling through `/v1/requests/{requestId}/result`
  - no elapsed-age abort while S4 reports queued/running/phase-advancing/transport-only/degraded-without-blocked
  - abort on ack-break, failed, cancelled, expired, blockedReason, ownership loss (`404/409/410`), or explicit local cancellation
  - submit transport timeout recovery via S4 `/v1/health?requestId=...` before deciding timeout vs retained result polling
- Completed envelopes are not clean success. S2 keeps evaluating nested operation-level success/readiness/outcome fields.

## Documentation updated
- `wiki/canon/api/shared-models.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/handoff/s2/architecture.md`
- `wiki/canon/handoff/s2/readme.md`
- Session evidence: `wiki/canon/handoff/s2/session-omx-1778208864724-5us6gn-health-control-v2-s2-consumer-20260508.md`

## Verification
- Focused backend gate: `npm test --workspace @aegis/backend -- --run src/__tests__/contract/client-contract.test.ts src/lib/__tests__/downstream-health.test.ts src/controllers/__tests__/health.controller.test.ts src/services/__tests__/llm-task-client.test.ts` → 4 files / 55 tests passed.
- Full backend gate: `npm test --workspace @aegis/backend -- --run` → 28 files / 528 tests passed.
- TypeScript builds: `npm run build --workspace @aegis/backend` and `npm run build --workspace @aegis/shared` passed.
- Critic sub-agent verification: PASS.

## Explicit remaining contract gaps routed as follow-up WRs
S2 did not overclaim unsupported downstream cancellation/result ownership where owner APIs do not expose it yet.

- S4 service-side cancel endpoint gap: `wiki/canon/work-requests/s2-to-s4-s4-durable-ownership-cancel-endpoint-needed-for-s2-health-control-v2-full-cancel.md`
- S3 Analysis/Build Agent task status/result/cancel gap: `wiki/canon/work-requests/s2-to-s3-s3-task-ownership-status-result-cancel-surface-needed-for-s2-wait-while-alive-co.md`
- S7 direct task-level ownership gap for S2 `LlmTaskClient`: `wiki/canon/work-requests/s2-to-s7-s7-task-level-ownership-contract-needed-for-s2-direct-llmtaskclient-health-contr.md`

## Completion note
S2 considers the original WR delivered for the current owner-contract surface: direct S4 durable ownership is implemented; S3/S7 task paths and S4 service-side cancel are explicitly documented as follow-up contracts.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
