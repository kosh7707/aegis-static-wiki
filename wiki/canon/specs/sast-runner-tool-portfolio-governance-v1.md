---
title: "S4 Tool Portfolio Governance v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - ".omx/plans/s4-static-evidence-enhancement-plan-v1.md"
  - "services/sast-runner/tests/fixtures/golden_corpus_v1/manifest.json"
last_verified: "2026-05-11"
service_tags: ["s4"]
decision_tags: ["tool-portfolio-governance-v1", "sast-runner", "golden-corpus-v1"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Tool Portfolio Governance v1

Status: **governance baseline, no tool-set change**  
Owner: **S4 / SAST Runner**  
Scope: current deterministic C/C++ static-analysis tool portfolio.

This page defines how S4 decides whether the current six-tool portfolio is sufficient, and how future add/remove/upgrade decisions must be evaluated. It does **not** add a new SAST tool and does **not** remove or upgrade an existing tool.

---

## 1. Current portfolio is intentionally unchanged

Current S4 C/C++ SAST portfolio:

| Tool | Role | Unique contribution | Key overlap | Main limitation |
|---|---|---|---|---|
| Semgrep | Pattern + taint rules | Fast rule-authoring surface and project-specific taint patterns | overlaps with flawfinder on dangerous API patterns | coverage depends on ruleset quality |
| Cppcheck | C/C++ static diagnostics + CTU | deterministic C/C++ quality/security checks with original profile | overlaps with clang-tidy/gcc analyzer on general defects | may lack deep path-sensitive exploit context |
| Flawfinder | Dangerous-function text scan | very fast API-risk canary and broad dangerous-call visibility | overlaps with semgrep dangerous API rules | text evidence only; not semantic proof |
| clang-tidy | CERT/static compiler diagnostics | compile-profile checks and CERT-style diagnostics | overlaps with cppcheck/scan-build/gcc analyzer | compile profile quality affects coverage |
| scan-build | Clang Static Analyzer | path-sensitive Clang analyzer diagnostics | overlaps with clang-tidy/gcc analyzer on compiler-backed findings | can be partial under timeout/compile limits |
| gcc-fanalyzer | GCC path-sensitive analyzer | independent GCC analyzer signal and warning taxonomy | overlaps with scan-build on path-sensitive bugs | requires GCC analyzer availability and suitable profile |

The portfolio remains six tools until a future governance run proves that a change improves validated evidence coverage without violating S4 determinism or runtime stability.

---

## 2. Decision gates

A future tool add/remove/upgrade decision must pass all gates below.

### Gate A — Golden Corpus coverage

The proposed change must run against Golden Corpus v1 or a successor manifest with at least the four S3-required layers:

1. contract oracle cases;
2. six-tool capability oracles, updated for the proposed portfolio;
3. evidence bundle corpus;
4. vulnerability-family canaries.

A change may not be proposed if the manifest itself fails validation.

### Gate B — Evidence contract compatibility

The change must preserve `staticEvidenceContract` semantics:

- no external vulnerability knowledge in S4;
- no semantic GraphRAG/retrieval claims;
- no runtime behavior claims;
- no exploitability judgment;
- no final security verdict;
- empty/missing evidence is never negative security evidence.

### Gate C — Parser compatibility

For every current or proposed tool output shape, S4 must have parser compatibility fixtures that prove representative raw tool output still normalizes into `SastFinding` fields without tool execution. The current six-tool oracle is `services/sast-runner/tests/fixtures/tool_output_compat_v1/manifest.json` and covers Semgrep SARIF, Cppcheck XML, Flawfinder CSV, clang-tidy text, scan-build plist, and gcc-fanalyzer text.

This gate is a prerequisite for upgrade claims. It does not by itself prove recall/precision/noise improvement.

### Gate D — Benchmark slice coverage

S4 must keep source-scoped historical benchmark slices before any add/remove/upgrade quality claim. Current required artifacts are exactly:

- `benchmark/data/baselines/v0.6.0-full.json` — Juliet variant `01`, 12 CWEs, recall/precision/FP/F1 metrics;
- `benchmark/data/baselines/v0.7.0-all-variants.json` — Juliet `all` variants, 12 CWEs, recall/noise/noisePerFile metrics.

`benchmark/benchmark_slice_report.py` emits `s4-benchmark-slice-report-v1` and keeps `variant01` and `allVariants` metrics separate. This evidence is offline quality evidence only and uses `consumerPolicy=benchmark_quality_evidence_not_runtime_verdict`.

### Gate E — Unique contribution / overlap accounting

For every tool, governance must record:

- role;
- unique evidence contribution;
- overlap with existing tools;
- limitations and known non-evidence;
- whether a loss/addition affects S3-readable deterministic evidence.

### Gate F — Runtime and stability budget

A tool change must document runtime impact, failure/skip behavior, deterministic parser availability, and omission policy effects. A tool cannot be added if it requires network access, non-deterministic remote services, LLM interpretation, or external vulnerability lookup.

### Gate G — Consumer safety

The change must not require S3/S5 API changes for first-order S4 evidence consumption. New consumer behavior requires a separate WR and must be represented by a contract oracle before rollout.

---

## 3. Add / remove / upgrade policy

### Add a tool only if

- it provides a new deterministic local evidence class not covered by the current six tools;
- Golden Corpus v1 or successor gains at least one failing-before/passing-after canary or evidence bundle case;
- runtime stability and omission semantics are documented;
- parser output can be normalized into existing S4 evidence contracts without verdict fields.

### Remove a tool only if

- its unique contribution is proven redundant by Golden Corpus evidence and historical benchmark slices;
- removing it does not reduce required coverage for any tracked vulnerability family or evidence bundle;
- omission policy and consumer semantics remain simpler or unchanged.

### Upgrade a tool only if

- parser/schema changes are locked by oracle fixtures;
- Golden Corpus and relevant regression suites pass;
- any recall/precision/noise claim is backed by a validation report profile rather than anecdotal examples.

---

## 4. Minimum machine-readable governance artifact

Any future portfolio decision should include:

```json
{
  "schemaVersion": "s4-tool-portfolio-governance-v1",
  "decision": "keep-current-six-tools | add-tool | remove-tool | upgrade-tool",
  "toolSet": ["semgrep", "cppcheck", "flawfinder", "clang-tidy", "scan-build", "gcc-fanalyzer"],
  "goldenCorpusProfile": "golden-corpus-v1",
  "gates": {
    "goldenCorpusCoverage": "pass",
    "evidenceContractCompatibility": "pass",
    "parserCompatibility": "pass",
    "benchmarkSliceCoverage": "pass",
    "uniqueContributionAccounting": "pass",
    "runtimeStabilityBudget": "pass",
    "consumerSafety": "pass"
  },
  "decisionRecord": {
    "rationale": "...",
    "rejectedAlternatives": [],
    "requiredFollowUps": []
  }
}
```

The current decision is `keep-current-six-tools`.

---

## 5. Current decision record

Decision: **keep-current-six-tools**.

Rationale:

- The first S4 고도화 pass intentionally excluded new SAST tool introduction.
- The priority was to create strict validation, coverage, readiness, and golden/oracle infrastructure before changing tool composition.
- The current six tools cover complementary deterministic evidence surfaces: pattern/taint, C/C++ diagnostics, dangerous API canary, compiler-backed checks, Clang path-sensitive diagnostics, and GCC path-sensitive diagnostics.
- Golden Corpus v1 now exists as the minimum precondition for future add/remove/upgrade evaluation, but it is representative/skeleton-level and not yet sufficient to claim superiority of any new portfolio.

Rejected now:

- Add a new SAST tool immediately — rejected because the validation baseline is only just established and no failing-before/passing-after corpus evidence exists yet.
- Remove a current tool immediately — rejected because unique contribution accounting is not yet backed by enough canary/benchmark data.
- Upgrade for quality claims immediately — rejected unless parser compatibility remains green and a future validation report profile captures quality deltas.

---

## 6. Required next evidence before changing tools

S4 completed the first expansion pass on 2026-05-11 without changing the six-tool set:

- vulnerability-family canaries now include CWE-120, CWE-190, and CWE-416 contract canaries;
- evidence bundle cases now cover SCA diff partial, structural call graph, degraded execution, and policy failure;
- `staticEvidenceContract.toolEvidenceMatrix` gives S3 a runtime-local tool role/state matrix for every current tool;
- Tool Output Compatibility v1 now locks representative raw parser outputs for all six current tools without executing external tools;
- Benchmark Slice Report v1 now locks historical Juliet variant-01 precision/FP evidence and all-variant noise evidence without re-running tools.

Before changing the six-tool set, S4 still needs:

- additional benchmark slices for any new recall/noise claim beyond the pinned v0.6.0/v0.7.0 historical artifacts;
- additional parser compatibility fixtures for any proposed upgraded tool version or newly observed output variant;
- failing-before/passing-after evidence for any proposed add/remove/upgrade.

Until then, the governance answer remains: **do not change the tool set; improve measurement and contracts first.**

---

## 7. Verification status (2026-05-11)

Implemented machine-readable governance support in `services/sast-runner/benchmark/tool_portfolio_governance.py`, parser compatibility support in `services/sast-runner/benchmark/tool_output_compat.py`, benchmark slice evidence in `services/sast-runner/benchmark/benchmark_slice_report.py`, and executable tests in `services/sast-runner/tests/test_tool_portfolio_governance.py`, `services/sast-runner/tests/test_tool_output_compat.py`, and `services/sast-runner/tests/test_benchmark_slice_report.py`.

Verification:

- Benchmark slice focused gate: `6 passed in 0.04s`.
- Tool output compatibility focused gate: `5 passed in 0.03s`.
- Parser compatibility + existing parser regression gate: `71 passed in 0.09s`.
- Governance focused gate: `6 passed` including `parserCompatibility` and `benchmarkSliceCoverage`.
- Governance + report + golden corpus + static evidence + evidence-resolution oracle gate: `33 passed`.
- Golden Corpus v1 expanded gate after evidence-bundle/canary hardening: `37 passed` for static contract + golden corpus + SDK rescue focus.
- Full S4 pytest gate after S3-consumable matrix/corpus hardening: `471 passed in 13.33s`.
- Full S4 pytest gate after Tool Output Compatibility v1 hardening: `496 passed in 13.08s`.
- Full S4 pytest gate after Benchmark Slice Report v1 hardening: `503 passed in 13.93s`.
