---
title: "AEGIS TraceAudit Pre-Paper Anchor Guideline v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/aegis-traceaudit-benchmark-master.md"
  - "wiki/canon/specs/aegis-traceaudit-paper-dossier.md"
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
  - "wiki/canon/api/paper-analysis-api.md"
  - "/home/kosh/aegis-for-paper/README.md"
  - "/home/kosh/aegis-for-paper/datasets/build-targets-v1/SUMMARY.md"
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/protocol.md"
  - "https://arxiv.org/abs/2601.02941"
  - "https://arxiv.org/abs/2510.02534"
  - "https://arxiv.org/abs/2601.22952"
  - "https://arxiv.org/abs/2605.01885"
  - "https://arxiv.org/abs/2601.18844"
  - "https://arxiv.org/abs/2603.18895"
  - "https://arxiv.org/abs/2507.02825"
  - "https://research.lancaster-university.uk/en/publications/-%28f3d0eb3c-9fcb-4405-a364-e4165f98f7da%29.html"
  - "https://github.com/tuhh-softsec/vul4j"
  - "https://www.nist.gov/itl/csd/secure-systems-and-applications/samate/software-assurance-reference-dataset-sard"
  - "https://owasp.org/www-project-benchmark/"
  - "https://arxiv.org/abs/2312.04724"
  - "https://arxiv.org/abs/1909.03496"
  - "https://arxiv.org/abs/2304.00409"
  - "https://arxiv.org/abs/2403.18624"
  - "https://arxiv.org/abs/2505.19828"
  - "https://arxiv.org/abs/2405.17238"
  - "https://arxiv.org/abs/2509.11787"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "paper-pipeline", "paper-anchor", "traceaudit", "prepaper"]
decision_tags: ["prepaper-anchor", "traceaudit", "auditability", "sast-triage", "human-audit", "evidence-ledger", "freeze-before-results", "critic-required"]
related_pages: ["wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/specs/aegis-traceaudit-benchmark-master.md", "wiki/canon/specs/aegis-traceaudit-paper-dossier.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/api/paper-analysis-api.md"]
---

# AEGIS TraceAudit Pre-Paper Anchor Guideline v1 Snapshot

> Status: final pre-paper anchor guideline, pending/then incorporating Critic review in section 29.
> Version note: v1 snapshot captured before applying the second 2026-05-18 external review. Latest canonical file is `aegis-traceaudit-prepaper-anchor-guideline.md`.
> Purpose: single MD file that consolidates the paper identity, narrative, benchmark, API/pipeline assumptions, dataset status, reviewer protocol, result interpretation, and next execution gates before paper experiments.
> Canonical anchor chain: this page summarizes and operationally supersets `aegis-traceaudit-benchmark-master.md` and `aegis-traceaudit-paper-dossier.md`. It does not replace the S4/S5 API contracts as implementation contracts.
> Red line: do not revive Qwen/frontier parity, H1/H1-dump, TOST equivalence, model-SOTA, repository-wide detection, Build Agent, or patch-generation framing as the main paper direction.

## 0. Executive decision

AEGIS is now a **trace-auditable SAST triage architecture** paper.

The paper is not primarily about whether a smaller model beats a frontier model, whether AEGIS is a new SAST engine, or whether AEGIS finds all vulnerabilities in a repository. The paper is about whether a SAST finding's TP/FP/UNKNOWN decision can be turned into an evidence-ledger artifact that a reviewer can inspect, challenge, defer, and audit.

Stable thesis:

> SAST warning triage should be evaluated as an auditable decision workflow, not only as a classifier score. AEGIS separates static evidence production, contextual knowledge retrieval, and final evidence-guided triage so that each verdict can be reconstructed through evidence refs, producer traces, diagnostics, and claim-boundary rules.

## 1. What this guideline consolidates

| Source | Status | What this guideline imports |
|---|---|---|
| `aegis-traceaudit-benchmark-master.md` | canonical benchmark anchor | benchmark layers, success rules, packet conditions, metric validity, S5 gate, related-work positioning |
| `aegis-traceaudit-paper-dossier.md` | pre-experiment paper dossier | thesis, five-move plot, paper outline, result interpretation branches, red lines |
| `paper-analysis-pipeline-design.md` | S3/S4/S5 pipeline design draft | build target / analysis case definitions, S3 ownership, S4/S5 independence, state machine, non-goals |
| `paper-analysis-api.md` | paper API draft | `/paper/v1` S3 API, S4 `/v1/paper/static-evidence`, case stages, evidence ledger/export layout, S4 response semantics |
| `aegis-for-paper` dataset docs | backend-independent paper workspace | 50 admitted C/C++ build targets, compile contexts, build artifacts, local experiment harness boundaries |
| related work corpus | external scholarly context | why AEGIS is not SastBench/ZeroFalse/QASecClaw but a trace-auditability paper |

This page is meant to be the first document read before writing the paper or starting final experiments.

## 2. Frozen before results vs filled after results

Frozen now:

- paper identity;
- problem framing;
- non-goals;
- S3/S4/S5 paper-facing roles;
- build target / analysis case / finding / evidence units;
- packet-condition benchmark design;
- primary success rule;
- result interpretation matrix;
- reviewer protocol controls;
- leakage/UNKNOWN/producer-boundary rules;
- paper section outline.

Filled after experiments:

- numeric effect sizes;
- confidence intervals;
- exact accepted/rejected hypotheses;
- final wording of empirical contribution 4;
- whether RQ5 is main or exploratory;
- final claims about reviewer benefit, time, safety, or fault detection.

The story is result-independent. The empirical claim strength is result-dependent.

## 3. Paper title and one-line identity

Recommended title:

> **AEGIS: A Trace-Auditable Architecture for TP/FP/UNKNOWN Triage of Static-Analysis Findings**

One-line identity:

> AEGIS turns SAST findings into reviewer-auditable TP/FP/UNKNOWN decision packets by separating evidence producers from verdict ownership and linking final claims to evidence-ledger traces.

## 4. The five-move narrative

### Move 1 — SAST triage is a workflow problem

SAST findings create review burden. The operational question is not only whether the finding is TP or FP. It is whether a security-trained reviewer can decide what to do with it quickly, safely, and with enough evidence to justify the decision.

### Move 2 — Prior work optimizes FP reduction or agent correctness

SastBench, ZeroFalse, Sifting the Noise, QASecClaw, and industrial LLM false-positive reduction work mostly evaluate agent/model outputs, precision/F1, cost, or false-positive filtering. These are important but do not directly measure the auditability of the decision artifact.

### Move 3 — AEGIS separates bounded evidence from final verdicts

S4 and S5 may produce bounded evidence and diagnostics. They may not silently become verdict producers. S3 owns final finding-level TP/FP/UNKNOWN and must cite evidence, diagnostic rationale, or claim-boundary rationale.

### Move 4 — The benchmark compares packet forms, not model families

The main comparison is B4 vs B2:

```text
B2 = same evidence rows, no evidence ledger / trace / claim links
B4 = full AEGIS packet with ledger / trace / claim links / verdict
```

This isolates trace-auditability from merely providing more context.

### Move 5 — Results determine claim strength, not paper identity

Positive results support a stronger audit-effectiveness claim. Mixed or negative results still have predetermined interpretations. Results do not send the paper back to Qwen/frontier parity.

## 5. Non-goals and red lines

AEGIS TraceAudit is not:

- a Qwen-vs-frontier leaderboard;
- a frontier parity paper;
- a general vulnerability discovery benchmark;
- a repository-wide recall benchmark;
- a Build Agent or build-recovery paper;
- a patch-generation or repair-quality paper;
- a proof of vulnerability absence;
- an S4-only or S5-only security verdict paper;
- a claim that traceability equals correctness.

Forbidden writing:

```text
AEGIS reaches frontier parity.
AEGIS detects vulnerabilities automatically.
AEGIS proves this target is safe.
S4 empty means safe.
S5 no_hit means safe or vulnerable.
UNKNOWN means failure.
Traceability proves correctness.
```

Required writing:

```text
AEGIS makes SAST triage decisions reconstructable and auditable.
AEGIS separates evidence production from verdict ownership.
AEGIS evaluates packet conditions, not model families.
AEGIS treats UNKNOWN as responsible abstention under bounded evidence.
AEGIS measures reviewer behavior and trace robustness, not explanation satisfaction alone.
```

## 6. Core units and ownership

| Concept | Unit | Owner | Notes |
|---|---|---|---|
| Build target | reproducible compilation-context unit | S3 / paper harness admission | one source/config/build boundary with compile context |
| Analysis case | one build-target-scoped S3/S4/S5 run | S3 | target-level audit/evidence envelope |
| Finding / claim candidate | scoring unit | S3 | individual SAST finding or claim inside a case |
| Evidence row | ledger/acquisition/retrieval/static row | S3 normalized; S4/S5 raw producers | must be traceable to producer |
| Export | case-local + aggregate artifacts | S3 / paper harness | feeds Trace50/Audit120/FaultBench/TriageQ |

Build target is not necessarily the smallest program unit. It may be an executable, shared/static library, service inside a monorepo, or source tree under a specific build configuration.

## 7. S3/S4/S5 paper-facing roles

| Internal lane | Paper-facing role | Responsibility | Final verdict? |
|---|---|---|---|
| S3 | Analysis Orchestrator / Evidence-Guided Triage Agent | owns case state machine, evidence ledger, triage, normalized artifacts, aggregate exports, scoring, paper export | yes |
| S4 | Static Evidence Producer | produces deterministic static/source/build evidence for admitted target | no |
| S5 | Contextual Knowledge Provider / Code KB Provider | builds target-scoped Code KB / Source Code KG and returns contextual/Threat KB evidence | no |

S4 and S5 do not communicate directly. Any S4-derived context sent to S5 flows through S3 and must be logged in the evidence ledger.

## 8. Producer-boundary contract

TraceAudit depends on a fail-closed producer-boundary contract:

```text
Only S3 may emit final finding-level TP/FP/UNKNOWN.
S4/S5 may emit evidence, bounded status, provenance, and diagnostics.
Producer status/no-hit/empty/error may not be promoted into security conclusions.
```

Specific forbidden inferences:

| Producer surface | Forbidden inference |
|---|---|
| S4 `empty` | no vulnerability / safe / false positive |
| S4 `not_available` or `error` | UNKNOWN by itself, TP/FP, or absence evidence |
| S4 `bounded_partial` / per-surface `produced | empty | not_available | error` | complete security evidence or vulnerability absence proof |
| S5 `no_hit` | safe, vulnerable, no relevant risk |
| S5 `partial` / `error` | TP/FP, evidence absence, or threat absence |
| producer diagnostic | final security conclusion |

S4's `evidenceCompleteness.status = bounded_partial` is expected, not a failure. It means S4 produced bounded local static evidence and does not claim complete security coverage.

## 9. Paper pipeline state machine

The paper pipeline assumes admitted build targets:

```text
ADMITTED_BUILD_TARGET
CASE_REGISTERED
BUILD_CONTEXT_READY
SETUP_RUNNING
  ├─ S4_STATIC_EVIDENCE_READY
  └─ S5_CODE_KB_READY
S5_FINDING_CONTEXT_READY
S3_TRIAGE_COMPLETED
PAPER_EXPORT_READY
```

Status distinction:

| Type | Meaning | Paper handling |
|---|---|---|
| Admission failure | target is not a valid paper case | excluded from evaluated cases; logged in admission report |
| Operational anomaly | service/infrastructure issue after admission | reported separately; not triage UNKNOWN |
| Producer diagnostic | bounded producer status or failure | diagnostic artifact; not security evidence |
| Triage UNKNOWN | finding-level evidence/claim-boundary outcome | counted as analysis result |

## 10. API and artifact contract summary

S3 paper API prefix:

```text
/paper/v1
```

S4 static evidence endpoint:

```text
POST /v1/paper/static-evidence
```

Required shared identifiers:

```text
caseId
buildTargetId
paperRunId
sourceRootRef
compileContextRef
buildSnapshotId
buildUnitId
s4RequestId
s4ProducerRunId
bundleRef
```

Refs are traceability handles. They are not checksum/hash/digest/fingerprint/integrity proofs.

Artifact families required for paper replay and scoring:

Top-level run/dataset:

```text
run-manifest.json
dataset-manifest.json
admission-report.jsonl
environment.lock.json
schemas/
```

Case-local artifacts:

```text
case-manifest.json
state-trace.jsonl
s4-static-evidence.raw.json
s4-static-evidence.normalized.json
s5-code-kb.raw.json
s5-code-kb.normalized.json
s5-finding-context.raw.jsonl
s5-finding-context.normalized.jsonl
evidence-ledger.jsonl
analysis-envelope.json
llm-transcript.jsonl
normalization-report.jsonl
```

Replay and producer request artifacts:

```text
s3-paper-request.json
s4-requests.jsonl
s5-setup-requests.jsonl
s5-finding-context-requests.jsonl
state-machine-config.json
prompt-versions.json
model-profile.json
```

Aggregate/scoring artifacts:

```text
cases.jsonl
findings.jsonl
evidence.jsonl
metrics-input.jsonl
oracle-labels.jsonl
finding-match-map.jsonl
metrics-config.json
expected-results.json
```

The artifact bundle must let a reviewer reconstruct which producer created which evidence row, which claim cited it, and which metric consumed it. Passing a validator is insufficient if the bundle cannot support replay/audit at this granularity.

## 11. Dataset and harness status

Current backend-independent paper workspace: `/home/kosh/aegis-for-paper`.

Dataset: `datasets/build-targets-v1/`.

Current known status from `SUMMARY.md`:

```text
admitted targets: 50
total compile commands: 6544
total artifacts: 1671
failed non-counted candidates: 12
remaining reserves: 7
origins: 6 hot11_local, 44 public_oss
strategies: 35 cmake, 8 configure_make_bear, 6 make_bear, 1 direct_c_static_library_bear
```

Dataset handling:

- each admitted target has hard-copied source under `targets/<id>/source/`;
- each admitted target has `evidence/compile_commands.json`, `evidence/build.log`, `evidence/toolchain.txt`, and `evidence/artifact-manifest.json`;
- Build Agent and S1-S8 backend services are not required for dataset admission;
- visible bundles must exclude hidden provenance fields such as CVE IDs, fix commits, exploit writeups, or evaluator-only notes unless an appendix condition explicitly tests advisory-aware triage.

Current file-based harness: `experiments/triage-core-v1/`.

Harness status:

- subordinate scaffold only;
- no live S4/S5/S7 calls in the harness scaffold;
- no claim scoring before warning-unit oracle cards are frozen;
- no Build Agent dependency;
- do not revive frontier parity from this harness.

## 12. Benchmark layers

```text
AEGIS-Trace50      = system artifact and traceability benchmark
AEGIS-Audit120     = human/security-reviewer audit-effectiveness benchmark
AEGIS-FaultBench   = trace-fault injection and validator benchmark
AEGIS-TriageQ      = secondary triage-quality preservation sanity study
```

Core: Trace50, Audit120, FaultBench.

Secondary: TriageQ.

## 13. Trace50 contract

Purpose: test whether AEGIS can produce trace-complete audit artifacts over admitted build targets.

Unit:

```text
1 build target = 1 analysis case
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

Trace50 validates feasibility. It does not prove security correctness.

## 14. Audit120 contract

Purpose: test whether AEGIS audit packets improve reviewer-verifiable triage behavior.

Primary comparator:

```text
B4 Full AEGIS packet vs B2 Evidence-enriched rationale, no ledger
```

Packet conditions:

| Condition | Meaning | Role |
|---|---|---|
| B0 | SAST-only | conventional baseline |
| B1 | raw LLM rationale | explanation-only baseline |
| B2 | same evidence rows, no ledger | strongest non-AEGIS baseline |
| B3 | AEGIS ledger without verdict | artifact-only effect |
| B4 | full AEGIS packet | main condition |
| B5 | limited ablations | subset layer attribution |

Denominator floors:

```text
oracle TP >= 20
oracle FP >= 20
oracle UNKNOWN >= 10
machine-wrong cases under B4 >= 10
```

If a floor is not met, the relevant metric/RQ is exploratory.

Workload plan:

```text
60 cases x 5 packet conditions x 1 judgment = 300 tasks
20-case reliability subset x 5 conditions x second judgment = 100 tasks
recommended total = 400 tasks
```

## 15. Packet presentation controls

B2 and B4 must use the same evidence rows and same reviewer UI container.

B2 removes:

- evidenceRef links;
- producer trace metadata;
- claim-evidence linkage;
- claim-boundary annotations;
- explicit ledger navigation.

B2 retains:

- same source snippets;
- same SAST message;
- same Code KB / Threat KB evidence text;
- same evidence ordering policy unless ordering itself is the tested ledger feature.

Record covariates:

```text
packet_size_tokens
evidence_row_count
snippet_line_count
visible_file_count
visible_function_count
```

Use `log(packet_size_tokens)` as a fixed-effect covariate in time-to-decision analysis when sample size permits.

## 16. Reviewer protocol

Minimum reviewer design:

```text
reviewers: 4-6 security-trained participants minimum for primary Audit120 claims
assignment: balanced incomplete block or Latin-square style assignment
same-finding exposure: same reviewer must not see the same finding under multiple packet conditions
reliability subset: second independent judgments on the pre-registered reliability subset
claim downgrade: if reviewer recruitment fails, Audit120 human-effectiveness claims are removed or downgraded to expert-case-study observations
```

Reviewer response fields:

```text
label: TP | FP | UNKNOWN | Excluded
confidence: 0-100
key_evidence_ids: [evidenceRef]
evidence_sufficiency: 1-5
time_to_decision_seconds
notes
machine_verdict_action: accept | overturn | defer | not_shown
```

B4 sequential reveal:

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

Blinding and ordering:

- hide packet condition label where possible;
- hide oracle labels;
- hide CVE/fix/advisory provenance;
- randomize task order;
- avoid consecutive tasks from the same build target when possible;
- exclude warm-up cases;
- complete Audit120 before FaultBench when using same reviewers.

Statistical analysis plan:

```text
correctness/safety outcomes:
  mixed-effects logistic regression
  fixed effect: packet condition
  random intercepts: reviewer, finding/case

review time:
  mixed-effects model on log(time_to_decision_seconds)
  fixed effects: packet condition, log(packet_size_tokens) when feasible,
                 evidence_row_count when feasible
  random intercepts: reviewer, finding/case

reporting:
  effect sizes and confidence intervals first;
  p-values only as secondary evidence;
  descriptive-only reporting for underpowered denominators.
```

## 17. Oracle card contract

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
leakageRiskClass: none | cve_id | fix_commit | advisory | exploit_writeup | patch_text
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

UNKNOWN is rewarded only when oracle/adjudication says evidence is insufficient, conflicting, diagnostic-limited, out-of-scope, or boundary-limited. UNKNOWN is not rewarded on clear TP or clear FP cases.

## 18. FaultBench contract

Purpose: if trace-auditability is the claim, broken traces must be detectable.

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

Floor:

```text
mechanical_validator_detection_rate >= 0.95
false_alarm_rate <= 0.05 on clean packets
semantic_reviewer_detection_rate reported descriptively
```

Ordering policy: Audit120 first; FaultBench later or separate reviewer group.

## 19. TriageQ secondary contract

Purpose: ensure auditability does not destroy triage quality.

TriageQ does not ask whether AEGIS is the best SAST triage classifier.

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

Metrics:

```text
TP_accept_recall
FP_rejection_rate
balanced_triage_utility
precision
UNKNOWN_rate
UNKNOWN_appropriateness
latency
cost_per_auditable_decision
```

## 20. S5 freeze gate

S5 minimum visible evidence row schema:

```text
retrievalRunId: stable run-local retrieval identifier
itemId: stable run-local evidence item identifier
sourceType: code | symbol | cwe | capec | generic_security_note | library_provenance | diagnostic
queryIntent: why S3 requested this retrieval
sourceEvidence: file/symbol/KB/source reference sufficient for reviewer audit
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass: generic | case_specific_advisory | fix_commit | cve_id | exploit_writeup | patch_text
```

Main benchmark policy:

```text
Threat KB generic mode only:
  CWE/CAPEC/security concept explanations, API misuse descriptions,
  generic security notes, and source-derived code context.

Hidden unless explicit appendix condition:
  CVE IDs, fix commits, advisories, exploit writeups, patch text.
```

Before RQ5 or Threat KB contribution can be mainline:

```text
S5_FREEZE_GATE:
  - S5 visible packet schema finalized;
  - visibleLeakageClass emitted for every S5 row;
  - Threat KB generic mode tested on synthetic hidden-ledger leakage corpus;
  - S5 no_hit / partial / error cannot be consumed by S3 as TP/FP evidence;
  - S5 never emits final verdict fields or language equivalent to vulnerable/safe.
```

If not satisfied, RQ5 becomes exploratory or is removed from main claims.

## 21. Primary success rule

AEGIS-TraceAudit supports the main audit-effectiveness claim only if:

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

If condition 1 fails but conditions 2-4 pass, the paper may still be an auditability infrastructure paper, but not a strong human-audit benefit paper.

If conditions 2-4 fail, the core paper claim is not ready.

## 22. Metric validity checklist

| Metric | Measures | Does not measure | Misuse risk |
|---|---|---|---|
| `trace_completeness_rate` | evidence refs resolve to producer-traced ledger rows | security correctness | wrong but traceable verdict looks valid |
| `claim_without_evidence_rate` | TP/FP claims cite support | semantic sufficiency | weak evidence is cited but not enough |
| `boundary_violation_rate` | S4/S5 status misuse | all unsound reasoning | validator safety mistaken for full correctness |
| `audit_accuracy` | reviewer correctness under packet condition | universal SAST superiority | curated suite overgeneralized |
| `time_to_decision` | review efficiency | correctness/safety | faster wrong decisions counted as success |
| `wrong_verdict_detection_rate` | reviewer catches machine errors | machine precision | unstable without enough wrong cases |
| `unsafe_suppression_rate` | true vulnerability suppressed as FP | false-positive burden | aggregate accuracy hides severe harm |
| `appropriate_defer_rate` | correct abstention under bounded evidence | correctness by refusal | UNKNOWN inflation |
| `evidence_sufficiency_score` | reviewer-perceived sufficiency | objective correctness | satisfaction mistaken for faithfulness |

## 23. Result interpretation matrix

| Result pattern | Interpretation | Allowed claim | Forbidden claim |
|---|---|---|---|
| B4 beats B2, safety not worse, Trace50/FaultBench pass | strong success | trace-auditable packets improve reviewer-verifiable triage behavior | universal SAST superiority |
| B4 improves time only | workflow-efficiency success | ledger packets reduce effort without safety harm | better correctness |
| B4 improves wrong-verdict detection only | auditability-specific success | ledger packets help catch machine errors | better classifier |
| B3 helps but B4 does not | artifact success, verdict reliance issue | ledger helps analysis; verdict presentation needs redesign | full decision support validated |
| B2 equals B4 | ledger structure not useful in current UI | evidence enrichment may be sufficient; trace remains useful for validation if Trace50/FaultBench pass | ledger improves human audit |
| B4 worsens unsafe suppression | safety failure | structured verdict may over-persuade reviewers | safe decision support |
| Trace50 fails | engineering readiness failure | architecture intent remains, implementation not ready | system feasibility |
| FaultBench floor fails | trace robustness failure | ledger exists but invalid traces not reliably detected | auditability robustness |
| TriageQ weak but Audit120 positive | acceptable | auditability helps reviewers even if classifier quality is not SOTA | best classifier |
| reviewer recruitment fails | human-study underpowered | Trace50/FaultBench infrastructure claim and expert-case examples only | human audit effectiveness |
| Audit120 denominator floors fail | metric underpowered | affected RQ is exploratory/descriptive | primary metric conclusion for affected RQ |
| S5 freeze gate fails | knowledge-layer not frozen | RQ5 exploratory/removed; S3/S4/ledger claims may remain | Threat KB contribution |
| B4 helps only subjective sufficiency | satisfaction-only result | reviewers liked/found packet sufficient | audit effectiveness or correctness improvement |

## 24. Related work positioning

| Prior | What it measures | AEGIS positioning |
|---|---|---|
| SastBench | agentic SAST finding TP/FP classification | closest benchmark, optional appendix only; AEGIS measures audit artifacts |
| ZeroFalse | evidence-enriched LLM adjudication precision | motivates B2 baseline; AEGIS tests trace structure with same evidence rows |
| Sifting the Noise | LLM agent FP filtering and safety/cost tradeoffs | motivates raw rationale baseline and unsafe suppression metric |
| QASecClaw | multi-agent SAST FP reduction | motivates contextual review baseline; not directly reproduced |
| Tencent industrial FP reduction | industrial alarm reduction/cost | motivates time/cost/safety metrics; not direct baseline |
| CodeCureAgent | warning classification + repair | adjacent; AEGIS stops before repair |
| IRIS | whole-repository vulnerability detection | contrast; AEGIS is fixed-warning triage |
| SecVulEval / PrimeVul / DiverseVul / Devign | C/C++ vulnerability detection/data quality | background for context/leakage caution; not direct benchmark |
| Human-AI readiness | reliance, interaction, harm, readiness | basis for sequential reveal and reliance metrics |
| Vulnerability explanation study | explanation effects on practitioners | justifies B1/B2/B3/B4 distinction |

## 25. Paper section outline

1. **Introduction** — SAST triage as audit workflow; AEGIS thesis; contributions.
2. **Background and related work** — SAST triage, evidence-enriched LLM adjudication, vulnerability datasets, human-AI/explanation, static-analysis workflow.
3. **Task and threat model** — build target, finding, evidence row, TP/FP/UNKNOWN, producer boundaries, leakage, non-goals.
4. **AEGIS architecture** — S3/S4/S5 roles, state machine, evidence ledger, claim-boundary contract.
5. **AEGIS-TraceAudit benchmark** — Trace50, Audit120, FaultBench, TriageQ, success rules.
6. **Evaluation method** — packet conditions, reviewer assignment, oracle construction, metrics, statistical models, fault injection, ablations.
7. **Results** — Trace50, Audit120, FaultBench, TriageQ, ablations/error analysis.
8. **Discussion** — result branch, auditability vs correctness, human factors, limitations.
9. **Threats to validity** — curated suite, reviewer count, UI confounds, oracle leakage, S5 leakage, UNKNOWN gaming, traceability vs correctness.
10. **Conclusion** — SAST triage should be evaluated as auditable decision workflow.

## 26. Figures and tables

Figures:

1. AEGIS architecture: S3/S4/S5/evidence ledger/audit packet.
2. Producer-boundary contract: what S4/S5 may say vs what S3 may decide.
3. Packet conditions: B0/B1/B2/B3/B4.
4. Benchmark lifecycle: Trace50 -> Audit120 -> FaultBench -> TriageQ.
5. B4 sequential reveal: provisional label -> machine verdict -> final action.

Tables:

1. Related work by measurement target.
2. Benchmark layer summary.
3. Packet condition matrix.
4. Metric validity checklist.
5. Primary success rule.
6. Oracle card schema.
7. Result interpretation matrix.
8. Threats to validity.

## 27. Result slots

Trace50:

```text
completed cases: [x/50]
trace_completeness_rate: [x]
claim_without_evidence_rate: [x]
boundary_violation_rate: [x]
diagnostic_separation_rate: [x]
```

Audit120:

```text
B4 vs B2 audit_accuracy delta: [x]
B4 vs B2 wrong_verdict_detection_rate delta: [x]
B4 vs B2 time_to_decision delta: [x]
B4 vs B2 unsafe_accept_rate delta: [x]
B4 vs B2 unsafe_suppression_rate delta: [x]
B4 vs B2 appropriate_defer_rate delta: [x]
```

FaultBench:

```text
mechanical_validator_detection_rate: [x]
false_alarm_rate: [x]
semantic_reviewer_detection_rate: [x]
```

TriageQ:

```text
TP_accept_recall: [x]
FP_rejection_rate: [x]
balanced_triage_utility: [x]
UNKNOWN_rate: [x]
cost_per_auditable_decision: [x]
```

## 28. Pre-experiment gates

```text
[ ] 50 admitted build targets verified.
[ ] S4 static evidence producer endpoint/contract consumed.
[ ] S5_FREEZE_GATE satisfied or RQ5 demoted.
[ ] S3 exports case-local ledger and analysis envelope.
[ ] B0-B4 renderer implemented with presentation controls.
[ ] Audit120 sampling pool generated.
[ ] Oracle card schema frozen.
[ ] Reviewer instructions, warm-up cases, and assignment plan prepared.
[ ] FaultBench mechanical validator implemented.
[ ] TriageQ secondary scorer implemented.
[ ] CVE/fix/advisory hidden-provenance leakage audit complete.
[ ] Analysis scripts produce all primary metrics.
```

## 29. Critic review incorporation

Critic verdict: initial `PASS_WITH_CHANGES`; follow-up after incorporation: `PASS`.

Critic assessment:

- Consolidation is mostly successful.
- Frontier/model-SOTA leakage is not harmful; remaining mentions are defensive or appendix-only.
- Mixed-result branches are strong but needed explicit underpowered/no-reviewer/S5-failure branches.
- S3/S4/S5 boundaries are good but needed S5 minimum visible-row schema and S4 bounded-partial reminders.
- Reviewer protocol needed reviewer count, assignment design, response fields, reliability subset, and statistical analysis plan.
- Artifact contract needed full replay/aggregate/scoring bundle.

Changes incorporated after Critic review:

1. Fixed the top status pointer from section 24 to section 29.
2. Expanded artifact contract with top-level run/dataset, replay, raw/normalized S5, aggregate, and scoring artifacts.
3. Added S5 minimum visible evidence row schema and generic Threat KB visibility policy.
4. Strengthened reviewer protocol with 4-6 reviewer minimum, balanced assignment, same-finding exposure rule, reliability subset, and full response fields.
5. Added mixed-effects statistical analysis plan for correctness/safety/time outcomes.
6. Extended result interpretation matrix for reviewer recruitment failure, denominator floor failure, S5 freeze failure, and subjective-sufficiency-only results.
7. Completed frontmatter source refs for related work named in the related-work map.
8. Added S4 `bounded_partial` / surface-status reminder to prevent completeness overclaiming.

Follow-up Critic PASS confirmed all required items were satisfied:

1. section pointer fixed;
2. artifact bundle expanded;
3. S5 minimum visible row schema added;
4. reviewer protocol strengthened;
5. statistical analysis plan added;
6. underpowered/failure branches added;
7. related-work source refs completed;
8. S4 `bounded_partial` / surface-status reminder added.

## 30. Final post-Critic decision

This guideline is now the single pre-paper anchor guideline. It freezes the narrative and operational design while leaving empirical claim strength result-dependent. It is complete only together with validation evidence showing the wiki page parses, the section map is coherent, and the Critic requirements above are represented in the document.
