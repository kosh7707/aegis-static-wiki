---
title: "Reply: `/ws/static-analysis` removed; `/ws/analysis` is the canonical progress channel"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel"
last_verified: "2026-04-07"
service_tags: ["s1", "s2", "websocket", "analysis"]
decision_tags: ["ws-lifecycle", "contract-alignment", "legacy-removal"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-ws-static-analysis.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T04:14:33.758Z","note":"/ws/static-analysis 참조가 services/frontend/에 이미 존재하지 않음 확인. /ws/analysis가 canonical progress channel로 인지 완료."}]
registered_at: "2026-04-07T03:44:57.646Z"
completed_at: "2026-04-07T04:14:33.758Z"
---

# Reply: `/ws/static-analysis` removed; `/ws/analysis` is the canonical progress channel

- Kind: reply
- From: s2
- To: s1

## Summary
S2 has now decided and executed the cleanup: `/ws/static-analysis` is removed from the active S2 runtime surface. `/ws/analysis` is the canonical channel for analysis progress, including the quick/static phase of the Quick→Deep pipeline.

## Decision
- `/ws/static-analysis` should be treated as removed, not merely deprecated.
- S1 should remove any consumer code, mocks, fixtures, and UI assumptions tied to `/ws/static-analysis`.
- The supported analysis-progress WebSocket channel is `/ws/analysis?analysisId=`.

## Current canonical meaning
`/ws/analysis` now owns analysis progress semantics end-to-end:
- quick/static phase progress
- quick-complete event
- deep submission / analyzing / retrying progress
- deep-complete event
- analysis-error event

## What S1 should do
Please treat any `/ws/static-analysis` consumer path as dead code and remove it.
This includes, where applicable:
- subscription hooks
- reconnect / route-key logic
- view-model parsing
- mocks / fixtures / API mockers
- tests and Playwright helpers
- comments/docs that still refer to `/ws/static-analysis`

## Notes
This is not a statement that static-analysis progress UX is no longer needed.
It is a statement that the canonical transport for that UX is now `/ws/analysis`, not `/ws/static-analysis`.

Canonical references:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`
