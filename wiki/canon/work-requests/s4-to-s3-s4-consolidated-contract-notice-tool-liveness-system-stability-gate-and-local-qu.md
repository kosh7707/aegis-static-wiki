---
title: "S4 consolidated contract notice: tool liveness, system-stability gate, and local Quality Gate status supersede older staticEvidenceContract notices"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu"
last_verified: "2026-05-12"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["static-evidence-contract-v1", "system-stability-gate", "quality-gate", "tool-liveness", "supersedes-old-wrs"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/session-s4-api-doc-sync-20260512.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-12T06:28:05.556Z","note":"Superseded by formal S4→S3 request: wiki/canon/work-requests/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat.md. The request is the active WR S3 should act on."}]
registered_at: "2026-05-12T06:10:15.269Z"
completed_at: "2026-05-12T06:28:05.556Z"
---

# S4 consolidated contract notice: tool liveness, system-stability gate, and local Quality Gate status supersede older staticEvidenceContract notices

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S4 consolidated contract notice: tool liveness, system-stability gate, and local Quality Gate status

## Summary

This notice supersedes the older incremental S4→S3 staticEvidenceContract notices listed below. S3 should treat this WR plus the linked canonical docs as the current authoritative S4 consumer-facing state.

## Supersedes / deprecates older open S4→S3 notices

The following older S4 notices are now informational history only and should be completed by S3 as superseded after S3 records this consolidated notice:

- `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-consumer-canaries-added-for-s3-facing-json-consumption.md`
- `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-includes-s3-consumable-toolevidencematrix.md`
- `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-v1-now-propagates-per-tool-anomalies-into-gates.md`
- `wiki/canon/work-requests/s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun.md`

S4 is not changing their recipient-scoped completion state here because canonical WR policy says only recipients complete WRs.

## Current S4 tool-liveness state

Fresh 2026-05-12 S4 probe via `ScanOrchestrator.check_tools(force=True)`:

| Tool | Current status |
|---|---|
| semgrep | available, `1.156.0` |
| cppcheck | available, `2.13.0` |
| flawfinder | available, `2.0.19` |
| clang-tidy | available, `18.1.3` |
| scan-build | available, version string `scan-build` |
| gcc-fanalyzer | available via GCC `13.3.0` |

Health policy:

```text
policyStatus=ok
policyReasons=[]
unavailableTools=[]
```

Full S4 verification after the docs sync: `642 passed` (`25.57s` locally; Critic re-run `25.66s`).

## Current system-stability gate semantics

Default `/v1/scan` requires the current six tools. If `options.tools` is specified, that explicit subset is the required set.

- Preflight unavailable required tool: HTTP 503, `errorDetail.code="REQUIRED_TOOL_UNAVAILABLE"`.
- Post-execution missing/failed/partial/skipped/degraded/non-normal required tool: HTTP 503, `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"`.
- Unknown `options.tools[]`: HTTP 400, `errorDetail.code="SCAN_TOOL_INVALID"`.

This is a system-stability failure, not a quality/precision verdict.

## Current quality-gate state

The S4 local harness report is intentionally **not decision-grade** because pinned Juliet/SARD decision-grade corpus is not present yet.

Current local report state:

```text
qualityGate.status=not_decision_grade
qualityGate.decision=insufficient-evidence-for-tool-change
qualityGate.reasonCodes=[LOCAL_JULIET_CORPUS_NOT_PRESENT, LOCAL_ORACLE_QUALITY_FAILED]
qualityGate.localQualityAssessment.status=fail
failingSplits=[validation, test]
passingSplits=[canary]
```

Important consumer rule:

- `validationMetrics.status`, `testMetrics.status`, and `canaryMetrics.status` mean scoring succeeded.
- Threshold quality pass/fail lives under `qualityGate.localQualityAssessment`.
- `negativeTargetFpr=null` means no negative targets for that split and must not fail `maximumNegativeTargetFpr`.

## S3 consumer guidance

S3 should separate these surfaces:

1. **Tool liveness / system-stability** — `/v1/health`, required-tool policy failures, and `staticEvidenceContract.gates.systemStability`.
2. **Evidence readiness / bounded claim support** — `staticEvidenceContract.gates.evidenceReadiness`, `gates.claimSupportReadiness`, `claimBoundaryMatrix[]`, and `toolEvidenceMatrix`.
3. **Quality threshold evidence** — offline experiment report `qualityGate.localQualityAssessment`, not runtime `/v1/scan`.
4. **External knowledge / semantic graph / runtime / final security verdict** — still not provided by S4.

S4 evidence must not be used as:

- absence-of-vulnerability proof;
- CWE absence proof;
- exploitability judgment;
- S5/GraphRAG substitute;
- final security verdict.

## S3 requested handling

Please do one of the following:

1. Complete this consolidated WR after updating S3 consumer expectations/docs/tests to the current contract; and complete the four superseded older notices as `superseded by consolidated S4 contract notice`.
2. If S3 still needs one of the older notices independently, reply with the exact consumer requirement that is not covered by this consolidated notice.

## References

- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md`
- `wiki/canon/handoff/s4/session-s4-api-doc-sync-20260512.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
