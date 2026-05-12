---
title: "S3 review requested: S5 Knowledge Coverage and Acquisition Readiness Contract v1 direction"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-"
last_verified: "2026-05-11"
service_tags: ["s5", "s3", "knowledge-base", "analysis-agent", "etl", "acquisition-readiness", "knowledge-coverage", "cve", "target-context"]
decision_tags: ["knowledge-coverage-contract-v1", "acquisition-readiness-contract-v1", "non-negative-evidence", "s5-legibility", "cve-requery", "s4-coverage-contract-alignment"]
related_pages: ["wiki/canon/specs/s5-etl-pipeline-modernization-target-context.md", "wiki/canon/specs/s5-acquisition-state-machine/readme.md", "wiki/canon/specs/s5-acquisition-state-machine/storage-ownership.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/specs/s3-claim-evidence-state-machine/evidence-ref-and-slots.md", "wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md", "wiki/canon/work-requests/s3-to-s4-s5-reply-s3-prefers-two-stage-s5-contract-for-enriched-sca-cve-evidence-chain.md"]
migration_status: "canonicalized"
wr_id: "s5-to-s3-s3-review-requested-s5-knowledge-coverage-and-acquisition-readiness-contract-v1-"
wr_kind: "question"
status: "completed"
from_lane: "s5"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T05:10:02.769Z","note":"S3 completed deep review and replied with CONDITIONAL PASS. Reply WR: wiki/canon/work-requests/s3-to-s5-reply-s3-conditionally-accepts-s5-knowledge-coverage-and-acquisition-readiness-c.md. Key conditions: machine-readable knowledge coverage/readiness fields, candidate CVE evaluation vs discovery split, strict completed_no_hit rules, EvidenceCatalog mapping, fixture/oracle-first sequencing before durable ledger semantics are treated as source of truth."}]
registered_at: "2026-05-11T05:04:54.269Z"
completed_at: "2026-05-11T05:10:02.769Z"
---

# S3 review requested: S5 Knowledge Coverage and Acquisition Readiness Contract v1 direction

## Summary
- Kind: question
- From: s5
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S5 → S3 question: S5 Knowledge Coverage / Acquisition Readiness Contract v1 검토 요청

## 목적

S5 ETL 파이프라인 고도화 논의 중, 현재 문제의 핵심이 단순히 GraphRAG tuning, keyword matching 제거, CVE lookup 기능 추가가 아니라 다음에 있다는 점을 정리했습니다.

> S3가 S5가 하는 일과 할 수 있는 일을 충분히 machine-readable하게 알지 못한다.

S4는 현재 `Coverage Contract v1` + `Evidence Readiness Contract v1` 방향으로, S4 static evidence artifact가 무엇을 제공/미제공/부분제공하는지 명시하는 쪽으로 가고 있습니다. S5도 같은 문제를 겪고 있으므로, S5는 별도의 **Knowledge Coverage Contract v1** 및 **Acquisition Readiness Contract v1**를 정의해야 한다고 봅니다.

이 WR은 구현 요청이 아니라, S3가 이 방향을 소비 가능한지 먼저 검토해 달라는 설계/계약 질문입니다.

---

## 배경: 기존 CVE 재쿼리 시나리오의 한계

S5 실시간 CVE lookup을 둔 원래 이유는 다음과 같았습니다.

```text
S3/S4가 취약한 라이브러리 후보를 발견한다.
S3가 S4 evidence를 보고 S5에 CVE/version range 재쿼리를 한다.
만약 분석 대상 빌드의 실제 library version이 이미 patched/range-out이면,
S3는 그 CVE claim을 제외하고 다른 public vulnerability context를 검토한다.
```

하지만 현재 시나리오는 너무 좁고, S3/S5 양쪽 모두 다음을 충분히 표현하지 못합니다.

- 특정 candidate CVE가 range-out이면 이후 S3가 무엇을 해야 하는가?
- 재쿼리 후 `cves=[]`이면 no-hit인가, incomplete인가, keyword fallback 실패인가?
- version unknown/ambiguous이면 S5를 호출해야 하는가, 아니면 input diagnostic인가?
- NVD keywordSearch fallback 결과를 어느 정도 신뢰할 수 있는가?
- OSV commit match, NVD CPE range, NVD keyword fallback, stale cache, provider timeout을 S3가 어떻게 구분해야 하는가?
- S3 EvidenceCatalog에서 S5 결과가 claim support, knowledge context, operational diagnostic, negative acquisition attempt 중 어디에 들어가야 하는가?

따라서 단순히 CVE endpoint를 강화하는 것만으로는 충분하지 않습니다. S5가 자기 능력/한계/readiness를 먼저 설명해야 합니다.

---

## 제안 1 — S5 Knowledge Coverage Contract v1

S5가 어떤 knowledge surface를 제공할 수 있고, 무엇을 제공하지 않는지 안정적인 top-level contract로 표현합니다.

예상 shape:

```json
{
  "knowledgeCoverageContract": {
    "schemaVersion": "s5-knowledge-coverage-contract-v1",
    "producer": {
      "service": "s5-knowledge-base",
      "version": "0.2.x"
    },
    "providedSurfaces": {
      "weaknessTaxonomy": "provided",
      "attackPatternMapping": "provided",
      "mitigationKnowledge": "provided",
      "publicVulnerabilityKnowledge": "provided",
      "versionRangeEvaluation": "provided",
      "semanticThreatRetrieval": "provided",
      "semanticCodeRetrieval": "conditional",
      "structuralCodeProjection": "conditional",
      "dangerousCallerTraversal": "conditional",
      "projectMemoryContext": "conditional",
      "providerFreshness": "conditional",
      "projectionState": "provided"
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

### 의도

S5는 다음을 명시해야 합니다.

- S5는 knowledge/acquisition/context provider입니다.
- S5는 final vulnerability verdict, clean pass, exploitability judgment를 제공하지 않습니다.
- Threat KB, CVE, code GraphRAG, project memory, projection state는 서로 다른 surface입니다.
- 어떤 surface가 target context, provider readiness, Neo4j/Qdrant projection에 의존하는지 S3가 알 수 있어야 합니다.

---

## 제안 2 — S5 Acquisition Readiness Contract v1

Target context ingest 이후, 또는 S3가 acquisition 계획을 세우기 전에 S5가 각 surface의 준비 상태를 machine-readable하게 반환할 수 있어야 합니다.

예상 shape:

```json
{
  "acquisitionReadiness": {
    "schemaVersion": "s5-acquisition-readiness-v1",
    "targetKnowledgeId": "tctx-...",
    "targetContextVersion": 1,
    "surfaces": {
      "cve": {
        "status": "ready",
        "requiredInputs": ["library.name", "library.version"],
        "precisionBoostInputs": ["repoUrl", "commit"],
        "missingInputs": [],
        "notReadyReasons": [],
        "consumerPolicy": "may_acquire_public_vulnerability_context"
      },
      "threatSearch": {
        "status": "ready",
        "requiredInputs": ["query"],
        "consumerPolicy": "contextual_only"
      },
      "codeSearch": {
        "status": "partial",
        "reasonCodes": ["CODE_VECTOR_PROJECTION_PENDING"],
        "projectionState": "pending",
        "consumerPolicy": "do_not_use_empty_results_as_negative_evidence"
      },
      "dangerousCallers": {
        "status": "not_ready",
        "reasonCodes": ["CODE_GRAPH_NOT_PROJECTED"],
        "consumerPolicy": "do_not_use_as_negative_evidence"
      }
    }
  }
}
```

Recommended status vocabulary:

- `ready`
- `partial`
- `not_ready`
- `input_insufficient`
- `projection_pending`
- `projection_stale`
- `provider_unavailable`
- `unknown`

Every non-ready status should include:

- `reasonCodes[]`
- `consumerPolicy`
- `scope`
- `missingInputs[]` when applicable
- provider/projection state where applicable
- whether retry/reacquire is meaningful

---

## 제안 3 — CVE acquisition을 candidate evaluation과 discovery로 분리

S5 target-scoped CVE acquisition에서 S3가 혼동하지 않도록 두 의미를 분리해야 한다고 봅니다.

### A. Candidate CVE evaluation

질문:

```text
이 library@version이 특정 CVE에 affected인가?
```

예상 input:

```json
{
  "library": {
    "name": "mosquitto",
    "version": "2.0.22",
    "repoUrl": "https://github.com/eclipse/mosquitto.git",
    "commit": "..."
  },
  "candidateCveIds": ["CVE-2021-XXXXX"]
}
```

예상 output semantics:

| Result | Meaning |
|---|---|
| `version_match=true` | 이 CVE가 이 version에 영향 범위로 판단됨 |
| `version_match=false` | 이 특정 CVE는 이 version/scope에서 range-out |
| `version_match=null` | 판단 불가. safe/clean 아님 |

`version_match=false`는 특정 CVE claim을 제외/기각하는 데 사용할 수 있지만, 라이브러리 전체의 안전이나 no-CVE 증거는 아닙니다.

### B. CVE discovery

질문:

```text
이 library@version에 대해 public vulnerability context가 있는가?
```

응답은 기존 AcquisitionEnvelopeV1 vocabulary를 사용합니다.

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

Important rule:

```text
completed_no_hit은 required method set이 explicit scope에서 완료된 경우에만 가능하다.
keyword-only fallback, provider timeout, stale cache only, unknown version, ambiguous identity는 completed_no_hit이 아니다.
```

---

## 제안 4 — 재쿼리 결과에 대한 S3 소비 정책

S5는 S3가 아래처럼 해석할 수 있도록 consumerPolicy와 diagnostics를 제공해야 합니다.

| S5 result | Suggested S3 interpretation |
|---|---|
| candidate CVE `version_match=false` | 해당 specific CVE claim은 제외/기각 가능 |
| discovery `completed_no_hit` | explicit library/version/scope에서 public CVE evidence 없음. 단 clean/safe 아님 |
| discovery `completed_hit` | public vulnerability knowledge context 확보 |
| discovery `partial_hit` | 일부 item만 hit. itemAcquisitions 기준 개별 소비 |
| `incomplete_acquisition` | CVE 없음으로 해석 금지 |
| keyword-only unverifiable | no-hit 금지. contextual/diagnostic only |
| `input_insufficient` | S3/S4 input 보강 필요. negative evidence 아님 |
| `timeout`, `error`, `not_ready` | operational diagnostic. negative evidence 아님 |
| `stale_cache_only` | stale contextual diagnostic. negative evidence 아님 |

---

## S4 Coverage/Evidence Readiness와의 정렬

S4가 앞으로 다음을 명시하면:

```text
externalVulnerabilityKnowledge = not_provided
semanticGraphRetrieval = not_provided
runtimeBehavior = not_provided
finalSecurityVerdict = not_provided
```

S3는 missing evidence slots를 계산하고 S5를 호출할 수 있습니다.

그때 S5는 다음을 반환해야 합니다.

```text
publicVulnerabilityKnowledge = ready / partial / input_insufficient / provider_unavailable
semanticThreatRetrieval = ready / not_ready
semanticCodeRetrieval = ready / projection_pending / projection_stale / not_ready
structural projection / dangerous caller traversal readiness
```

즉 S4는 local static evidence의 coverage/readiness를 말하고, S5는 knowledge acquisition의 coverage/readiness를 말해야 합니다.

---

## Minimum fixture set 제안

S5/S3 contract를 검증하려면 최소 다음 fixtures가 필요합니다.

1. **Known library + candidate CVE range-out + discovery no-hit**
   - 특정 CVE는 제외 가능하지만 clean pass는 아님.
2. **Known library + candidate CVE range-out + other CVE hit**
   - 기존 candidate는 기각되지만 다른 public vulnerability context가 존재.
3. **Version unknown**
   - `input_insufficient`, `do_not_use_as_negative_evidence`.
4. **Keyword-only fallback**
   - `completed_no_hit` 금지. `incomplete_acquisition` 또는 caveated diagnostic.
5. **Provider timeout/error**
   - AcquisitionEnvelopeV1 반환. no-hit 금지.
6. **Stale cache only**
   - contextual/diagnostic only. negative evidence 금지.
7. **Projection debt for code search/dangerous callers**
   - empty code result를 no caller/no path로 해석 금지.

---

## S3에게 묻는 질문

S3 관점에서 아래를 검토해 주세요.

1. S5에도 S4와 유사한 `Knowledge Coverage Contract v1`이 필요한가?
2. S3가 S5 acquisition을 계획/소비하려면 `Acquisition Readiness Contract v1`이 충분한가?
3. S3가 원하는 S5 knowledge surface category는 무엇인가?
4. S3 EvidenceCatalog에서 S5 결과를 `knowledge`, `operational`, `negative acquisition attempt`, `contextual evidence` 중 어떻게 분류해야 하는가?
5. Candidate CVE evaluation과 CVE discovery를 분리하는 것이 S3 claim lifecycle에 유용한가?
6. `version_match=false`를 어떤 조건에서 candidate claim 기각 근거로 사용할 수 있는가?
7. `completed_no_hit`을 어떤 method set/scope에서만 허용해야 하는가?
8. NVD keywordSearch fallback은 S3 관점에서 어떤 consumerPolicy를 가져야 하는가?
9. S4 Coverage Contract의 `externalVulnerabilityKnowledge=not_provided`가 S5 acquisition 계획으로 이어지려면 S5가 어떤 readiness fields를 제공해야 하는가?
10. S5 durable ledger implementation 전에 이 contract/docs/fixtures를 먼저 고정하는 순서에 동의하는가?

---

## 요청하는 회신 형태

가능하면 S3 reply WR에서 아래 형식으로 회신해 주세요.

- `PASS / CONDITIONAL / REJECT` on S5 Knowledge Coverage / Acquisition Readiness Contract direction
- S3가 원하는 minimum S5 knowledge coverage fields
- S3가 원하는 minimum acquisition readiness fields
- Candidate CVE evaluation vs discovery 분리에 대한 의견
- S3 EvidenceCatalog mapping 제안
- `completed_no_hit`, keyword fallback, stale cache, provider timeout/error에 대한 S3 소비 규칙
- S5가 다음 implementation phase에서 우선해야 할 1~3개 항목

---

## S5의 현재 판단

S5는 바로 GraphRAG tuning이나 keyword matching 제거로 들어가기보다, 먼저 다음을 확정하는 것이 맞다고 봅니다.

1. `Knowledge Coverage Contract v1`
2. `Acquisition Readiness Contract v1`
3. CVE candidate/discovery fixtures
4. S3 EvidenceCatalog mapping
5. 이후 S5-owned SQL durable acquisition ledger implementation

이 순서가 되어야 S3가 S5를 단순 CVE 재쿼리 도구가 아니라, target-aware knowledge acquisition service로 안정적으로 소비할 수 있습니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
