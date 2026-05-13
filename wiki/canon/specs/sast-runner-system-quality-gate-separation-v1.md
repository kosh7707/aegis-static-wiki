---
title: "S4 SAST Runner System Stability and Quality Gate Separation v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/sast-runner/app/scanner/orchestrator.py"
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/benchmark/tool_portfolio_system_gate.py"
  - "services/sast-runner/tests/test_tool_portfolio_system_stability_gate.py"
  - "services/sast-runner/tests/test_orchestrator.py"
  - "services/sast-runner/tests/test_scan_endpoint.py"
  - "services/sast-runner/tests/test_semgrep_runner.py"
last_verified: "2026-05-12"
service_tags: ["s4"]
decision_tags: ["system-stability-gate", "quality-gate", "sast-runner", "tool-preflight", "fail-closed"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 SAST Runner System Stability and Quality Gate Separation v1

Status: **implemented**
Owner: **S4 / SAST Runner**
Scope: **deterministic local SAST execution and tool-portfolio experiment reports**

## Purpose

S4 must separate two questions that were previously easy to conflate:

1. **System Stability Gate** — can this SAST execution or experiment artifact be trusted as a complete execution artifact?
2. **Quality Gate** — after system stability passes, what do oracle-backed TP/FP/FN, coverage, unique contribution, and regression metrics say?

A failed System Stability Gate blocks Quality Gate evaluation. Tool quality must not be scored when required tools did not run, timed out, failed, were skipped unexpectedly, or were unavailable because of environment drift.

## Runtime rule

Default `/v1/scan` execution requires the current six S4 tools:

- semgrep
- cppcheck
- flawfinder
- clang-tidy
- scan-build
- gcc-fanalyzer

If any required default tool is unavailable at preflight, S4 fails closed before executing any analyzer. The failed response preserves S3-consumable evidence surfaces:

- HTTP status `503`
- `errorDetail.code="REQUIRED_TOOL_UNAVAILABLE"`
- `execution.toolResults` matrix
- `staticEvidenceContract.gates.systemStability.status="fail"`
- failure log message: `Required SAST tool preflight failed`

After preflight, the authoritative required tool set remains `options.tools` when explicitly provided, otherwise the full current-six portfolio. Every required tool must emit a recorded `toolResults[tool]` with `status="ok"` and `degraded=false`. Missing results, `failed`, `partial`, `skipped`, degraded `ok`, invalid/non-JSON tool output, or unknown status are system-stability failures, not quality findings. Runtime responses fail closed with:

- HTTP status `503`
- `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"`
- `staticEvidenceContract.gates.systemStability.status="fail"`
- `staticEvidenceContract.gates.evidenceReadiness.status="not_ready"`
- `staticEvidenceContract.gates.claimSupportReadiness.status="fail"`

This post-execution check runs before project-level SCA/code-graph enrichment, so an incomplete local SAST execution cannot be hidden by downstream enrichment errors or promoted into quality evaluation.

Unknown `options.tools[]` values are caller input errors, not S4 system instability. They return HTTP `400` with `errorDetail.code="SCAN_TOOL_INVALID"`.

Explicit subsets are still allowed for intentional single-tool or leave-one-out experiments. In that case only the requested tool set is required, and unrequested tools are represented as `operator-requested-subset`. Such results must not be promoted to full-current-six portfolio evidence.

## Semgrep canonical executable rule

Semgrep must be probed and executed through the S4 service-local canonical executable when present:

`services/sast-runner/.venv/bin/semgrep`

PATH fallback is allowed only when the canonical service executable does not exist. This prevents a repeat of the 2026-05-12 environment-drift incident where Semgrep existed in the service venv but was skipped because `semgrep` was not on shell PATH.

## Experiment/report rule

Tool-portfolio reports now expose separate gates:

- `systemStabilityGate`
- `qualityGate`

If `systemStabilityGate.status="fail"`:

- `qualityGate.status="blocked"`
- `qualityGate.decision="invalid-precondition"`
- `validationMetrics`, `testMetrics`, and `canaryMetrics` are `blocked`
- `portfolioMetrics.status="blocked"`
- `decisionSupport.currentDecision="invalid-precondition"`

This blocked report path must still be emitted even if normal current-six `findings_by_config` inputs are absent, so tool-off and preflight-failed runs remain machine-readable evidence instead of disappearing as exceptions.

## Verification evidence

Implementation/test evidence from 2026-05-12:

- Focused new failure/gate tests: `13 passed`
- Combined S4 gate/API/report runner suite: `137 passed in 11.67s`
- Full S4 pytest: `562 passed in 22.74s`
- All-six required-tool focused TDD gate: `83 passed in 0.15s`
- Critic RED reproduction for raw unknown/non-normal report-side statuses: `2 failed` before fix
- System-stability related runner/API suite after report-side unknown/non-normal fix: `210 passed in 13.04s`
- Full S4 pytest after all-six system-stability hardening: `641 passed in 25.79s`
- Intentional preflight failure log test: `5 passed in 1.05s`, with live log `Required SAST tool preflight failed`
- Actual local tool preflight after fix: all six tools available; Semgrep `1.156.0` detected at `services/sast-runner/.venv/bin/semgrep`
- Six-tool local operational battery: `benchmark/results/tool_portfolio/s4-local-six-tool-battery-20260512T045335Z.json`, 8/8 projects OK, all six tools `ok x8`

## Consumer policy

System stability evidence is not security quality evidence. A green System Stability Gate means only that local deterministic tool execution was complete enough to enter quality scoring. It does not imply vulnerability absence, exploitability, affectedness, or final security verdict.
