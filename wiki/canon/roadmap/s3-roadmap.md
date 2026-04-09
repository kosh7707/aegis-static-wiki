---
title: "S3 로드맵"
page_type: "canonical-roadmap"
canonical: true
source_refs:
  - "docs/s3-handoff/roadmap.md"
last_verified: "2026-04-09"
service_tags: ["s3"]
decision_tags: []
related_pages: ["wiki/canon/handoff/s3/readme.md", "wiki/canon/specs/analysis-agent.md", "wiki/canon/specs/build-agent.md"]
---

# S3 로드맵

> S3 lane의 다음 작업과 최근 완료 사항.
> **마지막 업데이트: 2026-04-09**

---

## 2026-04-09 진행/완료

### 내부 구조 리팩토링
1. ✅ shared `TerminationPolicy` 공통화
2. ✅ shared `BudgetManager` 공통화
3. ✅ shared `ToolRouter` core 공통화
4. ✅ Build Agent `tasks.py` thin-router 분리
5. ✅ Analysis Agent `tasks.py` thin-router 분리
6. ✅ Analysis Agent `phase_one.py` 단계적 분해 완료
   - `phase_one.py` → compatibility façade
   - `phase_one_executor.py`
   - `phase_one_flow.py`
   - `phase_one_types.py`
   - `phase_one_exec.py`
   - `phase_one_kb.py`
   - `phase_one_prompt.py`

### 검증 상태
- Analysis Agent 주요 검증: **43 passed**
- Build Agent 보호 surface 검증: **26 passed**
- live `/v1/health` (8001 / 8003): **PASS**

### 중요 결론
- public contract / health surface 변경 없이 내부 구조 정리 가능함이 검증됨
- 이후 작업은 feature 개발보다 **stability 유지 + 회귀 검증 강화** 우선

---

## 다음 우선순위

### 1. live smoke 확대
- `deep-analyze` live smoke
- `generate-poc` live smoke
- `build-resolve` live smoke
- 필요 시 request/response snapshot 재채집

### 2. 내부 cleanup 후속
- handler 내부 추가 분해 여부 판단
- phase-one helper 명명 정리
- 중복 import / compatibility shim 최소화 검토

### 3. 문서 동기화 유지
- handoff / spec / API 문서의 internal module layout 지속 반영
- public contract가 바뀌지 않았다는 점을 계속 명시

---

## 백로그

1. broader regression matrix
   - RE100 기준 live regression sweep 확대
2. Build Agent 프로세스 격리
3. Analysis Agent 결과 조립/loop 추가 정리 여부 판단
4. session artifact / verification evidence 누적 자동화 개선

---

## 운영 메모

- S3는 다른 lane 코드로 계약을 추론하지 않는다.
- public surface 변경이 없더라도, 내부 구조가 크게 바뀌면 canonical docs는 반드시 갱신한다.
- 현재는 **리팩토링 완성도보다 회귀 안정성**이 더 중요하다.
