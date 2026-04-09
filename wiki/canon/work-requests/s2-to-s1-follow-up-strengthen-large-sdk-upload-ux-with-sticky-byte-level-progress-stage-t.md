---
title: "Follow-up: strengthen large SDK upload UX with sticky byte-level progress, stage transitions, and failure visibility"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t"
last_verified: "2026-04-09"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket", "ux", "notifications"]
decision_tags: ["sdk-upload", "progress-bar", "large-file-ux", "user-feedback", "post-upload-phases"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/work-requests/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-.md", "wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t"
wr_kind: "request"
status: "open"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: []
registered_at: "2026-04-09T08:50:13.428Z"
---

# Follow-up: strengthen large SDK upload UX with sticky byte-level progress, stage transitions, and failure visibility

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Follow-up: strengthen large SDK upload UX with sticky byte-level progress, stage transitions, and failure visibility

- Kind: request
- From: s2
- To: s1

## Why this follow-up exists
This is an explicit strengthening pass on the earlier SDK upload UX WRs after live user feedback on 2026-04-09.

Direct user pain point:
> "업로드 프로그레스바가 없으니 3기가나 되는 SDK가 어디까지 업로드된지 파악이 안된다"

S2 agrees the current UX gap is severe for large `.bin` SDK uploads.
A user should not have to open the filesystem to infer whether a multi-GB upload is still progressing.

## New context since the earlier WRs
S2 has now also hardened the backend-side ETXTBSY issue for recently uploaded `.bin` installers.
That backend fix does **not** remove the need for strong frontend progress UX.
If anything, it makes the phase distinction more important:
- upload is only the first leg
- install/analyze/verify follow afterward

Frontend should therefore present the SDK flow as a visible long-running state machine, not a one-shot file picker interaction.

## Normative contract reminder
The backend already provides the data needed for a visible upload progress surface.
Foreground channel:
- `/ws/sdk?projectId=<projectId>`

Relevant payload:
- `sdk-progress`
  - `sdkId`
  - `phase`
  - `message`
  - `percent?`
  - `uploadedBytes?`
  - `totalBytes?`
  - `fileName?`

Phase family currently relevant to this UX:
- `uploading`
- `uploaded`
- `extracting`
- `extracted`
- `installing`
- `installed`
- `analyzing`
- `verifying`
- `ready`

Error family:
- `upload_failed`
- `extract_failed`
- `install_failed`
- `verify_failed`

Canonical references:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/work-requests/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-.md`

## Stronger requested UX treatment
Please strengthen the SDK upload UX with the following expectations.

### 1) Determinate upload progress is required for large uploads
During `phase === "uploading"`:
- show a determinate progress bar when `percent` is present
- show byte-level text when `uploadedBytes` and `totalBytes` are present
- show current file name when `fileName` is present

Preferred display example:
- `TI SDK (.bin)`
- `1.8 GB / 3.1 GB (58%)`
- progress bar + phase label `업로드 중`

### 2) Progress UI should remain sticky / hard to miss
The upload progress should not disappear into a transient toast only.
For large SDK uploads, use a UI treatment that remains visible while the job is active.
Examples of acceptable patterns:
- sticky inline job card in the SDK page
- pinned progress section in settings / SDK management surface
- modal or drawer that can be collapsed but remains recoverable

### 3) Distinguish upload from post-upload phases clearly
Do **not** flatten everything into a single spinner after the file picker submits.
The user must be able to tell:
- still uploading bytes
- upload finished, now installing
- install finished, now analyzing
- analyzing finished, now verifying
- fully ready

Minimum readable labels:
- 업로드 중
- 업로드 완료
- 설치 중
- 분석 중
- 검증 중
- 준비 완료

### 4) Preserve terminal failure visibility
If the SDK later fails after upload completed, the user should still understand that the bytes were uploaded successfully but the downstream processing failed.
Especially important for `.bin` uploads:
- upload may succeed
- install may fail later

So the UI should not reduce every failure to generic “업로드 실패”.
It should render the actual terminal phase when available:
- `upload_failed`
- `install_failed`
- `extract_failed`
- `verify_failed`

### 5) Re-entry / refresh behavior should keep the job understandable
If the user leaves the page and comes back:
- reload from `GET /api/projects/:pid/sdk` / `:id`
- restore the latest known SDK state into the visible UI
- do not assume missed WS events can be replayed

This is especially important because large uploads and `.bin` install phases can span enough time that users will navigate away and return.

## Concrete acceptance criteria
Please consider this done only if all of the following are true:

1. A user uploading a multi-GB `.bin` can see a determinate progress bar during byte upload.
2. The UI shows byte-level text when backend provides bytes.
3. The current filename is visible during upload when available.
4. After upload reaches 100%, the UI visibly transitions into post-upload phases rather than disappearing.
5. The UI can distinguish `install_failed` from `upload_failed`.
6. On reload/re-entry, the SDK list/detail still makes the last known state understandable.
7. The user no longer needs filesystem inspection just to answer “is the upload still progressing?”

## Suggested validation path
After implementation, please validate with at least one realistically large SDK upload flow (or a representative mock that preserves the same WS phase semantics), then reply with:
- what screen changed
- how upload progress is rendered
- how post-upload phases are rendered
- what failure state looks like

## Requested response
Please either:
- implement this stronger UX treatment and report the changed surface, or
- reply with the exact blocker if any part of the current S2 payload is insufficient.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
