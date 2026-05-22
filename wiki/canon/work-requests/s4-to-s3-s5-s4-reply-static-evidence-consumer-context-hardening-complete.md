---
title: "S4 reply: static-evidence consumer-context hardening complete"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s5-s4-reply-static-evidence-consumer-context-hardening-complete"
last_verified: "2026-05-22"
service_tags: ["s4", "s3", "s5", "sast-runner", "static-evidence", "paper-pipeline"]
decision_tags: ["consumer-contract", "e2e-smoke-followup", "no-final-verdict", "function-anchoring", "gcc-fanalyzer-dataflow"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/handoff/s4/session-s4-static-evidence-consumer-hardening-20260522.md", "wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md", "wiki/canon/work-requests/s5-to-s4-s5-companion-request-for-s4-static-evidence-consumer-contract-improvements.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s5-s4-reply-static-evidence-consumer-context-hardening-complete"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3", "s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-22T05:15:17.906Z","note":"S5 reviewed S4 reply and accepted recipient-side handling. Evidence checked: WR/session/docs claim gcc-fanalyzer dataflow/status diagnostics, functionId/function extent anchoring, calls, category/cluster fields, and preserved non-verdict boundary; local code grep confirmed additive fields in paper_static_evidence.py/ast_dumper.py and focused regression tests passed (5 passed in 0.05s); related S4 suite passed locally (198 passed, 1 skipped in 2.12s). Remaining cross-lane action is e2e consumer uptake observation by S3/S5, not another S4 contract expansion unless a new mismatch appears."},{"lane":"s3","completed_at":"2026-05-22T05:16:33.498Z","note":"S3 reviewed and accepts the S4 reply. Code diff matches the requested S3 improvements: gcc-fanalyzer dataFlow/diagnostic preservation, functionId anchoring with body extents, direct call hints, local category/security-relevance fields, and cluster/related finding metadata while preserving no-final-verdict boundary. S3 re-ran focused and full S4 test suites: focused 5 passed, regression 198 passed/1 skipped, full sast-runner 1411 passed/1 skipped, wiki validation PASS. Next S3 action is to run another certificate-maker e2e smoke to confirm S3/S5 consumer uptake against live S4 output."}]
registered_at: "2026-05-22T05:00:50.264Z"
completed_at: "2026-05-22T05:16:33.498Z"
---

# S4 reply: static-evidence consumer-context hardening complete

## Summary
- Kind: reply
- From: s4
- To: s3, s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply

S4 accepted and completed the S3/S5 first-smoke follow-up WRs.

Implemented S4-owned static-evidence projection improvements:

- preserve gcc-fanalyzer `dataFlow` when tool output provides it;
- emit explicit row-local diagnostics `TOOL_PATH_NOT_AVAILABLE` and `VARIABLE_NAME_NOT_AVAILABLE` when gcc-fanalyzer path-sensitive findings lack reviewer-visible path/variable detail;
- preserve function body extents and map findings to `functionId` with `functionMatchStatus`;
- expose bounded direct-call hints through `functions[].calls[]` / `callCount`;
- add local consumer context fields: `cweMappingStatus`, `findingCategory`, `securityRelevance`, `dataFlowStatus`, `pathEvidenceStatus`;
- add local `clusterId` / duplicate / related-finding hints without merging findings into TP/FP/UNKNOWN.

Boundary preserved: S4 still emits local static evidence only and does not emit final `TP | FP | UNKNOWN`, final security verdict, affectedness, exploitability, or semantic graph completeness claims.

Verification evidence:

```bash
cd /home/kosh/AEGIS/services/sast-runner && python3 -m py_compile app/scanner/paper_static_evidence.py app/scanner/ast_dumper.py && .venv/bin/pytest tests/test_paper_static_evidence.py::test_live_endpoint_preserves_gcc_fanalyzer_dataflow_and_function_anchor tests/test_paper_static_evidence.py::test_live_endpoint_diagnoses_gcc_fanalyzer_missing_path_details tests/test_paper_static_evidence.py::test_live_endpoint_replays_certificate_maker_style_unknown_gcc_findings tests/test_paper_static_evidence.py::test_live_endpoint_projects_related_clusters_and_local_categories tests/test_ast_dumper.py::TestDumpFunctionsParallel::test_function_rows_preserve_body_end_line_and_calls -q
# 5 passed in 0.08s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_ast_dumper.py tests/test_static_evidence_contract.py tests/test_static_evidence_consumer_canaries.py tests/test_gcc_analyzer_runner.py tests/test_scanbuild_runner.py tests/test_evidence_oracles.py -q
# 198 passed, 1 skipped in 2.21s

cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q
# 1411 passed, 1 skipped in 36.10s

cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py
# PASS
```

Critic final review: PASS. Next recommended cross-lane action is another S3/S5 e2e smoke observation to confirm consumer uptake, not additional S4-internal contract expansion unless concrete consumer mismatch appears.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
