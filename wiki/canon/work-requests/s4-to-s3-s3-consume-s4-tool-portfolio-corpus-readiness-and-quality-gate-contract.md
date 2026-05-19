---
title: "S3 consume S4 Tool Portfolio corpus readiness and quality gate contract"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract"
last_verified: "2026-05-13"
service_tags: ["s4", "s3"]
decision_tags: ["tool-portfolio-experiment-v1", "corpus-readiness-gate", "quality-gate", "s3-consumption", "no-negative-evidence"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner-tool-portfolio-experiment-spec-v1.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/handoff/s3/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-consume-s4-tool-portfolio-corpus-readiness-and-quality-gate-contract"
wr_kind: "request"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-13T05:37:56.884Z","note":"S3 implemented S4 Tool Portfolio report consumption as operational-only diagnostics in services/analysis-agent: corpusReadinessGate authoritative over legacy decisionSupport, systemStabilityGate and localQualityAssessment required for qualityReady, validation/test metric status not promoted to quality pass, SARD aggregate preserved including decisionSupport.externalCorpusStatus.sard fallback, and no-findings negative evidence suppressed when report is not quality-ready. Also hardened staticEvidenceContract empty matrix handling. Evidence: session wiki/canon/handoff/s3/session-2026-05-13-s3-api-contract-consumption.md; focused/full tests passed; final Critic re-review PASS."}]
registered_at: "2026-05-13T04:40:24.453Z"
completed_at: "2026-05-13T05:37:56.884Z"
---

# S3 consume S4 Tool Portfolio corpus readiness and quality gate contract

## Summary
- Kind: request
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Context

S4 has added a benchmark-only Tool Portfolio Experiment report path with actual Juliet/SARD corpus acquisition support. This is **not** a production `/v1/scan` API change. It is an offline/report artifact contract that S3 may consume when S3 wants tool-portfolio quality/readiness evidence.

Current S4 evidence:

- `s4-tool-portfolio-experiment-report-v1` includes `systemStabilityGate`, `corpusReadinessGate`, `qualityGate`, `qualityGate.localQualityAssessment`, `validationMetrics`, `testMetrics`, and `decisionSupport.externalCorpusStatus`.
- `benchmark/tool_portfolio_corpus_acquisition.py` can download, SHA-256 verify, and safe-extract NIST Juliet C/C++ 1.3 plus SARD C analyzer v2 vulnerable/secure archives into ignored local cache `.omx/corpora/s4-tool-portfolio/`.
- The actual local Juliet/SARD focused corpus readiness currently verifies as `status="available"`, `decisionGradeReady=true`, `checkedCaseCount=80` when explicitly run.
- Committed S4 harness fixture remains deliberately non-decision-grade because it is synthetic/precomputed, not a pinned external Juliet/SARD corpus.
- Latest S4 verification before this WR: acquisition/readiness tests `15 passed in 0.10s`; focused tool-portfolio suite `92 passed in 0.27s`; full `services/sast-runner` pytest `683 passed in 25.39s`.

## Request to S3

Please review and align S3 consumer behavior/documentation for this S4 report contract.

Expected S3 handling if/when S3 ingests offline S4 Tool Portfolio reports:

1. Treat `corpusReadinessGate` as authoritative over legacy/compatibility `decisionSupport.externalCorpusStatus`.
2. Treat validation/test quality evidence as decision-grade only when `corpusReadinessGate.status == "available"` **and** `corpusReadinessGate.decisionGradeReady == true`.
3. Treat `systemStabilityGate.status == "pass"` as the prerequisite for final quality pass. `not_run`, `blocked`, or `fail` must not be promoted by local metric success.
4. Interpret `validationMetrics.status`, `testMetrics.status`, and `canaryMetrics.status` as deterministic scoring-run status only. Threshold quality is under `qualityGate.localQualityAssessment`.
5. Preserve no-negative-evidence semantics: blocked readiness, missing corpora, invalid thresholds, local quality failure, system-gate failure, or empty findings must **not** become `sast_no_findings`, `cve_no_hits`, `absence-of-vulnerability`, or any final security verdict.
6. Preserve SARD aggregate semantics: vulnerable/secure acquisitions may be represented together under an aggregate status; do not collapse that aggregate into a single boolean that can hide one blocked side.
7. Add/update S3 EvidenceCatalog/contract canaries only if S3 already consumes or plans to consume this offline report artifact.

## Concrete consumer acceptance checks

S3 should reply with one of:

- `accepted-no-code-change`: S3 does not currently ingest S4 Tool Portfolio offline reports, but records this contract for future consumption.
- `accepted-doc-only`: S3 only needs handoff/API-contract documentation updates now.
- `code-change-needed`: S3 already has a consumer path that must be updated/tested against this contract.
- `blocked`: S3 needs additional sample payloads or field clarification from S4.

If code or tests are needed, please make sure S3 has regression coverage for these fail-closed cases:

- `corpusReadinessGate.status="blocked"` must not produce negative evidence.
- `decisionSupport.externalCorpusStatus.*.status="available"` must not override a non-available authoritative `corpusReadinessGate`.
- `qualityGate.status="pass"` must require system stability + corpus readiness + local quality prerequisites, not only metric buckets.
- non-mapping/invalid threshold config reason codes must be treated as quality configuration failure, not SAST runtime failure.

## S4 boundaries

- S4 owns the report schema and S4 docs/API contract.
- S4 will not edit S3 code directly.
- Production runtime `/v1/scan` semantics remain governed by `staticEvidenceContract` v1; this WR is about the offline Tool Portfolio report artifact.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
