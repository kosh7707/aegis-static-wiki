---
title: "S7 Roadmap"
page_type: "canonical-roadmap"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s7-handoff/roadmap.md"
original_path: "docs/s7-handoff/roadmap.md"
last_verified: "2026-04-14"
service_tags: ["s7"]
decision_tags: []
related_pages: []
migration_status: "canonicalized"
---

# S7 Roadmap

> 다음 작업 + 장기 계획

---

## 즉시 다음 작업

### 1) strict JSON + request-aware health + async ownership runtime rollout 마무리

- 2026-04-14 repo 기준 `/v1/chat` opt-in strict JSON mode, `/v1/health` request-aware control-signal summary, 그리고 phase-2 async ownership surface 구현 완료
- 다음 세션의 최우선 작업은 **실제 떠 있는 S7 gateway 프로세스가 새 코드로 재기동/rollout 되었는지 확인**하는 것
- 완료 기준:
  - live `http://localhost:8000/v1/chat`에 `X-AEGIS-Strict-JSON: true` 요청 시 응답 헤더 `X-AEGIS-Strict-JSON: applied` 확인
  - strict mode 성공 케이스에서 `choices[0].message.content` compact JSON + `reasoning: null` 확인
  - strict mode 실패 케이스에서 502 명확 실패 확인
  - live `http://localhost:8000/v1/health?requestId=<active-id>`에서 `activeRequestCount` / `requestSummary` / `localAckState` / `phase`가 additive하게 노출되는지 확인
  - live async submit/status/result/cancel smoke로:
    - durable `requestId` 발급
    - wrapped final `response`
    - explicit not-ready / expired behavior
    - 15분 retention metadata (`expiresAt`)
    를 확인

### 2) caller guidance 안정화

- S3/S2 호출자에게 현재 지원 계약을 유지:
  - strict JSON이 필요하면 `X-AEGIS-Strict-JSON: true`
  - 응답은 OpenAI envelope 유지, **`choices[0].message.content`만 JSON으로 파싱**
  - active request polling이 필요하면 `GET /v1/health?requestId=<X-Request-Id>`를 사용
  - stronger no-result-loss semantics가 필요하면 `/v1/chat` 대신 `POST /v1/async-chat-requests`와 status/result/cancel 흐름을 사용
- runtime rollout 후 실제 live smoke 결과를 바탕으로 추가 문서 drift가 없는지 재점검
- stronger no-result-loss semantics가 필요하면 `/v1/chat`가 아니라 별도 async surface 후보로 연결

### 3) next-step wait-while-alive contract 정리

- 2026-04-14 S7 phase-2 decision: **Option C — `/v1/chat`를 stretch하지 말고, stronger no-result-loss semantics는 별도 async request-ownership surface로 분리**
- 이유:
  - `/v1/chat`는 OpenAI-compatible synchronous compatibility surface로 유지하는 편이 경계가 명확하다
  - active lifetime / terminal retention / final result fetch 규칙은 detached async surface에서 더 명시적으로 정의할 수 있다
  - `/v1/chat`에 resumable/detached ownership을 얹으면 현재 proxy contract와 caller expectations가 과도하게 섞인다
- 따라서 다음 설계 작업은:
  - submitted async ownership surface를 실제 S3/S2 consumer flow에 맞춰 다듬기
  - 필요 시 `Idempotency-Key`, `retryAfterMs`, priority hint 같은 additive fields를 검토하기
  - 현재 in-memory retention에서 durable store 필요 시점(재기동 후에도 보존할지) 결정하기

### 최신 확인 상태

- 2026-04-14 strict JSON + request-aware health + async ownership 반영:
  - `X-AEGIS-Strict-JSON` 헤더 도입
  - `response_format=json_object` + `enable_thinking=false` 강제
  - strict 응답 검증/정규화 + `reasoning` scrub + 502 fail-closed
  - `/v1/health` additive `activeRequestCount` + `requestSummary`
  - `requestId` query targeting
  - `llm-inference` 중 `localAckState="transport-only"` 노출
  - `POST /v1/async-chat-requests`
  - `GET /v1/async-chat-requests/{requestId}`
  - `GET /v1/async-chat-requests/{requestId}/result`
  - `DELETE /v1/async-chat-requests/{requestId}`
  - final `/v1/chat` payload wrapped under `response`
  - `traceRequestId`, `resultReady`, `expiresAt` surfaced for ownership path
  - phase-2 방향은 Option C(새 async surface)로 정리
- 검증 상태:
  - 타깃 회귀 테스트 47 passed (`tests/test_contract_endpoints.py`, `tests/test_async_chat_manager.py`, `tests/test_contract_input_validation.py`)
  - 전체 S7 테스트 205 passed (`.venv/bin/python3 -m pytest -q`)
- 운영 메모:
  - 2026-04-04부터 공용 `.omx`에는 cross-lane durable 정보만 남기고,
    S7 전용 장문 메모/세부 TODO는 `wiki/canon/handoff/s7/` 또는 session state에 기록

### 관측된 운영 이슈/개선 기회

- 2026-04-14 기준 repo 구현은 green이지만 live localhost rollout 여부는 아직 미확인이라 **runtime restart / smoke verification pending**
- async ownership surface는 현재 **in-memory** ownership/retention이다. 서비스 재기동 이후에도 durable ownership이 필요해지면 별도 저장소가 필요하다
- 2026-03-31 기준 통합 테스트 2회 로그 분석에서는 S7 에러 0건

### 관측된 모델 한계 (개선 기회)

- Qwen3.5-122B tool_calls 선호 경향 (73.9%) — 모델 업그레이드 시 개선 기대
- evidence ref 환각 — 프롬프트 개선 또는 모델 업그레이드로 대응
- 위 두 건 모두 현재는 S3 호출자 측 대응으로 해결됨 (`force_report`, soft validation)

---

## 향후 고도화 — LoRA 파인튜닝 (데이터 축적 후)

플랫폼 운영으로 [finding -> 전문가 검증 assessment] 데이터가 충분히 쌓이면, LoRA 파인튜닝으로 모델을 자동차 보안 도메인에 특화시킬 수 있다.

**Data Flywheel**: 플랫폼 운영 -> 분석가 리뷰 -> 학습 데이터 축적 -> 파인튜닝 -> 모델 품질 향상 -> 분석가 부담 감소 -> 더 많은 데이터 축적 (선순환)

**인프라 준비 상태**:
- DGX Spark 3대 클러스터링 가능 (ConnectX-7, 200 Gbps RDMA, QSFP 스위치 필요)
- 384GB 통합 메모리 -> 122B 모델 Full Fine-tune도 이론상 가능
- NVIDIA 공식 자동 설정 스크립트 제공 (`spark_cluster_setup.py`)
- 분산 학습 프레임워크: PyTorch Torchrun + NCCL (sm_121 빌드 필요)
- `llm-exchange.jsonl`에 모든 LLM 호출 전문이 이미 기록 중 (미래 학습 데이터 원본)

**전제 조건** (착수 전 확인):
1. 전문가 검증된 학습 데이터 500건+ 확보
2. 평가 벤치마크 테스트셋 구축 (파인튜닝 전후 비교용)
3. ARM64 + CC 12.1 환경에서 학습 라이브러리 호환 검증 (PEFT, bitsandbytes, NCCL)
4. 학습 중 서빙 중단 계획 (클러스터 전체를 학습에 투입)

**참고 자료**:
- [DGX Spark Clustering 공식 문서](https://docs.nvidia.com/dgx/dgx-spark/spark-clustering.html)
- [NVIDIA DGX Spark Multi-Node Playbooks](https://deepwiki.com/NVIDIA/dgx-spark-playbooks/7-multi-node-setups)
