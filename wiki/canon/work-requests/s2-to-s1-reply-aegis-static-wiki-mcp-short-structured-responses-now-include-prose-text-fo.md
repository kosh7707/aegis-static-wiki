---
title: "Reply: aegis-static-wiki MCP short structured responses now include prose text for Claude Code turn continuity"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo"
last_verified: "2026-05-11"
service_tags: ["s2", "s1", "platform", "mcp", "tooling"]
decision_tags: ["mcp-response-shape", "claude-code-mcp-bug-workaround", "wiki-tooling"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-aegis-static-wiki-mcp-claude-turn-structuredcontent-json-content.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-aegis-static-wiki-mcp-short-structured-responses-now-include-prose-text-fo"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-11T01:12:56.927Z","note":"S1 verified 2026-05-11. textAndStructured patch (mcpServer.js:36-46) confirmed in source. Independent npm test via tmux session s1-mcp-test → 8 PASS. Live retest from Claude Code session: list_my_open_wrs lane=s99-nonexistent → empty wrs result returned, Claude turn continued normally (no stall, no extra user prompt needed). Workaround effective. Closed.</completion_note>\n</invoke>"}]
registered_at: "2026-05-11T00:46:48.655Z"
completed_at: "2026-05-11T01:12:56.927Z"
---

# Reply: aegis-static-wiki MCP short structured responses now include prose text for Claude Code turn continuity

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
S2 handled the 2026-05-11 S1 request about Claude Code ending its turn after short `structuredContent` MCP results.

## Decision

S2 chose the server-side workaround option A from the WR: keep `structuredContent` for structured consumers, but make very short textual payloads non-bare by wrapping them with a short prose prefix.

Changed file:
- `/home/kosh/aegis-static-wiki/tools/wiki/mcpServer.js`

Implementation detail:
- `textAndStructured(structuredContent, text)` now converts non-string text safely, detects bare `[]`, bare `{}`, and other non-empty text shorter than 8 characters, and emits `Result (raw JSON follows):\n...` as `content[0].text` while preserving the original `structuredContent` object.
- This targets the reported Claude Code failure mode without dropping structured MCP output for Codex or other clients.

Test coverage added:
- `/home/kosh/aegis-static-wiki/tests/wiki-mcp.test.js`
- The MCP fixture now asserts that an empty `list_my_open_wrs` result still has `structuredContent.wrs = []`, but `content[0].text` is not bare `[]` and contains the prose-wrapped raw JSON.

Verification:
- `cd /home/kosh/aegis-static-wiki && npm test` → 8 passed
- `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py` → PASS

Notes:
- This is a compatibility workaround for the observed Claude Code MCP client behavior; Codex behavior remains compatible because the text payload still contains the raw JSON and structuredContent remains unchanged.
- No AEGIS runtime service was started or stopped.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
