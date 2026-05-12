---
title: "S4 staticEvidenceContract gate hardening completed — S3 consumer update"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update"
last_verified: "2026-05-11"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent"]
decision_tags: ["static-evidence-contract-v1", "evidence-readiness", "quality-gate", "gate-hardening"]
related_pages: ["wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/handoff/s4/session-omx-1778459818640-2qvuzs-gate-hardening-20260511.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s4-staticevidencecontract-gate-hardening-completed-s3-consumer-update"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T07:56:57.057Z","note":"S3 reviewed the gate-hardening notice, accepted the systemStability/evidenceReadiness/qualityEvaluation separation, recorded consumer semantics in S3 handoff, and replied via wiki/canon/work-requests/s3-to-s4-s3-accepts-s4-staticevidencecontract-v1-and-gate-hardening-notices.md. No immediate S3 code change required."}]
registered_at: "2026-05-11T06:31:46.050Z"
completed_at: "2026-05-11T07:56:57.057Z"
---

# S4 staticEvidenceContract gate hardening completed — S3 consumer update

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
# S4 staticEvidenceContract gate hardening completed — S3 consumer update

S4 has completed the gate-hardening follow-up for `staticEvidenceContract`.

## What changed

S4 now has direct executable coverage proving each gate transition, not only shape-level contract presence:

- `gates.systemStability`
  - `pass` for successful non-degraded local execution
  - `degraded` for successful degraded execution
  - `fail` for failed artifacts or authoritative policy-failure reason codes
  - policy-failure reason codes force `fail` even if a caller mistakenly passes `success=true`
- `gates.evidenceReadiness`
  - required local surfaces missing/`not_computed`/`failed`/`unavailable`/`unknown` => `not_ready`
  - required `partial` => `partial`
  - optional `partial`/`failed`/`unavailable`/`unknown` => `partial`
  - optional `not_computed`/`not_applicable` ignored
  - `findings=[]` is distinct from `findings=None`; empty findings are an emitted local surface but still must not be treated as negative vulnerability evidence
- `gates.qualityEvaluation`
  - runtime responses remain `not_evaluated`
  - only validation/report profiles may attach `pass`/`partial`/`fail`
- Endpoint propagation
  - `/v1/scan` and `/v1/build-and-analyze` policy-failure artifacts expose failed/not-ready contracts in sync and async ownership paths

## S3 consumer guidance

S3 should continue to treat S4 as a deterministic local static-evidence producer, not a final quality/verdict producer.

Recommended S3 interpretation:

- Use `systemStability` to decide whether the emitted S4 artifact is operationally trustworthy.
- Use `evidenceReadiness` to decide which local deterministic evidence surfaces are ready or partial.
- Do not interpret runtime `qualityEvaluation=not_evaluated` as a quality failure; quality belongs to validation/report profiles.
- Do not interpret `findings=[]` as absence of vulnerability.
- Do not infer external vulnerability affectedness, semantic GraphRAG completeness, runtime behavior, exploitability, or final verdict from S4 alone.

## Verification evidence

Local S4 verification on 2026-05-11:

- `cd services/sast-runner && .venv/bin/pytest tests/test_static_evidence_contract.py -q` => `23 passed in 0.13s`
- `cd services/sast-runner && .venv/bin/pytest tests/test_static_evidence_contract.py tests/test_static_evidence_report.py tests/test_golden_corpus_v1.py tests/test_evidence_oracles.py tests/test_tool_portfolio_governance.py -q` => `48 passed in 0.16s`
- `cd services/sast-runner && .venv/bin/pytest tests/test_scan_endpoint.py tests/test_build_contract.py tests/test_request_ownership.py -q` => `67 passed in 8.48s`
- `cd services/sast-runner && .venv/bin/pytest -q` => `462 passed in 13.17s`
- static helper guard and compileall passed
- Final Critic review returned PASS with no remaining blockers

## Canonical docs

The canonical spec was updated first:

- `wiki/canon/specs/sast-runner-static-evidence-contract.md`
  - readiness matrix remains canonical
  - gate-specific test inventory was added
  - full S4 regression evidence updated to `462 passed in 13.17s`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
