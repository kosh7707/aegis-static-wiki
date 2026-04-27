---
title: "S3 Claim-Evidence State Machine Invariants"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "/home/kosh/AEGIS/.omx/plans/s3-agent-state-machine-work-breakdown-20260423.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md"
last_verified: "2026-04-23"
service_tags: ["s3", "analysis-agent"]
decision_tags: ["invariants", "state-machine", "grounding", "quality-gate", "retry-policy"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/taskrun-statechart.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md", "wiki/canon/specs/s3-claim-evidence-state-machine/quality-gates.md", "wiki/canon/specs/s3-claim-evidence-state-machine/poc-lifecycle.md"]
---

# S3 Claim-Evidence State Machine Invariants

> Status: **draft**
> Scope: non-negotiable rules for S3 state-machine implementation and verification
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

Invariants are rules that must remain true regardless of prompt wording, model behavior, fixture, or retry path.

---

## 1. Task/result separation invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-STATUS-001` | `completed` means S3 returned a schema-valid, honest result envelope. | response validator |
| `INV-STATUS-002` | `completed` does not imply accepted claims, accepted PoC, or clean hot-gate pass. | hotN reporter tests |
| `INV-STATUS-003` | S3-owned schema/ref/grounding/quality/PoC deficiencies must enter RecoveryTriage before outcome classification. | state transition tests |
| `INV-STATUS-004` | Task-level failure is reserved for invalid input, unsafe/out-of-authority request, unavailable runtime/dependency, hard timeout/cancellation, or internal exception preventing any valid response. | API contract tests |

---

## 2. Claim grounding invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-CLAIM-001` | `analysisOutcome=accepted_claims` implies every accepted claim has local or derived-from-local evidence refs. | claim validator |
| `INV-CLAIM-002` | Knowledge evidence cannot satisfy local grounding slots. | evidence-slot validator |
| `INV-CLAIM-003` | `claims[].supportingEvidenceRefs` must be a subset of allowed local/derived-local refs. | evidence-ref validator |
| `INV-CLAIM-004` | Knowledge-only support yields rejected/no-accepted/inconclusive outcome, not accepted claim. | fixture test |
| `INV-CLAIM-005` | Rejected claims may remain in audit but must not appear as accepted final claims. | result assembler tests |

---

## 3. Evidence ledger invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-EVID-001` | Every final evidence ref must exist in S3 evidence ledger. | ledger validator |
| `INV-EVID-002` | In v1, `usedEvidenceRefs` must be local or derived-from-local. | final response validator |
| `INV-EVID-003` | Derived evidence that supports a claim must point back to `sourceLocalRefs`. | derived-ref validator |
| `INV-EVID-004` | Operational evidence cannot be used as vulnerability proof. | claim validator |
| `INV-EVID-005` | Prompt-visible refs and final refs must be aligned or pass explicit audited repair/rejection. | controller integration test |

---

## 4. Recovery invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-RECOVERY-001` | A deficiency signal cannot directly become task-level failure if a valid completed outcome can be assembled. | state tests |
| `INV-RECOVERY-002` | Recovery attempts must be audited with deficiency class, recovery level, attempt number, and result. | audit tests |
| `INV-RECOVERY-003` | Recovery must not fabricate evidence or change claim identity to pass. | fixture tests |
| `INV-RECOVERY-004` | Recovery exhaustion maps to result-level outcome unless runtime/envelope assembly is impossible. | controller tests |

---

## 5. Quality invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-QUAL-001` | Quality gate returns an outcome classification, not only pass/fail. | quality tests |
| `INV-QUAL-002` | `quality.repairable` includes repair actions. | quality tests |
| `INV-QUAL-003` | `quality.rejected` maps to result-level rejection/no-accepted/poc-rejected, not task failure. | controller tests |
| `INV-QUAL-004` | Caveated success must be represented as `accepted_with_caveats`, not failed-quality success. | quality tests |

---

## 6. PoC invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-POC-001` | `generate-poc` requires an accepted-claim-compatible input. | handler tests |
| `INV-POC-002` | PoC cannot invent source locations or supporting refs. | PoC validator tests |
| `INV-POC-003` | PoC repair cannot change accepted claim identity. | repair tests |
| `INV-POC-004` | `poc_rejected` is a result-level completed outcome for valid input/runtime. | PoC controller tests |
| `INV-POC-005` | Hot gates inspect `pocOutcome`, not only task status. | hotN tests |

---

## 7. Boundary invariants

| ID | Invariant | Verification target |
|---|---|---|
| `INV-BOUNDARY-001` | `agent-shared` must not contain vulnerability-family scoring or benchmark-specific logic. | code review |
| `INV-BOUNDARY-002` | Analysis Agent owns claim/evidence/security quality domain logic. | code review |
| `INV-BOUNDARY-003` | Build Agent owns build/workspace/artifact logic. | code review |
| `INV-BOUNDARY-004` | S3 consumes S4/S5/S7 through public API contracts. | review |

---

## 8. Fixture requirements

Minimum fixtures:

1. knowledge-only refs;
2. hallucinated refs;
3. missing source/caller/input slots;
4. no accepted claims but valid completed response;
5. inconclusive due to partial S4/S5 context;
6. quality rejected but completed outcome;
7. PoC rejected but completed outcome;
8. invalid caller input still task-fails;
9. LLM/S7 unavailable still task-fails;
10. hotN report separating completion from clean pass.
