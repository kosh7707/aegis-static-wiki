---
title: "S3. Build Agent 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/build-agent.md"
last_verified: "2026-04-13"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/api/build-agent-api.md"]
---

# S3. Build Agent 기능 명세

> **소유자**: S3
> **최종 업데이트**: 2026-04-13

Build Agent는 업로드된 프로젝트에 대해 **strict compile-first control plane** 으로 동작한다. 호출자가 선언한 서브프로젝트, 빌드 모드, 기대 산출물을 기준으로 preflight → phase0 → bounded repair → artifact validation을 수행한다.

---

## 1. 핵심 원칙

1. **compile-first** — 실제 컴파일 성립 여부가 1차 책임이다.
2. **caller intent 명시** — `subprojectPath`, `build.mode`, `expectedArtifacts`는 호출자가 선언한다.
3. **no fake success** — compile DB만 있거나 artifact mismatch면 성공이 아니다.
4. **원본 프로젝트 불변** — 쓰기는 request-scoped `build-aegis-<requestIdPrefix>/` 하위만 허용한다.
5. **bounded repair** — LLM은 build script 작성/복구만 담당한다.
6. **public contract 안정성 우선** — strict contract와 `/v1/health` 의미를 내부 리팩토링으로 바꾸지 않는다.

---

## 2. 공개 엔드포인트

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `build-resolve`, `sdk-analyze` |
| GET | `/v1/health` | 상태 + 에이전트 설정 |

---

## 3. 보호되는 외부 surface

1. `/v1/health.version = 1.0.0`
2. strict contract parsing
   - top-level `contractVersion`
   - top-level `strictMode`
   - legacy alias normalization 유지
3. `/v1/tasks` 성공/실패 응답 top-level shape 유지
4. `build-resolve` / `sdk-analyze` 의미 유지

---

## 4. 현재 내부 아키텍처 (2026-04-09)

### Router / Handler 레이아웃

| 역할 | 파일 |
|---|---|
| public router | `services/build-agent/app/routers/tasks.py` |
| build-resolve handler | `services/build-agent/app/routers/build_resolve_handler.py` |
| build-resolve support | `services/build-agent/app/routers/build_route_support.py` |
| sdk-analyze handler | `services/build-agent/app/routers/sdk_analyze_handler.py` |
| sdk-analyze support | `services/build-agent/app/routers/sdk_analyze_support.py` |

의미:
- `tasks.py`는 얇은 public router다.
- 실제 task execution은 handler 모듈로 위임한다.
- helper는 support 모듈로 분리되어 있다.

### 기타 핵심 컴포넌트

| 역할 | 파일 |
|---|---|
| phase0 | `services/build-agent/app/core/phase_zero.py` |
| agent loop | `services/build-agent/app/core/agent_loop.py` |
| result assembly | `services/build-agent/app/core/result_assembler.py` |
| tool router wrapper | `services/build-agent/app/tools/router.py` |
| shared router core | `services/agent-shared/agent_shared/tools/router_core.py` |
| shared budget | `services/agent-shared/agent_shared/budget/manager.py` |
| shared termination | `services/agent-shared/agent_shared/policy/termination.py` |

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
- `subprojectPath` scope 유효성
- `expectedArtifacts` 구조 유효성

### bounded repair
LLM은 아래만 수행한다.
- build file 읽기
- request-scoped build script 작성/수정
- `try_build`
- 실패 복구

### artifact validation
성공 응답은 반드시
- declared mode 유지
- reusable build command 제공
- expectedArtifacts 충족
을 모두 만족해야 한다.

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

---

## 7. 현재 검증 기준 (2026-04-09)

### 핵심 테스트 축
- `test_health.py`
- `test_build_request_contract.py`
- `test_golden.py`
- `test_sdk_analyze_deterministic.py`
- `test_result_assembler.py`
- `test_tool_router.py`
- `test_concurrency.py`

### 최근 검증 결과
- build-agent 보호 surface 검증: **26 passed**
- 더 넓은 split/regression 검증도 recent green 유지
- live `/v1/health`: **PASS**

---

## 8. 운영 메모

- strict contract 의미는 리팩토링보다 우선한다.
- `tasks.py`는 더 이상 giant file이 아니며 public router 역할만 맡는다.
- 향후 내부 cleanup은 handler/support 모듈 내부에서 진행하고, public surface는 유지한다.
- `build-resolve` 성공 응답은 기존 `buildResult`와 별도로 `buildPreparation` 번들을 반환한다. S2는 이를 explicit build-preparation step의 저장/전달 단위로 사용할 수 있다.
