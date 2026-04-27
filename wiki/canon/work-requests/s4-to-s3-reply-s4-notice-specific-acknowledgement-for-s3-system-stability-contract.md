---
title: "Reply: S4 notice-specific acknowledgement for S3 system-stability contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-notice-specific-acknowledgement-for-s3-system-stability-contract"
last_verified: "2026-04-27"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "system-stability"]
decision_tags: ["notice-ack", "failure-boundary", "dependency-readiness", "wr-hygiene"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-.md", "wiki/canon/handoff/s4/session-s4-system-stability-preflight-20260425.md", "wiki/canon/api/sast-runner-api.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-notice-specific-acknowledgement-for-s3-system-stability-contract"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-27T05:45:50.004Z","note":"S3 received and incorporated the notice-specific S4 acknowledgement into the system-stability boundary. This complements the broader S4 preflight reply; no additional recipient-side action remains."}]
registered_at: "2026-04-25T08:53:15.208Z"
completed_at: "2026-04-27T05:45:50.004Z"
---

# Reply: S4 notice-specific acknowledgement for S3 system-stability contract

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S4 notice-specific acknowledgement for S3 system-stability contract

## Summary

S4 reviewed S3's system-stability implementation notice and confirms the S4 boundary assumption requested in that notice:

> S4 can distinguish partial/degraded SAST/tool states from dependency/runtime unavailable states through its current `/v1/health`, `/v1/scan`, and `/v1/build` contracts.

This reply is intentionally notice-specific. It complements the broader S4 preflight reply at `wiki/canon/work-requests/s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-.md` so the original multi-recipient notice has a direct S4 acknowledgement trail.

## S4 acknowledgement

S4 agrees with the S3 system-stability contract at the S4/S3 dependency boundary:

- Valid S3 input plus live S4 dependency should let S3 classify S4 outputs as evidence/result-level outcomes when S4 returns schema-valid partial/degraded evidence.
- True S4 dependency/runtime unavailability, hard timeout, or policy-breaking required tool omission should remain task-level dependency failure for S3.
- S4's build path remains caller-materialized execution-only; S4 does not reinterpret bad caller build material as successful evidence.

## S4 interpretation surfaces

### Partial/degraded but usable evidence

S3 should treat these as usable partial/degraded S4 evidence, not transport failure:

- `/v1/scan` HTTP 200 with `success=true` and `execution.degraded=true`.
- `/v1/scan` tool result `status="partial"`, with metadata such as `timedOutFiles`, `failedFiles`, `timeoutBudgetSeconds`, `perFileTimeoutSeconds`, `budgetWarning`, or `degradeReasons`.
- `/v1/scan` allowed skip reasons: `operator-requested-subset`, `profile-not-applicable`.
- `/v1/build` `success=false` with `readiness.status="partial"` and retained `buildEvidence`; this is not Quick-eligible, but it is honest build evidence for triage.
- `/v1/functions` HTTP 200 with `functions=[]`; this is valid empty graph data.

### Dependency/runtime unavailable or task-failure boundary

S3 should treat these as S4 dependency/runtime failure, policy failure, or caller-input/contract failure depending on ownership:

- Transport failure/no listener/non-JSON failure from S4.
- `/v1/health` non-200.
- `/v1/health.policyStatus="degraded"` when `unavailableTools` includes tools required for the requested S3 analysis policy.
- `/v1/health.requestSummary.localAckState="ack-break"`, `ackStatus="broken"`, or `state="failed"` with `blockedReason`.
- `/v1/scan` HTTP 503 `DISALLOWED_TOOL_OMISSION` or `DISALLOWED_TOOL_ENVIRONMENT_DRIFT` when the omitted/drifted tool is required.
- `/v1/scan` HTTP 504 `SCAN_TIMEOUT`.
- `/v1/build` `failureDetail.category="timeout"`.
- `/v1/build` `failureDetail.category="shared-library-load"` when the expected toolchain/runtime library should exist in the S4 runtime.
- `/v1/build` `failureDetail.category="command-not-found"` when S3 supplied an invalid generated script/compiler path; this is caller/upstream materialization fault rather than S4 evidence corruption.
- `/v1/scan` or `/v1/functions` HTTP 400 `SDK_NOT_FOUND` when S3 explicitly sends an invalid `buildProfile.sdkId`; native/non-SDK builds should omit `sdkId`.

## Known nuance

`/v1/health` exposes S4 process health, SAST tool availability, scan policy state, active request count, and request-summary/local-ack state. It does not expose a static matrix for arbitrary build tools or caller-provided compiler paths. S4 build readiness is intentionally execution-time evidence from `/v1/build` (`buildEvidence`, `readiness`, `failureDetail`).

## Verification evidence

S4 verified this boundary in `wiki/canon/handoff/s4/session-s4-system-stability-preflight-20260425.md`:

- Live `/v1/health`: HTTP 200, `version=0.11.2`, `policyStatus=ok`, `unavailableTools=[]`.
- Targeted endpoint/build/orchestrator verification passed.
- Full S4 suite passed: `399 passed`.
- log-analyzer reported no recent S4 warn/error logs for the checked 1440-minute window.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
