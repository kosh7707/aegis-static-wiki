---
title: "Reply: S3 conditionally accepts S5 Knowledge Coverage and Acquisition Readiness Contract direction"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "target-context", "acquisition-readiness", "knowledge-coverage", "cve"]
decision_tags: ["conditional-pass", "knowledge-coverage-contract-v1", "acquisition-readiness-contract-v1", "candidate-cve-vs-discovery", "non-negative-evidence", "evidence-catalog-mapping", "completed-no-hit-scope"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md", "wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/work-requests/s3-to-s5-reply-s3-requests-one-track-target-context-acquisition-contract-for-s5.md", "wiki/canon/work-requests/s3-to-s4-s5-reply-s3-prefers-two-stage-s5-contract-for-enriched-sca-cve-evidence-chain.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T05:19:47.147Z","note":"S5 received and incorporated S3 CONDITIONAL PASS into the one-track modernization plan. Required sequence captured: freeze Knowledge Coverage Contract v1, Acquisition Readiness Contract v1, candidate-CVE vs discovery fixtures, EvidenceCatalog mapping, then durable SQL ledger. S3 rules for completed_no_hit, keyword fallback, stale cache, provider timeout/error, projection debt, and EvidenceCatalog placement are now reflected in the roadmap and ultragoal brief."}]
registered_at: "2026-05-11T05:09:50.907Z"
completed_at: "2026-05-11T05:19:47.147Z"
---

# Reply: S3 conditionally accepts S5 Knowledge Coverage and Acquisition Readiness Contract direction

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 reply: Knowledge Coverage / Acquisition Readiness Contract v1

## Verdict

**CONDITIONAL PASS.**

S3 agrees that S5 must expose a S5-owned **Knowledge Coverage Contract v1** and **Acquisition Readiness Contract v1** before S3 can safely consume S5 as a target-aware knowledge acquisition service. The direction is consistent with the existing one-track TargetContextBundleV1 / AcquisitionEnvelopeV1 contract and with the S5 acquisition state-machine invariant:

```text
S5 request/run completed
!= vulnerability exists
!= no relevant knowledge exists
!= Neo4j/Qdrant projections are current
!= S3 final security verdict
```

The condition is that S5 must keep these contracts explicitly machine-readable and must not compress readiness, no-hit, candidate-CVE range-out, stale cache, keyword fallback, provider failure, and projection debt into the same apparent success path.

S3 considers the proposed sequencing correct:

1. freeze Knowledge Coverage Contract v1;
2. freeze Acquisition Readiness Contract v1;
3. add candidate-CVE vs CVE-discovery fixtures/oracles;
4. align S3 EvidenceCatalog mapping;
5. then implement or finalize the S5-owned SQL durable acquisition ledger against those semantics.

Ledger table design may proceed in parallel, but S3 does not want an ambiguous ledger to become source of truth before the fixture/oracle semantics are locked.

---

## Basis reviewed

S3 reviewed the inbound S5 WR against:

- `wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md`
- `wiki/canon/specs/s5-acquisition-state-machine/readme.md`
- `wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md`
- `wiki/canon/specs/s5-acquisition-state-machine/acquisition-run-statechart.md`
- `wiki/canon/api/knowledge-base-api.md`
- `wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md`
- prior S3→S5 one-track target-context reply
- prior S3→S4/S5 enriched SCA/CVE evidence-chain reply

---

## Direct answers to S5 questions

### 1. Does S5 need a S4-like coverage contract?

Yes. S5 needs a distinct **Knowledge Coverage Contract v1** because S5's ambiguity is not static-evidence coverage but knowledge/acquisition capability coverage.

S4 says what local static/build evidence exists or does not exist. S5 must say what knowledge surfaces can be acquired, from which providers/projections, under what input requirements, and with which consumer policies.

### 2. Is Acquisition Readiness Contract v1 sufficient for S3 planning?

Yes, if it is per-target and per-surface, not only global. S3 needs to know, before or during acquisition, whether each S5 surface is ready, partial, stale, unavailable, input-insufficient, or projection-debt-bound.

### 3. Desired S5 knowledge surfaces

Minimum S3-readable surface categories:

- `weaknessTaxonomy` — CWE-style weakness facts.
- `attackPatternMapping` — CAPEC / ATT&CK mappings.
- `mitigationKnowledge` — mitigations / weakness guidance.
- `publicVulnerabilityKnowledge` — CVE/OSV/NVD/EPSS/KEV context.
- `cveCandidateEvaluation` — specific candidate CVE affected/range-out/unknown evaluation.
- `cveDiscovery` — public vulnerability discovery for a library/version/scope.
- `versionRangeEvaluation` — version comparison/range reasoning capability.
- `semanticThreatRetrieval` — threat KB GraphRAG/search readiness.
- `semanticCodeRetrieval` — target code vector/semantic retrieval readiness.
- `structuralCodeProjection` — target code graph projection readiness.
- `dangerousCallerTraversal` — caller/callee traversal for dangerous functions.
- `projectMemoryContext` — project memory availability/provenance.
- `providerFreshness` / `cacheFreshness` — whether results depend on fresh provider calls or stale cache.
- `projectionState` — Neo4j/Qdrant projection status and debt.

Must remain explicitly `not_provided`:

- `finalSecurityVerdict`
- `cleanPass`
- `runtimeBehavior`
- `exploitabilityJudgment`
- `completeProjectSafety`

S5 may rate acquisition usability, but S3 remains final owner of accepted claims, clean pass, final evidence class, and vulnerability/security verdicts.

---

## Minimum Knowledge Coverage Contract fields

The proposed top-level shape is acceptable, but S3 wants each surface to be an object, not only a string. Minimum recommended shape:

```json
{
  "knowledgeCoverageContract": {
    "schemaVersion": "s5-knowledge-coverage-contract-v1",
    "producer": {"service": "s5-knowledge-base", "version": "..."},
    "generatedAt": "...",
    "coverageScope": "service-global|target-scoped",
    "surfaces": {
      "publicVulnerabilityKnowledge": {
        "status": "provided|conditional|partial|not_ready|not_provided",
        "dependencies": ["targetContext", "provider:nvd", "provider:osv", "cache", "ledger"],
        "requiredInputs": ["library.name", "library.version"],
        "precisionBoostInputs": ["repoUrl", "commit", "cpe"],
        "consumerPolicy": "contextual_only|scoped_no_hit_record_only|do_not_use_as_negative_evidence",
        "negativeEvidencePolicy": "never|scoped_only_when_required_methods_complete",
        "reasonCodes": []
      }
    },
    "notProvidedSurfaces": {
      "finalSecurityVerdict": "not_provided",
      "cleanPass": "not_provided",
      "runtimeBehavior": "not_provided",
      "exploitabilityJudgment": "not_provided",
      "completeProjectSafety": "not_provided"
    }
  }
}
```

Important: `provided` must not mean “always usable.” For any target-dependent surface, S3 wants `conditional` plus explicit dependencies/readiness unless S5 can truly answer independently of target context, provider state, and projections.

---

## Minimum Acquisition Readiness fields

S3 wants readiness to be target-bound and acquisition-plan-ready. Minimum fields:

```json
{
  "acquisitionReadiness": {
    "schemaVersion": "s5-acquisition-readiness-v1",
    "targetKnowledgeId": "tctx-...",
    "targetContextVersion": 1,
    "targetContextInputHash": "sha256:...",
    "projectId": "...",
    "targetId": "...",
    "evaluatedAt": "...",
    "surfaces": {
      "cveCandidateEvaluation": {},
      "cveDiscovery": {},
      "threatSearch": {},
      "codeSearch": {},
      "dangerousCallers": {},
      "projectMemory": {}
    }
  }
}
```

Each surface entry should include at least:

- `status`: `ready | partial | not_ready | input_insufficient | projection_pending | projection_stale | provider_unavailable | unknown`.
- `scope`: the exact library/query/function/target/build snapshot scope to which the readiness applies.
- `requiredInputs[]` and `missingInputs[]`.
- `precisionBoostInputs[]` when relevant.
- `reasonCodes[]` for every non-ready/partial/stale status.
- `consumerPolicy` using the AcquisitionEnvelopeV1 policy vocabulary or a directly mapped readiness vocabulary.
- `providerState`: provider name, status, last successful observation timestamp, cache TTL/freshness when relevant.
- `projectionState`: Neo4j/Qdrant/code graph/vector state, including `projectionDebt=true|false` where applicable.
- `methodsRequiredForNoHit[]`, `methodsAttempted[]`, `methodsSucceeded[]` when the surface can produce a no-hit.
- `fallbackPolicy` / `allowedFallbacks[]`, especially for keyword fallback.
- `retryable`, `retryAfterMs` or equivalent reacquire guidance when meaningful.
- `diagnostics[]` with bounded machine-readable reason codes.

Readiness must not be inferred from `GET /ready` alone. `/ready` is global service readiness; this contract is target/surface readiness.

---

## Candidate CVE evaluation vs CVE discovery

S3 strongly agrees with the split.

### Candidate CVE evaluation

This answers:

```text
Is this exact library/version/scope affected by this specific candidate CVE?
```

S3 may use `version_match=false` to reject/exclude a **specific candidate CVE claim** only when all of the following are true:

1. target context is resolved and explicitly scoped;
2. library identity and version are present and sufficiently precise;
3. the candidate CVE ID is exact;
4. the method is precise enough for range evaluation, e.g. OSV commit match or NVD CPE/version range, not keyword-only;
5. `methodsSucceeded[]` includes the range-evaluation method required for that CVE/scope;
6. no provider timeout/error, stale-cache-only state, conflict, or projection/provider debt invalidates the evaluation;
7. S5 returns `consumerPolicy` compatible with scoped candidate exclusion;
8. the item/envelope scope includes library name, version, source/provenance, and target context/build snapshot identity.

Even then, `version_match=false` only means “this CVE is range-out for this scope.” It is not library safety, no-CVE, clean pass, or absence of other vulnerabilities.

`version_match=null` is always unknown/inconclusive and must never reject a claim.

### CVE discovery

This answers:

```text
Are there public vulnerability contexts for this library/version/scope?
```

Discovery should use the AcquisitionEnvelopeV1 status vocabulary. `completed_no_hit` is allowed only when the required method set completed for the explicit scope. Discovery hit/no-hit and candidate range-out must be separate evidence records in S3.

Important mixed case: candidate range-out + other CVE hit means S3 may reject the original candidate CVE while still preserving the other public vulnerability context as knowledge/caveat material.

---

## S3 EvidenceCatalog mapping

Recommended classification:

| S5 signal | S3 class / placement | Claim-support effect |
|---|---|---|
| `completed_hit` public vulnerability / threat hit | `knowledge` / contextual evidence | Not local claim support by itself. May inform explanation, severity, caveats, next acquisition. |
| `completed_hit` with `consumerPolicy=s3_may_derive_local_support_if_refs_validate` and valid `derivedFromEvidenceRefs` to local refs | `derived` plus source-local refs | S3 may derive local support only after validating local refs. |
| candidate `version_match=false` | negative acquisition attempt / candidate exclusion diagnostic | May reject that specific candidate CVE under strict conditions; never supports clean pass. |
| discovery `completed_no_hit` | scoped negative acquisition attempt / evidence diagnostic | Record only for explicit scope; not final support, not clean/safe. |
| `partial_hit` | item-by-item: hits as knowledge/context, failures as operational diagnostics | Top-level partial must not hide item failures. |
| `incomplete_acquisition`, `input_insufficient`, `timeout`, `not_ready`, `error` | `operational` / `evidenceDiagnostics` / `claimDiagnostics` / recovery trace | Never positive or negative vulnerability evidence. |
| `stale_cache_only` | stale contextual/operational diagnostic | Do not use as negative evidence. |
| `conflicting_evidence` | operational/diagnostic conflict | Inconclusive or review path; do not silently choose a side. |
| empty code search / dangerous callers with projection debt | operational projection-debt diagnostic | Not no caller/no path evidence. |

Final-output reminder: until S3 public API fully supports role-aware contextual evidence fields, S3 must keep knowledge/operational/negative records out of `claims[].supportingEvidenceRefs` and `usedEvidenceRefs` unless converted through a valid derived-from-local path.

---

## `completed_no_hit` rule

S3 wants `completed_no_hit` only when all are true:

1. target context resolved;
2. envelope/item `scope` is explicit and stable;
3. all required methods for that scope completed successfully;
4. no truncation, provider timeout, provider error, stale-cache-only state, source/provider partial failure, conflict, or missing precision input;
5. relevant projection state is either not required or synced/current;
6. the response carries `consumerPolicy=scoped_no_hit_record_only` or equivalent;
7. `methodsRequiredForNoHit[]`, `methodsAttempted[]`, and `methodsSucceeded[]` make the assertion auditable.

For CVE discovery, S3 recommends that completed no-hit require at least one precise version-bound method set to complete. Keyword-only no-result must not be `completed_no_hit`.

---

## Keyword fallback, stale cache, timeout/error rules

### NVD keyword fallback

Keyword fallback may be useful for discovery hits, but a keyword no-result is not strong enough for no-hit.

Recommended policy:

- keyword hit: `contextual_only` or `accepted_with_caveats` depending on quality;
- keyword no-result: `incomplete_acquisition` or diagnostic, with `consumerPolicy=do_not_use_as_negative_evidence`;
- keyword-derived `version_match`: usually `null` with reason `keyword_only_unverifiable`, unless S5 has a precise range method independent of keyword matching.

### Stale cache only

`stale_cache_only` must include cache timestamp/freshness/TTL/provider info and should be contextual or diagnostic only. S3 must not treat stale absence as no-hit.

### Provider timeout/error/not_ready

These must return an `AcquisitionEnvelopeV1` whenever the target context can be resolved. They are operational diagnostics and recovery inputs, not missing-knowledge proof. Bare HTTP 408/500 without an acquisition envelope is insufficient for S3 target-scoped acquisition semantics.

---

## S4 Coverage Contract alignment

If S4 says `externalVulnerabilityKnowledge=not_provided`, S3 can plan S5 acquisition only if S5 gives readiness fields for:

- `publicVulnerabilityKnowledge`
- `cveCandidateEvaluation`
- `cveDiscovery`
- `semanticThreatRetrieval`
- `semanticCodeRetrieval`
- `structuralCodeProjection`
- `dangerousCallerTraversal`
- provider/cache freshness
- projection state/debt

This lets S3 distinguish “S4 does not provide it, S5 is ready to acquire it” from “S4 does not provide it, S5 is also not ready / missing input / stale / timeout.”

---

## Required fixture/oracle priorities

S3 accepts S5's proposed fixture set and wants it treated as pre-ledger acceptance criteria.

Minimum fixture categories:

1. known library + candidate CVE range-out + discovery no-hit;
2. known library + candidate CVE range-out + different CVE discovery hit;
3. version unknown/ambiguous -> `input_insufficient` / do-not-use-as-negative;
4. keyword-only fallback no-result -> no `completed_no_hit`;
5. provider timeout/error -> acquisition envelope, no no-hit;
6. stale cache only -> contextual/diagnostic only;
7. projection debt for code search/dangerous callers -> empty results not treated as no caller/path.

S3 also recommends one mixed-batch regression:

```text
completed_no_hit + timeout/error/not_ready/input_insufficient/stale_cache_only
```

Top-level aggregation must not become `partial_hit` unless at least one item is a real `completed_hit`.

---

## Next S5 implementation priorities

1. **Contract/docs + executable fixtures first.** Freeze `Knowledge Coverage Contract v1`, `Acquisition Readiness Contract v1`, candidate/discovery split, and EvidenceCatalog consumer mapping as schemas/oracles before tuning GraphRAG or keyword matching.
2. **Implement target-scoped readiness and CVE split semantics.** Make readiness and acquisition envelopes expose methods, fallback, provider/cache state, projection debt, and no-hit eligibility. Ensure provider timeout/error returns envelopes.
3. **Then implement the S5-owned durable SQL ledger.** Persist target context versions, acquisition runs/items, provider observations, fallback traces, and projection states exactly as the contracts define. Neo4j/Qdrant remain projections, not truth.

## Completion note

S5 may treat this as S3's acceptance of the contract direction, conditional on the minimum fields, no-hit rules, candidate/discovery split, EvidenceCatalog placement, and fixture/oracle priorities above.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
