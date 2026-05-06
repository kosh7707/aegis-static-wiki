---
title: "Non-dynamic full-pipeline API contract audit — 2026-05-04"
page_type: "context-audit"
canonical: false
source_refs:
  - "services/frontend/src/common/api/source.ts"
  - "services/frontend/src/common/api/analysis.ts"
  - "services/frontend/src/common/api/pipeline.ts"
  - "services/frontend/src/common/api/sdk.ts"
  - "services/frontend/src/common/api/core.ts"
  - "services/backend/src/controllers/project-source.controller.ts"
  - "services/backend/src/controllers/analysis.controller.ts"
  - "services/backend/src/controllers/pipeline.controller.ts"
  - "services/backend/src/controllers/build-target.controller.ts"
  - "services/backend/src/controllers/sdk.controller.ts"
  - "services/backend/src/services/agent-client.ts"
  - "services/backend/src/services/build-agent-client.ts"
  - "services/backend/src/services/sast-client.ts"
  - "services/backend/src/services/kb-client.ts"
  - "services/backend/src/services/analysis-orchestrator.ts"
  - "services/backend/src/services/pipeline-orchestrator.ts"
  - "services/backend/src/services/llm-task-client.ts"
  - "services/shared/src/models.ts"
  - "services/shared/src/dto.ts"
  - "services/shared/src/llm-sampling.ts"
  - "services/sast-runner/app/schemas/request.py"
  - "services/sast-runner/app/schemas/response.py"
  - "services/sast-runner/app/routers/scan.py"
  - "services/knowledge-base/app/routers/code_graph_api.py"
  - "services/llm-gateway/app/routers/tasks.py"
  - "services/llm-gateway/app/schemas/request.py"
last_verified: "2026-05-04"
service_tags: ["s1", "s2", "s3", "s4", "s5", "s7", "pipeline"]
decision_tags: ["api-contract", "non-dynamic-pipeline", "audit", "no-code-change"]
related_pages: ["wiki/context/project/end-to-end-scenarios.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/api/llm-gateway-api.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md", "wiki/canon/specs/shared-models.md"]
---

# Non-dynamic full-pipeline API contract audit — 2026-05-04

## Scope

User request: verify whether service-to-service API contracts are practically aligned across the AEGIS full pipeline, excluding dynamic analysis, and write a report without product-code edits.

Included path:

```text
S1 upload/source UI
  → S2 backend/project source + build target + SDK + pipeline/analysis controllers
  → S3 Build Agent public contract (contract-level only)
  → S4 SAST Runner build/scan/discover/libraries
  → S5 Knowledge Base code-graph ingest/readiness
  → S3 Analysis Agent public contract (contract-level only)
  → S7 LLM Gateway contract and gateway-side enforcement
  → S1 results/progress surfaces
```

Excluded:
- dynamic analysis, dynamic testing, adapter, ECU/CAN runtime paths;
- S3 implementation internals, because S3 is currently being modified. For S3, this audit used public API contracts plus S2 caller behavior only.

No product code was intentionally edited for this audit. The AEGIS working tree already had in-progress edits before this report, especially under S3 and S2 caller/client files.

## Verification performed

| Evidence | Result |
|---|---|
| Canonical wiki/API docs reviewed | `analysis-agent-api`, `build-agent-api`, `sast-runner-api`, `knowledge-base-api`, `llm-gateway-api`, shared models, end-to-end scenarios, and the 2026-05-03 `tool_choice="required"` decision. |
| S2/S1/S4/S5/S7 code inspection | Relevant frontend API modules, backend controllers/clients/orchestrators, shared DTO/model types, SAST schemas, KB code-graph routes, and S7 gateway request validation were inspected. |
| `npm test -- src/__tests__/contract/client-contract.test.ts src/services/__tests__/pipeline-orchestrator.test.ts src/services/__tests__/analysis-orchestrator.test.ts src/services/__tests__/llm-task-client.test.ts` in `services/backend` | 4 files / 72 tests passed. |
| `npm test -- src/common/api/client.test.ts src/common/hooks/useAnalysisWebSocket.test.ts src/common/hooks/usePipelineProgress.test.ts src/common/hooks/useUploadProgress.test.ts src/common/hooks/useSdkProgress.test.ts` in `services/frontend` | 5 files / 49 tests passed. |
| `.venv/bin/python -m pytest tests/test_contract_input_validation.py tests/test_real_client_generation_controls.py -q` in `services/llm-gateway` | 53 tests passed. |
| `.venv/bin/python -m pytest tests/test_scan_endpoint.py -q -k "build_endpoint or discover_targets or scan_with_compile_commands or build_readiness or sdk"` in `services/sast-runner` | 10 tests passed. |
| `.venv/bin/python -m pytest tests/test_api_contract.py::TestCodeGraphIngestContract tests/test_api_contract.py::TestCodeGraphStatsContract tests/test_api_contract.py::TestReadyContract tests/test_api_contract.py::TestTimeoutHeaderEnforcement -q` in `services/knowledge-base` | 20 tests passed. |
| `npm run build -w @aegis/shared && npm run build -w @aegis/backend` | Passed. |
| `npm run typecheck` in `services/frontend` | Passed. |

## Contract matrix

| Seam | Contract status | Evidence |
|---|---|---|
| S1 → S2 source upload | Mostly aligned. Archive/file upload uses `POST /api/projects/:pid/source/upload` with FormData field `file`; backend returns `202` with `uploadId/status`, and WS/polling status uses shared upload event types. | `source.ts:69-78`, `project-source.controller.ts:49-72`, `dto.ts:431-486` |
| S1 → S2 Git clone | **Drift found.** Frontend sends `{url, branch}` but backend requires `{gitUrl, branch}`. | `source.ts:80-89`, `project-source.controller.ts:83-98` |
| S1 → S2 BuildTarget discovery/create/pipeline | Aligned for canonical target-scoped flow. `discoverBuildTargets`, `runPipeline`, and `runPipelineTarget` call the backend routes that invoke S4/S2 pipeline orchestration. | `pipeline.ts:11-166`, `build-target.controller.ts:111-138`, `pipeline.controller.ts:24-156` |
| S1 → S2 explicit Quick/Deep | Aligned for explicit target-scoped Quick and execution-scoped Deep. Backend rejects legacy fields (`mode`, `targetIds`, `quickAnalysisId`) and requires `projectId`, `buildTargetId`, `executionId` where appropriate. | `analysis.ts:48-65`, `analysis.controller.ts:27-105`, `analysis-orchestrator.ts:1031-1080` |
| S1/S2 → S2 SDK registration | Mostly aligned. Upload API uses FormData `name`, optional `description`, repeated `file`, and optional repeated `relativePath`; backend registers asynchronously and returns `202` with SDK record. | `sdk.ts:101-124`, `sdk.controller.ts:341-403`, `sdk.service.ts` |
| S2 → S3 Build Agent | Aligned at caller-contract level. S2 sends `taskType=build-resolve`, `contractVersion=build-resolve-v1`, `strictMode=true`, trusted target fields, and `constraints.timeoutMs`; pipeline treats `completed` as an envelope and fails domain-level non-clean results. | `pipeline-orchestrator.ts:321-397`, `build-agent-client.ts:27-44,232-242` |
| S2 → S4 build | Aligned. S2 `/v1/build` request sends only `projectPath` and `buildCommand`; S4 build schema forbids extra fields and returns readiness. S2 requires `success`, readiness `ready`, `compileCommandsReady`, `quickEligible`, compile commands path, user entries, and exit code. | `pipeline-orchestrator.ts:456-481`, `sast-client.ts:193-284`, `sast-runner/app/schemas/request.py:59-67`, `sast-runner/app/schemas/response.py:163-179` |
| S2 → S4 scan/libraries/discover | Aligned. Scan uses `projectPath`, `compileCommands`, `buildProfile`, and optional `thirdPartyPaths`; custom SDK sentinel is stripped before S4. S4 accepts camelCase aliases. | `sast-client.ts:20-47,154-190,286-328`, `sast-runner/app/schemas/request.py:44-56` |
| S2 → S5 code-graph ingest/readiness | Aligned. S2 sends mandatory `X-Timeout-Ms` and `X-Request-Id`, transforms S4 functions/edges into KB payload, and treats only `status=ready && readiness.graphRag=true` as ready. | `kb-client.ts:61-108`, `pipeline-orchestrator.ts:237-301`, `analysis-orchestrator.ts:478-514`, `knowledge-base/app/routers/code_graph_api.py:143-287` |
| S2 → S3 Analysis Agent deep-analyze | Aligned at public-contract level. S2 uses optional S3 generation overrides, passes Quick/Graph/SCA context, and preserves `analysisOutcome`, `qualityOutcome`, `pocOutcome`, diagnostics, and clean-pass semantics in results/WS. | `agent-client.ts:39-85,97-128`, `analysis-orchestrator.ts:164-181,612-637,684-724,827-928`, `models.ts:79-148`, `dto.ts:385-401` |
| S2 → S3 Analysis Agent generate-poc | **Drift found.** Backend returns success if `status=completed` and `claims.length>0`, but does not inspect or expose `pocOutcome`, `qualityOutcome`, or `cleanPass`. Clean PoC pass in the S3 contract requires `pocOutcome=poc_accepted`, `qualityOutcome=accepted`, and `cleanPass=true`. | `analysis-agent-api.md` outcome semantics; `analysis.controller.ts:296-349` |
| S2 direct → S7 `/v1/tasks` | Low current static-pipeline usage. The client now fills the full required camelCase generation tuple, and tests cover this. Actual S2 direct callers found are dynamic-analysis/dynamic-test paths, which are excluded from this audit. | `llm-task-client.ts:15-19,278-290`, `llm-sampling.ts:27-36`, `llm-task-client.test.ts` |
| S3 → S7 `/v1/chat` | **Contract-only / open risk.** S7 enforces required generation controls, but the 2026-05-03 `tool_choice="required"` blocker prescriptions are not fully reflected in current S7 code/canonical API: gateway still forwards `tool_choice` values without rejecting `required`, and no response validator was found for `finish_reason="tool_calls"` with empty `tool_calls`. S3 implementation was not audited per user constraint. | `llm-gateway-api.md`, `wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md`, `tasks.py:177-189,821-838,919-924,1027-1085` |
| S8 Container Gateway | Out-of-main-pipeline. The current canon describes a document-only future S2 seam (`import-from-path`); no current non-dynamic full-pipeline dependency was identified. | `container-gateway-api.md` (reviewed earlier in the session) |

## Findings

### F1 — S1/S2 Git clone request body mismatch

- **Severity**: Medium.
- **Affected seam**: S1 frontend → S2 source controller.
- **Evidence**:
  - Frontend `cloneSource(projectId, url, branch)` serializes `JSON.stringify({ url, branch })` (`services/frontend/src/common/api/source.ts:80-89`).
  - Backend `POST /api/projects/:pid/source/clone` destructures `{ gitUrl, branch }` and rejects if `gitUrl` is missing (`services/backend/src/controllers/project-source.controller.ts:83-98`).
- **Impact**: Git clone source acquisition from the UI fails with `gitUrl is required`. Archive/file upload is not affected.
- **Existing test gap**: Frontend API tests do not cover `cloneSource`; backend contract tests cover `{ gitUrl }`, so the cross-client mismatch is not caught.
- **Recommended action**: Align the frontend request body to `{ gitUrl, branch }` or add backend compatibility for `{ url }`, and add a frontend/client contract test.

### F2 — S2 PoC facade ignores S3 result-level clean-PoC outcomes

- **Severity**: Medium/high for triage accuracy.
- **Affected seam**: S2 backend `POST /api/analysis/poc` → S3 Analysis Agent `generate-poc`.
- **Evidence**:
  - Canonical S3 contract states `completed` is not clean success; clean PoC pass is `completed + pocOutcome=poc_accepted + qualityOutcome=accepted + cleanPass=true`.
  - S2 PoC controller calls `agentClient.submitTask({ taskType: "generate-poc", ... })`, then if `agentClient.isSuccess(agentResponse)` and `claims.length > 0`, returns `{ success: true, data: { findingId, poc, audit } }` without checking `pocOutcome`, `qualityOutcome`, `cleanPass`, or diagnostics (`services/backend/src/controllers/analysis.controller.ts:296-349`).
- **Impact**: A completed-but-rejected/inconclusive PoC envelope can be presented as ordinary success if any claim is present; callers/UI cannot distinguish `poc_rejected`, `poc_inconclusive`, or `repair_exhausted` from `poc_accepted`.
- **Recommended action**: Keep `completed` as transport/envelope success but include/result-gate `pocOutcome`, `qualityOutcome`, `cleanPass`, and possibly `claimDiagnostics` in the S2 response. Treat non-clean PoC as review-needed rather than clean success.

### F3 — S7 `tool_choice="required"` blocker guard is not fully enforced at the gateway/canonical API surface

- **Severity**: High / known production blocker, scoped mainly to S3→S7 tool-call turns.
- **Affected seam**: S3 agents → S7 `/v1/chat`; S7 → LLM Engine.
- **Evidence**:
  - Context decision `wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md` records a production blocker where `tool_choice="required"` with Qwen3 reasoning/parser/MTP returns `finish_reason="tool_calls"` and empty `tool_calls`.
  - Current canonical `llm-gateway-api.md` examples still show `tool_choice="auto"` but do not yet codify the decision table that rejects `required`/named values.
  - Current S7 `chat_proxy` validates required generation controls (`tasks.py:821-838`) and then forwards `body` to the LLM engine (`tasks.py:919-924`); `_prepare_chat_forward` copies request body and only applies strict JSON controls (`tasks.py:177-189`). No gateway request-side `tool_choice` allowlist or response-side `finish_reason/tool_calls` consistency validator was found in inspected code.
  - Non-S3 grep found no active non-dynamic caller sending `tool_choice="required"`; S3 implementation was intentionally not audited.
- **Impact**: If S3 (or any future caller) sends `required`, the gateway can still pass the known-bad value through. If vLLM returns an inconsistent tool-call envelope, S7 still appears to transparent-forward it.
- **Recommended action**: Implement the decision's S7-A/S7-A-2 prescriptions: reject unsupported request-side tool choice values (`auto`/`none` only), add response contract validation for `finish_reason="tool_calls"` with empty `tool_calls`, and update canonical `llm-gateway-api.md` / `llm-engine.md` with the explicit tool-choice support table.

### F4 — S3 implementation status remains intentionally unverified

- **Severity**: Audit limitation, not a direct defect.
- **Reason**: User explicitly requested S3 API contract-only because S3 is under active modification.
- **Observed state**: Git status shows many modified S3 files and S2/S3 contract-adjacent files. The report should not be read as implementation sign-off for S3 internals.
- **Recommended action**: After S3 stabilizes, run a focused follow-up on S3→S4/S5/S7 runtime callers, especially generation control serialization, `tool_choice`, accepted-only claims, PoC outcomes, and `completed` vs clean-pass behavior.

## Positive confirmations

- Request ID propagation is consistent from S1/S2 into downstream clients: frontend `apiFetch` creates `X-Request-Id`, backend middleware preserves/creates `req.requestId`, and S2 clients pass it to S3/S4/S5/S7 health/task calls.
- S2→S3 Build Agent caller uses the strict build-resolve contract fields and domain-clean gating; tests cover `cleanPass=false` as a build-domain failure.
- S4 build readiness is no longer inferred from `success` alone. S2 requires explicit readiness fields when present.
- S5 code-graph readiness is not inferred from `/v1/ready`; S2 uses the ingest response `status + readiness.graphRag` as canonical.
- S2 deep-analysis result shaping preserves S3 result-level outcome fields and broadcasts `cleanPass` to S1.
- S7 generation-control enforcement is present for both `/v1/chat`/async snake_case controls and `/v1/tasks.constraints.*` camelCase controls; targeted gateway tests passed.

## Suggested follow-up order

1. Fix F1 (`cloneSource` body) because it is a simple S1/S2 API mismatch and should have a small regression test.
2. Fix F2 so PoC UX/API cannot claim clean success from a non-clean S3 completed envelope.
3. Treat F3 as a cross-lane S7/S3 blocker follow-up: update S7 gateway enforcement + canonical API docs, then verify S3 no longer sends unsupported `tool_choice` values.
4. Re-run this audit's targeted test set plus an S3-stabilized contract/E2E spot test.
