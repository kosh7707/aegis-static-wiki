---
title: "S7 /health request-summary semantics — response to S3 rollout request"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request"
last_verified: "2026-04-13"
service_tags: ["s7", "s3"]
decision_tags: ["health", "timeout-policy", "ack-liveness", "contract"]
related_pages: ["wiki/canon/api/llm-gateway-api.md", "wiki/canon/specs/llm-gateway.md", "wiki/canon/work-requests/s3-to-s7-define-s7-health-request-summary-semantics-for-local-ack-control-rollout.md"]
migration_status: "canonicalized"
wr_id: "s7-to-s3-s7-health-request-summary-semantics-response-to-s3-rollout-request"
wr_kind: "reply"
status: "completed"
from_lane: "s7"
to_lanes: ["s3"]
completed_by: [{"lane":"s3","completed_at":"2026-04-13T11:49:50.261Z","note":"Initial S7 reply was incorporated together with the follow-up clarification into the canonical freeze artifact at wiki/canon/specs/health-control-signal-rollout-v1.md."}]
registered_at: "2026-04-13T11:31:45.118Z"
completed_at: "2026-04-13T11:49:50.261Z"
---

# S7 /health request-summary semantics — response to S3 rollout request

## Summary
- Kind: reply
- From: s7
- To: s3

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Reply to: define S7 /health request-summary semantics for local-ack control rollout

S3의 6개 항목에 대한 S7 응답입니다.

---

### 1. Minimum request-summary fields via `/health`

현재 `/health` 응답에 `requestSummary` 블록을 추가합니다:

```json
{
  "requestSummary": {
    "running": 2,
    "waiting": 0,
    "capacity": 4,
    "oldest": {
      "requestId": "gw-4d496e4c46d6",
      "taskType": "static-explain",
      "endpoint": "tasks",
      "elapsedMs": 18432,
      "phase": "llm-inference"
    }
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `running` | int | 현재 LLM semaphore 안에서 처리 중인 요청 수 (0~4) |
| `waiting` | int | semaphore 대기 중인 요청 수 |
| `capacity` | int | 총 동시 처리 가능 수 (`llm_concurrency`, 현재 4) |
| `oldest` | object? | running > 0일 때만 존재. 가장 오래된 in-flight 요청 정보 |
| `oldest.requestId` | string | 요청 ID |
| `oldest.taskType` | string? | `/v1/tasks` 요청이면 task type, `/v1/chat`이면 `null` |
| `oldest.endpoint` | string | `"tasks"` 또는 `"chat"` |
| `oldest.elapsedMs` | int | 요청 시작 이후 경과 시간 (ms) |
| `oldest.phase` | string | 현재 단계: `"queued"`, `"prompt-build"`, `"llm-inference"`, `"validation"` |

- running=0이면 `oldest`는 `null`
- 요청이 여러 건이면 가장 오래된 1건만 노출 (폴링 비용 최소화)

---

### 2. Local ack/progress sources S7 trusts

S7이 "이 요청이 살아있다"고 판단하는 근거:

| 소스 | 설명 |
|------|------|
| **httpx TCP connection alive** | LLM Engine과의 HTTP 연결이 유지되고 있음 (read timeout 600초) |
| **phase 전이** | 파이프라인 단계 전환 (prompt-build → llm-inference → validation) 자체가 진행 증거 |
| **Circuit Breaker CLOSED/HALF_OPEN** | 연속 장애 없음 = 인프라 수준 정상 |

S7은 현재 **비스트리밍** 방식으로 LLM Engine을 호출합니다. 따라서 `llm-inference` phase 동안에는 중간 토큰 수준의 ack가 없고, "TCP 연결 유지 + read timeout 미초과"가 유일한 liveness 신호입니다.

> 향후 스트리밍 전환 시 SSE chunk 수신을 추가 ack 소스로 사용 가능하나, 첫 롤아웃 범위에서는 제외합니다.

---

### 3. Backend reachable vs. request progress-capable

| 상태 | 조건 | `/health` 에서 판별 |
|------|------|---------------------|
| **backend reachable** | `llmBackend.status == "ok"` | LLM Engine `/health` 200 응답 |
| **request progress-capable** | reachable AND `circuitBreaker.state != "open"` AND `requestSummary.running < capacity` | 새 요청을 즉시 처리 시작할 수 있는 상태 |

- `running == capacity`이면 reachable이지만 새 요청은 semaphore 대기 → "reachable but saturated"
- CB OPEN이면 reachable이어도 요청 즉시 503 → "reachable but circuit-broken"
- 폴링 호출자 판별 로직: `llmBackend.status == "ok" AND circuitBreaker.state != "open"` → progress-capable

---

### 4. Blocked / ack-break conditions → upper caller should abort

상위 폴링 호출자가 abort해야 하는 조건:

| 조건 | 판별 | 의미 |
|------|------|------|
| `circuitBreaker.state == "open"` | CB 연속 장애 감지 | LLM Engine 체계적 장애. 새 요청 불가, 기존 요청도 실패 가능성 높음 |
| `llmBackend.status != "ok"` | LLM Engine 연결 불가 | 인프라 수준 장애 |
| `oldest.elapsedMs > callerExpectedMaxMs` | 호출자가 정한 예상 최대 시간 초과 | S7은 이 임계값을 강제하지 않음 — 호출자(S3)가 자체 판단 |

**S7이 하지 않는 것:**
- S7은 글로벌 stall threshold를 설정하지 않음 (합의된 정책 방향과 일치)
- `oldest.elapsedMs`를 보고만 하고, abort 판단은 폴링 호출자가 함
- S7의 read timeout(600초)에 도달하면 S7 자체가 `504 + TIMEOUT`으로 실패 처리하고 CB에 기록

---

### 5. Backward-compatibility

**호환성 문제 없습니다.**

- `requestSummary`는 기존 필드(`circuitBreaker`, `llmBackend`, `rag`, `llmConcurrency` 등)와 독립된 새 top-level 블록
- 기존 필드는 변경/제거 없이 그대로 유지
- `llmConcurrency`(기존)와 `requestSummary.capacity`(신규)는 같은 값이지만, `llmConcurrency`는 설정값, `capacity`는 런타임 컨텍스트에서의 의미이므로 양쪽 모두 유지
- JSON 소비자가 알지 못하는 필드를 무시하면 기존 클라이언트에 영향 없음

---

### 6. Polling cadence and interpretation

| 항목 | 권장 |
|------|------|
| **폴링 주기** | 5~10초 (vLLM 엔진 통계가 10초 주기이므로 이보다 빈번할 필요 없음) |
| **첫 롤아웃 최소 주기** | 3초 (이보다 빈번하면 health 엔드포인트 자체가 노이즈) |
| **해석 주의사항** | `oldest.elapsedMs`는 폴링 시점의 스냅샷. 두 번 연속 같은 `requestId`가 보이면 해당 요청이 지속 중인 것. `requestId`가 바뀌었으면 이전 요청은 완료된 것 |
| **phase 해석** | `llm-inference`가 가장 긴 구간 (통상 5~120초). `prompt-build`와 `validation`은 수 ms이므로 이 phase가 지속 관측되면 정상 |
| **burst 시나리오** | `running == capacity AND waiting > 0`이 지속되면 부하 포화. 상위에서 새 요청 보류 판단 가능 |

---

### Implementation note

구현 시 S7 내부에 in-flight request tracker(dict)를 추가하여 `requestId`, `startTime`, `phase`, `endpoint`, `taskType`을 관리합니다. `/health` 호출 시 이 tracker에서 스냅샷을 생성합니다. 경량 구조이며 기존 파이프라인/라우터 로직 변경 최소화됩니다.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
