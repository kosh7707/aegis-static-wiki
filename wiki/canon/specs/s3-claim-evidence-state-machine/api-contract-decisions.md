---
title: "S3 State Machine API Contract Decisions"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "wiki/canon/api/analysis-agent-api.md"
  - ".omx/plans/prd-s3-fail-never-state-machine-20260424.md"
  - ".omx/plans/prd-s3-system-stability-overhaul-20260425.md"
last_verified: "2026-04-25"
service_tags: ["s3", "s2", "analysis-agent", "api-contract"]
decision_tags: ["api-contract", "state-machine", "failure-code", "result-outcome", "work-request"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/retry-repair-policy.md", "wiki/canon/specs/s3-claim-evidence-state-machine/transition-table.md"]
---

# S3 State Machine API Contract Decisions

> Status: **decided for S3 implementation pass, notify-style public contract**  
> Scope: public Analysis Agent API/schema deltas for outcome/quality-separated state machine  
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

This page records the API decisions needed for the 2026-04-24 fail-never-on-valid-input S3 state-machine pass and the 2026-04-25 system-stability `agent-v1.1` additive response schema pass.

---

## 1. Decision summary

| Decision | Status | Implementation rule |
|---|---|---|
| `analysisOutcome` | decided | Add public result-level field on `AssessmentResult`. |
| `qualityOutcome` | decided | Add public result-level field on `AssessmentResult`. |
| `pocOutcome` | decided | Add public result-level field on `AssessmentResult`. |
| `recoveryTrace` | decided | Add bounded public deficiency/recovery summaries on `AssessmentResult`; keep detailed raw attempts in `audit.agentAudit`. |
| public task failure codes for S3-owned quality/schema/ref/grounding/no-accepted outcomes | withdrawn as default direction | Use completed result-level outcomes when valid input + required runtime health-alive can produce an honest envelope. |
| `contextualEvidenceRefs` | decided for `agent-v1.1` | Promote public contextual refs field. Knowledge/context refs stay out of local proof fields and appear in `contextualEvidenceRefs` plus diagnostics/audit. |
| `cleanPass` | decided for `agent-v1.1` | Add derived strict clean-pass boolean; `completed` alone is not pass. |
| `evaluationVerdict` | decided for `agent-v1.1` | Add consumer-facing verdict summary for taskCompleted/cleanPass/reasons/gate outcomes. |
| `evidenceDiagnostics` | decided for `agent-v1.1` | Add bounded diagnostics for invalid refs, wrong roles, missing slots, acquisitions, and unclassified refs. |
| `qualityGate` | decided for `agent-v1.1` | Add structured quality gate outcome and failed/repairable items. |
| no-finding default | decided | Valid input/runtime should return completed `no_accepted_claims` or `inconclusive`, not task failure. |
| `generate-poc` rejected result | decided | Valid claim input/runtime should return completed `poc_rejected` or `poc_inconclusive` if PoC cannot pass quality/safety. |
| S2 coordination | notify-style gate | S3 updates canonical API/docs and sends S2 notice before default runtime exposure; S2 approval wait is not required. |

---

## 2. Public result-level fields

Field placement is pinned for this implementation pass. `agent-v1.1` is a response schema/API contract label, not `promptVersion`:

```text
result.analysisOutcome
result.qualityOutcome
result.pocOutcome
result.recoveryTrace
result.cleanPass
result.evaluationVerdict
result.contextualEvidenceRefs
result.evidenceDiagnostics
result.qualityGate
```

### `analysisOutcome`

```text
accepted_claims
no_accepted_claims
inconclusive
```

### `qualityOutcome`

```text
accepted
accepted_with_caveats
rejected
inconclusive
repair_exhausted
```

### `pocOutcome`

```text
poc_accepted
poc_rejected
poc_inconclusive
poc_not_requested
```

### `recoveryTrace`

Bounded public summaries of deficiency/recovery classification, for example:

```json
[
  {
    "deficiency": "SCHEMA_DEFICIENT",
    "action": "deterministic_scaffold",
    "outcome": "classified",
    "detail": "missing final fields were scaffolded without fabricating evidence"
  }
]
```

Detailed attempt counts, raw model/tool traces, and full audit events remain under `audit.agentAudit`.

---

## 3. Completed-vs-clean-pass contract

`completed` means S3 returned a schema-valid honest result envelope.

It does **not** imply:

- accepted claims;
- accepted PoC;
- clean hot/evaluation pass;
- no recovery/repair happened.

Clean deep pass:

```text
completed + analysisOutcome=accepted_claims + qualityOutcome=accepted
```

Clean PoC pass:

```text
completed + pocOutcome=poc_accepted + qualityOutcome=accepted
```

---

## 4. Failure-boundary decision

For valid endpoint input and required services health-alive, these signals are result-level deficiencies, not task failures:

- malformed/non-JSON/partial LLM output while S7 is reachable;
- output schema deficiency such as `INVALID_SCHEMA`;
- hallucinated/missing/wrong-role refs;
- grounding deficiency;
- quality rejection or repair exhaustion;
- no accepted claims;
- inconclusive analysis from partial but non-fatal evidence/tool limits;
- PoC schema/ref/quality/safety rejection for valid PoC requests.

They must route through RecoveryTriage / repair / outcome classification and return a completed envelope when a schema-valid envelope can be assembled.

Task failure remains narrow:

- invalid caller contract;
- missing required trusted input;
- unsupported task type;
- unsafe/out-of-authority request;
- required dependency/runtime genuinely unavailable or dead before response assembly;
- hard timeout/cancellation preventing envelope return;
- internal exception / invariant bug preventing any schema-valid response envelope.

---

## 5. Exhaustion split

Recoverable to completed when valid input/runtime is alive and envelope assembly is possible:

| Current reason | Result-level mapping |
|---|---|
| `no_new_evidence` | `analysisOutcome=inconclusive` or `analysisOutcome=no_accepted_claims` |
| `all_tiers_exhausted` | `qualityOutcome=repair_exhausted` and/or `analysisOutcome=inconclusive` |
| `budget_exhausted` | `qualityOutcome=repair_exhausted` or `analysisOutcome=inconclusive` unless it is a hard timeout/cancel boundary |
| `max_steps` | `qualityOutcome=repair_exhausted` or `analysisOutcome=inconclusive` unless it is a hard timeout/cancel boundary |

Remain task failure:

- hard `timeout`;
- explicit cancellation;
- dependency/service unavailable or dead;
- invalid/unsafe input;
- impossible envelope assembly/internal exception.

---

## 6. Generate-PoC boundary

Task failure remains correct for invalid request preconditions:

- missing/invalid trusted `claim`;
- missing required `files`;
- unsupported task type or unsafe/out-of-authority request.

For valid claim input and live runtime, internal PoC-generation/schema/ref/quality/no-claim failures should return:

```text
completed + pocOutcome=poc_rejected
```

or

```text
completed + pocOutcome=poc_inconclusive
```

with recovery/quality details visible in `recoveryTrace` and audit.

---

## 7. Evidence field decision

The state-machine final proof fields stay conservative:

```text
usedEvidenceRefs subset allowedLocalOrDerivedLocalRefs
claims[].supportingEvidenceRefs subset allowedLocalOrDerivedLocalRefs
```

`agent-v1.1` promotes the role-aware contextual field:

```json
{
  "usedEvidenceRefs": ["eref-local-sast:..."],
  "contextualEvidenceRefs": ["eref-knowledge-cwe:CWE-78"]
}
```

Knowledge refs must stay out of proof fields (`usedEvidenceRefs`, `claims[].supportingEvidenceRefs`) but may appear in `contextualEvidenceRefs`, diagnostics, caveats, and audit.

---

## 8. S2 notification / exposure gate

Before default runtime exposure, S3 must notify S2 with:

- new result-level outcome fields and values;
- statement that `completed` no longer means clean quality pass;
- hot/evaluation clean-pass interpretation;
- UI implication for `no_accepted_claims`, `inconclusive`, `repair_exhausted`, `poc_rejected`, and `poc_inconclusive`;
- statement that HTTP 200 + terminal task failure remains forbidden;
- statement that true task failure remains non-2xx for invalid input, unsafe request, dead dependency, hard timeout/cancel, or impossible envelope assembly.

A WR/proposal alone is sufficient only for internal or non-default gated implementation. The 2026-04-24 user directive authorizes S3 to make the public API/schema change on a notify-style basis; S2 approval wait is not required.

---

## 9. Deadline decision (`agent-v1.1`)

`constraints.timeoutMs` remains advisory by default. It shapes downstream phase/tool budgets and timeout hints but is not a hard public abort. S3-owned enforced deadlines must be service configuration. A hard caller deadline requires an explicit opt-in contract such as `constraints.hardDeadlineMs` or `X-AEGIS-Hard-Deadline-Ms`; it must not be inferred from existing `constraints.timeoutMs`.
