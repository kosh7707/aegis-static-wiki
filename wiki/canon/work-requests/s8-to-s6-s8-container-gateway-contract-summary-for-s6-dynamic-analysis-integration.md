---
title: "S8 Container Gateway contract summary for S6 dynamic-analysis integration"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s8-to-s6-s8-container-gateway-contract-summary-for-s6-dynamic-analysis-integration"
last_verified: "2026-04-20"
service_tags: ["s8", "s6"]
decision_tags: ["container-gateway", "dynamic-analysis", "handoff", "integration-contract"]
related_pages: ["wiki/canon/handoff/s8/readme.md", "wiki/canon/specs/container-gateway.md", "wiki/canon/api/container-gateway-api.md", "wiki/canon/handoff/s6/readme.md"]
migration_status: "canonicalized"
wr_id: "s8-to-s6-s8-container-gateway-contract-summary-for-s6-dynamic-analysis-integration"
wr_kind: "notice"
status: "open"
from_lane: "s8"
to_lanes: ["s6"]
completed_by: []
registered_at: "2026-04-20T08:23:24.025Z"
---

# S8 Container Gateway contract summary for S6 dynamic-analysis integration

## Summary
- Kind: notice
- From: s8
- To: s6

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary
This notice summarizes the current S8 Container Gateway contract in terms S6 can use for dynamic-analysis planning.

S8 is the **container/runtime execution plane**. S6 should treat S8 as the service that owns project-scoped containers, workspaces, compile, limited exec, and teardown. S6 should remain the dynamic-analysis orchestration plane and call S8 rather than embedding Docker/Ghidra/toolchain ownership in S6.

## Current S8 role
- Standalone HTTP service: `services/container-gateway`
- Default base URL: `http://localhost:4010`
- One managed container per project
- Versioned workspaces per project upload
- QEMU-capable compile image
- Allowlist-based command execution
- Safe runtime teardown

## Current container/image behavior
S8 does **not** install QEMU every time a project container is created.

Instead:
1. `services/container-gateway/docker/container-toolchain.Dockerfile` installs toolchain dependencies during Docker image build.
2. `npm run image:build` builds `aegis-s8-qemu-compile:latest`.
3. Project containers are created from that prebuilt image.

Current image includes:
- `qemu-user-static`
- `gcc`, `g++`
- `gcc-arm-linux-gnueabihf`
- `gcc-aarch64-linux-gnu`
- cross libc dev packages
- `make`, `file`

Current image does **not** include Ghidra or Ghidra MCP.

## Important Ghidra guidance for S6
Ghidra is not required for the first dynamic-analysis automation slice.

Recommended near-term split:
- **S4/SAST/S3 findings** provide source-level or finding-level hints for what should be dynamically exercised.
- **S6** converts those hints into a dynamic-analysis plan/session.
- **S8** provides the containerized execution capability: upload/import workspace, compile, allowlisted exec, and later run/trace APIs.

Ghidra should be considered later for binary-only or reverse-engineering-heavy workflows, such as:
- stripped firmware binary inspection
- function/address recovery
- crash address mapping
- breakpoint/hook candidate extraction
- Ghidra annotation after QEMU/GDB/trace results

If Ghidra is added later, S8 should usually own it in a dedicated image/profile because it belongs with the runtime filesystem and binaries. S6 should consume S8 APIs, not host Ghidra directly.

## Current S8 API surfaces S6 can plan around
### Health
- `GET /health`

### Upload
- `POST /api/projects/:projectId/upload`
- Multipart field: `file`
- Returns S8-issued identifiers:
  - `uploadId`
  - `workspaceId`
  - `workspaceVersion`

`workspacePath` may appear in responses, but it is implementation/debug information only. S6 should not treat it as a canonical inter-service identity.

### Container status
- `GET /api/projects/:projectId/container`
- Returns container status, ID, image, labels, and lifecycle state.

### Compile
- `POST /api/projects/:projectId/compile`
- Requires `workspaceId` and compile profile.
- Supports native C/C++ compile and current cross-compiler profiles available in the image.

### Exec
- `GET /api/projects/:projectId/exec/allowed-commands`
- `POST /api/projects/:projectId/exec`
- Requires `workspaceId`.
- This is not an interactive terminal. It is a bounded, allowlist-based one-shot command interface.

Current examples include:
- `pwd`, `ls`, `find`, `file`, `cat`
- `cp`, `mv`, `mkdir`
- `gcc`, `g++`, `make`
- `readelf`, `objdump`
- `arm-linux-gnueabihf-gcc`, `aarch64-linux-gnu-gcc`

### Teardown
- `DELETE /api/projects/:projectId/runtime`
- S8 owns safe teardown for its project container/workspace runtime state.

## Current limitations S6 must account for
- No S2 automatic import integration yet.
- No frontend UI.
- No auth/ACL yet; S6 should not expose S8 directly to untrusted clients as if it were access-controlled.
- No actual binary run/trace API yet.
- Current QEMU support is `qemu-user-static` oriented; full `qemu-system-*`, GDB attach, coverage, trace, fuzzing, or firmware/system emulation APIs are future work.
- Ghidra/Ghidra MCP are not installed in the current S8 image.

## Recommended S6 integration posture
For the next S6 dynamic-analysis slice, use this mental model:

```text
S6 Dynamic Analysis
  - receives/owns dynamic-analysis session intent
  - uses S4/S3/S2 findings/build-target context to select what to exercise
  - calls S8 for container/workspace/compile/exec operations

S8 Container Gateway
  - owns Docker/container lifecycle
  - owns project workspace materialization
  - owns compile and bounded exec inside the container
  - later can add run/trace/Ghidra/reversing profiles if needed
```

## Suggested next S6-facing contract questions
1. What exact S6 dynamic-analysis session input should map to S8 `projectId` and `workspaceId`?
2. Should S6 first call S8 upload directly, or wait for the future S2 `import-from-path` seam?
3. What is the first runtime action S6 needs after compile: binary run, QEMU user-mode run, qemu-system run, GDB attach, trace, or fuzz seed execution?
4. Which S4 finding fields are sufficient to generate the first dynamic-analysis plan?

## Requested action from S6
Please use this as the current S8 capability baseline when designing the next S6 dynamic-analysis flow. If S6 needs a concrete new S8 endpoint, send a WR back to S8 with the requested request/response shape and the first smoke test S6 expects.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
