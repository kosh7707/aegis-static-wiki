---
title: "S2 아키텍처 상세"
page_type: "canonical-handoff"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "docs/s2-handoff/architecture.md"
original_path: "docs/s2-handoff/architecture.md"
last_verified: "2026-05-08"
service_tags: ["s2"]
decision_tags: ["build-script-hint", "scriptHintPath", "build-agent-contract", "sdk-materialization", "health-control-v2"]
related_pages: []
migration_status: "canonicalized"
---

# S2 아키텍처 상세

> 구현 현황, DB 스키마, 핵심 로직, 의존성, 실행/운영 메모
> 진입점: `README.md` → 필요 시 이 문서 참조

---

## 3. 구현 현황

### 현재 활성 구조

S2의 실제 런타임 표면은 다음 3개 축이다.

1. **Backend API / Orchestration** — `services/backend/`
2. **Shared contracts** — `services/shared/`
3. **S2 소유 운영 스크립트** — `scripts/`

### 2026-05-06 shared contract / PoC facade refresh

- `services/shared/src/models.ts` is the canonical S2-owned shared contract surface for S1-facing analysis result and PoC facade types.
- `AgentClaimDiagnosticsSummary.nonAcceptedClaims?` is typed as `NonAcceptedClaim[]`; S2 forwards S3 diagnostic records unchanged and documents `status` as the lifecycle-stage key.
- `services/backend/src/controllers/analysis.controller.ts` owns `POST /api/analysis/poc` facade response construction and preserves result-level `pocOutcome`, `qualityOutcome`, `cleanPass`, and `claimDiagnostics`.
- Contract regression coverage lives in `services/backend/src/__tests__/contract/api-contract.test.ts`; update it when shared model semantics change.
- `services/backend/src/lib/claim-diagnostics.ts` is the local runtime guard for this optional diagnostics contract; DAO saves reject malformed new writes and read/facade paths omit malformed optional diagnostics instead of exposing untyped records.

연동 판단은 항상 **다른 서비스 코드가 아니라** `wiki/canon/api/*.md` 계약서를 기준으로 한다.

### 파일 구조

```
services/backend/
├── package.json                  # Express 5 + better-sqlite3 + ws + pino
├── tsconfig.json
├── .env.example
└── src/
    ├── index.ts                  # 앱 진입점
    ├── config.ts                 # 환경변수 중앙화
    ├── db.ts                     # SQLite 초기화 + 30개 테이블 스키마 + FK enforcement
    ├── composition.ts            # DI/AppContext 구성
    ├── router-setup.ts           # 전 라우터 마운트
    ├── bootstrap.ts              # 기동 시 admin 시딩
    ├── controllers/              # 21개 라우터 엔트리
    │   ├── health.controller.ts
    │   ├── analysis.controller.ts
    │   ├── project.controller.ts
    │   ├── project-source.controller.ts
    │   ├── build-target.controller.ts
    │   ├── pipeline.controller.ts
    │   ├── target-library.controller.ts
    │   ├── sdk.controller.ts
    │   ├── dynamic-analysis.controller.ts
    │   ├── dynamic-test.controller.ts
    │   ├── finding.controller.ts
    │   ├── quality-gate.controller.ts
    │   ├── approval.controller.ts
    │   ├── report.controller.ts
    │   ├── notification.controller.ts
    │   ├── auth.controller.ts
    │   └── ...
    ├── services/                 # 32개 서비스/클라이언트
    │   ├── analysis-orchestrator.ts
    │   ├── pipeline-orchestrator.ts
    │   ├── project-source.service.ts
    │   ├── project-deletion.service.ts
    │   ├── build-target.service.ts
    │   ├── sdk.service.ts
    │   ├── result-normalizer.ts
    │   ├── finding.service.ts
    │   ├── quality-gate.service.ts
    │   ├── approval.service.ts
    │   ├── report.service.ts
    │   ├── notification.service.ts
    │   ├── user.service.ts
    │   ├── activity.service.ts
    │   ├── agent-client.ts       # S3 Analysis Agent
    │   ├── build-agent-client.ts # S3 Build Agent
    │   ├── sast-client.ts        # S4 SAST Runner
    │   ├── kb-client.ts          # S5 Knowledge Base
    │   ├── llm-task-client.ts    # S7 Gateway
    │   ├── adapter-client.ts     # S6 Adapter WS
    │   ├── adapter-manager.ts
    │   ├── ws-broadcaster.ts
    │   └── ...
    ├── dao/                      # 활성 DAO 21개 + build/snapshot persistence seam 8개
    │   ├── project.dao.ts
    │   ├── analysis-result.dao.ts
    │   ├── build-target.dao.ts
    │   ├── target-library.dao.ts
    │   ├── sdk-registry.dao.ts
    │   ├── notification.dao.ts
    │   ├── user.dao.ts
    │   └── ...
    ├── can-rules/                # 동적 분석 CAN 룰 엔진
    ├── middleware/               # request-id / logging / auth / error handling
    ├── lib/                      # logger / errors / vulnerability-utils / utils
    └── test, __tests__/          # 계약/통합/서비스 테스트

services/shared/src/
├── models.ts                     # 플랫폼 공용 모델
├── dto.ts                        # API/WS DTO
└── index.ts                      # barrel export

scripts/
├── start.sh                      # 전체 서비스 통합 기동 (S2 소유)
├── stop.sh                       # 전체 서비스 통합 종료 (S2 소유)
├── start-backend.sh              # backend 단독 기동
├── backend/
│   ├── reset-db.sh               # SQLite 파일만 삭제 (uploads 미포함)
│   ├── reset-runtime-state.sh    # SQLite + uploads 동시 초기화
│   ├── db-stats.sh               # 핵심 21테이블 통계 + 전체 테이블 수 점검
│   └── backup-db.sh              # sqlite .backup 기반 DB 백업
└── common/reset-logs.sh
```

### 내부 아키텍처

```
index.ts
  → config.ts
  → db.ts
  → createAppContext(config, db)
  → runStartupTasks(ctx)
  → createAuthMiddleware(...)
  → mountRouters(app, ctx)
  → attachWsServers(server, [...8 broadcasters...])

Controller → Service → DAO → SQLite
             ↘ External Clients (S3/S4/S5/S6/S7)
             ↘ WsBroadcaster<T>
             ↘ CanRuleEngine
```

핵심 wiring:

- `index.ts`: Express + middleware + DI + HTTP server + WS attach
- `composition.ts`: AppContext 생성
  - **활성 DAO 21개 + build/snapshot persistence DAO 8개** (현재는 별도 seam으로 존재)
  - **서비스 32개**
  - **WS broadcaster 7개**: `dynamic-analysis`, `dynamic-test`, `analysis`, `upload`, `pipeline`, `notification`, `sdk`
- `router-setup.ts`: 프로젝트/글로벌 라우터 일괄 마운트

### 프로젝트 lifecycle hardening (2026-04-09)

- `project.controller.ts`
  - `PUT /api/projects/:id` 는 blank `name`을 `400`으로 거부한다.
  - `DELETE /api/projects/:id` 는 async delete workflow로 전환됐다.
- `project.service.ts`
  - legacy inline delete 대신 `ProjectDeletionService`를 주입받아 delete semantics를 위임한다.
- `project-deletion.service.ts`
  - blocker preflight
  - `uploads/{projectId}` quarantine / restore / final remove
  - project-scoped DB row delete manifest
  - `409 CONFLICT` 시 `errorDetail.blockers` 반환
- 현재 delete blocker authority:
  - `AnalysisTracker.getRunning(projectId)`
  - `AdapterManager.findByProjectId(projectId)` live connection state
  - `DynamicSessionDAO.findByProjectId(projectId)` with `connected|monitoring`
  - `DynamicTestService.isRunningForProject(projectId)`
  - `SdkRegistryDAO.findByProjectId(projectId)` non-terminal status
  - `BuildTargetDAO.findByProjectId(projectId)` active pipeline status

### Progress / completion 중심 WS 역할표

| channel | purpose | terminal / failure signal | recovery source | role |
|---|---|---|---|---|
| `upload` | 소스 업로드 live progress | `upload-complete`, `upload-error` | `/api/projects/:pid/source/upload-status/:uploadId` | foreground |
| `sdk` | SDK 등록/검증 state machine | `sdk-complete`, `sdk-error` | `/api/projects/:pid/sdk`, `/api/projects/:pid/sdk/:id` | foreground |
| `analysis` | explicit Quick/Deep 분석 live progress | `analysis-quick-complete`, `analysis-deep-complete`, `analysis-error` | `/api/analysis/status/:analysisId`, `/api/analysis/results/:analysisId` | foreground |
| `pipeline` | 타겟별 build/scan/graph lifecycle | `pipeline-complete`, `pipeline-error` | `/api/projects/:pid/pipeline/status` | foreground |
| `notifications` | completion/failure awareness after navigation | `notification` | `/api/projects/:pid/notifications` | background |

메모:

- `pipeline`은 단일 progress bar라기보다 **target-status lifecycle stream**이다.
- `notifications`는 foreground progress를 대체하지 않으며, 화면 이탈 후 completion/failure awareness를 보완한다.

### 외부 연동 클라이언트

S2는 아래 클라이언트만 통해 하위 서비스를 호출한다.

| 클라이언트 | 대상 | 계약 문서 |
|------------|------|-----------|
| `LlmTaskClient` | S7 Gateway | `wiki/canon/api/llm-gateway-api.md` |
| `AgentClient` | S3 Analysis Agent | `wiki/canon/api/analysis-agent-api.md` |
| `BuildAgentClient` | S3 Build Agent | `wiki/canon/api/build-agent-api.md` |
| `SastClient` | S4 SAST Runner | `wiki/canon/api/sast-runner-api.md` |
| `KbClient` | S5 Knowledge Base | `wiki/canon/api/knowledge-base-api.md` |
| `AdapterClient` / `AdapterManager` | S6 Adapter | `wiki/canon/api/adapter-api.md` |

Health-control v2 integration note (2026-05-08):
- `SastClient.scan()` and `SastClient.build()` use S4 durable ownership mode for direct S4 work: `Prefer: respond-async`, a parent-derived operation-scoped child `X-Request-Id`, and result polling via `/v1/requests/{requestId}/result`.
- The S4 wait loop continues for `queued`, `running + phase-advancing`, `running + transport-only`, and degraded-but-not-blocked summaries. It aborts on ack-break, `failed`, `cancelled`, `expired`, non-null `blockedReason`, ownership loss (`404/409/410`), or explicit local cancellation.
- A submit transport timeout is not automatically terminal: S2 checks S4 `/v1/health?requestId=...` and resumes result polling if S4 still owns the work.
- `LlmTaskClient`, `AgentClient`, and `BuildAgentClient` still consume `/v1/tasks` compatibility surfaces. S2 exposes their health summaries but cannot perform durable status/result/cancel consumption until those owner contracts publish endpoints for S2.

### 코어 기능 묶음

#### 1) 분석 파이프라인 (build-prep → Quick → explicit Deep)

- `analysis-orchestrator.ts`
- `analysis.controller.ts`
- `result-normalizer.ts`

흐름:

1. 소스 + SDK 준비
2. S3 Build Agent / S4 build preparation으로 `compile_commands.json` 준비
3. 사용자가 Quick를 명시적으로 요청하면 S4 Quick scan 1회 수행
4. Quick 직후 S5 code-graph / GraphRAG 형성 수행
5. 사용자가 Deep를 명시적으로 요청하면 S3 deep-analyze 수행
6. 결과 정규화 → Run/Finding/EvidenceRef/Gate
7. `/ws/analysis` 진행률 브로드캐스트

#### 2) 소스 업로드 / 빌드 타겟 / BuildTarget 파이프라인

- `project-source.service.ts`
- `project-deletion.service.ts`
- `build-target.service.ts`
- `pipeline-orchestrator.ts`
- `target-library.controller.ts`
- `sdk.service.ts`

흐름:

1. 소스 업로드/clone
2. 빌드 타겟 탐색/수정
   - `scriptHintPath?` stores a user-selected uploaded build-script hint relative to the effective BuildTarget root.
3. Build Agent resolve
   - `pipeline-orchestrator.ts` forwards `context.trusted.build.mode`, optional `sdkId`, optional uploaded-SDK materialization descriptor, and optional `scriptHintPath` to S3 Build Agent.
   - For registered uploaded SDKs (`sdk-*`), the descriptor is derived internally from `RegisteredSdk`: `sdkRootPath = RegisteredSdk.path`, `setupScript = profile.environmentSetup`, `sysroot = profile.sysroot`, and `toolchainTriplet = profile.compilerPrefix` normalized without a trailing dash.
   - Descriptor generation does not require `RegisteredSdk.verified=true`; the S2 guard is that the SDK root is materialized, project-owned, inside `uploads/{projectId}/sdk/**`, non-empty, and not currently in an in-progress upload/extract/install phase.
   - S2 emits descriptor-derived environment hints (`AEGIS_SDK_ROOT`, `SDK_DIR`, `AEGIS_SDK_SETUP_SCRIPT`, `AEGIS_SDK_SYSROOT`, `SDKTARGETSYSROOT`, `AEGIS_TOOLCHAIN_TRIPLET`) when derivable.
   - Built-in SDK profiles and host defaults are not converted into `sdkRootPath`; no `/home/kosh/ti-sdk`-style fallback is produced.
   - Inline script hint text aliases are not emitted by S2.
4. S4 build/scan
   - Direct S4 calls are durable ownership calls where supported; elapsed age alone is not an abort reason.
   - Completed S4 ownership envelopes are parsed through nested result-level success/readiness/failure fields, not treated as clean success by state alone.
   - S2 local cancellation stops the wait loop through `AbortSignal`; durable service-side cancel is pending lower-lane API support.
5. S5 code-graph ingest
6. 타겟 라이브러리 및 SDK 레지스트리 반영
7. 프로젝트 삭제 시 `uploads/{projectId}` quarantine-first teardown

계약 잠금 메모 (2026-04-04):
- `build-target.controller.ts`
  - `PUT /targets/:id` 에 `includedPaths` 가 오면 silent ignore 대신 `InvalidInputError`
- `sdk.controller.ts`
  - mounted canonical 등록 경로는 JSON `{ name, description?, localPath? }`
- `pipeline.controller.ts`
  - `POST /pipeline/run/:targetId` 는 `{ targetId, status: "running" }`
- `test/create-test-app.ts`
  - contract test 용으로 discover/sdk/rerun 경로를 실제 mount + test double로 유지

#### 3) 동적 분석 / 동적 테스트

- `dynamic-analysis.service.ts`
- `dynamic-test.service.ts`
- `adapter-manager.ts`
- `can-rules/*`

동적 분석은 세션/메시지/알림 저장 + CAN 룰 평가 + 필요한 경우 S7 task 호출,
동적 테스트는 능동 주입과 결과 요약/정규화를 담당한다.

#### 4) 코어 도메인 / 워크플로우

- `finding.service.ts`
- `run.service.ts`
- `quality-gate.service.ts`
- `approval.service.ts`
- `report.service.ts`
- `activity.service.ts`
- `notification.service.ts`
- `user.service.ts`

현재 코어 도메인은 Run / Finding / EvidenceRef / Gate / Approval / Notification / User까지 확장된 상태다.

### 제거된 레거시 (현재 활성 구조 아님)

다음 항목은 더 이상 현재 구조 설명에 포함하지 않는다.

- 정적 룰 엔진 (`rules/`, `rule.dao.ts`, `rule.service.ts`, `project-rules.controller.ts`)
- `LlmV1Adapter`
- `MockEcu`
- 레거시 `static-analysis.service.ts` 기반 설명

역사적 배경은 `session-10.md` ~ `session-15.md`와 최신 `session-omx-*.md` 기록을 참고한다.

---

## 4. 데이터베이스

SQLite(`better-sqlite3`), WAL 모드. DB 파일 기본값은 `services/backend/aegis.db`.

- connection 생성 시 `PRAGMA foreign_keys = ON`
- 현재 프로젝트 삭제는 schema-level FK cascade만 믿지 않고, `ProjectDeletionService`의 explicit delete manifest + uploads quarantine으로 안전성을 확보한다.

### 현재 테이블 30개

| 테이블 | 용도 |
|--------|------|
| `projects` | 프로젝트 기본 정보 |
| `uploaded_files` | 업로드된 파일 메타/본문 |
| `analysis_results` | 분석 결과 원본/정규화 |
| `dynamic_analysis_sessions` | 동적 분석 세션 |
| `dynamic_analysis_alerts` | 동적 분석 알림 |
| `dynamic_analysis_messages` | CAN 메시지 로그 |
| `dynamic_test_results` | 동적 테스트 결과 |
| `adapters` | 프로젝트 어댑터 |
| `project_settings` | 프로젝트 설정 KV |
| `audit_log` | 감사 로그 |
| `runs` | Run 도메인 |
| `findings` | Finding 도메인 |
| `evidence_refs` | 증적 참조 |
| `gate_results` | Quality Gate 결과 |
| `approvals` | 승인 요청 |
| `build_targets` | BuildTarget |
| `notifications` | 프로젝트 알림 |
| `users` | 사용자 |
| `sessions` | 로그인 세션 |
| `sdk_registry` | 등록 SDK |
| `target_libraries` | 타겟별 서드파티 라이브러리 |
| `project_source_assets` | canonical source asset 기록 |
| `sdk_assets` | canonical SDK asset 기록 |
| `build_units` | build unit canonical record |
| `build_unit_revisions` | build unit revision frozen snapshot |
| `build_requests` | build request ledger |
| `build_attempt_projections` | build attempt projection |
| `build_snapshot_projections` | build snapshot projection |
| `build_target_assets` | BuildTarget asset mapping |

### build/snapshot persistence seam 메모

- 위 8개 추가 테이블은 snapshot-first build persistence seam을 위한 canonical 저장 표면이다.
- 현재 handoff 기준으로는 **DB/schema 및 DAO 레벨에는 존재**하지만, 주 런타임 오케스트레이션 wiring은 여전히 기존 BuildTarget 중심 흐름이 메인이다.
- 따라서 다음 세션은 “DB에 이미 존재하는 seam”과 “실제 runtime orchestration에서 얼마나 사용 중인지”를 구분해서 읽어야 한다.

### 마이그레이션 주의사항

- `db.ts`는 **CREATE TABLE → CREATE INDEX → ALTER TABLE(legacy compatibility)** 흐름이 섞여 있으므로 수정 시 순서를 신중히 볼 것.
- 인덱스가 의존하는 컬럼은 기존 DB 호환을 위해 반드시 적절한 컬럼 추가 이후 존재해야 한다.
- hot-reload 중 DB 파일 삭제는 금지. 서버 완전 종료 후 삭제/재생성.

---

## 5. 실행 / 운영 메모

> **서비스 기동 스크립트는 사용자 허락 없이 실행하지 않는다.**

### 현재 통합 기동 순서 (`scripts/start.sh`)

1. `llm-gateway`
2. `sast-runner`
3. `knowledge-base`
4. `build-agent`
5. `analysis-agent`
6. `adapter`
7. `backend`
8. `ecu-simulator` (옵션)
9. `frontend` (옵션)

`stop.sh`는 역순 종료 + 포트 잔류 정리를 수행한다.

### 주요 스크립트

| 파일 | 역할 |
|------|------|
| `scripts/start.sh` | 전체 기동 |
| `scripts/stop.sh` | 전체 종료 |
| `scripts/start-backend.sh` | backend 단독 watch 기동 |
| `scripts/backend/db-stats.sh` | 핵심 21테이블 건수/크기 조회 + 전체 테이블 수 drift 경고 |
| `scripts/backend/reset-db.sh` | DB 파일(`aegis.db*`)만 삭제 |
| `scripts/backend/reset-runtime-state.sh` | DB 파일 + `uploads/` 내부 전체 동시 초기화 |
| `scripts/backend/backup-db.sh` | DB 백업 |
| `scripts/common/reset-logs.sh` | JSONL 로그 초기화 |

운영 메모:

- `reset-db.sh` 는 **DB만** 초기화한다. orphaned uploads 정리까지 기대하면 안 된다.
- 통합테스트 전 완전 초기 기준선이 필요하면 `reset-runtime-state.sh` 를 사용한다.
- 두 reset 스크립트 모두 **실행 중 서비스/DB 점유를 먼저 확인**하고, `reset-runtime-state.sh` 는 기본적으로 확인 프롬프트를 요구한다.

### 환경변수

핵심 backend 환경변수:

- `PORT`
- `LLM_GATEWAY_URL`
- `ANALYSIS_AGENT_URL`
- `SAST_RUNNER_URL`
- `KB_URL`
- `BUILD_AGENT_URL`
- `UPLOADS_DIR`
- `DB_PATH`
- `LOG_DIR`
- `LOG_LEVEL`

---

## 6. Observability

공통 규약은 `wiki/canon/specs/observability.md`가 기준이다.

S2 구현 포인트:

- `request-id.middleware.ts`: `X-Request-Id` 생성/전파
- `request-logger.middleware.ts`: 요청 시작/종료 구조화 로그
- `error-handler.middleware.ts`: Observability 규약 에러 응답 형식 적용
- `lib/logger.ts`: pino JSON logger
- `lib/errors.ts`: `AppError` 계층

로그는 기본적으로 프로젝트 루트 `logs/`의 JSONL 파일에 쌓인다.
