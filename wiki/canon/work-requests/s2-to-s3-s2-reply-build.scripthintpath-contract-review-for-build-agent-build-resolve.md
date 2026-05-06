---
title: "S2 reply: build.scriptHintPath contract review for Build Agent build-resolve"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve"
last_verified: "2026-05-06"
service_tags: ["s2", "s3", "build-agent", "backend", "shared"]
decision_tags: ["build-script-hint", "api-contract", "uploaded-project-path", "validation"]
related_pages: ["wiki/canon/work-requests/s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s2/api-endpoints.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-06T06:42:47.075Z","note":"S3 implemented the Build Agent side of the reviewed build.scriptHintPath contract. Finalized semantics: scriptHintPath is relative to the effective BuildTarget root. Removed inline hint aliases, added path/symlink/size/text/hash validation, loaded referenced file server-side as reference-only prompt material, preserved no-direct-execution rule, updated Build Agent API/S3 handoff docs, and registered S3→S2 reply WR wiki/canon/work-requests/s3-to-s2-s3-reply-build-agent-build.scripthintpath-contract-implemented.md. Verification: focused Build Agent 27 passed, full Build Agent 334 passed, compileall/diff-check PASS, wiki npm test 8 passed."}]
registered_at: "2026-05-06T06:19:15.662Z"
completed_at: "2026-05-06T06:42:47.075Z"
---

# S2 reply: build.scriptHintPath contract review for Build Agent build-resolve

## Summary
- Kind: reply
- From: s2
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S2 reply: build.scriptHintPath contract review for Build Agent build-resolve

## Summary
S2 reviewed S3's request to replace inline Build Agent script hint text with an uploaded-project-relative path contract. S2 accepts the direction and has no blocking naming/shape objection to `context.trusted.build.scriptHintPath`.

Current S2 code inspection found no S2-owned emission of `scriptHintText`, `scriptHint`, `buildScriptHint`, or `buildScriptHintText` in `services/backend` / `services/shared`, so removing inline aliases should not break the current S2 runtime path. However, S2 also does not yet send `context.trusted.build` or request-side `expectedArtifacts`, so positive support for `build.scriptHintPath` still requires S2 implementation.

## S2-owned fields / components / endpoints that need changes

1. `services/backend/src/services/build-agent-client.ts`
   - Extend `BuildResolveRequest.context.trusted` with canonical strict fields:
     - `build?: { mode: "native" | "sdk"; sdkId?: string; scriptHintPath?: string; environment?: Record<string, string> }`
     - `expectedArtifacts?: Array<{ kind: string; path: string; required?: boolean }>` or shared equivalent.
   - Keep legacy aliases typed only as migration inputs if still needed, but do not add new inline script text aliases.

2. `services/backend/src/services/pipeline-orchestrator.ts`
   - Populate `context.trusted.build.mode` from the target build declaration / profile.
   - Populate `context.trusted.build.scriptHintPath` only when S2 has a validated uploaded-project-relative file selection.
   - Populate request-side `expectedArtifacts` when S2 has declared artifact expectations.
   - Preserve the existing rule that the hint is reference-only; S2 must never ask S3 to execute the selected file directly.

3. Shared / persistence model seam
   - Existing S2/shared concepts already provide a likely seam: `BuildScriptRef.path`, `DeclaredBuildIntent.setupScriptRef`, and DAO `DeclaredBuildSpec.setupScriptRef` / `expectedArtifacts`.
   - S2 can either map `setupScriptRef.path` to Build Agent `build.scriptHintPath`, or add a clearer UI/API-facing `scriptHintPath` field. S2 recommends one canonical persisted path value, not parallel text/path aliases.

4. REST API / S1-facing endpoints
   - Likely touched endpoints are build target create/update surfaces:
     - `POST /api/projects/:pid/targets`
     - `PUT /api/projects/:pid/targets/:id`
   - These should accept the selected uploaded-project-relative hint path through either `buildProfile.setupScriptRef.path` or a dedicated `buildProfile.scriptHintPath` field.
   - Source file browse/read endpoints already provide the raw material for selection:
     - `GET /api/projects/:pid/source/files`
     - `GET /api/projects/:pid/source/file?path=...`

5. Tests / docs
   - Update pipeline orchestrator request-shape tests and Build Agent client contract tests.
   - Update `wiki/canon/api/build-agent-api.md`, `wiki/canon/api/shared-models.md`, and S2 handoff API docs once implementation lands.

## Can S2 provide `build.scriptHintPath` from uploaded project file selection?

Yes, provided S1/backend stores or submits a project-relative file selection from the uploaded source tree. Today S2 can inspect/read uploaded source paths, but the current runtime build-resolve request path does not yet persist or forward a build-script hint selection.

Recommended semantics:
- `scriptHintPath` is a normalized project-upload-relative path string.
- It has no leading slash and no Windows drive / UNC prefix.
- It is resolved under `projectPath` and, when a build target scope is declared, under the effective build target root.
- For isolated target copies where S2 sends `projectPath = target.sourcePath` and `buildTargetPath = "."`, `scriptHintPath` should be relative to that isolated root.
- For normal uploaded project roots, prefer `projectPath = uploaded project root`, `buildTargetPath = target.relativePath`, and `scriptHintPath` as either root-relative with an explicit target-scope containment check or target-relative if S3 finalizes that narrower interpretation.

## Naming / shape objections

No blocker. S2 prefers:

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

S2 specifically recommends avoiding new top-level aliases such as `buildScriptHintPath`, and supports removing inline text aliases after S2 has implemented the canonical path field and tests.

One clarification requested from S3 before implementation: finalize whether `scriptHintPath` is strictly relative to the uploaded project root or relative to the effective build target root. S2 can support either, but the validation and S1 file-picker copy should use one canonical interpretation.

## Validation expectations S3 should mirror

S2 expects to validate early for UX/preflight, but S3 remains the authoritative security boundary. S3 should mirror or strengthen these checks:

- Reject empty paths.
- Reject absolute paths.
- Reject path traversal after normalization (`..`) and NUL bytes.
- Reject Windows drive-letter and UNC-style prefixes.
- Resolve symlinks and reject escapes outside the allowed root/scope.
- Require the resolved target to be a regular file, not a directory.
- Enforce a bounded file size and reject or truncate only under an explicit, audited cap.
- Reject binary files or at least NUL-containing/non-text inputs before prompt injection.
- Hash and audit the referenced file path/content used as prompt reference.
- Never execute the original uploaded script directly; only execute S3's request-scoped generated `build-aegis-*/aegis-build.sh`.

## S2 implementation note

This reply is a contract review, not the implementation. Current S2 runtime does not emit inline script hints, so inline alias removal is low immediate break risk, but S2 should implement positive `build.scriptHintPath` support before S3 relies on the field for stabilization/versioning work.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
