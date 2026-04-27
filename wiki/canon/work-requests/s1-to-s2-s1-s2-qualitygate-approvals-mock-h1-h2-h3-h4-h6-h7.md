---
title: "S1 → S2: QualityGate / Approvals mock 흡수 계약 보강 (H1·H2·H3·H4·H6·H7)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7"
last_verified: "2026-04-26"
service_tags: ["frontend", "api"]
decision_tags: ["mock-absorption", "contract-extension", "additive-only"]
related_pages: [".omc/plans/ralplan-quality-approvals-mock-absorption.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/shared-models.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-04-26T08:46:19.210Z","note":"Implemented additive QualityGate/Approvals contract fields H1/H2/H3/H4/H6/H7 and optional H5 targetSnapshot; updated shared/backend code, canonical docs, tests; replied to S1 via wiki/canon/work-requests/s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot.md."}]
registered_at: "2026-04-26T08:34:55.436Z"
completed_at: "2026-04-26T08:46:19.210Z"
---

# S1 → S2: QualityGate / Approvals mock 흡수 계약 보강 (H1·H2·H3·H4·H6·H7)

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## 배경 (frontend mock 흡수 cycle — 2026-04-26)

S1 lane 이 6개 mock (`AEGIS Pages/01~06`) 의 QualityGate / Approvals 페이지 정밀 분석 후 흡수 plan (`ralplan-quality-approvals-mock-absorption.md` v3) 채택. mock 의 신호 (current/threshold 정수, commit/branch identity, requestedBy, impactSummary, profileId) 가 현재 GateResult / GateRuleResult / ApprovalRequest interface 에 부재.

frontend 자가 매핑 (hardcoded threshold map, frontend-side commit/branch derive) 은 **handoff §9 회귀 패턴** — 정책을 frontend 가 결정하면 backend 변경 시 silent drift. 따라서 **계약 보강 → 자가 매핑 0** 정책으로 진행.

작업 흐름:
1. 본 WR 발행 (즉시)
2. frontend 가 hardcoded "—" placeholder + dim 상태 + cross-fetch entry point 만 박은 상태로 mock 흡수 시작 (병렬)
3. S2 회신 WR 도착 시 frontend 가 cross-fetch 활성화 + placeholder 제거

## 우선순위

| # | 항목 | 우선순위 |
|---|---|---|
| H1 | `GateRuleResult.current?: number; threshold?: number` | **HIGH** |
| H6 | `GateResult.profileId?: string` | **HIGH** (H1 페어 — cross-fetch 입력 식별자) |
| H2 | `GateResult.commit?: string` | **HIGH** |
| H7 | `GateResult.branch?: string` | **HIGH** |
| H3 | `GateResult.requestedBy?: string` | **MEDIUM** |
| H4 | `ApprovalRequest.impactSummary?: { failedRules: number; ignoredFindings: number; severityBreakdown?: Record<string, number> }` | **MEDIUM** |
| H5 | `ApprovalRequest.targetSnapshot?: { runId, commit?, branch?, profile?, action? } \| { findingId, file?, line?, severity? }` | **LOW** (Panel variant detail-pane 의 6 rows. v1 미흡수 OK) |

## acceptance

### H1 — GateRuleResult.current / threshold

- `services/api/.../models` (또는 shared types) 의 `GateRuleResult` interface 에 다음 optional 필드 추가:
  ```ts
  interface GateRuleResult {
    // 기존 필드 보존
    current?: number;       // 현재 value (e.g. 3, 9, 100)
    threshold?: number;     // policy threshold (e.g. 0, 10, 100)
    // 또는 meta wrapper:
    meta?: { current: number; threshold: number; unit?: 'count' | 'percent' };
  }
  ```
- `evidence-coverage` 계열 rule 은 `unit: 'percent'` 사용 가능 (선택). frontend 는 unit 없으면 `count` 로 처리.
- mock 출처: `01 Quality Gate.html` line ~ `.gate-rule__threshold` ("3 / 0", "9 / 10", "100% / 100%")

### H6 — GateResult.profileId

- `GateResult` interface 에 `profileId?: string` 추가 (또는 `policyProfileId`).
- frontend 는 `fetchGateProfile(gate.profileId)` cross-fetch 의 입력 식별자로 사용. 도착 전엔 cross-fetch 비활성 + threshold 영역 dim "—" placeholder.
- mock 출처: `01 Quality Gate.html` line ~ "정책 프로필 prod-strict-v3" caps-mono 표시

### H2 / H7 — GateResult.commit / branch

- `GateResult` interface 에 다음 optional 필드 추가:
  ```ts
  interface GateResult {
    commit?: string;    // git commit SHA (full or short)
    branch?: string;    // git branch name
  }
  ```
- **(중요)** Run interface (`shared/models.ts:766-778`) 에 `commit/branch` 필드 자체가 부재 — frontend cross-fetch 도 불가. **GateResult 직접 추가가 우선** (Run 확장은 lane 충돌 큼).
- mock 출처: `01 Quality Gate.html` line ~ `.gate-card__meta` ("COMMIT f8a1c3d", "BRANCH main")

### H3 — GateResult.requestedBy

- `GateResult` interface 에 `requestedBy?: string` 추가 (display name).
- ApprovalRequest 에는 이미 `requestedBy` 존재 — gate 의 requestor 와는 별개.
- mock 출처: `01 Quality Gate.html` line ~ `.gate-card__meta` ("user 김민지")

### H4 — ApprovalRequest.impactSummary

- `ApprovalRequest` interface 에 다음 optional 추가:
  ```ts
  interface ApprovalRequest {
    impactSummary?: {
      failedRules: number;        // 실패 rule 수
      ignoredFindings: number;    // 무시될 finding 수
      severityBreakdown?: Record<string, number>;  // { critical: 2, high: 5, medium: 12 }
    };
  }
  ```
- **(분리)** `gate.override` context 는 frontend 가 `gate.rules` 에서 derive 가능 → S2 backend 가 채워주지 않아도 OK. **`accepted_risk` context 만 backend 의무** (cross-fetch 만으론 derive 불가능).
- mock 출처: `03 Approvals - List.html` line ~ `.appr-detail__impact` / `05 Approvals - Panel.html` line ~ `.appr-detail-pane__impact`

### H5 — ApprovalRequest.targetSnapshot (LOW, v1 미흡수 OK)

- mock 05 의 detail-pane 6 rows (runId / commit / branch / profile / action / findingId / file / line / severity).
- v1 frontend = Panel variant detail-pane 안 placeholder ("—" dim) 로 표시. 도착 후 활성화.
- 우선순위 LOW — H1·H6·H2·H7 후 처리해도 OK.

### 공통 acceptance

- `wiki/canon/shared-models.md` §2 endpoint / interface 표 갱신 (각 필드 description 명시 — mock 출처 line 인용 권장)
- canonical envelope (`{ success, data }`) 유지
- **additive only** — 기존 필드 제거 / 시맨틱 변경 / status code 변경 금지
- 변경 후 frontend 는 본 plan §5 의 placeholder / cross-fetch fallback 으로 미공급 동안 구현 진행 → 회신 WR (S2 → S1) 도착 시 cross-fetch 활성화

## constraints

- canonical envelope (`{ success, data }`) 유지
- additive only — 기존 필드 제거 / 변경 금지
- Status code 유지
- frontend 는 미공급 동안 hardcoded fallback map **사용 안 함** (handoff §9 자가 매핑 회귀 회피). 대신 dim "—" placeholder + cross-fetch entry point 만 박아둠

## 회신 형식

S2 → S1 reply WR 에 다음 명시:
1. 변경된 interface diff (before/after)
2. shared-models.md §2 갱신 commit 링크 또는 PR 번호
3. fixture/mock data 갱신 여부 (frontend test fixture 호환성 verify)
4. 영향받는 endpoint list (e.g. `GET /api/projects/:pid/gates`, `GET /api/projects/:pid/approvals`, `GET /api/policy-profiles/:profileId`)

## 컨텍스트 (mock 출처 line 번호)

- `01 Quality Gate.html` (1409L) — `.gate-rule__threshold` "3 / 0" / "9 / 10" / "100% / 100%", `.gate-card__meta` (commit/branch/user/profile)
- `03 Approvals - List.html` (1291L) — `.appr-detail__impact` 영역
- `05 Approvals - Panel.html` (1236L) — `.appr-detail-pane__impact` 영역, `.appr-detail-pane__meta-grid` 6 rows (H5)

## plan 참조

- `.omc/plans/ralplan-quality-approvals-mock-absorption.md` v3 §6 (S2 계약 보강 항목 표 + WR 초안), §10.0 (사용자 확정 결정), §10.4 (GateProfile cross-fetch 채택)

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
