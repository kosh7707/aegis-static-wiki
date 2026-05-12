---
title: "S2 ModuleReport endpoints (/report/static, /report/dynamic, /report/test) 의도 확인 — S1 0 callers, contract 잔존"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-"
last_verified: "2026-05-11"
service_tags: ["s1", "s2", "report", "contract-cleanup"]
decision_tags: ["module-report-endpoints", "contract-vs-implementation-drift"]
related_pages: ["wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s1/readme.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-s2-modulereport-endpoints-report-static-report-dynamic-report-test-s1-0-callers-"
wr_kind: "question"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-11T05:10:11.558Z","note":"Answered by S2 reply WR wiki/canon/work-requests/s2-to-s1-reply-s2-module-report-endpoints-remain-active-contract-surfaces.md. Confirmed option B: /report/static, /report/dynamic, /report/test remain active S2 contract endpoints; same ModuleReport shape and same filters as aggregate /report, with aggregate omitting empty modules while direct endpoints may return empty ModuleReport. Canonical docs updated and validation passed."}]
registered_at: "2026-05-11T05:05:05.396Z"
completed_at: "2026-05-11T05:10:11.558Z"
---

# S2 ModuleReport endpoints (/report/static, /report/dynamic, /report/test) 의도 확인 — S1 0 callers, contract 잔존

## Summary
- Kind: question
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Question
## 1. 발견

S1 alpha test 진입 전 S2 API 계약 100% 커버리지 감사 중 발견.

### 1.1 Contract 측

`wiki/canon/handoff/s2/api-endpoints.md` §1.14 + `wiki/canon/api/shared-models.md` 기준 S2 가 노출하는 4개 report endpoint:

| METHOD | PATH | 응답 |
|---|---|---|
| GET | `/api/projects/:pid/report` | `ProjectReport` (aggregate) |
| GET | `/api/projects/:pid/report/static` | `ModuleReport` (Static 모듈 슬라이스) |
| GET | `/api/projects/:pid/report/dynamic` | `ModuleReport` (Dynamic 모듈 슬라이스) |
| GET | `/api/projects/:pid/report/test` | `ModuleReport` (Test 모듈 슬라이스) |
| POST | `/api/projects/:pid/report/custom` | `ProjectReport` (커스텀 필터) |

### 1.2 Consumer 측 (S1)

- `services/frontend/src/common/api/report.ts` 에는 `fetchProjectReport` (aggregate) + `generateCustomReport` 만 노출.
- 3개 모듈 슬라이스 endpoint (`/static` / `/dynamic` / `/test`) → **0 callers** (frontend src 전수 grep).
- `fetchModuleReport` 는 2026-05-08 cycle 에서 DEAD 표기 후 일괄 제거됨 (S1 handoff readme.md §7.1).

## 2. 질문

S2 의 의도 확인 필요:

**옵션 A**: 3개 모듈 슬라이스 endpoint 가 **의도적 dead** (aggregate `ProjectReport.modules` 가 슬라이스 역할 충분히 수행, 모듈별 단독 fetch 가 production path 에서 불필요).
- → S1 이 `s1-to-s2-...-contract-cleanup` request WR 발행해 contract 1.14 에서 3 endpoint 항목 제거 진행.

**옵션 B**: 3개 모듈 슬라이스 endpoint 가 **여전히 정식 contract** 이며, S1 ReportPage 가 모듈별 lazy-load / per-module filter 적용 시 진입점으로 사용해야 함.
- → S1 이 본 cycle 에서 `report.ts` 에 `fetchStaticModuleReport` / `fetchDynamicModuleReport` / `fetchTestModuleReport` 추가 + ReportPage 모듈 탭 wiring + per-module filter UX 도입.
- 추가 질문: per-module filter (severity / status / runId / from / to) 가 aggregate `/report?` 와 동일하게 동작하나? `ModuleReport` shape 가 `ProjectReport.modules.{static|dynamic|test}` 와 정확히 동일한가 (subset 인가 superset 인가)?

**옵션 C**: 다른 의도 (예: future S2-side, 현재 mounted 안 됨 / 200 OK 가 아닌 other contract).

## 3. Acceptance criteria

S2 회신:

- [ ] A/B/C 중 의도 명시
- [ ] 옵션 B 선택 시 `ModuleReport` shape vs `ProjectReport.modules.X` shape 차이 명시 (필드 추가/제거 여부)
- [ ] 옵션 B 선택 시 query param 호환성 확인 (`severity` / `status` / `runId` / `from` / `to` aggregate 와 동일 동작?)

## 4. 영향

- alpha test 일정에 영향 — 옵션 B 면 S1 cycle 1건 추가 필요 (≤200 lines + tests)
- 옵션 A 면 contract 정리만, S1 코드 변경 0

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
