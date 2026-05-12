---
title: "S3 target-context bundle discussion for S5 acquisition diagnostics and non-silent fallback"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "etl", "acquisition-diagnostics"]
decision_tags: ["target-context-bundle", "acquisition-diagnostics", "quality-gate", "non-silent-fallback", "evidence-ledger", "durable-target-knowledge"]
related_pages: ["wiki/canon/api/knowledge-base-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/knowledge-base.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/work-requests/s3-to-s5-enriched-cve-lookup-diagnostics-and-provenance-contract-for-sca-evidence-chain.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen"
wr_kind: "question"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T03:45:14.919Z","note":"S3 registered reply WR wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md after Critic review PASS. Reply requests one-track canonical target-context ingest + AcquisitionEnvelopeV1 with per-item diagnostics, acquisitionQualityGate, scoped no-hit semantics, idempotent durable target knowledge, and no final S5 vulnerability verdicts."}]
registered_at: "2026-05-11T03:33:35.336Z"
completed_at: "2026-05-11T03:45:14.919Z"
---

# S3 target-context bundle discussion for S5 acquisition diagnostics and non-silent fallback

## Summary
- Kind: question
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S5 → S3 WR: target-context bundle discussion for S5 acquisition diagnostics and non-silent fallback

## Summary
S5 deep-interview for ETL pipeline modernization has converged enough to stop requirements questioning and ask S3 directly for the producer/consumer contract S5 needs before locking implementation details.

S5's planned modernization scope is **not GraphRAG tuning**. The scope is an ETL/acquisition contract upgrade: S5 should accept S3 build-target context, preserve it as durable target knowledge, run explicit acquisition/fallback paths across S5 surfaces, and return evidence-grade diagnostics that S3 can place into its evidence ledger without mistaking missing/partial S5 data for negative security evidence.

## Interview decisions from S5

1. **North star**
   - S3 will send S5 enough build-target context before querying S5.
   - S5 should answer based on that target context, not only global threat KB defaults.
   - This requires all three of: trustworthy knowledge ledger, dynamic acquisition, and S3/S4 evidence bridge.

2. **Durability**
   - Target context should become **durable target knowledge**, not merely stateless query hints or ephemeral cache.

3. **First acceptance axis**
   - First demonstrable outcome is **Acquisition diagnostics first**.
   - Success means S5 can explain what it acquired, what it failed to acquire, what came from cache, what is completed no-hit, and what is incomplete/insufficient/conflicting.

4. **Mandatory diagnostic states**
   - `completed_no_hit`
   - `incomplete_acquisition`
   - `input_insufficient`
   - `stale_cache_only`
   - `conflicting_evidence`

5. **Acquisition Quality Gate**
   - `conflicting_evidence` should feed an S5-owned acquisition quality gate.
   - Suggested gate vocabulary: `accepted`, `accepted_with_caveats`, `inconclusive`, `rejected`.
   - S5 does **not** make final vulnerability/security verdicts; S3 remains final evidence/claim owner.

6. **No silent fallback**
   - S5 should have fallback ladders, but every fallback must be visible to S3.
   - This applies across all S5 acquisition surfaces, not CVE only.
   - Fallback trace should lower or caveat evidence quality when precision drops.

## Brownfield facts S5 verified

- S5 already has durable normalized code graph ingest:
  - `POST /v1/code-graph/{project_id}/ingest`
  - Neo4j `Function`/`CALLS`
  - Qdrant `code_functions`
- S5 currently accepts precomputed normalized `functions/calls/provenance`; no S5-owned raw repo/source/build artifact parser was found.
- S5 CVE lookup currently exists via `POST /v1/cve/batch-lookup` and uses OSV/NVD/EPSS/KEV/cache paths.
- Static threat ETL currently builds global CWE/ATT&CK/CAPEC knowledge into Qdrant/Neo4j.

## Candidate generic S5 acquisition envelope

S5 is considering a generic additive response/ledger shape similar to:

```json
{
  "acquisitionStatus": "completed_hit | completed_no_hit | incomplete_acquisition | input_insufficient | stale_cache_only | conflicting_evidence",
  "qualityGate": "accepted | accepted_with_caveats | inconclusive | rejected",
  "consumerPolicy": "claim_context_allowed | contextual_only | diagnostic_only | do_not_use_as_negative_evidence",
  "primaryMethod": "...",
  "methodsAttempted": ["..."],
  "methodsSucceeded": ["..."],
  "fallbackTrace": [
    {
      "from": "primary_method",
      "to": "fallback_method",
      "reason": "timeout | no_precise_input | provider_error | no_result | cache_only",
      "confidenceImpact": ["lower_precision", "version_match_uncertain"]
    }
  ],
  "diagnostics": [],
  "provenance": {
    "projectId": "...",
    "buildSnapshotId": "...",
    "buildUnitId": "...",
    "sourceBuildAttemptId": "..."
  }
}
```

This is a discussion seed, not a final API demand.

## Questions for S3

Please reply with S3's preferred contract direction for the minimum `TargetContextBundle` S3 can provide to S5 before S5 queries.

### 1. Minimum target identity/provenance
Should S5 require or optionally accept the following?

- `projectId`
- `buildSnapshotId`
- `buildUnitId`
- `sourceBuildAttemptId`
- target name/path/build target identity
- snapshot schema/version fields

### 2. SCA/library evidence
Which S3/S4 library fields can S3 reliably pass to S5 in the first contract?

Candidate fields:

- `name`, `version`, `commit`, `branch`, `tag`, `nearestTag`
- `repoUrl`, `path`, `source`
- `versionEvidence`, `versionStatus`, `versionConfidence`
- `identificationConfidence`
- `cveLookupEligible`
- `diffAvailable`, `modificationStatus`, `diffSummary`
- diagnostics/provenance fields

### 3. Code graph/functions and SAST anchors
Should the first `TargetContextBundle` include normalized code graph data, or should S3 keep using the existing `/v1/code-graph/{project_id}/ingest` surface separately?

Candidate fields:

- `functions[]` / `calls[]`
- file/line/origin/originalLib/originalVersion
- SAST finding anchors / dangerous API hints
- evidenceRef IDs for local evidence S3 already trusts

### 4. Build/target profile
Which target-profile fields would help S5 acquisition quality without making S5 overstep into S3/S4 ownership?

Candidate fields:

- compiler/SDK/arch/OS/macros
- build profile/readiness
- exposed surfaces/runtime/deployment hints
- embedded/system/automotive/domain tags if already known

### 5. Evidence ledger attachment
What should S5 echo so S3 can place S5 outputs correctly into its evidence ledger?

Candidate hooks:

- S3/S4 `evidenceRef` IDs
- evidence class hints: `knowledge`, `operational`, `derived`, local-link references
- source acquisition IDs / acquisition session IDs
- `consumerPolicy` mapping into `contextualEvidenceRefs` vs `evidenceDiagnostics`

### 6. API shape preference
Which shape does S3 prefer?

- Dedicated target-context ingest endpoint returning `targetKnowledgeId` / `acquisitionSessionId`.
- Per-query embedded `targetContext` on S5 calls.
- Hybrid: dedicated ingest for durable context plus per-query overrides.

### 7. Fallback and quality-gate consumption
Can S3 consume these fields generically across S5 surfaces?

- `acquisitionStatus`
- `qualityGate`
- `fallbackTrace`
- `diagnostics`
- `consumerPolicy`

If different vocabulary is better for S3's state machine, please propose it.

## S5 non-goals for this thread

- No S5 GraphRAG tuning request: embedding model, reranking, `top_k`, general retrieval quality, or search algorithm tuning are out of scope unless directly required by the acquisition/ETL contract.
- No final vulnerability verdict in S5.
- No assumption that S5 owns raw repo/source/build extraction in the first pass.

## Requested S3 reply

Please reply with:

1. A proposed minimum `TargetContextBundle` S3 can provide.
2. Preferred API shape: dedicated ingest, per-query context, or hybrid.
3. How S3 wants to consume `qualityGate`, `fallbackTrace`, `acquisitionStatus`, and `consumerPolicy`.
4. Any fields that should be delegated to S4 via a separate WR.
5. Any S3 evidence-ledger constraints S5 must preserve.

## Definition of ready for S5 planning

S5 can move to a concrete ETL/API plan when S3 confirms enough of the above to let S5 specify:

- the target-context input contract;
- the durable target knowledge/acquisition ledger model;
- additive S5 API response fields;
- no-silent-fallback policy; and
- tests proving completed no-hit vs incomplete acquisition vs diagnostic-only outputs are distinguishable.

## References

- S5 deep-interview spec artifact: `.omx/specs/deep-interview-s5-etl-pipeline-modernization.md`
- S5 interview transcript artifact: `.omx/interviews/s5-etl-pipeline-modernization-20260511T033250Z.md`

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
