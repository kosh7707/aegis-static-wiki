---
title: "Session history — s3 / s3-review-s4-static-evidence-hardening-20260522"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://record_session_history"
original_path: "mcp://record_session_history/s3/s3-review-s4-static-evidence-hardening-20260522"
last_verified: "2026-05-22"
service_tags: ["s3"]
decision_tags: ["session-history", "hook-policy"]
related_pages: []
migration_status: "canonicalized"
---

# Session history — s3 / s3-review-s4-static-evidence-hardening-20260522

## Session
- Lane: s3
- Session ID: s3-review-s4-static-evidence-hardening-20260522
- Status: started
- Started at: 2026-05-22T05:16:09.338Z
- Updated at: 2026-05-22T05:16:09.338Z

## Summary
Session created automatically for test evidence logging.

## Related pages
- None

## Test evidence

### 2026-05-22T05:16:09.382Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && python3 -m py_compile app/scanner/paper_static_evidence.py app/scanner/ast_dumper.py && .venv/bin/pytest tests/test_paper_static_evidence.py::test_live_endpoint_preserves_gcc_fanalyzer_dataflow_and_function_anchor tests/test_paper_static_evidence.py::test_live_endpoint_diagnoses_gcc_fanalyzer_missing_path_details tests/test_paper_static_evidence.py::test_live_endpoint_replays_certificate_maker_style_unknown_gcc_findings tests/test_paper_static_evidence.py::test_live_endpoint_projects_related_clusters_and_local_categories tests/test_ast_dumper.py::TestDumpFunctionsParallel::test_function_rows_preserve_body_end_line_and_calls -q`
- Log ref: local-shell:s3-review-s4-hardening-2026-05-22
- 5 passed in 0.05s
- S3 re-ran the focused S4 acceptance tests from the reply WR.

### 2026-05-22T05:16:16.174Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest tests/test_paper_static_evidence.py tests/test_ast_dumper.py tests/test_static_evidence_contract.py tests/test_static_evidence_consumer_canaries.py tests/test_gcc_analyzer_runner.py tests/test_scanbuild_runner.py tests/test_evidence_oracles.py -q`
- Log ref: local-shell:s3-review-s4-hardening-2026-05-22
- 198 passed, 1 skipped in 2.12s
- S3 re-ran the S4 focused regression suite from the reply WR.

### 2026-05-22T05:16:21.549Z — pass
- Command: `cd /home/kosh/AEGIS/services/sast-runner && .venv/bin/pytest -q`
- Log ref: local-shell:s3-review-s4-hardening-2026-05-22
- 1411 passed, 1 skipped in 36.00s
- S3 re-ran full services/sast-runner test suite after reviewing S4 changes.

### 2026-05-22T05:16:25.347Z — pass
- Command: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py`
- Log ref: local-shell:s3-review-s4-hardening-2026-05-22
- PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
