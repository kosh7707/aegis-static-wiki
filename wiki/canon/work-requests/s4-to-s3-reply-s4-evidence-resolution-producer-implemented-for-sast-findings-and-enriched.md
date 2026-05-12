---
title: "Reply: S4 evidence-resolution producer implemented for SAST findings and enriched SCA libraries"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched"
last_verified: "2026-05-11"
service_tags: ["s4", "s3", "s5", "sast-runner", "sca", "evidence-resolution"]
decision_tags: ["s4-evidence-resolution", "sca-library-evidence", "sast-finding-evidence", "no-verdicts", "critic-pass"]
related_pages: ["wiki/canon/work-requests/s3-to-s4-s4-enriched-sca-library-evidence-contract-for-s3-s5-cve-requery.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched"
wr_kind: "reply"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T03:05:24.156Z","note":"S3 reviewed the S4 reply at WR/document level. S4 reports enriched SCA library evidence and SAST finding evidenceResolution implemented with no S5/CVE/security-verdict ownership drift, scan/build-and-analyze parity, versionless/DIFF_NOT_COMPUTED diagnostics, docs updated, and full S4 gate 426 passed. S3 accepts this as sufficient for the S4 producer-side WR closeout; S3 follow-up remains to consume the enriched fields in Phase 1 evidence catalog/S5 adapter logic."}]
registered_at: "2026-05-11T02:19:57.696Z"
completed_at: "2026-05-11T03:05:24.156Z"
---

# Reply: S4 evidence-resolution producer implemented for SAST findings and enriched SCA libraries

## Summary
- Kind: reply
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S4 → S3 reply: evidence-resolution producer implemented

## Summary

S4 implemented the first-pass deterministic evidence-resolution slice as a one-track SAST finding + SCA library producer enhancement.

Hard boundaries preserved:

- no new SAST tools;
- no S5 API changes;
- no S3 code changes;
- no LLM behavior in S4;
- no S4 CVE lookup or security verdict fields.

## Final shape

### SAST findings

`SastFinding.metadata.evidenceResolution` is now the stable additive namespace for finding evidence. It contains:

- `schemaVersion: "s4-evidence-v1"`;
- `kind: "sast-finding"`;
- `toolId`, `ruleId`;
- CWE known/unknown status and source (`metadata.cweId` or `metadata.cwe[0]`);
- location presence (`file`, `line`, `column`, `endLine`, `endColumn`);
- dataflow presence and step count;
- origin status, including preserved `cross-boundary` origin;
- diagnostics such as `CWE_UNKNOWN` and `DATAFLOW_NOT_PROVIDED`.

Existing top-level fields and existing tool metadata remain unchanged.

### SCA libraries

`/v1/scan` `scan.sca.libraries[]` now preserves legacy fields and adds deterministic evidence fields:

- legacy compatibility: `name`, `version`, `path`, `repoUrl`;
- observed identity/version evidence: `source`, `commit`, `branch`, `tag`, `nearestTag`, `versionEvidence`;
- downstream hint/status: `identificationConfidence`, `versionStatus`, `versionConfidence`, `cveLookupEligible`;
- uncertainty/diff semantics: `diagnostics`, `diffAvailable`, `modificationStatus`, `diffSummary`;
- provenance projection: caller provenance plus `libraryPath` when provenance exists.

`/v1/build-and-analyze` top-level `libraries[]` mirrors nested `scan.sca.libraries[]` shape because it already reuses the scan result.

`/v1/libraries` remains the full-detail SCA endpoint and is not changed by this first pass.

## Field rationale / deviations from requested recommendation

- `metadata.evidenceResolution` was chosen to avoid collisions with existing `metadata.cweId`, `metadata.cwe`, and tool-specific metadata keys.
- `cveLookupEligible` is only a deterministic eligibility hint (`name` and `version` present). It is not a CVE result, not `affected`, and not a security verdict.
- `versionEvidence` first pass uses the minimal deterministic subset `{status, source, value}`. Raw source line/file extraction can be added later if S3 needs exact parser-level trace lines.
- `/v1/scan` does not force upstream diff. If diff was not computed, S4 emits `diffAvailable=false`, `modificationStatus="unknown"`, `diffSummary=null`, diagnostic `DIFF_NOT_COMPUTED`.
- versionless known libraries are preserved with `version=null`, `versionStatus="unknown"`, `versionConfidence="none"`, `cveLookupEligible=false`, diagnostic `VERSION_UNKNOWN`.

## Test evidence

TDD evidence:

- RED before implementation: `tests/test_evidence_oracles.py` initially failed with missing evidence module and old SCA projection (`6 failed, 2 passed`).
- Oracle/guard GREEN: `cd services/sast-runner && .venv/bin/pytest tests/test_evidence_oracles.py -q` → `12 passed in 0.06s`.
- Related S4 regression: `tests/test_orchestrator.py tests/test_scan_endpoint.py tests/test_sca_service.py tests/test_library_identifier.py tests/test_evidence_oracles.py -q` → `132 passed in 7.86s`.
- Full S4 gate: `cd services/sast-runner && .venv/bin/pytest -q` → `426 passed in 12.45s`.

Oracle coverage includes:

- known SAST finding evidence;
- unknown CWE/dataflow semantics not represented as safe/clean;
- cross-boundary origin reflection;
- idempotent finding enrichment;
- known CMake library evidence;
- versionless library evidence;
- git commit/branch/repo/tag preservation;
- no S5/CVE dependency static guard;
- recursive no-verdict-key guard;
- `/v1/scan` enriched SCA projection;
- `/v1/build-and-analyze` top-level/nested library parity;
- existing six-tool set guard.

## Docs updated

- `wiki/canon/api/sast-runner-api.md`
- `wiki/canon/specs/sast-runner.md`
- `wiki/canon/handoff/s4/readme.md`

## S3 follow-up edge cases

- Treat `versionStatus="unknown"` or `cveLookupEligible=false` as lookup skip/diagnostic evidence, not as absence of vulnerability.
- Treat `modificationStatus="unknown"` with `DIFF_NOT_COMPUTED` as “S4 did not compute diff here”, not as unmodified.
- Preserve S4 diagnostics into the S3 evidence catalog so Phase 2 can distinguish unavailable evidence from negative evidence.
- If S3 needs exact parser raw/version source lines, send a follow-up WR; first pass intentionally did not expand LibraryIdentifier parsers to capture raw line spans.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
