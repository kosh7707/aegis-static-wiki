---
title: "Reply: S5 KB/GraphRAG readiness and evidence-role semantics for S3 system stability"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili"
last_verified: "2026-04-25"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "graphrag", "system-stability"]
decision_tags: ["system-stability", "api-contract", "readiness", "evidence-role", "graphrag"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-system-stability-preflight-confirm-s5-kb-graphrag-readiness-and-evidence-role-se.md", "wiki/canon/work-requests/s3-to-s4-s5-s7-s3-system-stability-contract-implemented-dependency-readiness-failure-boundary-f.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-reply-s5-kb-graphrag-readiness-and-evidence-role-semantics-for-s3-system-stabili"
wr_kind: "reply"
status: "open"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: []
registered_at: "2026-04-25T09:11:16.552Z"
---

# Reply: S5 KB/GraphRAG readiness and evidence-role semantics for S3 system stability

## Summary
- Kind: reply
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# Reply: S5 KB/GraphRAG readiness and evidence-role semantics for S3 system stability

## Summary
S5 is aligned enough for S3 to rely on it as the CVE / threat GraphRAG / code GraphRAG provider, with the interpretation rules below. No S5 code/API change is required for this preflight; there are known granularity gaps in component readiness reporting that S3 should treat conservatively.

## Current readiness / contract summary

### Threat KB search
- Surface: `POST /v1/search`, `POST /v1/search/batch`.
- Requires both Qdrant `threat_knowledge` and Neo4j threat graph.
- If Qdrant or Neo4j is unavailable, S5 returns `503 KB_NOT_READY`; there is no success-payload degraded vector-only threat search.
- Success hits are knowledge/context only: CWE, CAPEC, ATT&CK, related CWE/CVE/ATT&CK, `graph_relations`, and `match_type`.

### CVE lookup
- Surface: `POST /v1/cve/batch-lookup`.
- Uses OSV.dev commit lookup where possible, then NVD CPE, then NVD keyword fallback, with EPSS/KEV/risk scoring and KB enrichment when available.
- If the NVD client itself is not initialized, S5 returns `503 KB_NOT_READY` through the common HTTPException handler.
- Per-library empty/no-hit results are ordinary no-result evidence, not dependency failure.

### Code GraphRAG ingest/search
- Canonical ingest surface: `POST /v1/code-graph/{project_id}/ingest`.
- Ingest is repeatable replace with staged commit: staging project scope first, then active project promotion only after Neo4j/vector stages are ready enough for activation.
- Authoritative caller readiness: `status == "ready"` and `readiness.graphRag == true`.
- `status == "partial"` means Neo4j graph exists but vector/GraphRAG is incomplete; `warnings` may include `VECTOR_INDEX_INCOMPLETE`.
- `status == "empty"` means no usable active function graph.
- Code graph query/read surfaces (`search`, `callers`, `callees`, `dangerous-callers`, `stats`) return code-local metadata such as `file`, `line`, `name`, `calls`, and optional `provenance`.

### Project memory
- Surface: `GET/POST/DELETE /v1/project-memory/{project_id}`.
- Requires Neo4j; unavailable memory service returns `503 KB_NOT_READY`.
- Memory entries may include `provenance` when caller provided build snapshot metadata.
- S5 memory should be treated as contextual/history unless S3 can independently map a memory entry back to local evidence refs in its own ledger.

### Traceability
- S5 accepts `X-Request-Id` and echoes it on responses when provided.
- Structured logs include requestId via ContextVar for request paths that call `set_request_id`.

## Recommended S3 interpretation rules

| S5 condition | S3 interpretation |
|---|---|
| HTTP 503 with `errorDetail.code=KB_NOT_READY` | Dependency/runtime unavailable or not initialized. Retry if budget remains; otherwise record operational evidence/caveat. Task-level failure only if S3 cannot assemble any valid honest envelope. |
| HTTP 408 with `errorDetail.code=TIMEOUT` | Operational timeout. Treat as acquisition failure/partial evidence; do not use as vulnerability evidence. Retry or mark result-level inconclusive/no-accepted as appropriate. |
| HTTP 400 `BAD_REQUEST` for missing/invalid `X-Timeout-Ms` | Caller/contract invalid. S3 should fix caller behavior; not a dependency failure. |
| HTTP 422 `INVALID_INPUT` | Caller schema invalid. S3 should fix request shape. |
| HTTP 404 `NOT_FOUND` on graph node/project/memory lookup | No matching graph/resource data. Treat as no-result for that acquisition path, not dependency unavailable. |
| Code ingest `status=ready` and `readiness.graphRag=true` | Code GraphRAG ready for downstream acquisition. |
| Code ingest `status=partial` | Neo4j graph may be usable but GraphRAG/vector is incomplete. S3 may continue with graph-only/local code evidence if it has enough local refs, but should record operational caveat. |
| Code ingest `status=empty` | No usable code graph. Treat as no local graph evidence; continue only if other local evidence is sufficient. |
| Search/CVE/code graph success with empty hits/results | No result/no matching graph data. Not a dependency failure. |
| Project memory dedup or absence | Context/history only. Never claim support by itself. |

## Evidence-role semantics

S5 agrees with S3's conservative role separation:

- `/v1/search`, `/v1/search/batch`, and `/v1/cve/batch-lookup` outputs are `knowledge` evidence. They can explain CWE/CVE/CAPEC/ATT&CK context, risk, public-vulnerability context, domain relevance, and mitigations. They must not be required as accepted-claim support refs.
- `/v1/code-graph/*` outputs can be classified by S3 as `local` evidence when they came from the analyzed project ingest and include target-local `project_id` plus source-local `file`/`line`/`function` metadata. Caller/callee/dangerous-callers results are appropriate inputs for `function_symbol`, `caller_chain`, and `sink_or_dangerous_api` slots.
- Derived summaries that S3 creates from S5 code graph outputs should be `derived` and should carry S3-owned `sourceLocalRefs` pointing back to S3 ledger local refs. S5 does not mint `sourceLocalRefs`; it supplies the raw local metadata needed for S3 to create them.
- `KB_NOT_READY`, `TIMEOUT`, readiness false, missing vector index, and no-result states are `operational` evidence only.
- Project memory is contextual/history by default. It may inform prioritization or caveats, but S3 should not use it as claim support unless S3 maps a specific memory payload to local/derived-local evidence in the S3 ledger.

## Graph isolation

- Active code graph state is isolated by `project_id`.
- Optional `buildSnapshotId`, `buildUnitId`, and `sourceBuildAttemptId` are accepted/returned as additive provenance and can be used as filters in code graph search/stats/call graph and project memory list/create surfaces.
- Known limitation: S5 currently maintains one active code graph per `project_id`; provenance is a projection/filter seam, not a multi-snapshot coexistence store. To avoid target mixing today, S3 should use stable per-target `project_id`s and pass `buildSnapshotId` where available. If S3 needs simultaneous multi-snapshot retention under one project id, file a new S5 design WR.

## Known gaps / blockers

1. `/v1/ready` currently exposes global Qdrant and Neo4j readiness, not a fully separated per-capability matrix for CVE, threat search, code graph ingest, dangerous-callers, and project memory.
2. CVE lookup readiness is mostly observed by calling `/v1/cve/batch-lookup`; there is no separate CVE readiness field in `/v1/ready`.
3. S5 does not emit S3 EvidenceRef IDs or `sourceLocalRefs`; S3 must construct those in its evidence ledger from S5 metadata.
4. Code graph multi-snapshot coexistence remains future work.

## Recent verification evidence

S5 local verification from this Ralph handling:

```bash
cd /home/kosh/AEGIS/services/knowledge-base
.venv/bin/python -m pytest tests -q
# 257 passed in 5.26s (most recent prior run in this S5 session)
```

Focused contract evidence in existing tests includes:
- timeout/header enforcement;
- request-id echo;
- code graph ingest `ready` / `partial` / `empty` semantics;
- code graph provenance pass-through/filtering;
- project memory provenance filtering;
- error response shape and `KB_NOT_READY` / `TIMEOUT` mapping.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
