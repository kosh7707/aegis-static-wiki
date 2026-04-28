---
title: "S3 State Machine Implementation Work Packages"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "/home/kosh/AEGIS/.omx/plans/s3-agent-state-machine-work-breakdown-20260423.md"
  - "wiki/canon/specs/s3-claim-evidence-state-machine/transition-table.md"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-paper-remediation-complete-20260427.md"
  - "mcp://aegis-static-wiki.write_page"
  - "/home/kosh/AEGIS/.omc/state/codex-handoff-progress.md"
  - "mcp://aegis-static-wiki.record_session_history"
last_verified: "2026-04-27"
service_tags: ["s3", "analysis-agent", "build-agent"]
decision_tags: ["implementation-plan", "state-machine", "retry-policy", "testing", "ai-slop-cleanup", "wp-0a", "execution-order", "paper-remediation", "paper-remediation-complete", "hotn-reporting", "build-v1.1-default", "critic-fix", "planner-runtime-wiring", "negative-evidence-honesty"]
related_pages: ["wiki/canon/specs/s3-claim-evidence-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/transition-table.md", "wiki/canon/specs/s3-claim-evidence-state-machine/invariants.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/claim-lifecycle.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md", "wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-wp-1-claimdiagnostics-shape-refinement.md", "wiki/canon/work-requests/s3-to-s2-s3-analysis-agent-claim-diagnostics-additive-schema-wp-0a-notice.md"]
---

# S3 State Machine Implementation Work Packages

> Status: **draft**
> Scope: implementation/test work breakdown derived from the outcome/quality-separated S3 state machine
> Parent: [[wiki/canon/specs/s3-claim-evidence-state-machine/readme|S3 Claim-Evidence State Machine]]

This page turns the revised state-machine design into implementation slices. The key change is that normal S3-owned deficiencies should produce completed result-level outcomes after recovery, not task-level failures.

---

## 1. Non-negotiable implementation rule

Do not start by patching `certificate-maker` or CWE-78 behavior.

Do not start by adding more terminal failure paths.

Start by adding the result-level outcome model and quality-gate classifier that lets S3 separate:

```text
task completed
```

from:

```text
claim accepted / no accepted claims / inconclusive / PoC accepted / PoC rejected / clean hot-gate pass
```

---

## 2. Work packages

### WP0 — API outcome-field decision and S2 notice gate

Deliverables:

- decide public schema for `analysisOutcome`, `qualityOutcome`, and `pocOutcome`;
- decide public vs audit placement for quality-gate failed items and repair attempts;
- decide whether/when `contextualEvidenceRefs` is introduced;
- update canonical Analysis Agent API and align S2 consumer expectations before default runtime exposure. A WR/proposal alone is sufficient only for an internal or non-default gated implementation.

Acceptance:

- S2 can distinguish `completed + accepted_claims` from `completed + no_accepted_claims`, `completed + poc_rejected`, and `completed + poc_inconclusive`;
- hot/evaluation tooling can distinguish completed rate from clean pass rate;
- no proposed outcome fields are exposed by default before API/S2 alignment; WR-only work must remain internal/non-default gated.

### WP1 — Result outcome and quality gate models

Deliverables:

- `analysisOutcome` enum;
- `pocOutcome` enum;
- `qualityOutcome` enum;
- quality gate output with failed items, repairability, repair attempts, caveats, and human-review signal.

Acceptance:

- quality gates classify accepted, accepted-with-caveats, repairable, rejected, and inconclusive outcomes;
- rejected/inconclusive can be returned in completed responses.

### WP2 — Failure/deficiency taxonomy and RecoveryTriage

Deliverables:

- separate task failures from S3-owned deficiency signals;
- central RecoveryTriage selector;
- recovery budget model;
- audit event shape.

Acceptance:

- schema/ref/grounding/quality/PoC deficiencies do not directly create task failures;
- invalid caller input and dependency/runtime failures still task-fail correctly.

### WP3 — Evidence ledger and classifier

Deliverables:

- local/knowledge/derived/operational classifier;
- mapping from current EvidenceCatalog categories;
- derived evidence `sourceLocalRefs` requirement;
- final ref policy preserving v1 local/derived-local only.

Acceptance:

- knowledge refs cannot ground claims;
- rejected/no-accepted outcomes are used instead of evidence fabrication.

### WP4 — Evidence-slot policy and acquisition planner

Deliverables:

- vulnerability-family required/recommended slot policy;
- missing-slot computation;
- targeted S4/S5/code/build acquisition planner.

Acceptance:

- missing slots trigger acquisition/retry/outcome classification, not immediate task failure.

### WP5 — Claim lifecycle and canonicalization

Deliverables:

- claim identity model;
- accepted/rejected claim lifecycle;
- duplicate/overlap merge policy;
- no-accepted-claims outcome.

Acceptance:

- no accepted claims becomes completed `analysisOutcome=no_accepted_claims` when task input/runtime are valid;
- rejected claims remain in audit only.

### WP6 — Ref repair and grounding controller

Deliverables:

- explicit audited ref repair;
- correlated local-ref recomputation;
- grounding repair/acquisition loop.

Acceptance:

- invalid refs are repaired/rejected through RecoveryTriage;
- final completed response remains schema-valid and honest.

### WP7 — Deep Analyze controller rewrite

Deliverables:

- TaskRun v2 controller;
- RecoveryTriage integration;
- result-outcome classification;
- final envelope assembly.

Acceptance:

- valid input + live runtime yields completed response;
- hotN can report completion vs quality outcome separately.

### WP8 — Generate-PoC controller rewrite

Deliverables:

- claim-bound PoC lifecycle;
- PoC quality outcome classifier;
- `poc_rejected` / `poc_inconclusive` completed result separation.

Acceptance:

- valid claim input + live runtime yields completed with `pocOutcome`;
- PoC quality rejection is not task failure.

### WP9 — Agent Shared boundary cleanup / supersession

> **2026-04-26 supersession**: the earlier "keep a thin shared primitive helper layer" direction is superseded by the S3 Producer/Critic/Orchestrator refactor PRD (`/home/kosh/AEGIS/.omx/plans/prd-s3-producer-critic-orchestrator-refactor-20260426.md`). The current direction is service-local ownership, not retained shared-kernel ownership.

Deliverables:

- remove Analysis Agent and Build Agent runtime/test imports of the former shared runtime package;
- copy and specialize primitive LLM/timeout/retry/HTTP/tool-router helpers into each service-local runtime package;
- remove former shared-runtime editable installs from both S3 service requirements;
- remove start-script reload references to the former shared-runtime source tree;
- retire/delete the former shared runtime directory after zero-import proof and docs/bootstrap ownership cleanup;
- keep security outcome/quality logic in Analysis Agent;
- keep build/workspace/artifact logic in Build Agent.

Acceptance:

- no runtime/test dependency on the former shared-runtime directory remains for Analysis Agent or Build Agent;
- no vulnerability-family or benchmark policy is moved into a shared kernel;
- bootstrap/charter ownership surfaces list only active S3 service paths; 2026-04-27 cleanup completed this gate.

### WP10 — Evaluation harness

Deliverables:

- fixture fault injection tests;
- multi-CWE fixture suite;
- hotN report with separate counts for task completion, accepted claims, no accepted claims, inconclusive, PoC accepted/rejected, clean pass.

Acceptance:

- hotN no longer treats every non-clean quality result as transport/task failure;
- certificate-maker remains one fixture, not the only target.

---

## 3. Suggested execution order

0. WP0 API outcome-field decision and S2 notice gate.
1. WP1 result outcome / quality gate models.
2. WP2 deficiency taxonomy / RecoveryTriage.
3. WP3 evidence ledger classifier.
4. WP4 evidence-slot policy and acquisition planner.
5. WP5 claim lifecycle / canonicalization.
6. WP6 ref repair / grounding controller.
7. WP7 deep-analyze controller.
8. WP8 generate-poc controller.
9. WP9 shared boundary cleanup.
10. WP10 evaluation harness and hotN reporting.

---

## 4. Required fixture suite

Minimum fixtures:

- invalid caller input still task-fails;
- LLM/S7 unavailable still task-fails;
- malformed LLM schema repairs to completed outcome;
- hallucinated refs repair/reject to completed no-accepted/inconclusive;
- missing local slots yield completed no-accepted/inconclusive after recovery;
- quality rejected yields completed quality outcome;
- no accepted claims yields completed `analysisOutcome=no_accepted_claims`;
- PoC immediate unsafe/ref/grounding failure yields completed `pocOutcome=poc_rejected`; bounded quality-repair exhaustion yields completed `pocOutcome=poc_inconclusive`;
- hotN clean pass differs from task completed.

---

## 5. Verification gates

Each implementation slice should include:

1. unit tests for outcome/quality/RecoveryTriage decision;
2. fixture tests for result-level outcomes;
3. Analysis Agent full suite;
4. Build Agent suite if shared/build-adjacent code changes;
5. hotN classification report only after fixtures pass;
6. static grep/review for benchmark-specific patches.

<!-- S3-WP0A-20260427:START -->
## 2026-04-27 paper-remediation execution record

For the S3 paper-remediation stabilization pass, this page is superseded in execution order by `/home/kosh/AEGIS/.omx/plans/prd-s3-paper-remediation-complete-20260427.md` and its companion test spec. The approved Ralph run executed the work in this order:

1. `WP-0` baseline test snapshot.
2. `WP-0a` public contract/doc gate before Analysis Agent schema-changing code.
3. `WP-2a` EvidenceCatalog foundation: history-preserving records, CWE regex fix, `negative` evidence class, and final-ref filtering.
4. `WP-2b` negative/operational evidence emission.
5. `WP-2c` live recovery/evidence ledger diagnostics.
6. `WP-1` first-class Claim status/slots and `result.claimDiagnostics` for non-accepted candidates.
7. `WP-3` outcome-for-deficiency SSoT.
8. `WP-4` deterministic advisory acquisition planner.
9. `WP-5/WP-7` PoC quality retry and structural-safety hardening.
10. `WP-6` readiness gating for unavailable graph/knowledge tools.
11. `WP-8/WP-9` Build Agent contract gate: active `build-v1.1`, `EXPECTED_ARTIFACTS_MISMATCH` as completed non-clean build-domain result, and S3→S2 notice WR.
12. `WP-13/WP-14/WP-16/WP-17` cleanup/boundary hardening: removed dead `CLEAN_RETRY`, documented producer boundaries, added codegraph callers terminology shim, and added no-dependency producer-boundary tests.
13. `WP-19` evaluation/hotN reporting scaffold: multi-family fixture matrix, separated completion/quality/Poc/clean-pass buckets, and silent-200 diagnostic coverage.
14. Critic/Architect blocker fix: wired `plan_next_action` into live `deep-analyze` prompt construction and excluded `eref-negative-*` from local diagnostics.
15. WP-5 follow-up blocker fix: `poc_quality_repair_max_attempts` now follows the PRD default/range, generate-poc uses request-scoped repair budget projection, and QualityGate repair prompts include `repairHint` plus failedItems.
16. Closeout blocker fix: deterministic claim requirements now include family-specific local evidence slots (for example command injection requires source location, sink/dangerous API, and caller-chain or source-slice support), and deep quality gate rejects accepted claims with unfilled required slots.
17. Closeout blocker fix: `generate-poc` repaired-success telemetry now computes latency and emits success logs after the quality-repair loop, so repaired successes do not under-report repair cost.
18. `WP-20-doc` final canonical session/test evidence sync recorded via `record_session_history` and `append_test_evidence`.

Current canonical contract notes:
- `result.claims[]` is reserved for accepted/grounded claims; non-accepted lifecycle states appear under `result.claimDiagnostics.nonAcceptedClaims[]` and audit diagnostics.
- Build Agent `build-v1.1` fields are active by default; S2 must use `result.cleanPass` and diagnostics rather than treating `status=completed` as build success.
- Hot/evaluation reporting must separate task completion from accepted-claim quality, PoC outcome, and strict clean pass.
- Deterministic acquisition suggestions are advisory, but must be computed after Phase 1/catalog ingestion and readiness gating so the live prompt cannot drift from the state-machine planner. Accepted-claim promotion must also enforce the family slot policy from the evidence-ref contract; a generic local ref alone is insufficient for command injection, path traversal, memory-bounds, null-deref, integer-overflow, or dependency-vulnerability families unless it carries the required roles.

The older WP numbering on this page remains useful as design lineage, but implementation must follow the PRD above until another canonical S3 plan supersedes it.
<!-- S3-WP0A-20260427:END -->
