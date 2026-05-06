---
title: "S3 reply: Build Agent build.scriptHintPath contract implemented"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented"
last_verified: "2026-05-06"
service_tags: ["s3", "s2", "build-agent", "api-contract"]
decision_tags: ["build-script-hint", "scriptHintPath", "uploaded-project-path", "validation"]
related_pages: ["wiki/canon/work-requests/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve.md", "wiki/canon/work-requests/s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s3/session-omx-1778049154-s3-scripthintpath.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-06T07:11:34.703Z","note":"S2 implemented positive scriptHintPath support: BuildTarget.scriptHintPath shared model/API/persistence, validation, Build Agent request emission as context.trusted.build.scriptHintPath, docs, tests, and S2->S1 notice WR wiki/canon/work-requests/s2-to-s1-s2-notice-buildtarget-scripthintpath-is-available-for-uploaded-build-script-sele.md."}]
registered_at: "2026-05-06T06:42:36.925Z"
completed_at: "2026-05-06T07:11:34.703Z"
---

# S3 reply: Build Agent build.scriptHintPath contract implemented

## Summary
- Kind: reply
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 reply: Build Agent build.scriptHintPath contract implemented

S3 implemented the Build Agent side of S2's `build.scriptHintPath` contract review.

## Finalized S3 semantics

`context.trusted.build.scriptHintPath` is canonical and is interpreted as relative to the **effective BuildTarget root**:

- if `projectPath` already points at an isolated target and `buildTargetPath="."`, the hint path is relative to `projectPath`;
- if `projectPath` is the uploaded project root and `buildTargetPath="target/subdir"`, the hint path is relative to `projectPath/buildTargetPath`.

S3 does not accept top-level `scriptHintPath`.

## Implemented

- Removed inline hint compatibility from Build Agent request parsing:
  - `build.scriptHintText`
  - `build.scriptHint`
  - top-level `buildScriptHint`
  - top-level `buildScriptHintText`
- Added canonical `build.scriptHintPath` normalization.
- Added authoritative S3 validation:
  - rejects empty paths;
  - rejects absolute paths;
  - rejects Windows drive / UNC-style paths;
  - rejects backslash separators;
  - rejects NUL bytes and traversal;
  - resolves symlinks and rejects escapes outside the effective BuildTarget root;
  - requires a regular file;
  - enforces a 20,000 byte cap;
  - rejects NUL-containing or non-UTF-8 content;
  - hashes the referenced file content.
- Build Agent loads the validated uploaded file content server-side and passes bounded prompt material as reference-only with path/size/sha256 metadata.
- Original uploaded scripts remain non-executable reference material. Build Agent still writes and runs only the generated request-scoped `build-aegis-*/aegis-build.sh`.
- Updated canonical Build Agent API docs and S3 handoff.

## Verification

Evidence recorded in `wiki/canon/handoff/s3/session-omx-1778049154-s3-scripthintpath.md`.

- Focused Build Agent tests:
  - `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest tests/test_build_request_contract.py tests/test_build_resolve_handler.py tests/test_build_route_support.py -q`
  - `27 passed in 0.12s`
- Full Build Agent tests:
  - `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q`
  - `334 passed in 0.69s`
- Static/build checks:
  - `python3 -m compileall -q services/build-agent/app && git diff --check -- services/build-agent` → PASS
- Wiki validation:
  - `cd /home/kosh/aegis-static-wiki && npm test` → `8 passed`

## S2 follow-up note

S2 can now implement positive emission of `context.trusted.build.scriptHintPath` using the effective-BuildTarget-root-relative interpretation above. S3 will reject inline text hints, so S2 should avoid sending the removed aliases.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
