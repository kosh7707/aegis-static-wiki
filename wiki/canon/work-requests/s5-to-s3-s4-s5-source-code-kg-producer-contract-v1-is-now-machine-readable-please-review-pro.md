---
title: "S5 Source Code KG producer contract v1 is now machine-readable; please review producer adoption"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro"
last_verified: "2026-05-18"
service_tags: ["s5", "s3", "s4", "knowledge-base", "source-code-kg", "producer-contract"]
decision_tags: ["source-code-kg-contract-v1", "s5-api-authority", "s3-s4-producer-alignment", "rich-analysis-ir"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s5-graphrag-source-code-boundary.md", "wiki/canon/handoff/s5/session-2026-05-13-s5-source-code-kg-contract-v1.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s4-s5-source-code-kg-producer-contract-v1-is-now-machine-readable-please-review-pro"
wr_kind: "request"
status: "completed"
from_lane: "s5"
to_lanes: ["s3", "s4"]
completed_by: [{"lane":"s3","completed_at":"2026-05-13T05:38:07.114Z","note":"S3 implemented Source Code KG producer contract consumption in services/analysis-agent: fetches and validates GET /v1/contracts/source-code-kg before POST, gates POST on repositorySnapshot.commitHash, validates version/path, sends X-Timeout-Ms, emits explicit graphNodes/graphEdges/evidenceSnippets/richIrArtifacts/sourceArtifacts families, records coverageComplete and reasonCodes for missing optional producer coverage, covers build-and-analyze and individual-tool Phase 1 paths, and keeps Source KG status operational-only (not verdict/affectedness proof). Duplicate function occurrence edge-source bug found by Critic was fixed and regression-tested. Evidence: session wiki/canon/handoff/s3/session-2026-05-13-s3-api-contract-consumption.md; full S3 suite 664 passed; compileall passed; final Critic re-review PASS."},{"lane":"s4","completed_at":"2026-05-18T01:49:07.672Z","note":"Administrative bulk close on user instruction. Not reviewed by S4 in this pass; treated as stale/not used."}]
registered_at: "2026-05-13T02:16:01.671Z"
completed_at: "2026-05-18T01:49:07.672Z"
---

# S5 Source Code KG producer contract v1 is now machine-readable; please review producer adoption

## Summary
- Kind: request
- From: s5
- To: s3, s4

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Request

S5 has implemented a machine-readable Source Code KG producer contract endpoint:

```http
GET /v1/contracts/source-code-kg
```

The contract freezes the producer-facing shape for `POST /v1/source-code-kg/ingest` and includes:

- endpoint identity and request/result schema versions;
- producer requirements for `repositorySnapshot`, `buildContext`, `analysisArtifactSet`, `graphNodes`, `graphEdges`, `evidenceSnippets`, `richIrArtifacts`, and `sourceArtifacts`;
- JSON Schema generated from the S5 Pydantic request/result models;
- ownership guardrails: S5 owns durable Source Code KG storage; S3/S4 are producers of source/build facts; Neo4j/Qdrant are not source-of-truth; routine answers expose snippets/hashes/line ranges/artifact ids rather than full repositories.

## Why this is being sent now

This follows the previous S5 interview decision that S5 should define the Source Code KG producer API contract directly instead of under-specifying around existing S3/S4 outputs.

## Requested review

Please review whether S3/S4 can produce or map their current artifacts into this contract, especially:

1. `repositorySnapshot.commitHash` and repository/source artifact references;
2. build target/build context and compile-command/build metadata fields;
3. graph nodes/edges with stable IDs;
4. evidence snippets with source-local provenance;
5. rich IR artifacts such as AST/CFG/PDG/taint/symbol/macro/compile-command payloads or references.

## S5 evidence

- Code: `services/knowledge-base/app/contracts/source_kg.py`
- Endpoint: `services/knowledge-base/app/routers/contracts_api.py`
- Tests: `services/knowledge-base/tests/test_source_code_kg_contract_v1.py`
- Verification: focused S5 contract/source KG/acquisition tests `17 passed`; full S5 suite `472 passed`; wiki validator passed.

## Consumer policy

This WR is a producer-contract review request. It is not a final vulnerability verdict, not claim support, and not a request to treat Source Code KG retrieval as affectedness proof.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
