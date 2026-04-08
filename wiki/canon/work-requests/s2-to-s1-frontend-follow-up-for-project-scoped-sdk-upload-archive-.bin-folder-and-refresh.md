---
title: "Frontend follow-up for project-scoped SDK upload (archive / .bin / folder) and refreshed progress semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh"
last_verified: "2026-04-07"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "websocket", "notifications"]
decision_tags: ["sdk-upload", "project-scoped-storage", "contract-alignment", "ws-semantics"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md", "wiki/canon/work-requests/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T11:47:22.525Z","note":"SDK Upload UX 전면 개편 완료: 3-mode multipart upload (archive/.bin/folder+relativePath), 13-state progress model, phase-grouped stepper, per-category error display with logPath, exhaustive notification icons, 392 tests pass."}]
registered_at: "2026-04-07T11:13:05.968Z"
completed_at: "2026-04-07T11:47:22.525Z"
---

# Frontend follow-up for project-scoped SDK upload (archive / .bin / folder) and refreshed progress semantics

## Summary
- Kind: request
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Frontend follow-up for project-scoped SDK upload (archive / .bin / folder) and refreshed progress semantics

- Kind: request
- From: s2
- To: s1

## Why now / summary
S2 has completed the backend-side shift from `localPath`-centric SDK registration to **project-scoped SDK upload**.

This is a real contract change, not just doc cleanup.
S1 now has follow-up work on:
1. SDK upload UX / request shape
2. SDK list/detail rendering
3. SDK progress / terminal-state UX
4. notification consumer semantics

This WR should be read together with the earlier S2→S1 handoffs on progress/completion and frontend contract audit. This new WR is specifically about the **SDK upload surface that just changed materially**.

## Canonical references (normative)
Use these first:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/specs/backend.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/handoff/s2/readme.md`

Related previous WRs for context:
- `wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces.md`
- `wiki/canon/work-requests/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts.md`

Interpretation rule:
- payloads / phases / recovery / notification semantics = **normative**
- suggested UI treatment below = **advisory**

## What changed in S2
### 1) Canonical SDK ingress changed
`POST /api/projects/:pid/sdk` is no longer a JSON + `localPath` registration path.

It is now **multipart project-scoped upload**.

Current milestone support:
- single archive upload
- single `.bin` upload
- multi-file folder upload **when the client preserves relative paths** inside the multipart payload

Important:
- `localPath` is no longer the requested/canonical frontend path
- S1 should stop designing around host-path registration

### 2) Folder upload is now supported
Folder upload is no longer just a future seam.

Backend expectation:
- if the client uploads multiple files and preserves relative paths, S2 materializes them as a project-scoped SDK folder under `uploads/{projectId}`
- relative paths may be preserved either by multipart filenames that include path segments or by explicit `relativePath[]` metadata aligned to files

Frontend implication:
- S1 should add folder-upload UX and preserve browser-relative paths from directory selection
- typical browser source is `webkitdirectory` / `webkitRelativePath` style behavior

### 3) SDK storage is project-scoped
All SDK artifacts/results are now treated as project-local assets.

Implication for S1:
- SDK presence is project-scoped only
- Project A SDKs must not be presented as globally reusable SDK inventory unless S2 later defines that model explicitly

### 4) SDK status model expanded
SDK WS / status semantics are now richer than the old `uploading -> extracting -> analyzing -> verifying -> ready` simplification.

Current foreground SDK progress phases include:
- `uploading`
- `uploaded`
- `extracting`
- `extracted`
- `installing`
- `installed`
- `analyzing`
- `verifying`
- `ready`

Error phases include:
- `upload_failed`
- `extract_failed`
- `install_failed`
- `verify_failed`

### 5) SDK WS payload changed
Foreground channel remains:
- `/ws/sdk?projectId=<projectId>`

Current payloads:
- `sdk-progress`
  - `{ sdkId, phase, message, percent?, uploadedBytes?, totalBytes?, fileName? }`
- `sdk-complete`
  - `{ sdkId, profile, path? }`
- `sdk-error`
  - `{ sdkId, phase, error, logPath? }`

### 6) SDK list/detail payload gained more metadata
`RegisteredSdk` now carries frontend-usable metadata beyond the older minimal shape.

Important fields to consume:
- `artifactKind` (`archive | bin | folder`)
- `sdkVersion?`
- `targetSystem?`
- `installLogPath?`
- `status`
- `verifyError?`
- `path`
- `profile?`

This is specifically to support the UX requirement that SDK list/detail should show at least:
- SDK type/kind
- version
- target system

### 7) Terminal notifications are now SDK-specific
For SDK terminal awareness, S1 should use:
- success → `sdk_ready`
- failure → `sdk_failed`

And for source upload terminal awareness:
- success → `upload_complete`
- failure → `upload_failed`

Do not keep older assumptions that upload completion comes through generic `analysis_complete` or SDK failure through generic `gate_failed` for the relevant upload/sdk flows.

### 8) Important UX interpretation
`POST /api/projects/:pid/sdk` returning `202` does **not** mean the SDK is ready.
It means the upload was accepted / materialized enough to create the async job.

S1 must continue to rely on:
- `/ws/sdk?projectId=` for foreground live progress
- `GET /api/projects/:pid/sdk/:id`
- `GET /api/projects/:pid/sdk`
- project notifications for background completion awareness

## Requested S1 follow-up work
### A. SDK upload UI
Please update the SDK upload surface so that it can drive:
- archive upload
- `.bin` upload
- folder upload

For folder upload specifically:
- preserve browser relative paths
- ensure the multipart request actually preserves per-file relative structure for S2

### B. SDK progress UX
Please update the SDK progress UI so that it can display the richer state machine.

At minimum, reflect:
- upload accepted / uploaded
- extracting vs installing distinction
- analyzing
- verifying
- terminal ready
- terminal failure category

### C. SDK list/detail rendering
Please update SDK screens to show the newly relevant fields when present:
- `artifactKind`
- `sdkVersion`
- `targetSystem`
- `status`
- `verifyError`
- optionally `installLogPath` when failure/debug UX wants to surface it

### D. Notification consumer alignment
Please update any notification handling that still assumes:
- upload uses generic completion categories
- SDK terminal states use older/generic categories

Relevant terminal categories now matter explicitly:
- `upload_complete`
- `upload_failed`
- `sdk_ready`
- `sdk_failed`

### E. Recovery / re-entry behavior
Please ensure re-entry/reconnect behavior continues to anchor on:
- `GET /api/projects/:pid/sdk/:id`
- `GET /api/projects/:pid/sdk`

The live WS stream is foreground progress, not guaranteed replay.

## Suggested frontend acceptance checklist
S1 should consider the work done when all of the following are true:
1. The project SDK page can submit single archive upload.
2. The project SDK page can submit single `.bin` upload.
3. The project SDK page can submit folder upload with preserved relative paths.
4. The SDK progress UI can represent uploaded/extracting/installing/analyzing/verifying/ready and terminal failure states.
5. SDK rows/details show kind/version/target system when present.
6. Project A SDKs stay invisible in Project B views.
7. Background notification UX correctly reacts to `sdk_ready` / `sdk_failed` / `upload_complete` / `upload_failed`.
8. Re-entry after navigation recovers from SDK list/detail rather than relying on missed WS history.

## Notes / caveats
- Folder upload support depends on the client preserving relative paths correctly.
- `.bin` support exists backend-side now, but this does not imply final sandbox/isolation architecture is solved.
- If S1 finds browser/platform-specific friction around folder upload path preservation, reply with the exact request shape problem rather than inferring backend drift.

## Requested response
Please either:
- implement and validate the frontend follow-up, or
- reply with a mismatch list / blocker list tied to the canonical S2 docs above.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
