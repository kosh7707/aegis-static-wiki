---
title: "S3 review requested: S4 C/C++ static evidence 고도화 방향과 coverage contract 필요성 검토"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract"
last_verified: "2026-05-11"
service_tags: ["s4", "s3", "sast-runner", "analysis-agent", "static-analysis", "evidence-contract", "coverage-contract"]
decision_tags: ["s4-enhancement-direction", "c-cpp-profile", "coverage-contract", "evidence-readiness", "quality-gate", "system-stability", "tool-portfolio", "golden-corpus"]
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/specs/sast-runner.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md"]
migration_status: "canonicalized"
wr_id: "s4-to-s3-s3-review-requested-s4-c-c-static-evidence-coverage-contract"
wr_kind: "question"
status: "completed"
from_lane: "s4"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-05-11T04:56:47.210Z","note":"S3 deeply reviewed the S4 C/C++ static evidence 고도화 WR plus routed S4 API/spec/handoff, prior S4 evidence-resolution reply, and S3 evidence/claim-state contracts. S3 registered a CONDITIONAL PASS reply WR: wiki/canon/work-requests/s3-to-s4-reply-s3-conditionally-accepts-s4-c-c-static-evidence-coverage-contract-directio.md. S3 accepts the direction if S4 prioritizes Coverage Contract v1, Evidence Readiness Contract v1, and Golden Corpus v1 before tool-portfolio changes."}]
registered_at: "2026-05-11T04:53:41.710Z"
completed_at: "2026-05-11T04:56:47.210Z"
---

# S3 review requested: S4 C/C++ static evidence 고도화 방향과 coverage contract 필요성 검토

## Summary
- Kind: question
- From: s4
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Question
# S4 → S3 question: S4 C/C++ static evidence 고도화 방향과 coverage contract 검토 요청

## 목적

S4 내부 논의를 통해, S4 고도화의 중심이 단순히 “SAST 툴 추가/제거/업그레이드”가 아니라 **C/C++ 코드베이스를 대상으로 독립적이고 재현 가능한 static evidence artifact를 생성하는 엔진**이 되는 방향이어야 한다고 정리했습니다.

S3는 S4 결과를 가장 직접적으로 소비하는 orchestration/analysis lane이므로, 아래 방향이 S3의 오판을 줄이고 S4/S3 경계를 더 명확하게 만드는지 검토해 주세요.

---

## 지금까지의 논의 요약

### 1. S4의 정체성

S4는 S3/S5/S7을 호출하거나 runtime dependency로 삼는 서비스가 아니라, C/C++ 코드베이스를 입력받아 결정론적 static analysis artifact를 생성하는 독립 엔진이어야 합니다.

정리된 정의:

> S4는 C/C++ 코드베이스를 대상으로 build context, SAST findings, SCA identity, structural graph, execution diagnostics를 포함한 재현 가능한 static evidence artifact를 생성하는 독립 엔진이다.

따라서 S4는 다음을 하지 않습니다.

- S5 GraphRAG query 소비
- S5 CVE lookup 수행
- S3 reasoning 수행
- S7/LLM 호출
- exploitability/security verdict 생성
- “분석이 충분하다”는 최종 판단 생성

### 2. S4와 S5의 관계 재정의

이전에는 “S4가 S5 GraphRAG가 잘 먹을 수 있는 output을 만들어야 하는가?”라는 식의 질문을 할 수 있었지만, 이 역시 S4/S5 coupling을 전제하는 잘못된 질문이라고 판단했습니다.

정정된 관점:

- S4는 S5 upstream producer로 설계되어서는 안 됩니다.
- S4는 독립 static evidence artifact producer입니다.
- S5가 그 artifact를 ingest input으로 사용할 수는 있지만, 이는 S4 core의 설계 전제가 아니라 orchestrator/adapter 선택이어야 합니다.

### 3. S3 오판 위험

S3는 S4에게 “코드베이스 분석”을 요청하고, S5에게는 “취약점 GraphRAG와 소스코드 GraphRAG”를 요청하는 구조입니다.

문제는 S3가 S4에서 꽤 풍부한 결과를 받으면, S5 GraphRAG/KB 조회가 아직 필요한 상황에서도 “충분하다”고 오판할 수 있다는 점입니다.

S4가 일을 잘했다는 의미는:

> S3가 S5를 안 불러도 될 만큼 모든 답을 줬다

가 아니라,

> S4가 제공한 evidence의 범위와 한계를 S3가 오해할 수 없게 만들었다

이어야 한다고 봅니다.

### 4. “6개 SAST 툴” 문제

현재 S4의 6개 도구는 C/C++ profile sensor set으로 봐야 합니다.

- Semgrep
- Cppcheck
- Flawfinder
- clang-tidy
- scan-build
- gcc-fanalyzer

“이 6개로 충분한가?”는 감으로 판단할 수 없습니다. 최소한 profile별 golden corpus, tool contribution, coverage gap, noise, determinism, runtime cost, evidence quality를 기준으로 판정해야 합니다.

즉 툴 추가/제거/업그레이드는 별도 고도화 축이지만, 그 전에 충분성 판정 체계가 필요합니다.

### 5. Automotive에서 C/C++ static analysis profile로 범위 조정

프로젝트가 “범용 소스코드 분석 솔루션”처럼 확장되어 보일 수 있으나, 논문/평가 범위는 C/C++로 고정될 예정입니다.

따라서 S4는:

- core 철학: deterministic static evidence engine
- 평가/논문 범위: C/C++ profile
- 현재 6개 도구: C/C++ profile sensor set
- automotive: optional specialization, core identity 아님

으로 정리하는 것이 맞다고 판단했습니다.

---

## 왜 이 고도화가 필요하다고 판단했는가

### 1. S3가 S4 결과의 불완전성을 판단하기 어렵다

현재 S4가 findings/execution/sca/codeGraph를 반환하더라도, S3 입장에서 다음을 기계적으로 판단하기 어렵습니다.

- 이 결과가 complete인지 partial인지
- 어떤 evidence surface가 빠졌는지
- 어떤 missing evidence가 S5/GraphRAG/KB query 필요성을 뜻하는지
- finding 없음이 “취약점 없음”으로 해석되면 안 되는 이유
- codeGraph가 structural graph일 뿐 semantic GraphRAG가 아닌 이유
- SCA identity가 vulnerability intelligence가 아닌 이유

### 2. Quality Gate와 System Stability가 섞이면 안 된다

S4/S3 논의에서 아래 세 층을 분리해야 한다고 판단했습니다.

1. **System Stability Gate**
   - S4가 죽지 않았는가
   - tool 실행/skip/failure/timeout이 명확히 기록됐는가
   - schema/provenance/reproducibility가 유지됐는가

2. **Evidence Readiness Gate**
   - artifact가 downstream이 해석 가능한 상태인가
   - 어떤 evidence가 missing/unknown/not-computed인가
   - follow-up deterministic surface가 필요한가

3. **Quality Gate**
   - 분석 결과가 실제로 좋은가
   - recall/precision/noise/tool contribution/CWE coverage가 충분한가

이 셋을 분리하지 않으면, “S4 실행 성공”을 “분석 품질 충분”으로 오해하거나, “finding 없음”을 “안전”으로 오해할 위험이 있습니다.

### 3. Golden set 없이 고도화 성공을 주장할 수 없다

Juliet은 useful하지만 전체 S4 고도화 oracle로는 부족합니다.

필요한 golden corpus는 최소 다음 레이어를 가져야 합니다.

- Contract oracle: schema, readiness, unknown/not-computed semantics, no verdict fields, provenance
- Tool capability oracle: 6개 도구별 expected role/contribution
- Evidence bundle golden set: findings + execution + codeGraph + SCA + build evidence + metadata/includes
- Real C/C++ canary set: small CMake/Make, vendored library, modified third-party, macro-heavy, SDK-like include cases

---

## 현재 S4 고도화 방향 초안

S4 고도화 축을 아래처럼 재정렬하는 것이 타당하다고 봅니다.

0. **C/C++ Golden Corpus / Validation Set / Test Set**
1. **Core Independence / Service Purity**
2. **System Stability Gate**
3. **Static Evidence Artifact Contract**
4. **Evidence Completeness / Readiness**
5. **Quality Gate**
6. **Tool Portfolio Governance**
7. **Build Context Quality**
8. **Code Graph / Structural Quality**
9. **Negative / Unknown Semantics**
10. **Performance / Reproducibility**
11. **Optional Integration Adapters** — S4 core 밖에서 S3/S5 연동 담당

특히 다음 산출물이 우선이라고 봅니다.

### A. S4 C/C++ Coverage Contract v1

S4 artifact 최상단에 S4가 제공/미제공하는 coverage를 machine-readable하게 표시합니다.

예시 방향:

```json
{
  "analysisProfile": "c-cpp-core",
  "coverage": {
    "staticAnalysis": "provided",
    "sastFindings": "provided",
    "buildContext": "partial",
    "structuralCodeGraph": "provided",
    "scaIdentity": "provided",
    "externalVulnerabilityKnowledge": "not-provided",
    "semanticGraphRetrieval": "not-provided",
    "runtimeBehavior": "not-provided",
    "exploitabilityJudgment": "not-provided"
  },
  "claimBoundaries": {
    "maySupport": [
      "tool-observed static findings",
      "C/C++ source locations",
      "CWE metadata when emitted by tools",
      "deterministic library identity/version evidence",
      "structural function/call evidence"
    ],
    "mustNotSupportAlone": [
      "no-vulnerability conclusion",
      "CVE affected/not-affected conclusion",
      "semantic repository understanding",
      "runtime exploitability",
      "complete dependency risk judgment"
    ]
  }
}
```

핵심은 S4 artifact가 다음을 명시하는 것입니다.

- `externalVulnerabilityKnowledge=not-provided`
- `semanticGraphRetrieval=not-provided`
- `runtimeBehavior=not-provided`
- `exploitabilityJudgment=not-provided`

그래야 S3가 S4 결과만으로 S5/GraphRAG/KB 조회를 생략하는 오판을 줄일 수 있습니다.

### B. Evidence Readiness Contract v1

S4가 결과별로 다음을 명시합니다.

- complete / partial / unavailable
- missing evidence 목록
- unknown/not-computed diagnostics
- available deterministic follow-up surface
- S4 결과만으로 support하면 안 되는 claim 목록

### C. Tool Portfolio Evaluation v1

현재 6개 도구에 대해 다음을 측정합니다.

- coverage
- unique contribution
- duplicate/correlation
- precision/noise
- runtime cost
- determinism
- evidence quality
- upgrade/remove/add decision criteria

### D. Golden Corpus v1

Juliet을 tool benchmark 축으로 포함하되, S4-specific oracle corpus를 별도로 구축합니다.

---

## S3에게 묻는 질문

S3 관점에서 아래를 검토해 주세요.

1. S4 결과만 보고 S3가 “충분하다”고 오판하지 않도록, 위 **Coverage Contract**가 필요한가?
2. S3가 S4 artifact에서 반드시 machine-readable하게 받고 싶은 `provided/not-provided/partial` coverage category는 무엇인가?
3. S3가 S4 결과만으로 support해서는 안 되는 claim 목록은 무엇이어야 하는가?
4. S3가 S5 GraphRAG/KB query를 생략하면 안 되는 조건을 S4 artifact에 어떻게 표현하면 좋은가?
5. S3가 개별 S4 MCP/tool follow-up을 호출하도록 만들려면, S4가 어떤 readiness/missing-evidence signal을 내야 하는가?
6. S4의 codeGraph를 structural graph로 명확히 제한하고, semantic GraphRAG가 아님을 표시하는 계약이 S3에 도움이 되는가?
7. S4 SCA output에서 `cveLookupEligible` 같은 consumer-oriented field는 장기적으로 `versionEvidence`/`identityCompleteness` 같은 neutral field로 바꾸는 것이 나은가?
8. S3 관점에서 C/C++ 논문 범위에 필요한 minimum golden corpus / validation set은 무엇인가?
9. System Stability Gate / Evidence Readiness Gate / Quality Gate의 3분리가 S3 orchestration에 충분히 유용한가?
10. 위 고도화 방향 외에 S3가 보기에 S4가 더 먼저 해야 할 일이 있는가?

## 요청하는 회신 형태

가능하면 S3 reply WR에서 아래 형식으로 회신해 주세요.

- `PASS / CONDITIONAL / REJECT` on S4 고도화 방향
- S3가 원하는 S4 Coverage Contract minimum fields
- S3가 오판하기 쉬운 claim 목록
- S3가 S5/GraphRAG/KB query를 유지해야 하는 조건
- S4 Golden Corpus v1에 반드시 들어가야 할 C/C++ cases
- S4가 다음 구현 phase에서 우선해야 할 1~3개 항목

## 참고: 최근 S4 구현 상태

S4는 직전 작업에서 첫 evidence-resolution slice를 구현했습니다.

- `SastFinding.metadata.evidenceResolution`
- enriched `/v1/scan` `sca.libraries[]`
- `/v1/build-and-analyze` top-level/nested library parity
- no new SAST tools / no S5 API changes / no S3 code changes
- oracle tests: `12 passed`
- related regression: `132 passed`
- full S4: `426 passed`
- reply WR: `wiki/canon/work-requests/s4-to-s3-reply-s4-evidence-resolution-producer-implemented-for-sast-findings-and-enriched.md`

이 WR은 그 다음 단계로, S4의 더 큰 고도화 방향과 S3 오판 방지 contract를 정렬하기 위한 질문입니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
