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
  - "mcp://aegis-static-wiki.write_page"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["build-v1.1-default", "artifact-mismatch-completed", "producer-critic-orchestrator-boundary", "system-stability"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/work-requests/s3-to-s2-s3-build-agent-active-build-v1.1-contract-notice.md"]
---

# S3. Build Agent 기능 명세

> **소유자**: S3
> **최종 업데이트**: 2026-04-27

Build Agent는 업로드된 프로젝트에 대해 **strict compile-first control plane** 으로 동작한다. 호출자가 선언한 BuildTarget, 빌드 모드, 기대 산출물을 기준으로 preflight → phase0 → bounded repair → artifact validation을 수행한다.

---

## 1. 핵심 원칙

1. **compile-first** — 실제 컴파일 성립 여부가 1차 책임이다.
2. **caller intent 명시** — `buildTargetPath`, `build.mode`, `expectedArtifacts`는 호출자가 선언한다.
3. **no fake success** — compile DB만 있거나 artifact mismatch면 clean pass가 아니다.
4. **completed envelope는 품질 성공이 아니다** — 정상 입력/정상 런타임에서 빌드-domain 판단이 끝났다면 `status=completed`로 결과를 돌려주되, `result.cleanPass=false`와 diagnostics로 실패/불일치를 표현한다.
5. **원본 프로젝트 불변** — 쓰기는 request-scoped `build-aegis-<requestIdPrefix>/` 하위만 허용한다.
6. **bounded repair** — LLM은 build script 작성/복구만 담당한다.
7. **public contract는 통보식으로 갱신하되 문서와 runtime drift를 남기지 않는다** — 2026-04-27 기준 active response schema는 `build-v1.1`이다.

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
  -> bounded repair loop
  -> artifact validation
  -> completed / validation_failed / failed / timeout / model_error / budget_exceeded
```

### Preflight 검증
- strict 필수 필드 존재 여부
- `build.mode` 유효성
- `sdk` 모드에서 `sdkId` / materialization source 존재 여부
- `buildTargetPath` scope 유효성
- `expectedArtifacts` 구조 유효성

### bounded repair
LLM은 아래만 수행한다.
- build file 읽기
- request-scoped build script 작성/수정
- `try_build`
- 실패 복구

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

### S7 async ownership 소비
Build Agent도 tool 없는 LLM turn에서 S7의 async ownership surface를 우선 사용한다.

적용 범위:
- `services/build-agent/app/core/agent_loop.py`
- `build-resolve`
- `sdk-analyze`

동작 원칙:
- 새 async ownership surface 사용 시 submit → status poll → result fetch
- surface가 unavailable이면 sync `/v1/chat`로 fallback
- unsupported async surface(404/405/501)는 짧게 cooldown 캐시하여, 매 호출마다 같은 probe를 반복하지 않도록 한다
- 이는 Build Agent outward API를 바꾸는 변화가 아니라 **internal consumer-side reliability hardening**이다.

---

## 7. 현재 검증 기준 (2026-04-27)

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
- build-agent targeted contract suite: **29 passed** (`test_health.py`, `test_result_assembler.py`)
- build-agent full suite: **254 passed in 0.50s**

---

## 8. 운영 메모

- strict contract 의미는 리팩토링보다 우선한다.
- `tasks.py`는 public router 역할만 맡는다.
- `build-resolve` completed 응답은 기존 `buildResult`와 별도로 `buildPreparation`, `buildOutcome`, `cleanPass`, `buildDiagnostics`를 반환한다.
- S2는 `cleanPass`가 true인 경우에만 빌드 성공/준비 완료로 간주해야 한다.
- tool-less LLM turn의 async ownership 우선 사용과 unsupported-surface cooldown은 internal hardening일 뿐, outward Build Agent API의 active schema는 별도 `build-v1.1`로 명시한다.
