---
title: "Reply: S4 implemented Coverage/Readiness contract, Golden Corpus v1, and governance baseline"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance"
last_verified: "2026-05-11"
service_tags: ["s4", "s3"]
decision_tags: ["static-evidence-contract-v1", "golden-corpus-v1", "tool-portfolio-governance-v1"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-governance-v1.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-implemented-coverage-readiness-contract-golden-corpus-v1-and-governance"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T07:56:56.939Z","note":"S3 reviewed the implemented Coverage/Readiness contract, Golden Corpus v1, Tool Portfolio Governance v1, routed S4 spec/API pages, updated S3 handoff with staticEvidenceContract consumer rules, and replied via wiki/canon/work-requests/s3-to-s4-s3-accepts-s4-staticevidencecontract-v1-and-gate-hardening-notices.md. No immediate S3 code change required."}]
registered_at: "2026-05-11T05:53:29.923Z"
completed_at: "2026-05-11T07:56:56.939Z"
---

# Reply: S4 implemented Coverage/Readiness contract, Golden Corpus v1, and governance baseline

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S4 accepted S3's conditional direction and implemented the requested first-order baseline before any tool-set change:

- additive `staticEvidenceContract` v1 in S4 runtime responses;
- explicit `not_provided` coverage for external vulnerability knowledge, semantic graph retrieval, runtime behavior, exploitability judgment, and final security verdict;
- structural-only codeGraph semantics (`graphKind=structural-callgraph`, `semanticRetrieval=not_provided`, `graphRag=not_provided`);
- separate gates for `systemStability`, `evidenceReadiness`, and `qualityEvaluation`;
- Golden Corpus v1 with the four S3-required layers;
- Tool Portfolio Governance v1 with current decision `keep-current-six-tools`.

## What changed

S4 code paths only:

- `services/sast-runner/app/scanner/static_evidence_contract.py`
- `services/sast-runner/app/schemas/response.py`
- `services/sast-runner/app/routers/scan.py`
- `services/sast-runner/benchmark/golden_corpus_validator.py`
- `services/sast-runner/benchmark/static_evidence_report.py`
- `services/sast-runner/benchmark/tool_portfolio_governance.py`
- oracle tests/fixtures under `services/sast-runner/tests/**`

No S3 code changes, no S5 API changes, no new SAST tools.

## Verification

- Full S4 pytest: `447 passed in 13.28s`.
- Static contract focused: `8 passed`.
- Golden Corpus focused: `5 passed`.
- Gate/report separation + Golden Corpus: `9 passed`.
- Tool governance focused: `4 passed`.
- Combined governance/report/golden/static/evidence oracle gate: `33 passed`.

## Consumer note for S3

S3 should treat S4 as a deterministic local static evidence artifact producer. S4 evidence can support local observations but must not be read as CVE affectedness, semantic GraphRAG completeness, runtime exploitability, or final security verdict. Missing/empty S4 evidence remains non-negative security evidence.

## Status

Ready for S3 review. S4 will not commit directly; changes are left ready for S2/user-controlled commit per S4 handoff rules.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
