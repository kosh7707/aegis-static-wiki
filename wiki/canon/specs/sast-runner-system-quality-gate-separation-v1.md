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
  - "services/sast-runner/tests/test_paper_static_evidence.py"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "system-stability", "quality-gate", "tool-preflight"]
decision_tags: ["system-stability-gate", "quality-gate", "tool-preflight", "fail-closed", "current-six-tools"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 SAST Runner System Stability and Quality Gate Separation v1

Last verified: 2026-05-20
Owner: S4 / SAST Runner
Status: implemented

## 1. Principle

S4 separates three different questions that must never be collapsed:

1. **System Stability Gate** — did the required local tools/steps run completely enough to trust this as an execution artifact?
2. **Evidence/Producer Contract Gate** — did S4 describe emitted evidence, missing evidence, diagnostics, traces, and claim boundaries safely enough for consumers?
3. **Quality Gate** — after stable execution and a frozen oracle/corpus profile, what do recall/precision/noise/coverage metrics say?

A failed System Stability Gate blocks quality scoring. A produced paper/static-evidence bundle with bounded diagnostics can still be consumable if its contract is valid and it honestly says what was not produced. Neither gate is a vulnerability verdict.

## 2. Runtime system-stability rule

Default `/v1/scan` execution requires the current six tools:

```text
semgrep
cppcheck
flawfinder
clang-tidy
scan-build
gcc-fanalyzer
```

Preflight failure returns a system-stability failure before analyzer execution:

```text
HTTP 503
errorDetail.code = REQUIRED_TOOL_UNAVAILABLE
staticEvidenceContract.gates.systemStability.status = fail
```

Post-execution failure returns a system-stability failure when any required tool is missing, failed, partial, skipped unexpectedly, degraded, invalid, or unknown:

```text
HTTP 503
errorDetail.code = REQUIRED_TOOL_EXECUTION_INCOMPLETE
staticEvidenceContract.gates.systemStability.status = fail
staticEvidenceContract.gates.evidenceReadiness.status = not_ready
staticEvidenceContract.gates.claimSupportReadiness.status = fail
```

Unknown `options.tools[]` values are caller input errors, not S4 system instability:

```text
HTTP 400
errorDetail.code = SCAN_TOOL_INVALID
```

Explicit subsets are allowed only as intentional subset experiments. A subset artifact must not be promoted to full current-six evidence.

## 3. Paper producer gate rule

For `POST /v1/paper/static-evidence`, S4 additionally separates:

- **bundle consumability**: `success=true` and `bundleStatus=produced`;
- **per-surface status**: `produced`, `empty`, `partial`, `failed`, `not_available`, `skipped`, `error`;
- **producer diagnostics**: sanitized `diagnostics[]` plus `diagnosticRefs[]`;
- **paper freeze gate**: whether S4's producer contract has executable validation coverage.

Current state:

```text
S4_STATIC_EVIDENCE_FREEZE_GATE = pass
```

This gate means S4's paper producer boundary is validated. It does not mean S3 paper export is ready, S5 context is ready, or the code under analysis is secure.

## 4. Offline quality gate rule

Quality evaluation requires a named validation/test/canary profile. Runtime S4 must not invent quality scores.

If `systemStabilityGate.status="fail"` in a tool-portfolio report:

- `qualityGate.status="blocked"`
- `qualityGate.decision="invalid-precondition"`
- validation/test/canary metrics are blocked
- decision support remains diagnostic, not a tool-quality claim

If system stability passes but the corpus/readiness profile is not decision-grade, quality remains blocked/not decision-grade. S4 must not use a one-off run or a missing corpus as a portfolio-change basis.

## 5. Semgrep executable lesson

Semgrep is probed and executed through the service-local canonical executable when present:

```text
services/sast-runner/.venv/bin/semgrep
```

PATH fallback is allowed only if the service-local executable is absent. This rule exists because prior work proved that a tool can be installed but silently missed if only shell PATH is checked.

## 6. Consumer policy

Consumers may use a passing System Stability Gate as a precondition for considering S4 local evidence. They must not use it as:

- no-vulnerability evidence;
- exploitability/affectedness evidence;
- final verdict;
- S5/GraphRAG sufficiency;
- evidence that all static tools are globally adequate.

Quality reports may support tool/governance decisions only when system stability, corpus readiness, oracle split, threshold policy, and consumer canary checks all pass for that decision cycle.

## 7. Verification evidence

Current verification for this document refresh:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

Relevant suites:

- `tests/test_tool_portfolio_system_stability_gate.py`
- `tests/test_orchestrator.py`
- `tests/test_scan_endpoint.py`
- `tests/test_static_evidence_contract.py`
- `tests/test_paper_static_evidence.py`
- `tests/test_tool_portfolio_report_consumer_canary.py`

Prior focused hardening remains documented in session history, but the current source of truth is this split: system stability gates tool execution, producer validation gates contract safety, and offline quality gates benchmark/oracle claims.
