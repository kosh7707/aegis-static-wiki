---
title: "S4 Tool Portfolio Governance v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/sast-runner/app/scanner/orchestrator.py"
  - "services/sast-runner/benchmark/tool_portfolio_governance.py"
  - "services/sast-runner/benchmark/tool_output_compat.py"
  - "services/sast-runner/benchmark/benchmark_slice_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_governance.py"
  - "services/sast-runner/tests/test_tool_output_compat.py"
  - "services/sast-runner/tests/test_benchmark_slice_report.py"
  - "services/sast-runner/tests/fixtures/golden_corpus_v1/manifest.json"
last_verified: "2026-05-22"
service_tags: ["s4", "sast-runner", "tool-portfolio", "governance", "static-analysis"]
decision_tags: ["tool-portfolio-governance-v1", "keep-current-six-tools", "golden-corpus-v1", "no-tool-change"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Tool Portfolio Governance v1

Last verified: 2026-05-22
Owner: S4 / SAST Runner
Current decision: `keep-current-six-tools`

Decision: **keep-current-six-tools**

This page defines how S4 decides whether to add, remove, or upgrade deterministic C/C++ SAST tools. It is a governance policy, not a tool-change request. As of 2026-05-22, S4 deliberately keeps the current six tools and focuses on measurement, stability, contract safety, and paper/e2e integration. The first-smoke consumer-context hardening improved projection of existing tool evidence; it did not add, remove, or upgrade tools.

## 1. Current portfolio

| Tool | Role | Unique contribution | Main overlap | Main limitation |
|---|---|---|---|---|
| `semgrep` | Pattern/taint rules | Fast project-specific pattern and taint evidence | dangerous API patterns with flawfinder | rule quality/profile dependent |
| `cppcheck` | C/C++ diagnostics | deterministic C/C++ quality/security checks | clang-tidy/gcc/scan-build general defects | limited exploit context |
| `flawfinder` | Dangerous-function scan | very fast API-risk canary | semgrep dangerous API rules | text/API evidence only |
| `clang-tidy` | CERT/compiler diagnostics | compile-profile and CERT-style checks | cppcheck/scan-build/gcc | compile context dependent |
| `scan-build` | Clang Static Analyzer | path-sensitive Clang signal | gcc-fanalyzer/clang-tidy | timeout/compile-profile sensitive |
| `gcc-fanalyzer` | GCC analyzer | independent GCC path-sensitive signal | scan-build | GCC analyzer availability/profile sensitive |

## 2. Current decision record

```json
{
  "schemaVersion": "s4-tool-portfolio-governance-v1",
  "decision": "keep-current-six-tools",
  "toolSet": ["semgrep", "cppcheck", "flawfinder", "clang-tidy", "scan-build", "gcc-fanalyzer"]
}
```

Rationale:

- The recent S4 고도화 priority was not “add more tools”; it was to ensure S4 can tell consumers what it did, what it did not do, and whether the result is safe to consume.
- No proposed add/remove/upgrade currently has decision-grade failing-before/passing-after corpus evidence.
- Existing current-six tools provide complementary deterministic local evidence classes.
- A portfolio change without stable corpus/readiness/quality gates would recreate the earlier failure mode: confusing system stability with quality.

Rejected for now:

- Immediate new SAST tool adoption — no decision-grade evidence yet.
- Immediate removal of a current tool — unique contribution not sufficiently disproven.
- Quality-claim upgrades — parser compatibility and validation/test deltas must be pinned first.

## 3. Required gates for any future tool change

A future add/remove/upgrade decision must pass all gates below.

| Gate | Required evidence |
|---|---|
| A. Golden Corpus coverage | Golden Corpus or successor manifest validates and covers contract, tool capability, evidence bundle, and vulnerability-family canaries. |
| B. Evidence contract compatibility | `staticEvidenceContract` semantics remain intact: no external vuln knowledge, GraphRAG, runtime behavior, exploitability, final verdict, or negative-evidence projection. |
| C. Parser compatibility | Representative raw output fixture parses into existing S4 normalized evidence without executing external tools. |
| D. Benchmark slice coverage | Historical and current benchmark slices remain distinct by validation/test/canary, source, CWE, variant, and matching policy. |
| E. Unique contribution / overlap accounting | Contribution/overlap/limitations are recorded per tool. |
| F. Runtime and stability budget | Tool liveness, timeout, failure behavior, deterministic parser availability, and resource impact are documented. |
| G. Consumer safety | S3/S5-facing behavior remains safe or is handled by an explicit WR/API contract before rollout. |

## 4. Add/remove/upgrade policy

The current decision does **not** add a new SAST tool.

The current decision does **not** remove or upgrade any current-six tool.

Add a tool only if it provides a deterministic local evidence class not covered by the current six and improves a frozen validation/test artifact without adding network, LLM, external vuln lookup, or final-verdict semantics.

Remove a tool only if golden/benchmark evidence proves its unique contribution is redundant and the removal does not reduce tracked vulnerability-family or evidence-bundle coverage.

Upgrade a tool only if parser compatibility is locked, output-schema changes are covered by fixtures, and any quality claim is backed by an offline validation profile rather than anecdotal examples.

## 5. Machine-readable decision artifact

Future governance runs should emit at least:

```json
{
  "schemaVersion": "s4-tool-portfolio-governance-v1",
  "decision": "keep-current-six-tools | add-tool | remove-tool | upgrade-tool",
  "toolSet": ["semgrep", "cppcheck", "flawfinder", "clang-tidy", "scan-build", "gcc-fanalyzer"],
  "gates": {
    "goldenCorpusCoverage": "pass|fail|blocked",
    "evidenceContractCompatibility": "pass|fail|blocked",
    "parserCompatibility": "pass|fail|blocked",
    "benchmarkSliceCoverage": "pass|fail|blocked",
    "uniqueContributionAccounting": "pass|fail|blocked",
    "runtimeStabilityBudget": "pass|fail|blocked",
    "consumerSafety": "pass|fail|blocked"
  },
  "decisionRecord": {
    "rationale": "...",
    "rejectedAlternatives": [],
    "requiredFollowUps": []
  }
}
```

## 6. Relationship to paper work

For paper experiments, S4's immediate obligation is not tool expansion. The obligation is to provide stable, traceable, deterministic evidence bundles that S3 can consume and that accurately encode S4's limits. Tool portfolio experiments are a later research/measurement axis once the paper e2e smoke and API consumption are stable.

## 7. Verification evidence

Current full S4 verification:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1411 passed, 1 skipped in 36.10s
```

Relevant governance/experiment assets:

- `benchmark/tool_portfolio_governance.py`
- `benchmark/tool_output_compat.py`
- `benchmark/benchmark_slice_report.py`
- `tests/test_tool_portfolio_governance.py`
- `tests/test_tool_output_compat.py`
- `tests/test_benchmark_slice_report.py`
- `tests/fixtures/golden_corpus_v1/manifest.json`

Current status: keep the six tools; do not add/remove/upgrade until a frozen experiment cycle produces decision-grade evidence. The 2026-05-22 S4 changes are projection/consumer-contract hardening over existing evidence, not a portfolio decision.
