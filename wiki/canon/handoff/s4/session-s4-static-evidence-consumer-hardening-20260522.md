---
title: "Session history — s4 / s4-static-evidence-consumer-hardening-20260522"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/sast-runner/app/scanner/paper_static_evidence.py"
  - "services/sast-runner/app/scanner/ast_dumper.py"
  - "services/sast-runner/tests/test_paper_static_evidence.py"
  - "services/sast-runner/tests/test_ast_dumper.py"
original_path: "mcp://record_session_history/s4/s4-static-evidence-consumer-hardening-20260522"
last_verified: "2026-05-22"
service_tags: ["s4"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/api/sast-runner-paper-static-evidence-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md", "wiki/canon/work-requests/s5-to-s4-s5-companion-request-for-s4-static-evidence-consumer-contract-improvements.md"]
migration_status: "canonicalized"
---

# Session history — s4 / s4-static-evidence-consumer-hardening-20260522

## Session
- Lane: s4
- Session ID: s4-static-evidence-consumer-hardening-20260522
- Status: verified
- Started at: 2026-05-22
- Updated at: 2026-05-22

## Summary
Handled S3/S5 WRs from the first e2e smoke review by improving S4 paper static-evidence projection: gcc-fanalyzer dataflow preservation, explicit missing-path/unknown-variable diagnostics, function extent anchoring/functionId, direct calls, and bounded local category/cluster hints without verdict semantics.

## Related pages
- [[wiki/canon/api/sast-runner-paper-static-evidence-api.md]]
- [[wiki/canon/specs/sast-runner-static-evidence-contract.md]]
- [[wiki/canon/handoff/s4/readme.md]]
- [[wiki/canon/work-requests/s3-to-s4-s4-implement-static-evidence-improvements-from-certificate-maker-smoke-review.md]]
- [[wiki/canon/work-requests/s5-to-s4-s5-companion-request-for-s4-static-evidence-consumer-contract-improvements.md]]

## Test evidence

### 2026-05-22T04:56:50.528Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && python3 -m py_compile app/scanner/paper_static_evidence.py app/scanner/ast_dumper.py && .venv/bin/pytest tests/test_paper_static_evidence.py::test_live_endpoint_preserves_gcc_fanalyzer_dataflow_and_function_anchor tests/test_paper_static_evidence.py::test_live_endpoint_diagnoses_gcc_fanalyzer_missing_path_details tests/test_paper_static_evidence.py::test_live_endpoint_replays_certificate_maker_style_unknown_gcc_findings tests/test_paper_static_evidence.py::test_live_endpoint_projects_related_clusters_and_local_categories tests/test_ast_dumper.py::TestDumpFunctionsParallel::test_function_rows_preserve_body_end_line_and_calls -q`
- Log ref: local shell output
- 5 passed in 0.08s

### 2026-05-22T04:56:50.644Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_ast_dumper.py tests/test_static_evidence_contract.py tests/test_static_evidence_consumer_canaries.py tests/test_gcc_analyzer_runner.py tests/test_scanbuild_runner.py tests/test_evidence_oracles.py -q`
- Log ref: local shell output
- 198 passed, 1 skipped in 2.21s

### 2026-05-22T04:56:50.748Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q`
- Log ref: local shell output
- 1411 passed, 1 skipped in 36.10s

### 2026-05-22T04:56:50.852Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local shell output
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
