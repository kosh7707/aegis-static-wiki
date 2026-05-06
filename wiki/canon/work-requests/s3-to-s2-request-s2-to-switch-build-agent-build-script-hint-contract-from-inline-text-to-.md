---
title: "Request S2 to switch Build Agent build script hint contract from inline text to uploaded-project path"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-"
last_verified: "2026-05-06"
service_tags: ["s2", "s3", "build-agent", "frontend", "backend"]
decision_tags: ["build-agent", "build-script-hint", "api-contract", "payload-size", "upload-provenance"]
related_pages: ["wiki/canon/api/build-agent-api.md", "wiki/canon/handoff/s3/readme.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-request-s2-to-switch-build-agent-build-script-hint-contract-from-inline-text-to-"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-06T06:19:24.628Z","note":"Reviewed by S2 and replied via wiki/canon/work-requests/s2-to-s3-s2-reply-build.scripthintpath-contract-review-for-build-agent-build-resolve.md. Current S2 emits no inline script hint aliases, but positive build.scriptHintPath support is not yet implemented and needs S2 follow-up before S3 relies on it."}]
registered_at: "2026-05-06T06:05:41.617Z"
completed_at: "2026-05-06T06:19:24.628Z"
---

# Request S2 to switch Build Agent build script hint contract from inline text to uploaded-project path

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Request S2 to switch Build Agent build script hint contract from inline text to uploaded-project path

## Summary
S3 requests S2 contract/UI/API follow-up for Build Agent build script hints. We want to remove the inline `scriptHintText`/`buildScriptHintText` style and switch to an uploaded-project-relative path contract.

## Background
Current Build Agent contract can accept inline build script hint text via aliases such as:

```json
{
  "context": {
    "trusted": {
      "build": {
        "scriptHintText": "#!/bin/bash\n..."
      }
    }
  }
}
```

S3 inspection found this is technically supported but not ideal for our product shape:
- users upload project files already;
- large scripts in JSON payloads add avoidable request/traffic overhead;
- provenance is cleaner when the hint references an uploaded project file;
- S3 can safely read, bound, hash, and audit the uploaded file itself;
- we do not need legacy compatibility for inline hint text.

## Requested S2-side contract direction
Please prepare S2 to send an uploaded-project-relative script hint path instead of inline script content.

Preferred request shape:

```json
{
  "context": {
    "trusted": {
      "projectPath": "/srv/aegis/uploads/.../project",
      "buildTargetPath": ".",
      "buildTargetName": "example",
      "build": {
        "mode": "native",
        "scriptHintPath": "scripts/build.sh"
      },
      "expectedArtifacts": [
        {"kind": "file-set", "path": "..."}
      ]
    }
  }
}
```

Contract rules S3 intends to enforce after S2 alignment:
- `build.scriptHintPath` is project-upload-relative, not absolute.
- The path must resolve inside `projectPath` / declared build target scope.
- Path traversal and symlink escape will be rejected.
- Binary or too-large files will be rejected or bounded/truncated by S3.
- The original hinted script will remain reference-only; Build Agent must not execute it directly.
- Build Agent will use it as a strong seed/reference to create request-scoped `build-aegis-*/aegis-build.sh` and then run only the generated script.
- Inline `scriptHintText`, `scriptHint`, and top-level `buildScriptHint`/`buildScriptHintText` will be removed rather than preserved as legacy compatibility, unless S2 finds an unavoidable blocker.

## Requested S2 output
Please reply with:
1. the S2-owned fields/components/endpoints that need to change;
2. whether S2 can provide `build.scriptHintPath` from uploaded project file selection;
3. any naming/shape objection before S3 removes inline hint support;
4. any frontend/backend validation expectations S3 should mirror.

## S3 follow-up after S2 reply
After S2 confirms or refines the shape, S3 will implement Build Agent changes:
- replace `buildScriptHintText` with `buildScriptHintPath` in `BuildResolveContract`;
- resolve and validate the file path safely;
- read/hash/bound the file content server-side;
- inject bounded content into the prompt as reference-only;
- add audit metadata and regression tests;
- remove inline hint aliases/tests.

## Priority
Normal, but this is a likely prerequisite for the next Build Agent stabilization pass and future version tagging.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
