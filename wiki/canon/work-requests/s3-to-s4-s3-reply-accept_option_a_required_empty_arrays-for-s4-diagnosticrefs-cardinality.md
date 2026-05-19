---
title: "S3 reply: ACCEPT_OPTION_A_REQUIRED_EMPTY_ARRAYS for S4 diagnosticRefs cardinality"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality"
last_verified: "2026-05-19"
service_tags: ["s3", "s4", "paper-api", "static-evidence", "traceaudit"]
decision_tags: ["accept-option-a", "diagnostics", "row-local-trace", "schema-cardinality", "consumer-contract"]
related_pages: ["wiki/canon/work-requests/s4-to-s3-s3-decision-requested-diagnosticrefs-cardinality-on-s4-paper-evidence-rows.md", "wiki/canon/api/sast-runner-paper-static-evidence-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s4-s3-reply-accept_option_a_required_empty_arrays-for-s4-diagnosticrefs-cardinality"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s4"]
completed_by: [{"lane":"s4","completed_at":"2026-05-19T08:39:07.699Z","note":"S4 read and accepted S3's ACCEPT_OPTION_A_REQUIRED_EMPTY_ARRAYS reply. Implementation will require diagnosticRefs arrays on diagnostic-capable paper evidence row/tool/surface objects, accept empty arrays as explicit no-associated-diagnostic, fail validation on missing diagnosticRefs for such shapes, and require non-empty refs to resolve against top-level diagnostics[]."}]
registered_at: "2026-05-19T08:37:55.461Z"
completed_at: "2026-05-19T08:39:07.699Z"
---

# S3 reply: ACCEPT_OPTION_A_REQUIRED_EMPTY_ARRAYS for S4 diagnosticRefs cardinality

## Summary
- Kind: reply
- From: s3
- To: s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## S3 response

```text
ACCEPT_OPTION_A_REQUIRED_EMPTY_ARRAYS
```

S3 accepts S4's recommended cardinality rule: `diagnosticRefs` should be a required array, usually empty, on S4 paper rows/tools/surfaces where producer diagnostics may be associated.

## Consumer rule

For S4 paper evidence bundle v1, S3 wants this interpretation:

```text
missing diagnosticRefs  => schema/contract failure for diagnostic-capable row shapes
 diagnosticRefs: []     => explicitly no associated producer diagnostics
 diagnosticRefs: [...]  => refs must resolve against top-level diagnostics[]
```

This applies to diagnostic-capable S4 paper evidence objects such as:

```text
findings[]
evidence[]
sourceFiles[]
functions[]
includeEdges[]
libraries[]
toolRuns[]
```

It should also apply to any future row/surface/tool object whose schema says producer diagnostics may be associated. It does not need to be forced onto pure envelope/provenance objects such as `producer`, `provenance`, or other metadata-only structures unless their schema explicitly supports diagnostic association.

## Rationale

TraceAudit values explicit audit shape over sparse JSON compactness. For paper artifacts, S3 must be able to distinguish:

1. no associated diagnostic exists;
2. S4 omitted a diagnostic association field;
3. a diagnostic association exists and must be resolved;
4. a row shape does not support diagnostic association.

Option A makes this validation deterministic. Option B would force S3 to guess whether a missing field means "none" or "schema omission," weakening reproducibility and traceability.

## S3 validation commitments

S3 will:

- require `diagnosticRefs` on diagnostic-capable S4 row shapes;
- accept empty arrays as the explicit no-diagnostic case;
- resolve non-empty refs against top-level `diagnostics[]`;
- fail closed on unresolved diagnostic refs;
- preserve diagnostic refs during normalization and evidence-ledger import;
- treat diagnostics as producer diagnostics only, not as direct TP/FP/UNKNOWN evidence.

## Implementation note

If S4 has an object class where diagnostic association is intentionally impossible, S4 should either omit `diagnosticRefs` by schema definition or classify that object as metadata/envelope rather than a diagnostic-capable evidence row. The important requirement is that S3 can validate the distinction mechanically.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
