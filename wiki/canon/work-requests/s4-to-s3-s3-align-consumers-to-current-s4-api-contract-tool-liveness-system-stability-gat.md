---
title: "S3 align consumers to current S4 API contract: tool liveness, system-stability gate, and local Quality Gate separation"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat"
last_verified: "2026-05-13"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["api-contract", "static-evidence-contract-v1", "system-stability-gate", "quality-gate", "tool-liveness"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s4/session-s4-api-doc-sync-20260512.md", "wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-align-consumers-to-current-s4-api-contract-tool-liveness-system-stability-gat"
wr_kind: "request"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-13T02:15:11.163Z","note":"S3 implemented consumer-code alignment for the current S4 API contract. Analysis Agent now fail-closes missing/empty/malformed/degraded staticEvidenceContract payloads, requires systemStability/evidenceReadiness/claimSupportReadiness plus claimBoundaryMatrix/toolEvidenceMatrix before clean local static evidence readiness, suppresses SAST no-findings negative evidence when static evidence is not ready or tools are partial, emits operational diagnostics, warns Phase 2 not to treat S4 local evidence as absence/exploitability/S5/GraphRAG/final-verdict proof, and has a regression proving offline S4 qualityGate split metric status=pass is not runtime staticEvidenceContract readiness. Handoff/session evidence recorded under wiki/canon/handoff/s3/readme.md#25 and session-s3-s4-api-alignment-20260513.md. Final Critic PASS after initial blocker fix. Fresh verification: focused S3 related suite 115 passed in 1.43s; full Analysis Agent suite 640 passed in 7.00s; compile/diff PASS; wiki validation/diff PASS."}]
registered_at: "2026-05-12T06:27:51.928Z"
completed_at: "2026-05-13T02:15:11.163Z"
---

# S3 align consumers to current S4 API contract: tool liveness, system-stability gate, and local Quality Gate separation

## Summary
- Kind: request
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 align consumers to current S4 API contract

## Summary

S4 updated the canonical API contract and owner docs. This is the action-request version of the prior consolidated notice. S3 should align its S4 consumer logic/docs/tests to the current S4 contract and then complete this WR.

Supersedes notice:

- `wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md`

## Current S4 API contract references

- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
- `wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md`
- `wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md`

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

Full S4 verification after docs sync: `642 passed` (`25.57s` local run; Critic re-run `25.66s`).

## Contract S3 must align to

### 1. System-stability gate is separate from quality gate

Default `/v1/scan` requires all current six tools. If `options.tools` is specified, that explicit subset is the required set.

- Preflight unavailable required tool: HTTP 503, `errorDetail.code="REQUIRED_TOOL_UNAVAILABLE"`.
- Post-execution missing/failed/partial/skipped/degraded/non-normal required tool: HTTP 503, `errorDetail.code="REQUIRED_TOOL_EXECUTION_INCOMPLETE"`.
- Unknown `options.tools[]`: HTTP 400, `errorDetail.code="SCAN_TOOL_INVALID"`.

These are system-stability failures, not quality/precision verdicts.

### 2. Runtime static evidence readiness is not a final security verdict

S3 should consume:

- `staticEvidenceContract.gates.systemStability`
- `staticEvidenceContract.gates.evidenceReadiness`
- `staticEvidenceContract.gates.claimSupportReadiness`
- `staticEvidenceContract.claimBoundaryMatrix[]`
- `staticEvidenceContract.toolEvidenceMatrix[]`

S3 must not infer from S4 evidence alone:

- absence of vulnerability;
- CWE absence;
- exploitability;
- S5/GraphRAG substitute evidence;
- runtime behavior;
- final security verdict.

### 3. Quality-threshold evidence is offline experiment evidence

The S4 local harness report is currently **not decision-grade** because pinned Juliet/SARD decision-grade corpus is not present yet.

Current report state:

```text
qualityGate.status=not_decision_grade
qualityGate.decision=insufficient-evidence-for-tool-change
qualityGate.reasonCodes=[LOCAL_JULIET_CORPUS_NOT_PRESENT, LOCAL_ORACLE_QUALITY_FAILED]
qualityGate.localQualityAssessment.status=fail
failingSplits=[validation, test]
passingSplits=[canary]
```

Consumer rule:

- `validationMetrics.status`, `testMetrics.status`, and `canaryMetrics.status` mean deterministic scoring succeeded.
- Threshold quality pass/fail lives under `qualityGate.localQualityAssessment`.
- `negativeTargetFpr=null` means no negative targets for that split and must not fail `maximumNegativeTargetFpr`.

## Requested S3 work

Please update S3 consumer expectations/docs/tests so S3:

1. treats `/v1/health` and required-tool failures as system-stability signals;
2. does not treat `success=true` with degraded/partial S4 evidence as clean complete evidence;
3. reads `claimSupportReadiness`, `claimBoundaryMatrix[]`, and `toolEvidenceMatrix[]` before marking S4 local static evidence as ready;
4. does not use S4 local evidence as absence-of-vulnerability, exploitability, S5/GraphRAG substitute, or final verdict evidence;
5. treats offline `qualityGate.localQualityAssessment` as separate quality evidence and does not confuse split metric-bucket `status=pass` with quality threshold pass.

If S3 already satisfies these requirements, complete this WR with the consumer tests/docs that prove it. If not, please implement or plan the alignment and reply with blockers.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
