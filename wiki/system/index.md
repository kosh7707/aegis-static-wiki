---
title: "AEGIS static wiki index"
page_type: "system-index"
canonical: false
source_refs:
  - "../README.md"
last_verified: "2026-04-18"
service_tags: ["platform"]
decision_tags: ["navigation", "index"]
related_pages: ["./log.md", "./migration-map.md", "./writing-guide.md", "../Home.md"]
---

# AEGIS Static Wiki Index

Content-oriented catalog of the wiki. Agents should read this first to locate relevant pages before drilling into individual documents.

## Platform charter

- [[wiki/canon/charter/aegis|AEGIS — Automotive Embedded Governance & Inspection System]] — 이 문서는 AEGIS 프로젝트의 공통 제약 사항을 정의한다. *(verified 2026-04-06; platform)*

## Specifications

- [[wiki/canon/specs/adapter|Adapter 기능 명세]] — ECU ↔ Backend 사이의 WebSocket 릴레이 서비스 *(verified 2026-04-09; s6)*
- [[wiki/canon/specs/analysis-agent|S3. Analysis Agent 기능 명세]] — 소유자: S3 *(verified 2026-04-14; s3)*
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]] — Express.js + TypeScript 기반 백엔드 서비스 *(verified 2026-04-14; s2)*
- [[wiki/canon/specs/build-agent|S3. Build Agent 기능 명세]] — 소유자: S3 *(verified 2026-04-14; s3)*
- [[wiki/canon/specs/container-gateway|S8. Container Gateway 기능 명세]] — S8은 프로젝트별 업로드 워크스페이스와 프로젝트당 1개 컨테이너를 관리하는 독립 HTTP 서비스다. *(verified 2026-04-15; s8)*
- [[wiki/canon/specs/ecu-simulator|ECU Simulator 기능 명세]] — 가상 ECU — CAN 트래픽 생성 + 주입 응답 시뮬레이션 *(verified 2026-04-09; s6)*
- [[wiki/canon/specs/frontend|S1 Frontend 현재 구현 스펙]] — services/frontend/의 현재 실제 구현 기준 S1 프론트 스펙이다. *(verified 2026-04-18; s1)*
- [[wiki/canon/specs/health-control-signal-rollout-v1|Health control-signal rollout v1]] — First-rollout contract freeze owned by S3 for the timeout-policy redesign. *(verified 2026-04-13; s3/s4/s7/s2)*
- [[wiki/canon/specs/knowledge-base|Knowledge Base 명세서]] — 소유자: S5 *(verified 2026-04-14; s5)*
- [[wiki/canon/specs/llm-engine|S7. LLM Engine 기능 명세]] — LLM Engine은 S7이 관리하는 LLM 추론 모델 서빙 계층이다. *(verified 2026-04-09; s7)*
- [[wiki/canon/specs/llm-gateway|S7. LLM Gateway 기능 명세 (AEGIS)]] — S7은 AEGIS 플랫폼의 LLM 단일 관문(Gateway) 이자 LLM Engine 운영자이다. *(verified 2026-04-14; s7)*
- [[wiki/canon/specs/observability|MSA Observability 규약]] — S2(AEGIS Core)가 관리하는 전 서비스 공통 규약. *(verified 2026-04-09; platform)*
- [[wiki/canon/specs/sast-runner|S4. SAST Runner 기능 명세 (v0.11.2)]] — SAST Runner는 C/C++ 프로젝트의 보안 분석에 필요한 결정론적 전처리를 담당하는 서비스다. *(verified 2026-04-14; s4)*
- [[wiki/canon/specs/technical-overview|기술 명세 - 전체 개요]] — 이 문서는 AEGIS 시스템 전체 구조, 서비스 구성, 통신 방식, 데이터 흐름을 정의한다. *(verified 2026-04-13; platform)*

## API contracts

- [[wiki/canon/api/adapter-api|Adapter WebSocket API 명세 (v0.1.0)]] — AEGIS — Automotive Embedded Governance & Inspection System *(verified 2026-04-06; s6)*
- [[wiki/canon/api/analysis-agent-api|Analysis Agent API 명세]] — 소유자: S3 *(verified 2026-04-14; s3)*
- [[wiki/canon/api/build-agent-api|Build Agent API 명세 (v1.0.0)]] — 소유자: S3 *(verified 2026-04-14; s3)*
- [[wiki/canon/api/container-gateway-api|S8. Container Gateway API 명세]] — Base URL: *(verified 2026-04-15; s8)*
- [[wiki/canon/api/knowledge-base-api|Knowledge Base API 계약서]] — 소유자: S5 (Knowledge Base) *(verified 2026-04-14; s5)*
- [[wiki/canon/api/llm-engine-api|S7. LLM Engine API 명세]] — S7(LLM Gateway)이 LLM Engine을 호출할 때 참조하는 API 계약서. *(verified 2026-04-09; s7)*
- [[wiki/canon/api/llm-gateway-api|S7. LLM Gateway API 명세]] — 소유자: S7 (LLM Gateway + LLM Engine) *(verified 2026-04-14; s7)*
- [[wiki/canon/api/sast-runner-api|SAST Runner API 명세 (v0.11.2)]] — AEGIS — Automotive Embedded Governance & Inspection System *(verified 2026-04-14; s4)*
- [[wiki/canon/api/shared-models|Shared (S1-S2) API / Model Contract]] — Canonical contract for the current S1 (frontend) ↔ S2 (backend) integration. *(verified 2026-04-14; platform)*

## Handoff

- [[wiki/canon/handoff/s1-qa/session-s1qa-comprehensive-20260406|Session history — s1-qa / s1qa-comprehensive-20260406]] — - Lane: s1-qa *(verified 2026-04-06; s1-qa)*
- [[wiki/canon/handoff/s1/architecture|S1 Frontend Architecture Snapshot]] — services/frontend/의 실제 코드 구조와 라우팅/모듈/테스트 자산을 정리한 문서. *(verified 2026-04-18; s1)*
- [[wiki/canon/handoff/s1/qa-guide|S1-QA 실행 가이드]] — 역할: S1 프론트엔드를 사용자 관점에서 검증하는 QA lane *(verified 2026-04-15; s1/s1-qa)*
- [[wiki/canon/handoff/s1/readme|S1 Frontend 개발 인수인계서]] — 먼저 docs/AEGIS.md와 docs/mcp.md를 읽을 것. *(verified 2026-04-18; s1)*
- [[wiki/canon/handoff/s1/session-019d7152-b615-7d82-8974-e53cdb0ac1db|Session history — s1 / 019d7152-b615-7d82-8974-e53cdb0ac1db]] — - Lane: s1 *(verified 2026-04-10; s1)*
- [[wiki/canon/handoff/s1/session-019d757b-dff0-7cd0-b95d-e9830e502688|Session history — s1 / 019d757b-dff0-7cd0-b95d-e9830e502688]] — - Lane: s1 *(verified 2026-04-10; s1)*
- [[wiki/canon/handoff/s1/session-019d75ae-21c0-7fa1-8527-3dd4d1d38d2a|Session history — s1 / 019d75ae-21c0-7fa1-8527-3dd4d1d38d2a]] — - Lane: s1 *(verified 2026-04-10; s1)*
- [[wiki/canon/handoff/s1/session-019d7601-8725-7dc1-9d19-0eeac980db98|Session history — s1 / 019d7601-8725-7dc1-9d19-0eeac980db98]] — - Lane: s1 *(verified 2026-04-10; s1)*
- [[wiki/canon/handoff/s1/session-019d7647-6a73-78c2-8e24-38b0abb85da3|Session history — s1 / 019d7647-6a73-78c2-8e24-38b0abb85da3]] — - Lane: s1 *(verified 2026-04-10; s1)*
- [[wiki/canon/handoff/s1/session-1|S1 Session 1 — 2026-03-14]] — 1. ✅ CSS 폴리싱 — !important 13개 제거, 인라인 스타일 30개 → CSS 클래스 전환, transition 토큰화, 반응형 보강 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-10|S1 Session 10 — 2026-03-25]] — 44. ✅ 외부 리뷰 피드백 수신 및 검토 (docs/외부피드백/26.03.25/AEGISS1frontendQAreview.md) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-11|S1 Session 11 — 2026-03-26]] — 57. ✅ S2 WR 처리 (s2-to-s1-sdk-management-ui.md) — SDK 관리 UI 구현 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-12|S1 Session 12 — 2026-03-27]] — 58. ✅ S2 WR 처리 (s2-to-s1-session11-changes.md) — 세션 11 변경사항 대응 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-13|S1 세션 13 — 2026-03-31]] — Playwright E2E 테스트 인프라 구축 + QA 전용 세션 분화 + S2 Rule 엔진 제거 WR 처리 + QA 피드백 2라운드 대응. *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-15|S1 세션 15 — 2026-04-02]] — S2 API/모델 확장 완료 통보(A/B/C 전부) + QA 분석가 UX 리뷰 S1 독립 14건 + mock 보강. *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-16|Session history — s1 / 16]] — - Lane: s1 *(verified 2026-04-07; s1)*
- [[wiki/canon/handoff/s1/session-2|S1 Session 2 — 2026-03-16]] — 3. ✅ 종합 리팩토링 — 버그 3건 수정 + 코드 품질 감사 50건 일괄 정리 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-3|S1 Session 3 — 2026-03-17]] — 4. ✅ 정적 분석 대시보드 2-탭 개편 (SonarQube 패턴) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-4|S1 Session 4 — 2026-03-18]] — 9. ✅ 디자인 리뷰 2차 피드백 8건 수정 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-5|S1 Session 5 — 2026-03-19]] — 13. ✅ 7인 체제 전환 대응 (S2 WR s2-to-s1-update-handoff-s7.md 처리) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-6|S1 Session 6 — 2026-03-20]] — 15. ✅ 코드 리뷰 + 리팩토링 (3개 리뷰 에이전트 병렬 실행) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-7|S1 Session 7 — 2026-03-21]] — 16. ✅ 소스코드 트리 탐색 UI (S2 WR s2-to-s1-source-tree-ux.md 대응) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-8|S1 Session 8 — 2026-03-23]] — 21. ✅ Summary API 전환 (/api/static-analysis/summary → /api/analysis/summary) *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-9|S1 Session 9 — 2026-03-24]] — 26. ✅ 업로드 엔드포인트 통합 — 파일 유형 분기 로직 제거, uploadSource 단일 엔드포인트 *(verified 2026-04-06; s1)*
- [[wiki/canon/handoff/s1/session-end-2026-04-14-s1-frontend-pages|Session history — s1 / session-end-2026-04-14-s1-frontend-pages]] — - Lane: s1 *(verified 2026-04-14; s1)*
- [[wiki/canon/handoff/s1/session-omx-1775909698732-mtzs0t|Session history — s1 / omx-1775909698732-mtzs0t]] — - Lane: s1 *(verified 2026-04-13; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776068047798-eglioe|Session history — s1 / omx-1776068047798-eglioe]] — - Lane: s1 *(verified 2026-04-13; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776068998838-lap2tj|Session history — s1 / omx-1776068998838-lap2tj]] — - Lane: s1 *(verified 2026-04-13; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776153346679-v5ju6f|Session history — s1 / omx-1776153346679-v5ju6f]] — - Lane: s1 *(verified 2026-04-14; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776216744590-w3xbg6|Session history — s1 / omx-1776216744590-w3xbg6]] — - Lane: s1 *(verified 2026-04-15; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776231443356-fb13x3|Session history — s1 / omx-1776231443356-fb13x3]] — - Lane: s1 *(verified 2026-04-15; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776236109020-48kfiw|Session history — s1 / omx-1776236109020-48kfiw]] — - Lane: s1 *(verified 2026-04-15; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776237512358-ypoouz|Session history — s1 / omx-1776237512358-ypoouz]] — - Lane: s1 *(verified 2026-04-15; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776240985579-tuy6uf|Session history — s1 / omx-1776240985579-tuy6uf]] — - Lane: s1 *(verified 2026-04-15; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776240985579-tuyuf6|Session history — s1 / omx-1776240985579-tuyuf6]] — - Lane: s1 *(verified 2026-04-18; s1)*
- [[wiki/canon/handoff/s1/session-omx-1776493817550-3z7au0|Session history — s1 / omx-1776493817550-3z7au0]] — - Lane: s1 *(verified 2026-04-18; s1)*
- [[wiki/canon/handoff/s1/usecase-visibility-matrix|S1 Frontend 유스케이스 · Must-Show 가시성 매트릭스]] — 목적: 각 프론트 유스케이스가 화면에 반드시 존재해야 할 DOM 관측 항목을 QA/Reviewer가 그 자리에서 pass/fail 판단할 수 있는 단위로 명시한다. *(verified 2026-04-18; s1/s1-qa)*
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]] — S2(AEGIS Core)가 S1에 제공하는 모든 REST API + WebSocket 엔드포인트 *(verified 2026-04-14; s2)*
- [[wiki/canon/handoff/s2/architecture|S2 아키텍처 상세]] — 구현 현황, DB 스키마, 핵심 로직, 의존성, 실행/운영 메모 *(verified 2026-04-10; s2)*
- [[wiki/canon/handoff/s2/readme|S2. AEGIS Core (Backend) 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다. *(verified 2026-04-14; s2)*
- [[wiki/canon/handoff/s2/session-1|세션 1 — 문서-코드 감사]] — 날짜: 2026-03-17 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-10|세션 10 — 백로그 일괄 처리 — build-resolve + Transient 제거 + 테스트 + MCP]] — 날짜: 2026-03-25 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-11|세션 11 — S1 요청 API 10건 + 테스트 + MCP + S4 동기화]] — 날짜: 2026-03-26 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-12|세션 12 — TypeScript 에러 수정 + 코드 고도화 + 문서 전면 갱신]] — 날짜: 2026-03-28 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-13|세션 13 — 레거시 전면 제거 + S3 통합 대응 + log-analyzer 토큰 절감]] — 날짜: 2026-03-28  2026-03-31 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-14|세션 14 — 보안 분석가 UX 전면 대응: CWE/CVE + Gate 프로필 + 알림 + 사용자 시스템]] — 날짜: 2026-04-01 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-15|세션 15 — S1↔S2 계약 lockdown + S2 문서 동기화]] — 날짜: 2026-04-04 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-2|세션 2 — 버그 수정 + S1 WR 처리]] — 날짜: 2026-03-17 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-3|세션 3 — SAST + BuildProfile + SDK]] — 날짜: 2026-03-17 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-4|세션 4 — AEGIS 6인 체제 재편]] — 날짜: 2026-03-18 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-5|세션 5 — 7인 체제 + Quick→Deep 파이프라인 + 프론트 개편]] — 날짜: 2026-03-1920 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-6|세션 6 — BuildTarget + PoC + 코드 점검]] — 날짜: 2026-03-21 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-7|세션 7 — 풀스택 통합 — Agent 응답 완전 보존 + 테스트]] — 날짜: 2026-03-23 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-8|세션 8 — 풀스택 통합 테스트 + 서브 프로젝트 파이프라인]] — 날짜: 2026-03-24 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-9|세션 9 — 외부 리뷰 피드백 기반 리팩토링]] — 날짜: 2026-03-25 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775448433752-gfeokr|Session history — S2 / omx-1775448433752-gfeokr]] — - Lane: S2 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775463166551-zydb7o|Session history — s2 / omx-1775463166551-zydb7o]] — - Lane: s2 *(verified 2026-04-06; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775469122100-df8axl|Session history — s2 / omx-1775469122100-df8axl]] — - Lane: s2 *(verified 2026-04-07; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775553999378-p10q7s|Session history — s2 / omx-1775553999378-p10q7s]] — - Lane: s2 *(verified 2026-04-07; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775611563366-wajjae|Session history — s2 / omx-1775611563366-wajjae]] — - Lane: s2 *(verified 2026-04-09; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775722786907-7rtmas|Session history — s2 / omx-1775722786907-7rtmas]] — - Lane: s2 *(verified 2026-04-09; s2)*
- [[wiki/canon/handoff/s2/session-omx-1775909686045-nqeamr|Session history — s2 / omx-1775909686045-nqeamr]] — - Lane: s2 *(verified 2026-04-13; s2)*
- [[wiki/canon/handoff/s2/session-omx-1776068296251-abnt8x|Session history — s2 / omx-1776068296251-abnt8x]] — - Lane: s2 *(verified 2026-04-14; s2)*
- [[wiki/canon/handoff/s2/session-omx-1776135927691-508h7n|Session history — s2 / omx-1776135927691-508h7n]] — - Lane: s2 *(verified 2026-04-14; s2)*
- [[wiki/canon/handoff/s2/session-omx-1776135956336-nqyup8|Session history — s2 / omx-1776135956336-nqyup8]] — - Lane: s2 *(verified 2026-04-14; s2)*
- [[wiki/canon/handoff/s2/session-omx-20260410-s2-sdk-upload-failure-notification|Session history — s2 / omx-20260410-s2-sdk-upload-failure-notification]] — - Lane: s2 *(verified 2026-04-10; s2)*
- [[wiki/canon/handoff/s2/session-omx-20260413-s2-sdk-source-isolation-observability|Session history — s2 / omx-20260413-s2-sdk-source-isolation-observability]] — - Lane: s2 *(verified 2026-04-13; s2)*
- [[wiki/canon/handoff/s3/readme|S3. Analysis Agent 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. *(verified 2026-04-14; s3)*
- [[wiki/canon/handoff/s3/s4-exploitability-consumer-contract-response|S4 exploitability consumer contract response]] — S3 Analysis Agent 관점에서 S4 evidence를 exploitability reasoning에 소비할 때 필요한 최소 필드 세트와 normalization expectation을 명확히 정의한다. *(verified 2026-04-07; s3/s4/analysis-agent/sast-runner)*
- [[wiki/canon/handoff/s3/session-10|세션 10: Build Agent 분리 + 프로젝트 메모리 (2026-03-24, 완료)]] — - Build Agent 서비스 분리 (:8003) *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-11|세션 11: Build Agent v2 재설계 + 외부 리뷰 (2026-03-25, 완료)]] — - Build Agent v2 재설계: 정책 엔진, edit/delete 도구, trybuild v2, 서브프로젝트 스코핑 *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-12|세션 12: Build Agent v3 + 외부 피드백 P0 수정 (2026-03-27, 완료)]] — Build Agent v3 고도화 (2026-03-26): *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-13|세션 13: 외부 피드백 전수 반영 (2026-03-28, 완료)]] — 외부 리뷰어 피드백(docs/외부피드백/26.03.26/S3agentarchitecturefeedback.md) P0P1서브시스템테스트 17건 전수 반영. 기존 P0 4건(경로 스코프, 중복 차단, 스크립트 안전성, chmod 해소)은 2026-03-27 완료. 이번 세션에서 미처리 13건 추가 완료. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-14|세션 14: 에이전트 E2E 통합 테스트 (2026-03-28~31, 완료)]] — 코드 점검 → E2E 통합 테스트(v1v4) → WR 교환 → warning 개선 → 최종 검증 완료. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-15|S3 세션 15 — 2026-03-31 ~ 2026-04-01]] — Analysis Agent Phase 2 도구 확충 + evidence 환각 제거 + NDJSON 하트비트 스트리밍 적용. RE100 전체 프로젝트 테스트 완료. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-16|S3 세션 16 — 2026-04-02]] — 인수인계서 + API 계약서 + 기능 명세 문서 전면 갱신. S4 하트비트 WR 미처리 확인. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-17|S3 세션 17 — 2026-04-02]] — claw-code(Claude Code 클린룸 포트) 분석 + 시스템 프롬프트 고도화 + 예외처리 강화 + 품질 평가 시스템 구축 + claw-code 패턴 6개 구현. 역대 최대 규모 세션. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-18|S3 세션 18 — 2026-04-04]] — S2의 to-all WR과 docs/AEGIS.md 공용 .omx 메모 규칙 변경을 확인하고, S3 현재 작업에 반영했다. 동시에 전날 진행한 residual alignment 결과를 S3 handoff 문서로 정리했다. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-19|S3 세션 19 — 2026-04-04]] — S3 agent integration test를 실제 서비스 기동 상태에서 수행했다. Build Agent build-resolve, Analysis Agent deep-analyze, generate-poc, Build Agent sdk-analyze를 순차 검증했고, 외부 서비스(S4) 경고는 WR로 분리했다. ... *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-20|S3 세션 20 — 2026-04-04]] — strict compile-first 구현/검증 이후, S2와의 다음 계약을 "단순 build-resolve payload 수정"이 아니라 전체 build user flow + persistent Build Snapshot handoff 문제로 재정의했다. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-21|S3 세션 21 — 2026-04-04]] — S2의 Build Snapshot 관련 재질의 WR 2건을 읽고, S3의 권한 모델을 명확히 한 뒤 회신 초안을 작성했다. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-22|S3 세션 22 — 2026-04-04]] — Build Snapshot 논의 이후 바로 다음 실행 슬라이스로, S3 내부의 strict compile-first canonical surface drift 를 정리했다. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-23|S3 세션 23 — 2026-04-04]] — S3 strict compile-first producer-side 정렬이 끝난 뒤, 남아 있던 cross-lane coordination 작업을 마무리했다. *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-24|S3 세션 24 — 2026-04-04]] — S2, S4, S5로부터 Build Snapshot 후속 WR 회신을 읽고 처리한 뒤, *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-25|S3 세션 25 — 2026-04-04]] — S4 v0.11 build-path 변경과 S5 readiness/provenance 변경에 맞춰 S3를 실제로 적응시켰고, *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-5|세션 5: 에이전트 통합 로깅 + Neo4j GraphRAG + Phase 1/2 (2026-03-18, 완료)]] — - 에이전트 통합 로깅 (14파일), Neo4j GraphRAG, 하이브리드 검색 *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-6|세션 6: Phase 1 확장 + 시스템 프롬프트 재설계 (2026-03-19, 완료)]] — - CVE 실시간 조회, KB 위협 조회, 위험 함수 호출자 *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-7|세션 7: 에이전트 루프 버그 수정 + 도구 전환 (2026-03-20, 완료)]] — - codegraph.callers 전환, 에이전트 루프 턴 기반 종료 *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-8|세션 8: Claim.detail + PoC + Adaptive Timeout (2026-03-21, 완료)]] — - Claim.detail 필드, generate-poc taskType *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-9|세션 9: 프롬프트 고도화 + Observability v2 (2026-03-23, 완료)]] — - 프롬프트 도구 사용 재조정, adaptive timeout 보정 *(verified 2026-04-06; s3)*
- [[wiki/canon/handoff/s3/session-omx-1775469122100-df8axl|Session history — s3 / omx-1775469122100-df8axl]] — - Lane: s3 *(verified 2026-04-07; s3)*
- [[wiki/canon/handoff/s3/session-omx-1775554030010-j7lykp|Session history — s3 / omx-1775554030010-j7lykp]] — - Lane: s3 *(verified 2026-04-07; s3)*
- [[wiki/canon/handoff/s3/session-omx-1775611602872-86xufo|Session history — s3 / omx-1775611602872-86xufo]] — - Lane: s3 *(verified 2026-04-09; s3)*
- [[wiki/canon/handoff/s3/session-omx-1776067037145-ct82s1|Session history — s3 / omx-1776067037145-ct82s1]] — - Lane: s3 *(verified 2026-04-13; s3)*
- [[wiki/canon/handoff/s3/session-omx-1776080082663-5r6t9t|Session history — s3 / omx-1776080082663-5r6t9t]] — - Lane: s3 *(verified 2026-04-14; s3)*
- [[wiki/canon/handoff/s3/session-omx-1776133018109-2pqa7c|Session history — s3 / omx-1776133018109-2pqa7c]] — - Lane: s3 *(verified 2026-04-14; s3)*
- [[wiki/canon/handoff/s4/build-snapshot-consumer-seam|S4 Build Snapshot Consumer Seam 설계 메모]] — 상태: 구현 완료 / /v1 계약 반영 *(verified 2026-04-13; s4)*
- [[wiki/canon/handoff/s4/readme|S4. SAST Runner 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다. *(verified 2026-04-14; s4)*
- [[wiki/canon/handoff/s4/session-1|S4 세션 1 — 전체 빌드업 (~ 2026-03-27)]] — 초기 구축부터 v0.7.0까지의 전체 작업 로그. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-2|S4 세션 2 — 외부 피드백 잔여 5건 + 문서 전면 갱신 (2026-03-28)]] — - [x] 외부 피드백 잔여 5건 전체 반영: *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-3|S4 세션 3 — 통합테스트 전 코드 점검 + 통합테스트 대응 (2026-03-28 ~ 2026-03-31)]] — 통합테스트 전 S3/S4/S5/S7 협력 대비 코드 점검: *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-4|Session 4 — 코드그래프 품질 평가 기준 수립 (2026-03-31)]] — S4가 생성하는 코드그래프(dumpfunctions)의 품질을 정량적으로 관리할 수 있는 평가 체계 수립. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-5|Session 5 — NDJSON 하트비트 스트리밍 프로토콜 구현 + 진행 지표 보강 (2026-04-01, 미완료)]] — S3 WR: RE100 4개 프로젝트 중 3개에서 SAST 타임아웃 실패. 동기 HTTP의 고정 타임아웃으로는 대형 프로젝트(sqlite3.c 230K줄, duktape.c 87K줄) 소요 시간을 예측할 수 없음. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-6|S4 Session 6 — 2026-04-02]] — Session-5 긴급 중단 백로그 전체 처리. S3 WR(heartbeat 진행 지표 보강) + S2 WR(cweId 메타데이터 표준화) 완료. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-7|S4 Session 7 — version hygiene 정리 + 공용 `.omx` 메모 규칙 반영 (2026-04-04)]] — - docs/work-requests/s2-to-all-omx-memory-discipline.md가 추가되었고, *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-8|S4 Session 8 — Build Snapshot consumer seam 정렬 + S3 WR triage (2026-04-04)]] — 2026-04-04 오후 기준 docs/work-requests/에 S3→S4 WR이 다수 도착했다. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-9|S4 Session 9 — build path boundary inversion (`sdkId` 제거, autodetect 제거, sdk-registry 제거) (2026-04-04)]] — 사용자 검토 결과, S4 build path가 MCP/tool surface 이상의 일을 하고 있다는 구조적 문제가 드러났다. *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-end-2026-04-14|Session history — s4 / session-end-2026-04-14]] — - Lane: s4 *(verified 2026-04-14; s4)*
- [[wiki/canon/handoff/s4/session-omx-1775463834644-s84ud8|Session history — s4 / omx-1775463834644-s84ud8]] — - Lane: s4 *(verified 2026-04-06; s4)*
- [[wiki/canon/handoff/s4/session-omx-1775469122100-df8axl|Session history — s4 / omx-1775469122100-df8axl]] — - Lane: s4 *(verified 2026-04-07; s4)*
- [[wiki/canon/handoff/s4/session-omx-1775554053910-28cuqs|Session history — s4 / omx-1775554053910-28cuqs]] — - Lane: s4 *(verified 2026-04-07; s4)*
- [[wiki/canon/handoff/s4/session-omx-1775611621885-coij9e|Session history — s4 / omx-1775611621885-coij9e]] — - Lane: s4 *(verified 2026-04-09; s4)*
- [[wiki/canon/handoff/s4/session-omx-1776068296251-abnt8x|Session history — s4 / omx-1776068296251-abnt8x]] — - Lane: s4 *(verified 2026-04-13; s4)*
- [[wiki/canon/handoff/s4/session-omx-1776135939178-y43l10|Session history — s4 / omx-1776135939178-y43l10]] — - Lane: s4 *(verified 2026-04-14; s4)*
- [[wiki/canon/handoff/s4/session-omx-177615|Session history — s4 / omx-177615?]] — - Lane: s4 *(verified 2026-04-14; s4)*
- [[wiki/canon/handoff/s5/architecture|S5 Knowledge Base — 아키텍처 상세]] — README.md에서 분리된 기술 상세 문서. *(verified 2026-04-14; s5)*
- [[wiki/canon/handoff/s5/readme|S5. Knowledge Base 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다. *(verified 2026-04-14; s5)*
- [[wiki/canon/handoff/s5/session-1|S5 Session 1 — 2026-03-18]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-10|S5 Session 10 — 2026-03-26]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-11|S5 Session 11 — 2026-03-27]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-12|S5 Session 12 — 2026-03-28]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-13|S5 Session 13 — 2026-03-31]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-14|S5 Session 14 — 2026-04-04]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-15|S5 Session 15 — 2026-04-04]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-16|S5 Session 16 — 2026-04-04]] — | 항목 | 내용 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-17|S5 Session 17 — 2026-04-04]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-18|S5 Session 18 — 2026-04-04]] — | 항목 | 내용 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-19|S5 Session 19 — 2026-04-04]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-2|S5 Session 2 — 2026-03-19]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-20|S5 Session 20 — 2026-04-04]] — | 항목 | 상태 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-3|S5 Session 3 — 2026-03-20]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-4|S5 Session 4 — 2026-03-20]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-5|S5 Session 5 — 2026-03-21]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-6|S5 Session 6 — 2026-03-23]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-7|S5 Session 7 — 2026-03-24]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-8|S5 Session 8 — 2026-03-25]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-9|S5 Session 9 — 2026-03-25]] — | 변경 | 상세 | *(verified 2026-04-06; s5)*
- [[wiki/canon/handoff/s5/session-omx-1775463912798-zi6w92|Session history — s5 / omx-1775463912798-zi6w92]] — - Lane: s5 *(verified 2026-04-07; s5)*
- [[wiki/canon/handoff/s5/session-omx-1775722925405-bjvop8|Session history — s5 / omx-1775722925405-bjvop8]] — - Lane: s5 *(verified 2026-04-09; s5)*
- [[wiki/canon/handoff/s5/session-omx-1776068998838-lap2tj|Session history — s5 / omx-1776068998838-lap2tj]] — - Lane: s5 *(verified 2026-04-14; s5)*
- [[wiki/canon/handoff/s5/session-omx-1776135950461-h7l909|Session history — s5 / omx-1776135950461-h7l909]] — - Lane: s5 *(verified 2026-04-14; s5)*
- [[wiki/canon/handoff/s6/readme|S6. Dynamic Analysis 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다. *(verified 2026-04-09; s6)*
- [[wiki/canon/handoff/s6/session-1|S6 세션 1 — 2026-03-28]] — 1. 코드베이스 전체 탐색 *(verified 2026-04-06; s6)*
- [[wiki/canon/handoff/s6/session-2|S6 세션 2 — 2026-03-31]] — 1. 코드베이스 재탐색 (세션 인수인계) *(verified 2026-04-06; s6)*
- [[wiki/canon/handoff/s6/session-3|S6 세션 3 — 2026-04-04]] — 1. 공통 공지 재확인 *(verified 2026-04-06; s6)*
- [[wiki/canon/handoff/s7/architecture|S7 LLM Gateway — 아키텍처 상세]] — 이 문서는 Gateway 코드의 구조, 요청 처리 흐름, 환경변수, Observability를 상세히 기술한다. *(verified 2026-04-14; s7)*
- [[wiki/canon/handoff/s7/llm-engine-ops|S7 LLM Engine — 운영 정보]] — DGX Spark에서 구동되는 LLM Engine(vLLM)의 접속, 기동, 성능, 트러블슈팅 정보. *(verified 2026-04-09; s7)*
- [[wiki/canon/handoff/s7/readme|S7. LLM Gateway + LLM Engine 인수인계서]] — 반드시 docs/AEGIS.md를 먼저 읽을 것. 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다. *(verified 2026-04-14; s7)*
- [[wiki/canon/handoff/s7/session-1|Session 1 — S7 신설 (2026-03-19)]] — S3(Analysis Agent + LLM Gateway)에서 LLM Gateway + LLM Engine 관리를 S7으로 분리. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-10|Session 10 — S7 handoff 문서 잔여 드리프트 정리 (2026-04-04)]] — - Session 9에서 Gateway 안정화 패치와 공용 .omx 메모 규칙 반영을 완료했다. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-11|Session 11 — S7 담당 문서 일괄 정합화 (2026-04-04)]] — - 종료 전 S7 소유 문서를 다시 점검했다. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-12|Session 12 — S7 담당 문서 전체 현행화 (2026-04-09)]] — - 전 세션(S7 대행, aegis-static-wiki MCP 에러 처리 개선) 이후 세션 정리 시점. *(verified 2026-04-09; s7)*
- [[wiki/canon/handoff/s7/session-2|Session 2 — 122B 모델 전환 + Gateway 고도화 (2026-03-20)]] — - 모델 전환: Qwen/Qwen3.5-35B-A3B-FP8 -> Qwen/Qwen3.5-122B-A10B-GPTQ-Int4 (Qwen 공식) *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-3|Session 3 — 관측성 고도화 + vLLM 튜닝 + MCP 호환 (2026-03-21~24)]] — - 타임아웃 분리: 단일 120초 -> connect 10초 / read 호출자 주도 (X-Timeout-Seconds 헤더, 기본 1800초) *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-4|Session 4 — 외부 리뷰 피드백 개선 (2026-03-25)]] — - CORS 제한: alloworigins=[""] -> 환경변수 AEGISCORSALLOWORIGINS 기반 (기본 localhost:5173,3000) *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-5|Session 5 — 코드 품질 고도화 (2026-03-26)]] — - Global state -> app.state 이전: tasks.py의 모듈 레벨 전역 변수 7개 + setter 함수 5개 제거. 모든 컴포넌트(pipeline, proxyclient, circuitbreaker, tokentracker, registries, semaphore)를 FastAPI app.stat... *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-6|Session 6 — CB OPEN 버그 수정 + 문서-코드 정합성 점검 (2026-03-27)]] — - 발견: 문서-코드 정합성 점검 중 LLMCIRCUITOPEN failureCode가 API 계약서에는 문서화되어 있었으나 FailureCode enum에 누락된 것을 확인. 추적 결과 LlmCircuitOpenError가 /v1/tasks 파이프라인에서 잡히지 않아 500 에러로 떨어지는 버그 확인. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-7|Session 7 — 인수인계서 분할 구조 전환 (2026-03-28)]] — S2 to-all WR(s2-to-all-handoff-restructure.md)에 따라 인수인계서를 분할 구조로 전환. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-8|Session 8 — 통합 테스트 로그 분석 + 로그 개선 (2026-03-30~31)]] — S3→S7 WR(s3-to-s7-llm-report-transition.md): RE100 대상 에이전트 통합 테스트에서 Qwen3.5-122B가 toolcalls→content 전환에 실패하는 현상 보고. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-9|Session 9 — S7 안정화 + 공용 `.omx` 메모 규칙 반영 (2026-04-03~04)]] — - S7 탐색 과정에서 현재 코드/문서 기준 잔존 이슈를 점검했다. *(verified 2026-04-06; s7)*
- [[wiki/canon/handoff/s7/session-omx-1776080082663-5r6t9t|Session history — s7 / omx-1776080082663-5r6t9t]] — - Lane: s7 *(verified 2026-04-14; s7)*
- [[wiki/canon/handoff/s7/session-omx-1776135956336-nqyup8|Session history — s7 / omx-1776135956336-nqyup8]] — - Lane: s7 *(verified 2026-04-14; s7)*
- [[wiki/canon/handoff/s8/readme|S8. Container Gateway 인수인계서]] — 먼저 docs/AEGIS.md를 읽을 것. *(verified 2026-04-15; s8)*

## Roadmap

- [[wiki/canon/roadmap/s1-roadmap|S1 Frontend — Roadmap]] — 마지막 업데이트: 2026-04-02 *(verified 2026-04-06; s1)*
- [[wiki/canon/roadmap/s2-roadmap|S2 개발 로드맵]] — 즉시 다음 작업 + 후순위 + 인프라 계획 *(verified 2026-04-14; s2)*
- [[wiki/canon/roadmap/s3-roadmap|S3 로드맵]] — S3 lane의 다음 작업과 최근 완료 사항. *(verified 2026-04-14; s3)*
- [[wiki/canon/roadmap/s4-roadmap|S4 SAST Runner — 로드맵]] — 다음 작업 + 후순위 계획. README.md에서 분리. *(verified 2026-04-14; s4)*
- [[wiki/canon/roadmap/s5-roadmap|S5 Knowledge Base — Roadmap]] — |  | 작업 | 우선순위 | *(verified 2026-04-07; s5)*
- [[wiki/canon/roadmap/s6-roadmap|S6 로드맵]] — v1.0.0 범위: 정적 분석 파이프라인 (ZIP→빌드→SAST+LLM). 동적 분석(S6)은 v2+로 명시적 미포함 (2026-03-21 확정). *(verified 2026-04-09; s6)*
- [[wiki/canon/roadmap/s7-roadmap|S7 Roadmap]] — 다음 작업 + 장기 계획 *(verified 2026-04-14; s7)*

## Work requests

- Archived legacy WRs under `AEGIS/docs/work-requests/` are runtime out-of-scope.

- [[wiki/canon/work-requests/s1-qa-to-s1-notification-dropdown|알림 드롭다운(notification-dropdown) 디자인 전면 개선]] — - Kind: request *(verified 2026-04-07; frontend)*
- [[wiki/canon/work-requests/s1-qa-to-s1-s1-qa---s1-qa-p0-baseline-p1|S1-QA -> S1: 종합 QA 결과 — P0 승인버튼 복원 + baseline 갱신 + P1 수정 요청]] — - Kind: request *(verified 2026-04-07; s1)*
- [[wiki/canon/work-requests/s1-qa-to-s1-untitled|프로젝트 대시보드 디자인 전면 개선 요청]] — - Kind: request *(verified 2026-04-07; frontend)*
- [[wiki/canon/work-requests/s1-qa-to-s1-websocket-overviewpage|사이드바 + WebSocket + OverviewPage 에러 수정 요청]] — - Kind: request *(verified 2026-04-07; frontend)*
- [[wiki/canon/work-requests/s1-to-s1-qa-s1-qa-qa|S1-QA 종합 QA 요청 — 페르소나 기반 전면 검증]] — - Kind: request *(verified 2026-04-14; s1)*
- [[wiki/canon/work-requests/s1-to-s2-project-scoped-sdk-upload-failures-before-job-acceptance-need-notification-emiss|Project-scoped SDK upload failures before job acceptance need notification emission for cross-page awareness]] — - Kind: request *(verified 2026-04-10; s1/s2/frontend/backend/sdk/notifications/websocket)*
- [[wiki/canon/work-requests/s1-to-s2-ws-static-analysis|/ws/static-analysis 채널 향후 계획 확인]] — - Kind: question *(verified 2026-04-07; s1/s2/websocket/static-analysis)*
- [[wiki/canon/work-requests/s2-to-s1-adopt-explicit-build-preparation-then-quick-then-deep-ux-on-the-new-s2-additive-|adopt explicit build-preparation then Quick then Deep UX on the new S2 additive contract surfaces]] — - Kind: request *(verified 2026-04-14; s1/s2)*
- [[wiki/canon/work-requests/s2-to-s1-audit-remaining-s1-consumer-surfaces-for-buildtarget-only-analysis-lineage-and-r|Audit remaining S1 consumer surfaces for BuildTarget-only analysis lineage and remove any final project-owned assumptions]] — - Kind: request *(verified 2026-04-14; s1/s2/frontend/api-contract/buildtarget)*
- [[wiki/canon/work-requests/s2-to-s1-consume-new-sdk-install-log-contract-and-live-observability-signals-for-project-|Consume new SDK install-log contract and live observability signals for project-scoped SDK registration]] — - Kind: request *(verified 2026-04-13; s1/s2/frontend/backend/sdk/websocket/observability)*
- [[wiki/canon/work-requests/s2-to-s1-follow-up-strengthen-large-sdk-upload-ux-with-sticky-byte-level-progress-stage-t|Follow-up: strengthen large SDK upload UX with sticky byte-level progress, stage transitions, and failure visibility]] — - Kind: request *(verified 2026-04-10; s1/s2/frontend/backend/sdk/websocket/ux/notifications)*
- [[wiki/canon/work-requests/s2-to-s1-frontend-follow-up-for-project-scoped-sdk-upload-archive-.bin-folder-and-refresh|Frontend follow-up for project-scoped SDK upload (archive / .bin / folder) and refreshed progress semantics]] — - Kind: request *(verified 2026-04-07; s1/s2/frontend/backend/sdk/websocket/notifications)*
- [[wiki/canon/work-requests/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts|Frontend full-depth audit against refreshed S2 API/WebSocket contracts]] — - Kind: request *(verified 2026-04-07; s1/s2/frontend/backend/api-contract/websocket)*
- [[wiki/canon/work-requests/s2-to-s1-frontend-ux-handoff-for-websocket-progress-completion-surfaces|Frontend UX handoff for WebSocket progress/completion surfaces]] — - Kind: request *(verified 2026-04-07; s1/s2)*
- [[wiki/canon/work-requests/s2-to-s1-qa-validate-buildtarget-only-analysis-recovery-lineage-and-rejection-matrix-against|Validate BuildTarget-only analysis recovery, lineage, and rejection matrix against the finalized S2 contract]] — - Kind: request *(verified 2026-04-14; s1-qa/s2/frontend/qa/websocket/api-contract)*
- [[wiki/canon/work-requests/s2-to-s1-reply-pre-registration-sdk-upload-failures-now-emit-project-notifications-sdk_fa|Reply: pre-registration SDK upload failures now emit project notifications; sdk_failed may omit resourceId before registration]] — - Kind: reply *(verified 2026-04-14; s2/s1/backend/frontend/sdk/notifications/websocket)*
- [[wiki/canon/work-requests/s2-to-s1-reply-ws-static-analysis-removed-ws-analysis-is-the-canonical-progress-channel|Reply: `/ws/static-analysis` removed; `/ws/analysis` is the canonical progress channel]] — - Kind: reply *(verified 2026-04-07; s1/s2/websocket/analysis)*
- [[wiki/canon/work-requests/s2-to-s1-s1-qa-buildtarget-only-analysis-cutover-is-now-materially-complete-align-s1-s1-qa-to-a|BuildTarget-only analysis cutover is now materially complete; align S1/S1-QA to accepted payloads, status recovery, and WS lineage]] — - Kind: request *(verified 2026-04-14; s1/s1-qa/s2/frontend/api-contract/websocket/buildtarget)*
- [[wiki/canon/work-requests/s2-to-s1-s1-qa-buildtarget-terminology-cutover-is-complete-on-active-s2-frontend-surfaces-updat|BuildTarget terminology cutover is complete on active S2/frontend surfaces; update any remaining S1 labels, copy, and QA baselines]] — - Kind: notice *(verified 2026-04-14; s2/s1/s1-qa)*
- [[wiki/canon/work-requests/s2-to-s1-s1-qa-s2-backend-project-crud-hardening-landed-on-2026-04-09-please-wire-s1-edit-delet|S2 backend project CRUD hardening landed on 2026-04-09 — please wire S1 edit/delete UI to stable PUT/DELETE semantics]] — - Kind: request *(verified 2026-04-14; s2/s1)*
- [[wiki/canon/work-requests/s2-to-s1-s1-qa-s2-websocket-recovery-hardening-landed-on-2026-04-08-please-validate-s1-reconnec|S2 websocket recovery hardening landed on 2026-04-08; please validate S1 reconnect/progress UX]] — - Kind: request *(verified 2026-04-14; s2/s1/s1-qa/websocket/api-contract/frontend)*
- [[wiki/canon/work-requests/s2-to-s1-sdk-upload-request-shape-examples-for-s1-archive-.bin-folder-with-relativepath|SDK upload request-shape examples for S1 (archive / .bin / folder with relativePath[])]] — - Kind: reply *(verified 2026-04-07; s1/s2/frontend/backend/sdk/multipart)*
- [[wiki/canon/work-requests/s2-to-s1-visible-sdk-upload-progress-bar-needed-for-large-.bin-uploads-user-observed-gap-|Visible SDK upload progress bar needed for large .bin uploads (user-observed gap on 2026-04-09)]] — - Kind: request *(verified 2026-04-10; s1/s2/frontend/backend/sdk/websocket/ux)*
- [[wiki/canon/work-requests/s2-to-s3-build-agent-canonical-target-locator-fields-are-now-buildtargetpath-buildtargetn|Build Agent canonical target locator fields are now buildTargetPath/buildTargetName after legacy terminology cutover]] — - Kind: notice *(verified 2026-04-14; s2/s3)*
- [[wiki/canon/work-requests/s2-to-s3-pre-freeze-timeout-policy-redesign-impact-analysis-completed-on-s2-implementatio|pre-freeze timeout-policy redesign impact analysis completed on S2; implementation deferred until contract freeze]] — - Kind: reply *(verified 2026-04-13; s2/s3/s4/s7)*
- [[wiki/canon/work-requests/s2-to-s3-prepare-build-agent-and-analysis-agent-contract-split-for-explicit-build-prep-th|prepare Build Agent and Analysis Agent contract split for explicit build-prep then explicit Deep]] — - Kind: request *(verified 2026-04-13; s2/s3)*
- [[wiki/canon/work-requests/s2-to-s3-reply-canonical-analysis-user-journey-now-uses-explicit-build-preparation-before|reply canonical analysis user journey now uses explicit build preparation before Quick and explicit Deep request]] — - Kind: reply *(verified 2026-04-13; s2/s3)*
- [[wiki/canon/work-requests/s2-to-s3-reply-s2-implemented-request-aware-health-interpretation-and-inventoried-timeout|reply: S2 implemented request-aware /health interpretation and inventoried timeout-coded branches]] — - Kind: reply *(verified 2026-04-14; s2/s3/health/timeout-policy/ack-liveness/orchestration)*
- [[wiki/canon/work-requests/s2-to-s3-s2-handled-build-agent-analysis-agent-rollout-and-consumer-alignment-on-2026-04-|S2 handled build-agent/analysis-agent rollout and consumer alignment on 2026-04-08]] — - Kind: reply *(verified 2026-04-08; s2/s3/runtime/build-agent/analysis-agent/api-contract)*
- [[wiki/canon/work-requests/s2-to-s3-s4-race-test-wr|race test wr]] — - Kind: request *(verified 2026-04-09; s2)*
- [[wiki/canon/work-requests/s2-to-s4-clarify-migration-path-for-s4-build-sdk-contract-drift-currently-affecting-s2|Clarify migration path for S4 build/sdk contract drift currently affecting S2]] — - Kind: request *(verified 2026-04-07; s2/s4/backend/sast-runner/sdk-registry/build)*
- [[wiki/canon/work-requests/s2-to-s4-prepare-explicit-build-preparation-and-one-shot-quick-scan-contract-for-the-new-|prepare explicit build-preparation and one-shot Quick scan contract for the new analysis journey]] — - Kind: request *(verified 2026-04-13; s2/s4)*
- [[wiki/canon/work-requests/s2-to-s5-prepare-quick-stage-code-graph-and-graphrag-capability-contract-for-the-new-anal|prepare Quick-stage code-graph and GraphRAG capability contract for the new analysis journey]] — - Kind: request *(verified 2026-04-13; s2/s5)*
- [[wiki/canon/work-requests/s2-to-s5-s2-acknowledged-s5-project-memory-x-timeout-ms-clarification-on-2026-04-08|S2 acknowledged S5 project-memory X-Timeout-Ms clarification on 2026-04-08]] — - Kind: reply *(verified 2026-04-08; s2/s5/api-contract)*
- [[wiki/canon/work-requests/s2-to-s6-s6-reactivation-for-dynamic-analysis-phase-2-prep-adapter-simulator-gap-inventor|S6 reactivation for dynamic-analysis phase-2 prep: adapter/simulator gap inventory and proposed first slice]] — - Kind: request *(verified 2026-04-09; s2/s6/dynamic-analysis/adapter/ecu-simulator/websocket)*
- [[wiki/canon/work-requests/s2-to-s8-post-merge-s8-follow-up-pull-latest-main-then-fix-the-reviewed-container-workspa|Post-merge S8 follow-up: pull latest main, then fix the reviewed container/workspace boundary issues and reply by WR]] — - Kind: request *(verified 2026-04-15; s2/s8)*
- [[wiki/canon/work-requests/s2-to-s8-sync-to-the-merged-s8-baseline-and-use-wr-git-pull-reply-flow-for-next-handoffs|Sync to the merged S8 baseline and use WR + git-pull reply flow for next handoffs]] — - Kind: request *(verified 2026-04-15; s2/s8)*
- [[wiki/canon/work-requests/s3-to-s2-build-prep-and-deep-contract-split-implemented-for-explicit-step-flow|build-prep and Deep contract split implemented for explicit-step flow]] — - Kind: reply *(verified 2026-04-13; s2/s3)*
- [[wiki/canon/work-requests/s3-to-s2-confirm-explicit-build-agent-ux-step|confirm explicit build-agent UX step]] — - Kind: question *(verified 2026-04-13; s2/s3)*
- [[wiki/canon/work-requests/s3-to-s2-first-rollout-of-timeout-policy-redesign-is-health-only-with-polling-semantics|first rollout of timeout-policy redesign is /health-only with polling semantics]] — - Kind: notice *(verified 2026-04-13; s2/s3/s4/s7)*
- [[wiki/canon/work-requests/s3-to-s2-follow-up-request-keep-s2-orchestration-aligned-with-s3-timeout-inventory-while-|follow-up request: keep S2 orchestration aligned with S3 timeout inventory while S4/S7 wait-while-alive seams are narrowed]] — - Kind: request *(verified 2026-04-14; s2/s3/health/timeout-policy/ack-liveness/orchestration)*
- [[wiki/canon/work-requests/s3-to-s2-frozen-health-control-signal-vocabulary-for-first-timeout-policy-rollout|frozen /health control-signal vocabulary for first timeout-policy rollout]] — - Kind: reply *(verified 2026-04-14; s2/s3/s4/s7)*
- [[wiki/canon/work-requests/s3-to-s2-live-contract-audit-findings-build-agent-top-level-strict-fields-fixed-in-s3-rep|Live contract audit findings: build-agent top-level strict fields fixed in S3 repo; please align consumer/runtime rollout]] — - Kind: request *(verified 2026-04-08; s3/s2/build-agent/analysis-agent/api-contract)*
- [[wiki/canon/work-requests/s3-to-s2-no-new-s3-public-api-contract-delta-in-the-latest-s3-slices-recent-changes-are-i|No new S3 public API contract delta in the latest S3 slices; recent changes are internal consumer-side only]] — - Kind: notice *(verified 2026-04-14; s2/s3/analysis-agent/build-agent/api-contract/timeout-policy)*
- [[wiki/canon/work-requests/s3-to-s2-runtime-rollout-still-pending-as-of-2026-04-08-live-s3-services-continue-to-expo|Runtime rollout still pending as of 2026-04-08: live S3 services continue to expose stale contract and health surfaces]] — - Kind: request *(verified 2026-04-08; s3/s2/runtime/rollout/build-agent/analysis-agent/api-contract)*
- [[wiki/canon/work-requests/s3-to-s2-s3-timeout-policy-no-result-loss-internal-rollout-is-repo-complete-outward-s3-co|S3 timeout-policy / no-result-loss internal rollout is repo-complete; outward S3 contract unchanged]] — - Kind: notice *(verified 2026-04-14; s2/s3/analysis-agent/build-agent/timeout-policy/async-ownership)*
- [[wiki/canon/work-requests/s3-to-s4-clarify-why-live-s4-v1-health-does-not-expose-request-summary-fields-yet|clarify why live S4 /v1/health does not expose request-summary fields yet]] — - Kind: question *(verified 2026-04-14; s3/s4)*
- [[wiki/canon/work-requests/s3-to-s4-define-s4-health-request-summary-mapping-for-local-ack-control-rollout|define S4 /health request-summary mapping for local-ack control rollout]] — - Kind: request *(verified 2026-04-13; s3/s4)*
- [[wiki/canon/work-requests/s3-to-s4-follow-up-request-clarify-next-step-wait-while-alive-contract-for-s4-build-scan-|follow-up request: clarify next-step wait-while-alive contract for S4 build/scan surfaces after S3 timeout inventory]] — - Kind: request *(verified 2026-04-14; s3/s4/health/timeout-policy/ack-liveness/build/scan)*
- [[wiki/canon/work-requests/s3-to-s4-inspect-gateway-webserver-findings-drift-in-s4-logs|Inspect gateway-webserver findings drift in S4 logs]] — - Kind: request *(verified 2026-04-07; s3/s4/analysis-agent/sast-runner)*
- [[wiki/canon/work-requests/s3-to-s5-inspect-gateway-webserver-s5-context-logs-for-analysis-drift|Inspect gateway-webserver S5 context/logs for analysis drift]] — - Kind: request *(verified 2026-04-07; s3/s5/analysis-agent/knowledge-base)*
- [[wiki/canon/work-requests/s3-to-s7-clarify-s7-health-reply-on-local-ack-vs-transport-liveness-and-abort-semantics|clarify S7 /health reply on local ack vs transport liveness and abort semantics]] — - Kind: question *(verified 2026-04-13; s3/s7)*
- [[wiki/canon/work-requests/s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout|define S7 /health request-summary semantics for local-ack control rollout]] — - Kind: request *(verified 2026-04-13; s3/s7)*
- [[wiki/canon/work-requests/s3-to-s7-follow-up-request-define-next-step-wait-while-alive-contract-for-s7-v1-chat-afte|follow-up request: define next-step wait-while-alive contract for S7 /v1/chat after S3 timeout inventory]] — - Kind: request *(verified 2026-04-14; s3/s7/health/timeout-policy/ack-liveness/llm-gateway)*
- [[wiki/canon/work-requests/s3-to-s7-investigate-live-v1-chat-json-only-control-leak-seen-in-s3-smoke|investigate live /v1/chat JSON-only control leak seen in S3 smoke]] — - Kind: request *(verified 2026-04-14; s3/s7)*
- [[wiki/canon/work-requests/s3-to-s7-phase-2-decision-needed-how-should-s7-support-recoverable-wait-while-alive-beyon|phase-2 decision needed: how should S7 support recoverable wait-while-alive beyond finite /v1/chat transport timeout?]] — - Kind: question *(verified 2026-04-14; s3/s7/health/timeout-policy/ack-liveness/llm-gateway/phase-2)*
- [[wiki/canon/work-requests/s3-to-s7-s3-review-approve-separate-async-ownership-surface-with-narrow-contract-adjustme|S3 review: approve separate async ownership surface with narrow contract adjustments; S7 may start implementation]] — - Kind: reply *(verified 2026-04-14; s3/s7/llm-gateway/async-surface/phase-2/ownership)*
- [[wiki/canon/work-requests/s3-to-s7-start-immediate-s7-work-on-opt-in-strict-json-mode-for-v1-chat|start immediate S7 work on opt-in strict JSON mode for /v1/chat]] — - Kind: request *(verified 2026-04-14; s3/s7)*
- [[wiki/canon/work-requests/s4-to-s2-reply-explicit-build-preparation-and-one-shot-quick-contract-is-ready-on-s4|reply: explicit build-preparation and one-shot Quick contract is ready on S4]] — - Kind: reply *(verified 2026-04-13; s4/s2)*
- [[wiki/canon/work-requests/s4-to-s2-reply-s4-build-sdk-migration-truth-is-runtime-aligned-with-canonical-docs-no-v1-|Reply: S4 build/sdk migration truth is runtime-aligned with canonical docs (no /v1/sdk-registry compatibility seam)]] — - Kind: reply *(verified 2026-04-07; s4/s2/sast-runner/backend/sdk-registry/build)*
- [[wiki/canon/work-requests/s4-to-s2-s3-prepare-for-s4-omission-policy-contract-changes-on-v1-scan-and-v1-build-and-anal|Prepare for S4 omission-policy contract changes on /v1/scan and /v1/build-and-analyze]] — - Kind: request *(verified 2026-04-07; s4/s2/s3/sast-runner/analysis-agent)*
- [[wiki/canon/work-requests/s4-to-s3-confirm-s4-exploitability-consumer-minimum-field-set-and-normalization-expectati|Confirm S4 exploitability-consumer minimum field set and normalization expectations]] — - Kind: request *(verified 2026-04-07; s4/s3/analysis-agent/sast-runner)*
- [[wiki/canon/work-requests/s4-to-s3-reply-live-s4-v1-health-request-summary-drift-is-runtime-lag-not-code-contract-m|reply: live S4 /v1/health request-summary drift is runtime lag, not code contract mismatch]] — - Kind: reply *(verified 2026-04-14; s4/s3)*
- [[wiki/canon/work-requests/s4-to-s3-reply-s4-health-request-summary-mapping-for-local-ack-control-rollout|reply: S4 /health request-summary mapping for local-ack control rollout]] — - Kind: reply *(verified 2026-04-13; s4/s3)*
- [[wiki/canon/work-requests/s4-to-s3-reply-s4-now-covers-build-build-and-analyze-in-health-request-summary-and-clarif|reply: S4 now covers build/build-and-analyze in /health request-summary and clarifies wait-while-alive mapping]] — - Kind: reply *(verified 2026-04-14; s4/s3/health/timeout-policy/ack-liveness/build/scan)*
- [[wiki/canon/work-requests/s5-to-s2-aegis-static-wiki-read_page-wiki-prefix|aegis-static-wiki read_page: wiki/ prefix 누락 시 힌트 메시지 개선]] — - Kind: request *(verified 2026-04-07; aegis-static-wiki/mcp)*
- [[wiki/canon/work-requests/s5-to-s2-quick-stage-code-graph-graphrag-capability-contract-prepared|Quick-stage code-graph / GraphRAG capability contract prepared]] — - Kind: reply *(verified 2026-04-13; s5/s2)*
- [[wiki/canon/work-requests/s5-to-s2-s3-s5-runtime-semantics-aligned-on-2026-04-14-real-timeout-enforcement-kb_not_ready|S5 runtime semantics aligned on 2026-04-14: real timeout enforcement, KB_NOT_READY 503s, staged code-graph ingest]] — - Kind: notice *(verified 2026-04-14; s5/api-contract/knowledge-base/code-graph/timeout)*
- [[wiki/canon/work-requests/s5-to-s2-s5-api-x-timeout-ms|S5 프로젝트 메모리 API: X-Timeout-Ms 미적용 명확화]] — - Kind: notice *(verified 2026-04-08; s5/s2)*
- [[wiki/canon/work-requests/s5-to-s3-s5-api-66-shape|S5 API 계약 테스트 66건 완료 — 전 엔드포인트 응답 shape 검증됨]] — - Kind: notice *(verified 2026-04-08; s5/s3)*
- [[wiki/canon/work-requests/s7-to-s3-phase-2-proposal-new-async-ownership-surface-for-no-result-loss-inference-path-p|Phase-2 proposal: new async ownership surface for no-result-loss inference path — please review before S7 implementation]] — - Kind: question *(verified 2026-04-14; s7/s3/llm-gateway/async-surface/phase-2/ownership)*
- [[wiki/canon/work-requests/s7-to-s3-reply-async-ownership-surface-implemented-in-s7-repo-with-reviewed-state-model-a|Reply: async ownership surface implemented in S7 repo with reviewed state model and wrapped result retrieval]] — - Kind: reply *(verified 2026-04-14; s7/s3/llm-gateway/async-surface/phase-2/ownership)*
- [[wiki/canon/work-requests/s7-to-s3-reply-live-v1-chat-json-only-control-leak-is-current-pass-through-limitation-not|Reply: live /v1/chat JSON-only control leak is current pass-through limitation, not a new /health regression]] — - Kind: reply *(verified 2026-04-14; s7/s3)*
- [[wiki/canon/work-requests/s7-to-s3-reply-opt-in-strict-json-mode-implemented-for-v1-chat-in-repo-runtime-rollout-st|Reply: opt-in strict JSON mode implemented for /v1/chat in repo; runtime rollout still needs restart]] — - Kind: reply *(verified 2026-04-14; s7/s3)*
- [[wiki/canon/work-requests/s7-to-s3-reply-s7-chooses-option-c-for-phase-2-no-result-loss-semantics-keep-v1-chat-fini|Reply: S7 chooses Option C for phase-2 no-result-loss semantics — keep /v1/chat finite and use a new async ownership surface]] — - Kind: reply *(verified 2026-04-14; s7/s3/health/timeout-policy/ack-liveness/llm-gateway/phase-2)*
- [[wiki/canon/work-requests/s7-to-s3-reply-s7-health-request-summary-is-now-implemented-in-repo-first-rollout-v1-chat|Reply: S7 /health request-summary is now implemented in repo; first-rollout /v1/chat timeout remains finite]] — - Kind: reply *(verified 2026-04-14; s7/s3/health/timeout-policy/ack-liveness/llm-gateway)*
- [[wiki/canon/work-requests/s7-to-s3-s7-follow-up-clarification-on-health-local-ack-vs-transport-liveness-semantics|S7 follow-up clarification on /health local-ack vs transport-liveness semantics]] — - Kind: reply *(verified 2026-04-13; s7/s3)*
- [[wiki/canon/work-requests/s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request|S7 /health request-summary semantics — response to S3 rollout request]] — - Kind: reply *(verified 2026-04-13; s7/s3)*

## Feedback

- [[wiki/canon/feedback/26.03.25/aegis_00_project_direction|AEGIS가 나아갈 방향]] — AEGIS는 “자동차 임베디드 보안 검증용 분석 플랫폼”으로서의 정체성이 이미 분명하다. *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_review_index|AEGIS 공개 저장소 상세 리뷰 패키지]] — 작성 기준: 공개 GitHub 저장소에서 확인 가능한 코드와 문서를 기준으로 작성했다. *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s1_frontend_qa_review|S1 리뷰: Frontend / QA]] — - docs/specs/frontend.md *(verified 2026-04-06; s1/platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s2_backend_orchestrator_review|S2 리뷰: Backend / Main Orchestrator]] — - docs/specs/backend.md *(verified 2026-04-06; s2/platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s3_agents_review|S3 리뷰: Analysis Agent / Build Agent]] — - docs/specs/analysis-agent.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s4_sast_runner_review|S4 리뷰: SAST-runner]] — - docs/specs/sast-runner.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s5_knowledge_base_review|S5 리뷰: Knowledge Base / GraphRAG]] — - docs/specs/knowledge-base.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s6_dynamic_analysis_review|S6 리뷰: Adapter / ECU Simulator]] — - docs/specs/adapter.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.25/aegis_s7_llm_gateway_review|S7 리뷰: LLM Gateway / LLM Engine]] — - docs/specs/llm-gateway.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/(wr)s3_agent_architecture_review_request|S3 에이전트 아키텍처 리뷰 요청]] — 작성일: 2026-03-26 *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/(wr)s4_sast_runner_review_request|S4 SAST Runner 아키텍처 리뷰 요청]] — 작성일: 2026-03-26 *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/(wr)s5_etl_pipeline_overview|S5 Knowledge Base — 위협 지식 ETL 파이프라인]] — 작성일: 2026-03-26 (피드백 반영 개정: 2026-03-26) *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/s3_agent_architecture_feedback|S3 에이전트 아키텍처 종합 피드백]] — 검토 대상: *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/s4_sast_runner_feedback|S4 SAST Runner 종합 피드백]] — S4의 큰 방향은 좋습니다. *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/26.03.26/s5_etl_pipeline_feedback|S5 ETL Pipeline Overview 문서 상세 피드백]] — 검토 대상: (WR)S5etlpipelineoverview.md *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/agent_service_architecture_overview|외부 피드백: Agent Service 아키텍처 설계 개요]] — 일시: 2026-03-15 *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/readme_ecu_platform_docs|ECU Platform 작업 문서 패키지]] — 이 패키지는 다음 3개 역할에 대한 작업 지침서를 포함한다. *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/s1_frontend_working_guide|S1 작업 지침서 — Frontend (React + TypeScript Web SPA)]] — 이 문서는 S1이 담당하는 Frontend 영역의 책임 범위, 구조 규칙, 협업 규칙, 기술적 제약, 완료 기준을 정의한다. *(verified 2026-04-18; s1/platform)*
- [[wiki/canon/feedback/s2_backend_adapter_simulator_working_guide|S2 작업 지침서 — Backend + ECU Adapter + ECU Simulator]] — 이 문서는 S2가 담당하는 Backend, ECU Adapter, ECU Simulator 영역의 책임 범위, 필수 구현 항목, 아키텍처 원칙, 데이터 모델, 협업 규칙, 안전 요구사항을 명확히 정의하기 위한 작업 지침서다. *(verified 2026-04-06; s2/s6/platform)*
- [[wiki/canon/feedback/s3_agentic_sast_design_feedback|S3 외부 피드백: Agentic SAST 설계 방향]] — 일시: 2026-03-12 *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/s3_llm_gateway_working_guide|S3 작업 지침서 — LLM-Gateway]] — 이 문서는 S3가 담당하는 LLM-Gateway 영역의 책임 범위, 반드시 구현해야 할 기능, 안전 요구사항, 구조화 출력 규칙, agent 확장 방향, 협업 규칙을 정의하기 위한 작업 지침서다. *(verified 2026-04-06; platform)*
- [[wiki/canon/feedback/s5_etl_pipeline_feedback|S5 ETL Pipeline Overview 문서 상세 피드백]] — 검토 대상: (WR)S5etlpipelineoverview.md *(verified 2026-04-06; platform)*

## Decision context

- [[wiki/context/decisions/canonical-wiki|Why the wiki is canonical]] — aegis-static-wiki is the canonical home for migrated AEGIS documentation rather than a secondary summary layer. *(verified 2026-04-05; platform)*
- [[wiki/context/decisions/mcp-over-obsidian|Why agents should use MCP over Obsidian]] — Agents should retrieve wiki content through a wiki-focused MCP rather than relying on Obsidian or Obsidian CLI as the primary interface. *(verified 2026-04-05; platform)*

## Service context

- [[wiki/context/services/s4-sast-runner|S4 / SAST Runner context]] — S4 is the deterministic static-analysis service in AEGIS. It runs multiple SAST tools, build/context extraction, and related preprocessing so that downstream analysis can remain... *(verified 2026-04-05; s4)*

## System

- [[Home|Home]] — This is the Obsidian-friendly dashboard for the canonical AEGIS wiki. *(verified 2026-04-05; platform)*
- [[wiki/system/index|AEGIS static wiki index]] — Content-oriented catalog of the wiki. Agents should read this first to locate relevant pages before drilling into individual documents. *(verified 2026-04-18; platform)*
- [[wiki/system/log|AEGIS static wiki log]] — - Created repo structure for canonical and context page families. *(verified 2026-04-05; platform)*
- [[wiki/system/migration-map|Migration map]] — This file is the authoritative old-path to new-path ledger during phased cutover. *(verified 2026-04-05; platform)*
- [[wiki/system/session-history-policy|Session history policy]] — Every lane work session should produce durable wiki evidence. *(verified 2026-04-06; platform)*
- [[wiki/system/taxonomy|Wiki taxonomy]] — - wiki/canon/charter/ — platform charter and global rules *(verified 2026-04-05; platform)*
- [[wiki/system/test-evidence-policy|Test evidence policy]] — Test and verification activity should be attached to session-history artifacts. *(verified 2026-04-06; platform)*
- [[wiki/system/work-request-policy|Work request policy]] — Canonical work requests live under wiki/canon/work-requests/. *(verified 2026-04-06; platform)*
- [[wiki/system/writing-guide|AEGIS static wiki writing guide]] — This is the main maintenance contract for the wiki. *(verified 2026-04-05; platform)*
