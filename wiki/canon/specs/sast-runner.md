---
title: "S4. SAST Runner 기능 명세 (v0.11.2)"
page_type: "canonical-spec"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/specs/sast-runner.md"
original_path: "docs/specs/sast-runner.md"
last_verified: "2026-05-13"
service_tags: ["s4"]
decision_tags: []
related_pages: ["wiki/canon/api/sast-runner-api.md", "wiki/canon/handoff/s4/readme.md", "wiki/canon/roadmap/s4-roadmap.md", "wiki/canon/handoff/s4/build-snapshot-consumer-seam.md"]
migration_status: "canonicalized"
---

# S4. SAST Runner 기능 명세 (v0.11.2)

> SAST Runner는 C/C++ 프로젝트의 보안 분석에 필요한 **결정론적 전처리**를 담당하는 서비스다.
> 6개 SAST 도구 병렬 실행, SCA(라이브러리 식별 + upstream diff), 코드 구조 추출,
> 빌드 메타데이터 추출, 빌드 자동 실행을 하나의 API로 제공한다.
> S2(Backend) 또는 S3(Analysis Agent)가 호출하며, S4(SAST Runner)가 소유한다.

---

## 1. 핵심 설계 원칙

> **결정론적 처리를 최대화하고, LLM의 결정 표면을 최소화한다.**
>
> 도구 선택, 실행, 필터링, 정규화, 라이브러리 식별, evidence-resolution projection은 전부 결정론적.
> CVE 조회는 S5(KB)로 이관됨. LLM에게는 정제된 판단 재료만 전달한다.

---

## 2. 서비스 개요

| 항목 | 값 |
|------|-----|
| 위치 | `services/sast-runner/` |
| 스택 | Python 3.12 + FastAPI + Uvicorn |
| 포트 | 9000 |
| 버전 | v0.11.2 |
| API 계약 | `wiki/canon/api/sast-runner-api.md` |
| 테스트 | 648개 통과 (2026-05-13 Corpus Readiness Gate v1 및 docs-sync 재검증 후 전체 pytest 재확인, latest `648 passed in 24.66s`) |
| 도구 생존성 | current six 모두 available (2026-05-12 local probe), `policyStatus="ok"`, `unavailableTools=[]` |
| 품질 Gate | local harness fixture 기준 `corpusReadinessGate.status="blocked"`, `qualityGate.status="not_decision_grade"`, `qualityGate.localQualityAssessment.status="fail"`; validation/test fail, canary pass |

---

## 3. 엔드포인트 (12개)

| 엔드포인트 | 용도 |
|-----------|------|
| `POST /v1/scan` | 6개 SAST 도구 병렬 + 실행 보고서 + SDK 해석 + scope-early + 노이즈 필터링. **Build Snapshot provenance 입력/echo + degraded-aware NDJSON 스트리밍 + omission policy gate + evidence-resolution metadata/enriched SCA projection** 지원 |
| `POST /v1/functions` | clang AST -> 함수+호출 관계 + origin 태깅 |
| `POST /v1/includes` | gcc -E -M -> 인클루드 트리 |
| `POST /v1/metadata` | gcc -E -dM -> 타겟 매크로/아키텍처 |
| `POST /v1/libraries` | 라이브러리 식별 + upstream diff (CVE는 S5로 이관) |
| `POST /v1/build` | caller가 완전히 materialize한 build command/environment를 그대로 실행. **structured `buildEvidence` + `readiness` + `failureDetail`** 반환 |
| `POST /v1/build-and-analyze` | explicit build command/environment로 빌드 후 나머지 분석 수행. **convenience surface** |
| `POST /v1/discover-targets` | 프로젝트 내 빌드 타겟 자동 탐색 (파일시스템 스캔) |
| `GET /v1/health` | 6개 도구 상태 + 버전 + backward-compatible health policy surface + request-aware summary |
| `GET /v1/requests/{requestId}` | durable ownership status 조회 |
| `GET /v1/requests/{requestId}/result` | retained terminal result/failure 조회 |
| `DELETE /v1/requests/{requestId}` | durable ownership best-effort cancel. active request는 `state=cancelled`, `REQUEST_CANCELLED` result로 terminal 처리 |

---

## 4. 입력 모드 (3단계)

| 레벨 | 입력 | 사용자 부담 | 정확도 |
|------|------|-----------|--------|
| 최소 | `projectPath`만 | 없음 | 중간 |
| 권장 | `projectPath` + `buildCommand` | 빌드 명령어 | **높음** (compile_commands 자동 생성) |
| 고급 | `projectPath` + `compileCommands` + `buildProfile` | 수동 제공 | 최고 |

### 주요 입력 파라미터

- analysis path에서는 `buildProfile`을 계속 사용한다. build path는 더 이상 `sdkId`를 받지 않는다
- analysis path의 SDK contract는 `none`, `non-registered`, S4-local `{sdkId}` 세 가지다. `sdkResolutionMode="none"`은 registry lookup을 금지하고, `sdkResolutionMode="non-registered"`는 caller-resolved `sdkDescriptor.sdkRootPath`를 필수로 한다
- 알 수 없는 bare `buildProfile.sdkId`는 source-only fallback으로 조용히 진행하지 않고 `SDK_NOT_FOUND` 400으로 실패한다. `custom` sentinel은 no-SDK 의미가 아니며, S4 registry 밖 SDK는 `non-registered` descriptor로 전달해야 한다
- `options.tools`: 도구 서브셋 선택 (예: `["cppcheck", "flawfinder"]`). 미지정 시 6개 전부
- `thirdPartyPaths`: vendored 서드파티 경로 목록. scope-early 필터링에 사용
- `X-Timeout-Ms` 헤더: 타임아웃 우선순위 — 헤더 > body `options.timeoutSeconds` > 기본값 600초

---

## 5. SAST 도구 (6개)

| 도구 | 역할 | CWE 태깅 | profile | 비고 |
|------|------|:---:|:---:|------|
| Semgrep | 패턴 매칭 + **taint mode** | O (SARIF) | — | C++ 프로젝트에서 확장자 필터 (`--include *.c *.h`). 커스텀 룰 39개 / 9 YAML |
| Cppcheck | 코드 품질 + CTU | O (XML) | **original** | SDK 헤더 제외. `--check-level=exhaustive` |
| clang-tidy | CERT 코딩 표준 + 버그 (CWE 매핑 24개) | O | **enriched** | SDK 헤더 포함 |
| Flawfinder | 위험 함수 빠른 스캔 | O (regex) | — | |
| scan-build | Clang Static Analyzer (CWE 매핑 15개) | O | **enriched** | `-plist` 필수. 파일별 개별 실행. `Semaphore(8)` |
| gcc -fanalyzer | GCC 경로 민감 분석 (CWE 매핑 16개 + 출력 직접 파싱) | O | **original** | `-c` 필수. 파일별 개별 실행. `Semaphore(8)`. GCC 10+ 필요 |

### Current tool-liveness snapshot (2026-05-12)

`ScanOrchestrator.check_tools(force=True)` 로 재확인한 current six 상태:

| 도구 | available | observed version / probe |
|------|:---:|------|
| Semgrep | O | `1.156.0` |
| Cppcheck | O | `2.13.0` |
| Flawfinder | O | `2.0.19` |
| clang-tidy | O | `18.1.3` |
| scan-build | O | `scan-build` help probe OK |
| gcc-fanalyzer | O | GCC `13.3.0` |

Health policy result: `policyStatus="ok"`, `policyReasons=[]`, `unavailableTools=[]`.
This is a **system-stability/liveness** snapshot only; it is not a quality or vulnerability verdict.

### Benchmark Slice Report v1

S4 keeps offline historical Juliet benchmark-slice evidence in `benchmark/benchmark_slice_report.py`. The report reads exactly two pinned artifacts: `benchmark/data/baselines/v0.6.0-full.json` for variant-01 recall/precision/FP/F1 evidence and `benchmark/data/baselines/v0.7.0-all-variants.json` for all-variant recall/noise/noisePerFile evidence. Metrics remain source-scoped and are not merged into one quality score.

Tool Portfolio Governance v1 consumes this as `benchmarkSliceCoverage`; it is evidence for future tool-change review only and does not alter runtime `qualityEvaluation`.

### Tool Output Compatibility v1

S4 now keeps parser compatibility fixtures for all six current tools under `tests/fixtures/tool_output_compat_v1/`. The manifest `schemaVersion="s4-tool-output-compat-v1"` locks representative raw output shapes for Semgrep SARIF, Cppcheck XML, Flawfinder CSV, clang-tidy text, scan-build plist, and gcc-fanalyzer text.

`benchmark/tool_output_compat.py` parses these fixtures without executing external tools and emits `s4-tool-output-compat-report-v1`. Tool Portfolio Governance v1 consumes that report through the `parserCompatibility` gate before any add/remove/upgrade claim.

### Corpus Readiness Gate v1 (2026-05-13)

Tool Portfolio Experiment reports now embed `corpusReadinessGate` with schema `s4-tool-portfolio-corpus-readiness-gate-v1`.

This gate is offline and deterministic:

- it takes explicit `required_corpora` such as `juliet-c-cpp-1.3`;
- validates acquisition manifest presence and local `localPath`;
- rejects unsafe external case paths, missing case files, checksum mismatches, and missing validation/test splits;
- sets `decisionGradeReady=true` only when required external corpora are available and checked;
- derives compatibility `decisionSupport.externalCorpusStatus` from readiness rather than relying on hardcoded fixture status.

Current generated harness report:

- `corpusReadinessGate.status="blocked"`;
- `corpusReadinessGate.decisionGradeReady=false`;
- `corpusReadinessGate.reasonCodes=["LOCAL_JULIET_CORPUS_NOT_PRESENT"]`;
- `decisionSupport.externalCorpusStatus.juliet.status="blocked"`.

This is not a runtime `/v1/scan` API change. It is the offline experiment/report preflight that prevents S4-owned synthetic fixtures from being mistaken for decision-grade Juliet/SARD evidence.

### Local Quality Gate status (2026-05-13)

The current S4-owned harness fixture report (`benchmark/results/tool_portfolio/s4-harness-fixture-report-v1.json`) intentionally separates split scoring success from threshold quality:

| split | metric bucket status | local threshold status | reason |
|---|---:|---:|---|
| validation | pass | fail | `FINDING_PRECISION_BELOW_THRESHOLD` |
| test | pass | fail | `FINDING_PRECISION_BELOW_THRESHOLD`, `NEGATIVE_TARGET_FPR_ABOVE_THRESHOLD` |
| canary | pass | pass | no local threshold failure |

Top-level report state:
- `corpusReadinessGate.status="blocked"` and `qualityGate.status="not_decision_grade"` because no pinned local Juliet/SARD decision-grade corpus is present (`LOCAL_JULIET_CORPUS_NOT_PRESENT`).
- `qualityGate.localQualityAssessment.status="fail"` because validation/test synthetic local oracle thresholds intentionally fail.
- `negativeTargetFpr=null` means a split has no negative targets and must not trigger `maximumNegativeTargetFpr`.
- Tool liveness/system stability, corpus readiness, and local quality assessment remain separate: all six tools can be alive while local corpus readiness is blocked or quality thresholds fail.

### 도구 최소 버전

| 도구 | 최소 버전 | 비고 |
|------|---------|------|
| Semgrep | >= 1.40 | SARIF 출력 안정성 |
| Cppcheck | >= 2.13 | `--check-level=exhaustive` 지원 |
| Flawfinder | >= 2.0.19 | CSV 출력 형식 호환 |
| clang-tidy | >= 16 | CERT 체커 세트 완성도 |
| scan-build | >= 16 | plist 출력 안정성 |
| gcc (fanalyzer) | >= 10 | `-fanalyzer` 동작. 13+ 권장 (정밀도 개선) |
| bear | >= 3.0 | `compile_commands.json` 생성 |
| clang (AST dump) | >= 16 | `-ast-dump=json` 형식 호환 |

서버 시작 시 `check_tools()`가 버전을 확인하고, 최소 버전 미만 시 경고 로그를 기록한다 (차단하지 않음). 결과는 TTL 300초로 캐시.

### 도구 omission / skip 정책

- 허용된 skip만 성공 가능
- allowed skip taxonomy: `operator-requested-subset`, `profile-not-applicable`
- disallowed omission taxonomy: `runtime-tool-missing`, `environment-drift`, `tool-check-failed`
- sync `/v1/scan`은 비허용 omission 시 HTTP 503 + failed response로 종료
- NDJSON는 final `type="error"` 이벤트를 authoritative exception surface로 사용
- `/v1/build-and-analyze`는 build evidence를 유지한 채 inner scan failure를 outer failure로 전파

### 도구 자동 선택

| 조건 | 동작 |
|------|------|
| C++ 프로젝트 | Semgrep **확장자 필터**: `.c`/`.h` 파일만 스캔 (`--include` 플래그). 스킵하지 않음 |
| 호스트 gcc 미지원 + SDK에 GCC 10+ | gcc-fanalyzer **SDK 컴파일러로 재확인** → 사용 가능하면 활성화 |
| clang 미설치 | scan-build, clang-tidy 스킵 |
| `options.tools` 명시 | 지정된 도구만 실행 |

### 도구별 profile 분리

오케스트레이터가 도구에 전달하는 BuildProfile이 다르다:

| 도구 | 전달되는 profile | 이유 |
|------|:---:|------|
| clang-tidy, scan-build | **enriched** (SDK 헤더 포함) | 컴파일 기반 — 헤더가 있어야 분석 가능 |
| Cppcheck | **original** (사용자 경로만) | SDK 헤더 -I 시 전부 파싱하여 타임아웃 |
| gcc-fanalyzer | **original** (사용자 경로만) | 호스트 gcc 폴백 시 ARM 헤더 불일치 방지 |
| Semgrep, Flawfinder | 없음 | 텍스트/패턴 기반 |

---

## 6. scope-early 필터링

`thirdPartyPaths`에 해당하는 파일을 **도구 실행 전에 제외**하여 OOM과 불필요한 분석을 방지한다.

### 적용 범위

| 도구 | scope-early 적용 | 이유 |
|------|:---:|------|
| clang-tidy, scan-build, gcc-fanalyzer | **O** (scoped_files) | 파일별 개별 실행 — 파일 수가 직접 비용 |
| Cppcheck | X (scan_dir 전체) | `--project=` 기반, 전체 디렉토리 필요 |
| Semgrep, Flawfinder | X (scan_dir 전체) | 텍스트 기반, 경량 |

### 필터링 파이프라인 (3단계)

```
1. [scope-early] thirdPartyPaths 파일 → 도구 실행 전 제외 (heavy analyzer만)
2. [도구 실행] 6개 도구 병렬
3. [post-filter] SDK 절대 경로 + 서드파티 상대 경로 findings 제거
   └── 단, dataFlow에 사용자 코드 step이 있으면 "cross-boundary"로 유지
```

---

## 7. 경계면 분석 (cross-boundary)

SDK/라이브러리 경로 finding이라도 **dataFlow에 사용자 코드가 포함**되면 유지한다.

### 분류 기준

| 조건 | 결과 |
|------|------|
| 절대 경로 (SDK/시스템 헤더) + dataFlow에 사용자 코드 없음 | 제거 (`sdk_noise_removed`) |
| 절대 경로 + dataFlow에 사용자 코드 있음 | 유지, `origin: "cross-boundary"` |
| thirdPartyPaths 해당 + dataFlow에 사용자 코드 없음 | 제거 (`third_party_removed`) |
| thirdPartyPaths 해당 + dataFlow에 사용자 코드 있음 | 유지, `origin: "cross-boundary"` |
| 그 외 상대 경로 | 사용자 코드 — 유지 |

### 실행 보고서 (FindingsFilterInfo)

```json
{
  "beforeFilter": 150,
  "afterFilter": 120,
  "sdkNoiseRemoved": 20,
  "thirdPartyRemoved": 10,
  "crossBoundaryKept": 5,
  "filesScopedOut": 45
}
```

---

## 8. SCA (Software Composition Analysis)

### 라이브러리 식별

프로젝트 내 vendored 라이브러리를 자동 탐지:
- 탐색 경로: `libraries/`, `lib/`, `libs/`, `third_party/`, `vendor/`, `deps/`, `external/`, `contrib/`, `ext/`, `transport/`
- `.git` 디렉토리 -> 커밋 해시 + 리모트 URL + `git describe --tags`
- CMakeLists.txt -> `project(name VERSION x.y.z)`
- configure.ac -> `AC_INIT([name], [version])`
- 서브 라이브러리 재귀 탐색

### upstream diff

- SHA256 파일 해시 비교 (패키징/줄 끝 차이에 면역, 소스 코드만)
- **DiffResult 통일 shape**: 성공/에러 모두 동일한 필드 구조 (nullable)
  ```json
  {
    "matchedVersion": "v1.16.0",
    "repoUrl": "https://...",
    "matchRatio": 0.95,
    "identicalFiles": 10,
    "modifiedFiles": 2,
    "addedFiles": 1,
    "deletedFiles": 0,
    "modifications": [...],
    "error": null
  }
  ```
- **CloneCache**: TTL 기반 git clone 캐시 (`/tmp/aegis-lib-cache/`). 동일 repo 재요청 시 `git fetch`만 수행
  - 설정: `SAST_LIB_CACHE_DIR`, `SAST_LIB_CACHE_TTL` (기본 3600초)

### CVE 조회 -> S5 이관 (2026-03-19)

CVE 조회는 S5(KB) `POST /v1/cve/batch-lookup`으로 이관됨. S3 Agent가 S4의 `/v1/libraries` 또는 `/v1/scan` enriched `sca.libraries[]` evidence(`name`, `version`, `repoUrl`, `commit`, `cveLookupEligible`)를 S5에 전달하여 조회.

---

## 8-1. Evidence resolution projection (2026-05-11)

S4는 SAST finding과 SCA library item에 deterministic evidence-resolution metadata를 추가한다. 이 레이어는 LLM·CVE 조회·보안 판정 없이 “무엇을 관측했는지 / 무엇이 비어 있는지 / 왜 downstream이 조심해야 하는지”만 구조화한다.

### SAST finding evidence

- `SastFinding.metadata.evidenceResolution` 아래에만 추가한다. 기존 `metadata.cweId`, `metadata.cwe`, tool-specific metadata는 유지한다.
- 포함 항목: `schemaVersion=s4-evidence-v1`, `kind=sast-finding`, `toolId`, `ruleId`, CWE known/unknown status, location presence, dataflow presence/step count, origin status, diagnostics.
- unknown CWE/dataflow는 각각 `CWE_UNKNOWN`, `DATAFLOW_NOT_PROVIDED` diagnostic으로 표현한다. 이것은 안전/무해하다는 뜻이 아니다.
- forbidden verdict keys: `vulnerable`, `safe`, `affected`, `clean`, `riskScore`, `securityVerdict`.

### SCA library evidence

- `/v1/scan` `sca.libraries[]`와 `/v1/build-and-analyze` top-level `libraries[]`는 enriched additive item shape를 사용한다. 기존 `name`, `version`, `path`, `repoUrl` reader는 계속 동작한다.
- 추가 필드: `source`, `commit`, `branch`, `tag`, `nearestTag`, `identificationConfidence`, `versionStatus`, `versionConfidence`, `cveLookupEligible`, `versionEvidence`, `diagnostics`, `diffAvailable`, `modificationStatus`, `diffSummary`, `provenance`.
- `/v1/scan`은 full upstream diff를 강제하지 않는다. diff 미계산 시 `diffAvailable=false`, `modificationStatus="unknown"`, `diffSummary=null`, diagnostic `DIFF_NOT_COMPUTED`를 사용한다.
- versionless known library는 drop하지 않는다. `version=null`, `versionStatus="unknown"`, `versionConfidence="none"`, `cveLookupEligible=false`, diagnostic `VERSION_UNKNOWN`으로 보존한다.
- caller provenance가 있으면 per-library `provenance`에 echo하고 `libraryPath`를 추가한다. caller provenance가 없으면 `null`이다.

### Oracle fixture/test gate

`tests/fixtures/evidence_oracles/**`와 `tests/test_evidence_oracles.py`가 이 계약의 executable oracle이다. 테스트는 known SAST finding, unknown semantics, cross-boundary origin, idempotency, CMake library, versionless library, git commit/branch/tag evidence, no-S5/static guard, verdict-key recursion guard, `/v1/scan` SCA projection, `/v1/build-and-analyze` parity를 잠근다.

---

## 8-2. Static Evidence Contract v1 (design gate, 2026-05-11)

S4는 `wiki/canon/specs/sast-runner-static-evidence-contract.md`의 `staticEvidenceContract`를 `/v1/scan` 및 `/v1/build-and-analyze`에 additive로 부착한다. 이 계약은 S4가 제공한 결정론적 C/C++ 정적 evidence의 커버리지와 readiness를 기계가 읽을 수 있게 표현하고, downstream이 S4 evidence를 CVE/GraphRAG/runtime/final verdict evidence로 오판하지 못하게 한다.

핵심 원칙:
- S4는 local static evidence artifact producer다. 외부 취약점 지식, semantic graph retrieval, runtime behavior, exploitability judgment, final security verdict는 `not_provided`로 명시한다.
- 코드그래프는 structural-only다. 제공 시 `graphKind="structural-callgraph"`, `semanticRetrieval="not_provided"`, `graphRag="not_provided"`를 포함한다.
- `gates.systemStability`, `gates.evidenceReadiness`, `gates.qualityEvaluation`을 분리해 운영 안정성, evidence readiness, validation/golden-corpus 품질평가를 혼동하지 않는다.
- `gates.claimSupportReadiness`는 runtime-local claim-support classifier다. `qualityEvaluation`과 달리 validation score가 아니며, concrete tool identity 대신 normalized evidence surface와 claim boundary 기준만 사용한다.
- 성공 응답 안의 per-tool anomaly(`partial`, `failed`, degraded `ok`, blocking skip, missing/not-recorded, unknown)는 `systemStability=degraded`와 `coverage.staticToolExecution=partial`로 전파한다. 단일 tool failure는 정책 실패가 붙지 않는 한 artifact `fail`이 아니라 successful-but-degraded artifact다.
- `claimBoundaryMatrix[]`는 `local-static-artifact`, `reported-finding-positive-evidence`, `absence-of-vulnerability`, `cwe-absence`, `build-configuration-dependent-negative-claim`, runtime/external/semantic/final-verdict claim rows를 제공한다. empty findings는 계속 absence evidence가 아니다.
- `toolEvidenceMatrix`는 현재 6개 도구 각각의 role, unique contribution, overlap, limitation, execution status, skip/degrade metadata, consumerPolicy를 stable order로 제공한다. 이는 기존 v1 schema 안의 additive field이며, S3가 raw `execution.toolResults`만으로 도구 의미를 추론하지 않도록 하기 위한 runtime-local matrix다.
- `followUpHints`와 `missingEvidence`는 neutral readiness metadata만 허용한다. 서비스 호출, hard orchestration command, S5 API request shaping, verdict field는 금지다.
- `cveLookupEligible`은 backward-compatible SCA identity hint로 유지하되, 외부 취약점 지식 제공으로 해석하지 않는다.


구현 상태:
- runtime `/v1/scan` 및 `/v1/build-and-analyze` success/policy-failure path에 `staticEvidenceContract`가 붙는다.
- `qualityEvaluation`은 runtime에서 `not_evaluated`이며, 별도 `benchmark/static_evidence_report.py` validation profile이 실행됐을 때만 report artifact에서 quality result를 채운다.
- Golden Corpus v1 manifest는 contract oracle, six-tool capability oracle, evidence bundle, vulnerability-family canary 네 layer를 가진다. Evidence bundle은 scan contract, structural graph, SCA diff partial, degraded execution, policy failure를 포함하며, canary는 CWE-120, CWE-190, CWE-416을 포함한다.
- Tool Portfolio Governance v1의 현재 결정은 `keep-current-six-tools`이며, 새 SAST 도구 추가/제거/업그레이드는 하지 않았다.
- Per-tool anomaly gate propagation은 direct helper tests와 `/v1/scan`, `/v1/build-and-analyze` endpoint tests로 고정됐다.
- Consumer canary harness는 precomputed full-response JSON fixtures만 소비하며, top-level/nested `staticEvidenceContract`에서 gates/coverage/claimBoundaries/toolEvidenceMatrix만 읽어 local contract readiness를 검증한다. Raw `execution.toolResults` poisoning은 해석에 영향을 주면 안 된다.



---

## 9. 코드 구조 추출

clang AST 기반 함수+호출 관계:
- `projectPath` 모드 -- 실제 프로젝트 디렉토리에서 헤더 포함 분석
- `NamespaceDecl` 재귀 순회 (C++ namespace 함수 지원)
- `CallExpr` -> `ImplicitCastExpr` -> `DeclRefExpr` + `MemberExpr` 처리
- 3단계 필터링: `loc.file` + `source_lines` + `CompoundStmt`
- 사용자 코드 함수만 반환 (시스템/SDK 함수 제외)
- **skip_paths**: vendored/third-party 경로는 clang 실행 전 조기 스킵
- **병렬화**: `asyncio.gather` + `Semaphore(16)` 동시 실행

### origin 태깅 (서드파티 출처 식별)

`projectPath` 모드에서 라이브러리 식별 결과와 함수 파일 경로를 교차 대조:
- `origin: "third-party"` -- 라이브러리 경로 하위 + matchRatio 100% (원본)
- `origin: "modified-third-party"` -- matchRatio < 100% (사용자 수정)
- 필드 없음 -> 프로젝트 코드
- `originalLib`, `originalVersion` 포함 (S5 코드 그래프 + S3 LLM 분석에 활용)

### 코드그래프 품질 평가 기준

S4가 생성하는 코드그래프는 S5(KB)에 ingest되어 호출 체인 분석, 위험 함수 역추적, 시맨틱 검색에 사용된다. 그래프 품질이 S3 Agent의 분석 정확도에 직접 영향을 주므로, 아래 6개 메트릭으로 품질을 관리한다.

#### 메트릭 정의

| 메트릭 | 정의 | 임계값 | 의미 |
|--------|------|:---:|------|
| **Function Recall** | `추출_매칭 / 기대_함수수` | >= 90% | 사용자 코드 함수를 빠짐없이 추출하는가 |
| **Function Precision** | `추출_매칭 / 실제_추출수` | >= 90% | 시스템/헤더 함수가 혼입되지 않는가 |
| **Call Recall** | `매칭_호출 / 기대_호출수` | >= 80% | 함수 간 호출 관계를 빠짐없이 캡처하는가 |
| **Call Precision** | `매칭_호출 / 실제_호출수` | >= 85% | 존재하지 않는 호출이 생성되지 않는가 |
| **Origin Accuracy** | `정확_태깅 / 전체_태깅` | 100% | 서드파티 출처 분류가 정확한가 |
| **Parse Rate** | `파싱_성공_파일 / 전체_소스_파일` | 100% | clang이 모든 소스를 정상 파싱하는가 |

#### 알려진 한계

| 패턴 | 캡처 여부 | 이유 |
|------|:---:|------|
| 직접 함수 호출 `foo()` | O | `CallExpr` → `DeclRefExpr` |
| 멤버 함수 호출 `obj.method()` | O | `MemberExpr` |
| 함수 포인터 `ptr()` | **X** | `DeclRefExpr` 없음. 호출 대상 미확정 |
| 매크로 확장 호출 | 부분 | 확장 결과에 `CallExpr`가 있으면 O |
| C++ virtual call | 부분 | 정적 타입 기준 `MemberExpr`로 캡처 |
| `__attribute__` 함수 | X | `__` prefix 필터링 |

#### 평가 인프라

- **Ground truth fixture**: `tests/fixtures/codegraph_project/` — 5개 .c 파일, 10개 함수, 크로스 파일 호출, 서드파티 라이브러리
- **Ground truth JSON**: `tests/fixtures/codegraph_project/expected_codegraph.json` — 기대 함수, 호출, origin 태깅, 임계값
- **평가 엔진**: `benchmark/codegraph_evaluator.py` — `evaluate_codegraph()`, `evaluate_origin()`
- **테스트**: `tests/test_codegraph_quality.py` — 13개 테스트 (`pytest -m integration -k codegraph`)
  - 기본 품질 메트릭 (recall, precision, parse rate, 임계값 일괄)
  - 헤더 필터링 (시스템 함수, builtin 함수 미혼입)
  - Origin 태깅 (unmodified, modified, user code)
  - Skip paths (서드파티 제외)
  - 그래프 연결성 (크로스 파일 호출, 위험 함수, edge density)

#### 그래프 연결성 지표

S5 ingest 후 유용성을 결정하는 보조 지표:

| 지표 | 설명 | 기대 범위 |
|------|------|----------|
| 크로스 파일 호출 | 서로 다른 파일 간 호출 edge 존재 | 1개 이상 |
| 위험 함수 도달성 | `system`, `strcpy` 등 호출이 그래프에 포함 | S5 `dangerous-callers` 동작 전제 |
| Edge density | 함수당 평균 호출 수 | 1.0 ~ 10.0 |

---

## 10. 빌드 자동 실행

`bear -- buildCommand` -> `compile_commands.json` 자동 생성.

### build path 실행 원칙

### `/v1/build` 옵션

- `buildCommand`: **필수**. S4는 자동 감지하지 않음
- `buildEnvironment`: caller가 제공하는 명시적 환경변수
- `wrapWithBear`: 기본 true. false면 bear 없이 순수 빌드 실행
- `userEntries` 필드: CMakeFiles/ 임시 항목 자동 필터링
- `exitCode != 0` → 항상 `success: false`
- `readiness` 필드가 canonical build-preparation contract다
- `readiness.status="ready"` 는 `userEntries > 0` 이고 `exitCode == 0` 인 경우에만 성립한다
- `readiness.status="partial"` 는 일부 user-target compile entry가 있어도 build가 실패한 상태다. canonical Quick 입력으로 사용하지 않는다
- `compile_commands.json` 이 존재해도 user-target entry가 하나도 없으면 `compile-commands-no-user-entries` 로 실패한다
- caller input이 잘못되면 S4는 추론/보정하지 않고 그대로 실패를 반환
- `/v1/scan` 응답: `response_model_exclude_none` — null 필드는 JSON에서 생략

### explicit Quick contract

- canonical Quick는 `/v1/build` 성공 후 `readiness.compileCommandsReady=true` 를 확인하고,
  해당 `buildEvidence.compileCommandsPath` 를 `POST /v1/scan` 의 `compileCommands` 입력으로 넘기는 one-shot 호출이다
- S4는 Quick 호출이 Deep으로 자동 이어진다고 가정하지 않는다
- Quick authoritative output은 `/v1/scan` 의 `findings`, `stats`, `execution`, `provenance` 다

---

## 11. SDK 해석 계약과 내부 SDK 데이터 (analysis path only)

analysis path의 `BuildProfile` SDK 해석은 아래 세 모드로 제한된다.

| 모드 | 요청 | 동작 | 실패 |
|------|------|------|------|
| none | `sdkResolutionMode="none"` | SDK 없음. registry/compiler/env setup lookup 금지 | `sdkId`/`sdkDescriptor` 동반 시 `SDK_PROFILE_INVALID` |
| non-registered | `sdkResolutionMode="non-registered"` + `sdkDescriptor.sdkRootPath` | caller-resolved SDK descriptor에서 include/sysroot/compiler/setup 후보를 결정론적으로 산출. registry lookup 금지 | descriptor/root 누락 시 `SDK_PROFILE_INVALID` |
| S4-local sdkId | `sdkId="..."` | `$SAST_SDK_ROOT/sdk-registry.json` 또는 SDK root 규칙으로 해석 | unknown bare sdkId는 `SDK_NOT_FOUND` |

`non-registered` descriptor는 `sdkRootPath`, `sysroot`, `setupScript`, `toolchainTriplet`, `compilerPath`, `compilerVersion`, `targetArch`, `languageStandard`, `includePaths`, `defines`, `environment`를 additive metadata로 받을 수 있다. 필수 필드는 `sdkRootPath` 하나이며, 나머지는 있을 때만 deterministic enrichment에 사용된다.

외부 파일(`$SAST_SDK_ROOT/sdk-registry.json`)로 S4-local SDK 메타데이터를 관리한다.

```
$SAST_SDK_ROOT/               <- .env 예시: SAST_SDK_ROOT=/opt/sdks (환경별로 교체)
  |- sdk-registry.json         <- SDK 메타데이터 (외부 설정, 코드 밖)
  +- ti-am335x/                <- sdkId = 폴더명
```

### 의미

- 이 데이터는 **analysis path 내부 해석용**으로만 남아 있다.
- `/v1/sdk-registry` public API는 제거되었다.
- build path는 더 이상 `sdkId`를 받지 않으므로 이 레지스트리에 의존하지 않는다.
- S3/S2가 정식 SDK upload/registration 루트를 타지 않는 실험/서비스 단독 테스트에서는 `sdkId` 임의 sentinel 대신 `non-registered` descriptor를 보내야 한다.

---

## 12. 커스텀 Semgrep 룰

`rules/automotive/` 디렉토리에 자동차 임베디드 특화 룰 39개 (9 YAML 파일).

| 파일 | CWE | 룰 수 | 모드 |
|------|-----|:---:|------|
| divide-by-zero.yaml | CWE-369 | 6 | **taint** (atoi/rand -> division sink) + **sanitizer** (if != 0) + 패턴 |
| integer-overflow.yaml | CWE-190 | 6 | **taint** (atoi/rand -> arithmetic sink) + **sanitizer** (bounds check) + MAX 상수 + 패턴 |
| use-after-free.yaml | CWE-416 | 4 | **taint** (free -> use sink) + **sanitizer** (= NULL/malloc/calloc/realloc) + 패턴 |
| command-injection.yaml | CWE-78 | 5 | 패턴 |
| buffer-overflow-write.yaml | CWE-787 | 4 | 패턴 |
| input-validation.yaml | CWE-20 | 5 | taint |
| taint-sources.yaml | 다수 | 5 | taint (recv/read/fgets -> 위험 함수) |
| hardcoded-credentials.yaml | CWE-798 | 2 | 패턴 |
| weak-prng.yaml | CWE-338 | 2 | 패턴 |

### taint mode + sanitizer

taint 룰은 **source -> sink** 데이터 플로우를 자동 추적하며, **sanitizer** 패턴이 있으면 가드된 코드를 제외한다:

```yaml
# 예: divide-by-zero taint rule
pattern-sources:
  - pattern: atoi(...)
pattern-sinks:
  - patterns:
      - pattern: $X / $SINK
      - focus-metavariable: $SINK
pattern-sanitizers:              # <- FP 감소
  - patterns:
      - pattern-inside: |
          if ($SINK != 0) { ... }
      - focus-metavariable: $SINK
```

전 룰에 `automotive_rationale` + ISO 26262/MISRA/AUTOSAR/CERT 참조 포함.

---

## 12-1. NDJSON 스트리밍 진행 지표 (v0.11.1)

`POST /v1/scan`의 NDJSON 스트리밍 모드에서 heartbeat에 진행 상태를 포함한다.

### heartbeat 포맷

```json
{"type":"heartbeat","timestamp":...,"status":"running","progress":{"activeTools":["gcc-fanalyzer"],"completedTools":["semgrep"],"findingsCount":12,"filesCompleted":5,"filesTotal":20,"currentFile":"src/main.c"}}
```

- `status`: `"queued"` (세마포어 대기) | `"running"` (분석 중)
- `progress`: `running` 상태에서만 포함
- `filesCompleted/filesTotal`: per-file 도구(gcc-fanalyzer, scan-build)의 합산
- `activeTools`: subprocess 생존 증거 (False Alive 방지)

### 동시성 세마포어

`SAST_MAX_CONCURRENT_SCANS` 환경변수 (기본 2). 초과 요청은 내부 큐 대기 + `queued` heartbeat 전송.

### metadata.cweId (v0.9.0)

`SastFinding.metadata.cweId`에 대표 CWE 식별자(단일 string)를 포함한다. 기존 `metadata.cwe`(배열)의 첫 번째 원소. 전 도구에서 CWE가 있을 때 자동 설정. S2가 Finding에 cweId를 매핑하는 데 사용.

---

## 13. 관측성

| 항목 | 값 |
|------|-----|
| service 식별자 | `s4-sast` |
| 로그 파일 | `logs/s4-sast-runner.jsonl` |
| 형식 | JSON structured, `time` epoch ms, `level` 숫자 (pino 표준) |
| 요청 추적 | `contextvars` 기반 `requestId` 전 레이어 전파 |
| X-Request-Id | 수신 -> 로그 기록 -> 응답 헤더 반환 |
| 실행 보고서 | 응답 `execution` 필드에 도구별 상태/시간/버전/스킵 사유 + degraded/file-budget 메타데이터 |
| health backward compatibility | `/v1/health`는 top-level `semgrep` 필드를 유지하면서 `tools` + policy 필드 + `requestSummary` 를 추가 노출 |
| final summary logs | `Scan execution summary`, `Build execution summary`, `Request terminal summary` 로 도구별 집계/빌드 readiness/terminal ack state를 단일 structured event로 노출 |
| startup readiness logs | `SAST Runner runtime configuration` + `SAST Runner ready for traffic` 로 hotReload/config/tool-policy 상태를 노출 |

`wiki/canon/specs/observability.md` 준수.

### ToolExecutionResult

```json
{
  "status": "ok | partial | failed | skipped",
  "findingsCount": 25,
  "elapsedMs": 1200,
  "skipReason": null,
  "timedOutFiles": null,
  "failedFiles": null,
  "filesAttempted": null,
  "batchCount": null,
  "timeoutBudgetSeconds": null,
  "perFileTimeoutSeconds": null,
  "budgetWarning": null,
  "degraded": false,
  "degradeReasons": [],
  "version": "2.13.0"
}
```

- `"partial"`: 파일별 실행 도구(gcc-fanalyzer, scan-build)에서 일부 파일이 timeout되었으나 나머지는 정상 완료
- `timedOutFiles` / `failedFiles`: `"partial"` 상태일 때 timeout/실패한 파일 수 (그 외 상태에서는 `null`)
- `filesAttempted`, `batchCount`, `timeoutBudgetSeconds`, `perFileTimeoutSeconds`, `budgetWarning`, `degraded`, `degradeReasons`: heavy analyzer long-run 상태를 설명하는 추가 메타데이터

### `/v1/health` request-summary contract (v0.11.2)

- `/v1/health?requestId=<request-id>` 는 해당 요청의 최소 polling control signal을 반환한다
- `activeRequestCount` 는 현재 `queued` / `running` 상태인 요청 수다
- 같은 request-summary shape를 `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`에 공통 적용한다
- `requestSummary.state`
  - `queued`: 스캔 세마포어 대기 또는 요청 직후 아직 본 실행 단계로 들어가기 전 상태
  - `running`: 실행 중
  - `completed`: 정상 종료
  - `failed`: 비정상 종료
  - `cancelled`: `DELETE /v1/requests/{requestId}`로 best-effort cancel이 접수되어 terminal 처리된 상태
- `requestSummary.localAckState`
  - `phase-advancing`: scan progress/file progress/runtime-state 또는 build phase completion처럼 최근의 실제 로컬 진행 전이가 관측된 상태
  - `transport-only`: build / build-and-analyze의 장시간 컴파일 구간처럼 프로세스 생존은 확인되지만 더 강한 로컬 진행 증거는 아직 없는 상태
  - `ack-break`: 내부 build/scan 루프가 예외/정책실패/취소로 비정상 종료된 상태
- `requestSummary.degraded=true` 는 기존 scan runtime의 degraded semantics를 그대로 반영한다
- `requestSummary.ackStatus="broken"` + `localAckState="ack-break"` + `blockedReason` 존재는 local ack break equivalent 이다
- local ack source는 `request-accepted`, `semaphore-acquired`, `build-started`, `tool-progress`, `file-progress`, `runtime-state`, `build-subprocess-alive`, `build-phase-complete`, `terminal-result`, `ack-break`, `request-cancelled`
- 전역 numeric stall threshold는 health contract에 노출하지 않는다. ack break는 내부 실행 흐름의 명시적 비정상 종료로만 판정한다

### Health-control v2 durable ownership mode (2026-05-08)

장시간 production caller는 `/v1/scan`, `/v1/build`, `/v1/build-and-analyze` 호출에 `Prefer: respond-async`를 보낸다.
S4는 `202 Accepted`와 함께 `statusUrl=/v1/requests/{requestId}`, `resultUrl=/v1/requests/{requestId}/result`를 반환하고, 원 HTTP response lifecycle과 분리된 retained task로 작업을 계속 수행한다.

- `Prefer: respond-async`가 있으면 `Accept: application/x-ndjson`보다 우선한다.
- 동일 endpoint에 대한 동일 `X-Request-Id` 재제출은 idempotent하다. 이미 등록된 retained request가 있으면 새 task를 만들지 않고 `reused=true` status envelope를 반환한다.
- 서로 다른 S4 endpoint가 같은 `X-Request-Id`를 durable ownership key로 재사용하면 S4는 silent reuse 대신 HTTP 409 `REQUEST_ID_CONFLICT`를 반환한다. S3/S2는 `/v1/build` 후 `/v1/scan`처럼 operation이 바뀌는 경우 고유한 S4 operation requestId를 사용해야 한다.
- terminal success/failure는 process-local memory에 기본 300초 보존된다. 이는 transport interruption 복구용이며 process restart durability는 계약하지 않는다.
- `GET /v1/requests/{requestId}`는 queued/running/completed/failed status envelope를 반환한다. unknown은 404, expired terminal result는 410이다.
- `GET /v1/requests/{requestId}/result`는 queued/running 동안 202, retained terminal success/failure/cancelled는 200을 반환한다.
- `DELETE /v1/requests/{requestId}`는 queued/running이면 202와 함께 `state="cancelled"`, `resultReady=true`, nested `result.success=false`, `errorDetail.code="REQUEST_CANCELLED"`를 반환한다. 이미 completed/failed/cancelled이면 200 idempotent terminal envelope를 반환한다. unknown은 404, expired는 410이다.
- terminal domain failure/cancel도 retrieval transport는 200일 수 있다. caller는 nested `result.success=false`, `failureDetail`, `errorDetail`을 domain outcome으로 해석해야 한다.
- async ownership build path는 caller `X-Timeout-Ms`를 hard subprocess deadline으로 쓰지 않는다. `buildEvidence.timeoutMode="async-ownership-no-caller-deadline"`, `timeoutEnforced=false`로 노출한다.
- sync/NDJSON compatibility surface는 유지된다. S3가 finite elapsed abort를 제거하려면 long-running production path에서 `Prefer: respond-async` + status/result polling을 사용해야 한다.

---

## 14. Juliet 벤치마크 결과 (Overall Recall: 83.7%)

NIST Juliet Test Suite C/C++ v1.3 기반 12개 CWE, 361파일, variant 01 측정.

| Tier | CWE | Recall | 주력 도구 |
|------|-----|:---:|---|
| S | CWE-476 NULL deref | **100%** | Cppcheck + clang-tidy + gcc-fanalyzer + scan-build |
| S | CWE-134 Format String | **100%** | Flawfinder |
| S | CWE-401 Memory Leak | **95%** | gcc-fanalyzer |
| S | CWE-369 Divide by Zero | **94%** | **Semgrep taint** + Cppcheck |
| A | CWE-190 Int Overflow | **89%** | **Semgrep taint** + clang-tidy + Flawfinder |
| A | CWE-680 Int->BOF | **83%** | Flawfinder + Semgrep |
| A | CWE-121 Stack BOF | **82%** | Flawfinder + gcc-fanalyzer |
| A | CWE-78 Cmd Injection | **80%** | Flawfinder + clang-tidy + Semgrep |
| A | CWE-122 Heap BOF | **80%** | Flawfinder + gcc-fanalyzer |
| B | CWE-252 Unchecked Return | **72%** | clang-tidy |
| B | CWE-416 UAF | **67%** | gcc-fanalyzer + clang-tidy + scan-build |
| C | CWE-457 Uninitialized | **56%** | gcc-fanalyzer + Cppcheck |

### Noise 메트릭

벤치마크는 noise를 2종으로 분리 추적:
- **targeted noise**: 타겟 파일 내 wrong-CWE findings (의미 있는 FP 신호)
- **portfolio noise**: 비타겟 파일 findings (지원 파일 등, 무관한 활성화)

전체 variant (8,783파일) 벤치마크: Overall Recall **78.7%**

---

## 15. 의존성

```
fastapi>=0.115.0
uvicorn>=0.30.0
pydantic>=2.9.0
pydantic-settings>=2.5.0
python-json-logger>=2.0.7
semgrep>=1.40.0,<2.0.0
pytest>=7.0.0
pytest-asyncio>=0.23.0
httpx>=0.27.0
```

---

## 16. 에이전트 파이프라인에서의 위치

```
Phase 1 (결정론적, LLM 없음):
  S3 -> SAST Runner:
    /v1/build-and-analyze  또는 개별 호출:
    |- /v1/scan       -> findings
    |- /v1/functions   -> 코드 그래프
    |- /v1/libraries   -> SCA (CVE는 S5)
    +- /v1/metadata    -> 타겟 정보

Phase 2 (LLM 해석):
  S3 -> S7 Gateway (:8000) -> LLM Engine -> 판단/분류
```

## 16-1. Build Snapshot consumer seam (implemented in v0.11.1)

S2/S3가 Build Snapshot reference-first seam을 열면,
S4의 역할은 여전히 **결정론적 build/scan execution authority** 다.

### S4가 authoritative한 것
- 실제 실행된 build/scan evidence
- `compileCommandsPath`
- build `exitCode`, `buildOutput`, `entries`, `userEntries`
- scan `execution.toolResults`, filtering, timed-out 정보

### S4가 pass-through 하는 것이 맞는 것
- `buildSnapshotId`
- `buildUnitId`
- `snapshotSchemaVersion`
- lineage 계열 provenance

### 입력 원칙

S4는 `buildSnapshotId`만 단독으로 받아 실행하지 않는다.
직접 snapshot lookup을 하지 않기 때문이다.

따라서 실제 `/v1` contract는:
- snapshot reference
- concrete execution evidence (`projectPath`, `compileCommands`, `buildCommand`, `thirdPartyPaths`)

를 함께 전달하는 방식이다.

전달 shape는 flat field보다 nested `provenance` object를 사용한다.

### `/v1/build-and-analyze`의 위치

snapshot-first architecture에서는 `/v1/build-and-analyze`를
**canonical orchestration path** 가 아니라
**convenience / transitional surface** 로 본다.

장기 권장 path:
1. `/v1/build`
2. upstream snapshot persist
3. `/v1/scan`, `/v1/functions`, `/v1/libraries`, `/v1/metadata`

### 실제 `/v1` contract 핵심

- build/scan/build-and-analyze 요청은 nested `provenance` object를 수용한다
- `/v1/build`는 `buildEvidence`, `readiness`, `failureDetail`을 구조화해서 반환한다
- `/v1/build`는 `sdkId`를 받지 않고 `buildCommand` 자동 감지도 하지 않는다
- `/v1/scan` heartbeat/final execution은 degraded long-run을 구분할 수 있는 필드를 포함한다

---

## 관련 문서

- [API 계약서](../api/sast-runner-api.md) -- 전체 엔드포인트 스키마
- [SastFinding 타입](../api/shared-models.md)
- [MSA Observability 규약](observability.md)
- [S4 인수인계서](../handoff/s4/readme.md)
