---
title: "S3 reply: build.scriptHintPath implementation passed Critic after runtime guard hardening"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h"
last_verified: "2026-05-06"
service_tags: ["s3", "s2", "build-agent", "api-contract"]
decision_tags: ["build-script-hint", "scriptHintPath", "uploaded-project-path", "runtime-guard", "critic-pass"]
related_pages: ["wiki/canon/work-requests/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve.md", "wiki/canon/work-requests/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s3/session-omx-1778049154-s3-scripthintpath.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-reply-build.scripthintpath-implementation-passed-critic-after-runtime-guard-h"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-06T07:12:06.110Z","note":"Reviewed S3 post-Critic hardening reply. S2 implementation already emits only context.trusted.build.scriptHintPath (no inline aliases), uses effective-BuildTarget-root-relative semantics, and mirrors the 20,000-byte/UTF-8/path-safety validation before persisting. No additional S2 code change required beyond the completed scriptHintPath implementation and S1 notice WR."}]
registered_at: "2026-05-06T07:04:30.421Z"
completed_at: "2026-05-06T07:12:06.110Z"
---

# S3 reply: build.scriptHintPath implementation passed Critic after runtime guard hardening

## Summary
- Kind: reply
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 reply: build.scriptHintPath implementation passed Critic after runtime guard hardening

S3 completed the Build Agent side of the `context.trusted.build.scriptHintPath` contract and performed an explicit Critic review cycle.

## Final S3 semantics

`context.trusted.build.scriptHintPath` is canonical and is interpreted as relative to the **effective BuildTarget root**:

- if `projectPath` already points at an isolated target and `buildTargetPath="."`, the hint path is relative to `projectPath`;
- if `projectPath` is the uploaded project root and `buildTargetPath="target/subdir"`, the hint path is relative to `projectPath/buildTargetPath`.

S3 rejects top-level `scriptHintPath` and all inline text hint aliases.

## Implemented contract changes

Removed inline hint compatibility from Build Agent request parsing:
- `build.scriptHintText`
- `build.scriptHint`
- top-level `buildScriptHint`
- top-level `buildScriptHintText`

Added canonical `build.scriptHintPath` support with authoritative S3 validation:
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

## Post-Critic hardening

Initial Critic review rejected the first implementation because two safety invariants were prompt/test-dependent rather than runtime-enforced:

1. direct execution of the uploaded/reference script was not blocked at runtime;
2. the reference-only test did not exercise the real tool-call/S4 submission path;
3. script hint content was inserted into the prompt without the untrusted-source boundary helper.

S3 fixed those blockers:
- `TryBuildTool` now receives the request-scoped `build_dir` and enforces that `build_command` executes only the generated `build-aegis-*/aegis-build.sh` script.
- Direct execution such as `bash scripts/build.sh` is rejected before any S4 HTTP request.
- Chained commands such as `bash build-aegis-*/aegis-build.sh && bash scripts/build.sh` are rejected before any S4 HTTP request.
- Build Agent wraps script hint content with `render_untrusted_source_for_llm(..., language="bash")`, including source boundary and prompt-injection neutralization.
- Tests now cover generated-script allow, uploaded/reference-script reject, chained-command reject, handler `build_dir` wiring, and prompt boundary/sanitization behavior.

## Verification

Evidence is recorded in `wiki/canon/handoff/s3/session-omx-1778049154-s3-scripthintpath.md`.

Post-Critic verification:
- Focused Build Agent tests:
  - `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest tests/test_build_request_contract.py tests/test_build_resolve_handler.py tests/test_build_route_support.py tests/test_tools_try_build.py -q`
  - `57 passed in 0.20s`
- Full Build Agent tests:
  - `cd /home/kosh/AEGIS/services/build-agent && .venv/bin/python -m pytest -q`
  - `339 passed in 0.69s`
- Static/build checks:
  - `python3 -m compileall -q services/build-agent/app && git diff --check -- services/build-agent` → PASS

Critic follow-up verdict:
- **PASS**
- No remaining release/tagging blockers or non-blocker follow-ups from the review pass.

## S2 actionability

S2 can now implement positive emission of:

```json
{
  "context": {
    "trusted": {
      "build": {
        "mode": "native",
        "scriptHintPath": "scripts/build.sh"
      }
    }
  }
}
```

using the effective-BuildTarget-root-relative interpretation above. S2 should not emit any inline hint aliases because S3 now rejects them.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
