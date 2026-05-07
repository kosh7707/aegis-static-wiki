---
title: "Build Agent API 명세 (build-v1.1 active)"
page_type: "canonical-api"
canonical: true
source_refs:
  - "docs/api/build-agent-api.md"
  - ".omx/plans/prd-s3-paper-remediation-complete-20260427.md"
  - "services/build-agent/app/routers/tasks.py"
  - "services/build-agent/app/core/result_assembler.py"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-generation-controls-wr-20260429.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-generation-controls-wr-20260429.md"
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-05-07"
service_tags: ["s3"]
decision_tags: ["build-v1.1-default", "artifact-mismatch-completed", "system-stability", "contract-notify", "generation-controls", "api-contract", "tool-schema-validation", "input-boundary", "topk-alignment", "transitional-deprecation", "regression-gate", "tool-intent-runtime-dispatch", "non-dynamic-api-audit", "sdk-materialization", "hot11"]
related_pages: ["wiki/canon/specs/build-agent.md", "wiki/canon/specs/build-agent-state-machine.md", "wiki/canon/handoff/s3/readme.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md", "wiki/context/decisions/llm-tool-choice-required-incompat-20260503.md"]
---

# Build Agent API 명세 (build-v1.1 active)

> **소유자**: S3
> **포트**: 8003
> **호출자**: S2
> **최종 업데이트**: 2026-05-07

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

## Common `constraints` generation controls (2026-04-29)

Build Agent accepts the existing optional `constraints` object and adds caller-owned generation overrides in camelCase:

| Field | Type | Meaning |
|---|---|---|
| `constraints.maxTokens` | int | Generation cap, accepted range `1..32768`. |
| `constraints.timeoutMs` | int | Advisory timeout/budget hint. |
| `constraints.enableThinking` | bool | Optional thinking flag override; default is thinking-on. |
| `constraints.temperature` | number | Optional generation temperature override (`0..2`). |
| `constraints.topP` | number | Optional top-p override (`0..1`). |
| `constraints.topK` | int | Optional top-k override (`>=-1`); `-1` preserves the S7/vLLM unlimited top-k sentinel while named S3 presets keep positive defaults. |
| `constraints.minP` | number | Optional min-p override (`0..1`). |
| `constraints.presencePenalty` | number | Optional presence penalty override (`-2..2`). |
| `constraints.repetitionPenalty` | number | Optional repetition penalty override (`0..2`). |

Public constraints are camelCase-only. Snake_case keys such as `top_p` or `presence_penalty` are rejected at the API boundary. Internally Build Agent serializes the full S7-required tuple to snake_case for `/v1/chat` and `/v1/async-chat-requests`.

### Tool dispatch and `tool_choice` policy (2026-05-06)

Build Agent does **not** use vLLM/OpenAI `tool_choice="required"` for mandatory first build acquisition. Current production policy is:

| Situation | S7 request shape | Enforcement authority |
|---|---|---|
| Ordinary tool-capable LLM turn | `tools=[...]`, `tool_choice="auto"` | vLLM may choose tool call or content; Build Agent validates/handles the result. |
| Mandatory first acquisition before any successful tool call | `tools=None`, no `tool_choice`, strict JSON ToolIntent, thinking enabled | Build Agent runtime converts the ToolIntent JSON into a synthetic `ToolCallRequest` and dispatches it. |
| Forced report / no tools available | tool-less strict JSON or ordinary content path | Build result assembly / schema repair / outcome classification. |

This supersedes the older P10 shorthand that used `tool_choice="required"`. The reason is the 2026-05-03 Qwen/vLLM incompatibility where `enable_thinking=true` plus `tool_choice="required"` can produce `finish_reason="tool_calls"` with empty `tool_calls`. Build Agent preserves the safety goal — no build-domain report before required acquisition — through ToolIntent runtime dispatch rather than guided tool-choice.

Clean build success remains result-level: `status="completed"` means a build-domain envelope was returned; callers must inspect `result.cleanPass`, `result.buildOutcome`, and `result.buildDiagnostics`.

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
| `build.sdkRootPath` + `build.setupScript` 또는 `build.environment` 또는 `build.scriptHintPath` 중 하나 | `context.trusted.build` | O when strict sdk |

### migration alias
다음은 여전히 읽지만 canonical surface는 아니다.
- `targetPath`, `targetName`
- flat `buildMode`, `sdkId`
- `contractVersion: "compile-first-v1"`

### strict 불변조건
1. `buildTargetPath` 누락 시 invalid contract
2. undeclared native/sdk fallback 금지
3. `expectedArtifacts` 미충족이면 clean pass 금지
4. caller build script hint는 uploaded-project-relative path / text-only / generated-wrapper-only
5. compile DB 가능성만으로 성공 처리 금지

### `build.sdkRootPath` / SDK materialization descriptor contract (2026-05-07)

SDK 모드에서 `sdkId`는 registry identity일 뿐이며, Build Agent가 실제 툴체인을 찾을 수 있는 materialized filesystem descriptor를 대신하지 않는다. Canonical SDK-mode producer는 `context.trusted.build` 아래에 다음 additive fields를 제공해야 한다.

```json
{
  "context": {
    "trusted": {
      "build": {
        "mode": "sdk",
        "sdkId": "ti-am335x-08.02.00.24",
        "sdkRootPath": "/uploads/project-1/sdk/sdk-1/installed",
        "setupScript": "linux-devkit/environment-setup-armv7at2hf-neon-linux-gnueabi",
        "sysroot": "linux-devkit/sysroots/armv7at2hf-neon-linux-gnueabi",
        "toolchainTriplet": "arm-none-linux-gnueabihf",
        "environment": {
          "EXTRA_FLAG": "optional-caller-env"
        },
        "scriptHintPath": "scripts/cross_build.sh"
      }
    }
  }
}
```

Canonical interpretation:
- Canonical producer fields are direct children of `context.trusted.build`. S3 intentionally does not introduce a nested `sdkMaterialization` object in build-v1.1 because S2 already forwards a shallow `build` object and the compatibility goal is additive request evolution, not a second SDK sub-contract.
- `build.sdkRootPath` is an absolute, server-visible path to the materialized uploaded SDK root. It must exist and be a directory when supplied under strict SDK mode.
- `build.setupScript` may be either:
  - relative to `sdkRootPath` (preferred canonical producer shape), or
  - an absolute path for transitional compatibility. If `sdkRootPath` is also supplied, an absolute `setupScript` must resolve inside that SDK root.
- `build.sysroot` follows the same scoping rule as `setupScript`: relative to `sdkRootPath` when relative, or absolute-but-inside-root when absolute and `sdkRootPath` is present.
- `build.toolchainTriplet` is a non-path compiler prefix hint such as `arm-none-linux-gnueabihf`.
- `build.environment` remains an optional caller-provided environment map. It does not replace `sdkRootPath`; it can supplement setup scripts and toolchain hints.
- Build Agent may expose derived env hints such as `AEGIS_SDK_ROOT`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, and `AEGIS_TOOLCHAIN_TRIPLET` to generated scripts, but the generated script must still be request-scoped.

### SDK descriptor precedence and conflict matrix (2026-05-07)

Build Agent normalizes legacy aliases only to preserve existing callers. The canonical request source is always `context.trusted.build`.

| Input shape | Policy |
|---|---|
| Canonical `context.trusted.build.*` only | Accept and normalize. |
| Legacy flat alias only (`sdkId`, `setupScript`, `toolchainTriplet`, `buildEnvironment`) | Accept as migration alias and normalize to canonical internal fields. |
| Canonical field plus identical legacy alias | Accept; canonical value remains authoritative. |
| Canonical field plus different legacy alias | Reject as invalid contract with a descriptor conflict diagnostic. |
| `build.setupScript` or `build.sysroot` relative while `sdkRootPath` exists | Resolve under `sdkRootPath`; reject escapes and missing required file/directory. |
| `build.setupScript` or `build.sysroot` absolute while `sdkRootPath` exists | Accept only if it resolves inside `sdkRootPath`; reject otherwise. |
| `build.setupScript` absolute with no `sdkRootPath` | Transitional legacy accept, but it does not satisfy the uploaded-SDK materialization goal by itself. |
| Caller `build.environment` tries to override derived `AEGIS_SDK_*`, `SDK_DIR`, or `SDKTARGETSYSROOT` values | Descriptor-derived values win; caller env is supplemental. |

Safety and extensibility rules:
- Build Agent must not infer SDK roots from host-specific defaults such as `$HOME/ti-processor-sdk-*`, `/home/kosh/ti-sdk`, or project names.
- Build Agent must not hardcode TI/RE100 paths to satisfy a live test. TI SDK support is evidence for the generalized descriptor flow, not an allowed special-case shortcut.
- User-provided build script hints can contain user-local paths. Those paths are untrusted material; generated scripts and deterministic wrappers must prefer the trusted SDK descriptor over paths embedded in hints.
- If strict SDK mode has only `sdkId` and no usable materialization descriptor/environment/script hint, the request is invalid or completed non-clean with a clear SDK materialization diagnostic; it must not silently fall back to native builds.

### `build.scriptHintPath` contract (2026-05-06)

S3 removed inline build script hint text aliases. Build Agent now accepts only:

```json
{
  "context": {
    "trusted": {
      "build": {
        "mode": "native",
        "scriptHintPath": "scripts/build.sh"
      }
    }
  }
}
```

Canonical interpretation:
- `build.scriptHintPath` is relative to the **effective BuildTarget root**.
  - If `projectPath` already points at an isolated target and `buildTargetPath="."`, the path is relative to that isolated root.
  - If `projectPath` is the uploaded project root and `buildTargetPath="target/subdir"`, the path is relative to `projectPath/buildTargetPath`.
- Top-level `scriptHintPath` is not accepted.
- Inline aliases such as `build.scriptHintText`, `build.scriptHint`, `buildScriptHint`, and `buildScriptHintText` are rejected rather than preserved as legacy compatibility.

S3 validation:
- reject empty paths;
- reject absolute paths, Windows drive-letter paths, UNC paths, backslash separators, NUL bytes, and path traversal;
- resolve symlinks and reject escapes outside the effective BuildTarget root;
- require a regular file;
- enforce a 20,000 byte raw file-size cap;
- reject NUL-containing or non-UTF-8 content;
- hash and expose bounded reference content to the LLM prompt with path/size/sha256 diagnostics.

Execution rule:
- Build Agent must never expose the original hinted script as public `buildCommand` or `buildScript`, and `try_build` must execute only the generated request-scoped `build-aegis-*/aegis-build.sh`.
- The hinted file is untrusted material for creating the request-scoped wrapper/script. A deterministic generated wrapper may invoke the hinted script only after applying trusted descriptor-derived environment (`AEGIS_SDK_ROOT`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `SDK_DIR`, `SDKTARGETSYSROOT`) and while keeping the public execution evidence pointed at `build-aegis-*/aegis-build.sh`.
- If the deterministic wrapper cleanly builds all expected artifacts, Build Agent may return `modelProfile="deterministic-phase0"` in a normal build-v1.1 completed envelope. If it fails, the bounded LLM repair loop may still synthesize/modify the generated script.

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
| `validation_failed` | `INVALID_SCHEMA`, invalid strict contract, `INPUT_TOO_LARGE` | 요청 자체가 잘못되어 정상 검토를 시작할 수 없음 |
| `timeout` | `TIMEOUT` | deadline 초과 |
| `model_error` | `MODEL_UNAVAILABLE`, `LLM_OVERLOADED` | LLM/S7/runtime unavailable 또는 output-contract 재시도 실패 |
| `budget_exceeded` | `TOKEN_BUDGET_EXCEEDED`, `MAX_STEPS_EXCEEDED`, `ALL_TOOLS_EXHAUSTED`, `INSUFFICIENT_EVIDENCE` | budget/loop limit로 판단 중단 |

`COMPILE_FAILED`, `BUILD_SCRIPT_SYNTHESIS_FAILED`, `MISSING_BUILD_MATERIALS`, `SDK_MISMATCH`, `EXPECTED_ARTIFACTS_MISMATCH`처럼 빌드-domain 판단이 가능한 결론은 가능한 한 completed envelope + `cleanPass=false` + diagnostics로 표현한다. Strict JSON deficiency나 empty LLM content도 현재 build-resolve loop에서는 가능한 경우 output-deficient completed non-clean envelope로 조립된다. 반대로 max steps, token budget, no-new-evidence, all-tools-exhausted 같은 loop exhaustion은 `budget_exceeded` 실패 응답으로 종료한다. S4 build API 호출 예외도 현재 구현에서는 `try_build` 실패 tool result로 먼저 들어오므로, envelope assembly가 가능하면 completed non-clean으로 분류될 수 있다; dependency outage 때문에 envelope assembly 자체가 불가능한 경우에만 non-completed status로 종료한다.

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
    "maxCompletionTokens": 32768,
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
