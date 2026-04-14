---
title: "Health control-signal rollout v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "mcp://write_page"
  - "wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio.md"
  - "wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md"
  - "wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics.md"
last_verified: "2026-04-13"
service_tags: ["s3", "s4", "s7", "s2"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/technical-overview.md", "wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md", "wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics.md"]
---

# Health control-signal rollout v1

> First-rollout contract freeze owned by S3 for the timeout-policy redesign.
> Scope: `/health` enhancement only.

## Rollout boundary
This freeze applies only to the first rollout:
- producer lanes: S3 / S4 / S7
- consumer/orchestrator lane: S2
- existing `/health` enhancement only
- no new primary endpoint
- no result payload redesign
- no full per-request dump
- no global numeric stall threshold

## Control policy
1. `/health` is a **control signal**, not just observability.
2. Liveness is governed by **service-local ack/progress**, not elapsed time.
3. **Elapsed time is informational only** and must not by itself trigger abort.
4. A caller may continue waiting indefinitely while lower-service health does not report blocked / ack-break.
5. **Ack-break / blocked** is the canonical abort trigger for polling callers.
6. The side expecting local ack interrupts first; abort then chains upward.
7. User-visible results are discarded on chained abort; forensic logs / trace / audit remain.
8. Upper services use **polling** against lower-service `/health` in this rollout.

## Shared glossary owner
- First-rollout glossary owner: **S3**

## Canonical glossary
### `state`
Canonical request-summary `state` meanings:
- `idle` — no active request
- `queued` — request accepted but not yet actively executing
- `running` — request actively executing
- `failed` — request has entered terminal failure state

### `localAckState`
Canonical request-summary local ack meanings:
- `phase-advancing` — the service has recently observed a real local progress transition
- `transport-only` — the service sees infrastructure/transport aliveness but has no stronger local progress proof
- `ack-break` — the service has observed a confirmed local break/failure in the ack chain

### `degraded`
- `true` means work may still continue but under reduced/partial conditions
- `degraded` alone is **not** an abort trigger

### `blockedReason`
- non-null `blockedReason` means the service is explicitly reporting an abort-driving blocked condition

## Canonical additive summary fields
Producer `/health` responses should add the following semantic fields:
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

Lane-specific compact progress counters may also appear (examples: active tools, completed tools, findings count, files completed/total, current file), but they are supplementary and not required for caller-side interpretation.

## Polling caller interpretation (frozen)
Polling callers such as S2 or S3 should interpret lower-service `/health` summaries like this:

### Continue waiting
Continue waiting when any of the following is true:
- `state = queued`
- `state = running` and `localAckState = phase-advancing`
- `state = running` and `localAckState = transport-only`
- `degraded = true` without `localAckState = ack-break` and without `blockedReason`

### Chain abort
Chain abort when any of the following is true:
- `localAckState = ack-break`
- `state = failed`
- `blockedReason` is non-null

### Important caveat
- `elapsedMs` or request age must **not** trigger abort on their own
- `transport-only` means **alive but progress-unproven**, not success and not auto-abort

## Lane-specific accepted mappings
### S4 mapping accepted into freeze
S4 may expose richer compact progress detail, including:
- active/completed tools
- findings count
- files completed/total
- current file
- degrade reasons

Accepted S4 abort-driving conditions for callers:
- `ackStatus="broken"` mapped to `localAckState = ack-break`
- failed state with a populated blocked reason

### S7 mapping accepted into freeze
Accepted S7 true local ack sources:
- queue exit
- phase transition
- terminal transition

Accepted S7 non-ack signals:
- TCP connection still open
- backend reachable
- circuit breaker closed/half-open
- elapsed time increasing

Accepted first-rollout limitation:
- during non-streaming `llm-inference`, S7 may only report `transport-only` rather than proving fine-grained progress

### S3 mapping target
S3 should project its existing internal progress events (for example tool completion, turn completion, result assembly, session end) into this frozen summary vocabulary.

## S2 post-freeze consumer scope
After freeze, S2 should implement:
1. polling interpreter scope for downstream `/health`
2. caller-side mapping of `state`, `localAckState`, `degraded`, and `blockedReason`
3. chained-abort handling in analysis/pipeline orchestration where required

## Evidence of freeze inputs
This freeze incorporates the following reply WRs:
- `s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio`
- `s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout`
- `s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics`

## Freeze note
This page is the canonical contract-freeze evidence location for Wave 2 readiness in the first rollout.
