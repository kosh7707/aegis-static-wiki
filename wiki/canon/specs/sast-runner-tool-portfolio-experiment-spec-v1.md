---
title: "S4 Tool Portfolio Experiment Spec v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/sast-runner/benchmark/juliet_runner.py"
  - "services/sast-runner/benchmark/compare.py"
  - "services/sast-runner/benchmark/tool_portfolio_actual_runner.py"
  - "services/sast-runner/benchmark/tool_portfolio_report.py"
  - "services/sast-runner/benchmark/tool_portfolio_report_consumer_canary.py"
  - "services/sast-runner/benchmark/tool_portfolio_corpus_manifest.py"
  - "services/sast-runner/benchmark/tool_portfolio_corpus_readiness.py"
  - "services/sast-runner/tests/test_tool_portfolio_report.py"
  - "services/sast-runner/tests/test_tool_portfolio_report_consumer_canary.py"
  - "services/sast-runner/tests/test_tool_portfolio_corpus_readiness.py"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "tool-portfolio", "experiment", "golden-corpus", "quality-gate"]
decision_tags: ["tool-portfolio-experiment-v1", "deterministic-experiment", "validation-test-split", "corpus-readiness", "quality-gate"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Tool Portfolio Experiment Spec v1

Last verified: 2026-05-20
Owner: S4 / SAST Runner
Status: implemented harness + governance baseline; no current add/remove/upgrade decision

This spec defines the experiment protocol S4 must use before claiming that the current six SAST tools are sufficient, insufficient, removable, replaceable, or upgrade-worthy. The protocol is deterministic, local, C/C++ focused, and LLM-free.

## 1. Objective

S4 tool-portfolio experiments answer:

1. What does each current tool detect, miss, and uniquely contribute on ground-truth C/C++ corpora?
2. Which observations are TP/FP/FN/related/unsupported under an explicit oracle and matching policy?
3. How much marginal value does each tool add after overlap and noise are counted?
4. Which parser/ruleset/tool-version changes deserve implementation work?
5. Which S4 evidence boundaries must be exposed to consumers so they do not mistake local static output for final verdicts?

Success is a reproducible report that separates system stability, corpus readiness, validation/test quality metrics, parser compatibility, consumer canary safety, and claim-boundary implications.

## 2. Hard constraints

- No LLM in experiment execution/scoring.
- No S5/GraphRAG/CVE lookup as scoring input.
- No S3 code changes required to run S4 experiment reports.
- No runtime exploitability, affectedness, final verdict, or absence-of-vulnerability claim.
- No immediate new SAST tool adoption without decision-grade evidence.
- Dataset acquisition and experiment scoring are separate phases.
- Validation-set tuning freezes before held-out test execution.
- Empty findings are never negative security evidence.

## 3. Corpus and split model

Every case belongs to one slice and one split.

Slice taxonomy:

| Slice | Purpose |
|---|---|
| `s4-canary` | S4-owned minimal contract/parser/vulnerability-family checks. |
| `juliet-controlled-positive` | Controlled vulnerable C/C++ cases. |
| `juliet-controlled-negative` | Good/negative C/C++ regions for FP/noise discrimination. |
| `sard-focused` | Focused SARD cases outside current Juliet subset. |
| `real-cve-pair` | Vulnerable/fixed real-world pairs after local acquisition pinning. |
| `build-context-required` | Cases where compile context changes evidence. |
| `parser-regression` | Raw parser-output fixtures independent of tool execution. |

Split rules:

| Split | Use |
|---|---|
| `validation` | Harness development, matching-policy tuning, threshold selection. |
| `test` | Held out for final decision-cycle evidence. |
| `canary` | Always-run guard set; never sufficient alone for quality claims. |

A case or vulnerability lineage must not cross validation/test splits. If matching policy changes after a test run, the decision cycle is invalidated and must restart.

## 4. Oracle target granularity

Atomic oracle identity:

```text
caseId + targetId + polarity + CWE/family + region/function/sink/flow metadata
```

Allowed granularities:

- `sink-line`
- `source-sink-flow`
- `function-region`
- `file-region`
- `negative-region`

Negative/good-code cases are region/function-scoped by default. A warning elsewhere in the same file is not automatically a false positive unless it intersects the target region or violates the target's allowed-warning policy.

## 5. Current tracked CWE baseline

The first decision-cycle tracked CWE set is the pinned historical 12-CWE set:

```json
["CWE-78", "CWE-121", "CWE-122", "CWE-134", "CWE-190", "CWE-252", "CWE-369", "CWE-401", "CWE-416", "CWE-457", "CWE-476", "CWE-680"]
```

Additional canaries such as CWE-120 may exist, but they are not part of a portfolio-change decision cycle until the corpus manifest and report baseline explicitly include them.

## 6. Manifest and acquisition rules

Corpus manifest schema:

```text
s4-tool-portfolio-experiment-corpus-v1
```

Acquisition manifest schema:

```text
s4-tool-portfolio-acquisition-v1
```

Required invariants:

- unique safe `caseId`;
- safe `targetId`, `lineageId`, `acquisitionId` when present;
- externally sourced cases have acquisition provenance;
- externally sourced files have exact `sha256:<64 lowercase hex>` checksums;
- `sourcePath` is relative and cannot escape the acquisition root;
- positive cases have expected CWE and location/region metadata;
- negative cases have explicit region and allowed-warning policy;
- forbidden verdict-like keys (`safe`, `clean`, `vulnerable`, `affected`, `riskScore`, `securityVerdict`) fail closed;
- diagnostics are value-free and must not echo host paths, caller tokens, raw parser errors, raw checksums, raw URLs, archive member names, or arbitrary object representations.

Acquisition is allowed to fetch/copy corpus material only in the acquisition phase. Scoring and reporting are offline/local and must not fetch network resources.

## 7. Corpus Readiness Gate

Schema:

```text
s4-tool-portfolio-corpus-readiness-gate-v1
```

Purpose: prove required corpora are present, pinned, split-complete, and readable before S4 calls a report decision-grade.

Key conditions:

- required corpora are explicitly declared;
- each required acquisition is present and validated;
- relative local paths resolve only under explicit base paths;
- case files exist and checksums match;
- required validation and test splits both exist;
- case status diagnostics are sanitized and traceable without leaking raw local values.

A missing or invalid corpus blocks quality evaluation. It does not say anything about S4 runtime stability or vulnerability quality.

## 8. System Stability Gate

Experiment report quality is blocked when required tools did not execute cleanly.

Blocked system-stability report behavior:

```text
systemStabilityGate.status = fail
qualityGate.status = blocked
qualityGate.decision = invalid-precondition
portfolioMetrics.status = blocked
decisionSupport.currentDecision = invalid-precondition
```

This keeps tool-off, timeout, preflight-failed, and partial-run scenarios as machine-readable operational evidence instead of silently producing quality metrics.

## 9. Quality Gate

A report can be decision-grade only when all preconditions pass:

- system stability gate pass;
- corpus readiness gate decision-grade ready;
- validation/test/canary split rules satisfied;
- matching policy schema and semantic validation pass;
- threshold profile is valid and non-discriminating thresholds are rejected;
- current-six contribution rows and diagnostic surfaces are present;
- consumer canary summary remains safe and complete.

Quality metrics may include recall, precision/discrimination, FP/noise, F1-like metrics, overlap, unique contribution, by-CWE summaries, and per-tool/per-config deltas. These are offline validation/test evidence only.

## 10. Consumer canary

Tool portfolio reports expose a consumer-canary summary:

```text
s4-tool-portfolio-report-consumer-summary-v1
```

`toolPortfolioDecisionGradeUsable=true` requires positive gates plus diagnostic completeness, current-six contribution rows, no unsafe projection, no remaining failure reasons, and no required follow-ups.

Malformed containers, unknown enum values, duplicate tool contribution identities, spoofed summary-only diagnostics, unsafe projected identifiers, malformed booleans/scalars/lists, or missing diagnostic surfaces fail closed with `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and `toolPortfolioDecisionGradeUsable=false`.

## 11. Current implementation assets

Primary S4 assets:

- `benchmark/juliet_runner.py`
- `benchmark/compare.py`
- `benchmark/tool_portfolio_actual_runner.py`
- `benchmark/tool_portfolio_report.py`
- `benchmark/tool_portfolio_report_consumer_canary.py`
- `benchmark/tool_portfolio_corpus_acquisition.py`
- `benchmark/tool_portfolio_corpus_manifest.py`
- `benchmark/tool_portfolio_corpus_readiness.py`
- `benchmark/tool_portfolio_system_gate.py`
- `benchmark/tool_output_compat.py`
- `benchmark/benchmark_slice_report.py`

Primary tests:

- `tests/test_tool_portfolio_report.py`
- `tests/test_tool_portfolio_report_consumer_canary.py`
- `tests/test_tool_portfolio_actual_runner.py`
- `tests/test_tool_portfolio_corpus_readiness.py`
- `tests/test_tool_portfolio_corpus_manifest.py`
- `tests/test_tool_portfolio_corpus_acquisition.py`
- `tests/test_juliet_runner.py`
- `tests/test_benchmark.py`
- `tests/test_tool_output_compat.py`

## 12. Current posture and next research use

S4 has enough harness/gate structure to run controlled experiments, but not enough decision-grade evidence to change the tool set. The correct next portfolio work is:

1. pin the exact corpus/profile for the intended paper or follow-up experiment;
2. run validation split and freeze matching/threshold policy;
3. run held-out test split once;
4. emit an experiment report and consumer canary summary;
5. decide whether the report supports keeping, adding, removing, or upgrading tools.

Until that cycle is complete, governance remains `keep-current-six-tools`.

## 13. Verification evidence

Current full S4 verification:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

The full suite includes the current experiment harness, corpus readiness, report, consumer canary, CLI diagnostic, parser compatibility, and system-stability tests. Historical per-hardening proof remains in S4 session history; this page is the current compact protocol.
