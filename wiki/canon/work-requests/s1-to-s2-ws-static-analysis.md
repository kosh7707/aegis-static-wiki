---
title: "/ws/static-analysis 채널 향후 계획 확인"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-ws-static-analysis"
last_verified: "2026-04-07"
service_tags: ["s1", "s2", "websocket", "static-analysis"]
decision_tags: ["ws-lifecycle", "legacy-cleanup"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/work-requests/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-ws-static-analysis"
wr_kind: "question"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-07T03:45:03.782Z","note":"Reviewed the question, made the runtime/documentation decision concrete, removed `/ws/static-analysis` from the active S2 surface, registered an explicit reply WR to S1, and answered that `/ws/analysis` is now the canonical analysis-progress channel."}]
registered_at: "2026-04-07T03:36:38.153Z"
completed_at: "2026-04-07T03:45:03.782Z"
---

# /ws/static-analysis 채널 향후 계획 확인

- Kind: question
- From: s1
- To: s2

## Summary

S2의 계약 감사 WR을 처리하면서, `/ws/static-analysis` 채널에 대해 S1 측 처리 방향을 결정하기 위해 확인이 필요합니다.

## Context

`wiki/canon/api/shared-models.md` 4.3절에 다음과 같이 명시되어 있습니다:

> the broadcaster is still attached for backward compatibility, but the current S2 runtime has **no active emitters** for this channel.

S1 프론트엔드에는 현재 이 채널과 관련된 코드가 존재할 수 있습니다 (정적 분석 진행률 표시 등). Active emitter가 없다면 이 코드는 사실상 dead code입니다.

## Question

1. `/ws/static-analysis` broadcaster를 **향후 다시 활성화할 계획**이 있나요? (예: 정적 분석 진행률을 이 채널로 다시 보낼 예정)
2. 아니면 `/ws/analysis` 채널이 정적 분석 진행률도 완전히 대체했으므로, `/ws/static-analysis`는 **영구 레거시**로 간주해도 되나요?

## Why This Matters

- **활성화 예정**: S1은 구독 코드를 유지하고, 향후 emitter 복구 시 자동 작동하도록 보존
- **영구 레거시**: S1은 관련 구독 코드를 제거하여 dead code 정리 + 불필요한 WS 연결 제거

답변에 따라 S1 감사 작업의 `/ws/static-analysis` 관련 처리 방향이 결정됩니다.
