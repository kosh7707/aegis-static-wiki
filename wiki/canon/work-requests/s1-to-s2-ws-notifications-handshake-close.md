---
title: "/ws/notifications 핸드셰이크 즉시 close 원인 확인 요청"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-ws-notifications-handshake-close"
last_verified: "2026-05-03"
service_tags: ["s1", "s2", "websocket", "notifications"]
decision_tags: ["ws-lifecycle", "handshake-failure"]
related_pages:
  - "wiki/canon/api/shared-models.md"
  - "wiki/canon/work-requests/s1-to-s2-ws-static-analysis.md"
migration_status: "canonicalized"
wr_id: "s1-to-s2-ws-notifications-handshake-close"
wr_kind: "question"
status: "open"
from_lane: "s1"
to_lanes: ["s2"]
registered_at: "2026-05-03T00:00:00.000Z"
---

# /ws/notifications 핸드셰이크 즉시 close 원인 확인 요청

- Kind: question
- From: s1
- To: s2

## Summary

브라우저 콘솔에서 `WebSocket connection to 'ws://localhost:5173/ws/notifications?projectId=proj-0be71b39-3be0-44a9-8838-5b903fdf688c' failed` 가 반복적으로 찍히고 있습니다. S1 프런트의 재연결 로직(`createReconnectingWs`)은 정상 동작하지만, **백엔드 핸드셰이크가 즉시 거부/close 되는 것으로 추정**되어 close 사유 확인을 요청합니다.

## Context

- 프런트 → `ws://localhost:5173/ws/notifications?projectId=…`
- Vite proxy(`/ws` → `ws://localhost:3000`, `ws:true`)를 경유 → 백엔드 `/ws/notifications` 핸들러로 전달
- `localhost:3000/health` 는 정상 응답 (`aegis-core-service` 200 OK)
- 즉, HTTP 백엔드는 살아있으나 WS 업그레이드 단계에서 실패
- S1 측 close code 4000(누락 구독키) 처리 로직은 `wsEnvelope.ts:173` 에 이미 존재 — 4000 close 시 `failed` 상태로 빠지고 재시도 중단

## Question

1. 현재 백엔드 인스턴스에서 `/ws/notifications` 핸들러가 정상 등록되어 있나요? (composition.ts:183 의 `WsBroadcaster<WsNotificationMessage>("/ws/notifications", "projectId", "notification")` 가 활성 인스턴스에 마운트되었는지)
2. `projectId=proj-0be71b39-3be0-44a9-8838-5b903fdf688c` 에 대해 **어떤 close code/사유로 reject 되는지** 확인 가능한가요? 4000(missing subscription key)인지, 권한 문제인지, 아니면 라우트 자체가 없어 404 업그레이드 실패인지 구분 필요.
3. 인증 쿠키/헤더가 핸드셰이크 단계에서 요구되는 상태라면, S1이 `getNotificationWsUrl()` 단계에서 추가로 전달해야 할 토큰/헤더가 있는지 알려주세요.

## Why This Matters

- **백엔드 핸들러 미등록 / 라우트 누락**: 계약 회복 필요 — S2 측 수정으로 즉시 해결
- **권한/구독키 누락**: S1이 `projectId` 외에 인증 컨텍스트(쿠키/JWT/세션)를 함께 보내야 함 — 계약 명세 보강 요청
- **의도된 거부(legacy)**: `/ws/notifications` 가 더 이상 운영 중이 아니라면, S1은 `useNotifications` 구독 코드를 제거하여 dead code 정리

세 분기 모두 답변에 따라 처리 방향이 다릅니다.

## S1 측 컨텍스트

- 호출 지점: `services/frontend/src/common/api/notifications.ts:33` — `getNotificationWsUrl(projectId)`
- 구독자: `NotificationContext` (전역) — 모든 페이지에서 영향
- 프런트는 close 사유에 따라 (a) 재연결 유지 / (b) 영구 실패 처리 / (c) 코드 제거 중 하나를 선택할 준비가 되어 있습니다.
