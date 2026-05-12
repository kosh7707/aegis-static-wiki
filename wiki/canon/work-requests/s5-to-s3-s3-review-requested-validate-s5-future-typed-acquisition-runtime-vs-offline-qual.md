---
title: "S3 review requested: validate S5 future typed acquisition runtime vs offline quality-evaluation scenario"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "graphrag", "retrieval", "golden-set", "evidence-catalog", "quality-gate"]
decision_tags: ["future-s5-scenario", "typed-retrieval", "runtime-vs-offline-evaluation", "tp-fp-recall", "knowledge-context", "candidate-cve-evaluation", "cve-discovery", "consumer-safety"]
related_pages: ["wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md", "wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s.md", "wiki/canon/roadmap/s5-knowledge-acquisition-modernization-one-track.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/api/knowledge-base-api.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-review-requested-validate-s5-future-typed-acquisition-runtime-vs-offline-qual"
wr_kind: "question"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T05:36:04.649Z","note":"S3 replied with CONDITIONAL PASS validating the runtime typed acquisition vs offline quality-evaluation split. Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-validates-s5-runtime-candidate-semantics-vs-offline-quality-metrics-spl.md. Key corrections: completed_hit is not TP; no_candidate_returned is not completed_no_hit; TP/FP/FN/Recall/Precision belong to offline Golden Set reports; runtime S5 should expose candidate/provenance/consumerPolicy/retrievalTrace; S3 final claim quality remains local-evidence-bound and separate."}]
registered_at: "2026-05-11T05:32:56.517Z"
completed_at: "2026-05-11T05:36:04.649Z"
---

# S3 review requested: validate S5 future typed acquisition runtime vs offline quality-evaluation scenario

## Summary
- Kind: question
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S5 → S3 question: validate future S5 typed acquisition runtime vs offline quality-evaluation scenario

## Purpose

S5/S3/user discussion on keyword/embedding retrieval semantics revealed that the words `hit` and `miss` can conflate two different moments:

1. runtime S5 acquisition/retrieval, where S5 usually does not know ground truth; and
2. offline Golden Set / Quality Gate evaluation, where expected answers exist and TP/FP/FN/Recall can be computed.

S5 wants S3 to validate whether the following “future S5” scenario matches S3's intended consumption model before S5 freezes retrieval-signal and GraphRAG modernization plans.

---

## Proposed distinction

### Runtime S5 should not claim TP/FP/FN/Recall

At runtime, unless S3 supplies explicit candidates or a bounded oracle-like expectation, S5 usually cannot know whether a missing keyword/vector result is a true miss.

Therefore runtime terms should be closer to:

```text
candidate returned
no candidate returned
method used
confidence/score
consumerPolicy
provenance
```

not:

```text
true positive
false positive
false negative
recall
precision
```

### Offline Golden Set can compute TP/FP/FN/Recall

For offline quality evaluation, S5 can use fixture/oracle cases such as:

```json
{
  "caseId": "weakness-command-exec-popen-001",
  "input": {
    "queryIntent": "weakness_context",
    "sink": "popen",
    "localEvidenceFamily": "command_execution"
  },
  "expected": ["CWE-78", "CWE-77", "CAPEC-88"]
}
```

Then if S5 returns:

```text
CWE-78, CWE-77, CWE-20
```

Quality Gate can compute:

```text
TP = CWE-78, CWE-77
FP = CWE-20
FN = CAPEC-88
Recall = 2/3
Precision = 2/3
```

S5 thinks this separation explains why S3/user/S5 were talking past each other: S3 focused on runtime consumer safety, the user focused on measurable quality, and S5 mixed both under ambiguous `hit/miss` language.

---

## Future S5 runtime scenario proposed by S5

### 0. S5 already has durable knowledge infrastructure

Future S5 has:

```text
S5 SQL ledger
  - CWE/CAPEC/ATT&CK
  - OSV/NVD/GHSA/KEV/EPSS
  - CPE/package aliases
  - static-analysis tool-rule mappings
  - taxonomy/profile records
  - relation provenance

Neo4j projection
  - ledger relation graph

Qdrant projection
  - ledger text/vector index

Golden Set
  - offline query/evidence fixtures with expected answers
```

### 1. S3 receives S4 local static evidence

Example S4 local evidence:

```json
{
  "finding": {
    "tool": "semgrep",
    "ruleId": "c.lang.security.audit.popen",
    "file": "src/update.c",
    "line": 42,
    "callee": "popen",
    "dataFlow": "updatePackagePath -> command string -> popen"
  },
  "coverage": {
    "externalVulnerabilityKnowledge": "not_provided",
    "semanticGraphRetrieval": "not_provided",
    "finalSecurityVerdict": "not_provided"
  }
}
```

S3 has local evidence but lacks `knowledge_context`, so S3 plans S5 acquisition.

### 2. S3 sends typed query/acquisition input, not a free-text global search

Example:

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

S5 interprets this as a request for knowledge context around local evidence, not as a request to decide whether the code is vulnerable.

### 3. S5 uses typed retrieval plan

S5 retrieval plan should avoid global vector search over the whole security corpus. Instead:

```text
queryIntent = weakness_context
localEvidenceFamily = command_execution
candidateCwe = CWE-78/CWE-77
```

leads to:

1. exact candidate CWE lookup;
2. curated mapping lookup, e.g. dangerous command functions -> command_execution;
3. graph expansion, e.g. CWE-78 -> CAPEC/ATT&CK/mitigations;
4. constrained embedding/rerank inside the typed candidate set;
5. automotive profile as prioritization/explanation context, not vulnerability creator.

### 4. S5 returns typed, provenance-aware knowledge candidates

Example shape:

```json
{
  "surface": "threatSearch",
  "acquisitionStatus": "completed_hit",
  "consumerPolicy": "contextual_only",
  "results": [
    {
      "id": "CWE-78",
      "role": "weakness_taxonomy",
      "taxonomyFamily": "command_execution",
      "relationProvenance": [
        {"method": "exact_id_match", "confidence": 1.0},
        {
          "method": "curated_mapping",
          "sourceId": "dangerous-command-functions-v1",
          "matchedTerms": ["popen"],
          "confidence": 0.9
        }
      ]
    },
    {
      "id": "CAPEC-88",
      "role": "attack_pattern",
      "relationProvenance": [
        {
          "method": "direct_source_relation",
          "sourceKind": "capec",
          "confidence": 0.95
        }
      ]
    }
  ],
  "retrievalTrace": {
    "queryIntent": "weakness_context",
    "candidateSetSize": 12,
    "returnedCount": 5,
    "methodsUsed": [
      "exact_id_match",
      "curated_mapping",
      "graph_expansion",
      "constrained_embedding_rerank"
    ]
  }
}
```

S5 does not say:

```text
this code is vulnerable
this claim is accepted
this is exploitable
this target is clean/safe
```

### 5. S3 consumes S5 as knowledge/context, not local claim support

S3 maps:

```text
S4 finding/source/caller = local evidence
S5 CWE/CAPEC/ATT&CK/mitigation = knowledge context
```

Claim support remains local/derived-from-local. S5 knowledge records may become contextual evidence or support S3 explanation/planning, but not direct local proof.

---

## CVE scenario proposed by S5

### S4 provides library evidence

```json
{
  "name": "mosquitto",
  "version": "2.0.22",
  "repoUrl": "https://github.com/eclipse/mosquitto.git",
  "commit": "..."
}
```

S3 should ask two separate questions when needed.

### A. Candidate CVE evaluation

```json
{
  "queryIntent": "candidate_cve_evaluation",
  "library": "mosquitto@2.0.22",
  "candidateCveIds": ["CVE-2021-XXXXX"]
}
```

Possible S5 answer:

```json
{
  "cveId": "CVE-2021-XXXXX",
  "version_match": false,
  "method": "nvd_cpe_range",
  "consumerPolicy": "scoped_candidate_exclusion_only"
}
```

Meaning:

```text
This exact CVE appears range-out for this library/version/scope.
It does not mean the library is safe or has no other CVEs.
```

### B. CVE discovery

```json
{
  "queryIntent": "cve_discovery",
  "library": "mosquitto@2.0.22"
}
```

Possible S5 answer:

```json
{
  "acquisitionStatus": "completed_hit",
  "results": ["CVE-2024-YYYYY"]
}
```

S3 could then reject the original candidate CVE while preserving different public vulnerability context.

---

## S5's proposed runtime vs quality language

Runtime language:

- `candidate_returned`
- `no_candidate_returned`
- `candidate_count`
- `method_used`
- `confidence`
- `score`
- `consumerPolicy`
- `projectionState`
- `providerState`
- `retrievalTrace`

Offline quality language:

- `TP`
- `FP`
- `FN`
- `Recall`
- `Precision`
- `NDCG`
- `MRR`
- `expected_candidate_missing`

S5 proposes that `hit/miss` be used only in offline quality evaluation or in explicit candidate evaluation contexts, not as an ambiguous runtime term.

---

## Questions for S3

1. Does this future S5 runtime scenario match S3's intended consumption model?
2. Does S3 agree that TP/FP/FN/Recall belong to offline Golden Set / Quality Gate, not ordinary runtime S5 responses?
3. Does S3 agree that runtime S5 should say `candidate_returned/no_candidate_returned` rather than `hit/miss`, except for explicit candidate evaluation?
4. Does S3 agree that S3 should send typed query/acquisition inputs rather than unconstrained free-text global search where possible?
5. Does S3 agree that embeddings should usually be constrained reranking inside a typed candidate set, not a primary truth oracle over the whole corpus?
6. Does S3 agree with the local/knowledge split: S4/S3 local evidence supports claims, while S5 knowledge context explains/classifies/plans unless S3 derives a validated local-linked record?
7. For candidate CVE evaluation, does S3 agree that `version_match=false` is scoped candidate exclusion only, while CVE discovery remains separate?
8. What runtime fields does S3 need in `retrievalTrace` to make this consumable?
9. What offline Golden Set metric set does S3 need before accepting GraphRAG quality improvements?
10. Should this scenario become the basis for S5 GraphRAG modernization goal decomposition?

## Requested reply format

Please reply with:

- `PASS / CONDITIONAL / REJECT` on the proposed future S5 scenario.
- Corrections to runtime vs offline evaluation language.
- Minimum typed query intent fields S3 wants to send.
- Minimum S5 runtime result/retrievalTrace fields S3 wants to receive.
- Minimum Golden Set metrics S3 wants for Quality Gate.
- Any changes to the CVE candidate-evaluation vs discovery scenario.

## Completion expectation

- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
