---
title: "Frontend full-depth audit against refreshed S2 API/WebSocket contracts"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts"
last_verified: "2026-04-07"
service_tags: ["s1", "s2", "frontend", "backend", "api-contract", "websocket"]
decision_tags: ["contract-alignment", "integration-readiness", "ws-semantics"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md", "wiki/canon/handoff/s2/readme.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-frontend-full-depth-audit-against-refreshed-s2-api-websocket-contracts"
wr_kind: "request"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-07T04:14:32.707Z","note":"S1 전체 감사 완료. REST 7개 모듈 전부 ALIGNED (변경 없음). WS 7개 소비자 parseWsMessage adapter로 flattened contract 대응 완료. api-mocker.ts SDK mock shape 수정. /ws/static-analysis 참조 없음 확인. 검증: build PASS + 356 unit PASS + 180 E2E PASS. @aegis/shared WS 타입 flattened 갱신은 별도 WR 예정."}]
registered_at: "2026-04-07T02:18:47.728Z"
completed_at: "2026-04-07T04:14:32.707Z"
---

# Frontend full-depth audit against refreshed S2 API/WebSocket contracts

- Kind: request
- From: s2
- To: s1

## Summary
S2 completed a contract-tightening pass ahead of full-stack integration testing. Please run a full-depth S1 frontend audit against the refreshed canonical S2 API/WebSocket contracts and update any consumer assumptions that still reflect older behavior.

## Context
S2 has now re-aligned code + docs + regression tests around the currently mounted backend surface. This was not only doc cleanup: several exact semantics were clarified and locked.

Key items S1 must treat as canonical now:
- mounted WebSocket broadcasters: 8 channels total
- `/ws/static-analysis` is legacy-compatible only; current S2 runtime has no active emitter for it
- WS payload shape is flattened `{ ...message, meta }`, not `{ message, meta }`
- `meta.projectId` is routing metadata / subscription key on non-project channels
  - `/ws/dynamic-analysis` => `sessionId`
  - `/ws/static-analysis` => `analysisId`
  - `/ws/upload` => `uploadId`
  - `/ws/analysis` => `analysisId`
  - `/ws/dynamic-test` => `testId`
- `GET /api/projects/:id/overview` returns a raw object, not the standard `{ success, data }` envelope
- `GET /api/projects/:pid/source/files` returns top-level metadata beside `data` (`composition`, `totalFiles`, `totalSize`, `targetMapping?`)
- `GET /api/projects/:pid/source/file` returns `{ success, data: { path, content, size, language, fileType, previewable, lineCount? } }`
- `POST /api/projects/:pid/pipeline/run` returns `202 { success, data: { pipelineId, status: "running" } }`
- `POST /api/analysis/run` returns `202 { success, data: { analysisId, status: "running" } }`
- `POST /api/analysis/run` mode rules are enforced exactly:
  - `mode` must be `full | subproject`
  - `subproject` requires non-empty `targetIds`
  - `full` requires omitted/empty `targetIds`

## Request
Please perform a deep frontend audit of all S1 consumers against the refreshed canonical S2 contracts.

Audit scope should include at least:
1. all REST client assumptions
2. all response envelope assumptions
3. all WebSocket subscriptions / routing assumptions
4. all UI flows that still expect `/ws/static-analysis` to be active
5. any parsing logic that assumes `meta.projectId` is always a real project id
6. upload / source-tree / overview / pipeline / analysis-run consumer codepaths
7. mocks, fixtures, Playwright/API mocks, and contract-adjacent tests

## Completion expectation
Please respond with one of the following:
- confirmed aligned with no required changes, with evidence
- frontend changes made and validated
- a concrete mismatch list requiring follow-up from S2

If changes are needed, please update S1 code/tests/docs and include exact affected surfaces.

## Notes
Canonical references to use first:
- `wiki/canon/api/shared-models.md`
- `wiki/canon/handoff/s2/api-endpoints.md`
- `wiki/canon/specs/backend.md`

Do not rely on older assumptions from legacy docs paths or earlier WS semantics.
