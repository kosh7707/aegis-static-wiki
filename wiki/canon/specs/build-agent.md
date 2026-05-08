---
title: "S3. Build Agent 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/build-agent.md"
  - ".omx/plans/prd-s3-paper-remediation-complete-20260427.md"
  - "services/build-agent/app/schemas/response.py"
  - "services/build-agent/app/routers/tasks.py"
  - "services/build-agent/app/core/result_assembler.py"
  - "/home/kosh/AEGIS/.omx/plans/prd-s3-generation-controls-wr-20260429.md"
  - "/home/kosh/AEGIS/.omx/plans/test-spec-s3-generation-controls-wr-20260429.md"
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-05-08"
service_tags: ["s3"]
decision_tags: ["build-v1.1-default", "artifact-mismatch-completed", "producer-critic-orchestrator-boundary", "system-stability", "generation-controls", "tool-schema-validation", "input-boundary", "topk-alignment", "transitional-deprecation", "regression-gate", "sdk-materialization", "hot11"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/specs/build-agent-state-machine.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-sdk-materialization-descriptor-producer-contract.md"]
---

# S3. Build Agent 기능 명세

> **소유자**: S3
> **최종 업데이트**: 2026-05-08

Build Agent는 업로드된 프로젝트에 대해 **strict compile-first control plane** 으로 동작한다. 호출자가 선언한 BuildTarget, 빌드 모드, 기대 산출물을 기준으로 preflight → phase0 → bounded repair → artifact validation을 수행한다.

---

## 1. 핵심 원칙

1. **compile-first** — 실제 컴파일 성립 여부가 1차 책임이다.
2. **caller intent 명시** — `buildTargetPath`, `build.mode`, `expectedArtifacts`는 호출자가 선언한다.
3. **no fake success** — compile DB만 있거나 artifact mismatch면 clean pass가 아니다.
4. **completed envelope는 품질 성공이 아니다** — 정상 입력/정상 런타임에서 빌드-domain 판단이 끝났다면 `status=completed`로 결과를 돌려주되, `result.cleanPass=false`와 diagnostics로 실패/불일치를 표현한다.
5. **원본 프로젝트 불변** — 쓰기는 request-scoped `build-aegis-<requestIdPrefix>/` 하위만 허용한다.
6. **bounded repair** — LLM은 build script 작성/복구만 담당한다.
7. **thinking-on 기본값** — Build Agent service-local `LlmCaller`는 S7 Gateway의 `enable_thinking=true` 기본 계약을 따른다. build-resolve prompt는 내부 reasoning은 허용하되 최종 content는 순수 JSON만 포함하도록 요구하며 `/no_think` suffix를 사용하지 않는다.
8. **public contract는 통보식으로 갱신하되 문서와 runtime drift를 남기지 않는다** — 2026-04-27 기준 active response schema는 `build-v1.1`이다.
9. **SDK materialization은 descriptor 기반** — SDK 모드는 `sdkId`만으로 빌드하지 않는다. 호출자가 materialized SDK root/setup/sysroot/toolchain/environment descriptor를 제공하면 Build Agent는 이를 일반화된 방식으로 소비하고, host/user-local path나 TI/RE100 project-name hardcoding으로 성공을 만들지 않는다.
10. **wait while alive** — S4/S7이 ownership/status/result surface에서 alive 또는 transport-only 상태를 보고하는 동안 elapsed wall-clock time만으로 long-running build/LLM work를 중단하지 않는다.

---

## 2. 공개 엔드포인트

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `build-resolve`, `sdk-analyze` |
| GET | `/v1/health` | 상태 + 에이전트 설정 + active response schema |

---

## 3. 보호되는 외부 surface

1. `/v1/health.version = 1.0.0`
2. `/v1/health.activeResponseSchemas["build-resolve"] = "build-v1.1"`
3. `/v1/health.activeResponseSchemas["sdk-analyze"] = "build-v1.1"`
4. success envelope `schemaVersion = "build-v1.1"`
5. strict contract parsing
   - top-level `contractVersion`
   - top-level `strictMode`
   - legacy alias normalization 유지
6. `/v1/tasks` top-level envelope shape 유지
7. `build-resolve` / `sdk-analyze` 의미 유지

---

## 4. 현재 내부 아키텍처

### Router / Handler 레이아웃

| 역할 | 파일 |
|---|---|
| public router | `services/build-agent/app/routers/tasks.py` |
| build-resolve handler | `services/build-agent/app/routers/build_resolve_handler.py` |
| build-resolve support | `services/build-agent/app/routers/build_route_support.py` |
| sdk-analyze handler | `services/build-agent/app/routers/sdk_analyze_handler.py` |
| sdk-analyze support | `services/build-agent/app/routers/sdk_analyze_support.py` |

### 기타 핵심 컴포넌트

| 역할 | 파일 |
|---|---|
| phase0 | `services/build-agent/app/core/phase_zero.py` |
| agent loop | `services/build-agent/app/core/agent_loop.py` |
| result assembly | `services/build-agent/app/core/result_assembler.py` |
| tool router wrapper | `services/build-agent/app/tools/router.py` |
| service-local runtime caller / policy / router | `services/build-agent/app/agent_runtime/llm/caller.py`, `app/agent_runtime/policy/termination.py`, `app/agent_runtime/tools/router_core.py` |

### Producer / Critic / Orchestrator boundary (2026-04-27)

Build Agent의 역할 용어는 Analysis Agent와 같지만 build-domain 의미로 제한한다.

| 역할 | 현재 표면 | 권한 경계 |
|---|---|---|
| Deterministic orchestration | `services/build-agent/app/core/phase_zero.py`, preflight/workspace setup | strict 입력 검증과 request-scoped 작업공간 준비 |
| Producer | `services/build-agent/app/producers/`, producer-safe portions of handlers/agent loop | build script / SDK profile / command candidate 작성 |
| Critic / QualityGate | `services/build-agent/app/quality/`, result assembler classification seams | strict contract, artifact verification, build-domain outcome classification |
| Orchestrator / State Machine | `services/build-agent/app/state_machine/`, final envelope assembly path | dependency unavailable vs build-domain deficiency 분리, final envelope authority |
| Service-local runtime | `services/build-agent/app/agent_runtime/` | former shared-runtime primitive helper의 local copy/specialization |

former shared-runtime package는 더 이상 Build Agent runtime/test dependency가 아니다. `buildOutcome`, `cleanPass`, `buildDiagnostics`는 `build-v1.1` active response schema의 기본 방출 필드다.

---

## 5. strict compile-first 실행 개요

```text
POST /v1/tasks (build-resolve)
  -> preflight
  -> phase0
  -> deterministic request-scoped wrapper attempt when phase0 can produce one
  -> bounded repair loop
  -> artifact validation
  -> completed / validation_failed / timeout / model_error / budget_exceeded
```

### Preflight 검증
- strict 필수 필드 존재 여부
- `build.mode` 유효성
- `sdk` 모드에서 `sdkId` / materialization source 존재 여부
- `buildTargetPath` scope 유효성
- `expectedArtifacts` 구조 유효성

### SDK materialization descriptor (2026-05-07)

Strict SDK builds distinguish registry identity from materialized filesystem access:

- `build.sdkId`: caller/registry identity for audit and downstream traceability.
- `build.sdkRootPath`: absolute server-visible root of the uploaded/materialized SDK.
- `build.setupScript`: preferred as `sdkRootPath`-relative setup script path; absolute transitional values must stay inside `sdkRootPath` when root is provided.
- `build.sysroot`: preferred as `sdkRootPath`-relative sysroot path; absolute transitional values must stay inside `sdkRootPath` when root is provided.
- `build.toolchainTriplet`: compiler prefix hint, not a path.
- `build.environment`: supplemental caller env, not a substitute for materialized SDK location.

Generated build scripts must consume trusted descriptor values rather than user-local paths embedded in `scriptHintPath` contents. This is required for the RE100/TI SDK hot11 stabilization goal, where `gateway-webserver` and four `gateway` apps are evidence for generalized uploaded-SDK support rather than TI-specific hardcoded behavior.

Descriptor precedence is fixed by the API contract:
- Canonical fields live directly under `context.trusted.build`.
- Legacy flat aliases are accepted only when the canonical field is absent or identical.
- Canonical/legacy conflicts are invalid contract failures, not silent overrides.
- `setupScript` and `sysroot` are resolved inside `sdkRootPath` whenever `sdkRootPath` is provided; absolute path escapes are invalid.
- Descriptor-derived env values (`AEGIS_SDK_ROOT`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `AEGIS_TOOLCHAIN_TRIPLET`, plus conventional `SDK_DIR` / `SDKTARGETSYSROOT` when derivable) are authoritative over supplemental caller env.

### bounded repair
LLM은 아래만 수행한다.
- build file 읽기
- request-scoped build script 작성/수정
- `try_build`
- 실패 복구

### deterministic phase0 wrapper
When Phase 0 has enough deterministic material, Build Agent may create `build-aegis-*/aegis-build.sh` before the LLM loop and try it once. For shell-script hints this wrapper is request-scoped and exports descriptor-derived SDK environment (`AEGIS_SDK_ROOT`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `SDK_DIR`, `SDKTARGETSYSROOT`) before invoking the referenced uploaded script. The public build command still executes only the generated `build-aegis-*/aegis-build.sh`; uploaded script paths remain disallowed as direct `buildCommand`/`buildScript` evidence. If this deterministic attempt cleanly builds all expected artifacts, Build Agent may return `modelProfile="deterministic-phase0"` without an LLM repair loop. If it fails, the bounded LLM repair loop remains the fallback.

### artifact validation
clean pass는 반드시
- declared mode 유지
- reusable build command 제공
- try_build 성공 evidence 존재
- expectedArtifacts 충족
을 모두 만족해야 한다.

`EXPECTED_ARTIFACTS_MISMATCH`는 top-level `validation_failed`가 아니라 `status=completed`, `result.cleanPass=false`, `result.buildOutcome.outcome="artifact_mismatch"`, `result.buildDiagnostics.failureCode="EXPECTED_ARTIFACTS_MISMATCH"`로 표현한다.

---

## 6. 도구 / 정책

### 도구
- `list_files`
- `read_file`
- `write_file`
- `edit_file`
- `delete_file`
- `try_build`

### 정책
- request-scoped writable area만 허용
- destructive 명령 차단
- duplicate call 차단
- build write-tool 성공 후 duplicate hash clear

### S7 caller-owned generation controls / P16/P17 hardening (2026-04-29)

Build Agent now mirrors Analysis Agent's S3-owned generation policy. Service-local `app/agent_runtime/llm/generation_policy.py` owns named generation presets, and `LlmCaller` sync/async request bodies always include S7's full caller-owned tuple: `max_tokens`, `temperature`, `top_p`, `top_k`, `min_p`, `presence_penalty`, `repetition_penalty`, and `chat_template_kwargs.enable_thinking`.

Public `/v1/tasks.constraints` remains backward compatible and adds optional camelCase overrides: `enableThinking`, `temperature`, `topP`, `topK`, `minP`, `presencePenalty`, `repetitionPenalty`. `topK` accepts `-1` or greater to stay aligned with S7/vLLM unlimited top-k semantics; named presets keep positive defaults. Unknown/snake_case public keys are rejected. `constraints.maxTokens`, `agent_llm_max_tokens`, and `agent_max_completion_tokens` are aligned to `32768`.

`TimeoutDefaults` remains service-local for ordinary short operations and generic tool execution, but health-control v2 removes elapsed poll-deadline semantics from long-running ownership paths. S7 async LLM polling has no fixed age deadline while the gateway reports queued/running progress. `try_build` declares `wait_while_alive=true`, so the generic 120s ToolExecutor wrapper does not cut it off while S4 reports alive/non-blocked ownership. The durable S4 `/v1/build` path no longer sends an end-to-end `X-Timeout-Ms: 120000`; short HTTP connect/status/result timeouts remain transport guards only.

Build Agent does **not** use vLLM/OpenAI `tool_choice="required"` for mandatory first acquisition. Ordinary tool-capable turns use `tool_choice="auto"`; mandatory first acquisition is enforced by Build Agent runtime ToolIntent dispatch (`tools=None`, no `tool_choice`, strict JSON ToolIntent, thinking enabled), then converted into a synthetic `ToolCallRequest` and dispatched through the normal tool router. This supersedes the older 2026-04-29 P10 shorthand because Qwen/vLLM reasoning-parser stacks can return `finish_reason="tool_calls"` with empty `tool_calls[]` under `enable_thinking=true` + `tool_choice="required"`. Tool-call arguments are validated before dispatch and schema violations return retryable tool errors without execution. Tool results are wrapped at the LLM-facing untrusted-data boundary while raw audit/evidence content remains intact; literal injected boundary delimiters are neutralized before wrapping. Scalar `LlmCaller.call(temperature=...)` is deprecated transitional compatibility only and must be removed after S3 readiness-gate evidence shows every active call site uses named `GenerationControls` presets.

### S7 async ownership / thinking-on 소비
Build Agent도 tool 없는 LLM turn에서 S7의 async ownership surface를 우선 사용한다. 2026-04-28 S7 WR 소비 후 tool-call turn과 tool-less strict JSON finalizer 모두 기본 `enable_thinking=true` 요청을 보낸다.

적용 범위:
- `services/build-agent/app/core/agent_loop.py`
- `build-resolve`
- `sdk-analyze`

동작 원칙:
- 새 async ownership surface 사용 시 submit → status poll → result fetch
- queued/running 상태는 elapsed wall-clock age만으로 취소하지 않는다.
- surface가 unavailable이면 sync `/v1/chat`로 fallback
- unsupported async surface(404/405/501)는 짧게 cooldown 캐시하여, 매 호출마다 같은 probe를 반복하지 않도록 한다
- 이는 Build Agent outward API를 바꾸는 변화가 아니라 **internal consumer-side reliability hardening**이다.

### S4 build ownership consumer (health-control v2, 2026-05-08)

`try_build`의 production path는 S4 `/v1/build`에 `Prefer: respond-async`와 derived child `X-Request-Id`를 보내고, `/v1/status/{requestId}` 및 `/v1/result/{requestId}`를 통해 완료 결과를 수거한다. Child request id는 parent request id + endpoint + operation + payload fingerprint로 계산한다.

Policy:
- 동일 payload retry는 같은 child id를 사용해 idempotent ownership을 유지한다.
- `buildCommand`, environment, provenance 등 payload가 달라지면 fingerprint가 바뀌므로 새 child id를 사용한다.
- S4 `queued/running` + non-blocked/phase-advancing/transport-only 상태는 계속 대기한다.
- S4 `ack-break`, blocked, missing ownership, terminal-without-result는 Build Agent tool failure로 기록한다.
- S4 result envelope가 `success=false`이거나 nested build-domain failure를 담으면 Build Agent는 이를 `cleanPass=false` evidence로 보존한다. `completed` envelope를 clean success로 승격하지 않는다.

### Build Agent health request summary (health-control v2, 2026-05-08)

`GET /v1/health`는 additive `activeRequestCount`와 request-aware `requestSummary`를 노출한다. `requestSummary.localAckState` vocabulary는 `phase-advancing`, `transport-only`, `ack-break`, `null`이며, downstream lanes는 이를 alive/blocked 판단에 사용할 수 있다.

---

## 7. 현재 검증 기준 (2026-04-27)

### hot11 SDK-materialization stabilization gate (2026-05-07)

The canonical live stabilization runner for this workstream is `services/build-agent/scripts/stabilization_runner.py`. `services/build-agent/scripts/build-test.sh` is not the hot11 authority unless it is explicitly repaired to the same contract; it remains a legacy/manual helper and must not be used to prove the SDK materialization goal.

The hot11 manifest is staged under the ignored upload fixture area (`uploads/build-agent-stabilization-datasets/manifest.json`) from tracked staging code. It contains the existing hot6 cases plus five RE100/TI cases:

1. `certificate-maker`
2. `cjson`
3. `libexpat`
4. `redis`
5. `openssl`
6. `pjproject`
7. `gateway-webserver`
8. `gateway-central`
9. `gateway-mqtt_broker`
10. `gateway-coap_server`
11. `gateway-lwm2m_server`

Acceptance is all-or-nothing: every hot11 case must finish `status=completed`, `result.cleanPass=true`, and `result.buildOutcome.outcome="built"` unless the user explicitly scopes a diagnostic-only run. The stabilization report must also collect:
- the Build Agent response and expected artifact evidence,
- generated `build-aegis-*/aegis-build.sh` paths,
- generated script content audit results,
- direct-script execution guard results,
- request descriptor echo/audit material sufficient to show the S3 runner used the SDK descriptor.

Anti-overfit gates are part of the hot11 test system, not optional commentary:
- Static guard: active Build Agent code must not contain host-specific SDK roots (`/home/kosh/ti-sdk`, `ti-processor-sdk-linux-am335x-evm-08.02.00.24`) or RE100 project-name shortcuts.
- Generated-script audit: generated `aegis-build.sh` files must not embed forbidden host default SDK roots, installer basenames, or case-name special-casing. Request-scoped descriptor paths are allowed as evidence when supplied by the manifest.
- Metamorphic guard: at least one SDK case must be runnable from a renamed/randomized fixture parent and/or descriptor root, and must still pass via descriptor resolution. A name-dependent failure is an overfit failure even if the canonical case passes.
- Negative control: the staged manifest may keep canonical hot11 under `cases[]` and put renamed controls under `controls[]`; live proof must include `stabilization_runner.py --include-controls` so the renamed control is actually executed/evaluated.

Legacy compatibility remains part of the gate: `/v1/health.version` stays `1.0.0`, active response schema stays `build-v1.1`, and existing legacy alias parsing remains covered by unit tests.

### 핵심 테스트 축
- `test_health.py`
- `test_build_request_contract.py`
- `test_golden.py`
- `test_sdk_analyze_deterministic.py`
- `test_result_assembler.py`
- `test_tool_router.py`
- `test_concurrency.py`
- `test_agent_loop.py`
- `test_sdk_analyze_handler.py`
- `test_build_resolve_handler.py`
- `test_role_boundaries.py`

### 최근 검증 결과
- build-agent full suite: **388 passed in 3.06s** (2026-05-08, health-control v2 consumer implementation)
- analysis-agent sibling full suite for S3 boundary regression: **585 passed in 6.00s** (2026-05-08)
- focused blocker suite `tests/test_sast_tool.py tests/test_phase_one.py tests/test_health_control_v2_static_guard.py`: **66 passed in 0.83s**
- `python3 -m compileall -q services/analysis-agent/app services/analysis-agent/eval services/build-agent/app && git diff --check -- services/analysis-agent services/build-agent`: **PASS**
- hidden-temperature regression guard over S3-owned services: **PASS** (`temperature=0.3` defaults no matches outside excluded caches/venvs)
- full-tuple / `TimeoutDefaults` / schema-validation / input-boundary static coverage guard: **PASS** (274 hits across implementation/tests)
- 2026-05-03 S3 LLM readiness gate: **PASS** (`services/analysis-agent/tests/test_s3_llm_readiness_gate.py`, local `.omx/context/s3-llm-readiness-gate-20260503.py`), including P16 boundary-marker neutralization
- thinking-off regression guard over S3-owned services: **PASS** (`enable_thinking=False`, `enable_thinking.*False`, `/no_think` no matches outside excluded caches/venvs)
- 2026-05-07 SDK materialization/hot11 workstream: build-agent full suite **382 passed in 0.96s**; `python3 -m compileall -q services/build-agent/app services/build-agent/scripts`: **PASS**; `git diff --check`: **PASS**; `stage_hot11_datasets.py --clean`: staged canonical hot11 plus `renamed-sdk-control-web`; `stabilization_runner.py --live --include-controls --run-label hot11-controls-live-final-20260507-210320`: **PASS**, 12/12 `completed_clean` including canonical hot11 and renamed control.

---

## 8. 운영 메모

- strict contract 의미는 리팩토링보다 우선한다.
- `tasks.py`는 public router 역할만 맡는다.
- `build-resolve` completed 응답은 기존 `buildResult`와 별도로 `buildPreparation`, `buildOutcome`, `cleanPass`, `buildDiagnostics`를 반환한다.
- S2는 `cleanPass`가 true인 경우에만 빌드 성공/준비 완료로 간주해야 한다.
- tool-less LLM turn의 async ownership 우선 사용과 unsupported-surface cooldown은 internal hardening일 뿐, outward Build Agent API의 active schema는 별도 `build-v1.1`로 명시한다.
