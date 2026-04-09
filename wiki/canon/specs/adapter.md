---
title: "Adapter 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/adapter.md"
last_verified: "2026-04-09"
service_tags: ["s6"]
decision_tags: []
related_pages: []
---

# Adapter 기능 명세

> ECU ↔ Backend 사이의 WebSocket 릴레이 서비스
> Express.js + ws 기반, 프로토콜 변환 계층

---

## 역할

Adapter는 ECU(또는 ECU Simulator / QEMU bridge)와 Backend(S2) 사이에서 CAN 프레임을 중계하는 **경량 릴레이**다.

```text
ECU Simulator / QEMU bridge ←—WS—→ Adapter ←—WS—→ Backend (S2)
        /ws/ecu (1:1)               :4000        /ws/backend (1:N)
```

- ECU 측: 단일 연결 (1대의 ECU만 연결 가능)
- Backend 측: 다중 연결 (N개의 S2 인스턴스 동시 연결 가능)
- 추후 실 ECU를 연결할 때 이 Adapter만 교체하면 된다

---

## 파일 구조

```text
services/adapter/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                       # 진입점: HTTP 서버 + WS 업그레이드 라우팅
    ├── relay.ts                       # 릴레이 코어: 메시지 라우팅, 타임아웃, 상태 관리
    ├── protocol.ts                    # 메시지 타입 정의
    ├── logger.ts                      # 구조화 로깅 (pino)
    ├── qemu-real-adapter-smoke-cli.ts # manifest-driven real adapter smoke CLI
    └── __tests__/integration/...      # 실제 WS 통합 테스트
```

---

## 실행

```bash
# 기본 (포트 4000)
cd services/adapter && npx tsx watch src/index.ts --port=4000

# 또는 전체 기동
./scripts/start.sh
```

| CLI 인자 | 기본값 | 설명 |
|---------|--------|------|
| `--port` | `4000` | HTTP/WebSocket 서버 포트 |

### 실험용 QEMU smoke

```bash
cd services/adapter
npm run qemu:smoke:sample
```

- sample ARMHF firmware + QEMU bridge + Adapter relay + backend WS client까지 한 번에 smoke 검증한다.
- smoke 입력은 sample manifest의 `smoke.cases[]`를 따른다.
- 2026-04-09 기준 이 명령은 **제품 기능이 아니라 runtime spike 검증용**이다.

---

## WebSocket 엔드포인트

### `/ws/ecu` — ECU 연결

- **연결 수**: 1 (새 ECU 연결 시 기존 연결은 정상 종료 code 1000)
- **방향**: ECU → Adapter (`can-frame`), Adapter → ECU (`inject-request`)
- ECU가 연결/해제되면 모든 Backend에 `ecu-status` 메시지 broadcast

### `/ws/backend` — Backend 연결

- **연결 수**: N (제한 없음)
- **방향**: Adapter → Backend (`can-frame`, `inject-response`, `ecu-status`, `ecu-info`), Backend → Adapter (`inject-request`)
- Backend 연결 시 현재 ECU 상태를 즉시 전송

---

## 메시지 프로토콜

모든 메시지는 **JSON 텍스트 프레임**.

### ECU → Adapter → Backend (broadcast)

```jsonc
{
  "type": "can-frame",
  "frame": {
    "timestamp": "2026-03-08T14:23:45.123Z",
    "id": "0x100",
    "dlc": 8,
    "data": "DE AD BE EF 01 02 03 04"
  }
}
```

### Backend → Adapter → ECU (unicast)

```jsonc
{
  "type": "inject-request",
  "requestId": "req-abc123",
  "frame": {
    "timestamp": "2026-03-08T14:23:45.123Z",
    "id": "0x7DF",
    "dlc": 8,
    "data": "02 01 00 00 00 00 00 00"
  }
}
```

### ECU → Adapter → Backend (unicast)

```jsonc
{
  "type": "inject-response",
  "requestId": "req-abc123",
  "response": {
    "success": true,
    "data": "DE AD BE EF 01 02 03 04",
    "error": null,
    "delayMs": 25
  }
}
```

**에러 종류** (`response.error`):

| 값 | 의미 |
|----|------|
| `null` | 정상 응답 |
| `"no_response"` | ECU 무응답 |
| `"reset"` | ECU 리셋 |
| `"malformed"` | 비정상 응답 형식 |
| `"delayed"` | 응답 지연 (`delayMs` 참조) |

### Adapter → Backend (broadcast, ECU 상태 변경 시)

```jsonc
{
  "type": "ecu-status",
  "status": "connected"
}
```

### ECU → Adapter → Backend (broadcast, ECU 연결 시)

```jsonc
{
  "type": "ecu-info",
  "ecu": {
    "name": "ECU_SIM",
    "canIds": ["0x100", "0x200", "0x300"]
  }
}
```

- ECU Simulator 또는 QEMU bridge가 연결 시 자신의 메타데이터를 전송
- Adapter가 저장 후 모든 Backend에 릴레이
- Backend 신규 연결 시에도 저장된 ECU 메타를 즉시 전송
- ECU 해제 시 메타 초기화

---

## Health 엔드포인트

```text
GET /health
```

```json
{
  "status": "ok",
  "ecu": {
    "connected": true,
    "name": "ECU_SIM",
    "canIds": ["0x100", "0x200", "0x300"]
  },
  "backends": 1
}
```

---

## 주입 요청 라우팅

```text
Backend B1 → inject-request(requestId: "req-123")
  ↓
Adapter: ECU 연결 확인
  ├─ 미연결 → 즉시 inject-response(error: "no_response") 반환
  └─ 연결됨 → ECU에 전달 + 타임아웃 등록 (5초)
      ↓
ECU → inject-response(requestId: "req-123")
  ↓
Adapter: requestId로 원래 요청한 B1 식별
  → B1에만 응답 전달 (unicast)
  → 타임아웃 해제
```

**타임아웃**: 5초 내 ECU 응답이 없으면 `error: "no_response"`로 자동 응답.

### 2026-04-09 QEMU smoke evidence

실험용 `qemu:smoke:sample` 경로에서 sample manifest의 smoke 정의를 사용해 실제로 다음이 검증되었다.

- `ecu-status`
- `ecu-info`
- telemetry `can-frame`
- `inject-response(req-hello)`
- `inject-response(req-exit)`
- Adapter 로그의 `elapsedMs` 0~1ms 수준 응답

이는 Adapter가 **manifest-driven QEMU bridge를 일반 ECU와 동일한 WS 계약**으로 처리할 수 있음을 보여준다.

---

## 상태 관리

| 상태 | 타입 | 설명 |
|------|------|------|
| `ecuWs` | `WebSocket \| null` | 현재 연결된 ECU (단일) |
| `_ecuMeta` | `{ name, canIds } \| null` | ECU 메타데이터 |
| `backendClients` | `Set<WebSocket>` | 연결된 Backend 목록 |
| `pendingRequests` | `Map<requestId, { timer, backendWs, startTime }>` | 진행 중인 주입 요청 |

모든 상태는 인메모리. Adapter 재시작 시 초기화된다.

---

## 연결 해제 처리

### ECU 연결 해제 시

1. `ecuWs = null`, `_ecuMeta = null`
2. 모든 Backend에 `ecu-status: disconnected` broadcast
3. 대기 중인 모든 inject 요청에 `error: "no_response"` 응답
4. `pendingRequests` 클리어

### Backend 연결 해제 시

1. `backendClients`에서 제거
2. 해당 Backend가 소유한 pending inject 요청 정리

---

## Backend 측 연결 클라이언트 (AdapterClient)

Backend의 `adapter-client.ts`가 Adapter에 WS 클라이언트로 연결한다.

| 설정 | 값 |
|------|---|
| 자동 재연결 | 3초 간격, 무한 재시도 |
| 연결 타임아웃 | 5초 |
| 주입 타임아웃 | 5초 |

- `connected`: Backend ↔ Adapter 연결 상태
- `ecuConnected`: Adapter로부터 수신한 ECU 상태 (`ecu-status`)
- 사용자가 명시적으로 disconnect하면 자동 재연결 비활성화

---

## 로깅

| 항목 | 값 |
|------|-----|
| 로그 파일 | `logs/adapter.jsonl` |
| 형식 | JSON structured (observability.md 준수) |
| 필수 필드 | `level`, `time` (epoch ms), `service` (`s6-adapter`), `msg` |
| 라이브러리 | pino |

주요 로그 이벤트:
- ECU 연결/해제
- Backend 연결/해제 (현재 수)
- ECU info 수신
- `→ inject-request → s6-ecu` (requestId, target)
- `← inject-response from s6-ecu` (requestId, target, elapsedMs)
- inject 타임아웃 (requestId, elapsedMs)

---

## 제약사항

- ECU 연결은 1개만 가능 (새 연결 시 기존 종료)
- 인증/인가 없음
- 잘못된 JSON은 debug 로그 후 무시
- 주입 타임아웃 5초 하드코딩
- 바이너리 프레임 미지원 (JSON 텍스트만)
- QEMU smoke 경로는 sample firmware 기반이며 제품화된 capability surface가 아님

---

## 관련 문서

- [Adapter WebSocket API](../api/adapter-api.md)
- [ECU Simulator 기능 명세](../specs/ecu-simulator.md)
- [공유 모델](../api/shared-models.md)
- [Observability 규약](../specs/observability.md)
- [S6 인수인계서](../handoff/s6/readme.md)
