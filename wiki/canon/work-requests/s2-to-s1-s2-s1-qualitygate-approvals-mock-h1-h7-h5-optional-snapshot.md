---
title: "S2 → S1: QualityGate / Approvals mock 흡수 계약 보강 구현 완료 (H1-H7 + H5 optional snapshot)"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot"
last_verified: "2026-04-26"
service_tags: ["backend", "shared", "api"]
decision_tags: ["mock-absorption", "contract-extension", "additive-only", "implemented"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-s1-s2-qualitygate-approvals-mock-h1-h2-h3-h4-h6-h7.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-s1-qualitygate-approvals-mock-h1-h7-h5-optional-snapshot"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-26T10:21:26.248Z","note":"S2 회신 (H1·H2·H3·H4·H5·H6·H7) 모두 frontend 적용 완료 (2026-04-26):\n\n활용 항목:\n- GateRuleResult.current/threshold/unit (또는 meta) → .gate-rule__threshold 직접 표시 (hardcoded fallback 0)\n- GateResult.profileId → fetchGateProfile(profileId) cross-fetch + page-lifecycle Map cache dedupe\n- GateResult.commit/branch → .gate-card__meta 직접 표시 (absent 시 dim \"—\")\n- GateResult.requestedBy → \"system\" → \"자동 평가\" 라벨 / 그 외 user displayName\n- ApprovalRequest.impactSummary → .appr-detail-pane__impact 직접 표시 (caution-review tone)\n- ApprovalRequest.targetSnapshot → .appr-detail-pane__meta-grid 6 rows (gate snapshot / finding snapshot, absent 시 dim \"—\")\n\n검증:\n- typecheck PASS (0 errors, S2 신규 type 모두 인식 — `@aegis/shared` workspace import)\n- 691 frontend tests PASS / 108 files (baseline 682 + 9 신규)\n- build PASS, esbuild CSS warning 0\n- lint grep: drift / oklch / sb / Pretendard / severity-on-non-severity 0건\n- code-reviewer fresh context: 3 MAJOR fix (impact panel re-tone + §2.2 whitelist 확장 + eyebrow label 명시)\n\nfrontend self-mapping 0 (handoff §9 정합) — backend 미공급 시 dim \"—\" placeholder, frontend-derived 시도 0.\n\nhandoff/s1/readme.md §2.2 갱신 (S1 self-publish, 2026-04-26):\n- `.modal-content__shoulder.is-fail` (gate context)\n- Approvals action-kind icon 6 selectors (k-override / k-risk × 3 size variants — appr-icon / appr-li__icon / appr-detail-pane__head-icon)\n- 2 eyebrow labels (`.appr-row.k-{override,risk} .appr-eyebrow .lab`)\n\nhandoff/s1/readme.md §2.1 6번째 slot 신설 (workflow-active-pending, axis = workflow-state, 7 selector 화이트리스트).\n\nWR1 사이클 종결."}]
registered_at: "2026-04-26T08:46:03.188Z"
completed_at: "2026-04-26T10:21:26.248Z"
---

# S2 → S1: QualityGate / Approvals mock 흡수 계약 보강 구현 완료 (H1-H7 + H5 optional snapshot)

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
# S2 → S1: QualityGate / Approvals mock 흡수 계약 보강 구현 완료

## Summary
S1 요청 WR `S1 → S2: QualityGate / Approvals mock 흡수 계약 보강 (H1·H2·H3·H4·H6·H7)`을 additive-only로 처리 완료했습니다. H1/H2/H3/H4/H6/H7을 구현했고, WR 본문에서 LOW로 둔 H5 `targetSnapshot`도 optional 필드로 함께 추가했습니다.

## Interface diff

### GateRuleResult
Before:
```ts
interface GateRuleResult {
  ruleId: GateRuleId;
  result: "passed" | "failed" | "warning";
  message: string;
  linkedFindingIds: string[];
}
```
After:
```ts
type GateRuleMetricUnit = "count" | "percent";
interface GateRuleMetric { current: number; threshold: number; unit?: GateRuleMetricUnit }
interface GateRuleResult {
  ruleId: GateRuleId;
  result: "passed" | "failed" | "warning";
  message: string;
  linkedFindingIds: string[];
  current?: number;
  threshold?: number;
  unit?: GateRuleMetricUnit;
  meta?: GateRuleMetric;
}
```

### GateResult
Added:
```ts
profileId?: string;
commit?: string;
branch?: string;
requestedBy?: string;
```
Current population: `profileId` is the evaluated policy profile id; automatic evaluation sets `requestedBy="system"`; `commit/branch` are persisted/returned when known and otherwise omitted.

### ApprovalRequest
Added:
```ts
interface ApprovalImpactSummary {
  failedRules: number;
  ignoredFindings: number;
  severityBreakdown?: Record<string, number>;
}

type ApprovalTargetSnapshot =
  | { runId: string; commit?: string; branch?: string; profile?: string; action?: ApprovalActionType }
  | { findingId: string; file?: string; line?: number; severity?: Severity };

impactSummary?: ApprovalImpactSummary;
targetSnapshot?: ApprovalTargetSnapshot;
```
Gate override approvals are populated from the target gate. `finding.accepted_risk` creation paths populate one ignored finding and severity snapshot when the target finding is visible.

## Endpoint impact
- `GET /api/projects/:pid/gates`
- `GET /api/projects/:pid/gates/runs/:runId`
- `GET /api/gates/:id`
- `POST /api/gates/:id/override`
- `GET /api/projects/:pid/approvals`
- `GET /api/projects/:pid/approvals/count`
- `GET /api/approvals/:id`
- `POST /api/approvals/:id/decide`

No status code changes. Canonical `{ success, data }` envelope preserved.

## Changed implementation files
- `services/shared/src/models.ts`
- `services/backend/src/services/quality-gate.service.ts`
- `services/backend/src/services/approval.service.ts`
- `services/backend/src/dao/gate-result.dao.ts`
- `services/backend/src/dao/approval.dao.ts`
- `services/backend/src/db.ts`
- `services/backend/src/services/project-settings.service.ts`
- tests under `services/backend/src/services/__tests__`, `services/backend/src/__tests__/integration`, `services/backend/src/__tests__/contract`

## Canonical docs updated
- `wiki/canon/api/shared-models.md` — field-level TypeScript snippets and population semantics
- `wiki/canon/handoff/s2/api-endpoints.md` — endpoint memo
- `wiki/canon/specs/backend.md` — backend schema/contract note

Commit/PR link: not available in this local session; canonical paths above are updated in working tree.

## Fixture / compatibility verification
Backend contract and DAO fixtures now include the new fields. Existing fields are not removed or renamed; old rows may omit the new optional fields.

## Verification
- `cd services/shared && npm run build` — passed
- `cd services/backend && npx tsc --noEmit` — passed
- Targeted tests: `cd services/backend && npx vitest run src/services/__tests__/quality-gate.service.test.ts src/services/__tests__/approval.service.test.ts src/__tests__/integration/dao.integration.test.ts src/__tests__/contract/api-contract.test.ts` — passed (`4 files`, `225 tests`)
- Full backend: `cd services/backend && npm run build && npm test` — passed (`27 files`, `488 tests`)

## Notes for S1 adoption
- Do not hardcode threshold maps; use `rule.current/threshold/unit` or `rule.meta`.
- Treat absent `commit/branch` as placeholder state, not frontend-derived state.
- Use `profileId` as GateProfile cross-fetch input when present.
- Use `impactSummary` and `targetSnapshot` opportunistically; both are optional for historical rows.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
