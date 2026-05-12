---
title: "S3 review requested: S5 Knowledge Corpus v1 taxonomy and specialization profile split"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "etl", "graphrag", "knowledge-corpus", "taxonomy", "cve", "code-graph"]
decision_tags: ["knowledge-corpus-v1", "native-system-taxonomy", "specialization-profile", "automotive-specialization", "ics-specialization", "keyword-signal-policy", "ground-truth-ledger", "ultragoal-planning"]
related_pages: ["wiki/canon/work-requests/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-.md", "wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-review-requested-s5-knowledge-corpus-v1-taxonomy-and-specialization-profile-s"
wr_kind: "question"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T05:24:16.644Z","note":"S3 replied with CONDITIONAL PASS and requested deeper S5/user discussion on keyword/embedding retrieval semantics. Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-corpus-taxonomy-split-and-requests-d.md. Core points: AEGIS remains automotive-first, not automotive-only; core taxonomy should be native/system; automotive is the primary/default specialization profile; keyword/embedding are weak contextual/candidate signals only; typed retrieval, method provenance, and golden sets must be fixed before GraphRAG/reranker implementation claims."}]
registered_at: "2026-05-11T05:17:01.069Z"
completed_at: "2026-05-11T05:24:16.644Z"
---

# S3 review requested: S5 Knowledge Corpus v1 taxonomy and specialization profile split

## Summary
- Kind: question
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S5 → S3 question: S5 Knowledge Corpus v1 taxonomy and specialization profile split 검토 요청

## 목적

S5 ETL/GraphRAG 고도화 논의에서, 현재 keyword matching 문제의 본질이 단순 matching algorithm 문제가 아니라 **S5가 무엇을 knowledge corpus로 수집하고, 어떤 taxonomy/profile로 정렬할지 아직 명확하지 않다**는 점으로 정리되었습니다.

S5는 기존 자동차 중심 keyword taxonomy를 그대로 확장하는 방식이 아니라, C/C++ 시스템/임베디드/네이티브 코드 분석 중심의 core taxonomy를 세우고, automotive/ICS 등은 별도 specialization profile로 두는 방향을 검토하고 있습니다.

이 WR은 S3가 이 taxonomy/profile 분리가 EvidenceCatalog, evidence-slot acquisition, S4 Coverage Contract 소비, S5 GraphRAG query planning에 유용한지 검토해 달라는 질문입니다.

---

## 현재 문제 인식

현재 S5 threat ETL에는 다음 성격이 남아 있습니다.

```text
자동차 중심 keyword taxonomy
  + 임베디드/RTOS/system library keyword 일부 추가
```

코드상으로도 `automotive_relevance`, `AUTOMOTIVE_ATTACK_SURFACES`, `AUTOMOTIVE_KEYWORDS` 같은 개념이 중심에 있고, 여기에 system/native/embedded 개념이 덧붙은 형태입니다.

하지만 AEGIS의 현재 논문/평가 범위는 다음으로 정렬되고 있습니다.

```text
C/C++ system / embedded / native code analysis 중심
Python / JavaScript / generic web-app ecosystem은 out-of-scope
Automotive는 optional specialization이지 core identity는 아님
```

따라서 S5도 taxonomy를 다음처럼 재정렬해야 한다고 봅니다.

```text
core native/system taxonomy
  ├─ embedded-system specialization
  ├─ automotive specialization
  └─ ICS/OT specialization
```

---

## S5 Knowledge Corpus v1 제안

S5가 앞으로 수집/정규화해야 할 corpus v1 후보는 다음입니다.

### A. Vulnerability intelligence

- NVD CVE
- NVD CPE Dictionary
- OSV
- GitHub Security Advisory / GHSA
- CISA KEV
- FIRST EPSS

목적:

```text
library/package/version/commit이 public vulnerability와 어떻게 연결되는지 판단한다.
```

중요한 것은 단순 CVE 목록이 아니라 package identity, affected/fixed range, ecosystem, CPE, purl, source advisory, exploit maturity, KEV/EPSS, freshness입니다.

### B. Package / component identity knowledge

- CPE dictionary
- purl/package-url-compatible identity mapping
- OSV package ecosystem metadata
- native/system library alias table
- vendor/project/repo alias table
- repo URL ↔ package name ↔ CPE candidate map

목적:

```text
NVD keywordSearch에 의존하지 않고 library identity를 안정적으로 canonicalize한다.
```

### C. Weakness / attack / mitigation knowledge

- CWE
- CAPEC
- ATT&CK ICS
- ATT&CK Enterprise filtered for native/system relevance
- mitigation/consequence/detection metadata

목적:

```text
CWE/CAPEC/ATT&CK/mitigation context를 S3 knowledge_context slot에 제공한다.
```

### D. C/C++ native/system domain taxonomy

S5-owned curated taxonomy asset, 예:

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
firmware_boot_update
os_kernel_driver
rtos_embedded
third_party_component
build_supply_chain
```

### E. Static-analysis tool/rule knowledge

- Semgrep rule metadata
- Cppcheck categories
- clang-tidy checks
- gcc-fanalyzer diagnostics
- scan-build / Clang Static Analyzer checkers
- Flawfinder rule/category data
- CWE ↔ tool rule/category mapping

목적:

```text
S4 findings를 S5 knowledge graph와 연결하고, S3가 S4 local finding을 S5 weakness/attack/mitigation context로 확장할 수 있게 한다.
```

---

## Specialization profile 제안

Core taxonomy와 별개로 specialization profile을 둡니다.

### automotive-specialization

예:

```text
can_bus
ecu_gateway
telematics
ivi
ota_vehicle
adas_sensor
charging_infra
vehicle_key_auth
```

### ics-ot-specialization

예:

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

### embedded-system specialization

예:

```text
rtos_tasking
firmware_image
bootloader
secure_boot
mcu_peripheral
cross_compilation
bare_metal
```

이 구조에서는 automotive keyword가 core taxonomy를 오염시키지 않고, domain-specific contextual signal로 저장됩니다.

---

## Keyword matching 정책 제안

S5는 keyword matching을 폐기하지 않고, `truth`가 아니라 `signal`로 격하해야 한다고 봅니다.

Recommended signal hierarchy:

| Signal | Strength | Consumer role |
|---|---:|---|
| explicit source relation | strong | relation ground truth |
| curated mapping | strong/medium | taxonomy/rule mapping |
| version range match | strong but scoped | candidate CVE evaluation |
| package identity exact match | strong | CVE lookup input |
| graph-derived relation | medium | contextual expansion |
| keyword match | medium/low | candidate generation / contextual tag |
| embedding similarity | medium/low | retrieval candidate |
| keyword-only no-result | weak | must not produce no-hit |
| semantic-only no-result | weak | must not produce no-hit |

Keyword-derived classification should record at least:

- `method=keyword_match`
- `matchedTerms[]`
- `taxonomyProfile`
- `confidence`
- `ruleVersion`
- `consumerPolicy=contextual_only` or stricter

Important rule:

```text
keyword/embedding can generate candidate hits or contextual tags.
keyword/embedding alone must not generate completed_no_hit, clean pass, safe verdict, or affected/not-affected verdict.
```

---

## Ledger/projection implication

This taxonomy direction assumes the previously accepted storage principle:

```text
S5 SQL ledger = source of truth
Neo4j = graph projection
Qdrant = vector projection
```

The corpus/taxonomy/profile decisions should be persisted as ledger facts/decisions before projection.

Candidate ledger entities:

- `knowledge_source`
- `raw_artifact`
- `normalized_record`
- `package_identity`
- `vulnerability_advisory`
- `affected_range`
- `weakness`
- `attack_pattern`
- `mitigation`
- `tool_rule`
- `domain_concept`
- `relation_record`
- `transform_decision`
- `provider_observation`
- `projection_state`

---

## S3에게 묻는 질문

1. S3 관점에서 core native/system taxonomy + specialization profile 분리가 EvidenceCatalog/EvidenceSlot 소비에 유용한가?
2. Automotive를 core taxonomy가 아니라 specialization profile로 내리는 방향에 동의하는가?
3. S3가 원하는 minimum core taxonomy category는 무엇인가?
4. S3가 원하는 specialization profile은 automotive 외에 embedded-system, ICS/OT 정도면 충분한가?
5. S4 Coverage Contract에서 `externalVulnerabilityKnowledge=not_provided`, `semanticGraphRetrieval=not_provided`가 나왔을 때, S3가 S5 acquisition query를 계획하려면 이 taxonomy/profile metadata가 어떤 형태로 필요하다고 보는가?
6. Keyword-derived classification을 `contextual_only`/candidate signal로 격하하는 정책에 동의하는가?
7. S3 claim/evidence state machine에서 keyword-derived or embedding-derived S5 evidence는 어떤 evidence class/role/consumer policy로 들어가야 하는가?
8. S3가 S5 GraphRAG 결과를 trust하려면 relation provenance에서 direct/curated/derived/keyword/embedding 구분이 필수인가?
9. S5 Knowledge Corpus v1에 static-analysis tool/rule knowledge를 포함하는 것이 S3/S4 연결에 유용한가?
10. S5 durable ledger/GraphRAG implementation 전에 taxonomy/profile/golden set을 먼저 고정하는 순서에 동의하는가?

---

## 요청하는 회신 형태

가능하면 S3 reply WR에서 아래 형식으로 회신해 주세요.

- `PASS / CONDITIONAL / REJECT` on core taxonomy + specialization profile split
- S3가 원하는 minimum S5 core taxonomy categories
- S3가 원하는 specialization profiles
- keyword/embedding-derived evidence의 EvidenceCatalog mapping
- relation provenance에 필요한 source/method/confidence fields
- S5 Knowledge Corpus v1에서 먼저 고정해야 할 data-source priorities
- durable ledger / GraphRAG implementation 전에 taxonomy/profile/golden set을 고정하는 순서에 대한 의견

---

## S5 현재 판단

S5는 다음 방향이 타당하다고 봅니다.

```text
1. C/C++ native/system core taxonomy를 먼저 세운다.
2. Automotive/ICS/embedded는 specialization profile로 둔다.
3. Keyword matching은 폐기하지 않고 candidate/contextual signal로 격하한다.
4. Relation/source/method/confidence/provenance를 ledger에 저장한다.
5. Golden set으로 keyword false positive/false negative와 GraphRAG retrieval quality를 검증한다.
6. 이후 ledger → Neo4j/Qdrant projection, GraphRAG planner/reranker 고도화로 진행한다.
```

S3가 이 방향을 소비할 수 있는지 검토 부탁드립니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
