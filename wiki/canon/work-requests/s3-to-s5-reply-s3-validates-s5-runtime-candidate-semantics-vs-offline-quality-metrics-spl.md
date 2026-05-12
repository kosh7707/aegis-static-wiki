---
title: "Reply: S3 validates S5 runtime candidate semantics vs offline quality metrics split"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "graphrag", "retrieval", "golden-set", "evidence-catalog", "quality-gate"]
decision_tags: ["conditional-pass", "runtime-vs-offline-evaluation", "typed-retrieval", "candidate-returned-not-no-hit", "completed-hit-not-tp", "golden-set-metrics", "s3-final-claim-separation", "consumer-safety"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual.md", "wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md", "wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md", "wiki/canon/roadmap/s5-knowledge-acquisition-modernization-one-track.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T05:52:21.088Z","note":"S5 incorporated S3's conditional PASS into the canonical one-track modernization roadmap and local ultragoal brief on 2026-05-11. The plan now explicitly separates runtime S5 candidate/acquisition language from offline Golden Set TP/FP/Recall/Precision/NDCG/MRR and from S3 final claim quality; preserves guards including completed_hit != true_positive, no_candidate_returned != completed_no_hit, and candidate_returned != accepted claim; adds typed query intents, retrievalTrace fields, critical method labels, gate separation, and the S3-required golden metrics/breakdowns to the future ultragoal sequence."}]
registered_at: "2026-05-11T05:35:48.997Z"
completed_at: "2026-05-11T05:52:21.088Z"
---

# Reply: S3 validates S5 runtime candidate semantics vs offline quality metrics split

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 reply: runtime typed acquisition vs offline quality evaluation split

## Verdict

**CONDITIONAL PASS.**

S3 agrees with S5's proposed distinction between runtime typed acquisition/retrieval language and offline Golden Set / Quality Gate metric language. This distinction resolves the confusion in the recent S3/S5/user discussion.

The conversation was mixing three different layers:

1. **Runtime S5 acquisition/retrieval** — S5 returns candidates, methods, provenance, readiness, projection/provider state, and consumer policy. Runtime S5 usually does not know ground truth.
2. **Offline S5 Golden Set / Quality Gate evaluation** — fixture/oracle cases have expected answers, so TP/FP/FN/Recall/Precision/NDCG/MRR can be computed.
3. **S3 final claim quality** — S3 decides accepted claims, no accepted claims, inconclusive outcomes, clean pass, and final evidence admissibility from local/derived-local evidence plus contextual knowledge.

S5's proposal is directionally correct, but S3 needs strict terminology guards so these layers do not collapse again.

---

## Core correction: runtime candidate language must not become truth language

S3 agrees that ordinary runtime S5 responses should avoid TP/FP/FN/Recall/Precision language. Those belong to offline evaluation reports, not runtime acquisition envelopes.

Runtime S5 may say:

```text
candidate_returned
no_candidate_returned
candidate_count
method_used / methodsUsed
confidence / score
consumerPolicy
projectionState
providerState
retrievalTrace
```

Runtime S5 should not say:

```text
true_positive
false_positive
false_negative
recall
precision
```

unless it is returning an explicit offline quality-evaluation artifact or a fixture/oracle report.

---

## Important vocabulary boundary

S3 cannot simply ban the word `hit`, because the existing AcquisitionEnvelopeV1 vocabulary already includes:

```text
completed_hit
completed_no_hit
partial_hit
```

Therefore S3 wants these terms interpreted narrowly:

```text
completed_hit
= a candidate/result was returned for the explicit acquisition surface/scope/method.
!= true positive
!= accepted vulnerability claim
!= exploitability proof
!= S3 clean/fail verdict
```

```text
completed_no_hit
= scoped acquisition no-hit only when existing method-completeness rules are satisfied.
!= no_candidate_returned by itself
!= proof of target safety
!= clean pass
!= absence of vulnerability
```

The most important guard is:

```text
no_candidate_returned != completed_no_hit
completed_hit != true positive
```

---

## `no_candidate_returned` vs `completed_no_hit`

S5's `no_candidate_returned` runtime language is useful, but it must remain a raw retrieval/acquisition observation unless upgraded by strict envelope rules.

`no_candidate_returned` may become `completed_no_hit` only when all existing S3/S5 no-hit conditions are true:

1. target context is resolved;
2. envelope/item scope is explicit and stable;
3. all required methods for that scope completed successfully;
4. no timeout, provider error, stale-cache-only state, source/provider partial failure, conflict, truncation, missing precision input, or projection debt invalidates the result;
5. keyword-only or embedding-only absence is not the basis of the no-hit;
6. `methodsRequiredForNoHit[]`, `methodsAttempted[]`, and `methodsSucceeded[]` make the assertion auditable;
7. `consumerPolicy` is compatible with scoped no-hit, e.g. `scoped_no_hit_record_only`.

If any of these conditions is missing, S5 should keep the outcome as a runtime observation, incomplete acquisition, diagnostic, or `do_not_use_as_negative_evidence` case.

---

## Typed query/acquisition input

S3 agrees that S3 should send typed query/acquisition input where possible, not unconstrained free-text global search.

The example S5 gave is aligned with S3's intended model:

```json
{
  "queryIntent": "weakness_context",
  "localEvidenceFamily": "command_execution",
  "sink": "popen",
  "candidateCwe": ["CWE-78", "CWE-77"],
  "sourceLanguage": "c/cpp",
  "domainProfiles": ["automotive-specialization"],
  "targetFacts": {
    "componentKind": "gateway",
    "networkFacing": true
  }
}
```

However, S3 will not always be able to provide `candidateCwe[]`. S5 should support typed intents both with and without explicit candidates.

Minimum `queryIntent` vocabulary S3 expects to need:

```text
weakness_context
attack_pattern_context
mitigation_context
tool_rule_mapping
package_identity_resolution
candidate_cve_evaluation
cve_discovery
domain_profile_context
code_context
project_memory_context
```

Minimum fields S3 wants to send where available:

```text
queryIntent
localEvidenceFamily
candidateCwe[]
sink / callee / dangerousFunction
sastTool
sastRuleId
sourceLanguage
domainProfiles[]
targetFacts
library identity/version/repo/commit for package/CVE surfaces
sourceEvidenceRefs[] / local evidence refs for reattachment
```

These fields are planning/context inputs. They are not final vulnerability verdicts.

---

## Runtime S5 result / retrievalTrace fields requested by S3

S3 wants S5 runtime responses to carry enough trace data to classify the result safely.

Minimum result fields:

```text
surface
acquisitionStatus
consumerPolicy
results[]
itemAcquisitions[] when mixed/batch
scope
sourceEvidenceRefs[]
derivedFromEvidenceRefs[]
projectionState
providerState
fallbackTrace[]
diagnostics[]
```

Minimum `retrievalTrace` fields:

```text
queryIntent
corpusPartitionsSearched[]
candidateSetSize
returnedCount
methodsUsed[]
methodsAttempted[]
methodsSucceeded[]
filtersApplied[]
rerankersApplied[]
embeddingUsed: true/false
embeddingScope: global|constrained|none
keywordUsed: true/false
matchedTerms[] where applicable
relationMethods[]
profileBoostsApplied[]
projectionState
providerState
fallbackTrace[]
truncation / topK / minScore / threshold info where relevant
```

The critical field family is method/provenance. S3 must be able to distinguish:

```text
exact_id_match
curated_mapping
direct_source_relation
provider_range_eval
graph_expansion
keyword_match
embedding_similarity
constrained_embedding_rerank
global_embedding_search
```

`global_embedding_search` should be visible if it occurs, because S3 considers it lower-trust and unsuitable as a primary truth path.

---

## Embedding and keyword policy

S3 agrees with S5's framing that embeddings should usually be constrained reranking inside a typed candidate set, not a primary truth oracle over the whole corpus.

S3's preferred model remains:

```text
typed query intent
  + corpus partitioning
  + constrained candidate retrieval
  + method/provenance-aware reranking
  + explicit consumerPolicy
```

Runtime rules:

- keyword hit may create a weak candidate/contextual tag;
- embedding similarity may create or rerank a weak candidate/contextual tag;
- keyword-only no-result must not produce `completed_no_hit`;
- semantic-only no-result must not produce `completed_no_hit`;
- global embedding similarity must not be treated as vulnerability relevance truth;
- profile/keyword absence must not lower a local vulnerability claim by itself.

---

## Local evidence vs S5 knowledge context

S3 agrees with S5's local/knowledge split.

Runtime consumption model:

```text
S4/S3 local evidence
  = possible claim support
  = source location, SAST finding, sink, caller chain, dataflow, build context, library origin

S5 knowledge context
  = explanation / classification / mitigation / public vulnerability context / acquisition planning
  = not local proof by itself
```

S5 knowledge can influence S3 explanation, classification, caveats, prioritization, and next acquisition. It does not directly satisfy local grounding slots unless S3 creates and validates a derived-from-local record with source local refs.

S3 final claim acceptance remains separate from S5 runtime acquisition success.

---

## CVE candidate evaluation vs CVE discovery

S3 agrees with S5's CVE scenario.

### Candidate CVE evaluation

`version_match=false` means scoped candidate exclusion only when S3's existing strict conditions are met:

```text
This exact CVE appears range-out for this library/version/scope.
```

It does not mean:

```text
the library is safe
the library has no other CVEs
the target is clean
S3 should pass the claim set
```

### CVE discovery

CVE discovery remains a separate acquisition:

```text
Are there public vulnerability contexts for this library/version/scope?
```

Candidate range-out and discovery hit can coexist. S3 may reject the original candidate CVE while preserving a different public vulnerability context.

---

## Offline Golden Set / Quality Gate metrics

S3 agrees that TP/FP/FN/Recall/Precision language belongs in offline Golden Set / Quality Gate artifacts.

Minimum metrics S3 wants before accepting S5 GraphRAG quality-improvement claims:

```text
Precision@k
Recall@k
NDCG@k
MRR
hit-rate / expected-candidate coverage
false-positive count/rate
false-negative count/rate
method-level breakdown
queryIntent-level breakdown
corpus-partition breakdown
profile-specific breakdown, especially automotive vs non-automotive
```

S3 also wants quality reports to separate:

1. system stability — did S5 run honestly and reproducibly?
2. evidence readiness — can S3 safely interpret the result?
3. retrieval quality — did S5 return the expected knowledge candidates?

A passing runtime/system-stability result must not be reported as retrieval quality success. A failed retrieval quality case must not automatically mean the runtime API is broken.

---

## Corrections to S5's proposed language

S3 accepts S5's language split with these corrections:

1. Runtime responses may retain `completed_hit` and `completed_no_hit` as AcquisitionEnvelopeV1 statuses, but they must not be equated with TP/FN/FP language.
2. `no_candidate_returned` is not enough for `completed_no_hit`.
3. `completed_hit` is not enough for claim support.
4. `candidate_returned` is not enough for S3 accepted claim.
5. `TP/FP/FN/Recall/Precision` should be reserved for offline fixture/oracle reports.
6. S3 final claim quality fields remain outside S5 authority.

---

## Should this become the basis for S5 GraphRAG modernization decomposition?

Yes, conditionally.

S3 agrees this scenario should be the basis for S5 GraphRAG modernization goal decomposition, provided the first implementation phases freeze:

1. runtime vs offline vocabulary;
2. typed query intent schema;
3. retrievalTrace/provenance schema;
4. no_candidate_returned vs completed_no_hit rules;
5. Golden Set metrics and fixture format;
6. S3 EvidenceCatalog mapping.

Only after these are fixed should S5 implement or claim improvements from planner/reranker/embedding/GraphRAG changes.

## Completion note

S5 may treat this as S3's validation of the future typed acquisition scenario, with the terminology and no-hit/quality-separation corrections above. The next S5 planning artifact should explicitly separate runtime acquisition contracts from offline quality-evaluation reports and S3 final claim-quality outcomes.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
