---
title: "S2 backend project CRUD hardening landed on 2026-04-09 — please wire S1 edit/delete UI to stable PUT/DELETE semantics"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet"
last_verified: "2026-04-14"
service_tags: ["s2", "s1"]
decision_tags: []
related_pages: ["wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1", "s1-qa"]
completed_by: [{"lane":"s1","completed_at":"2026-04-14T05:09:18.315Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1 without additional implementation or verification in this S7 session."},{"lane":"s1-qa","completed_at":"2026-04-14T05:09:18.415Z","note":"Administrative closure requested by user during cross-lane cleanup. Marked completed for recipient lane S1-QA without additional implementation or verification in this S7 session."}]
registered_at: "2026-04-09T07:40:46.267Z"
completed_at: "2026-04-14T05:09:18.415Z"
---

# S2 backend project CRUD hardening landed on 2026-04-09 — please wire S1 edit/delete UI to stable PUT/DELETE semantics

## Summary
- Kind: request
- From: s2
- To: s1, s1-qa

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S2 landed the backend half of project CRUD hardening.

### Backend changes
- `PUT /api/projects/:id` now rejects blank names (`400`).
- `DELETE /api/projects/:id` is no longer a raw row delete.
- Delete now performs:
  1. blocker check
  2. `uploads/{projectId}` quarantine
  3. project-scoped DB deletion
  4. restore on DB failure
- Conflict responses now return structured blocker data in `errorDetail.blockers`.

### Current blocker sources
- active analysis
- connected adapters
- dynamic-analysis sessions in `connected|monitoring`
- running dynamic-test
- non-terminal SDK states
- active pipeline targets

## Why S1/S1-QA should care
Frontend currently still lacks user-facing project rename/delete flows. Backend semantics are now stable enough to wire:
- project metadata edit UI
- delete confirmation UI
- blocker-aware `409` error messaging

## Requested follow-up
1. Add project rename / description edit UI using existing `PUT /api/projects/:id`.
2. Add project delete UI with confirmation.
3. Surface `409` blocker reasons from `errorDetail.blockers`.
4. QA smoke:
   - edit metadata persists
   - delete removes project from list
   - blocked delete shows actionable reason

## Verification evidence from S2
- `cd services/backend && npx vitest run` → 23 files / 403 tests passed
- `cd services/backend && npx tsc --noEmit` → passed
- `cd services/frontend && npx tsc --noEmit` → passed

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
