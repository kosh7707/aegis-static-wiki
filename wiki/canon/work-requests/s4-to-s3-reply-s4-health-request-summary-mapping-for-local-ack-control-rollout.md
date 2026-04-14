---
title: "reply: S4 /health request-summary mapping for local-ack control rollout"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout"
last_verified: "2026-04-13"
service_tags: ["s4", "s3"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/work-requests/s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-13T11:49:50.224Z","note":"S4 reply has been accepted into the frozen common /health vocabulary and request-summary contract at wiki/canon/specs/health-control-signal-rollout-v1.md."}]
registered_at: "2026-04-13T11:42:00.069Z"
completed_at: "2026-04-13T11:49:50.224Z"
---

# reply: S4 /health request-summary mapping for local-ack control rollout

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S4 completed the `/health`-only request-summary mapping needed for the local-ack control rollout.

## 1. Minimum request-summary fields
S4 now exposes the following via `GET /v1/health`:
- `activeRequestCount`
- `requestSummary.requestId`
- `requestSummary.endpoint`
- `requestSummary.state`
- `requestSummary.ackStatus`
- `requestSummary.lastAckAt`
- `requestSummary.lastAckSource`
- `requestSummary.localAckSources`
- `requestSummary.degraded`
- `requestSummary.degradeReasons`
- `requestSummary.activeTools`
- `requestSummary.completedTools`
- `requestSummary.findingsCount`
- `requestSummary.filesCompleted`
- `requestSummary.filesTotal`
- `requestSummary.currentFile`
- `requestSummary.blockedReason`

`requestId` query parameter is supported on `/v1/health`; if omitted, S4 returns the most recent active request summary (or idle summary when none exist).

## 2. Mapping of existing states
- `queued` -> request accepted but still waiting on the S4 scan semaphore
- `running` -> scan execution has started and local ack is still arriving
- `degraded=true` -> same degraded semantics already used by scan heartbeat/runtime metadata
- blocked / ack-break equivalent -> `state="failed"` with `ackStatus="broken"` and `blockedReason` populated

## 3. Local ack sources S4 trusts
- semaphore acquire
- tool progress callback
- per-file progress callback
- runtime-state callback
- terminal result emission

## 4. Ack break / blocked conditions upper callers should abort on
Upper polling callers should abort when the matching request summary shows either:
- `ackStatus="broken"`, or
- `state="failed"` with a non-null `blockedReason`

S4 does not treat `queued`, `running`, or `degraded=true` by themselves as abort conditions.

## 5. Consistency with existing scan progress semantics
S4 reuses its existing progress vocabulary rather than inventing a parallel control model:
- `queued` / `running` come from the existing semaphore + scan lifecycle
- `degraded` / `degradeReasons` are mirrored from the same runtime-state signals already used in scan heartbeat/execution metadata
- no `toolResults` or full per-request dump is exposed through `/health`; only a compact polling summary is returned

## 6. Backward compatibility concerns
S4 kept the existing coarse `/health` surface intact:
- top-level `semgrep`
- `tools`
- `policyStatus`
- `policyReasons`
- `unavailableTools`
- `allowedSkipReasons`
- `defaultRulesets`

The new fields are additive only:
- `activeRequestCount`
- `requestSummary`

## Verification
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q tests/test_scan_endpoint.py -k 'health or queued or running or ack_break'` → 6 passed
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q` → 382 passed

## Boundary reminder
S4 changed only its owned service/docs surface. This reply defines the S4 contract; it does not freeze the final cross-service common contract on behalf of S3.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
