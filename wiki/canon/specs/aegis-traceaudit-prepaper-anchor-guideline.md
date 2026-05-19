---
title: "AEGIS TraceAudit Pre-Paper Anchor Guideline"
page_type: "canonical-spec"
canonical: true
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "paper-pipeline", "traceaudit", "sast-triage"]
decision_tags: ["prepaper-anchor", "traceaudit", "auditability", "sast-triage", "human-audit", "evidence-ledger", "freeze-before-results", "frozen"]
related_pages: ["wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md"]
---

# AEGIS TraceAudit Pre-Paper Anchor Guideline

> Status: frozen pre-paper anchor guideline.
> Purpose: single operational guide for AEGIS TraceAudit paper identity, benchmark design, reviewer/oracle protocol, success rules, and experiment gates.
> Operating rule: when experiments are difficult or mixed, do not change the paper identity; use the downgrade and interpretation branches defined here.
> Boundary: endpoint/API implementation details are governed by their service contracts, while this document governs paper claims and measurement design.

## 0. Executive decision

AEGIS is now a **trace-auditable SAST triage architecture** paper.

The paper is not a model-family leaderboard, a new SAST engine, or a whole-repository vulnerability detector. The paper is about whether a SAST finding's TP/FP/UNKNOWN decision can be turned into an evidence-ledger artifact that a reviewer can inspect, challenge, defer, and audit.

Stable thesis:

> SAST warning triage should be evaluated as an auditable decision workflow, not only as a classifier score. AEGIS separates static evidence production, contextual knowledge retrieval, and final evidence-guided triage so that each verdict can be reconstructed through evidence refs, producer traces, diagnostics, and claim-boundary rules.

Reviewer stance:

> AEGIS does not try to replace the security reviewer; it tries to make the reviewer's triage decision reconstructable.

## 1. How to use this anchor

Read this document as the complete paper-direction contract before running experiments or writing the manuscript. It defines:

- the paper thesis and non-goals;
- analysis units and S3/S4/S5 responsibilities;
- packet conditions and benchmark layers;
- reviewer, oracle, leakage, and UNKNOWN policies;
- success rules, safety gates, and downgrade branches;
- pre-experiment execution gates.

This document is intentionally self-contained. Do not re-open paper identity, benchmark architecture, or primary comparison while executing experiments. If implementation details are needed, consult the relevant service/API contract, then return here for paper-claim interpretation.

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
- paper section outline;
- whether S5_FREEZE_GATE passes and whether Threat KB/S5-context contribution is mainline or exploratory.

Filled after experiments:

- numeric effect sizes;
- confidence intervals;
- exact accepted/rejected hypotheses;
- final wording of empirical contribution 4;
- whether RQ5 empirical result is positive/null;
- final strength of RQ5 evidence-layer contribution;
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

SastBench, ZeroFalse, Sifting the Noise, QASecClaw, and industrial LLM false-positive reduction work mostly evaluate agent/model outputs, precision/F1, cost, or false-positive filtering. Human-AI and vulnerability-explanation work motivates measuring reviewer behavior, but it does not evaluate trace-ledger SAST audit packets. These bodies of work are important but do not directly measure the auditability of the decision artifact.

### Move 3 — AEGIS separates bounded evidence from final verdicts

S4 and S5 may produce bounded evidence and diagnostics. They may not silently become verdict producers. S3 owns final finding-level TP/FP/UNKNOWN and must cite evidence, diagnostic rationale, or claim-boundary rationale.

### Move 4 — The benchmark compares packet forms, not model families

The main comparison is B4 vs B2:

```text
B2 = same evidence rows + same-backbone machine verdict/rationale,
     but no evidence ledger / trace / claim links
B4 = full AEGIS packet with ledger / trace / claim links / verdict
```

This isolates trace-auditability from merely providing more context.

### Move 5 — Results determine claim strength, not paper identity

Positive results support a stronger audit-effectiveness claim. Mixed or negative results still have predetermined interpretations. Results do not change the paper into a model-family leaderboard.

## 5. Non-goals and red lines

AEGIS TraceAudit is not:

- a model-family leaderboard;
- a model-SOTA paper;
- a general vulnerability discovery benchmark;
- a repository-wide recall benchmark;
- a Build Agent, automatic build recovery, or compile-context generation paper;
- a patch-generation or repair-quality paper;
- a proof of vulnerability absence;
- an S4-only or S5-only security verdict paper;
- a claim that traceability equals correctness.

Forbidden writing:

```text
AEGIS is a model-SOTA result.
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

Main-benchmark scoring rule:

```text
Main benchmark scoring units are SAST findings.
Claim candidates are internal S3 records used to express, decompose, or audit
triage decisions about those findings. They do not expand the evaluated
candidate set unless explicitly declared in an appendix.
```

This prevents the paper from drifting into repository-wide vulnerability discovery.

## 7. S3/S4/S5 paper-facing roles

| Internal lane | Paper-facing role | Responsibility | Final verdict? |
|---|---|---|---|
| S3 | Analysis Orchestrator / Evidence-Guided Triage Agent | owns case state machine, evidence ledger, triage, normalized artifacts, aggregate exports, scoring, paper export | yes |
| S4 | Static Evidence Producer | produces deterministic static/source/build evidence for admitted target | no |
| S5 | Contextual Knowledge Provider / Code KB Provider | builds target-scoped Code KB / Source Code KG and returns contextual/Threat KB evidence | no |

S4 and S5 do not communicate directly. Any S4-derived context sent to S5 flows through S3 and must be logged in the evidence ledger.

Manuscript style rule:

```text
Use paper-facing names first:
  Analysis Orchestrator (S3)
  Static Evidence Producer (S4)
  Contextual Knowledge Provider (S5)

Use S3/S4/S5 as engineering aliases only after first definition.
```

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

Reviewer-facing packets may show `bounded_partial` as a producer completeness note, but must not present it as TP, FP, or UNKNOWN evidence unless S3 separately uses it as diagnostic rationale.

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

S4 failure after admission:

```text
stage status = diagnostic;
case may be exported as diagnostic-only if S3 can create a bounded UNKNOWN/diagnostic packet;
case counts toward Trace50 diagnostic reporting;
case is not sampled into Audit120 unless explicitly selected as a diagnostic stressor.
```

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

Artifact release tiers:

| Tier | Contents | Notes |
|---|---|---|
| public | schemas, manifests, packet renderers, non-sensitive aggregate metrics, anonymized reviewer logs, non-sensitive evidence rows | publishable if license/privacy checks pass |
| restricted | source snapshots and build artifacts subject to project licenses | release only under license-compatible conditions |
| hidden/internal | CVE/fix/advisory/provenance ledger, reviewer identities, compensation records, raw consent records | never model-visible; not part of public packet |

Release gates:

```text
sources-and-licenses.md completed;
source/license release policy completed for all 50 build targets;
reviewer identity and compensation records separated from response logs.
```

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
- do not turn this harness into a model leaderboard.

Experiment-readiness gate:

```text
triage-core-v1 harness connected to live or file-backed S4/S5 artifacts under the paper contract.
```

## 12. Benchmark layers

```text
AEGIS-Trace50      = system artifact and traceability benchmark
AEGIS-Audit120     = human/security-reviewer audit-effectiveness benchmark
AEGIS-FaultBench   = trace-fault injection and validator benchmark
AEGIS-TriageQ      = secondary triage-quality preservation sanity study
```

Core: Trace50, Audit120, FaultBench.

Secondary: TriageQ.

TriageQ cannot rescue the paper if Trace50, Audit120, or FaultBench fail their core readiness/safety gates. It only checks that auditability does not destroy triage quality.

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

Audit120 sampling feasibility gate:

```text
completed Trace50 cases must contain at least 80 eligible warning/finding candidates after exclusion.
```

If this gate fails, Audit120 cannot support the primary human-audit claim without expanding the case pool or re-running evidence acquisition.

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
| B2 | same evidence rows + machine verdict/rationale, no ledger | strongest non-AEGIS baseline |
| B3 | AEGIS ledger without verdict | artifact-only effect |
| B4 | full AEGIS packet | main condition |
| B5 | limited ablations | subset layer attribution |

Machine verdict visibility by condition:

```text
B0: no machine verdict.
B1: same-backbone machine verdict + raw natural-language rationale.
B2: same-backbone machine verdict + evidence-enriched natural-language rationale
    generated from the same evidence rows, but without evidenceRef resolution,
    producer trace, claim-evidence links, claim-boundary annotations, or ledger navigation.
B3: no machine verdict.
B4: machine verdict shown in Phase B after ledger-only Phase A.
B5: follows the pre-registered parent condition for each ablation.
```

B5 ablation cap:

```text
B5a no Code KB
B5b no Threat KB
B5c no claim-evidence links

B5 runs only on a pre-registered subset.
B5 is not part of the primary success rule.
No additional B5 variants may be added without explicitly updating this anchor.
```

Denominator floors:

```text
oracle TP >= 20
oracle FP >= 20
oracle UNKNOWN >= 10
machine-wrong cases under B4 >= 10
machine-wrong cases under B2 >= 10
```

If a floor is not met, the relevant metric/RQ is exploratory.

Workload plan:

```text
Primary Audit120 target:
  80 cases minimum for the primary human-audit claim.

Pilot / exploratory minimum:
  60 cases x 5 packet conditions x 1 judgment = 300 tasks.

Reliability subset:
  20-case subset x 5 conditions x second judgment = 100 tasks.
```

If only 60 cases are used, the primary success rule may be evaluated only if all denominator floors are met; otherwise Audit120 is exploratory.

Natural vs injected wrong-verdict rule:

```text
For wrong_verdict_detection_rate as a primary B4-vs-B2 endpoint:
  machine-wrong cases under B4 >= 10; AND
  machine-wrong cases under B2 >= 10.

If either denominator is below 10,
  wrong-verdict detection is descriptive/exploratory for the affected comparison.
FaultBench may separately test injected trace/verdict fault detectability,
  but injected faults do not replace natural machine-wrong denominators.
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
- same-backbone machine verdict and evidence-enriched natural-language rationale;
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

Evidence selection logging:

```text
key_evidence_refs_or_spans:
  B3/B4: evidenceRef
  B0/B1/B2: visible row number, text span, file/line, or reviewer-highlighted snippet

packet_renderer mapping:
  B2 visible rows map to hidden evidenceRef for analysis,
  but reviewers do not see those refs.
```

This avoids exposing ledger refs in B2 while still allowing analysis to connect reviewer-selected spans back to underlying evidence rows.

## 16. Reviewer protocol

Minimum reviewer design:

```text
reviewers: 4-6 security-trained participants minimum for primary Audit120 claims
assignment: balanced incomplete block or Latin-square style assignment
same-finding exposure: same reviewer must not see the same finding under multiple packet conditions
reliability subset: second independent judgments on the pre-registered reliability subset
claim downgrade: if reviewer recruitment fails, Audit120 human-effectiveness claims are removed or downgraded to expert-case-study observations
```

Reviewer inclusion criteria:

```text
At least one:
  completed graduate-level security/program-analysis coursework;
  professional security or software-analysis experience;
  prior SAST triage or vulnerability review experience.

Report reviewer background strata:
  student-security;
  professional-security;
  software-engineering-with-SAST;
  other-security-trained.
```

Human-subjects protocol:

```text
IRB/exemption determination obtained or documented;
participant consent form prepared;
compensation policy fixed;
reviewer identities separated from response logs;
data retention/deletion policy defined;
participants may withdraw.
```

Reviewer response fields:

```text
label: TP | FP | UNKNOWN
administrativeInvalidation: none | Excluded | packet_corrupt | out_of_task_scope
confidence: 0-100
key_evidence_refs_or_spans: [evidenceRef | visible row number | text span | file/line]
evidence_sufficiency: 1-5
time_to_decision_seconds
notes
machine_verdict_action: accept | overturn | defer | not_shown
```

Reviewer `Excluded` policy:

```text
Excluded is an administrative invalidation, not an uncertainty label.
A reviewer may mark a task Excluded only when the packet is visibly corrupted,
the displayed item is not a SAST finding, or the case is outside the displayed
build target. All ordinary uncertainty must be recorded as UNKNOWN.
```

B4 sequential reveal:

```text
Phase A: reviewer sees ledger without machine verdict and records provisional TP/FP/UNKNOWN.
Phase B: reviewer sees AEGIS verdict and records final action.
```

B4 timing fields:

```text
B4_time_phaseA_seconds: ledger without verdict -> provisional label
B4_time_phaseB_seconds: verdict reveal -> final action
B4_time_total_seconds: phaseA + phaseB
```

Timing interpretation:

```text
B3 vs B4 Phase A: artifact-only comparability.
B4 Phase B: machine verdict reliance cost/benefit.
B4 total vs B2: full decision-support workflow cost.
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
  mixed-effects model on log(time_to_decision_seconds); for B4 also model B4_time_phaseA_seconds, B4_time_phaseB_seconds, and B4_time_total_seconds
  fixed effects: packet condition, log(packet_size_tokens) when feasible,
                 evidence_row_count when feasible
  random intercepts: reviewer, finding/case

reporting:
  effect sizes and confidence intervals first;
  p-values only as secondary evidence;
  descriptive-only reporting for underpowered denominators.

fallback:
  if mixed-effects model fails to converge or has singular random effects,
  report cluster bootstrap or permutation tests over reviewer and finding clusters
  as sensitivity analysis.
```

## 17. Oracle card contract

Each Audit120 oracle card should include:

```text
caseId
findingId
groundTruthLabel: TP | FP | UNKNOWN
auditVisibleLabel: TP | FP | UNKNOWN
oracleAdministrativeExclusionReason: none | Excluded | packet_corrupt | out_of_scope | not_a_sast_finding
oracleReason
unknownReason: UNKNOWN_INSUFFICIENT_CONTEXT | UNKNOWN_CONFLICTING_EVIDENCE |
               UNKNOWN_PRODUCER_DIAGNOSTIC | UNKNOWN_OUT_OF_SCOPE |
               UNKNOWN_CLAIM_BOUNDARY | null
adjudicationLevel: author_only | external_agreed | third_reviewer | provenance_escalated
visibleEvidenceUsed: [visibleBundleRef | oracleEvidenceRef]
hiddenProvenanceUsed: true | false
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
reviewerVisible: true | false
safetyHarmClass: false_accept_harm | false_suppression_harm | low_harm | not_applicable
```

Oracle label separation:

```text
groundTruthLabel:
  final security fact after hidden provenance may be considered.

auditVisibleLabel:
  label a reviewer can responsibly choose using only reviewer-visible evidence.

audit_accuracy and appropriate_defer_rate are scored against auditVisibleLabel.
groundTruthLabel is used for safety analysis, hidden-provenance audit, and
post-hoc explanation of why visible evidence was or was not sufficient.

unsafe_accept_rate and unsafe_suppression_rate are scored against
groundTruthLabel, not auditVisibleLabel. Deferral/UNKNOWN on a groundTruth TP
is not counted as unsafe suppression unless the workflow converts the case into
FP/suppress.
```

Primary Audit120 oracle admissibility:

```text
Primary Audit120 cases must use external_agreed, third_reviewer, or
provenance_escalated adjudication. author_only cases are excluded from
the primary Audit120 denominator and may be reported only as a
pilot/exploratory separate stratum.

Oracle cards with oracleAdministrativeExclusionReason != none are removed from
Audit120 scoring denominators and are never counted in audit_accuracy or
appropriate_defer_rate.
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

Oracle independence rule:

```text
AEGIS evidenceRef must not be required for oracle construction.
Oracle-visible facts use visibleBundleRef or oracleEvidenceRef.
If an oracle-visible fact later maps to an AEGIS evidenceRef,
  that mapping is stored separately in finding-match-map.jsonl.
```

This prevents the circularity attack that AEGIS is evaluated against an oracle built from its own evidence ledger.

## 18. FaultBench contract

Purpose: if trace-auditability is the claim, broken traces must be detectable.

Mechanical faults:

```text
missing evidence ref
missing producer trace
malformed ref
stale caseId/buildTargetId
S4 empty/not_available/error boundary misuse
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

Minimum FaultBench size:

```text
mechanical faults: at least 20 per major class where feasible
clean packets: at least 50
semantic faults: exploratory, at least 30 if reviewer burden permits
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
C4/B5a AEGIS no Code KB
C5/B5b AEGIS no Threat KB
C6/B5c AEGIS no claim-evidence links
Optional appendix: alternative-model raw rationale, no leaderboard claim
```

C0 handling:

```text
C0 SAST-only does not emit TP/FP unless a pre-registered heuristic is defined.
For triage-quality metrics, C0 may be excluded or treated as an "alert retained" baseline.
```

Cost definitions:

```text
machine_packet_generation_cost = model/API cost + amortized S4/S5 processing cost
human_review_time_cost = reviewer time cost, reported separately
cost_per_auditable_decision = machine_packet_generation_cost / auditable decision count
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
visibleLeakageClass: generic | cve_id | fix_commit | advisory | exploit_writeup | patch_text
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

If not satisfied:

```text
Threat KB and S5-context portions of RQ5 become exploratory or removed.
S4-only, claim-link, and ledger-structure ablations may remain mainline if their gates pass.
```

## 21. Primary success rule

AEGIS-TraceAudit supports the strong main audit-effectiveness claim only if:

```text
1. B4 Full AEGIS packet improves either audit_accuracy or
   wrong_verdict_detection_rate over B2 Evidence-enriched rationale, no ledger,
   after the endpoint-family correction.

   Strong success requires:
     effect estimate >= the practical improvement margin; AND
     unadjusted 95% confidence interval lower bound > 0; AND
     the Holm-adjusted endpoint test passes at alpha = 0.05.

   Practical-but-underpowered signal:
     effect estimate >= the practical improvement margin, BUT the confidence
     interval includes 0. This supports only exploratory/practical signal,
     not the strong main audit-effectiveness claim.

2. B4 does not increase unsafe_accept_rate or unsafe_suppression_rate over B2
   beyond the pre-registered harm margin, recommended initial margin: +5 percentage points.

   Safety gate:
     point estimate of unsafe_accept_rate_delta and unsafe_suppression_rate_delta <= +5pp.

   Safety uncertainty:
     if the upper confidence bound exceeds +5pp, report safety uncertainty even
     when the point estimate passes.

   Safety failure:
     point estimate > +5pp.

3. Trace50 engineering floors pass:
   trace_completeness_rate >= 0.95,
   claim_without_evidence_rate <= 0.05,
   boundary_violation_rate = 0 on validator-detectable rules.

4. FaultBench mechanical_validator_detection_rate >= 0.95.
```

Practical improvement margins:

```text
audit_accuracy: +5 percentage points
wrong_verdict_detection_rate: +10 percentage points
time_to_decision: -20% median or model-estimated reduction
```

Endpoint family rule:

```text
Effectiveness family:
  audit_accuracy
  wrong_verdict_detection_rate

Endpoint-family decision:
  compute effect estimate and 95% confidence interval for each endpoint;
  compute p-values or bootstrap tail probabilities for positive effect;
  apply Holm-style correction across the two endpoints.

Strong success:
  at least one endpoint has effect estimate >= practical margin,
  unadjusted 95% confidence interval lower bound > 0,
  and Holm-adjusted endpoint test passes at alpha = 0.05.

Reporting:
  both endpoints must always be reported.

If using simultaneous confidence intervals instead, define the simultaneous CI
construction explicitly before analysis. No hierarchical endpoint alternative is active.
```

Time-only success does not satisfy the main audit-effectiveness claim. It supports only a workflow-efficiency claim if unsafe rates do not worsen and Trace50/FaultBench pass.

If condition 1 fails but conditions 2-4 pass, the paper may still be an auditability infrastructure paper, but not a strong human-audit benefit paper.

If conditions 2-4 fail, the core paper claim is not ready.

## 22. Metric validity checklist

| Metric | Measures | Does not measure | Misuse risk |
|---|---|---|---|
| `trace_completeness_rate` | evidence refs resolve to producer-traced ledger rows | security correctness | wrong but traceable verdict looks valid |
| `claim_without_evidence_rate` | TP/FP claims cite support | semantic sufficiency | weak evidence is cited but not enough |
| `boundary_violation_rate` | S4/S5 status misuse | all unsound reasoning | validator safety mistaken for full correctness |
| `audit_accuracy` | reviewer correctness under packet condition | universal SAST superiority | curated suite overgeneralized; oracle uncertainty or hidden-provenance leakage inflates apparent correctness |
| `time_to_decision` | review efficiency | correctness/safety | faster wrong decisions counted as success; reviewer fatigue/order or packet-size effects mistaken for ledger value |
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
| B3 beats B2 and B4 approximately equals B3 | ledger artifact helps; machine verdict adds little | trace ledger improves human analysis | full AEGIS verdict adds measurable value over ledger-only review |
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
| SastBench | binary agentic SAST finding TP/FP classification | nearby but weakly-anchored contrast only; AEGIS measures UNKNOWN-aware reviewer-auditable decision artifacts |
| ZeroFalse | evidence-enriched LLM adjudication precision | motivates B2 baseline; AEGIS tests trace structure with same evidence rows |
| Sifting the Noise | LLM agent FP filtering and safety/cost tradeoffs | motivates raw rationale baseline and unsafe suppression metric |
| QASecClaw | multi-agent SAST FP reduction | motivates contextual review baseline; not directly reproduced |
| Tencent industrial FP reduction | industrial alarm reduction/cost | motivates time/cost/safety metrics; not direct baseline |
| CodeCureAgent | warning classification + repair | adjacent; AEGIS stops before repair |
| IRIS | whole-repository vulnerability detection | contrast; AEGIS is fixed-warning triage |
| SecVulEval / PrimeVul / DiverseVul / Devign | C/C++ vulnerability detection/data quality | background for context/leakage caution; not direct benchmark |
| Human-AI readiness | reliance, interaction, harm, readiness | basis for sequential reveal and reliance metrics |
| Vulnerability explanation study | explanation effects on practitioners | justifies B1/B2/B3/B4 distinction |
| SARIF / CodeQL-style alert formats | standardized static-analysis finding representation | background for warning records; AEGIS adds audit-ledger and reviewer protocol rather than replacing alert formats |

SastBench handling rule:

```text
Use SastBench only as a nearby contrast showing that SAST triage benchmarking is
becoming crowded. Do not use it as a methodological anchor, model-performance
authority, or validation of binary TP/FP triage.
```

Reasons this anchor treats SastBench as contrast rather than support:

- task formulation forces binary TP/FP and does not evaluate UNKNOWN, inconclusive, or responsible abstention;
- TP construction relies on CVE/NVD/CVEFixes-style provenance and should not be imported as root-cause oracle quality;
- FP construction uses Semgrep free-edition findings plus heuristics and does not establish a validated realistic FP distribution;
- reported dataset imbalance requires base-rate and operating-point context before precision/recall/MCC conclusions are reused;
- model/prompt results are not evidence that a specific model or agent architecture should anchor AEGIS;
- a no-tools baseline being close to simple ReAct on aggregate metrics weakens any claim that agent architecture alone is the key result.

AEGIS therefore differs by making UNKNOWN first-class, separating unsafe
suppression from aggregate accuracy, controlling B2 vs B4 over the same evidence
rows, and evaluating reviewer-auditable evidence-ledger packets rather than agent
output alone.

## 25. Paper section outline

1. **Introduction** — SAST triage as audit workflow; AEGIS thesis; contributions.
2. **Background and related work** — SAST triage, evidence-enriched LLM adjudication, vulnerability datasets, human-AI/explanation, static-analysis workflow.
3. **Task, threat model, and claim boundaries** — build target, finding, evidence row, TP/FP/UNKNOWN, producer boundaries, leakage, non-goals.
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
3. Packet conditions: B0/B1/B2/B3/B4, explicitly showing same evidence rows split into B2 unstructured dump vs B4 ledger + trace + claim links + verdict.
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
producer_trace_coverage: [x]
boundary_violation_rate: [x]
diagnostic_separation_rate: [x]
```

Audit120:

```text
B4 vs B2 audit_accuracy delta: [x]
B4 vs B2 wrong_verdict_detection_rate delta: [x]
B4 vs B2 time_to_decision delta: [x]
B4_time_phaseA_seconds delta vs B3: [x]
B4_time_phaseB_seconds summary: [x]
B4_time_total_seconds delta vs B2: [x]
B4 vs B2 unsafe_accept_rate delta: [x]
B4 vs B2 unsafe_suppression_rate delta: [x]
B4 vs B2 appropriate_defer_rate delta: [x]
B4 vs B2 evidence_sufficiency_score delta: [x]
confidence_calibration summary: [x]
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
[ ] B2 includes same-backbone machine verdict/rationale while hiding ledger refs/traces/claim links.
[ ] Audit120 sampling pool generated.
[ ] B2 and B4 machine-wrong denominator feasibility checked for wrong_verdict_detection_rate.
[ ] Oracle card schema frozen.
[ ] Reviewer instructions, warm-up cases, and assignment plan prepared.
[ ] FaultBench mechanical validator implemented.
[ ] TriageQ secondary scorer implemented.
[ ] CVE/fix/advisory hidden-provenance leakage audit complete.
[ ] Analysis scripts produce all primary metrics.
[ ] Audit120 primary sample >= 80 unless explicitly exploratory.
[ ] Primary Audit120 cases have external_agreed / third_reviewer / provenance_escalated oracle level; author_only cases are excluded from the primary denominator and reported only as pilot/exploratory separate stratum.
[ ] auditVisibleLabel vs groundTruthLabel policy frozen, including unsafe metrics scored against groundTruthLabel.
[ ] B4 phaseA/phaseB timing fields implemented.
[ ] Endpoint family rule fixed to Holm-style correction.
[ ] Excluded reviewer-label policy clarified.
[ ] B5 ablation cap frozen.
```

## 29. Final freeze boundary

AEGIS TraceAudit is frozen as a paper direction. The frozen elements are:

```text
paper identity
benchmark architecture
primary comparison B4 vs B2
non-goals and red lines
S3/S4/S5 role boundaries
Trace50 / Audit120 / FaultBench / TriageQ layers
primary success rule
oracle and reviewer protocol
related-work positioning
```

The following remain execution variables, not reasons to redesign the paper:

```text
numeric results
exact Audit120 sampled cases
reviewer roster
S5 implementation details before S5_FREEZE_GATE
empirical claim strength after results
```

Execution posture:

```text
Do not respond to experiment friction by changing the paper identity.
Use the pre-defined downgrade/result-interpretation branches when gates fail.
Next work is execution: S5_FREEZE_GATE, S4/S5 artifact connection, Trace50 dry run,
Audit120 pool/oracles, packet renderer, human-study preparation, FaultBench validator,
and metrics-script dry run.
```
