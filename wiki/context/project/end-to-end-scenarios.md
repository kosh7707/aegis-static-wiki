---
title: "AEGIS 대표 시나리오별 통신 흐름"
page_type: "context-note"
canonical: false
source_refs:
  - "wiki/canon/specs/technical-overview.md"
  - "wiki/canon/specs/backend.md"
  - "wiki/canon/api/shared-models.md"
  - "wiki/canon/handoff/s2/api-endpoints.md"
last_verified: "2026-04-08"
service_tags: ["platform"]
decision_tags: ["scenario", "interaction-flow", "routing"]
related_pages: ["wiki/canon/specs/technical-overview.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/context/project/unified-security-analysis-vision.md"]
---

# AEGIS 대표 시나리오별 통신 흐름

> 이 문서는 **대표 사용자 시나리오의 cross-service 통신 흐름**을 빠르게 이해하기 위한 context 페이지다.
> **canonical 계약을 대체하지 않는다.** 정확한 필드/엔드포인트/상태값은 반드시 관련 spec/API 문서를 기준으로 확인한다.

## 이 문서를 언제 볼까

- "이 기능이 실제로 어떤 서비스들을 거쳐 동작하는지"를 빠르게 파악하고 싶을 때
- API 문서와 handoff를 읽기 전에 **큰 흐름**을 먼저 잡고 싶을 때
- WebSocket 진행률과 REST recovery path의 관계를 한 번에 보고 싶을 때

## 먼저 볼 canonical 문서

- [[wiki/canon/specs/technical-overview|기술 명세 - 전체 개요]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- [[wiki/canon/api/shared-models|Shared (S1-S2) API / Model Contract]]

---

## 시나리오 1. 소스코드 업로드 → 프로젝트 소스 materialize

### 목표
사용자가 프로젝트에 소스코드를 업로드하고, 이후 타겟 탐색/분석이 가능한 상태를 만든다.

### 참여자
- 사용자
- S1 Frontend
- S2 Backend

### 주 흐름
1. 사용자가 S1에서 업로드를 시작한다.
2. S1이 `POST /api/projects/:pid/source/upload` 로 업로드를 보낸다.
3. S2가 업로드 파일을 저장/압축해제하고 프로젝트 소스 경로를 materialize 한다.
4. S2가 `/ws/upload?uploadId=` 로 foreground progress 를 보낸다.
5. 업로드가 끝나면 S2가 `upload-complete` 를 보낸다.
6. 동시에 S2는 background awareness 용 notification 을 생성할 수 있다.

### 실패 / 복구
- 업로드 중 화면 이탈/재연결 시 WS replay 를 기대하지 않는다.
- authoritative recovery path:
  - `GET /api/projects/:pid/source/upload-status/:uploadId`

### 관련 canonical 문서
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]

---

## 시나리오 2. 빌드 타겟 탐색 → 서브프로젝트 파이프라인 준비

### 목표
업로드된 소스에서 빌드 단위를 식별하고, 이후 build/scan/graph 파이프라인을 돌릴 준비를 한다.

### 참여자
- 사용자
- S1 Frontend
- S2 Backend
- S4 SAST Runner

### 주 흐름
1. 사용자가 타겟 자동 탐색을 요청한다.
2. S1이 `POST /api/projects/:pid/targets/discover` 를 호출한다.
3. S2가 프로젝트 소스 경로를 기준으로 탐색 요청을 조립한다.
4. S2가 S4에 빌드 단위 탐색/검증 성격의 요청을 보낸다.
5. S4 응답을 바탕으로 S2가 BuildTarget 들을 생성/갱신한다.
6. S1은 이후 `GET /api/projects/:pid/targets` 와 `GET /api/projects/:pid/source/files` 를 조합해 타겟과 파일 트리를 본다.

### 실패 / 복구
- 타겟 탐색 실패 시 사용자는 소스 트리와 기존 타겟 목록을 기준으로 다시 시도한다.
- authoritative surfaces:
  - `GET /api/projects/:pid/targets`
  - `GET /api/projects/:pid/source/files`

### 관련 canonical 문서
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/api/sast-runner-api|SAST Runner API 명세]]

---

## 시나리오 3. SDK 등록 → 검증 완료

### 목표
프로젝트 전용 SDK/toolchain 자산을 등록하고 buildProfile 추론에 쓸 수 있는 ready 상태로 만든다.

### 참여자
- 사용자
- S1 Frontend
- S2 Backend
- S3 Build Agent

### 주 흐름
1. 사용자가 archive / `.bin` / folder 형태의 SDK 자산을 업로드한다.
2. S1이 `POST /api/projects/:pid/sdk` 로 multipart 요청을 보낸다.
3. S2가 SDK 자산을 저장하고 상태를 `uploaded → extracting/installing → analyzing → verifying → ready` 로 진행시킨다.
4. 필요 시 S2가 S3 Build Agent 에 분석/검증 작업을 위임한다.
5. S2는 `/ws/sdk?projectId=` 로 foreground progress 를 보낸다.
6. 완료되면 `sdk-complete` 와 등록 SDK 상세가 사용자에게 노출된다.

### 실패 / 복구
- 설치/추출/검증 중 실패할 수 있다.
- 재연결 후 authoritative recovery path:
  - `GET /api/projects/:pid/sdk`
  - `GET /api/projects/:pid/sdk/:id`

### 관련 canonical 문서
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/api/build-agent-api|Build Agent API 명세 (v1.0.0)]]

---

## 시나리오 4. 소스 + SDK 업로드 → 빌드 준비 → Quick → 명시적 Deep

### 목표
사용자가 프로젝트 소스와 SDK를 준비한 뒤 빌드 material을 먼저 만들고, Quick 결과를 확인한 다음 필요할 때만 Deep 분석을 명시적으로 요청한다.

### 참여자
- 사용자
- S1 Frontend
- S2 Backend
- S3 Build Agent
- S4 SAST Runner
- S3 Analysis Agent
- S5 Knowledge Base
- S7 LLM Gateway

### 주 흐름
1. 사용자가 프로젝트에 소스를 업로드한다.
2. 사용자가 프로젝트에 SDK를 업로드한다.
3. 사용자가 **빌드 준비 단계**를 명시적으로 시작한다.
4. S2가 S3 Build Agent를 호출해 buildCommand/buildProfile 후보를 준비하고, S4가 `compile_commands.json` 을 생성할 수 있는 build material을 만든다.
5. 사용자가 **Quick 분석**을 명시적으로 요청한다.
6. S2가 S4를 **1회성으로** 호출해 Quick 결과를 만들고, 이어서 S5에 GraphRAG/코드그래프 형성을 요청한다.
7. S2가 Quick 결과와 graph context를 정규화/저장한 뒤 `analysis-quick-complete` 를 보낸다.
8. 사용자는 Quick 결과를 본 뒤, 필요할 때만 **Deep 분석**을 명시적으로 요청한다.
9. S2가 S3 Analysis Agent를 호출하고, S3가 S4/S5/S7를 활용해 심층 분석한 결과를 S2가 정규화/저장한 뒤 `analysis-deep-complete` 를 보낸다.
10. 사용자는 결과 화면에서 findings / summary / evidence 를 조회한다.

### 실패 / 복구
- 현재 implementation/endpoint surface에는 아직 호환성용 legacy alias가 남아 있을 수 있다. 이 문서는 **canonical explicit-step user journey intent** 를 설명한다.
- 진행 중 reconnect 시 authoritative recovery path:
  - `GET /api/analysis/status/:analysisId`
- 완료 후 source of truth:
  - `GET /api/analysis/results/:analysisId`
- background completion awareness:
  - `/ws/notifications?projectId=`
  - `GET /api/projects/:pid/notifications`

### 관련 canonical 문서
- [[wiki/canon/specs/technical-overview|기술 명세 - 전체 개요]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/api/build-agent-api|Build Agent API 명세]]
- [[wiki/canon/api/analysis-agent-api|Analysis Agent API 명세]]
- [[wiki/canon/api/sast-runner-api|SAST Runner API 명세]]
- [[wiki/canon/api/knowledge-base-api|Knowledge Base API 계약서]]
- [[wiki/canon/api/llm-gateway-api|S7. LLM Gateway API 명세]]

---

## 시나리오 5. 파이프라인 재실행 → 타겟 상태 추적

### 목표
특정 build target 에 대해 build → scan → graph 적재 파이프라인을 재실행하고 상태를 추적한다.

### 참여자
- 사용자
- S1 Frontend
- S2 Backend
- S3 Build Agent
- S4 SAST Runner
- S5 Knowledge Base

### 주 흐름
1. 사용자가 특정 타겟 재실행을 요청한다.
2. S1이 `POST /api/projects/:pid/pipeline/run/:targetId` 를 호출한다.
3. S2가 pipelineId 를 만들고 타겟 상태 전이를 시작한다.
4. S2는 필요 시 S3 Build Agent, S4, S5를 순차 호출한다.
5. S2는 `/ws/pipeline?projectId=` 로 target-status lifecycle 을 전송한다.
6. 완료되면 `pipeline-complete` 와 notification 을 통해 사용자가 상태를 인지한다.

### 실패 / 복구
- reconnect 후 source of truth:
  - `GET /api/projects/:pid/pipeline/status`
- WS 는 lifecycle stream 이고, 최종 authoritative 상태는 REST status 가 가진다.

### 관련 canonical 문서
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/api/build-agent-api|Build Agent API 명세 (v1.0.0)]]
- [[wiki/canon/api/knowledge-base-api|Knowledge Base API 계약서]]

---

## 시나리오 6. Finding triage → Gate / Approval 반영

### 목표
분석가가 finding 상태를 조정하고, 필요 시 gate override / approval 흐름으로 이어간다.

### 참여자
- 사용자(analyst/admin)
- S1 Frontend
- S2 Backend

### 주 흐름
1. 사용자가 Finding 상세 또는 목록에서 상태 변경을 요청한다.
2. S1이 `PATCH /api/findings/:id/status` 또는 `PATCH /api/findings/bulk-status` 를 호출한다.
3. S2가 Finding 상태 머신 규칙을 검증하고 상태를 갱신한다.
4. 사용자가 gate override 를 요청하면 S1이 `POST /api/gates/:id/override` 를 호출한다.
5. S2가 Approval 을 생성하고, 관리자는 `POST /api/approvals/:id/decide` 로 승인/거부한다.
6. 상태 변화와 승인 결과는 활동/알림/리포트 표면에 반영된다.

### 실패 / 복구
- 상태 전이 불가 시 S2가 validation error 를 반환한다.
- 관련 조회 surface:
  - `GET /api/findings/:id`
  - `GET /api/findings/:id/history`
  - `GET /api/projects/:pid/gates`
  - `GET /api/projects/:pid/approvals`

### 관련 canonical 문서
- [[wiki/canon/specs/backend|S2. Core Service 기능 명세]]
- [[wiki/canon/api/shared-models|Shared (S1-S2) API / Model Contract]]
- [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]

---

## 빠른 라우팅 가이드

- 전체 서비스 구조/역할부터 보고 싶다 → [[wiki/canon/specs/technical-overview|기술 명세 - 전체 개요]]
- S2가 제공하는 실제 REST/WS 표면을 보고 싶다 → [[wiki/canon/handoff/s2/api-endpoints|S2 API 엔드포인트 전체 목록]]
- S1↔S2 DTO/WS payload shape 를 보고 싶다 → [[wiki/canon/api/shared-models|Shared (S1-S2) API / Model Contract]]
- backend 구현 ownership / 테스트 / wiring 을 보고 싶다 → [[wiki/canon/handoff/s2/readme|S2. AEGIS Core (Backend) 인수인계서]]
- 프로젝트 비전/장기 방향을 보고 싶다 → [[wiki/context/project/unified-security-analysis-vision|통합 보안 분석 루프 — 정적+동적+LLM 비전]]

## 유지 원칙

- 이 문서는 **시나리오 관점의 연결 문서**다.
- 필드명, enum, 상태값, 정확한 엔드포인트 의미는 항상 canonical 문서를 우선한다.
- 새로운 시나리오를 추가할 때는 가능한 한 **메인 흐름 + 실패/복구 + canonical 링크** 구조를 유지한다.
