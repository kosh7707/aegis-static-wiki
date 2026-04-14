---
title: "S2 websocket recovery hardening landed on 2026-04-08; please validate S1 reconnect/progress UX"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec"
last_verified: "2026-04-14"
service_tags: ["s2", "s1", "s1-qa", "websocket", "api-contract", "frontend"]
decision_tags: ["ws-contract", "recovery", "reconnect", "request"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/context/project/end-to-end-scenarios.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1", "s1-qa"]
completed_by: [{"lane":"s1","completed_at":"2026-04-08T07:55:17.849Z","note":"useUploadProgress.ts 버그 수정: WebSocket reconnect 시 onmessage 핸들러가 새 WS에 재등록되지 않는 문제 — wireWsHandlers 함수 추출 후 onReconnect에서 재호출하도록 수정 (useAnalysisWebSocket.ts 패턴과 동일). 코드 검증: 양쪽 훅 모두 (1) late-subscribe 즉시 스냅샷 정상 처리, (2) REST fallback 후 WS 스냅샷 중복 방지 가드 존재 (terminal state check), (3) reconnect 후 새 WS 핸들러 정상 등록. Build 0 errors, 392 tests pass."},{"lane":"s1-qa","completed_at":"2026-04-14T05:09:18.438Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1-QA without additional implementation or verification in this S7 session."}]
registered_at: "2026-04-08T07:44:13.361Z"
completed_at: "2026-04-14T05:09:18.438Z"
---

# S2 websocket recovery hardening landed on 2026-04-08; please validate S1 reconnect/progress UX

## Summary
- Kind: request
- From: s2
- To: s1, s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 landed websocket recovery hardening on **2026-04-08** for the S1-consumed live progress surface. Please treat this as a consumer notice plus validation request for reconnect / late-subscribe UX.

## What changed in S2
### 1) `/ws/upload` late-subscribe recovery improved
S2 now replays the latest upload snapshot to a newly connected subscriber instead of sending nothing when the upload already completed quickly.

Current observed late-subscribe behavior:
- `/ws/upload?uploadId=...` can immediately deliver `upload-complete` (or the latest progress/error snapshot) on connect
- REST recovery remains authoritative via `GET /api/projects/:pid/source/upload-status/:uploadId`

### 2) `/ws/analysis` progress snapshot now aligns with REST status recovery
S2 now keeps `AnalysisTracker` synchronized with live quick/deep phases and replays the current analysis-progress snapshot on subscribe.

Current observed late-subscribe behavior:
- `/ws/analysis?analysisId=...` can immediately deliver current progress such as `quick_sast`
- `GET /api/analysis/status/:analysisId` now matches the same phase/message instead of lagging at `queued`

## Why S1 / S1-QA should care
This is not intended as a breaking change, but it changes reconnect/late-arrival UX semantics in a helpful way:
- S1 can now receive immediate progress state after subscribing late
- S1 should still treat REST recovery surfaces as authoritative
- S1-QA should re-check upload/analysis reconnect flows because previously blank/no-progress late-subscribe behavior may now show an immediate snapshot message

## Suggested validation
1. Upload flow
   - start upload
   - subscribe late or refresh mid/after upload
   - confirm S1 tolerates immediate `upload-complete` snapshot on connect
   - confirm REST fallback still works
2. Analysis flow
   - start analysis
   - subscribe late or refresh mid-run
   - confirm S1 tolerates immediate `analysis-progress` snapshot on connect
   - confirm REST status and WS phase/message no longer disagree in the UI
3. Ensure no duplicate-progress UX regressions if S1 first loads REST and then receives a snapshot WS message

## S2 verification evidence
- targeted WS tests passed
- backend full suite passed after the change (`22 files / 395 tests`)
- live late-subscribe `/ws/upload` verification returned `upload-complete`
- live late-subscribe `/ws/analysis` verification returned `analysis-progress` with the same phase/message as `GET /api/analysis/status/:analysisId`

## No known required S1 code change
At this time this looks like a **consumer awareness + QA validation** WR, not a mandatory S1 implementation change. If S1 does observe duplicate-progress UX issues or assumptions that late subscribers receive nothing, please reply with repro details.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
