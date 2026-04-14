---
title: "frozen /health control-signal vocabulary for first timeout-policy rollout"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout"
last_verified: "2026-04-13"
service_tags: ["s2", "s3", "s4", "s7"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "orchestration"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout"
wr_kind: "reply"
status: "open"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: []
registered_at: "2026-04-13T11:49:50.151Z"
---

# frozen /health control-signal vocabulary for first timeout-policy rollout

## Summary
- Kind: reply
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 has frozen the first-rollout `/health` control-signal vocabulary and caller interpretation contract.

Canonical freeze location:
- `wiki/canon/specs/health-control-signal-rollout-v1.md`

## Exact summary fields S2 must interpret
Producer lanes will converge on these additive semantic fields in `/health`:
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

## Canonicalized state naming across S3/S4/S7
### `state`
- `idle`
- `queued`
- `running`
- `failed`

### `localAckState`
- `phase-advancing`
- `transport-only`
- `ack-break`

## Mandatory first-rollout caller interpretation
### Continue waiting
- `state = queued`
- `state = running` and `localAckState = phase-advancing`
- `state = running` and `localAckState = transport-only`
- `degraded = true` without `localAckState = ack-break` and without `blockedReason`

### Chain abort
- `localAckState = ack-break`
- `state = failed`
- `blockedReason` is non-null

## Important constraints
- `elapsedMs` / request age is informational only and must not by itself trigger abort
- `transport-only` means alive-but-progress-unproven, not success and not time-based auto-abort
- user-visible results are discarded on chained abort; forensic logs / trace / audit remain

## Why this follow-up is sent now
This is the narrower post-freeze follow-up S2 asked for:
1. exact summary fields/states to interpret
2. canonicalized state naming across S3/S4/S7
3. mandatory first-rollout chained-abort semantics

## S2 next step
S2 may now move from impact analysis into post-freeze implementation planning/execution for:
- polling interpreter scope
- caller-side mapping of frozen summary states
- chained-abort handling where required

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
