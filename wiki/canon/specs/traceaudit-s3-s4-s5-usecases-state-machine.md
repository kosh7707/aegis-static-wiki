---
title: "AEGIS TraceAudit S3/S4/S5 Use Cases and State Machine"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md"
  - "wiki/canon/api/paper-analysis-api.md"
  - "wiki/canon/specs/paper-analysis-pipeline-design.md"
  - "wiki/canon/work-requests/s4-to-s3-s4-accepts-final-paper-anchor.md-freeze-with-implementation-boundary-notes.md"
  - "wiki/canon/work-requests/s5-to-s3-s5-final-review-paper-anchor-accepted-with-no-anchor-change-request.md"
  - "wiki/canon/work-requests/s5-to-s3-s5-reply-accept_with_scope-for-paper-facing-code-kb-and-retrieval-tool-call-cont.md"
last_verified: "2026-05-20"
service_tags: ["s3", "s4", "s5", "paper-pipeline", "traceaudit", "state-machine", "use-cases"]
decision_tags: ["paper-api", "execution-contract", "state-machine", "producer-boundary", "evidence-ledger", "s4-static-evidence-producer", "s5-code-kb", "s5-freeze-gate", "b2-b4-evidence-control"]
related_pages: ["wiki/canon/specs/aegis-traceaudit-prepaper-anchor-guideline.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/knowledge-base-api.md"]
---

# AEGIS TraceAudit S3/S4/S5 Use Cases and State Machine

> Status: execution companion to the frozen pre-paper anchor.
> Scope: define, from A to Z, how S3, S4, and S5 exchange requests, producer artifacts, normalized rows, ledger refs, diagnostics, and final paper exports for one admitted build target.
> Boundary: this page does not change the paper identity, benchmark design, success rule, or reviewer/oracle protocol frozen in `aegis-traceaudit-prepaper-anchor-guideline.md`. Endpoint details remain governed by service/API contracts.

## 1. Purpose

This document gives the operational story that sits under `PAPER-ANCHOR.md`:

```text
one admitted build target
  -> one S3-owned analysis case
  -> S4 static evidence
  -> S5 Code KB / contextual retrieval evidence
  -> S3 evidence ledger and TP/FP/UNKNOWN triage
  -> paper packets and exports
```

It is meant to answer:

- what does S3 send to S4?
- what does S4 return to S3?
- what does S3 send to S5 before and after S4 findings exist?
- what does S5 return to S3?
- when does the state machine advance?
- where do diagnostics go?
- who owns raw artifacts, normalized rows, final verdicts, and exports?

## 2. Non-goals

This document is not:

- a new paper anchor;
- a replacement for `PAPER-ANCHOR.md`;
- a production `/v1/tasks` workflow;
- a Build Agent or compile-context generation design;
- a final S4/S5 endpoint schema document;
- a scoring/oracle/human-study protocol;
- permission for S4 or S5 to emit final TP/FP/UNKNOWN verdicts.

## 3. Role summary

| Lane | Paper-facing role | Owns | Does not own |
|---|---|---|---|
| S3 | Analysis Orchestrator / Evidence-Guided Triage Agent | case registration, state machine, S4/S5 calls, normalized rows, evidence ledger, final TP/FP/UNKNOWN, B2/B4 packet rendering, scoring/export | raw S4/S5 producer internals |
| S4 | Static Evidence Producer | raw deterministic static/source/build evidence bundle, S4 producer refs, row-local S4 traces, S4 diagnostics | final verdict, vulnerability absence, S5 sufficiency, exploitability, CVE affectedness |
| S5 | Contextual Knowledge Provider / Code KB Provider | target-scoped Code KB / Source Code KG readiness, contextual code rows, generic Threat KB rows, retrieval provenance, S5 diagnostics | final verdict, S4 validation, scoring/export, B2/B4 packet ownership |

Hard boundary:

```text
Only S3 emits final finding-level TP/FP/UNKNOWN.
S4/S5 emit bounded producer evidence, status, provenance, and diagnostics.
```

## 4. End-to-end state machine

The pipeline assumes the build target has already passed dataset admission.

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

Per-stage progress vocabulary:

```text
pending | running | done | diagnostic
```

Status distinction:

| Type | Meaning | Handling |
|---|---|---|
| admission failure | target is not a valid paper case | exclude before evaluated cases; write admission report |
| operational anomaly | service/runtime issue after admission | report separately; not triage UNKNOWN by itself |
| producer diagnostic | bounded S4/S5 status or failure | ledger diagnostic artifact; not security evidence |
| triage UNKNOWN | S3 finding-level claim-boundary outcome | counted as a triage result |

## 4.1 Current readiness snapshot — 2026-05-20

This document defines the intended execution contract. Current implementation
readiness is:

```text
S3 paper path: structurally implemented for S4/S5/S7 consumption.
S4 paper endpoint: implemented by S4 and structurally consumed by S3 via
  durable ownership (`Prefer: respond-async`) or file-backed raw bundle.
S4_STATIC_EVIDENCE_FREEZE_GATE: pass as S4 producer-boundary readiness only.
S5 paper endpoints: implemented by S5 with X-Request-Id lifecycle logging.
S5_FREEZE_GATE: pass for S5 producer/exported-fixture obligations; S3
  consumer execution remains S3-owned until live/file-backed e2e proof.
S3 tool-call acquisition: implemented with tool schemas, multi-round execution,
tool-result history, deterministic fallback, and finalizer separation.
S3 observability: implemented and unit-verified in the AEGIS repo.
Trace50/Audit120 results: not run; no metric claims yet.
```

Latest dataset validation from `~/aegis-for-paper`:

```text
python3 scripts/validation/validate-build-targets-v1.py --root datasets/build-targets-v1 --require-50
PASS
target_count=50
```

Interpretation:

```text
The 50 targets are valid admitted inputs.
They are not proof that S3/S4/S5/S7 live analysis has completed.
No high-level S3 optimization should be chosen before at least one live case
reaches PAPER_EXPORT_READY with traceable artifacts.
```

## 5. A-to-Z use cases

### UC-00 — Admit build target

Owner: S3 / paper harness.

Inputs:

```text
source tree
compile_commands.json or equivalent compile context
build target identity
scope include/exclude paths
```

Outputs:

```text
ADMITTED_BUILD_TARGET
sourceRootRef
compileContextRef
buildSnapshotId
buildUnitId
admission-report.jsonl row
```

Rules:

- admission is not S4 or S5's job;
- failed admission is not an evaluated analysis case;
- Build Agent is out of scope for the paper pipeline.

### UC-01 — Register analysis case

Owner: S3.

S3 creates the case identity and initial state.

S3 input:

```text
caseId
buildTargetId
paperRunId
sourceRootRef
compileContextRef
buildSnapshotId
buildUnitId
scope
```

S3 output:

```text
CASE_REGISTERED
case-manifest.json
state-trace.jsonl entry
s3-paper-request.json
```

### UC-02 — Mark build context ready

Owner: S3 / paper harness.

Meaning:

```text
S3 has enough admitted compile/source context to call S4 and S5 producer surfaces.
```

Output state:

```text
BUILD_CONTEXT_READY
```

No security claim is made at this stage.

### UC-03 — Start producer setup branches

Owner: S3.

S3 enters:

```text
SETUP_RUNNING
```

S3 may start S4 and S5 setup in parallel:

```text
S3 -> S4: produce static evidence for admitted build target
S3 -> S5: prepare target-scoped Code KB / Source Code KG
```

S4 and S5 do not call each other.

## 6. S3 -> S4 -> S3 flow

### UC-04 — Request S4 static evidence

S3 calls S4:

```http
POST /v1/paper/static-evidence
```

S3 provides:

```text
caseId
buildTargetId
paperRunId
sourceRoot execution path
sourceRootRef
compileContext path/type/ref
buildSnapshotId
buildUnitId
scope
```

S4 returns raw producer artifact:

```text
s4-static-evidence.raw.json
s4RequestId
s4ProducerRunId
bundleRef
producer.service / producer.serviceVersion / producer.deterministic
surfaceStatus per array and singleton/top-level surface
findings[]
evidence[]
sourceFiles[]
functions[]
includeEdges[]
libraries[]
toolRuns[]
targetMetadata
staticEvidenceContract
claimBoundaryMatrix
claimBoundaries
producer diagnostics
```

This list is an execution summary. `wiki/canon/api/paper-analysis-api.md` is authoritative for the complete S4 response shape and field-level schema.

S4 rows should include row-local trace blocks so copied rows remain self-describing.

### UC-05 — Normalize S4 output

Owner: S3.

S3 transforms the raw S4 bundle into:

```text
s4-static-evidence.normalized.json
evidence-ledger.jsonl rows for S4 evidence
state-trace.jsonl updates
```

S4 stage transition rule:

```text
S4_STATIC_EVIDENCE_READY = done
  when S4 returns success=true and bundleStatus=produced under the paper
  contract, even if evidenceCompleteness.status=bounded_partial and some
  attempted array surfaces are empty.

S4_STATIC_EVIDENCE_READY = diagnostic
  when S4 returns success=false, bundleStatus=failed, an input-consumption
  contract failure, or a required producer surface/tool invariant failure that
  prevents the raw S4 bundle from satisfying the paper contract.
```

Per-surface status rule:

```text
per-surface empty is an attempted-zero-row result, not a stage diagnostic;
bounded_partial is expected bounded local evidence, not a stage diagnostic;
per-surface not_available/error is recorded as bounded producer surface
diagnostic; whether the whole S4 stage becomes diagnostic depends on whether
the paper contract still considers the raw bundle produced and consumable.
```

Diagnostic rule:

```text
S4 empty/not_available/error/bounded_partial may be logged and cited as
diagnostic context only under S3 claim-boundary logic. They are not TP, FP,
vulnerability absence, safe evidence, or complete security evidence.
```

## 7. S3 -> S5 setup flow

### UC-06 — Prepare Code KB / Source Code KG

S3 calls S5 paper-facing setup surface, once implemented:

```http
POST /v1/paper/code-kb/prepare
```

Tool alias:

```text
prepare_code_kb
```

S3 provides:

```text
caseId
buildTargetId
paperRunId
requestId
idempotencyKey
sourceRootRef
compileContextRef
buildSnapshotId
buildUnitId
sourceContext when available
visibilityMode = generic
forbiddenLeakageClasses = [cve_id, fix_commit, advisory, exploit_writeup, patch_text]
```

S5 returns:

```text
codeKbRunId
s5ProducerRunId
surfaceStatus: produced | partial | not_available | error
codeKbRef
sourceKgRef
readiness summary
producerProvenance
producer diagnostics
```

S3 normalizes this into:

```text
s5-code-kb.raw.json
s5-code-kb.normalized.json
evidence-ledger.jsonl setup/provenance rows
state-trace.jsonl update
```

State transition:

```text
S5_CODE_KB_READY = done | diagnostic
```

Meaning:

```text
S5_CODE_KB_READY means target-scoped Code KB / Source Code KG readiness.
It does not mean target-specific Threat KB construction.
It does not mean S5 finding context is ready.
```

## 8. S4-derived context mediation

After S4 findings exist, S3 chooses which S4-derived facts to send to S5.

Permitted S3-mediated inputs include:

```text
findingId
S3 evidence refs for S4 finding/source rows
ruleId
CWE candidates
tool message
file/source/function anchors
library identity
symbol/function names
queryIntent
visibilityMode / leakage budget
```

Required flow:

```text
S4 -> S3 evidence ledger -> S5 request -> S3 evidence ledger
```

Forbidden flow:

```text
S4 -> S5 direct side channel
```

S5 does not validate S4 completeness and does not decide whether S4 evidence is sufficient for triage.

## 9. S3 -> S5 finding-context flow

### UC-07 — Retrieve finding-level code context

S3 calls S5:

```http
POST /v1/paper/finding-context/retrieve
```

Tool alias:

```text
retrieve_finding_context
```

S3 provides:

```text
caseId
buildTargetId
findingId
requestId
idempotencyKey
codeKbRef
sourceKgRef
s3EvidenceRefs[]
sourceAnchors[]
ruleId
cweCandidates[]
toolMessage
libraryIdentity
queryIntent
retrievalProfile
topK
visibilityMode = generic
forbiddenLeakageClasses
```

S5 returns rows shaped like:

```text
retrievalRunId
itemId
sourceType: code | symbol | diagnostic | ...
queryIntent
sourceEvidence
surfaceStatus: produced | no_hit | partial | not_available | error
visibleLeakageClass
text/snippet/context
rank/score when applicable
producerTrace
producer diagnostics
retrievalTrace including b2b4StableRows when available
```

S3 normalizes into:

```text
s5-finding-context.raw.jsonl
s5-finding-context.normalized.jsonl
evidence-ledger.jsonl rows for S5 context
state-trace.jsonl update
```

Diagnostic rule:

```text
S5 no_hit is contextual absence only.
S5 hit is contextual support only.
S5 partial/error/not_available are producer diagnostics.
None of these are TP/FP/UNKNOWN verdicts by themselves.
```

## 10. S3 -> S5 generic Threat KB flow

### UC-08 — Retrieve generic threat context

S3 calls S5:

```http
POST /v1/paper/threat-context/generic
```

Tool alias:

```text
retrieve_generic_threat_context
```

S3 provides:

```text
caseId
buildTargetId
findingId
requestId
idempotencyKey
cweCandidates[]
apiNames[]
libraryIdentity
queryIntent = generic_threat_context
retrievalProfile
topK
visibilityMode = generic
forbiddenLeakageClasses = [cve_id, fix_commit, advisory, exploit_writeup, patch_text]
```

S5 returns generic rows:

```text
sourceType: cwe | capec | generic_security_note | library_provenance | diagnostic
visibleLeakageClass = generic for mainline visible rows
surfaceStatus
sourceEvidence
text/context
producerTrace / threatKbCorpusVersion / threatKbIndexVersion / retrievalPolicyVersion
retrievalTrace
```

Mainline leakage rule:

```text
CVE IDs, advisories, fix commits, exploit writeups, and patch text are hidden.
If an internal candidate would expose them, S5 omits, redacts to generic concept text, or returns a generic diagnostic.
The diagnostic must not echo the forbidden value.
```

## 11. S3 normalization and evidence ledger

S3 owns the canonical evidence ledger.

For each S4/S5 raw row consumed by S3, S3 should create or update normalized evidence ledger rows with:

```text
caseId
buildTargetId
paperRunId
producer: s4 | s5 | s3
producerRunId
rawObjectRef or itemId
normalized evidenceRef
evidenceType
source/ref fields
producerTrace/provenance
surfaceStatus or diagnostic status
visibility/leakage class where applicable
claim links when S3 later cites the row
```

The ledger must support:

```text
which producer created the evidence row
which raw object it came from
which normalized row S3 used
which claim cited it
which packet condition rendered it
which metric consumed it
```

## 12. S3 triage flow

### UC-09 — Generate finding-level triage records

Owner: S3.

Inputs:

```text
S4 normalized findings/evidence
S5 normalized Code KB context
S5 normalized generic Threat KB context
producer diagnostics
LLM transcript / model profile when used
claim-boundary rules
```

Output:

```text
S3_TRIAGE_COMPLETED
findings.jsonl
analysis-envelope.json
evidence-ledger.jsonl with claim links
llm-transcript.jsonl
normalization-report.jsonl
```

Finding-level triage labels:

```text
TP | FP | UNKNOWN
```

S3 must be able to explain each verdict through one of:

```text
evidence-supported claim rationale
diagnostic rationale
claim-boundary / insufficient-context rationale
conflicting-evidence rationale
```

S3 must not treat producer status as final security fact.

## 13. Packet rendering and benchmark conditions

Owner: S3 / paper harness.

S3 renders reviewer-visible packets from the same case evidence.

Main conditions:

```text
B0 SAST-only
B1 raw LLM rationale
B2 same evidence rows + machine verdict/rationale, no ledger
B3 AEGIS ledger without verdict
B4 full AEGIS packet
```

B2/B4 control:

```text
B2 and B4 must use the same underlying S4/S5 evidence rows/text/order.
B4 may add ledger refs, producer traces, claim links, and navigation.
B2 hides those structural affordances.
B4 must not receive richer S4/S5 evidence content than B2.
```

If producer diagnostic/status text is reviewer-visible as substantive packet
content, the same diagnostic/status text must be available to B2 and B4. B4
may expose structural affordances around that text, but not additional
diagnostic evidence content.

S5 support for B2/B4 control:

```text
retrievalTrace.b2b4StableRows = true
stable ordering policy where available
same rows/text/order unless S3 explicitly registers an ablation
```

## 14. Paper export flow

### UC-10 — Export case and aggregate artifacts

Owner: S3 / paper harness.

State:

```text
PAPER_EXPORT_READY
```

Case-local artifacts include:

```text
case-manifest.json
state-trace.jsonl
s3-paper-request.json
s4-requests.jsonl
s5-setup-requests.jsonl
s5-finding-context-requests.jsonl
s5-generic-threat-context-requests.jsonl
s4-static-evidence.raw.json
s4-static-evidence.normalized.json
s5-code-kb.raw.json
s5-code-kb.normalized.json
s5-finding-context.raw.jsonl
s5-finding-context.normalized.jsonl
s5-generic-threat-context.raw.jsonl
s5-generic-threat-context.normalized.jsonl
evidence-ledger.jsonl
analysis-envelope.json
findings.jsonl
llm-transcript.jsonl
normalization-report.jsonl
```

Aggregate artifacts include:

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

The export must support replay/audit at evidence-row and claim-link granularity. It does not claim bit-for-bit reproducibility or checksum integrity.

## 15. Failure and diagnostic paths

### S4 diagnostic path

```text
S4 producer diagnostic
  -> S3 records diagnostic in state-trace and evidence ledger
  -> S3 may create bounded UNKNOWN/diagnostic packet only when claim-boundary rules justify it
  -> diagnostic does not become TP/FP/absence evidence
```

### S5 diagnostic path

```text
S5 no_hit / partial / not_available / error
  -> S3 records contextual producer diagnostic
  -> S3 may use it for responsible UNKNOWN/defer rationale
  -> S3 may not use it as TP/FP evidence, safe evidence, or vulnerable evidence
```

### Operational anomaly path

```text
runtime/service issue after admission
  -> report separately as operational anomaly
  -> do not silently convert into triage UNKNOWN denominator
```

### Admission failure path

```text
invalid or non-buildable target
  -> excluded before evaluated cases
  -> admission-report.jsonl only
```

## 16. Implementation gates

Before the pipeline can run as a mainline paper experiment:

```text
[x] 50 admitted build targets verified by dataset validator on 2026-05-20.
[x] S4 /v1/paper/static-evidence consumed by S3 with durable ownership first and synchronous/file-backed compatibility paths.
[x] File-backed S4 artifacts, if used, pass the same S4 paper bundle validator before normalization.
[x] S5 prepare_code_kb / retrieve_finding_context / retrieve_generic_threat_context producer/exported-fixture obligations implemented by S5.
[x] S5_FREEZE_GATE satisfied for S5 producer/exported-fixture obligations. S3 consumer execution remains separately gated by live/file-backed e2e proof.
[ ] S3 evidence ledger can link all S4/S5 normalized rows to producer traces. S4 rows are structurally covered; S5 coverage still requires live/file-backed e2e proof.
[ ] S3 consumer guard rejects forbidden S4/S5 status-to-verdict inferences.
[ ] B2/B4 renderer proves same evidence rows/text/order.
[ ] Paper export writes all case-local and aggregate artifacts required by the anchor.
[ ] One live smoke target reaches PAPER_EXPORT_READY with inspectable
    state-trace, S4/S5 raw+normalized artifacts, evidence-ledger, LLM transcript,
    findings, analysis-envelope, and correlated logs.
```

## 17. Ownership checklist

| Artifact / decision | Owner |
|---|---|
| admitted build target list | S3 / paper harness |
| compile context refs | S3 / paper harness |
| raw S4 static evidence | S4 |
| normalized S4 evidence | S3 |
| raw S5 Code KB / retrieval outputs | S5 |
| normalized S5 rows | S3 |
| evidence ledger refs | S3 |
| producer run IDs | S4/S5 respectively |
| final TP/FP/UNKNOWN | S3 |
| UNKNOWN taxonomy application | S3 |
| B0-B4 packet rendering | S3 / paper harness |
| oracle labels and scoring | S3 / paper harness |
| paper export | S3 / paper harness |

## 18. Minimal sequence diagram

```text
Paper harness/S3
  |-- admit build target ----------------------------------------|
  |-- register case --------------------------------------------> state: CASE_REGISTERED
  |-- prepare compile/source refs ------------------------------> state: BUILD_CONTEXT_READY
  |-- call S4 /v1/paper/static-evidence ------------------------> S4
  |<-- raw static evidence bundle + S4 diagnostics --------------|
  |-- normalize S4 rows + ledger refs --------------------------> state: S4_STATIC_EVIDENCE_READY
  |
  |-- call S5 prepare_code_kb ----------------------------------> S5
  |<-- Code KB / Source KG refs + S5 diagnostics ----------------|
  |-- normalize S5 setup rows ----------------------------------> state: S5_CODE_KB_READY
  |
  |-- extract S4 finding anchors into S3 ledger -----------------|
  |-- call S5 retrieve_finding_context -------------------------> S5
  |<-- code/source contextual rows ------------------------------|
  |-- call S5 retrieve_generic_threat_context ------------------> S5
  |<-- generic Threat KB rows -----------------------------------|
  |-- normalize S5 context rows + ledger refs ------------------> state: S5_FINDING_CONTEXT_READY
  |
  |-- S3 triage TP/FP/UNKNOWN with claim links -----------------> state: S3_TRIAGE_COMPLETED
  |-- render B0/B1/B2/B3/B4 packets ----------------------------|
  |-- export case-local + aggregate artifacts ------------------> state: PAPER_EXPORT_READY
```

## 19. Stability rule

This document may evolve as S4/S5 endpoint schemas become implementation-ready, but it must not change the frozen paper identity:

```text
AEGIS TraceAudit evaluates reviewer-auditable SAST triage decision artifacts.
S3 owns final verdicts and paper exports.
S4 and S5 remain bounded evidence producers.
B2/B4 compare packet form over controlled evidence rows.
```
