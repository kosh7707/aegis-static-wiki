---
title: "S3 Claim-Evidence Transition Table"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md"
last_verified: "2026-04-23"
service_tags: ["s3", "analysis-agent"]
decision_tags: ["transition-table", "state-machine", "retry-policy", "grounding", "quality-gate"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md", "wiki/canon/specs/s3-claim-evidence-state-machine/quality-gates.md", "wiki/canon/specs/s3-claim-evidence-state-machine/poc-lifecycle.md", "wiki/canon/specs/s3-claim-evidence-state-machine/invariants.md"]
---

# S3 Claim-Evidence Transition Table

> Status: **draft**
> Scope: implementation-facing transition contract distilled from the statechart pages
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

This table reflects the outcome/quality separation. It deliberately routes S3-owned deficiencies through RecoveryTriage rather than direct task-level failure.

---

## 1. TaskRun transition table

| State | Event | Guard | Action | Next | Task status implication |
|---|---|---|---|---|---|
| `TaskEnvelopeValid` | `context.ready` | required trusted input present | build evidence ledger/context | `ExecutionContextReady` | none |
| `TaskEnvelopeValid` | `required_trusted_input.missing` | caller omitted non-creatable input | emit caller contract diagnostic | `TaskRejectedInvalidInput` | task failure |
| `ExecutionContextReady` | `draft.requested` | runtime/LLM available | request draft | `DraftPending` | none |
| `DraftPending` | `llm.draft_returned` | draft content exists | parse/extract candidate | `DraftCandidate` | none |
| `DraftPending` | `llm.output_deficient` | LLM alive but output malformed | classify deficiency | `RecoveryTriage` | not task failure |
| `DraftPending` | `llm_or_runtime.unavailable` | dependency unavailable | emit unavailable diagnostic | `ExecutionUnavailable` | task failure |
| `DraftCandidate` | `schema_or_ref_or_grounding_or_quality.deficient` | any internal gate deficient | record deficiency class | `GateDeficiencyDetected` | not task failure |
| `GateDeficiencyDetected` | `deficiency.classified` | class and recovery options known | enter central decision | `RecoveryTriage` | not task failure |
| `RecoveryTriage` | `schema_repair.available` | level 0/2 budget remains | plan schema repair | `SchemaRepairPlanned` | none |
| `RecoveryTriage` | `ref_repair.available` | correlated local refs or repair path exists | plan audited ref repair | `RefRepairPlanned` | none |
| `RecoveryTriage` | `evidence_acquisition.available` | missing slots recoverable | plan targeted acquisition | `EvidenceAcquisitionPlanned` | none |
| `RecoveryTriage` | `quality_or_claim_repair.available` | failed quality items have repair actions | plan repair | `ClaimRepairPlanned` | none |
| `RecoveryTriage` | `clean_s3_retry.available` | upstream stable; retry budget remains | plan clean retry | `CleanRetryPlanned` | none |
| `RecoveryTriage` | `recovery.exhausted_or_not_applicable` | valid result envelope can still be assembled | classify honest result outcome | `OutcomeClassification` | completed candidate |
| `RecoveryTriage` | `dependency_required_but_unavailable` | cannot assemble any meaningful response | emit dependency failure | `ExecutionUnavailable` | task failure |
| `RecoveryTriage` | `invariant_or_assembly_bug.unrecoverable` | S3 cannot assemble schema-valid envelope | emit internal error | `InternalError` | task failure |
| `SchemaRepairPlanned` | `repair.applied` | repair produced candidate | revalidate | `DraftCandidate` | none |
| `RefRepairPlanned` | `repair.applied` | audited repair produced candidate | revalidate | `DraftCandidate` | none |
| `EvidenceAcquisitionPlanned` | `evidence.attached` | new evidence ledger refs attached | revalidate | `DraftCandidate` | none |
| `ClaimRepairPlanned` | `repair.applied` | claim/quality repair produced candidate | revalidate | `DraftCandidate` | none |
| `CleanRetryPlanned` | `retry.started` | retry submitted | request new draft | `DraftPending` | none |
| `OutcomeClassification` | `outcome.classified` | analysis/quality/PoC outcome assigned | assemble result envelope | `ResponseCandidate` | completed candidate |
| `ResponseCandidate` | `final_envelope.validated` | schema-valid honest response | return response | `Succeeded` | HTTP 200 / `completed` |
| `ResponseCandidate` | `final_envelope.deficient` | repair possible | classify deficiency | `RecoveryTriage` | not task failure |
| `ResponseCandidate` | `final_envelope.unassemblable` | response cannot be made valid | emit internal error | `InternalError` | task failure |

---

## 2. Result outcome mapping

| Condition after recovery | Result-level outcome | Task status |
|---|---|---|
| accepted grounded claims exist | `analysisOutcome=accepted_claims` | `completed` |
| accepted claims exist but caveats required | `analysisOutcome=accepted_claims`, `qualityOutcome=accepted_with_caveats` | `completed`, non-clean under strict hot gate |
| no claim can be accepted honestly | `analysisOutcome=no_accepted_claims` | `completed` |
| evidence/tool partiality prevents conclusion | `analysisOutcome=inconclusive` | `completed` |
| PoC accepted | `pocOutcome=poc_accepted` | `completed` |
| PoC cannot satisfy quality/safety | `pocOutcome=poc_rejected` | `completed` |

---

## 3. Task failure mapping

| Failure state | Meaning | Typical API mapping |
|---|---|---|
| `TaskRejectedInvalidInput` | invalid caller contract / missing trusted input | 400/422 |
| `UnsafeRequestRejected` | unsafe/out-of-authority request | 422/policy |
| `ExecutionUnavailable` | dependency/runtime unavailable or hard timeout | 503/504 |
| `InternalError` | S3 cannot assemble valid response | 500 |

---

## 4. Implementation note

The implementation may still use internal deficiency codes such as `INVALID_GROUNDING` or `QUALITY_REJECTED` for audit and hotN grouping. Those are not necessarily task-level `failureCode`s when a completed result envelope is returned.
