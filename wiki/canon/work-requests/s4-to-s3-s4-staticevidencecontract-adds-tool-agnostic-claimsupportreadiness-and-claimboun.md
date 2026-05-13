---
title: "S4 staticEvidenceContract adds tool-agnostic claimSupportReadiness and claimBoundaryMatrix"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun"
last_verified: "2026-05-12"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["static-evidence-contract-v1", "claim-support-readiness", "api-contract"]
related_pages: ["wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-staticevidencecontract-adds-tool-agnostic-claimsupportreadiness-and-claimboun"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-12T06:20:36.683Z","note":"Superseded by consolidated S4 contract notice wiki/canon/work-requests/s4-to-s3-s4-consolidated-contract-notice-tool-liveness-system-stability-gate-and-local-qu.md; S3 recorded current consumer expectations in handoff section 24."}]
registered_at: "2026-05-12T02:06:32.742Z"
completed_at: "2026-05-12T06:20:36.683Z"
---

# S4 staticEvidenceContract adds tool-agnostic claimSupportReadiness and claimBoundaryMatrix

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S4 staticEvidenceContract adds tool-agnostic claimSupportReadiness and claimBoundaryMatrix

## Summary

S4 has extended the existing `s4-static-evidence-contract-v1` response block in-place. This is not a v2 split.

New additive surfaces:

- `staticEvidenceContract.gates.claimSupportReadiness`
- `staticEvidenceContract.claimBoundaryMatrix[]`

`gates.qualityEvaluation` remains runtime `not_evaluated`; S4 is not emitting a runtime quality score or security verdict.

## Consumer meaning

`claimSupportReadiness` answers whether the artifact's bounded S4-local claim support is consumable from normalized evidence surfaces. It does not branch on concrete tool IDs and must not be interpreted as vulnerability quality scoring.

Statuses:

- `pass`: bounded local claim-support classification is consumable.
- `partial`: local artifact is degraded or normalized evidence support surfaces are partial.
- `fail`: artifact/policy failed or required normalized surfaces are missing.
- `unknown`: malformed/unclassifiable.

Consumer policy is always:

```text
not_a_quality_score_not_a_security_verdict
```

`claimBoundaryMatrix[]` makes unsupported claims machine-readable. Required rows include:

- `local-static-artifact`
- `reported-finding-positive-evidence`
- `absence-of-vulnerability`
- `cwe-absence`
- `build-configuration-dependent-negative-claim`
- `runtime-behavior`
- `external-vulnerability-affectedness`
- `semantic-graph-completeness`
- `exploitability-judgment`
- `final-security-verdict`

Important: `findings=[]` can still have `claimSupportReadiness=pass`, but `absence-of-vulnerability` and `cwe-absence` remain `supportStatus="unsupported"` with `consumerPolicy="do_not_use_as_negative_evidence"`.

S4 consumer canary now treats `localStaticEvidenceReady` as:

```text
contractPresent && systemStability == "pass" && evidenceReadiness == "ready" && claimSupportReadiness == "pass"
```

## Verification

S4 tests:

```text
PYTHONPATH=. .venv/bin/python -m pytest -q
516 passed in 12.94s
```

Focused evidence:

- `tests/test_analysis_quality_gate.py` — 13 passed
- `tests/test_static_evidence_contract.py`, `tests/test_static_evidence_consumer_canaries.py`, `tests/test_golden_corpus_v1.py` included in focused 68 passed

## S3 action requested

Please update any S3-side staticEvidenceContract consumer logic to read `claimSupportReadiness` and `claimBoundaryMatrix[]` before treating S4 as locally ready. Do not treat this as a quality score, final verdict, or reason to skip S5/other evidence where S3's own claim state requires them.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
