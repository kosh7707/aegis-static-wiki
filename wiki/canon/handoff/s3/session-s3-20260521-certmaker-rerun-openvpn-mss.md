---
title: "Session history — S3 / s3-20260521-certmaker-rerun-openvpn-mss"
page_type: "canonical-handoff-session"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "/home/kosh/aegis-for-paper/experiments/triage-core-v1/runs/traceaudit-certmaker-rerun-20260521-174803"
  - "requestId:e2e-certmaker-rerun-start-20260521-174803"
  - "caseId:case-bt-0001-certificate-maker-traceaudit-ce2367faad1e"
original_path: "mcp://record_session_history/s3/s3-20260521-certmaker-rerun-openvpn-mss"
last_verified: "2026-05-21"
service_tags: ["s3"]
decision_tags: ["session-history", "hook-policy"]
related_pages: ["wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-zero-byte-pre-first-byte-rca-resolved-as-openvpn-mss-.md", "wiki/canon/handoff/s7/session-s7-20260521-certmaker-openvpn-mss-rca.md"]
migration_status: "canonicalized"
---

# Session history — S3 / s3-20260521-certmaker-rerun-openvpn-mss

## Session
- Lane: S3
- Session ID: s3-20260521-certmaker-rerun-openvpn-mss
- Status: completed
- Started at: 2026-05-21T08:48:03Z
- Updated at: 2026-05-21T09:49:00Z

## Summary
S3 reran the full certificate-maker TraceAudit paper E2E after S7 OpenVPN MSS fix. The run completed successfully with PAPER_EXPORT_READY in 3561.608181s, generated 19 findings/triage rows/transcripts, preserved S7 async stream metadata, and did not reproduce the prior zero-byte pre-first-byte backend_transport_disconnected failure.

## Related pages
- [[wiki/canon/work-requests/s7-to-s3-s7-reply-certificate-maker-zero-byte-pre-first-byte-rca-resolved-as-openvpn-mss-.md]]
- [[wiki/canon/handoff/s7/session-s7-20260521-certmaker-openvpn-mss-rca.md]]

## Test evidence
_No test evidence recorded yet._
