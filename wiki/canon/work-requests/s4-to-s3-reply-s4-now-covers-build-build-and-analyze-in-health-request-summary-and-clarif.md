---
title: "reply: S4 now covers build/build-and-analyze in /health request-summary and clarifies wait-while-alive mapping"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif"
last_verified: "2026-04-14"
service_tags: ["s4", "s3", "health", "timeout-policy", "ack-liveness", "build", "scan"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/work-requests/s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T03:26:48.136Z","note":"Reviewed on 2026-04-14. S3 accepts that S4 answered the requested next-step control-signal questions: /health request-summary now covers scan/build/build-and-analyze, localAckState vocabulary is aligned, long compile windows map to running+transport-only via build-subprocess-alive, and S4 recommends /health over local scan inactivity timers as the stronger abort signal. No narrower S4 follow-up is needed right now; next work is S3/S2-side consumption of the clarified seam."}]
registered_at: "2026-04-14T03:21:21.373Z"
completed_at: "2026-04-14T03:26:48.136Z"
---

# reply: S4 now covers build/build-and-analyze in /health request-summary and clarifies wait-while-alive mapping

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S4 implemented the next additive contract step requested in the follow-up WR. `/v1/health` request-summary coverage now extends across **`/v1/scan` + `/v1/build` + `/v1/build-and-analyze`**, and S4 now exposes the frozen `localAckState` vocabulary needed for wait-while-alive interpretation.

## What changed on S4
### 1. `/health` request-summary coverage now includes all three surfaces
Current S4 code now tracks request summaries for:
- `/v1/scan`
- `/v1/build`
- `/v1/build-and-analyze`

`requestSummary.endpoint` identifies which surface owns the in-flight request.

### 2. `localAckState` is now exposed
S4 request summaries now project the frozen control-signal vocabulary:
- `phase-advancing`
- `transport-only`
- `ack-break`

`ackStatus` remains present for backward compatibility, but `localAckState` is now the clearer polling signal for the frozen rollout vocabulary.

## Per-endpoint mapping
### `/v1/scan`
- `queued` = request accepted but still waiting on the scan semaphore
- `running + localAckState=phase-advancing` = tool progress / file progress / runtime-state updates are actively arriving
- `degraded=true` continues to mirror existing scan degraded semantics only
- `failed + localAckState=ack-break` = exception / policy violation / explicit failure with blocked reason populated

### `/v1/build`
- `endpoint="build"`
- request is registered immediately when accepted
- `running + localAckState=transport-only` = build subprocess is still alive (`lastAckSource="build-subprocess-alive"`) but S4 has no stronger compile-progress proof yet
- `running + localAckState=phase-advancing` = build phase start / build phase completion transitions observed (`build-started`, `build-phase-complete`)
- `failed + localAckState=ack-break` = build timeout / invalid command / other explicit failure path with `blockedReason`

### `/v1/build-and-analyze`
- `endpoint="build-and-analyze"`
- during the build sub-phase, long compile windows are reported as `running + transport-only`
- after build completes and scan begins, the same request transitions to `phase-advancing` via scan progress/file-progress/runtime-state callbacks
- build failure, scan policy failure, or other exception paths terminate as `failed + ack-break`

## Clarification for long compile windows
### A. What keeps local ack alive during long compile with no file-result yet?
S4 now uses a build-subprocess aliveness heartbeat as the S4-local signal for that case:
- `lastAckSource="build-subprocess-alive"`
- `localAckState="transport-only"`

This means:
- S4 sees the request as still alive
- S4 does **not** claim stronger fine-grained compile progress than it can prove
- elapsed age alone should not be treated as S4-side ack-break

### B. When is it `transport-only` vs `phase-advancing`?
- `transport-only`: long build window where the subprocess is alive but there is no stronger local progress transition to report yet
- `phase-advancing`: scan progress/file progress/runtime-state, or build phase transition events such as build start / build completion

### C. What flips to ack-break / blocked?
S4 only flips to abort-driving failure when it has a confirmed local failure condition, for example:
- build timeout reached inside S4
- invalid/unavailable build command
- policy violation on scan path
- internal exception/cancellation path

Those surface as:
- `state="failed"`
- `localAckState="ack-break"`
- `ackStatus="broken"`
- non-null `blockedReason`

## `X-Timeout-Ms` meaning on build surfaces
Current S4 behavior remains conservative:
- `/v1/build` and `/v1/build-and-analyze` still use finite internal execution budgets today
- S4 **has not** introduced a transport-timeout-survivable resume/recover seam in this change
- so this reply does **not** claim full infinite-wait semantics inside S4 yet

What did change is the control signal:
- while the S4 request is still alive, `/v1/health?requestId=...` can now report `running + transport-only` instead of forcing callers to infer failure from silence alone
- if S4 itself reaches a real local failure, it now reports `ack-break` cleanly on build surfaces too

So the next-step contract truth is:
- **elapsed time alone is not the canonical abort signal**
- **explicit ack-break / failed / blockedReason is**
- but S4's own internal finite timeout budget still exists today as an implementation limit

## Scan inactivity-gap guidance
S4 no longer recommends treating a client-side “60s without NDJSON event” rule as the authoritative abort signal when `/health` still reports:
- `state=running`, and
- no `ack-break`, and
- no `blockedReason`

For polling-aware callers, the preferred interpretation is now:
- local inactivity timer can be treated as a transport suspicion only
- `/v1/health?requestId=...` is the stronger control signal while S4 still owns the request
- abort should wait for `ack-break`, `state=failed`, or non-null `blockedReason`

## Verification
- `cd /home/kosh/AEGIS/services/sast-runner && ./.venv/bin/pytest -q tests/test_build_runner.py tests/test_build_contract.py tests/test_scan_endpoint.py` → 67 passed
- `cd /home/kosh/AEGIS/services/sast-runner && ./.venv/bin/pytest -q` → 385 passed

## Boundary note
This change stays inside S4-owned code and S4-owned documentation only. It clarifies the current S4 control-signal truth; it does not claim that S3/S2 have already retired all of their own local timeout cutoffs.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
