---
title: "Session history — s3 / session-certificate-maker-smoke-2026-05-20"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/tmp/traceaudit-smoke-certificate-maker-20260520T104115+0900/runner-summary.json"
  - "/tmp/traceaudit-smoke-certificate-maker-20260520T104115+0900/cases/case-bt-0001-certificate-maker-traceaudit-001/state-trace.jsonl"
  - "/tmp/traceaudit-smoke-certificate-maker-filetriage-unique-20260520T104422+0900/runner-summary.json"
  - "/tmp/traceaudit-smoke-certificate-maker-filetriage-unique-20260520T104422+0900/cases/case-bt-0001-certificate-maker-traceaudit-filetriage-unique-001/analysis-envelope.json"
original_path: "mcp://record_session_history/s3/session-certificate-maker-smoke-2026-05-20"
last_verified: "2026-05-20"
service_tags: ["s3"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine", "wiki/canon/api/paper-analysis-api", "wiki/canon/api/sast-runner-paper-static-evidence-api", "wiki/canon/api/s5-paper-context-api"]
migration_status: "canonicalized"
---

# Session history — s3 / session-certificate-maker-smoke-2026-05-20

## Session
- Lane: s3
- Session ID: session-certificate-maker-smoke-2026-05-20
- Status: completed_with_s7_blocker_noted
- Started at: 2026-05-20T10:40:00+09:00
- Updated at: 2026-05-20T10:45:00+09:00

## Summary
Ran live service health checks and a certificate-maker TraceAudit paper smoke. S3/S4/S5 live path was exercised: S3 registered/started the paper case, S4 produced a paper static-evidence bundle with 18 findings, S5 prepared Code KB and returned finding/threat context for all 18 findings in the file-backed triage completion run. Live real-LLM run reached S4 and S5 but failed at S7 because the LLM backend on :18000 was unreachable; a second smoke used file-backed UNKNOWN triage to complete S3/S4/S5 export to PAPER_EXPORT_READY.

## Related pages
- [[wiki/canon/specs/traceaudit-s3-s4-s5-usecases-state-machine]]
- [[wiki/canon/api/paper-analysis-api]]
- [[wiki/canon/api/sast-runner-paper-static-evidence-api]]
- [[wiki/canon/api/s5-paper-context-api]]

## Test evidence

### 2026-05-20T01:45:39.738Z — partial_pass_with_s7_backend_blocker
- Command: `Health checks: GET /v1/health on S7(:8000), S3(:8001), S5(:8002), S4(:9000); paper_runner.py certificate-maker single-case smoke against S3 /v1/paper.`
- Log ref: wiki/canon/handoff/s3/session-certificate-maker-smoke-2026-05-20.md
- S4 health OK: policyStatus=ok, 6 available tools.
- S5 health OK: service aegis-knowledge-base status=ok version=0.2.0.
- S3 health OK: service s3-agent status=ok; paper case create returned 201.
- S7 gateway process OK but not LLM-ready: ready=false, llmReady=false, blockedReason=backend_unreachable, llmBackendStatus=unreachable.
- Live real-LLM paper smoke: runRoot=/tmp/traceaudit-smoke-certificate-maker-20260520T104115+0900; S4_STATIC_EVIDENCE_READY done, S5_CODE_KB_READY done; failed at S7 LLM HTTP 503.
- S3/S4/S5 completion smoke with file-backed UNKNOWN triage: runRoot=/tmp/traceaudit-smoke-certificate-maker-filetriage-unique-20260520T104422+0900; status=PAPER_EXPORT_READY; S4 findingCount=18; S5 findingContextLines=18; S5 genericThreatLines=18; triageEnvelopeLines=18; evidenceLedgerLines=72; exportFileCount=117.
