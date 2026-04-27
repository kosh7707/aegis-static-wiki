---
title: "S3 Claim Lifecycle Statechart"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "/home/kosh/AEGIS/.omx/plans/s3-agent-state-machine-work-breakdown-20260423.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md"
last_verified: "2026-04-23"
service_tags: ["s3", "analysis-agent"]
decision_tags: ["claim-lifecycle", "state-machine", "grounding", "quality-gate"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/s3-claim-evidence-state-machine/quality-gates.md"]
---

# S3 Claim Lifecycle Statechart

> Status: **draft**
> Scope: lifecycle of one vulnerability claim inside a `deep-analyze` TaskRun
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

This page defines the condition states for a single claim. A claim is not just a JSON object returned by an LLM; it is a candidate assertion that must accumulate valid schema, local evidence, grounding slots, and quality status before it can be accepted.

---

## 1. Claim identity

A claim should have a stable internal identity for the duration of one TaskRun.

Suggested identity fields:

- `claimId` — S3-generated stable ID such as `claim-0` or hash-based ID;
- `family` — generic vulnerability family such as `command_injection`, `buffer_bounds`, `null_deref`, `integer_overflow`, `path_traversal`, `lifetime`, `dependency_vulnerability`;
- `cweCandidates[]` — optional CWE identifiers, knowledge context only unless tied to SAST metadata;
- `primaryLocation` — target file/line/symbol when available;
- `primarySink` — sink/dangerous API/write/deref/file op when available;
- `supportingEvidenceRefs[]` — local/derived-local refs only in v1;
- `requiredSlots[]`, `filledSlots[]`, `missingSlots[]`.

Claim identity should survive repair attempts unless repair intentionally rejects/merges/splits the claim.

---

## 2. Claim lifecycle statechart

```mermaid
stateDiagram-v2
    [*] --> Candidate

    Candidate --> SchemaQualified: schema.valid
    Candidate --> SchemaDeficient: schema.invalid
    SchemaDeficient --> SchemaQualified: schema.repaired
    SchemaDeficient --> RejectedSchema: schema.unrepairable_or_budget_exhausted

    SchemaQualified --> EvidenceRefsQualified: refs.valid
    SchemaQualified --> EvidenceRefsDeficient: refs.invalid
    EvidenceRefsDeficient --> EvidenceRefsQualified: refs.repaired
    EvidenceRefsDeficient --> GroundingDeficient: local_refs_missing_after_repair
    EvidenceRefsDeficient --> RejectedGrounding: refs.unrepairable_or_budget_exhausted

    EvidenceRefsQualified --> SlotsDeclared: slots.computed

    SlotsDeclared --> GroundingQualified: required_slots.filled
    SlotsDeclared --> GroundingDeficient: required_slots.missing

    GroundingDeficient --> EvidenceAcquiring: missing_slots.recoverable
    GroundingDeficient --> RejectedGrounding: missing_slots.unrecoverable

    EvidenceAcquiring --> SlotsDeclared: evidence.attached
    EvidenceAcquiring --> RejectedGrounding: acquisition.exhausted

    GroundingQualified --> QualityQualified: quality.pass
    GroundingQualified --> QualityDeficient: quality.fail

    QualityDeficient --> ClaimRepairing: repair_actions.available
    QualityDeficient --> RejectedQuality: repair_actions.unavailable

    ClaimRepairing --> SchemaQualified: claim.repaired
    ClaimRepairing --> RejectedQuality: repair.exhausted

    QualityQualified --> Accepted: acceptance.invariants_hold
    QualityQualified --> RejectedInvariant: acceptance.invariant_violation

    Accepted --> [*]
    RejectedSchema --> [*]
    RejectedGrounding --> [*]
    RejectedQuality --> [*]
    RejectedInvariant --> [*]
```

---

## 3. State definitions

| State | Meaning |
|---|---|
| `Candidate` | A proposed claim exists but has not yet passed schema validation. |
| `SchemaQualified` | Required claim fields exist with valid types and minimally meaningful content. |
| `SchemaDeficient` | The claim is malformed, missing fields, or has wrong types. |
| `EvidenceRefsQualified` | Claim refs are present in the evidence ledger and allowed for claim-level support. |
| `EvidenceRefsDeficient` | Claim refs are hallucinated, unauthorized, wrong-role, or insufficient for claim support. |
| `SlotsDeclared` | Required evidence slots have been computed from the claim family, sink, mode, and SAST-backed status. |
| `GroundingQualified` | Required local evidence slots are filled. |
| `GroundingDeficient` | Required local evidence slots are missing. |
| `EvidenceAcquiring` | Targeted slot acquisition is in progress or planned. |
| `QualityQualified` | Claim passes deep-analysis quality gate. |
| `QualityDeficient` | Claim failed quality gate with one or more failed rubric items. |
| `ClaimRepairing` | A bounded claim repair action is being applied. |
| `Accepted` | Claim may appear in final `result.claims[]`. |
| `Rejected*` | Claim is excluded from final accepted claims and must leave audit diagnostics that can feed `no_accepted_claims` or `inconclusive` result outcomes. |

---

## 4. Acceptance invariants

A claim may enter `Accepted` only if all of the following hold:

1. schema is valid;
2. claim-level refs are allowed local or derived-from-local refs;
3. required local slots for the claim family are filled;
4. knowledge-only support is not used as local grounding;
5. quality gate passes or is explicitly waived by a documented non-product/evaluation mode;
6. confidence/severity/human-review metadata is present at the response level;
7. any operational limitations are caveated rather than used as evidence of vulnerability absence/presence.

---

## 5. Claim canonicalization

LLM outputs may contain zero, duplicate, overlapping, or overly granular claims. S3 should canonicalize before final acceptance.

### Candidate merge keys

Possible merge keys:

- same primary sink and source location;
- same SAST finding ref;
- same source slice and vulnerability family;
- same dependency/CVE/library tuple;
- same caller-chain endpoint.

### Representative selection

When multiple candidate claims describe the same local issue, prefer the candidate with:

1. valid local refs;
2. more filled required slots;
3. stronger source/sink/caller specificity;
4. fewer unsupported speculative statements;
5. better quality score.

### Rejection is not failure by itself

Rejecting weak/duplicate claims is normal. If no acceptable claim remains after RecoveryTriage, a valid-input/live-runtime TaskRun should return `completed` with `analysisOutcome=no_accepted_claims` or `analysisOutcome=inconclusive`. Evaluation objectives may mark that result as non-clean, but they do not turn it into task failure. Task failure is reserved for invalid input, unavailable runtime/dependency, hard timeout/cancellation, unsafe/out-of-authority request, or internal envelope-assembly failure.

---

## 6. Rejected claims are result-outcome inputs

Rejected claims are not task failures by themselves. If all candidates are rejected after RecoveryTriage, S3 should normally produce `completed` with `analysisOutcome=no_accepted_claims` or `analysisOutcome=inconclusive`, provided caller input and runtime dependencies are valid and a schema-valid envelope can be assembled.

---

## 7. Relation to TaskRun

Claim states roll up to TaskRun states:

| Claim condition | TaskRun implication |
|---|---|
| any repairable `SchemaDeficient` | TaskRun may enter `SchemaDeficient` / `RetryPlanning` |
| any repairable `EvidenceRefsDeficient` | TaskRun may enter `EvidenceRefsDeficient` |
| all useful claims `RejectedGrounding` | TaskRun should enter outcome classification and usually return `completed` with `analysisOutcome=no_accepted_claims` or `inconclusive` if input/runtime are valid |
| at least one `GroundingDeficient` with recoverable slots | TaskRun enters `EvidenceAcquisitionPlanned` |
| at least one `QualityDeficient` with repair actions | TaskRun enters `ClaimRepairPlanned` |
| at least one `Accepted` and response invariants hold | TaskRun may enter `ResponseCandidate` |

---

## 8. Open decisions

1. Should S3 require exactly one accepted representative claim for certain evaluation fixtures, or should that stay outside the generic state machine?
2. Should `SchemaQualified -> EvidenceRefsQualified -> SlotsDeclared` be represented as separate runtime states, or only as validation phases in code?
3. How should S3 expose rejected claims in audit without leaking noisy LLM speculation into user-facing output?
4. Should non-SAST-backed claims be accepted in product mode, paper/evaluation mode, both, or neither?
