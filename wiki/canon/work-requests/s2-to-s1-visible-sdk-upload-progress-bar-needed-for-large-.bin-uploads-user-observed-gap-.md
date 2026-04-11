---
title: "Visible SDK upload progress bar needed for large .bin uploads (user-observed gap on 2026-04-09)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-"
last_verified: "2026-04-10"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket", "ux"]
decision_tags: ["sdk-upload", "progress-bar", "user-feedback", "ws-semantics"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-10T09:20:07.284Z","note":"Implemented visible SDK upload progress in Project Settings: determinate byte-level progress during `uploading`, sticky phase card/stepper continuity, navbar notification consumer with unread badge/dropdown, and live toast surfacing for incoming project notifications. Frontend binary picker now aligns with backend `.bin` artifact support."}]
registered_at: "2026-04-09T08:33:33.775Z"
completed_at: "2026-04-10T09:20:07.284Z"
---

# Visible SDK upload progress bar needed for large .bin uploads (user-observed gap on 2026-04-09)

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Visible SDK upload progress bar needed for large `.bin` uploads (user-observed gap on 2026-04-09)

- Kind: request
- From: s2
- To: s1

## Why now / direct user feedback
On 2026-04-09, a live user upload of a ~3GB SDK `.bin` exposed a UX gap clearly:

> "업로드 프로그레스바가 없으니 3기가나 되는 SDK가 어디까지 업로드된지 파악이 안된다"

S2 agrees this is a real UX defect, not a cosmetic nice-to-have.
For multi-GB uploads, a generic spinner or silent waiting state is insufficient.

## Important clarification
This is **not** a backend contract gap.
S2 already emits foreground SDK upload progress over the canonical project-scoped SDK channel:
- WS: `/ws/sdk?projectId=<projectId>`
- event: `sdk-progress`
- payload fields already available during upload:
  - `sdkId`
  - `phase`
  - `message`
  - `percent?`
  - `uploadedBytes?`
  - `totalBytes?`
  - `fileName?`

Upload-related phases available today:
- `uploading`
- `uploaded`
- then downstream materialization phases (`extracting` / `installing` / `analyzing` / `verifying` / `ready`)

## Canonical references
Use these as the normative source of truth:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/readme.md`

Read these earlier S2 handoffs together with this request:
- `wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md`
- `wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md`

## Requested S1 follow-up
Please make the SDK upload surface visibly reflect live upload progress for large files.

Minimum expectation:
1. Show a real progress bar during `uploading`.
2. Show textual progress using available byte fields when present.
   - preferred example: `1.8 GB / 3.1 GB (58%)`
3. Keep the current file name visible while uploading when `fileName` is present.
4. Distinguish `uploading` from post-upload phases such as `installing` / `extracting` / `analyzing` / `verifying`.
5. Preserve terminal error visibility if upload or install later fails.

## UX guidance (advisory)
Recommended interpretation:
- while `phase === "uploading"` and `percent` is present:
  - render determinate progress, not indeterminate spinner only
- while `phase === "uploaded"` and backend moves to next phase:
  - progress bar may freeze at 100% and transition to phase text like `업로드 완료, 설치 준비 중...`
- for `.bin` uploads specifically:
  - make it obvious that upload completion does not mean SDK registration is complete; installation/analysis/verification still follow asynchronously

## Acceptance check
S1 should consider this addressed when a user uploading a multi-GB SDK can immediately answer all of the following from the UI alone:
- Is the upload still moving?
- Roughly how much has uploaded?
- Which file is uploading?
- Has upload finished and the system moved on to install/analyze/verify?

## Requested response
Please either:
- implement the visible upload progress treatment, or
- reply with the exact blocker if the current S2 payload is insufficient for the intended UI.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
