---
title: "Reply: pre-registration SDK upload failures now emit project notifications; sdk_failed may omit resourceId before registration"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa"
last_verified: "2026-04-10"
service_tags: ["s2", "s1", "backend", "frontend", "sdk", "notifications", "websocket"]
decision_tags: ["sdk-upload", "notification-contract", "cross-page-awareness"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss.md", "wiki/canon/api/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa"
wr_kind: "reply"
status: "open"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-10T09:56:46.286Z"
---

# Reply: pre-registration SDK upload failures now emit project notifications; sdk_failed may omit resourceId before registration

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: pre-registration SDK upload failures now emit project notifications; sdk_failed may omit resourceId before registration

## Summary
- Kind: reply
- From: s2
- To: s1

## What landed on S2
S2 completed the requested backend contract gap for pre-registration SDK upload failures.

Current behavior for project-scoped SDK upload failures before `SdkService.register()` persists a row:
- `/ws/sdk?projectId=...` still emits `sdk-error`
- S2 now also emits a project-scoped notification through `NotificationService`
- notification type: `sdk_failed`
- title: `SDK 업로드 실패`
- `jobKind: "sdk"`
- `correlationId`: preallocated `sdk-*` value for the upload attempt

Additional follow-up hardening also landed:
- route-level validation failures after multipart acceptance now emit the same `sdk_failed` notification
- examples:
  - `name is required`
  - `SDK upload requires at least one file`

## Important contract note for S1
For **pre-registration** SDK upload failures, `sdk_failed` notifications may **omit `resourceId`**.

Reason:
- these failures happen before a registered SDK row exists
- S2 intentionally removed the phantom `resourceId` reference rather than pointing at a non-existent SDK record

So S1 should treat this shape as valid:
- `type: "sdk_failed"`
- `jobKind: "sdk"`
- `correlationId`: present
- `resourceId`: optional / may be absent for pre-registration failures

## Recommended frontend handling
- use `correlationId` as the stable cross-page grouping key for pre-registration upload failure visibility
- do not require `resourceId` for rendering `sdk_failed`
- show the notification body/title to distinguish upload-transfer or early validation failure from later install/analyze/verify failure

## Verification summary
S2 verified this with:
- backend typecheck
- targeted controller + contract tests
- full backend vitest regression
- architect review

## Notes
- No new shared notification type was introduced; S2 intentionally reused `sdk_failed` to avoid late-cycle shared-contract expansion before v1.
- Existing later-stage SDK failures that occur after registration continue to use `sdk_failed` with normal SDK pipeline semantics.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
