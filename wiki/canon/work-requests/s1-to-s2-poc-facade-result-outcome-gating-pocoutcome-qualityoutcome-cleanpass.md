---
title: "request: PoC facade `/api/analysis/poc` 응답에 `pocOutcome` / `qualityOutcome` / `cleanPass` / `claimDiagnostics` 노출 — clean-pass 판별을 frontend 가 자가 매핑하지 않도록"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "services/backend/src/controllers/analysis.controller.ts"
  - "services/frontend/src/common/api/analysis.ts"
  - "wiki/canon/api/analysis-agent-api.md"
  - "wiki/canon/api/shared-models.md"
  - "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md"
  - "wiki/canon/handoff/s1/readme.md"
last_verified: "2026-05-06"
service_tags: ["s1", "s2", "s3", "analysis-poc"]
decision_tags: ["contract-extension", "result-outcome-gating", "anti-mock", "handoff-s1-9-compliance", "clean-pass-semantics"]
related_pages:
  - "wiki/canon/api/analysis-agent-api.md"
  - "wiki/canon/api/shared-models.md"
  - "wiki/canon/handoff/s2/readme.md"
  - "wiki/canon/handoff/s1/readme.md"
  - "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md"
migration_status: "canonicalized"
wr_id: "s1-to-s2-poc-facade-result-outcome-gating-pocoutcome-qualityoutcome-cleanpass"
wr_kind: "request"
status: "open"
from_lane: "s1"
to_lanes: ["s2"]
registered_at: "2026-05-06T00:00:00.000Z"
---

# request: PoC facade `/api/analysis/poc` 응답에 `pocOutcome` / `qualityOutcome` / `cleanPass` / `claimDiagnostics` 노출

## Summary
- Kind: request
- From: s1
- To: s2

## Context

`wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md` **F2** 에서 다음이 식별되었다:

> S2 backend `POST /api/analysis/poc` 가 S3 Analysis Agent `generate-poc` 를 호출한 뒤 `agentClient.isSuccess(agentResponse) && claims.length > 0` 만으로 `success: true` 를 응답한다. S3 결과 레벨의 `pocOutcome` / `qualityOutcome` / `cleanPass` / `claimDiagnostics` 는 응답에 포함되지 않는다.

증거:

- 현재 backend 컨트롤러 `services/backend/src/controllers/analysis.controller.ts:296-349` 가 `agentResponse.result.claims[0]` 의 `statement` / `detail` 만 골라 `{ findingId, poc, audit }` 로 반환.
- canonical S3 계약 `wiki/canon/api/analysis-agent-api.md`:
  - L209: `Clean deep pass = completed + analysisOutcome=accepted_claims + qualityOutcome=accepted + cleanPass=true`
  - L210: `Clean PoC pass = completed + pocOutcome=poc_accepted + qualityOutcome=accepted + cleanPass=true`
  - L348: clean/security success 는 `analysisOutcome`, `qualityOutcome`, `pocOutcome`, `cleanPass`, accepted `claims[]`, `claimDiagnostics`, `evidenceDiagnostics` 를 함께 읽어야 한다.
- frontend `services/frontend/src/common/api/analysis.ts` 의 `generatePoc()` 응답 타입 — outcome 필드 없음. UI 도 단순 `success: true` 만 신뢰 → `poc_rejected` / `poc_inconclusive` / `repair_exhausted` 가 clean success 로 오인될 수 있음.

## 왜 S2 측 변경이 필요한가

S1 lane handoff §9 ("Backend 신규 계약 데이터 정합성을 자가 판단 매핑 금지 — lane WR 협상") 에 의해 frontend 가 outcome 매핑을 자가 합성할 수 없다. S2 가 facade 응답에 outcome 필드를 노출해야 frontend OutcomeChip 의 review-tone palette (handoff §2.1) 매핑이 가능하다:

- `poc_accepted` + `qualityOutcome=accepted` + `cleanPass=true` → `positive` tone
- `poc_inconclusive` 또는 `qualityOutcome=accepted_with_caveats` → `caution-review` tone
- `poc_rejected` / `repair_exhausted` → `critical-review` tone
- `poc_not_requested` → `neutral-review` tone
- 알 수 없는 enum / 옛 결과 → `fallback-review` tone

frontend 가 이 매핑을 시드 없이 자체 합성하면 mock 잔재가 된다.

## Current shape (관찰)

```ts
// services/backend/src/controllers/analysis.controller.ts:325-338
res.json({
  success: true,
  data: {
    findingId,
    poc: {
      statement: poc.statement,
      detail: poc.detail ?? "",
    },
    audit: {
      latencyMs: agentResponse.audit.latencyMs,
      tokenUsage: agentResponse.audit.tokenUsage,
    },
  },
});
```

## Requested shape (제안)

`PocResponseData` 에 result-level outcome 필드를 추가. frontend 는 이 4필드를 read-only 로 소비.

```ts
// shared-models / dto.ts 동등 위치 (S2 가 정한 canonical 위치 사용)
export type PocOutcome =
  | "poc_accepted"
  | "poc_rejected"
  | "poc_inconclusive"
  | "poc_not_requested";

export type QualityOutcome =
  | "accepted"
  | "accepted_with_caveats"
  | "rejected"
  | "inconclusive"
  | "repair_exhausted";

export interface ClaimDiagnostic {
  /** S3 가 부여한 stable id (claim-uuid 등) */
  claimId?: string;
  /** S3 가 분류한 사유 enum (S2 통과만, frontend 는 enum 값을 그대로 표시 또는 review-tone 매핑) */
  code: string;
  /** 사람이 읽을 수 있는 진단 메시지. 한글/영문 둘 다 안전 */
  message: string;
}

export interface PocResponseData {
  findingId: string;
  poc: { statement: string; detail: string };
  audit: { latencyMs: number; tokenUsage?: { prompt: number; completion: number } };

  // ── 신규 (canonical S3 result outcomes 1:1 forward) ──
  /** S3 result.pocOutcome. completed 가 곧 clean 이 아님을 알리기 위해 필수 노출 */
  pocOutcome: PocOutcome;
  /** S3 result.qualityOutcome */
  qualityOutcome: QualityOutcome;
  /** S3 result.cleanPass — strict clean evaluation pass 여부 */
  cleanPass: boolean;
  /** S3 result.claimDiagnostics — 비어있을 수 있음 */
  claimDiagnostics?: ClaimDiagnostic[];
}
```

backend 응답:

```ts
res.json({
  success: true,
  data: {
    findingId,
    poc: { statement: poc.statement, detail: poc.detail ?? "" },
    audit: { latencyMs, tokenUsage },
    pocOutcome: agentResponse.result.pocOutcome,
    qualityOutcome: agentResponse.result.qualityOutcome,
    cleanPass: agentResponse.result.cleanPass,
    claimDiagnostics: agentResponse.result.claimDiagnostics,
  },
});
```

`success: true` 의미는 **transport-level envelope success** 로 유지 — non-clean PoC (rejected / inconclusive / repair_exhausted) 도 envelope 는 200 OK + `success: true`. clean-vs-non-clean 판별은 위 4필드로 이뤄짐. 본 의미를 `wiki/canon/api/shared-models.md` PoC 절에 명시.

## UI / sort 영향 (S1 측 wire-up)

S2 가 outcome 필드를 공급하면 S1 은 다음과 같이 wire-up 한다 (별도 reply WR 로 보고):

1. `services/frontend/src/common/api/analysis.ts` 의 `generatePoc` 응답 타입에 4필드 추가
2. `pages/ReportPage` / PoC 결과 표시 surface 에 `<OutcomeChip>` 추가 — `pocOutcome` + `qualityOutcome` + `cleanPass` 를 review-tone palette 로 매핑 (handoff §2.1)
3. non-clean PoC 의 경우 `claimDiagnostics[]` 를 caution-review surface 에 dim 으로 노출
4. 기존 `success: true` 만 보고 clean 이라 가정하던 표시 영역을 outcome-aware 분기로 전환

## Why (motivation)

1. **정합성** — S3 canonical 계약은 "completed ≠ clean" 을 명시한다 (analysis-agent-api §L209-210). S2 facade 가 이걸 그대로 전달하지 않으면 frontend 가 clean 을 잘못 표시한다.
2. **handoff §9 compliance** — S1 이 outcome 을 자가 합성하면 mock 패턴 위반.
3. **handoff §2.1 review-tone palette** — clean / caveat / rejected / inconclusive 를 시각 어휘로 분리하려면 backend 에서 enum 이 와야 한다.
4. **2026-05-04 audit F2 직접 후속**.

## Acceptance criteria

- [ ] `POST /api/analysis/poc` 응답 `data` 에 `pocOutcome`, `qualityOutcome`, `cleanPass`, `claimDiagnostics?` 필드 추가 (S3 result outcomes 1:1 forward)
- [ ] `services/shared/src/dto.ts` 의 `PocResponseData` (또는 동등 타입) 에 4필드 정식 추가, `services/shared` 빌드 PASS
- [ ] `wiki/canon/api/shared-models.md` 의 PoC 응답 절에 4필드 명세 추가 + `success: true` 가 transport-level 의미임을 명시
- [ ] `wiki/canon/api/analysis-agent-api.md` 의 PoC outcome 표 (L189-210) 와 S2 facade 매핑 표가 1:1 매칭
- [ ] `services/backend/src/controllers/analysis.controller.ts` 의 PoC 컨트롤러가 `claims.length === 0` early-return 분기에서도 outcome 필드를 forward (S3 가 claim 0 + non-`poc_not_requested` 를 반환하는 경우 frontend 가 caveat/rejected 를 표시할 수 있어야 함)
- [ ] backend 측 단위 테스트 추가: `pocOutcome` / `qualityOutcome` / `cleanPass` 가 S3 응답에서 컨트롤러 응답으로 forward 되는 지 + non-clean envelope 도 200 + `success: true` 가 유지되는 지
- [ ] S2 reply WR 발행 — payload 예시 + 4필드 enum 값 매핑 + S3 측 신규 enum 추가 시의 BC 정책 명시

## Out of scope

- S3 측 outcome enum 자체 확장 / 변경 — 본 WR 에서 다루지 않음 (S3 가 이미 canonical 정의 보유)
- PoC 입력 측 contract — `findingId`/`projectId` 변경 없음
- WS streaming PoC — 현재 facade 는 단발 동기 호출. WS PoC 가 도입되면 별 cycle 에서 동일 outcome forward 적용 협상

## Notes

- 본 WR 발행과 동시에 S1 lane 은 `generatePoc()` 응답 처리 영역에서 outcome 매핑이 도착할 때까지 PoC 결과 자체는 dim 으로 표시 (clean-vs-non-clean 합성 자가매핑 0 유지). S2 회신 도착 후 OutcomeChip 와이어업.
- S2 reply 는 `s2-to-s1-reply-poc-facade-result-outcome-gating-...` 형태로 회신 부탁.
- 본 WR 은 2026-05-04 non-dynamic full-pipeline contract audit (F2) 의 직접 후속이며, 같은 audit 의 F1 (Git clone body mismatch — frontend `cloneSource` 의 `{url}` → `{gitUrl}`) 은 S1 단독 lane-local 작업으로 동일 cycle 내 처리 완료 (frontend `services/frontend/src/common/api/source.ts:80` + `services/frontend/src/common/api/client.test.ts` cloneSource 회귀 테스트 2건).
