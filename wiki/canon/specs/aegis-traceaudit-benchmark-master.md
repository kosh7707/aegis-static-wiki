---
title: "AEGIS TraceAudit Benchmark Master Plan"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "https://arxiv.org/abs/2601.02941"
  - "https://arxiv.org/abs/2510.02534"
  - "https://arxiv.org/abs/2601.22952"
  - "https://arxiv.org/abs/2605.01885"
  - "https://arxiv.org/abs/2507.02825"
  - "https://arxiv.org/abs/2603.18895"
  - "https://arxiv.org/abs/2505.19828"
  - "https://arxiv.org/abs/2403.18624"
  - "https://arxiv.org/abs/2304.00409"
  - "https://arxiv.org/abs/1909.03496"
  - "https://arxiv.org/abs/2312.04724"
  - "https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html"
  - "https://arxiv.org/abs/2601.18844"
  - "wiki/canon/api/paper-analysis-api.md"
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "analysis-agent", "sast-runner", "knowledge-base", "paper-pipeline", "paper-benchmark"]
decision_tags: ["paper-benchmark", "traceaudit", "auditability", "sast-triage", "human-audit", "evidence-ledger", "related-work", "canonical-anchor", "deprecated-frontier-parity"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/handoff/s3/session-s3-analysis-agent-s4-s5-wr-interview-20260518.md"]
---

# AEGIS TraceAudit Benchmark Master Plan

> Status: canonical anchor for paper measurement direction, S3-owned, literature-grounded, Critic PASS_WITH_CHANGES incorporated.
> Last verified: 2026-05-18.
> Do not treat this page as an implementation contract for S4 or S5. The S4/S5 paper API/design drafts remain separate and were intentionally left untouched for this research pass.
> Red line: do not revive Qwen/frontier parity, H1/H1-dump, or TOST equivalence as the active paper direction.
> Freeze posture: direction is frozen; remaining changes should operationalize success criteria, human-audit controls, and gate conditions rather than changing the paper identity.

## 0. Decision in one paragraph

AEGIS should stop framing the paper around **raw Qwen3.6 vs. raw frontier vs. Qwen3.6+AEGIS**. That comparison measures model/scaffold performance and cost, but it does not answer the stronger question now implied by the architecture: **does a trace-auditable evidence ledger make SAST warning triage more reviewable, safer under uncertainty, and less dependent on unsupported natural-language rationales?** The benchmark should therefore compare **audit packet conditions** rather than model families: SAST-only alert, raw LLM rationale, unstructured evidence dump, AEGIS ledger without verdict, and full AEGIS audit packet. Model accuracy remains a secondary sanity check; traceability and human audit effectiveness become the primary claims.

## 1. The exact paper claim

Recommended one-line paper identity:

> **AEGIS is a trace-auditable architecture for evidence-guided TP/FP/UNKNOWN triage of SAST findings.**

Expanded claim:

> AEGIS turns SAST warning triage from a one-shot model verdict into an auditable decision artifact: each verdict is linked to producer-level static evidence, code/knowledge context, claim boundaries, diagnostics, and explicit UNKNOWN rationale, so a security reviewer can verify, overturn, or defer the decision with less guesswork.

### What this page freezes

This page freezes the **measurement direction**:

1. Primary benchmark: audit packet condition comparison.
2. Primary metrics: traceability, audit effectiveness, unsafe decision prevention, and appropriate deferral.
3. Secondary metrics: automated triage quality, latency, and cost.
4. External comparison: related work positioning and optional sanity checks, not a leaderboard claim.
5. Canonical anchor status: this page supersedes old paper-claim protocols centered on Qwen/frontier parity.

### Superseded legacy paper-direction protocols

This page is the active anchor for paper claims and benchmark design. It supersedes any legacy protocol that treats the following as the main paper direction:

```text
Qwen3.6 raw vs frontier raw
Qwen3.6 + AEGIS vs frontier raw parity
H1 / H1-dump practical parity
TOST equivalence as the main story
frontier evidence-dump fairness control as the main benchmark
```

Historical files such as `/home/kosh/aegis-for-paper/artifacts/experiment-protocol.md`, `experiment-protocol-v2.md`, or `experiment-protocol-v2.1.md` must be treated as deprecated if restored. Their required banner is:

```text
DEPRECATED FOR PAPER CLAIMS.
Superseded by AEGIS TraceAudit Benchmark Master Plan.
This protocol is retained only as historical design material.
Do not use H1/H1-dump/frontier parity as the active paper direction.
```

As of this update, no live `experiment-protocol*.md` file was present under `/home/kosh/aegis-for-paper/artifacts/`; the active file-based harness under `experiments/triage-core-v1/` is only a subordinate scaffold.

### What this page does not change

This research pass intentionally does **not** modify:

- `wiki/canon/api/paper-analysis-api.md`
- `wiki/canon/specs/paper-analysis-pipeline-design.md`

Those two S4/S3 consensus documents remain the architectural substrate. This page sits above them as the evaluation and paper-direction master plan.


## 2. Problem definition and non-goals

### 2.1 Problem definition

AEGIS-TraceAudit evaluates a fixed-warning SAST triage workflow.

```text
Input:
  build-target-scoped SAST/static-evidence bundle
  + S5 contextual Code KB / Threat KB evidence

Output:
  finding-level TP | FP | UNKNOWN verdict
  + evidence ledger
  + claim-boundary rationale
  + producer traces
  + case-local and aggregate artifacts
```

Unit split:

| Concept | Unit | Owner |
|---|---|---|
| Analysis case | one admitted build target | S3 / paper harness |
| Scoring unit | one SAST finding or claim candidate | S3 |
| Evidence unit | one row/ref/trace/acquisition item | S3 normalized, S4/S5 raw producers |
| Export unit | case-local packet plus aggregate JSONL | S3 / paper harness |

System role boundary:

- S3 is the orchestrator and may consume S4 and S5 tools/artifacts whenever needed.
- S4 produces static/source/build evidence and never owns final TP/FP/UNKNOWN.
- S5 produces contextual Code KB / Threat KB evidence and never owns final TP/FP/UNKNOWN.
- S4 and S5 do not communicate directly; any S4-to-S5 or S5-to-S4 information flow is mediated and logged by S3.

### 2.2 Producer-boundary contract

TraceAudit is built on a producer-boundary contract:

- producers may expose bounded evidence, diagnostics, acquisition status, retrieval status, and source/context rows;
- only S3 may create finding-level TP/FP/UNKNOWN triage verdicts;
- S4 `empty`, `not_available`, or `error` surfaces are not safe-code evidence;
- S5 `no_hit`, missing retrieval, or low-confidence retrieval is not vulnerable/safe evidence;
- producer diagnostics are operational/context diagnostics, not security conclusions;
- every final verdict must be reconstructable from evidence refs, diagnostic rationale, and claim-boundary notes.

This contract is not merely engineering hygiene. It is the paper's core auditability thesis: SAST triage should be reviewable because evidence producers are not allowed to silently become verdict producers.

### 2.3 S5 minimum paper evidence semantics

S5 remains implementation-provisional, but the paper benchmark requires the following minimum semantics before a S5 row can appear in a visible audit packet:

```text
retrievalRunId: stable run-local retrieval identifier
itemId: stable run-local evidence item identifier
sourceType: code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
queryIntent: why S3 asked for this retrieval
sourceEvidence: code/file/symbol/KB reference sufficient for reviewer audit
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
```

Policy:

- Main benchmark condition uses **Threat KB generic mode** only: CWE/CAPEC/security concept explanations, API misuse descriptions, and generic security notes are allowed.
- CVE IDs, fix commits, advisories, exploit writeups, and patch text are excluded from visible packets unless an appendix condition explicitly tests CVE-aware Threat KB.
- S5 never emits TP/FP/UNKNOWN and never states that a target is vulnerable or safe.
- S5 `no_hit` is a contextual absence diagnostic only; it cannot be used as negative security evidence.

S5 freeze gate before paper experiments:

```text
S5_FREEZE_GATE:
  - S5 visible packet schema finalized;
  - visibleLeakageClass emitted for every S5 row;
  - Threat KB generic mode tested on synthetic hidden-ledger leakage corpus;
  - S5 no_hit / partial / error cannot be consumed by S3 as TP/FP evidence;
  - S5 never emits final verdict fields or language equivalent to vulnerable/safe.
```

If the S5 freeze gate is not satisfied, RQ5 Threat KB contribution must be weakened to exploratory or removed from the main claim.

### 2.4 Non-goals

AEGIS-TraceAudit is not:

- a Qwen-vs-frontier leaderboard paper;
- a general vulnerability discovery benchmark;
- a repository-wide vulnerability-recall benchmark; missing vulnerabilities are outside the denominator unless they appear as SAST findings or explicit claim candidates;
- a proof of vulnerability absence;
- a build-recovery benchmark;
- a production reliability benchmark;
- a patch-generation, patch-validation, or repair-quality benchmark;
- an S4-only or S5-only security verdict;
- a bit-for-bit reproducibility/integrity proof;
- a claim that traceability equals correctness.

### 2.5 Core scoring vocabulary

| Term | Meaning | Failure mode if mishandled |
|---|---|---|
| `traceable` | A claim cites evidence refs that resolve to ledger rows with producer trace. | Natural-language rationale cannot be audited. |
| `unsupported` | A TP/FP/UNKNOWN rationale lacks required evidence refs or diagnostic rationale. | LLM explanation substitutes for evidence. |
| `overclaimed` | The verdict asserts more than its cited evidence can support. | S4/S5 producer data becomes final security proof. |
| `boundary violation` | A decision uses forbidden inference, e.g. S4 empty/no-hit as safe or S5 no-hit as vulnerable/safe. | System appears precise while silently unsafe. |
| `correct UNKNOWN` | Evidence is insufficient and the system defers instead of forcing TP/FP. | UNKNOWN is either gamed or incorrectly penalized. |

## 3. Keystone related work

### 3.1 Closest benchmark: SastBench

**Paper:** [SastBench: A Benchmark for Testing Agentic SAST Triage](https://arxiv.org/abs/2601.02941), Feiglin and Dar, 2026.

Why it is close:

- It explicitly targets **agentic SAST triage**.
- It models SAST triage as binary TP/FP classification.
- It combines real CVEs as positives with filtered SAST findings as approximate false positives.
- It uses an agent-agnostic Docker/API setup and reports precision, recall, F1/F2, accuracy, and MCC.
- Its dataset scale is large enough to matter: 2,737 total samples, 299 true positives, 2,438 false positives, 38 languages, and 139 CWEs.

What AEGIS should borrow:

- The argument that SAST triage is better posed than open-ended vulnerability discovery.
- The fixed-warning/finding setting.
- The caution around realistic false-positive distributions.
- MCC/F1/precision/recall as secondary automated triage metrics.
- The idea of optional external sanity checks.

Where AEGIS must differ:

- SastBench asks: **can an agent classify SAST findings?**
- AEGIS asks: **can a human reconstruct and audit why a triage decision was made?**
- SastBench labels are binary TP/FP and include heuristic negatives; AEGIS must support TP/FP/UNKNOWN and explicitly score evidence validity.
- AEGIS should not claim to be a larger or better SastBench. It should be positioned as a complementary trace-audit benchmark.

Required paper wording:

> SastBench is the closest external SAST-triage benchmark, but it evaluates agent output correctness, not audit artifact effectiveness. AEGIS-TraceAudit therefore does not use SastBench as the primary benchmark; it may run a SastBench-compatible fixed-finding subset only as an appendix sanity check.

Optional SastBench-compatible appendix boundary:

```text
candidate findings are fixed by SastBench;
AEGIS may not add, remove, or filter candidate findings;
AEGIS reports official binary score only as supplementary;
AEGIS auditability metrics remain out-of-benchmark and are reported separately.
```

### 3.2 Closest architecture/evidence-enrichment paper: ZeroFalse

**Paper:** [ZeroFalse: Improving Precision in Static Analysis with LLMs](https://arxiv.org/abs/2510.02534), Iranmanesh et al., 2025/2026.

Why it is close:

- It treats static analyzer output as a structured contract.
- It enriches analyzer output with flow-sensitive trace, contextual evidence, and CWE-specific knowledge.
- It adjudicates with LLMs and reports strong F1 on OWASP Java Benchmark and OpenVuln.
- It uses SARIF/CodeQL-style findings as the central interface.

What AEGIS should borrow:

- The notion that raw SAST output should be canonicalized and enriched before LLM adjudication.
- CWE-aware and evidence-gated prompts.
- Schema-constrained outputs and deterministic field ordering.
- Precision/recall reporting as a secondary check.

Where AEGIS must differ:

- ZeroFalse primarily uses evidence to improve precision.
- AEGIS uses evidence as an auditable artifact, not merely better model input.
- The AEGIS paper should evaluate producer trace, evidence references, claim-evidence linkage, and reviewer behavior directly.

Benchmark mapping:

```text
B2 Evidence-enriched rationale, no ledger:
  approximates the evidence-enrichment family of systems such as ZeroFalse.
  The reviewer receives richer SAST/code/CWE context, but not producer-level trace,
  evidenceRef resolution, or claim-evidence linkage.

B2 and B4 must use the same underlying S4/S5 evidence rows.
The only difference is whether the evidence is structured as an auditable ledger
with producer traces and claim links.
```

This prevents the mistaken interpretation that AEGIS wins merely because it gives reviewers more evidence.

### 3.3 Closest agent-framework comparison: Sifting the Noise

**Paper:** [Sifting the Noise: A Comparative Study of LLM Agents in Vulnerability False Positive Filtering](https://arxiv.org/abs/2601.22952), Xiong and Zhang, 2026.

Why it is close:

- It evaluates Aider, OpenHands, and SWE-agent for SAST false-positive filtering.
- It uses OWASP Benchmark v1.2 and real-world Vul4J-derived CodeQL alerts.
- It compares agentic workflows with vanilla zero-shot LLM baselines.
- It explicitly warns that benefits depend on backbone, CWE, cost, and the risk of suppressing true vulnerabilities.
- It includes manual triage for a 50-alert real-world subset, reporting 20 person-hours of annotation effort.

What AEGIS should borrow:

- The baseline idea: raw LLM rationale / vanilla prompting is necessary.
- The safety metric idea: suppressing a true vulnerability is a distinct harm.
- The use of real-world alert samples plus manual/expert adjudication for a smaller subset.

Where AEGIS must differ:

- Sifting compares agent frameworks and FP filtering performance.
- AEGIS compares audit packet conditions and reviewer-audit outcomes.
- AEGIS should not try to reproduce Aider/OpenHands/SWE-agent unless doing an appendix sanity check.

Safety metric implication:

```text
unsafe_suppression_rate is a first-class harm metric:
  oracle TP -> reviewer/machine suppresses as FP.
It is reported separately from aggregate accuracy because suppressing a true
vulnerability is operationally worse than retaining a false positive for review.
```

### 3.4 Closest multi-agent SAST FP-reduction paper: QASecClaw

**Paper:** [QASecClaw: A Multi-Agent LLM Approach for False Positive Reduction in Static Application Security Testing](https://arxiv.org/abs/2605.01885), Ameen et al., 2026.

Why it is close:

- It combines conventional SAST with LLM contextual review.
- It uses a Mission Orchestrator plus specialized agents for validation, correlation, filtering, and reporting.
- It reports OWASP Benchmark v1.2 results with substantial FP reduction.

What AEGIS should borrow:

- The conventional-SAST-first pipeline framing.
- The idea that contextual code review can reduce false positives.
- OWASP Benchmark as a known controlled reference point.

Where AEGIS must differ:

- QASecClaw's headline is F1/FP reduction.
- AEGIS's headline should be trace-auditable decision records and human audit effectiveness.

Benchmark mapping:

```text
AEGIS does not reproduce QASecClaw's multi-agent orchestration.
QASecClaw motivates the B2 contextual-review baseline:
  SAST finding + source/CWE context + LLM rationale,
  but without AEGIS evidence-ledger traceability.
```

### 3.5 Adjacent repair/classification paper: CodeCureAgent

**Paper:** [CodeCureAgent: Automatic Classification and Repair of Static Analysis Warnings](https://arxiv.org/abs/2509.11787), Joos et al., 2025.

Why it matters:

- It studies static analysis warnings as actionable units.
- It classifies and repairs warnings in 106 Java projects with 1,000 SonarQube warnings.
- It validates repair with build, warning disappearance, and tests.

How AEGIS should cite it:

- As adjacent work on warning classification and repair.
- Not as a direct baseline, because AEGIS does not repair and should not measure patch plausibility.
- CodeCureAgent shows that static-analysis warnings can be treated as actionable repair units. AEGIS stops before repair: it asks whether the triage decision itself is reconstructable and auditable.

### 3.6 Whole-repository detection contrast: IRIS

**Paper:** [IRIS: LLM-Assisted Static Analysis for Detecting Security Vulnerabilities](https://arxiv.org/abs/2405.17238), Li, Dutta, and Naik, 2024/2025.

Why it matters:

- It is an influential neuro-symbolic LLM + static-analysis system for whole-repository vulnerability detection.
- It curates CWE-Bench-Java with 120 manually validated vulnerabilities.

How AEGIS should distinguish itself:

- IRIS asks whether LLM-assisted static analysis can detect vulnerabilities.
- AEGIS asks whether SAST findings can be triaged through auditable evidence trails.
- AEGIS should not claim whole-repository vulnerability discovery.

### 3.7 C/C++ detection datasets to cite carefully

These are not direct SAST-triage-audit baselines, but they are important for explaining why AEGIS must preserve context and avoid function-only scoring.

- **[SecVulEval](https://arxiv.org/abs/2505.19828)**: important because it explicitly criticizes function-level labels and argues for statement-level C/C++ vulnerability evaluation with rich context. AEGIS should cite it to justify context/evidence granularity, not as a direct benchmark because AEGIS evaluates SAST finding triage and auditability rather than vulnerable-statement detection. SecVulEval motivates why function-only slices are insufficient for C/C++ vulnerability reasoning; AEGIS therefore uses build-target-scoped finding triage and evidence ledgers so caller/callee, compile context, and producer traces remain visible to reviewers.
- **[PrimeVul](https://arxiv.org/abs/2403.18624)**: important as a dataset-quality warning. It reports that prior vulnerability detection datasets can inflate model performance and emphasizes de-duplication, chronological splitting, and realistic evaluation. AEGIS should borrow the leakage/quality caution.
  - Dataset quality controls borrowed from PrimeVul: source-family de-duplication, leakage audit, hidden provenance ledger, no model-facing fix commits/advisories, explicit split policy, and no claim of general representativeness.
- **[DiverseVul](https://arxiv.org/abs/2304.00409)**: useful as a broad C/C++ vulnerability dataset reference. AEGIS should not rely on function-level vulnerable/non-vulnerable examples as the main benchmark because its task is warning triage plus trace audit.
- **[Devign](https://arxiv.org/abs/1909.03496)**: classic graph-based C vulnerability detection baseline/dataset. Cite as background showing the long line of code-representation vulnerability detection work, not as a direct comparison.
- **[CyberSecEval / PurpleLlama](https://arxiv.org/abs/2312.04724)**: broad LLM cybersecurity benchmark context. Useful for positioning LLM security evaluation, but not close to SAST triage auditability.

One-paragraph treatment rule: these datasets and benchmarks are important background for code vulnerability detection, but they do not evaluate fixed-warning triage auditability or evidence-ledger review behavior. Do not let them pull the paper back into repository-wide detection.

### 3.8 Benchmark validity guardrail: Agentic Benchmark Checklist

**Paper:** [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825), Zhu et al., 2025.

Why it matters:

- It identifies task validity and outcome validity as core requirements for agentic benchmarks.
- It shows benchmark design flaws can over- or under-estimate performance by large margins.
- It gives a checklist mindset for avoiding proxy success.

How AEGIS should use it:

- Every AEGIS metric must state what capability it measures and why the scoring outcome is valid.
- Trace completeness must not be used as a proxy for security correctness.
- Human audit accuracy must not be used as a proxy for universal SAST superiority.

### 3.9 Human-AI decision measurement lens

**Paper:** [From Accuracy to Readiness: Metrics and Benchmarks for Human-AI Decision-Making](https://arxiv.org/abs/2603.18895), Lee, 2026.

Why it matters:

- It argues that human-AI systems should be evaluated through outcomes, reliance/interaction, safety/harm, and learning/readiness rather than model accuracy alone.
- It emphasizes interaction traces, accept-on-wrong, changed-to-wrong, override behavior, near-misses, escalation, and governance signals.

How AEGIS should use it:

- Audit-effectiveness metrics should be computed from reviewer interaction traces.
- AEGIS should measure wrong-verdict detection, unsafe accept/suppression, defer behavior, confidence calibration, and time-to-decision.

**Related human-AI calibration paper:** [Effect of Confidence and Explanation on Accuracy and Trust Calibration in AI-Assisted Decision Making](https://arxiv.org/abs/2001.02114), Zhang, Liao, and Bellamy, 2020. This is useful because it warns that explanations/confidence do not automatically improve joint decisions; AEGIS must measure actual reviewer behavior, not just explanation satisfaction.

### 3.10 Static-analysis workflow motivation

**Paper/page:** [How Do Developers Act on Static Analysis Alerts? An Empirical Study of Coverity Usage](https://www.microsoft.com/en-us/research/publication/how-do-developers-act-on-static-analysis-alerts-an-empirical-study-of-coverity-usage/), Imtiaz et al., 2019.

Why it matters:

- It shows SAST alerts have a developer-actionability and lifespan problem, not merely an accuracy problem.
- Across five open-source projects using Coverity, actionable alert rates were reported around 27.4% to 49.5%, with a median 96-day fix lifespan.

How AEGIS should use it:

- As motivation that SAST triage is a workflow/review problem.
- As support for measuring auditability and reviewer effort.

The operational problem is not merely whether a SAST warning is true or false, but whether a reviewer can efficiently decide what to do with it. AEGIS therefore evaluates audit packets as review artifacts, not only as model outputs.

### 3.11 Industrial FP-reduction contrast: Reducing False Positives in Static Bug Detection with LLMs

**Paper:** [Reducing False Positives in Static Bug Detection with LLMs: An Empirical Study in Industry](https://arxiv.org/abs/2601.18844), Du et al., 2026.

Why it is close:

- It evaluates LLM-based false alarm reduction in an industrial static-analysis setting.
- It uses Tencent enterprise SAT alarms and reports 433 alarms: 328 false positives and 105 true positives.
- It motivates manual-review burden, reporting that inspection can cost roughly 10-20 minutes per alarm.
- It reports that hybrid LLM/static-analysis methods can remove a large fraction of false positives while preserving high recall.

Where AEGIS differs:

- That work asks whether LLMs can reduce false alarms in industry.
- AEGIS asks whether the resulting decision can be audited through evidence refs, producer traces, and claim boundaries.

How AEGIS uses it:

- motivation for `time_to_decision`;
- motivation for `unsafe_suppression_rate` and recall-preserving safety;
- motivation for `cost_per_auditable_decision`;
- not a direct baseline.

### 3.12 Vulnerability explanations and practitioner behavior

**Paper:** [How vulnerability explanations help software practitioners confirm and fix code vulnerabilities](https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html), Al Debeyan et al., 2026.

Why it matters:

- It studies whether explanations help practitioners confirm and fix vulnerabilities.
- It surveyed 99 software practitioners and compared explanation forms including vulnerable lines, vulnerability type, short-form text, and long-form text.
- It reports that explanation form affects practitioner behavior; short-form text explanations can outperform stated preference for longer explanations.

Where AEGIS differs:

- Vulnerability-explanation work evaluates explanatory context for confirmation/fixing.
- AEGIS distinguishes ordinary explanation text from trace-auditable evidence packets.

How AEGIS uses it:

```text
B1 raw LLM rationale      = explanation-only baseline
B2 evidence dump          = context without trace discipline
B3/B4 AEGIS ledger packet = evidence + trace + claim-boundary audit artifact
```

Prior explanation studies support measuring actual reviewer behavior rather than explanation satisfaction alone.

## 4. External benchmark artifacts to reference, not blindly adopt

| Benchmark/artifact | Source | Useful for AEGIS | Why not enough by itself |
|---|---|---|---|
| SastBench | SastBench paper | Closest SAST triage benchmark; optional appendix sanity check | Binary TP/FP, not trace-audit/human audit; negatives heuristic. |
| OWASP Benchmark | [OWASP Benchmark](https://owasp.org/www-project-benchmark/) | Controlled labels, scorecards, common baseline in SAST papers | Java/web/synthetic; tests tool detection more than evidence-ledger auditability. |
| SARD / Juliet | [NIST SARD](https://www.nist.gov/itl/csd/secure-systems-and-applications/samate/software-assurance-reference-dataset-sard) | C/C++ synthetic weaknesses; possible unit stressors | Synthetic; not realistic SAST triage distribution; not enough for human audit claim. |
| Vul4J | [Vul4J GitHub](https://github.com/tuhh-softsec/vul4j) | Real-world reproducible vulnerabilities; useful model for oracle cards | Java; patch-derived; AEGIS target is C/C++; direct use not main. |
| SecVulEval | [SecVulEval](https://arxiv.org/abs/2505.19828) | C/C++ context-rich vulnerability evaluation reference | Detection/localization benchmark, not SAST alert audit benchmark. |
| PrimeVul | [PrimeVul](https://arxiv.org/abs/2403.18624) | Dataset-quality/leakage warning | Function/detection framing, not trace-audit workflow. |
| DiverseVul / Devign | [DiverseVul](https://arxiv.org/abs/2304.00409), [Devign](https://arxiv.org/abs/1909.03496) | C/C++ vulnerability dataset background | Mostly function/graph classification; no audit packet measurement. |
| CWE-Bench-Java | IRIS | Shows manually validated repository-level vulnerability benchmark pattern | Java detection benchmark; AEGIS is triage/audit. |
| OpenVuln | ZeroFalse | Real-world SAST alert benchmark idea | Not a public canonical fit for AEGIS C/C++ auditability unless reproduced. |
| Tencent industrial false-alarm dataset | [Du et al. 2026](https://arxiv.org/abs/2601.18844) | Industrial false-positive reduction motivation, review-cost/cost-saving framing | Not public C/C++ TraceAudit benchmark; main claim is FP reduction. |
| Vulnerability explanation practitioner study | [Al Debeyan et al. 2026](https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html) | Human-audit/explanation behavior lens | Not SAST fixed-warning trace-ledger benchmark. |

Conclusion: AEGIS should build **AEGIS-TraceAudit**, a design-evaluation suite, and optionally run a **SastBench-compatible sanity check** if feasible. It should not pretend OWASP/SARD/Vul4J alone answer the trace-audit question.

## 5. Final benchmark architecture

AEGIS-TraceAudit should be four linked evaluations:

```text
AEGIS-Trace50      = system artifact and traceability benchmark
AEGIS-Audit120     = human/security-reviewer audit-effectiveness benchmark
AEGIS-FaultBench   = trace-fault injection and validator benchmark
AEGIS-TriageQ      = secondary triage-quality preservation sanity study
```

The first three are the paper's core. The fourth is secondary.

### Primary success rule

AEGIS-TraceAudit supports the main audit-effectiveness claim only if all required gates below hold:

```text
1. B4 Full AEGIS packet improves either audit_accuracy or
   wrong_verdict_detection_rate over B2 Evidence-enriched rationale, no ledger,
   with a positive effect estimate and either a confidence interval excluding zero
   or a pre-registered practically meaningful margin.

2. B4 does not increase unsafe_accept_rate or unsafe_suppression_rate over B2
   beyond a pre-registered harm margin, recommended initial margin: +5 percentage points.

3. Trace50 engineering floors pass:
   trace_completeness_rate >= 0.95,
   claim_without_evidence_rate <= 0.05,
   boundary_violation_rate = 0 on validator-detectable rules.

4. FaultBench mechanical_validator_detection_rate >= 0.95.
```

Why B2 is the primary comparator: B2 receives the same S4/S5 evidence rows as B4 but lacks evidenceRef resolution, producer trace, claim-evidence links, and claim-boundary annotations. Therefore B4-vs-B2 isolates the value of trace-auditable ledger structure rather than merely giving reviewers more context.

B0 and B1 remain necessary baselines, but they are not sufficient for the headline claim. B3 isolates artifact-only effects. TriageQ remains secondary preservation evidence.

## 6. Benchmark 1: AEGIS-Trace50

### Purpose

Measure whether AEGIS can create trace-complete audit artifacts over admitted build targets.

### Unit

- 1 build target = 1 analysis case.
- No TP/FP oracle required for every finding.
- All generated SAST findings are included in the artifact graph.

### Required input

50 admitted build targets:

- C/C++ only for the main AEGIS paper.
- Source root exists.
- Compile context exists or is generated before admission.
- S4 can produce static evidence.
- S5 can produce target-scoped Code KB / Source Code KG context.

Build recovery is out of scope. Compile context preparation is a dataset construction step.

### Required output per case

At minimum:

```text
case-manifest.json
state-trace.jsonl
s4-static-evidence.raw.json
s4-static-evidence.normalized.json
s5-code-kb.normalized.json
s5-finding-context.normalized.jsonl
evidence-ledger.jsonl
analysis-envelope.json
llm-transcript.jsonl
normalization-report.jsonl
```

### Denominator policy

Trace50 metrics must name their denominator explicitly:

```text
admitted_target_count
completed_case_count
finding_with_final_record_count
finding_with_machine_verdict_count
evidence_ref_count
ledger_row_count
producer_diagnostic_count
```

`E_ref` includes all evidence references cited by:

- accepted TP rationale;
- rejected FP rationale;
- UNKNOWN rationale;
- claim-boundary note;
- machine verdict summary;
- reviewer-facing audit packet summary.

### Primary metrics

Let `C` be completed cases, `F` be findings with final triage records, `E_ref` be evidence references cited by final claims, and `E_resolved` be cited evidence references that resolve to a ledger row with producer trace.

| Metric | Definition | Target interpretation |
|---|---|---|
| `case_completion_rate` | cases reaching `PAPER_EXPORT_READY` / admitted cases | System feasibility. |
| `s4_ready_rate` | cases reaching `S4_STATIC_EVIDENCE_READY` / admitted cases | S4 producer availability. |
| `s5_ready_rate` | cases reaching `S5_CODE_KB_READY` / admitted cases | S5 code-KB availability. |
| `trace_completeness_rate` | `E_resolved / E_ref` | Can cited evidence be audited? |
| `claim_evidence_coverage` | final TP/FP/UNKNOWN claim records with >=1 evidence/ref or diagnostic rationale / final claim records | Are verdicts grounded or explicitly bounded? |
| `claim_without_evidence_rate` | TP/FP claims without supporting evidence refs / TP/FP claims | Must trend to zero. |
| `producer_trace_coverage` | ledger evidence rows with producer trace / ledger evidence rows | Producer-level auditability. |
| `boundary_violation_rate` | decisions violating S4/S5 claim boundaries / decisions | E.g., S4 empty => safe, S5 no-hit => safe/vulnerable. |
| `diagnostic_separation_rate` | producer diagnostics reported as diagnostics / producer diagnostics | Diagnostics must not become security evidence. |
| `orphan_evidence_rate` | ledger evidence unused by any claim / ledger evidence rows | Not a failure by itself; measures over-collection. |

### Acceptance floor for a first paper submission

These should be stated as engineering acceptance criteria, not scientific hypotheses:

```text
case_completion_rate >= 0.80
trace_completeness_rate >= 0.95
claim_without_evidence_rate <= 0.05
producer_trace_coverage >= 0.98
boundary_violation_rate = 0 on validator-detectable rules
diagnostic_separation_rate = 1.00 on validator-detectable diagnostics
```

## 7. Benchmark 2: AEGIS-Audit120

### Purpose

Measure whether AEGIS audit packets help security-trained reviewers verify, overturn, or defer SAST triage decisions better than conventional packets.

### Unit

- One SAST finding / claim candidate.
- Sampled from AEGIS-Trace50 findings.
- 80-120 labeled cases recommended.

### Oracle labels

Each sampled finding gets an oracle card:

```text
TP       = finding corresponds to a real actionable vulnerability under the scoped case.
FP       = finding should be rejected under the scoped case.
UNKNOWN  = available visible evidence is insufficient for a responsible TP/FP decision.
Excluded = case invalid for evaluation after adjudication.
```

Important: UNKNOWN is not a service failure. It is a valid triage outcome.

UNKNOWN reason taxonomy:

```text
UNKNOWN_INSUFFICIENT_CONTEXT  = visible evidence cannot support TP or FP responsibly
UNKNOWN_CONFLICTING_EVIDENCE  = reliable evidence points in incompatible directions
UNKNOWN_PRODUCER_DIAGNOSTIC   = producer failure/partial result prevents safe verdict
UNKNOWN_OUT_OF_SCOPE          = finding is outside the scoped build target or benchmark claim
UNKNOWN_CLAIM_BOUNDARY        = evidence exists but cannot support the requested security claim
```

Scoring policy:

- UNKNOWN is appropriate only when the oracle card or reviewer adjudication marks the case as evidence-insufficient, conflicting, diagnostic-limited, out-of-scope, or boundary-limited.
- UNKNOWN is not rewarded on clear TP or clear FP cases.
- Report UNKNOWN rate, decided-only accuracy, and appropriate-defer rate together to prevent UNKNOWN gaming.

### Audit120 denominator floors

Audit120 is sampled by audit stressor, not by cosmetic label balance. However, primary safety metrics require minimum denominators to avoid unstable claims:

```text
For primary reporting:
  oracle TP >= 20
  oracle FP >= 20
  oracle UNKNOWN >= 10
  machine-wrong cases under B4 >= 10

If a denominator floor is not met:
  affected metric is reported descriptively only;
  corresponding RQ is weakened to exploratory.
```

These floors do not mean the suite should be optimized for pretty label ratios. They only define the minimum support required before making primary claims about unsafe suppression, unsafe accept, appropriate defer, or wrong-verdict detection.

### Oracle card schema

Each Audit120 oracle card should include:

```text
caseId
findingId
oracleLabel: TP | FP | UNKNOWN | Excluded
oracleReason
unknownReason: UNKNOWN_INSUFFICIENT_CONTEXT | UNKNOWN_CONFLICTING_EVIDENCE |
               UNKNOWN_PRODUCER_DIAGNOSTIC | UNKNOWN_OUT_OF_SCOPE |
               UNKNOWN_CLAIM_BOUNDARY | null
adjudicationLevel: author_only | external_agreed | third_reviewer | provenance_escalated
visibleEvidenceUsed: [evidenceRef]
hiddenProvenanceUsed: true | false
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
reviewerVisible: true | false
safetyHarmClass: false_accept_harm | false_suppression_harm | low_harm | not_applicable
```

Hidden provenance may be used for oracle adjudication, but it must not leak into visible reviewer packets unless an appendix condition explicitly tests CVE-aware Threat KB.

### Sampling rule

Do not sample only for label balance. Sample for **audit stressors**:

- simple source-to-sink SAST warning;
- cross-function/caller-callee context needed;
- sanitizer/check near the flow;
- library/API misuse;
- Threat KB context likely relevant;
- Code KB context likely relevant;
- SAST tool disagreement;
- evidence-insufficient UNKNOWN candidate;
- producer diagnostic / bounded-partial evidence case;
- high-risk false suppression case.

Keep label distribution visible, but do not optimize the suite for a pretty balance.

### Packet conditions

| Condition | Reviewer sees | Capability tested |
|---|---|---|
| B0 SAST-only | SAST warning, rule, severity, primary snippet/path | Conventional alert triage baseline. |
| B1 Raw LLM rationale | B0 + same-backbone LLM verdict/rationale | Explanation-only baseline; not a model-performance baseline. Tests whether ordinary natural-language AI explanation without evidence refs/producer traces is enough. |
| B2 Evidence-enriched rationale, no ledger | B0 + same S4/S5 evidence rows as B4, presented as unstructured snippets/dump without evidenceRef/producer trace/claim links | ZeroFalse/QASecClaw-like contextual review baseline; tests whether more context alone is enough. |
| B3 AEGIS ledger, verdict hidden | Evidence ledger, producer trace, claim links, boundaries, but no machine verdict | Whether the artifact itself helps human analysis. |
| B4 Full AEGIS packet | B3 + AEGIS verdict + UNKNOWN rationale, preferably with sequential reveal | End-to-end decision-support and reliance condition. |
| B5 Ablations | e.g., no Code KB, no Threat KB, no claim links | Contribution of layers. |

### Packet presentation control

B2 and B4 must control for UI and packet-size confounds:

```text
B2 and B4 use the same underlying S4/S5 evidence rows and the same reviewer UI container.

B2 removes:
  - evidenceRef links;
  - producer trace metadata;
  - claim-evidence linkage;
  - claim-boundary annotations;
  - explicit ledger navigation.

B2 retains:
  - the same source snippets;
  - the same SAST message;
  - the same Code KB / Threat KB evidence text;
  - the same evidence ordering policy unless ordering itself is the tested ledger feature.

Packet length, snippet window, and evidence count are capped identically across B2 and B4.
```

Record these covariates for analysis:

```text
packet_size_tokens
evidence_row_count
snippet_line_count
visible_file_count
visible_function_count
```

The time-to-decision model should include `log(packet_size_tokens)` as a fixed-effect covariate when sample size permits. This prevents claiming a ledger effect when the result is merely a formatting or length effect.

### Reviewer task

For each packet, reviewer records:

```text
label: TP | FP | UNKNOWN | Excluded
machine_verdict_action: accept | overturn | defer | not_shown
key_evidence_ids: [..]
evidence_sufficiency: 1-5
confidence: 0-100
time_to_decision_seconds
notes
pre_verdict_label: TP | FP | UNKNOWN | Excluded | not_collected
post_verdict_label: TP | FP | UNKNOWN | Excluded | not_collected
changed_to_wrong: true | false | not_applicable
changed_to_right: true | false | not_applicable
accept_on_wrong: true | false | not_applicable
override_on_wrong: true | false | not_applicable
underuse_on_correct: true | false | not_applicable
```

### B4 sequential reveal protocol

For B4, prefer sequential reveal so reliance behavior is measurable:

```text
Phase A: reviewer sees AEGIS ledger without verdict and records provisional TP/FP/UNKNOWN.
Phase B: reviewer sees AEGIS machine verdict and records final action.
```

B3 tests whether the audit artifact itself helps human analysis. B4 tests whether the artifact plus machine verdict improves decision support. Sequential reveal makes `changed_to_wrong`, `accept_on_wrong`, `override_on_wrong`, and `underuse_on_correct` measurable instead of speculative.

### Design recommendation

Minimum viable human/expert study:

```text
reviewers: 4-6 security-trained participants
cases: 60-120 warning cases
conditions: B0-B4, with B5 on a subset
assignment: Latin-square / balanced incomplete block
constraint: same reviewer should not see the same finding under multiple packet conditions
replication: each finding-condition should have at least 2 independent judgments where feasible
```

Practical workload plan:

```text
Primary design:
  60 cases x 5 conditions x 1 judgment = 300 review tasks
  6 reviewers -> 50 tasks per reviewer

Reliability subset:
  20 cases x 5 conditions x second judgment = 100 extra tasks

Total recommended minimum:
  400 review tasks
```

This is more realistic than requiring two independent judgments for every case-condition pair. Inter-reviewer reliability is computed on the reliability subset.

Reviewer blinding and task ordering:

```text
Blinding:
  - reviewer does not know packet condition label B0-B4, except where impossible from UI affordances;
  - oracle labels are hidden;
  - project/CVE/fix/advisory provenance is hidden;
  - reviewer sees only visible bundle material.

Ordering:
  - task order randomized per reviewer;
  - no consecutive tasks from the same build target when avoidable;
  - condition order balanced across reviewers;
  - warm-up cases are excluded from analysis;
  - the same reviewer should not see the same finding under multiple packet conditions.
```

If human reviewers cannot be recruited, the paper must weaken its claim: it may report traceability and expert-case studies, but it cannot strongly claim human audit effectiveness.

### Primary metrics

Let `y_j` be oracle label, `h0_j` reviewer initial/no-AEGIS label if collected, `a_j` machine verdict, `h1_j` reviewer final label, and `t_j` time.

| Metric | Definition | Why it matters |
|---|---|---|
| `audit_accuracy` | `P(h1 = y)` | Reviewer correctness. |
| `time_to_decision` | median/mean seconds, log-modeled | Review efficiency. |
| `wrong_verdict_detection_rate` | machine-wrong cases where reviewer overturns or defers / machine-wrong cases | Can audit packet expose errors? |
| `unsafe_accept_rate` | oracle FP but final reviewer/machine accepts TP / oracle FP | Avoid false alarm escalation. |
| `unsafe_suppression_rate` | oracle TP but final reviewer/machine suppresses as FP / oracle TP | Avoid hiding real vulnerabilities. |
| `appropriate_defer_rate` | oracle UNKNOWN/evidence-insufficient cases resolved as UNKNOWN/defer / such cases | UNKNOWN discipline. |
| `confidence_calibration` | confidence vs correctness, e.g. Brier/ECE-style or reliability curve | Avoid overconfident wrong decisions. |
| `evidence_sufficiency_score` | reviewer Likert 1-5 | Subjective but useful when paired with accuracy/time. |
| `team_gain_vs_sast` | final reviewer accuracy under packet condition - B0 accuracy | Human-AI team value. |
| `error_amplification_rate` | correct initial/reasonable baseline decision changed to wrong after AI/verdict exposure | Safety signal from human-AI readiness literature. |

### Primary statistical model

Recommended analysis:

```text
mixed-effects logistic regression for correctness/safety outcomes
  fixed effect: packet condition
  random intercepts: reviewer, finding/case

mixed-effects regression on log(time_to_decision)
  fixed effect: packet condition
  random intercepts: reviewer, finding/case

report effect sizes and confidence intervals, not only p-values
```

Headline claim should be conservative:

> AEGIS audit packets improved reviewer-verifiable triage behavior over SAST-only, raw LLM rationale, and unstructured evidence dump under the studied warning-case suite.

## 8. Benchmark 3: AEGIS-FaultBench

### Purpose

If trace-auditability is the claim, the benchmark must show that broken traces can be detected.

### Method

Start from valid AEGIS audit packets and inject controlled faults:

| Fault | Example |
|---|---|
| F1 missing evidence ref | claim cites `evidenceRef` absent from ledger |
| F2 wrong location | evidence ref points to a different file/function |
| F3 boundary misuse | S4 `empty` surface used as safe evidence |
| F4 S5 no-hit misuse | S5 no-hit used as vulnerable/safe conclusion |
| F5 diagnostic misuse | producer diagnostic used as security evidence |
| F6 contradictory support | TP verdict supported only by FP-rejection evidence |
| F7 stale evidence | evidence from another build target/case |
| F8 missing producer trace | ledger row lacks producer trace |

### Fault classes

Separate fault types by what can be detected mechanically:

```text
mechanically checkable:
  missing ref
  missing producer trace
  malformed ref
  stale caseId/buildTargetId
  S4 empty/no-hit boundary misuse
  S5 no-hit boundary misuse
  diagnostic-as-security-evidence misuse

human-semantic:
  wrong but plausible source location
  misleading but syntactically valid rationale
  contradictory evidence that requires code/security interpretation
```

Do not require a 95% automated floor for semantic faults that require human security judgment.

FaultBench ordering policy:

```text
reviewers assigned to Audit120 complete normal audit tasks before seeing injected-fault training examples;
FaultBench reviewer tasks are separated into a later block or a separate reviewer group;
if the same reviewers are used, the fault-type list is not disclosed before Audit120;
mechanical validator results are computed independently of human reviewer results.
```

This prevents reviewers from entering Audit120 in an artificial "fault hunting" mode.

### Metrics

| Metric | Definition |
|---|---|
| `validator_detection_rate` | injected faults caught by automated validator / injected faults |
| `reviewer_detection_rate` | injected faults caught by reviewers / injected faults shown |
| `time_to_detect_fault` | seconds until reviewer flags issue |
| `false_alarm_rate` | valid packets incorrectly flagged as faulty |
| `fault_escape_rate` | injected faults not caught by validator or reviewer |

### Acceptance floor

```text
mechanical_validator_detection_rate >= 0.95 for schema/ref/boundary faults that are mechanically checkable
false_alarm_rate <= 0.05 on clean packets
semantic_reviewer_detection_rate reported descriptively with confidence intervals
```

FaultBench is a strong differentiator against papers that only report F1.

## 9. Benchmark 4: AEGIS-TriageQ secondary preservation sanity study

### Purpose

Show that auditability is obtained without destroying triage quality, and quantify layer contributions. It does not ask whether AEGIS is the best SAST triage classifier.

### Conditions

```text
C0 SAST-only heuristic / original SAST output
C1 same-backbone raw LLM rationale
C2 same-backbone evidence dump, no ledger
C3 same-backbone full AEGIS
C4 AEGIS no Code KB
C5 AEGIS no Threat KB
C6 AEGIS no claim-boundary/ledger links
Optional appendix: frontier raw rationale, no parity claim
```

B5 ablation scope cap:

```text
B5a no Code KB
B5b no Threat KB
B5c no claim-evidence links

B5 runs only on a stratified subset of Audit120, recommended 30-40 cases.
B5 is not part of the primary Audit120 comparison.
No additional ablations are added without a written reason and a power/workload check.
```

### Metrics

```text
TP_accept_recall
FP_rejection_rate
balanced_triage_utility = 0.5 * TP_accept_recall + 0.5 * FP_rejection_rate
precision
UNKNOWN_rate
UNKNOWN_appropriateness
latency
cost_per_auditable_decision
```

Do not headline raw Qwen vs frontier. If frontier is included, it is a reference line only.

## 10. Metric validity checklist

Every metric must state what capability it measures and what it does **not** measure. This is the Agentic Benchmark Checklist safeguard against proxy success.

| Metric | Capability measured | Not measured | Failure if misused |
|---|---|---|---|
| `trace_completeness_rate` | Evidence reference resolvability and producer-trace coverage. | Security correctness. | A high trace-completeness packet can still support a wrong verdict. |
| `claim_without_evidence_rate` | Whether TP/FP claims cite auditable support. | Whether cited support is semantically sufficient. | A low rate can hide weak but cited evidence. |
| `boundary_violation_rate` | Whether producer status/no-hit/diagnostic surfaces are misused as security conclusions. | All possible unsound reasoning. | Validator-detectable boundary safety is mistaken for full semantic safety. |
| `audit_accuracy` | Reviewer correctness under packet condition. | Universal SAST superiority. | Curated suite results are overgeneralized. |
| `time_to_decision` | Review efficiency under packet condition, adjusted for packet size where possible. | Correctness or safety by itself. | Faster wrong decisions are treated as success, or packet length/UI confounds are mistaken for ledger value. |
| `wrong_verdict_detection_rate` | Reviewer ability to catch machine errors. | Machine precision. | Requires enough machine-wrong cases; otherwise unstable. |
| `unsafe_suppression_rate` | Harm of suppressing true vulnerabilities. | General false-positive burden. | Aggregate accuracy hides severe TP suppression. |
| `appropriate_defer_rate` | Uncertainty discipline under insufficient/conflicting evidence. | System correctness by refusal. | UNKNOWN inflation is rewarded unless paired with decided-only accuracy and UNKNOWN appropriateness. |
| `evidence_sufficiency_score` | Reviewer-perceived sufficiency. | Objective security correctness. | Satisfaction is mistaken for faithful evidence. |
| `cost_per_auditable_decision` | Cost/latency of producing a reviewable packet. | Security value by itself. | Cheap packets with poor audit quality appear attractive. |

## 11. Final research questions and hypotheses

### RQ1 — Traceability feasibility

Can AEGIS produce trace-complete audit packets for admitted build-target SAST findings?

- Main metrics: `trace_completeness_rate`, `producer_trace_coverage`, `claim_without_evidence_rate`, `boundary_violation_rate`.
- Evidence source: AEGIS-Trace50.

### RQ2 — Audit effectiveness

Do AEGIS audit packets help reviewers make correct audit decisions faster and safer than SAST-only, raw LLM rationale, or evidence dump packets?

- Main metrics: `audit_accuracy`, `time_to_decision`, `wrong_verdict_detection_rate`, `unsafe_accept_rate`, `unsafe_suppression_rate`.
- Evidence source: AEGIS-Audit120.

### RQ3 — Uncertainty discipline

Does AEGIS improve appropriate UNKNOWN/defer behavior under insufficient evidence?

- Main metrics: `appropriate_defer_rate`, `UNKNOWN_appropriateness`, `boundary_violation_rate`.
- Evidence source: Audit120 + FaultBench.

### RQ4 — Trace robustness

Can AEGIS validators and reviewers detect invalid evidence references, boundary misuse, and stale producer traces?

- Main metrics: `validator_detection_rate`, `reviewer_detection_rate`, `fault_escape_rate`.
- Evidence source: FaultBench.

### RQ5 — Evidence layer contribution

Which layers matter for auditability: SAST trace, Code KB, Threat KB, claim links, or the full ledger?

- Main metrics: ablation deltas in accuracy, time, evidence sufficiency, wrong-verdict detection, and boundary violations.
- Evidence source: Audit120 B5 + TriageQ.

## 12. Reviewer-objection preemption

| Likely objection | Answer in paper design |
|---|---|
| "This is just another SAST FP-reduction paper." | Primary comparison is audit packet condition, not model/agent F1. Related work already covers FP-reduction; AEGIS measures trace-auditable review. |
| "Why not compare directly to SastBench?" | SastBench is a binary agentic triage benchmark. AEGIS-TraceAudit is complementary; optional appendix can run a compatible subset, but main claim is auditability. |
| "How do you know auditability helps?" | Human/security-trained reviewer study measures time, accuracy, wrong-verdict detection, unsafe suppression, and defer behavior. |
| "Evidence ledger may be correct-looking but wrong." | FaultBench injects wrong refs, stale refs, diagnostic misuse, and boundary violations; validators/reviewers must detect them. |
| "UNKNOWN can inflate safety by refusing decisions." | Report coverage, appropriate defer rate, decided-only accuracy, and utility; UNKNOWN is scored against oracle UNKNOWN/evidence-insufficient cases, not always rewarded. |
| "Human study is small." | Use mixed-effects models, balanced assignment, confidence intervals, and frame as design-evaluation suite rather than universal SAST leaderboard. |
| "Dataset is curated/cherry-picked." | Sample audit stressors explicitly; publish manifest/rationale; do not claim representativeness over all SAST findings. |
| "S5 retrieval can leak oracle data." | Main condition uses generic Threat KB only; CVE IDs/fix commits/advisory text are hidden unless an appendix CVE-aware condition explicitly discloses leakage risk. |
| "Old protocols say Qwen/frontier parity." | Deprecated. This master plan supersedes H1/H1-dump/frontier parity as paper direction. |

## 13. Artifact contract for AEGIS-TraceAudit

A future experiment artifact should look like this:

```text
AEGIS-TraceAudit/
  README.md
  sources-and-licenses.md
  build-targets/
    target-manifest.jsonl
    admission-report.jsonl
    compile-contexts/
  trace50/
    cases/{caseId}/
      case-manifest.json
      state-trace.jsonl
      s4-static-evidence.raw.json
      s4-static-evidence.normalized.json
      s5-code-kb.normalized.json
      s5-finding-context.normalized.jsonl
      evidence-ledger.jsonl
      analysis-envelope.json
      llm-transcript.jsonl
      normalization-report.jsonl
  audit120/
    finding-manifest.jsonl
    oracle-cards/
    packet-conditions/
      B0-sast-only/
      B1-raw-llm-rationale/
      B2-evidence-dump/
      B3-ledger-verdict-hidden/
      B4-full-aegis/
      B5-ablations/
    reviewer-assignments.jsonl
    reviewer-results.jsonl
    reviewer-interaction-traces.jsonl
  faultbench/
    clean-packets/
    injected-faults.jsonl
    validator-results.jsonl
    reviewer-results.jsonl
  aggregate/
    traceability-metrics.json
    audit-effectiveness-metrics.json
    faultbench-metrics.json
    triage-quality-metrics.json
    statistical-models.md
```

## 14. How to revise the old experiment protocol

The legacy experiment protocol path previously discussed, `/home/kosh/aegis-for-paper/artifacts/experiment-protocol.md`, was not present as a live file during this pass and appears as deleted/archived in the local paper workspace. If it reappears or is restored, prepend the deprecation banner from section 1 and revise it as follows:

1. Demote or remove frontier parity / TOST equivalence as the main hypothesis.
2. Replace raw Qwen vs raw frontier tables with packet-condition comparisons.
3. Keep one raw LLM rationale baseline using the same backbone as AEGIS.
4. Move frontier raw rationale to appendix-only optional sensitivity analysis.
5. Add Trace50, Audit120, FaultBench, and TriageQ as separate benchmark layers.
6. Add human-audit assignment, interaction logging, and mixed-effects analysis.
7. Add leak-prevention rules for CVE/fix/advisory data in visible packets.
8. Add ABC-inspired task-validity and outcome-validity checklist.

## 15. Final paper direction

The paper should not be titled or framed as:

- "Qwen3.6 catches up to frontier models for SAST triage."
- "A multi-agent SAST false-positive filter."
- "A new general vulnerability detector."

It should be framed as:

> **AEGIS: A Trace-Auditable Architecture for TP/FP/UNKNOWN Triage of Static-Analysis Findings**

Recommended contribution list:

1. A trace-auditable SAST triage architecture separating static evidence production, contextual knowledge retrieval, and final evidence-guided triage.
2. An evidence ledger and claim-boundary contract that makes verdicts reconstructable and prevents producer diagnostics/no-hit/empty surfaces from becoming unsafe negative evidence.
3. AEGIS-TraceAudit, a design-evaluation benchmark measuring trace completeness, audit effectiveness, trace fault detectability, and secondary triage quality.
4. An empirical audit-study protocol comparing SAST-only, raw LLM rationale, evidence dump, ledger-without-verdict, and full AEGIS audit packet conditions.

## 16. Source index

Primary sources used in this plan:

- SastBench: https://arxiv.org/abs/2601.02941
- Sifting the Noise: https://arxiv.org/abs/2601.22952
- ZeroFalse: https://arxiv.org/abs/2510.02534
- QASecClaw: https://arxiv.org/abs/2605.01885
- CodeCureAgent: https://arxiv.org/abs/2509.11787
- IRIS: https://arxiv.org/abs/2405.17238
- Agentic Benchmark Checklist: https://arxiv.org/abs/2507.02825
- Human-AI readiness metrics: https://arxiv.org/abs/2603.18895
- Confidence/explanation calibration: https://arxiv.org/abs/2001.02114
- OWASP Benchmark: https://owasp.org/www-project-benchmark/
- NIST SARD: https://www.nist.gov/itl/csd/secure-systems-and-applications/samate/software-assurance-reference-dataset-sard
- Vul4J: https://github.com/tuhh-softsec/vul4j
- Coverity usage study page: https://www.microsoft.com/en-us/research/publication/how-do-developers-act-on-static-analysis-alerts-an-empirical-study-of-coverity-usage/
- Vulnerability explanation practitioner study: https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html
- Industrial LLM FP reduction: https://arxiv.org/abs/2601.18844

## 17. Critic review incorporation

Critic review returned `PASS_WITH_CHANGES`. The review agreed that the direction should move from Qwen-vs-frontier performance to auditability/traceability as the central claim, with model comparison demoted to secondary ablation. Required changes and how they were incorporated:

- **Problem definition added**: this page now defines input, output, case/scoring/evidence/export units, and S3/S4/S5 role boundaries.
- **Non-goals added**: explicitly excludes model leaderboard, vulnerability discovery, vulnerability absence proof, build recovery, production reliability, and S4/S5 final verdict ownership.
- **Metric families separated**: traceability/auditability metrics are separate from automated triage quality metrics.
- **Reviewer audit protocol expanded**: B0-B5 packet conditions, reviewer tasks, assignment constraints, and mixed-effects analysis are defined.
- **Threats and objections added**: reviewer-objection table covers traceability-vs-correctness, explanation faithfulness, UNKNOWN gaming, synthetic/real-world gap, S5 TBD, and oracle leakage.
- **Additional related work incorporated**: SecVulEval, PrimeVul, DiverseVul, Devign, and CyberSecEval are added as C/C++ detection/security-eval context, with clear non-direct-baseline boundaries.
- **Acceptance criteria clarified**: unsupported, overclaimed, traceable, boundary violation, and correct UNKNOWN are explicitly defined.

Residual caveat: S5 contract remains provisional. This page intentionally defines measurement requirements that S5 must eventually satisfy, without freezing S5 endpoint/schema details.


## 18. Final anchor hardening incorporated after external review

A later paper-direction review judged this document usable as the anchor, with required hardening rather than a direction change. The following updates were incorporated:

- canonical-anchor status and deprecation language for legacy Qwen/frontier parity protocols;
- explicit S5 minimum paper evidence semantics and leakage policy;
- producer-boundary contract elevated as the core auditability thesis;
- metric-validity checklist mapping every primary metric to what it measures and does not measure;
- B4 sequential reveal protocol plus reliance/error-amplification logging fields;
- Audit120 workload plan with 300 primary tasks plus a 100-task reliability subset;
- UNKNOWN reason taxonomy and anti-gaming scoring policy;
- FaultBench split into mechanically checkable vs human-semantic faults;
- industrial LLM false-alarm reduction and vulnerability-explanation practitioner studies added as related work;
- TriageQ renamed and scoped as a secondary triage-quality preservation sanity study.
- Freeze-readiness hardening added: primary success rule, packet presentation controls, denominator floors, reviewer blinding/order policy, oracle card schema, FaultBench ordering policy, B5 ablation cap, and S5_FREEZE_GATE.
