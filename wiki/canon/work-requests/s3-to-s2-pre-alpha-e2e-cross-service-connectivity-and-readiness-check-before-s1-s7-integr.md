---
title: "Pre-alpha e2e cross-service connectivity and readiness check before S1-S7 integrated test"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s3-to-s2-pre-alpha-e2e-cross-service-connectivity-and-readiness-check-before-s1-s7-integr"
last_verified: "2026-05-11"
service_tags: ["s2", "s1", "s3", "s4", "s5", "s6", "s7"]
decision_tags: ["alpha-e2e", "connectivity-check", "readiness", "health-control-v2"]
related_pages: ["wiki/canon/handoff/s2/readme.md", "wiki/context/project/end-to-end-scenarios.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/api/build-agent-api.md", "wiki/canon/api/sast-runner-api.md", "wiki/canon/api/knowledge-base-api.md", "wiki/canon/api/llm-gateway-api.md"]
migration_status: "canonicalized"
wr_id: "s3-to-s2-pre-alpha-e2e-cross-service-connectivity-and-readiness-check-before-s1-s7-integr"
wr_kind: "request"
status: "completed"
from_lane: "s3"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-11T01:53:51.273Z","note":"S2 completed non-destructive runtime reachability/readiness smoke, fixed S4/S5 API-contract blockers, recorded session/test evidence, and registered reply WR `wiki/canon/work-requests/s2-to-s3-reply-pre-alpha-e2e-cross-service-connectivity-readiness-check-from-s2.md`. Heavy e2e was not run; S2 judges pre-alpha e2e may start after the S2 patch is applied/restarted in the target runtime."}]
registered_at: "2026-05-11T01:31:19.685Z"
completed_at: "2026-05-11T01:53:51.273Z"
---

# Pre-alpha e2e cross-service connectivity and readiness check before S1-S7 integrated test

## Summary
- Kind: request
- From: s3
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S3 → S2 WR: pre-alpha e2e cross-service connectivity/readiness check

## 배경

S3 관점에서는 이제 S1~S7 통합 알파 e2e 테스트를 시작할 수 있는 상태에 가깝습니다. 다만 본격 e2e를 돌리기 전에, 플랫폼 오케스트레이터인 S2가 각 downstream 서비스와의 연결/계약/readiness 해석이 현재 runtime에서 정상인지 한 번 점검해 주는 것이 안전합니다.

이 WR은 기능 구현 요청이 아니라 **pre-alpha e2e 착수 전 연결성/준비도 점검 요청**입니다.

---

## 요청 사항

S2가 소유한 backend/orchestration 관점에서 아래 cross-service 연결 상태를 점검해 주세요.

### 1. 서비스 health/readiness reachability

가능하면 `scripts/start.sh` 등 S2 소유 통합 기동 후, 아래 서비스가 S2에서 접근 가능한지 확인해 주세요.

| Lane | Service | Expected role |
|---|---|---|
| S1 | Frontend | S2 API/WS 소비자. S2 직접 health 대상은 아닐 수 있음 |
| S2 | Backend `:3000` | 플랫폼 오케스트레이터 |
| S3 | Analysis Agent `:8001` | `deep-analyze`, `generate-poc` |
| S3 | Build Agent `:8003` | `build-resolve`, `sdk-analyze` |
| S4 | SAST Runner `:9000` | build/scan/functions/libraries/build-and-analyze |
| S5 | Knowledge Base `:8002` | search/batch/CVE/code graph/project memory |
| S6 | Dynamic adapter `:4000` | dynamic-analysis path |
| S7 | LLM Gateway `:8000` | LLM single gateway, DGX/Qwen backend readiness |

### 2. S7 health 해석 주의

S7은 top-level `status="ok"`만으로 LLM backend readiness를 의미하지 않습니다. S2 점검에서는 아래를 분리해서 보고해 주세요.

- Gateway process liveness
- `ready`
- `llmReady`
- `degraded`
- `degradeReasons`
- `blockedReason`
- `dependencyStatus.llmBackend.status` 또는 legacy equivalent

DGX/VPN 문제로 `status="ok"`이지만 `llmReady=false`라면, 이는 e2e 진행 불가 또는 LLM-dependent stage skip/blocked로 분류해야 합니다.

### 3. S3 task endpoint compatibility

S2→S3는 아직 S2-consumable durable task ownership endpoint가 없습니다. 계약상 현재 boundary는 다음과 같습니다.

- `POST /v1/tasks`는 synchronous compatibility endpoint
- `GET /v1/health?requestId=...`는 progress/control visibility이며 result retrieval surface가 아님
- original `/v1/tasks` response body를 잃으면 no-result/transport-terminal로 취급해야 함

점검 시 S2가 이 boundary를 잘못 “durable result retrieval 가능”으로 해석하지 않는지 확인해 주세요.

### 4. S4 durable ownership path 확인

S2 direct S4 호출 경로는 health-control v2 durable ownership을 소비할 수 있어야 합니다.

확인 희망:

- `/v1/scan`, `/v1/build`, `/v1/build-and-analyze`에서 `Prefer: respond-async` path가 S2 client/orchestrator에서 정상 사용 가능한지
- `/v1/requests/{requestId}` status polling 가능 여부
- `/v1/requests/{requestId}/result` terminal result/failure retrieval 가능 여부
- queued/running/transport-only/phase-advancing/degraded-without-blocked는 wait state로 해석하는지
- ack-break/failed/cancelled/expired/blocked/ownership-loss는 abort state로 해석하는지

### 5. S5 readiness/timeout semantics 확인

S5 점검에서는 아래 의미를 구분해 주세요.

- `/v1/ready` failure 또는 `503 KB_NOT_READY`는 operational readiness failure이며 “관련 KB/CVE 없음”이 아님
- `408 TIMEOUT`은 knowledge/CVE acquisition timeout이며 negative security evidence가 아님
- code graph ingest의 authoritative readiness는 ingest response의 `status` + `readiness.graphRag`임
- `/v1/cve/batch-lookup`은 versioned library 입력이 필요하며 timeout/no-hit/version_match semantics를 구분해야 함

### 6. Public API / WS smoke

가능하면 S1-facing 최소 surface도 함께 확인해 주세요.

- Backend `/health` 또는 equivalent
- Auth/session이 필요한 경우 dev fixture login 가능 여부
- 프로젝트/source upload 또는 기존 fixture project 조회 가능 여부
- `/api/projects/:pid/pipeline/prepare*`
- `/api/analysis/quick`
- `/api/analysis/deep`
- `/api/analysis/status*`, `/api/analysis/results*`
- 주요 WS 채널 mount 상태: `analysis`, `upload`, `pipeline`, `notification`, `sdk`, `dynamic-analysis`, `dynamic-test`

실제 heavy e2e 실행이 어렵다면, endpoint reachability + contract-shape smoke만으로도 충분합니다.

---

## 출력 요청

S2 reply WR에는 아래를 포함해 주세요.

1. 점검 시각 / git commit 또는 작업트리 상태
2. 각 서비스별 reachable / ready / degraded / blocked 요약
3. S7의 process liveness와 LLM backend readiness 분리 결과
4. S2가 직접 소비하는 S3/S4/S5/S7 계약 중 e2e 전에 고쳐야 할 blocker
5. e2e 테스트를 바로 시작해도 되는지에 대한 S2 판단
6. 필요 시 다른 lane으로 추가 WR을 발행했는지 여부

---

## S3 참고 메모

S3는 최근 Quality Gate hardening 후 strict hot11 full pipeline에서 clean PoC 기준까지 통과한 상태입니다. 다만 앞으로 통합 알파 e2e에서는 `completed`와 clean/security success를 반드시 분리해서 봐야 합니다.

- Deep clean pass: `completed + analysisOutcome=accepted_claims + qualityOutcome=accepted + cleanPass=true`
- PoC clean pass: `completed + pocOutcome=poc_accepted + qualityOutcome=accepted + cleanPass=true`

또한 현재 별도 S3→S4 WR로 enriched SCA library evidence contract를 요청해 둔 상태입니다. 이는 CVE requery 고도화용 후속 개선이며, pre-alpha connectivity check의 blocker로 보지는 않습니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
