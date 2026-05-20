---
title: "S4 Static Evidence Contract v1"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "services/sast-runner/app/scanner/static_evidence_contract.py"
  - "services/sast-runner/app/scanner/claim_support_gate.py"
  - "services/sast-runner/app/routers/scan.py"
  - "services/sast-runner/tests/test_static_evidence_contract.py"
  - "services/sast-runner/tests/test_static_evidence_consumer_canaries.py"
  - "services/sast-runner/tests/test_scan_endpoint.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
last_verified: "2026-05-20"
service_tags: ["s4", "sast-runner", "static-evidence", "consumer-contract"]
decision_tags: ["static-evidence-contract-v1", "coverage-contract", "readiness-contract", "claim-boundary", "tool-evidence-matrix"]
related_pages: ["wiki/canon/specs/sast-runner.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-system-quality-gate-separation-v1.md", "wiki/canon/handoff/s4/readme.md"]
---

# S4 Static Evidence Contract v1

Last verified: 2026-05-20
Owner: S4 / SAST Runner
Runtime surfaces: `/v1/scan`, `/v1/build-and-analyze`, and nested inclusion inside `/v1/paper/static-evidence`

`staticEvidenceContract` is the S4-authored machine-readable boundary that tells consumers what S4 local static evidence can and cannot support. It is not a paper-only schema and it is not a quality score. The paper endpoint wraps and mirrors parts of this contract, but the runtime contract remains the canonical S4 static-evidence readiness/claim-boundary block.

## 1. Required shape

Minimum block:

```json
{
  "schemaVersion": "s4-static-evidence-contract-v1",
  "analysisProfile": "c-cpp-core",
  "artifactKind": "s4-static-evidence-artifact",
  "producer": { "service": "s4-sast-runner", "deterministic": true },
  "provenance": {},
  "gates": {
    "systemStability": {},
    "evidenceReadiness": {},
    "claimSupportReadiness": {},
    "qualityEvaluation": {}
  },
  "coverage": {},
  "claimBoundaries": {},
  "claimBoundaryMatrix": [],
  "toolEvidenceMatrix": [],
  "followUpHints": []
}
```

The field is additive. Existing findings, execution, SCA, code graph, metadata, and build payloads remain available.

## 2. Gate separation

The contract deliberately separates four questions:

| Gate | Meaning | Must not be interpreted as |
|---|---|---|
| `systemStability` | Did the local S4 tool/execution path complete reliably enough to emit an artifact? | vulnerability quality, safe code, or TP/FP/UNKNOWN |
| `evidenceReadiness` | Are required local evidence surfaces present enough for bounded S4 consumption? | complete coverage or negative evidence |
| `claimSupportReadiness` | Can the artifact support bounded local-static claims while rejecting unsupported claims? | risk score or final verdict |
| `qualityEvaluation` | Was an offline validation/golden-corpus profile run? | runtime quality unless a named validation profile actually ran |

Default runtime `qualityEvaluation` is:

```json
{
  "status": "not_evaluated",
  "reasonCodes": ["NO_VALIDATION_PROFILE_RAN"],
  "consumerPolicy": "do_not_treat_as_quality_score"
}
```

Only offline validation/report tooling may emit `qualityEvaluation=pass|partial|fail`.

## 3. Coverage vocabulary

Coverage entries use:

```text
provided | partial | not_provided | not_computed | not_applicable | unavailable | failed | unknown
```

`provided` means only “S4 observed and emitted local deterministic evidence”. It never means vulnerability absence. Every non-`provided` status carries stable `reasonCodes[]` and `consumerPolicy`, normally `do_not_use_as_negative_evidence`.

Required local surfaces:

```text
staticToolExecution
sastFindings
findingLocations
findingCweMapping
originClassification
```

Optional/bounded local surfaces:

```text
findingDataflow
structuralCodeGraph
includeGraph
targetMetadata
scaIdentity
scaVersionEvidence
scaDiffEvidence
```

Explicitly out-of-scope S4 surfaces that must be represented as not provided:

```text
externalVulnerabilityKnowledge
semanticGraphRetrieval
runtimeBehavior
exploitabilityJudgment
finalSecurityVerdict
```

## 4. Claim boundaries

`claimBoundaries` and `claimBoundaryMatrix[]` prevent consumers from overreading S4 output.

Minimum doctrine:

```json
{
  "maySupport": [
    "local-static-tool-observations",
    "normalized-cwe-location-dataflow-origin-evidence",
    "structural-callgraph-evidence-when-provided",
    "sca-identity-version-diff-evidence-when-provided"
  ],
  "mustNotSupportAlone": [
    "external-vulnerability-affectedness",
    "semantic-graph-completeness",
    "runtime-exploitability",
    "final-security-verdict",
    "absence-of-vulnerability-from-empty-findings"
  ],
  "negativeEvidencePolicy": "empty-or-missing-s4-evidence-is-not-negative-security-evidence"
}
```

Required claim rows include at least:

```text
local-static-artifact
reported-finding-positive-evidence
absence-of-vulnerability
cwe-absence
build-configuration-dependent-negative-claim
runtime-behavior
external-vulnerability-affectedness
semantic-graph-completeness
exploitability-judgment
final-security-verdict
```

Negative/final/out-of-scope claims stay unsupported even when `findings=[]` and every local tool reports success.

## 5. Tool evidence matrix

`toolEvidenceMatrix[]` has one row for each current-six tool in canonical order:

```text
semgrep
cppcheck
flawfinder
clang-tidy
scan-build
gcc-fanalyzer
```

Each row reports local execution/governance state, not vulnerability truth. Minimum row shape:

```json
{
  "toolId": "semgrep",
  "role": "pattern-taint",
  "uniqueContribution": "fast project-specific pattern and taint evidence",
  "overlap": ["flawfinder dangerous API patterns"],
  "limitations": ["coverage depends on configured rulesets", "local evidence only"],
  "status": "ok",
  "findingsCount": 1,
  "elapsedMs": 10,
  "version": "1.45.0",
  "skipReason": null,
  "degraded": false,
  "degradeReasons": [],
  "consumerPolicy": "local_tool_execution_state_only_not_vulnerability_verdict",
  "evidenceRefs": ["execution.toolResults.semgrep"],
  "deterministic": true,
  "requiresNetwork": false,
  "requiresExternalKnowledge": false,
  "emitsFinalVerdict": false,
  "verdictPolicy": "local-tool-state-is-not-a-vulnerability-verdict"
}
```

Missing, failed, partial, degraded, skipped, or unknown tool states must be explicit and must not be hidden behind an empty findings list.

## 6. Runtime policy

For `/v1/scan`, the required tool set is:

1. `options.tools` if explicitly supplied and valid; otherwise
2. the full current-six portfolio.

Unknown tool ids are caller input errors (`SCAN_TOOL_INVALID`). Required tool unavailable at preflight is `REQUIRED_TOOL_UNAVAILABLE`. Required tool missing/failed/partial/skipped/degraded/invalid after execution is `REQUIRED_TOOL_EXECUTION_INCOMPLETE`.

Runtime policy-failure artifacts expose:

- `gates.systemStability.status="fail"`
- `gates.evidenceReadiness.status="not_ready"`
- `gates.claimSupportReadiness.status="fail"`

This is system stability evidence, not a vulnerability-quality result.

## 7. Consumer canary summary

S4 maintains a consumer-canary helper that proves an S3-facing summary can be derived from `staticEvidenceContract` alone without reading raw runner internals:

```bash
python -m benchmark.static_evidence_consumer_canary --response <path> [--require-local-static-ready]
```

The summary schema is:

```text
s4-static-evidence-contract-consumer-summary-v1
```

`localStaticEvidenceReady=true` requires positive gates **and** complete projection of required coverage surfaces, required claim-boundary statuses, and current-six tool matrix readiness. Pass/ready/pass gates alone are necessary but not sufficient. Malformed projection, duplicate tool/claim rows, spoofed summary-only diagnostics, unsafe enum values, or malformed containers fail closed with `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` and `localStaticEvidenceReady=false`.

## 8. Relationship to paper bundle

The paper bundle includes `staticEvidenceContract` and top-level mirrors:

```text
staticEvidenceContract.claimBoundaryMatrix -> claimBoundaryMatrix
staticEvidenceContract.claimBoundaries     -> claimBoundaries
```

The paper-specific `surfaceStatus`, row traces, file-backed artifacts, and B2/B4 evidence-control checks are defined in `wiki/canon/api/sast-runner-paper-static-evidence-api.md`. They do not replace this runtime contract.

## 9. Verification status

Latest verification for this document refresh:

```bash
cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1395 passed, 1 skipped in 34.93s
```

Relevant focused coverage includes:

- `tests/test_static_evidence_contract.py` — runtime gate transitions and endpoint propagation.
- `tests/test_static_evidence_consumer_canaries.py` — S3-facing projection/fail-closed summary.
- `tests/test_tool_portfolio_system_stability_gate.py` — current-six stability gate fixtures.
- `tests/test_scan_endpoint.py` — sync/async required-tool and request validation behavior.
- `tests/test_paper_static_evidence.py` — paper-bundle wrapping, mirrors, trace, and validation split.

Current state: implemented and live in S4 v0.11.2. Remaining cross-lane work, if any, is S3 consumer/e2e integration, not S4 contract definition.
