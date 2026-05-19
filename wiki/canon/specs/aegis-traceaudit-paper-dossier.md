---
title: "AEGIS TraceAudit Paper Dossier"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/aegis-traceaudit-benchmark-master.md"
  - "wiki/canon/api/paper-analysis-api.md"
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
  - "https://arxiv.org/abs/2601.02941"
  - "https://arxiv.org/abs/2510.02534"
  - "https://arxiv.org/abs/2601.22952"
  - "https://arxiv.org/abs/2605.01885"
  - "https://arxiv.org/abs/2601.18844"
  - "https://arxiv.org/abs/2603.18895"
  - "https://arxiv.org/abs/2507.02825"
  - "https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "paper-pipeline", "paper-dossier", "traceaudit"]
decision_tags: ["paper-narrative", "traceaudit", "auditability", "sast-triage", "human-audit", "evidence-ledger", "freeze-before-results"]
related_pages: ["wiki/canon/specs/aegis-traceaudit-benchmark-master.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md"]
---

# AEGIS TraceAudit Paper Dossier

> Status: pre-experiment paper dossier.
> Purpose: collect the paper identity, story, plot, benchmark contract, result-independent narrative, and result-dependent interpretation branches in one place.
> Anchor: `wiki/canon/specs/aegis-traceaudit-benchmark-master.md`.
> Red line: do not revive Qwen/frontier parity, H1/H1-dump, TOST, or model-SOTA framing as the main paper story.

## 0. What can be frozen before experiments

The paper's **identity, plot, problem framing, method contract, benchmark design, and interpretation frame** can be frozen before results.

The paper's **empirical claims** cannot be frozen before results. They are filled into pre-defined result branches.

Frozen now:

```text
AEGIS is a trace-auditable architecture for TP/FP/UNKNOWN triage of static-analysis findings.
```

Not frozen now:

```text
AEGIS improves reviewer accuracy by X.
AEGIS reduces review time by Y.
AEGIS improves triage F1 by Z.
```

The paper no longer lives or dies on raw model performance. It lives or dies on whether the system can produce audit packets and whether those packets are empirically useful or, if not useful, diagnostically informative.

## 1. One-sentence thesis

> Static-analysis findings are not only a classification problem; they are a review workflow problem. AEGIS makes SAST triage decisions trace-auditable by linking TP/FP/UNKNOWN verdicts to producer-bounded evidence, claim boundaries, diagnostics, and reviewer-facing audit packets.

## 2. The plot in five moves

### Move 1 — SAST triage is a workflow problem, not just a scoring problem

SAST tools produce noisy findings. Recent LLM work tries to classify or filter those findings. But a security engineer's operational need is not merely a TP/FP label; it is a decision artifact that can be verified, overturned, or deferred.

This move is independent of experiment results.

### Move 2 — Existing LLM-SAST work optimizes decision correctness or FP reduction, not trace-auditability

Closest prior work:

- SastBench: agentic SAST triage benchmark.
- ZeroFalse: structured evidence improves LLM precision.
- Sifting the Noise / QASecClaw / Tencent industrial study: LLM/agent false-positive reduction.
- Vulnerability explanation studies: explanations can help practitioners, but explanation text is not the same as traceable evidence.

AEGIS positions itself in the gap:

```text
Prior: Can the model/agent classify or filter the finding?
AEGIS: Can the reviewer reconstruct why the verdict exists and whether it should be accepted, overturned, or deferred?
```

This move is independent of experiment results.

### Move 3 — AEGIS separates evidence producers from verdict ownership

The system architecture has three paper-facing roles:

| Internal lane | Paper role | Verdict ownership |
|---|---|---|
| S3 | Analysis Orchestrator / Evidence-Guided Triage Agent | Owns final TP/FP/UNKNOWN |
| S4 | Static Evidence Producer | No final verdict |
| S5 | Contextual Knowledge Provider / Code KB / Threat KB Provider | No final verdict |

Core contract:

```text
S4 empty/error/no-hit is not safe-code evidence.
S5 no_hit/partial/error is not vulnerable/safe evidence.
Producer diagnostics are not security conclusions.
Only S3 may turn evidence into a finding-level verdict.
Every verdict must cite evidence, diagnostic rationale, or claim-boundary rationale.
```

This move is independent of experiment results.

### Move 4 — AEGIS is evaluated by packet conditions, not model families

The primary comparison is not Qwen vs frontier. It is packet form:

| Condition | Meaning |
|---|---|
| B0 SAST-only | Conventional alert packet. |
| B1 Raw LLM rationale | Explanation-only baseline. |
| B2 Evidence-enriched rationale, no ledger | Same S4/S5 evidence rows, but no trace discipline. |
| B3 AEGIS ledger, verdict hidden | Trace artifact without machine verdict. |
| B4 Full AEGIS packet | Ledger + verdict + UNKNOWN rationale. |
| B5 limited ablations | no Code KB / no Threat KB / no claim-evidence links, subset only. |

Headline comparison:

```text
B4 vs B2
```

Why: B2 and B4 use the same underlying evidence rows. If B4 helps, the result is attributable to ledger/trace/claim-link structure rather than merely more evidence.

This move is independent of experiment results.

### Move 5 — Results determine strength, not story direction

Possible outcomes do not change the paper identity. They change the claim strength.

```text
Strong positive result:
  AEGIS audit packets improve reviewer audit behavior and preserve safety.

Mixed result:
  AEGIS produces trace-complete packets and reveals where auditability helps or fails.

Negative human-effect result:
  AEGIS demonstrates that evidence-ledger artifacts alone are insufficient without better presentation/training, while still contributing a rigorous benchmark and fault model.

Engineering failure:
  The paper cannot claim full TraceAudit effectiveness; it becomes a system limitation report or must delay submission.
```

## 3. What the paper is not

The paper is not:

- a Qwen-vs-frontier leaderboard;
- a frontier parity paper;
- a repository-wide vulnerability detection paper;
- a build-recovery paper;
- a patch-generation or repair paper;
- a proof that a project has no vulnerability;
- an S4 or S5 standalone security-verdict paper;
- a claim that traceability equals correctness.

The paper may include automated triage quality, latency, and cost, but only as secondary preservation/sanity checks.

## 4. Recommended title and abstract skeleton

### Title

> **AEGIS: A Trace-Auditable Architecture for TP/FP/UNKNOWN Triage of Static-Analysis Findings**

### Abstract skeleton

```text
Static-analysis tools produce many findings, but the hard part of triage is not only deciding whether a finding is true or false; it is making the decision reviewable enough for a security engineer to verify, overturn, or defer it.

Recent LLM-assisted SAST work improves false-positive filtering and agentic triage performance, but typically evaluates model or agent outputs rather than the auditability of the decision artifact.

We present AEGIS, a trace-auditable architecture that separates static evidence production, contextual knowledge retrieval, and final evidence-guided triage. AEGIS represents each TP/FP/UNKNOWN verdict as an evidence-ledger packet with producer traces, claim-evidence links, diagnostics, and explicit claim boundaries.

We evaluate AEGIS with AEGIS-TraceAudit, a design-evaluation suite consisting of Trace50, Audit120, FaultBench, and a secondary triage-quality preservation study.

[RESULT SLOT: summarize Trace50 feasibility, Audit120 reviewer effects, FaultBench detection, and secondary TriageQ outcome.]

Our results show [RESULT BRANCH], suggesting that trace-auditable SAST triage should be evaluated not only by classification accuracy, but by whether reviewers can safely reconstruct, challenge, and defer machine-supported decisions.
```

## 5. Contribution list before results

Pre-result contribution wording:

1. **Architecture** — A trace-auditable SAST triage architecture separating static evidence production, contextual knowledge retrieval, and final evidence-guided triage.
2. **Contract** — An evidence ledger and claim-boundary contract that prevents producer diagnostics, empty/no-hit surfaces, and contextual absence from becoming silent security conclusions.
3. **Benchmark** — AEGIS-TraceAudit, a design-evaluation suite with Trace50, Audit120, FaultBench, and secondary TriageQ.
4. **Human-audit protocol** — A reviewer protocol comparing SAST-only alerts, raw LLM rationales, unstructured evidence dumps, ledger-without-verdict packets, and full AEGIS audit packets.

Post-result contribution wording if experiments succeed:

4. **Empirical audit study** — An empirical study showing how trace-auditable packets affect reviewer accuracy, decision time, wrong-verdict detection, unsafe suppression, and appropriate deferral.

## 6. Research questions

### RQ1 — Traceability feasibility

Can AEGIS produce trace-complete audit packets for admitted build-target SAST findings?

Primary evidence: Trace50.

### RQ2 — Audit effectiveness

Do AEGIS audit packets help reviewers make correct audit decisions faster and safer than SAST-only, raw LLM rationale, or evidence dump packets?

Primary evidence: Audit120.

### RQ3 — Uncertainty discipline

Does AEGIS improve appropriate UNKNOWN/defer behavior under insufficient, conflicting, or boundary-limited evidence?

Primary evidence: Audit120 + FaultBench.

### RQ4 — Trace robustness

Can AEGIS validators and reviewers detect invalid evidence references, producer-boundary misuse, and stale traces?

Primary evidence: FaultBench.

### RQ5 — Evidence layer contribution

Which evidence layers matter for auditability: SAST trace, Code KB, Threat KB, claim links, or the full ledger?

Primary evidence: B5 subset + TriageQ secondary study.

## 7. Benchmark layers

### 7.1 Trace50

Purpose: system artifact and traceability benchmark.

Unit:

```text
1 admitted build target = 1 analysis case
```

Required outputs:

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

Engineering floors:

```text
case_completion_rate >= 0.80
trace_completeness_rate >= 0.95
claim_without_evidence_rate <= 0.05
producer_trace_coverage >= 0.98
boundary_violation_rate = 0 on validator-detectable rules
diagnostic_separation_rate = 1.00 on validator-detectable diagnostics
```

### 7.2 Audit120

Purpose: human/security-reviewer audit-effectiveness benchmark.

Primary comparison:

```text
B4 Full AEGIS packet vs B2 Evidence-enriched rationale, no ledger
```

Denominator floors:

```text
oracle TP >= 20
oracle FP >= 20
oracle UNKNOWN >= 10
machine-wrong cases under B4 >= 10
```

If a denominator floor is not met, the affected RQ becomes exploratory.

Recommended workload:

```text
60 cases x 5 packet conditions x 1 judgment = 300 review tasks
20-case reliability subset x 5 conditions x second judgment = 100 extra tasks
Total = 400 review tasks
```

### 7.3 FaultBench

Purpose: test whether broken evidence traces can be detected.

Mechanical faults:

```text
missing evidence ref
missing producer trace
malformed ref
stale caseId/buildTargetId
S4 empty/no-hit boundary misuse
S5 no-hit boundary misuse
diagnostic-as-security-evidence misuse
```

Human-semantic faults:

```text
wrong but plausible source location
misleading but syntactically valid rationale
contradictory evidence requiring code/security interpretation
```

Mechanical floor:

```text
mechanical_validator_detection_rate >= 0.95
false_alarm_rate <= 0.05 on clean packets
```

### 7.4 TriageQ secondary preservation sanity study

Purpose: ensure auditability does not destroy triage quality.

This is not a classifier leaderboard.

Conditions:

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

## 8. Primary success rule

AEGIS-TraceAudit supports the main audit-effectiveness claim if:

```text
1. B4 Full AEGIS packet improves either audit_accuracy or
   wrong_verdict_detection_rate over B2 Evidence-enriched rationale, no ledger,
   with a positive effect estimate and either a confidence interval excluding zero
   or a pre-registered practically meaningful margin.

2. B4 does not increase unsafe_accept_rate or unsafe_suppression_rate over B2
   beyond the pre-registered harm margin, recommended initial margin: +5 percentage points.

3. Trace50 engineering floors pass:
   trace_completeness_rate >= 0.95,
   claim_without_evidence_rate <= 0.05,
   boundary_violation_rate = 0 on validator-detectable rules.

4. FaultBench mechanical_validator_detection_rate >= 0.95.
```

If condition 1 fails but conditions 2-4 pass, the paper becomes a more cautious auditability infrastructure paper: AEGIS can produce and validate traceable packets, but observed human-audit benefit is inconclusive.

If conditions 2-4 fail, the core paper claim is not ready.

## 9. Result interpretation matrix

| Result pattern | Paper interpretation | Allowed claim | Forbidden claim |
|---|---|---|---|
| B4 beats B2 on accuracy or wrong-verdict detection; safety not worse; Trace50/FaultBench pass | Strong success | Trace-auditable packets improve reviewer-verifiable triage behavior in the studied suite. | Universal SAST superiority. |
| B4 improves time but not accuracy; safety not worse | Workflow-efficiency success | Ledger packets reduce review effort without harming safety, but accuracy benefit is not established. | Better triage correctness. |
| B4 improves wrong-verdict detection but not overall accuracy | Auditability-specific success | Ledger packets help reviewers catch machine errors. | Better classification model. |
| B3 helps but B4 does not | Artifact success, verdict reliance problem | Evidence ledger helps human analysis; machine verdict presentation needs redesign. | Full AEGIS decision support is validated. |
| B2 equals B4 | Ledger structure not empirically useful in current UI | Evidence enrichment may be enough; ledger still useful for validator/fault audit if Trace50/FaultBench pass. | Trace ledger improves human audit. |
| B4 worsens unsafe suppression | Safety failure | Current AEGIS packet may over-persuade reviewers; redesign required. | Safe decision support. |
| Trace50 fails | Engineering readiness failure | Architecture intent remains, but implementation/artifact production is not paper-ready. | System feasibility. |
| FaultBench mechanical floor fails | Trace-robustness failure | Ledger exists but invalid traces are not reliably detected. | Auditability robustness. |
| TriageQ weak but Audit120 positive | Acceptable | Auditability can help reviewers even if automated triage quality is not SOTA. | AEGIS is best classifier. |

## 10. Reviewer protocol freeze

### Packet conditions

| Condition | Meaning | Primary role |
|---|---|---|
| B0 | SAST-only | conventional baseline |
| B1 | raw LLM rationale | explanation-only baseline |
| B2 | evidence-enriched no-ledger | strongest non-AEGIS baseline |
| B3 | AEGIS ledger verdict hidden | artifact-only effect |
| B4 | full AEGIS packet | main condition |
| B5 | limited ablations | layer attribution, subset only |

### Presentation controls

B2 and B4 must use:

- same S4/S5 evidence rows;
- same reviewer UI container;
- same snippet windows;
- same evidence count caps;
- same ordering policy unless ordering is explicitly tested;
- recorded `packet_size_tokens`, `evidence_row_count`, `snippet_line_count`, `visible_file_count`, and `visible_function_count`.

### Sequential reveal for B4

```text
Phase A: reviewer sees ledger without machine verdict and records provisional TP/FP/UNKNOWN.
Phase B: reviewer sees AEGIS verdict and records final action.
```

Record:

```text
pre_verdict_label
post_verdict_label
changed_to_wrong
changed_to_right
accept_on_wrong
override_on_wrong
underuse_on_correct
```

### Blinding and ordering

- hide packet condition labels where possible;
- hide oracle labels;
- hide CVE/fix/advisory provenance;
- randomize task order;
- avoid consecutive tasks from same build target when possible;
- exclude warm-up cases;
- do Audit120 before FaultBench if using the same reviewers.

## 11. Oracle card contract

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

UNKNOWN taxonomy:

```text
UNKNOWN_INSUFFICIENT_CONTEXT
UNKNOWN_CONFLICTING_EVIDENCE
UNKNOWN_PRODUCER_DIAGNOSTIC
UNKNOWN_OUT_OF_SCOPE
UNKNOWN_CLAIM_BOUNDARY
```

UNKNOWN is not rewarded on clear TP or FP cases. Always report UNKNOWN rate, decided-only accuracy, and appropriate-defer rate together.

## 12. S5 freeze gate

Before claiming Threat KB / Code KB contribution:

```text
S5_FREEZE_GATE:
  - S5 visible packet schema finalized;
  - visibleLeakageClass emitted for every S5 row;
  - Threat KB generic mode tested on synthetic hidden-ledger leakage corpus;
  - S5 no_hit / partial / error cannot be consumed by S3 as TP/FP evidence;
  - S5 never emits final verdict fields or language equivalent to vulnerable/safe.
```

If this gate is not satisfied, RQ5 is exploratory or removed from main claims.

## 13. Related work map

| Prior | What it measures | AEGIS difference |
|---|---|---|
| SastBench | Agentic SAST finding TP/FP classification | AEGIS measures audit artifact effectiveness and TP/FP/UNKNOWN review behavior. |
| ZeroFalse | Evidence-enriched LLM adjudication for precision | AEGIS evaluates evidence as human-auditable artifact, not only model input. |
| Sifting the Noise | Agent framework FP filtering and safety/cost tradeoffs | AEGIS compares packet conditions and reviewer behavior, not agent frameworks. |
| QASecClaw | Multi-agent SAST FP reduction | AEGIS focuses on traceable decision records, not F1 headline. |
| Tencent industrial LLM FP reduction | Industrial alarm reduction and review-cost savings | AEGIS uses it to motivate time/cost/safety metrics, not as direct baseline. |
| CodeCureAgent | Static warning classification and repair | AEGIS stops before repair and studies triage auditability. |
| IRIS | Whole-repository vulnerability detection | AEGIS is fixed-warning triage, not repository recall. |
| SecVulEval / PrimeVul / DiverseVul / Devign | C/C++ vulnerability detection/data quality | AEGIS borrows context/leakage warnings, but does not become a detection benchmark. |
| Human-AI readiness | Human-AI decision outcomes and reliance | AEGIS uses interaction traces, wrong-verdict detection, unsafe suppression, and defer behavior. |
| Vulnerability explanation practitioner study | Effects of vulnerability explanations on practitioners | AEGIS distinguishes explanation text from traceable audit packets. |

## 14. Paper section outline

### Section 1 — Introduction

Goal: motivate SAST triage as an audit workflow problem.

Required beats:

1. SAST is useful but noisy.
2. LLM-assisted triage is rising, but often evaluated as output correctness or FP reduction.
3. Operationally, reviewers need reconstructable decisions, not just labels.
4. AEGIS proposes trace-auditable SAST triage.
5. Contributions and benchmark layers.

### Section 2 — Background and Related Work

Group related work by measurement target:

1. SAST triage and FP reduction.
2. Evidence-enriched LLM adjudication.
3. Vulnerability detection datasets.
4. Human-AI decision support and explanation.
5. Static-analysis workflow/actionability.

### Section 3 — Task and Threat Model

Define:

- build target;
- finding / claim candidate;
- evidence row;
- TP/FP/UNKNOWN;
- producer-boundary contract;
- leakage model;
- non-goals.

### Section 4 — AEGIS Architecture

Describe:

- S3 orchestrator;
- S4 static evidence producer;
- S5 contextual knowledge provider;
- evidence ledger;
- claim-boundary contract;
- packet export.

### Section 5 — AEGIS-TraceAudit Benchmark

Describe:

- Trace50;
- Audit120;
- FaultBench;
- TriageQ secondary study;
- primary success rule.

### Section 6 — Evaluation Method

Describe:

- packet conditions;
- reviewer assignment;
- oracle construction;
- metrics;
- statistical models;
- fault injection;
- ablations.

### Section 7 — Results

Use result slots:

1. Trace50 feasibility.
2. Audit120 audit effectiveness.
3. FaultBench robustness.
4. TriageQ secondary preservation.
5. Ablation and error analysis.

### Section 8 — Discussion

Interpret result branch. Emphasize auditability, safety, limitations, human factors, and why performance alone is not the point.

### Section 9 — Threats to Validity

Must include:

- curated suite generalizability;
- reviewer sample size;
- packet UI confounds;
- oracle leakage;
- S5 leakage;
- UNKNOWN gaming;
- traceability vs correctness;
- implementation maturity;
- C/C++ build-target selection.

### Section 10 — Conclusion

Return to thesis:

> SAST triage should be evaluated as an auditable decision workflow, not only a classifier score.

## 15. Figures and tables to prepare

### Figures

1. **Architecture figure** — S3 orchestrator, S4 evidence producer, S5 context provider, evidence ledger, audit packet.
2. **Producer-boundary figure** — what S4/S5 may say vs what only S3 may decide.
3. **Packet condition figure** — B0/B1/B2/B3/B4 comparison.
4. **Benchmark lifecycle figure** — Trace50 -> Audit120 -> FaultBench -> TriageQ.
5. **B4 sequential reveal figure** — provisional label -> machine verdict -> final action.

### Tables

1. Related work comparison by measurement target.
2. Benchmark layer summary.
3. Packet condition matrix.
4. Metric validity checklist.
5. Primary success rule.
6. Oracle card schema.
7. Result interpretation matrix.
8. Threats to validity.

## 16. Result slots

### Trace50 result slot

```text
AEGIS completed [x/50] admitted build-target cases.
Trace completeness was [x].
Claim-without-evidence rate was [x].
Boundary violation rate was [x].
Diagnostic separation rate was [x].
```

Interpretation:

- If floors pass: architecture is feasible for trace-auditable artifact production.
- If floors fail: system readiness is insufficient; do not claim TraceAudit success.

### Audit120 result slot

```text
Compared with B2 evidence-enriched no-ledger packets, B4 full AEGIS packets changed:
  audit_accuracy by [x]
  wrong_verdict_detection_rate by [x]
  time_to_decision by [x]
  unsafe_accept_rate by [x]
  unsafe_suppression_rate by [x]
  appropriate_defer_rate by [x]
```

Interpretation:

- Must use result matrix in section 9.
- Do not overclaim classifier superiority.

### FaultBench result slot

```text
Mechanical validator detection rate: [x]
False alarm rate on clean packets: [x]
Semantic reviewer detection rate: [x]
```

Interpretation:

- Mechanical floor validates trace robustness.
- Semantic results inform discussion, not hard floor.

### TriageQ result slot

```text
Full AEGIS vs secondary baselines:
  TP_accept_recall [x]
  FP_rejection_rate [x]
  balanced_triage_utility [x]
  UNKNOWN_rate [x]
  cost_per_auditable_decision [x]
```

Interpretation:

- This is a preservation/sanity check, not the headline.

## 17. Claims that survive negative performance results

If automated triage quality is weak but traceability passes:

Allowed:

```text
AEGIS demonstrates a reproducible architecture and benchmark for trace-auditable SAST triage.
The study shows that model verdict quality and audit artifact quality are separable.
```

Not allowed:

```text
AEGIS improves SAST triage accuracy.
AEGIS is better than raw LLMs.
```

If human audit benefit is weak but FaultBench passes:

Allowed:

```text
Evidence ledgers improve machine-checkable trace robustness, but current packet presentation did not produce measurable reviewer benefit.
```

Not allowed:

```text
AEGIS improves human triage decisions.
```

If B4 worsens unsafe suppression:

Allowed:

```text
The system exposes a human-AI reliance risk: structured verdict packets may over-persuade reviewers unless presentation or training is redesigned.
```

Not allowed:

```text
AEGIS is safe decision support.
```

This is why the paper story is result-independent but the empirical claim strength is not.

## 18. Red lines for future writing

Do not write:

```text
AEGIS reaches frontier parity.
AEGIS is a new SAST tool.
AEGIS detects vulnerabilities automatically.
AEGIS proves no vulnerability exists.
AEGIS reduces false positives better than prior work in general.
Traceability proves correctness.
S4/S5 no-hit means safe.
UNKNOWN means failure.
```

Do write:

```text
AEGIS makes SAST triage decisions reconstructable and auditable.
AEGIS separates evidence production from verdict ownership.
AEGIS evaluates packet conditions rather than model families.
AEGIS treats UNKNOWN as a first-class responsible outcome under bounded evidence.
AEGIS measures human audit behavior, not explanation satisfaction alone.
AEGIS includes fault injection because auditability must fail closed when traces are broken.
```

## 19. Pre-experiment checklist

Before running the final paper experiment:

```text
[ ] 50 admitted build targets ready.
[ ] S4 static evidence producer contract consumed.
[ ] S5 visible packet schema satisfies S5_FREEZE_GATE.
[ ] S3 exports case-local evidence ledger and analysis envelope.
[ ] B0-B4 packet renderer implemented with presentation controls.
[ ] Audit120 sampling pool generated.
[ ] Oracle card schema frozen.
[ ] Reviewer instructions and warm-up cases prepared.
[ ] FaultBench mechanical validator implemented.
[ ] TriageQ secondary scorer implemented.
[ ] Leakage audit for CVE/fix/advisory hidden provenance complete.
[ ] Analysis scripts produce all primary metrics.
```

## 20. Final decision

The paper's stable identity is:

> **AEGIS is a trace-auditable SAST triage architecture.**

The paper's stable plot is:

> SAST triage is currently evaluated mostly as classification or FP reduction. AEGIS instead treats triage as a reviewable decision workflow, separates evidence producers from final verdict ownership, and evaluates whether evidence-ledger packets make reviewer decisions more auditable, safer under uncertainty, and robust to broken traces.

The paper's empirical claim depends on results, but the story does not.
