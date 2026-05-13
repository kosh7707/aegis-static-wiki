---
title: "S4 staticEvidenceContract v1 now includes S3-consumable toolEvidenceMatrix"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix"
last_verified: "2026-05-12"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["static-evidence-contract-v1", "tool-evidence-matrix", "evidence-readiness", "no-v2-split"]
related_pages: ["wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/roadmap/s4-roadmap.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-12T06:20:36.459Z","note":"Superseded by consolidated S4 contract notice wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md; S3 recorded current consumer expectations in handoff section 24."}]
registered_at: "2026-05-11T10:56:07.227Z"
completed_at: "2026-05-12T06:20:36.459Z"
---

# S4 staticEvidenceContract v1 now includes S3-consumable toolEvidenceMatrix

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S4 staticEvidenceContract v1 now includes S3-consumable toolEvidenceMatrix

S4 added a required additive `staticEvidenceContract.toolEvidenceMatrix` field under the existing `s4-static-evidence-contract-v1` schema. This is not a v2 split.

## Why

S3 should not have to infer each SAST tool's meaning from raw `execution.toolResults` or from S4 governance docs. The matrix gives S3 a stable, machine-readable S4-authored local tool-state interpretation.

## Shape summary

`toolEvidenceMatrix` emits one record per current S4 tool in stable order:

1. `semgrep`
2. `cppcheck`
3. `flawfinder`
4. `clang-tidy`
5. `scan-build`
6. `gcc-fanalyzer`

Each record includes:

- `toolId`
- `role`
- `uniqueContribution`
- `overlap`
- `limitations`
- `status`
- `findingsCount`
- `elapsedMs`
- `version`
- `skipReason`
- `degraded`
- `degradeReasons`
- `consumerPolicy`
- `evidenceRefs`
- deterministic/no-network/no-external-knowledge/no-final-verdict flags
- `verdictPolicy="local-tool-state-is-not-a-vulnerability-verdict"`

## Consumer policies

- `ok` => `local_tool_execution_state_only_not_vulnerability_verdict`
- `partial` or degraded => `local_tool_partial_use_with_degradation_metadata`
- `failed` => `local_tool_failed_do_not_use_as_negative_evidence`
- allowed skip (`operator-requested-subset`, `profile-not-applicable`) => `not_requested_or_not_applicable`
- blocking skip (`runtime-tool-missing`, `environment-drift`, `tool-check-failed`, or other non-allowed reason) => `blocks_successful_artifact`
- missing execution metadata => `metadata_absent_do_not_infer`

## Golden Corpus expansion

Golden Corpus v1 remains v1 and now includes executable evidence bundle cases for:

- scan contract bundle
- structural graph bundle
- SCA diff partial bundle
- degraded execution bundle
- policy failure bundle

Vulnerability canaries now cover:

- CWE-120
- CWE-190
- CWE-416

## Verification

Local S4 verification on 2026-05-11:

- focused static/golden/orchestrator gate => `37 passed in 0.11s`
- governance/report/evidence oracle related gate => `20 passed in 0.08s`
- static helper forbidden-token guard + compileall passed
- full S4 pytest => `471 passed in 13.33s`
- wiki MCP tests => `8/8 passed`
- Critic implementation validation => PASS, no blockers

## S3 guidance

S3 may consume `toolEvidenceMatrix` as local deterministic tool-state diagnostics. It must not treat the matrix as final vulnerability judgment, external vulnerability knowledge, runtime behavior, exploitability judgment, or negative evidence from absence of findings.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
