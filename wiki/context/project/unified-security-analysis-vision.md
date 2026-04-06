---
title: "통합 보안 분석 루프 — 정적+동적+LLM 비전"
page_type: "context-note"
canonical: false
source_refs: []
last_verified: "2026-04-06"
service_tags: ["platform"]
decision_tags: ["vision", "architecture"]
related_pages: ["wiki/canon/charter/aegis.md", "wiki/context/project/year2-scope.md"]
---

# 통합 보안 분석 루프 — 정적+동적+LLM

> 2026-03-18 확정. 프로젝트의 최종 형태를 정의하는 비전 문서.

## 핵심 루프

```
정적 분석 → LLM 판단 → 동적 분석 → 지식 그래프 → 방어 생성 → 재검증
     ↑                                                      │
     └──────────────────── 피드백 루프 ──────────────────────┘
```

## 핵심 결정

- 범용이 아닌 **자동차 보안 특화** (MISRA C, CAN, ISO 21434)
- 도메인 특화 = 도구를 바꾸는 게 아니라 **LLM 지식의 차이**
- 정적+동적을 분리하면 안 됨. **통합 루프**가 진정한 가치
- 결정론적 최대화, LLM 결정 표면 최소화
- 이 전체 루프를 자동화한 시스템은 **기존에 없음** → 논문/제품 양쪽 가능성

## 이미 있는 조각

- S4 SAST Runner — 6개 도구, SDK 통합
- S7 LLM Engine — Qwen3.5-122B-A10B-GPTQ-Int4 (DGX Spark)
- S3 Analysis Agent — 에이전트 루프, Phase 1/2, Neo4j 지식 그래프
- S6 ECU Simulator + Adapter — CAN 시뮬레이션, WebSocket

## 빠진 연결

- 에이전트 → ECU Simulator 연결 (공격 시나리오 실행 자동화)
- 동적 결과 → 지식 그래프 업데이트
- 정적 finding ↔ 동적 결과 매핑
- 방어 코드 생성 + 재검증

## 향후

- compile_commands.json 지원 (Qt, AUTOSAR 등 복잡한 프로젝트)
- MISRA C 규칙셋 통합
- 오픈소스 라이브러리 diff (SBOM)
- 데이터셋 교차 검증 (Juliet, FreeRTOS)
