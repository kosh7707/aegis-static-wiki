---
title: "S3. Analysis Agent 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s3-handoff/README.md"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/roadmap/s3-roadmap.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md"]
---

# S3. Analysis Agent 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.**
> **마지막 업데이트: 2026-04-27**

이 문서는 S3 lane의 현재 책임, 경계, 아키텍처, 그리고 2026-04-27 기준 최신 implementation/contract 정렬 상태를 다음 세션이 바로 이어받을 수 있도록 정리한 canonical handoff다.

---

## 1. S3의 역할

### S3 소유 서비스

| 서비스 | 포트/위치 | 역할 |
|---|---|---|
| Analysis Agent | `:8001` | `deep-analyze`, `generate-poc` |
| Build Agent | `:8003` | `build-resolve`, `sdk-analyze` |
| agent_runtime (service-local) | 각 서비스 내부 `app/agent_runtime/` | Analysis/Build 각각의 로컬 LLM/도구/정책/스키마 프레임. 공유 런타임 디렉터리는 retired/deleted 상태 |

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

### Analysis Agent 공개 surface
- `POST /v1/tasks`
  - `deep-analyze`
  - `generate-poc`
- `GET /v1/health`
- `GET /v1/models`
- `GET /v1/prompts`

### Build Agent 공개 surface
- `POST /v1/tasks`
  - `build-resolve`
  - `sdk-analyze`
- `GET /v1/health`

### 내부 레이아웃 요약

| 영역 | 현재 파일 |
|---|---|
| analysis public router | `services/analysis-agent/app/routers/tasks.py` |
| analysis handlers | `services/analysis-agent/app/routers/deep_analyze_handler.py`, `generate_poc_handler.py` |
| analysis phase1 façade / flow | `services/analysis-agent/app/core/phase_one*.py` |
| analysis loop / result assembly | `services/analysis-agent/app/core/agent_loop.py`, `result_assembler.py` |
| build public router | `services/build-agent/app/routers/tasks.py` |
| build handlers | `services/build-agent/app/routers/build_resolve_handler.py`, `sdk_analyze_handler.py` |
| build phase0 / loop / result assembly | `services/build-agent/app/core/phase_zero.py`, `agent_loop.py`, `result_assembler.py` |
| service-local caller / policy / router | `services/analysis-agent/app/agent_runtime/**`, `services/build-agent/app/agent_runtime/**` |
| analysis legacy direct caller | `services/analysis-agent/app/clients/real.py` |
| analysis eval helper | `services/analysis-agent/eval/eval_runner.py` |

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
- `result.buildPreparation` 추가는 기존 protected surface를 깨지 않는 **확장**이다.
- Analysis Agent nested explicit-step alias 지원도 **compatibility-preserving alias 추가**다.
- 2026-04-14의 후속 S5/S7 hardening은 **internal consumer-side behavior** 변화이며, 추가 outward S3 public API delta는 아니다.

---

## 6. 2026-04-14 기준 최신 상태

### 완료된 핵심 정렬
- shared `TerminationPolicy` / `BudgetManager` / `ToolRouter` 공통화
- Build Agent `tasks.py` thin-router 분리 완료
- Analysis Agent `tasks.py` thin-router 분리 완료
- Build Agent `build-resolve` 성공 응답에 `result.buildPreparation` 추가
- Analysis Agent `deep-analyze`에 `buildPreparation` / `quickContext` / `graphContext` alias 입력 추가
- Analysis Agent `/v1/health`에 request-aware control-signal summary (`activeRequestCount`, `requestSummary`) 추가
- elapsed wall-clock time alone으로는 더 이상 S3 로컬 abort를 발생시키지 않도록 정렬
- Analysis Agent `/health`는 장시간 대기 구간에서 `transport-only`를 노출할 수 있음

### S5 2026-04-14 notice 소비
- explicit `408 TIMEOUT` vs `503 KB_NOT_READY` 구분
- code-graph ingest `status/readiness/warnings` 실제 소비
- GraphRAG/code-graph readiness에 따라 phase-2 graph tools gating
- `dangerous-callers`는 Neo4j readiness가 명시적으로 false면 실행하지 않음
- prompt에서 S5 timeout/partial-readiness를 negative evidence처럼 오해하지 않도록 caveat 반영

### S7 2026-04-14 phase-2 소비
- tool-less LLM 호출은 새 async ownership surface를 우선 사용
- async surface unavailable이면 sync `/v1/chat`로 fallback
- 적용 범위:
  - analysis-agent agent loop
  - `generate-poc`
  - `build-agent` agent loop
  - analysis-agent legacy `RealLlmClient` / `TaskPipeline`
  - analysis-agent `eval_runner`
- unsupported async surface(404/405/501)는 짧게 cooldown 캐시하여, 매 호출마다 같은 probe를 반복하지 않도록 정렬

### 의미
- public surface는 유지된다.
- explicit build-preparation → Quick → Deep 계약 분리는 유지된다.
- timeout-policy redesign first rollout은 `/health` 중심으로 정렬되었다.
- no-result-loss 방향의 phase-2 async ownership surface는 S3 내부 주요 tool-less LLM 경로에서 실제 소비 중이다.
- 최근 S5/S7/S4 변화는 문서 수준이 아니라 S3 내부 동작에도 반영된 상태다.

---

## 7. 최신 검증 상태 (2026-04-14)

### fresh verification snapshot
- `services/analysis-agent/.venv/bin/python -m pytest -q` → **321 passed**
- `services/build-agent/.venv/bin/python -m pytest -q` → **237 passed**

### 최근 focused evidence 하이라이트
- analysis-agent focused timeout-policy/health/async-ownership reruns green
- build-agent protected/contract/async-ownership reruns green
- eval helper async-ownership fallback/cooldown hardening green
- `generate-poc`, `deep-analyze`, `sdk-analyze`, `build-resolve` route-level async-ownership preference regression 추가

### 무엇을 최근에 검증했는가
- Build Agent success 응답의 `buildPreparation` bundle 유지
- Analysis Agent health summary의 idle / running / transport-only / ack-break semantics
- S5 `408 TIMEOUT` / `503 KB_NOT_READY` 소비 분리
- S5 code-graph ingest readiness에 따른 graph-tool gating
- S7 async ownership surface 우선 사용 + sync fallback
- unsupported async surface cooldown 캐싱
- route-level handler에서 실제 async ownership preference 요청 여부

---

## 8. 다음 세션에서 바로 이어갈 수 있는 것

1. **live runtime smoke 확대**
   - S7 async ownership surface가 실제 localhost/runtime에 배포된 상태에서 end-to-end smoke
   - S4/S7 `/health?requestId=` live polling smoke
2. **phase-2 durability question**
   - S7 async ownership retention이 process restart를 넘어 durable해야 하는지 판단
   - 필요 시 narrower WR / contract note 발행
3. **explicit-step contract 명문화 강화**
   - `buildPreparation` / `quickContext` / `graphContext` schema/fixtures 정리
4. **legacy drift 정리**
   - mounted backend/orchestration wording의 legacy Quick→Deep 자동 후속 표현 추적

현재 상태는 **public contract를 유지한 채 explicit-step + health-control + no-result-loss internal consumption을 상당 부분 실제 코드에 반영한 상태**다.

---

## 9. 2026-04-26 Producer/Critic/Orchestrator refactor status

S3는 retained shared-kernel 방향을 폐기하고, Analysis Agent와 Build Agent가 primitive runtime helper까지 service-local copy/specialization으로 소유하는 방향으로 전환했다.

핵심 경계:
- Producer: quality-aware candidate artifact author. 최종 score/verdict authority 없음.
- Critic / QualityGate: independent classifier / repair planner. Evidence fabrication 금지.
- Orchestrator / State Machine: task survival boundary, RecoveryTriage, final envelope authority.

현재 구현 표면:
- Analysis runtime: `services/analysis-agent/app/agent_runtime/`
- Build runtime: `services/build-agent/app/agent_runtime/`
- Analysis role modules: `app/producers`, `app/quality`, `app/state_machine`
- Build role modules: `app/producers`, `app/quality`, `app/state_machine`

후속 ownership coordination:
- 2026-04-27 기준 canonical charter와 로컬 bootstrap ownership map은 S3 active path를 `services/analysis-agent`, `services/build-agent`로 정렬했다.
- 앞으로 공유 런타임 디렉터리를 active S3 owned path로 다시 추가하지 않는다. 필요한 primitive helper는 각 서비스 내부 `app/agent_runtime/`에서 독립적으로 소유한다.
