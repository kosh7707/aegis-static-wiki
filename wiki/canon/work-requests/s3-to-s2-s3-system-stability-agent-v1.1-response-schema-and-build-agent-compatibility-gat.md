---
title: "S3 system-stability agent-v1.1 response schema and Build Agent compatibility-gate notice"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-s3-system-stability-agent-v1.1-response-schema-and-build-agent-compatibility-gat"
last_verified: "2026-04-25"
service_tags: ["s3", "s2", "analysis-agent", "build-agent", "api-contract", "system-stability"]
decision_tags: ["agent-v1.1", "clean-pass", "contextual-evidence", "deadline-policy", "build-v1.1-proposal"]
related_pages: ["wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/api-contract-decisions.md", "wiki/canon/specs/analysis-agent.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-s3-system-stability-agent-v1.1-response-schema-and-build-agent-compatibility-gat"
wr_kind: "notice"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-25T09:02:15.596Z","note":"S2 prepared consumers for S3 system-stability semantics by preserving result-level outcome fields (`analysisOutcome`, `qualityOutcome`, `pocOutcome`, `recoveryTrace`), deriving `cleanPass` from completed result envelopes instead of transport completion, persisting outcome fields, and documenting the S1/S2 shared contract. Verified in backend contract/integration/full test runs."}]
registered_at: "2026-04-25T07:56:39.687Z"
completed_at: "2026-04-25T09:02:15.596Z"
---

# S3 system-stability agent-v1.1 response schema and Build Agent compatibility-gate notice

## Summary
- Kind: notice
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# Notice: S3 system-stability API/schema direction

S3 has started the system-stability overhaul from `.omx/plans/prd-s3-system-stability-overhaul-20260425.md`.

## Analysis Agent `agent-v1.1`

`agent-v1.1` is an additive **response schema/API contract label**, not prompt identity.

- `promptVersion=agent-v1` remains stable unless prompt text changes.
- `/v1/health.activePromptVersions.deep-analyze=agent-v1` remains a prompt-version surface.
- S3 may expose `schemaVersion=agent-v1.1` and additive `/v1/health.activeResponseSchemas.deep-analyze=agent-v1.1`.

Planned/additive result fields:

- `result.cleanPass`
- `result.evaluationVerdict`
- `result.contextualEvidenceRefs`
- `result.evidenceDiagnostics`
- `result.qualityGate`
- extended `result.recoveryTrace[]`

Consumer rule: `status=completed` and `X-AEGIS-Task-Ok:true` mean S3 returned an honest result envelope; they do **not** mean clean pass. Use `cleanPass` / `evaluationVerdict` / outcome fields for pass/fail UI and hot-gate logic.

## Evidence refs

S3 is promoting `contextualEvidenceRefs` for knowledge/context refs. These refs must not be treated as local proof. `usedEvidenceRefs` and `claims[].supportingEvidenceRefs` remain local or derived-from-local only.

## Deadline policy

`constraints.timeoutMs` remains advisory by default. It shapes downstream/tool budgets and timeout hints but is not silently reinterpreted as a hard public abort. A hard caller deadline would require a future explicit field/header such as `constraints.hardDeadlineMs` or `X-AEGIS-Hard-Deadline-Ms`.

## Build Agent

Build Agent v1.0.0 protected semantics remain authoritative until WP6 compatibility gate. S3 is planning additive `build-v1.1` domain outcome fields (`buildOutcome`, `cleanPass`, `buildDiagnostics`), but this is not a silent default flip and does not weaken strict compile-first/no-fake-success rules.

## Action for S2

Please prepare consumers to distinguish:

- task completion vs clean quality pass;
- contextual/knowledge refs vs local proof refs;
- Analysis Agent `schemaVersion`/response schema vs `promptVersion`;
- Build Agent v1 legacy failure semantics vs future gated build-domain outcomes.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
