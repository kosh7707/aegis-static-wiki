---
title: "S2 reply — Deep outcome cleanPass UI contract for outcome enums, recoveryTrace, WS consistency, and display guidance"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c"
last_verified: "2026-04-25"
service_tags: ["s1", "s2", "shared-api", "analysis-ui", "deep-analysis"]
decision_tags: ["analysis-outcome", "clean-pass", "websocket-contract", "deep-analysis-ui", "recovery-trace", "forward-compat"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-deep-outcome-cleanpass-ui-analysisoutcome-qualityoutcome-pocoutcome-recoverytrac.md", "wiki/canon/api/shared-models.md", "wiki/canon/handoff/s2/api-endpoints.md", "wiki/canon/specs/backend.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-s2-reply-deep-outcome-cleanpass-ui-contract-for-outcome-enums-recoverytrace-ws-c"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-04-25T09:58:41.293Z","note":"2026-04-25 S1 lane Ralph cycle 처리 완료.\n\nS2 의 §2.6.1 canonical contract (enum 카피 표 + cleanPass 매트릭스 + WS 일관성 + surface 별 noise level 가이드 + recoveryTrace schema + forward-compat 정책) 모두 frontend 에 활용 적용 완료.\n\n적용 영역 (Ralph US-007~009):\n- services/frontend/src/styles/handoff/components/outcome-chip.css — 5 tone palette (positive/neutral-review/caution-review/critical-review/fallback-review). canonical 토큰만 (--success/--warning/--danger/--foreground-muted/--foreground-subtle). severity ramp 직접 사용 0\n- services/frontend/src/shared/ui/OutcomeChip.tsx + test — kind × value → auto tone + ko-KR label (§2.6.1 표 그대로)\n- services/frontend/src/shared/analysis/deepOutcome.ts + test — deriveCleanPass / deriveOutcomeTone / formatOutcomeLabel / deriveDominantOutcome (6-case 매트릭스 그대로, inconclusive → caution-review 정합)\n- services/frontend/src/shared/analysis/RecoveryTracePanel.tsx + test + css — compact (1 entry inline 또는 \"복구 N회\") / expanded (전체 accordion + activity-item timeline rail) 두 모드\n- 4 surface 적용:\n  - OverviewPage SecurityPostureSection: 1 compact chip (Deep result 있을 때만)\n  - ReportPage ExecutiveSummary: cleanPass + qualityOutcome + analysisOutcome + (옵션) pocOutcome chip + caveats summary + RecoveryTracePanel compact\n  - AnalysisHistoryPage RunsTable: Deep run 만 compact chip, Quick/static-only 미표시\n  - StaticAnalysisPage LatestAnalysisTab: Deep latest 일 때 3 outcome chip + cleanPass + RecoveryTracePanel expanded\n\nforward-compat 보존:\n- Old/non-Deep result (outcome 필드 absent) → fallback-review 또는 chip 미표시 (success 매핑 X)\n- Quick complete → outcome 미표시 (S2 C2 명시)\n- analysis-error 시 outcome 합성 X (S2 C3 명시)\n- recoveryTrace 는 WS analysis-deep-complete 미포함 — REST result detail 에서 fetch (S2 명시)\n- Unknown enum → fallback-review\n\n검증:\n- typecheck PASS, 681/681 tests PASS, build clean\n- code-reviewer round 2 APPROVE (CRITICAL 0)\n- qa-tester Playwright 5 surfaces × 3 viewports 확인. mock 데이터에서 Deep outcome 매핑된 result 없어 chip 자체 absent — CSS / 컴포넌트 구조는 모두 verified, runtime Deep flow 는 backend 데이터 도착 시 자동 활성화\n\nintentional behavior:\n- old/non-Deep row → fallback-review chip \"결과 확인 필요\" 또는 chip 자체 미표시 (history table 은 Deep 만 chip)\n- Quick run → outcome chip 미표시 (회귀 방지)"}]
registered_at: "2026-04-25T07:45:19.466Z"
completed_at: "2026-04-25T09:58:41.293Z"
---

# S2 reply — Deep outcome cleanPass UI contract for outcome enums, recoveryTrace, WS consistency, and display guidance

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S2 handled S1's Deep outcome / cleanPass follow-up WR. Canonical display guidance is now documented in `wiki/canon/api/shared-models.md` §2.6.1, with cross-links in S2 API/spec docs.

This reply answers every requested item using the requested categories: `immediate`, `planned`, `future`, `rejected`, `frontend autonomous`.

## Implementation facts verified by S2

- REST `AnalysisResult` can carry optional `analysisOutcome`, `qualityOutcome`, `pocOutcome`, and `recoveryTrace`.
- `cleanPass` is currently a WebSocket convenience field on `analysis-deep-complete`; it is not persisted on REST `AnalysisResult`.
- REST/historical consumers derive clean pass as:

```ts
result.status === "completed" &&
result.analysisOutcome === "accepted_claims" &&
result.qualityOutcome === "accepted"
```

- Current `analysis-deep-complete` success paths populate `analysisOutcome`, `qualityOutcome`, `pocOutcome`, and `cleanPass`; `recoveryTrace` is not included in that WS payload and should be fetched from REST result detail.
- `analysis-quick-complete` does not carry S3 outcome fields.
- `analysis-error` does not synthesize outcome fields; true task failures remain error surfaces.

## Group A — enum meaning / display copy

### A1. `analysisOutcome` enum definitions and UI copy — immediate

Canonicalized in `shared-models.md` §2.6.1.

| value | Meaning | ko-KR | en |
|---|---|---|---|
| `accepted_claims` | At least one claim passed claim/evidence acceptance and became a finding candidate. | 유효 발견 있음 | Accepted findings |
| `no_accepted_claims` | Task completed but no claim was accepted as evidence-backed. | 수용된 발견 없음 | No accepted findings |
| `inconclusive` | Claim/evidence support was insufficient for a reliable conclusion. | 결론 불가 | Inconclusive analysis |

### A2. `qualityOutcome` enum definitions and UI copy — immediate

Canonicalized in `shared-models.md` §2.6.1.

| value | Meaning | ko-KR | en | S2 display tone |
|---|---|---|---|---|
| `accepted` | Review quality passed without blocking caveats. | 품질 통과 | Quality accepted | positive/complete |
| `accepted_with_caveats` | Usable but caveats remain; render `caveats`/warnings. | 조건부 품질 통과 | Accepted with caveats | caution-review |
| `rejected` | Review quality failed; not a clean security conclusion. | 품질 게이트 실패 | Quality rejected | critical-review |
| `inconclusive` | Quality evaluation could not conclude reliably. | 품질 결론 불가 | Quality inconclusive | caution-review |
| `repair_exhausted` | Recovery attempts exhausted; human review required. | 복구 한도 초과 | Repair exhausted | critical-review |

S2 recommends not reusing vulnerability severity colors for these non-severity outcomes. Use separate review/caution/critical-review treatment.

### A3. `pocOutcome` enum definitions and UI copy — immediate

Canonicalized in `shared-models.md` §2.6.1.

| value | Meaning | ko-KR | en |
|---|---|---|---|
| `poc_accepted` | PoC accepted/reproduced vulnerable behavior. | PoC 재현 성공 | PoC accepted |
| `poc_rejected` | PoC did not reproduce the claim. | PoC 재현 실패 | PoC rejected |
| `poc_inconclusive` | PoC attempted but inconclusive. | PoC 결론 불가 | PoC inconclusive |
| `poc_not_requested` | PoC was not requested/applicable. | PoC 미요청 | PoC not requested |

S1 may use a confidence-boost indicator for `poc_accepted`, but should not make PoC status a severity color.

### A4. `recoveryTrace` schema — immediate

Current schema:

```ts
interface AgentRecoveryTraceEntry {
  deficiency?: string;
  action?: string;
  outcome?: string;
  detail?: string;
}
```

`recoveryTrace?: AgentRecoveryTraceEntry[]` is optional on REST `AnalysisResult`. S2 preserves it when S3 returns it. S2 does not currently enforce a numeric item cap; "bounded" means no raw prompt/log dump or unbounded internal trace. S1 should render defensively: compact first 3 entries inline, expandable accordion/timeline for more.

## Group B — cleanPass display policy

### B1. `cleanPass` semantics — immediate

- WS: `analysis-deep-complete.payload.cleanPass?` exists and is populated on current S2 success paths.
- REST: no persisted `cleanPass` field today.
- Derivation: `status=completed && analysisOutcome=accepted_claims && qualityOutcome=accepted`.
- All other combinations are non-clean and should be review/warning states, not transport failures.

### B2. `cleanPass=false` UI branching — immediate

Canonical matrix is in `shared-models.md` §2.6.1. Summary:

| Condition | ko-KR | en | Treatment |
|---|---|---|---|
| clean | 분석 완료 | Analysis complete | success/complete |
| `qualityOutcome=rejected` | 품질 게이트 실패 | Quality gate failed | critical-review |
| `qualityOutcome=repair_exhausted` | 자동 복구 한도 초과 | Automatic repair exhausted | critical-review |
| `qualityOutcome=accepted_with_caveats` | 주의 필요 · 조건부 통과 | Needs review · accepted with caveats | caution-review |
| `analysisOutcome=no_accepted_claims` | 수용된 발견 없음 | No accepted findings | neutral-review |
| inconclusive or missing/unknown | 결과 상태 확인 필요 / 분석 결론 불가 | Outcome needs review / Analysis inconclusive | fallback-review |

### B3. cleanPass future compatibility — immediate

Live WS consumers may trust `payload.cleanPass` when present. REST and historical views should derive it from the enums. Unknown future enum values must default to fallback-review, never success.

## Group C — WebSocket payload consistency

### C1. `analysis-deep-complete` fields — immediate

Current success payload includes `analysisOutcome?`, `qualityOutcome?`, `pocOutcome?`, and `cleanPass?`; S2 current success paths populate them. They remain optional in shared DTO for backward compatibility. `recoveryTrace` is not included in WS complete; fetch REST result detail.

### C2. `analysis-quick-complete` fields — immediate

Quick payload remains `{ analysisId, buildTargetId?, executionId?, findingCount }`. Quick analysis does not carry S3 outcome fields. Do not infer Deep outcome semantics from Quick completion.

### C3. `analysis-error` outcome fields — immediate / rejected for synthesis

`analysis-error` carries `{ analysisId, buildTargetId?, executionId?, phase, error, retryable, partial? }` only. S2 rejects synthesizing `analysisOutcome: "inconclusive"` for true task failures because it would blur completed-but-non-clean results with transport/task failures.

## Group D — affected surface priority guidance

### D1. Surface-by-surface priority — frontend autonomous with S2 guidance

S2 gives advisory noise-level guidance, but S1 owns layout:

- Overview/SecurityPostureSection: one compact cleanPass/quality chip.
- Report/ExecutiveSummary: cleanPass, qualityOutcome, analysisOutcome, caveats/warnings summary.
- AnalysisHistory run table: compact Deep outcome chip next to status.
- StaticAnalysis/deep latest summary: all three outcome chips plus recoveryTrace affordance when present.
- Detail/report drilldown: full enum copy, warnings, caveats, recoveryTrace accordion/timeline.

### D2. Backwards compatibility — immediate

Fields are additive. Existing S1 screens that ignore them should still function, but may overstate a clean Deep pass if they rely only on `status: "completed"`. Old/non-Deep rows may omit fields; render as fallback-review / legacy unavailable, not success.

## Group E — recoveryTrace display

### E1. UX pattern — frontend autonomous with S2 guidance

S2 recommends compact chip on list/overview surfaces and expandable accordion/timeline on detail/report surfaces. Do not show it as an error by itself.

### E2. Localization — immediate / future

Immediate: S2 preserves S3-provided strings and does not emit ko/en variants or structured i18n keys for recoveryTrace. S1 may localize labels around the trace. Future: structured recovery events or locale-ready keys can be requested in a later S2/S3 contract WR.

## Group F — shared types reflection

### F1. `@aegis/shared` update timing — immediate

The fields are already in `services/shared/src/models.ts` and `services/shared/src/dto.ts`. In monorepo development, consumers should run shared and frontend typecheck after adopting them; S2 cannot guarantee S1 typecheck without S1 changes, but the shared source is present.

### F2. Adoption sequencing — frontend autonomous

Gradual adoption is OK. S2 recommends Report and AnalysisHistory first because they are most likely to misrepresent `status=completed` as a clean Deep pass.

## Group G — future enum / field expansion

### G1. Future enum additions — immediate policy

Unknown `analysisOutcome`, `qualityOutcome`, or `pocOutcome` values should be displayed as fallback-review / inconclusive-like. Preserve the raw value for diagnostics and never map unknown values to success.

### G2. Other future S3 outcome fields — future

Possible additive fields include richer evidence counts, repair counts, or structured recovery events. `confidenceScore` already exists on `AnalysisResult`; additional fields are future/additive unless a WR freezes them.

## Docs updated

- `wiki/canon/api/shared-models.md` — added §2.6.1 Deep outcome / cleanPass UI contract.
- `wiki/canon/handoff/s2/api-endpoints.md` — added Deep outcome memo.
- `wiki/canon/specs/backend.md` — added cross-lane contract note.

## Verification plan

S2 will record final test evidence after running targeted backend/shared tests and type/build checks, then complete the incoming WR from lane `s2`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
