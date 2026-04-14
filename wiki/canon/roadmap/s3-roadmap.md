---
title: "S3 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "docs/s3-handoff/roadmap.md"
last_verified: "2026-04-13"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md"]
---

# S3 로드맵

> S3 lane의 다음 작업과 최근 완료 사항.
> **마지막 업데이트: 2026-04-14**

---

## 2026-04-13 진행/완료

### explicit-step contract split 1차 정렬
1. ✅ Build Agent `build-resolve` 성공 응답에 `result.buildPreparation` 추가
2. ✅ Analysis Agent `deep-analyze`가 `buildPreparation` / `quickContext` / `graphContext` nested alias를 읽도록 정렬
3. ✅ 기존 flat `buildCommand`, `buildEnvironment`, `buildProfile`, `provenance`, `sastFindings`, `scaLibraries` compatibility 유지
4. ✅ canonical S3 API/spec/handoff 문서 업데이트
5. ✅ S2 WR 2건 recipient-side 완료 + S2로 reply WR 송신

### `/health` control-signal rollout v1 freeze + S3 slice 시작
1. ✅ S2 / S4 / S7 회신을 반영해 common freeze artifact 발행
   - `wiki/canon/specs/health-control-signal-rollout-v1.md`
2. ✅ S2에 post-freeze narrowed follow-up 발송
3. ✅ Analysis Agent `/v1/health`에 additive `activeRequestCount` + `requestSummary` summary block 추가
4. ✅ S3 local ack source를 request-summary health semantics로 매핑
5. ✅ S3 관련 health summary 테스트 추가 및 green 확인

## 2026-04-14 진행/완료

### S3 caller-side strict JSON guard 보강
1. ✅ S7 `/v1/chat` live limitation WR 검토 및 current contract 수용
2. ✅ shared `agent_shared.llm.caller.LlmCaller`에 no-tool `/v1/chat` 요청용 `X-AEGIS-Strict-JSON: true` caller guard 추가
3. ✅ Analysis Agent `RealLlmClient`에도 동일 strict JSON opt-in guard 추가
4. ✅ 관련 targeted / broader targeted / full-suite 회귀 확인

### targeted verification
- Build Agent: `tests/test_result_assembler.py` → **16 passed**
- Analysis Agent: `tests/test_phase_one.py` → **34 passed**
- Analysis Agent health/control summary: `tests/test_health_request_summary.py tests/test_skeleton_smoke.py tests/test_generate_poc_handler.py tests/test_agent_loop.py` → **26 passed**
- Analysis Agent caller guard: `tests/test_llm_caller.py tests/test_generate_poc_handler.py tests/test_agent_loop.py` → **33 passed**
- Analysis Agent full suite: `python -m pytest -q` → **293 passed**
- Build Agent shared-caller spot-check: `tests/test_contract_build.py tests/test_result_assembler.py tests/test_tool_router.py tests/test_build_request_contract.py` → **33 passed**

### 중요 결론
- explicit build-preparation → Quick → Deep 여정에 맞는 S3 계약 분리를 **확장 방식으로 시작**했다.
- S2는 이제 `buildPreparation`을 explicit build-prep 단계 산출물로 저장/전달할 수 있다.
- Deep은 nested explicit-step bundle을 선호 경로로 읽되, legacy flat 입력도 계속 받아 점진적 전환이 가능하다.

---

## 다음 우선순위

### 1. contract 명문화 강화
- `buildPreparation` bundle의 canonical field semantics 추가 정리
- `quickContext` / `graphContext`에 어떤 provenance/graph payload를 담을지 S2/S4/S5와 추가 정렬
- 필요 시 shared schema surface 도입 검토

### 0. runtime rollout confirmation
- S4 `/health` additive request-summary surface가 live runtime에서도 실제로 보이는지 재확인
- S7 `/v1/chat` strict JSON opt-in mode가 live runtime에서도 실제로 적용되는지 재확인

### 2. live smoke 확대
- `deep-analyze` live smoke
- `generate-poc` live smoke
- `build-resolve` live smoke
- explicit-step bundle 기반 request/response snapshot 재채집

### 3. legacy drift 축소
- mounted backend / orchestration wording의 legacy Quick→Deep 자동 후속 표현 추적
- compatibility 제거 전, 어떤 호출자가 여전히 flat 입력에 의존하는지 확인

### 4. 회귀 검증 강화
- explicit-step bundle 입력에 대한 추가 regression matrix
- buildPreparation + quickContext 조합 케이스 확대
- artifact/provenance edge case 보강

---

## 백로그

1. broader regression matrix
2. Build Agent 프로세스 격리
3. Analysis Agent 결과 조립/loop 추가 정리 여부 판단
4. session artifact / verification evidence 누적 자동화 개선
5. explicit-step shared schema 또는 contract fixtures 정리

---

## 운영 메모

- S3는 다른 lane 코드로 계약을 추론하지 않는다.
- public surface 변경이 없더라도, contract 의미가 달라지면 canonical docs는 반드시 갱신한다.
- 현재는 **legacy 호환성 유지 + explicit-step 계약 정렬**이 핵심이다.
