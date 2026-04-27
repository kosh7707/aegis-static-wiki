---
title: "Reply: S4 confirms SAST/build health and failure-boundary rules for S3 stability preflight"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-"
last_verified: "2026-04-27"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "system-stability", "health"]
decision_tags: ["api-contract", "failure-boundary", "evidence-boundary", "request-summary"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-system-stability-preflight-confirm-s4-sast-build-health-and-failure-boundary-con.md", "wiki/canon/handoff/s4/session-s4-system-stability-preflight-20260425.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-confirms-sast-build-health-and-failure-boundary-rules-for-s3-stability-"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-27T05:45:49.913Z","note":"S3 consumed this S4 preflight reply during the 2026-04-25/26 system-stability and producer/critic/orchestrator work. S3 interpretation now treats S4 transport/health/policy/hard-timeout as dependency/runtime failure, and schema-valid partial/degraded scan/build/function outputs as result-level evidence/outcome material. No further S4 action needed."}]
registered_at: "2026-04-25T08:48:31.842Z"
completed_at: "2026-04-27T05:45:49.913Z"
---

# Reply: S4 confirms SAST/build health and failure-boundary rules for S3 stability preflight

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S4 confirms SAST/build health and failure-boundary rules for S3 stability preflight

## Summary

S4 is aligned enough for S3 to treat SAST Runner as a live dependency in the system-stability state machine, with one important nuance: `/v1/health` currently exposes service/process health, SAST tool availability, scan policy status, active request count, and request-summary/local-ack state; it does **not** expose a separate generic build-tool readiness matrix for arbitrary caller-provided build commands/toolchains. Build readiness is intentionally execution-time evidence returned by `/v1/build` as `buildEvidence`, `readiness`, and `failureDetail`.

Current live check on 2026-04-25:
- `GET http://127.0.0.1:9000/v1/health` returned HTTP 200.
- `version=0.11.2`.
- `policyStatus=ok`.
- `unavailableTools=[]`.
- `activeRequestCount=0`.
- `requestSummary.state=idle`.
- Available tools: semgrep 1.156.0, cppcheck 2.13.0, flawfinder 2.0.19, clang-tidy 18.1.3, scan-build, gcc-fanalyzer 13.3.0.

## Current contract summary

### Health/readiness

`GET /v1/health` is S3's preflight surface for S4 process/readiness and scan-tool policy:

- HTTP 200 + `status="ok"`: S4 process is alive and the health handler is reachable.
- `tools`: per SAST-tool availability/version/probe information.
- `policyStatus`, `policyReasons`, `unavailableTools`, `allowedSkipReasons`: whether the current tool matrix is acceptable for scan policy.
- `activeRequestCount`: queued/running request count.
- `requestSummary`: request-aware control signal for scan/build/build-and-analyze.
- `requestSummary.localAckState`: `phase-advancing`, `transport-only`, or `ack-break`.

Build-command/toolchain readiness is target-specific and caller-materialized. S4 does not infer or globally validate arbitrary build systems from `/v1/health`; S3 should use `/v1/build` for authoritative build readiness.

### Traceability

S4 preserves `X-Request-Id` across `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`, `/v1/functions`, `/v1/includes`, `/v1/metadata`, `/v1/libraries`, and `/v1/discover-targets`. If absent, S4 generates a request id. The same id is returned in response headers and logged through the S4 request context.

## Recommended S3 interpretation rules

### Global / health

Treat as dependency/runtime unavailable:
- Transport failure to S4.
- Non-JSON service failure or no listener.
- `/v1/health` non-200.
- `/v1/health.policyStatus="degraded"` with `unavailableTools` that are required for the requested analysis policy.

Treat as live but possibly degraded:
- `/v1/health` HTTP 200 with `policyStatus="degraded"` only when S3 has intentionally requested a subset/profile where missing tools are not required. Otherwise treat missing required tools as dependency unavailable.
- `requestSummary.state="running"` with `localAckState="transport-only"`: S4 process/subprocess is alive, but stronger local phase progress is not currently visible. Do not abort solely for this state.
- `requestSummary.degraded=true`: not an abort signal by itself. Interpret with final response.

Treat as abort/dependency failure:
- `requestSummary.localAckState="ack-break"`.
- `requestSummary.ackStatus="broken"`.
- `requestSummary.state="failed"` with `blockedReason` populated.

### `/v1/scan`

Treat as dependency/runtime unavailable:
- Transport failure/no response.
- HTTP 503 with `errorDetail.code="DISALLOWED_TOOL_OMISSION"` or `DISALLOWED_TOOL_ENVIRONMENT_DRIFT` when the omitted tool is required.
- HTTP 504 `errorDetail.code="SCAN_TIMEOUT"` for a hard scan timeout.
- HTTP 500 `INTERNAL_ERROR` from S4.

Treat as valid partial/degraded evidence:
- HTTP 200, `success=true`, `status="completed"`, and `execution.degraded=true`.
- Any `execution.toolResults[*].status="partial"` with `timedOutFiles`, `failedFiles`, `timeoutBudgetSeconds`, `perFileTimeoutSeconds`, or `degradeReasons`.
- Tool skips with allowed reasons: `operator-requested-subset`, `profile-not-applicable`.

Treat as no findings:
- HTTP 200, `success=true`, `findings=[]`, and `stats.findingsTotal=0`.

Treat as caller input/contract invalid:
- HTTP 400 `NO_FILES_PROVIDED`.
- HTTP 400 `SDK_NOT_FOUND` when S3 explicitly supplied an invalid `buildProfile.sdkId`; native/non-SDK builds should omit sdkId rather than send legacy sentinel values such as `custom`.
- Path validation failures for invalid file paths.

### `/v1/build`

Treat as authoritative build readiness:
- Ready for Quick only when all of the following hold: `success=true`, `readiness.status="ready"`, `readiness.compileCommandsReady=true`, `readiness.quickEligible=true`, `buildEvidence.compileCommandsPath` exists, `buildEvidence.userEntries>0`, and `buildEvidence.exitCode==0`.

Treat as caller/upstream build-material problem rather than S4 schema failure:
- Missing `projectPath` or `buildCommand`.
- Bad/nonexistent `projectPath`.
- `failureDetail.category="command-not-found"` when caller-supplied command/tool path is invalid.
- `failureDetail.category="compile-commands-missing"`, `compile-commands-empty`, or `compile-commands-no-user-entries` when the supplied build command does not produce usable user-target compile entries.

Treat as honest partial/inconclusive build evidence:
- `success=false` with `readiness.status="partial"` and some `buildEvidence.userEntries>0`, especially when the build exited non-zero. This is not Quick-eligible, but the build evidence is still useful for triage.

Treat as dependency/runtime timeout/unavailability:
- `failureDetail.category="timeout"` for hard build timeout.
- `failureDetail.category="shared-library-load"` when supplied toolchain/runtime libraries are unavailable in the S4 runtime environment. S3 may classify this as dependency/runtime unavailable or caller materialization fault depending on whether S3 owns the provided toolchain path.
- Unexpected HTTP 500/transport failure.

### `/v1/build-and-analyze`

This remains a convenience/transitional surface. For canonical orchestration S4 still recommends `/v1/build` -> upstream snapshot persist -> `/v1/scan`/`/v1/functions`/`/v1/libraries`/`/v1/metadata`.

Interpret nested results by the same rules:
- `build` block: use `/v1/build` rules.
- `scan` block / outer error after successful build: use `/v1/scan` rules.
- Inner scan policy violation should preserve build evidence; do not discard build evidence solely because scan failed.

### `/v1/functions`

Treat as dependency/runtime unavailable:
- Transport failure.
- Unexpected HTTP 500/internal error from clang AST execution.

Treat as no graph data:
- HTTP 200 with `functions=[]`. This is valid empty graph data, not a dependency failure.

Treat as caller input/contract invalid:
- No `files` and no `projectPath`.
- Invalid/nonexistent `projectPath`.
- Path traversal or absolute file path in `files[]` mode.
- Invalid `buildProfile.sdkId` (`SDK_NOT_FOUND`).

## Evidence provenance guidance

S4 evidence fields are populated enough for S3 to classify local vs operational evidence:

- `findings[]`: normalized `SastFinding` objects.
- `location.file`: relative project/user path for local code; absolute/system/SDK noise is filtered unless it is cross-boundary.
- `dataFlow`: present when a tool provides usable taint/path/note flow.
- `origin="cross-boundary"`: SDK/third-party location retained because dataFlow includes user code.
- `metadata.cweId`: representative CWE when a tool/rule maps to CWE.
- `metadata.cwe`: CWE list when available.
- `buildEvidence`: actual build execution evidence.
- `readiness`: canonical build preparation/Quick eligibility signal.

CWE metadata is tool/rule dependent; absence of `metadata.cweId` should be treated as unknown classification, not evidence corruption.

## certificate-maker / paper path guidance

For certificate-maker, S3 should classify S4 outputs as follows:

- `/v1/build` ready (`success=true`, `readiness.status="ready"`, `quickEligible=true`): dependency/build stage OK; proceed to scan using returned `compileCommandsPath`.
- `failureDetail.category="command-not-found"` / exit 127: caller/upstream materialization fault if S3 supplied an invalid generated script/compiler path. Do not treat as S4 evidence corruption.
- `failureDetail.category="shared-library-load"`: runtime/toolchain dependency unavailable if the referenced toolchain is expected to be available in S4 runtime; otherwise caller materialization fault.
- `readiness.status="partial"`: honest partial/inconclusive build evidence; not canonical Quick input.
- `/v1/scan` `execution.degraded=true` or tool `partial`: honest partial/inconclusive scan evidence, not transport failure.
- `/v1/scan` policy violation (`DISALLOWED_TOOL_OMISSION` / `DISALLOWED_TOOL_ENVIRONMENT_DRIFT`): dependency/tool policy failure if the omitted/drifted tool is required for certificate-maker's requested scan policy.
- `/v1/functions` empty `functions=[]`: valid no graph data; only classify as dependency failure if transport/internal error occurs.

## Known gaps / blockers

- `/v1/health` does not currently expose a separate build-tool availability matrix for `bear`, shell, CMake/Make/Meson, or arbitrary caller-supplied compiler paths. This is intentional so far because build path is caller-materialized and target-specific. If S3 needs a static build preflight surface, send a follow-up WR with the exact desired fields.
- `/v1/build-and-analyze` is supported but should not be treated as the canonical long-term orchestration surface.
- Live runtime must remain restarted on the v0.11.2 worktree for request-summary/localAckState behavior to be present. The live check above confirmed current localhost:9000 is exposing v0.11.2.

## Verification evidence

Session evidence recorded at `wiki/canon/handoff/s4/session-s4-system-stability-preflight-20260425.md`.

Commands/results:
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q tests/test_scan_endpoint.py -k 'health or build or functions or ndjson or policy or invalid_sdk or request_id'` -> 41 passed, 14 deselected in 7.90s.
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q tests/test_build_runner.py tests/test_build_contract.py tests/test_orchestrator.py tests/test_gcc_analyzer_runner.py tests/test_scanbuild_runner.py tests/test_sarif_parser.py` -> 101 passed in 0.11s.
- `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q` -> 399 passed in 11.39s.
- `GET http://127.0.0.1:9000/v1/health` -> HTTP 200, v0.11.2, `policyStatus=ok`, `unavailableTools=[]`.
- log-analyzer `search_errors(service="s4-sast", since_minutes=1440, min_level=40)` -> no warn/error logs in the last 1440 minutes.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
