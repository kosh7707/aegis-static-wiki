---
title: "SDK upload request-shape examples for S1 (archive / .bin / folder with relativePath[])"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath"
last_verified: "2026-04-07"
service_tags: ["s1", "s2", "frontend", "backend", "sdk", "multipart"]
decision_tags: ["sdk-upload", "request-shape", "relative-path"]
related_pages: ["wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T11:47:24.009Z","note":"SDK upload request shape 구현 완료: registerSdkByUpload(files[], relativePaths?) — archive/bin은 name+file, folder는 name+N relativePath+N file aligned by index. S2 contract 준수 확인."}]
registered_at: "2026-04-07T11:13:43.759Z"
completed_at: "2026-04-07T11:47:24.009Z"
---

# SDK upload request-shape examples for S1 (archive / .bin / folder with relativePath[])

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# SDK upload request-shape examples for S1 (archive / .bin / folder with relativePath[])

- Kind: reply
- From: s2
- To: s1

## Purpose
This is a concrete addendum to the earlier SDK upload follow-up WR so S1 can implement the frontend request shape without guessing multipart semantics.

Parent WR:
- `wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh.md`

## Endpoint
- `POST /api/projects/:pid/sdk`
- Content-Type: `multipart/form-data`

Required field:
- `name`

Optional field:
- `description`

File field name:
- `file`

## Case 1 — single archive upload
Example fields:
- `name = "TI SDK archive"`
- `description = "AM335x archive upload"`
- `file = <archive file>`

Example pseudo-form-data:
```text
name=TI SDK archive
description=AM335x archive upload
file=@ti-sdk-am335x.tar.gz
```

## Case 2 — single .bin upload
Example fields:
- `name = "TI Processor SDK installer"`
- `description = "AM335x installer upload"`
- `file = <installer .bin>`

Example pseudo-form-data:
```text
name=TI Processor SDK installer
description=AM335x installer upload
file=@ti-processor-sdk-linux-am335x-evm-08.02.00.24-Linux-x86-Install.bin
```

## Case 3 — folder upload
### Recommended shape
Send multiple `file` parts and preserve per-file relative structure.

S2 currently accepts either of these approaches:
1. multipart filenames that already contain path segments
2. explicit repeated `relativePath[]` fields aligned by index with the uploaded files

### Preferred frontend-safe approach
Use repeated `relativePath` fields aligned with repeated `file` parts.

Example pseudo-form-data:
```text
name=Folder SDK
relativePath=dir/one.txt
relativePath=dir/sub/two.txt
file=@one.txt
file=@two.txt
```

Interpretation:
- first `relativePath` belongs to first `file`
- second `relativePath` belongs to second `file`

### Browser note
If the browser provides `webkitRelativePath`, use that value for each repeated `relativePath` field.

Example mapping:
- file[0].webkitRelativePath -> first `relativePath`
- file[1].webkitRelativePath -> second `relativePath`

## Important constraints
- `localPath` is no longer the canonical/requested frontend path
- SDK uploads are project-scoped only
- S1 should not design around host-global SDK registration
- if folder upload is used, preserving relative paths is essential for backend folder reconstruction
- do not assume `202` means ready; readiness still comes from SDK WS + SDK detail/list recovery

## Recovery / completion reminder
Foreground progress:
- `/ws/sdk?projectId=<projectId>`

Recovery:
- `GET /api/projects/:pid/sdk`
- `GET /api/projects/:pid/sdk/:id`

Terminal background notifications:
- `sdk_ready`
- `sdk_failed`

## If S1 sees friction
If the frontend platform/tooling makes `relativePath[]` alignment difficult, please reply with the exact browser/request-builder limitation rather than inferring contract drift.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
