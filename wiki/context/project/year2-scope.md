---
title: "2차년도 개발 범위 (부산대 중심 컨소시엄)"
page_type: "context-note"
canonical: false
source_refs: []
last_verified: "2026-04-06"
service_tags: ["platform"]
decision_tags: ["scope", "consortium"]
related_pages: ["wiki/context/project/unified-security-analysis-vision.md"]
---

# 2차년도 개발 내용 (부산대 중심)

## 1. 지능형 사이버보안 수준 검증 프레임워크 설계 및 핵심 모듈 개발

- 정적 분석, 동적 테스트, 퍼징, 침투 테스트 핵심 모듈 개발
  - 코드 검토, 취약성 탐지 및 수정 지침 자동화
  - LLM 모델과 통합된 정적 분석 모듈
  - 자동차 네트워크 런타임 분석 및 이상 징후 탐지
  - 동적 테스트 기능
- CI/CD 파이프라인 기반 LLM 사이버보안 공격 모델
  - AI 기반 모의 침투 테스트 모듈, 자동화 규정 준수 검사
  - 실시간 위협 탐지, AI 기반 이상 징후 탐지
  - Semantic Chunk 처리, RAG 기술, 대화형 PenTesting Dataset, DPO/PPO 학습
- 지능형 사이버공격 프레임워크 테스트
  - LLM 기반 공격/탐지 SIL 검증 환경 프레임워크 검증
  - SIEM 통합 테스트
  - ECU/네트워크 인터페이스 로그 수집 검증
- LLM 기반 지능형 에이전트 기술
  - Planning & Execute 자동화 모듈
  - 외부 도구 연동 최적화 응답
- Agentic RAG 기술
  - 에이전트 형태 RAG, 환각 방지
  - 하이브리드 검색 기반 성능 향상

## 2. 지능형 AI 공격 시나리오 개발 및 보안취약성 검증 모델 설계

- AI 기반 자동차 사이버 위협 연구
- 생성형 AI 기반 보안 취약성 데이터 생성 및 검증 모델 설계
- 공격 표면, 위협 벡터, 알려진 취약점 분석 및 DB 구축
- AI 기반 네트워크 프로토콜/자동차 구성요소 공격 데이터 생성 알고리즘

## 컨소시엄 구성

| 기관 | 역할 |
|------|------|
| 스마트엠투엠 (주관) | 검증 기술, XIL 연동, 규격 관리, SIL, 블록체인 플랫폼 |
| 페스카로 | 네트워크/전장부품 보안 검증, KG모빌리티 실차 적용 |
| 부산대 | 생성형 AI/Rule/Playbook 기반 지능형 공격/검증 프레임워크 |
| GITC | dSPACE HIL 환경, 검증 기관 역할 |
| KG아이씨티/KG모빌리티 | 모니터링/리포팅, 실전장부품/완성차 적용 |
