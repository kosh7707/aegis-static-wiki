---
title: "Build Agent API 명세 (v1.0.0)"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/build-agent-api.md"
last_verified: "2026-04-25"
service_tags: ["s3"]
decision_tags: ["build-v1.1-proposal", "compatibility-gate", "system-stability"]
related_pages: ["wiki/canon/specs/build-agent.md", "wiki/canon/handoff/s3/readme.md"]
---

# Build Agent API 명세 (v1.0.0)

> **소유자**: S3
> **포트**: 8003
> **호출자**: S2
> **최종 업데이트**: 2026-04-25

Build Agent의 public contract 문서다. 내부 router/handler 구조와 internal downstream calling strategy는 계속 정리되었지만, **strict contract와 public response 의미는 유지된다.** 2026-04-25 system-stability workstream에서도 v1.0.0 public semantics는 compatibility gate 전까지 유지된다.

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
| GET | `/v1/health` | 상태 + agent config |

> 2026-04-14 이후 Build Agent는 내부적으로 tool-less LLM turn에서 S7 async ownership surface를 우선 사용할 수 있지만, 이 변화는 Build Agent outward API shape를 바꾸지 않는다.

---

## POST /v1/tasks

### 지원 taskType

| taskType | 설명 |
|---|---|
| `build-resolve` | strict compile-first 빌드 계약 실행 |
| `sdk-analyze` | SDK 디렉토리 분석 + `sdkProfile` 추출 |

---

## `build-resolve` strict contract

### 핵심 의미

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
3. `expectedArtifacts` 미충족이면 성공 금지
4. caller build script hint는 text-only / reference-only
5. compile DB 가능성만으로 성공 처리 금지

---

## 성공 응답

성공 시 HTTP `200` + `status: "completed"`.

핵심 필드:
- `taskId`, `taskType`, `contractVersion`, `strictMode`, `status`
- `modelProfile`, `promptVersion`, `schemaVersion`
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
- `audit`

### `result.buildPreparation`

`build-resolve` 성공 응답은 기존 `result.buildResult`를 유지하면서, 다음 단계 orchestration을 위한 명시적 번들을 추가로 반환한다.

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

HTTP `200` + 실패 `status`.

대표 분류:

| status | failureCode 예시 |
|---|---|
| `validation_failed` | `INVALID_SCHEMA`, `SDK_MISMATCH`, `MISSING_BUILD_MATERIALS`, `EXPECTED_ARTIFACTS_MISMATCH` |
| `failed` | `COMPILE_FAILED`, `BUILD_SCRIPT_SYNTHESIS_FAILED` |
| `timeout` | `TIMEOUT` |
| `model_error` | `MODEL_UNAVAILABLE` |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED`, `ALL_TOOLS_EXHAUSTED` |

---

## `sdk-analyze`

`sdk-analyze`는 SDK/툴체인 디렉토리를 읽고 `sdkProfile`을 반환한다.

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
  "agentConfig": {
    "maxSteps": 15,
    "maxCompletionTokens": 20000,
    "toolBudget": {"cheap": 20, "medium": 0, "expensive": 5}
  }
}
```

보호 의미:
- `version = 1.0.0` 유지
- strict contract 해석과 무관하게 health 의미는 stable해야 함

---

## 2026-04-14 구현 메모

내부 구현은 다음처럼 정리/확장되었지만 public contract는 동일하다.
- `tasks.py` → thin router
- `build_resolve_handler.py`
- `build_route_support.py`
- `sdk_analyze_handler.py`
- `sdk_analyze_support.py`
- internal tool-less LLM turn에서 S7 async ownership surface 우선 사용 + sync fallback
- unsupported async surface(404/405/501)는 짧은 cooldown으로 기억하여, 매 호출마다 같은 probe를 반복하지 않도록 internal fallback behavior를 완화

---

## 2026-04-25 build-v1.1 proposal / compatibility gate

S3 system-stability planning proposes additive `build-v1.1` domain outcome fields, but this is **not** a silent default flip of Build Agent v1.0.0. Until WP6 compatibility gate and S2 notice complete, this page's v1.0.0 protected semantics remain authoritative.

Proposed additive fields after gate:

| Field | Meaning |
|---|---|
| `result.buildOutcome` | `built`, `compile_failed`, `missing_materials`, `sdk_mismatch`, `artifact_mismatch`, or `inconclusive`. |
| `result.cleanPass` | True only when declared mode, try_build success evidence, and expected artifacts all pass. |
| `result.buildDiagnostics` | Build-domain failure context separate from runtime/dependency failure. |

No-fake-success remains non-negotiable: compile failure, missing material, SDK mismatch, and artifact mismatch must never be represented as a successful build. The proposed migration only separates build-domain outcomes from S3/S4/S7 runtime unavailability.
