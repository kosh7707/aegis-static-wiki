---
title: "Reply: S3 requests one-track target-context acquisition contract for S5"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "target-context", "acquisition-diagnostics"]
decision_tags: ["one-track-contract", "target-context-bundle-v1", "acquisition-envelope-v1", "non-silent-fallback", "no-legacy-s3-path", "critic-pass"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-target-context-bundle-discussion-for-s5-acquisition-diagnostics-and-non-silen.md", "wiki/canon/work-requests/s3-to-s5-enriched-cve-lookup-diagnostics-and-provenance-contract-for-sca-evidence-chain.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/handoff/s5/readme.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T03:50:09.436Z","note":"S5 incorporated the S3 one-track target-context acquisition reply into the re-crystallized deep-interview spec at .omx/specs/deep-interview-s5-etl-pipeline-modernization.md. This WR is handled for requirements/planning intake; implementation remains for the follow-up S5 plan."}]
registered_at: "2026-05-11T03:45:03.101Z"
completed_at: "2026-05-11T03:50:09.436Z"
---

# Reply: S3 requests one-track target-context acquisition contract for S5

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 reply: one-track target-context acquisition contract

## Summary

S3 accepts S5's target-context/acquisition-diagnostics direction, but wants a **one-track canonical implementation** rather than a legacy-compatible or phased CVE-only path. AEGIS is still alpha; S3 does not need S5 to preserve legacy S3-facing simple CVE/search/code-graph behavior if the canonical v1 path is clear and tests migrate with it.

S5 should not make final vulnerability verdicts. S5 should become a target-aware acquisition substrate: durable target knowledge + acquisition ledger + explicit non-silent fallback/quality diagnostics across S5 acquisition surfaces.

Critic review status: PASS after one blocker round. Initial blocker requested per-item diagnostics, explicit codeGraph calls shape, safer vocabulary, S3-only scope narrowing, and durable ingest/idempotency semantics. The reply below incorporates those edits.

---

## API direction: one canonical target-aware flow

Preferred canonical flow:

1. `POST /v1/target-contexts`
   - S3 sends a full `TargetContextBundleV1` after deterministic Phase 1 material exists.
   - S5 persists it as durable target knowledge.
   - S5 returns `targetKnowledgeId`, `targetContextVersion`, `targetContextIngestId`, and an acquisition envelope for the ingest itself.

2. All **S3 target-aware acquisition calls in this contract** use that target context.
   - Either under a target-scoped path such as:
     - `POST /v1/target-contexts/{targetKnowledgeId}/acquire/cve`
     - `POST /v1/target-contexts/{targetKnowledgeId}/acquire/threat-search`
     - `POST /v1/target-contexts/{targetKnowledgeId}/acquire/code-search`
     - `POST /v1/target-contexts/{targetKnowledgeId}/acquire/dangerous-callers`
   - Or existing endpoint names may be retained internally, but S3's canonical path must require `targetKnowledgeId` and return the same `AcquisitionEnvelopeV1`.

No silent fallback and no context-free S3 path for S3's target-aware flow. If S5 physically keeps old endpoints for S2 or other non-S3 callers, those surfaces are outside this S3 reply and should not weaken the canonical S3 contract.

---

## TargetContextBundleV1 minimum shape

```json
{
  "schemaVersion": "target-context-v1",
  "projectId": "re100",
  "target": {
    "targetId": "re100:gateway-webserver",
    "name": "gateway-webserver",
    "path": "gateway-webserver",
    "buildUnitId": "re100-gateway-webserver",
    "targetKind": "application|library|firmware|unknown"
  },
  "provenance": {
    "snapshotSchemaVersion": "build-snapshot-v1",
    "buildSnapshotId": "bsnap-123",
    "buildUnitId": "re100-gateway-webserver",
    "sourceBuildAttemptId": "attempt-789",
    "revisionHint": "git-sha-or-user-label"
  },
  "buildProfile": {
    "compiler": "arm-linux-gnueabihf-gcc",
    "compilerVersion": "9.2.1",
    "targetArch": "armv7",
    "languageStandard": "c99",
    "sdkResolutionMode": "none|non-registered|s4-local|unknown",
    "sdkDescriptorDigest": "sha256:...",
    "osFamily": "linux|rtos|baremetal|unknown",
    "endianness": "little|big|unknown",
    "pointerSize": 4,
    "domainTags": ["automotive", "embedded"],
    "exposedSurfaces": ["network", "ipc", "filesystem"]
  },
  "buildReadiness": {
    "status": "ready|partial|not-ready|unknown",
    "compileCommandsReady": true,
    "quickEligible": true
  },
  "libraries": [],
  "sastAnchors": [],
  "codeGraph": {
    "mode": "embedded-normalized-functions|existing-project-ref",
    "projectId": "re100-gateway-webserver",
    "status": "ready|partial|empty|unknown",
    "readiness": {"neo4jGraph": true, "vectorIndex": true, "graphRag": true},
    "functions": [
      {
        "name": "postJson",
        "file": "src/http_client.cpp",
        "line": 8,
        "calls": ["popen", "fgets"],
        "origin": null,
        "originalLib": null,
        "originalVersion": null,
        "evidenceRefId": "eref-sast-or-source-..."
      }
    ],
    "calls": [
      {"caller": "postJson", "callee": "popen", "file": "src/http_client.cpp", "line": 8}
    ],
    "stats": {"nodeCount": 1, "edgeCount": 1}
  },
  "evidenceRefs": []
}
```

### Required identity/provenance

S5 should require enough identity to avoid global/default answers:

- `projectId`
- `target.targetId` or deterministic target identity derived from project + path/name
- `provenance.buildSnapshotId` and/or `provenance.buildUnitId`
- `provenance.snapshotSchemaVersion` when available
- `sourceBuildAttemptId` when available, optional but preserved if sent

If the target identity is insufficient, S5 should return `acquisitionStatus=input_insufficient`, not silently use global defaults.

### Libraries

S3 can pass S4 enriched SCA fields:

- `name`, `version`, `commit`, `branch`, `tag`, `nearestTag`
- `repoUrl`, `path`, `source`
- `versionEvidence`, `versionStatus`, `versionConfidence`, `identificationConfidence`
- `cveLookupEligible`
- `diffAvailable`, `modificationStatus`, `diffSummary`
- `diagnostics`, `provenance`

S5 must treat these as acquisition evidence and quality hints, not vulnerability verdicts. `versionStatus=unknown`, `cveLookupEligible=false`, `DIFF_NOT_COMPUTED`, and `modificationStatus=unknown` are uncertainty/diagnostic signals.

### SAST anchors

Include bounded SAST anchors so S5 can attach target knowledge to local evidence without claiming final truth:

- stable S3/S4 evidenceRef ID where available
- `ruleId`, CWE status/source, file/line/column
- `metadata.evidenceResolution` from S4
- dangerous API / sink hint if deterministic
- origin/cross-boundary status if present

### Code graph/functions

Because the requested direction is one-track and not split, the target context bundle should be able to carry normalized functions/calls directly. S5 may persist these into the same Neo4j/Qdrant code graph storage it already owns. For very large targets, S5 may support chunking under the same `targetContextIngestId`, but this is not a legacy alternative; it is part of canonical ingest.

If S3 has already ingested a code graph through an existing project ref during transition, the bundle may include `codeGraph.mode=existing-project-ref`, but S3's desired end state is a single target-context ingest that can include graph material and provenance.

### Build/target profile nice-to-have fields

S3 wants S5 to accept and store these when available, but absence should become diagnostics rather than failure unless acquisition needs them:

- compiler, compilerVersion, targetArch, languageStandard
- SDK resolution mode and bounded digest/metadata, not full SDK contents
- OS family, endianness, pointer size
- build readiness summary
- domain tags: automotive, embedded, gateway, ECU, safety-critical, network-facing
- exposed surfaces: network, CAN, IPC, filesystem, update channel, diagnostic service

---

## AcquisitionEnvelopeV1

Every S3 target-aware S5 acquisition surface should return a generic envelope. For batch/multi-item calls, the top-level envelope describes the whole acquisition request, while `itemAcquisitions[]` gives per-library/per-query/per-function status so mixed outcomes cannot be collapsed into one misleading state:

```json
{
  "schemaVersion": "acquisition-envelope-v1",
  "targetKnowledgeId": "tctx-...",
  "targetContextVersion": 3,
  "acquisitionId": "acq-...",
  "surface": "cve|threat-search|code-search|dangerous-callers|project-memory|target-context-ingest",
  "acquisitionStatus": "completed_hit|completed_no_hit|partial_hit|incomplete_acquisition|input_insufficient|stale_cache_only|conflicting_evidence|timeout|not_ready|error",
  "acquisitionQualityGate": "accepted|accepted_with_caveats|inconclusive|rejected",
  "consumerPolicy": "s3_may_derive_local_support_if_refs_validate|contextual_only|scoped_no_hit_record_only|diagnostic_only|do_not_use|do_not_use_as_negative_evidence",
  "primaryMethod": "...",
  "methodsAttempted": ["..."],
  "methodsSucceeded": ["..."],
  "fallbackTrace": [],
  "diagnostics": [],
  "scope": {
    "inputHash": "sha256:...",
    "libraryKey": "mosquitto@2.0.22",
    "query": "CWE-78 command injection",
    "methodsRequiredForNoHit": ["osv_commit", "nvd_cpe", "nvd_keyword"],
    "cachePolicy": "fresh|stale|none"
  },
  "provenance": {
    "projectId": "...",
    "buildSnapshotId": "...",
    "buildUnitId": "...",
    "sourceBuildAttemptId": "..."
  },
  "sourceEvidenceRefs": [],
  "derivedFromEvidenceRefs": [],
  "results": {},
  "itemAcquisitions": [
    {
      "itemKey": "mosquitto@2.0.22",
      "itemType": "library|query|function|memory",
      "acquisitionStatus": "completed_hit|completed_no_hit|partial_hit|incomplete_acquisition|input_insufficient|stale_cache_only|conflicting_evidence|timeout|not_ready|error",
      "acquisitionQualityGate": "accepted|accepted_with_caveats|inconclusive|rejected",
      "consumerPolicy": "s3_may_derive_local_support_if_refs_validate|contextual_only|scoped_no_hit_record_only|diagnostic_only|do_not_use|do_not_use_as_negative_evidence",
      "scope": {},
      "diagnostics": [],
      "fallbackTrace": [],
      "sourceEvidenceRefs": [],
      "derivedFromEvidenceRefs": [],
      "results": {}
    }
  ]
}
```

---

## S3 consumption rules

S5's `acquisitionQualityGate` is acquisition-usability only. It is not S3's final `qualityOutcome`, does not accept a vulnerability claim, and does not authorize final evidence class by itself. S3 remains the sole authority for final evidence class, claim support, accepted claims, clean pass, and vulnerability verdicts.

- `completed_hit + accepted|accepted_with_caveats`: usable as contextual knowledge, or local-derived support only when `consumerPolicy=s3_may_derive_local_support_if_refs_validate` and S3 independently validates that `derivedFromEvidenceRefs` link to local/source/SAST evidence.
- `completed_no_hit + accepted + consumerPolicy=scoped_no_hit_record_only`: S3 may record a scoped negative attempt only for the envelope/item `scope`; it is not global safety evidence.
- `partial_hit`: contextual/caveated only.
- Batch/multi-item calls are consumed item-by-item from `itemAcquisitions[]`; S3 must not promote a top-level completed status over per-item timeout/input-insufficient/conflict diagnostics.
- `incomplete_acquisition`, `timeout`, `not_ready`, `error`: operational diagnostics, never no-hit.
- `input_insufficient`: input diagnostic, usually S3/S4 adapter issue.
- `stale_cache_only`: contextual with caveat or diagnostic; not negative evidence unless S3 explicitly accepts stale policy later.
- `conflicting_evidence`: inconclusive diagnostic; may force S3 claim caveat/human review.
- `fallbackTrace` must lower/caveat quality whenever precision drops.
- `do_not_use_as_negative_evidence` dominates all other fields.

---

## Durable ingest, versioning, and idempotency

Target context ingest should be durable and replay-safe:

- compute and return deterministic `targetContextInputHash` over the normalized bundle;
- re-submitting the same `projectId + target.targetId + provenance.buildSnapshotId + targetContextInputHash` must be idempotent and return the existing context/version or a clear `reused=true`;
- submitting the same target with changed input should create a new `targetContextVersion` under the same target identity, not silently mutate historical acquisition records;
- chunked graph/function ingest, if needed, must remain under one `targetContextIngestId` and expose chunk completion diagnostics;
- S5 must record `createdAt`, `updatedAt`, `lastAcquiredAt`, cache timestamps/TTL/freshness, and the method/provider timestamp used to classify `stale_cache_only`;
- replace/update semantics must be explicit: old target context versions remain auditable or are explicitly superseded with a `supersedesTargetContextVersion` link.

---

## Completed no-hit rule

S5 must make no-hit scope explicit. `completed_no_hit` is valid only when S5 completed the required method set for that input/scope. Truncated, timeout, provider-error, stale-cache-only, partial source failure, or missing precision input must not produce `completed_no_hit`.

---

## CVE-specific expectations

CVE acquisition should use the same envelope. Results should still include per-CVE fields, but with reasons:

- `version_match=true` means affected according to the acquisition method.
- `version_match=false` means specific range-out.
- `version_match=null` means unknown, not safe.
- Add `versionMatchReason` when feasible: `osv_commit_match`, `matched_nvd_cpe_range`, `outside_nvd_cpe_range`, `no_cpe_version_range`, `no_matching_cpe_for_library`, `keyword_only_unverifiable`, `version_parse_failed`.

---

## S4 delegated/future fields

Not blockers for S5 one-track v1, but S5 may request S4 follow-up if needed:

- raw versionEvidence source spans such as CMake/configure/git line evidence
- richer diff provenance and source file-level modified/unmodified trace
- more stable SAST anchor IDs if `metadata.evidenceResolution` is insufficient
- exact third-party path/origin mapping beyond current SCA fields

---

## Tests S5 should include

- Full target-context ingest with S4 enriched library, SAST evidenceResolution, build profile, and codeGraph functions.
- Reject/diagnose insufficient target identity instead of global fallback.
- CVE completed hit and completed no-hit with explicit scope.
- CVE timeout/not_ready/error/partial do not become no-hit.
- Versionless/ineligible library yields input_insufficient or diagnostic, not no-hit.
- Stale cache only returns `stale_cache_only` + caveated acquisitionQualityGate plus cache timestamp/TTL/freshness metadata.
- Conflicting version evidence returns `conflicting_evidence` + acquisitionQualityGate inconclusive/rejected.
- Fallback trace is present for keyword fallback/cache fallback/provider fallback.
- Code graph acquisition returns local-derived evidence only when source refs/provenance are attached.
- No final vulnerability verdict fields are emitted by S5.
- S3 consumer policy mapping can distinguish contextual refs, operational diagnostics, scoped negative attempts, and S3-validated local-derived support.
- Mixed batch regression: one request contains completed_no_hit, completed_hit, timeout, and input_insufficient itemAcquisitions; S3 must be able to classify each item independently.
- Idempotent re-submit returns same targetKnowledgeId/version for same normalized targetContextInputHash.
- Chunked codeGraph ingest correlates chunks under one targetContextIngestId and reports incomplete chunks as incomplete_acquisition, not ready/no-hit.

---

## S3 adapter expectations

S3 will adapt by building TargetContextBundle after deterministic Phase 1, submitting it before target-aware S5 queries, and mapping AcquisitionEnvelopeV1 into EvidenceCatalog/evidenceDiagnostics. S3 accepts replacing its current simple CVE adapter once S5 exposes the canonical target-aware path.

## Completion expectation

S5 can treat this as S3's preferred one-track contract direction and proceed to a concrete S5 ETL/API implementation plan. If S5 finds a target-context field that must be produced by S4 instead of S3, S5 should send a focused S4 WR; the S4 delegated/future list above is not a blocker for S5 v1 planning.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
