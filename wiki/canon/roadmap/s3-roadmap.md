---
title: "S3 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "docs/s3-handoff/roadmap.md"
last_verified: "2026-04-27"
service_tags: ["s3"]
decision_tags: ["quick-deep", "build-agent", "analysis-agent", "contract"]
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md"]
---

# S3 로드맵

> S3 lane의 다음 작업과 최근 완료 사항.
> **마지막 업데이트: 2026-04-27**

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
2. ✅ S2에 post-freeze narrowed follow-up 발송
3. ✅ Analysis Agent `/v1/health`에 additive `activeRequestCount` + `requestSummary` summary block 추가
4. ✅ S3 local ack source를 request-summary health semantics로 매핑
5. ✅ S3 관련 health summary 테스트 추가 및 green 확인

---

## 2026-04-14 진행/완료

### timeout-policy / no-result-loss rollout
1. ✅ elapsed wall-clock time alone으로는 더 이상 S3 로컬 abort를 발생시키지 않도록 shared `TerminationPolicy` 정렬
2. ✅ Analysis Agent `/v1/health`에 `transport-only` 대기 의미 보강
3. ✅ S3 timeout inventory 작성 및 S2/S4/S7 follow-up WR 교환 완료
4. ✅ S4 `/health` build/build-and-analyze seam, S2 consumer interpretation seam, S7 phase-2 direction WR 검토 완료

### S5 runtime semantics 소비
1. ✅ S5 `408 TIMEOUT` / `503 KB_NOT_READY` 구분 소비
2. ✅ phase-one KB threat/CVE/dangerous-callers timeout을 별도 플래그/프롬프트 caveat로 반영
3. ✅ S5 code-graph ingest `status/readiness/warnings` 실제 소비
4. ✅ GraphRAG/code-graph readiness에 따라 phase-2 graph tools gating

### S7 async ownership surface 소비
1. ✅ service-local `app.agent_runtime.llm.caller.LlmCaller`가 tool-less LLM 호출에서 새 async ownership surface 우선 사용
2. ✅ analysis-agent agent loop / `generate-poc`에 적용
3. ✅ build-agent agent loop에 적용
4. ✅ analysis-agent legacy `RealLlmClient` / `TaskPipeline` 경로에도 적용
5. ✅ analysis-agent `eval_runner` direct helper path에도 적용
6. ✅ async surface unavailable 시 sync `/v1/chat` fallback 유지
7. ✅ unsupported async surface(404/405/501) 반복 probe를 줄이기 위한 short-lived cooldown caching 추가
8. ✅ `generate-poc`, `deep-analyze`, `sdk-analyze`, `build-resolve` route-level async-ownership preference 회귀 테스트 추가

### fresh verification snapshot
- Analysis Agent full suite: **321 passed**
- Build Agent full suite: **237 passed**

---

## 중요 결론
- explicit build-preparation → Quick → Deep 여정은 유지된다.
- first-rollout `/health` control-signal contract는 S3/S4/S7/S2 전반에 반영되었다.
- S3 내부 주요 tool-less LLM 호출 경로는 이제 새 S7 async ownership surface를 실제로 소비한다.
- unsupported async surface가 아직 live runtime에 없더라도 repeated probe 낭비를 줄이도록 caller-side fallback behavior가 정리되었다.
- 최근 S5/S7 관련 작업은 대부분 **internal consumer-side hardening**이며, 추가 outward S3 public API delta는 아니다.

---

## 다음 우선순위

### 1. live runtime rollout confirmation
- S7 async ownership surface가 실제 localhost/runtime에서도 보이는지 재확인
- S4 `/health` additive request-summary build/build-and-analyze surface live smoke
- S7 `/health?requestId=` / async endpoint live smoke

### 2. phase-2 durability question
- S7 async ownership retention이 process restart를 넘어 durable해야 하는지 판단
- 필요 시 narrower WR / contract note 발행

### 3. explicit-step contract 명문화 강화
- `buildPreparation` bundle의 canonical field semantics 추가 정리
- `quickContext` / `graphContext`의 readiness/provenance payload shape 명문화
- 필요 시 shared schema surface / fixtures 도입 검토

### 4. legacy drift 축소
- mounted backend / orchestration wording의 legacy Quick→Deep 자동 후속 표현 추적
- compatibility 제거 전 flat 입력 의존 호출자 재점검

---

## 백로그

1. broader live smoke matrix
2. durable retention 필요 시 S7 async ownership follow-up
3. Build Agent 프로세스 격리
4. session artifact / verification evidence 누적 자동화 개선
5. explicit-step shared schema 또는 contract fixtures 정리

---

## 운영 메모

- S3는 다른 lane 코드로 계약을 추론하지 않는다.
- public surface 변경이 없더라도, contract 의미가 달라지면 canonical docs는 반드시 갱신한다.
- 현재 핵심은 **legacy outward contract 유지 + internal consumer hardening + health/no-result-loss rollout 정렬**이다.

---

## 2026-04-26 진행/완료

### Producer / Critic / Orchestrator service-local ownership 전환
1. ✅ retained shared-kernel 방향을 supersede하고 service-local ownership으로 전환
2. ✅ Analysis/Build 양쪽에 `app/agent_runtime/` 로컬 runtime helper copy/specialization 도입
3. ✅ Analysis/Build role boundary package 도입: `producers`, `quality`, `state_machine`
4. ✅ requirements와 service start script에서 former shared-runtime 의존 제거
5. ✅ Build v1.0.0 outward semantics 유지 + 현재 emitted additive fields 보존 방침 고정
6. ✅ bootstrap/charter ownership 표면에서 retired shared-runtime path 제거 완료

### fresh verification snapshot
- Analysis Agent full suite: **397 passed**
- Build Agent full suite: **252 passed**
- Build boundary targeted suite: **23 passed**
- `compileall` / `git diff --check`: **passed**
