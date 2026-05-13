---
title: "S4 Tool Portfolio Experiment Spec v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/sast-runner.md"
  - "wiki/canon/specs/sast-runner-static-evidence-contract.md"
  - "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md"
  - ".omx/goals/autoresearch/s4-tool-portfolio-literature/research.md"
last_verified: "2026-05-12"
service_tags: ["s4"]
decision_tags: ["tool-portfolio-experiment-v1", "sast-runner", "deterministic-experiment", "golden-corpus", "validation-test-split"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Tool Portfolio Experiment Spec v1

Status: **draft canonical experiment spec**
Owner: **S4 / SAST Runner**
Scope: **LLM-free, local, deterministic C/C++ SAST tool-portfolio experiments**
Decision posture: **no immediate add/remove/upgrade decision; build the experiment system first**

This page defines the experiment protocol S4 must use before making any claim that the current six SAST tools are sufficient, insufficient, removable, replaceable, or upgrade-worthy. It turns the prior research review and the existing Tool Portfolio Governance v1 into an executable experiment plan.

---

## 1. Objective

S4 needs a local experiment framework that can answer these questions without LLMs, network-dependent runtime calls, S5/S3 code changes, or subjective tool ranking:

1. What does each current tool actually detect, miss, and uniquely contribute on C/C++ corpora with ground truth?
2. Which findings are true positives, false positives, false negatives, related-but-not-target matches, or unsupported negative evidence?
3. How much marginal value does each tool add to the six-tool portfolio after overlap and noise are counted?
4. Which tool/parser/ruleset/version changes deserve future implementation work?
5. Where are S4's evidence coverage boundaries so S4 can emit machine-readable claim boundaries and S4-internal consumer canaries; any S3 behavior change remains separate WR/API-owner work?

Success means S4 can produce a reproducible JSON report that separates validation evidence, held-out test evidence, parser compatibility, runtime stability, and claim-boundary implications.

---

## 2. Non-goals and hard constraints

Non-goals for this spec:

- no LLM in experiment execution or scoring;
- no S5/GraphRAG/CVE lookup as scoring input;
- no S3 code changes;
- no runtime security verdict, exploitability judgment, or absence-of-vulnerability claim;
- no immediate new SAST tool introduction;
- no v2 API split;
- no production `/v1/scan` contract change required for the first experiment harness.

Hard constraints:

- Experiments run locally and deterministically after required corpora are present on disk.
- Any externally obtained corpus must be pinned by manifest metadata and checksum before use; the experiment runner itself must not fetch network resources.
- Dataset acquisition and experiment scoring are separate phases.
- Validation-set decisions must be frozen before the held-out test-set run.
- Every metric must keep `sourceArtifact`, `sliceKind`, `toolSetConfig`, and `matchingPolicy` metadata.
- Empty findings are never negative security evidence.

---

## 3. Source research behind the spec

This protocol follows the canonical S4 specs and the prior S4 literature review artifact. The `.omx` research artifact is noncanonical evidence until it is promoted to a wiki context page; this spec includes the distilled design constraints directly so it does not depend on `.omx` as the canonical source.

Canonical wiki inputs:

- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`

Noncanonical research evidence:

- `.omx/goals/autoresearch/s4-tool-portfolio-literature/research.md`

High-level sources informing the design:

- NIST SAMATE / SATE methodology: tool fit, not global ranking.
- NIST SARD / Juliet: controlled C/C++ ground-truth slices, but not sufficient as the whole truth.
- NIST static analyzer measurement guidance: recall, precision/discrimination, overlap, ground truth, relevance.
- Empirical real-world C/C++ SAST studies: synthetic recall does not imply real-world effectiveness; tool union increases recall and noise.

---

## 4. Existing S4 assets reused by the experiment framework

Current reusable assets:

| Asset | Path | Use in this experiment spec |
|---|---|---|
| Golden Corpus v1 manifest | `services/sast-runner/tests/fixtures/golden_corpus_v1/manifest.json` | bootstrap canaries and contract/gate validation |
| Tool Output Compatibility v1 | `services/sast-runner/tests/fixtures/tool_output_compat_v1/manifest.json` | parser compatibility prerequisite |
| Claim Support Gate fixtures | `services/sast-runner/tests/fixtures/claim_support_gate_v1/manifest.json` | claim-boundary and unsupported-negative-evidence oracle |
| Governance report builder | `services/sast-runner/benchmark/tool_portfolio_governance.py` | current governance baseline and gate vocabulary |
| Benchmark slice report | `services/sast-runner/benchmark/benchmark_slice_report.py` | current historical Juliet baseline ingestion |
| Juliet runner | `services/sast-runner/benchmark/juliet_runner.py` | local benchmark execution against actual tools |
| Benchmark compare | `services/sast-runner/benchmark/compare.py` | regression/delta comparison |
| Static evidence report | `services/sast-runner/benchmark/static_evidence_report.py` | qualityEvaluation/report separation |
| Consumer canary helper | `services/sast-runner/benchmark/static_evidence_consumer_canary.py` | downstream contract-consumption canaries without S3 code |

The first implementation should extend these assets rather than creating a parallel benchmark stack.

---

## 5. Corpus model

### 5.1 Required slice taxonomy

Each corpus case belongs to exactly one `sliceKind`:

| sliceKind | Purpose | First source |
|---|---|---|
| `s4-canary` | Minimal S4-owned fixtures for contract, parser, and known vulnerability-family behavior | existing Golden Corpus v1 |
| `juliet-controlled-positive` | Controlled vulnerable C/C++ bad functions/cases | Juliet C/C++ v1.3+ |
| `juliet-controlled-negative` | Controlled good functions/cases for FP/discrimination | Juliet C/C++ v1.3+ |
| `sard-focused` | Small focused SARD cases outside the existing Juliet subset | SARD C/C++ suites |
| `real-cve-pair` | vulnerable/fixed real-world cases | SATE/SARD/CVE-derived curated local fixtures |
| `build-context-required` | compile_commands/include/macro-dependent cases | S4-owned or curated C/C++ fixtures |
| `parser-regression` | raw output shapes independent of tool execution | existing and future tool-output fixtures |

### 5.2 Validation/test split

The split is part of the artifact and must be stable:

- `validation`: used for harness development, matching-policy tuning, thresholds, and candidate triage.
- `test`: held out until the experiment rules are frozen; used for final add/remove/upgrade evidence.
- `canary`: always-run guard set; cannot be used to claim portfolio quality by itself.

Rules:

1. A case cannot appear in both `validation` and `test`.
2. Cases with the same root project and same vulnerability lineage must stay in the same split.
3. Thresholds may be changed only before the first held-out `test` run for a decision cycle.
4. If the matching policy changes after a test run, the decision cycle is invalidated and must restart.

### 5.3 Tracked CWE set

The first decision cycle uses the exact tracked CWE set already present in current pinned historical Juliet baseline artifacts:

```json
["CWE-78", "CWE-121", "CWE-122", "CWE-134", "CWE-190", "CWE-252", "CWE-369", "CWE-401", "CWE-416", "CWE-457", "CWE-476", "CWE-680"]
```

Notes:

- `CWE-120` is currently a Golden Corpus/SARD-style canary and parser compatibility target, not part of the pinned Juliet benchmark-slice decision cycle until a new benchmark baseline explicitly includes it.
- `juliet_runner.py` default priority CWE behavior is not authoritative for this experiment spec. Experiment commands must pass the explicit tracked list.
- Future CWE additions require corpus-manifest, baseline, and report-schema updates before quality claims.

### 5.4 Oracle target granularity

The atomic oracle target is not merely a file. It is:

```text
caseId + targetId + polarity + cweId/family + region/function/sink/flow metadata
```

Allowed target granularities:

| granularity | Required metadata | Use |
|---|---|---|
| `sink-line` | file + sink line + CWE/family | preferred positive target |
| `source-sink-flow` | source line + sink line + flow role metadata | dataflow-capable cases |
| `function-region` | function name + start/end line + CWE/family | Juliet same-file good/bad disambiguation |
| `file-region` | file + start/end line + CWE/family | fallback when function extraction is unavailable |
| `negative-region` | file/function/line range + allowed warning policy | negative/good-code discrimination |

Juliet good and bad functions may coexist in the same file, so negative policy is region/function-scoped by default. A warning elsewhere in the same file is not automatically a negative-case FP unless it intersects the negative target region or violates that target's explicit allowed-warning policy.

### 5.5 Minimum first experiment corpus

The first executable experiment should start small but non-toy:

- Existing `s4-canary` layer: all Golden Corpus v1 contract/evidence/canary/parser cases.
- Juliet validation slice: the explicit 12-CWE tracked set in §5.3, variant `01`, both bad and good function/region targets where available.
- Juliet held-out test slice: the same explicit 12-CWE tracked set, using non-`01` variants or a predeclared target subset not used during matching-policy tuning.
- At least one `build-context-required` fixture where compile context changes detection.
- At least one `real-cve-pair` candidate only after the local manifest/checksum rules are implemented.

This staged minimum prevents the project from blocking on a huge real-world corpus before the harness itself is trustworthy.

---

## 6. Corpus and acquisition manifest schemas

The experiment harness should introduce a corpus manifest with schema version `s4-tool-portfolio-experiment-corpus-v1` and an acquisition manifest with schema version `s4-tool-portfolio-acquisition-v1`.

Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-experiment-corpus-v1",
  "profile": "c-cpp-tool-portfolio-v1",
  "createdAt": "2026-05-12",
  "owner": "s4-sast-runner",
  "cases": [
    {
      "caseId": "juliet-cwe121-variant01-0001",
      "sliceKind": "juliet-controlled-positive",
      "split": "validation",
      "language": "c",
      "sourceArtifact": "Juliet C/C++ 1.3",
      "acquisitionId": "juliet-c-cpp-1.3",
      "acquisitionManifestChecksum": "sha256:...",
      "sourceRef": "juliet-c-cpp-1.3:CWE121/...",
      "sourcePath": "CWE121_Stack_Based_Buffer_Overflow/...",
      "checksum": "sha256:...",
      "expected": {
        "targetId": "target-001",
        "granularity": "sink-line",
        "cweId": "CWE-121",
        "polarity": "positive",
        "locations": [
          { "file": "...", "line": 42, "role": "sink" }
        ],
        "functionRegion": { "function": "bad", "startLine": 35, "endLine": 45 },
        "allowedMatchWindows": { "lineDelta": 5, "functionFallback": false }
      },
      "buildContext": {
        "requiresCompileCommands": false,
        "compileCommandsFixture": null,
        "defines": [],
        "includePaths": []
      },
      "notes": []
    }
  ]
}
```

Required validation:

- unique `caseId`;
- valid `sliceKind` and `split`;
- checksum present for externally sourced cases;
- externally sourced cases include `acquisitionId`, `acquisitionManifestChecksum`, and stable `sourceRef` linking them to a validated acquisition manifest;
- positive targets have expected CWE and location/sink or region information;
- negative targets have explicit `polarity="negative"`, target region metadata, and an expected non-match policy;
- no case has verdict-like fields such as `safe`, `clean`, `vulnerable`, `affected`, `riskScore`, or `securityVerdict`.

### 6.1 Acquisition manifest

Every externally obtained corpus source must have acquisition provenance before it can appear in a corpus manifest. Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-acquisition-v1",
  "sourceName": "Juliet C/C++",
  "sourceUrl": "https://...",
  "sourceVersion": "1.3",
  "licenseOrRedistributionNote": "...",
  "downloadedAt": "2026-05-12",
  "archiveChecksum": "sha256:...",
  "extractionRootChecksum": "sha256:...",
  "localPath": "/path/to/local/corpus",
  "offlineScoringOnly": true,
  "networkAccessRequiredForScoring": false
}
```

Validation must reject externally sourced cases without acquisition provenance.

---

## 7. Tool-set configurations

Every experiment run must identify the exact tool-set configuration.

Required configurations for current six tools:

1. `full-current-six`: `semgrep`, `cppcheck`, `flawfinder`, `clang-tidy`, `scan-build`, `gcc-fanalyzer`.
2. `single-tool:<toolId>` for each current tool.
3. `leave-one-out:<toolId>` for each current tool.
4. `parser-only-current-six`: parser fixtures without executing tools.
5. `contract-canary-current-six`: Golden Corpus and consumer-canary validation only.

Future WR-gated configurations only:

- `upgrade-ab:<toolId>:<oldVersion>:<newVersion>`;
- `ruleset-ab:<rulesetId>`;
- `add-one-in:<candidateToolId>`;
- `remove-candidate:<toolId>`.

Milestone 1 is current-six-only. The initial validator must reject candidate tool IDs and future configurations unless an explicit WR/decision-cycle flag enables them. A future candidate configuration remains invalid until parser compatibility fixtures exist for every new or changed raw output shape.

---

## 8. Matching policy

The scoring engine must distinguish target true positives from weak nearby findings. This requires a first implementation step before advanced scoring: preserve enough raw/case-level finding data from current S4 outputs and benchmark results to match against `file`, `line`, `dataFlow`, `metadata.cweId`, `metadata.cwe`, and `metadata.evidenceResolution`. Current file+CWE-only benchmark aggregation is insufficient for §8 matching.

### 8.1 Match classes

| class | Meaning | Counts as TP? |
|---|---|:---:|
| `exact-target-match` | expected CWE/family and expected location/sink within line window | yes |
| `strong-related-match` | expected CWE/family and same dataflow sink/source or same canonical callsite, but line differs beyond exact window | yes, separately tagged |
| `weak-related-match` | same vulnerable function/file but missing required CWE or sink relation | no; reported separately |
| `wrong-cwe-target-location` | right target location but wrong CWE/family | no; FP-like diagnostic |
| `off-target-finding` | finding outside the expected target region/case | no; noise/FP |
| `negative-case-finding` | any finding that violates the negative case's allowed-warning policy | no; FP |
| `missed-target` | no exact or strong-related match for a positive oracle | FN |

### 8.2 Default location rules

- Use normalized relative paths.
- Prefer sink/source line windows over function-only matching.
- Match against `metadata.cweId` first, then deterministic `metadata.cwe[]` fallback, then evidence-resolution CWE status.
- Match `dataFlow` source/sink roles when provided; absence of dataflow becomes a weaker match class, not a negative claim.
- Default exact line window: `±5` lines unless the case manifest overrides it.
- Function-only matching is disabled by default because prior research shows same-function warnings can be irrelevant.
- A finding cannot support absence-of-vulnerability or CWE absence, even if no match is found.

### 8.3 CWE family matching

The matcher may use family equivalence only when predeclared in a local deterministic map. Example: stack/heap buffer overflow subtypes may be related for some aggregate reports, but exact CWE metrics must remain available.

---

## 9. Metrics

### 9.1 Counting unit and formulas

Primary counting unit is the **oracle target**. Findings are secondary evidence attached to targets.

Definitions:

- `targetTP`: a positive oracle target with at least one exact or strong-related match. Multiple findings on the same target count as one targetTP for target-level recall; extras may count as duplicate/noise findings.
- `targetFN`: a positive oracle target with no exact or strong-related match.
- `matchedTpFindings`: findings that participate in exact or strong-related positive target matches.
- `fpFindings`: findings that are off-target, wrong-CWE for the target, weak-related only, duplicate beyond the selected target match, or attached to a negative-target violation.
- `negativeTargetViolationCount`: explicit negative oracle targets/regions whose allowed-warning policy is violated by at least one finding.
- `negativeTargetCleanCount`: explicit negative oracle targets/regions with no violating finding.
- `targetRecall = targetTP / (targetTP + targetFN)` when denominator > 0.
- `findingPrecision = matchedTpFindings / (matchedTpFindings + fpFindings)` when denominator > 0.
- `negativeTargetFpr = negativeTargetViolationCount / (negativeTargetViolationCount + negativeTargetCleanCount)` for explicit negative targets only.
- `discrimination = positiveTargetDetectionRate - negativeTargetViolationRate` for bad/good paired targets.
- `noisePerKloc = fpFindings / analyzedKloc`; `noisePerFile = fpFindings / analyzedFiles`.
- `uniqueTpContribution(tool)`: oracle targets matched by that tool and by no other tool in the compared configuration.
- `leaveOneOutRecallDelta(tool) = recall(full-current-six) - recall(leave-one-out:tool)`.
- `leaveOneOutNoiseDelta(tool) = noise(full-current-six) - noise(leave-one-out:tool)`.

Reports must include both target-level and finding-level counts where both are meaningful.

### 9.2 Per-tool and per-configuration metrics

For each `toolSetConfig`, `sliceKind`, `split`, and CWE/family:

- `tp`, `fp`, `fn`, `tn` where `tn` is meaningful only for explicit negative cases;
- recall / true-positive rate;
- precision;
- false-positive rate;
- discrimination: bad/good pair separation;
- noise per file and per KLOC;
- weak-related count;
- wrong-CWE count;
- runtime seconds;
- tool failure / partial / degraded rate;
- parser compatibility status;
- claim-support readiness distribution.

### 9.3 Portfolio metrics

For the portfolio:

- unique TP contribution by tool;
- overlap clusters: equivalent, strong-related, weak-related;
- leave-one-out recall delta;
- leave-one-out noise delta;
- leave-one-out runtime delta;
- add-one-in delta for future candidates;
- upgrade A/B delta for future version changes.

### 9.4 Report separation

Reports must not collapse everything into one score. Required top-level buckets:

- `validationMetrics`;
- `testMetrics`;
- `canaryMetrics`;
- `parserCompatibility`;
- `runtimeStability`;
- `claimBoundaryImpact`;
- `decisionSupport`.

---

## 10. Experiment report schema

The runner should emit `s4-tool-portfolio-experiment-report-v1`.

Minimum shape:

```json
{
  "schemaVersion": "s4-tool-portfolio-experiment-report-v1",
  "runId": "20260512-...",
  "createdAt": "2026-05-12T00:00:00Z",
  "producer": { "service": "s4-sast-runner", "deterministic": true },
  "decisionCycle": {
    "decisionCycleId": "s4-tool-portfolio-20260512-001",
    "phase": "validation | test",
    "frozen": true,
    "corpusManifestChecksum": "sha256:...",
    "matchingPolicyChecksum": "sha256:...",
    "thresholdsChecksum": "sha256:...",
    "splitAssignmentChecksum": "sha256:...",
    "rulesetChecksums": {},
    "toolVersions": {},
    "toolPaths": {},
    "timeoutConfig": {},
    "environmentSummary": {},
    "lockfileChecksum": "sha256:..."
  },
  "corpusManifest": {
    "schemaVersion": "s4-tool-portfolio-experiment-corpus-v1",
    "path": "...",
    "checksum": "sha256:..."
  },
  "matchingPolicy": {
    "schemaVersion": "s4-oracle-matching-policy-v1",
    "lineWindowDefault": 5,
    "functionFallbackDefault": false
  },
  "toolSetConfigs": [],
  "validationMetrics": {},
  "testMetrics": {},
  "canaryMetrics": {},
  "parserCompatibility": {},
  "runtimeStability": {},
  "claimBoundaryImpact": {},
  "decisionSupport": {
    "currentDecision": "insufficient-evidence-for-tool-change",
    "removeCandidates": [],
    "upgradeCandidates": [],
    "addCandidates": [],
    "futureCandidateActionsRequireWr": true,
    "requiredFollowUps": []
  }
}
```

Report guardrails:

- `currentDecision` is decision support, not automatic production rollout.
- Future candidate arrays are WR-gated planning signals only; Milestone 1 reports must keep them empty.
- The report may say `insufficient-evidence-for-tool-change`, `candidate-needs-more-data`, or `ready-for-WR-review`; it must not silently mutate runtime policy.
- Report fields must not include final vulnerability verdict vocabulary.

---

## 11. Decision rules

### 11.1 Universal prerequisites

A tool change decision cannot proceed unless all are true:

1. corpus manifest validates;
2. parser compatibility passes for current and changed tool outputs;
3. canary/contract gates pass;
4. validation and held-out test results are both present;
5. matching policy was frozen before held-out test scoring;
6. runtime degraded/failure rate is reported;
7. S3/S5 API changes are either not required or tracked as separate WRs.

### 11.2 Keep

Keep a tool when any of these are true:

- it has unique TP contribution on validation or test;
- it has high precision for a CWE/family that the portfolio otherwise covers weakly;
- it provides useful confirmation overlap without meaningful noise/runtime cost;
- it acts as a fast canary that improves S3-readable claim support;
- removal worsens parser/claim-boundary/runtimes in a way that is not offset by reduced noise.

### 11.3 Remove candidate

A tool can become a remove candidate only if all are true:

- zero unique TP on validation and held-out test for tracked CWE/family slices;
- removing it does not reduce recall or discrimination for any tracked high-priority CWE/family;
- noise or runtime savings are measurable;
- consumer contract semantics become simpler or unchanged;
- the decision is represented in a governance report and WR-reviewed before implementation.

### 11.4 Upgrade candidate

A tool upgrade can proceed only if:

- parser compatibility fixtures cover the new raw output shape;
- validation improves or fixes a documented gap;
- held-out test confirms the improvement without unacceptable noise/runtime regression;
- omission policy and degraded semantics remain compatible.

### 11.5 Add candidate

A new tool can be proposed only if:

- a documented gap exists in current six-tool validation/test evidence;
- the candidate is deterministic, local, offline at experiment runtime, and parser-fixture friendly;
- add-one-in improves unique TP, discrimination, or runtime/noise tradeoff enough to justify maintenance;
- it does not require LLM, external vulnerability lookup, or network service calls.

---

## 12. Local execution plan

### 12.1 Existing gates to run before experiment harness changes

From `services/sast-runner`:

```bash
python3 -m pytest \
  tests/test_tool_portfolio_governance.py \
  tests/test_tool_output_compat.py \
  tests/test_benchmark_slice_report.py \
  tests/test_golden_corpus_v1.py \
  tests/test_static_evidence_report.py \
  tests/test_static_evidence_consumer_canaries.py \
  tests/test_analysis_quality_gate.py \
  tests/test_static_evidence_contract.py
```

### 12.2 Juliet baseline execution pattern

After Juliet is available locally:

```bash
PYTHONPATH=. python3 -m benchmark.juliet_runner \
  --juliet-path /path/to/Juliet/testcases/C \
  --variant-filter 01 \
  --cwes 78,121,122,134,190,252,369,401,416,457,476,680 \
  --output benchmark/results/tool_portfolio/validation/full-current-six.json
```

Single-tool and leave-one-out runs use the same command with `--tools`:

```bash
PYTHONPATH=. python3 -m benchmark.juliet_runner \
  --juliet-path /path/to/Juliet/testcases/C \
  --variant-filter 01 \
  --cwes 78,121,122,134,190,252,369,401,416,457,476,680 \
  --tools semgrep \
  --output benchmark/results/tool_portfolio/validation/single-tool-semgrep.json
```

### 12.3 First harness implementation tests

Before implementing the experiment runner, add tests for:

- corpus manifest schema validation;
- acquisition manifest validation for external corpora;
- acquisition linkage validation: external corpus cases must resolve `acquisitionId` + `acquisitionManifestChecksum` + `sourceRef`;
- split disjointness, lineage leakage, and checksum requirements;
- forbidden verdict key recursion guard across manifests and reports;
- same-file Juliet good/bad function-region matching;
- oracle matching classes, dataflow/CWE matching, and line-window behavior;
- negative-case region-scoped FP/discrimination behavior;
- report schema shape, row-level metadata presence, and metric bucket separation;
- deterministic no-network/no-LLM/no-S5 static guard for new modules;
- decision-cycle freeze tests rejecting held-out test reruns after matching-policy/threshold/split drift;
- current-six-only validator tests that reject future candidate tool IDs in Milestone 1;
- leave-one-out and unique-contribution math on small synthetic report fixtures.

Expected test files:

- `services/sast-runner/tests/test_tool_portfolio_experiment_manifest.py`
- `services/sast-runner/tests/test_tool_portfolio_acquisition_manifest.py`
- `services/sast-runner/tests/test_tool_portfolio_oracle_matcher.py`
- `services/sast-runner/tests/test_tool_portfolio_experiment_report.py`
- `services/sast-runner/tests/test_tool_portfolio_decision_cycle_freeze.py`

Expected implementation files:

- `services/sast-runner/benchmark/tool_portfolio_experiment_manifest.py`
- `services/sast-runner/benchmark/tool_portfolio_acquisition_manifest.py`
- `services/sast-runner/benchmark/tool_portfolio_oracle_matcher.py`
- `services/sast-runner/benchmark/tool_portfolio_experiment_report.py`
- `services/sast-runner/benchmark/tool_portfolio_decision_cycle.py`

---

## 13. First milestone checklist

Milestone 1: experiment harness skeleton, no new tool changes.

- [ ] Write corpus and acquisition manifest validator tests first.
- [ ] Implement `s4-tool-portfolio-experiment-corpus-v1` and `s4-tool-portfolio-acquisition-v1` parsers/validators.
- [ ] Write raw/case-level finding capture tests before advanced matching.
- [ ] Extend benchmark result capture so matcher can see file/line/dataFlow/CWE/evidenceResolution fields.
- [ ] Write oracle matcher tests first.
- [ ] Implement deterministic matcher with exact/strong/weak/wrong/off-target/missed classes.
- [ ] Write report schema and decision-cycle freeze tests first.
- [ ] Implement report builder for precomputed small fixtures.
- [ ] Connect existing Golden Corpus, parser compatibility, and benchmark-slice reports as prerequisite gates.
- [ ] Reject candidate/future tool-set configs until a WR-gated decision-cycle flag exists.
- [ ] Run focused pytest gates.
- [ ] Only then run local Juliet validation slice if Juliet is available.

Milestone 2: local validation experiment.

- [ ] Freeze validation manifest.
- [ ] Run full-current-six.
- [ ] Run six single-tool configs.
- [ ] Run six leave-one-out configs.
- [ ] Produce validation report.
- [ ] Inspect unique contribution, overlap, noise, and runtime.

Milestone 3: held-out test experiment.

- [ ] Freeze matching policy.
- [ ] Verify decision-cycle lock checksums, then run held-out test slice.
- [ ] Compare validation vs test deltas.
- [ ] Emit decision-support report.
- [ ] If any API or consumer behavior changes are needed, send WR before implementation.

---

## 14. Relationship to S4 governance

This spec does not replace `wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md`.

It supplies the missing experiment protocol required by that governance page. The intended lifecycle is:

1. Static Evidence Contract and Golden Corpus gates pass.
2. Tool Output Compatibility and Benchmark Slice gates pass.
3. This experiment spec produces validation/test reports.
4. Governance consumes those reports.
5. Only then can S4 propose add/remove/upgrade through WR-backed implementation.

Until step 4 has real validation and held-out test evidence, the correct governance decision remains **keep current six tools and improve measurement**.
---

## 15. Implementation status (2026-05-12)

Status: **framework implemented; decision-grade external Juliet validation/test blocked until a pinned local corpus is available**.

Implemented in `services/sast-runner`:

- `benchmark/tool_portfolio_acquisition_manifest.py` — acquisition provenance validation and stable manifest checksums.
- `benchmark/tool_portfolio_experiment_manifest.py` — corpus manifest validation, tracked CWE set, split/lineage leakage checks, current-six tool-set config validation, forbidden verdict-key guard.
- `benchmark/tool_portfolio_oracle_matcher.py` — target-level deterministic oracle matching with exact/strong/weak/wrong/off-target/negative/missed classes.
- `benchmark/tool_portfolio_decision_cycle.py` — decision-cycle freeze checksums and static no-network/no-LLM/no-S5 coupling guard for new modules.
- `benchmark/tool_portfolio_experiment_report.py` — `s4-tool-portfolio-experiment-report-v1` builder with validation/test/canary metric buckets, local threshold-based `qualityGate.localQualityAssessment`, unique contribution, leave-one-out deltas, historical benchmark prerequisite evidence, and WR-gated future candidate policy.
- `benchmark/tool_portfolio_harness_fixture.py` — file-based S4-owned synthetic/precomputed harness fixture runner.
- `benchmark/cwe_matcher.py` now extracts `metadata.cweId` and `metadata.evidenceResolution.cwe.id` in addition to legacy `metadata.cwe[]`.

Added deterministic local harness fixture:

- `tests/fixtures/tool_portfolio_experiment_v1/acquisition_manifest.json`
- `tests/fixtures/tool_portfolio_experiment_v1/corpus_manifest.json`
- `tests/fixtures/tool_portfolio_experiment_v1/findings_by_config.json`
- `tests/fixtures/tool_portfolio_experiment_v1/quality_gate_oracle.json`

Generated report artifact:

- `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json`

The harness fixture deliberately labels itself as `s4-harness-fixture`; it is not Juliet evidence and cannot justify a production tool add/remove/upgrade decision. The report marks decision-grade Juliet validation/test as `blocked` with `LOCAL_JULIET_CORPUS_NOT_PRESENT`. Current historical baseline JSONs remain prerequisite/governance continuity evidence only, not replacement held-out test evidence for the new oracle matcher.

Quality Gate local assessment semantics added on 2026-05-12:

- `validationMetrics.status`, `testMetrics.status`, and `canaryMetrics.status` mean that deterministic scoring ran for that split; threshold pass/fail is reported under `qualityGate.localQualityAssessment`.
- `qualityGate.localQualityAssessment.primaryToolSetConfig` defaults to `full-current-six`; single-tool and leave-one-out rows are portfolio evidence, not the direct pass/fail basis for the local Quality Gate.
- `negativeTargetFpr=null` means the split has no negative targets, so `maximumNegativeTargetFpr` is not applicable and must not fail that split.
- The current S4 harness fixture has `qualityGate.status=\"not_decision_grade\"` because Juliet is not locally pinned, while `qualityGate.localQualityAssessment.status=\"fail\"` because validation/test fixture metrics intentionally include precision/noise failures. The canary split passes.
- The regenerated report artifact `benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json` now contains `systemStabilityGate`, `qualityGate`, and `qualityGate.localQualityAssessment`.

Verification evidence:

- New experiment harness focused gate after Critic-blocker fixes: `32 passed` within the focused suite; final matcher/manifest/report regression subset `23 passed in 0.07s`.
- Experiment harness + existing S4 governance/static-evidence focused gate after Critic-blocker fixes: `121 passed in 0.27s`.
- Full S4 pytest gate after Critic-blocker fixes: `548 passed in 13.09s`.
- Local Quality Gate threshold/oracle focused report tests: `7 passed in 0.08s`.
- Tool-portfolio experiment/system-gate focused suite after local Quality Gate hardening: `64 passed in 0.12s`.
- Full S4 pytest gate after local Quality Gate hardening: `642 passed in 25.47s`.


Critic implementation review initially rejected split metric contamination, function-region-only TP promotion, missing negative allowed-warning policy, and missing negative allowed-warning policy enforcement, and exclusion of allowed negative-region findings from FP/noise aggregation. These were fixed with regression tests before the final full S4 pytest gate.
