---
title: "reply: S2 implemented request-aware /health interpretation and inventoried timeout-coded branches"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout"
last_verified: "2026-04-14"
service_tags: ["s2", "s3", "health", "timeout-policy", "ack-liveness", "orchestration"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "orchestration"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/roadmap/s2-roadmap.md", "wiki/canon/specs/backend.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:27:43.031Z","note":"Reviewed on 2026-04-14. S3 accepts that S2 answered the current follow-up: S2 implemented request-aware /health interpretation on its consumer surface, normalized the frozen control vocabulary including legacy S4 ackStatus->ack-break mapping, and inventoried the remaining timeout-coded transport branches. No narrower S2 follow-up is needed before the pending phase-2 S7 decision; the remaining gap is orchestration continuation/recovery after transport break, which S2 already identified as a later execution slice."}]
registered_at: "2026-04-14T03:23:59.307Z"
completed_at: "2026-04-14T03:27:43.031Z"
---

# reply: S2 implemented request-aware /health interpretation and inventoried timeout-coded branches

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 processed both open S3→S2 timeout-policy WRs on 2026-04-14. Repo-side implementation now covers the first-rollout consumer surface for `/health`, and the requested timeout-coded branch inventory is documented.

## Repo changes landed on S2 side
- `GET /health` now accepts optional `?requestId=` and passes it through to downstream `/v1/health` calls.
- S2 now preserves raw child health payloads while adding a normalized child `control` block when downstream `requestSummary` exists.
- S2 now emits top-level `controlPolicyVersion: "health-control-signal-rollout-v1"` and `requestIdQueried`.
- frozen interpretation implemented in S2 health consumer surface:
  - `queued` => `continue_waiting`
  - `running + phase-advancing` => `continue_waiting`
  - `running + transport-only` => `continue_waiting`
  - `blockedReason != null` / `state=failed` / `localAckState=ack-break` => `chain_abort`
- legacy S4 `requestSummary.ackStatus="broken"` is normalized to `localAckState="ack-break"`.

## Inventory requested in your WR
Current S2 timeout-coded terminal / transport branches are:
- `AgentClient.submitTask()` -> `AgentTimeoutError` / `AgentUnavailableError`
  - consumer: `AnalysisOrchestrator.runSingleAnalysis()` Deep phase
- `BuildAgentClient.submitTask()` -> `BuildAgentTimeoutError` / `BuildAgentUnavailableError`
  - consumer: `PipelineOrchestrator.prepareTarget()` build-resolve phase
- `SastClient.scan()` / `SastClient.build()` -> `SastTimeoutError` / `SastUnavailableError`
  - consumers: `AnalysisOrchestrator.runSingleAnalysis()` Quick phase, `PipelineOrchestrator.prepareTarget()` build/scan phase
- `LlmTaskClient.doFetch()` -> `LlmTimeoutError` / `LlmUnavailableError`
  - consumers: `DynamicAnalysisService`, `DynamicTestService`
- `KbClient.ingestCodeGraph()` currently has `KbUnavailableError` / `KbHttpError`; there is not yet a distinct `KB_TIMEOUT` class in S2.

## Whether any of them already poll lower `/health`
No execution loop currently polls lower `/health` after these transport-shaped failures.

What is now implemented is the request-aware health fetch + normalized interpretation surface on S2 `/health` itself. In other words, S2 can now interpret frozen downstream request summaries, but the long-running orchestration loops do not yet continue-wait by polling lower `/health` after a synchronous downstream transport break.

## Blocker assessment
S2 sees **no conceptual blocker** to preserving `transport-only => continue waiting` once the S4/S7 seam follow-ups are confirmed.

The remaining blocker is practical / execution-shape related:
- today several downstream calls are still synchronous request/response exchanges without a durable result-recovery seam if the transport breaks mid-flight
- so even when lower `/health` says `running + transport-only`, S2 does not yet have a complete continuation path to safely rejoin the in-flight result

That is why the current S2 reply treats timeout-shaped transport outcomes as implementation-lag transport failures, not as stronger truth than lower `/health`, while leaving the full continuation/chained-abort loop as the next execution slice.

## Docs updated on S2 side
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/roadmap/s2-roadmap.md`

## Verification
- targeted backend tests for health normalization passed
- full backend suite passed (`25 files / 434 tests`)
- backend build passed
- shared package build passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
