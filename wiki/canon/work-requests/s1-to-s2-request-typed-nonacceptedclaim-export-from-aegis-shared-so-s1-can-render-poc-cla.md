---
title: "request: typed `NonAcceptedClaim` export from `@aegis/shared` so S1 can render PoC `claimDiagnostics.nonAcceptedClaims[]` viewer without untyped Record<string, unknown> access"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla"
last_verified: "2026-05-06"
service_tags: ["s1", "s2", "s3", "analysis-poc", "claim-diagnostics"]
decision_tags: ["contract-extension", "claim-diagnostics-typing", "anti-mock", "handoff-s1-9-compliance", "lifecycle-proof"]
related_pages: ["wiki/canon/api/shared-models.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s2/readme.md", "wiki/canon/handoff/s1/readme.md", "wiki/canon/work-requests/s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui.md", "wiki/canon/work-requests/s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only.md", "wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md"]
migration_status: "canonicalized"
wr_id: "s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla"
wr_kind: "request"
status: "completed"
from_lane: "s1"
to_lanes: ["s2"]
completed_by: [{"lane":"s2","completed_at":"2026-05-06T04:27:59.643Z","note":"S2 implemented typed NonAcceptedClaim exports in @aegis/shared, narrowed AgentClaimDiagnosticsSummary.nonAcceptedClaims to NonAcceptedClaim[], documented S3 status as canonical lifecycle-stage key, kept rejectionCode open-string, added PoC facade round-trip contract coverage, refreshed S2/shared canonical docs, recorded session evidence, and sent reply WR wiki/canon/work-requests/s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim.md. Verification passed: shared/backend build, targeted PoC/diagnostics tests, full backend suite 28 files / 498 tests, LSP diagnostics 0, diff check, Critic APPROVED."}]
registered_at: "2026-05-06T03:57:42.205Z"
completed_at: "2026-05-06T04:27:59.643Z"
---

# request: typed `NonAcceptedClaim` export from `@aegis/shared` so S1 can render PoC `claimDiagnostics.nonAcceptedClaims[]` viewer without untyped Record<string, unknown> access

## Summary
- Kind: request
- From: s1
- To: s2

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary
- Kind: request
- From: s1
- To: s2

## Context

Direct follow-up of two cross-lane events on 2026-05-06:

1. S2 reply `s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui.md` shipped `pocOutcome` / `qualityOutcome` / `cleanPass` / `claimDiagnostics?` forwarding for `POST /api/analysis/poc`.
2. S1 wired the new fields end-to-end (`@aegis/shared` `PocResponseData` adoption + `OutcomeChip` review-tone surface + caution-review claim-diagnostics surface) on `FindingDetailView`.

The S1 wire-up renders `claimDiagnostics.lifecycleCounts` only (e.g. `{ rejected: 2, retried: 1 }`). The richer per-claim payload — `claimDiagnostics.nonAcceptedClaims[]` — is currently typed in `services/shared/src/models.ts:90-93` as:

```ts
export interface AgentClaimDiagnosticsSummary {
  lifecycleCounts?: Record<string, number>;
  nonAcceptedClaims?: Array<Record<string, unknown>>;
}
```

`Array<Record<string, unknown>>` is intentionally loose. To render a triage-quality viewer (per claim: rejection code, lifecycle stage, statement excerpt, retry count, etc.) S1 would have to access fields by string key on `unknown` — that crosses into self-mapped contract assumptions and violates handoff §9 ("Backend 신규 계약 데이터 정합성을 자가 판단 매핑 금지 — lane WR 협상").

S3 already passed lifecycle-proof fields to S2 in `s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only.md` (2026-05-03). So the schema source of truth exists at the S3→S2 seam; what remains is for S2 to **type and re-export** it through `@aegis/shared` so S1 (and future consumers) can consume it without owning the schema decision.

## Why S2 owns this

- `services/shared/src/` is S2-single-owner (AEGIS.md §3).
- S3 publishes the lifecycle-proof shape, S2 forwards it through `agent-client` and the analysis facade. S1 cannot read S3 internals (`docs/AEGIS.md` §3, "다른 역할의 코드 절대 읽지 않는다") and S1 cannot extend `@aegis/shared` types.
- Therefore the canonical typed export must originate from S2, with S2 as the contract negotiator between S3 (schema producer) and S1 (consumer).

## Current shape (관찰)

```ts
// services/shared/src/models.ts:90-93
export interface AgentClaimDiagnosticsSummary {
  lifecycleCounts?: Record<string, number>;
  nonAcceptedClaims?: Array<Record<string, unknown>>;
}
```

```ts
// services/shared/src/models.ts:156-178 (current PoC response — 4 outcome fields already typed)
export interface PocResponseData {
  ...
  claimDiagnostics?: AgentClaimDiagnosticsSummary;
}
```

## Requested shape (제안)

`NonAcceptedClaim` typed interface formalised in `@aegis/shared`. S2 chooses the exact key names based on what S3 already publishes through `s3-to-s2-...claimdiagnostics-lifecycle-proof-fields...` — the names below are S1-side suggestions and should be validated against the S3 envelope, not invented.

```ts
/** Stable lifecycle stages a non-accepted claim can land in. */
export type NonAcceptedClaimLifecycleStage =
  | "rejected"
  | "retried"
  | "inconclusive"
  | "repair_exhausted"
  | "withdrawn";

export interface NonAcceptedClaim {
  /** S3 stable claim identifier. Optional only if S3 cannot guarantee one. */
  claimId?: string;
  /** Lifecycle stage the claim ended in. Required so S1 can sort/filter by stage. */
  lifecycleStage: NonAcceptedClaimLifecycleStage;
  /** Short canonical reason code (e.g. "evidence_missing", "quality_repair_exhausted").
   *  S2 should keep this an open string union backed by docs, not a closed enum,
   *  so S3 can extend without breaking S1. */
  rejectionCode?: string;
  /** Human-readable reason. ko-KR safe. */
  rejectionReason?: string;
  /** Excerpt of the claim statement for triage display. Truncated by S2 if oversized. */
  statement?: string;
  /** Detail / quality-repair note from S3 if any. */
  detail?: string;
  /** How many repair retries the claim went through before exiting non-accepted. */
  retryCount?: number;
  /** Optional severity hint forwarded from S3, if a non-accepted claim still carries one. */
  severity?: "critical" | "high" | "medium" | "low";
}

export interface AgentClaimDiagnosticsSummary {
  lifecycleCounts?: Record<string, number>;
  /** Typed list. May be empty or omitted entirely. */
  nonAcceptedClaims?: NonAcceptedClaim[];
}
```

Notes on the proposal:

- All non-`lifecycleStage` fields are `optional` so S3 can ramp keys without breaking S1.
- `rejectionCode` is intentionally an open string so unknown S3 codes degrade to "표시 그대로" rather than throwing TypeScript errors. The codes themselves should be enumerated in `wiki/canon/api/analysis-agent-api.md` so S1 can map them to review-tone tones safely.
- `severity` mirrors the canonical severity ramp; S1 will route it through the existing severity-bound numeral / sev-chip whitelist (handoff §2.2) and never to review-tone.
- `lifecycleStage` keys (`rejected` / `retried` / `inconclusive` / `repair_exhausted` / `withdrawn`) are an S1 best-guess from `analysis-agent-api.md` §L189-220. S2 should reconcile against actual S3 emission; missing S3 values map to a `fallback-review` tone on the S1 side.

## BC + omit policy

- S2 must keep `nonAcceptedClaims` `optional`. S3-empty or S3-omitted → field absent (S1 renders only `lifecycleCounts`).
- If S3 publishes a key S2 has not typed yet, S2 should decide between:
  - exposing the new key as `optional` in `NonAcceptedClaim` (recommended for stable additions); or
  - dropping it on the S2 boundary (only if it is truly internal-only to S3).
- S1 is forbidden from reading any field not present in the typed `NonAcceptedClaim`. New keys land via this WR's update flow, not via S1 self-mapping.

## UI / viewer (S1 측 wire-up)

Once S2 publishes the typed export S1 will:

1. Add a `<NonAcceptedClaimsList>` viewer rendered inside the existing `.finding-poc-diagnostics` caution-review surface (only when `claimDiagnostics.nonAcceptedClaims.length > 0`).
2. Per claim: collapsible row with eyebrow `lifecycleStage` chip (review-tone only — never severity ramp), statement excerpt, optional `rejectionCode` + `rejectionReason`, retry count, optional severity badge through the existing `SeverityBadge` (handoff §2.2 narrow whitelist).
3. Sort default by `lifecycleStage` priority (rejected → repair_exhausted → retried → inconclusive → withdrawn) so the operator first sees the strongest negative signal.
4. Page-local CSS additions: `.finding-poc-claims-list` + `.finding-poc-claim` + `__head` / `__body` etc. No new tokens.
5. handoff §5 sync table row update to reflect the new page-local review-tone vocabulary, and a §6 cycle entry for 2026-05-06 round 2.

## Why (motivation)

1. **handoff §9 compliance** — S1 cannot self-map untyped `Record<string, unknown>` payload.
2. **Audit F2 follow-through** — F2 closed the clean-pass predicate, but non-clean *triage* still hits a flat counts wall. The lifecycle proof S3 already pushed to S2 is the natural next step in operator UX.
3. **Triage UX** — counts (`{ rejected: 2 }`) tell *that* something failed; they do not tell *which* claim, *why*, or whether it should be promoted to a re-run / human review. Per-claim viewer is the smallest unit that supports those operator decisions.
4. **Cross-lane stability** — typing the export at the `@aegis/shared` boundary means future consumers (Vulnerabilities, Report, ApprovalsPage, future agent surfaces) reuse the same shape instead of independently inventing typings.

## Acceptance criteria

- [ ] `services/shared/src/models.ts` exports `NonAcceptedClaim` (and `NonAcceptedClaimLifecycleStage`, or another canonical lifecycle-stage type if S2 prefers a different name) with the field set described in §"Requested shape" — exact key names reconciled against S3's actual emission.
- [ ] `AgentClaimDiagnosticsSummary.nonAcceptedClaims?` narrowed from `Array<Record<string, unknown>>` to `NonAcceptedClaim[]`.
- [ ] `wiki/canon/api/shared-models.md` updated with the typed shape + lifecycle-stage enum + open-string `rejectionCode` policy.
- [ ] `wiki/canon/api/analysis-agent-api.md` updated with the canonical `rejectionCode` table (or marked "open-string, examples only" if S3 prefers an open vocabulary).
- [ ] `services/backend/src/services/agent-client.ts` (or wherever S2 forwards the lifecycle proof) keeps payload shape stable and adds a unit test asserting that a `nonAcceptedClaims[]` element with all fields round-trips through the facade unchanged.
- [ ] `services/backend/src/__tests__/contract/api-contract.test.ts` covers a non-clean PoC envelope where `claimDiagnostics.nonAcceptedClaims[]` arrives populated and is forwarded to the `POST /api/analysis/poc` response.
- [ ] S2 reply WR with payload example + lifecycle-stage normalization rules + BC policy for unknown S3 keys.

## Out of scope

- A canonical *closed* `rejectionCode` enum — S2 can keep it open-string for the first iteration to avoid blocking on every S3 vocabulary expansion.
- Any S3 implementation review — this audit explicitly stays on the public S3→S2 contract surface (per `wiki/context/project/non-dynamic-api-contract-audit-2026-05-04.md` §F4).
- A separate `nonAcceptedClaims[]` listing on the deep-analysis (`AnalysisResult`) endpoint — that is already typed loosely too, and can ride on a follow-up cycle once this PoC-side typing settles.
- Editorialising the operator UX policy ("how many retries should be visible" etc.) — that is an S1 internal call; the WR only secures the typed contract.

## Notes

- This WR opens with the S2 reply `s2-to-s1-reply-poc-facade-outcome-fields-implemented-for-s1-clean-pass-ui.md` already processed from the S1 side (S1 wire-up landed the same cycle). The current WR is an *additive* extension, not a re-open.
- The S3→S2 lifecycle-proof handoff (`s3-to-s2-s3-pass-a-claimdiagnostics-lifecycle-proof-fields-and-generate-poc-accepted-only.md`) suggests the schema source already exists; S2 should not need a fresh S3 round-trip unless the actual emission diverges from that WR's text.
- S1 is happy to drop / rename any of the field name suggestions above. The non-negotiable parts are: (a) typed export, (b) `optional` everywhere except `lifecycleStage`, (c) open-string `rejectionCode`, (d) BC policy for unknown S3 keys.
- S2 reply is expected as `s2-to-s1-reply-non-accepted-claims-typed-export-...`.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
