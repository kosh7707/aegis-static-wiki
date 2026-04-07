---
title: "Frontend UX handoff for WebSocket progress/completion surfaces"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces"
last_verified: "2026-04-07"
service_tags: ["s1", "s2"]
decision_tags: ["websocket-contract", "progress-completion", "ux-handoff"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/handoff/s2/architecture.md", "wiki/canon/specs/backend.md", "wiki/canon/specs/technical-overview.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T07:21:13.318Z","note":"S1 구현 완료. 7개 WS consumer 전부 createReconnectingWs(지수백오프+jitter) 기반 자동 재연결로 마이그레이션. 채널별 REST fallback recovery 구현 (upload-status, analysis/status, pipeline/status, SDK list, notifications). ConnectionStatusBanner 인라인 배너를 6개 foreground 페이지에 연결. 검증: build PASS, 379 unit tests PASS, 180 E2E PASS (신규 4 recovery 시나리오 포함). Architect APPROVED."}]
registered_at: "2026-04-07T05:17:19.915Z"
completed_at: "2026-04-07T07:21:13.318Z"
---

# Frontend UX handoff for WebSocket progress/completion surfaces

- Kind: request
- From: s2
- To: s1

## Why now / context

S2 is hardening the progress/completion contract for the current async job surfaces so S1 can redesign the UX without needing repeated contract clarification. The goal is to treat WebSocket as a user-facing progress/completion surface rather than a generic transport.

This WR is **not** a request for S2 to edit S1-owned code. It is a frontend UX handoff anchored to the canonical S2 contract.

## Normative source of truth

Use these as canonical S2-owned references:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/handoff/s2/architecture.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/specs/technical-overview.md`

Interpretation rule:
- API / WS payloads / failure semantics = **normative**
- screen usage guidance below = **advisory / reference**

## Canonical channel matrix

### 1) Upload
- Foreground WS: `/ws/upload?uploadId=<uploadId>`
- Purpose: live source-upload progress while the user stays on source-management flow
- Progress stages:
  - `received`
  - `extracting`
  - `indexing`
- Completion signal:
  - WS `upload-complete`
  - background notification `{ type: "upload_complete", jobKind: "upload", resourceId: uploadId, correlationId: uploadId }`
- Failure signal:
  - WS `upload-error`
  - background notification `{ type: "upload_failed", jobKind: "upload", resourceId: uploadId, correlationId: uploadId }`
- Recovery source of truth after re-entry/reconnect:
  - `GET /api/projects/:pid/source/upload-status/:uploadId`
- Important caveat:
  - this fallback is a last-known snapshot surface (current implementation is in-memory / limited retention), not a durable forever history log

### 2) SDK
- Foreground WS: `/ws/sdk?projectId=<projectId>`
- Purpose: project-scoped SDK registration / verification state machine
- Progress stages:
  - `uploading`
  - `extracting`
  - `analyzing`
  - `verifying`
  - `ready`
- Completion signal:
  - WS `sdk-complete`
  - background notification `{ type: "sdk_ready", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId }`
- Failure signal:
  - WS `sdk-error`
  - background notification `{ type: "sdk_failed", jobKind: "sdk", resourceId: sdkId, correlationId: sdkId }`
- Recovery source of truth:
  - `GET /api/projects/:pid/sdk/:id`
  - `GET /api/projects/:pid/sdk`

### 3) Analysis
- Foreground WS: `/ws/analysis?analysisId=<analysisId>`
- Purpose: Quick→Deep analysis job progress
- Progress stages:
  - `quick_sast`
  - `quick_complete`
  - `deep_submitting`
  - `deep_analyzing`
  - `deep_retrying`
  - `deep_complete`
- Completion signal:
  - WS `analysis-quick-complete`
  - WS `analysis-deep-complete`
- Failure signal:
  - WS `analysis-error`
- Background notifications:
  - analysis/gate/finding notifications may appear, but they are **supplementary** and not the authoritative 1:1 replay surface for a foreground `analysisId`
- Recovery source of truth:
  - `GET /api/analysis/status/:analysisId`
  - `GET /api/analysis/results/:analysisId`

### 4) Pipeline
- Foreground WS: `/ws/pipeline?projectId=<projectId>`
- Purpose: target-by-target build/scan/graph lifecycle stream
- Important semantics:
  - this is **not** a single scalar progress-bar contract
  - it is a target-status lifecycle stream
- Active payloads:
  - `pipeline-target-status { pipelineId, projectId, targetId, targetName, status, message, phase }`
  - `pipeline-complete { pipelineId, projectId, readyCount, failedCount, totalCount }`
  - `pipeline-error { pipelineId, projectId, targetId, targetName, phase, error }`
- Completion signal:
  - WS `pipeline-complete`
  - background notification `{ type: "pipeline_complete", jobKind: "pipeline", resourceId: pipelineId, correlationId: pipelineId }`
- Failure / partial-failure signal:
  - per-target WS `pipeline-error`
  - terminal background notification `{ type: "pipeline_failed", jobKind: "pipeline", resourceId: pipelineId, correlationId: pipelineId }` when failures occurred
- Recovery source of truth:
  - `GET /api/projects/:pid/pipeline/status`
- Important caveat:
  - recovery is project-scoped current state, not historical WS replay

### 5) Notifications
- Background WS: `/ws/notifications?projectId=<projectId>`
- Purpose: completion/failure awareness after navigation, tab switch, or late arrival
- Not a replacement for foreground progress
- Key payload fields:
  - `type` = coarse UI category
  - `jobKind` = exact flow/domain kind
  - `resourceId` = durable resource identifier
  - `correlationId` = foreground/live-flow correlation key when present
- Recovery source of truth:
  - `GET /api/projects/:pid/notifications`
  - `GET /api/projects/:pid/notifications/count`

## Screen-by-screen guidance (advisory)

### Source upload surface
- While the user is on the upload/source screen:
  - show live `received/extracting/indexing` progress
  - do not collapse everything into a generic spinner if stage text can be preserved
- After completion:
  - show a clear terminal summary (file count / ready state)
- After failure:
  - retain a recoverable failed state long enough that the user understands why the upload disappeared or stopped

### SDK management surface
- Show the SDK as a long-running state machine item, not just a one-shot mutation
- Keep the latest known terminal state visible even after the live WS stream is gone
- If the user re-enters later, reload from SDK detail/list rather than trying to infer from missed WS events

### Analysis surface
- Keep Quick vs Deep visibly distinct
- Do not treat background notifications as the primary analysis-status source
- On re-entry, restore from analysis status/result endpoints first, then resume live WS if still active

### Pipeline surface
- Present target-by-target lifecycle rather than pretending there is always one linear percentage
- If a run partially fails, show that distinction clearly instead of flattening into generic “done”
- `pipelineId` can be used as a correlation key while the run is active, but re-entry recovery should anchor on project pipeline status

### Notifications surface
- Treat notifications as the cross-screen completion awareness surface
- They should help the user notice “something finished/failed” after navigation
- They should not be expected to reconstruct the full progress history by themselves

## Foreground vs background split

- Foreground progress:
  - upload / sdk / analysis / pipeline
- Background completion awareness:
  - notifications

Recommended interpretation:
- stay on-screen → foreground WS is primary
- moved away / came back later → notifications + authoritative REST/status endpoints are primary

## Recovery / re-entry / reconnect guidance

When a user misses the live stream:
- upload → use `upload-status/:uploadId`
- sdk → use SDK detail/list
- analysis → use `analysis/status/:analysisId` and `analysis/results/:analysisId`
- pipeline → use `pipeline/status`
- notifications → use notifications list/count

The frontend should assume:
- WS replay is **not** guaranteed
- re-entry must be driven by current authoritative state, not by trying to reconstruct every past live event

## Failure / retry / partial semantics

- upload:
  - terminal failure is explicit (`upload-error` + failure-category notification)
- sdk:
  - terminal failure is explicit (`sdk-error` + failure-category notification)
- analysis:
  - retry / partial semantics are surfaced in `analysis-progress` + `analysis-error`
  - treat notifications as supplementary, not as the sole failure oracle
- pipeline:
  - target failures can happen inside an overall run
  - completion can be “finished with failures”, not only all-green success

## Use-case examples

1. User starts source upload, moves to another page, comes back later:
- notification should reveal that upload finished or failed
- upload detail/state should recover from `upload-status/:uploadId`

2. User starts SDK registration, closes the page, reopens project settings later:
- notification should reveal completion/failure awareness
- exact state should reload from SDK list/detail, not from missed WS history

3. User watches analysis live, then reconnects after a network glitch:
- current state should recover from analysis status/results
- background notifications may still be useful, but they do not replace those endpoints

4. User launches pipeline for multiple targets and navigates away:
- later notification should reveal success vs partial failure
- current per-target truth should come from `pipeline/status`

## Acceptance checklist for S1 kickoff

S1 should be able to start UX work without asking S2 for basic semantics if the following are true:
- per-flow foreground channel is clear
- per-flow terminal signal is clear
- per-flow recovery source of truth is clear
- notification correlation fields (`jobKind`, `resourceId`, `correlationId`) are understood
- the normative vs advisory boundary is understood

If a question remains about payload truth, prefer the canonical docs over this WR.
