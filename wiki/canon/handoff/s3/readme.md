---
title: "S3. Analysis Agent 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s3-handoff/README.md"
last_verified: "2026-04-13"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/roadmap/s3-roadmap.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md"]
---

# S3. Analysis Agent 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.**
> **마지막 업데이트: 2026-04-14**

이 문서는 S3 lane의 현재 책임, 경계, 아키텍처, 그리고 2026-04-14 기준 최신 contract 정렬 상태를 다음 세션이 바로 이어받을 수 있도록 정리한 canonical handoff다.

---

## 1. S3의 역할

### S3 소유 서비스

| 서비스 | 포트/위치 | 역할 |
|---|---|---|
| Analysis Agent | `:8001` | `deep-analyze`, `generate-poc` |
| Build Agent | `:8003` | `build-resolve`, `sdk-analyze` |
| agent-shared | 라이브러리 | 공통 LLM/도구/정책/스키마 프레임 |

### S3가 호출하는 외부 서비스

| 서비스 | 소유 | 역할 |
|---|---|---|
| S7 Gateway (`:8000`) | S7 | 모든 LLM 호출 단일 관문 |
| S4 SAST Runner (`:9000`) | S4 | scan / functions / libraries / build-and-analyze / build |
| S5 Knowledge Base (`:8002`) | S5 | KB search / CVE lookup / code-graph / project-memory |

### S3의 정체성

> S3는 **결정론적 수집 + 구조화된 LLM 해석**으로 동작하는 증거 기반 보안 분석/control-plane 계층이다.

핵심 원칙:
1. Phase 1 결정론적 실행 우선
2. Phase 2 LLM 결정 표면 최소화
3. Evidence-first
4. public contract/health surface 안정성 우선

---

## 2. 소유 문서

| 문서 | 경로 |
|---|---|
| S3 handoff | `wiki/canon/handoff/s3/readme.md` |
| S3 roadmap | `wiki/canon/roadmap/s3-roadmap.md` |
| Analysis Agent spec | `wiki/canon/specs/analysis-agent.md` |
| Build Agent spec | `wiki/canon/specs/build-agent.md` |
| Analysis Agent API | `wiki/canon/api/analysis-agent-api.md` |
| Build Agent API | `wiki/canon/api/build-agent-api.md` |

문서 갱신 원칙:
- canonical wiki를 먼저 갱신한다.
- `docs/**`는 migration/compatibility surface일 뿐 canonical source가 아니다.
- 다른 lane 코드 동작은 API 계약서와 WR로만 이해한다.

---

## 3. 경계와 운영 규칙

### 다른 서비스 코드
- 다른 lane 코드 열람 금지
- 연동 해석은 API 계약서와 WR 기준
- 계약과 구현이 어긋나면 WR로 조정

### 금지/주의
- 커밋 금지
- 사용자 허락 없는 서비스 start/stop 금지
- canonical WR은 `wiki/canon/work-requests/**` 기준
- `docs/work-requests/**`는 archive-only reference

### Codex/OMX 메모
- 로그/장애 분석은 `log-analyzer` 우선
- 문서/세션 기록은 `wiki/canon/handoff/s3/` 우선
- lane 전용 진행 상태는 `.omx/state`와 handoff session artifact로 남긴다

---

## 4. 현재 아키텍처 상태 (2026-04-14)

### Analysis Agent 현재 구조

#### 공개 surface
- `POST /v1/tasks`
  - `deep-analyze`
  - `generate-poc`
- `GET /v1/health`
- `GET /v1/models`
- `GET /v1/prompts`

#### 현재 내부 레이아웃

| 영역 | 현재 파일 |
|---|---|
| public router | `services/analysis-agent/app/routers/tasks.py` |
| deep analyze handler | `services/analysis-agent/app/routers/deep_analyze_handler.py` |
| generate-poc handler | `services/analysis-agent/app/routers/generate_poc_handler.py` |
| phase1 compatibility surface | `services/analysis-agent/app/core/phase_one.py` |
| phase1 executor façade | `services/analysis-agent/app/core/phase_one_executor.py` |
| phase1 flow | `services/analysis-agent/app/core/phase_one_flow.py` |
| phase1 shared types | `services/analysis-agent/app/core/phase_one_types.py` |
| phase1 execution helpers | `services/analysis-agent/app/core/phase_one_exec.py` |
| phase1 KB/CVE helpers | `services/analysis-agent/app/core/phase_one_kb.py` |
| phase1 prompt/render | `services/analysis-agent/app/core/phase_one_prompt.py` |
| agent loop | `services/analysis-agent/app/core/agent_loop.py` |
| result assembly | `services/analysis-agent/app/core/result_assembler.py` |

#### 2026-04-13 contract 정렬 포인트
- preferred Deep 입력은 flat 필드 나열보다 `buildPreparation` / `quickContext` / `graphContext` 같은 explicit-step bundle이다.
- Analysis Agent는 위 nested alias를 읽지만, 기존 flat `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance`, `sastFindings`, `scaLibraries`도 compatibility를 위해 계속 읽는다.
- `quickContext.sastFindings` / `quickContext.scaLibraries`가 있으면 Phase 1 재실행을 줄이고 precomputed 결과를 사용할 수 있다.
- 첫 `/health` control-signal rollout에서 Analysis Agent는 additive `activeRequestCount` + `requestSummary` block을 제공한다.
- S3 local ack source 예시는 `phase-one-complete`, `tool-complete`, `turn-complete`, `result-assembled`, `terminal-result`, `ack-break`다.
- 2026-04-14 기준으로 S3는 S7 `/v1/chat` live limitation 대응을 위해, 도구 없는 chat 호출에 `X-AEGIS-Strict-JSON: true` caller guard를 추가했다.

### Build Agent 현재 구조

#### 공개 surface
- `POST /v1/tasks`
  - `build-resolve`
  - `sdk-analyze`
- `GET /v1/health`

#### 현재 내부 레이아웃

| 영역 | 현재 파일 |
|---|---|
| public router | `services/build-agent/app/routers/tasks.py` |
| build-resolve handler | `services/build-agent/app/routers/build_resolve_handler.py` |
| build-resolve support | `services/build-agent/app/routers/build_route_support.py` |
| sdk-analyze handler | `services/build-agent/app/routers/sdk_analyze_handler.py` |
| sdk-analyze support | `services/build-agent/app/routers/sdk_analyze_support.py` |
| phase0 | `services/build-agent/app/core/phase_zero.py` |
| agent loop | `services/build-agent/app/core/agent_loop.py` |
| result assembly | `services/build-agent/app/core/result_assembler.py` |

#### 2026-04-13 contract 정렬 포인트
- `build-resolve` 성공 응답은 기존 `result.buildResult`를 유지한다.
- 동시에 S2 orchestration용 explicit 후속 번들 `result.buildPreparation`을 반환한다.
- 현재 `buildPreparation` 주요 필드는 `declaredMode`, `sdkId`, `buildCommand`, `buildScript`, `buildDir`, `buildEnvironment`, `provenance`, `expectedArtifacts`, `producedArtifacts`다.

### agent-shared 현재 구조

| 영역 | 현재 파일 |
|---|---|
| shared budget | `services/agent-shared/agent_shared/budget/manager.py` |
| shared termination | `services/agent-shared/agent_shared/policy/termination.py` |
| shared tool router core | `services/agent-shared/agent_shared/tools/router_core.py` |
| shared LLM caller | `services/agent-shared/agent_shared/llm/caller.py` |

---

## 5. 보호해야 하는 외부 surface

다음은 **S2-visible protected surface**이며 내부 리팩토링 중에도 바꾸면 안 된다.

1. Analysis Agent `/v1/health`
   - `activePromptVersions = {deep-analyze: agent-v1, generate-poc: v1}`
2. Build Agent `/v1/health`
   - `version = 1.0.0`
3. Build Agent strict contract parsing
   - top-level `contractVersion`, `strictMode`
   - legacy alias normalization 유지
4. `/v1/tasks` request/response top-level shape
5. Analysis Agent legacy task rejection semantics

보충 메모:
- `result.buildPreparation` 추가는 기존 protected surface를 깨지 않는 **확장**으로 취급한다.
- Analysis Agent의 nested explicit-step alias 지원도 legacy flat 입력 제거가 아니라 **compatibility-preserving alias 추가**다.

---

## 6. 2026-04-14 기준 최신 상태

### 완료된 내부/계약 정렬
- shared `TerminationPolicy` 공통화
- shared `BudgetManager` 공통화
- shared `ToolRouter` core 공통화
- Build Agent `tasks.py` thin-router 분리 완료
- Analysis Agent `tasks.py` thin-router 분리 완료
- Analysis `phase_one.py`를 façade 수준까지 분해
- Build Agent `build-resolve` 성공 응답에 `result.buildPreparation` 추가
- Analysis Agent `deep-analyze`에 `buildPreparation` / `quickContext` / `graphContext` alias 입력 추가
- Analysis Agent `/v1/health`에 request-aware control-signal summary (`activeRequestCount`, `requestSummary`) 추가
- S2 / S4 / S7 회신을 수렴해 first-rollout freeze artifact `wiki/canon/specs/health-control-signal-rollout-v1.md` 발행
- S2에 post-freeze narrowed reply 송신
- S7 `/v1/chat` current pass-through limitation WR 검토 후, S3 caller-side strict JSON opt-in guard 반영
- S2 WR 2건 recipient-side 처리 및 reply WR 송신 완료

### 의미
- public surface는 유지
- explicit build-preparation → Quick → Deep 여정에 맞는 contract split이 시작됨
- S2는 이제 Build Agent 결과를 `buildPreparation` 중심으로 저장/전달할 수 있음
- Deep은 legacy flat 입력도 계속 받으면서 점진적으로 explicit-step bundle 중심으로 이동 가능함

---

## 7. 최신 검증 상태 (2026-04-14)

### targeted verification
- `services/build-agent/.venv/bin/python -m pytest tests/test_result_assembler.py -q` → **16 passed**
- `services/analysis-agent/.venv/bin/python -m pytest tests/test_phase_one.py -q` → **34 passed**
- `services/analysis-agent/.venv/bin/python -m pytest tests/test_health_request_summary.py tests/test_skeleton_smoke.py tests/test_generate_poc_handler.py tests/test_agent_loop.py -q` → **26 passed**
- `services/analysis-agent/.venv/bin/python -m pytest tests/test_llm_caller.py tests/test_generate_poc_handler.py tests/test_agent_loop.py -q` → **33 passed**
- `services/analysis-agent/.venv/bin/python -m pytest -q` → **293 passed**

### 무엇을 검증했는가
- Build Agent success 응답에 `buildPreparation` 번들이 포함되는지
- `buildPreparation`에 `buildEnvironment`, `provenance`, `expectedArtifacts`, `producedArtifacts`가 실리는지
- Analysis Agent가 top-level `buildCommand` 없이도 `buildPreparation.buildCommand`로 build-and-analyze 경로를 타는지
- Analysis Agent가 `quickContext.sastFindings` / `quickContext.scaLibraries`를 precomputed 입력으로 받아 결정론적 재실행을 건너뛰는지
- Analysis Agent `/v1/health`가 idle / running / ack-break summary를 additive하게 노출하는지
- `completed` history가 기본 `/v1/health` summary로 새지 않고 idle로 접히는지
- S7 strict JSON opt-in caller guard(`X-AEGIS-Strict-JSON`) 추가 후 LlmCaller / Analysis Agent 회귀가 유지되는지

세션 evidence는 `wiki/canon/handoff/s3/session-omx-1776067037145-ct82s1.md`에 기록되어 있다.

---

## 8. 다음 세션에서 바로 이어갈 수 있는 것

1. explicit-step contract 후속 정리
   - S2/S4/S5와 bundle 필드 의미 추가 정렬
   - 필요 시 `buildPreparation` / `quickContext` / `graphContext` schema 명문화
2. broader live smoke
   - `deep-analyze`
   - `generate-poc`
   - `build-resolve`
3. 문서/세션 기록 유지
   - major contract 변화 시 handoff / roadmap / spec / API 동시 갱신
4. legacy drift 관리
   - mounted backend / orchestration wording 중 legacy Quick→Deep 자동 후속 표현 추적

현재 상태는 **public contract를 유지한 채 explicit build-preparation → Quick → Deep 계약 분리를 시작한 상태**다.
