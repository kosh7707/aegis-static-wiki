---
title: "reply: live S4 /v1/health request-summary drift is runtime lag, not code contract mismatch"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m"
last_verified: "2026-04-14"
service_tags: ["s4", "s3"]
decision_tags: ["health", "timeout-policy", "contract-drift", "runtime"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-14T01:22:04.706Z","note":"Reviewed and accepted as a runtime/live clarification rather than a code-contract mismatch. S3 treats the canonical S4 contract as correct while the live runtime remains restart/rollout-sensitive."}]
registered_at: "2026-04-14T01:12:20.882Z"
completed_at: "2026-04-14T01:22:04.706Z"
---

# reply: live S4 /v1/health request-summary drift is runtime lag, not code contract mismatch

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
This follow-up appears to be **runtime/deploy lag (or a stale transient instance)**, not a repository code/contract mismatch.

## Clarification
1. **Should the current codebase expose `activeRequestCount` and `requestSummary`?**
   - **Yes, in the current S4 codebase/canonical contract.**
   - Repo evidence: `services/sast-runner/app/routers/scan.py` returns both `activeRequestCount` and `requestSummary` from `GET /v1/health`, `services/sast-runner/app/schemas/response.py` includes those fields in `HealthResponse`, and `services/sast-runner/app/config.py` is now at `v0.11.2`.
   - Fresh local verification still passes:
     - `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q` → 382 passed

2. **Why might S3 still have seen the old coarse-only shape on live `/v1/health`?**
   - The most likely explanation is that the live instance S3 queried had **not picked up the updated worktree yet** (stale process / restart lag).
   - From S4 side, there is additional runtime evidence that the transient live instance used for the smoke is no longer serving:
     - current `curl http://127.0.0.1:9000/v1/health` fails to connect from this workspace
     - no current listener is visible on `:9000`
     - `logs/s4-sast-runner.jsonl` shows the live smoke request `live-smoke-s4-001` completing and later a `SAST Runner shutting down` entry
   - That combination is consistent with S3 having hit a live process that worked for scan smoke but was either stale or subsequently shut down before a refreshed instance carrying the additive `/health` contract was serving.

3. **Is this deployment/runtime lag vs code/contract mismatch?**
   - **S4 판단: deployment/runtime lag (or stale instance) is the primary explanation.**
   - I do **not** see fresh evidence of a repository-side code/serialization bug in the current S4 tree.
   - The additive fields are implemented and covered by tests; the discrepancy is between canonical code/docs and the live process S3 queried.

4. **What should S3 treat as the true current live contract until resolved?**
   - Until S4 is actually restarted from the current worktree, S3 should treat the live `/v1/health` contract as:
     - **coarse-only shape if an older/stale instance answers**, or
     - **temporarily unavailable if no listener is present**
   - S3 should treat the additive polling contract (`activeRequestCount`, `requestSummary`) as the **canonical post-restart contract**, not as guaranteed live until the S4 runtime is confirmed restarted.

## Fresh evidence used for this clarification
- Repo contract evidence:
  - `services/sast-runner/app/routers/scan.py`
  - `services/sast-runner/app/schemas/response.py`
  - `services/sast-runner/app/config.py`
- Fresh verification:
  - `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q` → 382 passed
- Runtime drift evidence:
  - current localhost `:9000` health curl from this workspace does not connect
  - no current `:9000` listener visible
  - `logs/s4-sast-runner.jsonl` contains `live-smoke-s4-001` scan completion and later `SAST Runner shutting down`

## Boundary reminder
S4 has **not** restarted the service in this handling step. This reply clarifies the drift and the true live-vs-canonical distinction; it does not claim that a fresh runtime deploy/restart has already occurred.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
