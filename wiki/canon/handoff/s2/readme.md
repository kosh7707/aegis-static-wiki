---
title: "S2. AEGIS Core (Backend) 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s2-handoff/README.md"
last_verified: "2026-04-08"
service_tags: ["s2"]
decision_tags: []
related_pages: ["wiki/context/project/end-to-end-scenarios.md"]
---

# S2. AEGIS Core (Backend) 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S2(AEGIS Core/Backend) 개발을 이어받는 다음 세션을 위한 진입점이다.
> 상세 정보는 같은 디렉토리의 분할 문서를 참조한다.
> **마지막 업데이트: 2026-04-08**
> 빠른 cross-service 흐름 복기가 필요하면 [[wiki/context/project/end-to-end-scenarios|AEGIS 대표 시나리오별 통신 흐름]]을 먼저 본다.

---

## 문서 구조

| 문서 | 내용 |
|------|------|
| **이 파일 (README.md)** | 역할, 경계, 현재 상태, 관리 문서, 참조 |
| [architecture.md](architecture.md) | 구현 현황, DB 스키마, 핵심 로직, 의존성, 실행 방법, Observability |
| [api-endpoints.md](api-endpoints.md) | API 엔드포인트 전체 목록 (현재 라우터 구현 반영) |
| [roadmap.md](roadmap.md) | 다음 작업, 후순위, 인프라 계획 |
| session-{N}.md / session-omx-*.md | 세션별 작업 로그 (legacy numbered sessions + deterministic omx sessions) |

---

## 1. 프로젝트 전체 그림

```
                  S1 / S1-QA (Frontend :5173)
                          │
                     S2 (AEGIS Core :3000)  ← 플랫폼 오케스트레이터
                    ╱     │     ╲      ╲
                 S3       S4     S5      S6
               Agent    SAST     KB    동적분석
              :8001    :9000   :8002    :4000
                │
           S7 Gateway (:8000)  ← LLM 단일 관문
                │
           LLM Engine (DGX Spark)
           Qwen3.5-122B-A10B-GPTQ-Int4
```

**S2가 전체 오케스트레이터.** S1에게 API를 제공하고, S3/S4/S5/S6/S7를 호출하는 중추.
- 운영 상으로는 **S1-QA가 S1과 별도 세션**으로 프론트엔드 QA를 담당한다. 서비스 토폴로지는 동일하고, S2 입장에서는 QA 이슈/피드백의 별도 발신자라고 보면 된다.

### 보안 검증 구조

```
사용자: 소스코드 업로드 (ZIP/Git) → "분석 실행"
  → [Quick] S2 → S4 SAST Runner: 빌드 + 6도구 (~30초)
  → [Deep]  S2 → S3 Agent: SAST + 코드그래프 + SCA + KB + LLM (~3분)
```

---

## 2. 너의 역할과 경계

### 너는

- **AEGIS Core 개발자 + 플랫폼 오케스트레이터 + 인프라 스크립트 담당**
- `services/backend/` 하위 코드를 소유
- `services/shared/` 공유 타입 패키지를 **단독 소유**
- `scripts/start.sh`, `scripts/stop.sh` 통합 기동/종료 스크립트 소유
- S1에게 API를 제공하고, S3/S4/S5/S6/S7를 호출하는 전체 오케스트레이터

### API 계약 소통 원칙 (필수)

- **다른 서비스의 코드를 절대 읽지 않는다** — API 계약서(`wiki/canon/api/`)로만 소통
- **S2는 `wiki/canon/api/shared-models.md`의 단독 소유자** — 코드 변경 시 계약서 동기화 필수
- 공유 모델 변경 시 영향받는 서비스에 work-request로 고지

### 작업 요청

- **새 canonical WR 경로**: `wiki/canon/work-requests/`
- **legacy archive 경로**: `docs/work-requests/`
- 세션 시작 시:
  1. **active canonical WR**는 `wiki/canon/work-requests/`를 기준으로 확인
  2. `docs/work-requests/`는 historical archive/reference로만 취급
- **2026-04-06 기준 메모**
  - WR-only wiki MCP hardening 완료
  - runtime WR semantics는 **new canonical WR only**
  - archived `docs/work-requests/**`는 **runtime out-of-scope**
  - canonical WR 디렉토리는 비어 있을 수 있으며, 이는 정상 상태다

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S2도 **다른 서비스 코드를 읽지 않는다**. 연동은 API 계약서만 본다.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 계약이 비어 있거나 낡았으면 추측하지 말고 담당자에게 WR을 보낸다.
  - **커밋은 S2 세션만** 한다. 다른 lane 대신 커밋해주는 통합자 역할도 S2가 맡는다.
  - `scripts/start.sh`, `scripts/stop.sh`, `scripts/start-*.sh` 등 서비스 기동/종료 스크립트는 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- 장기 S2 작업 메모와 후속 세션 인계는 `$note`와 `.omx` 메모리를 사용한다.
- **`$ralph`**: 한 세션이 백엔드/공유타입/문서/테스트까지 끈질기게 몰아쳐야 하는 단일 lane 작업에 우선 사용한다.
- **`$team`**: S2가 S1/S1-QA/S3/S4/S5/S6/S7과 병렬 협업을 조직해야 할 때 우선 사용한다.
- **`$trace`**: 이전 Codex/OMX 세션의 판단 흐름과 작업 이력을 복기할 때 사용한다.
- skill을 써도 **소유권과 API 계약 규칙은 그대로** 유지한다.

---

## 3. 현재 상태 (2026-04-07)

| 항목 | 값 |
|------|---|
| TypeScript 에러 | **0개** |
| 테스트 | **356개 통과** (vitest, 2026-04-07 WebSocket progress/completion hardening 재검증) |
| DB 테이블 | **29개** (SQLite, WAL) — 기존 21개 활성 표면 + snapshot/build persistence seam 포함 |
| API 엔드포인트 | `api-endpoints.md`에 현행 라우터 기준 목록 정리 |
| WebSocket 채널 | **7개 mounted** (`dynamic-analysis`, `dynamic-test`, `analysis`, `upload`, `pipeline`, `notification`, `sdk`) |
| 에러 클래스 | 18개 (AppError 계층, 21개 에러코드) |
| 외부 클라이언트 | SastClient(S4), AgentClient(S3), BuildAgentClient(S3:8003), KbClient(S5), AdapterClient(S6), LlmTaskClient(S7) |

### 3-0. Progress / completion UX 계약 메모 (2026-04-07)

현재 S2는 WebSocket을 단순 transport가 아니라 **비동기 작업의 진행/완료 인지 표면**으로 본다.

- **foreground progress 채널**
  - `/ws/upload`
  - `/ws/sdk`
  - `/ws/analysis`
  - `/ws/pipeline`
- **background completion awareness 채널**
  - `/ws/notifications`

Recovery / re-entry 원칙:

- 사용자가 화면을 이동하거나 재연결한 뒤에는 **WS replay를 기대하지 않는다**.
- 대신 채널별 authoritative recovery path를 사용한다.
  - upload → `/api/projects/:pid/source/upload-status/:uploadId`
  - sdk → `/api/projects/:pid/sdk` / `/:id`
  - analysis → `/api/analysis/status/:analysisId`, `/api/analysis/results/:analysisId`
  - pipeline → `/api/projects/:pid/pipeline/status`
  - notifications → `/api/projects/:pid/notifications`

S1 handoff 원칙:

- API/WS 계약은 **normative**
- 화면별 활용 방식은 **advisory**
- 즉 S2는 exact contract를 주고, S1은 그 위에 UX를 설계한다

### 3-1. 최근 계약 회귀 잠금 메모 (2026-04-04)

- S1↔S2 canonical contract 재작성 후, S2 backend 테스트 하네스는 다음 semantics를 **회귀 테스트로 고정**했다.
  - `POST /api/projects/:pid/targets/discover` → `data: { discovered, created, targets, elapsedMs }`
  - `POST /api/projects/:pid/pipeline/run/:targetId` → `data: { targetId, status: "running" }`
  - `GET /api/projects/:pid/pipeline/status` → canonical `PipelineStatus`
  - `GET/POST /api/projects/:pid/sdk` → `RegisteredSdk` / `{ builtIn, registered }`
- build-target update는 현재도 `includedPaths` 변경을 지원하지 않으며, backend는 이를 **명시적 에러**로 거부한다.
- SDK analyzed profile 연동에서 canonical 필드명은 `environmentSetup`이며, S2 로컬 SDK 검증도 해당 이름을 기준으로 경로 존재/경계 검증을 수행한다.

### 3-2. 테스트/문서 동기화 메모 (2026-04-04)

- backend contract test harness (`services/backend/src/test/create-test-app.ts`) 는 이제 다음 surface를 직접 검증 가능하게 맞춰져 있다.
  - `/api/projects/:pid/targets/discover`
  - `/api/projects/:pid/sdk`
  - `/api/projects/:pid/pipeline/run/:targetId`
- contract lockdown 관련 S2 기준 검증 결과:
  - `src/__tests__/contract/api-contract.test.ts` → **79 passed**
  - `cd services/backend && npx vitest run` → **21 files / 356 tests passed**
  - `services/backend` / `services/shared` `tsc --noEmit` 통과
- 문서 동기화 완료 범위:
  - `wiki/canon/api/shared-models.md`
  - `wiki/canon/specs/backend.md`
  - `wiki/canon/handoff/s2/readme.md`
  - `wiki/canon/handoff/s2/roadmap.md`
  - `wiki/canon/handoff/s2/architecture.md`
  - `wiki/canon/handoff/s2/session-omx-*.md`

### 3-3. WR / handoff 운영 메모 (2026-04-06)

- canonical WR runtime model은 `wiki/canon/work-requests/` 기준으로만 동작한다.
- archived `docs/work-requests/`는 historical reference만 남는 경로이며, `list_my_open_wrs` / `register_wr` / `complete_wr`의 입력이 아니다.
- WR semantics를 다시 바꿀 때는 최소한 아래 3곳을 함께 점검해야 한다.
  - `wiki/system/work-request-policy.md`
  - `wiki/system/migration-map.md`
  - `wiki/system/index.md`

### Durable (투자, 유지)

| 영역 | 핵심 파일 |
|------|---------|
| Quick→Deep 오케스트레이션 | `analysis-orchestrator.ts`, `analysis.controller.ts` |
| 서브 프로젝트 파이프라인 | `pipeline-orchestrator.ts`, `pipeline.controller.ts` |
| 소스코드 업로드/관리 | `project-source.service.ts`, `project-source.controller.ts` |
| 빌드 타겟 관리 | `build-target.service.ts`, `build-target.controller.ts` |
| 코어 도메인 | Run, Finding(7-state), EvidenceRef, QG, Approval, Report |
| ResultNormalizer | `normalizeAnalysisResult()` + `normalizeAgentResult()` |
| 알림 시스템 | notification.dao.ts, notification.service.ts, notification.controller.ts |
| 사용자/인증 | user.dao.ts, user.service.ts, auth.middleware.ts, auth.controller.ts |
| Gate 프로필 | gate-profiles.ts (3 프리셋: default/strict/relaxed) |

### 세션 13에서 제거 완료된 레거시

- `rules` DB 테이블 + `IRuleDAO` 인터페이스 + `Rule` 공유 타입 — 룰 엔진 완전 제거
- `LlmV1Adapter` (v0→v1 호환 레이어) — `LlmTaskClient`에 concurrency 통합, 서비스 직접 사용
- `MockEcu` — 인터페이스를 `adapter-client.ts`로 이동, 클래스 삭제

---

## 4. S2가 관리하는 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| **공통 제약 사항** | `docs/AEGIS.md` | 프로젝트 전체 거버넌스. **S2가 관리** |
| 기능 명세서 | `wiki/canon/specs/backend.md` | S2의 모든 API + 아키텍처 상세 |
| 전체 기술 개요 | `wiki/canon/specs/technical-overview.md` | 전체 시스템 구조 (**S2 주도**) |
| Observability 규약 | `wiki/canon/specs/observability.md` | MSA 공통 규약 |
| 공유 모델 명세 | `wiki/canon/api/shared-models.md` | 전 서비스 공유 타입. **S2 단독 관리** |
| 서비스 관리 스크립트 | `scripts/start.sh`, `scripts/stop.sh` | 전체 서비스 기동/종료 |

**중요**: 구현을 바꾸면 `wiki/canon/specs/backend.md`와 `wiki/canon/api/shared-models.md`도 반드시 같이 업데이트할 것.

---

## 5. 참고할 문서들

| 문서 | 경로 | 왜 봐야 하는지 |
|------|------|--------------|
| 공통 제약 사항 | `docs/AEGIS.md` | **필독** — 역할, 소유권, 소통 규칙 전부 |
| S2 기능 명세 | `wiki/canon/specs/backend.md` | 네가 관리하는 계약서 |
| S3 Agent API | `wiki/canon/api/analysis-agent-api.md` | S2↔S3 deep-analyze 호출 스펙 |
| S7 API 명세 | `wiki/canon/api/llm-gateway-api.md` | S2↔S7, S3↔S7 호출 스펙 |
| SAST Runner API | `wiki/canon/api/sast-runner-api.md` | S2↔S4 직접 호출 스펙 |
| KB API | `wiki/canon/api/knowledge-base-api.md` | S5 호출 스펙 |
| 공유 모델 | `wiki/canon/api/shared-models.md` | 전 서비스 공유 타입 |


### 3-4. WebSocket progress/completion contract 메모 (2026-04-07)

- progress/completion UX 관점의 우선 채널은 `upload`, `sdk`, `analysis`, `pipeline`, `notifications` 다.
- `notifications` 는 단순 부가 알림이 아니라 **background completion surface** 로 취급한다.
- recovery source of truth는 flow별로 다르다:
  - upload → `GET /api/projects/:pid/source/upload-status/:uploadId`
  - sdk → `GET /api/projects/:pid/sdk/:id`
  - analysis → `GET /api/analysis/status/:analysisId`, terminal은 `GET /api/analysis/results/:analysisId`
  - pipeline → `GET /api/projects/:pid/pipeline/status`
- S2는 exact contract/docs/tests를 owning하고, S1에는 advisory UX handoff를 WR로 넘긴다.
