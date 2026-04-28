---
title: "Build Agent API 명세 (build-v1.1 active)"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/build-agent-api.md"
  - ".omx/plans/prd-s3-paper-remediation-complete-20260427.md"
  - "services/build-agent/app/routers/tasks.py"
  - "services/build-agent/app/core/result_assembler.py"
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["build-v1.1-default", "artifact-mismatch-completed", "system-stability", "contract-notify"]
related_pages: ["wiki/canon/specs/build-agent.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md"]
---

# Build Agent API 명세 (build-v1.1 active)

> **소유자**: S3
> **포트**: 8003
> **호출자**: S2
> **최종 업데이트**: 2026-04-27

Build Agent의 public contract 문서다. 서비스 버전 문자열은 `/v1/health.version = "1.0.0"`으로 유지하지만, 응답 schema surface는 **build-v1.1이 현재 active default**다. 2026-04-27 S3 remediation workstream에서 기존 “proposal” 표기를 종료했고, runtime은 `schemaVersion: "build-v1.1"` 및 additive build-domain fields를 기본 방출한다.

---

## Base URL

```text
http://localhost:8003
```

## 공통 헤더

| 헤더 | 설명 |
|---|---|
| `X-Request-Id` | 요청/응답 round-trip. S3는 이를 로그와 S4/S7 호출에 전파한다. |

---

## 엔드포인트 요약

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `build-resolve`, `sdk-analyze` |
| GET | `/v1/health` | 상태 + agent config + active response schema |

> Build Agent는 내부적으로 tool-less LLM turn에서 S7 async ownership surface를 우선 사용할 수 있지만, 이 변화는 Build Agent outward API shape를 바꾸지 않는다.

---

## POST /v1/tasks

### 지원 taskType

| taskType | 설명 |
|---|---|
| `build-resolve` | strict compile-first 빌드 계약 실행 |
| `sdk-analyze` | SDK 디렉토리 분석 + `sdkProfile` 추출 |

---

## `build-resolve` strict contract

호출자는 아래를 명시해야 한다.
1. 어느 BuildTarget을 빌드할지
2. 어떤 빌드 모드(`native` / `sdk`)인지
3. SDK 모드라면 어떤 materialization source를 쓸지
4. 성공 산출물이 무엇인지
5. strict 의미를 활성화하는지

### strict v1 핵심 필드

| 필드 | 위치 | 필수 |
|---|---|---|
| `contractVersion = "build-resolve-v1"` | top-level | O |
| `strictMode = true` | top-level | O |
| `projectPath` | `context.trusted` | O |
| `buildTargetPath` | `context.trusted` | O |
| `buildTargetName` | `context.trusted` | O |
| `build.mode` | `context.trusted.build` | O |
| `expectedArtifacts[]` | `context.trusted` | O |
| `build.sdkId` | `context.trusted.build` | O when sdk |
| `build.setupScript` / `build.environment` / `build.scriptHintText` 중 하나 | `context.trusted.build` | O when strict sdk |

### migration alias
다음은 여전히 읽지만 canonical surface는 아니다.
- `targetPath`, `targetName`
- flat `buildMode`, `sdkId`
- `contractVersion: "compile-first-v1"`

### strict 불변조건
1. `buildTargetPath` 누락 시 invalid contract
2. undeclared native/sdk fallback 금지
3. `expectedArtifacts` 미충족이면 clean pass 금지
4. caller build script hint는 text-only / reference-only
5. compile DB 가능성만으로 성공 처리 금지

---

## 성공 응답 / completed envelope

well-formed request가 처리되어 Build Agent가 빌드-domain 판단을 끝냈다면 HTTP `200` + `status: "completed"`가 기본이다. 여기서 `completed`는 “빌드가 성공했다”가 아니라 “검토가 끝났고 결과를 가져가라”는 envelope 의미다.

핵심 필드:
- `taskId`, `taskType`, `contractVersion`, `strictMode`, `status`
- `modelProfile`, `promptVersion`, `schemaVersion = "build-v1.1"`
- `validation.valid`
- `result.summary`
- `result.buildResult.success`
- `result.buildResult.declaredMode`
- `result.buildResult.sdkId`
- `result.buildResult.buildCommand`
- `result.buildResult.buildScript`
- `result.buildResult.buildDir`
- `result.buildResult.producedArtifacts`
- `result.buildResult.artifactVerification`
- `result.buildPreparation`
- `result.buildOutcome`
- `result.cleanPass`
- `result.buildDiagnostics`
- `audit`

### build-v1.1 additive fields

| Field | Meaning |
|---|---|
| `result.buildOutcome.outcome` | `built`, `compile_failed`, `missing_materials`, `sdk_mismatch`, `artifact_mismatch`, or `inconclusive`. |
| `result.buildOutcome.cleanPass` | True only when declared mode, try_build success evidence, and expected artifacts all pass. |
| `result.cleanPass` | Top-level result convenience mirror of `buildOutcome.cleanPass`. |
| `result.buildDiagnostics.failureCode` | Build-domain diagnostic code when `cleanPass=false`. |
| `result.buildDiagnostics.expectedArtifacts` | Caller-declared expected artifact names/paths normalized for diagnostics. |
| `result.buildDiagnostics.producedArtifacts` | Observed produced artifact names/paths. |
| `result.buildDiagnostics.missingArtifacts` | Expected artifacts not observed. |

### `EXPECTED_ARTIFACTS_MISMATCH` contract

S3 chooses **Option A** from the 2026-04-27 remediation plan:

- artifact mismatch is a **build-domain outcome**, not a top-level task failure;
- response remains `status: "completed"`;
- `result.cleanPass = false`;
- `result.buildOutcome.outcome = "artifact_mismatch"`;
- `result.buildDiagnostics.failureCode = "EXPECTED_ARTIFACTS_MISMATCH"`;
- `result.buildDiagnostics.expectedArtifacts`, `producedArtifacts`, and `missingArtifacts` carry the comparison evidence.

No-fake-success remains non-negotiable: compile failure, missing material, SDK mismatch, and artifact mismatch must never be represented as a clean successful build.

### `result.buildPreparation`

`build-resolve` completed 응답은 기존 `result.buildResult`를 유지하면서, 다음 단계 orchestration을 위한 명시적 번들을 추가로 반환한다.

주요 필드:
- `declaredMode`
- `sdkId`
- `buildCommand`
- `buildScript`
- `buildDir`
- `buildEnvironment`
- `provenance`
- `expectedArtifacts`
- `producedArtifacts`

의미:
- `buildResult`는 build-resolve 결과 자체를 설명하는 protected surface다.
- `buildPreparation`은 S2가 **빌드 준비 완료 상태를 저장/전달**할 때 쓰는 명시적 후속-step 번들이다.
- legacy/strict contract parsing 의미는 그대로 유지된다.

---

## 실패 응답

HTTP `200` + 실패 `status`는 “입력/런타임/예산/모델/타임아웃 때문에 build-domain 판단까지 도달하지 못한 경우”에 사용한다.

대표 분류:

| status | failureCode 예시 | 의미 |
|---|---|---|
| `validation_failed` | `INVALID_SCHEMA`, invalid strict contract | 요청 자체가 잘못되어 정상 검토를 시작할 수 없음 |
| `failed` | `BUILD_SCRIPT_SYNTHESIS_FAILED` 등 | envelope 생성 전 build-agent 내부 절차 실패 |
| `timeout` | `TIMEOUT` | deadline 초과 |
| `model_error` | `MODEL_UNAVAILABLE` | LLM/runtime unavailable |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED`, `ALL_TOOLS_EXHAUSTED` | budget/loop limit로 판단 중단 |

`COMPILE_FAILED`, `MISSING_BUILD_MATERIALS`, `SDK_MISMATCH`, `EXPECTED_ARTIFACTS_MISMATCH`처럼 빌드-domain 판단이 가능한 결론은 가능한 한 completed envelope + `cleanPass=false` + diagnostics로 표현한다.

---

## `sdk-analyze`

`sdk-analyze`는 SDK/툴체인 디렉토리를 읽고 `sdkProfile`을 반환한다. `/v1/health.activeResponseSchemas["sdk-analyze"]`도 `build-v1.1`로 표기한다. 이는 동일한 S3 Build Agent response envelope version을 뜻한다.

대표 결과 필드:
- `compiler`
- `compilerPrefix`
- `gccVersion`
- `targetArch`
- `languageStandard`
- `sysroot`
- `environmentSetup`
- `includePaths`
- `defines`

---

## GET /v1/health

예시:

```json
{
  "service": "s3-build",
  "status": "ok",
  "version": "1.0.0",
  "llmMode": "real",
  "activeResponseSchemas": {
    "build-resolve": "build-v1.1",
    "sdk-analyze": "build-v1.1"
  },
  "proposedResponseSchemas": {},
  "agentConfig": {
    "maxSteps": 15,
    "maxCompletionTokens": 20000,
    "toolBudget": {"cheap": 20, "medium": 0, "expensive": 5}
  }
}
```

보호 의미:
- `version = 1.0.0` 유지
- active response schema는 `build-v1.1`
- strict contract 해석과 health 의미는 stable해야 함

---

## 2026-04-27 구현 메모

- `tasks.py` → thin router
- `build_resolve_handler.py`
- `build_route_support.py`
- `sdk_analyze_handler.py`
- `sdk_analyze_support.py`
- internal tool-less LLM turn에서 S7 async ownership surface 우선 사용 + sync fallback
- unsupported async surface(404/405/501)는 짧은 cooldown으로 기억하여, 매 호출마다 같은 probe를 반복하지 않도록 internal fallback behavior를 완화
- build-v1.1 active default: `schemaVersion`, `result.buildOutcome`, `result.cleanPass`, `result.buildDiagnostics`, `/v1/health.activeResponseSchemas`
