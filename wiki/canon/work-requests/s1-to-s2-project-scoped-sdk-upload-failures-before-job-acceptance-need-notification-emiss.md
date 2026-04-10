---
title: "Project-scoped SDK upload failures before job acceptance need notification emission for cross-page awareness"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss"
last_verified: "2026-04-10"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "notifications", "websocket"]
decision_tags: ["sdk-upload", "notification-gap", "cross-page-awareness"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t.md", "wiki/canon/work-requests/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-10T09:42:58.282Z","note":"S2 now emits a project-scoped sdk_failed notification from the pre-registration SDK upload failure controller path, reusing the existing shared notification type while distinguishing the transfer-stage failure via title/body. Verified with backend typecheck, focused controller/sdk tests, full backend vitest (405 passed), and architect approval."}]
registered_at: "2026-04-10T09:20:07.268Z"
completed_at: "2026-04-10T09:42:58.282Z"
---

# Project-scoped SDK upload failures before job acceptance need notification emission for cross-page awareness

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Project-scoped SDK upload failures before job acceptance need notification emission for cross-page awareness

## Summary
- Kind: request
- From: s1
- To: s2

## Why this follow-up exists
S1 has now implemented:
- sticky byte-level SDK upload progress in project settings
- project-scoped navbar notification visibility
- live toast surfacing for incoming project notifications

This closes most of the user-facing gap for long-running SDK registration flows.
However, one backend-visible hole remains for cross-page awareness:

### Observed gap
`upload_failed` can occur inside the multipart upload controller path **before** `SdkService.register()` persists a registered SDK and before `sdk_ready` / `sdk_failed` terminal notification semantics apply.

Current behavior seen in code:
- `services/backend/src/controllers/sdk.controller.ts`
  - upload middleware failure path calls `emitUploadFailure(...)`
  - that broadcasts `sdk-error` over `/ws/sdk?projectId=...`
  - but does **not** emit a project notification through `NotificationService`
- `services/backend/src/services/sdk.service.ts`
  - later async pipeline failures emit `sdk_failed` notifications correctly

## Why this matters to users
If a user starts a large SDK upload and then navigates to another project page:
- S1 can now surface project notifications well
- but controller-level upload failure still has no notification payload to consume
- so the user may miss an early transfer failure unless they stayed on the SDK page with the foreground sdk WS consumer mounted

## Request
Please add a project notification emission for the pre-registration SDK upload failure path so S1 can treat it the same way as later-stage SDK failures.

Preferred semantics:
- project-scoped notification emitted when multipart SDK upload fails before registration acceptance
- type: either explicit `sdk_upload_failed` if you want a new category, or reuse an agreed canonical existing category if preferred
- jobKind: `sdk`
- correlation key should remain compatible with project-scoped async UX
- include a user-readable title/body that distinguishes transfer failure from later install/analyze/verify failure

## Acceptance intent
S1 should be able to show a visible cross-page failure notice even when the SDK upload fails before `SdkService.register()` accepts the job.

## Notes
- This is not a blocker for the current S1 UX pass; it is the remaining contract gap after frontend visibility work landed.
- If S2 prefers not to introduce a new notification type, please reply with the chosen canonical category so S1 can map it cleanly.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
