---
title: "S3 consume final S4 consumer-summary hardening contracts after S4 completion audit"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud"
last_verified: "2026-05-18"
service_tags: ["s4", "s3"]
decision_tags: ["api-contract", "consumer-contract", "completion-audit"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s4/session-omx-1778459818640-2qvuzs.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-consume-final-s4-consumer-summary-hardening-contracts-after-s4-completion-aud"
wr_kind: "notice"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-18T01:49:07.490Z","note":"Administrative bulk close on user instruction. Not reviewed in this pass; treated as stale/not used."}]
registered_at: "2026-05-14T08:54:57.201Z"
completed_at: "2026-05-18T01:49:07.490Z"
---

# S3 consume final S4 consumer-summary hardening contracts after S4 completion audit

## Summary
- Kind: notice
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Notice
## Summary

S4 completion-audit gate is green. Please consume the finalized S4 consumer-summary contract semantics below when S3 reads S4 outputs.

## What changed

1. Static Evidence consumer summary
   - `summarySchemaVersion="s4-static-evidence-contract-consumer-summary-v1"` is exact-key locked.
   - `localStaticEvidenceReady=true` requires positive gates plus projected evidence completeness: required local coverage surfaces, claim boundaries/statuses, and current-six tool matrix readiness.
   - Forged ready gates with incomplete projection emit `STATIC_EVIDENCE_CONTRACT_UNSAFE_PROJECTION` and return not ready.
   - Already degraded/non-ready reports do not gain unsafe solely from completeness gaps.
   - CLI smoke gate: `python -m benchmark.static_evidence_consumer_canary --response <path> [--require-local-static-ready]`.

2. Tool Portfolio consumer summary
   - `summarySchemaVersion="s4-tool-portfolio-report-consumer-summary-v1"` is exact-key locked.
   - `toolPortfolioDecisionGradeUsable=true` requires positive system/corpus/local/final/threshold gates plus available diagnostic surfaces, complete current-six tool contribution rows, empty sanitized `reasonCodes`, and empty `requiredFollowUps`.
   - Incomplete otherwise-positive reports emit `TOOL_PORTFOLIO_REPORT_UNSAFE_PROJECTION` and return not usable.
   - `runnerIntegrityOnly=true` is now also fail-closed: sanitized runner-integrity signal must be present and unsafe projection must be absent.
   - Sanitized threshold/reason context remains visible for diagnostics, but S3-facing convenience booleans must not be treated as true when unsafe projection is present.
   - CLI smoke gate: `python -m benchmark.tool_portfolio_report_consumer_canary --report <path> [--require-decision-grade]`.

## S3 action requested

- Treat these consumer summaries as the current S4-owned deterministic contract for S4 evidence consumption.
- Do not infer security verdicts, absence of vulnerability, S5 routing, or final repair decisions from these summaries.
- If S3 needs additional sample payloads or adapter code changes, reply with `accepted-doc-only`, `accepted-no-code-change`, `code-change-needed`, or `blocked` and specify the missing fields/cases.

## Verification evidence

- Full S4 gate: `cd services/sast-runner && PYTHONPATH=. .venv/bin/pytest -q` => `1335 passed in 31.90s`.
- Wiki validator: `cd /home/kosh/aegis-static-wiki && python3 tools/validate_wiki.py` => PASS.
- Critic reviews: PASS for Static Evidence readiness completeness, Tool Portfolio decision-grade completeness, and Tool Portfolio `runnerIntegrityOnly` unsafe-projection fail-closed hardening.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
