---
title: "S3. Analysis Agent 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s3-handoff/README.md"
last_verified: "2026-04-09"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/roadmap/s3-roadmap.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md"]
---

# S3. Analysis Agent 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.**
> **마지막 업데이트: 2026-04-09**

이 문서는 S3 lane의 현재 책임, 경계, 아키텍처, 그리고 2026-04-09 기준 최신 내부 리팩토링 상태를 다음 세션이 바로 이어받을 수 있도록 정리한 canonical handoff다.

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
- 다른 lane 코드 동작은 API 계약서로만 이해한다.

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

## 4. 현재 아키텍처 상태 (2026-04-09)

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

---

## 6. 2026-04-09 기준 리팩토링 상태

### 완료된 내부 정리
- shared `TerminationPolicy` 공통화
- shared `BudgetManager` 공통화
- shared `ToolRouter` core 공통화
- Build Agent `tasks.py` thin-router 분리 완료
- Analysis Agent `tasks.py` thin-router 분리 완료
- Analysis `phase_one.py`를 façade 수준까지 분해

### 현재 크기(대략)
- `services/build-agent/app/routers/tasks.py`: **86 LOC**
- `services/analysis-agent/app/routers/tasks.py`: **185 LOC**
- `services/analysis-agent/app/core/phase_one.py`: **14 LOC** compatibility surface

### 의미
- public surface는 유지
- 내부는 handler / flow / helper / type 단위로 분리
- 향후 수정 시 drift 위험이 크게 줄어든 상태

---

## 7. 최신 검증 상태 (2026-04-09)

### Analysis Agent
- `test_phase_one.py`
- `test_generate_poc_handler.py`
- `test_skeleton_smoke.py`
- 최근 합산 검증: **43 passed**

### Build Agent
- `test_health.py`
- `test_build_request_contract.py`
- `test_tool_router.py`
- `test_concurrency.py`
- 최근 합산 검증: **26 passed**

### Live health
- `http://localhost:8001/v1/health` → PASS
- `http://localhost:8003/v1/health` → PASS

---

## 8. 다음 세션에서 바로 이어갈 수 있는 것

1. 내부 추가 cleanup
   - handler 내부 추가 분해
   - phase-one helper naming 정리
2. broader live smoke
   - `deep-analyze`
   - `generate-poc`
   - `build-resolve`
3. 문서/세션 기록 유지
   - major internal structure 변화 시 spec/handoff/roadmap 동시 갱신

현재 상태는 **public contract를 유지한 채 내부 구조를 정리하는 작업이 거의 안정권에 들어온 상태**다.
