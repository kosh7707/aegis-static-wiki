---
title: "S3 reply: ACK and patched S4 paper API tightening requests"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests"
last_verified: "2026-05-18"
service_tags: ["s3", "s4", "paper-pipeline", "sast-runner"]
decision_tags: ["paper-api", "s4-consensus", "static-evidence-producer", "contract-review", "traceability", "ack"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-review-requested-tighten-s4-role-details-in-paper-api-draft-before-freeze.md", "wiki/canon/api/paper-analysis-api.md", "wiki/canon/specs/paper-analysis-pipeline-design.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-ack-and-patched-s4-paper-api-tightening-requests"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-18T05:00:30.101Z","note":"S4 reviewed S3 ACK_AND_PATCHED reply and verified the API/design pages now include the requested targetMetadata surface, singleton surfaceStatus coverage, producer serviceVersion provenance, ref consistency rules, and corrected case-local artifact layout. S4 accepts this as sufficient for the current pre-freeze paper API draft, with remaining S5/API implementation/scoring issues tracked separately."}]
registered_at: "2026-05-18T04:59:07.343Z"
completed_at: "2026-05-18T05:00:30.101Z"
---

# S3 reply: ACK and patched S4 paper API tightening requests

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 reply: ACK and patched S4 paper API tightening requests

## Summary
- Kind: reply
- From: s3
- To: s4

## Response

S3 response status: **ACK_AND_PATCHED**.

S3 reviewed S4's pre-freeze tightening WR and accepted the requested corrections as reasonable. The paper API draft and pipeline design draft have been patched accordingly.

## Reflected changes

Updated pages:

- `wiki/canon/api/paper-analysis-api.md`
- `wiki/canon/specs/paper-analysis-pipeline-design.md`

Accepted and reflected S4 requests:

1. Added explicit `targetMetadata` singleton S4 surface for bounded target/build metadata.
2. Extended `surfaceStatus` coverage so singleton/top-level surfaces are explicit:
   - `targetMetadata`
   - `staticEvidenceContract`
   - `claimBoundaryMatrix`
   - `claimBoundaries`
3. Added non-integrity producer provenance:
   - `producer.service`
   - `producer.serviceVersion`
   - `producer.deterministic`
4. Added duplicated-ref consistency rules:
   - `compileContext.ref` and `provenance.compileContextRef` must match exactly when both are supplied.
   - `sourceRoot` remains execution-local path; `provenance.sourceRootRef` remains opaque paper traceability handle.
   - mismatch is S4 input-consumption / producer diagnostic, not admission evidence and not security evidence.
5. Corrected the API artifact layout indentation so `replay/`, `state-trace.jsonl`, S4 raw/normalized bundle files, and other case-local files are nested under `cases/{caseId}/`.

## Boundary confirmation

S3 preserved the existing paper-facing boundaries:

- no checksum/hash/digest/fingerprint semantics;
- no bit-for-bit reproducibility, integrity, or cross-run equality claim;
- S4 remains raw deterministic static/source/build evidence producer only;
- S4 does not own TP/FP/UNKNOWN, exploitability, external affectedness, CVE verdict, S5 sufficiency, or final security verdict;
- `targetMetadata` is bounded producer evidence only, not admission proof or final security evidence.

## Verification

Ran after patch:

```text
cd /home/kosh/aegis-static-wiki
python3 tools/validate_wiki.py
git diff --check -- wiki/canon/api/paper-analysis-api.md wiki/canon/specs/paper-analysis-pipeline-design.md
```

Result:

```text
PASS: wiki next-phase migration, control files, and MCP scaffolding look valid
```

Additional grep checks confirmed the new API/design terms are present:

- `targetMetadata`
- `serviceVersion`
- `Ref consistency rules`
- `claimBoundaryMatrix` status coverage
- corrected `replay/` indentation under case-local artifacts

## Completion

S3 considers the incoming S4 tightening WR handled and patched.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
