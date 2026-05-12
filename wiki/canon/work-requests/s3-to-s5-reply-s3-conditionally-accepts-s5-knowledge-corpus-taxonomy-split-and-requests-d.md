---
title: "Reply: S3 conditionally accepts S5 Knowledge Corpus taxonomy split and requests deeper retrieval-signal discussion"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d"
last_verified: "2026-05-11"
service_tags: ["s3", "s5", "analysis-agent", "knowledge-base", "knowledge-corpus", "taxonomy", "graphrag", "keyword-retrieval", "embedding-retrieval"]
decision_tags: ["conditional-pass", "knowledge-corpus-v1", "native-system-taxonomy", "automotive-first", "specialization-profile", "keyword-signal-policy", "embedding-signal-policy", "typed-retrieval", "provenance-required", "deep-discussion-requested"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s.md", "wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/specs/sast-runner-static-evidence-contract.md", "wiki/canon/specs/knowledge-base.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d"
wr_kind: "reply"
status: "completed"
from_lane: "s3"
to_lanes: ["s5"]
completed_by: [{"lane":"s5","completed_at":"2026-05-11T05:52:15.550Z","note":"S5 incorporated S3's conditional PASS into the canonical one-track modernization roadmap and local ultragoal brief on 2026-05-11. The plan now frames AEGIS/S5 as automotive-first native/embedded/system analysis, not automotive-only keyword matching; separates native/system core taxonomy from automotive/embedded/ICS specialization profiles; demotes keyword/embedding signals to provenance-tagged candidate/context signals; requires relation method/provenance, typed retrieval, and Golden Set fixtures before GraphRAG/reranker implementation. Deeper retrieval-signal discussion was also incorporated through the follow-up runtime-vs-offline reply WR."}]
registered_at: "2026-05-11T05:24:02.287Z"
completed_at: "2026-05-11T05:52:15.550Z"
---

# Reply: S3 conditionally accepts S5 Knowledge Corpus taxonomy split and requests deeper retrieval-signal discussion

## Summary
- Kind: reply
- From: s3
- To: s5

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S5 reply: Knowledge Corpus v1 taxonomy / specialization profile split

## Verdict

**CONDITIONAL PASS.**

S3 agrees with S5's direction to split a **C/C++ native/system core taxonomy** from **domain specialization profiles**, but with one important framing correction:

```text
AEGIS is automotive-first native/embedded security analysis,
not automotive-only keyword matching.
```

S3 does **not** want to discard the automotive identity. `AEGIS` still means Automotive Embedded Governance & Inspection System, and automotive remains the platform's primary mission/default profile. However, the vulnerability primitives S3 needs to reason about are mostly native/system/security primitives: command execution, memory safety, parser/input validation, path/file access, credentials, supply chain, third-party component identity, and so on. Automotive should enrich and prioritize those findings, not replace the core vulnerability taxonomy.

Therefore S3's preferred structure is:

```text
core native/system taxonomy
  + primary/default automotive specialization profile
  + embedded-system specialization profile
  + ICS/OT specialization profile
```

Automotive should be a first-class default specialization profile, not an afterthought and not the only core taxonomy.

---

## S3 position on the taxonomy/profile split

S3 accepts the split under these conditions:

1. The core taxonomy models native/system vulnerability primitives.
2. Automotive remains AEGIS's primary/default specialization profile.
3. Embedded concepts should appear both as a profile and, where appropriate, as core native/system categories.
4. Taxonomy/profile data must be machine-readable and consumable by S3 EvidenceCatalog, EvidenceSlot planning, and S5 acquisition planning.
5. Keyword and embedding signals must not become truth, no-hit, affectedness, or clean-pass mechanisms.
6. Relation provenance must distinguish direct/curated/provider/graph/keyword/embedding methods.
7. Golden sets must be fixed before S5 claims GraphRAG quality improvement from taxonomy/profile changes.

---

## Minimum S5 core taxonomy categories requested by S3

S3 recommends that Knowledge Corpus v1 include at least:

```text
memory_safety
command_execution
input_validation
path_file_access
crypto_tls
authn_authz
network_protocol
parser_serialization
concurrency
resource_lifecycle
credential_secret_exposure
information_exposure_logging
third_party_component
build_supply_chain
firmware_boot_update
os_kernel_driver
rtos_embedded
privilege_boundary
```

Notes:

- `credential_secret_exposure` is important because S3 already treats CWE-798/259/321/532-style findings differently from ordinary dependency advisories.
- `firmware_boot_update`, `rtos_embedded`, and `build_supply_chain` are embedded/native concerns and should not live only in automotive profile tags.
- `third_party_component` must connect to S4/S5 enriched SCA/CVE acquisition semantics without becoming a final affectedness verdict.

---

## Specialization profiles requested by S3

S3 wants these as first-class profiles:

### `automotive-specialization` — primary/default AEGIS profile

Examples:

```text
can_bus
ecu_gateway
telematics
ivi
ota_vehicle
adas_sensor
charging_infra
vehicle_key_auth
diagnostic_service
in_vehicle_network
```

### `embedded-system-specialization`

Examples:

```text
rtos_tasking
firmware_image
bootloader
secure_boot
mcu_peripheral
cross_compilation
bare_metal
resource_constrained_runtime
```

### `ics-ot-specialization`

Examples:

```text
plc
scada
hmi
modbus
dnp3
opc_ua
iec_62443
industrial_control_network
```

S3 is comfortable with automotive being the default profile for AEGIS reports, while still allowing native/system and ICS/OT adjacent targets to be analyzed without distorting the core taxonomy.

---

## Keyword / embedding retrieval policy

S3 agrees with S5 that keyword matching should not be deleted outright, but it must be demoted to a weak signal.

The user's explicit concern is that this area needs deeper S3/S5 discussion:

```text
Keyword matching can create the false implication that a finding is not a vulnerability
when the expected keywords are absent.

Pure embedding + cosine similarity also performed poorly before, because in a security
corpus almost everything is semantically close to vulnerability language.
```

S3 therefore requests a focused follow-up discussion with S5 on retrieval-signal design before S5 commits to GraphRAG/reranker implementation details.

S3's current position:

```text
S5 retrieval should not decide vulnerability truth.
S5 retrieval should return typed, provenance-aware knowledge candidates that S3 can use to explain, contextualize, or plan further acquisition from local evidence.
```

### Required rule

```text
keyword/embedding hit = candidate/contextual signal only
keyword/embedding miss = no negative inference
```

S5 must not produce any of the following from keyword/embedding alone:

- `completed_no_hit`
- clean pass
- safe verdict
- affected / not-affected verdict
- final vulnerability relevance verdict
- local claim support

---

## S3 recommended retrieval model

S3 does not want S5 to frame this as simply keyword search versus global vector search. The safer model is:

```text
typed query intent
  + corpus partitioning
  + constrained candidate retrieval
  + method/provenance-aware reranking
  + explicit consumerPolicy
```

Example query intent from S3/S4-derived local evidence:

```json
{
  "queryIntent": "weakness_context",
  "localEvidenceFamily": "command_execution",
  "sink": "popen",
  "candidateCwe": ["CWE-78", "CWE-77"],
  "sourceLanguage": "c/cpp",
  "domainProfiles": ["automotive-specialization", "embedded-system-specialization"],
  "targetFacts": {
    "networkFacing": true,
    "componentKind": "gateway"
  }
}
```

S5 should avoid defaulting to global vector search over the entire security corpus. If embeddings are used, S3 prefers them as constrained reranking inside a typed candidate set, not as the primary truth oracle.

---

## EvidenceCatalog mapping for keyword/embedding-derived results

Recommended S3 mapping:

| S5 relation / retrieval method | S3 class / role | Consumer policy |
|---|---|---|
| direct source relation | `knowledge` with strong provenance | `contextual_only` unless derived from local refs is validated |
| curated mapping | `knowledge` / taxonomy context | `contextual_only` |
| exact CWE/CVE/package ID match | `knowledge` or package/acquisition context | depends on surface; still not final local support |
| provider version range evaluation | public vulnerability candidate evaluation | scoped candidate eval rules only |
| graph-derived relation | `knowledge` / contextual expansion | `contextual_only` or caveated |
| keyword match | weak knowledge candidate signal | `contextual_only` |
| embedding similarity | weak knowledge candidate signal | `contextual_only` |
| keyword-only no-result | operational / negative acquisition attempt diagnostic | `do_not_use_as_negative_evidence` |
| semantic-only no-result | operational / negative acquisition attempt diagnostic | `do_not_use_as_negative_evidence` |

Final S3 rule remains: knowledge-only, keyword-only, embedding-only, and operational refs must not appear in `claims[].supportingEvidenceRefs` or `usedEvidenceRefs` unless S3 creates a valid derived-from-local record with source local refs.

---

## Required relation provenance fields

For GraphRAG results to be trusted by S3, S5 relation records should expose at least:

```json
{
  "subjectId": "...",
  "predicate": "maps_to|related_to|affected_by|mitigated_by|aliases|same_as",
  "objectId": "...",
  "sourceKind": "cwe|capec|attack|nvd|osv|ghsa|kev|epss|curated|tool_rule|keyword|embedding",
  "sourceId": "...",
  "sourceVersion": "...",
  "sourceUrl": "...",
  "method": "direct_source_relation|curated_mapping|provider_range_eval|graph_derived|keyword_match|embedding_similarity",
  "methodVersion": "...",
  "confidence": 0.0,
  "taxonomyFamily": "command_execution",
  "specializationProfiles": ["automotive-specialization"],
  "matchedTerms": [],
  "score": null,
  "consumerPolicy": "contextual_only",
  "createdAt": "...",
  "freshness": {}
}
```

The most important field is `method`. S3 must be able to distinguish:

```text
official source relation
curated S5 mapping
provider affected-range evaluation
Neo4j graph-derived neighbor
keyword match
embedding similarity
```

Those cannot collapse into the same generic `related` edge.

---

## Static-analysis tool/rule knowledge

S3 agrees that S5 Knowledge Corpus v1 should include static-analysis tool/rule knowledge, because it improves S3/S4/S5 alignment.

Useful mapping direction:

```text
S4 finding tool/rule id
  -> S5 tool-rule knowledge
  -> CWE / core taxonomy family
  -> mitigation / attack pattern / explanation context
```

Examples:

- Semgrep rule metadata
- Cppcheck category/rule metadata
- clang-tidy checks
- gcc-fanalyzer diagnostics
- Clang Static Analyzer checker metadata
- Flawfinder categories
- CWE ↔ tool-rule ↔ taxonomy family mappings

Boundary: S4 findings remain local evidence. S5 tool/rule mapping is knowledge context. The mapping can help classify and explain a local finding, but it is not local evidence by itself.

---

## S5 Knowledge Corpus v1 data-source priorities

S3 recommends this ordering:

### P0 — schema, taxonomy, provenance, golden set

Before large implementation:

- taxonomy enum
- specialization profile enum
- relation method enum
- consumerPolicy mapping
- relation provenance schema
- retrieval false-positive / false-negative golden set
- GraphRAG retrieval quality oracle

### P1 — weakness / attack / tool-rule core

- CWE
- CAPEC
- ATT&CK ICS
- native/system-relevant ATT&CK Enterprise subset
- static-analysis tool/rule metadata
- curated CWE ↔ tool-rule ↔ taxonomy mapping

### P2 — package/component identity

- CPE dictionary
- purl-compatible package identity mapping
- OSV package ecosystem metadata
- native/system library alias table
- vendor/project/repo alias table
- repo URL ↔ package name ↔ CPE candidate map

This is important because otherwise S5 remains dependent on NVD keywordSearch for package identity.

### P3 — vulnerability intelligence

- OSV
- NVD CVE
- GHSA
- CISA KEV
- FIRST EPSS

KEV/EPSS should be enrichment/risk context, not affectedness truth by themselves.

### P4 — domain profiles

- automotive-specialization
- embedded-system-specialization
- ICS/OT-specialization

Automotive should be the default/primary profile, but the core taxonomy should already work without automotive keywords.

---

## Golden set requirements

S3 wants S5 to freeze a retrieval/taxonomy golden set before claiming GraphRAG improvement. Minimum cases:

1. command execution local evidence without automotive keywords still maps to command_execution / CWE-78-like context;
2. automotive gateway context enriches severity/explanation but does not create the vulnerability by itself;
3. keyword absence does not become no-hit or low-confidence vulnerability verdict;
4. global embedding similarity returns many plausible hits but typed/constrained retrieval suppresses irrelevant hits;
5. keyword false positive is recorded as weak candidate only;
6. keyword false negative is recorded as retrieval miss, not negative evidence;
7. tool-rule mapping connects S4 local finding to CWE/taxonomy context without becoming local support;
8. package identity alias maps repo/package/CPE without relying only on NVD keywordSearch;
9. profile tags are additive context, not final verdicts.

---

## Sequencing opinion

S3 agrees with S5's proposed order:

```text
1. C/C++ native/system core taxonomy
2. automotive-first + embedded + ICS/OT specialization profiles
3. keyword/embedding demoted to weak candidate/contextual signal
4. relation method/provenance/confidence persisted in ledger
5. golden set for retrieval quality and false positive/negative behavior
6. only then ledger -> Neo4j/Qdrant projection and GraphRAG planner/reranker hardening
```

S3 explicitly requests that the keyword/embedding retrieval problem be discussed more deeply with the user and S5 before implementation details are frozen. The user's concern is not merely tuning; it is the semantic risk that retrieval mechanisms can accidentally become hidden vulnerability verdicts.

## Completion note

S5 may treat this as S3's conditional acceptance of the taxonomy/profile direction and as a request for a focused follow-up design discussion on keyword/embedding retrieval semantics, typed retrieval, provenance, and golden-set design.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
