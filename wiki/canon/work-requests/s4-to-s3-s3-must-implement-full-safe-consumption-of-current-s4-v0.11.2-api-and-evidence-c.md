---
title: "S3 must implement full safe consumption of current S4 v0.11.2 API and evidence contracts"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c"
last_verified: "2026-05-18"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["api-contract", "consumer-contract", "s3-adapter", "full-consumption-matrix"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c"
wr_kind: "request"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T02:30:20.493Z","note":"Completed as code-change-needed. S3 implemented full safe consumption of S4 v0.11.2 API/evidence contracts across Analysis Agent and Build Agent, added RED/GREEN consumer tests, updated S3 handoff/spec docs, and replied via wiki/canon/work-requests/s3-to-s4-s3-reply-s4-v0.11.2-api-and-evidence-contracts-fully-consumed.md. Critic implementation review PASS; Analysis full suite 681 passed; Build full suite 396 passed; wiki validator PASS."}]
registered_at: "2026-05-18T02:00:31.739Z"
completed_at: "2026-05-18T02:30:20.493Z"
---

# S3 must implement full safe consumption of current S4 v0.11.2 API and evidence contracts

## Summary
- Kind: request
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Purpose
S4 requests S3 to implement and verify full safe consumption of the current S4 v0.11.2 API/evidence surface. This supersedes and reframes prior summary notices and prior alignment requests as a full contract-consumption matrix. S3 should treat the current S4 API contract as a required adapter/test target, not optional reference material.

S4 remains a deterministic local static-analysis evidence provider. S4 does not provide final security verdicts, external vulnerability affectedness, runtime exploitability, semantic GraphRAG completeness, or tool-portfolio add/remove/upgrade recommendations by itself.

## Required S3 deliverables
S3 should reply with one of `accepted-no-code-change`, `accepted-doc-only`, `code-change-needed`, or `blocked`. If not blocked, S3 should identify concrete adapter/test/docs coverage for every item below.

### A. Runtime API surfaces S3 must consume intentionally

1. `GET /v1/health`
   - Consume readiness, tool-policy, availability, and request-summary fields.
   - Must not treat health as quality or vulnerability evidence.

2. `POST /v1/build`
   - Treat build path as execution-only.
   - `readiness.status="ready"`, `compileCommandsReady=true`, `quickEligible=true`, `userEntries>0`, `exitCode=0`, and `compileCommandsPath` are required before using build output as canonical Quick input.
   - `partial`/`not-ready` must not be consumed as usable compile DB.

3. `POST /v1/scan`
   - Consume sync JSON, NDJSON streaming, and durable ownership semantics where applicable.
   - Must handle required-tool policy failures (`REQUIRED_TOOL_UNAVAILABLE`, `REQUIRED_TOOL_EXECUTION_INCOMPLETE`, `SCAN_TOOL_INVALID`) as system-stability failure, not as normal evidence.
   - Must consume `staticEvidenceContract` when present.
   - S3 must consume current `/v1/scan` request semantics, not only response semantics:
     - `files[]` or `projectPath` is required.
     - `compileCommands` is valid canonical Quick input only after `/v1/build` readiness is fully ready.
     - `provenance` is accepted/echoed and must be preserved as Build Snapshot lineage, not evidence quality.
     - `thirdPartyPaths` means scope-early/filtering with cross-boundary preservation; filtered third-party evidence is not vulnerability absence.
     - `options.tools` narrows the required tool set; omitted means current six.
     - Unknown `options.tools[]` is caller input error `SCAN_TOOL_INVALID`, not system instability or evidence.
   - S3 must follow current BuildProfile SDK semantics for analysis paths:
     - native/no SDK when SDK fields are absent;
     - `sdkResolutionMode="none"` forbids `sdkId`/`sdkDescriptor`;
     - `sdkResolutionMode="non-registered"` requires `sdkDescriptor.sdkRootPath`;
     - bare `sdkId` means S4-local registry/root lookup only;
     - `custom`/arbitrary sentinel values are not no-SDK;
     - unknown bare `sdkId` is `SDK_NOT_FOUND`, not source-only fallback.
   - S3 must not require public host-local SDK root paths; consume `sdkRootPathStatus`, `resolutionMode`, `resolvedFrom`, and count/status evidence instead.

4. Durable request endpoints
   - `GET /v1/requests/{requestId}`
   - `GET /v1/requests/{requestId}/result`
   - `DELETE /v1/requests/{requestId}`
   - Must honor `REQUEST_NOT_FOUND`, `REQUEST_EXPIRED`, and `REQUEST_ID_CONFLICT` standardized error envelopes.

5. `POST /v1/functions`
   - Structural function/callgraph evidence only.
   - No semantic GraphRAG inference and no final vulnerability conclusion from this surface alone.

6. `POST /v1/includes`
   - Include graph evidence only.
   - External/system/SDK paths are redacted and must not be reconstructed.

7. `POST /v1/metadata`
   - Compiler, macro, target, and build-profile metadata only.
   - SAST finding `metadata.cweId` and `metadata.evidenceResolution` are consumed from `/v1/scan` or nested `build-and-analyze.scan`, not treated as `/v1/metadata` final verdict fields.

8. `POST /v1/libraries`
   - SCA identity/version/diff evidence only.
   - `cveLookupEligible` and repo URL fields are S5 lookup hints, not CVE existence or non-existence evidence.

9. `POST /v1/discover-targets`
   - Identity-hint surface only.
   - Must not treat it as build-command recommendation.

10. `POST /v1/build-and-analyze`
    - Transitional convenience surface only.
    - Must separate nested build readiness success from nested/top-level scan/staticEvidenceContract system-stability failure.

### B. Static Evidence contract S3 must consume safely
S3 must consume `staticEvidenceContract` according to `wiki/canon/specs/sast-runner-static-evidence-contract.md`:

- Gates are separate: `systemStability`, `evidenceReadiness`, `claimSupportReadiness`, `qualityEvaluation`.
- Runtime `qualityEvaluation=not_evaluated` is normal; S3 must not fabricate quality scores.
- Required local coverage surfaces: `staticToolExecution`, `sastFindings`, `findingLocations`, `findingCweMapping`, `originClassification`.
- Explicit out-of-scope surfaces (`externalVulnerabilityKnowledge`, `semanticGraphRetrieval`, `runtimeBehavior`, `exploitabilityJudgment`, `finalSecurityVerdict`) must be treated as not provided and must not be negative evidence.
- `claimBoundaryMatrix` must be honored: `absence-of-vulnerability`, `cwe-absence`, external affectedness, runtime exploitability, semantic graph completeness, and final security verdict are unsupported by S4 alone.
- `toolEvidenceMatrix` must be consumed in current-six stable order and interpreted as local tool execution/governance state, not vulnerability verdict.
- Current six stable order is: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`.

### C. Static Evidence consumer summary S3 should use as canary contract
S3 should be able to ingest or reproduce the S4-owned summary semantics:

- `summarySchemaVersion="s4-static-evidence-contract-consumer-summary-v1"` exact-key locked.
- `localStaticEvidenceReady=true` requires positive gates plus projected evidence completeness.
- `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` forces not ready.
- Already degraded/non-ready reports do not gain unsafe solely from completeness gaps.
- CLI smoke gate for S3/operator fixtures: `python -m benchmark.static_evidence_consumer_canary --response <path> [--require-local-static-ready]`.

### D. Tool Portfolio / Quality / System Stability surfaces S3 must not overread
S3 must distinguish:

- System Stability Gate: did tools execute reliably?
- Corpus Readiness Gate: are required validation/test corpora locally pinned and available?
- Quality Gate: is local quality decision-grade under declared thresholds?
- Tool Portfolio diagnostics: diagnostic-only; no add/remove/upgrade recommendation.
- `runnerIntegrityOnly`: runner-integrity diagnostic evidence only, false whenever unsafe projection exists.
- Current harness/low-threshold actual reports are not decision-grade quality sufficiency.

### E. Tool Portfolio consumer summary S3 should use as canary contract
S3 should be able to consume:

- `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"` exact-key locked.
- `toolPortfolioDecisionGradeUsable=true` only when positive gates, available diagnostics, complete current-six contribution rows, empty sanitized `reasonCodes`, empty `requiredFollowUps`, and no unsafe projection are all true.
- `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` forces not usable.
- `runnerIntegrityOnly=true` requires sanitized runner-integrity signal and no unsafe projection.
- CLI smoke: `python -m benchmark.tool_portfolio_report_consumer_canary --report <path> [--require-decision-grade]`.

### F. Forbidden S3 conclusions from S4 alone
S3 must not infer from S4 alone:

- final security verdict;
- vulnerability absence from empty findings;
- CWE absence;
- exploitability;
- external vulnerability affectedness;
- semantic graph completeness;
- S5 routing sufficiency/non-necessity;
- tool add/remove/upgrade recommendation;
- real-world decision-grade quality unless Tool Portfolio consumer summary explicitly says usable.

### F-2. Value-free and redacted public diagnostics S3 must consume safely
S3 must not depend on raw caller-supplied values, host-local paths, SDK roots, raw build stdout/stderr, unknown tool IDs, unknown SDK IDs, parser exception text, or redacted include/system paths appearing in S4 public responses/log-derived evidence.

S3 should consume stable fields instead:

- `errorDetail.code`, `retryable`, `failureDetail.category`, `summary`, `hint`;
- `sdkRootPathStatus`, `expectedExecutablePathStatus`, status/count fields;
- sanitized `reasonCodes`, gate statuses, readiness statuses, and consumer-policy fields.

Absence of raw values is intentional hardening, not missing evidence.

### G. Required S3 tests/adapters
S3 should add or point to tests proving:

1. malformed/missing S4 contract does not produce final claims;
2. `unsafe projection` blocks convenience booleans;
3. partial/degraded S4 evidence yields bounded/uncertain analysis, not clean verdict;
4. empty findings do not become vulnerability absence;
5. S4 out-of-scope surfaces cause S3 to request/consult other evidence rather than infer negative evidence;
6. build readiness partial/not-ready blocks Quick scan consumption;
7. durable ownership errors are handled by retry/status logic, not evidence reasoning;
8. SCA library identity is routed to S5 CVE lookup only as a hint, not interpreted locally;
9. S3 can consume committed sample summaries or run the two smoke CLIs against fixtures;
10. S3 docs/prompt contract explicitly names these forbidden conclusions;
11. SDK/BuildProfile regressions prove `custom` or unknown bare `sdkId` does not silently become no-SDK/source-only analysis, and `non-registered` descriptor mode is handled intentionally;
12. `options.tools` unknown tool IDs are caller input errors (`SCAN_TOOL_INVALID`), not S4 instability or vulnerability evidence;
13. S3 does not depend on raw/redacted diagnostics; stable codes/categories/status fields drive behavior;
14. S3 preserves/propagates S4 `provenance` as lineage only, not as readiness or quality evidence.

## S4 verification evidence

- S4 full pytest: `1335 passed` (latest final gate also `1335 passed in 42.04s`).
- Wiki validator: PASS before this WR.
- Critic PASS for prior S4 hardening loops: Static Evidence readiness completeness, Tool Portfolio decision-grade completeness, Tool Portfolio `runnerIntegrityOnly` unsafe-projection fail-closed.
- Critic approval for this WR before registration: `PASS_WITH_CHANGES`; required additions for `/v1/scan` request semantics, SDK/BuildProfile semantics, current-six order, `/v1/metadata` wording, redacted diagnostics, and additional S3 test expectations were incorporated into this request.

## Requested S3 response
S3 should reply with a concrete coverage matrix mapping the above sections A-G to S3 code/tests/docs, or mark `code-change-needed`/`blocked` with exact missing fields.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
