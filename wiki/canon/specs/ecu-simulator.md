---
title: "ECU Simulator 기능 명세"
page_type: "canonical-spec"
canonical: true
source_refs:
  - "docs/specs/ecu-simulator.md"
last_verified: "2026-04-09"
service_tags: ["s6"]
decision_tags: []
related_pages: []
---

# ECU Simulator 기능 명세

> 가상 ECU — CAN 트래픽 생성 + 주입 응답 시뮬레이션
> Adapter의 `/ws/ecu` 엔드포인트에 WS 클라이언트로 연결

---

## 역할

ECU Simulator는 실제 ECU 대신 CAN 트래픽을 생성하고, Backend의 주입 요청에 시나리오 기반으로 응답하는 **테스트용 가상 ECU**다.

```text
ECU Simulator —WS→ Adapter (:4000/ws/ecu)
                      ↓
               Backend (S2)가 CAN 프레임 수신 + 주입 요청 전송
```

추후 실 ECU를 연결하면 이 시뮬레이터 대신 실 ECU가 Adapter에 연결된다.

---

## 파일 구조

```text
services/ecu-simulator/
├── package.json
├── tsconfig.json
├── qemu/
│   ├── docker/toolchain.Dockerfile         # 실험용 QEMU toolchain image 정의
│   ├── firmware/sample-ecu.c               # ARMHF sample firmware
│   ├── manifests/sample-armhf-user.json    # QEMU bench manifest
│   └── out/.gitkeep
└── src/
    ├── index.ts                            # 기존 시나리오 기반 진입점
    ├── protocol.ts                         # 메시지 타입 정의
    ├── ecu-engine.ts                       # 주입 요청 처리 (응답 규칙)
    ├── scenarios.ts                        # CAN 트래픽 시나리오 정의
    ├── traffic-generator.ts                # 비동기 프레임 생성기
    ├── qemu-bench.ts                       # manifest 해석 + compile/run/smoke config helper
    ├── qemu-runtime.ts                     # host compile + qemu staging/runtime helper
    ├── qemu-bridge.ts                      # stdout/stdin ↔ WS payload 변환 helper
    ├── qemu-bench-cli.ts                   # 계획 출력 CLI
    ├── qemu-probe-cli.ts                   # host-side QEMU probe CLI
    ├── qemu-adapter-bridge-cli.ts          # QEMU firmware ↔ Adapter bridge CLI
    ├── qemu-bridge-smoke-cli.ts            # manifest-driven mock WS smoke CLI
    └── logger.ts                           # 구조화 로깅 (pino)
```

---

## 실행

### 기존 시나리오 기반 simulator

```bash
cd services/ecu-simulator && npx tsx watch src/index.ts \
  --adapter=ws://localhost:4000/ws/ecu --scenario=mixed --speed=1 --loop
```

| CLI 인자 | 기본값 | 설명 |
|---------|--------|------|
| `--adapter` | `ws://localhost:4000/ws/ecu` | Adapter WS URL |
| `--scenario` | `mixed` | 시나리오 이름 (`mixed`, `normal`) |
| `--ecu-name` | `ECU_SIM` | ECU 식별자 (ecu-info 메시지에 포함) |
| `--speed` | `1` | 속도 배율 (높을수록 빠름) |
| `--loop` | `false` (플래그) | 시나리오 무한 반복 |

### 실험용 QEMU bench

```bash
cd services/ecu-simulator
npm run qemu:plan:sample
npm run qemu:probe:sample
npm run qemu:smoke:sample
```

- `qemu:plan:sample`: host/docker compile·run 명령 계획 출력
- `qemu:probe:sample`: ARMHF sample firmware를 host에서 빌드 후 staged `qemu-arm-static`로 실행
- `qemu:smoke:sample`: manifest에 정의된 `smoke.cases[]`를 사용해 mock Adapter WS smoke 검증

> 2026-04-09 기준 이 bench는 **runtime spike**다. 실제 ECU/실 firmware를 대체하는 제품 표면은 아니며, linux-user QEMU + sample firmware + WS bridge 검증에 한정된다.

---

## 연결 시 ECU 메타 전송

Adapter에 연결되면 트래픽 생성 **전에** `ecu-info` 메시지를 전송한다.

```jsonc
{
  "type": "ecu-info",
  "ecu": {
    "name": "ECU_SIM",
    "canIds": ["0x100", "0x200", "0x300", "0x500"]
  }
}
```

- `name`: `--ecu-name` CLI 인자 (기본값 `ECU_SIM`)
- `canIds`: 현재 시나리오의 모든 phase → steps에서 `canId`를 추출하고 중복 제거
- QEMU bridge 경로에서는 현재 telemetry CAN ID 기본값 `0x700` 하나를 광고한다.

---

## 세 가지 기능

### 1. CAN 트래픽 생성 (자동, 시나리오 기반)

시나리오에 정의된 CAN 프레임을 일정 간격으로 생성하여 Adapter에 전송한다.

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

**프레임 간격**: `max(10, round(50 / speed))` ms

| speed | 간격 | 초당 프레임 |
|-------|------|------------|
| 1 | 50ms | ~20fps |
| 2 | 25ms | ~40fps |
| 5 | 10ms | ~100fps |

### 2. ECU 메타 전송 (자동, 연결 시 1회)

위 "연결 시 ECU 메타 전송" 섹션 참조.

### 3. 주입 응답 (수동, Backend 요청에 반응)

Backend가 동적 테스트 중 `inject-request`를 보내면, ECU Engine 또는 QEMU bridge가 응답한다.

```text
Backend → inject-request → Adapter → ECU Simulator / QEMU bridge
                                         ↓
                               EcuEngine 또는 firmware stdin 전달
                                         ↓
ECU Simulator / QEMU bridge → inject-response → Adapter → Backend
```

---

## 주입 응답 규칙 (EcuEngine)

모든 요청에 기본 지연 10~50ms (랜덤)를 적용한 뒤, 아래 규칙을 **순서대로** 매칭한다.

| 우선순위 | 조건 | 응답 | 용도 |
|---------|------|------|------|
| 1 | 데이터가 모두 `0xFF` (8바이트) | `success: false, error: "no_response"` | 크래시/ECU 무응답 시뮬레이션 |
| 2 | CAN ID = `0x7DF` 또는 `7DF` | `success: false, error: "reset"` | 진단 요청 → ECU 리셋 |
| 3 | 데이터가 모두 `0x00` (8바이트) | `success: true, error: "malformed"` | 비정상 응답 형식 |
| 4 | 동일 프레임 3회 이상 반복 | `success: true, error: "malformed"` | 리플레이 공격 탐지 |
| 5 | 데이터에 `0x7F` 또는 `0x80` 포함 | `success: true, error: "delayed", delayMs: 2000` | 경계값 → 지연 응답 |
| 6 | 그 외 | `success: true, data: "랜덤 8바이트 hex"` | 정상 응답 |

**반복 프레임 추적**: `${canId}:${data}` 시그니처별 카운터 관리. 3회 이상 동일 프레임 수신 시 `malformed` 반환.

---

## QEMU bridge 동작 (실험)

2026-04-09 기준 sample bench의 의미론은 다음과 같다.

- sample firmware는 ARMHF freestanding ELF로 빌드된다.
- firmware stdout 한 줄은 QEMU bridge에서 telemetry `can-frame` 또는 `inject-response` payload로 변환된다.
- `inject-request.frame.data`는 hex → ascii로 복원되어 firmware stdin에 전달된다.
- manifest의 `smoke` 섹션이 smoke ECU 이름과 요청 케이스를 정의한다.
- 현재 sample manifest의 smoke 케이스는:
  - `req-hello` → `hello`
  - `req-exit` → `exit`
- bridge smoke 결과에서 각각 다음 응답이 검증되었다.
  - `[ack] qemu-sample`
  - `[shutdown] qemu-sample bye`

이 경로는 **실제 firmware execution plane의 축소판**이지, 제품 API 안정화가 끝난 표면은 아니다.

---

## 시나리오

### `mixed` (기본값) — 정상 + 공격 혼합

총 500 프레임, 7개 페이즈:

| 페이즈 | 이름 | 프레임 수 | CAN ID | 설명 |
|--------|------|----------|--------|------|
| 1 | Normal traffic | 100 | 0x100~0x500 | 랜덤 페이로드 정상 트래픽 |
| 2 | Diagnostic DoS | 50 | 0x7DF | burst=10, 진단 요청 폭주 |
| 3 | Normal recovery | 50 | 0x100~0x500 | 공격 후 정상 트래픽 복원 |
| 4 | Unauthorized ID | 50 | 0x100~0x500 + `0x666` | 비인가 CAN ID 삽입 |
| 5 | Normal traffic | 100 | 0x100~0x500 | 정상 트래픽 |
| 6 | Replay attack | 50 | 0x100 | 고정 페이로드 `DE AD BE EF 01 02 03 04` 반복 |
| 7 | Normal finish | 100 | 0x100~0x500 | 마무리 정상 트래픽 |

### `normal` — 정상 트래픽만

| 페이즈 | 이름 | 프레임 수 | CAN ID | 설명 |
|--------|------|----------|--------|------|
| 1 | Normal traffic | 500 | 0x100~0x500 | 랜덤 페이로드만 |

---

## 자동 재연결

기존 simulator는 Adapter와의 연결이 끊기면 **3초 후** 자동 재연결을 시도한다. QEMU bridge CLI는 현재 단일 세션 smoke/실험용이며, 장기 재연결 정책은 정식 표면으로 고정하지 않았다.

---

## 로깅

| 항목 | 값 |
|------|-----|
| 로그 파일 | `logs/ecu-simulator.jsonl` |
| 형식 | JSON structured (observability.md 준수) |
| 필수 필드 | `level`, `time` (epoch ms), `service` (`s6-ecu`), `msg` |
| 라이브러리 | pino |

주요 로그 이벤트:
- Adapter 연결/해제
- `ecu-info` 전송
- phase 시작 (이름, 프레임 수)
- 트래픽 진행 (100프레임 단위)
- inject-request 수신 및 처리
- inject-response 전송 (requestId, success)
- QEMU bridge stdin/stdout line 처리

---

## 검증 메모 (2026-04-09)

- `services/ecu-simulator`: `npm test` **38 passed**
- `services/ecu-simulator`: `npx tsc --noEmit` 통과
- `npm run qemu:probe:sample` 통과
- `npm run qemu:smoke:sample` 통과
- manifest-driven smoke 결과:
  - `ecuInfo.ecu.name = QEMU_SAMPLE_MANIFEST`
  - `firstResponse.requestId = req-hello`
  - `secondResponse.requestId = req-exit`
  - decode 결과:
    - `[ack] qemu-sample`
    - `[shutdown] qemu-sample bye`

---

## 제약사항

- 단일 Adapter에만 연결 (멀티 Adapter 미지원)
- 반복 프레임 카운터가 자동 초기화되지 않음 (프로세스 재시작 필요)
- 시나리오 2개만 제공 (`mixed`, `normal`)
- 기존 simulator는 바이너리 CAN 프레임이 아닌 hex 문자열을 사용
- QEMU bench는 아직 sample firmware + linux-user QEMU + staged `qemu-user-static`에 한정됨
- Docker 계획은 생성되지만, 2026-04-09 현재 이 환경에서는 `docker` 미설치로 실제 build/run 검증은 미완료
