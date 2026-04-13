---
title: "Consume new SDK install-log contract and live observability signals for project-scoped SDK registration"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-"
last_verified: "2026-04-13"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket", "observability"]
decision_tags: ["sdk-log", "install-log", "source-tree", "api-contract"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-13T02:35:08.495Z","note":"S1 frontend now consumes sdk-log websocket events, recovers install.log tails via GET /api/projects/:pid/sdk/:id/log in Project Settings, preserves existing notification behavior, and was verified with targeted + full frontend regression on commit d0a9b04."}]
registered_at: "2026-04-13T02:13:44.806Z"
completed_at: "2026-04-13T02:35:08.495Z"
---

# Consume new SDK install-log contract and live observability signals for project-scoped SDK registration

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request

S2 is landing a first-slice SDK observability/source-isolation change set.

## Backend contract changes S1 should consume

1. **New SDK log recovery endpoint**
   - `GET /api/projects/:pid/sdk/:id/log?tailLines=<n>`
   - returns install-log tail content for re-entry/reconnect recovery

2. **New `/ws/sdk` event type**
   - `sdk-log`
   - payload: `{ sdkId, timestamp, source: "aegis" | "installer", kind: "lifecycle" | "heartbeat" | "output" | "terminal", stream?: "stdout" | "stderr", message, logPath? }`

3. **Source tree behavior clarification**
   - `GET /api/projects/:pid/source/files` explorer/source-list output will now exclude the managed SDK subtree `uploads/{projectId}/sdk/**`
   - this is root-scoped and managed-path based only; normal project paths like `src/sdk/*` remain visible

## What S1 should do
- show live SDK install log lines from `sdk-log`
- use `GET /sdk/:id/log` to hydrate/recover the visible install log after refresh/re-entry
- continue consuming terminal notification/alarm behavior for SDK completion/failure
- do not assume SDK artifact files appear in source explorer results anymore

## Compatibility note
- changes are additive; existing `sdk-progress`, `sdk-complete`, `sdk-error` remain authoritative for coarse lifecycle
- `sdk-log.kind == "heartbeat"` means installer child process alive, **not** a progress percentage

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
