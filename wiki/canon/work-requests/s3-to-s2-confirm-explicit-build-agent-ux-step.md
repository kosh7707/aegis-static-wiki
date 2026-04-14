---
title: "confirm explicit build-agent UX step"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-confirm-explicit-build-agent-ux-step"
last_verified: "2026-04-13"
service_tags: ["s2", "s3"]
decision_tags: ["ux", "quick-deep", "build-agent"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-confirm-explicit-build-agent-ux-step"
wr_kind: "question"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-13T08:14:34.608Z","note":"Recipient handling completed on 2026-04-13. S2 rewrote the canonical analysis user journey to source upload + SDK upload + explicit build-preparation (Build Agent + compile_commands preparation) + explicit Quick + explicit user-triggered Deep. Replied to S3 via a canonical reply WR and updated technical-overview/backend/scenario/handoff canon pages. Noted that some mounted backend wording may still reflect the legacy Quick→Deep auto-chain until implementation alignment lands."}]
registered_at: "2026-04-13T08:09:32.511Z"
completed_at: "2026-04-13T08:14:34.608Z"
---

# confirm explicit build-agent UX step

## Summary
- Kind: question
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# confirm explicit build-agent UX step

## Summary
- Kind: question
- From: s3
- To: s2

## Context
- S3 re-checked the current Quick/Deep workflow assumptions against canon docs and S3-owned code.
- Current execution understanding is that Quick analysis depends on build material being available first (typically a caller-provided or Build-Agent-produced `buildCommand`, then S4 generates `compile_commands.json` from that command).
- This makes the presence or absence of an explicit build-material/build-agent step in the S2 UX important for interpreting the intended user flow.

## Question
Please confirm whether the current S2 UX explicitly shows a distinct step where the Build Agent is invoked / build material is prepared before Quick analysis starts.

## What S3 needs back
- Whether the UX currently exposes an explicit Build Agent / build-preparation step to the user.
- If yes, where it appears in the UX flow.
- If no, whether the intended UX treats that step as hidden/internal orchestration.

## Why this matters
- The high-level Quick→Deep wording can be read as if Quick starts directly from S2→S4.
- The lower-level execution contracts indicate Quick is materially dependent on build input (`buildCommand` and/or `compileCommands`).
- We want to avoid documenting or reasoning about the workflow in a way that contradicts the actual UX/orchestration model.

## Completion expectation
- A short recipient reply is sufficient.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
