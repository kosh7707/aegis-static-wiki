---
title: "S6. Dynamic Analysis 인수인계서"
page_type: "canonical-handoff"
canonical: true
source_refs:
  - "docs/s6-handoff/README.md"
last_verified: "2026-04-09"
service_tags: ["s6"]
decision_tags: []
related_pages: []
---

# S6. Dynamic Analysis 인수인계서

> **반드시 `docs/AEGIS.md`를 먼저 읽을 것.** 프로젝트 공통 제약 사항, 역할 정의, 소유권이 그 문서에 있다.
> 이 문서는 S6(Dynamic Analysis) 개발을 이어받는 다음 세션을 위한 인수인계서다.
> 이것만 읽으면 현재 상태를 파악하고 바로 작업을 이어갈 수 있어야 한다.
> **마지막 업데이트: 2026-04-09**

---

## 1. S6의 역할

AEGIS 플랫폼의 **동적 분석 인프라**를 담당한다. ECU와의 CAN 통신을 시뮬레이션하고, S2(AEGIS Core)가 동적 분석/동적 테스트를 수행할 수 있도록 CAN 프레임 중계 인프라를 제공한다.

### 소유 서비스

| 서비스 | 디렉토리 | 포트 | 역할 |
|--------|----------|------|------|
| **Adapter** | `services/adapter/` | :4000 | ECU ↔ Backend WS 릴레이 |
| **ECU Simulator** | `services/ecu-simulator/` | standalone | CAN 트래픽 생성 + 주입 응답 시뮬레이션 + 실험용 QEMU bench |

### 통신 구조

```text
ECU Simulator / QEMU bridge ──WS──→ Adapter (:4000/ws/ecu)
                                     ↕
                                S2 (AEGIS Core :3000) ──WS──→ Adapter (:4000/ws/backend)
```

- ECU Simulator / QEMU bridge → Adapter: 1:1 연결 (CAN frame / inject-response 전송)
- S2 → Adapter: N:1 연결 (CAN frame 수신 + inject-request)
- 추후 실 ECU 연결 시 simulator/bridge 대신 실 ECU 또는 실행 plane이 Adapter에 연결될 수 있다.

### Codex / OMX 운영 메모

- 하드 가드레일 재확인:
  - S6는 **다른 서비스 코드를 읽지 않는다**.
  - 다른 서비스와의 소통은 **WR로만** 한다.
  - 연동 판단은 API 계약서만 보고, 계약이 비었거나 낡았으면 담당자에게 WR을 보낸다.
  - **커밋은 하지 않는다**. 커밋은 S2 세션만 한다.
  - `scripts/start*.sh`, `scripts/stop*.sh`, 서비스 기동 명령은 **사용자 허락 없이 실행하지 않는다**.
  - 로그/장애 분석은 `log-analyzer` MCP를 우선 사용한다.
- 장기 S6 작업 메모와 후속 세션 인계는 `$note`와 `.omx` 메모리를 사용한다.
- **`$ralph`**: 프로토콜 안정화, 시뮬레이터 시나리오 확장, Adapter/ECU 테스트 보강, QEMU spike 정리처럼 한 lane이 끝까지 완주해야 하는 작업에 우선 사용한다.

---

## 2. 소유 파일

### 코드
- `services/adapter/src/` — index.ts, relay.ts, protocol.ts, logger.ts, `qemu-real-adapter-smoke-cli.ts`
- `services/ecu-simulator/src/` — index.ts, ecu-engine.ts, scenarios.ts, traffic-generator.ts, protocol.ts, logger.ts
- `services/ecu-simulator/src/` (QEMU spike) — `qemu-bench.ts`, `qemu-runtime.ts`, `qemu-bridge.ts`, `qemu-bench-cli.ts`, `qemu-probe-cli.ts`, `qemu-adapter-bridge-cli.ts`, `qemu-bridge-smoke-cli.ts`
- `services/ecu-simulator/qemu/` — sample firmware, manifest, docker toolchain 정의

### 문서
- `docs/specs/adapter.md` — Adapter 기능 명세 (S6 소유)
- `docs/specs/ecu-simulator.md` — ECU Simulator 기능 명세 (S6 소유)
- `docs/api/adapter-api.md` — Adapter WS API 계약서 (S6 소유)
- `docs/s6-handoff/README.md` — 이 인수인계서

### 인프라
- `services/adapter/.env` — Adapter 환경변수 (S6 관리)
- `services/ecu-simulator/.env` — ECU Simulator 환경변수 (S6 관리)
- `scripts/start-adapter.sh` — Adapter 기동 스크립트
- `scripts/start-ecu-sim.sh` — ECU Simulator 기동 스크립트

---

## 3. 현재 구현 상태

### Adapter (`services/adapter/`)
- Express.js + ws 기반 경량 릴레이
- ECU 측 WS: `/ws/ecu` (1:1)
- Backend 측 WS: `/ws/backend` (1:N)
- CAN frame 양방향 중계
- ECU 메타데이터(`ecu-info`) 수신 시 Backend에 전파
- inject-request / inject-response 요청-응답 패턴 (`requestId`, `target`, `elapsedMs` 구조화 로깅)
- 구조화 로깅 (pino, `logs/adapter.jsonl`, service: `s6-adapter`)
- **실험용 real adapter smoke CLI 추가**: QEMU bridge가 실제 relay를 통과하는지 확인 가능

### ECU Simulator (`services/ecu-simulator/`)
- Adapter의 `/ws/ecu`에 WS 클라이언트로 연결
- 시나리오 기반 CAN 트래픽 생성 (`mixed`, `normal`)
- 주입 응답 규칙: 0xFF→no_response, 0x7DF→reset, 0x00→malformed, 반복3회→malformed, 경계값→delayed(2000ms)
- CLI 옵션: `--adapter`, `--scenario`, `--ecu-name`, `--speed`, `--loop`
- 구조화 로깅 (pino, `logs/ecu-simulator.jsonl`, service: `s6-ecu`)

### QEMU runtime spike (`services/ecu-simulator/qemu`, `src/qemu-*`)
- sample ARMHF firmware(`sample-ecu.c`)를 freestanding ELF로 빌드
- host compile fallback: cross gcc가 없으면 `clang-18 + rust-lld` 경로 사용
- PATH에 QEMU가 없으면 `apt download qemu-user-static`로 userland staging
- `qemu-adapter-bridge-cli.ts`가 firmware stdout/stdin을 Adapter WS 계약으로 변환
- mock WS smoke + **실제 Adapter smoke**까지 검증 완료

### 테스트 / 검증 (2026-04-09)
- Adapter: 단위+계약+통합 **52 tests passed**
- Adapter: `npx tsc --noEmit` 통과
- Adapter: `npm run qemu:smoke:sample` 통과
- ECU Simulator: 단위+계약+QEMU helper/integration **37 tests passed**
- ECU Simulator: `npx tsc --noEmit` 통과
- ECU Simulator: `npm run qemu:probe:sample`, `npm run qemu:smoke:sample` 통과

실제 smoke evidence 핵심:
- Adapter 경로에서 `ecu-info`, `can-frame`, `inject-response(req-1)`, `inject-response(req-2)` 확인
- decode 결과:
  - `[ack] qemu-sample`
  - `[shutdown] qemu-sample bye`

---

## 4. 환경변수

| 서비스 | .env 위치 | 주요 변수 |
|--------|----------|----------|
| Adapter | `services/adapter/.env` | `PORT`, `LOG_DIR`, `LOG_LEVEL` |
| ECU Simulator | `services/ecu-simulator/.env` | `ADAPTER_URL`, `SCENARIO`, `SPEED`, `LOG_DIR`, `LOG_LEVEL` |

QEMU spike는 현재 `.env`에 별도 영속 설정을 추가하지 않고 CLI 인자로만 제어한다.

---

## 5. Observability

`docs/specs/observability.md` 준수.

| 서비스 | service 식별자 | 로그 파일 |
|--------|---------------|----------|
| Adapter | `s6-adapter` | `logs/adapter.jsonl` |
| ECU Simulator | `s6-ecu` | `logs/ecu-simulator.jsonl` |

WebSocket 통신에서는 HTTP 헤더 대신 메시지 payload의 `requestId`로 요청을 추적한다 (`inject-request` / `inject-response`).

Adapter의 inject 로그에는 `target`, `elapsedMs`가 포함되며, QEMU bridge smoke에서도 `elapsedMs: 1` 수준 응답이 확인되었다.

---

## 6. S2와의 관계

- **S2가 Adapter를 호출하는 쪽이다.** S2의 `AdapterManager` → `AdapterClient`가 Adapter에 WS로 연결한다.
- S6는 Adapter/ECU Simulator/QEMU bridge의 **내부 구현**을 소유하고, S2는 **호출자**이다.
- Adapter의 WS 프로토콜을 변경하면 S2에 영향이 있으므로 **반드시 work-request로 고지**한다.
- `docs/api/adapter-api.md`가 S2↔S6 간 WS 프로토콜의 유일한 진실 소스다.

> 경계 메모: 2026-04-09 기준 QEMU 경로는 **S6의 제품화된 capability**가 아니라, 미래 execution/runtime plane을 탐색하기 위한 runtime spike다. 현재 stable contract는 여전히 Adapter WS 계약이다.

---

## 7. 로드맵

→ **[roadmap.md](roadmap.md)** 참조

---

## 8. 참고 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| 공통 제약 사항 | `docs/AEGIS.md` | **필독** |
| Adapter WS 계약서 | `docs/api/adapter-api.md` | S2↔S6 WS 프로토콜 유일한 진실 소스 |
| Adapter 명세 | `docs/specs/adapter.md` | S6 소유 |
| ECU Simulator 명세 | `docs/specs/ecu-simulator.md` | S6 소유 |
| S2 백엔드 명세 | `docs/specs/backend.md` | 동적 분석 파이프라인 상세 |
