---
title: "S3 Quality Gates as Repair Planners"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "/home/kosh/AEGIS/.omx/plans/s3-agent-state-machine-work-breakdown-20260423.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md"
  - "User hot20 discussion, 2026-04-22/23"
last_verified: "2026-04-23"
service_tags: ["s3", "analysis-agent"]
decision_tags: ["quality-gate", "repair", "poc", "deep-analyze", "state-machine"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md", "wiki/canon/specs/s3-claim-evidence-state-machine/poc-lifecycle.md"]
---

# S3 Quality Gates as Outcome Classifiers

> Status: **draft**
> Scope: deep-analysis and PoC quality gates for S3 outputs
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

Quality Gate is now the central classifier that separates normal task completion from result quality. It is not a terminal task-failure generator.

---

## 1. Core rule

```text
quality gate = outcome classifier + repair planner
```

A gate result must say whether the artifact is accepted, accepted with caveats, repairable, rejected, or inconclusive.

---

## 2. QualityGate statechart

```mermaid
stateDiagram-v2
    [*] --> NotEvaluated
    NotEvaluated --> Evaluating: quality.requested
    Evaluating --> Accepted: quality.accepted
    Evaluating --> AcceptedWithCaveats: quality.accepted_with_caveats
    Evaluating --> Repairable: quality.repairable
    Evaluating --> Rejected: quality.rejected
    Evaluating --> Inconclusive: quality.inconclusive

    Repairable --> Evaluating: repair.applied
    Repairable --> Rejected: repair.exhausted

    Accepted --> [*]
    AcceptedWithCaveats --> [*]
    Rejected --> [*]
    Inconclusive --> [*]
```

---

## 3. Gate output shape

Conceptual internal shape:

```json
{
  "gate": "deep_claim_quality",
  "outcome": "rejected",
  "resultOutcome": "no_accepted_claims",
  "failedItems": [
    {
      "id": "missing_input_path",
      "repairable": false,
      "requiredEvidenceSlots": ["input_or_dataflow_path"],
      "repairAttempts": ["s5.code_graph.callers", "source_slice_read", "clean_deep_retry"]
    }
  ],
  "caveats": ["No claim satisfied local grounding after recovery."],
  "needsHumanReview": true
}
```

---

## 4. Deep-analysis quality outcomes

| Gate outcome | Result-level mapping | Meaning |
|---|---|---|
| `accepted` | `analysisOutcome=accepted_claims` | Claim(s) are locally grounded and quality-valid. |
| `accepted_with_caveats` | `analysisOutcome=accepted_claims`, `qualityOutcome=accepted_with_caveats` | Claim(s) are acceptable but uncertainty/partiality must be visible; this is completed but not strict clean pass. |
| `repairable` | return to RecoveryTriage | Failed items can be repaired/acquired. |
| `rejected` | `analysisOutcome=no_accepted_claims` or claim excluded | Claim cannot be accepted honestly after recovery. |
| `inconclusive` | `analysisOutcome=inconclusive` | Evidence/tool partiality prevents honest acceptance or rejection. |

---

## 5. PoC quality outcomes

| Gate outcome | Result-level mapping | Meaning |
|---|---|---|
| `accepted` | `pocOutcome=poc_accepted` | PoC is claim-bound, non-destructive, and quality-valid. |
| `accepted_with_caveats` | `pocOutcome=poc_accepted`, `qualityOutcome=accepted_with_caveats` | PoC is acceptable but assumptions must be visible; this is completed but not strict clean pass. |
| `repairable` | return to PoC repair | Failed items can be repaired. |
| `rejected` | `pocOutcome=poc_rejected` | PoC cannot satisfy quality/safety after recovery. |
| `inconclusive` | `pocOutcome=poc_inconclusive` | PoC cannot be produced honestly with available context. |

---

## 6. Deep-analysis quality dimensions

| Item | Meaning | Typical repair action |
|---|---|---|
| `claim_specificity` | concrete issue, not generic CWE restatement | repair statement/detail using source/sink refs |
| `location_present` | source file/line/symbol | acquire source/function/location slot |
| `local_evidence_present` | local refs exist | ref repair or evidence acquisition |
| `sink_identified` | dangerous operation/write/deref/file op explicit | source slice / SAST / code graph query |
| `caller_or_reachability_present` | local reachability enough for family | code graph callers/callees/search |
| `input_or_dataflow_present` | input path/dataflow identified where required | SAST dataFlow/code graph/source query |
| `knowledge_context_bounded` | knowledge is context, not proof | move to caveat/context; remove from final refs |
| `caveats_honest` | partial evidence/tool limits visible | add caveats, needsHumanReview |

---

## 7. PoC quality dimensions

| Item | Meaning | Typical repair action |
|---|---|---|
| `claim_bound` | targets accepted claim | bind to claim fields/refs |
| `binary_path_real` | uses real build path or caveat | derive from build context or caveat |
| `non_destructive` | avoids destructive effects | add safe markers/guards |
| `side_effect_detection` | observable detection path | add canary/marker check |
| `randomized_canary` | avoids trivial marker | generate per-run token |
| `quote_awareness` | handles shell/path quoting | add quoting/escaping caveat |
| `repro_steps` | bounded setup/run/observe | repair from build/source context |
| `limitations_caveated` | assumptions visible | add limitations |

---

## 8. Hot-gate implication

`completed` is necessary but not sufficient for clean pass.

```text
clean deep pass = completed + analysisOutcome=accepted_claims + qualityOutcome=accepted
clean PoC pass = completed + pocOutcome=poc_accepted + qualityOutcome=accepted
```

A completed `no_accepted_claims`, `inconclusive`, `accepted_with_caveats`, or `poc_rejected` response is task success but not strict clean pass unless a named non-strict policy explicitly counts it.

---

## 9. Acceptance criteria for implementation

1. Quality gates return structured outcomes, not booleans only.
2. Repairable outcomes include repair actions.
3. Rejected/inconclusive outcomes can still become schema-valid completed responses.
4. Failed quality does not become task-level failure unless no valid response envelope can be assembled.
5. HotN reports distinguish task completion rate from clean quality pass rate.
