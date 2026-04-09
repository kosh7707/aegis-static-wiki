---
title: "S6 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "docs/s6-handoff/roadmap.md"
last_verified: "2026-04-09"
service_tags: ["s6"]
decision_tags: []
related_pages: []
---

# S6 로드맵

> **v1.0.0 범위**: 정적 분석 파이프라인 (ZIP→빌드→SAST+LLM). **동적 분석(S6)은 v2+로 명시적 미포함** (2026-03-21 확정).
> S2 우선순위: (1) WS 계약서 작성 **완료** → (2) 멀티 ECU 지원 → (3) CAN FD 지원

---

## Adapter 고도화

- [ ] capability discovery — 지원하는 것만 `supported=true`, 나머지 `not_supported`
- [ ] canonical error / canonical status 정규화
- [ ] 안전 제어: dry-run mode, session timeout, max request rate
- [ ] Adapter 계약 테스트
- [x] 실험용 real adapter smoke CLI + 자동 smoke test로 QEMU bridge 왕복 확인 (2026-04-09)

## Simulator 고도화

- [ ] fault model simulator — timeout, delayed response, malformed frame, negative response burst, security access failure, ECU reset, session lockout
- [ ] replay bench — 저장된 capture 재생, deterministic seed 지원
- [ ] 상태 공개 API (current profile, fault mode, session state, reset count)
- [ ] 회귀 테스트 환경
- [x] QEMU runtime spike — sample ARMHF firmware + host probe + WS bridge + mock smoke 검증 (2026-04-09)

## QEMU / runtime spike 후속

- [ ] sample manifest를 실제 firmware 입력 스펙으로 일반화
- [ ] Docker build/run 실검증 (`docker` 설치 환경 필요)
- [ ] QEMU bridge를 Adapter capability surface로 흡수할지, 별도 execution/runtime plane으로 분리할지 결정
- [ ] stdin/stdout 기반 의미론을 실제 firmware I/O 모델로 대체할 기준 정의

## 에이전트 통합 비전

- S6가 에이전트의 tool로 동작 — `dynamic.inject`, `dynamic.capture` 같은 tool call을 S3 Agent가 호출
- 정적 분석(S4) 결과 + 동적 분석(S6) 결과를 LLM(S7 Gateway 경유)이 통합 판단
- S3의 종합 통합 테스트 v2(2026-03-21)에서 정적 분석 풀 파이프라인 검증 완료 (SAST+SCA+CVE+KB+LLM). 동적 분석 통합은 미착수

## 현재 해석 메모

2026-04-09 기준 판단:
- 기존 scenario-based ECU Simulator는 여전히 prototype/mock 성격이 강하다.
- 이번 QEMU spike의 의미는 **sample firmware를 실제로 실행하고 Adapter WS 계약에 붙여본 것**에 있다.
- 다만 이 경로는 아직 제품화된 S6 기능이 아니라, future execution/runtime plane 가능성을 확인한 실험 표면으로 본다.
