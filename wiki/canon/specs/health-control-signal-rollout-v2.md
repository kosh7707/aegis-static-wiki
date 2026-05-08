---
title: "Health control-signal rollout v2 — wait-while-alive ownership contract"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/health-control-signal-rollout-v1.md"
  - "wiki/canon/api/llm-gateway-api.md"
  - "wiki/canon/api/sast-runner-api.md"
  - "wiki/canon/api/analysis-agent-api.md"
  - "wiki/canon/api/build-agent-api.md"
  - "wiki/canon/specs/build-agent.md"
  - "wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md"
last_verified: "2026-05-08"
service_tags: ["s2", "s3", "s4", "s5", "s7", "health", "timeout-policy", "ack-liveness", "wait-while-alive"]
decision_tags: ["health-control-v2", "timeout-policy", "ack-liveness", "async-ownership", "elapsed-time-not-abort", "routing-contract"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent.md", "wiki/canon/work-requests/s3-to-s7-s7-implement-wait-while-alive-async-llm-ownership-per-health-control-v2.md", "wiki/canon/work-requests/s3-to-s4-s4-implement-wait-while-alive-build-scan-ownership-per-health-control-v2.md", "wiki/canon/work-requests/s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence.md", "wiki/canon/work-requests/s3-to-s2-s2-consume-health-control-v2-downstream-wait-and-cancel-semantics.md", "wiki/canon/work-requests/s3-to-s5-s5-plan-long-running-kb-and-codegraph-ownership-for-health-control-v2-follow-up.md"]
---

# Health control-signal rollout v2 — wait-while-alive ownership contract

> Owner: S3 for cross-lane control vocabulary and rollout routing.  
> Scope: S2/S3/S4/S5/S7 long-running request ownership, health polling, result recovery, and timeout semantics.  
> Status: canonical planning/specification contract for the next rollout wave.  
> Last verified: 2026-05-08.

## 1. Why v2 exists

`health-control-signal-rollout-v1.md` froze the first shared rule: `/health` is a control signal, elapsed wall-clock time alone is not an abort reason, and polling callers should abort only on explicit ack-break / failed / blocked signals.

The remaining gap is that several production paths still contain finite elapsed-time cutoffs below the control-signal layer:

- S7 synchronous `/v1/chat` has a finite compatibility timeout around the live LLM call.
- S3 LLM async ownership consumers still have a finite poll deadline before cancelling the async request.
- S3 Build Agent `try_build` still calls S4 `/v1/build` through a finite blocking HTTP call and finite tool executor budget.
- S3 Analysis Agent S4/S5 paths still include per-call or inactivity timers that may convert long-but-alive work into local timeout-shaped outcomes.
- S2 orchestration can only become fully wait-while-alive after lower services expose stable request ownership and polling semantics.

Qwen3.6-27B generation is slow enough that elapsed ceilings can be lower than valid completion time. Large build/SAST/KB/codegraph jobs will also lengthen as S4/S5 capabilities improve. V2 therefore moves the policy from “health is visible” to “long-running ownership must be controlled by explicit terminal state and recoverable result ownership, not by wall-clock age.”

## 2. Non-goals and compatibility boundary

V2 does **not** require every legacy synchronous endpoint to become infinite-blocking. Compatibility surfaces may remain finite when they are explicitly documented as such.

V2 does require that long-running production paths have an ownership/polling path where:

- the caller can submit or correlate a durable request;
- the caller can poll compact request state;
- the caller can retrieve the terminal result or explicit terminal failure, or the endpoint clearly documents that the original response stream must remain open and transport loss is terminal;
- elapsed age alone does not cause caller-side abort while the owner reports alive/non-blocked state.

Finite synchronous HTTP read timeouts may remain as compatibility mechanics, but they must not be the only way to drive long-running AEGIS work that is expected to finish eventually.

## 3. Canonical abort and continue rules

### Continue waiting

A polling caller must continue waiting when the relevant downstream request summary is for the same request and any of these are true:

- `state = queued`
- `state = running` and `localAckState = phase-advancing`
- `state = running` and `localAckState = transport-only`
- `degraded = true` without `localAckState = ack-break` and without `blockedReason`

`transport-only` means alive but progress-unproven. It is not success, but it is also not abort.

### Chain abort

A polling caller must chain abort when any of these are true:

- `localAckState = ack-break`
- `state = failed`
- `blockedReason` is non-null
- explicit user/system cancel is confirmed
- ownership is explicitly terminally expired and no retained result can be recovered
- downstream service is unreachable in a way that prevents ownership status from being established or recovered

### Explicitly non-canonical abort reason

Elapsed wall-clock time, request age, or “too long for a normal run” is not a canonical abort reason while ownership state is `queued` or `running` without ack-break/blocked.

## 4. Required request ownership vocabulary

Long-running owner services should expose the v1 compact fields, with stable interpretation:

- `activeRequestCount`
- `requestSummary.requestId`
- `requestSummary.endpoint`
- `requestSummary.state`
- `requestSummary.localAckState`
- `requestSummary.degraded`
- `requestSummary.degradeReasons`
- `requestSummary.lastAckAt`
- `requestSummary.lastAckSource`
- `requestSummary.blockedReason`

Allowed `state` values remain `idle`, `queued`, `running`, `completed`, `failed`, plus endpoint-specific documented terminal states such as S7 async `cancelled` / `expired`.

Allowed `localAckState` values remain `phase-advancing`, `transport-only`, `ack-break`, and `null` when idle/completed/non-applicable.

## 5. S7 requirements — LLM async ownership is the primary long-running surface

S7 may keep `/v1/chat` as a finite synchronous compatibility surface. That endpoint may continue to protect HTTP transports with finite read deadlines.

S7 `/v1/async-chat-requests` must be the production long-running LLM ownership surface. For this surface, S7 should remove or neutralize elapsed-time-only backend aborts for healthy requests. The async request should remain alive while the backend attempt is still owned and no explicit terminal failure has occurred.

Required behavior:

1. Submit returns durable ownership ID and trace ID.
2. Status polling returns `queued`/`running`/terminal state plus `localAckState`.
3. Long non-streaming inference may report `running + transport-only` when S7 cannot prove token-level progress but still owns a live backend attempt.
4. True backend failure, circuit-open, backend timeout, parser contract break, cancellation, or explicit expiry must surface as terminal state with `blockedReason` or equivalent terminal detail.
5. Result retrieval must preserve terminal success or explicit terminal failure long enough for upper callers to recover after transport interruption.
6. Callers must not treat elapsed age as abort while async ownership reports `queued`/`running` without ack-break/blocked.

S3 LLM callers should stop using a fixed async poll deadline as an abort condition on the long-running path. They may keep short connect/status-call timeouts and retry polling, but the controlling terminal decision should come from S7 state: completed/resultReady, failed/cancelled/expired, ack-break, blockedReason, or explicit cancel.

## 6. S4 requirements — build/scan/build-and-analyze wait-while-alive

S4 already documents request summaries for `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze`. V2 promotes that mapping into the consumer contract for S3 Build Agent and Analysis Agent.

Required behavior:

1. `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze` expose request-aware `/v1/health?requestId=...` summaries.
2. Long compile windows report `running + transport-only` when the build subprocess is alive but no stronger compile progress can be proven.
3. Build phase start/completion, scan progress, file progress, tool progress, and runtime-state callbacks report `phase-advancing`.
4. Real local failures report `failed + ack-break` and a populated `blockedReason` / failure detail.
5. `X-Timeout-Ms` on build/scan surfaces should be treated as internal budget shaping unless an endpoint is explicitly documented as finite compatibility-only.
6. For each long-running production surface, S4 must choose and document one of these result-recovery models:
   - **durable ownership model**: submit/correlate by `requestId`, poll status, and fetch terminal result/failure after transport interruption; or
   - **stream/response-owned model**: the original response/stream is the only result channel, health polling is a suspicion/control side-channel, and transport loss is explicitly classified as terminal or recoverable with a documented retry/resume rule.
7. S3 must not be left in an ambiguous state where health says the request is alive but there is no defined way to recover the eventual build/scan result.

S3 should retire hard client aborts for S4 long-running paths only when the S4 result-recovery model for that path is explicit. Inactivity timers may become suspicion triggers that cause an immediate health poll, not terminal abort by themselves.

## 7. S3 implementation requirements

S3 owns a separate self-routed implementation WR: `wiki/canon/work-requests/s3-to-s3-s3-implement-health-control-v2-consumers-and-cross-lane-live-evidence.md`.

Shared runtime:

- Keep elapsed wall-clock time informational only in `TerminationPolicy`.
- Do not reintroduce wall-clock-only termination.

Analysis Agent:

1. Remove fixed async LLM poll deadline as a terminal abort on the S7 async ownership path.
2. Keep bounded connect/status/result call timeouts, but retry status polling while S7 reports alive/non-blocked state.
3. Convert SAST NDJSON inactivity timeout into a suspicion path: if no event arrives, poll S4 `/v1/health?requestId=...`; continue if S4 reports queued/running without ack-break/blocked and the S4 result-recovery model allows continued wait.
4. For `/v1/build-and-analyze`, avoid relying solely on a blocking HTTP timeout; prefer S4 ownership/status/result or documented health-aware recovery when available.
5. Continue classifying S3-owned output deficiencies as completed/inconclusive where an honest envelope can be assembled; reserve public timeout for true hard deadline/cancel/ownership loss that prevents envelope assembly.

Build Agent:

1. Add request-aware `/v1/health` summary fields aligned with Analysis Agent and the v1/v2 glossary.
2. Replace `try_build` finite blocking semantics with S4 build ownership/status/result or a documented health-aware wait-while-alive behavior.
3. Retire fixed `X-Timeout-Ms=120000` as an end-to-end abort for strict compile-first build resolution; retain only internal budget shaping if S4 accepts that meaning.
4. Ensure ToolExecutor does not cut off long-running build execution merely because elapsed time exceeds 120 seconds while S4 reports alive/non-blocked.
5. Preserve clean build semantics: completed envelope is not clean success; `cleanPass` and `buildOutcome` remain authoritative.

S3 also owns the final cross-lane live evidence packet after S7/S4/S3 implementation is ready.

## 8. S5 requirements — follow-up wave for KB/codegraph growth

S5 is not the first blocker for LLM/build wait-while-alive, but it is in scope for the policy direction because KB/codegraph ingestion/search may become long-running.

S5 should plan:

1. request-aware health summaries for long ingest/search/CVE/codegraph operations;
2. clear `KB_NOT_READY`, timeout, degraded, and ack-break meanings;
3. ownership/status/result or recovery seams for operations that may exceed ordinary HTTP read time;
4. S3/S2 consumer guidance so knowledge absence caused by timeout is not treated as negative evidence.

## 9. S2 orchestration requirements

S2 should consume v2 only after lower producers expose stable control signals. S2 should then:

1. poll downstream `/health?requestId=...` for active long-running requests;
2. continue waiting for queued/running/transport-only/phase-advancing/degraded-without-blocked;
3. abort only on ack-break/failed/blocked/explicit cancel/ownership loss;
4. surface user-facing progress without converting age into failure;
5. propagate explicit cancellation down the ownership chain;
6. avoid presenting completed task envelopes as clean success unless result-level clean fields say so.

## 10. Documentation reconciliation rule

Each lane that implements v2 behavior must update its canonical API/spec docs in the same handoff window. Existing finite-timeout descriptions are allowed as current-state compatibility notes before implementation, but after implementation they must be reconciled so consumers do not see contradictory target contracts.

Minimum doc reconciliation:

- S7 updates `wiki/canon/api/llm-gateway-api.md` for async ownership wait-while-alive and any remaining finite `/v1/chat` compatibility boundary.
- S4 updates `wiki/canon/api/sast-runner-api.md` for build/scan/build-and-analyze result-recovery model and `X-Timeout-Ms` meaning.
- S3 updates `wiki/canon/api/analysis-agent-api.md`, `wiki/canon/api/build-agent-api.md`, and `wiki/canon/specs/build-agent.md` for consumer behavior.
- S2/S5 update their relevant canonical docs when their consumer/producer scopes land.

## 11. Rollout sequence

Recommended order:

1. S3 publishes this v2 contract and routes WRs.
2. S7 implements/validates async LLM wait-while-alive by removing elapsed-only backend/poll abort from async ownership.
3. S4 implements/validates build/scan/build-and-analyze ownership/health/result-recovery behavior for long compile and scan windows.
4. S3 updates Analysis Agent and Build Agent consumers, including Build Agent requestSummary and S4 health-aware `try_build`.
5. S2 updates orchestration polling/cancel handling.
6. S5 follows with long KB/codegraph ownership semantics.
7. S3 coordinates cross-lane live evidence proving long-but-alive operations complete rather than timeout.

## 12. Acceptance gates

Contract tests:

- Producer health summaries use only the canonical state/localAck vocabulary or documented extensions.
- Polling interpreters continue on queued/running/transport-only/phase-advancing.
- Polling interpreters abort on ack-break/failed/blockedReason.
- Elapsed age alone is tested as non-abort.

S7 tests:

- Async request can remain running beyond the former S3 poll deadline while status reports alive/non-blocked.
- S3-style poller does not cancel solely due to elapsed age.
- True backend failure still becomes terminal blocked/ack-break or documented terminal state.
- Result retrieval works after long run completion.

S4 tests:

- Long build subprocess heartbeat reports `running + transport-only`.
- Build phase transitions report `phase-advancing`.
- Build timeout/policy failure reports `failed + ack-break + blockedReason`.
- Result-recovery model is tested: either status/result retrieval after transport interruption, or explicit stream-owned terminal/recoverable behavior.
- S3-style client does not treat local inactivity as terminal if S4 health says alive and the recovery model supports continued wait.

S3 tests:

- Analysis Agent LLM async polling has no elapsed-only hard abort in the wait-while-alive path.
- Analysis Agent SAST inactivity triggers health verification before abort.
- Build Agent `try_build` no longer ends a healthy long build at 120/180 seconds once the S4 producer contract is available.
- Build Agent `/v1/health` exposes requestSummary aligned with v2.

S2/S5 tests:

- S2 propagates progress/cancel and chains abort only on canonical abort signals.
- S5 long operation timeout/not-ready/degraded states do not cause S3 to treat missing knowledge as negative evidence.

Cross-lane live evidence:

- S3 owns final evidence aggregation after S7/S4/S3 implementation.
- Evidence should include long LLM, long build/scan, continue-on-alive, and abort-on-ack-break cases, or accelerated equivalents that prove the same control semantics.

## 13. Compatibility warning

This document is a target rollout contract. Until each lane completes its WR, current code may still contain finite local timeouts. Consumers must check lane-specific completion evidence before assuming v2 behavior is live on a given path.
