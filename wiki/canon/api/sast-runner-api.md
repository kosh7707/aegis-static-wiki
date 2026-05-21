---
title: "SAST Runner API 명세 (v0.11.2)"
page_type: "canonical-api"
canonical: true
source_refs:
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/app/config.py"
  - "services/sast-runner/app/scanner/orchestrator.py"
  - "services/sast-runner/app/scanner/paper_static_evidence.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
  - "services/sast-runner/tests/test_scan_endpoint.py"
  - "services/sast-runner/tests/test_scan_router_logging.py"
  - "wiki/canon/handoff/s4/session-s4-freeze-observability-hardening-20260520.md"
  - "wiki/canon/handoff/s4/session-s4-log-analyzer-traceability-20260520.md"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "api-contract", "static-analysis", "paper-pipeline", "observability"]
decision_tags: ["s4-v0.11.2", "current-six-tools", "static-evidence-contract", "durable-ownership", "paper-static-evidence"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md"]
---

# SAST Runner API 명세 (v0.11.2)

Last verified: 2026-05-20
Owner: S4 / `services/sast-runner`
Base path: `/v1`
Service identity: `s4-sast`, implementation version `0.11.2`

This page is the current S4-owned HTTP contract. It replaces the older chronological changelog-style API page with the live consumer surface S3/S2 should actually read. Historical proof remains in S4 session pages and WRs.

## 1. Service role and boundary

S4 is the deterministic static-analysis and build-evidence producer. It may execute local tools and parse local source/build artifacts, but it does not perform LLM reasoning, GraphRAG retrieval, CVE affectedness judgment, exploitability judgment, TP/FP/UNKNOWN classification, or final security verdicts.

Current default SAST portfolio:

```text
semgrep
cppcheck
flawfinder
clang-tidy
scan-build
gcc-fanalyzer
```

Unless a caller explicitly requests a subset through an endpoint that supports it, the current-six tool set is the required local SAST portfolio.

## 2. Common headers and ownership mode

| Header | Meaning |
|---|---|
| `X-Request-Id` | Caller-provided trace/request id. If absent on supported endpoints, S4 generates one. Duplicate live ids are treated as request ownership, not duplicate work. Cross-endpoint reuse is a conflict. |
| `Prefer: respond-async` | Request durable ownership. S4 returns `202` with status/result URLs while work continues. |
| `X-Timeout-Ms` | Optional internal execution budget hint for supported local subprocess work. In async ownership mode it must not be interpreted as an HTTP read-deadline correctness claim. |

Durable ownership endpoints are tracked through:

```http
GET /v1/requests/{request_id}
GET /v1/requests/{request_id}/result
DELETE /v1/requests/{request_id}
```

Polling states: `queued`, `running`, `completed`, `failed`, `cancelled`. A long-running but owned `queued`/`running` request is not a security result.

## 3. Error and diagnostic rules

S4 must keep operational failures, tool failures, contract failures, and vulnerability-quality claims separate.

- Request validation errors return structured `errorDetail`/diagnostics and must not echo raw request bodies, host paths, secrets, raw stdout/stderr, or arbitrary exception strings.
- Required tool liveness/execution failures are system-stability failures, not TP/FP/UNKNOWN and not “safe code”.
- Empty SAST output is never negative security evidence.
- Semgrep effective-coverage caveats are reported as `coverageDegraded` / `coverageReasons` / `coverage`, not as runtime `degraded`. They indicate bounded coverage limits, not tool process failure.
- S4 may emit producer diagnostics and claim-boundary metadata; consumers own final interpretation.

## 4. Route surface inventory

Current `services/sast-runner/app/routers/scan.py` exposes 13 route surfaces:

| Method/path | Status | Purpose |
|---|---|---|
| `POST /v1/paper/static-evidence` | current paper surface | TraceAudit paper static-evidence bundle producer. Use this for S3/S4/S5 paper experiments. |
| `POST /v1/scan` | current production surface | Run local deterministic SAST over supplied files/project/compile context and emit findings plus `staticEvidenceContract`. |
| `POST /v1/functions` | compatibility/current | Extract structural function/callgraph evidence. |
| `POST /v1/includes` | compatibility/current | Extract include-edge evidence. |
| `POST /v1/metadata` | compatibility/current | Extract local build/target metadata. |
| `POST /v1/libraries` | compatibility/current | Identify vendored/third-party libraries and local version/diff evidence. CVE lookup is not S4-owned. |
| `POST /v1/build-and-analyze` | convenience/transitional | Run build then analysis in one call. Not the preferred snapshot-first orchestration path. |
| `POST /v1/build` | current build evidence | Execute caller-materialized build command/environment and emit build evidence/readiness. |
| `POST /v1/discover-targets` | identity hint | Deterministically discover build target hints; does not mint canonical build-unit identity. |
| `GET /v1/requests/{request_id}` | ownership | Poll durable request state. |
| `GET /v1/requests/{request_id}/result` | ownership | Retrieve durable request result, `202` until ready. |
| `DELETE /v1/requests/{request_id}` | ownership | Cancel/forget owned request when supported. |
| `GET /v1/health` | health/control | Service health plus request-summary/control information. |

## 5. `POST /v1/paper/static-evidence`

Authoritative detailed contract: `wiki/canon/api/sast-runner-paper-static-evidence-api.md`.

Purpose: produce one S4 raw static-evidence bundle for one already-admitted paper build target. It is the canonical S4 producer surface for TraceAudit experiments.

Minimum request identity:

```json
{
  "caseId": "case-001",
  "buildTargetId": "target-001",
  "sourceRoot": "/paper/targets/target-001/source",
  "compileContext": {
    "type": "compile_commands_json",
    "path": "evidence/compile_commands.json",
    "ref": "compile-context:case-001:target-001"
  },
  "provenance": {
    "paperRunId": "paper-run-001",
    "buildSnapshotId": "build-snapshot-001",
    "buildUnitId": "build-unit-001",
    "sourceRootRef": "source-root:case-001:target-001",
    "compileContextRef": "compile-context:case-001:target-001"
  },
  "scope": {
    "includePaths": [],
    "excludePaths": [],
    "thirdPartyPaths": []
  }
}
```

Response envelope minimum:

- `schemaVersion="s4-paper-static-evidence-bundle-v1"`
- `bundleProfile="s4-paper-static-evidence-full-v1"`
- `surfacePolicy="always_attempt_full_bundle"`
- `success`, `bundleStatus`, `evidenceCompleteness`
- identity/provenance: `caseId`, `buildTargetId`, `s4RequestId`, `s4ProducerRunId`, `bundleRef`, `producer`, `provenance`
- `surfaceStatus` for every required surface
- arrays always present: `diagnostics`, `findings`, `evidence`, `sourceFiles`, `functions`, `includeEdges`, `libraries`, `toolRuns`
- singleton/top-level surfaces: `targetMetadata`, `staticEvidenceContract`, `claimBoundaryMatrix`, `claimBoundaries`

Forbidden paper request/response semantics include build execution fields, TP/FP/UNKNOWN, verdicts, safe/risk scores, CVE affectedness, exploitability, checksum/hash/digest/fingerprint/integrity/reproducibility claims, and GraphRAG/LLM output.

Current S4 paper gate:

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
```

## 6. `POST /v1/scan`

Purpose: run local deterministic SAST and emit a normal S4 scan artifact.

Typical request fields:

| Field | Meaning |
|---|---|
| `scanId` / `projectId` | Caller/project identity hints. |
| `files` | Optional direct file list. |
| `projectPath` | Optional local project path for project-based scans. |
| `compileCommands` / `compileCommandsPath` | Compile database input when available. |
| `buildProfile` | Analysis profile only; not an SDK/build-command intent owner. |
| `thirdPartyPaths` | Local origin classification hints. |
| `options.tools` | Optional explicit tool subset; unknown values return `SCAN_TOOL_INVALID`. |
| `options.timeoutSeconds` | Tool execution budget hint. |
| `provenance` | Upstream build snapshot/build unit refs to echo. |

Normal response includes:

- `success`, `scanId`, `status`
- `findings[]`
- `execution` including tool results/degradation metadata
- Semgrep `execution.toolResults.semgrep.coverage`, `coverageDegraded`, and `coverageReasons` when Semgrep runs; these are effective-coverage caveats, not system-stability failures
- optional `sca`, `codeGraph`, `metadata`
- `provenance` echo when supplied
- additive `staticEvidenceContract`

Default runtime required-tool policy: every required tool must be recorded as successful and non-degraded. Required tool preflight failure returns `503` with `REQUIRED_TOOL_UNAVAILABLE`. Required tool post-execution failure returns `503` with `REQUIRED_TOOL_EXECUTION_INCOMPLETE`. These are system-stability failures, not quality findings.

## 7. `POST /v1/build`

Purpose: execute caller-materialized build material and produce build evidence/readiness. S4 does not infer SDK intent, discover a build command, or own snapshot persistence.

Minimum request:

```json
{
  "projectPath": "/uploads/project/target",
  "buildCommand": "/uploads/project/target/scripts/generated-build.sh",
  "buildEnvironment": { "CC": "/toolchain/bin/gcc" },
  "provenance": {
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "bunit-456",
    "snapshotSchemaVersion": "build-snapshot-v1"
  },
  "wrapWithBear": true
}
```

Readiness is `ready` only when `success=true`, `compile_commands.json` exists, user entries exist, build exit code is `0`, and S4 can emit `buildEvidence.compileCommandsPath`. `partial` and `not-ready` are not canonical Quick inputs.

## 8. `POST /v1/build-and-analyze`

Purpose: convenience one-shot for build plus scan/functions/libraries/metadata.

Current architectural status: transitional/manual helper. The preferred snapshot-first flow remains:

```text
/v1/build -> upstream snapshot persist -> /v1/scan and other evidence surfaces
```

If build succeeds but scan required-tool stability fails, S4 must preserve nested build evidence while returning scan/static-evidence failure diagnostics. Consumers must not collapse build readiness and SAST system stability into one signal.

## 9. Structural and SCA surfaces

| Endpoint | Boundary |
|---|---|
| `/v1/functions` | Structural function/callgraph observations only; no semantic GraphRAG completeness. |
| `/v1/includes` | Include-edge observations only. |
| `/v1/metadata` | Local compile/build profile metadata only. |
| `/v1/libraries` | Local library identity/version/diff evidence only. Repository URLs are sanitized public evidence; raw clone/fetch URLs remain internal. No CVE affectedness or no-vulnerable-dependency claim. |
| `/v1/discover-targets` | Deterministic locator hints (`name`, `relativePath`, `buildSystem`, `buildFile`); not canonical build unit IDs. |

## 10. Observability contract

S4 writes canonical JSONL logs for service lifecycle and request lifecycle. Paper static-evidence and request-validation paths propagate or generate `requestId` and emit lifecycle start/end/error/accepted events. The log-analyzer evidence on 2026-05-20 proved an exact S4 paper request trace (`req-s4-log-proof-1779259710-6143`) from lifecycle start through terminal status 200.

Current observability gate:

```text
S4_CANONICAL_JSONL_LOG_ANALYZER_TRACEABILITY = pass
```

## 11. Current verification evidence

Latest service-root verification for this document refresh:

```bash
cd services/sast-runner && .venv/bin/pytest -q
# 1406 passed, 1 skipped in 34.39s
```

Additional current focused evidence:

```bash
cd services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_scan_router_logging.py tests/test_main_startup_logging.py -q
# 63 passed, 1 skipped in 2.02s

cd services/sast-runner && .venv/bin/semgrep --validate --config rules
# Configuration is valid - found 0 configuration error(s), and 41 rule(s).

# Direct certmaker Semgrep proof after C++ canary rule pack:
# services.sast-runner.rules.cpp.aegis.cpp.cwe-78-popen-with-variable at main.cpp:35
```

These prove S4 service behavior and documentation claims were checked against the live codebase on 2026-05-20. Cross-lane integration still belongs to the owning S3/S5 e2e smoke gates.
