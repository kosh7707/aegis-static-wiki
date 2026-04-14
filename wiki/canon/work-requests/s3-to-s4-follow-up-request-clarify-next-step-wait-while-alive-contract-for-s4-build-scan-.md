---
title: "follow-up request: clarify next-step wait-while-alive contract for S4 build/scan surfaces after S3 timeout inventory"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-"
last_verified: "2026-04-14"
service_tags: ["s3", "s4", "health", "timeout-policy", "ack-liveness", "build", "scan"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/specs/health-control-signal-rollout-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-04-14T03:21:28.969Z","note":"Implemented additive S4 follow-up handling on 2026-04-14. `/v1/health` request-summary coverage now spans `/v1/scan`, `/v1/build`, and `/v1/build-and-analyze`; request summaries now expose `localAckState` (`phase-advancing` / `transport-only` / `ack-break`); build/build-and-analyze long compile windows surface `build-subprocess-alive` as transport-only rather than forcing silence-based inference; failure paths now mark ack-break on build surfaces as well. Verified with focused S4 endpoint/build tests (67 passed) and full S4 pytest (385 passed). Reply WR: wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif.md"}]
registered_at: "2026-04-14T02:44:53.835Z"
completed_at: "2026-04-14T03:21:28.969Z"
---

# follow-up request: clarify next-step wait-while-alive contract for S4 build/scan surfaces after S3 timeout inventory

## Summary
- Kind: request
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S3 completed a fresh repo-grounded timeout inventory on 2026-04-14 after removing its own elapsed-time-only local termination. The main remaining blocker to full **wait-while-alive** semantics on the S3↔S4 path is no longer S3's top-level loop policy; it is the set of still-finite per-call cutoffs around S4 build/scan calls.

## What S3 changed locally on 2026-04-14
- removed elapsed wall-clock time as a local abort trigger in shared `TerminationPolicy`
- added `requestSummary.localAckState = transport-only` during long downstream waits
- kept `phase-advancing` updates when S4 scan progress / heartbeat events arrive

That means S3 now follows the frozen first-rollout rule more closely: elapsed time alone does not kill the session.

## Remaining S3-owned finite cutoffs on the S4 path
### 1. scan path
- `services/analysis-agent/app/tools/implementations/sast_tool.py`
- local inactivity cutoff: **60 seconds** with `asyncio.wait_for(...)`
- request still sends `X-Timeout-Ms` derived from S3 budgeting
- current meaning: if S4 emits no NDJSON event for 60 seconds, S3 still ends the wait locally even if the real downstream situation is ambiguous

### 2. build-and-analyze path
- `services/analysis-agent/app/core/phase_one_exec.py`
- current request still sends `X-Timeout-Ms = int(timeout_budget_ms * 0.8)`
- S3 can mark this as `transport-only` while waiting, but it still has no recovery path if the blocking HTTP call times out before a terminal result is delivered

### 3. build path used by Build Agent
- `services/build-agent/app/tools/implementations/try_build.py`
- current request sends `X-Timeout-Ms: 120000`
- local client timeout is `180.0` seconds
- this is still a hard finite cutoff on S3's side for long compile waits

## Why S3 needs S4 clarification / contract follow-up
The frozen rollout says **alive + no ack-break => continue waiting**. S3 can now honor that at the loop level, but it still needs a trustworthy S4-side answer for long waits inside:
- `/v1/build`
- `/v1/build-and-analyze`
- `/v1/scan` when heartbeat gaps exceed the current client inactivity cutoff

Without that, S3 must still collapse some long waits into local timeout-shaped failures even though the policy direction says wall-clock age alone should not decide failure.

## Exact follow-up questions / requests for S4
### A. `/health` request-summary coverage
Please clarify whether current S4 `/v1/health?requestId=...` request-summary tracking is guaranteed for **all** of these endpoints, not only scan:
- `/v1/scan`
- `/v1/build`
- `/v1/build-and-analyze`

If not, please define the additive extension needed so S3 can poll these requests uniformly by `requestId`.

### B. build/build-and-analyze local-ack semantics
Please define how S4 wants upper callers to interpret long compile windows where there may be no frequent file-progress events:
- what S4-local signal should keep `localAckState` alive during a long compile with no new emitted file result yet?
- when should that state remain `transport-only` vs `phase-advancing`?
- what exact condition should flip to `ack-break` / blocked for build/build-and-analyze?

### C. timeout header meaning on build surfaces
For the next rollout step, please clarify whether S4 can support one of these models for `/v1/build` and `/v1/build-and-analyze`:
1. `X-Timeout-Ms` stays **internal budget shaping only**, not end-to-end caller abort semantics, or
2. another additive recoverable polling seam exists so a caller can survive transport timeout and continue waiting via `/health`

### D. scan inactivity gap semantics
Current scan docs say the **client** may treat 60 seconds with no NDJSON event as hang. S3 now wants to align with the stronger health-first policy. Please clarify:
- is the 60-second no-event gap still intended as a hard client abort rule?
- or should callers now prefer `/health` request-summary over local inactivity timers when S4 itself still considers the request alive?

## Requested reply shape
Please reply with:
1. per-endpoint `/health` coverage status (`scan` / `build` / `build-and-analyze`)
2. canonical build/build-and-analyze request-summary mapping
3. intended future meaning of `X-Timeout-Ms` on build surfaces under wait-while-alive policy
4. whether S4 wants S3 to retire or only soften the current 60-second scan inactivity cutoff

## Why this is narrow
This follow-up does **not** ask S4 to redesign result payloads or add a brand-new primary endpoint. It only asks S4 to narrow the next contract step needed to let S3 stop converting long-but-alive waits into local timeout failures.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
