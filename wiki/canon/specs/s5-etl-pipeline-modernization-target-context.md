---
title: "S5 ETL Pipeline Modernization — Target Context Acquisition Contract"
page_type: "canonical-spec"
canonical: true
source_refs:
  - ".omx/specs/deep-interview-s5-etl-pipeline-modernization.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md"
  - "wiki/canon/work-requests/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen.md"
last_verified: "2026-05-20"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "etl", "acquisition-diagnostics", "target-context"]
decision_tags: ["one-track-contract", "target-context-bundle-v1", "acquisition-envelope-v1", "non-silent-fallback", "acquisition-quality-gate", "durable-target-knowledge", "analyst-brief-v1"]
related_pages:
  - "wiki/canon/api/knowledge-base-api.md"
  - "wiki/canon/api/analysis-agent-api.md"
  - "wiki/canon/specs/knowledge-base.md"
  - "wiki/canon/specs/s5-acquisition-state-machine/readme.md"
  - "wiki/canon/handoff/s5/readme.md"
  - "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md"
  - "wiki/canon/specs/s5-current-implementation-snapshot-20260520.md"
---


# S5 ETL Pipeline Modernization — Target Context Acquisition Contract


## Current-state note — 2026-05-20

This target-context modernization document remains design/history context for S5 acquisition diagnostics. It is not the active paper/e2e entry point. Current S5 implementation state, paper API readiness, freeze-gate status, and observability proof are summarized in [[wiki/canon/specs/s5-current-implementation-snapshot-20260520]].

Do not infer final TP/FP/UNKNOWN or absence evidence from target-context acquisition, Source KG gaps, or S5 paper diagnostics. These remain contextual/operational diagnostics for S3 to consume safely.

## Status

Re-crystallized requirements artifact for S5 planning after S3 reply WR on 2026-05-11.

Implementation note (2026-05-11): S5 now exposes the v1 target-context ingest and target-scoped acquisition surfaces in `services/knowledge-base/app/routers/target_context_api.py`, backed by the durable JSON ledger in `services/knowledge-base/app/target_context_service.py`.

State-machine follow-up (2026-05-11): durable acquisition ledger/storage ownership is now specified in [[wiki/canon/specs/s5-acquisition-state-machine/readme|S5 Acquisition State Machine]]. That design supersedes ad-hoc JSON/transient response ownership for the next persistence implementation pass.

Deadline/status follow-up (2026-05-11): S3 review blockers for deadline honesty and mixed-status semantics were handled in the target-context implementation. Graph projection during target-context ingest is deadline-aware, target-scoped CVE provider timeout/error paths return acquisition envelopes, and aggregate `partial_hit` now requires at least one real `completed_hit`.


Contract-freeze follow-up (2026-05-11): G001 froze machine-readable `knowledge-coverage-v1` and `acquisition-readiness-v1` in `services/knowledge-base/app/contracts/acquisition.py`, exposed by `GET /v1/contracts/acquisition`. Target-context acquisition envelopes now include additive contract metadata and no-hit safety validation so unsafe `completed_no_hit` records are downgraded rather than consumed as negative evidence.


Humanization follow-up (2026-05-11): S5 adds Analyst Brief v1 as a deterministic narrative layer over `AcquisitionEnvelopeV1`. The brief explains what S5 knows, what it does not know, allowed/forbidden S3 uses, next actions, and evidence placement without becoming S5 claim support or a final security verdict.

Local detailed artifact: `.omx/specs/deep-interview-s5-etl-pipeline-modernization.md`.

## Final direction

S5 ETL modernization should use a **one-track canonical S3 target-aware acquisition flow**:

1. S3 sends deterministic Phase-1 target context to S5.
2. S5 persists it as durable target knowledge.
3. S3 target-aware acquisition calls require that target context.
4. S5 returns an acquisition envelope with explicit status, quality gate, consumer policy, per-item diagnostics, and fallback trace.
5. S3 remains the final owner of evidence-class promotion, accepted claims, clean pass, and vulnerability verdicts.

## Non-goals

- No unrelated GraphRAG tuning: embedding model, reranking, `top_k`, generic retrieval-quality work, or search algorithm redesign unless directly required by acquisition/ETL contracts.
- No final vulnerability/security verdicts in S5.
- No S5 direct calls to S4.
- No S5-owned raw repo/source/build extraction in v1; S3/S4 provide normalized deterministic context.
- No silent fallback or global/default answer when target identity is insufficient.

## Canonical flow

### Target context ingest

```http
POST /v1/target-contexts
```

S3 sends `TargetContextBundleV1`; S5 persists it and returns:

- `targetKnowledgeId`
- `targetContextVersion`
- `targetContextIngestId`
- `targetContextInputHash`
- an `AcquisitionEnvelopeV1` for ingest itself

### Target-scoped acquisition surfaces

Preferred S3-facing paths:

```http
POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve
POST /v1/target-contexts/{targetKnowledgeId}/acquire/threat-search
POST /v1/target-contexts/{targetKnowledgeId}/acquire/code-search
POST /v1/target-contexts/{targetKnowledgeId}/acquire/dangerous-callers
```

Existing endpoints may remain for non-S3 compatibility, but S3's canonical target-aware path requires `targetKnowledgeId`.

## TargetContextBundleV1 requirements

S5 should require enough identity to avoid global/default answers:

- `projectId`
- `target.targetId` or deterministic project + target path/name identity
- `provenance.buildSnapshotId` and/or `provenance.buildUnitId`
- `provenance.snapshotSchemaVersion` when available
- `sourceBuildAttemptId` when available, preserved if sent

If identity is insufficient, S5 returns `acquisitionStatus=input_insufficient`.

S3 can provide:

- build profile/readiness: compiler, SDK mode/digest, arch, OS family, endianness, pointer size, domain tags, exposed surfaces;
- enriched SCA libraries: version/commit/repoUrl/path/source/evidence/confidence/diff/diagnostics/provenance;
- bounded SAST anchors: evidenceRef ID, rule/CWE/file/line, S4 evidenceResolution, deterministic sink hints;
- code graph material: normalized functions/calls or transitional existing project ref;
- evidence refs for S3 ledger reattachment.

## AcquisitionEnvelopeV1 requirements

All S3 target-aware acquisition surfaces should return a generic envelope with:

- `schemaVersion="acquisition-envelope-v1"`
- `targetKnowledgeId`, `targetContextVersion`, `acquisitionId`, `surface`
- `acquisitionStatus`
- `acquisitionQualityGate`
- `consumerPolicy`
- `primaryMethod`, `methodsAttempted`, `methodsSucceeded`
- `fallbackTrace`
- `diagnostics`
- explicit `scope`
- provenance
- `sourceEvidenceRefs`, `derivedFromEvidenceRefs`
- `results`
- `itemAcquisitions[]` for mixed batch/per-item outcomes

Required acquisition statuses:

- `completed_hit`
- `completed_no_hit`
- `partial_hit`
- `incomplete_acquisition`
- `input_insufficient`
- `stale_cache_only`
- `conflicting_evidence`
- `timeout`
- `not_ready`
- `error`

Required acquisition quality gates:

- `accepted`
- `accepted_with_caveats`
- `inconclusive`
- `rejected`

Required consumer policy vocabulary:

- `s3_may_derive_local_support_if_refs_validate`
- `contextual_only`
- `scoped_no_hit_record_only`
- `diagnostic_only`
- `do_not_use`
- `do_not_use_as_negative_evidence`

## S3 consumption constraints

- S5 `acquisitionQualityGate` is acquisition-usability only, not S3 final `qualityOutcome`.
- `completed_no_hit` is scoped to the envelope/item scope and never global safety evidence.
- Timeout/not-ready/error/incomplete states are operational diagnostics, never no-hit.
- `input_insufficient` is an input diagnostic, usually S3/S4 adapter issue.
- `stale_cache_only` must be caveated and not negative evidence.
- `conflicting_evidence` is inconclusive and may force S3 caveat/human review.
- `fallbackTrace` must lower/caveat quality when precision drops.
- `do_not_use_as_negative_evidence` dominates all other fields.
- Mixed batch calls must be consumed item-by-item via `itemAcquisitions[]`.

## Durable ingest/versioning requirements

S5 planning must include:

- deterministic normalized `targetContextInputHash`;
- idempotent re-submit for same project/target/build snapshot/hash;
- new `targetContextVersion` for changed input;
- chunked graph/function ingest under one `targetContextIngestId` when needed;
- timestamps: `createdAt`, `updatedAt`, `lastAcquiredAt`, cache/provider timestamps and TTL;
- explicit supersession/version audit semantics.

## Completed no-hit rule

`completed_no_hit` is valid only after S5 completes the required method set for the explicit input/scope. It must not be emitted for truncation, timeout, provider error, stale cache only, partial source failure, missing precision input, or insufficient target identity.

## CVE subset requirements

CVE acquisition is a specialization of `AcquisitionEnvelopeV1`.

- `version_match=true`: affected according to method.
- `version_match=false`: specific range-out.
- `version_match=null`: unknown/undetermined, not safe.
- Add `versionMatchReason` where feasible: `osv_commit_match`, `matched_nvd_cpe_range`, `outside_nvd_cpe_range`, `no_cpe_version_range`, `no_matching_cpe_for_library`, `keyword_only_unverifiable`, `version_parse_failed`.

## Planning acceptance themes

A concrete S5 plan should cover target context ingest, target-scoped acquisition, acquisition envelope schema, per-item diagnostics, no-silent-fallback, scoped no-hit, idempotent durable storage, code graph chunking, and tests for mixed outcomes and S3 consumer-policy mapping.

## G009 target-context retrievalTrace propagation

Target-context `threat-search` and `code-search` acquisition envelopes carry the assembler `retrievalTrace` in `results.retrievalTrace` and in envelope scope diagnostics. `methodsAttempted` and `methodsSucceeded` derive from the trace rather than hard-coded all-success lists. If no-hit depends only on keyword, embedding, or global embedding absence, S5 must set an unsafe no-hit basis so the acquisition readiness guard downgrades the record to `incomplete_acquisition` + `do_not_use_as_negative_evidence`.

`global_embedding_search` is always explicit and low-trust. It may return contextual candidates, but its miss cannot prove absence of a weakness/CVE/code path.

## G010 S3/S4 consumption validation boundary

G010 treats S3/S4 consumption validation as an offline S5-owned validation artifact and handoff contract. The validation report must prove that S5 outputs can be classified by S3 without unsafe evidence semantics:

- `completed_hit` knowledge/context is not TP, accepted claim support, or S3 final verdict.
- `completed_no_hit` is allowed only when scope, required methods, `methodsSucceeded`, provider state, projection state, and `consumerPolicy=scoped_no_hit_record_only` are all safe.
- Keyword-only, embedding-only, stale-cache-only, timeout/error, input-insufficient, missing trace, and projection-debt paths remain diagnostic/non-negative.
- CVE candidate range-out excludes only the scoped candidate CVE and can coexist with other discovery hits.
- Code graph projection debt prevents empty code/caller results from becoming no-caller/no-path evidence.
- Source-family and S3 conditional-pass requirements are audited row-by-row as `implemented`, `fixture_backed`, `manifest_only_deferred`, or `not_applicable`; no silent omissions are acceptable.

This is reporting/contract validation evidence for S3 review, not runtime claim support and not a replacement for S3 final evidence adjudication.

## Analyst Brief v1 boundary

Analyst Brief v1 is the “S5 as a cautious analyst” layer. It is intentionally not a new evidence source. It converts acquisition artifacts into a human-readable consumption guide so S3 can understand:

- what S5 believes it observed;
- which uncertainty remains;
- how the result may be placed in S3's evidence model;
- which inferences are forbidden;
- which inputs, retries, provider refreshes, or projection syncs would improve the answer.

The brief is deterministic and does not call an LLM, external provider, Neo4j, or Qdrant. It must preserve the existing S3/S5 authority boundary:

- S5 may say “contextual knowledge”, “local-support candidate after S3 validates refs”, “scoped acquisition no-hit record”, or “operational diagnostic”.
- S5 must not say “accepted claim”, “clean pass”, “library safe”, “target safe”, “complete project safety”, or “final vulnerability verdict”.
- malformed or insufficient artifacts become `stance=blocked`, not global/default synthesized answers.
- provider/projection/timeout/stale/cache/conflict problems become `stance=diagnostic` or a caveated stance with warnings, not negative evidence.

The canonical API surface is `POST /v1/analyst-brief`; see [[wiki/canon/api/knowledge-base-api|Knowledge Base API 계약서]].

