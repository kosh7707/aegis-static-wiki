---
title: "S3. Analysis Agent 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/analysis-agent.md"
last_verified: "2026-04-14"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/api/analysis-agent-api.md"]
---

# S3. Analysis Agent 기능 명세

> **소유자**: S3
> **최종 업데이트**: 2026-04-14

Analysis Agent는 자동차 임베디드 소프트웨어에 대해 **결정론적 Phase 1 + 구조화된 Phase 2**를 수행하는 증거 기반 보안 심층 분석 서비스다.

---

## 1. 핵심 원칙

1. **결정론적 우선** — SAST / 코드그래프 / SCA / KB 보강은 가능한 한 LLM 없이 수행한다.
2. **Evidence-first** — claim은 supplied/allowed evidence ref 안에서만 성립한다.
3. **LLM 표면 최소화** — LLM은 해석과 후속 도구 선택만 담당한다.
4. **S7 단일 관문** — 모든 LLM 호출은 S7 Gateway 경유다.
5. **public surface 안정성 우선** — `/v1/tasks`, `/v1/health`, `/v1/models`, `/v1/prompts` 의미를 내부 리팩토링으로 바꾸지 않는다.

---

## 2. 공개 엔드포인트

| 메서드 | 경로 | 용도 |
|---|---|---|
| POST | `/v1/tasks` | `deep-analyze`, `generate-poc` |
| GET | `/v1/health` | 서비스 상태 + prompt/version + KB/LLM 상태 + request-aware summary |
| GET | `/v1/models` | model profile 목록 |
| GET | `/v1/prompts` | prompt 목록 |

---

## 3. 공개적으로 보호되는 동작

다음은 S2-visible protected surface다.

1. `/v1/health.activePromptVersions`
   - `deep-analyze: agent-v1`
   - `generate-poc: v1`
2. `/v1/health.activeRequestCount` 와 `requestSummary`
   - additive control-signal block으로 제공
   - coarse health 필드를 대체하지 않는다
3. legacy taskType은 Analysis Agent가 직접 처리하지 않고 `UNKNOWN_TASK_TYPE`로 거절한다.
4. `deep-analyze`와 `generate-poc`의 top-level request/response shape는 유지한다.
5. analysis 결과는 구조화 JSON + audit 정보를 유지한다.

---

## 4. 현재 내부 아키텍처 (2026-04-09)

### Router / Handler 레이아웃

| 역할 | 파일 |
|---|---|
| public router | `services/analysis-agent/app/routers/tasks.py` |
| deep-analyze handler | `services/analysis-agent/app/routers/deep_analyze_handler.py` |
| generate-poc handler | `services/analysis-agent/app/routers/generate_poc_handler.py` |

`tasks.py`는 얇은 public router이며, handler 모듈로 위임한다. 다만 기존 테스트/호환성을 위해 `_handle_deep_analyze`, `_handle_generate_poc`, `_pipeline`, `_rebuild_pipeline` seam은 유지한다.

### Phase 1 레이아웃

| 역할 | 파일 |
|---|---|
| compatibility surface | `services/analysis-agent/app/core/phase_one.py` |
| executor façade | `services/analysis-agent/app/core/phase_one_executor.py` |
| orchestration flow | `services/analysis-agent/app/core/phase_one_flow.py` |
| shared types/constants | `services/analysis-agent/app/core/phase_one_types.py` |
| execution helpers | `services/analysis-agent/app/core/phase_one_exec.py` |
| KB/CVE/project-memory helpers | `services/analysis-agent/app/core/phase_one_kb.py` |
| prompt/render helpers | `services/analysis-agent/app/core/phase_one_prompt.py` |

핵심 의미:
- `phase_one.py`는 이제 compatibility façade다.
- `Phase1Executor`는 별도 파일에 있지만 기존 import 경로는 유지된다.
- 테스트와 호출자는 계속 `app.core.phase_one`를 import해도 된다.

### 기타 핵심 컴포넌트

| 역할 | 파일 |
|---|---|
| agent loop | `services/analysis-agent/app/core/agent_loop.py` |
| result assembly | `services/analysis-agent/app/core/result_assembler.py` |
| tool router | `services/analysis-agent/app/tools/router.py` |
| shared router core | `services/agent-shared/agent_shared/tools/router_core.py` |

---

## 5. Phase 1 의미

Phase 1은 아래를 결정론적으로 수행한다.

1. SAST 스캔
2. 코드 그래프 추출
3. SCA 라이브러리 식별
4. CVE batch lookup
5. KB threat query
6. dangerous-callers query
7. project-memory lookup
8. code-graph ingest

`buildCommand`가 있으면 `build-and-analyze` 경로를 우선 사용하고, 실패 시 individual tools로 fallback한다.

2026-04-13 기준 추가 운영 규칙:
- preferred Deep 입력은 flat 필드 나열보다 `buildPreparation` / `quickContext` / `graphContext` 같은 explicit-step bundle이다.
- `buildPreparation`은 Build Agent 산출물을 Deep에 전달하는 명시적 alias다.
- `quickContext`는 Quick에서 이미 확보한 `sastFindings` / `scaLibraries` 등을 다시 전달해 Phase 1 재실행을 줄일 때 사용한다.
- 기존 flat `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance`, `sastFindings`, `scaLibraries`는 compatibility surface로 유지한다.

---

## 6. Phase 2 의미

Phase 2는 Phase 1 결과를 프롬프트에 주입한 뒤 구조화된 LLM 루프를 수행한다.

사용 가능한 핵심 도구:
- `knowledge.search`
- `code_graph.callers`
- `code_graph.callees`
- `code_graph.search`
- `code.read_file`
- `build.metadata`

LLM 결과는 `ResultAssembler`와 evidence validation/sanitizer를 거친 뒤 응답으로 조립된다.

---

## 7. 현재 검증 기준 (2026-04-09)

### 핵심 테스트 축
- `test_skeleton_smoke.py`
- `test_phase_one.py`
- `test_generate_poc_handler.py`
- `test_agent_loop.py`
- `test_tool_router.py`

### 최근 검증 결과
- analysis-agent 주요 검증: **43 passed**
- live `/v1/health`: **PASS**

즉 내부 구조는 크게 바뀌었지만, public surface와 phase-one 동작은 계속 녹색이다.

---

## 8. 운영 메모

- internal refactor를 해도 `/v1/tasks`와 `/v1/health` 의미는 바꾸지 않는다.
- `phase_one.py`는 더 이상 거대 구현 파일이 아니라 compatibility surface라는 점을 항상 기억한다.
- 다른 lane과의 의미 정렬은 API 계약서와 WR로만 수행한다.
- 2026-04-13 첫 rollout부터 `/v1/health`는 coarse service health에 더해 request-aware control-signal summary를 additive하게 노출한다.
- S3는 local ack source를 직접 정의/소유하며, elapsed time alone으로 blocked를 판정하지 않는다.
- 2026-04-14 기준 S3는 S7 `/v1/chat` current pass-through limitation을 고려해, **도구 없는 chat 호출에는 strict JSON opt-in caller guard**를 함께 보낸다 (`response_format=json_object`, `enable_thinking=false`, `X-AEGIS-Strict-JSON: true`).
