---
title: "S4 Build Snapshot Consumer Seam 설계 메모"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/app/scanner/build_runner.py"
  - "wiki/canon/api/sast-runner-api.md"
  - "wiki/canon/specs/sast-runner.md"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "build-snapshot", "provenance", "build"]
decision_tags: ["build-snapshot-consumer-seam", "execution-evidence-authority", "provenance-pass-through"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md"]
---

# S4 Build Snapshot Consumer Seam 설계 메모

Last verified: 2026-05-20
Owner: S4 / SAST Runner
Status: implemented `/v1` seam; still active for build/scan orchestration

This page defines the S4 side of the Build Snapshot consumer seam. It remains active for normal build/scan APIs, but it is separate from the newer paper endpoint. `POST /v1/paper/static-evidence` consumes already-admitted source/compile-context refs and does not execute builds.

## 1. Current S4 position

S4 is **not** the canonical Build Snapshot persistence owner. S4 is the deterministic execution/evidence producer.

Upstream owns snapshot identity:

- `buildSnapshotId`
- `buildUnitId`
- `snapshotSchemaVersion`
- lineage and persistence object semantics

S4 owns execution evidence:

- caller-provided build command execution;
- actual working directory;
- `compile_commands.json` creation/readiness;
- build exit code and sanitized failure category;
- SAST tool execution state;
- scan/static evidence and diagnostics.

Summary:

> Snapshot identity is upstream-authoritative; build/scan execution evidence is S4-authoritative.

## 2. Current `/v1` seam

S4 accepts nested `provenance` objects on build/scan surfaces and echoes them. S4 does not mint or mutate canonical snapshot IDs.

Example:

```json
{
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  }
}
```

A snapshot reference alone is not enough for S4 execution. The caller must also provide resolved local execution material such as `projectPath`, `buildCommand`, `buildEnvironment`, `compileCommandsPath`, `compileCommands`, `thirdPartyPaths`, or equivalent endpoint-specific fields.

## 3. Endpoint impact

| Surface | S4 role |
|---|---|
| `POST /v1/build` | Execute caller-materialized build command/environment; emit build evidence/readiness/failure detail; echo provenance. |
| `POST /v1/scan` | Run deterministic local SAST over supplied files/project/compile context; emit findings, execution metadata, provenance echo, and `staticEvidenceContract`. |
| `POST /v1/build-and-analyze` | Transitional convenience surface; preserves build and scan evidence but should not be the canonical snapshot-first orchestration path. |
| `POST /v1/discover-targets` | Deterministic target locator/hint surface; does not mint durable `buildUnitId`. |
| `POST /v1/paper/static-evidence` | Separate paper producer surface; consumes admitted source/compile context refs, not a build snapshot lookup API. |

## 4. Build path rules

Build path is caller-materialized execution only:

- S4 does not infer SDK intent.
- S4 does not own SDK registry decisions.
- S4 does not auto-discover a build command for `/v1/build`.
- Caller-supplied bad material should fail explicitly and safely.
- `buildEvidence.buildOutput` is sanitized/omitted; raw stdout/stderr is not a public diagnostic surface.

Readiness is `ready` only when build succeeded and usable compile commands exist. `partial` and `not-ready` are diagnostic states and should not be used as canonical Quick input.

## 5. Analysis path rules

Analysis path may still consume `BuildProfile`/compile-context-style inputs because S4 owns local deterministic static-analysis evidence. This does not make S4 the build-intent authority.

`/v1/scan` and `/v1/build-and-analyze` must keep system-stability failures distinct from build readiness. A successful build with failed required SAST tool execution is a SAST system-stability failure, not a build failure and not a security verdict.

## 6. Canonical orchestration preference

Preferred snapshot-first orchestration:

```text
1. POST /v1/build
2. upstream persists/updates canonical build snapshot
3. POST /v1/scan and optional structural/SCA/metadata surfaces
```

`/v1/build-and-analyze` remains useful for local/manual/transitional workflows, but it should not obscure upstream snapshot persistence or split-stage auditability.

## 7. Paper pipeline note

The TraceAudit paper path does not require S4 to look up or own Build Snapshots. Paper calls should pass refs such as `buildSnapshotId`, `buildUnitId`, `sourceRootRef`, and `compileContextRef`, plus execution-local `sourceRoot` and `compileContext.path`.

S4 echoes refs and produces raw static-evidence bundles. S3 owns paper orchestration, normalization, packet rendering, and final TP/FP/UNKNOWN handling.

## 8. Verification evidence

Current full S4 verification:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

Current route inventory in `services/sast-runner/app/routers/scan.py` confirms the active build/scan/paper/request/health surfaces documented in `wiki/canon/api/sast-runner-api.md`.
