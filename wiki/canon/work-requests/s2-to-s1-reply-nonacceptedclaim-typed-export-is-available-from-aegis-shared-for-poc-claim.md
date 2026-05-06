---
title: "reply: NonAcceptedClaim typed export is available from @aegis/shared for PoC claimDiagnostics viewer"
page_type: "canonical-work-request"
canonical: true
source_repo: "AEGIS"
source_refs:
  - "mcp://register_wr"
original_path: "mcp://register_wr/s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim"
last_verified: "2026-05-06"
service_tags: ["s1", "s2", "s3", "analysis-poc", "claim-diagnostics"]
decision_tags: ["contract-extension", "claim-diagnostics-typing", "nonacceptedclaim", "handoff-s1-9-compliance", "lifecycle-proof"]
related_pages: ["wiki/canon/work-requests/s1-to-s2-request-typed-nonacceptedclaim-export-from-aegis-shared-so-s1-can-render-poc-cla.md", "wiki/canon/api/shared-models.md", "wiki/canon/api/analysis-agent-api.md", "wiki/canon/handoff/s2/session-omx-1778037641464-duha0m-nonacceptedclaim-20260506.md"]
migration_status: "canonicalized"
wr_id: "s2-to-s1-reply-nonacceptedclaim-typed-export-is-available-from-aegis-shared-for-poc-claim"
wr_kind: "reply"
status: "completed"
from_lane: "s2"
to_lanes: ["s1"]
completed_by: [{"lane":"s1","completed_at":"2026-05-06T05:52:51.922Z","note":"S1 wire-up complete: NonAcceptedClaimsList component built at services/frontend/src/common/ui/findings/NonAcceptedClaimsList.tsx — collapsible per-claim viewer rendered inside existing .finding-poc-diagnostics caution-review surface, gated on claimDiagnostics?.nonAcceptedClaims?.length > 0. Status field used as canonical lifecycle-stage key (no synthesized lifecycleStage alias). Status→review-tone mapping: rejected/repair_exhausted=critical-review, under_evidenced/needs_human_review/retried/inconclusive/candidate=caution-review, withdrawn=neutral-review, unknown=fallback-review (never success). Sort priority: rejected → repair_exhausted → needs_human_review → under_evidenced → retried → inconclusive → candidate → withdrawn, secondary by retryCount desc. Severity uses SeverityBadge (handoff §2.2 sev-chip whitelist). Evidence breakdown shows requiredEvidence with present/missing dim coloring (canonical --success/--warning, no severity ramp). Page-local CSS .finding-poc-claim* added — only canonical tokens (--surface-sunken / --border-subtle / --space-* / --text-* / --foreground-muted / --primary outline). Verification: 677 frontend tests PASS / 99 files (baseline 670 +7 new — sortClaims + statusToReviewTone + render + expand), typecheck PASS, vite build PASS. Page CSS lint grep clean."}]
registered_at: "2026-05-06T04:27:28.321Z"
completed_at: "2026-05-06T05:52:51.922Z"
---

# reply: NonAcceptedClaim typed export is available from @aegis/shared for PoC claimDiagnostics viewer

## Summary
- Kind: reply
- From: s2
- To: s1

## Context
- Canonical WR generated through the WR MCP surface.

## Request
## Summary

S2 completed the S1 request for a typed `NonAcceptedClaim` export through `@aegis/shared`.

## Implemented contract

`services/shared/src/models.ts` now exports:

- `NonAcceptedClaimLifecycleStage`
- `NonAcceptedClaimOutcomeContribution`
- `NonAcceptedClaimEvidenceTrailEntry`
- `NonAcceptedClaimRevisionHistoryEntry`
- `NonAcceptedClaim`

`AgentClaimDiagnosticsSummary.nonAcceptedClaims?` is now narrowed from `Array<Record<string, unknown>>` to `NonAcceptedClaim[]`.

Because `services/shared/src/index.ts` already exports `./models`, S1 can import these from `@aegis/shared` without a new barrel change.

## Lifecycle-stage normalization rule

S2 reconciled S1's proposed `lifecycleStage` name against the S3 public wire contract and kept the S3 key:

```ts
interface NonAcceptedClaim {
  status: NonAcceptedClaimLifecycleStage | (string & {});
  // optional diagnostic fields...
}
```

So S1 should treat `nonAcceptedClaim.status` as the lifecycle-stage field for sorting/filtering. S2 does not synthesize a second `lifecycleStage` alias on the `POST /api/analysis/poc` facade.

Documented lifecycle examples:

- `candidate`
- `under_evidenced`
- `needs_human_review`
- `rejected`
- `retried`
- `inconclusive`
- `repair_exhausted`
- `withdrawn`

Unknown future `status` strings are forward-compatible diagnostics and should fall back to review/fallback presentation, never success.

## `rejectionCode` policy

`rejectionCode?: string` is intentionally open-string and optional. Current examples in `wiki/canon/api/analysis-agent-api.md` are examples only, not a closed enum:

- `evidence_missing`
- `rejected_unsupported`
- `quality_repair_exhausted`
- `unsafe_or_out_of_scope`

S1 may display unknown codes as raw diagnostic text/fallback review tone, but should not branch to success on unknown values.

## PoC facade forwarding behavior

`POST /api/analysis/poc` forwards `result.claimDiagnostics` unchanged from the S3 completed envelope into `PocResponseData.claimDiagnostics`.

Representative payload shape:

```json
{
  "success": true,
  "data": {
    "findingId": "finding-poc-non-clean",
    "poc": { "statement": "", "detail": "" },
    "pocOutcome": "poc_inconclusive",
    "qualityOutcome": "repair_exhausted",
    "cleanPass": false,
    "claimDiagnostics": {
      "lifecycleCounts": { "under_evidenced": 1, "rejected": 1 },
      "nonAcceptedClaims": [
        {
          "claimId": "claim-0",
          "status": "under_evidenced",
          "family": "command_injection",
          "primaryLocation": "src/main.c:42",
          "rejectionCode": "evidence_missing",
          "rejectionReason": "missing required sink evidence",
          "statement": "user-controlled input reaches system",
          "detail": "repair could not ground the command sink",
          "retryCount": 2,
          "severity": "high",
          "requiredEvidence": ["local_or_derived_support", "sink_or_dangerous_api"],
          "presentEvidence": ["local_or_derived_support"],
          "missingEvidence": ["sink_or_dangerous_api"],
          "evidenceTrail": [{ "evidenceRef": "eref-1", "role": "local_or_derived_support", "status": "present" }],
          "revisionHistory": [{ "fromStatus": "candidate", "toStatus": "under_evidenced", "reason": "missing:sink_or_dangerous_api", "timestampMs": 1710000000000 }],
          "invalidRefs": ["eref-hallucinated"],
          "supportingEvidenceRefs": ["eref-1"],
          "outcomeContribution": "no_accepted_claims"
        }
      ]
    }
  }
}
```

## BC / unknown-key policy

- `nonAcceptedClaims` remains optional.
- Empty/omitted S3 diagnostics remain empty/omitted on S2 responses.
- S2 forwards currently typed stable keys unchanged.
- If S3 adds a new stable per-claim key that S1 needs, route it through S2/shared-models update + WR reply before S1 consumes it.
- S2 does not runtime-drop unknown JSON keys from S3 today, but S1 is only authorized to read typed `NonAcceptedClaim` fields.
- S2 now validates this optional diagnostics object at S2 boundaries: malformed new persisted diagnostics are rejected, malformed stored/manual diagnostics are omitted, and malformed optional PoC facade diagnostics are omitted rather than exposed as untyped records. Valid objects still preserve unknown/additive JSON keys at runtime, but S1 should only read typed fields.

## Verification

- `npm run build --workspace @aegis/shared` — PASS
- `npm run build --workspace @aegis/backend` — PASS
- `cd services/backend && npx vitest run src/__tests__/contract/api-contract.test.ts --testNamePattern "analysis/poc|PoC|diagnostics"` — PASS, 4 tests
- `npm test --workspace @aegis/backend` — PASS, 28 files / 498 tests
- LSP diagnostics on affected TS files — 0 errors
- `git diff --check` on changed S2 code/wiki files — PASS
- Critic verification — APPROVED

## Changed docs

- `wiki/canon/api/shared-models.md`
- `wiki/canon/api/analysis-agent-api.md`
- `wiki/canon/handoff/s2/readme.md`
- `wiki/canon/handoff/s2/architecture.md`
- `wiki/canon/handoff/s2/api-endpoints.md`

## Completion expectation

S1 can now wire the PoC claim-diagnostics viewer against `@aegis/shared` typed exports without untyped `Record<string, unknown>` access.

## Completion expectation
- Recipient-side handling should be tracked through `complete_wr`.
- Runtime WR semantics apply only to canonical WR pages under `wiki/canon/work-requests/**`.

## Notes
- Archived WR files under `docs/work-requests/` are out-of-scope runtime inputs.
