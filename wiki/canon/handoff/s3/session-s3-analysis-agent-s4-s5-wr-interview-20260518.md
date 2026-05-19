---
title: "Session notes — S3 Analysis Agent S4/S5 WR interview 2026-05-18"
page_type: "canonical-handoff-session"
canonical: true
source_refs:
  - "user-session-2026-05-18"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "s5", "analysis-agent", "sast-runner", "knowledge-base"]
decision_tags: ["wr-planning", "api-contract", "analysis-agent", "paper-api", "paper-state-machine", "build-target-case", "triage-unit", "evidence-ledger", "compilation-context", "lane-io-contract"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/work-requests/s4-to-s3-s3-must-implement-full-safe-consumption-of-current-s4-v0.11.2-api-and-evidence-c.md", "wiki/canon/work-requests/s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro.md"]
---

# Session notes — S3 Analysis Agent S4/S5 WR interview 2026-05-18

## Purpose
Prepare concise interview evidence before drafting S3-origin WRs to S4 and S5.

The discussion is intentionally a lightweight Q&A, not the full deep-interview workflow.

## Starting hypothesis
S3 Analysis Agent needs targeted upstream WRs to S4 and S5 for a paper-oriented pipeline. The goal is not general product hardening first; it is to design a paper-specific API contract and state machine that can run S3/S4/S5 together as an experiment scaffold.

## Decided direction

### Q1. Immediate objective of the next S3→S4/S5 WR batch
User selected: **paper experiment support**.

Clarification:
- Do not prioritize claim-quality tuning yet.
- Claim-quality hardening should wait until the S3/S4/S5 full pipeline is proven to run normally and the new paper contract is stable enough to freeze.
- This pass should create a **new API contract and state machine for paper experiments**.
- Working slogan: **For Paper**.

## Core terminology decisions

### Build target
A **build target** is a reproducible compilation-context unit: a source/configuration/build boundary for which AEGIS can obtain `compile_commands.json` or an equivalent compile context.

It is **not** necessarily the smallest code unit.

A build target may be:
- one executable;
- one `.so` / `.a` library;
- one service/app inside a monorepo;
- one source tree under a specific build configuration/toolchain;
- one target that produces enough compile context for S4/S3 analysis even if it contains many files/functions/findings.

Preferred paper terms:
- reproducible compilation-context unit;
- analysis case boundary;
- build-target-scoped analysis unit;
- reproducible build boundary.

Avoid calling it a "minimal unit" because one build target may contain many translation units, source files, functions, dependencies, SAST findings, and claim candidates.

### Analysis case
An **analysis case** is one build-target-scoped S3/S4/S5 run.

Definition:
> One analysis case is one build target analysis run in which AEGIS acquires deterministic static/source/build evidence, obtains contextual KB/Threat/Source Code KG evidence, triages the findings inside the build target, and exports a target-level audit/evidence envelope.

Important relationship:
- **Case unit**: build target.
- **Triage/scoring unit**: individual SAST finding or claim candidate inside that build target.
- **Evidence unit**: evidence ref / acquisition envelope / retrieval trace.
- **Run summary unit**: target-level analysis envelope aggregating all findings, triage outcomes, evidence coverage, abstentions, and failures.

Proposed paper wording:
> We define a build target as a reproducible compilation-context unit: a source/configuration boundary for which a compile database can be obtained. A build target is not necessarily the smallest program unit; it may contain many translation units, source files, dependencies, and SAST findings. AEGIS treats one build target as one analysis case and performs evidence acquisition and finding-level triage within that target.

## Role and I/O contract draft

The paper pipeline should be initiated by S3. S3 owns the analysis case and state machine; S4 and S5 are evidence producers under S3's paper contract.

### S3 — Analysis Agent / paper orchestrator
Receives:
- From user/harness: `caseId`, build target identity, source root/path, build config, compile DB path or build context pointer, experiment metadata.
- From S4: static evidence bundle, findings, source anchors, staticEvidenceContract, function/include/library/build metadata, acquisition diagnostics, stable evidence IDs.
- From S5: target-level context, finding-level context, CVE/library/threat context, Source Code KG retrieval, retrieval traces, acquisition diagnostics, stable knowledge evidence IDs.

Provides:
- To S4: build-target descriptor, compile context pointer, source root, scope filters, requested static/source evidence surfaces, provenance/case metadata.
- To S5: target descriptor, S4 findings, source anchors, library identities, CWE/rule IDs, source/function neighborhoods, query intents, provenance/case metadata.
- To paper export: target-level analysis envelope, finding-level TP/FP/UNKNOWN triage records, claim/caveat/evidence refs, evidence ledger, acquisition diagnostics, timing/cost/reproducibility metadata.

Owns:
- case state machine;
- evidence normalization/ledger;
- finding-level triage;
- claim-boundary enforcement;
- target-level paper export.

Does not own:
- SAST execution;
- S4 static/source extraction internals;
- S5 KB/index/corpus ownership;
- upstream evidence fabrication.

### S4 — deterministic static/source/build evidence producer
Receives from S3:
- build target descriptor;
- source root/path or workspace pointer;
- compile DB path/equivalent compile context;
- build profile/toolchain metadata when available;
- scope hints/filters such as included/excluded paths or third-party paths;
- requested surfaces, e.g. SAST findings, functions, includes, libraries, metadata;
- case/provenance identifiers.

Provides to S3:
- build-target-scoped static evidence bundle;
- SAST findings with stable finding IDs;
- tool/rule/CWE/location/source-range/function anchors;
- staticEvidenceContract gates/matrices;
- function/include/library/build metadata;
- source/code structural evidence only;
- tool execution and acquisition diagnostics;
- stable evidence references and reproducibility metadata such as tool versions, hashes, command lines, skipped-tool reasons.

Owns:
- deterministic static evidence production;
- source/build structural extraction;
- local SAST/tool execution status;
- statement of what S4 evidence can/cannot support.

Does not own:
- final TP/FP/UNKNOWN triage;
- vulnerability absence;
- exploitability judgment;
- external affectedness;
- semantic GraphRAG completeness;
- final security verdict.

### S5 — contextual knowledge / Threat KB / Source Code KG producer
Receives from S3:
- build target descriptor and case metadata;
- S4 findings and source anchors;
- library identities/version/confidence from S4;
- CWE/rule IDs, tool messages, API/symbol names;
- source/function neighborhoods or code graph references;
- S3 query intents such as target-level context, finding-level context, CVE context, false-positive pattern, sanitizer/guard pattern;
- provenance identifiers.

Provides to S3:
- target-level context bundle;
- finding-level context bundle;
- CVE/library/threat context with provenance;
- Source Code KG retrieval results;
- retrieval traces including query, corpus/index version, hit IDs, scores, selected snippets, discarded-hit reasons;
- acquisition envelopes with hit/no-hit/partial/timeout/not-ready/input-insufficient/ambiguous/error status;
- stable knowledge evidence references.

Owns:
- Threat KB retrieval;
- CVE/library context lookup;
- Source Code KG retrieval;
- knowledge provenance and retrieval diagnostics;
- explicit no-hit/timeout/ambiguous separation.

Does not own:
- SAST execution;
- compile context production;
- source-level final vulnerability verdict;
- final TP/FP/UNKNOWN triage;
- treating KB no-hit as safety or KB hit as vulnerability proof.

## Current design implication
The upcoming WRs should ask S4 and S5 to cooperate on a paper-only or paper-first integration surface, rather than trying to bend the current production/S2-driven pipeline into experiment use.

Expected shape:
- S3 remains the experiment/orchestration consumer.
- S4 provides deterministic static/build/source evidence under a paper contract.
- S5 provides Threat KB / Source Code KG / contextual retrieval evidence under a paper contract.
- The new state machine should make every handoff auditable and replayable for later experiment reporting.
- The state machine must preserve the distinction between target-level case execution and finding-level triage.

## Candidate WR directions

### S4 candidate lane questions
- What S4 evidence surfaces should S3 rely on as canonical input for the paper Analysis Agent pipeline?
- Whether S4 should expose or strengthen paper/analysis-oriented endpoints or fixtures.
- Whether S4 should provide source/code graph slices in a form S3 can consume without treating them as semantic conclusions.
- Whether S4 should emit stable machine-readable provenance/evidence IDs for S3 claim grounding.
- Whether S4 can return a build-target-scoped evidence bundle containing all findings, staticEvidenceContract, compile/build metadata, source location anchors, and stable evidence IDs for each finding.

### S5 candidate lane questions
- What S5 Threat KB / Source Code KG evidence should S3 consume during paper triage?
- Whether S5 should expose target-scoped acquisition envelopes and abstention-safe diagnostics that S3 can consume directly.
- Whether S5 should provide CVE/library/threat context as positive/caveat evidence without forcing final verdicts.
- Whether S5 should support paper-oriented retrieval traces for later experiment audit.
- Whether S5 can accept build-target-scoped context from S4/S3 and return retrieval/evidence bundles keyed by target, finding, source location, library identity, or CWE.

## Interview log

### Q1 answered
Purpose is paper experiment support. Claim-quality improvement is intentionally deferred until the full S3/S4/S5 pipeline is running and the new paper contract/state machine is established.

### Q2 answered
One build target is one paper case. Multiple findings may be triaged inside that case. The word **analysis** means the target-scoped acquisition + triage + evidence ledger envelope, not only one LLM answer or one warning.

### Q2-b answered
Build target is not a minimal unit. It is a reproducible compilation-context unit / build boundary for which compile context can be obtained. Analysis case is the build-target-scoped run; finding-level triage and evidence refs live under that case.

### Q3 pending
Define the minimum paper state machine stages for one build-target analysis case.

### Q4 answered
Before finalizing Q3 state machine, S3/S4/S5 roles and I/O must be fixed. Draft decision: S3 starts and owns the case/state machine; S4 receives build-target/compile-context inputs and returns deterministic static/source/build evidence; S5 receives target/finding/source/library context and returns contextual knowledge/retrieval evidence. S3 consumes both and produces final target-level analysis envelope plus finding-level triage.

## Current status
Interview in progress; Q3 still pending after role/I-O clarification.

---

## Q5 answered — S4/S5 parallel setup model

User proposed and S3 agrees: S4 and S5 should not directly call each other or exchange hidden side-channel state in the paper pipeline. S3 owns orchestration and starts both setup branches.

### Core decision

```text
S3 starts analysis case
  ├─ S4 setup branch: build-target static evidence acquisition
  └─ S5 setup branch: build-target Code KB / Source Code KG / context preparation
```

S4 receives the build target from S3 and performs deterministic static analysis/source/build evidence acquisition.

S5 receives the same build target identity/context from S3 and prepares target-scoped Code KB / Source Code KG / Threat KB retrieval surfaces.

S4 does not call S5. S5 does not depend on direct S4 calls. Any dataflow from S4 to S5 is mediated by S3.

### Refined model

The pipeline should distinguish two S5 stages:

1. **S5 target-level setup**
   - can run in parallel with S4;
   - forms/refreshes target-scoped Code KB or Source Code KG context;
   - indexes or validates source/context readiness;
   - emits target-level acquisition/readiness envelope.

2. **S5 finding-level enrichment**
   - runs after S4 findings are available;
   - S3 sends S4 finding IDs, source anchors, CWE/rule IDs, library identities, and query intents to S5;
   - S5 returns finding-scoped contextual evidence/retrieval traces.

### Paper state-machine implication

The setup phase is parallel:

```text
CASE_REGISTERED
BUILD_CONTEXT_READY
SETUP_RUNNING
  ├─ S4_STATIC_EVIDENCE_READY
  └─ S5_TARGET_KB_READY
S5_FINDING_CONTEXT_READY
S3_TRIAGE_COMPLETED
PAPER_EXPORT_READY
```

`S5_TARGET_KB_READY` can complete before S4 findings exist. `S5_FINDING_CONTEXT_READY` depends on S4 findings because S3 must mediate finding-level query construction.

### Rationale

- S3 remains the analysis case owner and evidence-flow authority.
- S4 remains deterministic local static/source/build evidence producer.
- S5 remains contextual knowledge/Code KB producer.
- Keeping S4 and S5 independent avoids hidden coupling and makes paper artifact flow auditable.
- Any S4-derived context consumed by S5 is explicit in the S3 evidence ledger and paper run envelope.

---

## Terminology note — paper names must replace lane names

User clarified that the paper will not use internal lane names such as S3, S4, or S5. These names are temporary engineering shorthand only.

Paper-facing role names should replace them later, for example:
- S3 → Analysis Orchestrator / Evidence-Guided Triage Agent / Analysis Agent;
- S4 → Static Evidence Producer / Static Analysis Evidence Provider;
- S5 → Contextual Knowledge Provider / Threat Knowledge Provider / Source Code KG Provider.

Final naming remains open, but WRs and design artifacts may continue using S3/S4/S5 for internal coordination.

---

## Q6 answered — S5 target setup readiness means target Code KB readiness, not target-specific Threat KB construction

User selected the richer S5 setup direction but clarified an important boundary:

- S5's **Threat KB** and **Code KB** are separate responsibilities.
- Threat KB should be built/maintained independently from any one build target.
- When S3 gives S5 a build target path, S5's target-level setup responsibility is to form/readiness-check the **Code KB / Source Code KG for that target's internal source files**.
- This is not a broad per-target Threat KB construction task.

### Corrected definition

`S5_TARGET_KB_READY` should mean:

```text
S5 has consumed the build target source path/context supplied by S3 and has formed or validated the target-scoped Code KB / Source Code KG retrieval substrate for that build target.
```

It may include:
- source file discovery/indexing;
- function/symbol/chunk indexing;
- Source Code KG or code-retrieval graph readiness;
- target-level code retrieval diagnostics;
- corpus/index version for the target Code KB;
- stable code evidence/retrieval IDs.

It should not mean:
- building a new Threat KB for the target;
- proving CVE affectedness;
- final source-level vulnerability judgment;
- replacing S4 static/source evidence;
- replacing S3 triage.

### Revised relationship

```text
Threat KB: global/independent S5 knowledge layer
Code KB: build-target-scoped source/code knowledge layer formed from S3-provided target path
Finding-level enrichment: S3 combines S4 findings + S5 Code KB + S5 Threat KB lookup results for triage
```

### Paper-facing implication

S5 can be described as maintaining a general Threat Knowledge layer and constructing target-scoped Code KB context on demand. For one analysis case, S5's setup branch prepares the target Code KB, while later finding-level enrichment can combine S4 findings with both Code KB retrieval and independent Threat KB lookups.

---

## Q7 correction — paper methodology excludes service-stability-first failure design

User corrected the discussion: for this interview, service stability / operational resilience should be excluded from the primary design space. Those issues will be fixed during implementation as needed.

The current question is paper methodology:

```text
How should the S3/S4/S5 paper pipeline be defined for experiments?
```

not:

```text
How should production services degrade under arbitrary runtime failures?
```

### Paper admission principle

A build target should be admitted into the paper experiment only if it is a reproducible compilation-context unit.

Admission should happen before the S3/S4/S5 analysis state machine:
- source path exists;
- build target identity is known;
- compile context exists or can be generated;
- compile DB paths resolve;
- referenced source files exist;
- target is in the intended C/C++ scope;
- S4/S5 can deterministically consume the target under the paper contract.

If a target cannot satisfy these conditions, it is a dataset/admission failure, not an analysis case.

### Paper state-machine consequence

The main paper state machine should assume admitted build targets and focus on evidence/triage semantics:

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

Runtime anomalies may still be logged, but they are not the core paper design question.

### Distinctions to preserve

- Admission failure: not part of evaluated analysis cases.
- Operational failure: service/infrastructure anomaly, reported separately.
- Triage UNKNOWN: a finding-level evidence/claim-boundary outcome, not a service failure.

### Current focus
The next WRs should ask S4/S5 for paper-contract support under admitted-target assumptions, not for broad production-grade graceful-degradation behavior.

---

## Q8 answered — paper artifact layout should keep both case-local artifacts and aggregate JSONL

User selected option C.

### Decision
The paper experiment output should have both:

1. **Case-local canonical artifacts** for audit/debug/reproducibility.
2. **Aggregate JSONL exports** for scoring, metrics, and cross-system comparison.

### Proposed layout

```text
paper-runs/
  {experimentId}/
    run-manifest.json
    cases/
      {caseId}/
        case-manifest.json
        analysis-envelope.json
        findings.jsonl
        evidence-ledger.jsonl
        s4-static-evidence.json
        s5-code-kb-summary.json
        s5-finding-context.jsonl
        logs/
    aggregate/
      cases.jsonl
      findings.jsonl
      evidence.jsonl
      metrics-input.jsonl
```

### Intended semantics
- `case-manifest.json`: admitted build target identity and reproducibility metadata.
- `analysis-envelope.json`: target-level run/status/stage summary.
- `findings.jsonl`: finding-level S3 triage records; primary scoring surface.
- `evidence-ledger.jsonl`: evidence refs/acquisition envelopes/retrieval traces used by claims.
- `s4-static-evidence.json`: raw or normalized S4 deterministic static evidence bundle.
- `s5-code-kb-summary.json`: target-scoped S5 Code KB readiness/summary artifact.
- `s5-finding-context.jsonl`: finding-scoped S5 context/retrieval evidence.
- `aggregate/*.jsonl`: experiment-level normalized exports generated from case-local artifacts.

### Open reproducibility question for Critic
The user requested Critic review against this criterion:

> Can a reviewer who knows nothing about the system reproduce the experiment if they are given the artifact bundle and dataset?

Critic should check whether the above artifact layout is sufficient or whether additional files/contracts/scripts are required.

---

## Critic review for Q8 artifact reproducibility — PASS_WITH_CHANGES

Critic reviewed the Q8 artifact layout against the criterion:

> Can a reviewer who knows nothing about the system reproduce the experiment if they are given the artifact bundle and dataset?

### Verdict
`PASS_WITH_CHANGES`

### Summary
The dual layout is correct:

```text
case-local canonical artifacts + aggregate JSONL exports
```

However, this is not yet sufficient for blind reviewer reproduction. The bundle also needs executable replay/scoring contracts, exact schemas, dataset/admission manifests, environment/model provenance, deterministic join rules, oracle/scoring inputs, and integrity files.

### Must be in artifact bundle

```text
schemas/
  JSON Schema for every artifact and aggregate file
  stable ID/join contract for caseId/findingId/evidenceRef/s4FindingId/s5RetrievalId/label IDs

dataset-manifest.json
  dataset version/name
  source archive or commit hashes
  per-case source paths/checksums
  license/availability notes
  admitted and excluded/admission-failed target lists

admission-report.jsonl
  per target admission status
  compile DB path/hash
  source file resolution
  C/C++ scope check
  build context checksum

environment.lock.json
  S3/S4/S5 code commit hashes
  container image digests or dependency lock hashes
  S4 tool versions
  S5 corpus/index versions
  LLM gateway/model version
  generation parameters

reproduce.sh or scripts/
  admit_dataset
  run_case
  run_all_cases
  build_aggregates
  score_metrics

per-case replay inputs
  exact S3 paper-run request
  exact S4 request(s)
  exact S5 target setup request(s)
  exact S5 finding enrichment request(s)
  pipeline/state-machine config
  thresholds
  prompt/template versions

per-case traces
  state-trace.jsonl
  llm-transcript.jsonl
  s4-static-evidence.raw.json plus normalized form or declared lossless normalized artifact
  S5 retrieval traces with query/corpus/index/hits/scores/selected snippets/discarded-hit reasons

scoring inputs
  ground-truth/oracle labels
  finding matching/dedup map where needed
  metrics-input.jsonl regenerable from case-local artifacts

integrity
  checksums.sha256
  README_REPRODUCE.md with expected commands and expected aggregate hash/metric output
```

### Can live in documentation/protocol
- paper-facing role-name mapping;
- state-machine explanation and allowed transitions;
- TP/FP/UNKNOWN/abstain definitions;
- metric formulas and denominator rules;
- UNKNOWN vs operational/admission failure policy;
- one build target = one case, finding-level triage nested inside case.

### Critic stop condition
Not full PASS until a reviewer can run one documented command to rebuild aggregates and metrics from dataset plus bundle, and schemas prove every aggregate row is traceable back to case-local evidence.

### Design consequence
Q8 must be expanded from a simple artifact layout into a **reproducibility bundle contract**. S3/S4/S5 WRs should include the required producer responsibilities for replay inputs, raw/normalized evidence, retrieval traces, schemas, and stable IDs.

---

## Q9 proposal — reproducibility bundle ownership split

S3 proposed the following ownership split for the paper reproducibility bundle.

### Proposed ownership table

| Artifact / contract | Proposed owner |
|---|---|
| `run-manifest.json` | S3 / paper harness |
| `case-manifest.json` | S3 / paper harness |
| `state-trace.jsonl` | S3 |
| `analysis-envelope.json` | S3 |
| `findings.jsonl` | S3 |
| `evidence-ledger.jsonl` | S3 |
| `llm-transcript.jsonl` | S3 |
| `s4-static-evidence.raw.json` | S4 |
| `s4-static-evidence.normalized.json` | S3 or S4, to be decided |
| `s5-code-kb-summary.json` | S5 |
| `s5-finding-context.jsonl` | S5 |
| `s5-retrieval-traces.jsonl` | S5 |
| `schemas/` | S3 owns bundle namespace; S4/S5 provide producer schemas |
| `dataset-manifest.json` | S3 / paper harness |
| `admission-report.jsonl` | S3 / paper harness |
| `environment.lock.json` | S3 aggregates; S4/S5/S7 provide component provenance |
| `aggregate/*.jsonl` | S3 |
| `score_metrics` / scoring scripts | S3 / paper harness |
| `reproduce.sh` / top-level scripts | S3 / paper harness |
| `checksums.sha256` | S3 / paper harness |
| `README_REPRODUCE.md` | S3 / paper harness |

### Simplification candidate
S4 and S5 may own only their raw producer artifacts plus producer schemas/provenance, while S3/paper harness owns all normalization, aggregation, replay, scoring, checksums, and documentation.

### Critic review request
Validate whether this ownership split is sufficient for blind-reviewer reproducibility. In particular:
- Is S3/paper harness correctly the bundle owner?
- Should normalized S4/S5 artifacts be S3-owned to keep aggregate joins deterministic?
- Are S4/S5 responsibilities precise enough for WRs?
- Is anything missing from the ownership table?

---

## Critic review for Q9 ownership split — PASS_WITH_CHANGES

Critic reviewed the reproducibility bundle ownership split.

### Verdict
`PASS_WITH_CHANGES`

### Summary
The big-picture split is correct:
- S3 / paper harness owns the reproducibility bundle, case state machine, normalization, aggregation, scoring, checksums, replay docs, and paper export.
- S4/S5 own raw producer artifacts, producer schemas, provenance fragments, and stable producer IDs.

However, the Q9 table was not yet precise enough for blind-reviewer reproduction or direct S3→S4/S5 WRs.

### Required corrections

1. **Normalized artifacts must be S3-owned**
   - `s4-static-evidence.normalized.json` belongs to S3 / paper harness.
   - S5 normalized views also belong to S3 if aggregates consume them:
     - `s5-code-kb.normalized.json`
     - `s5-finding-context.normalized.jsonl`
     - `s5-retrieval-traces.normalized.jsonl`
   - S4/S5 own raw producer artifacts and producer schemas only.
   - S3 owns join keys, canonical row shapes, normalization scripts, and aggregate determinism.

2. **Schema ownership split**
   - S3 owns bundle schema namespace, aggregate schemas, normalized schemas, ID/join contract, state-machine schema, and scoring input schema.
   - S4 owns raw static evidence producer schema, static evidence contract schema, and S4 provenance fragment schema.
   - S5 owns raw Code KB/context/retrieval producer schemas and S5 provenance fragment schema.
   - S4/S5 schemas must be versioned and included in `schemas/`.

3. **`environment.lock.json` must be component-fragment based**
   - S3 aggregates final environment lock.
   - S4 provides code commit, container/dependency lock, SAST tool versions, command lines, tool config hashes, compile DB/input hashes.
   - S5 provides code commit, container/dependency lock, Threat KB corpus version, Code KG/ledger/index versions, retrieval policy versions.
   - S7/LLM provenance is required if LLM is used: model ID/version, gateway commit, prompt/template versions, generation parameters.
   - S3 provides analysis-agent commit, state-machine config, prompt versions, scorer version.

4. **Replay inputs must be explicit S3-owned artifacts**
   Per case:
   - `replay/s3-paper-request.json`
   - `replay/s4-requests.jsonl`
   - `replay/s5-target-setup-request.json`
   - `replay/s5-finding-context-requests.jsonl`
   - `replay/state-machine-config.json`
   - `replay/prompt-template-versions.json`

   S4/S5 must echo request IDs and provenance IDs in raw responses so replay joins are deterministic.

5. **Scoring ownership must be S3/paper harness**
   - `oracle-labels.jsonl`
   - `finding-match-map.jsonl` or deterministic dedup/matching rules
   - `metrics-config.json`
   - `score_metrics` script
   - expected metric output/hash

   S4/S5 do not own labels, TP/FP/UNKNOWN scoring, or metric denominators.

6. **Checksums**
   - S3 owns root `checksums.sha256` and bundle manifest integrity.
   - S4/S5 provide raw artifact checksums/provenance inside producer outputs or sidecar manifests.
   - S3 checksums raw, normalized, aggregate, schemas, replay inputs, scorer scripts, and environment lock.

### Missing artifacts added to design

```text
bundle-manifest.json                  S3 / paper harness
schemas/id-join-contract.json          S3
schemas/state-machine.schema.json      S3
schemas/scoring-input.schema.json      S3
normalization-report.jsonl             S3
normalization-scripts/                 S3
replay/                                S3, with S4/S5 echoed provenance
oracle-labels.jsonl                    S3 / paper harness
finding-match-map.jsonl                S3 / paper harness
metrics-config.json                    S3 / paper harness
expected-results.json                  S3 / paper harness
component-provenance/s4.lock.json      S4
component-provenance/s5.lock.json      S5
component-provenance/s7.lock.json      S7 if LLM is used
```

### Narrowed S4 WR responsibility
- emit raw deterministic static evidence bundle;
- stable finding/evidence IDs;
- source anchors and compile/build metadata;
- tool versions, commands/config hashes, skipped-tool reasons;
- staticEvidenceContract and claim-boundary matrix;
- producer schema and raw artifact checksum/provenance;
- no TP/FP/UNKNOWN, no safety verdict, no S5 sufficiency claim.

### Narrowed S5 WR responsibility
- emit target Code KB readiness/summary;
- emit finding-level context bundles;
- emit retrieval traces with query, corpus/index version, hit IDs, scores, selected snippets, discarded-hit reasons;
- separate no-hit/partial/timeout/ambiguous statuses;
- stable knowledge evidence IDs;
- producer schema and raw artifact checksum/provenance;
- no final vulnerability verdict and no "KB no-hit means safe" semantics.

### Stop condition for full PASS
Q9 becomes full PASS only after normalized ownership is no longer undecided and the ownership table explicitly assigns schemas, replay inputs, environment provenance fragments, scoring/oracle artifacts, and checksum duties.

## Q9 revised decision
Adopt Critic's correction: **S3 / paper harness owns every normalized, replayable, aggregate, scoring, and integrity artifact. S4/S5 own only raw producer outputs, producer schemas, provenance fragments, stable IDs, and raw-artifact checksums.**

---

## Q10 correction — next WRs are consensus requests, not implementation start requests

User corrected the WR strategy:

The next outbound WRs from S3 to S4/S5 should **not** mean "start implementing this immediately." S4 and S5 each have deeper lane-local context than S3, so the immediate need is cross-lane consensus on the paper pipeline contract.

### Revised WR intent

The next WR batch should be framed as:

```text
consensus / review / feasibility request
```

not:

```text
implementation assignment
```

### Required wording constraints for WRs

- Explicitly state: **do not start implementation from this WR alone**.
- Ask S4/S5 to review the proposed paper pipeline contract from their lane-local perspective.
- Ask them to identify missing assumptions, better endpoint shapes, state-machine corrections, artifact ownership issues, and producer-side constraints.
- Ask them to propose corrections before S3 freezes the paper API/state-machine contract.
- The output expected from S4/S5 is a reply WR containing critique, amendments, feasibility notes, and proposed producer responsibilities.

### Revised WR structure candidate

1. Shared S3 → S4/S5 consensus WR
   - purpose: align terminology, state machine, ownership, no-direct-S4-S5 coupling, reproducibility bundle concept;
   - not implementation start.

2. Optional S3 → S4 lane-specific consensus WR
   - purpose: ask S4 to validate static evidence producer responsibilities, raw artifact/provenance/schema requirements, and feasibility.

3. Optional S3 → S5 lane-specific consensus WR
   - purpose: ask S5 to validate Code KB / retrieval producer responsibilities, target setup/finding enrichment split, raw artifact/provenance/schema requirements, and feasibility.

Implementation WRs should be issued only after S4/S5 replies are reconciled.

---

## Q11 answered — consensus WR should be a critical pre-freeze notice, not a long questionnaire

User rejected an overly detailed response template. The consensus WR should not ask S4/S5 to fill a long checklist.

### Correct tone

The WR should say, in effect:

```text
S3 plans to proceed with this paper pipeline contract.
You are expected to follow this direction unless you identify a serious lane-local problem.
Please critically review it now and object/correct before S3 freezes the contract.
This is not yet an implementation-start WR.
```

### Required response from S4/S5
S4/S5 should reply only with material objections, corrections, missing constraints, or feasibility blockers.

If they broadly agree, a short agreement/ack is enough.

### Avoid
- long questionnaire;
- excessive form fields;
- treating this as an implementation assignment;
- asking for speculative design expansions beyond lane-local objections.

### Keep
- critical review expectation;
- opportunity to object before freeze;
- explicit no-implementation-start wording;
- S3 remains paper contract/state-machine owner unless S4/S5 identifies a blocker.

---

## Q12 answered — consensus WR should be summary plus detailed notes link

User selected option C.

### Decision
The S3→S4/S5 pre-freeze consensus WR should be concise in the WR body and link to the detailed interview/design notes.

### WR body style
- Short summary of the intended paper pipeline contract.
- Clear statement that this is not an implementation-start WR.
- Clear statement that S4/S5 are expected to follow this direction unless they identify lane-local blockers or corrections.
- Link to this detailed notes page for full context.
- Ask S4/S5 to critically review and reply with objections/corrections/missing constraints, or ACK if no issue.

### Rationale
- Keeps WR readable.
- Preserves detailed context for agents that need it.
- Avoids turning consensus into a long questionnaire.
- Makes later implementation WRs easier to derive after replies are reconciled.

---

## Q13 action — separate pre-freeze consensus WRs issued

User requested immediate issuance of separate WRs to S4 and S5.

Issued WRs:

- S3 → S4: `wiki/canon/work-requests/s3-to-s4-s4-pre-freeze-review-requested-for-s3-led-paper-pipeline-static-evidence-produce.md`
- S3 → S5: `wiki/canon/work-requests/s3-to-s5-s5-pre-freeze-review-requested-for-s3-led-paper-pipeline-code-kb-and-retrieval-p.md`

Both WRs are `question` kind and explicitly state:
- this is a pre-freeze critical review / consensus request;
- this is not an implementation-start WR;
- S4/S5 should reply with ACK, ACK_WITH_CORRECTIONS, or BLOCKER;
- implementation WRs should wait until S3 reconciles replies.

---

## S4 checksum/hash removal review — S3 ACK_WITH_CORRECTIONS

S4 asked S3 to review removing checksum/hash/digest/fingerprint concepts from the S4 paper API and replacing them with reference identity.

Incoming WR:
- `wiki/canon/work-requests/s4-to-s3-s3-review-requested-remove-checksum-hash-concepts-from-s4-paper-api-and-require-.md`

S3 reply:
- `wiki/canon/work-requests/s3-to-s4-s3-reply-ack_with_corrections-for-removing-checksum-hash-concepts-from-s4-paper-.md`

### S3 decision
S3 agrees that checksum/hash/digest/fingerprint concepts should be removed from the S4 paper API and paper-facing bundle semantics.

Rationale:
- byte-level digests can be misread as stronger C/C++ build/static-analysis reproducibility claims than they support;
- such fields are not central to the paper methodology;
- if present without a precise consumer, they become decorative or misleading;
- admitted-target identity, replay requests, schema/profile refs, state traces, and producer evidence refs are better paper contract surfaces.

### Replacement policy
- Use opaque S3/paper-harness-owned refs for admitted input identity:
  - `sourceRootRef`;
  - `compileContext.ref`;
  - `buildSnapshotId`;
  - `buildUnitId`.
- S4 echoes these refs but does not reinterpret them as hashes/fingerprints.
- S4 adds producer/run refs such as `s4RequestId`, `s4ProducerRunId`, and `bundleRef`.
- S4 keeps explicit `schemaVersion`, `bundleProfile`, and `surfacePolicy` refs.
- Major raw rows echo case/build/source/compile/producer join refs so S3 normalization can build the evidence ledger without checksums.

### Superseded prior request
S3's prior request for `artifactChecksum` canonicalization is superseded and withdrawn for the paper API. Any external artifact integrity mechanism, if ever required by a packaging/distribution system, is out-of-band and not part of the paper-facing S4 evidence contract.
