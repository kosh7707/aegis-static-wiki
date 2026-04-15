---
title: "Post-merge S8 follow-up: pull latest main, then fix the reviewed container/workspace boundary issues and reply by WR"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa"
last_verified: "2026-04-15"
service_tags: ["s2", "s8"]
decision_tags: ["code-review-followup", "container-gateway", "path-boundary", "git-pull-workflow"]
related_pages: ["wiki/canon/handoff/s8/readme.md", "wiki/canon/specs/container-gateway.md", "wiki/canon/api/container-gateway-api.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa"
wr_kind: "request"
status: "open"
from_lane: "s2"
to_lanes: ["s8"]
completed_by: []
registered_at: "2026-04-15T01:47:16.460Z"
---

# Post-merge S8 follow-up: pull latest main, then fix the reviewed container/workspace boundary issues and reply by WR

## Summary
- Kind: request
- From: s2
- To: s8

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
S8 baseline is now merged, but the post-merge code review found several follow-up issues that should be handled in the next S8 slice.

Before implementing anything else, please **pull the latest `main`** in both repos and continue from that baseline.

## Baseline to pull first
1. **AEGIS** `main`
   - Includes the merged S8 Container Gateway service.
   - Also includes the post-merge cleanup that adds `services/container-gateway/.gitignore` and removes tracked `.runtime/` snapshots.
2. **aegis-static-wiki** `main`
   - Includes canonical S8 docs:
     - `wiki/canon/handoff/s8/readme.md`
     - `wiki/canon/specs/container-gateway.md`
     - `wiki/canon/api/container-gateway-api.md`

## Reviewed follow-up issues to fix
### HIGH 1 — upload path containment is prefix-based and bypassable
- File: `services/container-gateway/src/services/project-source-store.ts`
- Current logic uses `resolved.startsWith(workspacePath)`.
- This is not a safe containment check because sibling-prefix paths can bypass it.
- Requested fix:
  - switch to a boundary-safe check (`path.relative(...)`, or strict path-separator-aware containment),
  - reject traversal outside the workspace,
  - add regression tests.

### HIGH 2 — archive extraction lacks traversal defense
- File: `services/container-gateway/src/services/archive-extractor.ts`
- Current zip/tar extraction path does not validate archive entries before extraction.
- This leaves Zip Slip / tar traversal risk (`../`, absolute-path entries, etc.).
- Requested fix:
  - validate archive entry paths before extraction,
  - reject absolute/traversing entries,
  - add regression tests.

### HIGH 3 — exec cwd containment is also prefix-based and bypassable
- File: `services/container-gateway/src/services/container-executor.ts`
- Current `cwd` guard also uses a prefix check.
- Requested fix:
  - use boundary-safe containment,
  - reject workspace escape,
  - add regression tests.

### MEDIUM 1 — keep `.runtime/` untracked going forward
- The merged baseline already moved `.runtime/` behind `.gitignore` and removed tracked snapshots.
- Requested action:
  - do not reintroduce `.runtime/` as tracked git content,
  - if example state is needed, use fixtures/docs instead of live runtime files.

### MEDIUM 2 — projectId canonicalization / case-collision review
- Files:
  - `services/container-gateway/src/utils/project-id.ts`
  - `services/container-gateway/src/services/project-container-manager.ts`
- Current `projectId` validation allows mixed case, but container naming normalizes to lowercase.
- Requested action:
  - either canonicalize `projectId` consistently,
  - or explicitly restrict input shape,
  - and add tests clarifying the intended rule.

## Review evidence already gathered on the merged S8 implementation
- `cd services/container-gateway && npm ci && npm test` → **11 files / 22 tests passed**
- `cd services/container-gateway && npx tsc --noEmit` → passed

The review concern is not about baseline breakage; it is about **follow-up hardening on path/container/workspace boundaries**.

## Required handoff flow from here
Please use this sequence:
1. pull latest `main` in both repos
2. implement the S8 follow-up fixes
3. send a **reply WR** describing:
   - what changed
   - exact file list
   - commit(s) I should pull
   - what was tested
   - any remaining risks
4. commit and push
5. I will then pull and review

## Notes
- This WR intentionally bundles the full reviewed follow-up set so we do not lose the review trail in chat.
- If any of these items need to be split into multiple S8 slices, say so explicitly in the reply WR and propose the order.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
